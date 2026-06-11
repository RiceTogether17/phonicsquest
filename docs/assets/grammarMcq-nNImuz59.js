import{l as Y,F as V,G as R,s as E,q as T,z as D,y as d,x as Q,H as X,A as H}from"./index-B2cBlLZM.js";import{G as L,a as B,b as J}from"./grammarMcq-eUQGGDkA.js";import{r as Z,M as ee,f as te,b as se,a as le,c as ae}from"./mcqDifficulty-i44BH8ac.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";let r=null,G=null,p=[],g=0,x=0,C=!1,q={level:null,category:null,label:"All Skills",difficulty:"normal"},h="normal",f=0,y=0,S=[],M=!1,w={},k={},j=0;const N=3;function F(e){return`gmcq:${e}`}function re(e){return!!(E.get("lessonsSeen")||{})[F(e)]}function ce(e){const t={...E.get("lessonsSeen")||{}};t[F(e)]||(t[F(e)]=new Date().toISOString(),E.set("lessonsSeen",t))}function ye(e,t){r=e,G=t}function $e(){r&&(r.innerHTML="")}function ie(e=L){return B.flatMap(t=>e[t]||[])}function W({level:e=null,category:t=null}={},s=L){const l=e?s[e]||[]:ie(s);return t?l.filter(i=>i.category===t):l}function K(e={},t=L){return W(e,t).length}function ne(e=L,t=Y){return t.map(s=>{const l={};let i=0;for(const n of B){const c=K({level:n,category:s},e);l[n]=c,i+=c}return{category:s,total:i,levels:l}})}function oe(e=L,t=B){return t.map(s=>({level:s,total:K({level:s},e)}))}function O(e){var t;return((t=R[e])==null?void 0:t.label)||e}function ue(e){const t=e.level||null,s=e.category?O(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function P(){if(!r)return;const e=oe(),t=ne();let s=q.level||"P1",l=q.difficulty||h||"normal";const i=()=>{var n,c;r.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise grammar concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:a,total:o})=>`
              <button class="sfq-level-btn mcq-level-card ${a===s?"mcq-level-card--active":""}" data-pick-level="${a}">
                <span class="sfq-level-name">${a}</span>
                <span class="mcq-count-badge">${o} items</span>
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
            ${t.filter(({category:a})=>V(a,s)).map(({category:a,levels:o})=>{const b=o[s]||0,m=R[a]||{icon:"🧩",label:a};return b?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${a}">
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
      </div>`,r.querySelectorAll("[data-pick-level]").forEach(a=>{a.addEventListener("click",()=>{s=a.dataset.pickLevel,i()})}),r.querySelectorAll("[data-gmcq-difficulty]").forEach(a=>{a.addEventListener("click",()=>{l=a.dataset.gmcqDifficulty,i()})}),(n=r.querySelector("#gmcq-start-level"))==null||n.addEventListener("click",()=>{I({level:s,category:null,difficulty:l})}),r.querySelectorAll("[data-scope-level][data-scope-category]").forEach(a=>{a.addEventListener("click",()=>{I({level:a.dataset.scopeLevel,category:a.dataset.scopeCategory,difficulty:l})})}),(c=r.querySelector("#gmcq-home"))==null||c.addEventListener("click",()=>G==null?void 0:G())};i()}function z(e){return[...e].sort((t,s)=>{const l=T.getSkillScore("grammarMcq",t.category),i=T.getSkillScore("grammarMcq",s.category);return l-i+(Math.random()-.5)*.3})}function I({level:e=null,category:t=null,label:s="",difficulty:l=h}={}){var c;h=((c=ee[l])==null?void 0:c.key)||"normal",q={level:e,category:t,label:s||ue({level:e,category:t}),difficulty:h};const i=e?{[e]:J(e)}:Object.fromEntries(B.map(a=>[a,L[a]]));p=z(te(W({level:e,category:t},i),{level:e,difficulty:h}));const n=E.get("paperItemLimit");n&&(E.set("paperItemLimit",null),p=p.slice(0,n)),g=0,x=0,f=0,y=0,S=[],w={},M=!1,C=!1,k={},j=0,q.category&&!M?U(q.category,()=>A()):A()}function de(){p=z(S),g=0,x=0,f=0,y=0,S=[],w={},M=!0,C=!1,k={},j=N,A()}function ke(e,t=h){r&&I({level:e,category:null,label:e,difficulty:t})}function me(){if(f<2)return"";const e=f>=10?"🔥":f>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${f} in a row">${e} ${f}</span>`}function A(){if(!r)return;const e=p[g];if(!e)return qe();if(!re(e.category)&&j<N)return U(e.category,()=>A());C=!1;const t=Math.round(g/p.length*100),s=M?`Recovery · ${q.label}`:q.label,l=[...e.choices].sort(()=>Math.random()-.5);r.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${g+1} of ${p.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${M?"🔄":"🧠"} ${d(s)}</span>
        ${me()}
        <span class="sfq-progress" aria-label="Question ${g+1} of ${p.length}">${g+1}/${p.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${d(O(e.category))}${h==="challenge"?" · PSLE Challenge":""}</p>
      ${h==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${d(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(c=>`<button class="pt-choice-btn" data-choice="${D(c)}" aria-label="Choose ${D(c)}">${d(c)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,r.querySelectorAll("[data-choice]").forEach(c=>{c.addEventListener("click",()=>{if(C)return;C=!0;const a=c.dataset.choice,o=a===e.answer;o?(x+=1,f+=1,y=Math.max(y,f),Q.recordCorrect()):(f=0,S.push(e),Q.recordWrong());const b=w[e.category]||(w[e.category]={correct:0,total:0});b.total+=1,o&&(b.correct+=1),T.updateSkill("grammarMcq",e.category,o),T.recordAttempt({quest:"grammarMcq",skill:e.category,correct:o,level:q.level||"Mixed"}),r.querySelectorAll("[data-choice]").forEach(u=>{u.disabled=!0,u.setAttribute("aria-disabled","true"),u.dataset.choice===e.answer?u.classList.add("pt-choice--correct"):u===c&&!o&&u.classList.add("pt-choice--wrong")});const m=r.querySelector("#gmcq-hint");let $=se(e,a,o,{showClueWords:h!=="challenge"});if(o?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!o){const u=X("grammarMcq",e.category);u&&u.type==="redirect"&&($+=` <br>💡 ${d(u.message)}`)}if(!o&&k[e.category]>=2){const u=H(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${d(u.rule)}<br><em>${d(u.example)}</em></span>`}m&&(m.innerHTML=$,le(m,{item:e,selectedChoice:a,level:q.level||e.level}));const _=r.querySelector("#gmcq-next-wrap"),v=r.querySelector("#gmcq-next");if(_&&v){const u=g+1>=p.length;v.textContent=u?"See Results →":"Next →",v.setAttribute("aria-label",u?"See results":"Next question"),_.style.display="",v.addEventListener("click",()=>{g+=1,A()}),v.focus()}})});const i=r.querySelector("#gmcq-rule-hint"),n=r.querySelector("#gmcq-hint-panel");i&&n&&i.addEventListener("click",()=>{var a;const c=n.hidden;if(n.hidden=!c,i.setAttribute("aria-expanded",String(c)),i.textContent=c?"💡 Hide Rule":"💡 Show Rule",c){const o=H(e.category);n.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${d(o.rule)}</p>
          <p class="mcq-hint-eg"><em>${d(o.example)}</em></p>
          <p class="mcq-hint-tip">${d(o.tip)}</p>`,ae(n,{item:e,categoryLabel:((a=R[e.category])==null?void 0:a.label)||e.category,level:q.level||e.level})}})}function pe(){const e=Object.entries(w).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:i,total:n})=>{const c=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${d(O(s))}</th>
          <td class="sq-skill-score">${i}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${c}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function U(e,t){var i,n;j+=1,ce(e);const s=H(e),l=R[e]||{icon:"🧠",label:e};r.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${D(l.label)}">
      <div class="mcq-rule-icon">${l.icon}</div>
      <h2 class="mcq-rule-title">${d(l.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${d(s.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${d(s.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${d(s.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">Skip →</button>
      </div>
    </div>`,(i=r.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",t),(n=r.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function qe(){var c,a,o;const e=p.length;if(e===0){P();return}const t=Math.round(x/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=S.length>0,i=pe();let n="";if(t<70){const b=Object.entries(w).filter(([,m])=>m.total>0);if(b.length>0){const[m]=b.sort(([,v],[,u])=>v.correct/v.total-u.correct/u.total)[0],$=H(m),_=R[m]||{icon:"🧠",label:m};n=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${_.icon} Focus area: ${d(_.label)}</p>
          <p class="mcq-focus-tip-rule">${d($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${d($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${d($.tip)}</p>
        </div>`}}r.innerHTML=`
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
    </div>`,l&&((c=r.querySelector("#gmcq-recovery"))==null||c.addEventListener("click",()=>de())),(a=r.querySelector("#gmcq-replay"))==null||a.addEventListener("click",()=>I(q)),(o=r.querySelector("#gmcq-menu"))==null||o.addEventListener("click",()=>P())}export{$e as cleanupGrammarMcq,K as countItemsForScope,ie as getAllItems,ne as getCategoryCounts,W as getItemsForScope,oe as getLevelCounts,ye as initGrammarMcq,P as showGrammarMcqBrowser,ke as startGrammarMcqLevel};
