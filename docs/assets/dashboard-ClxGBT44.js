import{C as ee,r as $e}from"./chartjs-BR_H7_9u.js";import{s as v,g as V,n as q,S as W,V as D,h as M,W as I,a as G,G as T,p as j,b as ke,c as Se,d as Ce,e as N,f as te,i as Le,j as xe,C as Re,k as H,q as Ae,l as Ee,m as Me}from"./index-cfXG_t9o.js";import{g as Oe,a as _e,r as Pe,b as Ie}from"./curriculumMap-C2ahNB2O.js";import"./vocabPassages-BqLHxAMO.js";import"./passages-DNXaSraU.js";import"./gsap-C8pce-KX.js";function E(e){const t=(v.get("questMastery")||{})[e]||{},s=Object.values(t).filter(a=>typeof a=="number");return s.length?s.reduce((a,r)=>a+r,0)/s.length:null}function _(e){const s=(v.get("clueStats")||{})[e];if(!s)return null;if(e==="sentenceForge"){const r=(s.correct||0)+(s.incorrect||0);return r>0?{accuracy:s.correct/r,attempted:r}:null}const a=s.attempted||0;return a?{accuracy:((s.strong||0)+(s.partial||0)*.5)/a,attempted:a,strong:s.strong||0,partial:s.partial||0,weak:s.weak||0}:null}function F(e){const t=(v.get("questMastery")||{})[e]||{};if(!Object.keys(t).length)return null;let s=null,a=1/0;for(const[r,n]of Object.entries(t))n<a&&(a=n,s=r);return s?{skill:s,score:a}:null}function se(){const e=q(v.get("groupMastery")||{});let t=null,s=1/0;for(const a of W){const r=e[a];typeof r=="number"&&r<s&&(s=r,t=a)}return t}function je(e,t=10){const s=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,t);return s.length<3?null:s.filter(a=>a.correct).length/s.length}function Ge(e,t){return e===null?null:e>=.7&&t!==null&&t>=.7?"Finding clues and answering correctly":e>=.7&&t!==null&&t<.55?"Finds clue but chooses wrong answer":e<.5&&t!==null&&t<.5?"Misses clue and answer — needs focused practice":e<.5&&t!==null&&t>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function ae(){var c,d;const e=V(),t=q(v.get("groupMastery")||{}),s=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=W.map(l=>({label:D[l],score:t[l]??null})).filter(l=>l.score!==null),r=[...a].sort((l,y)=>y.score-l.score),n=r[0],o=r[r.length-1],i=[{name:"Grammar Cloze",score:E("clozeCastle")},{name:"Sentence Skills",score:E("sentenceForge")},{name:"Vocabulary Cloze",score:E("wordVault")}].filter(l=>l.score!==null).sort((l,y)=>y.score-l.score),p=((c=i[0])==null?void 0:c.name)||(n?`Phonics (${n.label})`:"Not enough data yet"),m=((d=i[i.length-1])==null?void 0:d.name)||(o?`Phonics (${o.label})`:"Not enough data yet");let u="Building foundations";if((e==null?void 0:e.schoolLevel)==="primary"){const l=E("sentenceForge"),y=E("clozeCastle"),h=E("wordVault");l!==null&&l<.6?u="Sentence structure skills":y!==null&&y<.6?u="Grammar cloze passages":h!==null&&h<.6?u="Vocabulary in context":u="Advanced sentence and grammar skills"}else{const l=se();l&&(t[l]??0)<.6?u=`Short vowel sounds (${D[l]||l})`:a.length?u="Phonics blending and awareness":u="Starting phonics journey"}return{learnerType:s,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:p,weakest:m,currentFocus:u}}function ne(){const e=q(v.get("groupMastery")||{});v.get("clueStats");const t=W.map(p=>e[p]).filter(p=>typeof p=="number"),s=t.length?t.reduce((p,m)=>p+m,0)/t.length:null,a=[],r=_("clozeCastle");r&&a.push(r.accuracy);const n=_("sentenceForge");n&&a.push(n.accuracy);const o=_("wordVault");o&&a.push(o.accuracy);const i=a.length?a.reduce((p,m)=>p+m,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:s,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:E("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:E("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:E("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:E("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:E("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:i,color:"#f59e0b"}]}function re(){const e=v.get("clueStats")||{},t=v.get("questAttempts")||[],s=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:n,label:o,icon:i}of a){const p=_(n);if(!p)continue;const m=t.filter(c=>c.quest===n),u=m.length>=3?m.filter(c=>c.correct).length/m.length:null;s.push({quest:o,icon:i,clueAttempted:p.attempted,clueAccuracy:p.accuracy,answerAccuracy:u,interpretation:Ge(p.accuracy,u)})}const r=Object.entries(e.byType||{}).filter(([,n])=>n.attempted>=3).map(([n,o])=>({type:M(n),accuracy:((o.strong||0)+(o.partial||0)*.5)/o.attempted,attempted:o.attempted})).sort((n,o)=>n.accuracy-o.accuracy);return{questInsights:s,byType:r}}function Te(){return[{code:"LO 3.1",focus:"Decode and blend multi-syllabic words",target:"blend"},{code:"LO 4.2",focus:"Use grammar in context and editing",target:"cloze-castle"},{code:"LO 5.2",focus:"Synthesis and sentence transformation",target:"sentence-forge"}]}function oe(){const e=V(),t=(e==null?void 0:e.schoolLevel)==="primary",s=v.get("groupMastery")||{},a=[];if(t){const r=_("clozeCastle");if(r&&r.accuracy<.6){const p=F("clozeCastle"),m=Math.round(r.accuracy*100);a.push({why:`Grammar clue accuracy is ${m}%.${p?` Weakest area: ${M(p.skill)}.`:""}`,target:`Cloze Castle${p?` – ${M(p.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const n=F("sentenceForge"),o=je("sentenceForge");(o!==null&&o<.65||n&&n.score<.55)&&a.push({why:n?`Sentence skill "${M(n.skill)}" scores ${Math.round(n.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${n?` – ${M(n.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const i=_("wordVault");i&&i.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(i.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const r=se(),n=r?s[r]??0:null;if(r&&n<.65){const p=Math.round(n*100);a.push({why:`${D[r]} decoding accuracy is ${p}% — below the 65% target.`,target:`Phonics – ${D[r]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:r})}const o=W.map(p=>s[p]??0);o.reduce((p,m)=>p+m,0)/o.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function ce(){const e=[],t=v.get("wordHistory")||[],s=v.get("questAttempts")||[],a=v.get("clueStats")||{},r=Date.now(),n=7*24*60*60*1e3,o=t.filter(c=>c.timestamp&&r-new Date(c.timestamp).getTime()<n),i=t.filter(c=>{if(!c.timestamp)return!1;const d=r-new Date(c.timestamp).getTime();return d>=n&&d<2*n});if(o.length>=5&&i.length>=5){const c=o.filter(l=>l.correct).length/o.length,d=i.filter(l=>l.correct).length/i.length;c>d+.1?e.push("Accuracy has improved over the last 7 days"):c<d-.1&&e.push("Accuracy has dipped recently — more practice will help")}const p=a.byType||{},m=Object.entries(p).filter(([,c])=>c.attempted>=3).filter(([,c])=>((c.strong||0)+(c.partial||0)*.5)/c.attempted<.45).map(([c])=>M(c));m.length>0&&e.push(`Struggled with ${m[0]} clues recently`),s.filter(c=>c.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const u=Object.entries(p).filter(([,c])=>c.attempted>=3).filter(([,c])=>((c.strong||0)+(c.partial||0)*.5)/c.attempted>=.75).map(([c])=>M(c));return u.length>0&&e.push(`Strong in ${u[0]} passages`),!e.length&&t.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function ie(){const e=Oe(),t=v.get("wordHistory")||[],s=v.get("streak")||0,a=Date.now(),r=7*24*3600*1e3,n=a-r,o=new Date(n).toISOString().slice(0,10),p=(v.get("weeklyXpLog")||[]).filter(L=>L.date>=o).reduce((L,we)=>L+(we.xp||0),0),m=t.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=n),u=new Set(m.map(L=>L.word).filter(Boolean)).size,c=v.get("questAttempts")||[],d=new Set(c.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=n).map(L=>new Date(L.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&d.add(new Date().toDateString());const l=d.size,y=_e(),h={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},S=h[e.overallSignal]||h["no-data"],w=e.strongDomains[0]||e.masteredDomains[0]||null,$=w?`${w.icon} ${w.label} (${Pe(w.state)})`:"Still building foundations — every session counts!",b=e.domainsAtRisk[0]||e.needsPractice[0]||null,x=b?`${b.icon} ${b.label} needs attention`:null,g=e.progressionDecision,C=g&&g.decision!=="no-data"?g.label:null;let k,A;b?(k=`Practise ${b.icon} ${b.label} this week`,A=(g==null?void 0:g.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(k=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,A="Reviewing words at the right time is how long-term memory forms."):(k="Keep the daily habit going — all areas are in good shape",A="Consistency is the most powerful factor in language learning.");const R=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:l,weekWords:u,weekXp:p,streak:s,domainCounts:y,overallSignal:e.overallSignal,signalLabel:S.label,signalEmoji:S.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:$,mainConcern:x,advancementNote:C,weeklyPriority:k,whyPriority:A,reviewsDue:e.reviewsDue,reviewNote:R}}function Ne(){const e=v.get("wordStats")||{},t=[];for(const s of I){const a=e[s.id];if(!a||a.attempts<6)continue;const r=a.correct/a.attempts;r<.4&&t.push({word:s.word,group:s.group,attempts:a.attempts,accuracy:Math.round(r*100)})}return t.sort((s,a)=>s.accuracy-a.accuracy),t.slice(0,6)}const le={connectorClue:"LO-ENG-GR-03",contextInference:"LO-ENG-VOC-02",synonymContrast:"LO-ENG-VOC-03",definitionMatch:"LO-ENG-VOC-01",idiomaticExpressions:"LO-ENG-VOC-05",proverbsSayings:"LO-ENG-VOC-06",scienceTechTerms:"LO-ENG-VOC-07",socialStudiesVocab:"LO-ENG-VOC-08",pronouns:"LO-ENG-GR-04",svAgreement:"LO-ENG-GR-05",conditionals:"LO-ENG-GR-08",passiveVoice:"LO-ENG-GR-09",reportedSpeech:"LO-ENG-GR-10",relativeClauses:"LO-ENG-GR-11",tenses:"LO-ENG-GR-06",modals:"LO-ENG-GR-07",morphologicalAffix:"LO-ENG-VOC-04",collocationCloze:"LO-ENG-VOC-09",grammaticalRole:"LO-ENG-VOC-10"},De={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function Q(e){const t=De[e.key]||1,s=e.attempts===0?.1:0;return(1-(e.accuracy||0))*t+s}const de="https://www.moe.gov.sg/primary/curriculum/syllabus";function pe(e,t){return t>0?e/t:0}function ue(e,t){const s=v.get("questAttempts")||[];return t.map(a=>{const r=s.filter(i=>i.quest===e&&i.skill===a),n=r.length,o=r.filter(i=>i.correct).length;return{key:a,attempts:n,correct:o,accuracy:pe(o,n)}})}function ge(){var r;const e=Object.keys(G),t=ue("wordVault",e),s=((r=v.get("clueStats"))==null?void 0:r.wordVault)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(n=>{var o,i;return{...n,label:((o=G[n.key])==null?void 0:o.label)||n.key,tooltip:((i=G[n.key])==null?void 0:i.desc)||"Vocabulary development category",loCode:le[n.key]||"LO-ENG-VOC",clueSuccess:a,syllabusLink:de}})}function me(){var r;const e=Object.keys(T),t=ue("clozeCastle",e),s=((r=v.get("clueStats"))==null?void 0:r.clozeCastle)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(n=>{var o,i;return{...n,label:((o=T[n.key])==null?void 0:o.label)||n.key,tooltip:`${((i=T[n.key])==null?void 0:i.label)||n.key} mastery`,loCode:le[n.key]||"LO-ENG-GR",clueSuccess:a,syllabusLink:de}})}function he(){const e=ge().map(s=>({...s,priorityScore:Q(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3),t=me().map(s=>({...s,priorityScore:Q(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3);return{vocab:e,grammar:t}}function ye({days:e=7}={}){const t=v.get("learningEvents")||[],s=Date.now()-e*24*60*60*1e3,r=t.filter(m=>{const u=Date.parse(m.timestamp||"");return Number.isFinite(u)&&u>=s}).filter(m=>m.eventType==="quest_attempt"),n=r.filter(m=>typeof m.responseMs=="number"),o=r.filter(m=>m.correct===!0).length,i=n.length?Math.round(n.reduce((m,u)=>m+u.responseMs,0)/n.length):null,p=["sentenceForge","clozeCastle","wordVault"].map(m=>{const u=r.filter(l=>l.quest===m),c=u.length,d=u.filter(l=>l.correct===!0).length;return{quest:m,attempts:c,accuracy:c>0?d/c:0}});return{days:e,attempts:r.length,correct:o,accuracy:r.length?o/r.length:0,avgResponseMs:i,byQuest:p}}function Be({limit:e=6}={}){const{vocab:t,grammar:s}=he(),a=ye({days:7}),r=[];for(const i of t)r.push({quest:"wordVault",skill:i.key,label:i.label,loCode:i.loCode,reason:`Low mastery (${Math.round(i.accuracy*100)}%) in ${i.label}`,targetAccuracy:.85});for(const i of s)r.push({quest:"clozeCastle",skill:i.key,label:i.label,loCode:i.loCode,reason:`MOE-priority grammar focus: ${i.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&r.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",loCode:"LO-ENG-FLUENCY",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const n=new Set,o=[];for(const i of r){const p=`${i.quest}:${i.skill}`;if(!n.has(p)&&(n.add(p),o.push(i),o.length>=e))break}return o}function Ve(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(s=>{const a=e.filter(i=>i.quest===s).slice(0,12),r=a.length,n=a.filter(i=>i.correct).length,o=pe(n,r);return{quest:s,total:r,correct:n,accuracy:o}})}const U={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},B=Object.freeze({red:55,amber:75}),Y=Object.freeze({green:"🟢 Exam-ready",amber:"🟡 Watch list",red:"🔴 Needs attention"});function ve(e){return e==null||Number.isNaN(e)?"green":e<B.red?"red":e<B.amber?"amber":"green"}function We(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"green",label:Y.green,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const t=e.map(n=>({label:n.label,pct:n.pct,band:ve(n.pct)})),s={red:3,amber:2,green:1},a=t.reduce((n,o)=>s[o.band]>s[n]?o.band:n,"green");let r;if(a==="red"){const n=t.filter(o=>o.band==="red").map(o=>o.label);r=`${K(n)} below ${B.red}% — focused practice this week will lift exam scores.`}else if(a==="amber"){const n=t.filter(o=>o.band==="amber").map(o=>o.label);r=`${K(n)} under ${B.amber}% — solid practice will close the gap before the next paper.`}else r="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:Y[a],summary:r,skills:t}}function K(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function He(e){const t=(e==null?void 0:e.profile)||null,s=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],r=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],n=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},o=s.slice(0,3).map(h=>({label:h.label,pct:Math.round((h.score||0)*100),domain:h.domain||"grammar"})),i=a.slice(0,3).map(h=>({label:h.label,pct:Math.round((h.score||0)*100)})),p=We(o),m=ze(o[0],t),u=qe({topWeak:o,topStrong:i,weekly:n,profile:t}),c=r.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40),mode:h.mode||"",when:h.when||""})),d=o.map(h=>({...h,band:ve(h.pct)})),l=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40)})).filter(h=>h.word):[],y=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40)})).filter(h=>h.word):[];return{learnerName:(t==null?void 0:t.name)||"Your child",grade:(t==null?void 0:t.primaryGrade)||null,avatar:(t==null?void 0:t.avatar)||"🧒",weekly:n,strengths:i.length?i:[{label:"Steady effort",pct:null}],needsPractice:d,recentMistakes:c,recommendation:m,examRisk:p,teacherComment:u,graduatingSoon:l,slippingRecently:y}}function ze(e,t){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const s=U[e.domain]||U.grammar,a=t!=null&&t.primaryGrade?` (${t.primaryGrade})`:"";return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — currently ${e.pct}%. Aim for 8 of 10 correct before bed.`,target:s.target,targetLabel:s.label}}function qe({topWeak:e,topStrong:t,weekly:s,profile:a}){const r=(a==null?void 0:a.name)||"Your child",n=s.days>=5?`${r} has been wonderfully consistent this week (${s.days} active days).`:s.days>=2?`${r} practised on ${s.days} days this week — a solid rhythm.`:`${r} hasn't practised much this week. Two short sessions will keep skills warm.`,o=t[0]?` They are strongest in ${t[0].label}${t[0].pct?` (${t[0].pct}%)`:""}.`:"",i=e[0]?` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%.`:" No clear weak spots — well done!";return`${n}${o}${i} Encourage them to read aloud short passages every day to keep building fluency.`}function Fe(e){var s,a,r,n,o,i;if(!e)return"";const t=[];return t.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),t.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(s=e.strengths)==null?void 0:s[0])!=null&&a.pct?t.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):t.push("✅ Strength: Steady effort"),(r=e.needsPractice)!=null&&r[0]&&t.push(`🎯 Needs practice: ${e.needsPractice[0].label} (${e.needsPractice[0].pct}%)`),e.examRisk&&t.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(n=e.recentMistakes)!=null&&n.length&&t.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(p=>p.word).join(", ")}`),(o=e.graduatingSoon)!=null&&o.length&&t.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(p=>p.word).join(", ")}`),(i=e.slippingRecently)!=null&&i.length&&t.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(p=>p.word).join(", ")} — a 2-min review tonight will help.`),t.push(`👉 Today's 10 min: ${e.recommendation.title}`),t.push(`💬 Teacher's note: ${e.teacherComment}`),t.join(`
`)}ee.register(...$e);let O=null,P=null;function $t(e,t={}){P=t.onNavigate||null;const s=j.getOverallStats();e.innerHTML=`
    <!-- A0: Parent-friendly Report Card (top of the dashboard for non-technical viewing) -->
    <div id="dash-parent-report-card"></div>

    <!-- B0: Parent Coaching Card -->
    <div id="dash-coaching-card"></div>

    <!-- B1: Learner Summary -->
    <div id="dash-learner-summary"></div>

    <!-- B4: Recommended next actions -->
    <div id="dash-actions-section"></div>

    <!-- Stuck words alert -->
    <div id="dash-stuck-words"></div>

    <!-- B2: Literacy Domains -->
    <div id="dash-domains-section"></div>

    <!-- B3: Clue vs Answer Accuracy -->
    <div id="dash-clue-section"></div>

    <!-- B5: Recent Pattern Insights -->
    <div id="dash-patterns-section"></div>

    <!-- B6: Tutor activity — guided lessons, read-aloud, AI usage -->
    <div id="dash-tutor-activity"></div>

    <div id="dash-reporting-section"></div>
    <div id="dash-moe-section"></div>

    <!-- Summary Stats (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Progress Summary</h3>
    <div class="dash-stats-grid">
      <div class="dash-stat-card">
        <span class="dash-stat-value">${s.wordsAttempted}</span>
        <span class="dash-stat-label">Words practiced</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${s.wordsMastered}</span>
        <span class="dash-stat-label">Words mastered</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${Math.round(s.overallAccuracy*100)}%</span>
        <span class="dash-stat-label">Accuracy</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${s.bestStreak}</span>
        <span class="dash-stat-label">Best streak</span>
      </div>
    </div>

    <!-- Accuracy Chart (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Group Mastery</h3>
    <div class="dash-chart-wrap">
      <canvas id="chart-mastery" aria-label="Group mastery chart"></canvas>
    </div>
    <div class="mastery-bar-list" id="mastery-bars"></div>

    <!-- Curriculum Map -->
    <div id="dash-curriculum-map" style="margin-top:24px"></div>

    <!-- Learning Path (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Learning Path</h3>
    <div id="learning-path"></div>

    <!-- Recent Words (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Recent Words</h3>
    <div style="overflow-x:auto;">
      <table class="word-history-table">
        <thead><tr><th>Word</th><th>Mode</th><th>Result</th><th>When</th></tr></thead>
        <tbody id="word-history-body"></tbody>
      </table>
    </div>

    <!-- Badges (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Achievements</h3>
    <div id="badge-grid" class="badge-grid"></div>

    <!-- Actions (existing) -->
    <div class="dash-actions">
      <button class="btn btn--ghost" id="btn-export-csv">Export CSV</button>
      <button class="btn btn--ghost" id="btn-export-csv-anon">Export CSV (Anonymised)</button>
      <button class="btn btn--ghost" id="btn-export-report">Export Parent Report (JSON)</button>
      <button class="btn btn--ghost" id="btn-import-csv">Import Words (CSV)</button>
      <button class="btn btn--ghost" id="btn-print-report">🖨️ Print Report</button>
    </div>

    <!-- Print report wrapper (hidden on screen, shown when printing) -->
    <div class="print-report-wrapper">
      <div class="print-report" id="print-report-content"></div>
    </div>

    <h3 class="dash-section-title" style="margin-top:24px">Adaptive Controls</h3>
    <div class="dash-stats-grid">
      <label class="dash-stat-card">Weak-word Weight
        <input type="range" id="adaptive-weak-weight" min="2" max="8" step="0.5" value="5" />
      </label>
      <label class="dash-stat-card">Unseen-word Weight
        <input type="range" id="adaptive-unseen-weight" min="1" max="6" step="0.5" value="3" />
      </label>
    </div>

    <!-- Custom word import panel (hidden by default) -->
    <div id="csv-import-panel" class="dash-import-panel" hidden>
      <h4 class="dash-section-title">Import Custom Words</h4>
      <p class="dash-import-desc">Upload a CSV with columns: <code>word, graphemes, types, group, level, emoji</code><br>
        Or a simple list with just: <code>word</code> (one per line) — we'll auto-detect phonemes for CVC words.</p>
      <div class="dash-import-drop" id="csv-drop-zone">
        <input type="file" id="csv-file-input" accept=".csv,.txt" hidden />
        <span>Drop CSV file here or <button class="btn btn--ghost btn--sm" id="csv-browse-btn">Browse</button></span>
      </div>
      <div id="csv-import-preview" class="dash-import-preview" hidden></div>
      <div id="csv-import-status" class="dash-import-status" hidden></div>
    </div>
  `,Ue(),Ke(),Ze(),st(),at(),et(),tt(),nt(),rt(),Xe(),Je(),Qe(),ot(s),ct(s),it(s),lt(s),dt(),ut(),pt()}function Qe(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning Journey Map</h3><div id="dash-cm-inner"></div>';const t=document.getElementById("dash-cm-inner");t&&Ie(t)}function Ue(){var w,$,b,x;const e=document.getElementById("dash-parent-report-card");if(!e)return;const t=V(),s=j.getOverallStats(),a=ie(),r=ke(),n=v.get("questMastery")||{},o=[];for(const[,g]of Object.entries(n))if(!(!g||typeof g!="object"))for(const[C,k]of Object.entries(g)){if(typeof k!="number")continue;const A=o.find(R=>R.skill===C);A?k>A.score&&(A.score=k):o.push({skill:C,score:k})}const i=o.filter(g=>g.score>=.75).sort((g,C)=>C.score-g.score).map(g=>({skill:g.skill,label:Ye(g.skill),score:g.score})),p=(s.recentHistory||[]).filter(g=>g&&g.correct===!1).slice(0,5).map(g=>({word:g.wordId,mode:g.mode,when:be(g.timestamp),correct:!1})),m={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(s.totalAttempts||0),accuracy:s.overallAccuracy||0},u=v.get("wordStats")||{},c=Se(u,I).map(g=>({word:g.item.word||g.id})),d=Ce(u,I).map(g=>({word:g.item.word||g.id})),l=He({profile:t,weakSkills:r,strengths:i,recentMistakes:p,weekly:m,graduatingSoon:c,slippingRecently:d});e.innerHTML=`
    <section class="parent-report-card" aria-label="Parent report card" role="region">
      <header class="parent-report-card__head">
        <span class="parent-report-card__avatar" aria-hidden="true">${l.avatar}</span>
        <div>
          <h3 class="parent-report-card__title">📋 Report Card · ${f(l.learnerName)}${l.grade?` <small>(${l.grade})</small>`:""}</h3>
          <p class="parent-report-card__sub">Parent-friendly snapshot · this week ${l.weekly.days} day${l.weekly.days===1?"":"s"}, ${l.weekly.words} questions, ${Math.round(l.weekly.accuracy*100)}% accurate</p>
        </div>
        ${l.examRisk?`
          <div class="exam-risk exam-risk--${l.examRisk.band}" role="status" aria-label="Exam focus: ${f(l.examRisk.label)}">
            <span class="exam-risk__label">${f(l.examRisk.label)}</span>
            <span class="exam-risk__summary">${f(l.examRisk.summary)}</span>
          </div>`:""}
      </header>
      <div class="parent-report-card__grid">
        <div class="parent-report-card__cell">
          <h4>✅ Strengths</h4>
          <ul>
            ${l.strengths.map(g=>`<li>${f(g.label)}${g.pct?` <strong>(${g.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${l.needsPractice.map(g=>`<li class="needs-practice-item needs-practice-item--${g.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${f(g.label)} <strong>(${g.pct}%)</strong></li>`).join("")||"<li>No major gaps detected</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${l.recentMistakes.map(g=>`<li>${f(g.word)}${g.mode?` <small>· ${f(g.mode)}</small>`:""}${g.when?` <small>· ${f(g.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${(w=l.graduatingSoon)!=null&&w.length||($=l.slippingRecently)!=null&&$.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(b=l.graduatingSoon)!=null&&b.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${l.graduatingSoon.slice(0,5).map(g=>f(g.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(x=l.slippingRecently)!=null&&x.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${l.slippingRecently.slice(0,5).map(g=>f(g.word)).join(", ")} — a 2-min review tonight will help.</p>
          `:""}
        </div>`:""}
        <div class="parent-report-card__cell parent-report-card__cell--cta">
          <h4>⏱️ Recommended 10-minute practice</h4>
          <p><strong>${f(l.recommendation.title)}</strong></p>
          <p class="parent-report-card__detail">${f(l.recommendation.detail)}</p>
          <button class="btn btn--primary btn--sm" id="parent-report-cta" data-target="${l.recommendation.target}">${f(l.recommendation.targetLabel)} →</button>
        </div>
      </div>
      <div class="parent-report-card__teacher">
        <h4>💬 Teacher's note</h4>
        <p>${f(l.teacherComment)}</p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;const y=e.querySelector("#parent-report-cta");y==null||y.addEventListener("click",()=>{const g=y.dataset.target;P&&g&&P({target:g})});const h=e.querySelector("#copy-parent-update"),S=e.querySelector("#parent-update-hint");h==null||h.addEventListener("click",async()=>{var k,A;const g=Fe(l);let C=!1;try{(k=navigator.clipboard)!=null&&k.writeText&&(await navigator.clipboard.writeText(g),C=!0)}catch{}if(!C){const R=document.createElement("textarea");R.value=g,R.setAttribute("aria-label","Parent update message"),R.className="parent-report-card__fallback",R.readOnly=!0,(A=h.parentElement)==null||A.appendChild(R),R.focus(),R.select()}S&&(S.textContent=C?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function Ye(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ke(){const e=document.getElementById("dash-coaching-card");if(!e)return;const t=ie(),s={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[t.overallSignal]||"coaching-card--grey",a=t.advancementNote?`<div class="coaching-advancement">${t.advancementNote}</div>`:"",r=t.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${t.domainsAtRisk.map(u=>`<span class="coaching-domain-chip coaching-chip--red">${u.icon} ${u.label}</span>`).join("")}
       </div>`:"",n=`
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${t.mainStrength}</span>
    </div>`,o=t.mainConcern?`<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${t.mainConcern}</span>
       </div>`:"",i=`
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${t.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${t.whyPriority}</p>
    </div>`,p=t.weekXp>0?`<div class="coaching-stat">
        <span class="coaching-stat-value">+${t.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`:"",m=t.reviewsDue>0?`<div class="coaching-review">
        <span class="coaching-review-icon">🔁</span>
        <span class="coaching-review-text">${t.reviewNote}</span>
       </div>`:"";e.innerHTML=`
    <div class="coaching-card ${s}" aria-label="Parent coaching summary">
      <div class="coaching-card-header">
        <span class="coaching-signal-badge">${t.signalEmoji} ${t.signalLabel}</span>
        <span class="coaching-card-title">This Week's Coaching Report</span>
      </div>

      <div class="coaching-stats-row">
        <div class="coaching-stat">
          <span class="coaching-stat-value">${t.weekDays}</span>
          <span class="coaching-stat-label">days active</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${t.weekWords}</span>
          <span class="coaching-stat-label">words practised</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${t.streak}</span>
          <span class="coaching-stat-label">day streak</span>
        </div>
        ${p}
      </div>

      ${a}
      ${n}
      ${o}
      ${r}
      ${i}
      ${m}
    </div>`}function Xe(){const e=document.getElementById("dash-reporting-section");if(!e)return;const t=ge().sort((u,c)=>u.accuracy-c.accuracy).slice(0,8),s=me().sort((u,c)=>u.accuracy-c.accuracy).slice(0,8),a=Ve(),r=he(),n=ye({days:7}),o=Be({limit:6}),i=u=>u.map(c=>{const d=Math.round((c.accuracy||0)*100),l=Math.round((c.clueSuccess||0)*100);return`<div class="dash-category-row" title="${c.tooltip}">
      <div class="dash-category-head">
        <span><strong>${c.label}</strong> <small>(${c.loCode})</small></span>
        <span>${d}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${d}%"></div></div>
      <div class="dash-category-meta">Attempts: ${c.attempts} · Clue success: ${l}% · <a href="${c.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`}).join(""),p=(u,c)=>`
    <div class="dash-pattern-item">
      <strong>${u}</strong>
      ${c.map(d=>`<div class="dash-category-row" title="${d.tooltip}">
        <div class="dash-category-head">
          <span><strong>${d.label}</strong> <small>(${d.loCode})</small></span>
          <span>${Math.round((d.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((d.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${d.priorityScore.toFixed(2)} · <a href="${d.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join("")}
    </div>`,m=a.map(u=>{const c=Math.round((u.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${u.quest}</strong><br>${u.correct}/${u.total} · ${c}%</div>`}).join("");e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Quest Category Reporting</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${i(t)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${i(s)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${m}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((n.accuracy||0)*100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${n.attempts} · Correct: ${n.correct} · Avg response: ${n.avgResponseMs!==null?`${n.avgResponseMs}ms`:"N/A"}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">MOE Priority Recommendations</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${p("Priority vocabulary revision",r.vocab)}
      ${p("Priority grammar revision",r.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Adaptive Next Lesson Queue</h4>
    <ul class="dash-pattern-list">
      ${o.map(u=>`<li class="dash-pattern-item"><strong>${u.quest}</strong> · ${u.label} <small>(${u.loCode})</small><br>${u.reason}</li>`).join("")}
    </ul>
  `}function Je(){const e=document.getElementById("dash-moe-section");if(!e)return;const t=Te();e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">MOE Learning Outcome Mapping</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item"><strong>${s.code}</strong> · ${s.focus}</li>`).join("")}
    </ul>`}function Ze(){const e=document.getElementById("dash-learner-summary");if(!e)return;const t=ae(),s=v.get("speechLocale")||"en-SG";e.innerHTML=`
    <div class="dash-learner-summary">
      <div class="dash-learner-avatar">${t.profileAvatar}</div>
      <div class="dash-learner-info">
        <div class="dash-learner-name">${t.profileName}</div>
        <div class="dash-learner-type-badge">${t.learnerType} Pathway</div>
      </div>
      <div class="dash-learner-stats">
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Strongest area</span>
          <span class="dash-learner-stat-value">${t.strongest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Needs attention</span>
          <span class="dash-learner-stat-value">${t.weakest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Current focus</span>
          <span class="dash-learner-stat-value">${t.currentFocus}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Speech accent</span>
          <span class="dash-learner-stat-value">${s}</span>
        </div>
      </div>
    </div>`}function et(){const e=document.getElementById("dash-domains-section");if(!e)return;const t=ne(),s=t.some(a=>a.score!==null);e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Literacy Domains</h3>
    ${s?"":'<p class="dash-no-data">Play more to see domain scores here.</p>'}
    <div class="dash-domains-grid">
      ${t.map(a=>{const r=a.score!==null?Math.round(a.score*100):null,n=r===null?"#e5e3fa":r>=70?"var(--color-success)":r>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${a.icon}</span>
            <span class="dash-domain-label">${a.label}</span>
            ${r!==null?`
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${r}%;background:${a.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${n}">${r}%</span>`:'<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'}
          </div>`}).join("")}
    </div>`}function tt(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:t,byType:s}=re();if(!t.length&&!s.length){e.innerHTML=`
      <h3 class="dash-section-title" style="margin-top:24px">Clue Detection</h3>
      <p class="dash-no-data">Complete quests with clue missions to see clue accuracy here.</p>`;return}const a=t.map(n=>{const o=n.clueAccuracy>=.7?"var(--color-success)":n.clueAccuracy>=.45?"var(--color-warning)":"var(--color-error)";return`
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${n.icon} ${n.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${o}">${Math.round(n.clueAccuracy*100)}%</span>
            <span class="dash-clue-metric-sub">(${n.clueAttempted} attempts)</span>
          </div>
          ${n.answerAccuracy!==null?`
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(n.answerAccuracy*100)}%</span>
            </div>`:""}
        </div>
        ${n.interpretation?`<p class="dash-clue-interpretation">${n.interpretation}</p>`:""}
      </div>`}).join(""),r=s.length>0?`
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${s.slice(0,5).map(n=>{const o=Math.round(n.accuracy*100),i=o>=70?"var(--color-success)":o>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${n.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${o}%;background:${i}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${i}">${o}%</span>
          </div>`}).join("")}
    </div>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Clue Detection vs. Answer Accuracy</h3>
    <div class="dash-clue-list">${a}</div>
    ${r}`}function st(){const e=document.getElementById("dash-actions-section");if(!e)return;const t=oe();e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:0">Recommended Next Steps</h3>
    <div class="dash-rec-actions">
      ${t.map((s,a)=>`
        <div class="dash-rec-action">
          <div class="dash-rec-action-num">${a+1}</div>
          <div class="dash-rec-action-body">
            <div class="dash-rec-action-target">${s.target}</div>
            <div class="dash-rec-action-why">${s.why}</div>
          </div>
          <button class="btn btn--primary btn--sm dash-rec-cta"
                  data-target="${s.ctaTarget}"
                  ${s.ctaGroup?`data-group="${s.ctaGroup}"`:""}>
            ${s.ctaLabel}
          </button>
        </div>`).join("")}
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.target,r=s.dataset.group||null;P==null||P({target:a,group:r})})})}function at(){const e=document.getElementById("dash-stuck-words");if(!e)return;const t=Ne();if(!t.length)return;const s=t.map(a=>`
    <div class="stuck-word-pill" aria-label="${a.word}: ${a.accuracy}% correct after ${a.attempts} tries">
      <span class="stuck-word-text">${a.word}</span>
      <span class="stuck-word-stat">${a.accuracy}%</span>
    </div>`).join("");e.innerHTML=`
    <div class="stuck-words-card" role="alert" aria-label="Words needing attention">
      <div class="stuck-words-header">
        <span class="stuck-words-icon" aria-hidden="true">🔍</span>
        <div>
          <h3 class="stuck-words-title">Words Needing Extra Attention</h3>
          <p class="stuck-words-subtitle">Your child has attempted these ${t.length} word${t.length!==1?"s":""} many times with low accuracy. App practice alone may not be enough.</p>
        </div>
      </div>
      <div class="stuck-words-list">${s}</div>
      <p class="stuck-words-tip"><strong>Try at home:</strong> Say the word aloud, clap each sound, then blend — e.g. /c/ … /a/ … /t/ → "cat". Pair it with a picture or object they know.</p>
    </div>`}function nt(){const e=document.getElementById("dash-patterns-section");if(!e)return;const t=ce();t.length&&(e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Recent Learning Patterns</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item">💬 ${s}</li>`).join("")}
    </ul>`)}function rt(){const e=document.getElementById("dash-tutor-activity");if(!e)return;const t=(v.get("lessonHistory")||[]).slice(0,30),s=v.get("readAloudStats")||{},a=(v.get("aiUsageLog")||[]).slice(0,8),r=Object.entries(s).sort((d,l)=>{var y,h;return String(((y=l[1])==null?void 0:y.updatedAt)||"").localeCompare(String(((h=d[1])==null?void 0:h.updatedAt)||""))}).slice(0,5);if(!t.length&&!r.length&&!a.length)return;const n=Date.now()-14*24*60*60*1e3,o=t.filter(d=>{const l=new Date(d.completedAt||d.date).getTime();return Number.isFinite(l)&&l>=n}).length,i=t.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${o}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`:"",p=[...new Set(r.flatMap(([,d])=>(d==null?void 0:d.lastMissedWords)||[]))].slice(0,8),m=r.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${r.reduce((d,[,l])=>d+((l==null?void 0:l.attempts)||0),0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`:"",u={explain:"❓ Why explained",hint:"💡 Hint",ask:"🦉 Ask Giri",grade:"✍️ Essay marked"},c=a.length?`
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${a.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${a.map(d=>`<li class="dash-pattern-item">${u[d.kind]||d.kind} · ${f(d.summary||"")} <small>(${f(d.date||"")})</small></li>`).join("")}
      </ul>
    </details>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Tutor Activity</h3>
    <div class="dash-stats-grid">
      ${i}
      ${m}
    </div>
    ${p.length?`<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${p.map(f).join(", ")}</p>`:""}
    ${c}`}function ot(e){const t=document.getElementById("chart-mastery");if(!t)return;O&&(O.destroy(),O=null);const s=te.filter(o=>N[o]),a=s.map(o=>N[o].label),r=s.map(o=>Math.round((e.groupMastery[o]??0)*100)),n=s.map(o=>N[o].color);O=new ee(t,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:r,backgroundColor:n.map(o=>o+"80"),borderColor:n,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:o=>o+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function ct(e){const t=document.getElementById("mastery-bars");t&&(t.innerHTML=te.map(s=>{const a=N[s];if(!a)return"";const r=Math.round((e.groupMastery[s]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${r}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${r}%</span>
      </div>`}).join(""))}function it(e){const t=document.getElementById("learning-path");if(!t)return;const s=Le(xe());t.innerHTML=Re.map(a=>{const r=s.includes(a.id),n=a.groups??(a.group?[a.group]:[]),o=n.map(p=>e.groupMastery[p]??0),i=n.length?Math.round(o.reduce((p,m)=>p+m,0)/n.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${r?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${i}%"></div>
        </div>
        <span class="mastery-bar-pct">${r?i+"%":"🔒"}</span>
      </div>`}).join("")}function lt(e){const t=document.getElementById("word-history-body");if(!t)return;const s=e.recentHistory.slice(0,30).map(a=>{const r=I.find(p=>p.id===a.wordId),n=(r==null?void 0:r.emoji)||"",o=be(a.timestamp),i=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${n} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${i}</td>
      <td>${o}</td>
    </tr>`});t.innerHTML=s.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function dt(){const e=document.getElementById("badge-grid");if(!e)return;const t=H.getAll();e.setAttribute("aria-label",`${H.earnedCount} of ${H.totalCount} badges earned`),e.innerHTML=t.map(s=>`
    <div class="badge-card ${s.earned?"badge-card--earned":"badge-card--locked"}"
         title="${s.desc}"
         aria-label="${s.name}${s.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${s.earned?s.emoji:"🔒"}</span>
      <span class="badge-name">${s.name}</span>
    </div>`).join("")}function pt(){var r,n,o,i,p,m,u;(r=document.getElementById("btn-export-csv"))==null||r.addEventListener("click",()=>{const c=j.exportCSV(),d=new Blob([c],{type:"text/csv"}),l=URL.createObjectURL(d),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress.csv",y.click(),URL.revokeObjectURL(l)}),(n=document.getElementById("btn-export-csv-anon"))==null||n.addEventListener("click",()=>{const c=j.exportCSV().split(`
`).map((h,S)=>{if(S===0||!h.trim())return h;const[w,...$]=h.split(",");return[`${w.slice(0,1)}***`,...$].join(",")}).join(`
`),d=new Blob([c],{type:"text/csv"}),l=URL.createObjectURL(d),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress-anonymised.csv",y.click(),URL.revokeObjectURL(l)}),(o=document.getElementById("btn-export-report"))==null||o.addEventListener("click",()=>{const c=gt(),d=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),l=URL.createObjectURL(d),y=document.createElement("a");y.href=l,y.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(l)}),(i=document.getElementById("btn-import-csv"))==null||i.addEventListener("click",()=>{const c=document.getElementById("csv-import-panel");c&&(c.hidden=!c.hidden)}),(p=document.getElementById("csv-browse-btn"))==null||p.addEventListener("click",()=>{var c;(c=document.getElementById("csv-file-input"))==null||c.click()}),(m=document.getElementById("csv-file-input"))==null||m.addEventListener("change",c=>{var l;const d=(l=c.target.files)==null?void 0:l[0];d&&Z(d)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",c=>{c.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",c=>{var l,y;c.preventDefault(),e.classList.remove("dash-import-drop--active");const d=(y=(l=c.dataTransfer)==null?void 0:l.files)==null?void 0:y[0];d&&Z(d)}));const t=document.getElementById("adaptive-weak-weight"),s=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};t&&(t.value=String(a.weakWeight??5),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(t.value)})})),s&&(s.value=String(a.unseenWeight??3),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(s.value)})})),(u=document.getElementById("btn-print-report"))==null||u.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function ut(){const e=document.getElementById("print-report-content");if(!e)return;const t=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function s(p){const m=p*100;return m>=70?"#22c55e":m>=40?"#f59e0b":"#ef4444"}function a(p,m,u){var d;const c=[];for(const l of m){const y=Ae.getSkillScore(p,l);if(y===.5)continue;const h=Math.round(y*100),S=s(y),w=((d=u[l])==null?void 0:d.label)||l,$=Math.max(h,4);c.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${$}px;background:${S};"></div>
          <span style="color:${S};font-weight:600;min-width:36px">${h}%</span>
          <span>${f(w)}</span>
        </div>`)}return c.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const r=v.get("xp")??0,n=v.get("streak")??0,o=v.get("dailyGoal")??0,i=(()=>{const p=v.get("dailyHistory")||{},m=Date.now(),u=864e5;let c=0;for(let d=0;d<7;d++){const l=new Date(m-d*u).toISOString().slice(0,10);p[l]&&c++}return c})();e.innerHTML=`
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${f(t)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${r}</span>
          <span><strong>Day streak:</strong> ${n}</span>
          <span><strong>Daily goal:</strong> ${o}</span>
          <span><strong>Days played this week:</strong> ${i}</span>
        </div>
      </div>

      <div class="print-report-section">
        <h3>Grammar Skills</h3>
        ${a("grammarMcq",Ee,T)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${a("vocabMcq",Me,G)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`}function gt(){const e=j.getOverallStats(),t=V();return{generatedAt:new Date().toISOString(),learnerSummary:ae(),literacyDomains:ne(),clueInsights:re(),recommendedActions:oe(),recentPatternInsights:ce(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:t}}}const fe=new Set(["a","e","i","o","u"]),mt=new Set("bcdfghjklmnpqrstvwxyz".split(""));function z(e){const s=e.toLowerCase().split(""),a=s.map(r=>fe.has(r)?"sv":(mt.has(r),"c"));return{graphemes:s,types:a}}function X(e){const t=e.toLowerCase().split("").find(s=>fe.has(s));return t?`short-${t}`:"short-a"}function J(e,t){const s=[],a=[];let r=!1;for(const i of t){if(i==="sv"||i==="lv"){r=!0;continue}r?a.push(i):s.push(i)}const n=s.length,o=a.length;return n<=1&&o<=1?"CVC":n>=2&&o<=1?"blend":n<=1&&o>=2?"CVCC":"CCVCC"}async function Z(e){var m,u;const t=document.getElementById("csv-import-preview"),s=document.getElementById("csv-import-status");if(!t||!s)return;const r=(await e.text()).trim().split(`
`).filter(c=>c.trim());if(!r.length){s.hidden=!1,s.textContent="File is empty.",s.className="dash-import-status dash-import-status--error";return}const n=r[0].trim(),o=n.includes(",");let i=[];const p=new Set(I.map(c=>c.id));if(o){const c=n.toLowerCase().split(",").map($=>$.trim()),d=c.indexOf("word");if(d<0){s.hidden=!1,s.textContent='CSV must have a "word" column.',s.className="dash-import-status dash-import-status--error";return}const l=c.indexOf("graphemes"),y=c.indexOf("types"),h=c.indexOf("group"),S=c.indexOf("level"),w=c.indexOf("emoji");for(let $=1;$<r.length;$++){const b=r[$].split(",").map(k=>k.trim()),x=b[d];if(!x||p.has(x.toLowerCase()))continue;const g=l>=0&&b[l]?b[l].split(/[|;]/):z(x).graphemes,C=y>=0&&b[y]?b[y].split(/[|;]/):z(x).types;i.push({id:x.toLowerCase(),word:x.toLowerCase(),graphemes:g,types:C,pattern:J(g,C),group:h>=0&&b[h]||X(x),level:S>=0&&parseInt(b[S])||1,emoji:w>=0&&b[w]||""})}}else for(const c of r){const d=c.trim().toLowerCase();if(!d||p.has(d))continue;const{graphemes:l,types:y}=z(d);i.push({id:d,word:d,graphemes:l,types:y,pattern:J(l,y),group:X(d),level:1,emoji:""})}if(!i.length){s.hidden=!1,s.textContent="No new words found (all may already exist).",s.className="dash-import-status dash-import-status--error";return}t.hidden=!1,t.innerHTML=`
    <p><strong>${i.length} new word${i.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${i.slice(0,20).map(c=>`<span class="dash-import-word">${c.emoji?c.emoji+" ":""}${c.word} <small>(${c.group})</small></span>`).join("")}${i.length>20?`<span class="dash-import-word">…and ${i.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${i.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(m=document.getElementById("csv-cancel-import"))==null||m.addEventListener("click",()=>{t.hidden=!0,s.hidden=!0}),(u=document.getElementById("csv-confirm-import"))==null||u.addEventListener("click",()=>{I.push(...i);const c=v.get("customWords")||[];v.set("customWords",[...c,...i]),t.hidden=!0,s.hidden=!1,s.textContent=`Imported ${i.length} word${i.length>1?"s":""} successfully!`,s.className="dash-import-status dash-import-status--success"})}function be(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function kt(){O&&(O.destroy(),O=null)}export{kt as destroyDashboard,$t as renderDashboard};
