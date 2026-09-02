import{v as X,ad as Z,G as x,s as _,ae as J,u as L,a2 as H,F as d,a3 as A,$ as O,af as ee}from"./index-Vsj4XzcA.js";import{g as te,r as se,i as P,a as le,M as re,f as ae,b as ce,c as ne,d as ie}from"./mcqBrowserShell-B7QQl7Tx.js";import{G as S,a as G,b as oe,g as W}from"./grammarMcq-5tKttqZh.js";import{a as ue,b as de}from"./mcqFeedback-Ujcjv2y-.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";import"./mcqOptionExplanations-Atx8bQId.js";import"./practiceExpansion-D0CCBel5.js";let a=null,C=null,q=[],b=0,R=0,f={level:null,category:null,label:"All Skills",difficulty:"normal"},h="normal",g=0,v=0,y=[],$=!1,k={},I=0;const N=3;function Y(e,t=null){return(t?W(e,t):null)?`gmcq:${e}:${t}`:`gmcq:${e}`}const me=14,pe=.6;function qe(e,t=null){const s=(_.get("lessonsSeen")||{})[Y(e,t)];return s?(Date.now()-Date.parse(s))/864e5<me?!0:L.getSkillScore("grammarMcq",e)>=pe:!1}function he(e,t=null){const s={..._.get("lessonsSeen")||{}};s[Y(e,t)]=new Date().toISOString(),_.set("lessonsSeen",s)}function Ge(e,t){a=e,C=t}function Ie(){a&&(a.innerHTML="")}function fe(e=S){return G.flatMap(t=>e[t]||[])}function K({level:e=null,category:t=null}={},s=S){const r=e?s[e]||[]:fe(s);return t?r.filter(n=>n.category===t):r}function U(e={},t=S){return K(e,t).length}function ge(e=S,t=X){return t.map(s=>{const r={};let n=0;for(const c of G){const o=U({level:c,category:s},e);r[c]=o,n+=o}return{category:s,total:n,levels:r}})}function be(e=S,t=G){return t.map(s=>({level:s,total:U({level:s},e)}))}function T(e){var t;return((t=x[e])==null?void 0:t.label)||e}function ve(e){const t=e.level||null,s=e.category?T(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function Q(){if(!a)return;const e=be(),t=ge();let s=f.level||te(),r=f.difficulty||h||"normal";const n=()=>{var c,o,m;a.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one grammar skill at a time — or mix them all together.</p>

        ${se({prefix:"gmcq",level:s,recommended:P(s),chooserHtml:`<section class="mcq-browser-section">
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
          ${le({selected:r,prefix:"gmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Grammar Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.filter(({category:l})=>Z(l,s)).map(({category:l,levels:i})=>{const u=i[s]||0,p=x[l]||{icon:"🧩",label:l};return u?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${l}">
                  <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${u} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>`})}

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`,(c=a.querySelector("#gmcq-quick-start"))==null||c.addEventListener("click",()=>{M({level:s,category:null,difficulty:r})}),a.querySelectorAll("[data-pick-level]").forEach(l=>{l.addEventListener("click",()=>{s=l.dataset.pickLevel,n()})}),a.querySelectorAll("[data-gmcq-difficulty]").forEach(l=>{l.addEventListener("click",()=>{r=l.dataset.gmcqDifficulty,n()})}),(o=a.querySelector("#gmcq-start-level"))==null||o.addEventListener("click",()=>{M({level:s,category:null,difficulty:r})}),a.querySelectorAll("[data-scope-level][data-scope-category]").forEach(l=>{l.addEventListener("click",()=>{M({level:l.dataset.scopeLevel,category:l.dataset.scopeCategory,difficulty:r})})}),(m=a.querySelector("#gmcq-home"))==null||m.addEventListener("click",()=>C==null?void 0:C())};n()}function z(e){return[...e].sort((t,s)=>{const r=L.getSkillScore("grammarMcq",t.category),n=L.getSkillScore("grammarMcq",s.category);return r-n+(Math.random()-.5)*.3})}function M({level:e=null,category:t=null,label:s="",difficulty:r=h}={}){var l;h=((l=re[r])==null?void 0:l.key)||"normal",f={level:e,category:t,label:s||ve({level:e,category:t}),difficulty:h};const n=e?{[e]:oe(e)}:Object.fromEntries(G.map(i=>[i,S[i]]));q=z(ae(K({level:e,category:t},n),{level:e,difficulty:h}));const c=_.get("paperItemLimit");_.set("paperItemLimit",null);const o=c||J;q=q.slice(0,o);const m=ce("grammarMcq",{level:e,category:t});if(m.length){const i=new Set(m.map(u=>u.seedId));q=[...m,...q.filter(u=>!i.has(u.seedId))].slice(0,o)}b=0,R=0,g=0,v=0,y=[],k={},$=!1,I=0,f.category&&!$?V(f.category,()=>E(),e):E()}function ye(){q=z(y),b=0,R=0,g=0,v=0,y=[],k={},$=!0,I=N,E()}function De(e,t=h){a&&M({level:e,category:null,label:e,difficulty:t})}function $e(){if(g<2)return"";const e=g>=10?"🔥":g>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${g} in a row">${e} ${g}</span>`}function ke(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${d(t)}</span>`).join(" ")}
    </div>
  `}function Se(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function E(){if(!a)return;const e=q[b];if(!e)return Me();if(!qe(e.category,e.level)&&I<N)return V(e.category,()=>E(),e.level);const t=Math.round(b/q.length*100),s=$?`Recovery · ${f.label}`:f.label,r=[...e.choices].sort(()=>Math.random()-.5);a.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${b+1} of ${q.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${$?"🔄":"🧠"} ${d(s)}</span>
        ${$e()}
        <span class="sfq-progress" aria-label="Question ${b+1} of ${q.length}">${b+1}/${q.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${e.isReview?"🔄 Review · ":""}${d(T(e.category))}${h==="challenge"?" · PSLE Challenge":""}</p>
      ${h==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${Se(e)}</p>
      <p class="sfq-instruction">${d(e.q)}</p>
      ${h==="guided"?ke(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${r.map(l=>`<button class="pt-choice-btn" data-choice="${H(l)}" aria-label="Choose ${H(l)}">${d(l)}</button>`).join("")}
      </div>
      <div class="mcq-tools" id="gmcq-tools"></div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,ne(a.querySelector("#gmcq-tools"),()=>({question:e.q,choices:r}));const n=a.querySelector("#gmcq-next-wrap"),c=a.querySelector("#gmcq-next");if(c){const l=b+1>=q.length;c.textContent=l?"See Results →":"Next →",c.setAttribute("aria-label",l?"See results":"Next question"),c.addEventListener("click",()=>{b+=1,E()})}ue({root:a,item:e,feedbackEl:a.querySelector("#gmcq-hint"),nextWrap:n,nextBtn:c,mode:"grammarMcq",domain:"grammar",skillLabel:T(e.category),level:f.level||e.level,showClueWords:h!=="challenge",tip:A(e.category),onFirstAttempt:l=>{l?(R+=1,g+=1,v=Math.max(v,g),O.recordCorrect()):(g=0,y.push(e),O.recordWrong());const i=k[e.category]||(k[e.category]={correct:0,total:0});i.total+=1,l&&(i.correct+=1),L.updateSkill("grammarMcq",e.category,l),ie("grammarMcq",e,l,Date.now(),{promote:!$}),L.recordAttempt({quest:"grammarMcq",skill:e.category,correct:l,level:f.level||"Mixed"})},extraHtml:(l,i)=>{if(i)return"";let u="";const p=ee("grammarMcq",e.category);return p&&p.type==="redirect"&&(u+=`<p class="tf-section tf-section--redirect"><span class="tf-section__icon" aria-hidden="true">🧭</span> ${d(p.message)}</p>`),u}});const o=a.querySelector("#gmcq-rule-hint"),m=a.querySelector("#gmcq-hint-panel");o&&m&&o.addEventListener("click",()=>{var i;const l=m.hidden;if(m.hidden=!l,o.setAttribute("aria-expanded",String(l)),o.textContent=l?"💡 Hide the rule":"💡 Stuck? Show the rule",l){const u=A(e.category);m.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${d(u.rule)}</p>
          <p class="mcq-hint-eg"><em>${d(u.example)}</em></p>
          <p class="mcq-hint-tip">${d(u.tip)}</p>`,de(m,{item:e,categoryLabel:((i=x[e.category])==null?void 0:i.label)||e.category,level:f.level||e.level})}})}function we(){const e=Object.entries(k).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,r])=>({cat:s,pct:Math.round(r.correct/r.total*100),correct:r.correct,total:r.total})).sort((s,r)=>s.pct-r.pct).map(({cat:s,pct:r,correct:n,total:c})=>{const o=r>=70?"var(--color-success)":r>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${r<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${d(T(s))}</th>
          <td class="sq-skill-score">${n}/${c}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${r}%;background:${o}"></div></div></td>
          <td class="sq-skill-pct">${r}%${r<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function V(e,t,s=null){var i,u,p;I+=1,he(e,s);const r=A(e),n=x[e]||{icon:"🧠",label:e},c=s?W(e,s):null,o=c?c.label:n.label,m=(c==null?void 0:c.focus)||r.rule,l=(i=c==null?void 0:c.keyForms)!=null&&i.length?`Forms to watch this year: ${c.keyForms.join(", ")}`:r.example;a.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${H(n.label)}">
      <div class="mcq-rule-icon">${n.icon}</div>
      <h2 class="mcq-rule-title">${d(o)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you practise — read it once, then try the questions.</p>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${d(m)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${d(l)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${d(r.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`,(u=a.querySelector("#mcq-rule-start"))==null||u.addEventListener("click",t),(p=a.querySelector("#mcq-rule-skip"))==null||p.addEventListener("click",t)}function Me(){var l,i,u;const e=q.length;if(e===0){Q();return}const t=Math.round(R/e*100),s=t>=90?3:t>=70?2:t>0?1:0,r=y.length>0,n=[];r&&n.push(`Start with the Recovery Round — it replays only the ${y.length} question${y.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&h!=="guided"?n.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&h!=="challenge"&&!r&&n.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const c=n.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${n.join(" ")}</p>`:"",o=we();let m="";if(t<70){const p=Object.entries(k).filter(([,w])=>w.total>0);if(p.length>0){const[w]=p.sort(([,F],[,j])=>F.correct/F.total-j.correct/j.total)[0],D=A(w),B=x[w]||{icon:"🧠",label:w};m=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${B.icon} Focus area: ${d(B.label)}</p>
          <p class="mcq-focus-tip-rule">${d(D.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${d(D.example)}</em></p>
          <p class="mcq-focus-tip-tip">${d(D.tip)}</p>
        </div>`}}a.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${$?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${R}/${e} correct · ${t}%</p>
      ${v>=3?`<p class="sfq-instruction">${v>=10?"🔥":v>=5?"⚡":"✨"} Best streak: ${v} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${o}${m}${c}
      <div class="sfq-actions">
        ${r?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${y.length})</button>`:""}
        <button class="btn ${r?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,r&&((l=a.querySelector("#gmcq-recovery"))==null||l.addEventListener("click",()=>ye())),(i=a.querySelector("#gmcq-replay"))==null||i.addEventListener("click",()=>M(f)),(u=a.querySelector("#gmcq-menu"))==null||u.addEventListener("click",()=>Q())}export{Ie as cleanupGrammarMcq,U as countItemsForScope,fe as getAllItems,ge as getCategoryCounts,K as getItemsForScope,be as getLevelCounts,Ge as initGrammarMcq,Q as showGrammarMcqBrowser,De as startGrammarMcqLevel};
