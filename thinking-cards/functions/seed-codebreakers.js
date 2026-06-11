/**
 * One-time seed script: creates a Codebreakers category, an instruction card,
 * and 20 puzzle cards (5 Easy, 5 Medium, 5 Hard, 5 Extreme).
 *
 * All clue feedback values have been programmatically validated.
 *
 * Usage:  node seed-codebreakers.js
 */
const admin = require('firebase-admin');
if (admin.apps.length === 0) admin.initializeApp({ projectId: 'thinking-cards' });
const db = admin.firestore();

const CATEGORY = {
  name: 'Codebreakers',
  description: 'Deduce the hidden number from clues about correct and misplaced digits.',
  color: '#e17055',
  order: 11,
  type: 'codebreaker',
};

const INSTRUCTIONS = {
  cardNumber: 0,
  questionText: 'How to Play Codebreaker',
  explanation:
`Codebreaker is a number-deduction puzzle. A secret code is hidden and you must figure it out using the clues provided.

Each clue shows a guess along with two pieces of feedback:
• Correct — how many digits are in the right position
• Misplaced — how many digits are in the code but in the wrong position

How to solve:
• Study the clues carefully — compare guesses that share digits
• Tap a box in the answer row to select it
• Use the number pad to enter your guess for each digit
• Tap backspace to clear a digit
• When all digits are filled in, tap "Check Answer"

Tips:
• If a clue says 0 correct and 0 misplaced, none of those digits are in the code
• Cross-reference clues — if a digit appears in two guesses with different feedback, you can narrow down its position
• Start with clues that give the most information (high correct + misplaced counts)

Use hints if you get stuck — each hint reveals one correct digit. Good luck cracking the code!`,
};

// ── Easy: 3 digits, 5 clues ──────────────────────────────────────

const EASY = [
  {
    cardNumber: 1,
    difficulty: 'Easy',
    questionText: 'Starter Code',
    codebreakerAnswer: '394',
    codebreakerClues: [
      { guess: '123', correct: 0, misplaced: 1 },
      { guess: '456', correct: 0, misplaced: 1 },
      { guess: '789', correct: 0, misplaced: 1 },
      { guess: '395', correct: 2, misplaced: 0 },
      { guess: '391', correct: 2, misplaced: 0 },
    ],
  },
  {
    cardNumber: 2,
    difficulty: 'Easy',
    questionText: 'Quick Crack',
    codebreakerAnswer: '518',
    codebreakerClues: [
      { guess: '152', correct: 0, misplaced: 2 },
      { guess: '538', correct: 2, misplaced: 0 },
      { guess: '815', correct: 1, misplaced: 2 },
      { guess: '510', correct: 2, misplaced: 0 },
      { guess: '218', correct: 2, misplaced: 0 },
    ],
  },
  {
    cardNumber: 3,
    difficulty: 'Easy',
    questionText: 'Warm Up',
    codebreakerAnswer: '267',
    codebreakerClues: [
      { guess: '123', correct: 0, misplaced: 1 },
      { guess: '456', correct: 0, misplaced: 1 },
      { guess: '789', correct: 0, misplaced: 1 },
      { guess: '276', correct: 1, misplaced: 2 },
      { guess: '261', correct: 2, misplaced: 0 },
    ],
  },
  {
    cardNumber: 4,
    difficulty: 'Easy',
    questionText: 'First Steps',
    codebreakerAnswer: '840',
    codebreakerClues: [
      { guess: '012', correct: 0, misplaced: 1 },
      { guess: '348', correct: 1, misplaced: 1 },
      { guess: '804', correct: 1, misplaced: 2 },
      { guess: '841', correct: 2, misplaced: 0 },
      { guess: '849', correct: 2, misplaced: 0 },
    ],
  },
  {
    cardNumber: 5,
    difficulty: 'Easy',
    questionText: 'Triple Digits',
    codebreakerAnswer: '631',
    codebreakerClues: [
      { guess: '136', correct: 1, misplaced: 2 },
      { guess: '613', correct: 1, misplaced: 2 },
      { guess: '639', correct: 2, misplaced: 0 },
      { guess: '637', correct: 2, misplaced: 0 },
      { guess: '632', correct: 2, misplaced: 0 },
    ],
  },
];

// ── Medium: 4 digits, 5-6 clues ──────────────────────────────────

const MEDIUM = [
  {
    cardNumber: 6,
    difficulty: 'Medium',
    questionText: 'Four Square',
    codebreakerAnswer: '4271',
    codebreakerClues: [
      { guess: '1234', correct: 1, misplaced: 2 },
      { guess: '4567', correct: 1, misplaced: 1 },
      { guess: '2714', correct: 0, misplaced: 4 },
      { guess: '4231', correct: 3, misplaced: 0 },
      { guess: '4270', correct: 3, misplaced: 0 },
    ],
  },
  {
    cardNumber: 7,
    difficulty: 'Medium',
    questionText: 'Dial In',
    codebreakerAnswer: '8053',
    codebreakerClues: [
      { guess: '1234', correct: 0, misplaced: 1 },
      { guess: '5678', correct: 0, misplaced: 2 },
      { guess: '8901', correct: 1, misplaced: 1 },
      { guess: '8043', correct: 3, misplaced: 0 },
      { guess: '8059', correct: 3, misplaced: 0 },
    ],
  },
  {
    cardNumber: 8,
    difficulty: 'Medium',
    questionText: 'Lock Combo',
    codebreakerAnswer: '3920',
    codebreakerClues: [
      { guess: '1234', correct: 0, misplaced: 2 },
      { guess: '5690', correct: 1, misplaced: 1 },
      { guess: '3810', correct: 2, misplaced: 0 },
      { guess: '3912', correct: 2, misplaced: 1 },
      { guess: '3925', correct: 3, misplaced: 0 },
    ],
  },
  {
    cardNumber: 9,
    difficulty: 'Medium',
    questionText: 'Safe Cracker',
    codebreakerAnswer: '7164',
    codebreakerClues: [
      { guess: '1234', correct: 1, misplaced: 1 },
      { guess: '5678', correct: 0, misplaced: 2 },
      { guess: '7890', correct: 1, misplaced: 0 },
      { guess: '7126', correct: 2, misplaced: 1 },
      { guess: '7154', correct: 3, misplaced: 0 },
    ],
  },
  {
    cardNumber: 10,
    difficulty: 'Medium',
    questionText: 'Pin Code',
    codebreakerAnswer: '5308',
    codebreakerClues: [
      { guess: '1234', correct: 0, misplaced: 1 },
      { guess: '5678', correct: 2, misplaced: 0 },
      { guess: '5390', correct: 2, misplaced: 1 },
      { guess: '5301', correct: 3, misplaced: 0 },
      { guess: '5309', correct: 3, misplaced: 0 },
    ],
  },
];

// ── Hard: 5 digits, 6-7 clues ────────────────────────────────────

const HARD = [
  {
    cardNumber: 11,
    difficulty: 'Hard',
    questionText: 'Five Alive',
    codebreakerAnswer: '39172',
    codebreakerClues: [
      { guess: '12345', correct: 0, misplaced: 3 },
      { guess: '67890', correct: 0, misplaced: 2 },
      { guess: '31972', correct: 3, misplaced: 2 },
      { guess: '39142', correct: 4, misplaced: 0 },
      { guess: '39170', correct: 4, misplaced: 0 },
      { guess: '91732', correct: 1, misplaced: 4 },
    ],
  },
  {
    cardNumber: 12,
    difficulty: 'Hard',
    questionText: 'Deep Vault',
    codebreakerAnswer: '60483',
    codebreakerClues: [
      { guess: '12345', correct: 0, misplaced: 2 },
      { guess: '67890', correct: 1, misplaced: 2 },
      { guess: '60412', correct: 3, misplaced: 0 },
      { guess: '60843', correct: 3, misplaced: 2 },
      { guess: '60480', correct: 4, misplaced: 0 },
      { guess: '48603', correct: 1, misplaced: 4 },
    ],
  },
  {
    cardNumber: 13,
    difficulty: 'Hard',
    questionText: 'Cipher Lock',
    codebreakerAnswer: '85241',
    codebreakerClues: [
      { guess: '12345', correct: 1, misplaced: 3 },
      { guess: '54321', correct: 1, misplaced: 3 },
      { guess: '85412', correct: 2, misplaced: 3 },
      { guess: '85231', correct: 4, misplaced: 0 },
      { guess: '85240', correct: 4, misplaced: 0 },
      { guess: '13579', correct: 0, misplaced: 2 },
    ],
  },
  {
    cardNumber: 14,
    difficulty: 'Hard',
    questionText: 'Number Maze',
    codebreakerAnswer: '47096',
    codebreakerClues: [
      { guess: '12345', correct: 0, misplaced: 1 },
      { guess: '09876', correct: 1, misplaced: 3 },
      { guess: '47650', correct: 2, misplaced: 2 },
      { guess: '47906', correct: 3, misplaced: 2 },
      { guess: '47091', correct: 4, misplaced: 0 },
      { guess: '90764', correct: 0, misplaced: 5 },
    ],
  },
  {
    cardNumber: 15,
    difficulty: 'Hard',
    questionText: 'Cracked Safe',
    codebreakerAnswer: '20567',
    codebreakerClues: [
      { guess: '12345', correct: 0, misplaced: 2 },
      { guess: '56789', correct: 0, misplaced: 3 },
      { guess: '20345', correct: 2, misplaced: 1 },
      { guess: '20576', correct: 3, misplaced: 2 },
      { guess: '20560', correct: 4, misplaced: 0 },
      { guess: '75620', correct: 0, misplaced: 5 },
    ],
  },
];

// ── Extreme: 5-6 digits, 7+ clues ───────────────────────────────

const EXTREME = [
  {
    cardNumber: 16,
    difficulty: 'Extreme',
    questionText: 'Master Code',
    codebreakerAnswer: '502973',
    codebreakerClues: [
      { guess: '123456', correct: 0, misplaced: 3 },
      { guess: '789012', correct: 0, misplaced: 4 },
      { guess: '502914', correct: 4, misplaced: 0 },
      { guess: '530297', correct: 1, misplaced: 5 },
      { guess: '502970', correct: 5, misplaced: 0 },
      { guess: '507923', correct: 4, misplaced: 2 },
      { guess: '329750', correct: 0, misplaced: 6 },
    ],
  },
  {
    cardNumber: 17,
    difficulty: 'Extreme',
    questionText: 'Enigma',
    codebreakerAnswer: '718305',
    codebreakerClues: [
      { guess: '123456', correct: 0, misplaced: 3 },
      { guess: '780912', correct: 1, misplaced: 3 },
      { guess: '718040', correct: 3, misplaced: 1 },
      { guess: '718350', correct: 4, misplaced: 2 },
      { guess: '718503', correct: 4, misplaced: 2 },
      { guess: '718300', correct: 5, misplaced: 0 },
      { guess: '530187', correct: 0, misplaced: 6 },
    ],
  },
  {
    cardNumber: 18,
    difficulty: 'Extreme',
    questionText: 'Black Box',
    codebreakerAnswer: '946281',
    codebreakerClues: [
      { guess: '123456', correct: 0, misplaced: 4 },
      { guess: '789012', correct: 0, misplaced: 4 },
      { guess: '946128', correct: 3, misplaced: 3 },
      { guess: '946280', correct: 5, misplaced: 0 },
      { guess: '946218', correct: 4, misplaced: 2 },
      { guess: '942681', correct: 4, misplaced: 2 },
      { guess: '216849', correct: 1, misplaced: 5 },
    ],
  },
  {
    cardNumber: 19,
    difficulty: 'Extreme',
    questionText: 'Final Frontier',
    codebreakerAnswer: '370519',
    codebreakerClues: [
      { guess: '123456', correct: 0, misplaced: 3 },
      { guess: '780912', correct: 2, misplaced: 2 },
      { guess: '370120', correct: 3, misplaced: 1 },
      { guess: '370951', correct: 3, misplaced: 3 },
      { guess: '370591', correct: 4, misplaced: 2 },
      { guess: '370510', correct: 5, misplaced: 0 },
      { guess: '519037', correct: 0, misplaced: 6 },
    ],
  },
  {
    cardNumber: 20,
    difficulty: 'Extreme',
    questionText: 'Omega Lock',
    codebreakerAnswer: '82463',
    codebreakerClues: [
      { guess: '12345', correct: 1, misplaced: 2 },
      { guess: '67890', correct: 0, misplaced: 2 },
      { guess: '82345', correct: 2, misplaced: 2 },
      { guess: '82436', correct: 3, misplaced: 2 },
      { guess: '82460', correct: 4, misplaced: 0 },
      { guess: '64283', correct: 1, misplaced: 4 },
      { guess: '24638', correct: 0, misplaced: 5 },
    ],
  },
];

const ALL_CARDS = [INSTRUCTIONS, ...EASY, ...MEDIUM, ...HARD, ...EXTREME];

async function seed() {
  // 1. Create category
  const catRef = await db.collection('categories').add(CATEGORY);
  console.log(`Created category "${CATEGORY.name}" → ${catRef.id}`);

  // 2. Create cards in batches (Firestore limit: 500 per batch)
  const batch = db.batch();
  for (const card of ALL_CARDS) {
    const ref = db.collection('cards').doc();
    batch.set(ref, { ...card, categoryId: catRef.id });
  }
  await batch.commit();
  console.log(`Seeded ${ALL_CARDS.length} codebreaker cards (1 instruction + ${ALL_CARDS.length - 1} puzzles).`);
}

seed().catch(console.error);
