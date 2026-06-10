import{m as Y,a as R,s as x,q as V,y as D,x as u,w as F,D as z}from"./index-Bku_Opw4.js";import{V as M,a as I,b as X}from"./vocabMcq-ChIVhEMF.js";import{r as J,M as Z,f as ee,b as te}from"./mcqDifficulty-BTA9ObFw.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";function B(e){const t=R[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let a=null,T=null,m=[],f=0,E=0,C=!1,b={level:null,category:null,label:"All Skills",difficulty:"normal"},v="normal",q=0,y=0,S=[],w=!1,L={},k={},O=0;const G=3;function j(e){return`vmcq:${e}`}function se(e){return!!(x.get("lessonsSeen")||{})[j(e)]}function le(e){const t={...x.get("lessonsSeen")||{}};t[j(e)]||(t[j(e)]=new Date().toISOString(),x.set("lessonsSeen",t))}function be(e,t){a=e,T=t}function he(){a&&(a.innerHTML="")}function ce(e=M){return I.flatMap(t=>e[t]||[])}function N({level:e=null,category:t=null}={},s=M){const l=e?s[e]||[]:ce(s);return t?l.filter(n=>n.category===t):l}function W(e={},t=M){return N(e,t).length}function ae(e=M,t=Y){return t.map(s=>{const l={};let n=0;for(const i of I){const r=W({level:i,category:s},e);l[i]=r,n+=r}return{category:s,total:n,levels:l}})}function re(e=M,t=I){return t.map(s=>({level:s,total:W({level:s},e)}))}function Q(e){var t;return((t=R[e])==null?void 0:t.label)||e}function ne(e){const t=e.level||null,s=e.category?Q(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function P(){if(!a)return;const e=re(),t=ae();let s=b.level||"P1",l=b.difficulty||v||"normal";const n=()=>{var i,r;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise vocabulary concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:c,total:d})=>`
              <button class="sfq-level-btn mcq-level-card ${c===s?"mcq-level-card--active":""}" data-pick-level="${c}">
                <span class="sfq-level-name">${c}</span>
                <span class="mcq-count-badge">${d} items</span>
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
            ${t.map(({category:c,levels:d})=>{const h=d[s]||0,p=R[c]||{icon:"📘",label:c,desc:""};return h?`
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
      </div>`,a.querySelectorAll("[data-pick-level]").forEach(c=>{c.addEventListener("click",()=>{s=c.dataset.pickLevel,n()})}),a.querySelectorAll("[data-vmcq-difficulty]").forEach(c=>{c.addEventListener("click",()=>{l=c.dataset.vmcqDifficulty,n()})}),(i=a.querySelector("#vmcq-start-level"))==null||i.addEventListener("click",()=>{H({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(c=>{c.addEventListener("click",()=>{H({level:c.dataset.scopeLevel,category:c.dataset.scopeCategory,difficulty:l})})}),(r=a.querySelector("#vmcq-home"))==null||r.addEventListener("click",()=>T==null?void 0:T())};n()}function K(e){return[...e].sort((t,s)=>{const l=V.getSkillScore("vocabMcq",t.category),n=V.getSkillScore("vocabMcq",s.category);return l-n+(Math.random()-.5)*.3})}function H({level:e=null,category:t=null,label:s="",difficulty:l=v}={}){var r;v=((r=Z[l])==null?void 0:r.key)||"normal",b={level:e,category:t,label:s||ne({level:e,category:t}),difficulty:v};const n=e?{[e]:X(e)}:Object.fromEntries(I.map(c=>[c,M[c]]));m=K(ee(N({level:e,category:t},n),{level:e,difficulty:v}));const i=x.get("paperItemLimit");i&&(x.set("paperItemLimit",null),m=m.slice(0,i)),f=0,E=0,q=0,y=0,S=[],L={},w=!1,C=!1,k={},O=0,b.category&&!w?U(b.category,()=>A()):A()}function ie(){m=K(S),f=0,E=0,q=0,y=0,S=[],L={},w=!0,C=!1,k={},O=G,A()}function ge(e,t=v){a&&H({level:e,category:null,label:e,difficulty:t})}function oe(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function A(){if(!a)return;const e=m[f];if(!e)return de();if(!se(e.category)&&O<G)return U(e.category,()=>A());C=!1;const t=Math.round(f/m.length*100),s=w?`Recovery · ${b.label}`:b.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${f+1} of ${m.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${w?"🔄":"📖"} ${u(s)}</span>
        ${oe()}
        <span class="sfq-progress" aria-label="Question ${f+1} of ${m.length}">${f+1}/${m.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${u(Q(e.category))}${v==="challenge"?" · PSLE Challenge":""}</p>
      ${v==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${e.explain}</div>`:""}
      <p class="sfq-instruction">${u(e.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(r=>`<button class="pt-choice-btn" data-choice="${D(r)}" aria-label="Choose ${D(r)}">${u(r)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,a.querySelectorAll("[data-choice]").forEach(r=>{r.addEventListener("click",()=>{if(C)return;C=!0;const c=r.dataset.choice,d=c===e.answer;d?(E+=1,q+=1,y=Math.max(y,q),F.recordCorrect()):(q=0,S.push(e),F.recordWrong());const h=L[e.category]||(L[e.category]={correct:0,total:0});h.total+=1,d&&(h.correct+=1),V.updateSkill("vocabMcq",e.category,d),V.recordAttempt({quest:"vocabMcq",skill:e.category,correct:d,level:b.level||"Mixed"}),a.querySelectorAll("[data-choice]").forEach(o=>{o.disabled=!0,o.setAttribute("aria-disabled","true"),o.dataset.choice===e.answer?o.classList.add("pt-choice--correct"):o===r&&!d&&o.classList.add("pt-choice--wrong")});const p=a.querySelector("#vmcq-hint");let $=te(e,c,d,{showClueWords:v!=="challenge"});if(d?k[e.category]=0:k[e.category]=(k[e.category]||0)+1,!d){const o=z("vocabMcq",e.category);o&&o.type==="redirect"&&($+=` <br>💡 ${u(o.message)}`)}if(!d&&k[e.category]>=2){const o=B(e.category);$+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(o.rule)}<br><em>${u(o.example)}</em></span>`}p&&(p.innerHTML=$);const _=a.querySelector("#vmcq-next-wrap"),g=a.querySelector("#vmcq-next");if(_&&g){const o=f+1>=m.length;g.textContent=o?"See Results →":"Next →",g.setAttribute("aria-label",o?"See results":"Next question"),_.style.display="",g.addEventListener("click",()=>{f+=1,A()}),g.focus()}})});const n=a.querySelector("#vmcq-rule-hint"),i=a.querySelector("#vmcq-hint-panel");n&&i&&n.addEventListener("click",()=>{const r=i.hidden;if(i.hidden=!r,n.setAttribute("aria-expanded",String(r)),n.textContent=r?"💡 Hide Rule":"💡 Show Rule",r){const c=B(e.category);i.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(c.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(c.example)}</em></p>
          <p class="mcq-hint-tip">${u(c.tip)}</p>`}})}function ue(){const e=Object.entries(L).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:n,total:i})=>{const r=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(Q(s))}</th>
          <td class="sq-skill-score">${n}/${i}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${r}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function U(e,t){var n,i;O+=1,le(e);const s=B(e),l=R[e]||{icon:"📖",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${D(l.label)}">
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
    </div>`,(n=a.querySelector("#mcq-rule-start"))==null||n.addEventListener("click",t),(i=a.querySelector("#mcq-rule-skip"))==null||i.addEventListener("click",t)}function de(){var r,c,d;const e=m.length;if(e===0){P();return}const t=Math.round(E/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=S.length>0,n=ue();let i="";if(t<70){const h=Object.entries(L).filter(([,p])=>p.total>0);if(h.length>0){const[p]=h.sort(([,g],[,o])=>g.correct/g.total-o.correct/o.total)[0],$=B(p),_=R[p]||{icon:"📖",label:p};i=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${_.icon} Focus area: ${u(_.label)}</p>
          <p class="mcq-focus-tip-rule">${u($.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u($.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u($.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${w?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — replay to improve!":"Keep trying — you can do it!"}</p>
      ${n}${i}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${S.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((r=a.querySelector("#vmcq-recovery"))==null||r.addEventListener("click",()=>ie())),(c=a.querySelector("#vmcq-replay"))==null||c.addEventListener("click",()=>H(b)),(d=a.querySelector("#vmcq-menu"))==null||d.addEventListener("click",()=>P())}export{he as cleanupVocabMcq,W as countItemsForScope,ce as getAllItems,ae as getCategoryCounts,N as getItemsForScope,re as getLevelCounts,be as initVocabMcq,P as showVocabMcqBrowser,ge as startVocabMcqLevel};
