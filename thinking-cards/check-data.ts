import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function check() {
  const cats = await db.collection('categories').get();
  console.log(`Found ${cats.size} categories:`);
  cats.forEach((doc) => {
    console.log(`  ${doc.id}:`, doc.data());
  });

  const cards = await db.collection('cards').get();
  console.log(`\nFound ${cards.size} cards total`);
}

check().catch(console.error);
