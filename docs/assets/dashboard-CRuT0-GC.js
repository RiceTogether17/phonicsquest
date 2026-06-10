import{C as ne,r as Ee}from"./chartjs-BR_H7_9u.js";import{s as v,g as T,n as Q,S as q,V,h as A,W as N,P as Ae,C as re,a as j,G,p as I,b as Oe,c as _e,d as Pe,e as B,f as oe,i as De,j as Ne,k as z,q as Ie,l as Te,m as je}from"./index-Bku_Opw4.js";import"./vocabPassages-XG3ukigx.js";import"./passages-DNXaSraU.js";import"./gsap-C8pce-KX.js";const Ge=[1,3,7,14,30],ce=3,_={MASTERED:.85,ON_TRACK:.7,CONSOLIDATING:.5,BUILDING:.2},Be=[{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",questKey:"sentenceForge"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",questKey:"clozeCastle"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",questKey:"wordVault"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",questKey:"editingQuest"},{id:"writingQuest",label:"Writing Quest",icon:"📝",questKey:"writingQuest"}];function Ve(e){return!e||(e.attempts||0)<ce?0:(e.reviewInterval??0)/(Ge.length-1)}function We(e){const s=(v.get("questMastery")||{})[e]||{},t=Object.values(s).filter(a=>typeof a=="number");return t.length?t.reduce((a,r)=>a+r,0)/t.length:null}function qe(){const e=v.get("groupMastery")||{},s=Object.values(e).filter(t=>typeof t=="number");return s.length?s.reduce((t,a)=>t+a,0)/s.length:null}function ze(){const e=v.get("wordStats")||{},s=Object.values(e).filter(t=>((t==null?void 0:t.attempts)||0)>=ce).map(t=>Ve(t));return s.length?s.reduce((t,a)=>t+a,0)/s.length:0}function F(){const e=ze(),s=qe(),t=s!==null?Math.min(1,s*.8+e*.2):null,a={id:"phonics",label:"Phonics / Decoding",icon:"🔤",raw:s,composite:t,state:U(t),signal:K(t)},r=Be.map(n=>{const c=We(n.questKey),i=c;return{...n,raw:c,composite:i,state:U(i),signal:K(i)}});return[a,...r]}function U(e){return e==null?"no-data":e>=_.MASTERED?"mastered":e>=_.ON_TRACK?"on-track":e>=_.CONSOLIDATING?"consolidating":e>=_.BUILDING?"building":"just-started"}function K(e){return e==null?"no-data":e>=_.ON_TRACK?"on-track":e>=_.CONSOLIDATING?"needs-practice":"at-risk"}function He(e){return{mastered:"Mastered ✅","on-track":"On track",consolidating:"Consolidating",building:"Building","just-started":"Just started","no-data":"No data yet"}[e]||e}function Qe(e){const t=F().find(r=>r.id===e);if(!t||t.composite===null)return{decision:"no-data",label:"Not enough data yet",canAdvance:!1};const a=t.state;return a==="mastered"?{decision:"advance",label:"Ready to advance ✅",canAdvance:!0}:a==="on-track"?{decision:"continue",label:"On track — keep going",canAdvance:!1}:a==="consolidating"?{decision:"consolidate",label:"Consolidate before advancing ⚠️",canAdvance:!1}:{decision:"review",label:"Needs more practice 🔴",canAdvance:!1}}function Fe(){const e=v.get("questAttempts")||[],s=Date.now()-7*24*3600*1e3,t={};for(const a of e)a.timestamp&&new Date(a.timestamp).getTime()>=s&&(t[a.quest]=(t[a.quest]||0)+1);return t}function Ue(){const e=F().filter(l=>l.composite!==null),s=e.filter(l=>l.signal==="at-risk"),t=e.filter(l=>l.signal==="needs-practice"),a=e.filter(l=>l.signal==="on-track"),r=e.filter(l=>l.state==="mastered"),n=s.length>0?"at-risk":t.length>0?"needs-practice":e.length>0?"on-track":"no-data",i=[...e].sort((l,h)=>(l.composite??1)-(h.composite??1))[0],d=i?`${i.icon} ${i.label} (${Math.round((i.composite??0)*100)}%)`:"Keep practising across all areas!",m=v.get("wordStats")||{},p=Date.now();let o=0;for(const l of Object.values(m))if(l!=null&&l.nextReviewDate){const h=new Date(l.nextReviewDate).getTime();!isNaN(h)&&p>=h&&o++}const u=i?Qe(i.id):null;return{overallSignal:n,domainsAtRisk:s,needsPractice:t,strongDomains:a,masteredDomains:r,nextFocus:d,reviewsDue:o,progressionDecision:u,weakestDomain:i||null,domains:e}}function E(e){const s=(v.get("questMastery")||{})[e]||{},t=Object.values(s).filter(a=>typeof a=="number");return t.length?t.reduce((a,r)=>a+r,0)/t.length:null}function P(e){const t=(v.get("clueStats")||{})[e];if(!t)return null;if(e==="sentenceForge"){const r=(t.correct||0)+(t.incorrect||0);return r>0?{accuracy:t.correct/r,attempted:r}:null}const a=t.attempted||0;return a?{accuracy:((t.strong||0)+(t.partial||0)*.5)/a,attempted:a,strong:t.strong||0,partial:t.partial||0,weak:t.weak||0}:null}function Y(e){const s=(v.get("questMastery")||{})[e]||{};if(!Object.keys(s).length)return null;let t=null,a=1/0;for(const[r,n]of Object.entries(s))n<a&&(a=n,t=r);return t?{skill:t,score:a}:null}function ie(){const e=Q(v.get("groupMastery")||{});let s=null,t=1/0;for(const a of q){const r=e[a];typeof r=="number"&&r<t&&(t=r,s=a)}return s}function Ke(e,s=10){const t=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,s);return t.length<3?null:t.filter(a=>a.correct).length/t.length}function Ye(e,s){return e===null?null:e>=.7&&s!==null&&s>=.7?"Finding clues and answering correctly":e>=.7&&s!==null&&s<.55?"Finds clue but chooses wrong answer":e<.5&&s!==null&&s<.5?"Misses clue and answer — needs focused practice":e<.5&&s!==null&&s>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function le(){var o,u;const e=T(),s=Q(v.get("groupMastery")||{}),t=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=q.map(l=>({label:V[l],score:s[l]??null})).filter(l=>l.score!==null),r=[...a].sort((l,h)=>h.score-l.score),n=r[0],c=r[r.length-1],i=[{name:"Grammar Cloze",score:E("clozeCastle")},{name:"Sentence Skills",score:E("sentenceForge")},{name:"Vocabulary Cloze",score:E("wordVault")}].filter(l=>l.score!==null).sort((l,h)=>h.score-l.score),d=((o=i[0])==null?void 0:o.name)||(n?`Phonics (${n.label})`:"Not enough data yet"),m=((u=i[i.length-1])==null?void 0:u.name)||(c?`Phonics (${c.label})`:"Not enough data yet");let p="Building foundations";if((e==null?void 0:e.schoolLevel)==="primary"){const l=E("sentenceForge"),h=E("clozeCastle"),y=E("wordVault");l!==null&&l<.6?p="Sentence structure skills":h!==null&&h<.6?p="Grammar cloze passages":y!==null&&y<.6?p="Vocabulary in context":p="Advanced sentence and grammar skills"}else{const l=ie();l&&(s[l]??0)<.6?p=`Short vowel sounds (${V[l]||l})`:a.length?p="Phonics blending and awareness":p="Starting phonics journey"}return{learnerType:t,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:d,weakest:m,currentFocus:p}}function de(){const e=Q(v.get("groupMastery")||{});v.get("clueStats");const s=q.map(d=>e[d]).filter(d=>typeof d=="number"),t=s.length?s.reduce((d,m)=>d+m,0)/s.length:null,a=[],r=P("clozeCastle");r&&a.push(r.accuracy);const n=P("sentenceForge");n&&a.push(n.accuracy);const c=P("wordVault");c&&a.push(c.accuracy);const i=a.length?a.reduce((d,m)=>d+m,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:t,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:E("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:E("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:E("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:E("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:E("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:i,color:"#f59e0b"}]}function ue(){const e=v.get("clueStats")||{},s=v.get("questAttempts")||[],t=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:n,label:c,icon:i}of a){const d=P(n);if(!d)continue;const m=s.filter(o=>o.quest===n),p=m.length>=3?m.filter(o=>o.correct).length/m.length:null;t.push({quest:c,icon:i,clueAttempted:d.attempted,clueAccuracy:d.accuracy,answerAccuracy:p,interpretation:Ye(d.accuracy,p)})}const r=Object.entries(e.byType||{}).filter(([,n])=>n.attempted>=3).map(([n,c])=>({type:A(n),accuracy:((c.strong||0)+(c.partial||0)*.5)/c.attempted,attempted:c.attempted})).sort((n,c)=>n.accuracy-c.accuracy);return{questInsights:t,byType:r}}function Je(){return[{code:"LO 3.1",focus:"Decode and blend multi-syllabic words",target:"blend"},{code:"LO 4.2",focus:"Use grammar in context and editing",target:"cloze-castle"},{code:"LO 5.2",focus:"Synthesis and sentence transformation",target:"sentence-forge"}]}function pe(){const e=T(),s=(e==null?void 0:e.schoolLevel)==="primary",t=v.get("groupMastery")||{},a=[];if(s){const r=P("clozeCastle");if(r&&r.accuracy<.6){const d=Y("clozeCastle"),m=Math.round(r.accuracy*100);a.push({why:`Grammar clue accuracy is ${m}%.${d?` Weakest area: ${A(d.skill)}.`:""}`,target:`Cloze Castle${d?` – ${A(d.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const n=Y("sentenceForge"),c=Ke("sentenceForge");(c!==null&&c<.65||n&&n.score<.55)&&a.push({why:n?`Sentence skill "${A(n.skill)}" scores ${Math.round(n.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${n?` – ${A(n.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const i=P("wordVault");i&&i.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(i.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const r=ie(),n=r?t[r]??0:null;if(r&&n<.65){const d=Math.round(n*100);a.push({why:`${V[r]} decoding accuracy is ${d}% — below the 65% target.`,target:`Phonics – ${V[r]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:r})}const c=q.map(d=>t[d]??0);c.reduce((d,m)=>d+m,0)/c.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function me(){const e=[],s=v.get("wordHistory")||[],t=v.get("questAttempts")||[],a=v.get("clueStats")||{},r=Date.now(),n=7*24*60*60*1e3,c=s.filter(o=>o.timestamp&&r-new Date(o.timestamp).getTime()<n),i=s.filter(o=>{if(!o.timestamp)return!1;const u=r-new Date(o.timestamp).getTime();return u>=n&&u<2*n});if(c.length>=5&&i.length>=5){const o=c.filter(l=>l.correct).length/c.length,u=i.filter(l=>l.correct).length/i.length;o>u+.1?e.push("Accuracy has improved over the last 7 days"):o<u-.1&&e.push("Accuracy has dipped recently — more practice will help")}const d=a.byType||{},m=Object.entries(d).filter(([,o])=>o.attempted>=3).filter(([,o])=>((o.strong||0)+(o.partial||0)*.5)/o.attempted<.45).map(([o])=>A(o));m.length>0&&e.push(`Struggled with ${m[0]} clues recently`),t.filter(o=>o.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const p=Object.entries(d).filter(([,o])=>o.attempted>=3).filter(([,o])=>((o.strong||0)+(o.partial||0)*.5)/o.attempted>=.75).map(([o])=>A(o));return p.length>0&&e.push(`Strong in ${p[0]} passages`),!e.length&&s.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function ge(){const e=Ue(),s=v.get("wordHistory")||[],t=v.get("streak")||0,a=Date.now(),r=7*24*3600*1e3,n=a-r,c=new Date(n).toISOString().slice(0,10),d=(v.get("weeklyXpLog")||[]).filter(L=>L.date>=c).reduce((L,Me)=>L+(Me.xp||0),0),m=s.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=n),p=new Set(m.map(L=>L.word).filter(Boolean)).size,o=v.get("questAttempts")||[],u=new Set(o.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=n).map(L=>new Date(L.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&u.add(new Date().toDateString());const l=u.size,h=Fe(),y={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},b=y[e.overallSignal]||y["no-data"],w=e.strongDomains[0]||e.masteredDomains[0]||null,k=w?`${w.icon} ${w.label} (${He(w.state)})`:"Still building foundations — every session counts!",f=e.domainsAtRisk[0]||e.needsPractice[0]||null,R=f?`${f.icon} ${f.label} needs attention`:null,g=e.progressionDecision,C=g&&g.decision!=="no-data"?g.label:null;let S,M;f?(S=`Practise ${f.icon} ${f.label} this week`,M=(g==null?void 0:g.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(S=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,M="Reviewing words at the right time is how long-term memory forms."):(S="Keep the daily habit going — all areas are in good shape",M="Consistency is the most powerful factor in language learning.");const x=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:l,weekWords:p,weekXp:d,streak:t,domainCounts:h,overallSignal:e.overallSignal,signalLabel:b.label,signalEmoji:b.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:k,mainConcern:R,advancementNote:C,weeklyPriority:S,whyPriority:M,reviewsDue:e.reviewsDue,reviewNote:x}}function Xe(){const e=v.get("wordStats")||{},s=[];for(const t of N){const a=e[t.id];if(!a||a.attempts<6)continue;const r=a.correct/a.attempts;r<.4&&s.push({word:t.word,group:t.group,attempts:a.attempts,accuracy:Math.round(r*100)})}return s.sort((t,a)=>t.accuracy-a.accuracy),s.slice(0,6)}const he=Ae.map(e=>({phase:e.phase,label:`Phase ${e.phase}`,title:e.title,icon:e.icon,desc:e.description})),Ze=[{id:"sentenceSkills",label:"Sentence Forge",icon:"🔨",desc:"Build and arrange sentences"},{id:"grammarCloze",label:"Cloze Castle",icon:"🏰",desc:"Grammar in context"},{id:"vocabCloze",label:"Word Vault",icon:"🔑",desc:"Vocabulary in context"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",desc:"Spot and fix errors"},{id:"writingQuest",label:"Writing Quest",icon:"📝",desc:"Extended writing tasks"}];function et(e){const s=v.get("groupMastery")||{};return typeof s[e]=="number"?s[e]:null}function ye(e){const s=re.filter(i=>i.phase===e);if(!s.length)return{status:"locked",pct:0,masteredCount:0,total:0};let t=0,a=0;for(const i of s){const d=et(i.group);d!==null&&(d>=.8?t++:d>0&&a++)}const r=s.length,n=Math.round(t/r*100);let c;return t===r?c="complete":t>0||a>0?c="in-progress":c="locked",{status:c,pct:n,masteredCount:t,total:r}}function tt(){for(let e=he.length;e>=1;e--){const{status:s}=ye(e);if(s==="in-progress"||s==="complete")return e}return 1}function st(e){const t=F().find(n=>n.id===e);if(!t||t.composite===null)return{status:"not-started",pct:0};const a=Math.round((t.composite??0)*100);return{status:a>=80?"strong":a>=50?"building":a>0?"starting":"not-started",pct:a}}function at(e,{onClose:s}={}){var m,p;if(!e)return;const t=T(),a=(t==null?void 0:t.schoolLevel)==="primary",r=tt(),n=(t==null?void 0:t.avatar)||"🦁",c=((m=t==null?void 0:t.name)==null?void 0:m.split(" ")[0])||"Learner",i=he.map(o=>{const{status:u,pct:l,masteredCount:h,total:y}=ye(o.phase),b=o.phase===r&&u!=="complete",w={complete:"Complete ✅","in-progress":"In progress",locked:"Not started yet"}[u]||"";return`
      <div class="cm-phase ${`cm-phase--${u}`} ${b?"cm-phase--current":""}"
           aria-label="${o.title}${b?" – current stage":""}">
        ${b?`<div class="cm-you-are-here">${n} You are here!</div>`:""}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${o.icon}</span>
          <div>
            <span class="cm-phase-label">${o.label}</span>
            <span class="cm-phase-title">${o.title}</span>
          </div>
          <span class="cm-phase-badge">${u==="complete"?"✅":u==="in-progress"?`${l}%`:"🔒"}</span>
        </div>
        <p class="cm-phase-desc">${o.desc}</p>
        ${u!=="locked"?`
          <div class="cm-phase-bar-track" aria-label="${l}% complete">
            <div class="cm-phase-bar-fill" style="width:${l}%"></div>
          </div>
          <span class="cm-phase-meta">${h} / ${y} groups · ${w}</span>
        `:`<span class="cm-phase-meta cm-phase-meta--locked">${w}</span>`}
      </div>`}).join(""),d=Ze.map(o=>{const{status:u,pct:l}=st(o.id),h=`cm-domain--${u}`,y={strong:"Strong ✅",building:"Building",starting:"Just started","not-started":"Not started yet"}[u]||"";return`
      <div class="cm-domain ${h}" aria-label="${o.label}: ${y}">
        <div class="cm-domain-header">
          <span class="cm-domain-icon">${o.icon}</span>
          <span class="cm-domain-label">${o.label}</span>
          <span class="cm-domain-pct">${u!=="not-started"?`${l}%`:"—"}</span>
        </div>
        <p class="cm-domain-desc">${o.desc}</p>
        ${u!=="not-started"?`
          <div class="cm-phase-bar-track">
            <div class="cm-phase-bar-fill" style="width:${l}%"></div>
          </div>`:""}
      </div>`}).join("");e.innerHTML=`
    <div class="cm-wrapper" role="dialog" aria-label="${c}'s learning journey">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${n}</span>
          <div>
            <h2 class="cm-title">${c}'s Learning Journey</h2>
            <p class="cm-subtitle">Track progress from phonics foundations to primary English</p>
          </div>
        </div>
        ${s?'<button class="btn btn--ghost btn--sm cm-close" id="cm-close-btn" aria-label="Close map">✕</button>':""}
      </div>

      <div class="cm-section">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">🔤</span>
          Phonics Foundations
        </h3>
        <p class="cm-section-desc">Master letter sounds before moving to reading and writing.</p>
        <div class="cm-phase-grid">
          ${i}
        </div>
      </div>

      <div class="cm-connector" aria-hidden="true">
        <div class="cm-connector-line"></div>
        <span class="cm-connector-label">→ Phonics mastery unlocks Primary English</span>
      </div>

      <div class="cm-section ${a?"":"cm-section--future"}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span>
          Primary English Skills
          ${a?"":'<span class="cm-section-tag">Unlocks with phonics mastery</span>'}
        </h3>
        <p class="cm-section-desc">Reading, grammar, vocabulary, and writing in authentic contexts.</p>
        <div class="cm-domain-grid">
          ${d}
        </div>
      </div>
    </div>`,(p=document.getElementById("cm-close-btn"))==null||p.addEventListener("click",()=>s==null?void 0:s())}const ve={connectorClue:"LO-ENG-GR-03",contextInference:"LO-ENG-VOC-02",synonymContrast:"LO-ENG-VOC-03",definitionMatch:"LO-ENG-VOC-01",idiomaticExpressions:"LO-ENG-VOC-05",proverbsSayings:"LO-ENG-VOC-06",scienceTechTerms:"LO-ENG-VOC-07",socialStudiesVocab:"LO-ENG-VOC-08",pronouns:"LO-ENG-GR-04",svAgreement:"LO-ENG-GR-05",conditionals:"LO-ENG-GR-08",passiveVoice:"LO-ENG-GR-09",reportedSpeech:"LO-ENG-GR-10",relativeClauses:"LO-ENG-GR-11",tenses:"LO-ENG-GR-06",modals:"LO-ENG-GR-07",morphologicalAffix:"LO-ENG-VOC-04",collocationCloze:"LO-ENG-VOC-09",grammaticalRole:"LO-ENG-VOC-10"},nt={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function J(e){const s=nt[e.key]||1,t=e.attempts===0?.1:0;return(1-(e.accuracy||0))*s+t}const fe="https://www.moe.gov.sg/primary/curriculum/syllabus";function be(e,s){return s>0?e/s:0}function we(e,s){const t=v.get("questAttempts")||[];return s.map(a=>{const r=t.filter(i=>i.quest===e&&i.skill===a),n=r.length,c=r.filter(i=>i.correct).length;return{key:a,attempts:n,correct:c,accuracy:be(c,n)}})}function $e(){var r;const e=Object.keys(j),s=we("wordVault",e),t=((r=v.get("clueStats"))==null?void 0:r.wordVault)||{attempted:0,strong:0,partial:0},a=t.attempted>0?((t.strong||0)+(t.partial||0))/t.attempted:0;return s.map(n=>{var c,i;return{...n,label:((c=j[n.key])==null?void 0:c.label)||n.key,tooltip:((i=j[n.key])==null?void 0:i.desc)||"Vocabulary development category",loCode:ve[n.key]||"LO-ENG-VOC",clueSuccess:a,syllabusLink:fe}})}function ke(){var r;const e=Object.keys(G),s=we("clozeCastle",e),t=((r=v.get("clueStats"))==null?void 0:r.clozeCastle)||{attempted:0,strong:0,partial:0},a=t.attempted>0?((t.strong||0)+(t.partial||0))/t.attempted:0;return s.map(n=>{var c,i;return{...n,label:((c=G[n.key])==null?void 0:c.label)||n.key,tooltip:`${((i=G[n.key])==null?void 0:i.label)||n.key} mastery`,loCode:ve[n.key]||"LO-ENG-GR",clueSuccess:a,syllabusLink:fe}})}function Se(){const e=$e().map(t=>({...t,priorityScore:J(t)})).sort((t,a)=>a.priorityScore-t.priorityScore).slice(0,3),s=ke().map(t=>({...t,priorityScore:J(t)})).sort((t,a)=>a.priorityScore-t.priorityScore).slice(0,3);return{vocab:e,grammar:s}}function Ce({days:e=7}={}){const s=v.get("learningEvents")||[],t=Date.now()-e*24*60*60*1e3,r=s.filter(m=>{const p=Date.parse(m.timestamp||"");return Number.isFinite(p)&&p>=t}).filter(m=>m.eventType==="quest_attempt"),n=r.filter(m=>typeof m.responseMs=="number"),c=r.filter(m=>m.correct===!0).length,i=n.length?Math.round(n.reduce((m,p)=>m+p.responseMs,0)/n.length):null,d=["sentenceForge","clozeCastle","wordVault"].map(m=>{const p=r.filter(l=>l.quest===m),o=p.length,u=p.filter(l=>l.correct===!0).length;return{quest:m,attempts:o,accuracy:o>0?u/o:0}});return{days:e,attempts:r.length,correct:c,accuracy:r.length?c/r.length:0,avgResponseMs:i,byQuest:d}}function rt({limit:e=6}={}){const{vocab:s,grammar:t}=Se(),a=Ce({days:7}),r=[];for(const i of s)r.push({quest:"wordVault",skill:i.key,label:i.label,loCode:i.loCode,reason:`Low mastery (${Math.round(i.accuracy*100)}%) in ${i.label}`,targetAccuracy:.85});for(const i of t)r.push({quest:"clozeCastle",skill:i.key,label:i.label,loCode:i.loCode,reason:`MOE-priority grammar focus: ${i.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&r.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",loCode:"LO-ENG-FLUENCY",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const n=new Set,c=[];for(const i of r){const d=`${i.quest}:${i.skill}`;if(!n.has(d)&&(n.add(d),c.push(i),c.length>=e))break}return c}function ot(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(t=>{const a=e.filter(i=>i.quest===t).slice(0,12),r=a.length,n=a.filter(i=>i.correct).length,c=be(n,r);return{quest:t,total:r,correct:n,accuracy:c}})}const X={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},W=Object.freeze({red:55,amber:75}),Z=Object.freeze({green:"🟢 Exam-ready",amber:"🟡 Watch list",red:"🔴 Needs attention"});function Le(e){return e==null||Number.isNaN(e)?"green":e<W.red?"red":e<W.amber?"amber":"green"}function ct(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"green",label:Z.green,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const s=e.map(n=>({label:n.label,pct:n.pct,band:Le(n.pct)})),t={red:3,amber:2,green:1},a=s.reduce((n,c)=>t[c.band]>t[n]?c.band:n,"green");let r;if(a==="red"){const n=s.filter(c=>c.band==="red").map(c=>c.label);r=`${ee(n)} below ${W.red}% — focused practice this week will lift exam scores.`}else if(a==="amber"){const n=s.filter(c=>c.band==="amber").map(c=>c.label);r=`${ee(n)} under ${W.amber}% — solid practice will close the gap before the next paper.`}else r="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:Z[a],summary:r,skills:s}}function ee(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function it(e){const s=(e==null?void 0:e.profile)||null,t=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],r=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],n=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},c=t.slice(0,3).map(y=>({label:y.label,pct:Math.round((y.score||0)*100),domain:y.domain||"grammar"})),i=a.slice(0,3).map(y=>({label:y.label,pct:Math.round((y.score||0)*100)})),d=ct(c),m=lt(c[0],s),p=dt({topWeak:c,topStrong:i,weekly:n,profile:s}),o=r.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40),mode:y.mode||"",when:y.when||""})),u=c.map(y=>({...y,band:Le(y.pct)})),l=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40)})).filter(y=>y.word):[],h=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40)})).filter(y=>y.word):[];return{learnerName:(s==null?void 0:s.name)||"Your child",grade:(s==null?void 0:s.primaryGrade)||null,avatar:(s==null?void 0:s.avatar)||"🧒",weekly:n,strengths:i.length?i:[{label:"Steady effort",pct:null}],needsPractice:u,recentMistakes:o,recommendation:m,examRisk:d,teacherComment:p,graduatingSoon:l,slippingRecently:h}}function lt(e,s){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const t=X[e.domain]||X.grammar,a=s!=null&&s.primaryGrade?` (${s.primaryGrade})`:"";return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — currently ${e.pct}%. Aim for 8 of 10 correct before bed.`,target:t.target,targetLabel:t.label}}function dt({topWeak:e,topStrong:s,weekly:t,profile:a}){const r=(a==null?void 0:a.name)||"Your child",n=t.days>=5?`${r} has been wonderfully consistent this week (${t.days} active days).`:t.days>=2?`${r} practised on ${t.days} days this week — a solid rhythm.`:`${r} hasn't practised much this week. Two short sessions will keep skills warm.`,c=s[0]?` They are strongest in ${s[0].label}${s[0].pct?` (${s[0].pct}%)`:""}.`:"",i=e[0]?` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%.`:" No clear weak spots — well done!";return`${n}${c}${i} Encourage them to read aloud short passages every day to keep building fluency.`}function ut(e){var t,a,r,n,c,i;if(!e)return"";const s=[];return s.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),s.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(t=e.strengths)==null?void 0:t[0])!=null&&a.pct?s.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):s.push("✅ Strength: Steady effort"),(r=e.needsPractice)!=null&&r[0]&&s.push(`🎯 Needs practice: ${e.needsPractice[0].label} (${e.needsPractice[0].pct}%)`),e.examRisk&&s.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(n=e.recentMistakes)!=null&&n.length&&s.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(d=>d.word).join(", ")}`),(c=e.graduatingSoon)!=null&&c.length&&s.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(d=>d.word).join(", ")}`),(i=e.slippingRecently)!=null&&i.length&&s.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(d=>d.word).join(", ")} — a 2-min review tonight will help.`),s.push(`👉 Today's 10 min: ${e.recommendation.title}`),s.push(`💬 Teacher's note: ${e.teacherComment}`),s.join(`
`)}ne.register(...Ee);let O=null,D=null;function jt(e,s={}){D=s.onNavigate||null;const t=I.getOverallStats();e.innerHTML=`
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

    <div id="dash-reporting-section"></div>
    <div id="dash-moe-section"></div>

    <!-- Summary Stats (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Progress Summary</h3>
    <div class="dash-stats-grid">
      <div class="dash-stat-card">
        <span class="dash-stat-value">${t.wordsAttempted}</span>
        <span class="dash-stat-label">Words practiced</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${t.wordsMastered}</span>
        <span class="dash-stat-label">Words mastered</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${Math.round(t.overallAccuracy*100)}%</span>
        <span class="dash-stat-label">Accuracy</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${t.bestStreak}</span>
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
  `,mt(),ht(),ft(),$t(),kt(),bt(),wt(),St(),yt(),vt(),pt(),Ct(t),Lt(t),Rt(t),xt(t),Mt(),At(),Et()}function pt(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning Journey Map</h3><div id="dash-cm-inner"></div>';const s=document.getElementById("dash-cm-inner");s&&at(s)}function mt(){var w,k,f,R;const e=document.getElementById("dash-parent-report-card");if(!e)return;const s=T(),t=I.getOverallStats(),a=ge(),r=Oe(),n=v.get("questMastery")||{},c=[];for(const[,g]of Object.entries(n))if(!(!g||typeof g!="object"))for(const[C,S]of Object.entries(g)){if(typeof S!="number")continue;const M=c.find(x=>x.skill===C);M?S>M.score&&(M.score=S):c.push({skill:C,score:S})}const i=c.filter(g=>g.score>=.75).sort((g,C)=>C.score-g.score).map(g=>({skill:g.skill,label:gt(g.skill),score:g.score})),d=(t.recentHistory||[]).filter(g=>g&&g.correct===!1).slice(0,5).map(g=>({word:g.wordId,mode:g.mode,when:xe(g.timestamp),correct:!1})),m={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(t.totalAttempts||0),accuracy:t.overallAccuracy||0},p=v.get("wordStats")||{},o=_e(p,N).map(g=>({word:g.item.word||g.id})),u=Pe(p,N).map(g=>({word:g.item.word||g.id})),l=it({profile:s,weakSkills:r,strengths:i,recentMistakes:d,weekly:m,graduatingSoon:o,slippingRecently:u});e.innerHTML=`
    <section class="parent-report-card" aria-label="Parent report card" role="region">
      <header class="parent-report-card__head">
        <span class="parent-report-card__avatar" aria-hidden="true">${l.avatar}</span>
        <div>
          <h3 class="parent-report-card__title">📋 Report Card · ${$(l.learnerName)}${l.grade?` <small>(${l.grade})</small>`:""}</h3>
          <p class="parent-report-card__sub">Parent-friendly snapshot · this week ${l.weekly.days} day${l.weekly.days===1?"":"s"}, ${l.weekly.words} questions, ${Math.round(l.weekly.accuracy*100)}% accurate</p>
        </div>
        ${l.examRisk?`
          <div class="exam-risk exam-risk--${l.examRisk.band}" role="status" aria-label="Exam focus: ${$(l.examRisk.label)}">
            <span class="exam-risk__label">${$(l.examRisk.label)}</span>
            <span class="exam-risk__summary">${$(l.examRisk.summary)}</span>
          </div>`:""}
      </header>
      <div class="parent-report-card__grid">
        <div class="parent-report-card__cell">
          <h4>✅ Strengths</h4>
          <ul>
            ${l.strengths.map(g=>`<li>${$(g.label)}${g.pct?` <strong>(${g.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${l.needsPractice.map(g=>`<li class="needs-practice-item needs-practice-item--${g.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${$(g.label)} <strong>(${g.pct}%)</strong></li>`).join("")||"<li>No major gaps detected</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${l.recentMistakes.map(g=>`<li>${$(g.word)}${g.mode?` <small>· ${$(g.mode)}</small>`:""}${g.when?` <small>· ${$(g.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${(w=l.graduatingSoon)!=null&&w.length||(k=l.slippingRecently)!=null&&k.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(f=l.graduatingSoon)!=null&&f.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${l.graduatingSoon.slice(0,5).map(g=>$(g.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(R=l.slippingRecently)!=null&&R.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${l.slippingRecently.slice(0,5).map(g=>$(g.word)).join(", ")} — a 2-min review tonight will help.</p>
          `:""}
        </div>`:""}
        <div class="parent-report-card__cell parent-report-card__cell--cta">
          <h4>⏱️ Recommended 10-minute practice</h4>
          <p><strong>${$(l.recommendation.title)}</strong></p>
          <p class="parent-report-card__detail">${$(l.recommendation.detail)}</p>
          <button class="btn btn--primary btn--sm" id="parent-report-cta" data-target="${l.recommendation.target}">${$(l.recommendation.targetLabel)} →</button>
        </div>
      </div>
      <div class="parent-report-card__teacher">
        <h4>💬 Teacher's note</h4>
        <p>${$(l.teacherComment)}</p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;const h=e.querySelector("#parent-report-cta");h==null||h.addEventListener("click",()=>{const g=h.dataset.target;D&&g&&D({target:g})});const y=e.querySelector("#copy-parent-update"),b=e.querySelector("#parent-update-hint");y==null||y.addEventListener("click",async()=>{var S,M;const g=ut(l);let C=!1;try{(S=navigator.clipboard)!=null&&S.writeText&&(await navigator.clipboard.writeText(g),C=!0)}catch{}if(!C){const x=document.createElement("textarea");x.value=g,x.setAttribute("aria-label","Parent update message"),x.className="parent-report-card__fallback",x.readOnly=!0,(M=y.parentElement)==null||M.appendChild(x),x.focus(),x.select()}b&&(b.textContent=C?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function gt(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,s=>s.toUpperCase())}function $(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ht(){const e=document.getElementById("dash-coaching-card");if(!e)return;const s=ge(),t={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[s.overallSignal]||"coaching-card--grey",a=s.advancementNote?`<div class="coaching-advancement">${s.advancementNote}</div>`:"",r=s.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${s.domainsAtRisk.map(p=>`<span class="coaching-domain-chip coaching-chip--red">${p.icon} ${p.label}</span>`).join("")}
       </div>`:"",n=`
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${s.mainStrength}</span>
    </div>`,c=s.mainConcern?`<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${s.mainConcern}</span>
       </div>`:"",i=`
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${s.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${s.whyPriority}</p>
    </div>`,d=s.weekXp>0?`<div class="coaching-stat">
        <span class="coaching-stat-value">+${s.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`:"",m=s.reviewsDue>0?`<div class="coaching-review">
        <span class="coaching-review-icon">🔁</span>
        <span class="coaching-review-text">${s.reviewNote}</span>
       </div>`:"";e.innerHTML=`
    <div class="coaching-card ${t}" aria-label="Parent coaching summary">
      <div class="coaching-card-header">
        <span class="coaching-signal-badge">${s.signalEmoji} ${s.signalLabel}</span>
        <span class="coaching-card-title">This Week's Coaching Report</span>
      </div>

      <div class="coaching-stats-row">
        <div class="coaching-stat">
          <span class="coaching-stat-value">${s.weekDays}</span>
          <span class="coaching-stat-label">days active</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${s.weekWords}</span>
          <span class="coaching-stat-label">words practised</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${s.streak}</span>
          <span class="coaching-stat-label">day streak</span>
        </div>
        ${d}
      </div>

      ${a}
      ${n}
      ${c}
      ${r}
      ${i}
      ${m}
    </div>`}function yt(){const e=document.getElementById("dash-reporting-section");if(!e)return;const s=$e().sort((p,o)=>p.accuracy-o.accuracy).slice(0,8),t=ke().sort((p,o)=>p.accuracy-o.accuracy).slice(0,8),a=ot(),r=Se(),n=Ce({days:7}),c=rt({limit:6}),i=p=>p.map(o=>{const u=Math.round((o.accuracy||0)*100),l=Math.round((o.clueSuccess||0)*100);return`<div class="dash-category-row" title="${o.tooltip}">
      <div class="dash-category-head">
        <span><strong>${o.label}</strong> <small>(${o.loCode})</small></span>
        <span>${u}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${u}%"></div></div>
      <div class="dash-category-meta">Attempts: ${o.attempts} · Clue success: ${l}% · <a href="${o.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`}).join(""),d=(p,o)=>`
    <div class="dash-pattern-item">
      <strong>${p}</strong>
      ${o.map(u=>`<div class="dash-category-row" title="${u.tooltip}">
        <div class="dash-category-head">
          <span><strong>${u.label}</strong> <small>(${u.loCode})</small></span>
          <span>${Math.round((u.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((u.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${u.priorityScore.toFixed(2)} · <a href="${u.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join("")}
    </div>`,m=a.map(p=>{const o=Math.round((p.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${p.quest}</strong><br>${p.correct}/${p.total} · ${o}%</div>`}).join("");e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Quest Category Reporting</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${i(s)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${i(t)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${m}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((n.accuracy||0)*100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${n.attempts} · Correct: ${n.correct} · Avg response: ${n.avgResponseMs!==null?`${n.avgResponseMs}ms`:"N/A"}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">MOE Priority Recommendations</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${d("Priority vocabulary revision",r.vocab)}
      ${d("Priority grammar revision",r.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Adaptive Next Lesson Queue</h4>
    <ul class="dash-pattern-list">
      ${c.map(p=>`<li class="dash-pattern-item"><strong>${p.quest}</strong> · ${p.label} <small>(${p.loCode})</small><br>${p.reason}</li>`).join("")}
    </ul>
  `}function vt(){const e=document.getElementById("dash-moe-section");if(!e)return;const s=Je();e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">MOE Learning Outcome Mapping</h3>
    <ul class="dash-pattern-list">
      ${s.map(t=>`<li class="dash-pattern-item"><strong>${t.code}</strong> · ${t.focus}</li>`).join("")}
    </ul>`}function ft(){const e=document.getElementById("dash-learner-summary");if(!e)return;const s=le(),t=v.get("speechLocale")||"en-SG";e.innerHTML=`
    <div class="dash-learner-summary">
      <div class="dash-learner-avatar">${s.profileAvatar}</div>
      <div class="dash-learner-info">
        <div class="dash-learner-name">${s.profileName}</div>
        <div class="dash-learner-type-badge">${s.learnerType} Pathway</div>
      </div>
      <div class="dash-learner-stats">
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Strongest area</span>
          <span class="dash-learner-stat-value">${s.strongest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Needs attention</span>
          <span class="dash-learner-stat-value">${s.weakest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Current focus</span>
          <span class="dash-learner-stat-value">${s.currentFocus}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Speech accent</span>
          <span class="dash-learner-stat-value">${t}</span>
        </div>
      </div>
    </div>`}function bt(){const e=document.getElementById("dash-domains-section");if(!e)return;const s=de(),t=s.some(a=>a.score!==null);e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Literacy Domains</h3>
    ${t?"":'<p class="dash-no-data">Play more to see domain scores here.</p>'}
    <div class="dash-domains-grid">
      ${s.map(a=>{const r=a.score!==null?Math.round(a.score*100):null,n=r===null?"#e5e3fa":r>=70?"var(--color-success)":r>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${a.icon}</span>
            <span class="dash-domain-label">${a.label}</span>
            ${r!==null?`
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${r}%;background:${a.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${n}">${r}%</span>`:'<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'}
          </div>`}).join("")}
    </div>`}function wt(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:s,byType:t}=ue();if(!s.length&&!t.length){e.innerHTML=`
      <h3 class="dash-section-title" style="margin-top:24px">Clue Detection</h3>
      <p class="dash-no-data">Complete quests with clue missions to see clue accuracy here.</p>`;return}const a=s.map(n=>{const c=n.clueAccuracy>=.7?"var(--color-success)":n.clueAccuracy>=.45?"var(--color-warning)":"var(--color-error)";return`
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${n.icon} ${n.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${c}">${Math.round(n.clueAccuracy*100)}%</span>
            <span class="dash-clue-metric-sub">(${n.clueAttempted} attempts)</span>
          </div>
          ${n.answerAccuracy!==null?`
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(n.answerAccuracy*100)}%</span>
            </div>`:""}
        </div>
        ${n.interpretation?`<p class="dash-clue-interpretation">${n.interpretation}</p>`:""}
      </div>`}).join(""),r=t.length>0?`
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${t.slice(0,5).map(n=>{const c=Math.round(n.accuracy*100),i=c>=70?"var(--color-success)":c>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${n.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${c}%;background:${i}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${i}">${c}%</span>
          </div>`}).join("")}
    </div>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Clue Detection vs. Answer Accuracy</h3>
    <div class="dash-clue-list">${a}</div>
    ${r}`}function $t(){const e=document.getElementById("dash-actions-section");if(!e)return;const s=pe();e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:0">Recommended Next Steps</h3>
    <div class="dash-rec-actions">
      ${s.map((t,a)=>`
        <div class="dash-rec-action">
          <div class="dash-rec-action-num">${a+1}</div>
          <div class="dash-rec-action-body">
            <div class="dash-rec-action-target">${t.target}</div>
            <div class="dash-rec-action-why">${t.why}</div>
          </div>
          <button class="btn btn--primary btn--sm dash-rec-cta"
                  data-target="${t.ctaTarget}"
                  ${t.ctaGroup?`data-group="${t.ctaGroup}"`:""}>
            ${t.ctaLabel}
          </button>
        </div>`).join("")}
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.target,r=t.dataset.group||null;D==null||D({target:a,group:r})})})}function kt(){const e=document.getElementById("dash-stuck-words");if(!e)return;const s=Xe();if(!s.length)return;const t=s.map(a=>`
    <div class="stuck-word-pill" aria-label="${a.word}: ${a.accuracy}% correct after ${a.attempts} tries">
      <span class="stuck-word-text">${a.word}</span>
      <span class="stuck-word-stat">${a.accuracy}%</span>
    </div>`).join("");e.innerHTML=`
    <div class="stuck-words-card" role="alert" aria-label="Words needing attention">
      <div class="stuck-words-header">
        <span class="stuck-words-icon" aria-hidden="true">🔍</span>
        <div>
          <h3 class="stuck-words-title">Words Needing Extra Attention</h3>
          <p class="stuck-words-subtitle">Your child has attempted these ${s.length} word${s.length!==1?"s":""} many times with low accuracy. App practice alone may not be enough.</p>
        </div>
      </div>
      <div class="stuck-words-list">${t}</div>
      <p class="stuck-words-tip"><strong>Try at home:</strong> Say the word aloud, clap each sound, then blend — e.g. /c/ … /a/ … /t/ → "cat". Pair it with a picture or object they know.</p>
    </div>`}function St(){const e=document.getElementById("dash-patterns-section");if(!e)return;const s=me();s.length&&(e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Recent Learning Patterns</h3>
    <ul class="dash-pattern-list">
      ${s.map(t=>`<li class="dash-pattern-item">💬 ${t}</li>`).join("")}
    </ul>`)}function Ct(e){const s=document.getElementById("chart-mastery");if(!s)return;O&&(O.destroy(),O=null);const t=oe.filter(c=>B[c]),a=t.map(c=>B[c].label),r=t.map(c=>Math.round((e.groupMastery[c]??0)*100)),n=t.map(c=>B[c].color);O=new ne(s,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:r,backgroundColor:n.map(c=>c+"80"),borderColor:n,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:c=>c+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function Lt(e){const s=document.getElementById("mastery-bars");s&&(s.innerHTML=oe.map(t=>{const a=B[t];if(!a)return"";const r=Math.round((e.groupMastery[t]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${r}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${r}%</span>
      </div>`}).join(""))}function Rt(e){const s=document.getElementById("learning-path");if(!s)return;const t=De(Ne());s.innerHTML=re.map(a=>{const r=t.includes(a.id),n=a.groups??(a.group?[a.group]:[]),c=n.map(d=>e.groupMastery[d]??0),i=n.length?Math.round(c.reduce((d,m)=>d+m,0)/n.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${r?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${i}%"></div>
        </div>
        <span class="mastery-bar-pct">${r?i+"%":"🔒"}</span>
      </div>`}).join("")}function xt(e){const s=document.getElementById("word-history-body");if(!s)return;const t=e.recentHistory.slice(0,30).map(a=>{const r=N.find(d=>d.id===a.wordId),n=(r==null?void 0:r.emoji)||"",c=xe(a.timestamp),i=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${n} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${i}</td>
      <td>${c}</td>
    </tr>`});s.innerHTML=t.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function Mt(){const e=document.getElementById("badge-grid");if(!e)return;const s=z.getAll();e.setAttribute("aria-label",`${z.earnedCount} of ${z.totalCount} badges earned`),e.innerHTML=s.map(t=>`
    <div class="badge-card ${t.earned?"badge-card--earned":"badge-card--locked"}"
         title="${t.desc}"
         aria-label="${t.name}${t.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${t.earned?t.emoji:"🔒"}</span>
      <span class="badge-name">${t.name}</span>
    </div>`).join("")}function Et(){var r,n,c,i,d,m,p;(r=document.getElementById("btn-export-csv"))==null||r.addEventListener("click",()=>{const o=I.exportCSV(),u=new Blob([o],{type:"text/csv"}),l=URL.createObjectURL(u),h=document.createElement("a");h.href=l,h.download="phonicsquest-progress.csv",h.click(),URL.revokeObjectURL(l)}),(n=document.getElementById("btn-export-csv-anon"))==null||n.addEventListener("click",()=>{const o=I.exportCSV().split(`
`).map((y,b)=>{if(b===0||!y.trim())return y;const[w,...k]=y.split(",");return[`${w.slice(0,1)}***`,...k].join(",")}).join(`
`),u=new Blob([o],{type:"text/csv"}),l=URL.createObjectURL(u),h=document.createElement("a");h.href=l,h.download="phonicsquest-progress-anonymised.csv",h.click(),URL.revokeObjectURL(l)}),(c=document.getElementById("btn-export-report"))==null||c.addEventListener("click",()=>{const o=Ot(),u=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),l=URL.createObjectURL(u),h=document.createElement("a");h.href=l,h.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,h.click(),URL.revokeObjectURL(l)}),(i=document.getElementById("btn-import-csv"))==null||i.addEventListener("click",()=>{const o=document.getElementById("csv-import-panel");o&&(o.hidden=!o.hidden)}),(d=document.getElementById("csv-browse-btn"))==null||d.addEventListener("click",()=>{var o;(o=document.getElementById("csv-file-input"))==null||o.click()}),(m=document.getElementById("csv-file-input"))==null||m.addEventListener("change",o=>{var l;const u=(l=o.target.files)==null?void 0:l[0];u&&ae(u)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",o=>{o.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",o=>{var l,h;o.preventDefault(),e.classList.remove("dash-import-drop--active");const u=(h=(l=o.dataTransfer)==null?void 0:l.files)==null?void 0:h[0];u&&ae(u)}));const s=document.getElementById("adaptive-weak-weight"),t=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};s&&(s.value=String(a.weakWeight??5),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(s.value)})})),t&&(t.value=String(a.unseenWeight??3),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(t.value)})})),(p=document.getElementById("btn-print-report"))==null||p.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function At(){const e=document.getElementById("print-report-content");if(!e)return;const s=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function t(d){const m=d*100;return m>=70?"#22c55e":m>=40?"#f59e0b":"#ef4444"}function a(d,m,p){var u;const o=[];for(const l of m){const h=Ie.getSkillScore(d,l);if(h===.5)continue;const y=Math.round(h*100),b=t(h),w=((u=p[l])==null?void 0:u.label)||l,k=Math.max(y,4);o.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${k}px;background:${b};"></div>
          <span style="color:${b};font-weight:600;min-width:36px">${y}%</span>
          <span>${$(w)}</span>
        </div>`)}return o.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const r=v.get("xp")??0,n=v.get("streak")??0,c=v.get("dailyGoal")??0,i=(()=>{const d=v.get("dailyHistory")||{},m=Date.now(),p=864e5;let o=0;for(let u=0;u<7;u++){const l=new Date(m-u*p).toISOString().slice(0,10);d[l]&&o++}return o})();e.innerHTML=`
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${$(s)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${r}</span>
          <span><strong>Day streak:</strong> ${n}</span>
          <span><strong>Daily goal:</strong> ${c}</span>
          <span><strong>Days played this week:</strong> ${i}</span>
        </div>
      </div>

      <div class="print-report-section">
        <h3>Grammar Skills</h3>
        ${a("grammarMcq",Te,G)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${a("vocabMcq",je,j)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`}function Ot(){const e=I.getOverallStats(),s=T();return{generatedAt:new Date().toISOString(),learnerSummary:le(),literacyDomains:de(),clueInsights:ue(),recommendedActions:pe(),recentPatternInsights:me(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:s}}}const Re=new Set(["a","e","i","o","u"]),_t=new Set("bcdfghjklmnpqrstvwxyz".split(""));function H(e){const t=e.toLowerCase().split(""),a=t.map(r=>Re.has(r)?"sv":(_t.has(r),"c"));return{graphemes:t,types:a}}function te(e){const s=e.toLowerCase().split("").find(t=>Re.has(t));return s?`short-${s}`:"short-a"}function se(e,s){const t=[],a=[];let r=!1;for(const i of s){if(i==="sv"||i==="lv"){r=!0;continue}r?a.push(i):t.push(i)}const n=t.length,c=a.length;return n<=1&&c<=1?"CVC":n>=2&&c<=1?"blend":n<=1&&c>=2?"CVCC":"CCVCC"}async function ae(e){var m,p;const s=document.getElementById("csv-import-preview"),t=document.getElementById("csv-import-status");if(!s||!t)return;const r=(await e.text()).trim().split(`
`).filter(o=>o.trim());if(!r.length){t.hidden=!1,t.textContent="File is empty.",t.className="dash-import-status dash-import-status--error";return}const n=r[0].trim(),c=n.includes(",");let i=[];const d=new Set(N.map(o=>o.id));if(c){const o=n.toLowerCase().split(",").map(k=>k.trim()),u=o.indexOf("word");if(u<0){t.hidden=!1,t.textContent='CSV must have a "word" column.',t.className="dash-import-status dash-import-status--error";return}const l=o.indexOf("graphemes"),h=o.indexOf("types"),y=o.indexOf("group"),b=o.indexOf("level"),w=o.indexOf("emoji");for(let k=1;k<r.length;k++){const f=r[k].split(",").map(S=>S.trim()),R=f[u];if(!R||d.has(R.toLowerCase()))continue;const g=l>=0&&f[l]?f[l].split(/[|;]/):H(R).graphemes,C=h>=0&&f[h]?f[h].split(/[|;]/):H(R).types;i.push({id:R.toLowerCase(),word:R.toLowerCase(),graphemes:g,types:C,pattern:se(g,C),group:y>=0&&f[y]||te(R),level:b>=0&&parseInt(f[b])||1,emoji:w>=0&&f[w]||""})}}else for(const o of r){const u=o.trim().toLowerCase();if(!u||d.has(u))continue;const{graphemes:l,types:h}=H(u);i.push({id:u,word:u,graphemes:l,types:h,pattern:se(l,h),group:te(u),level:1,emoji:""})}if(!i.length){t.hidden=!1,t.textContent="No new words found (all may already exist).",t.className="dash-import-status dash-import-status--error";return}s.hidden=!1,s.innerHTML=`
    <p><strong>${i.length} new word${i.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${i.slice(0,20).map(o=>`<span class="dash-import-word">${o.emoji?o.emoji+" ":""}${o.word} <small>(${o.group})</small></span>`).join("")}${i.length>20?`<span class="dash-import-word">…and ${i.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${i.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(m=document.getElementById("csv-cancel-import"))==null||m.addEventListener("click",()=>{s.hidden=!0,t.hidden=!0}),(p=document.getElementById("csv-confirm-import"))==null||p.addEventListener("click",()=>{N.push(...i);const o=v.get("customWords")||[];v.set("customWords",[...o,...i]),s.hidden=!0,t.hidden=!1,t.textContent=`Imported ${i.length} word${i.length>1?"s":""} successfully!`,t.className="dash-import-status dash-import-status--success"})}function xe(e){if(!e)return"";const s=Date.now()-new Date(e).getTime(),t=Math.floor(s/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const a=Math.floor(t/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function Gt(){O&&(O.destroy(),O=null)}export{Gt as destroyDashboard,jt as renderDashboard};
