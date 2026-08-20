import{w as z,c as S,s as L,ad as X,u as C,a1 as V,F as o,$ as F,ae as Z}from"./index-p5sXDE7v.js";import{g as J,r as ee,i as P,a as te,M as se,f as le,b as ce,c as ae}from"./mcqBrowserShell-DXPD4ejI.js";import{V as _,a as I,b as re,g as ne}from"./vocabMcq-BjV1Y7_3.js";import{a as oe,b as ie}from"./mcqFeedback-BLE_w8O4.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Atx8bQId.js";import"./practiceExpansion-CxOuQ-yw.js";function A(e){const t=S[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let a=null,R=null,m=[],g=0,E=0,f={level:null,category:null,label:"All Skills",difficulty:"normal"},h="normal",v=0,y=0,$=[],k=!1,w={},D=0;const W=3;function G(e){return`vmcq:${e}`}const ue=14,de=.6;function pe(e){const t=(L.get("lessonsSeen")||{})[G(e)];return t?(Date.now()-Date.parse(t))/864e5<ue?!0:C.getSkillScore("vocabMcq",e)>=de:!1}function me(e){const t={...L.get("lessonsSeen")||{}};t[G(e)]=new Date().toISOString(),L.set("lessonsSeen",t)}function Re(e,t){a=e,R=t}function Ae(){a&&(a.innerHTML="")}function qe(e=_){return I.flatMap(t=>e[t]||[])}function N({level:e=null,category:t=null}={},s=_){const c=e?s[e]||[]:qe(s);return t?c.filter(r=>r.category===t):c}function Y(e={},t=_){return N(e,t).length}function he(e=_,t=z){return t.map(s=>{const c={};let r=0;for(const n of I){const u=Y({level:n,category:s},e);c[n]=u,r+=u}return{category:s,total:r,levels:c}})}function fe(e=_,t=I){return t.map(s=>({level:s,total:Y({level:s},e)}))}function T(e){var t;return((t=S[e])==null?void 0:t.label)||e}function ve(e){const t=e.level||null,s=e.category?T(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function Q(){if(!a)return;const e=fe(),t=he();let s=f.level||J(),c=f.difficulty||h||"normal";const r=()=>{var n,u,p;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one vocabulary skill at a time — or mix them all together.</p>

        ${ee({prefix:"vmcq",level:s,recommended:P(s),chooserHtml:`<section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:l,total:i})=>`
              <button class="sfq-level-btn mcq-level-card ${l===s?"mcq-level-card--active":""}" data-pick-level="${l}">
                ${P(l)?'<span class="mcq-level-rec" aria-label="Recommended level">⭐ For you</span>':""}
                <span class="sfq-level-name">${l}</span>
                <span class="mcq-count-badge">${i} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${te({selected:c,prefix:"vmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Vocabulary Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.map(({category:l,levels:i})=>{const d=i[s]||0,q=S[l]||{icon:"📘",label:l,desc:""};return d?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${l}">
                  <div class="mcq-skill-title">${q.icon} ${q.label}</div>
                  <p class="mcq-skill-sub">${q.desc||""}</p>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${d} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${q.icon} ${q.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>`})}

        <div class="sfq-actions"><button class="btn btn--ghost" id="vmcq-home">← Home</button></div>
      </div>`,(n=a.querySelector("#vmcq-quick-start"))==null||n.addEventListener("click",()=>{M({level:s,category:null,difficulty:c})}),a.querySelectorAll("[data-pick-level]").forEach(l=>{l.addEventListener("click",()=>{s=l.dataset.pickLevel,r()})}),a.querySelectorAll("[data-vmcq-difficulty]").forEach(l=>{l.addEventListener("click",()=>{c=l.dataset.vmcqDifficulty,r()})}),(u=a.querySelector("#vmcq-start-level"))==null||u.addEventListener("click",()=>{M({level:s,category:null,difficulty:c})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(l=>{l.addEventListener("click",()=>{M({level:l.dataset.scopeLevel,category:l.dataset.scopeCategory,difficulty:c})})}),(p=a.querySelector("#vmcq-home"))==null||p.addEventListener("click",()=>R==null?void 0:R())};r()}function K(e){return[...e].sort((t,s)=>{const c=C.getSkillScore("vocabMcq",t.category),r=C.getSkillScore("vocabMcq",s.category);return c-r+(Math.random()-.5)*.3})}function M({level:e=null,category:t=null,label:s="",difficulty:c=h}={}){var l;h=((l=se[c])==null?void 0:l.key)||"normal",f={level:e,category:t,label:s||ve({level:e,category:t}),difficulty:h};const r=e?{[e]:re(e)}:Object.fromEntries(I.map(i=>[i,_[i]]));m=K(le(N({level:e,category:t},r),{level:e,difficulty:h}));const n=L.get("paperItemLimit");L.set("paperItemLimit",null);const u=n||X;m=m.slice(0,u);const p=ce("vocabMcq",{level:e,category:t});if(p.length){const i=new Set(p.map(d=>d.seedId));m=[...p,...m.filter(d=>!i.has(d.seedId))].slice(0,u)}g=0,E=0,v=0,y=0,$=[],w={},k=!1,D=0,f.category&&!k?U(f.category,()=>x()):x()}function be(){m=K($),g=0,E=0,v=0,y=0,$=[],w={},k=!0,D=W,x()}function Te(e,t=h){a&&M({level:e,category:null,label:e,difficulty:t})}function ge(){if(v<2)return"";const e=v>=10?"🔥":v>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${v} in a row">${e} ${v}</span>`}function ye(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${o(t)}</span>`).join(" ")}
    </div>
  `}function $e(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function x(){if(!a)return;const e=m[g];if(!e)return we();if(!pe(e.category)&&D<W)return U(e.category,()=>x());const t=Math.round(g/m.length*100),s=k?`Recovery · ${f.label}`:f.label,c=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${g+1} of ${m.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${k?"🔄":"📖"} ${o(s)}</span>
        ${ge()}
        <span class="sfq-progress" aria-label="Question ${g+1} of ${m.length}">${g+1}/${m.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${e.isReview?"🔄 Review · ":""}${o(T(e.category))}${h==="challenge"?" · PSLE Challenge":""}</p>
      ${h==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${$e(e)}</p>
      <p class="sfq-instruction">${o(e.q)}</p>
      ${h==="guided"?ye(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${c.map(l=>`<button class="pt-choice-btn" data-choice="${V(l)}" aria-label="Choose ${V(l)}">${o(l)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`;const r=a.querySelector("#vmcq-next-wrap"),n=a.querySelector("#vmcq-next");if(n){const l=g+1>=m.length;n.textContent=l?"See Results →":"Next →",n.setAttribute("aria-label",l?"See results":"Next question"),n.addEventListener("click",()=>{g+=1,x()})}oe({root:a,item:e,feedbackEl:a.querySelector("#vmcq-hint"),nextWrap:r,nextBtn:n,mode:"vocabMcq",domain:"vocab",skillLabel:T(e.category),level:f.level||e.level,showClueWords:h!=="challenge",tip:A(e.category),onFirstAttempt:l=>{l?(E+=1,v+=1,y=Math.max(y,v),F.recordCorrect()):(v=0,$.push(e),F.recordWrong());const i=w[e.category]||(w[e.category]={correct:0,total:0});i.total+=1,l&&(i.correct+=1),C.updateSkill("vocabMcq",e.category,l),ae("vocabMcq",e,l,Date.now(),{promote:!k}),C.recordAttempt({quest:"vocabMcq",skill:e.category,correct:l,level:f.level||"Mixed"})},extraHtml:(l,i)=>{const d=ne(e.answer);let q=d?`<p class="tf-section tf-section--wordcard"><span class="tf-section__icon" aria-hidden="true">📖</span> <strong>${o(e.answer)}</strong> — ${o(d)}</p>`:"";if(i)return q;const b=Z("vocabMcq",e.category);return b&&b.type==="redirect"&&(q+=`<p class="tf-section tf-section--redirect"><span class="tf-section__icon" aria-hidden="true">🧭</span> ${o(b.message)}</p>`),q}});const u=a.querySelector("#vmcq-rule-hint"),p=a.querySelector("#vmcq-hint-panel");u&&p&&u.addEventListener("click",()=>{var i;const l=p.hidden;if(p.hidden=!l,u.setAttribute("aria-expanded",String(l)),u.textContent=l?"💡 Hide the rule":"💡 Stuck? Show the rule",l){const d=A(e.category);p.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${o(d.rule)}</p>
          <p class="mcq-hint-eg"><em>${o(d.example)}</em></p>
          <p class="mcq-hint-tip">${o(d.tip)}</p>`,ie(p,{item:e,categoryLabel:((i=S[e.category])==null?void 0:i.label)||e.category,level:f.level||e.level})}})}function ke(){const e=Object.entries(w).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,c])=>({cat:s,pct:Math.round(c.correct/c.total*100),correct:c.correct,total:c.total})).sort((s,c)=>s.pct-c.pct).map(({cat:s,pct:c,correct:r,total:n})=>{const u=c>=70?"var(--color-success)":c>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${c<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${o(T(s))}</th>
          <td class="sq-skill-score">${r}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${c}%;background:${u}"></div></div></td>
          <td class="sq-skill-pct">${c}%${c<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function U(e,t){var r,n;D+=1,me(e);const s=A(e),c=S[e]||{icon:"📖",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${V(c.label)}">
      <div class="mcq-rule-icon">${c.icon}</div>
      <h2 class="mcq-rule-title">${o(c.label)}</h2>
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
    </div>`,(r=a.querySelector("#mcq-rule-start"))==null||r.addEventListener("click",t),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function we(){var l,i,d;const e=m.length;if(e===0){Q();return}const t=Math.round(E/e*100),s=t>=90?3:t>=70?2:t>0?1:0,c=$.length>0,r=[];c&&r.push(`Start with the Recovery Round — it replays only the ${$.length} question${$.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&h!=="guided"?r.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&h!=="challenge"&&!c&&r.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const n=r.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${r.join(" ")}</p>`:"",u=ke();let p="";if(t<70){const q=Object.entries(w).filter(([,b])=>b.total>0);if(q.length>0){const[b]=q.sort(([,O],[,j])=>O.correct/O.total-j.correct/j.total)[0],H=A(b),B=S[b]||{icon:"📖",label:b};p=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${B.icon} Focus area: ${o(B.label)}</p>
          <p class="mcq-focus-tip-rule">${o(H.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${o(H.example)}</em></p>
          <p class="mcq-focus-tip-tip">${o(H.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${k?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${u}${p}${n}
      <div class="sfq-actions">
        ${c?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${$.length})</button>`:""}
        <button class="btn ${c?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,c&&((l=a.querySelector("#vmcq-recovery"))==null||l.addEventListener("click",()=>be())),(i=a.querySelector("#vmcq-replay"))==null||i.addEventListener("click",()=>M(f)),(d=a.querySelector("#vmcq-menu"))==null||d.addEventListener("click",()=>Q())}export{Ae as cleanupVocabMcq,Y as countItemsForScope,qe as getAllItems,he as getCategoryCounts,N as getItemsForScope,fe as getLevelCounts,Re as initVocabMcq,Q as showVocabMcqBrowser,Te as startVocabMcqLevel};
