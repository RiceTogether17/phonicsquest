import{s as b}from"./index-D7F_oDrj.js";import{m as h,P as E,a as f,b as v,c as S,d as _,e as $,f as C,g as y,h as A,i as g,j as M,k as R}from"./primaryPracticeTest-CDS4kcN7.js";import"./gsap-C8pce-KX.js";import"./shortAnswerGrader-BbVaplnA.js";const k=["P1","P2","P3","P4","P5","P6"],I={P1:"45 min",P2:"50 min",P3:"1 h",P4:"1 h 10 min",P5:"1 h 30 min",P6:"1 h 50 min"};let a=null,m=null,P=null,p=null,r=null;const u={practice:{icon:"🎯",label:"Practice Mode",desc:"Hints + per-section feedback. No timer."},test:{icon:"⏱️",label:"Test Mode",desc:"Timed. No hints. Mirrors the real paper."},review:{icon:"🔄",label:"Review Mistakes",desc:"Replay only the questions you got wrong last time."}},x=Object.freeze({P1:M.map(e=>R[e]).filter(Boolean),P2:A.map(e=>g[e]).filter(Boolean),P3:C.map(e=>y[e]).filter(Boolean),P4:_.map(e=>$[e]).filter(Boolean),P5:v.map(e=>S[e]).filter(Boolean),P6:E.map(e=>f[e]).filter(Boolean)});function H(e,{onLaunchSection:l,onGoHome:o}){a=e,m=l,P=o}function O(){r==null||r(),r=null,a&&(a.innerHTML="")}function q(){var o;if(!a)return;r==null||r(),r=null,a.innerHTML=`
    <div class="sfq-browser exam-hub" role="region" aria-label="Exam Practice Hub level selection">
      <h2 class="sfq-title">📋 Exam Practice Hub</h2>
      <p class="sfq-instruction">Take a complete term paper interactively. Answers are scored section by section and the summary points you to the skills that need more practice.</p>

      <div class="exam-hub-modes" role="radiogroup" aria-label="Choose practice mode">
        ${Object.entries(u).filter(([t])=>t!=="review").map(([t,s])=>`
          <button class="exam-hub-mode-btn" data-paper-mode="${t}" aria-label="${s.label}: ${s.desc}">
            <span class="exam-hub-mode-icon" aria-hidden="true">${s.icon}</span>
            <span class="exam-hub-mode-name">${s.label}</span>
            <span class="exam-hub-mode-desc">${s.desc}</span>
          </button>`).join("")}
      </div>

      <div class="exam-hub-selected-mode" id="exam-hub-selected-mode" aria-live="polite"></div>

      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${k.map(t=>`<button class="sfq-level-btn" data-level="${t}" aria-label="Open ${t} paper">
          <strong>${t}</strong>
          <span style="display:block;font-size:0.7em;opacity:0.8">${I[t]}</span>
        </button>`).join("")}
      </div>

      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;let e=b.get("paperMode")||"practice";["practice","test"].includes(e)||(e="practice");const l=()=>{a.querySelectorAll("[data-paper-mode]").forEach(c=>{const i=c.dataset.paperMode===e;c.classList.toggle("exam-hub-mode-btn--active",i),c.setAttribute("aria-pressed",String(i))});const t=a.querySelector("#exam-hub-selected-mode"),s=u[e];t&&s&&(t.textContent=`${s.icon} ${s.label} selected — ${s.desc}`),b.set("paperMode",e),p&&T(p,e)};l(),a.querySelectorAll("[data-paper-mode]").forEach(t=>{t.addEventListener("click",()=>{e=t.dataset.paperMode,l()})}),a.querySelectorAll("[data-level]").forEach(t=>{t.addEventListener("click",()=>{p=t.dataset.level,T(p,e)})}),(o=a.querySelector("#paper-home"))==null||o.addEventListener("click",()=>P==null?void 0:P())}function T(e,l="practice"){const o=a==null?void 0:a.querySelector("#paper-playlist");if(!o)return;const t=x[e]||[],s=u[l]||u.practice,c=t.map((i,d)=>`
    <article class="ptg-launcher-card" data-paper-id="${i.id}">
      <h4>${i.label}</h4>
      <p><small>${i.duration} · ${i.totalMarks} marks · ${Object.keys(i).filter(n=>/^section[A-I]$/.test(n)).length} sections</small></p>
      <p>${i.blurb||""}</p>
      <button class="btn btn--primary" ${d===0?'id="paper-start-all"':""} data-start-paper="${i.id}" type="button">
        ${l==="test"?"⏱ Start timed paper":"🎯 Start practice paper"}
      </button>
    </article>`).join("");o.innerHTML=`
    <div class="dash-pattern-item exam-hub-playlist" style="margin-top:12px">
      <h3>${e} Papers · ${s.icon} ${s.label}</h3>
      <p class="sfq-instruction">${t.length} complete paper${t.length===1?"":"s"} available. ${l==="test"?"The timer starts when you open a paper; learning scaffolds are hidden.":"Check each section as you go and use the targeted practice links in your feedback."}</p>
      <div class="ptg-launcher-grid">${c||"<p>No papers are available for this level yet.</p>"}</div>
    </div>`,o.querySelectorAll("[data-start-paper]").forEach(i=>{i.addEventListener("click",()=>{const d=t.find(n=>n.id===i.dataset.startPaper);!d||!a||(b.set("paperMode",l),r=h(a,d,{mode:l,onClose:()=>{r=null,q()},onPractiseSkill:n=>m==null?void 0:m(n,e)}))})})}export{O as cleanupPaperMode,H as initPaperMode,q as showPaperModeBrowser};
