import { db } from "./config";
import { 
  collection, 
  addDoc, 
  serverTimestamp
} from "firebase/firestore";

/**
 * Persist approved content to Firebase for long-term records and analytics
 */
export interface PublishedContentData {
  draftId: string;
  requestId: string;
  topic: string;
  content: string;
  platform: string;
  authorEmail: string;
  managerEmail: string;
  publishedAt?: string;
  generatedAt?: string;
}

/**
 * Persist approved content to Firebase for long-term records and analytics
 */
export async function savePublishedContent(data: PublishedContentData) {
  try {
    const publishedRef = collection(db, "published_content");
    
    const docData = {
      airtableId: data.draftId,
      requestId: data.requestId,
      topic: data.topic,
      content: data.content,
      platform: data.platform,
      authorEmail: data.authorEmail,
      managerEmail: data.managerEmail,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : serverTimestamp(),
      status: "Published",
      metadata: {
        generatedAt: data.generatedAt || new Date().toISOString(),
        variantIndex: data.requestId === data.draftId ? 0 : 1
      }
    };

    const docRef = await addDoc(publishedRef, docData);
    console.log("Content persisted to Firebase with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    throw error;
  }
}

/**
 * Update scheduling info in Firebase
 */
export async function scheduleContentInFirebase(draft: AirtableDraft, publishDate: string, managerEmail: string) {
  try {
    const scheduledRef = collection(db, "scheduled_content");
    
    await addDoc(scheduledRef, {
      airtableId: draft.id,
      topic: draft.fields.Topic,
      platform: draft.fields.Platform,
      scheduledDate: publishDate,
      managerEmail,
      createdAt: serverTimestamp(),
      status: "Scheduled"
    });
  } catch (error) {
    console.error("Error scheduling in Firebase:", error);
    throw error;
  }
}

/**
 * Fetch all published content for a manager or all if role is manager
 */
export async function fetchPublishedContent(userEmail: string, role?: string) {
  try {
    const { getDocs, query, where, orderBy } = await import("firebase/firestore");
    const publishedRef = collection(db, "published_content");
    
    // Managers see ALL published content for oversight
    const q = (role === "manager") 
      ? query(publishedRef, orderBy("publishedAt", "desc"))
      : query(publishedRef, where("authorEmail", "==", userEmail), orderBy("publishedAt", "desc"));
      
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate?.() || new Date(doc.data().publishedAt)
    }));
  } catch (error) {
    console.error("Error fetching published content:", error);
    return [];
  }
}
