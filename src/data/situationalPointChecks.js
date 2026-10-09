/**
 * Situational Writing — point checks.
 *
 * One entry per prompt in `situationalWritingPrompts.js`, one check per
 * bullet, in the same order. A bullet counts as covered when the answer uses
 * at least `min` (default 1) of its words or phrases, matched as whole words
 * (a plural -s is allowed). The lists are written for the many ways a child
 * might say the same thing, and every model answer covers all of its points.
 *
 * Two special entries match patterns instead of words: `#time` ("10 a.m.",
 * "2pm", "6:50") and `#date` ("14 June", "June 14th").
 *
 * `hint` tells the child what to add when a point is missing.
 */

export const SITUATIONAL_POINT_CHECKS = Object.freeze({
  'sw-1': [
    { keywords: ['fever', 'sick', 'ill', 'unwell', 'doctor', 'medical certificate', 'mc', 'flu', 'cough', 'rest'], hint: 'Say why you cannot go, for example that you are sick and saw a doctor.' },
    { keywords: ['sorry', 'apologise', 'apologize', 'apologies', 'apology', 'regret'], hint: 'Say sorry to Mrs Lim for missing camp.' },
    { keywords: ['catch up', 'make up', 'missed work', 'complete', 'finish', 'promise', 'when i return', 'when i come back', 'when i am back'], hint: 'Promise to finish the work you miss when you are back.' },
  ],
  'sw-2': [
    { keywords: ['donate', 'donation', 'donating', 'charity', 'organisation', 'organization', 'offering', 'free books', 'company'], hint: 'Explain who is giving the books away.' },
    { keywords: ['fiction', 'non-fiction', 'picture books', 'storybooks', 'story books', 'comics', 'encyclopedias', 'benefit', 'help students', 'encourage', 'read more', 'enjoy reading'], hint: 'Name the kinds of books and how they would help students.' },
    { keywords: ['sign up', 'register', 'apply', 'steps', 'how can', 'could you', 'can you', 'please find out', 'let me know'], hint: 'Ask the librarian how the school can sign up.' },
  ],
  'sw-3': [
    { keywords: ['gardening club', 'garden club', 'suggest', 'propose', 'proposal', 'start a', 'idea'], hint: 'Say clearly that you want to start a gardening club, and why.' },
    { keywords: ['benefit', 'responsibility', 'responsible', 'nature', 'outdoors', 'healthy', 'teamwork', 'learn', 'first', 'second'], hint: 'Give two ways the club would help students.' },
    { keywords: ['meet', 'plot', 'garden', 'behind', 'afternoon', 'after school', 'every week', 'teacher', 'take turns', 'run by', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'], hint: 'Say where and when the club could meet, and who would run it.' },
  ],
  'sw-4': [
    { keywords: ['thank', 'thanks', 'grateful', 'gratitude', 'appreciate', 'appreciated'], hint: 'Thank the company and name what they gave.' },
    { keywords: ['success', 'successful', 'helped', 'motivated', 'made a difference', 'difference', 'enjoyed', 'because of'], hint: 'Explain how their gifts helped sports day go well.' },
    { keywords: ['next year', 'again', 'future', 'continue', 'continued support'], hint: 'Invite them to sponsor sports day again next year.' },
  ],
  'sw-5': [
    { keywords: ['visit', 'come', 'invite', 'host', 'stay with'], hint: 'Invite Tom to visit.' },
    { keywords: ['bring you', 'take you', 'visit', 'gardens by the bay', 'zoo', 'sentosa', 'hawker', 'museum', 'beach', 'we could', 'we can'], hint: 'Suggest two places or activities you would like to show Tom.' },
    { keywords: ['pack', 'bring', 'prepare', 'clothes', 'umbrella', 'sunscreen', 'hat', 'hot', 'humid', 'rain'], hint: 'Tell Tom what to pack or get ready.' },
  ],
  'sw-6': [
    { keywords: ['broken', 'damaged', 'rusty', 'unsafe', 'dirty', 'old', 'only', 'cordoned', 'no shelter', 'poor', 'not working', 'functioning'], hint: 'Describe what is wrong with the playground.' },
    { keywords: ['children', 'kids', 'residents', 'parents', 'affect', 'affects', 'impact', 'cannot play', 'nowhere to play', 'unsafe', 'injured', 'hurt'], hint: 'Explain how the problem affects children and residents.' },
    { keywords: ['repair', 'fix', 'replace', 'install', 'build', 'construct', 'add', 'request', 'suggest', 'shelter'], hint: 'Suggest what the town council should repair or add.' },
  ],
  'sw-7': [
    { keywords: ['too early', 'early', 'start time', 'start times', 'wake up', 'concern', 'problem', 'i believe', 'i think', 'in my view', 'in my opinion'], hint: 'State your view that school starts too early, and why.' },
    { keywords: ['sleep', 'tired', 'rest', 'hours', 'focus', 'concentrate', 'research', 'studies', 'health'], hint: 'Use a reason about how much sleep children need.' },
    { keywords: ['suggest', 'urge', 'should', 'could', 'instead', 'later', 'start school at', '8.30', 'eight thirty'], hint: 'Suggest what could change, for example a later start time.' },
  ],
  'sw-8': [
    { keywords: ['on behalf', 'club', 'student', 'pupils', 'charity', 'raise', 'raise money', 'proceeds', 'donate', 'donated', 'fundraise'], hint: 'Say who you are and why you are holding the bake sale.' },
    { keywords: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', '#time', '#date', 'cookies', 'cakes', 'cupcakes', 'brownies', 'muffins', 'sell'], min: 2, hint: 'Give the date, the time and what you will sell.' },
    { keywords: ['clean', 'tidy', 'clear up', 'clean up', 'original condition', 'rubbish', 'assure'], hint: 'Promise to leave the venue clean and tidy.' },
  ],
  'sw-9': [
    { keywords: ['project', 'learn', 'learning', 'history', 'heritage', 'class', 'primary 6', 'p6', 'on behalf'], hint: 'Say why your class wants to visit and which class it is.' },
    { keywords: ['students', 'pupils', 'hours', 'hour', 'week', '#date', 'january', 'february', 'march', 'april', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'], min: 2, hint: 'Give the number of students, a date and how long the tour should be.' },
    { keywords: ['prepare', 'preparation', 'bring', 'beforehand', 'before the visit', 'materials', 'advise', 'could you', 'please let us know'], hint: 'Ask what students should bring or prepare.' },
  ],
  'sw-10': [
    { keywords: ['won', 'win', 'first prize', 'prize', 'competition', 'news'], hint: 'Share your news that you won.' },
    { keywords: ['trophy', 'cash', 'money', 'certificate', 'medal', 'published', 'publish', 'magazine', 'book'], hint: 'Say what you won and that your story will be published.' },
    { keywords: ['how are', 'your news', 'your turn', 'write', 'reply', 'keep in touch', 'stay in touch', 'more often'], hint: 'Ask Hui Ling for her news and suggest writing more often.' },
  ],
  'sw-11': [
    { keywords: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', '#time', '#date', 'my place', 'my house', 'address', 'come over'], min: 2, hint: 'Give the date, time and place of the gathering.' },
    { keywords: ['food', 'cake', 'nasi lemak', 'games', 'play', 'eat', 'snacks', 'karaoke', 'movie', 'activities'], hint: 'Describe the food and activities.' },
    { keywords: ['let me know', 'confirm', 'reply', 'call', 'text', 'message', 'whatsapp', 'whatsapping', 'contact'], hint: 'Ask Reza to tell you if he can come, and how to reach you.' },
  ],
  'sw-12': [
    { keywords: ['played', 'game', 'games', 'lucky dip', 'sang', 'danced', 'quiz', 'goodie bag', 'ate', 'watched', 'prize', 'prizes', 'cake', 'pizza'], min: 2, hint: 'Describe two things that happened at the party.' },
    { keywords: ['missed you', 'miss you', 'saved', 'set aside', 'kept', 'for you'], hint: 'Tell Hui Min everyone missed her and food was saved for her.' },
    { keywords: ['get well', 'recover', 'feel better', 'feeling better', 'meet up', 'holidays', 'holiday'], hint: 'Wish her well and suggest meeting up in the holidays.' },
  ],
  'sw-13': [
    { keywords: ['played', 'served', 'helped', 'sang', 'talked', 'visited', 'surprised', 'nervous', 'moved'], hint: 'Describe what you did at the nursing home and what surprised you.' },
    { keywords: ['madam', 'mr', 'mrs', 'uncle', 'auntie', 'aunty', 'grandma', 'grandpa', 'resident', 'old man', 'old lady', 'she told', 'he told'], hint: 'Write about one elderly resident you spoke to.' },
    { keywords: ['learnt', 'learned', 'realised', 'realized', 'now i', 'understand', 'changed', 'before today', 'i used to think'], hint: 'Explain how the visit changed what you think.' },
  ],
  'sw-14': [
    { keywords: ['nervous', 'scared', 'afraid', 'shaking', 'trembling', 'legs', 'heart', 'give up', 'almost', 'cannot do'], hint: 'Describe how you felt before going on stage.' },
    { keywords: ['forgot', 'blank', 'lost my place', 'mistake', 'tripped', 'went wrong', 'almost', 'suddenly', 'halfway'], hint: 'Tell what almost went wrong during the performance.' },
    { keywords: ['learnt', 'learned', 'realised', 'realized', 'courage', 'i would tell', 'i would say', 'advice', 'friend'], hint: 'Reflect on what you learnt and what you would tell a scared friend.' },
  ],
  'sw-15': [
    { keywords: ['either', 'choice', 'choices', 'two options', 'decide', 'decision', 'should i', 'dilemma'], hint: 'Describe the problem and the two choices you had.' },
    { keywords: ['i chose', 'i decided', 'decided to', 'chose to', 'because', 'so i'], hint: 'Say what you decided and why.' },
    { keywords: ['learnt', 'learned', 'realised', 'realized', 'friendship', 'honest', 'honesty', 'right thing', 'true friend'], hint: 'Reflect on what this taught you about friendship or honesty.' },
  ],
  'sw-16': [
    { keywords: ['plastic', 'waste', 'throw away', 'throws away', 'thrown away', 'disposable', 'pollution', 'landfill', 'ocean', 'sea', 'environment', 'harm'], min: 2, hint: 'Explain the plastic waste problem and why it matters.' },
    { keywords: ['reusable', 'bottle', 'container', 'bag', 'straw', 'bring your own', 'carry', 'first', 'second'], min: 2, hint: 'Suggest two things classmates can do at school.' },
    { keywords: ['join me', 'together', 'let us', "let's", 'start today', 'will you', 'we can'], hint: 'End by asking everyone to act.' },
  ],
  'sw-17': [
    { keywords: ['welcome', 'my name is', 'i am'], min: 2, hint: 'Welcome the new students and say who you are.' },
    { keywords: ['look forward', 'friends', 'cca', 'ccas', 'sports', 'art', 'music', 'library', 'canteen', 'fun'], hint: 'Tell them two things to look forward to.' },
    { keywords: ['scary', 'nervous', 'worry', "don't worry", 'normal', 'you will love', 'happy', 'family', 'here for you', 'help you'], hint: 'End with a warm, reassuring message.' },
  ],
  'sw-18': [
    { keywords: ['vocabulary', 'imagination', 'learn', 'fun', 'relax', 'worthwhile', 'best things', 'good for'], hint: 'Open with a reason why holiday reading is worth doing.' },
    { keywords: ['library', 'recommendation', 'recommend', 'ask a friend', 'adventure', 'mystery', 'non-fiction', 'comics', 'reading list'], hint: 'Suggest kinds of books or ways to find good ones.' },
    { keywords: ['challenge', 'at least one book', 'one book', 'book club', 'tell us', 'share'], min: 2, hint: 'Set the one-book challenge and say how the Book Club will help.' },
  ],
  'sw-19': [
    { keywords: ['held on', 'took place', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'atmosphere', 'cheering', 'cheered', 'excited', 'electric', 'sunshine'], min: 2, hint: 'Say when sports day was and what the mood was like.' },
    { keywords: ['relay', 'record', 'sprint', 'race', 'won', 'champion', 'trophy', 'highlight', 'highlights'], min: 2, hint: 'Describe two highlights, including who won the relay.' },
    { keywords: ['said', '"', '“', 'next year', 'cannot come soon enough', 'look forward', 'future'], min: 2, hint: 'Quote someone, then end by looking ahead.' },
  ],
  'sw-20': [
    { keywords: ['route', 'with effect from', 'from monday', 'starting', 'change', 'changes', 'bus'], min: 2, hint: 'Say what is changing, from which date, and for which route.' },
    { keywords: ['departure', 'leave', 'leaves', '#time', 'gate', 'boarding', 'board', 'pick-up'], min: 2, hint: 'Give the new time and the new place to board.' },
    { keywords: ['inform your parents', 'tell your parents', 'parents', 'late', 'miss the bus', 'not be able to board', 'will not wait'], min: 2, hint: 'Remind students to tell their parents and say what happens if they are late.' },
  ],
  // ─── Practice paper Section E tasks, keyed by paper id ───────────────────
  'p5-test-term-1': [
    { keywords: ['environment', 'awareness', 'purpose', 'educate', 'important', 'pollution', 'climate', 'event'], min: 2, hint: 'Explain what the event is for and why it matters.' },
    { keywords: ['speech', 'speak', 'say a few words', 'address', '10-minute', 'ten-minute', 'opening'], hint: 'Ask Mrs Teo to give the 10-minute opening speech.' },
    { keywords: ['#date', '#time', 'hall', 'venue', 'held', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'], min: 2, hint: 'Give the date, time and venue.' },
  ],
  'p5-test-term-2': [
    { keywords: ['apply', 'application', 'student', 'primary 5', 'p5', 'i am', 'workshop'], min: 2, hint: 'Say who you are and that you are applying for the workshop.' },
    { keywords: ['art club', 'art', 'drawing', 'painting', 'paint', 'draw', 'experience', 'interest', 'exhibition'], min: 2, hint: 'Describe your interest or experience in art.' },
    { keywords: ['benefit', 'help me', 'improve', 'learn', 'community', 'contribute', 'skills'], min: 2, hint: 'Explain how the workshop helps you and the community.' },
  ],
  'p5-test-term-3': [
    { keywords: ['heritage trail', 'trail', 'walk', 'come', 'invite', 'join'], min: 2, hint: 'Invite Marco and tell him about the heritage trail walk.' },
    { keywords: ['see', 'learn', 'shophouses', 'temples', 'markets', 'history', 'explore', 'buildings'], min: 2, hint: 'Describe what Marco will see or learn on the walk.' },
    { keywords: ['wear', 'bring', 'shoes', 'water bottle', 'hat', 'cap', 'meal', 'eat', 'lunch', 'dinner', 'hawker', 'food'], min: 2, hint: 'Say what Marco should bring or wear, and mention the meal after.' },
  ],
  'p5-test-term-4': [
    { keywords: ['enjoy', 'enjoyable', 'fun', 'nothing wrong', 'educational', 'teach', 'learn', 'sharpen', 'team'], min: 2, hint: 'Say first that games and screens can be fun and even useful.' },
    { keywords: ['eyes', 'posture', 'sleep', 'fitness', 'health', 'healthy', 'unhealthy', 'risk', 'risks', 'headache', 'obesity', 'tired'], min: 2, hint: 'Explain the health risks of too much screen time.' },
    { keywords: ['cycling', 'walking', 'walk', 'swimming', 'swim', 'jogging', 'football', 'exercise', 'physical activity', 'challenge', 'try'], min: 2, hint: 'Encourage everyone to try one named activity.' },
  ],
  'p6-test-term-1': [
    { keywords: ['waste', 'rubbish', 'bins', 'thrown away', 'recycled', 'kilograms', 'kg', 'every day', 'each day', 'necessary'], min: 2, hint: 'Explain why recycling is needed, with how much waste the school makes.' },
    { keywords: ['recycling bins', 'stations', 'bins', 'collect', 'posters', 'assembly', 'company', 'sort', 'first', 'second', 'also'], min: 2, hint: 'Suggest two practical steps to start the programme.' },
    { keywords: ['benefit', 'habits', 'reduce', 'environment', 'environmental', 'example', 'cleaner', 'save'], min: 2, hint: 'Explain how the programme helps the school and the environment.' },
  ],
  'p6-test-term-2': [
    { keywords: ['cyberbullying', 'bullying', 'strangers', 'privacy', 'pretend', 'scam', 'unkind', 'personal information', 'risk', 'risks'], min: 2, hint: 'Name two risks Jordan should watch out for.' },
    { keywords: ['never share', "don't share", 'do not share', 'do not reply', "don't reply", 'tell a trusted adult', 'tell an adult', 'tell your parents', 'block', 'report', 'screenshot', 'advice'], min: 2, hint: 'Give two pieces of advice on staying safe.' },
    { keywords: ['help you', 'walk you through', 'set up', 'come over', 'privacy settings', "you'll get the hang", 'you will get the hang', 'don\'t worry', 'do not worry'], min: 1, hint: 'Encourage Jordan and offer to help set up his privacy settings.' },
  ],
  'p6-test-term-3': [
    { keywords: ['surprised', 'impressed', 'learnt', 'learned', 'saw', 'display', 'film', 'stove', 'generations'], min: 2, hint: 'Describe two things at the exhibition that surprised or impressed you.' },
    { keywords: ['proud', 'heritage', 'culture', 'appreciate', 'felt', 'feel', 'multicultural'], min: 2, hint: 'Reflect on how the visit made you feel about our heritage.' },
    { keywords: ['i want to', 'i will', 'from now on', 'support', 'visit', 'preserve', 'help'], min: 2, hint: 'Say one thing you will do to help keep hawker culture alive.' },
  ],
  'p6-test-term-4': [
    { keywords: ['climate change', 'hotter', 'hottest', 'sea levels', 'floods', 'weather', 'serious', 'young people', 'generation', 'our future'], min: 2, hint: 'Explain why climate change is serious for young people.' },
    { keywords: ['reusable', 'bottle', 'bag', 'switch off', 'switching off', 'lights', 'energy', 'walk', 'cycle', 'recycle', 'first', 'second'], min: 2, hint: 'Suggest two actions students can take every day.' },
    { keywords: ['let us', "let's", 'act', 'today', 'together', 'join me', 'we can', 'now'], min: 2, hint: 'End with a strong call to act.' },
  ],
});
