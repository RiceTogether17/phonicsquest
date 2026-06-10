import{C as ne,r as Me}from"./chartjs-BR_H7_9u.js";import{s as v,g as T,n as Q,S as q,V,h as E,W as I,P as Ee,C as re,a as j,G,p as N,b as Oe,c as _e,d as Pe,e as B,f as oe,i as De,j as Ie,k as z,q as Ne,l as Te,m as je}from"./index-8n3AK7vy.js";import"./vocabPassages-CdqyLVim.js";import"./passages-DNXaSraU.js";import"./gsap-C8pce-KX.js";const Ge=[1,3,7,14,30],ce=3,_={MASTERED:.85,ON_TRACK:.7,CONSOLIDATING:.5,BUILDING:.2},Be=[{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",questKey:"sentenceForge"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",questKey:"clozeCastle"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",questKey:"wordVault"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",questKey:"editingQuest"},{id:"writingQuest",label:"Writing Quest",icon:"📝",questKey:"writingQuest"}];function Ve(e){return!e||(e.attempts||0)<ce?0:(e.reviewInterval??0)/(Ge.length-1)}function We(e){const s=(v.get("questMastery")||{})[e]||{},t=Object.values(s).filter(a=>typeof a=="number");return t.length?t.reduce((a,n)=>a+n,0)/t.length:null}function qe(){const e=v.get("groupMastery")||{},s=Object.values(e).filter(t=>typeof t=="number");return s.length?s.reduce((t,a)=>t+a,0)/s.length:null}function ze(){const e=v.get("wordStats")||{},s=Object.values(e).filter(t=>((t==null?void 0:t.attempts)||0)>=ce).map(t=>Ve(t));return s.length?s.reduce((t,a)=>t+a,0)/s.length:0}function F(){const e=ze(),s=qe(),t=s!==null?Math.min(1,s*.8+e*.2):null,a={id:"phonics",label:"Phonics / Decoding",icon:"🔤",raw:s,composite:t,state:U(t),signal:K(t)},n=Be.map(r=>{const i=We(r.questKey),l=i;return{...r,raw:i,composite:l,state:U(l),signal:K(l)}});return[a,...n]}function U(e){return e==null?"no-data":e>=_.MASTERED?"mastered":e>=_.ON_TRACK?"on-track":e>=_.CONSOLIDATING?"consolidating":e>=_.BUILDING?"building":"just-started"}function K(e){return e==null?"no-data":e>=_.ON_TRACK?"on-track":e>=_.CONSOLIDATING?"needs-practice":"at-risk"}function He(e){return{mastered:"Mastered ✅","on-track":"On track",consolidating:"Consolidating",building:"Building","just-started":"Just started","no-data":"No data yet"}[e]||e}function Qe(e){const t=F().find(n=>n.id===e);if(!t||t.composite===null)return{decision:"no-data",label:"Not enough data yet",canAdvance:!1};const a=t.state;return a==="mastered"?{decision:"advance",label:"Ready to advance ✅",canAdvance:!0}:a==="on-track"?{decision:"continue",label:"On track — keep going",canAdvance:!1}:a==="consolidating"?{decision:"consolidate",label:"Consolidate before advancing ⚠️",canAdvance:!1}:{decision:"review",label:"Needs more practice 🔴",canAdvance:!1}}function Fe(){const e=v.get("questAttempts")||[],s=Date.now()-7*24*3600*1e3,t={};for(const a of e)a.timestamp&&new Date(a.timestamp).getTime()>=s&&(t[a.quest]=(t[a.quest]||0)+1);return t}function Ue(){const e=F().filter(c=>c.composite!==null),s=e.filter(c=>c.signal==="at-risk"),t=e.filter(c=>c.signal==="needs-practice"),a=e.filter(c=>c.signal==="on-track"),n=e.filter(c=>c.state==="mastered"),r=s.length>0?"at-risk":t.length>0?"needs-practice":e.length>0?"on-track":"no-data",l=[...e].sort((c,h)=>(c.composite??1)-(h.composite??1))[0],u=l?`${l.icon} ${l.label} (${Math.round((l.composite??0)*100)}%)`:"Keep practising across all areas!",m=v.get("wordStats")||{},p=Date.now();let o=0;for(const c of Object.values(m))if(c!=null&&c.nextReviewDate){const h=new Date(c.nextReviewDate).getTime();!isNaN(h)&&p>=h&&o++}const d=l?Qe(l.id):null;return{overallSignal:r,domainsAtRisk:s,needsPractice:t,strongDomains:a,masteredDomains:n,nextFocus:u,reviewsDue:o,progressionDecision:d,weakestDomain:l||null,domains:e}}function M(e){const s=(v.get("questMastery")||{})[e]||{},t=Object.values(s).filter(a=>typeof a=="number");return t.length?t.reduce((a,n)=>a+n,0)/t.length:null}function P(e){const t=(v.get("clueStats")||{})[e];if(!t)return null;if(e==="sentenceForge"){const n=(t.correct||0)+(t.incorrect||0);return n>0?{accuracy:t.correct/n,attempted:n}:null}const a=t.attempted||0;return a?{accuracy:((t.strong||0)+(t.partial||0)*.5)/a,attempted:a,strong:t.strong||0,partial:t.partial||0,weak:t.weak||0}:null}function Y(e){const s=(v.get("questMastery")||{})[e]||{};if(!Object.keys(s).length)return null;let t=null,a=1/0;for(const[n,r]of Object.entries(s))r<a&&(a=r,t=n);return t?{skill:t,score:a}:null}function ie(){const e=Q(v.get("groupMastery")||{});let s=null,t=1/0;for(const a of q){const n=e[a];typeof n=="number"&&n<t&&(t=n,s=a)}return s}function Ke(e,s=10){const t=(v.get("questAttempts")||[]).filter(a=>a.quest===e).slice(0,s);return t.length<3?null:t.filter(a=>a.correct).length/t.length}function Ye(e,s){return e===null?null:e>=.7&&s!==null&&s>=.7?"Finding clues and answering correctly":e>=.7&&s!==null&&s<.55?"Finds clue but chooses wrong answer":e<.5&&s!==null&&s<.5?"Misses clue and answer — needs focused practice":e<.5&&s!==null&&s>=.65?"Answering correctly but clue work still weak":e>=.5&&e<.7?"Developing clue detection skills":"Building understanding"}function le(){var o,d;const e=T(),s=Q(v.get("groupMastery")||{}),t=(e==null?void 0:e.schoolLevel)==="primary"?"Primary":"Preschool",a=q.map(c=>({label:V[c],score:s[c]??null})).filter(c=>c.score!==null),n=[...a].sort((c,h)=>h.score-c.score),r=n[0],i=n[n.length-1],l=[{name:"Grammar Cloze",score:M("clozeCastle")},{name:"Sentence Skills",score:M("sentenceForge")},{name:"Vocabulary Cloze",score:M("wordVault")}].filter(c=>c.score!==null).sort((c,h)=>h.score-c.score),u=((o=l[0])==null?void 0:o.name)||(r?`Phonics (${r.label})`:"Not enough data yet"),m=((d=l[l.length-1])==null?void 0:d.name)||(i?`Phonics (${i.label})`:"Not enough data yet");let p="Building foundations";if((e==null?void 0:e.schoolLevel)==="primary"){const c=M("sentenceForge"),h=M("clozeCastle"),y=M("wordVault");c!==null&&c<.6?p="Sentence structure skills":h!==null&&h<.6?p="Grammar cloze passages":y!==null&&y<.6?p="Vocabulary in context":p="Advanced sentence and grammar skills"}else{const c=ie();c&&(s[c]??0)<.6?p=`Short vowel sounds (${V[c]||c})`:a.length?p="Phonics blending and awareness":p="Starting phonics journey"}return{learnerType:t,profileName:(e==null?void 0:e.name)||"Learner",profileAvatar:(e==null?void 0:e.avatar)||"🦉",strongest:u,weakest:m,currentFocus:p}}function de(){const e=Q(v.get("groupMastery")||{});v.get("clueStats");const s=q.map(u=>e[u]).filter(u=>typeof u=="number"),t=s.length?s.reduce((u,m)=>u+m,0)/s.length:null,a=[],n=P("clozeCastle");n&&a.push(n.accuracy);const r=P("sentenceForge");r&&a.push(r.accuracy);const i=P("wordVault");i&&a.push(i.accuracy);const l=a.length?a.reduce((u,m)=>u+m,0)/a.length:null;return[{id:"phonics",label:"Phonics / Decoding",icon:"🔤",score:t,color:"#3b82f6"},{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",score:M("sentenceForge"),color:"#f97316"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",score:M("clozeCastle"),color:"#a855f7"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",score:M("wordVault"),color:"#0d9488"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",score:M("editingQuest"),color:"#0ea5e9"},{id:"writingQuest",label:"Writing Quest",icon:"📝",score:M("writingQuest"),color:"#7c3aed"},{id:"clueDetection",label:"Clue Detection",icon:"🔍",score:l,color:"#f59e0b"}]}function ue(){const e=v.get("clueStats")||{},s=v.get("questAttempts")||[],t=[],a=[{key:"clozeCastle",label:"Cloze Castle",icon:"🏰"},{key:"wordVault",label:"Word Vault",icon:"🔑"},{key:"sentenceForge",label:"Sentence Forge",icon:"🔨"},{key:"editingQuest",label:"Editing Quest",icon:"✏️"},{key:"writingQuest",label:"Writing Quest",icon:"📝"}];for(const{key:r,label:i,icon:l}of a){const u=P(r);if(!u)continue;const m=s.filter(o=>o.quest===r),p=m.length>=3?m.filter(o=>o.correct).length/m.length:null;t.push({quest:i,icon:l,clueAttempted:u.attempted,clueAccuracy:u.accuracy,answerAccuracy:p,interpretation:Ye(u.accuracy,p)})}const n=Object.entries(e.byType||{}).filter(([,r])=>r.attempted>=3).map(([r,i])=>({type:E(r),accuracy:((i.strong||0)+(i.partial||0)*.5)/i.attempted,attempted:i.attempted})).sort((r,i)=>r.accuracy-i.accuracy);return{questInsights:t,byType:n}}function Je(){return[{code:"LO 3.1",focus:"Decode and blend multi-syllabic words",target:"blend"},{code:"LO 4.2",focus:"Use grammar in context and editing",target:"cloze-castle"},{code:"LO 5.2",focus:"Synthesis and sentence transformation",target:"sentence-forge"}]}function pe(){const e=T(),s=(e==null?void 0:e.schoolLevel)==="primary",t=v.get("groupMastery")||{},a=[];if(s){const n=P("clozeCastle");if(n&&n.accuracy<.6){const u=Y("clozeCastle"),m=Math.round(n.accuracy*100);a.push({why:`Grammar clue accuracy is ${m}%.${u?` Weakest area: ${E(u.skill)}.`:""}`,target:`Cloze Castle${u?` – ${E(u.skill)}`:""}`,ctaLabel:"Practise Cloze Castle",ctaTarget:"cloze-castle"})}const r=Y("sentenceForge"),i=Ke("sentenceForge");(i!==null&&i<.65||r&&r.score<.55)&&a.push({why:r?`Sentence skill "${E(r.skill)}" scores ${Math.round(r.score*100)}% — needs practice.`:"Recent sentence building accuracy is below target.",target:`Sentence Forge${r?` – ${E(r.skill)}`:""}`,ctaLabel:"Try Sentence Forge",ctaTarget:"sentence-forge"});const l=P("wordVault");l&&l.accuracy<.6&&a.push({why:`Vocabulary context clue accuracy is ${Math.round(l.accuracy*100)}%.`,target:"Word Vault – Context Clues",ctaLabel:"Practise Word Vault",ctaTarget:"word-vault"}),a.length||a.push({why:"Keep grammar skills sharp with regular practice.",target:"Cloze Castle",ctaLabel:"Open Cloze Castle",ctaTarget:"cloze-castle"},{why:"Consistent sentence structure practice builds academic writing.",target:"Sentence Forge",ctaLabel:"Open Sentence Forge",ctaTarget:"sentence-forge"})}else{const n=ie(),r=n?t[n]??0:null;if(n&&r<.65){const u=Math.round(r*100);a.push({why:`${V[n]} decoding accuracy is ${u}% — below the 65% target.`,target:`Phonics – ${V[n]}`,ctaLabel:"Practise Blend It!",ctaTarget:"blend",ctaGroup:n})}const i=q.map(u=>t[u]??0);i.reduce((u,m)=>u+m,0)/i.length>=.6&&a.push({why:"Phonics foundation is building well. Sight words extend reading fluency.",target:"Sight Words",ctaLabel:"Try Sight Words",ctaTarget:"sight-words"}),a.push({why:"Reading decodable stories reinforces all phonics skills in context.",target:"Giri Stories",ctaLabel:"Read a Story",ctaTarget:"stories"})}return a.slice(0,3)}function me(){const e=[],s=v.get("wordHistory")||[],t=v.get("questAttempts")||[],a=v.get("clueStats")||{},n=Date.now(),r=7*24*60*60*1e3,i=s.filter(o=>o.timestamp&&n-new Date(o.timestamp).getTime()<r),l=s.filter(o=>{if(!o.timestamp)return!1;const d=n-new Date(o.timestamp).getTime();return d>=r&&d<2*r});if(i.length>=5&&l.length>=5){const o=i.filter(c=>c.correct).length/i.length,d=l.filter(c=>c.correct).length/l.length;o>d+.1?e.push("Accuracy has improved over the last 7 days"):o<d-.1&&e.push("Accuracy has dipped recently — more practice will help")}const u=a.byType||{},m=Object.entries(u).filter(([,o])=>o.attempted>=3).filter(([,o])=>((o.strong||0)+(o.partial||0)*.5)/o.attempted<.45).map(([o])=>E(o));m.length>0&&e.push(`Struggled with ${m[0]} clues recently`),t.filter(o=>o.quest==="sentenceForge").length<3&&e.push("Not enough data yet in Sentence Forge");const p=Object.entries(u).filter(([,o])=>o.attempted>=3).filter(([,o])=>((o.strong||0)+(o.partial||0)*.5)/o.attempted>=.75).map(([o])=>E(o));return p.length>0&&e.push(`Strong in ${p[0]} passages`),!e.length&&s.length<10&&e.push("Keep playing to see learning pattern insights here"),e.slice(0,4)}function ge(){const e=Ue(),s=v.get("wordHistory")||[],t=v.get("streak")||0,a=Date.now(),n=7*24*3600*1e3,r=a-n,i=new Date(r).toISOString().slice(0,10),u=(v.get("weeklyXpLog")||[]).filter(L=>L.date>=i).reduce((L,Ae)=>L+(Ae.xp||0),0),m=s.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=r),p=new Set(m.map(L=>L.word).filter(Boolean)).size,o=v.get("questAttempts")||[],d=new Set(o.filter(L=>L.timestamp&&new Date(L.timestamp).getTime()>=r).map(L=>new Date(L.timestamp).toDateString()));v.get("lastPlayDate")===new Date().toDateString()&&d.add(new Date().toDateString());const c=d.size,h=Fe(),y={"on-track":{label:"On track",emoji:"✅"},"needs-practice":{label:"Needs practice",emoji:"⚠️"},"at-risk":{label:"Needs attention",emoji:"🔴"},"no-data":{label:"Getting started",emoji:"📊"}},w=y[e.overallSignal]||y["no-data"],$=e.strongDomains[0]||e.masteredDomains[0]||null,k=$?`${$.icon} ${$.label} (${He($.state)})`:"Still building foundations — every session counts!",b=e.domainsAtRisk[0]||e.needsPractice[0]||null,x=b?`${b.icon} ${b.label} needs attention`:null,g=e.progressionDecision,C=g&&g.decision!=="no-data"?g.label:null;let S,A;b?(S=`Practise ${b.icon} ${b.label} this week`,A=(g==null?void 0:g.decision)==="consolidate"?"Securing this area before moving on will build lasting confidence.":"Regular short practice sessions will close the gap quickly."):e.reviewsDue>0?(S=`Complete ${e.reviewsDue} spaced review word${e.reviewsDue>1?"s":""}`,A="Reviewing words at the right time is how long-term memory forms."):(S="Keep the daily habit going — all areas are in good shape",A="Consistency is the most powerful factor in language learning.");const R=e.reviewsDue>0?`${e.reviewsDue} word${e.reviewsDue>1?"s":""} due for review`:"No review words due today";return{weekDays:c,weekWords:p,weekXp:u,streak:t,domainCounts:h,overallSignal:e.overallSignal,signalLabel:w.label,signalEmoji:w.emoji,domainsAtRisk:e.domainsAtRisk,needsPractice:e.needsPractice,mainStrength:k,mainConcern:x,advancementNote:C,weeklyPriority:S,whyPriority:A,reviewsDue:e.reviewsDue,reviewNote:R}}function Xe(){const e=v.get("wordStats")||{},s=[];for(const t of I){const a=e[t.id];if(!a||a.attempts<6)continue;const n=a.correct/a.attempts;n<.4&&s.push({word:t.word,group:t.group,attempts:a.attempts,accuracy:Math.round(n*100)})}return s.sort((t,a)=>t.accuracy-a.accuracy),s.slice(0,6)}const he=Ee.map(e=>({phase:e.phase,label:`Phase ${e.phase}`,title:e.title,icon:e.icon,desc:e.description})),Ze=[{id:"sentenceSkills",label:"Sentence Forge",icon:"🔨",desc:"Build and arrange sentences"},{id:"grammarCloze",label:"Cloze Castle",icon:"🏰",desc:"Grammar in context"},{id:"vocabCloze",label:"Word Vault",icon:"🔑",desc:"Vocabulary in context"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",desc:"Spot and fix errors"},{id:"writingQuest",label:"Writing Quest",icon:"📝",desc:"Extended writing tasks"}];function et(e){const s=v.get("groupMastery")||{};return typeof s[e]=="number"?s[e]:null}function ye(e){const s=re.filter(l=>l.phase===e);if(!s.length)return{status:"locked",pct:0,masteredCount:0,total:0};let t=0,a=0;for(const l of s){const u=et(l.group);u!==null&&(u>=.8?t++:u>0&&a++)}const n=s.length,r=Math.round(t/n*100);let i;return t===n?i="complete":t>0||a>0?i="in-progress":i="locked",{status:i,pct:r,masteredCount:t,total:n}}function tt(){for(let e=he.length;e>=1;e--){const{status:s}=ye(e);if(s==="in-progress"||s==="complete")return e}return 1}function st(e){const t=F().find(r=>r.id===e);if(!t||t.composite===null)return{status:"not-started",pct:0};const a=Math.round((t.composite??0)*100);return{status:a>=80?"strong":a>=50?"building":a>0?"starting":"not-started",pct:a}}function at(e,{onClose:s}={}){var m,p;if(!e)return;const t=T(),a=(t==null?void 0:t.schoolLevel)==="primary",n=tt(),r=(t==null?void 0:t.avatar)||"🦁",i=((m=t==null?void 0:t.name)==null?void 0:m.split(" ")[0])||"Learner",l=he.map(o=>{const{status:d,pct:c,masteredCount:h,total:y}=ye(o.phase),w=o.phase===n&&d!=="complete",$={complete:"Complete ✅","in-progress":"In progress",locked:"Not started yet"}[d]||"";return`
      <div class="cm-phase ${`cm-phase--${d}`} ${w?"cm-phase--current":""}"
           aria-label="${o.title}${w?" – current stage":""}">
        ${w?`<div class="cm-you-are-here">${r} You are here!</div>`:""}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${o.icon}</span>
          <div>
            <span class="cm-phase-label">${o.label}</span>
            <span class="cm-phase-title">${o.title}</span>
          </div>
          <span class="cm-phase-badge">${d==="complete"?"✅":d==="in-progress"?`${c}%`:"🔒"}</span>
        </div>
        <p class="cm-phase-desc">${o.desc}</p>
        ${d!=="locked"?`
          <div class="cm-phase-bar-track" aria-label="${c}% complete">
            <div class="cm-phase-bar-fill" style="width:${c}%"></div>
          </div>
          <span class="cm-phase-meta">${h} / ${y} groups · ${$}</span>
        `:`<span class="cm-phase-meta cm-phase-meta--locked">${$}</span>`}
      </div>`}).join(""),u=Ze.map(o=>{const{status:d,pct:c}=st(o.id),h=`cm-domain--${d}`,y={strong:"Strong ✅",building:"Building",starting:"Just started","not-started":"Not started yet"}[d]||"";return`
      <div class="cm-domain ${h}" aria-label="${o.label}: ${y}">
        <div class="cm-domain-header">
          <span class="cm-domain-icon">${o.icon}</span>
          <span class="cm-domain-label">${o.label}</span>
          <span class="cm-domain-pct">${d!=="not-started"?`${c}%`:"—"}</span>
        </div>
        <p class="cm-domain-desc">${o.desc}</p>
        ${d!=="not-started"?`
          <div class="cm-phase-bar-track">
            <div class="cm-phase-bar-fill" style="width:${c}%"></div>
          </div>`:""}
      </div>`}).join("");e.innerHTML=`
    <div class="cm-wrapper" role="dialog" aria-label="${i}'s learning journey">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${r}</span>
          <div>
            <h2 class="cm-title">${i}'s Learning Journey</h2>
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
          ${l}
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
          ${u}
        </div>
      </div>
    </div>`,(p=document.getElementById("cm-close-btn"))==null||p.addEventListener("click",()=>s==null?void 0:s())}const ve={connectorClue:"LO-ENG-GR-03",contextInference:"LO-ENG-VOC-02",synonymContrast:"LO-ENG-VOC-03",definitionMatch:"LO-ENG-VOC-01",idiomaticExpressions:"LO-ENG-VOC-05",proverbsSayings:"LO-ENG-VOC-06",scienceTechTerms:"LO-ENG-VOC-07",socialStudiesVocab:"LO-ENG-VOC-08",pronouns:"LO-ENG-GR-04",svAgreement:"LO-ENG-GR-05",conditionals:"LO-ENG-GR-08",passiveVoice:"LO-ENG-GR-09",reportedSpeech:"LO-ENG-GR-10",relativeClauses:"LO-ENG-GR-11",tenses:"LO-ENG-GR-06",modals:"LO-ENG-GR-07",morphologicalAffix:"LO-ENG-VOC-04",collocationCloze:"LO-ENG-VOC-09",grammaticalRole:"LO-ENG-VOC-10"},nt={pronouns:1.25,connectorClue:1.2,conditionals:1.2,passiveVoice:1.15,reportedSpeech:1.15,tenses:1.2,modals:1.2,morphologicalAffix:1.15,synonymContrast:1.1,collocationCloze:1.15,scienceTechTerms:1.1,socialStudiesVocab:1.1};function J(e){const s=nt[e.key]||1,t=e.attempts===0?.1:0;return(1-(e.accuracy||0))*s+t}const fe="https://www.moe.gov.sg/primary/curriculum/syllabus";function be(e,s){return s>0?e/s:0}function we(e,s){const t=v.get("questAttempts")||[];return s.map(a=>{const n=t.filter(l=>l.quest===e&&l.skill===a),r=n.length,i=n.filter(l=>l.correct).length;return{key:a,attempts:r,correct:i,accuracy:be(i,r)}})}function $e(){var n;const e=Object.keys(j),s=we("wordVault",e),t=((n=v.get("clueStats"))==null?void 0:n.wordVault)||{attempted:0,strong:0,partial:0},a=t.attempted>0?((t.strong||0)+(t.partial||0))/t.attempted:0;return s.map(r=>{var i,l;return{...r,label:((i=j[r.key])==null?void 0:i.label)||r.key,tooltip:((l=j[r.key])==null?void 0:l.desc)||"Vocabulary development category",loCode:ve[r.key]||"LO-ENG-VOC",clueSuccess:a,syllabusLink:fe}})}function ke(){var n;const e=Object.keys(G),s=we("clozeCastle",e),t=((n=v.get("clueStats"))==null?void 0:n.clozeCastle)||{attempted:0,strong:0,partial:0},a=t.attempted>0?((t.strong||0)+(t.partial||0))/t.attempted:0;return s.map(r=>{var i,l;return{...r,label:((i=G[r.key])==null?void 0:i.label)||r.key,tooltip:`${((l=G[r.key])==null?void 0:l.label)||r.key} mastery`,loCode:ve[r.key]||"LO-ENG-GR",clueSuccess:a,syllabusLink:fe}})}function Se(){const e=$e().map(t=>({...t,priorityScore:J(t)})).sort((t,a)=>a.priorityScore-t.priorityScore).slice(0,3),s=ke().map(t=>({...t,priorityScore:J(t)})).sort((t,a)=>a.priorityScore-t.priorityScore).slice(0,3);return{vocab:e,grammar:s}}function Ce({days:e=7}={}){const s=v.get("learningEvents")||[],t=Date.now()-e*24*60*60*1e3,n=s.filter(m=>{const p=Date.parse(m.timestamp||"");return Number.isFinite(p)&&p>=t}).filter(m=>m.eventType==="quest_attempt"),r=n.filter(m=>typeof m.responseMs=="number"),i=n.filter(m=>m.correct===!0).length,l=r.length?Math.round(r.reduce((m,p)=>m+p.responseMs,0)/r.length):null,u=["sentenceForge","clozeCastle","wordVault"].map(m=>{const p=n.filter(c=>c.quest===m),o=p.length,d=p.filter(c=>c.correct===!0).length;return{quest:m,attempts:o,accuracy:o>0?d/o:0}});return{days:e,attempts:n.length,correct:i,accuracy:n.length?i/n.length:0,avgResponseMs:l,byQuest:u}}function rt({limit:e=6}={}){const{vocab:s,grammar:t}=Se(),a=Ce({days:7}),n=[];for(const l of s)n.push({quest:"wordVault",skill:l.key,label:l.label,loCode:l.loCode,reason:`Low mastery (${Math.round(l.accuracy*100)}%) in ${l.label}`,targetAccuracy:.85});for(const l of t)n.push({quest:"clozeCastle",skill:l.key,label:l.label,loCode:l.loCode,reason:`MOE-priority grammar focus: ${l.label}`,targetAccuracy:.85});a.avgResponseMs!==null&&a.avgResponseMs>3500&&n.unshift({quest:"sentenceForge",skill:"fluency",label:"Sentence fluency sprint",loCode:"LO-ENG-FLUENCY",reason:`Average response time is ${a.avgResponseMs}ms (target < 3000ms).`,targetAccuracy:.8});const r=new Set,i=[];for(const l of n){const u=`${l.quest}:${l.skill}`;if(!r.has(u)&&(r.add(u),i.push(l),i.length>=e))break}return i}function ot(){const e=v.get("questAttempts")||[];return["sentenceForge","clozeCastle","wordVault"].map(t=>{const a=e.filter(l=>l.quest===t).slice(0,12),n=a.length,r=a.filter(l=>l.correct).length,i=be(r,n);return{quest:t,total:n,correct:r,accuracy:i}})}const X={grammar:{target:"grammar-mcq",label:"🧠 Grammar MCQ"},vocabulary:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"},vocab:{target:"vocab-mcq",label:"📖 Vocabulary MCQ"}},W=Object.freeze({red:55,amber:75}),Z=Object.freeze({green:"🟢 Exam-ready",amber:"🟡 Watch list",red:"🔴 Needs attention"});function Le(e){return e==null||Number.isNaN(e)?"green":e<W.red?"red":e<W.amber?"amber":"green"}function ct(e=[]){if(!Array.isArray(e)||e.length===0)return{band:"green",label:Z.green,summary:"No weak skills detected yet — keep practising to build a clearer picture.",skills:[]};const s=e.map(r=>({label:r.label,pct:r.pct,band:Le(r.pct)})),t={red:3,amber:2,green:1},a=s.reduce((r,i)=>t[i.band]>t[r]?i.band:r,"green");let n;if(a==="red"){const r=s.filter(i=>i.band==="red").map(i=>i.label);n=`${ee(r)} below ${W.red}% — focused practice this week will lift exam scores.`}else if(a==="amber"){const r=s.filter(i=>i.band==="amber").map(i=>i.label);n=`${ee(r)} under ${W.amber}% — solid practice will close the gap before the next paper.`}else n="Skills look solid for the next paper — keep the rhythm going.";return{band:a,label:Z[a],summary:n,skills:s}}function ee(e){return e.length===0?"":e.length===1?e[0]:e.length===2?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function it(e){const s=(e==null?void 0:e.profile)||null,t=Array.isArray(e==null?void 0:e.weakSkills)?e.weakSkills:[],a=Array.isArray(e==null?void 0:e.strengths)?e.strengths:[],n=Array.isArray(e==null?void 0:e.recentMistakes)?e.recentMistakes:[],r=(e==null?void 0:e.weekly)||{days:0,words:0,accuracy:0},i=t.slice(0,3).map(y=>({label:y.label,pct:Math.round((y.score||0)*100),domain:y.domain||"grammar"})),l=a.slice(0,3).map(y=>({label:y.label,pct:Math.round((y.score||0)*100)})),u=ct(i),m=lt(i[0],s),p=dt({topWeak:i,topStrong:l,weekly:r,profile:s}),o=n.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40),mode:y.mode||"",when:y.when||""})),d=i.map(y=>({...y,band:Le(y.pct)})),c=Array.isArray(e==null?void 0:e.graduatingSoon)?e.graduatingSoon.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40)})).filter(y=>y.word):[],h=Array.isArray(e==null?void 0:e.slippingRecently)?e.slippingRecently.slice(0,5).map(y=>({word:String(y.word||"").slice(0,40)})).filter(y=>y.word):[];return{learnerName:(s==null?void 0:s.name)||"Your child",grade:(s==null?void 0:s.primaryGrade)||null,avatar:(s==null?void 0:s.avatar)||"🧒",weekly:r,strengths:l.length?l:[{label:"Steady effort",pct:null}],needsPractice:d,recentMistakes:o,recommendation:m,examRisk:u,teacherComment:p,graduatingSoon:c,slippingRecently:h}}function lt(e,s){if(!e)return{title:"10-minute warm-up: Grammar MCQ",detail:"No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.",target:"grammar-mcq",targetLabel:"🧠 Grammar MCQ"};const t=X[e.domain]||X.grammar,a=s!=null&&s.primaryGrade?` (${s.primaryGrade})`:"";return{title:`10 minutes: ${e.label}${a}`,detail:`Practise ${e.label} — currently ${e.pct}%. Aim for 8 of 10 correct before bed.`,target:t.target,targetLabel:t.label}}function dt({topWeak:e,topStrong:s,weekly:t,profile:a}){const n=(a==null?void 0:a.name)||"Your child",r=t.days>=5?`${n} has been wonderfully consistent this week (${t.days} active days).`:t.days>=2?`${n} practised on ${t.days} days this week — a solid rhythm.`:`${n} hasn't practised much this week. Two short sessions will keep skills warm.`,i=s[0]?` They are strongest in ${s[0].label}${s[0].pct?` (${s[0].pct}%)`:""}.`:"",l=e[0]?` ${e[0].label} is the area to focus on next — currently ${e[0].pct}%.`:" No clear weak spots — well done!";return`${r}${i}${l} Encourage them to read aloud short passages every day to keep building fluency.`}function ut(e){var t,a,n,r,i,l;if(!e)return"";const s=[];return s.push(`📚 ${e.learnerName}'s English update${e.grade?` (${e.grade})`:""}`),s.push(`This week: ${e.weekly.days} active days · ${e.weekly.words} questions · ${Math.round(e.weekly.accuracy*100)}% accuracy`),(a=(t=e.strengths)==null?void 0:t[0])!=null&&a.pct?s.push(`✅ Strength: ${e.strengths[0].label} (${e.strengths[0].pct}%)`):s.push("✅ Strength: Steady effort"),(n=e.needsPractice)!=null&&n[0]&&s.push(`🎯 Needs practice: ${e.needsPractice[0].label} (${e.needsPractice[0].pct}%)`),e.examRisk&&s.push(`🚦 Exam focus: ${e.examRisk.label} — ${e.examRisk.summary}`),(r=e.recentMistakes)!=null&&r.length&&s.push(`📝 Recent slips: ${e.recentMistakes.slice(0,3).map(u=>u.word).join(", ")}`),(i=e.graduatingSoon)!=null&&i.length&&s.push(`🌱 Graduating soon: ${e.graduatingSoon.slice(0,3).map(u=>u.word).join(", ")}`),(l=e.slippingRecently)!=null&&l.length&&s.push(`🍂 Slipping: ${e.slippingRecently.slice(0,3).map(u=>u.word).join(", ")} — a 2-min review tonight will help.`),s.push(`👉 Today's 10 min: ${e.recommendation.title}`),s.push(`💬 Teacher's note: ${e.teacherComment}`),s.join(`
`)}ne.register(...Me);let O=null,D=null;function Gt(e,s={}){D=s.onNavigate||null;const t=N.getOverallStats();e.innerHTML=`
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
  `,mt(),ht(),ft(),$t(),kt(),bt(),wt(),St(),Ct(),yt(),vt(),pt(),Lt(t),xt(t),Rt(t),At(t),Mt(),Ot(),Et()}function pt(){const e=document.getElementById("dash-curriculum-map");if(!e)return;e.innerHTML='<h3 class="dash-section-title">Learning Journey Map</h3><div id="dash-cm-inner"></div>';const s=document.getElementById("dash-cm-inner");s&&at(s)}function mt(){var $,k,b,x;const e=document.getElementById("dash-parent-report-card");if(!e)return;const s=T(),t=N.getOverallStats(),a=ge(),n=Oe(),r=v.get("questMastery")||{},i=[];for(const[,g]of Object.entries(r))if(!(!g||typeof g!="object"))for(const[C,S]of Object.entries(g)){if(typeof S!="number")continue;const A=i.find(R=>R.skill===C);A?S>A.score&&(A.score=S):i.push({skill:C,score:S})}const l=i.filter(g=>g.score>=.75).sort((g,C)=>C.score-g.score).map(g=>({skill:g.skill,label:gt(g.skill),score:g.score})),u=(t.recentHistory||[]).filter(g=>g&&g.correct===!1).slice(0,5).map(g=>({word:g.wordId,mode:g.mode,when:Re(g.timestamp),correct:!1})),m={days:(a==null?void 0:a.weekDays)??0,words:(a==null?void 0:a.weekWords)??(t.totalAttempts||0),accuracy:t.overallAccuracy||0},p=v.get("wordStats")||{},o=_e(p,I).map(g=>({word:g.item.word||g.id})),d=Pe(p,I).map(g=>({word:g.item.word||g.id})),c=it({profile:s,weakSkills:n,strengths:l,recentMistakes:u,weekly:m,graduatingSoon:o,slippingRecently:d});e.innerHTML=`
    <section class="parent-report-card" aria-label="Parent report card" role="region">
      <header class="parent-report-card__head">
        <span class="parent-report-card__avatar" aria-hidden="true">${c.avatar}</span>
        <div>
          <h3 class="parent-report-card__title">📋 Report Card · ${f(c.learnerName)}${c.grade?` <small>(${c.grade})</small>`:""}</h3>
          <p class="parent-report-card__sub">Parent-friendly snapshot · this week ${c.weekly.days} day${c.weekly.days===1?"":"s"}, ${c.weekly.words} questions, ${Math.round(c.weekly.accuracy*100)}% accurate</p>
        </div>
        ${c.examRisk?`
          <div class="exam-risk exam-risk--${c.examRisk.band}" role="status" aria-label="Exam focus: ${f(c.examRisk.label)}">
            <span class="exam-risk__label">${f(c.examRisk.label)}</span>
            <span class="exam-risk__summary">${f(c.examRisk.summary)}</span>
          </div>`:""}
      </header>
      <div class="parent-report-card__grid">
        <div class="parent-report-card__cell">
          <h4>✅ Strengths</h4>
          <ul>
            ${c.strengths.map(g=>`<li>${f(g.label)}${g.pct?` <strong>(${g.pct}%)</strong>`:""}</li>`).join("")||"<li>Steady effort across the board</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${c.needsPractice.map(g=>`<li class="needs-practice-item needs-practice-item--${g.band||"amber"}"><span class="needs-practice-dot" aria-hidden="true"></span>${f(g.label)} <strong>(${g.pct}%)</strong></li>`).join("")||"<li>No major gaps detected</li>"}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${c.recentMistakes.map(g=>`<li>${f(g.word)}${g.mode?` <small>· ${f(g.mode)}</small>`:""}${g.when?` <small>· ${f(g.when)}</small>`:""}</li>`).join("")||"<li>No recent mistakes recorded</li>"}
          </ul>
        </div>
        ${($=c.graduatingSoon)!=null&&$.length||(k=c.slippingRecently)!=null&&k.length?`
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${(b=c.graduatingSoon)!=null&&b.length?`
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${c.graduatingSoon.slice(0,5).map(g=>f(g.word)).join(", ")} — about to lock into long-term memory.</p>
          `:""}
          ${(x=c.slippingRecently)!=null&&x.length?`
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${c.slippingRecently.slice(0,5).map(g=>f(g.word)).join(", ")} — a 2-min review tonight will help.</p>
          `:""}
        </div>`:""}
        <div class="parent-report-card__cell parent-report-card__cell--cta">
          <h4>⏱️ Recommended 10-minute practice</h4>
          <p><strong>${f(c.recommendation.title)}</strong></p>
          <p class="parent-report-card__detail">${f(c.recommendation.detail)}</p>
          <button class="btn btn--primary btn--sm" id="parent-report-cta" data-target="${c.recommendation.target}">${f(c.recommendation.targetLabel)} →</button>
        </div>
      </div>
      <div class="parent-report-card__teacher">
        <h4>💬 Teacher's note</h4>
        <p>${f(c.teacherComment)}</p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;const h=e.querySelector("#parent-report-cta");h==null||h.addEventListener("click",()=>{const g=h.dataset.target;D&&g&&D({target:g})});const y=e.querySelector("#copy-parent-update"),w=e.querySelector("#parent-update-hint");y==null||y.addEventListener("click",async()=>{var S,A;const g=ut(c);let C=!1;try{(S=navigator.clipboard)!=null&&S.writeText&&(await navigator.clipboard.writeText(g),C=!0)}catch{}if(!C){const R=document.createElement("textarea");R.value=g,R.setAttribute("aria-label","Parent update message"),R.className="parent-report-card__fallback",R.readOnly=!0,(A=y.parentElement)==null||A.appendChild(R),R.focus(),R.select()}w&&(w.textContent=C?"Copied! Paste it into WhatsApp.":"Select the text below and copy manually.")})}function gt(e){return String(e).replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/\s+/g," ").trim().replace(/^./,s=>s.toUpperCase())}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ht(){const e=document.getElementById("dash-coaching-card");if(!e)return;const s=ge(),t={"on-track":"coaching-card--green","needs-practice":"coaching-card--amber","at-risk":"coaching-card--red","no-data":"coaching-card--grey"}[s.overallSignal]||"coaching-card--grey",a=s.advancementNote?`<div class="coaching-advancement">${s.advancementNote}</div>`:"",n=s.domainsAtRisk.length?`<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${s.domainsAtRisk.map(p=>`<span class="coaching-domain-chip coaching-chip--red">${p.icon} ${p.label}</span>`).join("")}
       </div>`:"",r=`
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${s.mainStrength}</span>
    </div>`,i=s.mainConcern?`<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${s.mainConcern}</span>
       </div>`:"",l=`
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${s.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${s.whyPriority}</p>
    </div>`,u=s.weekXp>0?`<div class="coaching-stat">
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
        ${u}
      </div>

      ${a}
      ${r}
      ${i}
      ${n}
      ${l}
      ${m}
    </div>`}function yt(){const e=document.getElementById("dash-reporting-section");if(!e)return;const s=$e().sort((p,o)=>p.accuracy-o.accuracy).slice(0,8),t=ke().sort((p,o)=>p.accuracy-o.accuracy).slice(0,8),a=ot(),n=Se(),r=Ce({days:7}),i=rt({limit:6}),l=p=>p.map(o=>{const d=Math.round((o.accuracy||0)*100),c=Math.round((o.clueSuccess||0)*100);return`<div class="dash-category-row" title="${o.tooltip}">
      <div class="dash-category-head">
        <span><strong>${o.label}</strong> <small>(${o.loCode})</small></span>
        <span>${d}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${d}%"></div></div>
      <div class="dash-category-meta">Attempts: ${o.attempts} · Clue success: ${c}% · <a href="${o.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`}).join(""),u=(p,o)=>`
    <div class="dash-pattern-item">
      <strong>${p}</strong>
      ${o.map(d=>`<div class="dash-category-row" title="${d.tooltip}">
        <div class="dash-category-head">
          <span><strong>${d.label}</strong> <small>(${d.loCode})</small></span>
          <span>${Math.round((d.accuracy||0)*100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((d.accuracy||0)*100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${d.priorityScore.toFixed(2)} · <a href="${d.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join("")}
    </div>`,m=a.map(p=>{const o=Math.round((p.accuracy||0)*100);return`<div class="dash-scoreboard-chip"><strong>${p.quest}</strong><br>${p.correct}/${p.total} · ${o}%</div>`}).join("");e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Quest Category Reporting</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${l(s)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${l(t)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${m}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((r.accuracy||0)*100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${r.attempts} · Correct: ${r.correct} · Avg response: ${r.avgResponseMs!==null?`${r.avgResponseMs}ms`:"N/A"}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">MOE Priority Recommendations</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${u("Priority vocabulary revision",n.vocab)}
      ${u("Priority grammar revision",n.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Adaptive Next Lesson Queue</h4>
    <ul class="dash-pattern-list">
      ${i.map(p=>`<li class="dash-pattern-item"><strong>${p.quest}</strong> · ${p.label} <small>(${p.loCode})</small><br>${p.reason}</li>`).join("")}
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
      ${s.map(a=>{const n=a.score!==null?Math.round(a.score*100):null,r=n===null?"#e5e3fa":n>=70?"var(--color-success)":n>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${a.icon}</span>
            <span class="dash-domain-label">${a.label}</span>
            ${n!==null?`
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${n}%;background:${a.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${r}">${n}%</span>`:'<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'}
          </div>`}).join("")}
    </div>`}function wt(){const e=document.getElementById("dash-clue-section");if(!e)return;const{questInsights:s,byType:t}=ue();if(!s.length&&!t.length){e.innerHTML=`
      <h3 class="dash-section-title" style="margin-top:24px">Clue Detection</h3>
      <p class="dash-no-data">Complete quests with clue missions to see clue accuracy here.</p>`;return}const a=s.map(r=>{const i=r.clueAccuracy>=.7?"var(--color-success)":r.clueAccuracy>=.45?"var(--color-warning)":"var(--color-error)";return`
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${r.icon} ${r.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${i}">${Math.round(r.clueAccuracy*100)}%</span>
            <span class="dash-clue-metric-sub">(${r.clueAttempted} attempts)</span>
          </div>
          ${r.answerAccuracy!==null?`
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(r.answerAccuracy*100)}%</span>
            </div>`:""}
        </div>
        ${r.interpretation?`<p class="dash-clue-interpretation">${r.interpretation}</p>`:""}
      </div>`}).join(""),n=t.length>0?`
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${t.slice(0,5).map(r=>{const i=Math.round(r.accuracy*100),l=i>=70?"var(--color-success)":i>=45?"var(--color-warning)":"var(--color-error)";return`
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${r.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${i}%;background:${l}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${l}">${i}%</span>
          </div>`}).join("")}
    </div>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Clue Detection vs. Answer Accuracy</h3>
    <div class="dash-clue-list">${a}</div>
    ${n}`}function $t(){const e=document.getElementById("dash-actions-section");if(!e)return;const s=pe();e.innerHTML=`
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
    </div>`,e.querySelectorAll(".dash-rec-cta").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.target,n=t.dataset.group||null;D==null||D({target:a,group:n})})})}function kt(){const e=document.getElementById("dash-stuck-words");if(!e)return;const s=Xe();if(!s.length)return;const t=s.map(a=>`
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
    </ul>`)}function Ct(){const e=document.getElementById("dash-tutor-activity");if(!e)return;const s=(v.get("lessonHistory")||[]).slice(0,30),t=v.get("readAloudStats")||{},a=(v.get("aiUsageLog")||[]).slice(0,8),n=Object.entries(t).sort((d,c)=>{var h,y;return String(((h=c[1])==null?void 0:h.updatedAt)||"").localeCompare(String(((y=d[1])==null?void 0:y.updatedAt)||""))}).slice(0,5);if(!s.length&&!n.length&&!a.length)return;const r=Date.now()-14*24*60*60*1e3,i=s.filter(d=>{const c=new Date(d.completedAt||d.date).getTime();return Number.isFinite(c)&&c>=r}).length,l=s.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${i}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`:"",u=[...new Set(n.flatMap(([,d])=>(d==null?void 0:d.lastMissedWords)||[]))].slice(0,8),m=n.length?`
    <div class="dash-stat-card">
      <span class="dash-stat-value">${n.reduce((d,[,c])=>d+((c==null?void 0:c.attempts)||0),0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`:"",p={explain:"❓ Why explained",hint:"💡 Hint",ask:"🦉 Ask Giri",grade:"✍️ Essay marked"},o=a.length?`
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${a.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${a.map(d=>`<li class="dash-pattern-item">${p[d.kind]||d.kind} · ${f(d.summary||"")} <small>(${f(d.date||"")})</small></li>`).join("")}
      </ul>
    </details>`:"";e.innerHTML=`
    <h3 class="dash-section-title" style="margin-top:24px">Tutor Activity</h3>
    <div class="dash-stats-grid">
      ${l}
      ${m}
    </div>
    ${u.length?`<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${u.map(f).join(", ")}</p>`:""}
    ${o}`}function Lt(e){const s=document.getElementById("chart-mastery");if(!s)return;O&&(O.destroy(),O=null);const t=oe.filter(i=>B[i]),a=t.map(i=>B[i].label),n=t.map(i=>Math.round((e.groupMastery[i]??0)*100)),r=t.map(i=>B[i].color);O=new ne(s,{type:"bar",data:{labels:a,datasets:[{label:"Mastery %",data:n,backgroundColor:r.map(i=>i+"80"),borderColor:r,borderWidth:2,borderRadius:6,barPercentage:.7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:i=>i+"%",font:{size:11}},grid:{display:!1}},x:{ticks:{font:{size:10},maxRotation:45},grid:{display:!1}}}}})}function xt(e){const s=document.getElementById("mastery-bars");s&&(s.innerHTML=oe.map(t=>{const a=B[t];if(!a)return"";const n=Math.round((e.groupMastery[t]??0)*100);return`
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${a.icon} ${a.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${n}%; background:${a.color}"></div>
        </div>
        <span class="mastery-bar-pct">${n}%</span>
      </div>`}).join(""))}function Rt(e){const s=document.getElementById("learning-path");if(!s)return;const t=De(Ie());s.innerHTML=re.map(a=>{const n=t.includes(a.id),r=a.groups??(a.group?[a.group]:[]),i=r.map(u=>e.groupMastery[u]??0),l=r.length?Math.round(i.reduce((u,m)=>u+m,0)/r.length*100):0;return`
      <div class="mastery-bar-item" style="opacity:${n?1:.4}">
        <span class="mastery-bar-label">${a.icon} ${a.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${l}%"></div>
        </div>
        <span class="mastery-bar-pct">${n?l+"%":"🔒"}</span>
      </div>`}).join("")}function At(e){const s=document.getElementById("word-history-body");if(!s)return;const t=e.recentHistory.slice(0,30).map(a=>{const n=I.find(u=>u.id===a.wordId),r=(n==null?void 0:n.emoji)||"",i=Re(a.timestamp),l=a.correct?'<span style="color:var(--color-success)">✓</span>':'<span style="color:var(--color-error)">✗</span>';return`<tr>
      <td>${r} ${a.wordId}</td>
      <td>${a.mode}</td>
      <td>${l}</td>
      <td>${i}</td>
    </tr>`});s.innerHTML=t.join("")||'<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>'}function Mt(){const e=document.getElementById("badge-grid");if(!e)return;const s=z.getAll();e.setAttribute("aria-label",`${z.earnedCount} of ${z.totalCount} badges earned`),e.innerHTML=s.map(t=>`
    <div class="badge-card ${t.earned?"badge-card--earned":"badge-card--locked"}"
         title="${t.desc}"
         aria-label="${t.name}${t.earned?" — earned":" — locked"}">
      <span class="badge-emoji">${t.earned?t.emoji:"🔒"}</span>
      <span class="badge-name">${t.name}</span>
    </div>`).join("")}function Et(){var n,r,i,l,u,m,p;(n=document.getElementById("btn-export-csv"))==null||n.addEventListener("click",()=>{const o=N.exportCSV(),d=new Blob([o],{type:"text/csv"}),c=URL.createObjectURL(d),h=document.createElement("a");h.href=c,h.download="phonicsquest-progress.csv",h.click(),URL.revokeObjectURL(c)}),(r=document.getElementById("btn-export-csv-anon"))==null||r.addEventListener("click",()=>{const o=N.exportCSV().split(`
`).map((y,w)=>{if(w===0||!y.trim())return y;const[$,...k]=y.split(",");return[`${$.slice(0,1)}***`,...k].join(",")}).join(`
`),d=new Blob([o],{type:"text/csv"}),c=URL.createObjectURL(d),h=document.createElement("a");h.href=c,h.download="phonicsquest-progress-anonymised.csv",h.click(),URL.revokeObjectURL(c)}),(i=document.getElementById("btn-export-report"))==null||i.addEventListener("click",()=>{const o=_t(),d=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),c=URL.createObjectURL(d),h=document.createElement("a");h.href=c,h.download=`phonicsquest-parent-report-${new Date().toISOString().slice(0,10)}.json`,h.click(),URL.revokeObjectURL(c)}),(l=document.getElementById("btn-import-csv"))==null||l.addEventListener("click",()=>{const o=document.getElementById("csv-import-panel");o&&(o.hidden=!o.hidden)}),(u=document.getElementById("csv-browse-btn"))==null||u.addEventListener("click",()=>{var o;(o=document.getElementById("csv-file-input"))==null||o.click()}),(m=document.getElementById("csv-file-input"))==null||m.addEventListener("change",o=>{var c;const d=(c=o.target.files)==null?void 0:c[0];d&&ae(d)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",o=>{o.preventDefault(),e.classList.add("dash-import-drop--active")}),e.addEventListener("dragleave",()=>e.classList.remove("dash-import-drop--active")),e.addEventListener("drop",o=>{var c,h;o.preventDefault(),e.classList.remove("dash-import-drop--active");const d=(h=(c=o.dataTransfer)==null?void 0:c.files)==null?void 0:h[0];d&&ae(d)}));const s=document.getElementById("adaptive-weak-weight"),t=document.getElementById("adaptive-unseen-weight"),a=v.get("adaptiveConfig")||{};s&&(s.value=String(a.weakWeight??5),s.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},weakWeight:Number(s.value)})})),t&&(t.value=String(a.unseenWeight??3),t.addEventListener("input",()=>{v.set("adaptiveConfig",{...v.get("adaptiveConfig")||{},unseenWeight:Number(t.value)})})),(p=document.getElementById("btn-print-report"))==null||p.addEventListener("click",()=>{document.body.classList.add("print-mode"),window.print(),setTimeout(()=>document.body.classList.remove("print-mode"),2e3)})}function Ot(){const e=document.getElementById("print-report-content");if(!e)return;const s=new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"});function t(u){const m=u*100;return m>=70?"#22c55e":m>=40?"#f59e0b":"#ef4444"}function a(u,m,p){var d;const o=[];for(const c of m){const h=Ne.getSkillScore(u,c);if(h===.5)continue;const y=Math.round(h*100),w=t(h),$=((d=p[c])==null?void 0:d.label)||c,k=Math.max(y,4);o.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${k}px;background:${w};"></div>
          <span style="color:${w};font-weight:600;min-width:36px">${y}%</span>
          <span>${f($)}</span>
        </div>`)}return o.join("")||'<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>'}const n=v.get("xp")??0,r=v.get("streak")??0,i=v.get("dailyGoal")??0,l=(()=>{const u=v.get("dailyHistory")||{},m=Date.now(),p=864e5;let o=0;for(let d=0;d<7;d++){const c=new Date(m-d*p).toISOString().slice(0,10);u[c]&&o++}return o})();e.innerHTML=`
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${f(s)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${n}</span>
          <span><strong>Day streak:</strong> ${r}</span>
          <span><strong>Daily goal:</strong> ${i}</span>
          <span><strong>Days played this week:</strong> ${l}</span>
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
    </div>`}function _t(){const e=N.getOverallStats(),s=T();return{generatedAt:new Date().toISOString(),learnerSummary:le(),literacyDomains:de(),clueInsights:ue(),recommendedActions:pe(),recentPatternInsights:me(),progress:{wordsAttempted:e.wordsAttempted,wordsMastered:e.wordsMastered,overallAccuracy:e.overallAccuracy,bestStreak:e.bestStreak,totalAttempts:e.totalAttempts,totalCorrect:e.totalCorrect,groupMastery:e.groupMastery,recentHistory:e.recentHistory.slice(0,50),profile:s}}}const xe=new Set(["a","e","i","o","u"]),Pt=new Set("bcdfghjklmnpqrstvwxyz".split(""));function H(e){const t=e.toLowerCase().split(""),a=t.map(n=>xe.has(n)?"sv":(Pt.has(n),"c"));return{graphemes:t,types:a}}function te(e){const s=e.toLowerCase().split("").find(t=>xe.has(t));return s?`short-${s}`:"short-a"}function se(e,s){const t=[],a=[];let n=!1;for(const l of s){if(l==="sv"||l==="lv"){n=!0;continue}n?a.push(l):t.push(l)}const r=t.length,i=a.length;return r<=1&&i<=1?"CVC":r>=2&&i<=1?"blend":r<=1&&i>=2?"CVCC":"CCVCC"}async function ae(e){var m,p;const s=document.getElementById("csv-import-preview"),t=document.getElementById("csv-import-status");if(!s||!t)return;const n=(await e.text()).trim().split(`
`).filter(o=>o.trim());if(!n.length){t.hidden=!1,t.textContent="File is empty.",t.className="dash-import-status dash-import-status--error";return}const r=n[0].trim(),i=r.includes(",");let l=[];const u=new Set(I.map(o=>o.id));if(i){const o=r.toLowerCase().split(",").map(k=>k.trim()),d=o.indexOf("word");if(d<0){t.hidden=!1,t.textContent='CSV must have a "word" column.',t.className="dash-import-status dash-import-status--error";return}const c=o.indexOf("graphemes"),h=o.indexOf("types"),y=o.indexOf("group"),w=o.indexOf("level"),$=o.indexOf("emoji");for(let k=1;k<n.length;k++){const b=n[k].split(",").map(S=>S.trim()),x=b[d];if(!x||u.has(x.toLowerCase()))continue;const g=c>=0&&b[c]?b[c].split(/[|;]/):H(x).graphemes,C=h>=0&&b[h]?b[h].split(/[|;]/):H(x).types;l.push({id:x.toLowerCase(),word:x.toLowerCase(),graphemes:g,types:C,pattern:se(g,C),group:y>=0&&b[y]||te(x),level:w>=0&&parseInt(b[w])||1,emoji:$>=0&&b[$]||""})}}else for(const o of n){const d=o.trim().toLowerCase();if(!d||u.has(d))continue;const{graphemes:c,types:h}=H(d);l.push({id:d,word:d,graphemes:c,types:h,pattern:se(c,h),group:te(d),level:1,emoji:""})}if(!l.length){t.hidden=!1,t.textContent="No new words found (all may already exist).",t.className="dash-import-status dash-import-status--error";return}s.hidden=!1,s.innerHTML=`
    <p><strong>${l.length} new word${l.length>1?"s":""}</strong> ready to import:</p>
    <div class="dash-import-word-list">${l.slice(0,20).map(o=>`<span class="dash-import-word">${o.emoji?o.emoji+" ":""}${o.word} <small>(${o.group})</small></span>`).join("")}${l.length>20?`<span class="dash-import-word">…and ${l.length-20} more</span>`:""}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${l.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`,(m=document.getElementById("csv-cancel-import"))==null||m.addEventListener("click",()=>{s.hidden=!0,t.hidden=!0}),(p=document.getElementById("csv-confirm-import"))==null||p.addEventListener("click",()=>{I.push(...l);const o=v.get("customWords")||[];v.set("customWords",[...o,...l]),s.hidden=!0,t.hidden=!1,t.textContent=`Imported ${l.length} word${l.length>1?"s":""} successfully!`,t.className="dash-import-status dash-import-status--success"})}function Re(e){if(!e)return"";const s=Date.now()-new Date(e).getTime(),t=Math.floor(s/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const a=Math.floor(t/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function Bt(){O&&(O.destroy(),O=null)}export{Bt as destroyDashboard,Gt as renderDashboard};
