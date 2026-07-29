import{s as b}from"./index-CbhM5EMr.js";import{m as T,P as f,a as g,b as y,c as S,d as v,e as C,f as _,g as $,h as A,i as M,j as k,k as q}from"./primaryPracticeTest-Bu-wyBK2.js";import"./gsap-C8pce-KX.js";import"./shortAnswerGrader-BbVaplnA.js";const L=["P1","P2","P3","P4","P5","P6"],R={"grammar-mcq":"Grammar MCQ","vocab-mcq":"Vocabulary MCQ","cloze-castle":"Grammar Cloze","word-vault":"Vocabulary Cloze","sentence-forge-word-order":"Word Order","sentence-forge-combining":"Sentence Combining","sentence-forge-synthesis":"Synthesis & Transformation","editing-quest":"Editing for Spelling and Grammar"},I={P1:"45 min",P2:"50 min",P3:"1 h",P4:"1 h 10 min",P5:"1 h 30 min",P6:"1 h 50 min"};let s=null,m=null,u=null,p=null,n=null;const P={practice:{icon:"🎯",label:"Practice Mode",desc:"Hints + per-section feedback. No timer."},test:{icon:"⏱️",label:"Test Mode",desc:"Timed. No hints. Mirrors the real paper."},review:{icon:"🔄",label:"Review Mistakes",desc:"Replay only the questions you got wrong last time."}},x=Object.freeze({P1:k.map(t=>q[t]).filter(Boolean),P2:A.map(t=>M[t]).filter(Boolean),P3:_.map(t=>$[t]).filter(Boolean),P4:v.map(t=>C[t]).filter(Boolean),P5:y.map(t=>S[t]).filter(Boolean),P6:f.map(t=>g[t]).filter(Boolean)}),h={"grammar-mcq":"grammar-mcq","cloze-castle":"cloze-castle","vocab-mcq":"vocab-mcq","word-vault":"word-vault","editing-quest":"editing-quest","sentence-forge-word-order":"sentence-forge","sentence-forge-combining":"sentence-forge","sentence-forge-synthesis":"sentence-forge"},O={"grammar-mcq":"🧠 Grammar MCQ","cloze-castle":"🏰 Cloze Castle","vocab-mcq":"📖 Vocabulary MCQ","word-vault":"🔑 Word Vault","editing-quest":"✏️ Editing Quest","sentence-forge":"🔨 Sentence Forge"};function H(t,{onLaunchSection:c,onGoHome:l}){s=t,m=c,u=l,b.get("paperSession")}function V(){n==null||n(),n=null,s&&(s.innerHTML="")}function Q(t){const c=Array.isArray(t==null?void 0:t.marks)?t.marks:[],l=c.reduce((e,i)=>e+(Number(i.scored)||0),0),a=c.reduce((e,i)=>e+(Number(i.total)||0),0),r=a>0?Math.round(l/a*100):0,d=c.map(e=>({key:e.key,label:R[e.key]||e.key,scored:Number(e.scored)||0,total:Number(e.total)||0,accuracy:e.total?Math.round(e.scored/e.total*100):0})).filter(e=>e.total>0&&e.accuracy<70).sort((e,i)=>e.accuracy-i.accuracy),o=d.slice(0,3).map(e=>({section:e.key,sectionLabel:e.label,target:h[e.key]||e.key,targetLabel:O[h[e.key]]||e.label,reason:`Score ${e.scored}/${e.total} (${e.accuracy}%) — practise this module next.`}));return{totalScored:l,totalTotal:a,accuracy:r,weakSections:d,recommendations:o}}function B(){var l;if(!s)return;n==null||n(),n=null,s.innerHTML=`
    <div class="sfq-browser exam-hub" role="region" aria-label="Exam Practice Hub level selection">
      <h2 class="sfq-title">📋 Exam Practice Hub</h2>
      <p class="sfq-instruction">Take a complete term paper interactively. Answers are scored section by section and the summary points you to the skills that need more practice.</p>

      <div class="exam-hub-modes" role="radiogroup" aria-label="Choose practice mode">
        ${Object.entries(P).filter(([a])=>a!=="review").map(([a,r])=>`
          <button class="exam-hub-mode-btn" data-paper-mode="${a}" aria-label="${r.label}: ${r.desc}">
            <span class="exam-hub-mode-icon" aria-hidden="true">${r.icon}</span>
            <span class="exam-hub-mode-name">${r.label}</span>
            <span class="exam-hub-mode-desc">${r.desc}</span>
          </button>`).join("")}
      </div>

      <div class="exam-hub-selected-mode" id="exam-hub-selected-mode" aria-live="polite"></div>

      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${L.map(a=>`<button class="sfq-level-btn" data-level="${a}" aria-label="Open ${a} paper">
          <strong>${a}</strong>
          <span style="display:block;font-size:0.7em;opacity:0.8">${I[a]}</span>
        </button>`).join("")}
      </div>

      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;let t=b.get("paperMode")||"practice";["practice","test"].includes(t)||(t="practice");const c=()=>{s.querySelectorAll("[data-paper-mode]").forEach(d=>{const o=d.dataset.paperMode===t;d.classList.toggle("exam-hub-mode-btn--active",o),d.setAttribute("aria-pressed",String(o))});const a=s.querySelector("#exam-hub-selected-mode"),r=P[t];a&&r&&(a.textContent=`${r.icon} ${r.label} selected — ${r.desc}`),b.set("paperMode",t),p&&E(p,t)};c(),s.querySelectorAll("[data-paper-mode]").forEach(a=>{a.addEventListener("click",()=>{t=a.dataset.paperMode,c()})}),s.querySelectorAll("[data-level]").forEach(a=>{a.addEventListener("click",()=>{p=a.dataset.level,E(p,t)})}),(l=s.querySelector("#paper-home"))==null||l.addEventListener("click",()=>u==null?void 0:u())}function E(t,c="practice"){const l=s==null?void 0:s.querySelector("#paper-playlist");if(!l)return;const a=x[t]||[],r=P[c]||P.practice,d=a.map((o,e)=>`
    <article class="ptg-launcher-card" data-paper-id="${o.id}">
      <h4>${o.label}</h4>
      <p><small>${o.duration} · ${o.totalMarks} marks · ${Object.keys(o).filter(i=>/^section[A-I]$/.test(i)).length} sections</small></p>
      <p>${o.blurb||""}</p>
      <button class="btn btn--primary" ${e===0?'id="paper-start-all"':""} data-start-paper="${o.id}" type="button">
        ${c==="test"?"⏱ Start timed paper":"🎯 Start practice paper"}
      </button>
    </article>`).join("");l.innerHTML=`
    <div class="dash-pattern-item exam-hub-playlist" style="margin-top:12px">
      <h3>${t} Papers · ${r.icon} ${r.label}</h3>
      <p class="sfq-instruction">${a.length} complete paper${a.length===1?"":"s"} available. ${c==="test"?"The timer starts when you open a paper; learning scaffolds are hidden.":"Check each section as you go and use the targeted practice links in your feedback."}</p>
      <div class="ptg-launcher-grid">${d||"<p>No papers are available for this level yet.</p>"}</div>
    </div>`,l.querySelectorAll("[data-start-paper]").forEach(o=>{o.addEventListener("click",()=>{const e=a.find(i=>i.id===o.dataset.startPaper);!e||!s||(b.set("paperMode",c),n=T(s,e,{mode:c,onClose:()=>{n=null,B()},onPractiseSkill:i=>m==null?void 0:m(i,t)}))})})}export{Q as buildPaperSummary,V as cleanupPaperMode,H as initPaperMode,B as showPaperModeBrowser};
