import{q as A}from"./questMastery-BOzozjkU.js";import{s as Q,o as F}from"./index-B5kQgz7F.js";import{G as L,a as H,b as N}from"./grammarMcq-BTepaHnw.js";import{a as K,c as Y,G as I}from"./grammarCategories-sjlxVdzw.js";import{c as z}from"./remediationRouter-71cB81vn.js";import{a as B,e as d}from"./escapeHtml-Bz2f3NU1.js";import{r as U,M as V,f as J,b as X}from"./mcqDifficulty-DI6PRPUo.js";import{g as R}from"./grammarTips-D9YQFGRf.js";import"./gsap-C8pce-KX.js";import"./vocabCategories-CkmW2x1_.js";let a=null,_=null,p=[],f=0,E=0,C=!1,b={level:null,category:null,label:"All Skills",difficulty:"normal"},g="normal",q=0,y=0,S=[],M=!1,w={},k={};function he(e,s){a=e,_=s}function ve(){a&&(a.innerHTML="")}function Z(e=L){return H.flatMap(s=>e[s]||[])}function O({level:e=null,category:s=null}={},t=L){const l=e?t[e]||[]:Z(t);return s?l.filter(i=>i.category===s):l}function P(e={},s=L){return O(e,s).length}function ee(e=L,s=K){return s.map(t=>{const l={};let i=0;for(const n of H){const c=P({level:n,category:t},e);l[n]=c,i+=c}return{category:t,total:i,levels:l}})}function te(e=L,s=H){return s.map(t=>({level:t,total:P({level:t},e)}))}function j(e){var s;return((s=I[e])==null?void 0:s.label)||e}function se(e){const s=e.level||null,t=e.category?j(e.category):null;return[s,t].filter(Boolean).join(" · ")||"All Skills"}function D(){if(!a)return;const e=te(),s=ee();let t=b.level||"P1",l=b.difficulty||g||"normal";const i=()=>{var n,c;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise grammar concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:r,total:u})=>`
              <button class="sfq-level-btn mcq-level-card ${r===t?"mcq-level-card--active":""}" data-pick-level="${r}">
                <span class="sfq-level-name">${r}</span>
                <span class="mcq-count-badge">${u} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${U({selected:l,prefix:"gmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${t} Grammar Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${t} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${s.filter(({category:r})=>Y(r,t)).map(({category:r,levels:u})=>{const h=u[t]||0,m=I[r]||{icon:"🧩",label:r};return h?`
                <button class="mcq-skill-card" data-scope-level="${t}" data-scope-category="${r}">
                  <div class="mcq-skill-title">${m.icon} ${m.label}</div>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${h} items in ${t}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${m.icon} ${m.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${t}</p>
                  </button>`}).join("")}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`,a.querySelectorAll("[data-pick-level]").forEach(r=>{r.addEventListener("click",()=>{t=r.dataset.pickLevel,i()})}),a.querySelectorAll("[data-gmcq-difficulty]").forEach(r=>{r.addEventListener("click",()=>{l=r.dataset.gmcqDifficulty,i()})}),(n=a.querySelector("#gmcq-start-level"))==null||n.addEventListener("click",()=>{G({level:t,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(r=>{r.addEventListener("click",()=>{G({level:r.dataset.scopeLevel,category:r.dataset.scopeCategory,difficulty:l})})}),(c=a.querySelector("#gmcq-home"))==null||c.addEventListener("click",()=>_==null?void 0:_())};i()}function W(e){return[...e].sort((s,t)=>{const l=A.getSkillScore("grammarMcq",s.category),i=A.getSkillScore("grammarMcq",t.category);return l-i+(Math.random()-.5)*.3})}function G({level:e=null,category:s=null,label:t="",difficulty:l=g}={}){var c;g=((c=V[l])==null?void 0:c.key)||"normal",b={level:e,category:s,label:t||se({level:e,category:s}),difficulty:g};const i=e?{[e]:N(e)}:Object.fromEntries(H.map(r=>[r,L[r]]));p=W(J(O({level:e,category:s},i),{level:e,difficulty:g}));const n=Q.get("paperItemLimit");n&&(Q.set("paperItemLimit",null),p=p.slice(0,n)),f=0,E=0,q=0,y=0,S=[],w={},M=!1,C=!1,k={},b.category&&!M?ce(b.category,()=>T()):T()}function le(){p=W(S),f=0,E=0,q=0,y=0,S=[],w={},M=!0,C=!1,k={},T()}function ye(e,s=g){a&&G({level:e,category:null,label:e,difficulty:s})}function re(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function T(){if(!a)return;const e=p[f];if(!e)return ie();C=!1;const s=Math.round(f/p.length*100),t=M?`Recovery · ${b.label}`:b.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${f+1} of ${p.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${M?"🔄":"🧠"} ${d(t)}</span>
        ${re()}
        <span class="sfq-progress" aria-label="Question ${f+1} of ${p.length}">${f+1}/${p.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${s}%"></div></div>
      <p class="mcq-category-tag">${d(j(e.category))}${g==="challenge"?" · PSLE Challenge":""}</p>
      ${g==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${d(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(c=>`<button class="pt-choice-btn" data-choice="${B(c)}" aria-label="Choose ${B(c)}">${d(c)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,a.querySelectorAll("[data-choice]").forEach(c=>{c.addEventListener("click",()=>{if(C)return;C=!0;const r=c.dataset.choice,u=r===e.answer;u?(E+=1,q+=1,y=Math.max(y,q),F.recordCorrect()):(q=0,S.push(e),F.recordWrong());const h=w[e.category]||(w[e.category]={correct:0,total:0});h.total+=1,u&&(h.correct+=1),A.updateSkill("grammarMcq",e.category,u),A.recordAttempt({quest:"grammarMcq",skill:e.category,correct:u,level:b.level||"Mixed"}),a.querySelectorAll("[data-choice]").forEach(o=>{o.disabled=!0,o.setAttribute("aria-disabled","true"),o.dataset.choice===e.answer?o.classList.add("pt-choice--correct"):o===c&&!u&&o.classList.add("pt-choice--wrong")});const m=a.querySelector("#gmcq-hint");let $=X(e,r,u,{showClueWords:g!=="challenge"});if(u?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!u){const o=z("grammarMcq",e.category);o&&o.type==="redirect"&&($+=` <br>💡 ${d(o.message)}`)}if(!u&&k[e.category]>=2){const o=R(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${d(o.rule)}<br><em>${d(o.example)}</em></span>`}m&&(m.innerHTML=$);const x=a.querySelector("#gmcq-next-wrap"),v=a.querySelector("#gmcq-next");if(x&&v){const o=f+1>=p.length;v.textContent=o?"See Results →":"Next →",v.setAttribute("aria-label",o?"See results":"Next question"),x.style.display="",v.addEventListener("click",()=>{f+=1,T()}),v.focus()}})});const i=a.querySelector("#gmcq-rule-hint"),n=a.querySelector("#gmcq-hint-panel");i&&n&&i.addEventListener("click",()=>{const c=n.hidden;if(n.hidden=!c,i.setAttribute("aria-expanded",String(c)),i.textContent=c?"💡 Hide Rule":"💡 Show Rule",c){const r=R(e.category);n.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${d(r.rule)}</p>
          <p class="mcq-hint-eg"><em>${d(r.example)}</em></p>
          <p class="mcq-hint-tip">${d(r.tip)}</p>`}})}function ae(){const e=Object.entries(w).filter(([,t])=>t.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([t,l])=>({cat:t,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((t,l)=>t.pct-l.pct).map(({cat:t,pct:l,correct:i,total:n})=>{const c=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${d(j(t))}</th>
          <td class="sq-skill-score">${i}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${c}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function ce(e,s){var i,n;const t=R(e),l=I[e]||{icon:"🧠",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${B(l.label)}">
      <div class="mcq-rule-icon">${l.icon}</div>
      <h2 class="mcq-rule-title">${d(l.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${d(t.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${d(t.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${d(t.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">Skip →</button>
      </div>
    </div>`,(i=a.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",s),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",s)}function ie(){var c,r,u;const e=p.length;if(e===0){D();return}const s=Math.round(E/e*100),t=s>=90?3:s>=70?2:s>0?1:0,l=S.length>0,i=ae();let n="";if(s<70){const h=Object.entries(w).filter(([,m])=>m.total>0);if(h.length>0){const[m]=h.sort(([,v],[,o])=>v.correct/v.total-o.correct/o.total)[0],$=R(m),x=I[m]||{icon:"🧠",label:m};n=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${x.icon} Focus area: ${d(x.label)}</p>
          <p class="mcq-focus-tip-rule">${d($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${d($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${d($.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${M?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${t} stars">${"⭐".repeat(t)}${"☆".repeat(3-t)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${s}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${s>=90?"Outstanding!":s>=70?"Great work — keep practising!":s>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${i}${n}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((c=a.querySelector("#gmcq-recovery"))==null||c.addEventListener("click",()=>le())),(r=a.querySelector("#gmcq-replay"))==null||r.addEventListener("click",()=>G(b)),(u=a.querySelector("#gmcq-menu"))==null||u.addEventListener("click",()=>D())}export{ve as cleanupGrammarMcq,P as countItemsForScope,Z as getAllItems,ee as getCategoryCounts,O as getItemsForScope,te as getLevelCounts,he as initGrammarMcq,D as showGrammarMcqBrowser,ye as startGrammarMcqLevel};
