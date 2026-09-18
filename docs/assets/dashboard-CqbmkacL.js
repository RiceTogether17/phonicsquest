import{C as ne,r as Ee}from"./chartjs-BR_H7_9u.js";import{g as Me,s as v,a as Re,r as Oe,b as W,n as H,S as q,V as N,h as R,W as j,c as G,G as D,d as re,e as Pe,f as oe,i as je,j as ce,P as Ne,C as z,p as I,k as Ie,l as Te,m as Ge,o as De,q as Ve,t as V,u as ie,v as Be,w as We,x as F,y as He,z as qe,A as ze,B as Fe}from"./index-C93YFSgD.js";import{r as Ue}from"./curriculumMap-j9iutPAO.js";import"./vocabPassages-mv1rn-fl.js";import"./passages-C58v9gBd.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";import"./practiceExpansion-D0CCBel5.js";function A(e){const t=(v.get("questMastery")||{})[e]||{},s=Object.values(t).filter(a=>typeof a=="number");return s.length?s.reduce((a,n)=>a+n,0)/s.length:null}function P(e){const s=(v.get("clueStats")||{})[e];if(!s)return null;if(e==="sentenceForge"){const n=(s.correct||0)+(s.incorrect||0);return n>0?{accuracy:s.correct/n,attempted:n}:null}const a=s.attempted||0;return a?{accuracy:((s.strong||0)+(s.partial||0)*.5)/a,attempted:a,strong:s.strong||0,partial:s.partial||0,weak:s.weak||0}:null}function X(e){const t=(v.get("questMastery")||{})[e]||{};if(!Object.keys(t).length)return null;let s=null,a=1/0;for(const[n,r]of Object.entries(t))r<a&&(a=r,s=n);return s?{skill:s,score:a}:null}function le(){const e=H(v.get("groupMastery")||{});let t=null,s=1/0;for(const a of q){const n=e[a];typeof n=="number"&&n<s&&(s=n,t=a)}return t}function Qe(e,t=10){const s=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,t);return s.length<3?null:s.filter(a=>a.correct).length/s.length}function Ke(e,t){return e===null?null:e>=.7&&t!==null&&t>=.7?"Finding clues and answering correctly":e>=.7&&t!==null&&t<.55?"Finds clue but chooses wrong answer":e<.5&&t!==null&&t<.5?"Misses clue and answer — needs focused practice":e<.5&&t!==null&&t>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function de(){var i,p;const e=W(),t=H(v.get("groupMastery")||{}),s=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=q.map(l=>({label:N[l],score:t[l]??null})).filter(l=>l.score!==null),n=[...a].sort((l,y)=>y.score-l.score),r=n[0],o=n[n.length-1],c=[{name:"Grammar Cloze",score:A("clozeCastle")},{name:"Sentence Skills",score:A("sentenceForge")},{name:"Vocabulary Cloze",score:A("wordVault")}].filter(l=>l.score!==null).sort((l,y)=>y.score-l.score),d=((i=c[0])==null?void 0:i.name)||(r?`Phonics (${r.label})`:"Not enough data yet"),u=((p=c[c.length-1])==null?void 0:p.name)||(o?`Phonics (${o.label})`:"Not enough data yet");let h;if((e==null?void 0:e.schoolLevel)==="primary"){const l=A("sentenceForge"),y=A("clozeCastle"),b=A("wordVault");l!==null&&l<.6?h="Sentence structure skills":y!==null&&y<.6?h="Grammar cloze passages":b!==null&&b<.6?h="Vocabulary in context":h="Advanced sentence and grammar skills"}else{const l=le();l&&(t[l]??0)<.6?h=`Short vowel sounds (${N[l]||l})`:a.length?h="Phonics blending and awareness":h="Starting phonics journey"}return{learnerType:s,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:d,weakest:u,currentFocus:h}}function pe(){const e=H(v.get("groupMastery")||{}),t=q.map(d=>e[d]).filter(d=>typeof d=="number"),s=t.length?t.reduce((d,u)=>d+u,0)/t.length:null,a=[],n=P("clozeCastle");n&&a.push(n.accuracy);const r=P("sentenceForge");r&&a.push(r.accuracy);const o=P("wordVault");o&&a.push(o.accuracy);const c=a.length?a.reduce((d,u)=>d+u,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:s,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:A("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:A("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:A("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:A("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:A("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:c,color:"#f59e0b"}]}function ue(){const e=v.get("clueStats")||{},t=v.get("questAttempts")||[],s=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:r,label:o,icon:c}of a){const d=P(r);if(!d)continue;const u=t.filter(i=>i.quest===r),h=u.length>=3?u.filter(i=>i.correct).length/u.length:null;s.push({quest:o,icon:c,clueAttempted:d.attempted,clueAccuracy:d.accuracy,answerAccuracy:h,interpretation:Ke(d.accuracy,h)})}const n=Object.entries(e.byType||{}).filter(([,r])=>r.attempted>=3).map(([r,o])=>({type:R(r),accuracy:((o.strong||0)+(o.partial||0)*.5)/o.attempted,attempted:o.attempted})).sort((r,o)=>r.accuracy-o.accuracy);return{questInsights:s,byType:n}}function Ye(){return[{code:"LO 3.1",focus:"Decode and blend multi-syllabic words",target:"blend"},{code:"LO 4.2",focus:"Use grammar in context and editing",target:"cloze-castle"},{code:"LO 5.2",focus:"Synthesis and sentence transformation",target:"sentence-forge"}]}function he(){const e=W(),t=(e==null?void 0:e.schoolLevel)==="primary",s=v.get("groupMastery")||{},a=[];if(t){const n=P("clozeCastle");if(n&&n.accuracy<.6){const d=X("clozeCastle"),u=Math.round(n.accuracy*100);a.push({why:`Grammar clue accuracy is ${u}%.${d?` Weakest area: ${R(d.skill)}.`:""}`,target:`Cloze Castle${d?` – ${R(d.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const r=X("sentenceForge"),o=Qe("sentenceForge");(o!==null&&o<.65||r&&r.score<.55)&&a.push({why:r?`Sentence skill "${R(r.skill)}" scores ${Math.round(r.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${r?` – ${R(r.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const c=P("wordVault");c&&c.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(c.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const n=le(),r=n?s[n]??0:null;if(n&&r<.65){const d=Math.round(r*100);a.push({why:`${N[n]} decoding accuracy is ${d}% — below the 65% target.`,target:`Phonics – ${N[n]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:n})}const o=q.map(d=>s[d]??0);o.reduce((d,u)=>d+u,0)/o.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function me(){const e=[],t=v.get("wordHistory")||[],s=v.get("questAttempts")||[],a=v.get("clueStats")||{},n=Date.now(),r=7*24*60*60*1e3,o=t.filter(i=>i.timestamp&&n-new Date(i.timestamp).getTime()<r),c=t.filter(i=>{if(!i.timestamp)return!1;const p=n-new Date(i.timestamp).getTime();return p>=r&&p<2*r});if(o.length>=5&&c.length>=5){const i=o.filter(l=>l.correct).length/o.length,p=c.filter(l=>l.correct).length/c.length;i>p+.1?e.push("Accuracy has improved over the last 7 days"):i<p-.1&&e.push("Accuracy has dipped recently — more practice will help")}const d=a.byType||{},u=Object.entries(d).filter(([,i])=>i.attempted>=3).filter(([,i])=>((i.strong||0)+(i.partial||0)*.5)/i.attempted<.45).map(([i])=>R(i));u.length>0&&e.push(`Struggled with ${u[0]} clues recently`),s.filter(i=>i.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const h=Object.entries(d).filter(([,i])=>i.attempted>=3).filter(([,i])=>((i.strong||0)+(i.partial||0)*.5)/i.attempted>=.75).map(([i])=>R(i));return h.length>0&&e.push(`Strong in ${h[0]} passages`),!e.length&&t.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function ge(){const e=Me(),t=v.get("wordHistory")||[],s=v.get("streak")||0,a=Date.now(),n=7*24*3600*1e3,r=a-n,o=new Date(r).toISOString().slice(0,10),d=(v.get("weeklyXpLog")||[]).filter(w=>w.date>=o).reduce((w,Ae)=>w+(Ae.xp||0),0),u=t.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=r),h=new Set(u.map(w=>w.word).filter(Boolean)).size,i=v.get("questAttempts")||[],p=new Set(i.filter(w=>w.timestamp&&new Date(w.timestamp).getTime()>=r).map(w=>new Date(w.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&p.add(new Date().toDateString());const l=p.size,y=Re(),b={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},g=b[e.overallSignal]||b["no-data"],S=e.strongDomains[0]||e.masteredDomains[0]||null,C=S?`${S.icon} ${S.label} (${Oe(S.state)})`:"Still building foundations — every session counts!",$=e.domainsAtRisk[0]||e.needsPractice[0]||null,L=$?`${$.icon} ${$.label} needs attention`:null,_=e.progressionDecision,m=_&&_.decision!=="no-data"?_.label:null;let k,x;$?(k=`Practise ${$.icon} ${$.label} this week`,x=(_==null?void 0:_.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(k=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,x="Reviewing words at the right time is how long-term memory forms."):(k="Keep the daily habit going — all areas are in good shape",x="Consistency is the most powerful factor in language learning.");const M=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:l,weekWords:h,weekXp:d,streak:s,domainCounts:y,overallSignal:e.overallSignal,signalLabel:g.label,signalEmoji:g.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:C,mainConcern:L,advancementNote:m,weeklyPriority:k,whyPriority:x,reviewsDue:e.reviewsDue,reviewNote:M}}function Xe(){const e=v.get("wordStats")||{},t=[];for(const s of j){const a=e[s.id];if(!a||a.attempts<6)continue;const n=a.correct/a.attempts;n<.4&&t.push({word:s.word,group:s.group,attempts:a.attempts,accuracy:Math.round(n*100)})}return t.sort((s,a)=>s.accuracy-a.accuracy),t.slice(0,6)}const ye={connectorClue:"LO-ENG-GR-03",contextInference:"LO-ENG-VOC-02",synonymContrast:"LO-ENG-VOC-03",definitionMatch:"LO-ENG-VOC-01",idiomaticExpressions:"LO-ENG-VOC-05",proverbsSayings:"LO-ENG-VOC-06",scienceTechTerms:"LO-ENG-VOC-07",socialStudiesVocab:"LO-ENG-VOC-08",pronouns:"LO-ENG-GR-04",svAgreement:"LO-ENG-GR-05",conditionals:"LO-ENG-GR-08",passiveVoice:"LO-ENG-GR-09",reportedSpeech:"LO-ENG-GR-10",relativeClauses:"LO-ENG-GR-11",tenses:"LO-ENG-GR-06",modals:"LO-ENG-GR-07",morphologicalAffix:"LO-ENG-VOC-04",collocationCloze:"LO-ENG-VOC-09",grammaticalRole:"LO-ENG-VOC-10"},Ze={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function Z(e){const t=Ze[e.key]||1,s=e.attempts===0?.1:0;return(1-(e.accuracy||0))*t+s}const ve="https://www.moe.gov.sg/primary/curriculum/syllabus";function fe(e,t){return t>0?e/t:0}function be(e,t){const s=v.get("questAttempts")||[];return t.map(a=>{const n=s.filter(c=>c.quest===e&&c.skill===a),r=n.length,o=n.filter(c=>c.correct).length;return{key:a,attempts:r,correct:o,accuracy:fe(o,r)}})}function we(){var n;const e=Object.keys(G),t=be("wordVault",e),s=((n=v.get("clueStats"))==null?void 0:n.wordVault)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(r=>{var o,c;return{...r,label:((o=G[r.key])==null?void 0:o.label)||r.key,tooltip:((c=G[r.key])==null?void 0:c.desc)||"Vocabulary development category",loCode:ye[r.key]||"LO-ENG-VOC",clueSuccess:a,syllabusLink:ve}})}function $e(){var n;const e=Object.keys(D),t=be("clozeCastle",e),s=((n=v.get("clueStats"))==null?void 0:n.clozeCastle)||{attempted:0,strong:0,partial:0},a=s.attempted>0?((s.strong||0)+(s.partial||0))/s.attempted:0;return t.map(r=>{var o,c;return{...r,label:((o=D[r.key])==null?void 0:o.label)||r.key,tooltip:`${((c=D[r.key])==null?void 0:c.label)||r.key} mastery`,loCode:ye[r.key]||"LO-ENG-GR",clueSuccess:a,syllabusLink:ve}})}function ke(){const e=we().map(s=>({...s,priorityScore:Z(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3),t=$e().map(s=>({...s,priorityScore:Z(s)})).sort((s,a)=>a.priorityScore-s.priorityScore).slice(0,3);return{vocab:e,grammar:t}}function Se({days:e=7}={}){const t=v.get("learningEvents")||[],s=Date.now()-e*24*60*60*1e3,n=t.filter(u=>{const h=Date.parse(u.timestamp||"");return Number.isFinite(h)&&h>=s}).filter(u=>u.eventType==="quest_attempt"),r=n.filter(u=>typeof u.responseMs=="number"),o=n.filter(u=>u.correct===!0).length,c=r.length?Math.round(r.reduce((u,h)=>u+h.responseMs,0)/r.length):null,d=["sentenceForge","clozeCastle","wordVault"].map(u=>{const h=n.filter(l=>l.quest===u),i=h.length,p=h.filter(l=>l.correct===!0).length;return{quest:u,attempts:i,accuracy:i>0?p/i:0}});return{days:e,attempts:n.length,correct:o,accuracy:n.length?o/n.length:0,avgResponseMs:c,byQuest:d}}function Je({limit:e=6}={}){const{vocab:t,grammar:s}=ke(),a=Se({days:7}),n=[];for(const c of t)n.push({quest:"wordVault",skill:c.key,label:c.label,loCode:c.loCode,reason:`Low mastery (${Math.round(c.accuracy*100)}%) in ${c.label}`,targetAccuracy:.85});for(const c of s)n.push({quest:"clozeCastle",skill:c.key,label:c.label,loCode:c.loCode,reason:`MOE-priority grammar focus: ${c.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&n.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",loCode:"LO-ENG-FLUENCY",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const r=new Set,o=[];for(const c of n){const d=`${c.quest}:${c.skill}`;if(!r.has(d)&&(r.add(d),o.push(c),o.length>=e))break}return o}function et(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(s=>{const a=e.filter(c=>c.quest===s).slice(0,12),n=a.length,r=a.filter(c=>c.correct).length,o=fe(r,n);return{quest:s,total:n,correct:r,accuracy:o}})}const J={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},B=Object.freeze({red:55,amber:75}),ee=Object.freeze({unknown:"⚪ Not enough evidence",green:"🟢 Secure",amber:"🟡 Developing",red:"🔴 Needs support"});function Ce(e){return e==null||Number.isNaN(e)?"unknown":e<B.red?"red":e<B.amber?"amber":"green"}function tt(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"unknown",label:ee.unknown,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const t=e.map(r=>({label:r.label,pct:r.pct,band:Ce(r.pct),attempts:r.attempts??0,independentAttempts:r.independentAttempts??0,lastPractised:r.lastPractised??null,confidence:r.confidence??re(r.independentAttempts??0)})),s={red:4,unknown:3,amber:2,green:1},a=t.reduce((r,o)=>s[o.band]>s[r]?o.band:r,"green");let n;if(a==="red"){const r=t.filter(o=>o.band==="red").map(o=>o.label);n=`${U(r)} below ${B.red}% — focused practice this week will lift exam scores.`}else if(a==="unknown"){const r=t.filter(o=>o.band==="unknown").map(o=>o.label);n=`Not enough practice yet to judge ${U(r)} — a few short sessions will show where things stand.`}else if(a==="amber"){const r=t.filter(o=>o.band==="amber").map(o=>o.label);n=`${U(r)} under ${B.amber}% — solid practice will close the gap before the next paper.`}else n="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:ee[a],summary:n,skills:t}}function U(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function st(e){const t=(e==null?void 0:e.profile)||null,s=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],n=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],r=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},o=s.slice(0,3).map(g=>({label:g.label,pct:(g.attempts??0)>0?Math.round((g.score||0)*100):null,domain:g.domain||"grammar",attempts:g.attempts??0,independentAttempts:g.independentAttempts??0,lastPractised:g.lastPractised??null,confidence:g.confidence??re(g.independentAttempts??0)})),c=a.slice(0,3).map(g=>({label:g.label,pct:Math.round((g.score||0)*100)})),d=tt(o),u=at(o[0],t),h=nt({topWeak:o,topStrong:c,weekly:r,profile:t}),i=n.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40),mode:g.mode||"",when:g.when||""})),p=o.map(g=>({...g,band:Ce(g.pct)})),l=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40)})).filter(g=>g.word):[],y=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(g=>({word:String(g.word||"").slice(0,40)})).filter(g=>g.word):[],b=Pe(3).map(g=>({id:g.id,label:g.childName,teacherLabel:g.label,count:g.count,tip:g.selfCheck}));return{learnerName:(t==null?void 0:t.name)||"Your child",grade:(t==null?void 0:t.primaryGrade)||null,avatar:(t==null?void 0:t.avatar)||"🧒",weekly:r,strengths:c.length?c:[{label:"Steady effort",pct:null}],needsPractice:p,habits:b,recentMistakes:i,recommendation:u,examRisk:d,teacherComment:h,graduatingSoon:l,slippingRecently:y}}function at(e,t){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const s=J[e.domain]||J.grammar,a=t!=null&&t.primaryGrade?` (${t.primaryGrade})`:"",n=e.pct==null?"not enough practice yet to give a score":`currently ${e.pct}%${K(e)}`;return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — ${n}. Aim for 8 of 10 correct before bed.`,target:s.target,targetLabel:s.label}}function K(e){const t=(e==null?void 0:e.attempts)??0;return t<=0||t>=12?"":` from just ${t} answer${t===1?"":"s"}`}function nt({topWeak:e,topStrong:t,weekly:s,profile:a}){const n=(a==null?void 0:a.name)||"Your child",r=s.days>=5?`${n} has been wonderfully consistent this week (${s.days} active days).`:s.days>=2?`${n} practised on ${s.days} days this week — a solid rhythm.`:`${n} hasn't practised much this week. Two short sessions will keep skills warm.`,o=t[0]?` They are strongest in ${t[0].label}${t[0].pct?` (${t[0].pct}%)`:""}.`:"",c=e[0]?e[0].pct==null?` ${e[0].label} is the area to look at next — there isn't enough practice yet to put a number on it.`:` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%${K(e[0])}.`:" No weak spots have shown up yet — there may simply not be enough practice recorded to tell.";return`${r}${o}${c} Encourage them to read aloud short passages every day to keep building fluency.`}function rt(e){var s,a,n,r,o,c;if(!e)return"";const t=[];if(t.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),t.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(s=e.strengths)==null?void 0:s[0])!=null&&a.pct?t.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):t.push("✅ Strength: Steady effort"),(n=e.needsPractice)!=null&&n[0]){const d=e.needsPractice[0],u=d.pct==null?"not enough practice yet to score":`${d.pct}%${K(d)}`;t.push(`🎯 Needs practice: ${d.label} (${u})`)}return e.examRisk&&t.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(r=e.recentMistakes)!=null&&r.length&&t.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(d=>d.word).join(", ")}`),(o=e.graduatingSoon)!=null&&o.length&&t.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(d=>d.word).join(", ")}`),(c=e.slippingRecently)!=null&&c.length&&t.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(d=>d.word).join(", ")} — a 2-min review tonight will help.`),t.push(`👉 Today's 10 min: ${e.recommendation.title}`),t.push(`💬 Automated learning summary: ${e.teacherComment}`),t.join(`
`)}const Le=2,_e=.6,ot=2,ct=e=>`phonicsquest_profile_${e}`;function it(e){if(!e)return{};try{const t=localStorage.getItem(ct(e)),s=t?JSON.parse(t):null;return s&&typeof s=="object"?s:{}}catch{return{}}}function lt(e){const t=Date.parse(e||"");return Number.isNaN(t)?1/0:(Date.now()-t)/864e5}function dt(e){const t=e==null?void 0:e.misconceptionLog;return!t||typeof t!="object"?[]:Object.entries(t).filter(([s,a])=>!a||typeof a!="object"||je(s)||!ce(s)||(a.count||0)<ot?!1:lt(a.lastSeen)<=Ne).map(([s,a])=>({id:s,count:a.count||0})).sort((s,a)=>a.count-s.count)}function pt(e){const t=e==null?void 0:e.groupMastery;if(!t||typeof t!="object")return[];const s=H(t);return Object.entries(s).filter(([a,n])=>typeof n=="number"&&n>0&&n<=_e).filter(([a])=>z.some(n=>n.group===a||n.id===a)).map(([a,n])=>({group:a,mastery:n})).sort((a,n)=>a.mastery-n.mastery)}function ut(e){const t=z.find(s=>s.group===e||s.id===e);return(t==null?void 0:t.name)||N[e]||e}function ht(e){var s;const t=z.find(a=>a.group===e||a.id===e);return{target:((s=t==null?void 0:t.recommendedModes)==null?void 0:s[0])||"blend",group:(t==null?void 0:t.group)||e}}function mt(){const e=oe(),t=new Map;for(const a of e){if(!(a!=null&&a.id))continue;const n=it(a.id),r={id:a.id,name:a.name,avatar:a.avatar};for(const{id:o,count:c}of dt(n)){const d=`misconception:${o}`;t.has(d)||t.set(d,{kind:"misconception",key:o,children:[],total:0});const u=t.get(d);u.children.push({...r,count:c}),u.total+=c}for(const{group:o,mastery:c}of pt(n)){const d=`phonics:${o}`;t.has(d)||t.set(d,{kind:"phonics",key:o,children:[],total:0});const u=t.get(d);u.children.push({...r,mastery:c}),u.total+=1}}return{groups:[...t.values()].filter(a=>a.children.length>=Le).map(a=>a.kind==="misconception"?gt(a):yt(a)).sort((a,n)=>n.children.length-a.children.length||n.total-a.total),childCount:e.length,generatedAt:new Date().toISOString()}}function gt(e){const t=ce(e.key);return{kind:"misconception",key:e.key,title:t.label,childName:t.childName,detail:t.rule,example:t.example,teach:t.cue,children:e.children,total:e.total,action:null}}function yt(e){const t=ut(e.key);return{kind:"phonics",key:e.key,title:t,childName:t,detail:`Practised but not secure — all ${e.children.length} are under ${Math.round(_e*100)}%.`,example:"",teach:`Teach ${t} once to the group, then let each child practise it.`,children:e.children,total:e.total,action:ht(e.key)}}function vt(){return oe().length>=Le}ne.register(...Ee);let O=null,E=null;function Jt(e,t={}){E=t.onNavigate||null;const s=I.getOverallStats();e.innerHTML=`
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
  `,$t(),Ct(),xt(),Mt(),Ot(),Rt(),At(),Et(),Pt(),jt(),Lt(),_t(),wt(),Nt(s),It(s),Tt(s),Gt(s),Dt(),Wt(),Vt(),bt()}function T(e,t){e&&(t?e.setAttribute("data-dash-empty","true"):e.removeAttribute("data-dash-empty"))}function ft(e){return e.getAttribute("data-dash-empty")==="true"?!0:e.children.length===0&&!e.textContent.trim()}function bt(){for(const e of document.querySelectorAll(".dash-group")){const t=e.querySelectorAll(".dash-group__body > div[id]");if(!t.length)continue;const s=Array.from(t).every(ft);e.hidden=s}}function wt(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning journey</h3><div id="dash-cm-inner"></div>';const t=document.getElementById("dash-cm-inner");t&&Ue(t)}function $t(){var S,C,$,L,_;const e=document.getElementById("dash-parent-report-card");if(!e)return;const t=W(),s=I.getOverallStats(),a=ge(),n=Ie(),r=v.get("questMastery")||{},o=[];for(const[,m]of Object.entries(r))if(!(!m||typeof m!="object"))for(const[k,x]of Object.entries(m)){if(typeof x!="number")continue;const M=o.find(w=>w.skill===k);M?x>M.score&&(M.score=x):o.push({skill:k,score:x})}const c=o.filter(m=>m.score>=.75).sort((m,k)=>k.score-m.score).map(m=>({skill:m.skill,label:St(m.skill),score:m.score})),d=(s.recentHistory||[]).filter(m=>m&&m.correct===!1).slice(0,5).map(m=>({word:m.wordId,mode:m.mode,when:Y(m.timestamp),correct:!1})),u={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(s.totalAttempts||0),accuracy:s.overallAccuracy||0},h=v.get("wordStats")||{},i=Te(h,j).map(m=>({word:m.item.word||m.id})),p=Ge(h,j).map(m=>({word:m.item.word||m.id})),l=st({profile:t,weakSkills:n,strengths:c,recentMistakes:d,weekly:u,graduatingSoon:i,slippingRecently:p});e.innerHTML=`
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
            ${l.strengths.map(m=>`<li>${f(m.label)}${m.pct?` <strong>(${m.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${l.needsPractice.map(m=>`<li class="needs-practice-item needs-practice-item--${m.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${f(m.label)} <strong>${m.pct==null?"(not enough practice yet)":`(${m.pct}%)`}</strong>${kt(m)}</li>`).join("")||"<li>Nothing has been measured yet — a few short sessions will show where things stand</li>"}
          </ul>
        </div>
        ${(S=l.habits)!=null&&S.length?`
        <div class="parent-report-card__cell parent-report-card__cell--habits">
          <h4>🔁 Habits to work on</h4>
          <ul class="report-habits">
            ${l.habits.map(m=>`<li class="report-habit">
                  <span class="report-habit__name">${f(m.label)} <small>· ${m.count} time${m.count===1?"":"s"}</small></span>
                  <span class="report-habit__tip">${f(m.tip)}</span>
                </li>`).join("")}
          </ul>
        </div>`:""}
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${l.recentMistakes.map(m=>`<li>${f(m.word)}${m.mode?` <small>· ${f(m.mode)}</small>`:""}${m.when?` <small>· ${f(m.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${(C=l.graduatingSoon)!=null&&C.length||($=l.slippingRecently)!=null&&$.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(L=l.graduatingSoon)!=null&&L.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${l.graduatingSoon.slice(0,5).map(m=>f(m.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(_=l.slippingRecently)!=null&&_.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${l.slippingRecently.slice(0,5).map(m=>f(m.word)).join(", ")} — a 2-min review tonight will help.</p>
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
    </section>`;const y=e.querySelector("#parent-report-cta");y==null||y.addEventListener("click",()=>{const m=y.dataset.target;E&&m&&E({target:m})});const b=e.querySelector("#copy-parent-update"),g=e.querySelector("#parent-update-hint");b==null||b.addEventListener("click",async()=>{var x,M;const m=rt(l);let k=!1;try{(x=navigator.clipboard)!=null&&x.writeText&&(await navigator.clipboard.writeText(m),k=!0)}catch{}if(!k){const w=document.createElement("textarea");w.value=m,w.setAttribute("aria-label","Parent update message"),w.className="parent-report-card__fallback",w.readOnly=!0,(M=b.parentElement)==null||M.appendChild(w),w.focus(),w.select()}g&&(g.textContent=k?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function kt(e){const t=(e==null?void 0:e.attempts)??0,s=[];return s.push(t===0?"no answers recorded":`${t} answer${t===1?"":"s"}`),e!=null&&e.lastPractised&&s.push(`last practised ${Y(e.lastPractised)}`),e!=null&&e.confidence&&e.confidence!=="high"&&s.push(f(He(e.confidence)).toLowerCase()),` <small class="needs-practice-evidence">· ${f(s.join(" · "))}</small>`}function St(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ct(){const e=document.getElementById("dash-coaching-card");if(!e)return;const t=ge(),s={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[t.overallSignal]||"coaching-card--grey",a=t.advancementNote?`<div class="coaching-advancement">${t.advancementNote}</div>`:"",n=t.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${t.domainsAtRisk.map(h=>`<span class="coaching-domain-chip coaching-chip--red">${h.icon} ${h.label}</span>`).join("")}
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
    </div>`}function Lt(){const e=document.getElementById("dash-reporting-section");if(!e)return;const t=we().sort((h,i)=>h.accuracy-i.accuracy).slice(0,8),s=$e().sort((h,i)=>h.accuracy-i.accuracy).slice(0,8),a=et(),n=ke(),r=Se({days:7}),o=Je({limit:6});T(e,!t.length&&!s.length&&!a.length);const c=h=>h.map(i=>{const p=Math.round((i.accuracy||0)*100),l=Math.round((i.clueSuccess||0)*100);return`<div class="dash-category-row" title="${i.tooltip}">
      <div class="dash-category-head">
        <span><strong>${i.label}</strong> <small>(${i.loCode})</small></span>
        <span>${p}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${p}%"></div></div>
      <div class="dash-category-meta">Attempts: ${i.attempts} · Clue success: ${l}% · <a href="${i.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`}).join(""),d=(h,i)=>`
    <div class="dash-pattern-item">
      <strong>${h}</strong>
      ${i.map(p=>`<div class="dash-category-row" title="${p.tooltip}">
        <div class="dash-category-head">
          <span><strong>${p.label}</strong> <small>(${p.loCode})</small></span>
          <span>${Math.round((p.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((p.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${p.priorityScore.toFixed(2)} · <a href="${p.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join("")}
    </div>`,u=a.map(h=>{const i=Math.round((h.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${h.quest}</strong><br>${h.correct}/${h.total} · ${i}%</div>`}).join("");e.innerHTML=`
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
      ${o.map(h=>`<li class="dash-pattern-item"><strong>${h.quest}</strong> · ${h.label} <small>(${h.loCode})</small><br>${h.reason}</li>`).join("")}
    </ul>
  `}function _t(){const e=document.getElementById("dash-moe-section");if(!e)return;const t=Ye();T(e,!t.length),e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Syllabus coverage</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item"><strong>${s.code}</strong> · ${s.focus}</li>`).join("")}
    </ul>`}function xt(){const e=document.getElementById("dash-learner-summary");if(!e)return;const t=de(),s=v.get("speechLocale")||"en-SG";e.innerHTML=`
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
    </div>`}function At(){const e=document.getElementById("dash-domains-section");if(!e)return;const t=pe(),s=t.some(a=>a.score!==null);T(e,!s),e.innerHTML=`
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
    </div>`}function Et(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:t,byType:s}=ue();if(T(e,!1),!t.length&&!s.length){T(e,!0),e.innerHTML=`
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
    ${n}`}function Mt(){const e=document.getElementById("dash-actions-section");if(!e)return;const t=he();e.innerHTML=`
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
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.target,n=s.dataset.group||null;E==null||E({target:a,group:n})})})}function Rt(){const e=document.getElementById("dash-class-snapshot");if(!e||!vt())return;const{groups:t,childCount:s}=mt();if(!t.length)return;const a=t.map(n=>{const r=n.children.map(c=>`<span class="cs-child">${f(c.avatar||"")} ${f(c.name)}</span>`).join(""),o=n.action?`<button type="button" class="cs-action" data-target="${f(n.action.target)}" data-group="${f(n.action.group)}">Open ${f(n.title)} practice →</button>`:"";return`
      <article class="cs-card cs-card--${n.kind}">
        <header class="cs-card__head">
          <span class="cs-count">${n.children.length} of ${s}</span>
          <h4 class="cs-card__title">${f(n.title)}</h4>
        </header>
        <div class="cs-children">${r}</div>
        <p class="cs-detail">${f(n.detail)}</p>
        <p class="cs-teach"><strong>Try this:</strong> ${f(n.teach)}</p>
        ${o}
      </article>`}).join("");e.innerHTML=Ve`
    <section class="cs-section" aria-label="Who needs the same lesson">
      <h3 class="dash-section-title">👥 Who needs the same thing</h3>
      <p class="cs-intro">
        Across the ${s} children on this device. Each card is one lesson worth teaching
        once, to everyone named on it.
      </p>
      <div class="cs-list">${De(a)}</div>
    </section>
  `,e.querySelectorAll(".cs-action").forEach(n=>{n.addEventListener("click",()=>E==null?void 0:E({target:n.dataset.target,group:n.dataset.group}))})}function Ot(){const e=document.getElementById("dash-stuck-words");if(!e)return;const t=Xe();if(!t.length)return;const s=t.map(a=>`
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
    </div>`}function Pt(){const e=document.getElementById("dash-patterns-section");if(!e)return;const t=me();t.length&&(e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">What we have noticed</h3>
    <ul class="dash-pattern-list">
      ${t.map(s=>`<li class="dash-pattern-item">💬 ${s}</li>`).join("")}
    </ul>`)}function jt(){const e=document.getElementById("dash-tutor-activity");if(!e)return;const t=(v.get("lessonHistory")||[]).slice(0,30),s=v.get("readAloudStats")||{},a=(v.get("aiUsageLog")||[]).slice(0,8),n=Object.entries(s).sort((p,l)=>{var y,b;return String(((y=l[1])==null?void 0:y.updatedAt)||"").localeCompare(String(((b=p[1])==null?void 0:b.updatedAt)||""))}).slice(0,5);if(!t.length&&!n.length&&!a.length)return;const r=Date.now()-14*24*60*60*1e3,o=t.filter(p=>{const l=new Date(p.completedAt||p.date).getTime();return Number.isFinite(l)&&l>=r}).length,c=t.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${o}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`:"",d=[...new Set(n.flatMap(([,p])=>(p==null?void 0:p.lastMissedWords)||[]))].slice(0,8),u=n.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${n.reduce((p,[,l])=>p+((l==null?void 0:l.attempts)||0),0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`:"",h={explain:"❓ Why explained",hint:"💡 Hint",ask:"Ask Giri",grade:"✍️ Essay marked"},i=a.length?`
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${a.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${a.map(p=>`<li class="dash-pattern-item">${h[p.kind]||p.kind} · ${f(p.summary||"")} <small>(${f(p.date||"")})</small></li>`).join("")}
      </ul>
    </details>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Lessons and help used</h3>
    <div class="dash-stats-grid">
      ${c}
      ${u}
    </div>
    ${d.length?`<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${d.map(f).join(", ")}</p>`:""}
    ${i}`}function Nt(e){const t=document.getElementById("chart-mastery");if(!t)return;O&&(O.destroy(),O=null);const s=ie.filter(o=>V[o]),a=s.map(o=>V[o].label),n=s.map(o=>Math.round((e.groupMastery[o]??0)*100)),r=s.map(o=>V[o].color);O=new ne(t,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:n,backgroundColor:r.map(o=>o+"80"),borderColor:r,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:o=>o+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function It(e){const t=document.getElementById("mastery-bars");t&&(t.innerHTML=ie.map(s=>{const a=V[s];if(!a)return"";const n=Math.round((e.groupMastery[s]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${n}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${n}%</span>
      </div>`}).join(""))}function Tt(e){const t=document.getElementById("learning-path");if(!t)return;const s=Be(We());t.innerHTML=z.map(a=>{const n=s.includes(a.id),r=a.groups??(a.group?[a.group]:[]),o=r.map(d=>e.groupMastery[d]??0),c=r.length?Math.round(o.reduce((d,u)=>d+u,0)/r.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${n?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${c}%"></div>
        </div>
        <span class="mastery-bar-pct">${n?c+"%":"🔒"}</span>
      </div>`}).join("")}function Gt(e){const t=document.getElementById("word-history-body");if(!t)return;const s=e.recentHistory.slice(0,30).map(a=>{const n=j.find(d=>d.id===a.wordId),r=(n==null?void 0:n.emoji)||"",o=Y(a.timestamp),c=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${r} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${c}</td>
      <td>${o}</td>
    </tr>`});t.innerHTML=s.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function Dt(){const e=document.getElementById("badge-grid");if(!e)return;const t=F.getAll();e.setAttribute("aria-label",`${F.earnedCount} of ${F.totalCount} badges earned`),e.innerHTML=t.map(s=>`
    <div class="badge-card ${s.earned?"badge-card--earned":"badge-card--locked"}"
         title="${s.desc}"
         aria-label="${s.name}${s.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${s.earned?s.emoji:"🔒"}</span>
      <span class="badge-name">${s.name}</span>
    </div>`).join("")}function Vt(){var n,r,o,c,d,u,h;(n=document.getElementById("btn-export-csv"))==null||n.addEventListener("click",()=>{const i=I.exportCSV(),p=new Blob([i],{type:"text/csv"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress.csv",y.click(),URL.revokeObjectURL(l)}),(r=document.getElementById("btn-export-csv-anon"))==null||r.addEventListener("click",()=>{const i=I.exportCSV().split(`
`).map((b,g)=>{if(g===0||!b.trim())return b;const[S,...C]=b.split(",");return[`${S.slice(0,1)}***`,...C].join(",")}).join(`
`),p=new Blob([i],{type:"text/csv"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download="phonicsquest-progress-anonymised.csv",y.click(),URL.revokeObjectURL(l)}),(o=document.getElementById("btn-export-report"))==null||o.addEventListener("click",()=>{const i=Ht(),p=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),l=URL.createObjectURL(p),y=document.createElement("a");y.href=l,y.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(l)}),(c=document.getElementById("btn-import-csv"))==null||c.addEventListener("click",()=>{const i=document.getElementById("csv-import-panel");i&&(i.hidden=!i.hidden)}),(d=document.getElementById("csv-browse-btn"))==null||d.addEventListener("click",()=>{var i;(i=document.getElementById("csv-file-input"))==null||i.click()}),(u=document.getElementById("csv-file-input"))==null||u.addEventListener("change",i=>{var l;const p=(l=i.target.files)==null?void 0:l[0];p&&ae(p)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",i=>{i.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",i=>{var l,y;i.preventDefault(),e.classList.remove("dash-import-drop--active");const p=(y=(l=i.dataTransfer)==null?void 0:l.files)==null?void 0:y[0];p&&ae(p)}));const t=document.getElementById("adaptive-weak-weight"),s=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};t&&(t.value=String(a.weakWeight??5),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(t.value)})})),s&&(s.value=String(a.unseenWeight??3),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(s.value)})})),(h=document.getElementById("btn-print-report"))==null||h.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function Bt(e,t=Date.now()){if(!Array.isArray(e))return 0;const s=864e5,a=new Set;for(let r=0;r<7;r++)a.add(new Date(t-r*s).toISOString().slice(0,10));const n=new Set;for(const r of e)a.has(r==null?void 0:r.date)&&(r.xp||0)>0&&n.add(r.date);return n.size}function Wt(){const e=document.getElementById("print-report-content");if(!e)return;const t=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function s(d){const u=d*100;return u>=70?"#22c55e":u>=40?"#f59e0b":"#ef4444"}function a(d,u,h){var p;const i=[];for(const l of u){const y=qe.getSkillScore(d,l);if(y===.5)continue;const b=Math.round(y*100),g=s(y),S=((p=h[l])==null?void 0:p.label)||l,C=Math.max(b,4);i.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${C}px;background:${g};"></div>
          <span style="color:${g};font-weight:600;min-width:36px">${b}%</span>
          <span>${f(S)}</span>
        </div>`)}return i.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const n=v.get("xp")??0,r=v.get("streak")??0,o=v.get("dailyGoal")??0,c=Bt(v.get("weeklyXpLog"));e.innerHTML=`
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
        ${a("grammarMcq",ze,D)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${a("vocabMcq",Fe,G)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`}function Ht(){const e=I.getOverallStats(),t=W();return{generatedAt:new Date().toISOString(),learnerSummary:de(),literacyDomains:pe(),clueInsights:ue(),recommendedActions:he(),recentPatternInsights:me(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:t}}}const xe=new Set(["a","e","i","o","u"]),qt=new Set("bcdfghjklmnpqrstvwxyz".split(""));function Q(e){const s=e.toLowerCase().split(""),a=s.map(n=>xe.has(n)?"sv":(qt.has(n),"c"));return{graphemes:s,types:a}}function te(e){const t=e.toLowerCase().split("").find(s=>xe.has(s));return t?`short-${t}`:"short-a"}function se(e,t){const s=[],a=[];let n=!1;for(const c of t){if(c==="sv"||c==="lv"){n=!0;continue}n?a.push(c):s.push(c)}const r=s.length,o=a.length;return r<=1&&o<=1?"CVC":r>=2&&o<=1?"blend":r<=1&&o>=2?"CVCC":"CCVCC"}async function ae(e){var u,h;const t=document.getElementById("csv-import-preview"),s=document.getElementById("csv-import-status");if(!t||!s)return;const n=(await e.text()).trim().split(`
`).filter(i=>i.trim());if(!n.length){s.hidden=!1,s.textContent="File is empty.",s.className="dash-import-status dash-import-status--error";return}const r=n[0].trim(),o=r.includes(","),c=[],d=new Set(j.map(i=>i.id));if(o){const i=r.toLowerCase().split(",").map(C=>C.trim()),p=i.indexOf("word");if(p<0){s.hidden=!1,s.textContent='CSV must have a "word" column.',s.className="dash-import-status dash-import-status--error";return}const l=i.indexOf("graphemes"),y=i.indexOf("types"),b=i.indexOf("group"),g=i.indexOf("level"),S=i.indexOf("emoji");for(let C=1;C<n.length;C++){const $=n[C].split(",").map(k=>k.trim()),L=$[p];if(!L||d.has(L.toLowerCase()))continue;const _=l>=0&&$[l]?$[l].split(/[|;]/):Q(L).graphemes,m=y>=0&&$[y]?$[y].split(/[|;]/):Q(L).types;c.push({id:L.toLowerCase(),word:L.toLowerCase(),graphemes:_,types:m,pattern:se(_,m),group:b>=0&&$[b]||te(L),level:g>=0&&parseInt($[g])||1,emoji:S>=0&&$[S]||""})}}else for(const i of n){const p=i.trim().toLowerCase();if(!p||d.has(p))continue;const{graphemes:l,types:y}=Q(p);c.push({id:p,word:p,graphemes:l,types:y,pattern:se(l,y),group:te(p),level:1,emoji:""})}if(!c.length){s.hidden=!1,s.textContent="No new words found (all may already exist).",s.className="dash-import-status dash-import-status--error";return}t.hidden=!1,t.innerHTML=`
    <p><strong>${c.length} new word${c.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${c.slice(0,20).map(i=>`<span class="dash-import-word">${i.emoji?i.emoji+" ":""}${i.word} <small>(${i.group})</small></span>`).join("")}${c.length>20?`<span class="dash-import-word">…and ${c.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${c.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(u=document.getElementById("csv-cancel-import"))==null||u.addEventListener("click",()=>{t.hidden=!0,s.hidden=!0}),(h=document.getElementById("csv-confirm-import"))==null||h.addEventListener("click",()=>{j.push(...c);const i=v.get("customWords")||[];v.set("customWords",[...i,...c]),t.hidden=!0,s.hidden=!1,s.textContent=`Imported ${c.length} word${c.length>1?"s":""} successfully!`,s.className="dash-import-status dash-import-status--success"})}function Y(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function es(){O&&(O.destroy(),O=null)}export{Bt as countDaysPlayedThisWeek,es as destroyDashboard,Jt as renderDashboard};
