import{v as V,ac as X,G as C,s as _,ad as Z,u as L,a1 as H,F as o,a2 as A,$ as F,ae as J}from"./index-DrZ2R3gf.js";import{g as ee,r as te,i as P,a as se,M as re,f as le,b as ae,c as ce}from"./mcqBrowserShell-CIklUCHK.js";import{G as S,a as G,b as ne}from"./grammarMcq-D_aPVLSj.js";import{a as ie,b as oe}from"./mcqFeedback-BGLeKlSU.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Atx8bQId.js";import"./practiceExpansion-jKbCGNBJ.js";let a=null,x=null,p=[],b=0,E=0,f={level:null,category:null,label:"All Skills",difficulty:"normal"},q="normal",g=0,v=0,y=[],$=!1,k={},I=0;const W=3;function N(e){return`gmcq:${e}`}const ue=14,de=.6;function me(e){const t=(_.get("lessonsSeen")||{})[N(e)];return t?(Date.now()-Date.parse(t))/864e5<ue?!0:L.getSkillScore("grammarMcq",e)>=de:!1}function pe(e){const t={..._.get("lessonsSeen")||{}};t[N(e)]=new Date().toISOString(),_.set("lessonsSeen",t)}function xe(e,t){a=e,x=t}function Ae(){a&&(a.innerHTML="")}function qe(e=S){return G.flatMap(t=>e[t]||[])}function Y({level:e=null,category:t=null}={},s=S){const l=e?s[e]||[]:qe(s);return t?l.filter(c=>c.category===t):l}function K(e={},t=S){return Y(e,t).length}function he(e=S,t=V){return t.map(s=>{const l={};let c=0;for(const n of G){const u=K({level:n,category:s},e);l[n]=u,c+=u}return{category:s,total:c,levels:l}})}function fe(e=S,t=G){return t.map(s=>({level:s,total:K({level:s},e)}))}function T(e){var t;return((t=C[e])==null?void 0:t.label)||e}function ge(e){const t=e.level||null,s=e.category?T(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function Q(){if(!a)return;const e=fe(),t=he();let s=f.level||ee(),l=f.difficulty||q||"normal";const c=()=>{var n,u,m;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one grammar skill at a time — or mix them all together.</p>

        ${te({prefix:"gmcq",level:s,recommended:P(s),chooserHtml:`<section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:r,total:i})=>`
              <button class="sfq-level-btn mcq-level-card ${r===s?"mcq-level-card--active":""}" data-pick-level="${r}">
                ${P(r)?'<span class="mcq-level-rec" aria-label="Recommended level">⭐ For you</span>':""}
                <span class="sfq-level-name">${r}</span>
                <span class="mcq-count-badge">${i} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${se({selected:l,prefix:"gmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Grammar Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.filter(({category:r})=>X(r,s)).map(({category:r,levels:i})=>{const d=i[s]||0,h=C[r]||{icon:"🧩",label:r};return d?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${r}">
                  <div class="mcq-skill-title">${h.icon} ${h.label}</div>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${d} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${h.icon} ${h.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>`})}

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`,(n=a.querySelector("#gmcq-quick-start"))==null||n.addEventListener("click",()=>{M({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-pick-level]").forEach(r=>{r.addEventListener("click",()=>{s=r.dataset.pickLevel,c()})}),a.querySelectorAll("[data-gmcq-difficulty]").forEach(r=>{r.addEventListener("click",()=>{l=r.dataset.gmcqDifficulty,c()})}),(u=a.querySelector("#gmcq-start-level"))==null||u.addEventListener("click",()=>{M({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(r=>{r.addEventListener("click",()=>{M({level:r.dataset.scopeLevel,category:r.dataset.scopeCategory,difficulty:l})})}),(m=a.querySelector("#gmcq-home"))==null||m.addEventListener("click",()=>x==null?void 0:x())};c()}function U(e){return[...e].sort((t,s)=>{const l=L.getSkillScore("grammarMcq",t.category),c=L.getSkillScore("grammarMcq",s.category);return l-c+(Math.random()-.5)*.3})}function M({level:e=null,category:t=null,label:s="",difficulty:l=q}={}){var r;q=((r=re[l])==null?void 0:r.key)||"normal",f={level:e,category:t,label:s||ge({level:e,category:t}),difficulty:q};const c=e?{[e]:ne(e)}:Object.fromEntries(G.map(i=>[i,S[i]]));p=U(le(Y({level:e,category:t},c),{level:e,difficulty:q}));const n=_.get("paperItemLimit");_.set("paperItemLimit",null);const u=n||Z;p=p.slice(0,u);const m=ae("grammarMcq",{level:e,category:t});if(m.length){const i=new Set(m.map(d=>d.seedId));p=[...m,...p.filter(d=>!i.has(d.seedId))].slice(0,u)}b=0,E=0,g=0,v=0,y=[],k={},$=!1,I=0,f.category&&!$?z(f.category,()=>R()):R()}function be(){p=U(y),b=0,E=0,g=0,v=0,y=[],k={},$=!0,I=W,R()}function Te(e,t=q){a&&M({level:e,category:null,label:e,difficulty:t})}function ve(){if(g<2)return"";const e=g>=10?"🔥":g>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${g} in a row">${e} ${g}</span>`}function ye(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${o(t)}</span>`).join(" ")}
    </div>
  `}function $e(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function R(){if(!a)return;const e=p[b];if(!e)return Se();if(!me(e.category)&&I<W)return z(e.category,()=>R());const t=Math.round(b/p.length*100),s=$?`Recovery · ${f.label}`:f.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${b+1} of ${p.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${$?"🔄":"🧠"} ${o(s)}</span>
        ${ve()}
        <span class="sfq-progress" aria-label="Question ${b+1} of ${p.length}">${b+1}/${p.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${e.isReview?"🔄 Review · ":""}${o(T(e.category))}${q==="challenge"?" · PSLE Challenge":""}</p>
      ${q==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${$e(e)}</p>
      <p class="sfq-instruction">${o(e.q)}</p>
      ${q==="guided"?ye(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(r=>`<button class="pt-choice-btn" data-choice="${H(r)}" aria-label="Choose ${H(r)}">${o(r)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`;const c=a.querySelector("#gmcq-next-wrap"),n=a.querySelector("#gmcq-next");if(n){const r=b+1>=p.length;n.textContent=r?"See Results →":"Next →",n.setAttribute("aria-label",r?"See results":"Next question"),n.addEventListener("click",()=>{b+=1,R()})}ie({root:a,item:e,feedbackEl:a.querySelector("#gmcq-hint"),nextWrap:c,nextBtn:n,mode:"grammarMcq",domain:"grammar",skillLabel:T(e.category),level:f.level||e.level,showClueWords:q!=="challenge",tip:A(e.category),onFirstAttempt:r=>{r?(E+=1,g+=1,v=Math.max(v,g),F.recordCorrect()):(g=0,y.push(e),F.recordWrong());const i=k[e.category]||(k[e.category]={correct:0,total:0});i.total+=1,r&&(i.correct+=1),L.updateSkill("grammarMcq",e.category,r),ce("grammarMcq",e,r,Date.now(),{promote:!$}),L.recordAttempt({quest:"grammarMcq",skill:e.category,correct:r,level:f.level||"Mixed"})},extraHtml:(r,i)=>{if(i)return"";let d="";const h=J("grammarMcq",e.category);return h&&h.type==="redirect"&&(d+=`<p class="tf-section tf-section--redirect"><span class="tf-section__icon" aria-hidden="true">🧭</span> ${o(h.message)}</p>`),d}});const u=a.querySelector("#gmcq-rule-hint"),m=a.querySelector("#gmcq-hint-panel");u&&m&&u.addEventListener("click",()=>{var i;const r=m.hidden;if(m.hidden=!r,u.setAttribute("aria-expanded",String(r)),u.textContent=r?"💡 Hide the rule":"💡 Stuck? Show the rule",r){const d=A(e.category);m.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${o(d.rule)}</p>
          <p class="mcq-hint-eg"><em>${o(d.example)}</em></p>
          <p class="mcq-hint-tip">${o(d.tip)}</p>`,oe(m,{item:e,categoryLabel:((i=C[e.category])==null?void 0:i.label)||e.category,level:f.level||e.level})}})}function ke(){const e=Object.entries(k).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:c,total:n})=>{const u=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${o(T(s))}</th>
          <td class="sq-skill-score">${c}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${u}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function z(e,t){var c,n;I+=1,pe(e);const s=A(e),l=C[e]||{icon:"🧠",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${H(l.label)}">
      <div class="mcq-rule-icon">${l.icon}</div>
      <h2 class="mcq-rule-title">${o(l.label)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you practise — read it once, then try the questions.</p>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${o(s.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${o(s.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${o(s.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`,(c=a.querySelector("#mcq-rule-start"))==null||c.addEventListener("click",t),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function Se(){var r,i,d;const e=p.length;if(e===0){Q();return}const t=Math.round(E/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=y.length>0,c=[];l&&c.push(`Start with the Recovery Round — it replays only the ${y.length} question${y.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&q!=="guided"?c.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&q!=="challenge"&&!l&&c.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const n=c.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${c.join(" ")}</p>`:"",u=ke();let m="";if(t<70){const h=Object.entries(k).filter(([,w])=>w.total>0);if(h.length>0){const[w]=h.sort(([,O],[,j])=>O.correct/O.total-j.correct/j.total)[0],D=A(w),B=C[w]||{icon:"🧠",label:w};m=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${B.icon} Focus area: ${o(B.label)}</p>
          <p class="mcq-focus-tip-rule">${o(D.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${o(D.example)}</em></p>
          <p class="mcq-focus-tip-tip">${o(D.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${$?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${t}%</p>
      ${v>=3?`<p class="sfq-instruction">${v>=10?"🔥":v>=5?"⚡":"✨"} Best streak: ${v} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${u}${m}${n}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${y.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((r=a.querySelector("#gmcq-recovery"))==null||r.addEventListener("click",()=>be())),(i=a.querySelector("#gmcq-replay"))==null||i.addEventListener("click",()=>M(f)),(d=a.querySelector("#gmcq-menu"))==null||d.addEventListener("click",()=>Q())}export{Ae as cleanupGrammarMcq,K as countItemsForScope,qe as getAllItems,he as getCategoryCounts,Y as getItemsForScope,fe as getLevelCounts,xe as initGrammarMcq,Q as showGrammarMcqBrowser,Te as startGrammarMcqLevel};
