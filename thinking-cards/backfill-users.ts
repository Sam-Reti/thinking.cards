/**
 * One-time backfill script — populates Firestore `users` collection from
 * existing Firebase Auth accounts.
 *
 * Run with:
 *   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
 *   npx ts-node backfill-users.ts
 */

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });

const auth = getAuth();
const db = getFirestore();

async function backfill(nextPageToken?: string): Promise<number> {
  const result = await auth.listUsers(1000, nextPageToken);
  const batch = db.batch();

  for (const user of result.users) {
    const ref = db.doc(`users/${user.uid}`);
    batch.set(
      ref,
      {
        email: user.email ?? '',
        createdAt: user.metadata.creationTime ?? new Date().toISOString(),
      },
      { merge: true },
    );
  }

  await batch.commit();
  console.log(`Backfilled ${result.users.length} users.`);

  if (result.pageToken) {
    return result.users.length + (await backfill(result.pageToken));
  }
  return result.users.length;
}

backfill()
  .then((total) => console.log(`Done. Total users backfilled: ${total}`))
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });
