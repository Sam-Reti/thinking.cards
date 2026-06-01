import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();

export const deleteUser = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'Must be logged in.');
  }

  const callerToken = request.auth!.token;
  if (!callerToken.admin) {
    throw new HttpsError('permission-denied', 'Must be an admin.');
  }

  const targetUid = request.data?.uid;
  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'Must provide a uid string.');
  }

  if (targetUid === callerUid) {
    throw new HttpsError('invalid-argument', 'Cannot delete your own account.');
  }

  const db = getFirestore();
  const auth = getAuth();

  // Delete Auth account
  await auth.deleteUser(targetUid);

  // Delete subcollections (favorites, progress)
  const subcollections = ['favorites', 'progress'];
  for (const sub of subcollections) {
    const snap = await db.collection(`users/${targetUid}/${sub}`).get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // Delete user doc
  await db.doc(`users/${targetUid}`).delete();

  return { success: true };
});
