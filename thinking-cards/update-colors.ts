import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function updateColors() {
  const snapshot = await db.collection('categories').get();
  for (const doc of snapshot.docs) {
    const name = doc.data()['name'] as string;
    if (name === 'Moral Compass') {
      await doc.ref.update({ color: '#b30086' });
      console.log(`  ${name} → #b30086`);
    }
  }
  console.log('Done!');
}

updateColors().catch(console.error);
