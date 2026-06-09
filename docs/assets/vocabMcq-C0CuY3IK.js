import{q as R}from"./questMastery-BOzozjkU.js";import{s as j,o as Q}from"./index-B5kQgz7F.js";import{V as M,a as H,b as W}from"./vocabMcq-D5hyL-Zw.js";import{a as N,V as E}from"./vocabCategories-CkmW2x1_.js";import{c as K}from"./remediationRouter-71cB81vn.js";import{a as I,e as u}from"./escapeHtml-Bz2f3NU1.js";import{r as Y,M as z,f as U,b as J}from"./mcqDifficulty-DI6PRPUo.js";import"./gsap-C8pce-KX.js";import"./grammarCategories-sjlxVdzw.js";function V(e){const t=E[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let a=null,A=null,m=[],f=0,_=0,x=!1,b={level:null,category:null,label:"All Skills",difficulty:"normal"},v="normal",q=0,y=0,S=[],w=!1,L={},k={};function ve(e,t){a=e,A=t}function be(){a&&(a.innerHTML="")}function X(e=M){return H.flatMap(t=>e[t]||[])}function D({level:e=null,category:t=null}={},s=M){const c=e?s[e]||[]:X(s);return t?c.filter(i=>i.category===t):c}function P(e={},t=M){return D(e,t).length}function Z(e=M,t=N){return t.map(s=>{const c={};let i=0;for(const o of H){const r=P({level:o,category:s},e);c[o]=r,i+=r}return{category:s,total:i,levels:c}})}function ee(e=M,t=H){return t.map(s=>({level:s,total:P({level:s},e)}))}function O(e){var t;return((t=E[e])==null?void 0:t.label)||e}function te(e){const t=e.level||null,s=e.category?O(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function F(){if(!a)return;const e=ee(),t=Z();let s=b.level||"P1",c=b.difficulty||v||"normal";const i=()=>{var o,r;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise vocabulary concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:l,total:d})=>`
              <button class="sfq-level-btn mcq-level-card ${l===s?"mcq-level-card--active":""}" data-pick-level="${l}">
                <span class="sfq-level-name">${l}</span>
                <span class="mcq-count-badge">${d} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${Y({selected:c,prefix:"vmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Vocabulary Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.map(({category:l,levels:d})=>{const h=d[s]||0,p=E[l]||{icon:"📘",label:l,desc:""};return h?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${l}">
                  <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                  <p class="mcq-skill-sub">${p.desc||""}</p>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${h} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="vmcq-home">← Home</button></div>
      </div>`,a.querySelectorAll("[data-pick-level]").forEach(l=>{l.addEventListener("click",()=>{s=l.dataset.pickLevel,i()})}),a.querySelectorAll("[data-vmcq-difficulty]").forEach(l=>{l.addEventListener("click",()=>{c=l.dataset.vmcqDifficulty,i()})}),(o=a.querySelector("#vmcq-start-level"))==null||o.addEventListener("click",()=>{T({level:s,category:null,difficulty:c})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(l=>{l.addEventListener("click",()=>{T({level:l.dataset.scopeLevel,category:l.dataset.scopeCategory,difficulty:c})})}),(r=a.querySelector("#vmcq-home"))==null||r.addEventListener("click",()=>A==null?void 0:A())};i()}function G(e){return[...e].sort((t,s)=>{const c=R.getSkillScore("vocabMcq",t.category),i=R.getSkillScore("vocabMcq",s.category);return c-i+(Math.random()-.5)*.3})}function T({level:e=null,category:t=null,label:s="",difficulty:c=v}={}){var r;v=((r=z[c])==null?void 0:r.key)||"normal",b={level:e,category:t,label:s||te({level:e,category:t}),difficulty:v};const i=e?{[e]:W(e)}:Object.fromEntries(H.map(l=>[l,M[l]]));m=G(U(D({level:e,category:t},i),{level:e,difficulty:v}));const o=j.get("paperItemLimit");o&&(j.set("paperItemLimit",null),m=m.slice(0,o)),f=0,_=0,q=0,y=0,S=[],L={},w=!1,x=!1,k={},b.category&&!w?ae(b.category,()=>B()):B()}function se(){m=G(S),f=0,_=0,q=0,y=0,S=[],L={},w=!0,x=!1,k={},B()}function he(e,t=v){a&&T({level:e,category:null,label:e,difficulty:t})}function ce(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function B(){if(!a)return;const e=m[f];if(!e)return re();x=!1;const t=Math.round(f/m.length*100),s=w?`Recovery · ${b.label}`:b.label,c=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${f+1} of ${m.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${w?"🔄":"📖"} ${u(s)}</span>
        ${ce()}
        <span class="sfq-progress" aria-label="Question ${f+1} of ${m.length}">${f+1}/${m.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${u(O(e.category))}${v==="challenge"?" · PSLE Challenge":""}</p>
      ${v==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${u(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${c.map(r=>`<button class="pt-choice-btn" data-choice="${I(r)}" aria-label="Choose ${I(r)}">${u(r)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,a.querySelectorAll("[data-choice]").forEach(r=>{r.addEventListener("click",()=>{if(x)return;x=!0;const l=r.dataset.choice,d=l===e.answer;d?(_+=1,q+=1,y=Math.max(y,q),Q.recordCorrect()):(q=0,S.push(e),Q.recordWrong());const h=L[e.category]||(L[e.category]={correct:0,total:0});h.total+=1,d&&(h.correct+=1),R.updateSkill("vocabMcq",e.category,d),R.recordAttempt({quest:"vocabMcq",skill:e.category,correct:d,level:b.level||"Mixed"}),a.querySelectorAll("[data-choice]").forEach(n=>{n.disabled=!0,n.setAttribute("aria-disabled","true"),n.dataset.choice===e.answer?n.classList.add("pt-choice--correct"):n===r&&!d&&n.classList.add("pt-choice--wrong")});const p=a.querySelector("#vmcq-hint");let $=J(e,l,d,{showClueWords:v!=="challenge"});if(d?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!d){const n=K("vocabMcq",e.category);n&&n.type==="redirect"&&($+=` <br>💡 ${u(n.message)}`)}if(!d&&k[e.category]>=2){const n=V(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(n.rule)}<br><em>${u(n.example)}</em></span>`}p&&(p.innerHTML=$);const C=a.querySelector("#vmcq-next-wrap"),g=a.querySelector("#vmcq-next");if(C&&g){const n=f+1>=m.length;g.textContent=n?"See Results →":"Next →",g.setAttribute("aria-label",n?"See results":"Next question"),C.style.display="",g.addEventListener("click",()=>{f+=1,B()}),g.focus()}})});const i=a.querySelector("#vmcq-rule-hint"),o=a.querySelector("#vmcq-hint-panel");i&&o&&i.addEventListener("click",()=>{const r=o.hidden;if(o.hidden=!r,i.setAttribute("aria-expanded",String(r)),i.textContent=r?"💡 Hide Rule":"💡 Show Rule",r){const l=V(e.category);o.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(l.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(l.example)}</em></p>
          <p class="mcq-hint-tip">${u(l.tip)}</p>`}})}function le(){const e=Object.entries(L).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,c])=>({cat:s,pct:Math.round(c.correct/c.total*100),correct:c.correct,total:c.total})).sort((s,c)=>s.pct-c.pct).map(({cat:s,pct:c,correct:i,total:o})=>{const r=c>=70?"var(--color-success)":c>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${c<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(O(s))}</th>
          <td class="sq-skill-score">${i}/${o}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${c}%;background:${r}"></div></div></td>
          <td class="sq-skill-pct">${c}%${c<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function ae(e,t){var i,o;const s=V(e),c=E[e]||{icon:"📖",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${I(c.label)}">
      <div class="mcq-rule-icon">${c.icon}</div>
      <h2 class="mcq-rule-title">${u(c.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${u(s.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${u(s.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${u(s.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">Skip →</button>
      </div>
    </div>`,(i=a.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",t),(o=a.querySelector("#mcq-rule-skip"))==null||o.addEventListener("click",t)}function re(){var r,l,d;const e=m.length;if(e===0){F();return}const t=Math.round(_/e*100),s=t>=90?3:t>=70?2:t>0?1:0,c=S.length>0,i=le();let o="";if(t<70){const h=Object.entries(L).filter(([,p])=>p.total>0);if(h.length>0){const[p]=h.sort(([,g],[,n])=>g.correct/g.total-n.correct/n.total)[0],$=V(p),C=E[p]||{icon:"📖",label:p};o=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${C.icon} Focus area: ${u(C.label)}</p>
          <p class="mcq-focus-tip-rule">${u($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u($.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${w?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${_}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${i}${o}
      <div class="sfq-actions">
        ${c?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${c?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,c&&((r=a.querySelector("#vmcq-recovery"))==null||r.addEventListener("click",()=>se())),(l=a.querySelector("#vmcq-replay"))==null||l.addEventListener("click",()=>T(b)),(d=a.querySelector("#vmcq-menu"))==null||d.addEventListener("click",()=>F())}export{be as cleanupVocabMcq,P as countItemsForScope,X as getAllItems,Z as getCategoryCounts,D as getItemsForScope,ee as getLevelCounts,ve as initVocabMcq,F as showVocabMcqBrowser,he as startVocabMcqLevel};
