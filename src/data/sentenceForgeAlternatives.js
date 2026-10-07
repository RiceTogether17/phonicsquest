/**
 * Other word orders Sentence Forge accepts.
 *
 * Sentence Forge marks a sentence right only if the child's order matches the
 * target or one of its `acceptableAnswers`. Many targets have a manner adverb
 * or time phrase that English lets sit in more than one place: "My sister
 * packed her suitcase carefully" and "My sister carefully packed her suitcase"
 * are both correct, and only one was accepted. The bank was inconsistent too:
 * s094 already accepted "She packed the microscope carefully into the box".
 *
 * Each alternative uses exactly the target's word tiles (capitals and commas
 * included), so it is always buildable; a test checks this. Only positions a
 * teacher would accept without comment are listed — an adverb straight after
 * the subject or after a helper verb ("can", "must", "was"), or a time phrase
 * swapped with a place phrase — not every order that is merely grammatical.
 *
 * Review audit 2026-10-07.
 */
export const SENTENCE_FORGE_ALTERNATIVES = {
  // ── P1 ──────────────────────────────────────────────────────────────────
  'We read quietly in the reading corner.': ['We quietly read in the reading corner.'],
  'My sister ties her shoelaces neatly.': ['My sister neatly ties her shoelaces.'],
  'The dog wags its tail happily.': ['The dog happily wags its tail.'],
  'My brother rides his bicycle slowly.': ['My brother slowly rides his bicycle.'],
  'We queue quietly outside the hall.': ['We quietly queue outside the hall.'],
  'He drew a picture and coloured it neatly.': ['He drew a picture and neatly coloured it.'],
  'I washed the apple and ate it slowly.': ['I washed the apple and slowly ate it.'],
  'We tidied our desks and lined up quietly.': ['We tidied our desks and quietly lined up.'],
  'We ran quickly because the bell had rung.': ['We quickly ran because the bell had rung.'],
  'Before we ate, we washed our hands carefully.': ['Before we ate, we carefully washed our hands.'],
  'Before the concert began, we sat down quietly.': ['Before the concert began, we quietly sat down.'],
  'After the game ended, we shook hands politely.': ['After the game ended, we politely shook hands.'],
  'After breakfast, we walked to school together.': ['After breakfast, we walked together to school.'],
  'We will eat fruit and bread today.': ['We will eat bread and fruit today.'],

  // ── P2 ──────────────────────────────────────────────────────────────────
  'After lunch, we cleaned our tables quickly.': ['After lunch, we quickly cleaned our tables.'],
  'Our class monitor collects the worksheets quickly.': ['Our class monitor quickly collects the worksheets.'],
  'He can spell his full name correctly.': ['He can correctly spell his full name.'],
  'We must line up quietly at the canteen.': ['We must quietly line up at the canteen.'],
  'Mei practised her spelling words carefully last night at home.': [
    'Mei carefully practised her spelling words last night at home.',
    'Mei practised her spelling words carefully at home last night.',
  ],
  'Siti can finish her homework before dinner time tonight.': ['Siti can finish her homework tonight before dinner time.'],
  'After recess, we went back to our classroom quietly.': ['After recess, we quietly went back to our classroom.'],
  'I finished quickly because I had practised at home.': ['I quickly finished because I had practised at home.'],

  // ── P3 ──────────────────────────────────────────────────────────────────
  'My sister packed her suitcase carefully.': ['My sister carefully packed her suitcase.'],
  'The referee explained the rules clearly.': ['The referee clearly explained the rules.'],
  'The old lady crossed the road slowly.': ['The old lady slowly crossed the road.'],
  'The mechanic examined the engine thoroughly.': ['The mechanic thoroughly examined the engine.'],
  'My cousin answered every question confidently.': ['My cousin confidently answered every question.'],
  'The waiter carried the tray steadily.': ['The waiter steadily carried the tray.'],
  'The pupils listened to the announcement attentively.': [
    'The pupils listened attentively to the announcement.',
    'The pupils attentively listened to the announcement.',
  ],
  'My father reversed the car cautiously.': ['My father cautiously reversed the car.'],
  'The cleaner scrubbed the tiles vigorously.': ['The cleaner vigorously scrubbed the tiles.'],
  'Our neighbour greeted us warmly.': ['Our neighbour warmly greeted us.'],
  'The nurse bandaged his knee gently.': ['The nurse gently bandaged his knee.'],
  'The gardener pruned the roses neatly.': ['The gardener neatly pruned the roses.'],
  'My brother folded his uniform properly.': ['My brother properly folded his uniform.'],
  'The librarian arranged the shelves methodically.': ['The librarian methodically arranged the shelves.'],
  'The cyclist braked suddenly at the junction.': ['The cyclist suddenly braked at the junction.'],
  'The team celebrated their victory loudly.': ['The team loudly celebrated their victory.'],
  'My mother measured the flour precisely.': ['My mother precisely measured the flour.'],
  'The children waited patiently for their turn.': ['The children patiently waited for their turn.'],
  'Our teacher repeated the instruction slowly.': ['Our teacher slowly repeated the instruction.'],
  'My friend returned the borrowed umbrella promptly.': ['My friend promptly returned the borrowed umbrella.'],
  'The workers unloaded the boxes and stacked them neatly.': ['The workers unloaded the boxes and neatly stacked them.'],
  'Although the queue was long, we waited patiently.': ['Although the queue was long, we patiently waited.'],
  'If the alarm rings, walk calmly to the field.': ['If the alarm rings, calmly walk to the field.'],
  'While the choir sang, the audience listened quietly.': ['While the choir sang, the audience quietly listened.'],
  'While the baby slept, we tidied the room quietly.': ['While the baby slept, we quietly tidied the room.'],
  'After the lights went out, we waited quietly for help.': ['After the lights went out, we quietly waited for help.'],

  // ── P4 ──────────────────────────────────────────────────────────────────
  'The photographer was adjusting the lens carefully.': ['The photographer was carefully adjusting the lens.'],
  'The audience was settling into their seats quietly.': ['The audience was quietly settling into their seats.'],
  'The engineer inspected the bridge supports thoroughly.': ['The engineer thoroughly inspected the bridge supports.'],
  'The electrician rewired the faulty socket safely.': ['The electrician safely rewired the faulty socket.'],
  'The plumber replaced the leaking washer quickly.': ['The plumber quickly replaced the leaking washer.'],
  'Students should label their diagrams clearly.': ['Students should clearly label their diagrams.'],
  'Everyone must evacuate calmly when the alarm sounds.': ['Everyone must calmly evacuate when the alarm sounds.'],
  'The committee reviewed the proposal and approved it unanimously.': ['The committee reviewed the proposal and unanimously approved it.'],
  'The teacher marked the scripts and returned them promptly.': ['The teacher marked the scripts and promptly returned them.'],
  'My mother marinated the chicken and grilled it slowly.': ['My mother marinated the chicken and slowly grilled it.'],
  'We stored the seeds carefully so that they stayed dry.': ['We carefully stored the seeds so that they stayed dry.'],
  'Despite her nervousness, she delivered the speech confidently.': ['Despite her nervousness, she confidently delivered the speech.'],
  'Despite his inexperience, he handled the situation calmly.': ['Despite his inexperience, he calmly handled the situation.'],
  'Realising his mistake, he apologised immediately.': ['Realising his mistake, he immediately apologised.'],
  'Hearing the alarm, everyone left the building calmly.': ['Hearing the alarm, everyone calmly left the building.'],
  'Noticing the puddle, she stepped carefully around it.': ['Noticing the puddle, she carefully stepped around it.'],
  'Having read the instructions, he assembled the shelf easily.': ['Having read the instructions, he easily assembled the shelf.'],
  'Having repaired the puncture, he cycled home slowly.': ['Having repaired the puncture, he slowly cycled home.'],
  'We should always greet our teachers politely when we see them in school.': [
    'We should always politely greet our teachers when we see them in school.',
  ],
  'Despite his injury, Ravi cheered loudly for his team from the sidelines.': [
    'Despite his injury, Ravi loudly cheered for his team from the sidelines.',
  ],

  // ── P5 ──────────────────────────────────────────────────────────────────
  'The committee has approved the revised budget already.': ['The committee has already approved the revised budget.'],
  'The letters written during the war were preserved carefully.': ['The letters written during the war were carefully preserved.'],
  'The proposal presented at the meeting was unanimously adopted.': ['The proposal presented at the meeting was adopted unanimously.'],
  'The bus might have already left by the time Ravi reached the bus stop.': [
    'The bus might already have left by the time Ravi reached the bus stop.',
  ],

  // ── P6 ──────────────────────────────────────────────────────────────────
  'They have been monitoring the reservoir levels closely.': ['They have been closely monitoring the reservoir levels.'],
  'The award was presented posthumously to the scientist.': ['The award was posthumously presented to the scientist.'],
  'Participants should report any adverse effect immediately.': ['Participants should immediately report any adverse effect.'],
  'The route is patrolled regularly by park rangers.': ['The route is regularly patrolled by park rangers.'],
  'The scheme is funded jointly by two charitable trusts.': ['The scheme is jointly funded by two charitable trusts.'],
  'The fault might have developed gradually over several years.': ['The fault might have gradually developed over several years.'],
};

/**
 * Merge the alternatives into the sentence entries, keeping any an entry
 * already lists.
 *
 * @template {{ sentence: string, acceptableAnswers?: string[] }} T
 * @param {T[]} entries
 * @returns {T[]}
 */
export function withAlternativeOrders(entries) {
  return entries.map((entry) => {
    const extra = SENTENCE_FORGE_ALTERNATIVES[entry.sentence];
    if (!extra) return entry;
    const merged = [...new Set([...(entry.acceptableAnswers || []), ...extra])];
    return { ...entry, acceptableAnswers: merged };
  });
}
