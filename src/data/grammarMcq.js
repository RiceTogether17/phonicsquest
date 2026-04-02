export const GRAMMAR_MCQ_LEVELS = ['P1','P2','P3','P4','P5','P6'];

export const GRAMMAR_MCQ_ITEMS = {
  P1: [
    { id:'g1', q:'She ___ a red bag.', choices:['has','have','having','had'], answer:'has', skill:'sv_agreement', explain:'Singular subject "She" takes "has".' },
    { id:'g2', q:'I am sitting ___ my chair.', choices:['on','by','from','to'], answer:'on', skill:'prepositions', explain:'We sit on a chair.' },
    { id:'g3', q:'___ apple is sweet.', choices:['A','An','The','Some'], answer:'An', skill:'articles', explain:'Use "An" before vowel sound words like apple.' },
    { id:'g19', q:'My brother and I ___ friends.', choices:['is','am','are','was'], answer:'are', skill:'sv_agreement', explain:'Compound subject "brother and I" is plural.' },
    { id:'g20', q:'This is ___ umbrella I bought yesterday.', choices:['a','an','the','many'], answer:'the', skill:'articles', explain:'Use "the" when referring to a specific umbrella.' },
  ],
  P2: [
    { id:'g4', q:'Yesterday, we ___ to the zoo.', choices:['go','goes','went','going'], answer:'went', skill:'tense', explain:'"Yesterday" signals past tense.' },
    { id:'g5', q:'There are ___ pencils in the box.', choices:['much','many','little','fewest'], answer:'many', skill:'quantifiers', explain:'Countable plural noun uses "many".' },
    { id:'g6', q:'I was tired, ___ I still finished my homework.', choices:['and','but','or','so'], answer:'but', skill:'connectors', explain:'"but" shows contrast.' },
    { id:'g21', q:'She ___ her teeth every night.', choices:['brush','brushes','brushed','brushing'], answer:'brushes', skill:'sv_agreement', explain:'Singular third person takes verb + s.' },
    { id:'g22', q:'The cookies are ___ the jar.', choices:['in','to','for','with'], answer:'in', skill:'prepositions', explain:'Items contained by a jar are "in" it.' },
  ],
  P3: [
    { id:'g7', q:'He ___ playing football now.', choices:['is','was','were','be'], answer:'is', skill:'tense', explain:'"now" pairs with present continuous: is + verb-ing.' },
    { id:'g8', q:'This book is ___ than that one.', choices:['heavy','heavier','heaviest','more heavy'], answer:'heavier', skill:'comparatives', explain:'Comparative adjective for two things is "heavier".' },
    { id:'g9', q:'The cat chased ___ tail.', choices:['it','its','it\'s','their'], answer:'its', skill:'pronouns', explain:'Possessive pronoun is "its".' },
    { id:'g23', q:'There ___ many birds on the tree.', choices:['is','are','was','be'], answer:'are', skill:'sv_agreement', explain:'Plural noun "birds" takes "are".' },
    { id:'g24', q:'This problem is ___ than the first one.', choices:['easy','easier','easiest','more easiest'], answer:'easier', skill:'comparatives', explain:'Use comparative form for two items.' },
  ],
  P4: [
    { id:'g10', q:'If it rains, we ___ stay indoors.', choices:['will','would','can\'t','had'], answer:'will', skill:'conditionals', explain:'First conditional: If + present, will + base verb.' },
    { id:'g11', q:'The work ___ by the class monitor.', choices:['is checked','checked','are checking','check'], answer:'is checked', skill:'passive_voice', explain:'Passive voice uses be + past participle.' },
    { id:'g12', q:'Neither Ben nor his friends ___ late.', choices:['is','are','was','be'], answer:'are', skill:'sv_agreement', explain:'Nearest plural subject "friends" takes "are".' },
    { id:'g25', q:'The cake ___ by my aunt every Sunday.', choices:['bakes','is baked','was baking','baked'], answer:'is baked', skill:'passive_voice', explain:'Habitual passive in present simple uses is + past participle.' },
    { id:'g26', q:'If you study hard, you ___ well.', choices:['did','will do','doing','have'], answer:'will do', skill:'conditionals', explain:'First conditional: If + present, will + base verb.' },
  ],
  P5: [
    { id:'g13', q:'She said that she ___ finish the task.', choices:['will','would','can','must'], answer:'would', skill:'reported_speech', explain:'Backshift after "said": will -> would.' },
    { id:'g14', q:'The boy ___ won the prize is my cousin.', choices:['which','who','whom','whose'], answer:'who', skill:'relative_clauses', explain:'Use "who" for people as subject relative pronoun.' },
    { id:'g15', q:'You ___ submit your work by Friday.', choices:['must','maybe','can\'t not','been'], answer:'must', skill:'modals', explain:'"must" shows strong obligation.' },
    { id:'g27', q:'The girl ___ bicycle was stolen reported it.', choices:['who','whose','which','whom'], answer:'whose', skill:'relative_clauses', explain:'Use "whose" to show possession.' },
    { id:'g28', q:'He explained that he ___ the keys at home.', choices:['left','leave','leaves','will leave'], answer:'left', skill:'reported_speech', explain:'Reported past statement keeps past tense.' },
  ],
  P6: [
    { id:'g16', q:'Rarely ___ we see such courage.', choices:['do','did','are','have'], answer:'do', skill:'inversion', explain:'Fronted adverbials can trigger inversion: Rarely do we...' },
    { id:'g17', q:'Had he listened, he ___ avoided the mistake.', choices:['will have','would have','has','would'], answer:'would have', skill:'conditionals', explain:'Inverted third conditional: Had + past participle, would have + past participle.' },
    { id:'g18', q:'The principal, along with the teachers, ___ attending.', choices:['is','are','were','be'], answer:'is', skill:'sv_agreement', explain:'Main subject "principal" is singular.' },
    { id:'g29', q:'No sooner ___ he arrived than the show began.', choices:['had','has','did','was'], answer:'had', skill:'inversion', explain:'Inversion structure: No sooner had + subject + past participle.' },
    { id:'g30', q:'If she ___ earlier, she would have caught the train.', choices:['left','had left','has left','would leave'], answer:'had left', skill:'conditionals', explain:'Third conditional uses If + past perfect.' },
  ],
};
