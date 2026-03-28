import { db } from "./config";
import { 
  collection, 
  query, 
  where, 
  getCountFromServer
} from "firebase/firestore";

export interface AnalyticsSummary {
  totalDrafts: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  published: number;
  platformDistribution: {
    linkedin: number;
    twitter: number;
    email: number;
  };
}

/**
 * Fetch a summary of content metrics for the user
 */
export async function getAnalyticsSummary(userEmail: string, role?: string): Promise<AnalyticsSummary> {
  try {
    const isManager = role === "manager";
    const draftsRef = collection(db, "drafts");
    const publishedRef = collection(db, "published_content");

    // Helper to build queries that are either filtered or global
    const buildQuery = (coll: any, constraints: any[] = []) => {
      // Handle potential field name typos (authorEmail vs uthorEmail) 
      // Note: Firestore 'in' queries can only have 1 array-based check per query, 
      // so we use camelCase as the primary and others as secondary if needed.
      const baseConstraints = isManager ? [] : [where("authorEmail", "==", userEmail)];
      return query(coll, ...baseConstraints, ...constraints);
    };

    // 1. Get counts from 'drafts' collection
    const totalQuery = buildQuery(draftsRef);
    const pendingQuery = buildQuery(draftsRef, [where("status", "in", ["pending review", "Pending Review", "pending", "Pending"])]);
    const approvedQuery = buildQuery(draftsRef, [where("status", "in", ["approved", "Approved", "approve", "Approve"])]);
    const rejectedQuery = buildQuery(draftsRef, [where("status", "in", ["rejected", "Rejected", "reject", "Reject"])]);

    const [totalSnap, pendingSnap, approvedSnap, rejectedSnap] = await Promise.all([
      getCountFromServer(totalQuery),
      getCountFromServer(pendingQuery),
      getCountFromServer(approvedQuery),
      getCountFromServer(rejectedQuery)
    ]);

    // 2. Get count from 'published_content' collection
    const publishedQuery = isManager 
      ? query(publishedRef) 
      : query(publishedRef, where("authorEmail", "==", userEmail));
    const publishedSnap = await getCountFromServer(publishedQuery);

    // 3. Platform Distribution
    const linkedinQuery = buildQuery(draftsRef, [where("platform", "in", ["LinkedIn", "linkedin", "Linkedin"])]);
    const twitterQuery = buildQuery(draftsRef, [where("platform", "in", ["X (Twitter)", "Twitter", "twitter", "X"])]);
    const emailQuery = buildQuery(draftsRef, [where("platform", "in", ["Email Newsletter", "Email", "email"])]);

    const [linkedinSnap, twitterSnap, emailSnap] = await Promise.all([
      getCountFromServer(linkedinQuery),
      getCountFromServer(twitterQuery),
      getCountFromServer(emailQuery)
    ]);

    return {
      totalDrafts: totalSnap.data().count,
      pendingReview: pendingSnap.data().count,
      approved: approvedSnap.data().count,
      rejected: rejectedSnap.data().count,
      published: publishedSnap.data().count,
      platformDistribution: {
        linkedin: linkedinSnap.data().count,
        twitter: twitterSnap.data().count,
        email: emailSnap.data().count
      }
    };
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("[Firestore Analytics] Permission denied. Shared scope requires updated security rules.");
      throw new Error("PROMPTED_PERMISSION_DENIED");
    }
    console.error("Error fetching analytics summary:", error);
    return {
      totalDrafts: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      published: 0,
      platformDistribution: { linkedin: 0, twitter: 0, email: 0 }
    };
  }
}
