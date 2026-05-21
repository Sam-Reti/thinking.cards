import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function seed() {
  console.log('Creating Experimental category...');

  const catRef = await db.collection('categories').add({
    name: 'Experimental',
    description: 'Uncharted questions that defy easy answers',
    icon: '🧪',
    color: '#64748B',
    order: 6,
  });
  console.log(`  Created category: Experimental (${catRef.id})`);

  const cards = [
    'If you could implant a single memory into every human on Earth, what would it be and why?',
    'You wake up tomorrow and every lie you\'ve ever told has been revealed to everyone who heard it. What happens next?',
    'If emotions were a currency, which one would be the most valuable and which would be worthless?',
    'Imagine you could only communicate through questions for the rest of your life. How would your relationships change?',
    'If every person on Earth simultaneously forgot the concept of money, what would emerge in its place?',
    'You\'re given the power to remove one human instinct from the entire species. Which do you choose, and what are the consequences?',
    'If you could experience the full life of any animal from birth to death, which would you choose and what do you hope to learn?',
    'Imagine a world where sleep is optional. Would you stop sleeping, and what would humanity lose or gain?',
    'If you could hear the internal monologue of one person for a day — anyone alive — who would it be and why?',
    'You discover that every decision you\'ve ever made was statistically the most common choice. Does that make you ordinary, or does it say something deeper about human nature?',
    'If children were raised without any concept of nationality or borders, how would the world be different in 50 years?',
    'Imagine pain could be transferred between people voluntarily. Would this create a more empathetic society or a more exploitative one?',
    'If you could design a new emotion that doesn\'t currently exist, what would it feel like and when would people experience it?',
    'You\'re offered the chance to know the exact impact your life will have had after you die — the number of lives changed, for better or worse. Do you look?',
    'If language had never been invented, what would be humanity\'s greatest achievement?',
    'Imagine that every person is born with a visible counter showing how many times they\'ve been genuinely kind. How would society function?',
    'If you could make the entire world experience one hour of your life — any hour — which would you choose?',
    'You\'re told that one of your deeply held beliefs is factually wrong, but not which one. How does this change the way you think?',
    'If forgetting were impossible and every human remembered everything perfectly, would we be better or worse off?',
    'Imagine you\'re the last person alive and you can leave one message for whatever comes next. What do you say?',
  ];

  for (let i = 0; i < cards.length; i++) {
    await db.collection('cards').add({
      categoryId: catRef.id,
      cardNumber: i + 1,
      questionText: cards[i],
    });
  }
  console.log(`  Added ${cards.length} cards`);
  console.log('Done!');
}

seed().catch(console.error);
