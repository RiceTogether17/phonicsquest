import{b as h,A as g,P as d,E as m,F as v,C as $,H as b,s as f}from"./index-BtarHMM5.js";const p=v.map(a=>({phase:a.phase,label:`Phase ${a.phase}`,title:a.title,icon:a.icon,desc:a.description,sightWords:a.sightWords||[]})),y=[{id:"sentenceSkills",label:"Sentence Forge",icon:"🔨",desc:"Build and arrange sentences"},{id:"grammarCloze",label:"Cloze Castle",icon:"🏰",desc:"Grammar in context"},{id:"vocabCloze",label:"Word Vault",icon:"🔑",desc:"Vocabulary in context"},{id:"editingQuest",label:"Editing Quest",icon:"✏️",desc:"Spot and fix errors"},{id:"writingQuest",label:"Writing Quest",icon:"📝",desc:"Extended writing tasks"}];function P(a){const e=f.get("groupMastery")||{};return typeof e[a]=="number"?e[a]:null}function u(a){const e=$.filter(r=>r.phase===a);if(!e.length)return{status:"locked",pct:0,masteredCount:0,total:0};let s=0,t=0;for(const r of e){const l=P(r.group);l!==null&&(l>=.8?s++:l>0&&t++)}const c=e.length,n=Math.round(s/c*100);let i;return s===c?i="complete":s>0||t>0?i="in-progress":i="locked",{status:i,pct:n,masteredCount:s,total:c}}function C(){for(let a=p.length;a>=1;a--){const{status:e}=u(a);if(e==="in-progress"||e==="complete")return a}for(const a of d)if(m(a.phase).status!=="complete")return a.phase;return 1}function k(a,e){return d.map(s=>{const{status:t,pct:c}=m(s.phase),n=s.phase===a,i={complete:"Complete ✅","in-progress":"In progress",locked:"Not started yet"}[t]||"";return`
      <div class="cm-phase cm-phase--${t} ${n?"cm-phase--current":""}"
           aria-label="${s.title}${n?" – current stage":""}">
        ${n?`<div class="cm-you-are-here">${e} You are here!</div>`:""}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${s.icon}</span>
          <div>
            <span class="cm-phase-label">${s.label.split(" — ")[0]}</span>
            <span class="cm-phase-title">${s.title}</span>
          </div>
          <span class="cm-phase-badge">${t==="complete"?"✅":t==="in-progress"?`${c}%`:"🔒"}</span>
        </div>
        <p class="cm-phase-desc">${s.description}</p>
        ${t!=="locked"?`
          <div class="cm-phase-bar-track" aria-label="${c}% complete">
            <div class="cm-phase-bar-fill" style="width:${c}%"></div>
          </div>
          <span class="cm-phase-meta">${i}</span>
        `:`<span class="cm-phase-meta cm-phase-meta--locked">${i}</span>`}
      </div>`}).join("")}function E(a){const s=b().find(n=>n.id===a);if(!s||s.composite===null)return{status:"not-started",pct:0};const t=Math.round((s.composite??0)*100);return{status:t>=80?"strong":t>=50?"building":t>0?"starting":"not-started",pct:t}}function S(a="🦁"){const e=C();return k(e,a)+p.map(s=>{const{status:t,pct:c,masteredCount:n,total:i}=u(s.phase),r=s.phase===e&&t!=="complete",l={complete:"Complete ✅","in-progress":"In progress",locked:"Not started yet"}[t]||"";return`
      <div class="cm-phase ${`cm-phase--${t}`} ${r?"cm-phase--current":""}"
           aria-label="${s.title}${r?" – current stage":""}">
        ${r?`<div class="cm-you-are-here">${a} You are here!</div>`:""}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${s.icon}</span>
          <div>
            <span class="cm-phase-label">${s.label}</span>
            <span class="cm-phase-title">${s.title}</span>
          </div>
          <span class="cm-phase-badge">${t==="complete"?"✅":t==="in-progress"?`${c}%`:"🔒"}</span>
        </div>
        <p class="cm-phase-desc">${s.desc}</p>
        ${s.sightWords.length?`<p class="cm-phase-sight">🃏 Tricky words: ${s.sightWords.join(", ")}</p>`:""}
        ${t!=="locked"?`
          <div class="cm-phase-bar-track" aria-label="${c}% complete">
            <div class="cm-phase-bar-fill" style="width:${c}%"></div>
          </div>
          <span class="cm-phase-meta">${n} / ${i} groups · ${l}</span>
        `:`<span class="cm-phase-meta cm-phase-meta--locked">${l}</span>`}
      </div>`}).join("")}function M(){return y.map(a=>{const{status:e,pct:s}=E(a.id),t=`cm-domain--${e}`,c={strong:"Strong ✅",building:"Building",starting:"Just started","not-started":"Not started yet"}[e]||"";return`
      <div class="cm-domain ${t}" aria-label="${a.label}: ${c}">
        <div class="cm-domain-header">
          <span class="cm-domain-icon">${a.icon}</span>
          <span class="cm-domain-label">${a.label}</span>
          <span class="cm-domain-pct">${e!=="not-started"?`${s}%`:"—"}</span>
        </div>
        <p class="cm-domain-desc">${a.desc}</p>
        ${e!=="not-started"?`
          <div class="cm-phase-bar-track">
            <div class="cm-phase-bar-fill" style="width:${s}%"></div>
          </div>`:""}
      </div>`}).join("")}function H(a,{onClose:e}={}){var l,o;if(!a)return;const s=h(),t=(s==null?void 0:s.schoolLevel)==="primary",c=(s==null?void 0:s.avatar)||"🦁",n=g(((l=s==null?void 0:s.name)==null?void 0:l.split(" ")[0])||"Learner"),i=S(c),r=M();a.innerHTML=`
    <div class="cm-wrapper" role="dialog" aria-label="${n}'s learning journey">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${c}</span>
          <div>
            <h2 class="cm-title">${n}'s Learning Journey</h2>
            <p class="cm-subtitle">Track progress from phonics foundations to primary English</p>
          </div>
        </div>
        ${e?'<button class="btn btn--ghost btn--sm cm-close" id="cm-close-btn" aria-label="Close map">✕</button>':""}
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

      <div class="cm-section ${t?"":"cm-section--future"}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span>
          Primary English Skills
          ${t?"":'<span class="cm-section-tag">Unlocks with phonics mastery</span>'}
        </h3>
        <p class="cm-section-desc">Reading, grammar, vocabulary, and writing in authentic contexts.</p>
        <div class="cm-domain-grid">
          ${r}
        </div>
      </div>
    </div>`,(o=document.getElementById("cm-close-btn"))==null||o.addEventListener("click",()=>e==null?void 0:e())}export{M as a,S as b,H as r};
