import{G as A}from"./grammarMcq-BPhhOECh.js";import{V as M}from"./vocabMcq-CgOCvIrf.js";import{q as f}from"./index-DGPlVDgH.js";import"./mcqOptionExplanations-Bix-y16L.js";import"./gsap-C8pce-KX.js";const b=3;function C(t){const c=v(t),n=m(A[c]||[],b,"grammarMcq"),a=m(M[c]||[],b,"vocabMcq");return{grade:c,items:[...n,...a]}}function E(t){if(!Array.isArray(t)||t.length===0)return{total:0,correct:0,accuracy:0,weakSkills:[],strongSkills:[]};const c=[],n=[];let a=0;for(const r of t){if(!r||!r.source||!r.category)continue;const e=!!r.correct;e&&a++,f.updateSkill(r.source,r.category,e,{alpha:.45}),f.recordAttempt({quest:r.source,skill:r.category,correct:e,level:r.level||null}),(e?n:c).push({quest:r.source,skill:r.category})}return{total:t.length,correct:a,accuracy:t.length>0?a/t.length:0,weakSkills:c,strongSkills:n}}function v(t){const c=String(t||"").toUpperCase();return/^P[1-6]$/.test(c)?c:"P3"}function m(t,c,n){const a=[],r=new Set;for(const e of t)if(!(!e||!e.category)&&!r.has(e.category)&&(r.add(e.category),a.push({source:n,category:e.category,subskill:e.subskill||e.category,q:e.q,choices:Array.isArray(e.choices)?[...e.choices]:[],answer:e.answer,explain:e.explain||"",level:e.level||null}),a.length>=c))break;return a}const Q={_normaliseGrade:v,_pickPerCategory:m},u=t=>String(t??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),T=t=>String(t??"").replace(/"/g,"&quot;").replace(/</g,"&lt;");function H({container:t,profile:c,onComplete:n}){if(!t||typeof n!="function")return;const a=(c==null?void 0:c.primaryGrade)||"P3",r=(c==null?void 0:c.name)||"Friend",{items:e}=C(a),y=[];let d="intro",l=0,q=!1;function h(){return d==="intro"?S():d==="summary"?$():w()}function S(){var o,i;t.innerHTML=`
      <div class="pqc-card">
        <p class="pqc-eyebrow">👋 Welcome, ${u(r)}!</p>
        <h2 class="pqc-title">A quick check — about 5 minutes</h2>
        <p class="pqc-body">
          Try ${e.length} questions so Giri knows what to recommend.
          Wrong answers won't lose anything — this is just to get started.
        </p>
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="start">Start the quick check</button>
          <button class="btn btn--ghost" data-action="skip">Skip — I'll learn as I go</button>
        </div>
      </div>`,(o=t.querySelector('[data-action="start"]'))==null||o.addEventListener("click",()=>{d="questions",l=0,h()}),(i=t.querySelector('[data-action="skip"]'))==null||i.addEventListener("click",()=>{n({skipped:!0})})}function w(){const o=e[l];if(!o)return d="summary",h();const i=`${l+1} / ${e.length}`;t.innerHTML=`
      <div class="pqc-card pqc-card--question">
        <div class="pqc-progress" role="status">${u(i)}</div>
        <p class="pqc-prompt">${u(o.q)}</p>
        <div class="pqc-choices" role="group" aria-label="Choices">
          ${o.choices.map(s=>`
            <button class="pqc-choice" type="button" data-choice="${T(s)}">${u(s)}</button>
          `).join("")}
        </div>
        <div class="pqc-feedback" id="pqc-feedback" aria-live="polite"></div>
      </div>`,q=!1,t.querySelectorAll(".pqc-choice").forEach(s=>{s.addEventListener("click",()=>_(s))})}function _(o){if(q)return;q=!0;const i=o.dataset.choice,s=e[l],g=i===s.answer;y.push({source:s.source,category:s.category,level:s.level,correct:g}),t.querySelectorAll(".pqc-choice").forEach(p=>{p.dataset.choice===s.answer?p.classList.add("pqc-choice--correct"):p===o&&!g&&p.classList.add("pqc-choice--wrong"),p.disabled=!0});const k=t.querySelector("#pqc-feedback");k&&(k.className=`pqc-feedback ${g?"pqc-feedback--correct":"pqc-feedback--wrong"}`,k.innerHTML=g?`<strong>Yes!</strong> ${u(s.explain||"")}`:`<strong>Almost!</strong> ${u(s.explain||"")}`),setTimeout(()=>{l++,l>=e.length&&(d="summary"),h()},1100)}function $(){var s;const o=E(y),i=Math.round(o.accuracy*100);t.innerHTML=`
      <div class="pqc-card pqc-card--summary">
        <p class="pqc-eyebrow">🎉 All done — thanks for the quick check!</p>
        <h2 class="pqc-title">Giri has a plan for you now.</h2>
        <p class="pqc-body">
          You answered ${o.correct} of ${o.total} (${i}%) — but the score doesn't matter.
          What matters is Giri now knows which skills to bring up first.
        </p>
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="continue">Start exploring</button>
        </div>
      </div>`,(s=t.querySelector('[data-action="continue"]'))==null||s.addEventListener("click",()=>{n({skipped:!1,results:o})})}h()}export{b as QUICK_CHECK_PER_DOMAIN,Q as __TEST__,E as applyPrimaryQuickCheckResults,C as buildPrimaryQuickCheck,H as showPrimaryQuickCheck};
