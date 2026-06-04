/**
 * One-time script: renumber puzzle cards so they go Easy → Medium → Hard → Extreme.
 * Moves Suspect Lineup from #3 → #8, and shifts new Easy cards #4-8 down to #3-7.
 *
 * Usage:  node reorder-puzzles.js
 */
const admin = require('firebase-admin');
if (admin.apps.length === 0) admin.initializeApp({ projectId: 'thinking-cards' });
const db = admin.firestore();

const CATEGORY_ID = '0Ser5Ko3vSvdCThoP4jb';

const renumbers = [
  { from: 3, to: 8 },  // Suspect Lineup (Medium) → after all Easy
  { from: 4, to: 3 },  // Breakfast Orders (Easy)
  { from: 5, to: 4 },  // Movie Night (Easy)
  { from: 6, to: 5 },  // Garden Plots (Easy)
  { from: 7, to: 6 },  // Bus Stop (Easy)
  { from: 8, to: 7 },  // Pet Adoption Day (Easy)
];

async function run() {
  // Use a temp value to avoid collisions (e.g. #3→#8 while #8 still exists)
  const TEMP_OFFSET = 1000;
  const batch1 = db.batch();
  const batch2 = db.batch();
  const refs = [];

  for (const { from, to } of renumbers) {
    const snap = await db
      .collection('cards')
      .where('categoryId', '==', CATEGORY_ID)
      .where('cardNumber', '==', from)
      .limit(1)
      .get();
    if (snap.empty) {
      console.log(`⚠  Card #${from} not found — skipping`);
      continue;
    }
    const doc = snap.docs[0];
    const title = doc.data().questionText;
    refs.push({ ref: doc.ref, from, to, title });
    batch1.update(doc.ref, { cardNumber: TEMP_OFFSET + to });
  }

  await batch1.commit();
  console.log('Phase 1: moved to temp numbers');

  for (const { ref, from, to, title } of refs) {
    batch2.update(ref, { cardNumber: to });
    console.log(`  #${from} → #${to}  ${title}`);
  }

  await batch2.commit();
  console.log('\n✅  Reorder complete.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
