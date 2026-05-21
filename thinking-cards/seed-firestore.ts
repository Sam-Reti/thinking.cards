/**
 * Seed script — run with: npx ts-node seed-firestore.ts
 * Requires: npm install -D ts-node (already a dev dep if you're using Angular)
 * Also needs firebase-admin: npm install firebase-admin
 *
 * Before running, set GOOGLE_APPLICATION_CREDENTIALS to your service account key:
 *   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

interface SeedCategory {
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  cards: string[];
}

const data: SeedCategory[] = [
  {
    name: 'Socratic Sparks',
    description: 'Questions that challenge your assumptions',
    icon: '💡',
    color: '#6C5CE7',
    order: 1,
    cards: [
      'What do you think you know for certain, and how do you know it?',
      'If you could never be wrong again, would that be a gift or a curse?',
      'Is it possible to truly understand someone else\'s perspective?',
      'What is the difference between believing something and knowing it?',
      'Can a question ever be more valuable than an answer?',
      'What would change if everyone always told the truth?',
      'Is there a difference between living and merely existing?',
      'How do you decide what is worth caring about?',
      'Can you be truly free if you don\'t understand your own constraints?',
      'What assumptions are you making right now that you haven\'t questioned?',
    ],
  },
  {
    name: 'This or That',
    description: 'Would you rather face these dilemmas?',
    icon: '⚖️',
    color: '#FD79A8',
    order: 2,
    cards: [
      'Would you rather have the ability to read minds or to be invisible?',
      'Would you rather live 100 years in the past or 100 years in the future?',
      'Would you rather always say what you think or never speak again?',
      'Would you rather be famous but misunderstood, or unknown but deeply fulfilled?',
      'Would you rather have unlimited knowledge or unlimited creativity?',
      'Would you rather experience everything once or master one thing deeply?',
      'Would you rather lose all your memories or never make new ones?',
      'Would you rather always win arguments or always understand others?',
      'Would you rather be the smartest person in the room or the kindest?',
      'Would you rather change your past or see your future?',
    ],
  },
  {
    name: 'Mind Bogglers',
    description: 'Brain-bending thought experiments',
    icon: '🤯',
    color: '#E17055',
    order: 3,
    cards: [
      'If a perfect copy of you was made, would it be "you"?',
      'Can something be true if no one believes it?',
      'If time stopped for everyone except you, would it matter?',
      'Does a tree falling in an empty forest make a sound?',
      'If you replaced every part of a ship, is it still the same ship?',
      'Can an AI ever truly be conscious, or only simulate consciousness?',
      'If the universe has no edge, what does it expand into?',
      'Is math discovered or invented?',
      'If we live in a simulation, does that change the meaning of life?',
      'Can you step in the same river twice?',
    ],
  },
  {
    name: 'Moral Compass',
    description: 'Ethical dilemmas that test your values',
    icon: '🧭',
    color: '#00B894',
    order: 4,
    cards: [
      'Is it ever right to lie to protect someone\'s feelings?',
      'Should you sacrifice one life to save five?',
      'Is it ethical to eat animals if alternatives exist?',
      'Do rich nations have a moral obligation to help poorer ones?',
      'Is breaking an unjust law morally justified?',
      'Should genetic engineering be used to eliminate disease?',
      'Is privacy a right even if it enables wrongdoing?',
      'Can war ever be truly justified?',
      'Do we have a moral obligation to future generations?',
      'Is forgiveness always the right choice?',
    ],
  },
  {
    name: 'Know Thyself',
    description: 'Deep questions about who you really are',
    icon: '🪞',
    color: '#0984E3',
    order: 5,
    cards: [
      'What would you do if you knew you could not fail?',
      'What is the story you keep telling yourself about who you are?',
      'When was the last time you changed your mind about something important?',
      'What are you most afraid of, and why?',
      'If you could have dinner with any version of yourself, which age would you choose?',
      'What would your life look like if you stopped trying to impress others?',
      'What belief do you hold that most people would disagree with?',
      'What does success actually mean to you — not society\'s definition?',
      'If you had one year left to live, what would you change today?',
      'What part of yourself have you been avoiding?',
    ],
  },
];

async function seed() {
  console.log('Seeding Firestore...');

  for (const cat of data) {
    const { cards, ...categoryData } = cat;
    const catRef = await db.collection('categories').add(categoryData);
    console.log(`  Created category: ${cat.name} (${catRef.id})`);

    for (let i = 0; i < cards.length; i++) {
      await db.collection('cards').add({
        categoryId: catRef.id,
        cardNumber: i + 1,
        questionText: cards[i],
      });
    }
    console.log(`    Added ${cards.length} cards`);
  }

  console.log('Done! 50 cards seeded across 5 categories.');
}

seed().catch(console.error);
