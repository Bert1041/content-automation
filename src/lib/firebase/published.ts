import { app } from "./config";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import { Draft as AirtableDraft } from "../api/n8n";

const db = getFirestore(app);

/**
 * Persist approved content to Firebase for long-term records and analytics
 */
export async function savePublishedContent(draft: AirtableDraft, managerEmail: string) {
  try {
    const publishedRef = collection(db, "published_content");
    
    const docData = {
      airtableId: draft.id,
      requestId: draft.fields.RequestId,
      topic: draft.fields.Topic,
      content: draft.fields.Content, // Note: This should already be parsed or we parse it here
      platform: draft.fields.Platform,
      authorEmail: draft.fields.AuthorEmail,
      managerEmail: managerEmail,
      publishedAt: serverTimestamp(),
      status: "Published",
      metadata: {
        generatedAt: draft.fields.GeneratedAt,
        variantIndex: draft.fields.RequestId === draft.id ? 0 : 1 // Simple logic to track variants
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
