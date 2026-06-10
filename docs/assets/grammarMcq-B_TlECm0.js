import{q as G}from"./questMastery-BInEbfBm.js";import{s as E,r as D,q as u,o as F}from"./index-CM1ztChD.js";import{G as L,a as I,b as z}from"./grammarMcq-Zo-JsYD-.js";import{a as V,c as X,G as B}from"./grammarCategories-sjlxVdzw.js";import{c as J}from"./remediationRouter-BbQCYeDF.js";import{r as Z,M as ee,f as te,b as se}from"./mcqDifficulty-DhgJSmwz.js";import{g as T}from"./grammarTips-pN70s6Pj.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";import"./vocabCategories-CkmW2x1_.js";let c=null,R=null,p=[],f=0,x=0,C=!1,h={level:null,category:null,label:"All Skills",difficulty:"normal"},g="normal",q=0,y=0,S=[],M=!1,w={},k={},j=0;const N=3;function O(e){return`gmcq:${e}`}function re(e){return!!(E.get("lessonsSeen")||{})[O(e)]}function le(e){const t={...E.get("lessonsSeen")||{}};t[O(e)]||(t[O(e)]=new Date().toISOString(),E.set("lessonsSeen",t))}function Se(e,t){c=e,R=t}function Me(){c&&(c.innerHTML="")}function ce(e=L){return I.flatMap(t=>e[t]||[])}function W({level:e=null,category:t=null}={},s=L){const r=e?s[e]||[]:ce(s);return t?r.filter(i=>i.category===t):r}function K(e={},t=L){return W(e,t).length}function ae(e=L,t=V){return t.map(s=>{const r={};let i=0;for(const n of I){const a=K({level:n,category:s},e);r[n]=a,i+=a}return{category:s,total:i,levels:r}})}function ie(e=L,t=I){return t.map(s=>({level:s,total:K({level:s},e)}))}function Q(e){var t;return((t=B[e])==null?void 0:t.label)||e}function ne(e){const t=e.level||null,s=e.category?Q(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function P(){if(!c)return;const e=ie(),t=ae();let s=h.level||"P1",r=h.difficulty||g||"normal";const i=()=>{var n,a;c.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise grammar concepts within that level.</p>

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
          ${Z({selected:r,prefix:"gmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Grammar Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.filter(({category:l})=>X(l,s)).map(({category:l,levels:d})=>{const b=d[s]||0,m=B[l]||{icon:"🧩",label:l};return b?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${l}">
                  <div class="mcq-skill-title">${m.icon} ${m.label}</div>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${b} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${m.icon} ${m.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`,c.querySelectorAll("[data-pick-level]").forEach(l=>{l.addEventListener("click",()=>{s=l.dataset.pickLevel,i()})}),c.querySelectorAll("[data-gmcq-difficulty]").forEach(l=>{l.addEventListener("click",()=>{r=l.dataset.gmcqDifficulty,i()})}),(n=c.querySelector("#gmcq-start-level"))==null||n.addEventListener("click",()=>{H({level:s,category:null,difficulty:r})}),c.querySelectorAll("[data-scope-level][data-scope-category]").forEach(l=>{l.addEventListener("click",()=>{H({level:l.dataset.scopeLevel,category:l.dataset.scopeCategory,difficulty:r})})}),(a=c.querySelector("#gmcq-home"))==null||a.addEventListener("click",()=>R==null?void 0:R())};i()}function U(e){return[...e].sort((t,s)=>{const r=G.getSkillScore("grammarMcq",t.category),i=G.getSkillScore("grammarMcq",s.category);return r-i+(Math.random()-.5)*.3})}function H({level:e=null,category:t=null,label:s="",difficulty:r=g}={}){var a;g=((a=ee[r])==null?void 0:a.key)||"normal",h={level:e,category:t,label:s||ne({level:e,category:t}),difficulty:g};const i=e?{[e]:z(e)}:Object.fromEntries(I.map(l=>[l,L[l]]));p=U(te(W({level:e,category:t},i),{level:e,difficulty:g}));const n=E.get("paperItemLimit");n&&(E.set("paperItemLimit",null),p=p.slice(0,n)),f=0,x=0,q=0,y=0,S=[],w={},M=!1,C=!1,k={},j=0,h.category&&!M?Y(h.category,()=>A()):A()}function oe(){p=U(S),f=0,x=0,q=0,y=0,S=[],w={},M=!0,C=!1,k={},j=N,A()}function we(e,t=g){c&&H({level:e,category:null,label:e,difficulty:t})}function ue(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function A(){if(!c)return;const e=p[f];if(!e)return me();if(!re(e.category)&&j<N)return Y(e.category,()=>A());C=!1;const t=Math.round(f/p.length*100),s=M?`Recovery · ${h.label}`:h.label,r=[...e.choices].sort(()=>Math.random()-.5);c.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${f+1} of ${p.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${M?"🔄":"🧠"} ${u(s)}</span>
        ${ue()}
        <span class="sfq-progress" aria-label="Question ${f+1} of ${p.length}">${f+1}/${p.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${u(Q(e.category))}${g==="challenge"?" · PSLE Challenge":""}</p>
      ${g==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${u(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${r.map(a=>`<button class="pt-choice-btn" data-choice="${D(a)}" aria-label="Choose ${D(a)}">${u(a)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,c.querySelectorAll("[data-choice]").forEach(a=>{a.addEventListener("click",()=>{if(C)return;C=!0;const l=a.dataset.choice,d=l===e.answer;d?(x+=1,q+=1,y=Math.max(y,q),F.recordCorrect()):(q=0,S.push(e),F.recordWrong());const b=w[e.category]||(w[e.category]={correct:0,total:0});b.total+=1,d&&(b.correct+=1),G.updateSkill("grammarMcq",e.category,d),G.recordAttempt({quest:"grammarMcq",skill:e.category,correct:d,level:h.level||"Mixed"}),c.querySelectorAll("[data-choice]").forEach(o=>{o.disabled=!0,o.setAttribute("aria-disabled","true"),o.dataset.choice===e.answer?o.classList.add("pt-choice--correct"):o===a&&!d&&o.classList.add("pt-choice--wrong")});const m=c.querySelector("#gmcq-hint");let $=se(e,l,d,{showClueWords:g!=="challenge"});if(d?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!d){const o=J("grammarMcq",e.category);o&&o.type==="redirect"&&($+=` <br>💡 ${u(o.message)}`)}if(!d&&k[e.category]>=2){const o=T(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(o.rule)}<br><em>${u(o.example)}</em></span>`}m&&(m.innerHTML=$);const _=c.querySelector("#gmcq-next-wrap"),v=c.querySelector("#gmcq-next");if(_&&v){const o=f+1>=p.length;v.textContent=o?"See Results →":"Next →",v.setAttribute("aria-label",o?"See results":"Next question"),_.style.display="",v.addEventListener("click",()=>{f+=1,A()}),v.focus()}})});const i=c.querySelector("#gmcq-rule-hint"),n=c.querySelector("#gmcq-hint-panel");i&&n&&i.addEventListener("click",()=>{const a=n.hidden;if(n.hidden=!a,i.setAttribute("aria-expanded",String(a)),i.textContent=a?"💡 Hide Rule":"💡 Show Rule",a){const l=T(e.category);n.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(l.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(l.example)}</em></p>
          <p class="mcq-hint-tip">${u(l.tip)}</p>`}})}function de(){const e=Object.entries(w).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,r])=>({cat:s,pct:Math.round(r.correct/r.total*100),correct:r.correct,total:r.total})).sort((s,r)=>s.pct-r.pct).map(({cat:s,pct:r,correct:i,total:n})=>{const a=r>=70?"var(--color-success)":r>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${r<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(Q(s))}</th>
          <td class="sq-skill-score">${i}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${r}%;background:${a}"></div></div></td>
          <td class="sq-skill-pct">${r}%${r<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function Y(e,t){var i,n;j+=1,le(e);const s=T(e),r=B[e]||{icon:"🧠",label:e};c.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${D(r.label)}">
      <div class="mcq-rule-icon">${r.icon}</div>
      <h2 class="mcq-rule-title">${u(r.label)}</h2>
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
    </div>`,(i=c.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",t),(n=c.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function me(){var a,l,d;const e=p.length;if(e===0){P();return}const t=Math.round(x/e*100),s=t>=90?3:t>=70?2:t>0?1:0,r=S.length>0,i=de();let n="";if(t<70){const b=Object.entries(w).filter(([,m])=>m.total>0);if(b.length>0){const[m]=b.sort(([,v],[,o])=>v.correct/v.total-o.correct/o.total)[0],$=T(m),_=B[m]||{icon:"🧠",label:m};n=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${_.icon} Focus area: ${u(_.label)}</p>
          <p class="mcq-focus-tip-rule">${u($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u($.tip)}</p>
        </div>`}}c.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${M?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${x}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${i}${n}
      <div class="sfq-actions">
        ${r?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${r?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,r&&((a=c.querySelector("#gmcq-recovery"))==null||a.addEventListener("click",()=>oe())),(l=c.querySelector("#gmcq-replay"))==null||l.addEventListener("click",()=>H(h)),(d=c.querySelector("#gmcq-menu"))==null||d.addEventListener("click",()=>P())}export{Me as cleanupGrammarMcq,K as countItemsForScope,ce as getAllItems,ae as getCategoryCounts,W as getItemsForScope,ie as getLevelCounts,Se as initGrammarMcq,P as showGrammarMcqBrowser,we as startGrammarMcqLevel};
