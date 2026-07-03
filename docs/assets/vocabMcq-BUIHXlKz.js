import{m as X,a as x,s as E,q as V,K as j,x as u,I as F,T as J}from"./index-qkED234S.js";import{V as C,a as H,b as Z}from"./vocabMcq-DeG6LZhf.js";import{r as ee,M as te,f as se,b as le,a as ce,c as ae}from"./mcqDifficulty-BcL3kPa9.js";import"./gsap-C8pce-KX.js";import"./mcqOptionExplanations-Bix-y16L.js";function I(e){const t=x[e]||{};return{rule:t.rule||`${t.label||e} vocabulary questions test word meaning and usage in context.`,example:t.example||"Choose the word that best fits the sentence.",tip:t.tip||"Read the whole sentence carefully and test each option to find which sounds natural."}}let r=null,T=null,h=[],b=0,A=0,M=!1,f={level:null,category:null,label:"All Skills",difficulty:"normal"},m="normal",q=0,$=0,k=[],_=!1,L={},w={},O=0;const N=3;function P(e){return`vmcq:${e}`}function re(e){return!!(E.get("lessonsSeen")||{})[P(e)]}function ne(e){const t={...E.get("lessonsSeen")||{}};t[P(e)]||(t[P(e)]=new Date().toISOString(),E.set("lessonsSeen",t))}function Se(e,t){r=e,T=t}function we(){r&&(r.innerHTML="")}function oe(e=C){return H.flatMap(t=>e[t]||[])}function K({level:e=null,category:t=null}={},s=C){const l=e?s[e]||[]:oe(s);return t?l.filter(a=>a.category===t):l}function Y(e={},t=C){return K(e,t).length}function ie(e=C,t=X){return t.map(s=>{const l={};let a=0;for(const o of H){const n=Y({level:o,category:s},e);l[o]=n,a+=n}return{category:s,total:a,levels:l}})}function ue(e=C,t=H){return t.map(s=>({level:s,total:Y({level:s},e)}))}function D(e){var t;return((t=x[e])==null?void 0:t.label)||e}function de(e){const t=e.level||null,s=e.category?D(e.category):null;return[t,s].filter(Boolean).join(" · ")||"All Skills"}function G(){if(!r)return;const e=ue(),t=ie();let s=f.level||"P1",l=f.difficulty||m||"normal";const a=()=>{var o,n;r.innerHTML=`
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one vocabulary skill at a time — or mix them all together.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${e.map(({level:c,total:i})=>`
              <button class="sfq-level-btn mcq-level-card ${c===s?"mcq-level-card--active":""}" data-pick-level="${c}">
                <span class="sfq-level-name">${c}</span>
                <span class="mcq-count-badge">${i} items</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${ee({selected:l,prefix:"vmcq"})}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${s} Vocabulary Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${s} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${t.map(({category:c,levels:i})=>{const g=i[s]||0,p=x[c]||{icon:"📘",label:c,desc:""};return g?`
                <button class="mcq-skill-card" data-scope-level="${s}" data-scope-category="${c}">
                  <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                  <p class="mcq-skill-sub">${p.desc||""}</p>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${g} items in ${s}</span></p>
                </button>`:`
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${p.icon} ${p.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${s}</p>
                  </button>`}).join("")}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="vmcq-home">← Home</button></div>
      </div>`,r.querySelectorAll("[data-pick-level]").forEach(c=>{c.addEventListener("click",()=>{s=c.dataset.pickLevel,a()})}),r.querySelectorAll("[data-vmcq-difficulty]").forEach(c=>{c.addEventListener("click",()=>{l=c.dataset.vmcqDifficulty,a()})}),(o=r.querySelector("#vmcq-start-level"))==null||o.addEventListener("click",()=>{B({level:s,category:null,difficulty:l})}),r.querySelectorAll("[data-scope-level][data-scope-category]").forEach(c=>{c.addEventListener("click",()=>{B({level:c.dataset.scopeLevel,category:c.dataset.scopeCategory,difficulty:l})})}),(n=r.querySelector("#vmcq-home"))==null||n.addEventListener("click",()=>T==null?void 0:T())};a()}function U(e){return[...e].sort((t,s)=>{const l=V.getSkillScore("vocabMcq",t.category),a=V.getSkillScore("vocabMcq",s.category);return l-a+(Math.random()-.5)*.3})}function B({level:e=null,category:t=null,label:s="",difficulty:l=m}={}){var n;m=((n=te[l])==null?void 0:n.key)||"normal",f={level:e,category:t,label:s||de({level:e,category:t}),difficulty:m};const a=e?{[e]:Z(e)}:Object.fromEntries(H.map(c=>[c,C[c]]));h=U(se(K({level:e,category:t},a),{level:e,difficulty:m}));const o=E.get("paperItemLimit");o&&(E.set("paperItemLimit",null),h=h.slice(0,o)),b=0,A=0,q=0,$=0,k=[],L={},_=!1,M=!1,w={},O=0,f.category&&!_?z(f.category,()=>R()):R()}function pe(){h=U(k),b=0,A=0,q=0,$=0,k=[],L={},_=!0,M=!1,w={},O=N,R()}function _e(e,t=m){r&&B({level:e,category:null,label:e,difficulty:t})}function me(){if(q<2)return"";const e=q>=10?"🔥":q>=5?"⚡":"✨";return`<span class="mcq-streak" aria-label="${q} in a row">${e} ${q}</span>`}function he(e){return!e.clueWords||e.clueWords.length===0?"":`
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong>
      ${e.clueWords.map(t=>`<span class="mcq-clue-chip">${u(t)}</span>`).join(" ")}
    </div>
  `}function fe(e){return/___/.test(e.q||"")?"Read the whole sentence first, then choose the word that fits the blank.":"Read the question carefully, then choose the best answer."}function R(){if(!r)return;const e=h[b];if(!e)return ve();if(!re(e.category)&&O<N)return z(e.category,()=>R());M=!1;const t=Math.round(b/h.length*100),s=_?`Recovery · ${f.label}`:f.label,l=[...e.choices].sort(()=>Math.random()-.5);r.innerHTML=`
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${b+1} of ${h.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${_?"🔄":"📖"} ${u(s)}</span>
        ${me()}
        <span class="sfq-progress" aria-label="Question ${b+1} of ${h.length}">${b+1}/${h.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>
      <p class="mcq-category-tag">${u(D(e.category))}${m==="challenge"?" · PSLE Challenge":""}</p>
      ${m==="guided"&&e.explain?`<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${e.explain}</div>`:""}
      <p class="mcq-task-instruction">${fe(e)}</p>
      <p class="sfq-instruction">${u(e.q)}</p>
      ${m==="guided"?he(e):""}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${l.map(n=>`<button class="pt-choice-btn" data-choice="${j(n)}" aria-label="Choose ${j(n)}">${u(n)}</button>`).join("")}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
      </div>
    </div>`,r.querySelectorAll("[data-choice]").forEach(n=>{n.addEventListener("click",()=>{if(M)return;M=!0;const c=n.dataset.choice,i=c===e.answer;i?(A+=1,q+=1,$=Math.max($,q),F.recordCorrect()):(q=0,k.push(e),F.recordWrong());const g=L[e.category]||(L[e.category]={correct:0,total:0});g.total+=1,i&&(g.correct+=1),V.updateSkill("vocabMcq",e.category,i),V.recordAttempt({quest:"vocabMcq",skill:e.category,correct:i,level:f.level||"Mixed"}),r.querySelectorAll("[data-choice]").forEach(d=>{d.disabled=!0,d.setAttribute("aria-disabled","true"),d.dataset.choice===e.answer?d.classList.add("pt-choice--correct"):d===n&&!i&&d.classList.add("pt-choice--wrong")});const p=r.querySelector("#vmcq-hint");let S=le(e,c,i,{showClueWords:m!=="challenge"});if(i?w[e.category]=0:w[e.category]=(w[e.category]||0)+1,!i){const d=J("vocabMcq",e.category);d&&d.type==="redirect"&&(S+=` <br>💡 ${u(d.message)}`)}if(!i&&w[e.category]>=2){const d=I(e.category);S+=`<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${u(d.rule)}<br><em>${u(d.example)}</em></span>`}p&&(p.innerHTML=S,ce(p,{item:e,selectedChoice:c,level:f.level||e.level}));const y=r.querySelector("#vmcq-next-wrap"),v=r.querySelector("#vmcq-next");if(y&&v){const d=b+1>=h.length;v.textContent=d?"See Results →":"Next →",v.setAttribute("aria-label",d?"See results":"Next question"),y.style.display="",v.addEventListener("click",()=>{b+=1,R()}),v.focus()}})});const a=r.querySelector("#vmcq-rule-hint"),o=r.querySelector("#vmcq-hint-panel");a&&o&&a.addEventListener("click",()=>{var c;const n=o.hidden;if(o.hidden=!n,a.setAttribute("aria-expanded",String(n)),a.textContent=n?"💡 Hide the rule":"💡 Stuck? Show the rule",n){const i=I(e.category);o.innerHTML=`
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${u(i.rule)}</p>
          <p class="mcq-hint-eg"><em>${u(i.example)}</em></p>
          <p class="mcq-hint-tip">${u(i.tip)}</p>`,ae(o,{item:e,categoryLabel:((c=x[e.category])==null?void 0:c.label)||e.category,level:f.level||e.level})}})}function qe(){const e=Object.entries(L).filter(([,s])=>s.total>0);return e.length===0?"":`<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${e.map(([s,l])=>({cat:s,pct:Math.round(l.correct/l.total*100),correct:l.correct,total:l.total})).sort((s,l)=>s.pct-l.pct).map(({cat:s,pct:l,correct:a,total:o})=>{const n=l>=70?"var(--color-success)":l>=40?"var(--color-primary)":"var(--color-error)";return`
        <tr class="sq-skill-table-row ${l<50?"sq-skill-table-row--weak":""}">
          <th scope="row" class="sq-skill-name">${u(D(s))}</th>
          <td class="sq-skill-score">${a}/${o}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${l}%;background:${n}"></div></div></td>
          <td class="sq-skill-pct">${l}%${l<50?" · weak":""}</td>
        </tr>`}).join("")}</tbody></table>`}function z(e,t){var a,o;O+=1,ne(e);const s=I(e),l=x[e]||{icon:"📖",label:e};r.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${j(l.label)}">
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
    </div>`,(a=r.querySelector("#mcq-rule-start"))==null||a.addEventListener("click",t),(o=r.querySelector("#mcq-rule-skip"))==null||o.addEventListener("click",t)}function ve(){var i,g,p;const e=h.length;if(e===0){G();return}const t=Math.round(A/e*100),s=t>=90?3:t>=70?2:t>0?1:0,l=k.length>0,a=[];l&&a.push(`Start with the Recovery Round — it replays only the ${k.length} question${k.length===1?"":"s"} you missed, while they are still fresh in your mind.`),t<70&&m!=="guided"?a.push("If this round felt hard, switch to Learn mode — you will see each rule before you answer."):t>=90&&m!=="challenge"&&!l&&a.push("You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.");const o=a.length?`<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${a.join(" ")}</p>`:"",n=qe();let c="";if(t<70){const S=Object.entries(L).filter(([,y])=>y.total>0);if(S.length>0){const[y]=S.sort(([,Q],[,W])=>Q.correct/Q.total-W.correct/W.total)[0],v=I(y),d=x[y]||{icon:"📖",label:y};c=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${d.icon} Focus area: ${u(d.label)}</p>
          <p class="mcq-focus-tip-rule">${u(v.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${u(v.example)}</em></p>
          <p class="mcq-focus-tip-tip">${u(v.tip)}</p>
        </div>`}}r.innerHTML=`
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${_?"🔄 Recovery Round Complete":"Vocabulary MCQ Complete"}</h2>
      <div class="sfq-stars" aria-label="${s} stars">${"⭐".repeat(s)}${"☆".repeat(3-s)}</div>
      <p class="sfq-instruction">${A}/${e} correct · ${t}%</p>
      ${$>=3?`<p class="sfq-instruction">${$>=10?"🔥":$>=5?"⚡":"✨"} Best streak: ${$} in a row</p>`:""}
      <p class="sfq-instruction">${t>=90?"Outstanding!":t>=70?"Great work — keep practising!":t>0?"Good effort — mistakes are how we learn!":"Keep trying — you can do it!"}</p>
      ${n}${c}${o}
      <div class="sfq-actions">
        ${l?`<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${k.length})</button>`:""}
        <button class="btn ${l?"btn--ghost":"btn--primary"}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`,l&&((i=r.querySelector("#vmcq-recovery"))==null||i.addEventListener("click",()=>pe())),(g=r.querySelector("#vmcq-replay"))==null||g.addEventListener("click",()=>B(f)),(p=r.querySelector("#vmcq-menu"))==null||p.addEventListener("click",()=>G())}export{we as cleanupVocabMcq,Y as countItemsForScope,oe as getAllItems,ie as getCategoryCounts,K as getItemsForScope,ue as getLevelCounts,Se as initVocabMcq,G as showVocabMcqBrowser,_e as startVocabMcqLevel};
