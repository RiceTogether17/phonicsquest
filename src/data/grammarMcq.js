export const GRAMMAR_MCQ_LEVELS = ['P1','P2','P3','P4','P5','P6'];

export const GRAMMAR_MCQ_ITEMS = {
  P1: [
    { id:'g1', q:'She ___ a red bag.', choices:['has','have','having','had'], answer:'has', skill:'sv_agreement', explain:'Singular subject "She" takes "has".' },
    { id:'g2', q:'I am sitting ___ my chair.', choices:['on','by','from','to'], answer:'on', skill:'prepositions', explain:'We sit on a chair.' },
    { id:'g3', q:'___ apple is sweet.', choices:['A','An','The','Some'], answer:'An', skill:'articles', explain:'Use "An" before vowel sound words like apple.' },
  ],
  P2: [
    { id:'g4', q:'Yesterday, we ___ to the zoo.', choices:['go','goes','went','going'], answer:'went', skill:'tense', explain:'"Yesterday" signals past tense.' },
    { id:'g5', q:'There are ___ pencils in the box.', choices:['much','many','little','fewest'], answer:'many', skill:'quantifiers', explain:'Countable plural noun uses "many".' },
    { id:'g6', q:'I was tired, ___ I still finished my homework.', choices:['and','but','or','so'], answer:'but', skill:'connectors', explain:'"but" shows contrast.' },
  ],
  P3: [
    { id:'g7', q:'He ___ playing football now.', choices:['is','was','were','be'], answer:'is', skill:'tense', explain:'"now" pairs with present continuous: is + verb-ing.' },
    { id:'g8', q:'This book is ___ than that one.', choices:['heavy','heavier','heaviest','more heavy'], answer:'heavier', skill:'comparatives', explain:'Comparative adjective for two things is "heavier".' },
    { id:'g9', q:'The cat chased ___ tail.', choices:['it','its','it\'s','their'], answer:'its', skill:'pronouns', explain:'Possessive pronoun is "its".' },
  ],
  P4: [
    { id:'g10', q:'If it rains, we ___ stay indoors.', choices:['will','would','can\'t','had'], answer:'will', skill:'conditionals', explain:'First conditional: If + present, will + base verb.' },
    { id:'g11', q:'The work ___ by the class monitor.', choices:['is checked','checked','are checking','check'], answer:'is checked', skill:'passive_voice', explain:'Passive voice uses be + past participle.' },
    { id:'g12', q:'Neither Ben nor his friends ___ late.', choices:['is','are','was','be'], answer:'are', skill:'sv_agreement', explain:'Nearest plural subject "friends" takes "are".' },
  ],
  P5: [
    { id:'g13', q:'She said that she ___ finish the task.', choices:['will','would','can','must'], answer:'would', skill:'reported_speech', explain:'Backshift after "said": will -> would.' },
    { id:'g14', q:'The boy ___ won the prize is my cousin.', choices:['which','who','whom','whose'], answer:'who', skill:'relative_clauses', explain:'Use "who" for people as subject relative pronoun.' },
    { id:'g15', q:'You ___ submit your work by Friday.', choices:['must','maybe','can\'t not','been'], answer:'must', skill:'modals', explain:'"must" shows strong obligation.' },
  ],
  P6: [
    { id:'g16', q:'Rarely ___ we see such courage.', choices:['do','did','are','have'], answer:'do', skill:'inversion', explain:'Fronted adverbials can trigger inversion: Rarely do we...' },
    { id:'g17', q:'Had he listened, he ___ avoided the mistake.', choices:['will have','would have','has','would'], answer:'would have', skill:'conditionals', explain:'Inverted third conditional: Had + past participle, would have + past participle.' },
    { id:'g18', q:'The principal, along with the teachers, ___ attending.', choices:['is','are','were','be'], answer:'is', skill:'sv_agreement', explain:'Main subject "principal" is singular.' },
  ],
};
