/**
 * PhonicsQuest – Sentence Forge Quest Data
 *
 * Sentences organised by level (1 = P1 easiest → 6 = P6 hardest).
 * Each sentence is shuffled word-by-word in the game for the player to re-order.
 */

export const SENTENCE_LEVEL_LABELS = {
  1: 'P1 – Starter',
  2: 'P2 – Explorer',
  3: 'P3 – Builder',
  4: 'P4 – Challenger',
  5: 'P5 – Expert',
  6: 'P6 – Master',
};

export const SENTENCE_LEVEL_ICONS = ['🌱', '🌿', '🌳', '🔥', '💎', '👑'];

export const allSentences = [
  // ── P1 – Short simple sentences ──────────────────────────────────────────
  { id: 's001', sentence: 'The cat sat on the mat.', level: 1 },
  { id: 's002', sentence: 'I can see a big dog.', level: 1 },
  { id: 's003', sentence: 'She has a red hat.', level: 1 },
  { id: 's004', sentence: 'We play in the sun.', level: 1 },
  { id: 's005', sentence: 'He ran to the bus.', level: 1 },
  { id: 's006', sentence: 'The hen has an egg.', level: 1 },
  { id: 's007', sentence: 'I like to eat fish.', level: 1 },
  { id: 's008', sentence: 'The pig is in the mud.', level: 1 },
  { id: 's009', sentence: 'We can run very fast.', level: 1 },
  { id: 's010', sentence: 'My bag is on the desk.', level: 1 },

  // ── P2 – Simple sentences with connectors ─────────────────────────────────
  { id: 's011', sentence: 'The dog ran into the garden.', level: 2 },
  { id: 's012', sentence: 'My sister likes to read books.', level: 2 },
  { id: 's013', sentence: 'We went to the park today.', level: 2 },
  { id: 's014', sentence: 'The bird sang a pretty song.', level: 2 },
  { id: 's015', sentence: 'She put her toys in the box.', level: 2 },
  { id: 's016', sentence: 'He helped his mother cook dinner.', level: 2 },
  { id: 's017', sentence: 'The flowers bloom in the spring.', level: 2 },
  { id: 's018', sentence: 'My father drives me to school.', level: 2 },
  { id: 's019', sentence: 'They went swimming at the pool.', level: 2 },
  { id: 's020', sentence: 'The baby laughed at the funny clown.', level: 2 },

  // ── P3 – Compound and complex elements ───────────────────────────────────
  { id: 's021', sentence: 'It was raining very heavily this morning.', level: 3 },
  { id: 's022', sentence: 'All students should obey the school rules.', level: 3 },
  { id: 's023', sentence: 'The children played happily in the playground.', level: 3 },
  { id: 's024', sentence: 'My mother cooked a delicious meal for us.', level: 3 },
  { id: 's025', sentence: 'The old man walked slowly down the street.', level: 3 },
  { id: 's026', sentence: 'She shared her lunch with her best friend.', level: 3 },
  { id: 's027', sentence: 'The teacher gave them a difficult exercise.', level: 3 },
  { id: 's028', sentence: 'We enjoyed watching the fireworks at night.', level: 3 },
  { id: 's029', sentence: 'The puppy chased its tail around the yard.', level: 3 },
  { id: 's030', sentence: 'He forgot to bring his homework to school.', level: 3 },

  // ── P4 – Longer, richer sentences ────────────────────────────────────────
  { id: 's031', sentence: 'The scientists discovered a new species of fish.', level: 4 },
  { id: 's032', sentence: 'She worked very hard to achieve her dreams.', level: 4 },
  { id: 's033', sentence: 'The team celebrated after winning the championship.', level: 4 },
  { id: 's034', sentence: 'He carefully placed the fragile vase on the shelf.', level: 4 },
  { id: 's035', sentence: 'The library was quiet except for the rustling of pages.', level: 4 },
  { id: 's036', sentence: 'They organised a fundraiser to help the local community.', level: 4 },
  { id: 's037', sentence: 'The documentary about ocean life was very educational.', level: 4 },
  { id: 's038', sentence: 'She overcame her fear of heights by climbing the tower.', level: 4 },
  { id: 's039', sentence: 'The volunteers spent the whole day cleaning the beach.', level: 4 },
  { id: 's040', sentence: 'His grandfather told him stories about the war.', level: 4 },

  // ── P5 – Multi-clause and abstract ideas ─────────────────────────────────
  { id: 's041', sentence: 'Despite the heavy rain, the children continued to play outside.', level: 5 },
  { id: 's042', sentence: 'The government announced new measures to protect the environment.', level: 5 },
  { id: 's043', sentence: 'She volunteered at the community centre every weekend.', level: 5 },
  { id: 's044', sentence: 'The experiment proved that the hypothesis was correct.', level: 5 },
  { id: 's045', sentence: 'After much deliberation, they finally reached a decision.', level: 5 },
  { id: 's046', sentence: 'The archaeologists uncovered ancient artefacts buried beneath the city.', level: 5 },
  { id: 's047', sentence: 'Many teenagers struggle to balance academics and extracurricular activities.', level: 5 },
  { id: 's048', sentence: 'The charity relies on public donations to fund its programmes.', level: 5 },
  { id: 's049', sentence: 'Without proper sleep, students find it hard to concentrate in class.', level: 5 },
  { id: 's050', sentence: 'The local council approved plans to build a new sports complex.', level: 5 },

  // ── P6 – Sophisticated vocabulary and grammar ─────────────────────────────
  { id: 's051', sentence: 'The unprecedented storm caused widespread damage to the coastal towns.', level: 6 },
  { id: 's052', sentence: 'Researchers believe that exercise significantly improves mental health.', level: 6 },
  { id: 's053', sentence: 'The committee unanimously agreed to implement the new policy.', level: 6 },
  { id: 's054', sentence: 'Although the task was challenging, she persevered and succeeded.', level: 6 },
  { id: 's055', sentence: 'The documentary highlighted the importance of biodiversity conservation.', level: 6 },
  { id: 's056', sentence: 'Sustainable development requires balancing economic growth with environmental protection.', level: 6 },
  { id: 's057', sentence: 'The philosopher argued that knowledge is the foundation of wisdom.', level: 6 },
  { id: 's058', sentence: 'Technological advancements have fundamentally altered the way humans communicate.', level: 6 },
  { id: 's059', sentence: 'The summit brought together world leaders to address climate change.', level: 6 },
  { id: 's060', sentence: 'Critical thinking enables students to evaluate information more effectively.', level: 6 },
];
