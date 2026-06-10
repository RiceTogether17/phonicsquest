import{m as U,a as M,s as E,q as V,z as j,y as d,x as F,E as Y}from"./index-BjQGCboo.js";import{V as C,a as I,b as X}from"./vocabMcq-C6piviqh.js";import{r as J,M as Z,f as ee,b as te,a as se,c as le}from"./mcqDifficulty-DktIcPnA.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";import"./aiService-CYVHoJXN.js";import"./askGiriButton-dz_jCY38.js";import"./aiGuardrails-BL8OKwhk.js";function B(e){const t=M[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let a=null,T=null,m=[],v=0,A=0,x=!1,q={level:null,category:null,label:"All Skills",difficulty:"normal"},b="normal",f=0,y=0,S=[],w=!1,L={},k={},O=0;const G=3;function D(e){return`vmcq:${e}`}function ce(e){return!!(E.get("lessonsSeen")||{})[D(e)]}function ae(e){const t={...E.get("lessonsSeen")||{}};t[D(e)]||(t[D(e)]=new Date().toISOString(),E.set("lessonsSeen",t))}function ke(e,t){a=e,T=t}function Se(){a&&(a.innerHTML="")}function re(e=C){return I.flatMap(t=>e[t]||[])}function N({level:e=null,category:t=null}={},s=C){const l=e?s[e]||[]:re(s);return t?l.filter(i=>i.category===t):l}function W(e={},t=C){return N(e,t).length}function ie(e=C,t=U){return t.map(s=>{const l={};let i=0;for(const n of I){const r=W({level:n,category:s},e);l[n]=r,i+=r}return{category:s,total:i,levels:l}})}function ne(e=C,t=I){return t.map(s=>({level:s,total:W({level:s},e)}))}function Q(e){var t;return((t=M[e])==null?void 0:t.label)||e}function oe(e){const t=e.level||null,s=e.category?Q(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function P(){if(!a)return;const e=ne(),t=ie();let s=q.level||"P1",l=q.difficulty||b||"normal";const i=()=>{var n,r;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise vocabulary concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:c,total:o})=>`
              <button class="sfq-level-btn mcq-level-card ${c===s?"mcq-level-card--active":""}" data-pick-level="${c}">
                <span class="sfq-level-name">${c}</span>
                <span class="mcq-count-badge">${o} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${J({selected:l,prefix:"vmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Vocabulary Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.map(({category:c,levels:o})=>{const h=o[s]||0,p=M[c]||{icon:"📘",label:c,desc:""};return h?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${c}">
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
      </div>`,a.querySelectorAll("[data-pick-level]").forEach(c=>{c.addEventListener("click",()=>{s=c.dataset.pickLevel,i()})}),a.querySelectorAll("[data-vmcq-difficulty]").forEach(c=>{c.addEventListener("click",()=>{l=c.dataset.vmcqDifficulty,i()})}),(n=a.querySelector("#vmcq-start-level"))==null||n.addEventListener("click",()=>{H({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(c=>{c.addEventListener("click",()=>{H({level:c.dataset.scopeLevel,category:c.dataset.scopeCategory,difficulty:l})})}),(r=a.querySelector("#vmcq-home"))==null||r.addEventListener("click",()=>T==null?void 0:T())};i()}function K(e){return[...e].sort((t,s)=>{const l=V.getSkillScore("vocabMcq",t.category),i=V.getSkillScore("vocabMcq",s.category);return l-i+(Math.random()-.5)*.3})}function H({level:e=null,category:t=null,label:s="",difficulty:l=b}={}){var r;b=((r=Z[l])==null?void 0:r.key)||"normal",q={level:e,category:t,label:s||oe({level:e,category:t}),difficulty:b};const i=e?{[e]:X(e)}:Object.fromEntries(I.map(c=>[c,C[c]]));m=K(ee(N({level:e,category:t},i),{level:e,difficulty:b}));const n=E.get("paperItemLimit");n&&(E.set("paperItemLimit",null),m=m.slice(0,n)),v=0,A=0,f=0,y=0,S=[],L={},w=!1,x=!1,k={},O=0,q.category&&!w?z(q.category,()=>R()):R()}function ue(){m=K(S),v=0,A=0,f=0,y=0,S=[],L={},w=!0,x=!1,k={},O=G,R()}function we(e,t=b){a&&H({level:e,category:null,label:e,difficulty:t})}function de(){if(f<2)return"";const e=f>=10?"🔥":f>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${f} in a row">${e} ${f}</span>`}function R(){if(!a)return;const e=m[v];if(!e)return me();if(!ce(e.category)&&O<G)return z(e.category,()=>R());x=!1;const t=Math.round(v/m.length*100),s=w?`Recovery · ${q.label}`:q.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${v+1} of ${m.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${w?"🔄":"📖"} ${d(s)}</span>
        ${de()}
        <span class="sfq-progress" aria-label="Question ${v+1} of ${m.length}">${v+1}/${m.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${d(Q(e.category))}${b==="challenge"?" · PSLE Challenge":""}</p>
      ${b==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${d(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(r=>`<button class="pt-choice-btn" data-choice="${j(r)}" aria-label="Choose ${j(r)}">${d(r)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,a.querySelectorAll("[data-choice]").forEach(r=>{r.addEventListener("click",()=>{if(x)return;x=!0;const c=r.dataset.choice,o=c===e.answer;o?(A+=1,f+=1,y=Math.max(y,f),F.recordCorrect()):(f=0,S.push(e),F.recordWrong());const h=L[e.category]||(L[e.category]={correct:0,total:0});h.total+=1,o&&(h.correct+=1),V.updateSkill("vocabMcq",e.category,o),V.recordAttempt({quest:"vocabMcq",skill:e.category,correct:o,level:q.level||"Mixed"}),a.querySelectorAll("[data-choice]").forEach(u=>{u.disabled=!0,u.setAttribute("aria-disabled","true"),u.dataset.choice===e.answer?u.classList.add("pt-choice--correct"):u===r&&!o&&u.classList.add("pt-choice--wrong")});const p=a.querySelector("#vmcq-hint");let $=te(e,c,o,{showClueWords:b!=="challenge"});if(o?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!o){const u=Y("vocabMcq",e.category);u&&u.type==="redirect"&&($+=` <br>💡 ${d(u.message)}`)}if(!o&&k[e.category]>=2){const u=B(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${d(u.rule)}<br><em>${d(u.example)}</em></span>`}p&&(p.innerHTML=$,se(p,{item:e,selectedChoice:c,level:q.level||e.level}));const _=a.querySelector("#vmcq-next-wrap"),g=a.querySelector("#vmcq-next");if(_&&g){const u=v+1>=m.length;g.textContent=u?"See Results →":"Next →",g.setAttribute("aria-label",u?"See results":"Next question"),_.style.display="",g.addEventListener("click",()=>{v+=1,R()}),g.focus()}})});const i=a.querySelector("#vmcq-rule-hint"),n=a.querySelector("#vmcq-hint-panel");i&&n&&i.addEventListener("click",()=>{var c;const r=n.hidden;if(n.hidden=!r,i.setAttribute("aria-expanded",String(r)),i.textContent=r?"💡 Hide Rule":"💡 Show Rule",r){const o=B(e.category);n.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${d(o.rule)}</p>
          <p class="mcq-hint-eg"><em>${d(o.example)}</em></p>
          <p class="mcq-hint-tip">${d(o.tip)}</p>`,le(n,{item:e,categoryLabel:((c=M[e.category])==null?void 0:c.label)||e.category,level:q.level||e.level})}})}function pe(){const e=Object.entries(L).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:i,total:n})=>{const r=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${d(Q(s))}</th>
          <td class="sq-skill-score">${i}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${r}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function z(e,t){var i,n;O+=1,ae(e);const s=B(e),l=M[e]||{icon:"📖",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${j(l.label)}">
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
    </div>`,(i=a.querySelector("#mcq-rule-start"))==null||i.addEventListener("click",t),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function me(){var r,c,o;const e=m.length;if(e===0){P();return}const t=Math.round(A/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=S.length>0,i=pe();let n="";if(t<70){const h=Object.entries(L).filter(([,p])=>p.total>0);if(h.length>0){const[p]=h.sort(([,g],[,u])=>g.correct/g.total-u.correct/u.total)[0],$=B(p),_=M[p]||{icon:"📖",label:p};n=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${_.icon} Focus area: ${d(_.label)}</p>
          <p class="mcq-focus-tip-rule">${d($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${d($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${d($.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${w?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${A}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${i}${n}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((r=a.querySelector("#vmcq-recovery"))==null||r.addEventListener("click",()=>ue())),(c=a.querySelector("#vmcq-replay"))==null||c.addEventListener("click",()=>H(q)),(o=a.querySelector("#vmcq-menu"))==null||o.addEventListener("click",()=>P())}export{Se as cleanupVocabMcq,W as countItemsForScope,re as getAllItems,ie as getCategoryCounts,N as getItemsForScope,ne as getLevelCounts,ke as initVocabMcq,P as showVocabMcqBrowser,we as startVocabMcqLevel};
