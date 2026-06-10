import{l as Y,B as V,G as I,s as E,q as G,y as j,x as u,w as F,D as X,z as T}from"./index-Bku_Opw4.js";import{G as L,a as B,b as J}from"./grammarMcq--9r6bHnl.js";import{r as Z,M as ee,f as te,b as se}from"./mcqDifficulty-BTA9ObFw.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";let a=null,R=null,p=[],f=0,x=0,C=!1,h={level:null,category:null,label:"All Skills",difficulty:"normal"},g="normal",q=0,y=0,S=[],M=!1,w={},k={},D=0;const N=3;function O(e){return`gmcq:${e}`}function le(e){return!!(E.get("lessonsSeen")||{})[O(e)]}function re(e){const t={...E.get("lessonsSeen")||{}};t[O(e)]||(t[O(e)]=new Date().toISOString(),E.set("lessonsSeen",t))}function be(e,t){a=e,R=t}function ve(){a&&(a.innerHTML="")}function ae(e=L){return B.flatMap(t=>e[t]||[])}function W({level:e=null,category:t=null}={},s=L){const l=e?s[e]||[]:ae(s);return t?l.filter(i=>i.category===t):l}function K(e={},t=L){return W(e,t).length}function ce(e=L,t=Y){return t.map(s=>{const l={};let i=0;for(const n of B){const c=K({level:n,category:s},e);l[n]=c,i+=c}return{category:s,total:i,levels:l}})}function ie(e=L,t=B){return t.map(s=>({level:s,total:K({level:s},e)}))}function Q(e){var t;return((t=I[e])==null?void 0:t.label)||e}function ne(e){const t=e.level||null,s=e.category?Q(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function P(){if(!a)return;const e=ie(),t=ce();let s=h.level||"P1",l=h.difficulty||g||"normal";const i=()=>{var n,c;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise grammar concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:r,total:d})=>`
              <button class="sfq-level-btn mcq-level-card ${r===s?"mcq-level-card--active":""}" data-pick-level="${r}">
                <span class="sfq-level-name">${r}</span>
                <span class="mcq-count-badge">${d} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${Z({selected:l,prefix:"gmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Grammar Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.filter(({category:r})=>V(r,s)).map(({category:r,levels:d})=>{const b=d[s]||0,m=I[r]||{icon:"🧩",label:r};return b?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${r}">
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
      </div>`,a.querySelectorAll("[data-pick-level]").forEach(r=>{r.addEventListener("click",()=>{s=r.dataset.pickLevel,i()})}),a.querySelectorAll("[data-gmcq-difficulty]").forEach(r=>{r.addEventListener("click",()=>{l=r.dataset.gmcqDifficulty,i()})}),(n=a.querySelector("#gmcq-start-level"))==null||n.addEventListener("click",()=>{H({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(r=>{r.addEventListener("click",()=>{H({level:r.dataset.scopeLevel,category:r.dataset.scopeCategory,difficulty:l})})}),(c=a.querySelector("#gmcq-home"))==null||c.addEventListener("click",()=>R==null?void 0:R())};i()}function z(e){return[...e].sort((t,s)=>{const l=G.getSkillScore("grammarMcq",t.category),i=G.getSkillScore("grammarMcq",s.category);return l-i+(Math.random()-.5)*.3})}function H({level:e=null,category:t=null,label:s="",difficulty:l=g}={}){var c;g=((c=ee[l])==null?void 0:c.key)||"normal",h={level:e,category:t,label:s||ne({level:e,category:t}),difficulty:g};const i=e?{[e]:J(e)}:Object.fromEntries(B.map(r=>[r,L[r]]));p=z(te(W({level:e,category:t},i),{level:e,difficulty:g}));const n=E.get("paperItemLimit");n&&(E.set("paperItemLimit",null),p=p.slice(0,n)),f=0,x=0,q=0,y=0,S=[],w={},M=!1,C=!1,k={},D=0,h.category&&!M?U(h.category,()=>A()):A()}function oe(){p=z(S),f=0,x=0,q=0,y=0,S=[],w={},M=!0,C=!1,k={},D=N,A()}function ye(e,t=g){a&&H({level:e,category:null,label:e,difficulty:t})}function ue(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function A(){if(!a)return;const e=p[f];if(!e)return me();if(!le(e.category)&&D<N)return U(e.category,()=>A());C=!1;const t=Math.round(f/p.length*100),s=M?`Recovery · ${h.label}`:h.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
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
        ${l.map(c=>`<button class="pt-choice-btn" data-choice="${j(c)}" aria-label="Choose ${j(c)}">${u(c)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,a.querySelectorAll("[data-choice]").forEach(c=>{c.addEventListener("click",()=>{if(C)return;C=!0;const r=c.dataset.choice,d=r===e.answer;d?(x+=1,q+=1,y=Math.max(y,q),F.recordCorrect()):(q=0,S.push(e),F.recordWrong());const b=w[e.category]||(w[e.category]={correct:0,total:0});b.total+=1,d&&(b.correct+=1),G.updateSkill("grammarMcq",e.category,d),G.recordAttempt({quest:"grammarMcq",skill:e.category,correct:d,level:h.level||"Mixed"}),a.querySelectorAll("[data-choice]").forEach(o=>{o.disabled=!0,o.setAttribute("aria-disabled","true"),o.dataset.choice===e.answer?o.classList.add("pt-choice--correct"):o===c&&!d&&o.classList.add("pt-choice--wrong")});const m=a.querySelector("#gmcq-hint");let $=se(e,r,d,{showClueWords:g!=="challenge"});if(d?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!d){const o=X("grammarMcq",e.category);o&&o.type==="redirect"&&($+=` <br>💡 ${u(o.message)}`)}if(!d&&k[e.category]>=2){const o=T(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(o.rule)}<br><em>${u(o.example)}</em></span>`}m&&(m.innerHTML=$);const _=a.querySelector("#gmcq-next-wrap"),v=a.querySelector("#gmcq-next");if(_&&v){const o=f+1>=p.length;v.textContent=o?"See Results →":"Next →",v.setAttribute("aria-label",o?"See results":"Next question"),_.style.display="",v.addEventListener("click",()=>{f+=1,A()}),v.focus()}})});const i=a.querySelector("#gmcq-rule-hint"),n=a.querySelector("#gmcq-hint-panel");i&&n&&i.addEventListener("click",()=>{const c=n.hidden;if(n.hidden=!c,i.setAttribute("aria-expanded",String(c)),i.textContent=c?"💡 Hide Rule":"💡 Show Rule",c){const r=T(e.category);n.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(r.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(r.example)}</em></p>
          <p class="mcq-hint-tip">${u(r.tip)}</p>`}})}function de(){const e=Object.entries(w).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:i,total:n})=>{const c=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(Q(s))}</th>
          <td class="sq-skill-score">${i}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${c}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function U(e,t){var i,n;D+=1,re(e);const s=T(e),l=I[e]||{icon:"🧠",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${j(l.label)}">
      <div class="mcq-rule-icon">${l.icon}</div>
      <h2 class="mcq-rule-title">${u(l.label)}</h2>
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
    </div>`,(i=a.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",t),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function me(){var c,r,d;const e=p.length;if(e===0){P();return}const t=Math.round(x/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=S.length>0,i=de();let n="";if(t<70){const b=Object.entries(w).filter(([,m])=>m.total>0);if(b.length>0){const[m]=b.sort(([,v],[,o])=>v.correct/v.total-o.correct/o.total)[0],$=T(m),_=I[m]||{icon:"🧠",label:m};n=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${_.icon} Focus area: ${u(_.label)}</p>
          <p class="mcq-focus-tip-rule">${u($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u($.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${M?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${x}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${i}${n}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((c=a.querySelector("#gmcq-recovery"))==null||c.addEventListener("click",()=>oe())),(r=a.querySelector("#gmcq-replay"))==null||r.addEventListener("click",()=>H(h)),(d=a.querySelector("#gmcq-menu"))==null||d.addEventListener("click",()=>P())}export{ve as cleanupGrammarMcq,K as countItemsForScope,ae as getAllItems,ce as getCategoryCounts,W as getItemsForScope,ie as getLevelCounts,be as initGrammarMcq,P as showGrammarMcqBrowser,ye as startGrammarMcqLevel};
