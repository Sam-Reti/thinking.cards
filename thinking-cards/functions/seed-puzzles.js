/**
 * One-time seed script: adds 20 new logic-matrix puzzles and
 * patches the 3 existing ones with a difficulty label.
 *
 * Usage:  node seed-puzzles.js
 */
const admin = require('firebase-admin');
if (admin.apps.length === 0) admin.initializeApp({ projectId: 'thinking-cards' });
const db = admin.firestore();

const CATEGORY_ID = '0Ser5Ko3vSvdCThoP4jb';
const COLLECTION = 'cards';

// ─── helpers ──────────────────────────────────────────────────
function g(name, items, labels) {
  return { name, items, labels: labels ?? items };
}

function sol(entries) {
  // entries: [[key, {GroupName: item, …}], …]
  return Object.fromEntries(entries);
}

// ─── existing puzzle patches (add difficulty only) ───────────
const existingPatches = [
  { cardNumber: 1, difficulty: 'Easy' },   // Coffee Run
  { cardNumber: 2, difficulty: 'Easy' },   // Purpose of Art
  { cardNumber: 3, difficulty: 'Medium' }, // Suspect Lineup
];

// ─── new puzzles ─────────────────────────────────────────────

const newPuzzles = [

  // ============================================================
  //  EASY  (3×3, 5-6 direct clues)  —  cards 4-8
  // ============================================================

  {
    cardNumber: 4,
    difficulty: 'Easy',
    questionText: 'Breakfast Orders',
    matrixScenario:
      'Maya, Oliver, and Priya each ordered a different drink and a different breakfast item at the café. Figure out who had what.',
    matrixGroups: [
      g('Person', ['Maya', 'Oliver', 'Priya']),
      g('Drink', ['Coffee', 'Tea', 'Juice']),
      g('Food', ['Toast', 'Pancakes', 'Oatmeal']),
    ],
    matrixClues: [
      'Maya ordered coffee.',
      'The person who had tea also had pancakes.',
      'Oliver didn\'t have oatmeal.',
      'Priya didn\'t have juice.',
      'The toast eater had juice.',
    ],
    matrixSolution: sol([
      ['Maya', { Drink: 'Coffee', Food: 'Oatmeal' }],
      ['Oliver', { Drink: 'Juice', Food: 'Toast' }],
      ['Priya', { Drink: 'Tea', Food: 'Pancakes' }],
    ]),
    matrixExplanation: [
      'Clue 1: Maya → Coffee.',
      'That leaves Tea and Juice for Oliver and Priya.',
      'Clue 4: Priya ≠ Juice → Priya → Tea, Oliver → Juice.',
      'Clue 2: Tea → Pancakes → Priya → Pancakes.',
      'Clue 5: Toast → Juice → Oliver → Toast.',
      'Maya gets the remaining food: Oatmeal.',
    ],
  },

  {
    cardNumber: 5,
    difficulty: 'Easy',
    questionText: 'Movie Night',
    matrixScenario:
      'Alex, Blake, and Casey each picked a different genre and brought a different snack. Match them up.',
    matrixGroups: [
      g('Friend', ['Alex', 'Blake', 'Casey']),
      g('Genre', ['Comedy', 'Horror', 'Action']),
      g('Snack', ['Popcorn', 'Nachos', 'Candy']),
    ],
    matrixClues: [
      'Alex picked the comedy.',
      'The horror fan brought nachos.',
      'Casey didn\'t bring popcorn.',
      'Blake didn\'t watch the action movie.',
      'The popcorn was paired with the comedy.',
    ],
    matrixSolution: sol([
      ['Alex', { Genre: 'Comedy', Snack: 'Popcorn' }],
      ['Blake', { Genre: 'Horror', Snack: 'Nachos' }],
      ['Casey', { Genre: 'Action', Snack: 'Candy' }],
    ]),
    matrixExplanation: [
      'Clue 1: Alex → Comedy.',
      'Clue 5: Comedy → Popcorn → Alex → Popcorn.',
      'Clue 4: Blake ≠ Action. Alex = Comedy → Blake → Horror.',
      'Clue 2: Horror → Nachos → Blake → Nachos.',
      'Casey gets Action and Candy by elimination.',
    ],
  },

  {
    cardNumber: 6,
    difficulty: 'Easy',
    questionText: 'Garden Plots',
    matrixScenario:
      'Rosa, Felix, and June each grew a different flower using a different tool. Who used what?',
    matrixGroups: [
      g('Gardener', ['Rosa', 'Felix', 'June']),
      g('Flower', ['Roses', 'Tulips', 'Daisies']),
      g('Tool', ['Trowel', 'Shears', 'Rake']),
    ],
    matrixClues: [
      'Rosa did not grow roses (despite her name).',
      'The person who grew tulips used the shears.',
      'Felix used the rake.',
      'June didn\'t grow tulips.',
      'The trowel was used by the rose grower.',
    ],
    matrixSolution: sol([
      ['Rosa', { Flower: 'Tulips', Tool: 'Shears' }],
      ['Felix', { Flower: 'Daisies', Tool: 'Rake' }],
      ['June', { Flower: 'Roses', Tool: 'Trowel' }],
    ]),
    matrixExplanation: [
      'Clue 3: Felix → Rake.',
      'Clue 2: Tulips → Shears (not Rake) → Felix ≠ Tulips.',
      'Clue 4: June ≠ Tulips → Rosa → Tulips → Shears (clue 2).',
      'Clue 1: Rosa ≠ Roses. Rosa → Tulips. So June → Roses.',
      'Felix → Daisies. Clue 5: Roses → Trowel → June → Trowel.',
    ],
  },

  {
    cardNumber: 7,
    difficulty: 'Easy',
    questionText: 'Bus Stop',
    matrixScenario:
      'Dana, Eli, and Fran are waiting at the bus stop. Each is going to a different place and carrying a different bag.',
    matrixGroups: [
      g('Commuter', ['Dana', 'Eli', 'Fran']),
      g('Destination', ['Office', 'Gym', 'Library']),
      g('Item', ['Backpack', 'Briefcase', 'Tote bag'], ['Backpack', 'Briefcase', 'Tote']),
    ],
    matrixClues: [
      'Dana was heading to the gym.',
      'The person going to the office carried a briefcase.',
      'Fran didn\'t carry the backpack.',
      'Eli wasn\'t going to the library.',
      'The gym-goer brought a backpack.',
    ],
    matrixSolution: sol([
      ['Dana', { Destination: 'Gym', Item: 'Backpack' }],
      ['Eli', { Destination: 'Office', Item: 'Briefcase' }],
      ['Fran', { Destination: 'Library', Item: 'Tote bag' }],
    ]),
    matrixExplanation: [
      'Clue 1: Dana → Gym.',
      'Clue 5: Gym → Backpack → Dana → Backpack.',
      'Clue 4: Eli ≠ Library. Dana = Gym → Eli → Office.',
      'Clue 2: Office → Briefcase → Eli → Briefcase.',
      'Fran → Library and Tote bag by elimination.',
    ],
  },

  {
    cardNumber: 8,
    difficulty: 'Easy',
    questionText: 'Pet Adoption Day',
    matrixScenario:
      'The Johnsons, Garcias, and Lees each adopted a different pet and chose a different name for it.',
    matrixGroups: [
      g('Family', ['Johnsons', 'Garcias', 'Lees']),
      g('Pet', ['Cat', 'Dog', 'Rabbit']),
      g('Name', ['Buddy', 'Whiskers', 'Clover']),
    ],
    matrixClues: [
      'The Garcias adopted the dog.',
      'The cat was named Whiskers.',
      'The Lees did not name their pet Buddy.',
      'The rabbit was named Clover.',
      'The Johnsons did not adopt the rabbit.',
    ],
    matrixSolution: sol([
      ['Johnsons', { Pet: 'Cat', Name: 'Whiskers' }],
      ['Garcias', { Pet: 'Dog', Name: 'Buddy' }],
      ['Lees', { Pet: 'Rabbit', Name: 'Clover' }],
    ]),
    matrixExplanation: [
      'Clue 1: Garcias → Dog.',
      'Clue 2: Cat → Whiskers. Clue 4: Rabbit → Clover.',
      'The remaining name Buddy → Dog → Garcias.',
      'Clue 5: Johnsons ≠ Rabbit → Johnsons → Cat → Whiskers.',
      'Lees → Rabbit → Clover. Clue 3 confirms: Lees ≠ Buddy ✓.',
    ],
  },

  // ============================================================
  //  MEDIUM  (4×4, 6-7 clues with elimination chains)  —  cards 9-13
  // ============================================================

  {
    cardNumber: 9,
    difficulty: 'Medium',
    questionText: 'Food Truck Festival',
    matrixScenario:
      'Ana, Ben, Cora, and Dev each ate at a different food truck and had a different drink. Match every person to their truck and drink.',
    matrixGroups: [
      g('Friend', ['Ana', 'Ben', 'Cora', 'Dev']),
      g('Truck', ['Tacos', 'Burgers', 'Sushi', 'Pizza']),
      g('Drink', ['Lemonade', 'Cola', 'Water', 'Iced tea'], ['Lemon.', 'Cola', 'Water', 'Iced tea']),
    ],
    matrixClues: [
      'Ana ate at the taco truck.',
      'The person who had sushi drank iced tea.',
      'Ben drank lemonade.',
      'Cora didn\'t eat pizza or burgers.',
      'Dev didn\'t drink water.',
      'The burger lover drank cola.',
    ],
    matrixSolution: sol([
      ['Ana', { Truck: 'Tacos', Drink: 'Water' }],
      ['Ben', { Truck: 'Pizza', Drink: 'Lemonade' }],
      ['Cora', { Truck: 'Sushi', Drink: 'Iced tea' }],
      ['Dev', { Truck: 'Burgers', Drink: 'Cola' }],
    ]),
    matrixExplanation: [
      'Clue 1: Ana → Tacos.',
      'Clue 4: Cora ≠ Pizza, ≠ Burgers, ≠ Tacos (Ana) → Cora → Sushi.',
      'Clue 2: Sushi → Iced tea → Cora → Iced tea.',
      'Clue 6: Burgers → Cola.',
      'Clue 3: Ben → Lemonade (≠ Cola) → Ben ≠ Burgers.',
      'Clue 5: Dev ≠ Water. Remaining trucks: Burgers & Pizza for Ben & Dev.',
      'Ben ≠ Burgers → Ben → Pizza. Dev → Burgers → Cola.',
      'Ana → Water by elimination.',
    ],
  },

  {
    cardNumber: 10,
    difficulty: 'Medium',
    questionText: 'Science Fair',
    matrixScenario:
      'Mia, Noah, Ava, and Leo each presented a different project with a different colored display board.',
    matrixGroups: [
      g('Student', ['Mia', 'Noah', 'Ava', 'Leo']),
      g('Project', ['Volcano', 'Robot', 'Plants', 'Crystals']),
      g('Color', ['Red', 'Blue', 'Green', 'Yellow']),
    ],
    matrixClues: [
      'Mia\'s board was green.',
      'The robot project had a blue board.',
      'Noah didn\'t build the robot or grow crystals.',
      'Ava did the plant project.',
      'Leo\'s board wasn\'t red or yellow.',
      'The volcano project used a red board.',
    ],
    matrixSolution: sol([
      ['Mia', { Project: 'Crystals', Color: 'Green' }],
      ['Noah', { Project: 'Volcano', Color: 'Red' }],
      ['Ava', { Project: 'Plants', Color: 'Yellow' }],
      ['Leo', { Project: 'Robot', Color: 'Blue' }],
    ]),
    matrixExplanation: [
      'Clue 5: Leo ≠ Red, ≠ Yellow, and Mia = Green → Leo → Blue.',
      'Clue 2: Robot → Blue → Leo → Robot.',
      'Clue 4: Ava → Plants.',
      'Clue 3: Noah ≠ Robot (Leo), ≠ Crystals → Noah → Volcano.',
      'Mia → Crystals by elimination.',
      'Clue 6: Volcano → Red → Noah → Red.',
      'Clue 1: Mia → Green. Ava → Yellow by elimination.',
    ],
  },

  {
    cardNumber: 11,
    difficulty: 'Medium',
    questionText: 'Hotel Check-In',
    matrixScenario:
      'Four guests — Mr. Park, Ms. Quinn, Dr. Reyes, and Prof. Shah — each checked into a different floor and a different room type.',
    matrixGroups: [
      g('Guest', ['Mr. Park', 'Ms. Quinn', 'Dr. Reyes', 'Prof. Shah'], ['Park', 'Quinn', 'Reyes', 'Shah']),
      g('Floor', ['1st', '2nd', '3rd', '4th']),
      g('Room', ['Single', 'Double', 'Suite', 'Penthouse'], ['Single', 'Double', 'Suite', 'Penth.']),
    ],
    matrixClues: [
      'Dr. Reyes stayed on the 3rd floor.',
      'The penthouse was on the 4th floor.',
      'Ms. Quinn did not stay in the single room.',
      'Mr. Park stayed on a higher floor than Prof. Shah.',
      'The suite was on the 1st floor.',
      'Prof. Shah did not stay in the double room.',
      'Ms. Quinn stayed on the 2nd floor.',
    ],
    matrixSolution: sol([
      ['Mr. Park', { Floor: '4th', Room: 'Penthouse' }],
      ['Ms. Quinn', { Floor: '2nd', Room: 'Double' }],
      ['Dr. Reyes', { Floor: '3rd', Room: 'Single' }],
      ['Prof. Shah', { Floor: '1st', Room: 'Suite' }],
    ]),
    matrixExplanation: [
      'Clue 1: Reyes → 3rd. Clue 7: Quinn → 2nd.',
      'Remaining floors 1st & 4th go to Park and Shah.',
      'Clue 4: Park > Shah → Park → 4th, Shah → 1st.',
      'Clue 2: Penthouse → 4th → Park → Penthouse.',
      'Clue 5: Suite → 1st → Shah → Suite.',
      'Clue 6: Shah ≠ Double ✓ (Suite). Clue 3: Quinn ≠ Single → Quinn → Double.',
      'Reyes → Single by elimination.',
    ],
  },

  {
    cardNumber: 12,
    difficulty: 'Medium',
    questionText: 'Airport Gate',
    matrixScenario:
      'Kenji, Lucia, Omar, and Petra are at the airport. Each is flying to a different city and carrying a different bag.',
    matrixGroups: [
      g('Passenger', ['Kenji', 'Lucia', 'Omar', 'Petra']),
      g('Destination', ['Paris', 'Tokyo', 'Cairo', 'Sydney']),
      g('Carry-on', ['Laptop bag', 'Rolling case', 'Duffel', 'Backpack'], ['Laptop', 'Rolling', 'Duffel', 'Backpack']),
    ],
    matrixClues: [
      'Kenji was not flying to Tokyo.',
      'The passenger going to Paris carried a rolling case.',
      'Omar brought a laptop bag.',
      'Petra was flying to Sydney.',
      'The Cairo-bound passenger carried a duffel.',
      'Lucia didn\'t bring a backpack.',
      'Kenji wasn\'t going to Cairo.',
    ],
    matrixSolution: sol([
      ['Kenji', { Destination: 'Paris', 'Carry-on': 'Rolling case' }],
      ['Lucia', { Destination: 'Cairo', 'Carry-on': 'Duffel' }],
      ['Omar', { Destination: 'Tokyo', 'Carry-on': 'Laptop bag' }],
      ['Petra', { Destination: 'Sydney', 'Carry-on': 'Backpack' }],
    ]),
    matrixExplanation: [
      'Clue 4: Petra → Sydney.',
      'Clue 1: Kenji ≠ Tokyo. Clue 7: Kenji ≠ Cairo → Kenji → Paris.',
      'Clue 2: Paris → Rolling case → Kenji → Rolling case.',
      'Clue 3: Omar → Laptop bag. Paris needs Rolling case ≠ Laptop bag → Omar ≠ Paris.',
      'Clue 5: Cairo → Duffel ≠ Laptop bag → Omar ≠ Cairo → Omar → Tokyo.',
      'Lucia → Cairo → Duffel. Clue 6: Lucia ≠ Backpack ✓.',
      'Petra → Backpack by elimination.',
    ],
  },

  {
    cardNumber: 13,
    difficulty: 'Medium',
    questionText: 'Book Club Picks',
    matrixScenario:
      'Grace, Henry, Iris, and Jack each chose a different genre and arrived with a different hot beverage.',
    matrixGroups: [
      g('Member', ['Grace', 'Henry', 'Iris', 'Jack']),
      g('Genre', ['Mystery', 'Romance', 'Sci-fi', 'Thriller']),
      g('Beverage', ['Coffee', 'Tea', 'Hot cocoa', 'Chai'], ['Coffee', 'Tea', 'Cocoa', 'Chai']),
    ],
    matrixClues: [
      'Grace chose the mystery novel.',
      'The thriller reader drank chai.',
      'Henry didn\'t drink coffee or tea.',
      'Iris didn\'t choose the thriller.',
      'Jack drank coffee.',
      'The sci-fi reader had hot cocoa.',
      'The mystery reader drank tea.',
    ],
    matrixSolution: sol([
      ['Grace', { Genre: 'Mystery', Beverage: 'Tea' }],
      ['Henry', { Genre: 'Thriller', Beverage: 'Chai' }],
      ['Iris', { Genre: 'Sci-fi', Beverage: 'Hot cocoa' }],
      ['Jack', { Genre: 'Romance', Beverage: 'Coffee' }],
    ]),
    matrixExplanation: [
      'Clue 1: Grace → Mystery. Clue 7: Mystery → Tea → Grace → Tea.',
      'Clue 5: Jack → Coffee.',
      'Clue 2: Thriller → Chai. Clue 6: Sci-fi → Hot cocoa.',
      'Jack has Coffee, which matches neither Chai nor Hot cocoa → Jack ≠ Thriller, ≠ Sci-fi → Jack → Romance.',
      'Clue 4: Iris ≠ Thriller → Iris → Sci-fi → Hot cocoa.',
      'Henry → Thriller → Chai. Clue 3: Henry ≠ Coffee, ≠ Tea ✓.',
    ],
  },

  // ============================================================
  //  HARD  (4×4, 7-8 clues, multi-step deductions)  —  cards 14-18
  // ============================================================

  {
    cardNumber: 14,
    difficulty: 'Hard',
    questionText: 'Neighborhood Yard Sales',
    matrixScenario:
      'Four houses on the street each held a yard sale with one featured item at a set price. Determine which house sold what and for how much.',
    matrixGroups: [
      g('House', ['Red house', 'Blue house', 'Yellow house', 'White house'], ['Red', 'Blue', 'Yellow', 'White']),
      g('Item', ['Bicycle', 'Lamp', 'Guitar', 'Bookshelf'], ['Bicycle', 'Lamp', 'Guitar', 'Bookshelf']),
      g('Price', ['$5', '$10', '$20', '$50']),
    ],
    matrixClues: [
      'The bicycle cost more than the lamp.',
      'The red house sold the most expensive item.',
      'The guitar was at the yellow house.',
      'The blue house item cost $10.',
      'The bookshelf was not the cheapest item.',
      'The white house didn\'t sell the guitar or the bicycle.',
      'The lamp was cheaper than the bookshelf.',
      'The bicycle cost more than the bookshelf.',
    ],
    matrixSolution: sol([
      ['Red house', { Item: 'Bicycle', Price: '$50' }],
      ['Blue house', { Item: 'Bookshelf', Price: '$10' }],
      ['Yellow house', { Item: 'Guitar', Price: '$20' }],
      ['White house', { Item: 'Lamp', Price: '$5' }],
    ]),
    matrixExplanation: [
      'Clue 2: Red house → $50. Clue 4: Blue house → $10.',
      'Clue 3: Guitar → Yellow house. Clue 6: White ≠ Guitar, ≠ Bicycle → White → Lamp or Bookshelf.',
      'Clue 7: Lamp < Bookshelf. Clue 1: Lamp < Bicycle. Clue 8: Bicycle > Bookshelf.',
      'So ordering is: Lamp < Bookshelf < Bicycle. With prices $5, $10, $20, $50.',
      'Lamp = $5 (cheapest). Clue 5: Bookshelf ≠ $5 ✓.',
      'White → Lamp ($5). Red ($50) → Bicycle (most expensive, and Bicycle is the priciest item).',
      'Blue ($10) → Bookshelf. Yellow → Guitar → $20.',
    ],
  },

  {
    cardNumber: 15,
    difficulty: 'Hard',
    questionText: 'Music Festival Lineup',
    matrixScenario:
      'Four bands played at a festival, each on a different stage at a different time. Work out the full schedule.',
    matrixGroups: [
      g('Band', ['The Echoes', 'Neon Pulse', 'Velvet Storm', 'Iron Drift'], ['Echoes', 'Neon', 'Velvet', 'Iron']),
      g('Stage', ['Main', 'North', 'South', 'East']),
      g('Time', ['2 PM', '4 PM', '6 PM', '8 PM']),
    ],
    matrixClues: [
      'Velvet Storm played on the Main stage.',
      'The 8 PM act performed on the North stage.',
      'Iron Drift played earlier than The Echoes.',
      'Neon Pulse didn\'t play at 2 PM or 8 PM.',
      'The South stage act played at 2 PM.',
      'Iron Drift was not on the East stage.',
      'The Echoes didn\'t play on the Main stage.',
      'Neon Pulse played later than the Main stage act.',
    ],
    matrixSolution: sol([
      ['The Echoes', { Stage: 'North', Time: '8 PM' }],
      ['Neon Pulse', { Stage: 'East', Time: '6 PM' }],
      ['Velvet Storm', { Stage: 'Main', Time: '4 PM' }],
      ['Iron Drift', { Stage: 'South', Time: '2 PM' }],
    ]),
    matrixExplanation: [
      'Clue 2: North → 8 PM. Clue 5: South → 2 PM. Remaining: Main & East → 4 PM & 6 PM.',
      'Clue 8: Neon Pulse later than Main act. If Main = 6 PM, Neon > 6 PM → 8 PM only, but clue 4 says Neon ≠ 8 PM. Contradiction → Main = 4 PM, East = 6 PM.',
      'Clue 1: Velvet Storm → Main → 4 PM.',
      'Clue 8: Neon > 4 PM. Clue 4: Neon ≠ 2 PM, ≠ 8 PM → Neon → 6 PM → East.',
      'Remaining: Echoes & Iron Drift for North (8 PM) & South (2 PM).',
      'Clue 3: Iron Drift earlier than Echoes → Iron Drift → 2 PM (South), Echoes → 8 PM (North).',
    ],
  },

  {
    cardNumber: 16,
    difficulty: 'Hard',
    questionText: 'Office Secret Santa',
    matrixScenario:
      'Alice, Bob, Carol, and Dan each received a different gift in different colored wrapping. Figure out who got what.',
    matrixGroups: [
      g('Employee', ['Alice', 'Bob', 'Carol', 'Dan']),
      g('Gift', ['Candle', 'Mug', 'Scarf', 'Puzzle box'], ['Candle', 'Mug', 'Scarf', 'Puzzle']),
      g('Wrapping', ['Gold', 'Silver', 'Red', 'Green']),
    ],
    matrixClues: [
      'Bob\'s gift was wrapped in silver.',
      'The scarf was not wrapped in gold or green.',
      'Alice didn\'t receive the candle or puzzle box.',
      'The mug was wrapped in green.',
      'Carol received the puzzle box.',
      'Dan\'s gift wasn\'t wrapped in red.',
      'The candle was wrapped in gold.',
      'Alice\'s gift wasn\'t wrapped in silver.',
    ],
    matrixSolution: sol([
      ['Alice', { Gift: 'Mug', Wrapping: 'Green' }],
      ['Bob', { Gift: 'Scarf', Wrapping: 'Silver' }],
      ['Carol', { Gift: 'Puzzle box', Wrapping: 'Red' }],
      ['Dan', { Gift: 'Candle', Wrapping: 'Gold' }],
    ]),
    matrixExplanation: [
      'Clue 7: Candle → Gold. Clue 4: Mug → Green.',
      'Clue 2: Scarf ≠ Gold, ≠ Green → Scarf → Silver or Red.',
      'Puzzle box → remaining wrapping.',
      'Clue 1: Bob → Silver. If Scarf → Silver → Bob → Scarf.',
      'If Scarf → Red → Puzzle box → Silver. But Bob → Silver → Bob → Puzzle box. Clue 5: Carol → Puzzle box. Contradiction → Scarf → Silver → Bob → Scarf.',
      'Puzzle box → Red. Clue 5: Carol → Puzzle box → Red.',
      'Clue 3: Alice ≠ Candle, ≠ Puzzle box → Alice → Mug → Green. Clue 8: Alice ≠ Silver ✓.',
      'Dan → Candle → Gold. Clue 6: Dan ≠ Red ✓.',
    ],
  },

  {
    cardNumber: 17,
    difficulty: 'Hard',
    questionText: 'Marathon Finishers',
    matrixScenario:
      'Kai, Lena, Marco, and Nina finished a marathon in four consecutive places. Each runner represents a different country.',
    matrixGroups: [
      g('Runner', ['Kai', 'Lena', 'Marco', 'Nina']),
      g('Country', ['Japan', 'Kenya', 'Brazil', 'Norway']),
      g('Finish', ['1st', '2nd', '3rd', '4th']),
    ],
    matrixClues: [
      'The runner from Kenya finished in the top two.',
      'Marco didn\'t finish 1st or 4th.',
      'Lena finished exactly one position ahead of Kai.',
      'The Norwegian runner finished last.',
      'Nina was from Brazil.',
      'Marco wasn\'t from Japan.',
      'Kai didn\'t finish 2nd.',
    ],
    matrixSolution: sol([
      ['Kai', { Country: 'Norway', Finish: '4th' }],
      ['Lena', { Country: 'Japan', Finish: '3rd' }],
      ['Marco', { Country: 'Kenya', Finish: '2nd' }],
      ['Nina', { Country: 'Brazil', Finish: '1st' }],
    ]),
    matrixExplanation: [
      'Clue 3: Lena is exactly one ahead of Kai. Possible pairs: (1st,2nd), (2nd,3rd), (3rd,4th).',
      'Clue 7: Kai ≠ 2nd → rules out Lena=1st/Kai=2nd.',
      'Clue 2: Marco = 2nd or 3rd.',
      'Try Lena=2nd, Kai=3rd → Marco must be 2nd or 3rd (both taken). Contradiction.',
      'So Lena=3rd, Kai=4th. Marco → 2nd (clue 2). Nina → 1st.',
      'Clue 4: Norwegian → 4th → Kai → Norway.',
      'Clue 5: Nina → Brazil. Clue 1: Kenya → top two → Nina(1st) or Marco(2nd). Nina = Brazil → Marco → Kenya.',
      'Lena → Japan by elimination. Clue 6: Marco ≠ Japan ✓.',
    ],
  },

  {
    cardNumber: 18,
    difficulty: 'Hard',
    questionText: 'Art Gallery Opening',
    matrixScenario:
      'Four artists — Yuki, Dante, Freya, and Leon — each displayed a piece in a different medium with a different theme.',
    matrixGroups: [
      g('Artist', ['Yuki', 'Dante', 'Freya', 'Leon']),
      g('Medium', ['Oil', 'Watercolor', 'Sculpture', 'Digital']),
      g('Theme', ['Nature', 'City', 'Abstract', 'Portrait']),
    ],
    matrixClues: [
      'Yuki works in watercolor and chose a nature theme.',
      'The sculpture depicted a city theme.',
      'Dante chose the portrait theme.',
      'Freya didn\'t work in oil.',
      'Leon didn\'t work in digital.',
      'The oil painting was not abstract.',
      'Dante didn\'t create a sculpture.',
      'Freya didn\'t choose the city theme.',
    ],
    matrixSolution: sol([
      ['Yuki', { Medium: 'Watercolor', Theme: 'Nature' }],
      ['Dante', { Medium: 'Oil', Theme: 'Portrait' }],
      ['Freya', { Medium: 'Digital', Theme: 'Abstract' }],
      ['Leon', { Medium: 'Sculpture', Theme: 'City' }],
    ]),
    matrixExplanation: [
      'Clue 1: Yuki → Watercolor, Nature.',
      'Clue 2: Sculpture → City. Clue 3: Dante → Portrait.',
      'Remaining mediums: Oil, Sculpture, Digital for Dante, Freya, Leon.',
      'Clue 7: Dante ≠ Sculpture. Clue 4: Freya ≠ Oil. Clue 5: Leon ≠ Digital.',
      'Try Dante → Digital → but Digital\'s theme? Clue 3: Dante = Portrait. If Dante = Digital, theme could be Portrait.',
      'Then Freya → Sculpture or Oil. Freya ≠ Oil → Freya → Sculpture → City (clue 2). But clue 8: Freya ≠ City. Contradiction.',
      'So Dante → Oil. Clue 6: Oil ≠ Abstract → Dante Oil = Portrait ✓.',
      'Remaining: Sculpture, Digital for Freya, Leon. Leon ≠ Digital → Leon → Sculpture → City.',
      'Freya → Digital → Abstract. Clue 8: Freya ≠ City ✓.',
    ],
  },

  // ============================================================
  //  EXTREME  (5×5 or tricky 4×4, complex reasoning)  —  cards 19-23
  // ============================================================

  {
    cardNumber: 19,
    difficulty: 'Extreme',
    questionText: 'International Chef Competition',
    matrixScenario:
      'Five chefs from around the world each prepared a dish from a different cuisine and was assigned a different course. Determine the full lineup.',
    matrixGroups: [
      g('Chef', ['Amara', 'Bruno', 'Chen', 'Diana', 'Erik']),
      g('Cuisine', ['Italian', 'Japanese', 'Mexican', 'Indian', 'French']),
      g('Course', ['Appetizer', 'Soup', 'Salad', 'Main', 'Dessert']),
    ],
    matrixClues: [
      'Chen prepared the Japanese cuisine.',
      'The Italian dish was a main course.',
      'Bruno didn\'t make the appetizer or dessert.',
      'The French chef made a soup.',
      'Amara didn\'t cook Mexican or Indian.',
      'Diana made the salad.',
      'Erik didn\'t cook Italian or Japanese.',
      'The Mexican dish was a dessert.',
      'Bruno didn\'t cook French.',
    ],
    matrixSolution: sol([
      ['Amara', { Cuisine: 'French', Course: 'Soup' }],
      ['Bruno', { Cuisine: 'Italian', Course: 'Main' }],
      ['Chen', { Cuisine: 'Japanese', Course: 'Appetizer' }],
      ['Diana', { Cuisine: 'Indian', Course: 'Salad' }],
      ['Erik', { Cuisine: 'Mexican', Course: 'Dessert' }],
    ]),
    matrixExplanation: [
      'Clue 6: Diana → Salad. Cuisine-Course links: Italian→Main (2), French→Soup (4), Mexican→Dessert (8).',
      'The remaining courses Appetizer & Salad go to Japanese & Indian.',
      'Diana → Salad. Chen → Japanese (1). If Japanese → Salad, then Chen → Salad = Diana. Contradiction → Japanese → Appetizer, Indian → Salad.',
      'So Diana → Indian → Salad. Chen → Japanese → Appetizer.',
      'Clue 3: Bruno ≠ Appetizer, ≠ Dessert → Bruno → Soup or Main.',
      'Clue 9: Bruno ≠ French. French → Soup → Bruno ≠ Soup → Bruno → Main → Italian (clue 2).',
      'Clue 7: Erik ≠ Italian (Bruno), ≠ Japanese (Chen) → Erik → Mexican, French, or Indian (Diana). Erik → Mexican → Dessert.',
      'Amara → French → Soup. Clue 5: Amara ≠ Mexican, ≠ Indian ✓.',
    ],
  },

  {
    cardNumber: 20,
    difficulty: 'Extreme',
    questionText: 'Tech Conference Speakers',
    matrixScenario:
      'Five speakers at a tech conference each gave a talk on a different topic at a different time. Build the full schedule.',
    matrixGroups: [
      g('Speaker', ['Kim', 'Luis', 'Mei', 'Raj', 'Sara']),
      g('Topic', ['AI', 'Security', 'Cloud', 'DevOps', 'Data']),
      g('Slot', ['9 AM', '10 AM', '11 AM', '1 PM', '2 PM']),
    ],
    matrixClues: [
      'The AI talk was immediately before the Security talk.',
      'Mei spoke at 11 AM.',
      'Raj didn\'t speak about Cloud or Data.',
      'The DevOps talk was at 9 AM.',
      'Kim spoke later than Luis.',
      'Sara\'s topic was Data.',
      'Luis didn\'t give the AI talk.',
      'Kim didn\'t speak at 2 PM.',
      'The Cloud talk was after lunch (1 PM or 2 PM).',
    ],
    matrixSolution: sol([
      ['Kim', { Topic: 'Cloud', Slot: '1 PM' }],
      ['Luis', { Topic: 'DevOps', Slot: '9 AM' }],
      ['Mei', { Topic: 'Security', Slot: '11 AM' }],
      ['Raj', { Topic: 'AI', Slot: '10 AM' }],
      ['Sara', { Topic: 'Data', Slot: '2 PM' }],
    ]),
    matrixExplanation: [
      'Clue 4: DevOps → 9 AM. Clue 2: Mei → 11 AM.',
      'Clue 1: AI immediately before Security. Possible: (9,10), (10,11), (1,2). DevOps = 9 AM, so AI ≠ 9 AM.',
      'Options: AI=10 AM → Security=11 AM, or AI=1 PM → Security=2 PM.',
      'Clue 9: Cloud → 1 PM or 2 PM.',
      'Try AI=1 PM, Security=2 PM: Cloud also needs 1 PM or 2 PM — both taken. Contradiction.',
      'So AI=10 AM, Security=11 AM → Mei → Security.',
      'Clue 6: Sara → Data. Cloud → 1 PM or 2 PM. Remaining topics for 1 PM & 2 PM: Cloud & Data.',
      'Remaining people for 9 AM, 1 PM, 2 PM: Kim, Luis, Raj, Sara.',
      'Clue 3: Raj ≠ Cloud, ≠ Data → Raj → AI (10 AM) or DevOps (9 AM).',
      'Clue 7: Luis ≠ AI → Luis ≠ 10 AM. Try Raj → 10 AM (AI).',
      'Clue 5: Kim > Luis. Clue 8: Kim ≠ 2 PM. Sara → Data → 2 PM.',
      'Remaining: 9 AM, 1 PM for Kim & Luis. Kim > Luis → Luis → 9 AM, Kim → 1 PM.',
      'Luis → DevOps. Kim → Cloud.',
    ],
  },

  {
    cardNumber: 21,
    difficulty: 'Extreme',
    questionText: 'Antique Fair',
    matrixScenario:
      'Five antique dealers each brought a different item from a different decade. Determine who brought what and from when.',
    matrixGroups: [
      g('Dealer', ['Vera', 'Winston', 'Xena', 'Yosef', 'Zara']),
      g('Item', ['Clock', 'Vase', 'Mirror', 'Chest', 'Painting']),
      g('Decade', ['1920s', '1940s', '1960s', '1980s', '2000s']),
    ],
    matrixClues: [
      'The clock was from the 1940s.',
      'Xena\'s item was older than Winston\'s.',
      'Yosef brought the painting.',
      'Zara\'s item was from the 1980s.',
      'The mirror was from the 1920s.',
      'Vera didn\'t bring the chest or clock.',
      'Winston\'s item was from the 2000s.',
      'Xena didn\'t bring the vase.',
      'The chest was newer than the vase.',
    ],
    matrixSolution: sol([
      ['Vera', { Item: 'Mirror', Decade: '1920s' }],
      ['Winston', { Item: 'Chest', Decade: '2000s' }],
      ['Xena', { Item: 'Clock', Decade: '1940s' }],
      ['Yosef', { Item: 'Painting', Decade: '1960s' }],
      ['Zara', { Item: 'Vase', Decade: '1980s' }],
    ]),
    matrixExplanation: [
      'Clue 1: Clock → 1940s. Clue 5: Mirror → 1920s. Clue 7: Winston → 2000s. Clue 4: Zara → 1980s.',
      'Winston (2000s) ≠ Clock (1940s), ≠ Mirror (1920s) → Winston → Vase, Chest, or Painting.',
      'Zara (1980s) ≠ Clock (1940s), ≠ Mirror (1920s) → same.',
      'Clue 3: Yosef → Painting. Clue 6: Vera ≠ Chest, ≠ Clock → Vera → Vase or Mirror.',
      'Clue 8: Xena ≠ Vase → Xena → Clock, Mirror, or Chest.',
      'Try Vera → Vase. Then Mirror → Winston, Xena, or Zara. Winston=2000s ≠ 1920s, Zara=1980s ≠ 1920s → Xena → Mirror → 1920s.',
      'Remaining: Clock, Chest for Winston & Zara. Winston=2000s ≠ Clock(1940s) → Winston → Chest → 2000s, Zara → Clock → but Clock=1940s ≠ 1980s. Contradiction!',
      'So Vera → Mirror → 1920s. Remaining: Clock, Vase, Chest for Winston, Xena, Zara.',
      'Winston=2000s ≠ Clock(1940s). Xena ≠ Vase (8). If Xena → Clock → 1940s. Winston & Zara → Vase & Chest.',
      'Clue 9: Chest newer than Vase. Winston=2000s, Zara=1980s. Winston Chest(2000s) > Zara Vase(1980s) ✓. Reverse fails.',
      'Yosef → 1960s (remaining). Clue 2: Xena(1940s) older than Winston(2000s) ✓.',
    ],
  },

  {
    cardNumber: 22,
    difficulty: 'Extreme',
    questionText: 'Space Station Crew',
    matrixScenario:
      'Five astronauts on the International Space Station each have a different specialty and nationality. Identify the full crew roster.',
    matrixGroups: [
      g('Astronaut', ['Anya', 'Brooks', 'Chang', 'Diaz', 'Elan']),
      g('Specialty', ['Pilot', 'Engineer', 'Biologist', 'Geologist', 'Medic']),
      g('Nationality', ['American', 'Canadian', 'Chinese', 'Mexican', 'Russian']),
    ],
    matrixClues: [
      'The pilot is Russian.',
      'Chang is not Chinese (despite the name).',
      'Brooks is the engineer.',
      'Diaz is Mexican.',
      'Anya is not the biologist or the geologist.',
      'The Canadian crew member is the medic.',
      'Elan is not American or Russian.',
      'Chang is not the geologist.',
      'The biologist is American.',
    ],
    matrixSolution: sol([
      ['Anya', { Specialty: 'Pilot', Nationality: 'Russian' }],
      ['Brooks', { Specialty: 'Engineer', Nationality: 'Chinese' }],
      ['Chang', { Specialty: 'Biologist', Nationality: 'American' }],
      ['Diaz', { Specialty: 'Geologist', Nationality: 'Mexican' }],
      ['Elan', { Specialty: 'Medic', Nationality: 'Canadian' }],
    ]),
    matrixExplanation: [
      'Clue 3: Brooks → Engineer. Clue 4: Diaz → Mexican.',
      'Clue 1: Pilot → Russian. Clue 9: Biologist → American. Clue 6: Canadian → Medic.',
      'Diaz = Mexican ≠ Russian/American/Canadian → Diaz ≠ Pilot/Biologist/Medic. Also ≠ Engineer (Brooks) → Diaz → Geologist.',
      'Clue 7: Elan ≠ American, ≠ Russian → Elan ≠ Pilot (Russian), ≠ Biologist (American).',
      'Elan ≠ Engineer (Brooks), ≠ Geologist (Diaz) → Elan → Medic → Canadian.',
      'Clue 5: Anya ≠ Biologist, ≠ Geologist (Diaz). ≠ Engineer (Brooks), ≠ Medic (Elan) → Anya → Pilot → Russian.',
      'Chang → Biologist → American. Clue 2: Chang ≠ Chinese ✓. Clue 8: Chang ≠ Geologist ✓.',
      'Brooks → remaining nationality: Chinese.',
    ],
  },

  {
    cardNumber: 23,
    difficulty: 'Extreme',
    questionText: 'Wine Tasting Competition',
    matrixScenario:
      'Five judges at a wine tasting each evaluated a different wine from a different region. Match every judge to their wine and region.',
    matrixGroups: [
      g('Judge', ['Alain', 'Bianca', 'Claude', 'Delphine', 'Emile']),
      g('Wine', ['Merlot', 'Riesling', 'Pinot Noir', 'Chardonnay', 'Shiraz'], ['Merlot', 'Riesling', 'Pinot N.', 'Chard.', 'Shiraz']),
      g('Region', ['Bordeaux', 'Napa', 'Tuscany', 'Marlborough', 'Barossa'], ['Bordeaux', 'Napa', 'Tuscany', 'Marlb.', 'Barossa']),
    ],
    matrixClues: [
      'The Riesling came from Marlborough.',
      'The Chardonnay came from Napa.',
      'The Merlot was from Bordeaux.',
      'Delphine judged the Pinot Noir.',
      'Emile didn\'t judge the Riesling, Chardonnay, or Shiraz.',
      'Alain didn\'t judge the wine from Tuscany, Napa, or Marlborough.',
      'Claude didn\'t judge the wine from Barossa or Bordeaux.',
      'Bianca didn\'t judge the wine from Barossa or Marlborough.',
      'The Pinot Noir was not from Barossa.',
    ],
    matrixSolution: sol([
      ['Alain', { Wine: 'Shiraz', Region: 'Barossa' }],
      ['Bianca', { Wine: 'Chardonnay', Region: 'Napa' }],
      ['Claude', { Wine: 'Riesling', Region: 'Marlborough' }],
      ['Delphine', { Wine: 'Pinot Noir', Region: 'Tuscany' }],
      ['Emile', { Wine: 'Merlot', Region: 'Bordeaux' }],
    ]),
    matrixExplanation: [
      'Clues 1-3: Riesling→Marlborough, Chardonnay→Napa, Merlot→Bordeaux.',
      'Remaining wine-region pairs: Pinot Noir & Shiraz for Tuscany & Barossa.',
      'Clue 9: Pinot Noir ≠ Barossa → Pinot Noir → Tuscany, Shiraz → Barossa.',
      'Clue 4: Delphine → Pinot Noir → Tuscany.',
      'Clue 5: Emile ≠ Riesling, ≠ Chardonnay, ≠ Shiraz → Emile → Merlot or Pinot Noir. Pinot Noir = Delphine → Emile → Merlot → Bordeaux.',
      'Clue 6: Alain ≠ Tuscany, ≠ Napa, ≠ Marlborough. Tuscany=Delphine, Bordeaux=Emile → Alain → Barossa → Shiraz.',
      'Clue 7: Claude ≠ Barossa (Alain), ≠ Bordeaux (Emile). ≠ Tuscany (Delphine) → Claude → Napa or Marlborough.',
      'Clue 8: Bianca ≠ Barossa (Alain), ≠ Marlborough → Bianca → Napa → Chardonnay.',
      'Claude → Marlborough → Riesling.',
    ],
  },
];

// ─── main ────────────────────────────────────────────────────
async function run() {
  const batch = db.batch();

  // 1. Patch existing puzzles with difficulty
  for (const patch of existingPatches) {
    const snap = await db
      .collection(COLLECTION)
      .where('categoryId', '==', CATEGORY_ID)
      .where('cardNumber', '==', patch.cardNumber)
      .limit(1)
      .get();
    if (snap.empty) {
      console.log(`⚠  Card #${patch.cardNumber} not found — skipping patch`);
      continue;
    }
    batch.update(snap.docs[0].ref, { difficulty: patch.difficulty });
    console.log(`✏  Patching card #${patch.cardNumber} → ${patch.difficulty}`);
  }

  // 2. Add new puzzles
  for (const puzzle of newPuzzles) {
    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, {
      categoryId: CATEGORY_ID,
      ...puzzle,
    });
    console.log(`+  Adding card #${puzzle.cardNumber}: ${puzzle.questionText} (${puzzle.difficulty})`);
  }

  await batch.commit();
  console.log(`\n✅  Done — patched ${existingPatches.length}, added ${newPuzzles.length} puzzles.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
