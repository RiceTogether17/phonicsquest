import{s as u,g as C,P as w,C as D}from"./index-B12g-4D5.js";const A=[1,3,7,14,30],b=3,d={MASTERED:.85,ON_TRACK:.7,CONSOLIDATING:.5,BUILDING:.2},R=[{id:"sentenceSkills",label:"Sentence Skills",icon:"🔨",questKey:"sentenceForge"},{id:"grammarCloze",label:"Grammar Cloze",icon:"🏰",questKey:"clozeCastle"},{id:"vocabCloze",label:"Vocabulary Cloze",icon:"🔑",questKey:"wordVault"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",questKey:"editingQuest"},{id:"writingQuest",label:"Writing Quest",icon:"📝",questKey:"writingQuest"}];function M(t){return!t||(t.attempts||0)<b?0:(t.reviewInterval??0)/(A.length-1)}function N(t){const s=(u.get("questMastery")||{})[t]||{},e=Object.values(s).filter(n=>typeof n=="number");return e.length?e.reduce((n,a)=>n+a,0)/e.length:null}function P(){const t=u.get("groupMastery")||{},s=Object.values(t).filter(e=>typeof e=="number");return s.length?s.reduce((e,n)=>e+n,0)/s.length:null}function E(){const t=u.get("wordStats")||{},s=Object.values(t).filter(e=>((e==null?void 0:e.attempts)||0)>=b).map(e=>M(e));return s.length?s.reduce((e,n)=>e+n,0)/s.length:0}function p(){const t=E(),s=P(),e=s!==null?Math.min(1,s*.8+t*.2):null,n={id:"phonics",label:"Phonics / Decoding",icon:"🔤",raw:s,composite:e,state:f(e),signal:v(e)},a=R.map(o=>{const r=N(o.questKey),i=r;return{...o,raw:r,composite:i,state:f(i),signal:v(i)}});return[n,...a]}function f(t){return t==null?"no-data":t>=d.MASTERED?"mastered":t>=d.ON_TRACK?"on-track":t>=d.CONSOLIDATING?"consolidating":t>=d.BUILDING?"building":"just-started"}function v(t){return t==null?"no-data":t>=d.ON_TRACK?"on-track":t>=d.CONSOLIDATING?"needs-practice":"at-risk"}function x(t){return{mastered:"Mastered ✅","on-track":"On track",consolidating:"Consolidating",building:"Building","just-started":"Just started","no-data":"No data yet"}[t]||t}function I(t){const e=p().find(a=>a.id===t);if(!e||e.composite===null)return{decision:"no-data",label:"Not enough data yet",canAdvance:!1};const n=e.state;return n==="mastered"?{decision:"advance",label:"Ready to advance ✅",canAdvance:!0}:n==="on-track"?{decision:"continue",label:"On track — keep going",canAdvance:!1}:n==="consolidating"?{decision:"consolidate",label:"Consolidate before advancing ⚠️",canAdvance:!1}:{decision:"review",label:"Needs more practice 🔴",canAdvance:!1}}function K(){const t=u.get("questAttempts")||[],s=Date.now()-7*24*3600*1e3,e={};for(const n of t)n.timestamp&&new Date(n.timestamp).getTime()>=s&&(e[n.quest]=(e[n.quest]||0)+1);return e}function z(){const t=p().filter(c=>c.composite!==null),s=t.filter(c=>c.signal==="at-risk"),e=t.filter(c=>c.signal==="needs-practice"),n=t.filter(c=>c.signal==="on-track"),a=t.filter(c=>c.state==="mastered"),o=s.length>0?"at-risk":e.length>0?"needs-practice":t.length>0?"on-track":"no-data",i=[...t].sort((c,g)=>(c.composite??1)-(g.composite??1))[0],l=i?`${i.icon} ${i.label} (${Math.round((i.composite??0)*100)}%)`:"Keep practising across all areas!",m=u.get("wordStats")||{},y=Date.now();let h=0;for(const c of Object.values(m))if(c!=null&&c.nextReviewDate){const g=new Date(c.nextReviewDate).getTime();!isNaN(g)&&y>=g&&h++}const k=i?I(i.id):null;return{overallSignal:o,domainsAtRisk:s,needsPractice:e,strongDomains:n,masteredDomains:a,nextFocus:l,reviewsDue:h,progressionDecision:k,weakestDomain:i||null,domains:t}}const $=w.map(t=>({phase:t.phase,label:`Phase ${t.phase}`,title:t.title,icon:t.icon,desc:t.description})),T=[{id:"sentenceSkills",label:"Sentence Forge",icon:"🔨",desc:"Build and arrange sentences"},{id:"grammarCloze",label:"Cloze Castle",icon:"🏰",desc:"Grammar in context"},{id:"vocabCloze",label:"Word Vault",icon:"🔑",desc:"Vocabulary in context"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",desc:"Spot and fix errors"},{id:"writingQuest",label:"Writing Quest",icon:"📝",desc:"Extended writing tasks"}];function O(t){const s=u.get("groupMastery")||{};return typeof s[t]=="number"?s[t]:null}function S(t){const s=D.filter(i=>i.phase===t);if(!s.length)return{status:"locked",pct:0,masteredCount:0,total:0};let e=0,n=0;for(const i of s){const l=O(i.group);l!==null&&(l>=.8?e++:l>0&&n++)}const a=s.length,o=Math.round(e/a*100);let r;return e===a?r="complete":e>0||n>0?r="in-progress":r="locked",{status:r,pct:o,masteredCount:e,total:a}}function _(){for(let t=$.length;t>=1;t--){const{status:s}=S(t);if(s==="in-progress"||s==="complete")return t}return 1}function L(t){const e=p().find(o=>o.id===t);if(!e||e.composite===null)return{status:"not-started",pct:0};const n=Math.round((e.composite??0)*100);return{status:n>=80?"strong":n>=50?"building":n>0?"starting":"not-started",pct:n}}function Q(t="🦁"){const s=_();return $.map(e=>{const{status:n,pct:a,masteredCount:o,total:r}=S(e.phase),i=e.phase===s&&n!=="complete",l={complete:"Complete ✅","in-progress":"In progress",locked:"Not started yet"}[n]||"";return`
      <div class="cm-phase ${`cm-phase--${n}`} ${i?"cm-phase--current":""}"
           aria-label="${e.title}${i?" – current stage":""}">
        ${i?`<div class="cm-you-are-here">${t} You are here!</div>`:""}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${e.icon}</span>
          <div>
            <span class="cm-phase-label">${e.label}</span>
            <span class="cm-phase-title">${e.title}</span>
          </div>
          <span class="cm-phase-badge">${n==="complete"?"✅":n==="in-progress"?`${a}%`:"🔒"}</span>
        </div>
        <p class="cm-phase-desc">${e.desc}</p>
        ${n!=="locked"?`
          <div class="cm-phase-bar-track" aria-label="${a}% complete">
            <div class="cm-phase-bar-fill" style="width:${a}%"></div>
          </div>
          <span class="cm-phase-meta">${o} / ${r} groups · ${l}</span>
        `:`<span class="cm-phase-meta cm-phase-meta--locked">${l}</span>`}
      </div>`}).join("")}function q(){return T.map(t=>{const{status:s,pct:e}=L(t.id),n=`cm-domain--${s}`,a={strong:"Strong ✅",building:"Building",starting:"Just started","not-started":"Not started yet"}[s]||"";return`
      <div class="cm-domain ${n}" aria-label="${t.label}: ${a}">
        <div class="cm-domain-header">
          <span class="cm-domain-icon">${t.icon}</span>
          <span class="cm-domain-label">${t.label}</span>
          <span class="cm-domain-pct">${s!=="not-started"?`${e}%`:"—"}</span>
        </div>
        <p class="cm-domain-desc">${t.desc}</p>
        ${s!=="not-started"?`
          <div class="cm-phase-bar-track">
            <div class="cm-phase-bar-fill" style="width:${e}%"></div>
          </div>`:""}
      </div>`}).join("")}function G(t,{onClose:s}={}){var l,m;if(!t)return;const e=C(),n=(e==null?void 0:e.schoolLevel)==="primary",a=(e==null?void 0:e.avatar)||"🦁",o=((l=e==null?void 0:e.name)==null?void 0:l.split(" ")[0])||"Learner",r=Q(a),i=q();t.innerHTML=`
    <div class="cm-wrapper" role="dialog" aria-label="${o}'s learning journey">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${a}</span>
          <div>
            <h2 class="cm-title">${o}'s Learning Journey</h2>
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
          ${r}
        </div>
      </div>

      <div class="cm-connector" aria-hidden="true">
        <div class="cm-connector-line"></div>
        <span class="cm-connector-label">→ Phonics mastery unlocks Primary English</span>
      </div>

      <div class="cm-section ${n?"":"cm-section--future"}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span>
          Primary English Skills
          ${n?"":'<span class="cm-section-tag">Unlocks with phonics mastery</span>'}
        </h3>
        <p class="cm-section-desc">Reading, grammar, vocabulary, and writing in authentic contexts.</p>
        <div class="cm-domain-grid">
          ${i}
        </div>
      </div>
    </div>`,(m=document.getElementById("cm-close-btn"))==null||m.addEventListener("click",()=>s==null?void 0:s())}export{K as a,G as b,Q as c,q as d,z as g,x as r};
