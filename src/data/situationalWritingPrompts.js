/**
 * Situational Writing Prompts — P5 and P6.
 *
 * Each item includes a complete situational setup, three content bullets,
 * a full model answer, a self-check checklist, and a marking rubric.
 *
 * Formats covered:
 *   Email, Formal Letter, Informal Letter, Note, Diary Entry, Speech, Report, Notice
 *
 * Model answers are 100–120 words and address all three bullets.
 */

export const SITUATIONAL_WRITING_PROMPTS = Object.freeze([

  // ─── Emails ───────────────────────────────────────────────────────────────

  {
    id: 'sw-1',
    level: 'P5',
    title: 'Email to form teacher: excuse from school camp',
    format: 'Email',
    purpose: 'To inform your form teacher that you cannot attend tomorrow\'s school camp due to illness, and to apologise for your absence.',
    audience: 'Mrs Lim — your form teacher',
    context: 'You have been diagnosed with a fever and the doctor has given you a medical certificate advising two days\' rest. The school camp starts tomorrow morning and lasts three days. You are disappointed to miss it.',
    bullets: [
      'Explain the reason you cannot attend camp',
      'Apologise sincerely for the absence',
      'Promise to complete any missed work when you return',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `Dear Mrs Lim,

I am writing to inform you that I am unable to attend the school camp starting tomorrow. I visited the doctor this morning and was diagnosed with a fever. He has advised me to rest for two days and has issued a medical certificate, which my mother will send to the school office.

I sincerely apologise for missing the camp. I understand that preparations have been made and I regret causing any inconvenience. I am truly disappointed to miss this experience.

I promise to make up for any missed work or activities when I return to school. Please let me know if there is anything I need to catch up on.

Thank you for your understanding.

Yours sincerely,
Wei Jie`,
    checklist: [
      'Have I included a proper email greeting (Dear + name)?',
      'Have I clearly explained the reason for my absence?',
      'Have I apologised sincerely and addressed all three bullets?',
      'Have I ended with an appropriate sign-off?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets are addressed: reason (fever, medical certificate), apology, and promise to catch up. Tone is appropriately polite and semi-formal for a teacher.',
      language: 'Sentences are grammatically correct, vocabulary is appropriate for a P5 student writing to a teacher, and register is consistent throughout.',
      organisation: 'Clear structure: greeting, purpose statement, apology, promise, and polite sign-off. Each bullet is addressed in a separate paragraph.',
    },
  },

  {
    id: 'sw-2',
    level: 'P5',
    title: 'Email to librarian: request book donations',
    format: 'Email',
    purpose: 'To request that the school librarian accept donations of books from a local charity to add to the school library collection.',
    audience: 'Ms Tan — the school librarian',
    context: 'A local charity called ReadMore Singapore has offered to donate up to 200 gently used books to schools. You have heard about this opportunity and want to request the school library to participate. You are writing on behalf of the school\'s Book Club.',
    bullets: [
      'Explain the donation opportunity and where it comes from',
      'Describe what types of books might be donated and how they would benefit students',
      'Ask how the school can sign up or what steps the librarian should take',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `Dear Ms Tan,

I am writing on behalf of the Book Club to share an exciting opportunity. A charity called ReadMore Singapore is currently offering to donate up to 200 gently used books to local schools. The books include fiction, non-fiction, and picture books suitable for primary school students.

We believe these donations would greatly enrich the school library's collection and encourage more students to read during their free time. Having a wider variety of books can make a real difference, especially for students who enjoy different genres.

Could you please find out how our school can register for this donation? I would be happy to assist with any paperwork if needed.

Thank you for your time and consideration.

Yours sincerely,
Amirah
Book Club Representative`,
    checklist: [
      'Have I introduced the donation opportunity clearly in the opening paragraph?',
      'Have I explained the benefits to students (second bullet)?',
      'Have I made a clear, polite request about next steps (third bullet)?',
      'Is my tone appropriately respectful and semi-formal throughout?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: source and nature of donation, benefits to students, and request for next steps. Purpose is clear from the first paragraph.',
      language: 'Polite and semi-formal register maintained throughout. Vocabulary is appropriate and sentences are well-constructed.',
      organisation: 'Logical progression: introduction of opportunity, explanation of benefit, and clear request. Ends with a polite offer to help and appropriate sign-off.',
    },
  },

  {
    id: 'sw-3',
    level: 'P5',
    title: 'Email to principal: suggest a school gardening club',
    format: 'Email',
    purpose: 'To suggest to your school principal that the school start a gardening club for students.',
    audience: 'Mr Rajendran — the school principal',
    context: 'You have been interested in gardening since helping your grandparents grow vegetables at their HDB plot. You want to share this hobby with your schoolmates and believe it would benefit the school community. You are writing on your own initiative.',
    bullets: [
      'Propose the idea of a school gardening club and explain your reason for suggesting it',
      'Describe two benefits the club would bring to students',
      'Suggest where the club could meet and how it could be run',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `Dear Mr Rajendran,

I am writing to suggest starting a school gardening club at Greenfield Primary. I have always enjoyed gardening and believe it is an activity that many students would find rewarding.

A gardening club would benefit students in two important ways. First, it would teach them responsibility, as caring for plants requires regular attention and commitment. Second, it would encourage students to spend time outdoors and develop an appreciation for nature and healthy food.

The club could meet on Friday afternoons in the unused plot behind the school hall. A teacher-advisor could oversee activities, and students could take turns caring for the plants each week.

I hope you will consider this proposal. Thank you for your time.

Yours sincerely,
Darren Chia
Primary 5 Integrity`,
    checklist: [
      'Have I clearly stated the proposal and my reason for it (first bullet)?',
      'Have I described exactly two benefits (second bullet)?',
      'Have I suggested a specific location and how the club would run (third bullet)?',
      'Is my tone formal and respectful throughout, suitable for writing to a principal?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: proposal with reason, two specific benefits, and practical suggestion for logistics. Writing demonstrates initiative and genuine thought.',
      language: 'Formal register maintained throughout, with no informal language. Vocabulary is varied and appropriate.',
      organisation: 'Clear three-paragraph structure matching the three bullets. Proposal is easy to follow and ends with a polite closing.',
    },
  },

  {
    id: 'sw-4',
    level: 'P6',
    title: 'Email to company: thank sponsor for sports day',
    format: 'Email',
    purpose: 'To write a thank-you email to a company that sponsored your school\'s annual sports day.',
    audience: 'Ms Angela Chong — Marketing Manager, SportsPro Singapore Pte Ltd',
    context: 'SportsPro Singapore sponsored your school\'s sports day by providing medals, water bottles and sports bibs for all participants. The event was a great success and the whole school appreciated their generosity. You are the Sports Secretary of the Student Council.',
    bullets: [
      'Thank the company sincerely for their specific contributions',
      'Describe how the sponsorship helped make the sports day a success',
      'Invite them to sponsor the event again next year',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `Dear Ms Chong,

On behalf of Riverside Primary School, I would like to express our heartfelt gratitude to SportsPro Singapore for sponsoring our Annual Sports Day. Your generous contribution of medals, water bottles and sports bibs for all participants was greatly appreciated.

The sponsorship made a real difference to our event. Students were motivated by the well-designed medals, and the branded sports bibs helped officials identify participants efficiently throughout the day. The event was a tremendous success, and your company played an important part in that.

We would be honoured if SportsPro Singapore would consider sponsoring our sports day again next year. Your continued support would mean a great deal to our school community.

Yours sincerely,
Priya Nair
Sports Secretary, Student Council`,
    checklist: [
      'Have I thanked the company and named their specific contributions (first bullet)?',
      'Have I explained clearly how the sponsorship helped the event (second bullet)?',
      'Have I made a warm and genuine invitation for future sponsorship (third bullet)?',
      'Is my tone formal, professional and appropriately appreciative?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: specific gratitude, description of impact, and invitation to sponsor again. Tone is professional and genuinely appreciative without being overly effusive.',
      language: 'Formal register throughout. Good use of vocabulary such as "heartfelt gratitude" and "tremendous success." No informal language.',
      organisation: 'Three clear paragraphs that follow the bullet order naturally. Sign-off includes position, which is appropriate for a formal email from a student representative.',
    },
  },

  {
    id: 'sw-5',
    level: 'P5',
    title: 'Email to pen-pal: invite to visit Singapore',
    format: 'Email',
    purpose: 'To invite your pen-pal who lives in London to visit Singapore during the upcoming school holidays.',
    audience: 'Tom — your pen-pal in London',
    context: 'You have been writing to Tom for two years and he has always wanted to visit Singapore. The June holidays are coming up and you would love to show him around. Your parents have agreed to host him.',
    bullets: [
      'Invite Tom and explain when he could visit',
      'Suggest two activities or places you would like to bring him to',
      'Tell him what to pack or prepare for the trip',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Hi Tom!

I hope you're doing well! I'm writing with some exciting news — my parents have agreed to host you if you'd like to visit Singapore during the June holidays (1–30 June). It would be so wonderful to finally meet you in person!

I've already planned some fun things for us to do. We could visit Gardens by the Bay and walk through the amazing domes with tropical plants from all over the world. I'd also love to bring you to a hawker centre so you can try our famous local food like chicken rice and laksa!

One important tip: pack light, breathable clothes as Singapore is very hot and humid all year round.

Can't wait to hear from you!

Your pal,
Jia Yi`,
    checklist: [
      'Have I clearly invited Tom and stated the dates (first bullet)?',
      'Have I suggested exactly two activities with brief descriptions (second bullet)?',
      'Have I given at least one piece of practical advice about what to pack (third bullet)?',
      'Is my tone warm, friendly and informal throughout, suitable for writing to a close pen-pal?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: dated invitation, two specific activities with descriptions, and practical packing advice. Enthusiasm is genuine and tone matches the relationship.',
      language: 'Informal register is consistent and appropriate for a friend. Contractions and exclamations are used naturally. No overly stiff or formal phrases.',
      organisation: 'Friendly greeting, three content paragraphs covering each bullet in order, warm sign-off. Format suits an informal email.',
    },
  },

  // ─── Formal Letters ───────────────────────────────────────────────────────

  {
    id: 'sw-6',
    level: 'P6',
    title: 'Formal letter to town council: lack of playground facilities',
    format: 'Formal Letter',
    purpose: 'To complain to the town council about the insufficient and poorly maintained playground facilities in your neighbourhood.',
    audience: 'The Chairman, Bukit Merah Town Council',
    context: 'The playground in your neighbourhood park has only two functional swings, a broken slide that has been cordoned off for three months, and no shelter from the rain. Children in the area have nowhere safe and adequate to play outdoors. You are writing on behalf of concerned residents.',
    bullets: [
      'Describe the current poor state of the playground facilities',
      'Explain how this affects the children and residents in the neighbourhood',
      'Suggest specific improvements you would like the town council to make',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `The Chairman
Bukit Merah Town Council

Dear Sir/Madam,

I am writing on behalf of concerned residents of Jalan Merah to highlight the inadequate playground facilities at our neighbourhood park. The playground currently has only two functioning swings, a broken slide that has been cordoned off for three months, and no shelter from rain.

This situation has a direct impact on our children. As a result of the broken equipment, children have fewer safe play options, and many parents are reluctant to bring young children outdoors. Play is essential for children's physical and social development.

We respectfully request that the town council repair the slide promptly, install additional play equipment, and construct a sheltered seating area near the playground.

We look forward to your prompt attention to this matter.

Yours faithfully,
Tan Siew Leng (Ms)
Resident, Block 45 Jalan Merah`,
    checklist: [
      'Have I described the current state of the playground with specific details (first bullet)?',
      'Have I explained clearly how residents and children are affected (second bullet)?',
      'Have I made at least two specific, reasonable requests (third bullet)?',
      'Is my tone firm but respectful throughout, appropriate for a formal complaint letter?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: specific description of problems, explanation of impact, and clear suggestions for improvement. Complaint is constructive rather than aggressive.',
      language: 'Fully formal register. Phrases like "we respectfully request" and "prompt attention" are appropriate. No informal or emotional language.',
      organisation: 'Correct formal letter format: recipient address, salutation, three clear paragraphs, formal sign-off with name and address.',
    },
  },

  {
    id: 'sw-7',
    level: 'P6',
    title: 'Formal letter to newspaper: school start times too early',
    format: 'Formal Letter',
    purpose: 'To write to a newspaper expressing your view that school start times in Singapore are too early for primary school students.',
    audience: 'The Editor, The Straits Times',
    context: 'You are a Primary 6 student who starts school at 7.30 a.m. and often has to wake up before 6.30 a.m. You have read about research showing that children between the ages of six and twelve need at least nine hours of sleep. You want to share your view and urge the relevant authorities to consider later school start times.',
    bullets: [
      'State your view clearly and explain why early start times are a problem',
      'Support your view with evidence or reasoning about children\'s sleep needs',
      'Suggest what could be done to address the issue',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `The Editor
The Straits Times

Dear Sir/Madam,

I am a Primary 6 student writing to express my concern about school start times in Singapore. Many primary school students, including myself, begin school at 7.30 a.m. and must wake up before 6.30 a.m. I believe this is far too early.

Research shows that children between six and twelve years old need at least nine hours of sleep each night. Early wake-up times mean many students arrive at school tired and unable to focus, which undermines their learning.

I urge the Ministry of Education to consider starting school at 8.30 a.m. instead. This small adjustment could significantly improve students' health and academic performance.

Yours faithfully,
Marcus Lee
Primary 6 student`,
    checklist: [
      'Have I stated my view clearly in the opening (first bullet)?',
      'Have I used evidence or reasoning to support my view (second bullet)?',
      'Have I made a specific, reasonable suggestion to address the issue (third bullet)?',
      'Is my tone confident but respectful, appropriate for writing to a newspaper editor?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: clear position, evidence-based reasoning, and specific suggestion. The letter reads as a genuine and coherent argument.',
      language: 'Formal register throughout. Good vocabulary including "undermines" and "adjustment." No informal phrases or contractions.',
      organisation: 'Correct letter format with recipient address and salutation. Three-paragraph structure: view, evidence, suggestion. Formal sign-off.',
    },
  },

  {
    id: 'sw-8',
    level: 'P5',
    title: 'Formal letter to community centre: request for charity bake sale',
    format: 'Formal Letter',
    purpose: 'To request permission from the community centre to hold a charity bake sale on their premises.',
    audience: 'The Manager, Toa Payoh Community Centre',
    context: 'Your school\'s Charity Club wants to raise funds for the Children\'s Cancer Foundation by holding a bake sale. You would like to use the community centre\'s main hall on a Saturday afternoon. You are the Club President and your teacher-advisor has approved the plan.',
    bullets: [
      'Explain who you are and the purpose of the bake sale',
      'Give details about the date, time and what you plan to sell',
      'Assure the centre that you will leave the venue clean and tidy',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `The Manager
Toa Payoh Community Centre

Dear Sir/Madam,

I am writing on behalf of the Charity Club of Toa Payoh Primary School to request permission to hold a charity bake sale at your community centre. All proceeds will be donated to the Children's Cancer Foundation.

We would like to use the main hall on Saturday, 14 June, from 10 a.m. to 2 p.m. Our students will sell home-baked items such as cookies, cupcakes and brownies. All baked goods will be prepared hygienically and packaged in sealed bags.

We assure you that our members will clean the venue thoroughly after the event and ensure it is returned to its original condition.

We look forward to your kind approval.

Yours faithfully,
Siti Norzahra
President, Charity Club`,
    checklist: [
      'Have I explained who I am and the purpose of the event (first bullet)?',
      'Have I included specific details about date, time and what will be sold (second bullet)?',
      'Have I given a clear assurance about leaving the venue clean (third bullet)?',
      'Is my tone polite and formal, appropriate for a request letter?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: purpose and identity, specific event details, and assurance about venue care. The request is complete and professional.',
      language: 'Formal register throughout. Appropriate phrases like "we assure you" and "kind approval." Specific and factual rather than vague.',
      organisation: 'Correct formal letter format. Three clear paragraphs each covering one bullet. Polite and deferential sign-off.',
    },
  },

  {
    id: 'sw-9',
    level: 'P6',
    title: 'Formal letter to museum: request for guided tour',
    format: 'Formal Letter',
    purpose: 'To request a guided tour of the Asian Civilisations Museum for your school\'s heritage project.',
    audience: 'The Education Officer, Asian Civilisations Museum',
    context: 'Your class is working on a heritage project and your teacher has asked you to arrange a guided tour of the Asian Civilisations Museum. There are 30 students in your class. Your preferred date is in late April and the visit will need to last about two hours.',
    bullets: [
      'Explain the reason for the visit and which class it is for',
      'State the number of students, preferred date and duration of the tour',
      'Ask what information or preparation students should bring or do before the visit',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `The Education Officer
Asian Civilisations Museum

Dear Sir/Madam,

I am writing on behalf of Mr Wong's Primary 6 class at Raffles Primary School to request a guided tour of the Asian Civilisations Museum. We are currently working on a school heritage project and believe a visit to your museum would greatly enrich our understanding of Singapore's diverse cultural history.

Our class consists of 30 students. We would prefer a visit in the last week of April, on any weekday that is convenient for the museum. We would need approximately two hours for the guided tour.

Could you please advise us on what information we should prepare beforehand, and whether students should bring any particular materials?

Yours faithfully,
Ryan Tan
Class Representative, Primary 6 Diligence`,
    checklist: [
      'Have I explained the purpose of the visit and which class it is for (first bullet)?',
      'Have I included the number of students, preferred date and estimated duration (second bullet)?',
      'Have I asked a clear question about preparation or materials (third bullet)?',
      'Is the format correct — recipient address, salutation, formal paragraphs and sign-off?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: purpose and class details, visit logistics, and a genuine preparatory question. Request is clear and complete.',
      language: 'Consistently formal. Phrases like "greatly enrich our understanding" and "at your convenience" are appropriate. Well-constructed sentences.',
      organisation: 'Correct letter format throughout. Three paragraphs each address one bullet. Ends with an appropriate formal sign-off.',
    },
  },

  // ─── Informal Letters and Notes ───────────────────────────────────────────

  {
    id: 'sw-10',
    level: 'P5',
    title: 'Informal letter to a friend: sharing news of winning a competition',
    format: 'Informal Letter',
    purpose: 'To share your exciting news about winning first prize in the National Young Writers\' Competition with your close friend.',
    audience: 'Your best friend, Hui Ling, who moved to Penang last year',
    context: 'You have just received news that your short story won first prize in the National Young Writers\' Competition. You were not expecting to win and are overjoyed. The prize includes a trophy, a cash prize of $500 and publication in a literary magazine.',
    bullets: [
      'Share the exciting news and describe how you felt when you found out',
      'Describe what you won and what will happen next (publication)',
      'Ask Hui Ling for her news and suggest staying in touch more often',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Blk 32 Tampines Avenue 4
Singapore 520032

14 May 2026

Dear Hui Ling,

I hope you're doing well! I have the most exciting news to share — I won first prize in the National Young Writers' Competition! When my teacher read out my name, I literally couldn't believe it. I actually thought she had made a mistake!

The prize is a beautiful trophy, $500 in cash and — the best part — my story will be published in a real literary magazine! I keep pinching myself to check it's not a dream.

Now it's your turn — how are things in Penang? We really should write to each other more often. Promise you'll reply soon!

Your excited friend,
Jia En`,
    checklist: [
      'Have I shared the news clearly and described my feelings (first bullet)?',
      'Have I mentioned all three things won, including the publication (second bullet)?',
      'Have I asked Hui Ling about her news and suggested keeping in touch (third bullet)?',
      'Is my tone warm, lively and informal throughout, suitable for writing to a best friend?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: excited announcement with feelings, description of all prizes and publication, and friendly question with suggestion to stay in touch.',
      language: 'Natural informal register with appropriate enthusiasm. Good use of informal expressions without slang that would be unclear. Exclamation marks used appropriately.',
      organisation: 'Correct informal letter format: address, date, greeting, three content paragraphs, sign-off. Each paragraph addresses one bullet naturally.',
    },
  },

  {
    id: 'sw-11',
    level: 'P5',
    title: 'Informal letter to cousin: birthday gathering invitation',
    format: 'Informal Letter',
    purpose: 'To invite your cousin to your birthday gathering at your home.',
    audience: 'Your cousin, Reza, who lives in Jurong',
    context: 'Your birthday is on 5 July and you are having a small gathering at your home in the afternoon. Your parents have agreed to let you invite a few close relatives. There will be food, games and a birthday cake. You want to make sure Reza can come and knows what to expect.',
    bullets: [
      'Invite Reza and give the date, time and location of the gathering',
      'Describe what will happen at the gathering (food, activities)',
      'Ask Reza to confirm whether he can attend and how to contact you',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Blk 18 Bedok South Road
Singapore 460018

20 June 2026

Dear Reza,

Guess what — my birthday is coming up and I am having a small gathering at my place! I would love for you to come over on Saturday, 5 July, from 2 p.m. to 6 p.m. We live at the address above.

It's going to be a great afternoon. Mum is making her famous nasi lemak and we'll also have games like Jenga and charades. Of course, there will be a chocolate birthday cake too!

Please let me know if you can make it by WhatsApping me or asking Aunty Faridah to call my mum. I really hope you can come!

Your cousin,
Izzat`,
    checklist: [
      'Have I given the date, time and location clearly (first bullet)?',
      'Have I described at least two things happening at the gathering (second bullet)?',
      'Have I asked Reza to confirm and given a way to contact me (third bullet)?',
      'Is my tone warm and casual, suitable for writing to a cousin?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: invitation with logistics, description of food and activities, and a specific way to RSVP.',
      language: 'Informal and friendly tone maintained. Appropriate word choices without being overly casual. Minor colloquialisms are acceptable.',
      organisation: 'Correct informal letter format: address, date, greeting, body paragraphs, sign-off. Information is logically ordered.',
    },
  },

  {
    id: 'sw-12',
    level: 'P5',
    title: 'Note to classmate: update on class party',
    format: 'Note',
    purpose: 'To update a classmate who was absent on what happened at the class party.',
    audience: 'Your classmate, Hui Min, who missed the class party due to illness',
    context: 'The class party was held on the last day of the school term. Hui Min was absent because she was unwell. You want to let her know what she missed so she does not feel left out, and to let her know there are some snacks saved for her.',
    bullets: [
      'Describe two things that happened at the class party',
      'Tell Hui Min that her classmates missed her and that snacks were saved for her',
      'Wish her a speedy recovery and suggest meeting up during the holidays',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Hi Hui Min,

Hope you're feeling better soon! I wanted to fill you in on the class party since you missed it.

It was so much fun! First, we played a blindfolded drawing game where everyone had to draw an animal without looking — the results were hilarious. We also did a lucky dip and Mrs Tan gave everyone a little goodie bag.

By the way, everyone missed you and we made sure to set aside some pizza and a slice of chocolate cake for you. Come and collect them from me when you're back!

I hope you recover quickly. Maybe we can meet up at the playground once the holidays start?

Take care,
Soo Lin`,
    checklist: [
      'Have I described two specific things that happened at the party (first bullet)?',
      'Have I told Hui Min she was missed and that snacks were saved for her (second bullet)?',
      'Have I wished her well and suggested meeting during the holidays (third bullet)?',
      'Is my tone warm and casual, appropriate for a note to a classmate?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: two party events described, expression of being missed and snacks saved, and get-well wish with holiday meetup suggestion.',
      language: 'Informal and warm register. Natural use of expressions like "fill you in" and "hilarious." No overly stiff phrases.',
      organisation: 'Note format is appropriate: no formal address required, just a greeting and sign-off. Content flows naturally in short paragraphs.',
    },
  },

  // ─── Diary Entries ────────────────────────────────────────────────────────

  {
    id: 'sw-13',
    level: 'P5',
    title: 'Diary entry: helping the elderly at a nursing home',
    format: 'Diary Entry',
    purpose: 'To record a meaningful experience of volunteering at an elderly care home.',
    audience: 'Yourself (personal diary)',
    context: 'Your school organised a one-day community service programme at Sunshine Care Home, where students spent the morning chatting with the residents, playing simple games with them and helping distribute their lunch trays. It was your first time in a nursing home.',
    bullets: [
      'Describe what you did during the visit and what surprised or moved you',
      'Reflect on one elderly resident you spoke to and what you learnt from the interaction',
      'Explain how the experience changed the way you think about elderly people or volunteering',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Saturday, 16 May 2026

Dear Diary,

Today was unlike any other school activity I have been on. We visited Sunshine Care Home and spent the morning playing games with the residents and helping to serve their lunch. At first, I felt nervous and unsure of what to say.

Then I met Madam Tan, who is 86 years old. She held my hand and told me about her childhood in Chinatown — her eyes lit up with joy. I realised she simply wanted someone to listen.

Before today, I thought volunteering was about doing tasks. Now I understand it is about being present for another person. I want to go back soon.

Yours,
Wei Lin`,
    checklist: [
      'Have I described specific activities I did and one thing that surprised or moved me (first bullet)?',
      'Have I written about one specific elderly resident and what I learnt from them (second bullet)?',
      'Have I reflected on how the experience changed my thinking (third bullet)?',
      'Is my tone personal, reflective and informal — like a genuine diary entry?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: activities and emotional response, specific resident interaction with lesson learnt, and personal reflection on changed attitude.',
      language: 'Personal and reflective tone. Good use of emotional language. Present reflections are thoughtful and specific rather than generic.',
      organisation: 'Correct diary format: date, "Dear Diary," first-person narration, sign-off. Content progresses naturally from what happened to what was learnt.',
    },
  },

  {
    id: 'sw-14',
    level: 'P6',
    title: 'Diary entry: overcoming stage fright at a school concert',
    format: 'Diary Entry',
    purpose: 'To record the experience of overcoming stage fright to perform in the school\'s annual concert.',
    audience: 'Yourself (personal diary)',
    context: 'You performed a piano solo at the school\'s annual concert. You had been dreading it for weeks because you have always been afraid of performing in front of large audiences. Despite your nerves, you went on stage and completed your performance.',
    bullets: [
      'Describe how you felt before going on stage and what almost made you give up',
      'Narrate what happened during the performance — including a moment when something almost went wrong',
      'Reflect on what you learnt about yourself and what you would tell a friend who is afraid of performing',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Friday, 15 May 2026

Dear Diary,

I almost did not go on stage tonight. Standing in the wings, listening to the applause for the act before me, my legs felt like water. I thought: I cannot do this.

But I walked out anyway. The lights were blinding and the hall felt enormous. Halfway through the piece, my mind went blank and I lost my place for two agonising seconds. Somehow, my fingers found their way back. I finished.

The applause felt unreal. What I learnt tonight is that courage is not the absence of fear — it is going on despite it. If a friend told me they were scared to perform, I would say: the stage is smaller than you think.

Yours,
Natasha`,
    checklist: [
      'Have I described my feelings before going on stage and a moment of doubt (first bullet)?',
      'Have I narrated a moment during the performance when something almost went wrong (second bullet)?',
      'Have I reflected on what I learnt and shared advice for a fearful friend (third bullet)?',
      'Is my tone honest, personal and emotionally genuine — as a diary entry should be?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: pre-performance anxiety and near-quitting, a specific mid-performance crisis, and a meaningful personal reflection with advice.',
      language: 'Vivid language — "legs felt like water," "agonising seconds." Reflective and personal. Shows genuine emotional engagement.',
      organisation: 'Correct diary format. Narrative progresses naturally: before, during, after. Final reflection is the emotional climax.',
    },
  },

  {
    id: 'sw-15',
    level: 'P6',
    title: 'Diary entry: a difficult decision and what you learnt',
    format: 'Diary Entry',
    purpose: 'To reflect on a difficult decision you had to make and the lesson it taught you.',
    audience: 'Yourself (personal diary)',
    context: 'You discovered that your close friend had been copying homework from another classmate and submitting it as her own. You had to decide whether to report it to the teacher or speak to your friend directly. This was a genuinely difficult choice because it involved loyalty and honesty.',
    bullets: [
      'Describe the difficult situation and the two choices you faced',
      'Explain what you decided to do and why you made that choice',
      'Reflect on what the experience taught you about friendship, honesty or doing what is right',
    ],
    wordCount: '100–120 words',
    register: 'informal',
    modelAnswer: `Wednesday, 13 May 2026

Dear Diary,

I had to make the hardest decision today. I found out that my best friend, Rania, has been copying homework from Zoe and submitting it as her own. I could either tell our teacher or speak to Rania directly. Both felt impossible.

I chose to talk to Rania first. I pulled her aside after school and told her quietly that I knew, and that I was worried about her — not angry. She cried. She promised to stop and to redo the assignments honestly.

I learnt today that true friendship means being honest even when it is uncomfortable. Protecting a friend sometimes means telling them something they don't want to hear.

Yours,
Amelia`,
    checklist: [
      'Have I described the situation and the two choices clearly (first bullet)?',
      'Have I explained my decision and given a clear reason for it (second bullet)?',
      'Have I reflected on what I learnt about friendship, honesty or doing right (third bullet)?',
      'Is my tone honest, personal and reflective throughout?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: situation and two choices described, decision made with clear reasoning, and thoughtful reflection on what was learnt.',
      language: 'Personal and emotionally honest. Good variety of sentence structures. Reflection is specific rather than generic.',
      organisation: 'Diary format maintained. Moves logically from situation to decision to reflection. Each paragraph addresses one bullet.',
    },
  },

  // ─── Speeches and Talks ───────────────────────────────────────────────────

  {
    id: 'sw-16',
    level: 'P6',
    title: 'Speech: persuade classmates to reduce plastic use',
    format: 'Speech',
    purpose: 'To persuade your classmates to reduce their use of single-use plastic in school.',
    audience: 'Your Primary 6 classmates',
    context: 'You are giving a short talk during your class\'s Environment Awareness Week. You want to convince your classmates that small changes in their daily habits can make a real difference to the amount of plastic waste generated in school.',
    bullets: [
      'State the problem of plastic waste and why it matters',
      'Suggest two specific things classmates can do to reduce plastic use at school',
      'End with a motivating call to action',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `Good morning, everyone.

Did you know that Singapore throws away enough plastic every day to fill over a thousand double-decker buses? And a large portion of that plastic comes from everyday habits — like grabbing a straw without thinking, or buying a drink in a disposable cup.

The good news is that we can make a difference right here in our own classroom. First, carry a reusable water bottle every day so you don't need to buy bottled drinks. Second, bring your own container when you buy food from the canteen.

These are small changes, but if every one of us makes them, the impact will be enormous.

Will you join me in saying no to unnecessary plastic? Together, we can.

Thank you.`,
    checklist: [
      'Have I opened with an attention-grabbing statistic or question (first bullet)?',
      'Have I suggested exactly two specific and practical actions (second bullet)?',
      'Have I ended with a clear and motivating call to action (third bullet)?',
      'Is my tone persuasive but friendly, suitable for speaking to classmates?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: problem stated with evidence, two specific suggestions, and a rousing call to action. Speech structure is complete.',
      language: 'Semi-formal register appropriate for a speech to classmates. Rhetorical question at the opening is effective. Persuasive language used appropriately.',
      organisation: 'Clear speech structure: opening hook, two suggestions, closing call to action. Greeting and thank-you included as expected for a formal talk.',
    },
  },

  {
    id: 'sw-17',
    level: 'P5',
    title: 'Speech: welcome speech for new students',
    format: 'Speech',
    purpose: 'To welcome new students joining the school at the start of the year.',
    audience: 'New Primary 1 students and their parents, at a school welcome assembly',
    context: 'You are the Head Prefect and have been asked to give a short welcome speech at the school\'s opening assembly. The speech will be heard by new Primary 1 students and their parents. You want the new students to feel excited and welcome.',
    bullets: [
      'Welcome the new students warmly and introduce yourself',
      'Tell them two things they can look forward to at the school',
      'Encourage them with a warm and reassuring closing message',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `Good morning, Principal Tan, teachers, parents and most importantly — our new Primary 1 students!

My name is Shaun Lee and I am the Head Prefect of Riverside Primary School. On behalf of all our students and teachers, I would like to give you all a very warm welcome.

There are so many wonderful things to look forward to here. You will make lifelong friends in your class, and you will have the chance to join exciting CCAs like sports, art and music.

Starting school can feel a little scary, and that is completely normal. But I promise — you will love it here. We are all so happy you have joined our Riverside family.

Welcome home!`,
    checklist: [
      'Have I introduced myself and welcomed the audience clearly (first bullet)?',
      'Have I mentioned two specific things the new students can look forward to (second bullet)?',
      'Have I ended with a warm, reassuring and inclusive closing message (third bullet)?',
      'Is my tone warm, friendly and appropriately formal for a school assembly?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: warm welcome with introduction, two specific things to look forward to, and an encouraging closing that addresses the anxiety of starting school.',
      language: 'Semi-formal register balancing formality (appropriate for assembly) and warmth (appropriate for young children). Good use of inclusive language like "our Riverside family."',
      organisation: 'Clear speech structure: formal greeting, self-introduction, two points of interest, reassuring close. Ends memorably with "Welcome home!"',
    },
  },

  {
    id: 'sw-18',
    level: 'P5',
    title: 'Speech: encourage students to read during school holidays',
    format: 'Speech',
    purpose: 'To encourage your schoolmates to read more books during the upcoming school holidays.',
    audience: 'Students from Primary 3 to Primary 6, at a school assembly',
    context: 'The school\'s Book Club is giving a short talk before the term break begins. You are representing the club and want to motivate students to read at least one book during the holidays.',
    bullets: [
      'Open with a reason why reading during the holidays is worthwhile',
      'Suggest two types of books or ways to find interesting books to read',
      'Challenge students to read at least one book and share what the Book Club will offer to support them',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `Good morning, everyone.

The holidays are almost here — and before you reach for your phone, let me ask you one question: when did you last get lost in a book?

Reading during the holidays is one of the best things you can do. It grows your vocabulary, sparks your imagination, and gives your mind a real workout when there's no homework to do.

Not sure what to read? Try asking a friend for a recommendation, or come to the library — our Book Club has put together a holiday reading list with something for everyone, from adventure stories to fascinating non-fiction.

Here's our challenge: read just one book this holiday. Then come and tell us about it when school reopens. We can't wait to hear from you!

Thank you.`,
    checklist: [
      'Have I opened with an engaging reason to read during holidays (first bullet)?',
      'Have I suggested two ways to find books or two types of books (second bullet)?',
      'Have I issued a specific challenge and mentioned what the Book Club offers (third bullet)?',
      'Is my tone enthusiastic, encouraging and appropriate for a school assembly speech?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: reason for reading in holidays, two suggestions for finding books, and a specific challenge paired with Book Club support.',
      language: 'Semi-formal and upbeat. Good use of a rhetorical question to open. Persuasive without being preachy.',
      organisation: 'Speech structure: hook, benefit, suggestions, challenge, warm close. Greeting and thank-you frame the speech correctly.',
    },
  },

  // ─── Reports and Notices ──────────────────────────────────────────────────

  {
    id: 'sw-19',
    level: 'P6',
    title: 'Newsletter report: school sports day coverage',
    format: 'Report',
    purpose: 'To write a school newsletter report covering the highlights of the school\'s Annual Sports Day.',
    audience: 'Students, parents and staff who will read the school newsletter',
    context: 'The Annual Sports Day was held at the school\'s field last Friday. There were track events, field events and an inter-house relay race. The Red House won the championship trophy. Several records were broken. You are reporting for the school newsletter.',
    bullets: [
      'Open with when the event was held and what the overall atmosphere was like',
      'Describe two specific highlights from the day, including the final relay race result',
      'Quote one participant or teacher and end with a forward-looking statement',
    ],
    wordCount: '100–120 words',
    register: 'semi-formal',
    modelAnswer: `SPORTS DAY 2026 — RED HOUSE TRIUMPHS!

Riverside Primary School's Annual Sports Day was held on Friday, 15 May, under glorious sunshine. The atmosphere was electric from the first whistle, with students from all four houses cheering loudly for their teammates.

The day's highlights included a breathtaking 100-metre sprint in which Primary 6 student Marcus Tan set a new school record. The afternoon was capped by a thrilling inter-house relay race, won by Red House after a dramatic final leg. Red House clinched the overall championship trophy for the second consecutive year.

"This victory belongs to every member of Red House," said Captain Priya Nair. Sports Day 2027 cannot come soon enough!`,
    checklist: [
      'Have I opened with the date and described the atmosphere (first bullet)?',
      'Have I described two highlights, including the relay result (second bullet)?',
      'Have I included a direct quote and a forward-looking statement (third bullet)?',
      'Is my report written in semi-formal third-person style, suitable for a newsletter?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: date and atmosphere, two specific highlights with relay result, direct quote and forward-looking close.',
      language: 'Semi-formal and lively — appropriate for a sports report. Good descriptive vocabulary: "electric," "breathtaking," "dramatic." Third-person perspective maintained.',
      organisation: 'Headline, clear opening, two body paragraphs covering highlights, and a punchy closing line. Reads like a genuine news report.',
    },
  },

  {
    id: 'sw-20',
    level: 'P5',
    title: 'Notice: change to school bus schedule',
    format: 'Notice',
    purpose: 'To inform students who use the school bus about an upcoming change to the schedule.',
    audience: 'Students who use the school bus service',
    context: 'From Monday next week, Bus Route 4 will depart 10 minutes earlier than usual, at 6:50 a.m. instead of 7:00 a.m. The bus stop location has also changed from Gate 2 to Gate 1. Students who are late will not be able to board the bus. Parents should be notified.',
    bullets: [
      'State clearly what is changing, from when, and for which bus route',
      'Explain the new departure time and new boarding location',
      'Remind students to inform their parents and warn about the consequence of being late',
    ],
    wordCount: '100–120 words',
    register: 'formal',
    modelAnswer: `NOTICE — CHANGE TO SCHOOL BUS SCHEDULE

Riverside Primary School
Date: 16 May 2026

To: All students on School Bus Route 4

Please be informed that there will be changes to School Bus Route 4 with effect from Monday, 18 May 2026.

The new departure time will be 6:50 a.m. (10 minutes earlier than the current time of 7:00 a.m.). In addition, the boarding location will change from Gate 2 to Gate 1.

Students who are not at Gate 1 by 6:50 a.m. will not be able to board the bus. Please inform your parents of these changes as soon as possible.

Thank you for your attention.

Transport Department
Riverside Primary School`,
    checklist: [
      'Have I clearly stated which route is affected and when the changes begin (first bullet)?',
      'Have I given the exact new time and new location (second bullet)?',
      'Have I included a reminder to inform parents and a warning about being late (third bullet)?',
      'Is the notice clearly formatted with a heading, date, recipient and sign-off?',
    ],
    rubric: {
      taskFulfillment: 'All three bullets addressed: route and start date, new time and location stated precisely, and both the parental reminder and late-arrival consequence included.',
      language: 'Formal and precise. No unnecessary language. Key details are easy to identify. Appropriate use of "Please be informed" and "with effect from."',
      organisation: 'Correct notice format: heading, date, recipient, body in clear paragraphs, sign-off from the issuing department. Information is logically ordered for easy reading.',
    },
  },

]);
