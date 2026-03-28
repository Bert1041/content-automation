import { db } from "./config";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp
} from "firebase/firestore";

export interface FirestoreDraft {
  id: string;
  requestId: string;
  topic: string;
  platform: string;
  content: string;
  status: string;
  authorEmail: string;
  generatedAt: Date | Timestamp;
  fields?: Record<string, any>;
}

/**
 * Fetch all drafts for a specific user from Firestore
 */
export async function fetchDraftsFromFirestore(userEmail: string, role?: string) {
  try {
    const normalizedEmail = userEmail.toLowerCase();
    const draftsRef = collection(db, "drafts");
    
    let querySnapshot;
    
    // Managers see ALL drafts in the system for oversight
    if (role === "manager") {
      const q = query(draftsRef);
      querySnapshot = await getDocs(q);
    } else {
      // Content Managers only see their own drafts (camelCase, PascalCase, and common typo)
      const q1 = query(draftsRef, where("authorEmail", "==", normalizedEmail));
      const q2 = query(draftsRef, where("AuthorEmail", "==", normalizedEmail));
      const q3 = query(draftsRef, where("uthorEmail", "==", normalizedEmail));
      const [snap1, snap2, snap3] = await Promise.all([getDocs(q1), getDocs(q2), getDocs(q3)]);
      
      const combinedDocs = [...snap1.docs];
      const seenIds = new Set(combinedDocs.map(d => d.id));
      [...snap2.docs, ...snap3.docs].forEach(doc => {
        if (!seenIds.has(doc.id)) combinedDocs.push(doc);
      });
      querySnapshot = { docs: combinedDocs };
    }

    const drafts: FirestoreDraft[] = [];
    
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      drafts.push({
        id: doc.id,
        requestId: data.requestId || data.RequestId || doc.id,
        topic: data.topic || data.Topic || "Untitled Topic",
        platform: data.platform || data.Platform || "Unknown",
        content: data.content || data.Content || "",
        status: data.status || data.Status || "review",
        authorEmail: data.authorEmail || data.AuthorEmail,
        generatedAt: data.generatedAt instanceof Timestamp 
          ? data.generatedAt.toDate() 
          : data.GeneratedAt instanceof Timestamp 
            ? data.GeneratedAt.toDate() 
            : new Date(data.generatedAt || data.GeneratedAt || Date.now()),
        fields: data
      });
    });

    return drafts.sort((a, b) => {
      const dateA = a.generatedAt instanceof Date ? a.generatedAt.getTime() : 
                    (a.generatedAt as any)?.seconds ? (a.generatedAt as any).seconds * 1000 : 0;
      const dateB = b.generatedAt instanceof Date ? b.generatedAt.getTime() : 
                    (b.generatedAt as any)?.seconds ? (b.generatedAt as any).seconds * 1000 : 0;
      return dateB - dateA;
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("[Firestore] Permission denied. Ensure your role is 'Manager' and security rules are updated.");
      throw new Error("PROMPTED_PERMISSION_DENIED");
    }
    console.error("Error fetching drafts from Firestore:", error);
    throw error;
  }
}

/**
 * Fetch a specific draft group by requestId
 */
export async function fetchDraftGroupFromFirestore(requestId: string) {
  try {
    const draftsRef = collection(db, "drafts");
    const q = query(draftsRef, where("requestId", "==", requestId));
    const querySnapshot = await getDocs(q);
    
    const group: FirestoreDraft[] = [];
    querySnapshot.forEach((doc) => {
      group.push({ id: doc.id, ...doc.data() } as FirestoreDraft);
    });
    
    return group;
  } catch (error) {
    console.error("Error fetching draft group from Firestore:", error);
    throw error;
  }
}
/**
 * Update a specific draft's content or status in Firestore
 */
export async function updateDraftInFirestore(id: string, updates: Partial<FirestoreDraft>) {
  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
    const draftRef = doc(db, "drafts", id);
    
    // Prepare data for update, removing ID and handling timestamps
    const dataToUpdate = { 
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // Safety: ensure we don't accidentally update the ID field itself
    delete (dataToUpdate as any).id;

    await updateDoc(draftRef, dataToUpdate);
    console.log(`[Firestore] Draft ${id} updated successfully.`);
    return true;
  } catch (error) {
    console.error(`[Firestore] Error updating draft ${id}:`, error);
    throw error;
  }
}
