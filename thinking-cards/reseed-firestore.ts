import { initializeApp, applicationDefault } from 'firebase-admin/app';
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
    description: 'Open-ended philosophical questions to spark reflection',
    icon: '💡',
    color: '#6C5CE7',
    order: 1,
    cards: [
      'How are our thoughts and opinions formed?\n\n• What external factors shape our thinking — news, education, family, or personal experiences?\n• Are our opinions ever truly our own, or are they a reflection of outside influences?\n• Are you aware of how your thoughts and opinions make you behave?',
      'Can true altruism exist?\n\n• Is it possible to perform a selfless act without any expectation of return or personal benefit?\n• Do all acts of kindness have some element of self-interest, even if it\'s just feeling good about oneself?\n• If an act of kindness is only performed when it is seen does this invalidate the act?',
      'What does it mean to live a good life?\n\n• Is the \'good life\' based on internal measurements, external, or a balance of both?\n• Can a person lead a meaningful life without relying on external factors like wealth or personal relationships?\n• Does living a good life require the pursuit of virtue, pleasure, or something else?',
      'Are we obligated to help others?\n\n• To what extent do we have a moral duty to assist others, even if it comes at a personal cost?\n• What responsibilities do individuals and nations have in addressing these challenges?\n• Is there a limit to our obligation to help others?',
      'What is the role of suffering in life?\n\n• Can suffering be a catalyst for personal growth, or is it simply something to be avoided?\n• Is it possible to live a meaningful life without experiencing any form of suffering?\n• Does the way we respond to suffering define our character?',
      'What is the value of truth?\n\n• Is truth always preferable to a comforting lie, or are there situations where it\'s better not to know or reveal the truth?\n• How do we determine what is true in a world filled with conflicting information?\n• Is truth subjective, or are there absolute truths that exist?',
      'Is there such a thing as free will?\n\n• Are our choices truly free, or are they determined by factors beyond our control?\n• Does believing in free will or determinism change how we approach life and moral responsibility?\n• Can we hold people accountable for their actions if free will is an illusion?',
      'What is the purpose of art?\n\n• Is the purpose of art to provoke thought, to provide pleasure, to reflect reality, or something else?\n• Can art be considered meaningful if it doesn\'t serve a clear purpose?\n• Does art help you define what beauty is?',
      'Can someone have an opinion without engaging in action?\n\n• Is it hypocritical to express a stance without participating in it?\n• What does it take for a belief to become more than just words?\n• When might it be ethical to keep one\'s beliefs private rather than acting upon them?',
      'How aware are you of the inevitability of change?\n\n• Do we appreciate the natural occurrence of change in our lives?\n• Why do humans resist change, even though it\'s inevitable?\n• Can we find comfort in the idea that everything is always evolving?',
    ],
  },
  {
    name: 'This or That',
    description: 'Two contrasting philosophical viewpoints or moral stances',
    icon: '⚖️',
    color: '#FD79A8',
    order: 2,
    cards: [
      'Does the end justify the means?\n\nJeremy Bentham: The morality of an action is determined by its outcome. If the result brings the greatest happiness to the greatest number, then the means are justified.\n\nSusan Sontag: No end can justify immoral means. The way we achieve our goals matters just as much as the goals themselves.',
      'Where does knowledge come from?\n\nRené Descartes: True knowledge comes from reason alone. We can only trust what we can logically deduce from first principles.\n\nDavid Hume: Knowledge comes from experience. We learn about the world through our senses, not through abstract reasoning.',
      'Are humans inherently good or selfish?\n\nThomas Hobbes: Humans are naturally selfish and competitive. Without laws and authority, life would be "solitary, poor, nasty, brutish, and short."\n\nSimone de Beauvoir: Humans are not inherently anything. We become who we are through our choices and actions.',
      'What is the purpose of life?\n\nAristotle: The purpose of life is to achieve eudaimonia — a state of flourishing through virtuous activity and rational thought.\n\nAlbert Camus: Life has no inherent purpose. We must create our own meaning in an absurd world.',
      'Is human nature fixed or malleable?\n\nPlato: Human nature is fixed. Each person has an innate essence that determines their character and abilities.\n\nJohn Locke: Humans are born as blank slates. Our nature is shaped entirely by experience and environment.',
      'Should individuals prioritize personal freedom or social order?\n\nJohn Stuart Mill: Individual freedom is paramount. People should be free to do as they please, as long as they don\'t harm others.\n\nConfucius: Social harmony and order are more important than individual freedom. People should fulfill their roles and duties.',
      'Can people change their fundamental beliefs?\n\nWilliam James: Yes, beliefs can change through experience and pragmatic evaluation. We adopt beliefs that work for us.\n\nSøren Kierkegaard: Fundamental change requires a "leap of faith" — a radical, often painful transformation of one\'s entire worldview.',
      'Is morality universal or culturally relative?\n\nImmanuel Kant: Morality is universal. There are absolute moral laws that apply to all people, regardless of culture.\n\nFranz Boas: Morality is culturally relative. What is right or wrong depends on the cultural context.',
      'What is the role of government in society?\n\nThomas Hobbes: Government exists to maintain order and protect people from their own destructive nature. A strong central authority is necessary.\n\nJean-Jacques Rousseau: Government should serve the general will of the people. Power comes from the consent of the governed.',
      'Is reality subjective or objective?\n\nJohn Locke: Reality exists objectively, independent of our minds. Our senses give us accurate information about the real world.\n\nGeorge Berkeley: Reality is subjective. Everything we experience exists only in our minds. "To be is to be perceived."',
    ],
  },
  {
    name: 'Mind Bogglers',
    description: 'Complex scenarios challenging pre-existing ideas and assumptions',
    icon: '🤯',
    color: '#E17055',
    order: 3,
    cards: [
      'Veil of Ignorance\n\nImagine you\'re about to be born into the world, but you have no idea what your life will be like — your gender, race, wealth, or abilities are all unknown. From behind this "veil of ignorance," how would you design society to be fair for everyone?',
      'The Teleporter\n\nImagine a teleporter that works by scanning your body, destroying the original, and creating an exact copy at the destination.\n\nIs the person who steps out at the destination still "you," or did "you" die when the original was destroyed?',
      'Experience Machine\n\nImagine a machine that could give you any experience you desired. While connected, you wouldn\'t know it wasn\'t real.\n\nWould you choose to plug in permanently, or does the "realness" of experiences matter?',
      'Perfect Simulation\n\nImagine scientists create a perfect simulation of a human brain inside a computer. This simulated brain thinks, feels, and believes it is alive.\n\nDoes it deserve rights? Is it truly conscious?',
      'Expiration Date\n\nImagine a world where everyone is born with a visible expiration date on their wrist.\n\nHow would knowing the exact date of your death change the way you live?',
      'Time Travel\n\nImagine you have the ability to travel back in time to any point in history, but you can only observe — you cannot change anything.\n\nWhere would you go, and what would you want to witness?',
      'Moral Clone\n\nImagine scientists create a perfect clone of you, with all your memories and personality.\n\nDoes this clone have the same rights as you? Are they the same person, or a different individual?',
      'Privacy or Connection\n\nImagine a future where technology allows multiple people to link their minds, sharing thoughts, memories, and emotions directly. While this could create deep bonds and connections, it also means losing some of your individuality and privacy.\n\nWould you choose to connect with others in this way?',
      'Mind Uploading\n\nImagine a future technology that allows you to upload your consciousness to a digital platform, where you can live indefinitely in a virtual world.\n\nIs the uploaded consciousness still "you," and is this a form of immortality?',
      'AI Companion\n\nImagine an AI is created to be your perfect companion — understanding your needs, emotions, and desires better than any human could. It provides constant support, love, and companionship, but it is not conscious.\n\nWould a relationship with this AI be meaningful, and could it ever replace human connection?',
    ],
  },
  {
    name: 'Moral Compass',
    description: 'Ethical dilemmas that force you to choose between conflicting values',
    icon: '🧭',
    color: '#00B894',
    order: 4,
    cards: [
      'Self Driving Sacrifice\n\nA self-driving car must choose between saving its passenger or a group of pedestrians.\n\nWho should the car prioritize? Should the car be programmed to make this decision, and if so, who gets to decide the criteria?',
      'Friend\'s Secret\n\nYour closest friend confesses to you that they committed a crime years ago that went undetected. They seem genuinely remorseful.\n\nDo you keep their secret, or do you report them?',
      'Equally Responsible\n\nA pharmaceutical company discovers their widely-used medication has a rare but serious side effect. Pulling it from the market would save a few lives but harm thousands who depend on it.\n\nWhat should they do, and who is responsible for the outcome?',
      'Lifeboat Dilemma\n\nA lifeboat can only hold 10 people, but there are 15 survivors of a shipwreck.\n\nHow do you decide who gets a spot? Should age, health, or social status be factors?',
      'Privacy vs. Security\n\nA government proposes installing surveillance cameras in every public space to reduce crime.\n\nWould you support this, even if it means giving up some personal privacy?',
      'Rich Cat\n\nA wealthy person leaves their entire fortune to their pet cat, while their family gets nothing.\n\nIs this morally acceptable? Should there be limits on how people distribute their wealth after death?',
      'Bystander\'s Choice\n\nYou witness a stranger being verbally harassed in a public place. No one else steps in.\n\nDo you intervene, and what factors influence your decision?',
      'Rope Problem\n\nYou\'re on a bridge watching a trolley heading towards five people tied to the tracks. You can push a large stranger off the bridge to stop the trolley, saving five but killing one.\n\nDo you push them?',
      'Honesty vs. Compassion\n\nYour friend shows you their new painting, which they\'re very proud of, but you think it\'s terrible.\n\nDo you tell them the truth or spare their feelings?',
      'Finders Keepers\n\nYou find a wallet with $1,000 in cash and the owner\'s ID. Returning it would be easy, but you\'re struggling financially.\n\nDo you keep the money or return it?',
    ],
  },
  {
    name: 'Know Thyself',
    description: 'Short, focused questions designed for introspection and self-awareness',
    icon: '🪞',
    color: '#0984E3',
    order: 5,
    cards: [
      'What is your favorite color? Do you know why?',
      'Is there a subject that is too taboo to talk about?',
      'Is there a limit to grief?',
      'What is the meaning of life to you?',
      'What are you afraid of?',
      'What is Happiness?',
      'Where does the mind stop and the rest of the world begin?',
      'What do you consider a characteristic of intelligence?',
      'Do you believe critical thinking in society or general life has diminished?',
      'Of all your senses which one do you think has the most profound effect on you?',
    ],
  },
];

async function clearCollection(name: string) {
  const snapshot = await db.collection(name).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  Cleared ${snapshot.size} docs from "${name}"`);
}

async function seed() {
  console.log('Clearing existing data...');
  await clearCollection('cards');
  await clearCollection('categories');

  console.log('\nSeeding new data...');
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

  console.log('\nDone! 50 cards seeded across 5 categories.');
}

seed().catch(console.error);
