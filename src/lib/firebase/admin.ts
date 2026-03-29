import * as admin from 'firebase-admin';

/**
 * Lazily initializes the Firebase Admin SDK.
 * This prevents build-time failures when environment variables are missing.
 */
function getAdminApp() {
  if (!admin.apps.length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials missing. Skipping initialization.');
      return null;
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      return null;
    }
  }
  return admin.app();
}

/**
 * Exported accessor for adminAuth.
 * Usage: const auth = await getAdminAuth();
 */
export async function getAdminAuth() {
  const app = getAdminApp();
  if (!app) {
    throw new Error('Firebase Admin App not initialized');
  }
  return admin.auth(app);
}
