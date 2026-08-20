import{C as ae,r as Ce}from"./chartjs-BR_H7_9u.js";import{g as Le,s as v,a as xe,r as _e,b as W,n as U,S as H,V,h as R,W as P,c as G,G as T,d as ne,e as Ae,p as N,f as Ee,i as Re,j as Me,k as D,l as re,m as Oe,o as je,C as Pe,q,t as Ne,u as Ie,v as Ge,w as Te}from"./index-CD8XPrJh.js";import{r as De}from"./curriculumMap-CA2-RWc7.js";import"./vocabPassages-Dtk6gZvg.js";import"./passages-BK2yWHXn.js";import"./gsap-C8pce-KX.js";import"./practiceExpansion-CxOuQ-yw.js";function A(e){const t=(v.get("questMastery")||{})[e]||{},s=Object.values(t).filter(a=>typeof a=="number");return s.length?s.reduce((a,r)=>a+r,0)/s.length:null}function O(e){const s=(v.get("clueStats")||{})[e];if(!s)return null;if(e==="sentenceForge"){const r=(s.correct||0)+(s.incorrect||0);return r>0?{accuracy:s.correct/r,attempted:r}:null}const a=s.attempted||0;return a?{accuracy:((s.strong||0)+(s.partial||0)*.5)/a,attempted:a,strong:s.strong||0,partial:s.partial||0,weak:s.weak||0}:null}function K(e){const t=(v.get("questMastery")||{})[e]||{};if(!Object.keys(t).length)return null;let s=null,a=1/0;for(const[r,n]of Object.entries(t))n<a&&(a=n,s=r);return s?{skill:s,score:a}:null}function oe(){const e=U(v.get("groupMastery")||{});let t=null,s=1/0;for(const a of H){const r=e[a];typeof r=="number"&&r<s&&(s=r,t=a)}return t}function Ve(e,t=10){const s=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,t);return s.length<3?null:s.filter(a=>a.correct).length/s.length}function Be(e,t){return e===null?null:e>=.7&&t!==null&&t>=.7?"Finding clues and answering correctly":e>=.7&&t!==null&&t<.55?"Finds clue but chooses wrong answer":e<.5&&t!==null&&t<.5?"Misses clue and answer — needs focused practice":e<.5&&t!==null&&t>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function ce(){var c,p;const e=W(),t=U(v.get("groupMastery")||{}),s=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=H.map(i=>({label:V[i],score:t[i]??null})).filter(i=>i.score!==null),r=[...a].sort((i,y)=>y.score-i.score),n=r[0],o=r[r.length-1],l=[{name:"Grammar Cloze",score:A("clozeCastle")},{name:"Sentence Skills",score:A("sentenceForge")},{name:"Vocabulary Cloze",score:A("wordVault")}].filter(i=>i.score!==null).sort((i,y)=>y.score-i.score),d=((c=l[0])==null?void 0:c.name)||(n?`Phonics (${n.label})`:"Not enough data yet"),g=((p=l[l.length-1])==null?void 0:p.name)||(o?`Phonics (${o.label})`:"Not enough data yet");let u;if((e==null?void 0:e.schoolLevel)==="primary"){const i=A("sentenceForge"),y=A("clozeCastle"),b=A("wordVault");i!==null&&i<.6?u="Sentence structure skills":y!==null&&y<.6?u="Grammar cloze passages":b!==null&&b<.6?u="Vocabulary in context":u="Advanced sentence and grammar skills"}else{const i=oe();i&&(t[i]??0)<.6?u=`Short vowel sounds (${V[i]||i})`:a.length?u="Phonics blending and awareness":u="Starting phonics journey"}return{learnerType:s,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:d,weakest:g,currentFocus:u}}function ie(){const e=U(v.get("groupMastery")||{}),t=H.map(d=>e[d]).filter(d=>typeof d=="number"),s=t.length?t.reduce((d,g)=>d+g,0)/t.length:null,a=[],r=O("clozeCastle");r&&a.push(r.accuracy);const n=O("sentenceForge");n&&a.push(n.accuracy);const o=O("wordVault");o&&a.push(o.accuracy);const l=a.length?a.reduce((d,g)=>d+g,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:s,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:A("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:A("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:A("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:A("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:A("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:l,color:"#f59e0b"}]}function le(){const e=v.get("clueStats")||{},t=v.get("questAttempts")||[],s=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:n,label:o,icon:l}of a){const d=O(n);if(!d)continue;const g=t.filter(c=>c.quest===n),u=g.length>=3?g.filter(c=>c.correct).length/g.length:null;s.push({quest:o,icon:l,clueAttempted:d.attempted,clueAccuracy:d.accuracy,answerAccuracy:u,interpretation:Be(d.accuracy,u)})}const r=Object.entries(e.byType||{}).filter(([,n])=>n.attempted>=3).map(([n,o])=>({type:R(n),accuracy:((o.strong||0)+(o.partial||0)*.5)/o.attempted,attempted:o.attempted})).sort((n,o)=>n.accuracy-o.accuracy);return{questInsights:s,byType:r}}function We(){return[{code:"LO 3.1",focus:"Decode and blend multi-syllabic words",target:"blend"},{code:"LO 4.2",focus:"Use grammar in context and editing",target:"cloze-castle"},{code:"LO 5.2",focus:"Synthesis and sentence transformation",target:"sentence-forge"}]}function de(){const e=W(),t=(e==null?void 0:e.schoolLevel)==="primary",s=v.get("groupMastery")||{},a=[];if(t){const r=O("clozeCastle");if(r&&r.accuracy<.6){const d=K("clozeCastle"),g=Math.round(r.accuracy*100);a.push({why:`Grammar clue accuracy is ${g}%.${d?` Weakest area: ${R(d.skill)}.`:""}`,target:`Cloze Castle${d?` – ${R(d.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const n=K("sentenceForge"),o=Ve("sentenceForge");(o!==null&&o<.65||n&&n.score<.55)&&a.push({why:n?`Sentence skill "${R(n.skill)}" scores ${Math.round(n.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${n?` – ${R(n.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const l=O("wordVault");l&&l.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(l.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const r=oe(),n=r?s[r]??0:null;if(r&&n<.65){const d=Math.round(n*100);a.push({why:`${V[r]} decoding accuracy is ${d}% — below the 65% target.`,target:`Phonics – ${V[r]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:r})}const o=H.map(d=>s[d]??0);o.reduce((d,g)=>d+g,0)/o.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function pe(){const e=[],t=v.get("wordHistory")||[],s=v.get("questAttempts")||[],a=v.get("clueStats")||{},r=Date.now(),n=7*24*60*60*1e3,o=t.filter(c=>c.timestamp&&r-new Date(c.timestamp).getTime()<n),l=t.filter(c=>{if(!c.timestamp)return!1;const p=r-new Date(c.timestamp).getTime();return p>=n&&p<2*n});if(o.length>=5&&l.length>=5){const c=o.filter(i=>i.correct).length/o.length,p=l.filter(i=>i.correct).length/l.length;c>p+.1?e.push("Accuracy has improved over the last 7 days"):c<p-.1&&e.push("Accuracy has dipped recently — more practice will help")}const d=a.byType||{},g=Object.entries(d).filter(([,c])=>c.attempted>=3).filter(([,c])=>((c.strong||0)+(c.partial||0)*.5)/c.attempted<.45).map(([c])=>R(c));g.length>0&&e.push(`Struggled with ${g[0]} clues recently`),s.filter(c=>c.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const u=Object.entries(d).filter(([,c])=>c.attempted>=3).filter(([,c])=>((c.strong||0)+(c.partial||0)*.5)/c.attempted>=.75).map(([c])=>R(c));return u.length>0&&e.push(`Strong in ${u[0]} passages`),!e.length&&t.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function ue(){const e=Le(),t=v.get("wordHistory")||[],s=v.get("streak")||0,a=Date.now(),r=7*24*3600*1e3,n=a-r,o=new Date(n).toISOString().slice(0,10),d=(v.get("weeklyXpLog")||[]).filter(w=>w.date>=o).reduce((w,Se)=>w+(Se.xp||0),0),g=t.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=n),u=new Set(g.map(w=>w.word).filter(Boolean)).size,c=v.get("questAttempts")||[],p=new Set(c.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=n).map(w=>new Date(w.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&p.add(new Date().toDateString());const i=p.size,y=xe(),b={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},h=b[e.overallSignal]||b["no-data"],S=e.strongDomains[0]||e.masteredDomains[0]||null,C=S?`${S.icon} ${S.label} (${_e(S.state)})`:"Still building foundations — every session counts!",$=e.domainsAtRisk[0]||e.needsPractice[0]||null,L=$?`${$.icon} ${$.label} needs attention`:null,x=e.progressionDecision,m=x&&x.decision!=="no-data"?x.label:null;let k,_;$?(k=`Practise ${$.icon} ${$.label} this week`,_=(x==null?void 0:x.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(k=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,_="Reviewing words at the right time is how long-term memory forms."):(k="Keep the daily habit going — all areas are in good shape",_="Consistency is the most powerful factor in language learning.");const E=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:i,weekWords:u,weekXp:d,streak:s,domainCounts:y,overallSignal:e.overallSignal,signalLabel:h.label,signalEmoji:h.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:C,mainConcern:L,advancementNote:m,weeklyPriority:k,whyPriority:_,reviewsDue:e.reviewsDue,reviewNote:E}}function He(){const e=v.get("wordStats")||{},t=[];for(const s of P){const a=e[s.id];if(!a||a.attempts<6)continue;const r=a.correct/a.attempts;r<.4&&t.push({word:s.word,group:s.group,attempts:a.attempts,accuracy:Math.round(r*100)})}return t.sort((s,a)=>s.accuracy-a.accuracy),t.slice(0,6)}const me={connectorClue:"LO-ENG-GR-03",contextInference:"LO-ENG-VOC-02",synonymContrast:"LO-ENG-VOC-03",definitionMatch:"LO-ENG-VOC-01",idiomaticExpressions:"LO-ENG-VOC-05",proverbsSayings:"LO-ENG-VOC-06",scienceTechTerms:"LO-ENG-VOC-07",socialStudiesVocab:"LO-ENG-VOC-08",pronouns:"LO-ENG-GR-04",svAgreement:"LO-ENG-GR-05",conditionals:"LO-ENG-GR-08",passiveVoice:"LO-ENG-GR-09",reportedSpeech:"LO-ENG-GR-10",relativeClauses:"LO-ENG-GR-11",tenses:"LO-ENG-GR-06",modals:"LO-ENG-GR-07",morphologicalAffix:"LO-ENG-VOC-04",collocationCloze:"LO-ENG-VOC-09",grammaticalRole:"LO-ENG-VOC-10"},qe={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function X(e){const t=qe[e.key]||1,s=e.attempts===0?.1:0;return(1-(e.accuracy||0))*t+s}const ge="https://www.moe.gov.sg/primary/curriculum/syllabus";function he(e,t){return t>0?e/t:0}function ye(e,t){const s=v.get("questAttempts")||[];return t.map(a=>{const r=s.filter(l=>l.quest===e&&l.skill===a),n=r.length,o=r.filter(l=>l.correct).length;return{key:a,attempts:n,correct:o,accuracy:he(o,n)}})}function ve(){var r;const e=Object.keys(G),t=ye("wordVault",e),s=((r=v.get("clueStats"))==null?void 0:r.wordVault)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(n=>{var o,l;return{...n,label:((o=G[n.key])==null?void 0:o.label)||n.key,tooltip:((l=G[n.key])==null?void 0:l.desc)||"Vocabulary development category",loCode:me[n.key]||"LO-ENG-VOC",clueSuccess:a,syllabusLink:ge}})}function fe(){var r;const e=Object.keys(T),t=ye("clozeCastle",e),s=((r=v.get("clueStats"))==null?void 0:r.clozeCastle)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(n=>{var o,l;return{...n,label:((o=T[n.key])==null?void 0:o.label)||n.key,tooltip:`${((l=T[n.key])==null?void 0:l.label)||n.key} mastery`,loCode:me[n.key]||"LO-ENG-GR",clueSuccess:a,syllabusLink:ge}})}function be(){const e=ve().map(s=>({...s,priorityScore:X(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3),t=fe().map(s=>({...s,priorityScore:X(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3);return{vocab:e,grammar:t}}function we({days:e=7}={}){const t=v.get("learningEvents")||[],s=Date.now()-e*24*60*60*1e3,r=t.filter(g=>{const u=Date.parse(g.timestamp||"");return Number.isFinite(u)&&u>=s}).filter(g=>g.eventType==="quest_attempt"),n=r.filter(g=>typeof g.responseMs=="number"),o=r.filter(g=>g.correct===!0).length,l=n.length?Math.round(n.reduce((g,u)=>g+u.responseMs,0)/n.length):null,d=["sentenceForge","clozeCastle","wordVault"].map(g=>{const u=r.filter(i=>i.quest===g),c=u.length,p=u.filter(i=>i.correct===!0).length;return{quest:g,attempts:c,accuracy:c>0?p/c:0}});return{days:e,attempts:r.length,correct:o,accuracy:r.length?o/r.length:0,avgResponseMs:l,byQuest:d}}function ze({limit:e=6}={}){const{vocab:t,grammar:s}=be(),a=we({days:7}),r=[];for(const l of t)r.push({quest:"wordVault",skill:l.key,label:l.label,loCode:l.loCode,reason:`Low mastery (${Math.round(l.accuracy*100)}%) in ${l.label}`,targetAccuracy:.85});for(const l of s)r.push({quest:"clozeCastle",skill:l.key,label:l.label,loCode:l.loCode,reason:`MOE-priority grammar focus: ${l.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&r.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",loCode:"LO-ENG-FLUENCY",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const n=new Set,o=[];for(const l of r){const d=`${l.quest}:${l.skill}`;if(!n.has(d)&&(n.add(d),o.push(l),o.length>=e))break}return o}function Fe(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(s=>{const a=e.filter(l=>l.quest===s).slice(0,12),r=a.length,n=a.filter(l=>l.correct).length,o=he(n,r);return{quest:s,total:r,correct:n,accuracy:o}})}const Z={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},B=Object.freeze({red:55,amber:75}),J=Object.freeze({unknown:"⚪ Not enough evidence",green:"🟢 Secure",amber:"🟡 Developing",red:"🔴 Needs support"});function $e(e){return e==null||Number.isNaN(e)?"unknown":e<B.red?"red":e<B.amber?"amber":"green"}function Ue(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"unknown",label:J.unknown,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const t=e.map(n=>({label:n.label,pct:n.pct,band:$e(n.pct),attempts:n.attempts??0,independentAttempts:n.independentAttempts??0,lastPractised:n.lastPractised??null,confidence:n.confidence??ne(n.independentAttempts??0)})),s={red:4,unknown:3,amber:2,green:1},a=t.reduce((n,o)=>s[o.band]>s[n]?o.band:n,"green");let r;if(a==="red"){const n=t.filter(o=>o.band==="red").map(o=>o.label);r=`${z(n)} below ${B.red}% — focused practice this week will lift exam scores.`}else if(a==="unknown"){const n=t.filter(o=>o.band==="unknown").map(o=>o.label);r=`Not enough practice yet to judge ${z(n)} — a few short sessions will show where things stand.`}else if(a==="amber"){const n=t.filter(o=>o.band==="amber").map(o=>o.label);r=`${z(n)} under ${B.amber}% — solid practice will close the gap before the next paper.`}else r="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:J[a],summary:r,skills:t}}function z(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Qe(e){const t=(e==null?void 0:e.profile)||null,s=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],r=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],n=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},o=s.slice(0,3).map(h=>({label:h.label,pct:(h.attempts??0)>0?Math.round((h.score||0)*100):null,domain:h.domain||"grammar",attempts:h.attempts??0,independentAttempts:h.independentAttempts??0,lastPractised:h.lastPractised??null,confidence:h.confidence??ne(h.independentAttempts??0)})),l=a.slice(0,3).map(h=>({label:h.label,pct:Math.round((h.score||0)*100)})),d=Ue(o),g=Ye(o[0],t),u=Ke({topWeak:o,topStrong:l,weekly:n,profile:t}),c=r.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40),mode:h.mode||"",when:h.when||""})),p=o.map(h=>({...h,band:$e(h.pct)})),i=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40)})).filter(h=>h.word):[],y=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(h=>({word:String(h.word||"").slice(0,40)})).filter(h=>h.word):[],b=Ae(3).map(h=>({id:h.id,label:h.childName,teacherLabel:h.label,count:h.count,tip:h.selfCheck}));return{learnerName:(t==null?void 0:t.name)||"Your child",grade:(t==null?void 0:t.primaryGrade)||null,avatar:(t==null?void 0:t.avatar)||"🧒",weekly:n,strengths:l.length?l:[{label:"Steady effort",pct:null}],needsPractice:p,habits:b,recentMistakes:c,recommendation:g,examRisk:d,teacherComment:u,graduatingSoon:i,slippingRecently:y}}function Ye(e,t){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const s=Z[e.domain]||Z.grammar,a=t!=null&&t.primaryGrade?` (${t.primaryGrade})`:"",r=e.pct==null?"not enough practice yet to give a score":`currently ${e.pct}%${Q(e)}`;return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — ${r}. Aim for 8 of 10 correct before bed.`,target:s.target,targetLabel:s.label}}function Q(e){const t=(e==null?void 0:e.attempts)??0;return t<=0||t>=12?"":` from just ${t} answer${t===1?"":"s"}`}function Ke({topWeak:e,topStrong:t,weekly:s,profile:a}){const r=(a==null?void 0:a.name)||"Your child",n=s.days>=5?`${r} has been wonderfully consistent this week (${s.days} active days).`:s.days>=2?`${r} practised on ${s.days} days this week — a solid rhythm.`:`${r} hasn't practised much this week. Two short sessions will keep skills warm.`,o=t[0]?` They are strongest in ${t[0].label}${t[0].pct?` (${t[0].pct}%)`:""}.`:"",l=e[0]?e[0].pct==null?` ${e[0].label} is the area to look at next — there isn't enough practice yet to put a number on it.`:` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%${Q(e[0])}.`:" No weak spots have shown up yet — there may simply not be enough practice recorded to tell.";return`${n}${o}${l} Encourage them to read aloud short passages every day to keep building fluency.`}function Xe(e){var s,a,r,n,o,l;if(!e)return"";const t=[];if(t.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),t.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(s=e.strengths)==null?void 0:s[0])!=null&&a.pct?t.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):t.push("✅ Strength: Steady effort"),(r=e.needsPractice)!=null&&r[0]){const d=e.needsPractice[0],g=d.pct==null?"not enough practice yet to score":`${d.pct}%${Q(d)}`;t.push(`🎯 Needs practice: ${d.label} (${g})`)}return e.examRisk&&t.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(n=e.recentMistakes)!=null&&n.length&&t.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(d=>d.word).join(", ")}`),(o=e.graduatingSoon)!=null&&o.length&&t.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(d=>d.word).join(", ")}`),(l=e.slippingRecently)!=null&&l.length&&t.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(d=>d.word).join(", ")} — a 2-min review tonight will help.`),t.push(`👉 Today's 10 min: ${e.recommendation.title}`),t.push(`💬 Automated learning summary: ${e.teacherComment}`),t.join(`
`)}ae.register(...Ce);let M=null,j=null;function Rt(e,t={}){j=t.onNavigate||null;const s=N.getOverallStats();e.innerHTML=`
    <!-- ── At a glance ────────────────────────────────────────────────────
         What a parent came for: is this working, and what do we do tonight.
         Everything else is behind a disclosure below. This block used to be
         the first of 24 stacked sections in a 13,298 px page — 15.8 phone
         screens, every one of them reading "No data yet" on a new profile. -->
    <div id="dash-parent-report-card"></div>
    <div id="dash-actions-section"></div>
    <div id="dash-stuck-words"></div>

    <details class="dash-group" id="dash-group-week">
      <summary class="dash-group__summary">How this week went</summary>
      <div class="dash-group__body">
        <div id="dash-coaching-card"></div>
        <div id="dash-learner-summary"></div>
        <div id="dash-patterns-section"></div>
        <div id="dash-tutor-activity"></div>
      </div>
    </details>

    <details class="dash-group" id="dash-group-skills">
      <summary class="dash-group__summary">Skills in detail</summary>
      <div class="dash-group__body">
        <div id="dash-domains-section"></div>
        <div id="dash-clue-section"></div>
        <div id="dash-reporting-section"></div>
        <div id="dash-moe-section"></div>
        <div id="dash-group-mastery">
          <h3 class="dash-section-title" style="margin-top:24px">Sound groups mastered</h3>
          <div class="dash-chart-wrap">
            <canvas id="chart-mastery" aria-label="Sound group mastery chart"></canvas>
          </div>
          <div class="mastery-bar-list" id="mastery-bars"></div>
        </div>
        <div id="dash-curriculum-map" style="margin-top:24px"></div>
        <div id="dash-learning-path">
          <h3 class="dash-section-title" style="margin-top:24px">Where they are in the path</h3>
          <div id="learning-path"></div>
        </div>
      </div>
    </details>

    <details class="dash-group" id="dash-group-records">
      <summary class="dash-group__summary">Records and tools</summary>
      <div class="dash-group__body">
        <h3 class="dash-section-title" style="margin-top:24px">Totals so far</h3>
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

        <h3 class="dash-section-title" style="margin-top:24px">Recent words practised</h3>
        <div style="overflow-x:auto;">
          <table class="word-history-table">
            <thead><tr><th>Word</th><th>Mode</th><th>Result</th><th>When</th></tr></thead>
            <tbody id="word-history-body"></tbody>
          </table>
        </div>

        <h3 class="dash-section-title" style="margin-top:24px">Badges earned</h3>
        <div id="badge-grid" class="badge-grid"></div>

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

        <h3 class="dash-section-title" style="margin-top:24px">Practice tuning (advanced)</h3>
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
      </div>
    </details>
  `,tt(),nt(),ct(),dt(),pt(),it(),lt(),ut(),mt(),rt(),ot(),et(),gt(s),ht(s),yt(s),vt(s),ft(),wt(),bt(),Je()}function I(e,t){e&&(t?e.setAttribute("data-dash-empty","true"):e.removeAttribute("data-dash-empty"))}function Ze(e){return e.getAttribute("data-dash-empty")==="true"?!0:e.children.length===0&&!e.textContent.trim()}function Je(){for(const e of document.querySelectorAll(".dash-group")){const t=e.querySelectorAll(".dash-group__body > div[id]");if(!t.length)continue;const s=Array.from(t).every(Ze);e.hidden=s}}function et(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning journey</h3><div id="dash-cm-inner"></div>';const t=document.getElementById("dash-cm-inner");t&&De(t)}function tt(){var S,C,$,L,x;const e=document.getElementById("dash-parent-report-card");if(!e)return;const t=W(),s=N.getOverallStats(),a=ue(),r=Ee(),n=v.get("questMastery")||{},o=[];for(const[,m]of Object.entries(n))if(!(!m||typeof m!="object"))for(const[k,_]of Object.entries(m)){if(typeof _!="number")continue;const E=o.find(w=>w.skill===k);E?_>E.score&&(E.score=_):o.push({skill:k,score:_})}const l=o.filter(m=>m.score>=.75).sort((m,k)=>k.score-m.score).map(m=>({skill:m.skill,label:at(m.skill),score:m.score})),d=(s.recentHistory||[]).filter(m=>m&&m.correct===!1).slice(0,5).map(m=>({word:m.wordId,mode:m.mode,when:Y(m.timestamp),correct:!1})),g={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(s.totalAttempts||0),accuracy:s.overallAccuracy||0},u=v.get("wordStats")||{},c=Re(u,P).map(m=>({word:m.item.word||m.id})),p=Me(u,P).map(m=>({word:m.item.word||m.id})),i=Qe({profile:t,weakSkills:r,strengths:l,recentMistakes:d,weekly:g,graduatingSoon:c,slippingRecently:p});e.innerHTML=`
    <section class="parent-report-card" aria-label="Parent report card" role="region">
      <header class="parent-report-card__head">
        <span class="parent-report-card__avatar" aria-hidden="true">${i.avatar}</span>
        <div>
          <h3 class="parent-report-card__title">📋 Report Card · ${f(i.learnerName)}${i.grade?` <small>(${i.grade})</small>`:""}</h3>
          <p class="parent-report-card__sub">Parent-friendly snapshot · this week ${i.weekly.days} day${i.weekly.days===1?"":"s"}, ${i.weekly.words} questions, ${Math.round(i.weekly.accuracy*100)}% accurate</p>
        </div>
        ${i.examRisk?`
          <div class="exam-risk exam-risk--${i.examRisk.band}" role="status" aria-label="Exam focus: ${f(i.examRisk.label)}">
            <span class="exam-risk__label">${f(i.examRisk.label)}</span>
            <span class="exam-risk__summary">${f(i.examRisk.summary)}</span>
          </div>`:""}
      </header>
      <div class="parent-report-card__grid">
        <div class="parent-report-card__cell">
          <h4>✅ Strengths</h4>
          <ul>
            ${i.strengths.map(m=>`<li>${f(m.label)}${m.pct?` <strong>(${m.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${i.needsPractice.map(m=>`<li class="needs-practice-item needs-practice-item--${m.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${f(m.label)} <strong>${m.pct==null?"(not enough practice yet)":`(${m.pct}%)`}</strong>${st(m)}</li>`).join("")||"<li>Nothing has been measured yet — a few short sessions will show where things stand</li>"}
          </ul>
        </div>
        ${(S=i.habits)!=null&&S.length?`
        <div class="parent-report-card__cell parent-report-card__cell--habits">
          <h4>🔁 Habits to work on</h4>
          <ul class="report-habits">
            ${i.habits.map(m=>`<li class="report-habit">
                  <span class="report-habit__name">${f(m.label)} <small>· ${m.count} time${m.count===1?"":"s"}</small></span>
                  <span class="report-habit__tip">${f(m.tip)}</span>
                </li>`).join("")}
          </ul>
        </div>`:""}
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${i.recentMistakes.map(m=>`<li>${f(m.word)}${m.mode?` <small>· ${f(m.mode)}</small>`:""}${m.when?` <small>· ${f(m.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${(C=i.graduatingSoon)!=null&&C.length||($=i.slippingRecently)!=null&&$.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(L=i.graduatingSoon)!=null&&L.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${i.graduatingSoon.slice(0,5).map(m=>f(m.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(x=i.slippingRecently)!=null&&x.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${i.slippingRecently.slice(0,5).map(m=>f(m.word)).join(", ")} — a 2-min review tonight will help.</p>
          `:""}
        </div>`:""}
        <div class="parent-report-card__cell parent-report-card__cell--cta">
          <h4>⏱️ Recommended 10-minute practice</h4>
          <p><strong>${f(i.recommendation.title)}</strong></p>
          <p class="parent-report-card__detail">${f(i.recommendation.detail)}</p>
          <button class="btn btn--primary btn--sm" id="parent-report-cta" data-target="${i.recommendation.target}">${f(i.recommendation.targetLabel)} →</button>
        </div>
      </div>
      <div class="parent-report-card__teacher">
        <h4>💬 Automated learning summary</h4>
        <p>${f(i.teacherComment)}</p>
        <p class="parent-report-card__detail"><small>Generated from recorded practice — not reviewed by a teacher.</small></p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;const y=e.querySelector("#parent-report-cta");y==null||y.addEventListener("click",()=>{const m=y.dataset.target;j&&m&&j({target:m})});const b=e.querySelector("#copy-parent-update"),h=e.querySelector("#parent-update-hint");b==null||b.addEventListener("click",async()=>{var _,E;const m=Xe(i);let k=!1;try{(_=navigator.clipboard)!=null&&_.writeText&&(await navigator.clipboard.writeText(m),k=!0)}catch{}if(!k){const w=document.createElement("textarea");w.value=m,w.setAttribute("aria-label","Parent update message"),w.className="parent-report-card__fallback",w.readOnly=!0,(E=b.parentElement)==null||E.appendChild(w),w.focus(),w.select()}h&&(h.textContent=k?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function st(e){const t=(e==null?void 0:e.attempts)??0,s=[];return s.push(t===0?"no answers recorded":`${t} answer${t===1?"":"s"}`),e!=null&&e.lastPractised&&s.push(`last practised ${Y(e.lastPractised)}`),e!=null&&e.confidence&&e.confidence!=="high"&&s.push(f(Ne(e.confidence)).toLowerCase()),` <small class="needs-practice-evidence">· ${f(s.join(" · "))}</small>`}function at(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function nt(){const e=document.getElementById("dash-coaching-card");if(!e)return;const t=ue(),s={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[t.overallSignal]||"coaching-card--grey",a=t.advancementNote?`<div class="coaching-advancement">${t.advancementNote}</div>`:"",r=t.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${t.domainsAtRisk.map(u=>`<span class="coaching-domain-chip coaching-chip--red">${u.icon} ${u.label}</span>`).join("")}
       </div>`:"",n=`
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${t.mainStrength}</span>
    </div>`,o=t.mainConcern?`<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${t.mainConcern}</span>
       </div>`:"",l=`
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${t.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${t.whyPriority}</p>
    </div>`,d=t.weekXp>0?`<div class="coaching-stat">
        <span class="coaching-stat-value">+${t.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`:"",g=t.reviewsDue>0?`<div class="coaching-review">
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
        ${d}
      </div>

      ${a}
      ${n}
      ${o}
      ${r}
      ${l}
      ${g}
    </div>`}function rt(){const e=document.getElementById("dash-reporting-section");if(!e)return;const t=ve().sort((u,c)=>u.accuracy-c.accuracy).slice(0,8),s=fe().sort((u,c)=>u.accuracy-c.accuracy).slice(0,8),a=Fe(),r=be(),n=we({days:7}),o=ze({limit:6});I(e,!t.length&&!s.length&&!a.length);const l=u=>u.map(c=>{const p=Math.round((c.accuracy||0)*100),i=Math.round((c.clueSuccess||0)*100);return`<div class="dash-category-row" title="${c.tooltip}">
      <div class="dash-category-head">
        <span><strong>${c.label}</strong> <small>(${c.loCode})</small></span>
        <span>${p}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${p}%"></div></div>
      <div class="dash-category-meta">Attempts: ${c.attempts} · Clue success: ${i}% · <a href="${c.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`}).join(""),d=(u,c)=>`
    <div class="dash-pattern-item">
      <strong>${u}</strong>
      ${c.map(p=>`<div class="dash-category-row" title="${p.tooltip}">
        <div class="dash-category-head">
          <span><strong>${p.label}</strong> <small>(${p.loCode})</small></span>
          <span>${Math.round((p.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((p.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${p.priorityScore.toFixed(2)} · <a href="${p.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join("")}
    </div>`,g=a.map(u=>{const c=Math.round((u.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${u.quest}</strong><br>${u.correct}/${u.total} · ${c}%</div>`}).join("");e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Results by topic</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${l(t)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${l(s)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${g}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((n.accuracy||0)*100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${n.attempts} · Correct: ${n.correct} · Avg response: ${n.avgResponseMs!==null?`${n.avgResponseMs}ms`:"N/A"}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">What to work on first</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${d("Priority vocabulary revision",r.vocab)}
      ${d("Priority grammar revision",r.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Suggested next lessons</h4>
    <ul class="dash-pattern-list">
      ${o.map(u=>`<li class="dash-pattern-item"><strong>${u.quest}</strong> · ${u.label} <small>(${u.loCode})</small><br>${u.reason}</li>`).join("")}
    </ul>
  `}function ot(){const e=document.getElementById("dash-moe-section");if(!e)return;const t=We();I(e,!t.length),e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Syllabus coverage</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item"><strong>${s.code}</strong> · ${s.focus}</li>`).join("")}
    </ul>`}function ct(){const e=document.getElementById("dash-learner-summary");if(!e)return;const t=ce(),s=v.get("speechLocale")||"en-SG";e.innerHTML=`
    <div class="dash-learner-summary">
      <div class="dash-learner-avatar">${f(t.profileAvatar)}</div>
      <div class="dash-learner-info">
        <div class="dash-learner-name">${f(t.profileName)}</div>
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
    </div>`}function it(){const e=document.getElementById("dash-domains-section");if(!e)return;const t=ie(),s=t.some(a=>a.score!==null);I(e,!s),e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Skill areas</h3>
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
    </div>`}function lt(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:t,byType:s}=le();if(I(e,!1),!t.length&&!s.length){I(e,!0),e.innerHTML=`
      <h3 class="dash-section-title" style="margin-top:24px">Finding clues in the text</h3>
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
      ${s.slice(0,5).map(n=>{const o=Math.round(n.accuracy*100),l=o>=70?"var(--color-success)":o>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${n.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${o}%;background:${l}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${l}">${o}%</span>
          </div>`}).join("")}
    </div>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Finding clues vs. getting answers right</h3>
    <div class="dash-clue-list">${a}</div>
    ${r}`}function dt(){const e=document.getElementById("dash-actions-section");if(!e)return;const t=de();e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:0">What to do next</h3>
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
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.target,r=s.dataset.group||null;j==null||j({target:a,group:r})})})}function pt(){const e=document.getElementById("dash-stuck-words");if(!e)return;const t=He();if(!t.length)return;const s=t.map(a=>`
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
    </div>`}function ut(){const e=document.getElementById("dash-patterns-section");if(!e)return;const t=pe();t.length&&(e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">What we have noticed</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item">💬 ${s}</li>`).join("")}
    </ul>`)}function mt(){const e=document.getElementById("dash-tutor-activity");if(!e)return;const t=(v.get("lessonHistory")||[]).slice(0,30),s=v.get("readAloudStats")||{},a=(v.get("aiUsageLog")||[]).slice(0,8),r=Object.entries(s).sort((p,i)=>{var y,b;return String(((y=i[1])==null?void 0:y.updatedAt)||"").localeCompare(String(((b=p[1])==null?void 0:b.updatedAt)||""))}).slice(0,5);if(!t.length&&!r.length&&!a.length)return;const n=Date.now()-14*24*60*60*1e3,o=t.filter(p=>{const i=new Date(p.completedAt||p.date).getTime();return Number.isFinite(i)&&i>=n}).length,l=t.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${o}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`:"",d=[...new Set(r.flatMap(([,p])=>(p==null?void 0:p.lastMissedWords)||[]))].slice(0,8),g=r.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${r.reduce((p,[,i])=>p+((i==null?void 0:i.attempts)||0),0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`:"",u={explain:"❓ Why explained",hint:"💡 Hint",ask:"🦉 Ask Giri",grade:"✍️ Essay marked"},c=a.length?`
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${a.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${a.map(p=>`<li class="dash-pattern-item">${u[p.kind]||p.kind} · ${f(p.summary||"")} <small>(${f(p.date||"")})</small></li>`).join("")}
      </ul>
    </details>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Lessons and help used</h3>
    <div class="dash-stats-grid">
      ${l}
      ${g}
    </div>
    ${d.length?`<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${d.map(f).join(", ")}</p>`:""}
    ${c}`}function gt(e){const t=document.getElementById("chart-mastery");if(!t)return;M&&(M.destroy(),M=null);const s=re.filter(o=>D[o]),a=s.map(o=>D[o].label),r=s.map(o=>Math.round((e.groupMastery[o]??0)*100)),n=s.map(o=>D[o].color);M=new ae(t,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:r,backgroundColor:n.map(o=>o+"80"),borderColor:n,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:o=>o+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function ht(e){const t=document.getElementById("mastery-bars");t&&(t.innerHTML=re.map(s=>{const a=D[s];if(!a)return"";const r=Math.round((e.groupMastery[s]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${r}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${r}%</span>
      </div>`}).join(""))}function yt(e){const t=document.getElementById("learning-path");if(!t)return;const s=Oe(je());t.innerHTML=Pe.map(a=>{const r=s.includes(a.id),n=a.groups??(a.group?[a.group]:[]),o=n.map(d=>e.groupMastery[d]??0),l=n.length?Math.round(o.reduce((d,g)=>d+g,0)/n.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${r?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${l}%"></div>
        </div>
        <span class="mastery-bar-pct">${r?l+"%":"🔒"}</span>
      </div>`}).join("")}function vt(e){const t=document.getElementById("word-history-body");if(!t)return;const s=e.recentHistory.slice(0,30).map(a=>{const r=P.find(d=>d.id===a.wordId),n=(r==null?void 0:r.emoji)||"",o=Y(a.timestamp),l=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${n} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${l}</td>
      <td>${o}</td>
    </tr>`});t.innerHTML=s.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function ft(){const e=document.getElementById("badge-grid");if(!e)return;const t=q.getAll();e.setAttribute("aria-label",`${q.earnedCount} of ${q.totalCount} badges earned`),e.innerHTML=t.map(s=>`
    <div class="badge-card ${s.earned?"badge-card--earned":"badge-card--locked"}"
         title="${s.desc}"
         aria-label="${s.name}${s.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${s.earned?s.emoji:"🔒"}</span>
      <span class="badge-name">${s.name}</span>
    </div>`).join("")}function bt(){var r,n,o,l,d,g,u;(r=document.getElementById("btn-export-csv"))==null||r.addEventListener("click",()=>{const c=N.exportCSV(),p=new Blob([c],{type:"text/csv"}),i=URL.createObjectURL(p),y=document.createElement("a");y.href=i,y.download="phonicsquest-progress.csv",y.click(),URL.revokeObjectURL(i)}),(n=document.getElementById("btn-export-csv-anon"))==null||n.addEventListener("click",()=>{const c=N.exportCSV().split(`
`).map((b,h)=>{if(h===0||!b.trim())return b;const[S,...C]=b.split(",");return[`${S.slice(0,1)}***`,...C].join(",")}).join(`
`),p=new Blob([c],{type:"text/csv"}),i=URL.createObjectURL(p),y=document.createElement("a");y.href=i,y.download="phonicsquest-progress-anonymised.csv",y.click(),URL.revokeObjectURL(i)}),(o=document.getElementById("btn-export-report"))==null||o.addEventListener("click",()=>{const c=$t(),p=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),i=URL.createObjectURL(p),y=document.createElement("a");y.href=i,y.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(i)}),(l=document.getElementById("btn-import-csv"))==null||l.addEventListener("click",()=>{const c=document.getElementById("csv-import-panel");c&&(c.hidden=!c.hidden)}),(d=document.getElementById("csv-browse-btn"))==null||d.addEventListener("click",()=>{var c;(c=document.getElementById("csv-file-input"))==null||c.click()}),(g=document.getElementById("csv-file-input"))==null||g.addEventListener("change",c=>{var i;const p=(i=c.target.files)==null?void 0:i[0];p&&se(p)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",c=>{c.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",c=>{var i,y;c.preventDefault(),e.classList.remove("dash-import-drop--active");const p=(y=(i=c.dataTransfer)==null?void 0:i.files)==null?void 0:y[0];p&&se(p)}));const t=document.getElementById("adaptive-weak-weight"),s=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};t&&(t.value=String(a.weakWeight??5),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(t.value)})})),s&&(s.value=String(a.unseenWeight??3),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(s.value)})})),(u=document.getElementById("btn-print-report"))==null||u.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function wt(){const e=document.getElementById("print-report-content");if(!e)return;const t=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function s(d){const g=d*100;return g>=70?"#22c55e":g>=40?"#f59e0b":"#ef4444"}function a(d,g,u){var p;const c=[];for(const i of g){const y=Ie.getSkillScore(d,i);if(y===.5)continue;const b=Math.round(y*100),h=s(y),S=((p=u[i])==null?void 0:p.label)||i,C=Math.max(b,4);c.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${C}px;background:${h};"></div>
          <span style="color:${h};font-weight:600;min-width:36px">${b}%</span>
          <span>${f(S)}</span>
        </div>`)}return c.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const r=v.get("xp")??0,n=v.get("streak")??0,o=v.get("dailyGoal")??0,l=(()=>{const d=v.get("dailyHistory")||{},g=Date.now(),u=864e5;let c=0;for(let p=0;p<7;p++){const i=new Date(g-p*u).toISOString().slice(0,10);d[i]&&c++}return c})();e.innerHTML=`
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${f(t)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${r}</span>
          <span><strong>Day streak:</strong> ${n}</span>
          <span><strong>Daily goal:</strong> ${o}</span>
          <span><strong>Days played this week:</strong> ${l}</span>
        </div>
      </div>

      <div class="print-report-section">
        <h3>Grammar Skills</h3>
        ${a("grammarMcq",Ge,T)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${a("vocabMcq",Te,G)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`}function $t(){const e=N.getOverallStats(),t=W();return{generatedAt:new Date().toISOString(),learnerSummary:ce(),literacyDomains:ie(),clueInsights:le(),recommendedActions:de(),recentPatternInsights:pe(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:t}}}const ke=new Set(["a","e","i","o","u"]),kt=new Set("bcdfghjklmnpqrstvwxyz".split(""));function F(e){const s=e.toLowerCase().split(""),a=s.map(r=>ke.has(r)?"sv":(kt.has(r),"c"));return{graphemes:s,types:a}}function ee(e){const t=e.toLowerCase().split("").find(s=>ke.has(s));return t?`short-${t}`:"short-a"}function te(e,t){const s=[],a=[];let r=!1;for(const l of t){if(l==="sv"||l==="lv"){r=!0;continue}r?a.push(l):s.push(l)}const n=s.length,o=a.length;return n<=1&&o<=1?"CVC":n>=2&&o<=1?"blend":n<=1&&o>=2?"CVCC":"CCVCC"}async function se(e){var g,u;const t=document.getElementById("csv-import-preview"),s=document.getElementById("csv-import-status");if(!t||!s)return;const r=(await e.text()).trim().split(`
`).filter(c=>c.trim());if(!r.length){s.hidden=!1,s.textContent="File is empty.",s.className="dash-import-status dash-import-status--error";return}const n=r[0].trim(),o=n.includes(","),l=[],d=new Set(P.map(c=>c.id));if(o){const c=n.toLowerCase().split(",").map(C=>C.trim()),p=c.indexOf("word");if(p<0){s.hidden=!1,s.textContent='CSV must have a "word" column.',s.className="dash-import-status dash-import-status--error";return}const i=c.indexOf("graphemes"),y=c.indexOf("types"),b=c.indexOf("group"),h=c.indexOf("level"),S=c.indexOf("emoji");for(let C=1;C<r.length;C++){const $=r[C].split(",").map(k=>k.trim()),L=$[p];if(!L||d.has(L.toLowerCase()))continue;const x=i>=0&&$[i]?$[i].split(/[|;]/):F(L).graphemes,m=y>=0&&$[y]?$[y].split(/[|;]/):F(L).types;l.push({id:L.toLowerCase(),word:L.toLowerCase(),graphemes:x,types:m,pattern:te(x,m),group:b>=0&&$[b]||ee(L),level:h>=0&&parseInt($[h])||1,emoji:S>=0&&$[S]||""})}}else for(const c of r){const p=c.trim().toLowerCase();if(!p||d.has(p))continue;const{graphemes:i,types:y}=F(p);l.push({id:p,word:p,graphemes:i,types:y,pattern:te(i,y),group:ee(p),level:1,emoji:""})}if(!l.length){s.hidden=!1,s.textContent="No new words found (all may already exist).",s.className="dash-import-status dash-import-status--error";return}t.hidden=!1,t.innerHTML=`
    <p><strong>${l.length} new word${l.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${l.slice(0,20).map(c=>`<span class="dash-import-word">${c.emoji?c.emoji+" ":""}${c.word} <small>(${c.group})</small></span>`).join("")}${l.length>20?`<span class="dash-import-word">…and ${l.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${l.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(g=document.getElementById("csv-cancel-import"))==null||g.addEventListener("click",()=>{t.hidden=!0,s.hidden=!0}),(u=document.getElementById("csv-confirm-import"))==null||u.addEventListener("click",()=>{P.push(...l);const c=v.get("customWords")||[];v.set("customWords",[...c,...l]),t.hidden=!0,s.hidden=!1,s.textContent=`Imported ${l.length} word${l.length>1?"s":""} successfully!`,s.className="dash-import-status dash-import-status--success"})}function Y(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function Mt(){M&&(M.destroy(),M=null)}export{Mt as destroyDashboard,Rt as renderDashboard};
