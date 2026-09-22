import{C as oe,r as Re}from"./chartjs-BR_H7_9u.js";import{g as Ee,s as v,a as je,r as Pe,b as H,n as q,S as z,V as T,h as E,W as I,c as B,G as W,d as ce,e as Ie,f as ie,i as Oe,j as le,P as Te,C as F,p as D,k as De,l as Ne,m as Be,o as We,q as Ge,t as G,u as de,v as Ve,w as He,x as Q,y as qe,z as U,A as ze,B as Fe}from"./index-iVVKU6aP.js";import{r as Qe}from"./curriculumMap-DQC_3zFj.js";import"./vocabPassages-CQETnZfY.js";import"./passages-Du4BUcGK.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";import"./practiceExpansion-D0CCBel5.js";const Ue=Object.freeze(["syllabusVersion","learningOutcome","sourceQuote","sourcePage","retrievedOn","gradeBand","prerequisite","activity","assessmentEvidence","reviewedBy","reviewDate"]),O=Object.freeze({syllabusVersion:null,isComplete:!1,blockedBy:"The MOE English Language Syllabus (Primary) could not be retrieved: moe.gov.sg and the NIE library mirror are both refused by this environment’s egress proxy, as they were during the audit. No Learning Outcome reference has been written from memory or from a search summary.",entries:Object.freeze([])});function Ke(e){const t=[];if(!e||typeof e!="object")return{ok:!1,problems:["not an object"]};for(const a of Ue){const n=e[a];(typeof n!="string"||!n.trim())&&t.push(`missing ${a}`)}for(const a of["retrievedOn","reviewDate"]){const n=e[a];typeof n=="string"&&n.trim()&&!/^\d{4}-\d{2}-\d{2}$/.test(n.trim())&&t.push(`${a} is not an ISO date`)}const s=typeof e.sourceQuote=="string"?e.sourceQuote.trim():"";return s&&s.length<20&&t.push("sourceQuote is too short to check against the document"),{ok:t.length===0,problems:t}}function pe(e){if(!O.isComplete)return null;const t=O.entries.find(s=>s.activity===e);return t&&Ke(t).ok?t:null}function Ye(){return O.isComplete?`Mapped to ${O.syllabusVersion}, teacher-reviewed.`:"These categories are PhonicsQuest’s own sequence. They are not mapped to the MOE syllabus or any other published syllabus, so no outcome reference is shown."}function L(e){const t=(v.get("questMastery")||{})[e]||{},s=Object.values(t).filter(a=>typeof a=="number");return s.length?s.reduce((a,n)=>a+n,0)/s.length:null}function P(e){const s=(v.get("clueStats")||{})[e];if(!s)return null;if(e==="sentenceForge"){const n=(s.correct||0)+(s.incorrect||0);return n>0?{accuracy:s.correct/n,attempted:n}:null}const a=s.attempted||0;return a?{accuracy:((s.strong||0)+(s.partial||0)*.5)/a,attempted:a,strong:s.strong||0,partial:s.partial||0,weak:s.weak||0}:null}function J(e){const t=(v.get("questMastery")||{})[e]||{};if(!Object.keys(t).length)return null;let s=null,a=1/0;for(const[n,r]of Object.entries(t))r<a&&(a=r,s=n);return s?{skill:s,score:a}:null}function ue(){const e=q(v.get("groupMastery")||{});let t=null,s=1/0;for(const a of z){const n=e[a];typeof n=="number"&&n<s&&(s=n,t=a)}return t}function Xe(e,t=10){const s=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,t);return s.length<3?null:s.filter(a=>a.correct).length/s.length}function Ze(e,t){return e===null?null:e>=.7&&t!==null&&t>=.7?"Finding clues and answering correctly":e>=.7&&t!==null&&t<.55?"Finds clue but chooses wrong answer":e<.5&&t!==null&&t<.5?"Misses clue and answer — needs focused practice":e<.5&&t!==null&&t>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function he(){var i,p;const e=H(),t=q(v.get("groupMastery")||{}),s=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=z.map(l=>({label:T[l],score:t[l]??null})).filter(l=>l.score!==null),n=[...a].sort((l,y)=>y.score-l.score),r=n[0],o=n[n.length-1],c=[{name:"Grammar Cloze",score:L("clozeCastle")},{name:"Sentence Skills",score:L("sentenceForge")},{name:"Vocabulary Cloze",score:L("wordVault")}].filter(l=>l.score!==null).sort((l,y)=>y.score-l.score),d=((i=c[0])==null?void 0:i.name)||(r?`Phonics (${r.label})`:"Not enough data yet"),u=((p=c[c.length-1])==null?void 0:p.name)||(o?`Phonics (${o.label})`:"Not enough data yet");let m;if((e==null?void 0:e.schoolLevel)==="primary"){const l=L("sentenceForge"),y=L("clozeCastle"),b=L("wordVault");l!==null&&l<.6?m="Sentence structure skills":y!==null&&y<.6?m="Grammar cloze passages":b!==null&&b<.6?m="Vocabulary in context":m="Advanced sentence and grammar skills"}else{const l=ue();l&&(t[l]??0)<.6?m=`Short vowel sounds (${T[l]||l})`:a.length?m="Phonics blending and awareness":m="Starting phonics journey"}return{learnerType:s,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:d,weakest:u,currentFocus:m}}function me(){const e=q(v.get("groupMastery")||{}),t=z.map(d=>e[d]).filter(d=>typeof d=="number"),s=t.length?t.reduce((d,u)=>d+u,0)/t.length:null,a=[],n=P("clozeCastle");n&&a.push(n.accuracy);const r=P("sentenceForge");r&&a.push(r.accuracy);const o=P("wordVault");o&&a.push(o.accuracy);const c=a.length?a.reduce((d,u)=>d+u,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:s,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:L("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:L("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:L("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:L("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:L("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:c,color:"#f59e0b"}]}function ge(){const e=v.get("clueStats")||{},t=v.get("questAttempts")||[],s=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:r,label:o,icon:c}of a){const d=P(r);if(!d)continue;const u=t.filter(i=>i.quest===r),m=u.length>=3?u.filter(i=>i.correct).length/u.length:null;s.push({quest:o,icon:c,clueAttempted:d.attempted,clueAccuracy:d.accuracy,answerAccuracy:m,interpretation:Ze(d.accuracy,m)})}const n=Object.entries(e.byType||{}).filter(([,r])=>r.attempted>=3).map(([r,o])=>({type:E(r),accuracy:((o.strong||0)+(o.partial||0)*.5)/o.attempted,attempted:o.attempted})).sort((r,o)=>r.accuracy-o.accuracy);return{questInsights:s,byType:n}}function Je(){return O.isComplete?[...O.entries]:[]}function ye(){const e=H(),t=(e==null?void 0:e.schoolLevel)==="primary",s=v.get("groupMastery")||{},a=[];if(t){const n=P("clozeCastle");if(n&&n.accuracy<.6){const d=J("clozeCastle"),u=Math.round(n.accuracy*100);a.push({why:`Grammar clue accuracy is ${u}%.${d?` Weakest area: ${E(d.skill)}.`:""}`,target:`Cloze Castle${d?` – ${E(d.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const r=J("sentenceForge"),o=Xe("sentenceForge");(o!==null&&o<.65||r&&r.score<.55)&&a.push({why:r?`Sentence skill "${E(r.skill)}" scores ${Math.round(r.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${r?` – ${E(r.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const c=P("wordVault");c&&c.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(c.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const n=ue(),r=n?s[n]??0:null;if(n&&r<.65){const d=Math.round(r*100);a.push({why:`${T[n]} decoding accuracy is ${d}% — below the 65% target.`,target:`Phonics – ${T[n]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:n})}const o=z.map(d=>s[d]??0);o.reduce((d,u)=>d+u,0)/o.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function ve(){const e=[],t=v.get("wordHistory")||[],s=v.get("questAttempts")||[],a=v.get("clueStats")||{},n=Date.now(),r=7*24*60*60*1e3,o=t.filter(i=>i.timestamp&&n-new Date(i.timestamp).getTime()<r),c=t.filter(i=>{if(!i.timestamp)return!1;const p=n-new Date(i.timestamp).getTime();return p>=r&&p<2*r});if(o.length>=5&&c.length>=5){const i=o.filter(l=>l.correct).length/o.length,p=c.filter(l=>l.correct).length/c.length;i>p+.1?e.push("Accuracy has improved over the last 7 days"):i<p-.1&&e.push("Accuracy has dipped recently — more practice will help")}const d=a.byType||{},u=Object.entries(d).filter(([,i])=>i.attempted>=3).filter(([,i])=>((i.strong||0)+(i.partial||0)*.5)/i.attempted<.45).map(([i])=>E(i));u.length>0&&e.push(`Struggled with ${u[0]} clues recently`),s.filter(i=>i.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const m=Object.entries(d).filter(([,i])=>i.attempted>=3).filter(([,i])=>((i.strong||0)+(i.partial||0)*.5)/i.attempted>=.75).map(([i])=>E(i));return m.length>0&&e.push(`Strong in ${m[0]} passages`),!e.length&&t.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function fe(){const e=Ee(),t=v.get("wordHistory")||[],s=v.get("streak")||0,a=Date.now(),n=7*24*3600*1e3,r=a-n,o=new Date(r).toISOString().slice(0,10),d=(v.get("weeklyXpLog")||[]).filter(w=>w.date>=o).reduce((w,Me)=>w+(Me.xp||0),0),u=t.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=r),m=new Set(u.map(w=>w.word).filter(Boolean)).size,i=v.get("questAttempts")||[],p=new Set(i.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=r).map(w=>new Date(w.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&p.add(new Date().toDateString());const l=p.size,y=je(),b={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},g=b[e.overallSignal]||b["no-data"],S=e.strongDomains[0]||e.masteredDomains[0]||null,C=S?`${S.icon} ${S.label} (${Pe(S.state)})`:"Still building foundations — every session counts!",$=e.domainsAtRisk[0]||e.needsPractice[0]||null,A=$?`${$.icon} ${$.label} needs attention`:null,_=e.progressionDecision,h=_&&_.decision!=="no-data"?_.label:null;let k,x;$?(k=`Practise ${$.icon} ${$.label} this week`,x=(_==null?void 0:_.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(k=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,x="Reviewing words at the right time is how long-term memory forms."):(k="Keep the daily habit going — all areas are in good shape",x="Consistency is the most powerful factor in language learning.");const R=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:l,weekWords:m,weekXp:d,streak:s,domainCounts:y,overallSignal:e.overallSignal,signalLabel:g.label,signalEmoji:g.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:C,mainConcern:A,advancementNote:h,weeklyPriority:k,whyPriority:x,reviewsDue:e.reviewsDue,reviewNote:R}}function et(){const e=v.get("wordStats")||{},t=[];for(const s of I){const a=e[s.id];if(!a||a.attempts<6)continue;const n=a.correct/a.attempts;n<.4&&t.push({word:s.word,group:s.group,attempts:a.attempts,accuracy:Math.round(n*100)})}return t.sort((s,a)=>s.accuracy-a.accuracy),t.slice(0,6)}const tt={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function ee(e){const t=tt[e.key]||1,s=e.attempts===0?.1:0;return(1-(e.accuracy||0))*t+s}const st="https://www.moe.gov.sg/primary/curriculum/syllabus";function be(e,t){return t>0?e/t:0}function we(e,t){const s=v.get("questAttempts")||[];return t.map(a=>{const n=s.filter(c=>c.quest===e&&c.skill===a),r=n.length,o=n.filter(c=>c.correct).length;return{key:a,attempts:r,correct:o,accuracy:be(o,r)}})}function $e(){var n;const e=Object.keys(B),t=we("wordVault",e),s=((n=v.get("clueStats"))==null?void 0:n.wordVault)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(r=>{var o,c;return{...r,label:((o=B[r.key])==null?void 0:o.label)||r.key,tooltip:((c=B[r.key])==null?void 0:c.desc)||"Vocabulary development category",alignment:pe(r.key),clueSuccess:a}})}function ke(){var n;const e=Object.keys(W),t=we("clozeCastle",e),s=((n=v.get("clueStats"))==null?void 0:n.clozeCastle)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(r=>{var o,c;return{...r,label:((o=W[r.key])==null?void 0:o.label)||r.key,tooltip:`${((c=W[r.key])==null?void 0:c.label)||r.key} mastery`,alignment:pe(r.key),clueSuccess:a}})}function at(){return{statement:Ye(),syllabusLink:st}}function Se(){const e=$e().map(s=>({...s,priorityScore:ee(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3),t=ke().map(s=>({...s,priorityScore:ee(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3);return{vocab:e,grammar:t}}function Ce({days:e=7}={}){const t=v.get("learningEvents")||[],s=Date.now()-e*24*60*60*1e3,n=t.filter(u=>{const m=Date.parse(u.timestamp||"");return Number.isFinite(m)&&m>=s}).filter(u=>u.eventType==="quest_attempt"),r=n.filter(u=>typeof u.responseMs=="number"),o=n.filter(u=>u.correct===!0).length,c=r.length?Math.round(r.reduce((u,m)=>u+m.responseMs,0)/r.length):null,d=["sentenceForge","clozeCastle","wordVault"].map(u=>{const m=n.filter(l=>l.quest===u),i=m.length,p=m.filter(l=>l.correct===!0).length;return{quest:u,attempts:i,accuracy:i>0?p/i:0}});return{days:e,attempts:n.length,correct:o,accuracy:n.length?o/n.length:0,avgResponseMs:c,byQuest:d}}function nt({limit:e=6}={}){const{vocab:t,grammar:s}=Se(),a=Ce({days:7}),n=[];for(const c of t)n.push({quest:"wordVault",skill:c.key,label:c.label,alignment:c.alignment,reason:`Low mastery (${Math.round(c.accuracy*100)}%) in ${c.label}`,targetAccuracy:.85});for(const c of s)n.push({quest:"clozeCastle",skill:c.key,label:c.label,alignment:c.alignment,reason:`Grammar we weight highly in revision: ${c.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&n.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const r=new Set,o=[];for(const c of n){const d=`${c.quest}:${c.skill}`;if(!r.has(d)&&(r.add(d),o.push(c),o.length>=e))break}return o}function rt(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(s=>{const a=e.filter(c=>c.quest===s).slice(0,12),n=a.length,r=a.filter(c=>c.correct).length,o=be(r,n);return{quest:s,total:n,correct:r,accuracy:o}})}const te={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},V=Object.freeze({red:55,amber:75}),se=Object.freeze({unknown:"⚪ Not enough evidence",green:"🟢 Secure",amber:"🟡 Developing",red:"🔴 Needs support"});function _e(e){return e==null||Number.isNaN(e)?"unknown":e<V.red?"red":e<V.amber?"amber":"green"}function ot(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"unknown",label:se.unknown,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const t=e.map(r=>({label:r.label,pct:r.pct,band:_e(r.pct),attempts:r.attempts??0,independentAttempts:r.independentAttempts??0,lastPractised:r.lastPractised??null,confidence:r.confidence??ce(r.independentAttempts??0)})),s={red:4,unknown:3,amber:2,green:1},a=t.reduce((r,o)=>s[o.band]>s[r]?o.band:r,"green");let n;if(a==="red"){const r=t.filter(o=>o.band==="red").map(o=>o.label);n=`${K(r)} below ${V.red}% — focused practice this week will lift exam scores.`}else if(a==="unknown"){const r=t.filter(o=>o.band==="unknown").map(o=>o.label);n=`Not enough practice yet to judge ${K(r)} — a few short sessions will show where things stand.`}else if(a==="amber"){const r=t.filter(o=>o.band==="amber").map(o=>o.label);n=`${K(r)} under ${V.amber}% — solid practice will close the gap before the next paper.`}else n="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:se[a],summary:n,skills:t}}function K(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ct(e){const t=(e==null?void 0:e.profile)||null,s=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],n=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],r=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},o=s.slice(0,3).map(g=>({label:g.label,pct:(g.attempts??0)>0?Math.round((g.score||0)*100):null,domain:g.domain||"grammar",attempts:g.attempts??0,independentAttempts:g.independentAttempts??0,lastPractised:g.lastPractised??null,confidence:g.confidence??ce(g.independentAttempts??0)})),c=a.slice(0,3).map(g=>({label:g.label,pct:Math.round((g.score||0)*100)})),d=ot(o),u=it(o[0],t),m=lt({topWeak:o,topStrong:c,weekly:r,profile:t}),i=n.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40),mode:g.mode||"",when:g.when||""})),p=o.map(g=>({...g,band:_e(g.pct)})),l=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40)})).filter(g=>g.word):[],y=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40)})).filter(g=>g.word):[],b=Ie(3).map(g=>({id:g.id,label:g.childName,teacherLabel:g.label,count:g.count,tip:g.selfCheck}));return{learnerName:(t==null?void 0:t.name)||"Your child",grade:(t==null?void 0:t.primaryGrade)||null,avatar:(t==null?void 0:t.avatar)||"🧒",weekly:r,strengths:c.length?c:[{label:"Steady effort",pct:null}],needsPractice:p,habits:b,recentMistakes:i,recommendation:u,examRisk:d,teacherComment:m,graduatingSoon:l,slippingRecently:y}}function it(e,t){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const s=te[e.domain]||te.grammar,a=t!=null&&t.primaryGrade?` (${t.primaryGrade})`:"",n=e.pct==null?"not enough practice yet to give a score":`currently ${e.pct}%${X(e)}`;return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — ${n}. Aim for 8 of 10 correct before bed.`,target:s.target,targetLabel:s.label}}function X(e){const t=(e==null?void 0:e.attempts)??0;return t<=0||t>=12?"":` from just ${t} answer${t===1?"":"s"}`}function lt({topWeak:e,topStrong:t,weekly:s,profile:a}){const n=(a==null?void 0:a.name)||"Your child",r=s.days>=5?`${n} has been wonderfully consistent this week (${s.days} active days).`:s.days>=2?`${n} practised on ${s.days} days this week — a solid rhythm.`:`${n} hasn't practised much this week. Two short sessions will keep skills warm.`,o=t[0]?` They are strongest in ${t[0].label}${t[0].pct?` (${t[0].pct}%)`:""}.`:"",c=e[0]?e[0].pct==null?` ${e[0].label} is the area to look at next — there isn't enough practice yet to put a number on it.`:` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%${X(e[0])}.`:" No weak spots have shown up yet — there may simply not be enough practice recorded to tell.";return`${r}${o}${c} Encourage them to read aloud short passages every day to keep building fluency.`}function dt(e){var s,a,n,r,o,c;if(!e)return"";const t=[];if(t.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),t.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(s=e.strengths)==null?void 0:s[0])!=null&&a.pct?t.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):t.push("✅ Strength: Steady effort"),(n=e.needsPractice)!=null&&n[0]){const d=e.needsPractice[0],u=d.pct==null?"not enough practice yet to score":`${d.pct}%${X(d)}`;t.push(`🎯 Needs practice: ${d.label} (${u})`)}return e.examRisk&&t.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(r=e.recentMistakes)!=null&&r.length&&t.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(d=>d.word).join(", ")}`),(o=e.graduatingSoon)!=null&&o.length&&t.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(d=>d.word).join(", ")}`),(c=e.slippingRecently)!=null&&c.length&&t.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(d=>d.word).join(", ")} — a 2-min review tonight will help.`),t.push(`👉 Today's 10 min: ${e.recommendation.title}`),t.push(`💬 Automated learning summary: ${e.teacherComment}`),t.join(`
`)}const Ae=2,xe=.6,pt=2,ut=e=>`phonicsquest_profile_${e}`;function ht(e){if(!e)return{};try{const t=localStorage.getItem(ut(e)),s=t?JSON.parse(t):null;return s&&typeof s=="object"?s:{}}catch{return{}}}function mt(e){const t=Date.parse(e||"");return Number.isNaN(t)?1/0:(Date.now()-t)/864e5}function gt(e){const t=e==null?void 0:e.misconceptionLog;return!t||typeof t!="object"?[]:Object.entries(t).filter(([s,a])=>!a||typeof a!="object"||Oe(s)||!le(s)||(a.count||0)<pt?!1:mt(a.lastSeen)<=Te).map(([s,a])=>({id:s,count:a.count||0})).sort((s,a)=>a.count-s.count)}function yt(e){const t=e==null?void 0:e.groupMastery;if(!t||typeof t!="object")return[];const s=q(t);return Object.entries(s).filter(([a,n])=>typeof n=="number"&&n>0&&n<=xe).filter(([a])=>F.some(n=>n.group===a||n.id===a)).map(([a,n])=>({group:a,mastery:n})).sort((a,n)=>a.mastery-n.mastery)}function vt(e){const t=F.find(s=>s.group===e||s.id===e);return(t==null?void 0:t.name)||T[e]||e}function ft(e){var s;const t=F.find(a=>a.group===e||a.id===e);return{target:((s=t==null?void 0:t.recommendedModes)==null?void 0:s[0])||"blend",group:(t==null?void 0:t.group)||e}}function bt(){const e=ie(),t=new Map;for(const a of e){if(!(a!=null&&a.id))continue;const n=ht(a.id),r={id:a.id,name:a.name,avatar:a.avatar};for(const{id:o,count:c}of gt(n)){const d=`misconception:${o}`;t.has(d)||t.set(d,{kind:"misconception",key:o,children:[],total:0});const u=t.get(d);u.children.push({...r,count:c}),u.total+=c}for(const{group:o,mastery:c}of yt(n)){const d=`phonics:${o}`;t.has(d)||t.set(d,{kind:"phonics",key:o,children:[],total:0});const u=t.get(d);u.children.push({...r,mastery:c}),u.total+=1}}return{groups:[...t.values()].filter(a=>a.children.length>=Ae).map(a=>a.kind==="misconception"?wt(a):$t(a)).sort((a,n)=>n.children.length-a.children.length||n.total-a.total),childCount:e.length,generatedAt:new Date().toISOString()}}function wt(e){const t=le(e.key);return{kind:"misconception",key:e.key,title:t.label,childName:t.childName,detail:t.rule,example:t.example,teach:t.cue,children:e.children,total:e.total,action:null}}function $t(e){const t=vt(e.key);return{kind:"phonics",key:e.key,title:t,childName:t,detail:`Practised but not secure — all ${e.children.length} are under ${Math.round(xe*100)}%.`,example:"",teach:`Teach ${t} once to the group, then let each child practise it.`,children:e.children,total:e.total,action:ft(e.key)}}function kt(){return ie().length>=Ae}oe.register(...Re);let j=null,M=null;function ns(e,t={}){M=t.onNavigate||null;const s=D.getOverallStats();e.innerHTML=`
    <!-- ── At a glance ────────────────────────────────────────────────────
         What a parent came for: is this working, and what do we do tonight.
         Everything else is behind a disclosure below. This block used to be
         the first of 24 stacked sections in a 13,298 px page — 15.8 phone
         screens, every one of them reading "No data yet" on a new profile. -->
    <div id="dash-parent-report-card"></div>
    <div id="dash-actions-section"></div>
    <div id="dash-stuck-words"></div>
    <div id="dash-class-snapshot"></div>

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
  `,At(),Mt(),jt(),Ot(),Dt(),Tt(),Pt(),It(),Nt(),Bt(),Rt(),Et(),_t(),Wt(s),Gt(s),Vt(s),Ht(s),qt(),Qt(),zt(),Ct()}function N(e,t){e&&(t?e.setAttribute("data-dash-empty","true"):e.removeAttribute("data-dash-empty"))}function St(e){return e.getAttribute("data-dash-empty")==="true"?!0:e.children.length===0&&!e.textContent.trim()}function Ct(){for(const e of document.querySelectorAll(".dash-group")){const t=e.querySelectorAll(".dash-group__body > div[id]");if(!t.length)continue;const s=Array.from(t).every(St);e.hidden=s}}function _t(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning journey</h3><div id="dash-cm-inner"></div>';const t=document.getElementById("dash-cm-inner");t&&Qe(t)}function At(){var S,C,$,A,_;const e=document.getElementById("dash-parent-report-card");if(!e)return;const t=H(),s=D.getOverallStats(),a=fe(),n=De(),r=v.get("questMastery")||{},o=[];for(const[,h]of Object.entries(r))if(!(!h||typeof h!="object"))for(const[k,x]of Object.entries(h)){if(typeof x!="number")continue;const R=o.find(w=>w.skill===k);R?x>R.score&&(R.score=x):o.push({skill:k,score:x})}const c=o.filter(h=>h.score>=.75).sort((h,k)=>k.score-h.score).map(h=>({skill:h.skill,label:Lt(h.skill),score:h.score})),d=(s.recentHistory||[]).filter(h=>h&&h.correct===!1).slice(0,5).map(h=>({word:h.wordId,mode:h.mode,when:Z(h.timestamp),correct:!1})),u={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(s.totalAttempts||0),accuracy:s.overallAccuracy||0},m=v.get("wordStats")||{},i=Ne(m,I).map(h=>({word:h.item.word||h.id})),p=Be(m,I).map(h=>({word:h.item.word||h.id})),l=ct({profile:t,weakSkills:n,strengths:c,recentMistakes:d,weekly:u,graduatingSoon:i,slippingRecently:p});e.innerHTML=`
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
            ${l.strengths.map(h=>`<li>${f(h.label)}${h.pct?` <strong>(${h.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${l.needsPractice.map(h=>`<li class="needs-practice-item needs-practice-item--${h.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${f(h.label)} <strong>${h.pct==null?"(not enough practice yet)":`(${h.pct}%)`}</strong>${xt(h)}</li>`).join("")||"<li>Nothing has been measured yet — a few short sessions will show where things stand</li>"}
          </ul>
        </div>
        ${(S=l.habits)!=null&&S.length?`
        <div class="parent-report-card__cell parent-report-card__cell--habits">
          <h4>🔁 Habits to work on</h4>
          <ul class="report-habits">
            ${l.habits.map(h=>`<li class="report-habit">
                  <span class="report-habit__name">${f(h.label)} <small>· ${h.count} time${h.count===1?"":"s"}</small></span>
                  <span class="report-habit__tip">${f(h.tip)}</span>
                </li>`).join("")}
          </ul>
        </div>`:""}
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${l.recentMistakes.map(h=>`<li>${f(h.word)}${h.mode?` <small>· ${f(h.mode)}</small>`:""}${h.when?` <small>· ${f(h.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${(C=l.graduatingSoon)!=null&&C.length||($=l.slippingRecently)!=null&&$.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(A=l.graduatingSoon)!=null&&A.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${l.graduatingSoon.slice(0,5).map(h=>f(h.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(_=l.slippingRecently)!=null&&_.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${l.slippingRecently.slice(0,5).map(h=>f(h.word)).join(", ")} — a 2-min review tonight will help.</p>
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
        <h4>💬 Automated learning summary</h4>
        <p>${f(l.teacherComment)}</p>
        <p class="parent-report-card__detail"><small>Generated from recorded practice — not reviewed by a teacher.</small></p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;const y=e.querySelector("#parent-report-cta");y==null||y.addEventListener("click",()=>{const h=y.dataset.target;M&&h&&M({target:h})});const b=e.querySelector("#copy-parent-update"),g=e.querySelector("#parent-update-hint");b==null||b.addEventListener("click",async()=>{var x,R;const h=dt(l);let k=!1;try{(x=navigator.clipboard)!=null&&x.writeText&&(await navigator.clipboard.writeText(h),k=!0)}catch{}if(!k){const w=document.createElement("textarea");w.value=h,w.setAttribute("aria-label","Parent update message"),w.className="parent-report-card__fallback",w.readOnly=!0,(R=b.parentElement)==null||R.appendChild(w),w.focus(),w.select()}g&&(g.textContent=k?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function xt(e){const t=(e==null?void 0:e.attempts)??0,s=[];return s.push(t===0?"no answers recorded":`${t} answer${t===1?"":"s"}`),e!=null&&e.lastPractised&&s.push(`last practised ${Z(e.lastPractised)}`),e!=null&&e.confidence&&e.confidence!=="high"&&s.push(f(qe(e.confidence)).toLowerCase()),` <small class="needs-practice-evidence">· ${f(s.join(" · "))}</small>`}function Lt(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mt(){const e=document.getElementById("dash-coaching-card");if(!e)return;const t=fe(),s={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[t.overallSignal]||"coaching-card--grey",a=t.advancementNote?`<div class="coaching-advancement">${t.advancementNote}</div>`:"",n=t.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${t.domainsAtRisk.map(m=>`<span class="coaching-domain-chip coaching-chip--red">${m.icon} ${m.label}</span>`).join("")}
       </div>`:"",r=`
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${t.mainStrength}</span>
    </div>`,o=t.mainConcern?`<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${t.mainConcern}</span>
       </div>`:"",c=`
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${t.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${t.whyPriority}</p>
    </div>`,d=t.weekXp>0?`<div class="coaching-stat">
        <span class="coaching-stat-value">+${t.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`:"",u=t.reviewsDue>0?`<div class="coaching-review">
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
      ${r}
      ${o}
      ${n}
      ${c}
      ${u}
    </div>`}function Rt(){const e=document.getElementById("dash-reporting-section");if(!e)return;const t=$e().sort((m,i)=>m.accuracy-i.accuracy).slice(0,8),s=ke().sort((m,i)=>m.accuracy-i.accuracy).slice(0,8),a=rt(),n=Se(),r=Ce({days:7}),o=nt({limit:6});N(e,!t.length&&!s.length&&!a.length);const c=m=>m.map(i=>{const p=Math.round((i.accuracy||0)*100),l=Math.round((i.clueSuccess||0)*100);return`<div class="dash-category-row" title="${i.tooltip}">
      <div class="dash-category-head">
        <span><strong>${i.label}</strong></span>
        <span>${p}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${p}%"></div></div>
      <div class="dash-category-meta">Attempts: ${i.attempts} · Clue success: ${l}%</div>
    </div>`}).join(""),d=(m,i)=>`
    <div class="dash-pattern-item">
      <strong>${m}</strong>
      ${i.map(p=>`<div class="dash-category-row" title="${p.tooltip}">
        <div class="dash-category-head">
          <span><strong>${p.label}</strong></span>
          <span>${Math.round((p.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((p.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${p.priorityScore.toFixed(2)}</div>
      </div>`).join("")}
    </div>`,u=a.map(m=>{const i=Math.round((m.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${m.quest}</strong><br>${m.correct}/${m.total} · ${i}%</div>`}).join("");e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Results by topic</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${c(t)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${c(s)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${u}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((r.accuracy||0)*100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${r.attempts} · Correct: ${r.correct} · Avg response: ${r.avgResponseMs!==null?`${r.avgResponseMs}ms`:"N/A"}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">What to work on first</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${d("Priority vocabulary revision",n.vocab)}
      ${d("Priority grammar revision",n.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Suggested next lessons</h4>
    <ul class="dash-pattern-list">
      ${o.map(m=>`<li class="dash-pattern-item"><strong>${m.quest}</strong> · ${m.label}<br>${m.reason}</li>`).join("")}
    </ul>
  `}function Et(){const e=document.getElementById("dash-moe-section");if(!e)return;const t=Je(),{statement:s,syllabusLink:a}=at();N(e,!1),e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Syllabus alignment</h3>
    <p class="dash-category-meta">${f(s)}
      <a href="${a}" target="_blank" rel="noreferrer">Read the MOE syllabus</a></p>
    ${t.length?`<ul class="dash-pattern-list">${t.map(n=>`<li class="dash-pattern-item"><strong>${f(n.learningOutcome)}</strong> · ${f(n.activity)}<br><small>${f(n.syllabusVersion)} · reviewed by ${f(n.reviewedBy)} on ${f(n.reviewDate)}</small></li>`).join("")}</ul>`:""}`}function jt(){const e=document.getElementById("dash-learner-summary");if(!e)return;const t=he(),s=v.get("speechLocale")||"en-SG";e.innerHTML=`
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
    </div>`}function Pt(){const e=document.getElementById("dash-domains-section");if(!e)return;const t=me(),s=t.some(a=>a.score!==null);N(e,!s),e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Skill areas</h3>
    ${s?"":'<p class="dash-no-data">Play more to see domain scores here.</p>'}
    <div class="dash-domains-grid">
      ${t.map(a=>{const n=a.score!==null?Math.round(a.score*100):null,r=n===null?"#e5e3fa":n>=70?"var(--color-success)":n>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${a.icon}</span>
            <span class="dash-domain-label">${a.label}</span>
            ${n!==null?`
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${n}%;background:${a.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${r}">${n}%</span>`:'<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'}
          </div>`}).join("")}
    </div>`}function It(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:t,byType:s}=ge();if(N(e,!1),!t.length&&!s.length){N(e,!0),e.innerHTML=`
      <h3 class="dash-section-title" style="margin-top:24px">Finding clues in the text</h3>
      <p class="dash-no-data">Complete quests with clue missions to see clue accuracy here.</p>`;return}const a=t.map(r=>{const o=r.clueAccuracy>=.7?"var(--color-success)":r.clueAccuracy>=.45?"var(--color-warning)":"var(--color-error)";return`
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${r.icon} ${r.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${o}">${Math.round(r.clueAccuracy*100)}%</span>
            <span class="dash-clue-metric-sub">(${r.clueAttempted} attempts)</span>
          </div>
          ${r.answerAccuracy!==null?`
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(r.answerAccuracy*100)}%</span>
            </div>`:""}
        </div>
        ${r.interpretation?`<p class="dash-clue-interpretation">${r.interpretation}</p>`:""}
      </div>`}).join(""),n=s.length>0?`
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${s.slice(0,5).map(r=>{const o=Math.round(r.accuracy*100),c=o>=70?"var(--color-success)":o>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${r.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${o}%;background:${c}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${c}">${o}%</span>
          </div>`}).join("")}
    </div>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Finding clues vs. getting answers right</h3>
    <div class="dash-clue-list">${a}</div>
    ${n}`}function Ot(){const e=document.getElementById("dash-actions-section");if(!e)return;const t=ye();e.innerHTML=`
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
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.target,n=s.dataset.group||null;M==null||M({target:a,group:n})})})}function Tt(){const e=document.getElementById("dash-class-snapshot");if(!e||!kt())return;const{groups:t,childCount:s}=bt();if(!t.length)return;const a=t.map(n=>{const r=n.children.map(c=>`<span class="cs-child">${f(c.avatar||"")} ${f(c.name)}</span>`).join(""),o=n.action?`<button type="button" class="cs-action" data-target="${f(n.action.target)}" data-group="${f(n.action.group)}">Open ${f(n.title)} practice →</button>`:"";return`
      <article class="cs-card cs-card--${n.kind}">
        <header class="cs-card__head">
          <span class="cs-count">${n.children.length} of ${s}</span>
          <h4 class="cs-card__title">${f(n.title)}</h4>
        </header>
        <div class="cs-children">${r}</div>
        <p class="cs-detail">${f(n.detail)}</p>
        <p class="cs-teach"><strong>Try this:</strong> ${f(n.teach)}</p>
        ${o}
      </article>`}).join("");e.innerHTML=Ge`
    <section class="cs-section" aria-label="Who needs the same lesson">
      <h3 class="dash-section-title">👥 Who needs the same thing</h3>
      <p class="cs-intro">
        Across the ${s} children on this device. Each card is one lesson worth teaching
        once, to everyone named on it.
      </p>
      <div class="cs-list">${We(a)}</div>
    </section>
  `,e.querySelectorAll(".cs-action").forEach(n=>{n.addEventListener("click",()=>M==null?void 0:M({target:n.dataset.target,group:n.dataset.group}))})}function Dt(){const e=document.getElementById("dash-stuck-words");if(!e)return;const t=et();if(!t.length)return;const s=t.map(a=>`
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
    </div>`}function Nt(){const e=document.getElementById("dash-patterns-section");if(!e)return;const t=ve();t.length&&(e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">What we have noticed</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item">💬 ${s}</li>`).join("")}
    </ul>`)}function Bt(){const e=document.getElementById("dash-tutor-activity");if(!e)return;const t=(v.get("lessonHistory")||[]).slice(0,30),s=v.get("readAloudStats")||{},a=(v.get("aiUsageLog")||[]).slice(0,8),n=Object.entries(s).sort((p,l)=>{var y,b;return String(((y=l[1])==null?void 0:y.updatedAt)||"").localeCompare(String(((b=p[1])==null?void 0:b.updatedAt)||""))}).slice(0,5);if(!t.length&&!n.length&&!a.length)return;const r=Date.now()-14*24*60*60*1e3,o=t.filter(p=>{const l=new Date(p.completedAt||p.date).getTime();return Number.isFinite(l)&&l>=r}).length,c=t.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${o}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`:"",d=[...new Set(n.flatMap(([,p])=>(p==null?void 0:p.lastMissedWords)||[]))].slice(0,8),u=n.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${n.reduce((p,[,l])=>p+((l==null?void 0:l.attempts)||0),0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`:"",m={explain:"❓ Why explained",hint:"💡 Hint",ask:"Ask Giri",grade:"✍️ Essay marked"},i=a.length?`
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${a.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${a.map(p=>`<li class="dash-pattern-item">${m[p.kind]||p.kind} · ${f(p.summary||"")} <small>(${f(p.date||"")})</small></li>`).join("")}
      </ul>
    </details>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Lessons and help used</h3>
    <div class="dash-stats-grid">
      ${c}
      ${u}
    </div>
    ${d.length?`<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${d.map(f).join(", ")}</p>`:""}
    ${i}`}function Wt(e){const t=document.getElementById("chart-mastery");if(!t)return;j&&(j.destroy(),j=null);const s=de.filter(o=>G[o]),a=s.map(o=>G[o].label),n=s.map(o=>Math.round((e.groupMastery[o]??0)*100)),r=s.map(o=>G[o].color);j=new oe(t,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:n,backgroundColor:r.map(o=>o+"80"),borderColor:r,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:o=>o+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function Gt(e){const t=document.getElementById("mastery-bars");t&&(t.innerHTML=de.map(s=>{const a=G[s];if(!a)return"";const n=Math.round((e.groupMastery[s]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${n}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${n}%</span>
      </div>`}).join(""))}function Vt(e){const t=document.getElementById("learning-path");if(!t)return;const s=Ve(He());t.innerHTML=F.map(a=>{const n=s.includes(a.id),r=a.groups??(a.group?[a.group]:[]),o=r.map(d=>e.groupMastery[d]??0),c=r.length?Math.round(o.reduce((d,u)=>d+u,0)/r.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${n?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${c}%"></div>
        </div>
        <span class="mastery-bar-pct">${n?c+"%":"🔒"}</span>
      </div>`}).join("")}function Ht(e){const t=document.getElementById("word-history-body");if(!t)return;const s=e.recentHistory.slice(0,30).map(a=>{const n=I.find(d=>d.id===a.wordId),r=(n==null?void 0:n.emoji)||"",o=Z(a.timestamp),c=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${r} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${c}</td>
      <td>${o}</td>
    </tr>`});t.innerHTML=s.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function qt(){const e=document.getElementById("badge-grid");if(!e)return;const t=Q.getAll();e.setAttribute("aria-label",`${Q.earnedCount} of ${Q.totalCount} badges earned`),e.innerHTML=t.map(s=>`
    <div class="badge-card ${s.earned?"badge-card--earned":"badge-card--locked"}"
         title="${s.desc}"
         aria-label="${s.name}${s.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${s.earned?s.emoji:"🔒"}</span>
      <span class="badge-name">${s.name}</span>
    </div>`).join("")}function zt(){var n,r,o,c,d,u,m;(n=document.getElementById("btn-export-csv"))==null||n.addEventListener("click",()=>{const i=D.exportCSV(),p=new Blob([i],{type:"text/csv"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress.csv",y.click(),URL.revokeObjectURL(l)}),(r=document.getElementById("btn-export-csv-anon"))==null||r.addEventListener("click",()=>{const i=D.exportCSV().split(`
`).map((b,g)=>{if(g===0||!b.trim())return b;const[S,...C]=b.split(",");return[`${S.slice(0,1)}***`,...C].join(",")}).join(`
`),p=new Blob([i],{type:"text/csv"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress-anonymised.csv",y.click(),URL.revokeObjectURL(l)}),(o=document.getElementById("btn-export-report"))==null||o.addEventListener("click",()=>{const i=Ut(),p=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(l)}),(c=document.getElementById("btn-import-csv"))==null||c.addEventListener("click",()=>{const i=document.getElementById("csv-import-panel");i&&(i.hidden=!i.hidden)}),(d=document.getElementById("csv-browse-btn"))==null||d.addEventListener("click",()=>{var i;(i=document.getElementById("csv-file-input"))==null||i.click()}),(u=document.getElementById("csv-file-input"))==null||u.addEventListener("change",i=>{var l;const p=(l=i.target.files)==null?void 0:l[0];p&&re(p)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",i=>{i.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",i=>{var l,y;i.preventDefault(),e.classList.remove("dash-import-drop--active");const p=(y=(l=i.dataTransfer)==null?void 0:l.files)==null?void 0:y[0];p&&re(p)}));const t=document.getElementById("adaptive-weak-weight"),s=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};t&&(t.value=String(a.weakWeight??5),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(t.value)})})),s&&(s.value=String(a.unseenWeight??3),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(s.value)})})),(m=document.getElementById("btn-print-report"))==null||m.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function Ft(e,t=Date.now()){if(!Array.isArray(e))return 0;const s=864e5,a=new Set;for(let r=0;r<7;r++)a.add(new Date(t-r*s).toISOString().slice(0,10));const n=new Set;for(const r of e)a.has(r==null?void 0:r.date)&&(r.xp||0)>0&&n.add(r.date);return n.size}function Qt(){const e=document.getElementById("print-report-content");if(!e)return;const t=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function s(d){const u=d*100;return u>=70?"#22c55e":u>=40?"#f59e0b":"#ef4444"}function a(d,u,m){var p;const i=[];for(const l of u){const y=U.getSkillScore(d,l);if(y===.5)continue;const b=Math.round(y*100),g=s(y),S=((p=m[l])==null?void 0:p.label)||l,C=Math.max(b,4),$=U.getSkillSample(d,l),_=U.isEarlyIndication(d,l)?`<span class="print-report-early">early indication — ${$.attempts} independent ${$.attempts===1?"attempt":"attempts"}</span>`:"";i.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${C}px;background:${g};"></div>
          <span style="color:${g};font-weight:600;min-width:36px">${b}%</span>
          <span>${f(S)}</span>
          ${_}
        </div>`)}return i.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const n=v.get("xp")??0,r=v.get("streak")??0,o=v.get("dailyGoal")??0,c=Ft(v.get("weeklyXpLog"));e.innerHTML=`
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${f(t)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${n}</span>
          <span><strong>Day streak:</strong> ${r}</span>
          <span><strong>Daily goal:</strong> ${o}</span>
          <span><strong>Days played this week:</strong> ${c}</span>
        </div>
      </div>

      <div class="print-report-section">
        <h3>Grammar Skills</h3>
        ${a("grammarMcq",ze,W)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${a("vocabMcq",Fe,B)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`}function Ut(){const e=D.getOverallStats(),t=H();return{generatedAt:new Date().toISOString(),learnerSummary:he(),literacyDomains:me(),clueInsights:ge(),recommendedActions:ye(),recentPatternInsights:ve(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:t}}}const Le=new Set(["a","e","i","o","u"]),Kt=new Set("bcdfghjklmnpqrstvwxyz".split(""));function Y(e){const s=e.toLowerCase().split(""),a=s.map(n=>Le.has(n)?"sv":(Kt.has(n),"c"));return{graphemes:s,types:a}}function ae(e){const t=e.toLowerCase().split("").find(s=>Le.has(s));return t?`short-${t}`:"short-a"}function ne(e,t){const s=[],a=[];let n=!1;for(const c of t){if(c==="sv"||c==="lv"){n=!0;continue}n?a.push(c):s.push(c)}const r=s.length,o=a.length;return r<=1&&o<=1?"CVC":r>=2&&o<=1?"blend":r<=1&&o>=2?"CVCC":"CCVCC"}async function re(e){var u,m;const t=document.getElementById("csv-import-preview"),s=document.getElementById("csv-import-status");if(!t||!s)return;const n=(await e.text()).trim().split(`
`).filter(i=>i.trim());if(!n.length){s.hidden=!1,s.textContent="File is empty.",s.className="dash-import-status dash-import-status--error";return}const r=n[0].trim(),o=r.includes(","),c=[],d=new Set(I.map(i=>i.id));if(o){const i=r.toLowerCase().split(",").map(C=>C.trim()),p=i.indexOf("word");if(p<0){s.hidden=!1,s.textContent='CSV must have a "word" column.',s.className="dash-import-status dash-import-status--error";return}const l=i.indexOf("graphemes"),y=i.indexOf("types"),b=i.indexOf("group"),g=i.indexOf("level"),S=i.indexOf("emoji");for(let C=1;C<n.length;C++){const $=n[C].split(",").map(k=>k.trim()),A=$[p];if(!A||d.has(A.toLowerCase()))continue;const _=l>=0&&$[l]?$[l].split(/[|;]/):Y(A).graphemes,h=y>=0&&$[y]?$[y].split(/[|;]/):Y(A).types;c.push({id:A.toLowerCase(),word:A.toLowerCase(),graphemes:_,types:h,pattern:ne(_,h),group:b>=0&&$[b]||ae(A),level:g>=0&&parseInt($[g])||1,emoji:S>=0&&$[S]||""})}}else for(const i of n){const p=i.trim().toLowerCase();if(!p||d.has(p))continue;const{graphemes:l,types:y}=Y(p);c.push({id:p,word:p,graphemes:l,types:y,pattern:ne(l,y),group:ae(p),level:1,emoji:""})}if(!c.length){s.hidden=!1,s.textContent="No new words found (all may already exist).",s.className="dash-import-status dash-import-status--error";return}t.hidden=!1,t.innerHTML=`
    <p><strong>${c.length} new word${c.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${c.slice(0,20).map(i=>`<span class="dash-import-word">${i.emoji?i.emoji+" ":""}${i.word} <small>(${i.group})</small></span>`).join("")}${c.length>20?`<span class="dash-import-word">…and ${c.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${c.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(u=document.getElementById("csv-cancel-import"))==null||u.addEventListener("click",()=>{t.hidden=!0,s.hidden=!0}),(m=document.getElementById("csv-confirm-import"))==null||m.addEventListener("click",()=>{I.push(...c);const i=v.get("customWords")||[];v.set("customWords",[...i,...c]),t.hidden=!0,s.hidden=!1,s.textContent=`Imported ${c.length} word${c.length>1?"s":""} successfully!`,s.className="dash-import-status dash-import-status--success"})}function Z(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function rs(){j&&(j.destroy(),j=null)}export{Ft as countDaysPlayedThisWeek,rs as destroyDashboard,ns as renderDashboard};
