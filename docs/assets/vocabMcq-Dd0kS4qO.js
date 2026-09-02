import{w as z,c as w,s as L,ae as X,u as C,a2 as H,F as o,$ as F,af as Z}from"./index-Vsj4XzcA.js";import{g as J,r as ee,i as P,a as te,M as se,f as ce,b as le,c as ae,d as re}from"./mcqBrowserShell-B7QQl7Tx.js";import{V as _,a as I,b as ne,g as oe}from"./vocabMcq-C428fmp5.js";import{a as ie,b as ue}from"./mcqFeedback-Ujcjv2y-.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";import"./mcqOptionExplanations-Atx8bQId.js";import"./practiceExpansion-D0CCBel5.js";function A(e){const t=w[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let a=null,R=null,m=[],g=0,E=0,f={level:null,category:null,label:"All Skills",difficulty:"normal"},h="normal",v=0,y=0,$=[],k=!1,S={},B=0;const W=3;function G(e){return`vmcq:${e}`}const de=14,pe=.6;function me(e){const t=(L.get("lessonsSeen")||{})[G(e)];return t?(Date.now()-Date.parse(t))/864e5<de?!0:C.getSkillScore("vocabMcq",e)>=pe:!1}function qe(e){const t={...L.get("lessonsSeen")||{}};t[G(e)]=new Date().toISOString(),L.set("lessonsSeen",t)}function Te(e,t){a=e,R=t}function Ie(){a&&(a.innerHTML="")}function he(e=_){return I.flatMap(t=>e[t]||[])}function N({level:e=null,category:t=null}={},s=_){const l=e?s[e]||[]:he(s);return t?l.filter(r=>r.category===t):l}function Y(e={},t=_){return N(e,t).length}function fe(e=_,t=z){return t.map(s=>{const l={};let r=0;for(const n of I){const u=Y({level:n,category:s},e);l[n]=u,r+=u}return{category:s,total:r,levels:l}})}function ve(e=_,t=I){return t.map(s=>({level:s,total:Y({level:s},e)}))}function T(e){var t;return((t=w[e])==null?void 0:t.label)||e}function be(e){const t=e.level||null,s=e.category?T(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function Q(){if(!a)return;const e=ve(),t=fe();let s=f.level||J(),l=f.difficulty||h||"normal";const r=()=>{var n,u,p;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one vocabulary skill at a time — or mix them all together.</p>

        ${ee({prefix:"vmcq",level:s,recommended:P(s),chooserHtml:`<section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:c,total:i})=>`
              <button class="sfq-level-btn mcq-level-card ${c===s?"mcq-level-card--active":""}" data-pick-level="${c}">
                ${P(c)?'<span class="mcq-level-rec" aria-label="Recommended level">⭐ For you</span>':""}
                <span class="sfq-level-name">${c}</span>
                <span class="mcq-count-badge">${i} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${te({selected:l,prefix:"vmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Vocabulary Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.map(({category:c,levels:i})=>{const d=i[s]||0,q=w[c]||{icon:"📘",label:c,desc:""};return d?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${c}">
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
      </div>`,(n=a.querySelector("#vmcq-quick-start"))==null||n.addEventListener("click",()=>{M({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-pick-level]").forEach(c=>{c.addEventListener("click",()=>{s=c.dataset.pickLevel,r()})}),a.querySelectorAll("[data-vmcq-difficulty]").forEach(c=>{c.addEventListener("click",()=>{l=c.dataset.vmcqDifficulty,r()})}),(u=a.querySelector("#vmcq-start-level"))==null||u.addEventListener("click",()=>{M({level:s,category:null,difficulty:l})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(c=>{c.addEventListener("click",()=>{M({level:c.dataset.scopeLevel,category:c.dataset.scopeCategory,difficulty:l})})}),(p=a.querySelector("#vmcq-home"))==null||p.addEventListener("click",()=>R==null?void 0:R())};r()}function K(e){return[...e].sort((t,s)=>{const l=C.getSkillScore("vocabMcq",t.category),r=C.getSkillScore("vocabMcq",s.category);return l-r+(Math.random()-.5)*.3})}function M({level:e=null,category:t=null,label:s="",difficulty:l=h}={}){var c;h=((c=se[l])==null?void 0:c.key)||"normal",f={level:e,category:t,label:s||be({level:e,category:t}),difficulty:h};const r=e?{[e]:ne(e)}:Object.fromEntries(I.map(i=>[i,_[i]]));m=K(ce(N({level:e,category:t},r),{level:e,difficulty:h}));const n=L.get("paperItemLimit");L.set("paperItemLimit",null);const u=n||X;m=m.slice(0,u);const p=le("vocabMcq",{level:e,category:t});if(p.length){const i=new Set(p.map(d=>d.seedId));m=[...p,...m.filter(d=>!i.has(d.seedId))].slice(0,u)}g=0,E=0,v=0,y=0,$=[],S={},k=!1,B=0,f.category&&!k?U(f.category,()=>x()):x()}function ge(){m=K($),g=0,E=0,v=0,y=0,$=[],S={},k=!0,B=W,x()}function Be(e,t=h){a&&M({level:e,category:null,label:e,difficulty:t})}function ye(){if(v<2)return"";const e=v>=10?"🔥":v>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${v} in a row">${e} ${v}</span>`}function $e(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${o(t)}</span>`).join(" ")}
    </div>
  `}function ke(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function x(){if(!a)return;const e=m[g];if(!e)return we();if(!me(e.category)&&B<W)return U(e.category,()=>x());const t=Math.round(g/m.length*100),s=k?`Recovery · ${f.label}`:f.label,l=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${g+1} of ${m.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${k?"🔄":"📖"} ${o(s)}</span>
        ${ye()}
        <span class="sfq-progress" aria-label="Question ${g+1} of ${m.length}">${g+1}/${m.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${e.isReview?"🔄 Review · ":""}${o(T(e.category))}${h==="challenge"?" · PSLE Challenge":""}</p>
      ${h==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${ke(e)}</p>
      <p class="sfq-instruction">${o(e.q)}</p>
      ${h==="guided"?$e(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(c=>`<button class="pt-choice-btn" data-choice="${H(c)}" aria-label="Choose ${H(c)}">${o(c)}</button>`).join("")}
      </div>
      <div class="mcq-tools" id="vmcq-tools"></div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,ae(a.querySelector("#vmcq-tools"),()=>({question:e.q,choices:l}));const r=a.querySelector("#vmcq-next-wrap"),n=a.querySelector("#vmcq-next");if(n){const c=g+1>=m.length;n.textContent=c?"See Results →":"Next →",n.setAttribute("aria-label",c?"See results":"Next question"),n.addEventListener("click",()=>{g+=1,x()})}ie({root:a,item:e,feedbackEl:a.querySelector("#vmcq-hint"),nextWrap:r,nextBtn:n,mode:"vocabMcq",domain:"vocab",skillLabel:T(e.category),level:f.level||e.level,showClueWords:h!=="challenge",tip:A(e.category),onFirstAttempt:c=>{c?(E+=1,v+=1,y=Math.max(y,v),F.recordCorrect()):(v=0,$.push(e),F.recordWrong());const i=S[e.category]||(S[e.category]={correct:0,total:0});i.total+=1,c&&(i.correct+=1),C.updateSkill("vocabMcq",e.category,c),re("vocabMcq",e,c,Date.now(),{promote:!k}),C.recordAttempt({quest:"vocabMcq",skill:e.category,correct:c,level:f.level||"Mixed"})},extraHtml:(c,i)=>{const d=oe(e.answer);let q=d?`<p class="tf-section tf-section--wordcard"><span class="tf-section__icon" aria-hidden="true">📖</span> <strong>${o(e.answer)}</strong> — ${o(d)}</p>`:"";if(i)return q;const b=Z("vocabMcq",e.category);return b&&b.type==="redirect"&&(q+=`<p class="tf-section tf-section--redirect"><span class="tf-section__icon" aria-hidden="true">🧭</span> ${o(b.message)}</p>`),q}});const u=a.querySelector("#vmcq-rule-hint"),p=a.querySelector("#vmcq-hint-panel");u&&p&&u.addEventListener("click",()=>{var i;const c=p.hidden;if(p.hidden=!c,u.setAttribute("aria-expanded",String(c)),u.textContent=c?"💡 Hide the rule":"💡 Stuck? Show the rule",c){const d=A(e.category);p.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${o(d.rule)}</p>
          <p class="mcq-hint-eg"><em>${o(d.example)}</em></p>
          <p class="mcq-hint-tip">${o(d.tip)}</p>`,ue(p,{item:e,categoryLabel:((i=w[e.category])==null?void 0:i.label)||e.category,level:f.level||e.level})}})}function Se(){const e=Object.entries(S).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:r,total:n})=>{const u=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${o(T(s))}</th>
          <td class="sq-skill-score">${r}/${n}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${u}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function U(e,t){var r,n;B+=1,qe(e);const s=A(e),l=w[e]||{icon:"📖",label:e};a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${H(l.label)}">
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
    </div>`,(r=a.querySelector("#mcq-rule-start"))==null||r.addEventListener("click",t),(n=a.querySelector("#mcq-rule-skip"))==null||n.addEventListener("click",t)}function we(){var c,i,d;const e=m.length;if(e===0){Q();return}const t=Math.round(E/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=$.length>0,r=[];l&&r.push(`Start with the Recovery Round — it replays only the ${$.length} question${$.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&h!=="guided"?r.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&h!=="challenge"&&!l&&r.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const n=r.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${r.join(" ")}</p>`:"",u=Se();let p="";if(t<70){const q=Object.entries(S).filter(([,b])=>b.total>0);if(q.length>0){const[b]=q.sort(([,O],[,j])=>O.correct/O.total-j.correct/j.total)[0],D=A(b),V=w[b]||{icon:"📖",label:b};p=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${V.icon} Focus area: ${o(V.label)}</p>
          <p class="mcq-focus-tip-rule">${o(D.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${o(D.example)}</em></p>
          <p class="mcq-focus-tip-tip">${o(D.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${k?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${t}%</p>
      ${y>=3?`<p class="sfq-instruction">${y>=10?"🔥":y>=5?"⚡":"✨"} Best streak: ${y} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${u}${p}${n}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${$.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((c=a.querySelector("#vmcq-recovery"))==null||c.addEventListener("click",()=>ge())),(i=a.querySelector("#vmcq-replay"))==null||i.addEventListener("click",()=>M(f)),(d=a.querySelector("#vmcq-menu"))==null||d.addEventListener("click",()=>Q())}export{Ie as cleanupVocabMcq,Y as countItemsForScope,he as getAllItems,fe as getCategoryCounts,N as getItemsForScope,ve as getLevelCounts,Te as initVocabMcq,Q as showVocabMcqBrowser,Be as startVocabMcqLevel};
