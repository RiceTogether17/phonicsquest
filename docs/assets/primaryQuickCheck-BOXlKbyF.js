import{G as C}from"./grammarMcq-XM2lmeAY.js";import{V as M}from"./vocabMcq-CHlw61lA.js";import{u as v}from"./index-D7F_oDrj.js";import"./mcqOptionExplanations-Atx8bQId.js";import"./practiceExpansion-CxOuQ-yw.js";import"./gsap-C8pce-KX.js";const b=3;function P(t){const c=w(t),i=k(C[c]||[],b,"grammarMcq"),n=k(M[c]||[],b,"vocabMcq");return{grade:c,items:[...i,...n]}}const g=["P1","P2","P3","P4","P5","P6"];function E(t,c,i=0){const n=g.indexOf(String(t||"").toUpperCase()),r=n===-1?2:n;return i<4?{level:g[r],direction:"same"}:c<=.35&&r>0?{level:g[r-1],direction:"down"}:c>=.9&&r<g.length-1?{level:g[r+1],direction:"up"}:{level:g[r],direction:"same"}}function L(t){if(!Array.isArray(t)||t.length===0)return{total:0,correct:0,accuracy:0,weakSkills:[],strongSkills:[]};const c=[],i=[];let n=0;for(const r of t){if(!r||!r.source||!r.category)continue;const e=!!r.correct;e&&n++,v.updateSkill(r.source,r.category,e,{alpha:.45}),v.recordAttempt({quest:r.source,skill:r.category,correct:e,level:r.level||null}),(e?i:c).push({quest:r.source,skill:r.category})}return{total:t.length,correct:n,accuracy:t.length>0?n/t.length:0,weakSkills:c,strongSkills:i}}function w(t){const c=String(t||"").toUpperCase();return/^P[1-6]$/.test(c)?c:"P3"}function k(t,c,i){const n=[],r=new Set;for(const e of t)if(!(!e||!e.category)&&!r.has(e.category)&&(r.add(e.category),n.push({source:i,category:e.category,subskill:e.subskill||e.category,q:e.q,choices:Array.isArray(e.choices)?[...e.choices]:[],answer:e.answer,explain:e.explain||"",level:e.level||null}),n.length>=c))break;return n}const W={_normaliseGrade:w,_pickPerCategory:k},a=t=>String(t??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),T=t=>String(t??"").replace(/"/g,"&quot;").replace(/</g,"&lt;");function N({container:t,profile:c,onComplete:i}){if(!t||typeof i!="function")return;const n=(c==null?void 0:c.primaryGrade)||"P3",r=(c==null?void 0:c.name)||"Friend",{items:e}=P(n),f=[];let h="intro",d=0,q=!1;function y(){return h==="intro"?S():h==="summary"?A():$()}function S(){var s,l;t.innerHTML=`
      <div class="pqc-card">
        <p class="pqc-eyebrow">👋 Welcome, ${a(r)}!</p>
        <h2 class="pqc-title">A quick check — about 5 minutes</h2>
        <p class="pqc-body">
          Try ${e.length} questions so Giri knows what to recommend.
          Wrong answers won't lose anything — this is just to get started.
        </p>
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="start">Start the quick check</button>
          <button class="btn btn--ghost" data-action="skip">Skip — I'll learn as I go</button>
        </div>
      </div>`,(s=t.querySelector('[data-action="start"]'))==null||s.addEventListener("click",()=>{h="questions",d=0,y()}),(l=t.querySelector('[data-action="skip"]'))==null||l.addEventListener("click",()=>{i({skipped:!0})})}function $(){const s=e[d];if(!s)return h="summary",y();const l=`${d+1} / ${e.length}`;t.innerHTML=`
      <div class="pqc-card pqc-card--question">
        <div class="pqc-progress" role="status">${a(l)}</div>
        <p class="pqc-prompt">${a(s.q)}</p>
        <div class="pqc-choices" role="group" aria-label="Choices">
          ${s.choices.map(o=>`
            <button class="pqc-choice" type="button" data-choice="${T(o)}">${a(o)}</button>
          `).join("")}
        </div>
        <div class="pqc-feedback" id="pqc-feedback" aria-live="polite"></div>
      </div>`,q=!1,t.querySelectorAll(".pqc-choice").forEach(o=>{o.addEventListener("click",()=>_(o))})}function _(s){if(q)return;q=!0;const l=s.dataset.choice,o=e[d],u=l===o.answer;f.push({source:o.source,category:o.category,level:o.level,correct:u}),t.querySelectorAll(".pqc-choice").forEach(m=>{m.dataset.choice===o.answer?m.classList.add("pqc-choice--correct"):m===s&&!u&&m.classList.add("pqc-choice--wrong"),m.disabled=!0});const p=t.querySelector("#pqc-feedback");p&&(p.className=`pqc-feedback ${u?"pqc-feedback--correct":"pqc-feedback--wrong"}`,p.innerHTML=u?`<strong>Yes!</strong> ${a(o.explain||"")}`:`<strong>Almost!</strong> ${a(o.explain||"")}`),setTimeout(()=>{d++,d>=e.length&&(h="summary"),y()},1100)}function A(){var p;const s=L(f),l=Math.round(s.accuracy*100),o=E(n,s.accuracy,s.total);s.recommendation=o;const u=o.direction==="down"?`Giri suggests warming up with <strong>${a(o.level)}</strong> practice first — quick wins build speed for ${a(n)}.`:o.direction==="up"?`Wow — Giri thinks you are ready to stretch into <strong>${a(o.level)}</strong> practice!`:"";t.innerHTML=`
      <div class="pqc-card pqc-card--summary">
        <p class="pqc-eyebrow">🎉 All done — thanks for the quick check!</p>
        <h2 class="pqc-title">Giri has a plan for you now.</h2>
        <p class="pqc-body">
          You answered ${s.correct} of ${s.total} (${l}%) — but the score doesn't matter.
          What matters is Giri now knows which skills to bring up first.
        </p>
        ${u?`<p class="pqc-body pqc-body--level">${u}</p>`:""}
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="continue">Start exploring</button>
        </div>
      </div>`,(p=t.querySelector('[data-action="continue"]'))==null||p.addEventListener("click",()=>{i({skipped:!1,results:s})})}y()}export{b as QUICK_CHECK_PER_DOMAIN,W as __TEST__,L as applyPrimaryQuickCheckResults,P as buildPrimaryQuickCheck,E as recommendPrimaryLevel,N as showPrimaryQuickCheck};
