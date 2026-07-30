import{u as X,a6 as Z,G as A,s as C,t as T,_ as D,D as u,Z as W,a7 as J,$ as I}from"./index-DFt0mvZW.js";import{g as ee,i as te,r as se,M as le,f as re,b as ae,a as ce,c as ne}from"./mcqDifficulty-BfhO2hUR.js";import{G as _,a as B,b as ie}from"./grammarMcq-B5ToUfYA.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";import"./practiceExpansion-67d_LqFm.js";let c=null,G=null,h=[],b=0,E=0,x=!1,f={level:null,category:null,label:"All Skills",difficulty:"normal"},m="normal",q=0,$=0,k=[],M=!1,L={},w={},j=0;const K=3;function P(e){return`gmcq:${e}`}function oe(e){return!!(C.get("lessonsSeen")||{})[P(e)]}function ue(e){const t={...C.get("lessonsSeen")||{}};t[P(e)]||(t[P(e)]=new Date().toISOString(),C.set("lessonsSeen",t))}function _e(e,t){c=e,G=t}function xe(){c&&(c.innerHTML="")}function de(e=_){return B.flatMap(t=>e[t]||[])}function Y({level:e=null,category:t=null}={},s=_){const l=e?s[e]||[]:de(s);return t?l.filter(a=>a.category===t):l}function U(e={},t=_){return Y(e,t).length}function me(e=_,t=X){return t.map(s=>{const l={};let a=0;for(const i of B){const n=U({level:i,category:s},e);l[i]=n,a+=n}return{category:s,total:a,levels:l}})}function pe(e=_,t=B){return t.map(s=>({level:s,total:U({level:s},e)}))}function F(e){var t;return((t=A[e])==null?void 0:t.label)||e}function he(e){const t=e.level||null,s=e.category?F(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function N(){if(!c)return;const e=pe(),t=me();let s=f.level||ee(),l=f.difficulty||m||"normal";const a=()=>{var i,n;c.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one grammar skill at a time — or mix them all together.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:r,total:o})=>`
              <button class="sfq-level-btn mcq-level-card ${r===s?"mcq-level-card--active":""}" data-pick-level="${r}">
                ${te(r)?'<span class="mcq-level-rec" aria-label="Recommended level">⭐ For you</span>':""}
                <span class="sfq-level-name">${r}</span>
                <span class="mcq-count-badge">${o} items</span>
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
            ${t.filter(({category:r})=>Z(r,s)).map(({category:r,levels:o})=>{const v=o[s]||0,p=A[r]||{icon:"🧩",label:r};return v?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${r}">
                  <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${v} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`,c.querySelectorAll("[data-pick-level]").forEach(r=>{r.addEventListener("click",()=>{s=r.dataset.pickLevel,a()})}),c.querySelectorAll("[data-gmcq-difficulty]").forEach(r=>{r.addEventListener("click",()=>{l=r.dataset.gmcqDifficulty,a()})}),(i=c.querySelector("#gmcq-start-level"))==null||i.addEventListener("click",()=>{H({level:s,category:null,difficulty:l})}),c.querySelectorAll("[data-scope-level][data-scope-category]").forEach(r=>{r.addEventListener("click",()=>{H({level:r.dataset.scopeLevel,category:r.dataset.scopeCategory,difficulty:l})})}),(n=c.querySelector("#gmcq-home"))==null||n.addEventListener("click",()=>G==null?void 0:G())};a()}function z(e){return[...e].sort((t,s)=>{const l=T.getSkillScore("grammarMcq",t.category),a=T.getSkillScore("grammarMcq",s.category);return l-a+(Math.random()-.5)*.3})}function H({level:e=null,category:t=null,label:s="",difficulty:l=m}={}){var n;m=((n=le[l])==null?void 0:n.key)||"normal",f={level:e,category:t,label:s||he({level:e,category:t}),difficulty:m};const a=e?{[e]:ie(e)}:Object.fromEntries(B.map(r=>[r,_[r]]));h=z(re(Y({level:e,category:t},a),{level:e,difficulty:m}));const i=C.get("paperItemLimit");i&&(C.set("paperItemLimit",null),h=h.slice(0,i)),b=0,E=0,q=0,$=0,k=[],L={},M=!1,x=!1,w={},j=0,f.category&&!M?V(f.category,()=>R()):R()}function fe(){h=z(k),b=0,E=0,q=0,$=0,k=[],L={},M=!0,x=!1,w={},j=K,R()}function Ce(e,t=m){c&&H({level:e,category:null,label:e,difficulty:t})}function qe(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function ge(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${u(t)}</span>`).join(" ")}
    </div>
  `}function be(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function R(){if(!c)return;const e=h[b];if(!e)return ye();if(!oe(e.category)&&j<K)return V(e.category,()=>R());x=!1;const t=Math.round(b/h.length*100),s=M?`Recovery · ${f.label}`:f.label,l=[...e.choices].sort(()=>Math.random()-.5);c.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Grammar question ${b+1} of ${h.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${M?"🔄":"🧠"} ${u(s)}</span>
        ${qe()}
        <span class="sfq-progress" aria-label="Question ${b+1} of ${h.length}">${b+1}/${h.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${u(F(e.category))}${m==="challenge"?" · PSLE Challenge":""}</p>
      ${m==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${be(e)}</p>
      <p class="sfq-instruction">${u(e.q)}</p>
      ${m==="guided"?ge(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(n=>`<button class="pt-choice-btn" data-choice="${D(n)}" aria-label="Choose ${D(n)}">${u(n)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,c.querySelectorAll("[data-choice]").forEach(n=>{n.addEventListener("click",()=>{if(x)return;x=!0;const r=n.dataset.choice,o=r===e.answer;o?(E+=1,q+=1,$=Math.max($,q),W.recordCorrect()):(q=0,k.push(e),W.recordWrong());const v=L[e.category]||(L[e.category]={correct:0,total:0});v.total+=1,o&&(v.correct+=1),T.updateSkill("grammarMcq",e.category,o),T.recordAttempt({quest:"grammarMcq",skill:e.category,correct:o,level:f.level||"Mixed"}),c.querySelectorAll("[data-choice]").forEach(d=>{d.disabled=!0,d.setAttribute("aria-disabled","true"),d.dataset.choice===e.answer?d.classList.add("pt-choice--correct"):d===n&&!o&&d.classList.add("pt-choice--wrong")});const p=c.querySelector("#gmcq-hint");let S=ae(e,r,o,{showClueWords:m!=="challenge"});if(o?w[e.category]=0:w[e.category]=(w[e.category]||0)+1,!o){const d=J("grammarMcq",e.category);d&&d.type==="redirect"&&(S+=` <br>💡 ${u(d.message)}`)}if(!o&&w[e.category]>=2){const d=I(e.category);S+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(d.rule)}<br><em>${u(d.example)}</em></span>`}p&&(p.innerHTML=S,ce(p,{item:e,selectedChoice:r,level:f.level||e.level}));const y=c.querySelector("#gmcq-next-wrap"),g=c.querySelector("#gmcq-next");if(y&&g){const d=b+1>=h.length;g.textContent=d?"See Results →":"Next →",g.setAttribute("aria-label",d?"See results":"Next question"),y.style.display="",g.addEventListener("click",()=>{b+=1,R()}),g.focus()}})});const a=c.querySelector("#gmcq-rule-hint"),i=c.querySelector("#gmcq-hint-panel");a&&i&&a.addEventListener("click",()=>{var r;const n=i.hidden;if(i.hidden=!n,a.setAttribute("aria-expanded",String(n)),a.textContent=n?"💡 Hide the rule":"💡 Stuck? Show the rule",n){const o=I(e.category);i.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(o.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(o.example)}</em></p>
          <p class="mcq-hint-tip">${u(o.tip)}</p>`,ne(i,{item:e,categoryLabel:((r=A[e.category])==null?void 0:r.label)||e.category,level:f.level||e.level})}})}function ve(){const e=Object.entries(L).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:a,total:i})=>{const n=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(F(s))}</th>
          <td class="sq-skill-score">${a}/${i}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${n}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function V(e,t){var a,i;j+=1,ue(e);const s=I(e),l=A[e]||{icon:"🧠",label:e};c.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${D(l.label)}">
      <div class="mcq-rule-icon">${l.icon}</div>
      <h2 class="mcq-rule-title">${u(l.label)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you practise — read it once, then try the questions.</p>
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
        <button class="btn btn--ghost" id="mcq-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`,(a=c.querySelector("#mcq-rule-start"))==null||a.addEventListener("click",t),(i=c.querySelector("#mcq-rule-skip"))==null||i.addEventListener("click",t)}function ye(){var o,v,p;const e=h.length;if(e===0){N();return}const t=Math.round(E/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=k.length>0,a=[];l&&a.push(`Start with the Recovery Round — it replays only the ${k.length} question${k.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&m!=="guided"?a.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&m!=="challenge"&&!l&&a.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const i=a.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${a.join(" ")}</p>`:"",n=ve();let r="";if(t<70){const S=Object.entries(L).filter(([,y])=>y.total>0);if(S.length>0){const[y]=S.sort(([,O],[,Q])=>O.correct/O.total-Q.correct/Q.total)[0],g=I(y),d=A[y]||{icon:"🧠",label:y};r=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${d.icon} Focus area: ${u(d.label)}</p>
          <p class="mcq-focus-tip-rule">${u(g.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u(g.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u(g.tip)}</p>
        </div>`}}c.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${M?"🔄 Recovery Round Complete":"Grammar MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${E}/${e} correct · ${t}%</p>
      ${$>=3?`<p class="sfq-instruction">${$>=10?"🔥":$>=5?"⚡":"✨"} Best streak: ${$} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${n}${r}${i}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${k.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((o=c.querySelector("#gmcq-recovery"))==null||o.addEventListener("click",()=>fe())),(v=c.querySelector("#gmcq-replay"))==null||v.addEventListener("click",()=>H(f)),(p=c.querySelector("#gmcq-menu"))==null||p.addEventListener("click",()=>N())}export{xe as cleanupGrammarMcq,U as countItemsForScope,de as getAllItems,me as getCategoryCounts,Y as getItemsForScope,pe as getLevelCounts,_e as initGrammarMcq,N as showGrammarMcqBrowser,Ce as startGrammarMcqLevel};
