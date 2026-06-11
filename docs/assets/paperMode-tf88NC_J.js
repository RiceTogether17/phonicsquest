import{s as q,b as N}from"./index-B12g-4D5.js";import"./gsap-C8pce-KX.js";const F=["P1","P2","P3","P4","P5","P6"],U={P1:["grammar-mcq","vocab-mcq","cloze-castle","word-vault","sentence-forge-word-order","editing-quest"],P2:["grammar-mcq","vocab-mcq","cloze-castle","word-vault","sentence-forge-word-order","sentence-forge-combining","editing-quest"],P3:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","sentence-forge-combining","editing-quest"],P4:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest","sentence-forge-synthesis"],P5:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest","sentence-forge-synthesis"],P6:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest","sentence-forge-synthesis"]},k={"grammar-mcq":"Grammar MCQ","vocab-mcq":"Vocabulary MCQ","cloze-castle":"Grammar Cloze","word-vault":"Vocabulary Cloze","sentence-forge-word-order":"Word Order","sentence-forge-combining":"Sentence Combining","sentence-forge-synthesis":"Synthesis & Transformation","editing-quest":"Editing for Spelling and Grammar"},B={P1:{"grammar-mcq":10,"vocab-mcq":5,"cloze-castle":10,"word-vault":5,"sentence-forge-word-order":5,"editing-quest":8},P2:{"grammar-mcq":10,"vocab-mcq":5,"cloze-castle":10,"word-vault":5,"sentence-forge-word-order":5,"sentence-forge-combining":5,"editing-quest":8},P3:{"grammar-mcq":12,"cloze-castle":10,"vocab-mcq":5,"word-vault":5,"sentence-forge-combining":8,"editing-quest":10},P4:{"grammar-mcq":15,"cloze-castle":10,"vocab-mcq":5,"word-vault":5,"editing-quest":12,"sentence-forge-synthesis":10},P5:{"grammar-mcq":15,"cloze-castle":10,"vocab-mcq":5,"word-vault":5,"editing-quest":12,"sentence-forge-synthesis":10},P6:{"grammar-mcq":15,"cloze-castle":10,"vocab-mcq":5,"word-vault":5,"editing-quest":12,"sentence-forge-synthesis":10}},W={P4:{bookletA:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest"],bookletB:["sentence-forge-synthesis"]},P5:{bookletA:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest"],bookletB:["sentence-forge-synthesis"]},P6:{bookletA:["grammar-mcq","cloze-castle","vocab-mcq","word-vault","editing-quest"],bookletB:["sentence-forge-synthesis"]}},H={P1:{"grammar-mcq":10,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"sentence-forge-word-order":null,"editing-quest":null},P2:{"grammar-mcq":10,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"sentence-forge-word-order":null,"sentence-forge-combining":null,"editing-quest":null},P3:{"grammar-mcq":12,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"sentence-forge-combining":null,"editing-quest":null},P4:{"grammar-mcq":15,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"editing-quest":null,"sentence-forge-synthesis":null},P5:{"grammar-mcq":15,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"editing-quest":null,"sentence-forge-synthesis":null},P6:{"grammar-mcq":15,"vocab-mcq":5,"cloze-castle":null,"word-vault":null,"editing-quest":null,"sentence-forge-synthesis":null}},I={P1:"45 min",P2:"50 min",P3:"1 h",P4:"1 h 10 min",P5:"1 h 30 min",P6:"1 h 50 min"};let p=null,g=null,y=null,t=null;const $={practice:{icon:"🎯",label:"Practice Mode",desc:"Hints + per-section feedback. No timer."},test:{icon:"⏱️",label:"Test Mode",desc:"Timed. No hints. Mirrors the real paper."},review:{icon:"🔄",label:"Review Mistakes",desc:"Replay only the questions you got wrong last time."}},L={"grammar-mcq":"grammar-mcq","cloze-castle":"cloze-castle","vocab-mcq":"vocab-mcq","word-vault":"word-vault","editing-quest":"editing-quest","sentence-forge-word-order":"sentence-forge","sentence-forge-combining":"sentence-forge","sentence-forge-synthesis":"sentence-forge"},j={"grammar-mcq":"🧠 Grammar MCQ","cloze-castle":"🏰 Cloze Castle","vocab-mcq":"📖 Vocabulary MCQ","word-vault":"🔑 Word Vault","editing-quest":"✏️ Editing Quest","sentence-forge":"🔨 Sentence Forge"};function x(){q.set("paperSession",t)}function K(e,{onLaunchSection:o,onGoHome:r}){p=e,g=o,y=r,t=q.get("paperSession")||null}function X(){p&&(p.innerHTML="")}function Q(e){const o=Array.isArray(e==null?void 0:e.marks)?e.marks:[],r=o.reduce((s,d)=>s+(Number(d.scored)||0),0),a=o.reduce((s,d)=>s+(Number(d.total)||0),0),i=a>0?Math.round(r/a*100):0,m=o.map(s=>({key:s.key,label:k[s.key]||s.key,scored:Number(s.scored)||0,total:Number(s.total)||0,accuracy:s.total?Math.round(s.scored/s.total*100):0})).filter(s=>s.total>0&&s.accuracy<70).sort((s,d)=>s.accuracy-d.accuracy),c=m.slice(0,3).map(s=>({section:s.key,sectionLabel:s.label,target:L[s.key]||s.key,targetLabel:j[L[s.key]]||s.label,reason:`Score ${s.scored}/${s.total} (${s.accuracy}%) — practise this module next.`}));return{totalScored:r,totalTotal:a,accuracy:i,weakSections:m,recommendations:c}}function Z(){var r;if(!p)return;p.innerHTML=`
    <div class="sfq-browser exam-hub" role="region" aria-label="Exam Practice Hub level selection">
      <h2 class="sfq-title">📋 Exam Practice Hub</h2>
      <p class="sfq-instruction">PSLE English-style paper practice. Pick your level, then choose a mode.</p>

      <div class="exam-hub-modes" role="radiogroup" aria-label="Choose practice mode">
        ${Object.entries($).map(([a,i])=>`
          <button class="exam-hub-mode-btn" data-paper-mode="${a}" aria-label="${i.label}: ${i.desc}">
            <span class="exam-hub-mode-icon" aria-hidden="true">${i.icon}</span>
            <span class="exam-hub-mode-name">${i.label}</span>
            <span class="exam-hub-mode-desc">${i.desc}</span>
          </button>`).join("")}
      </div>

      <div class="exam-hub-selected-mode" id="exam-hub-selected-mode" aria-live="polite"></div>

      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${F.map(a=>`<button class="sfq-level-btn" data-level="${a}" aria-label="Open ${a} paper">
          <strong>${a}</strong>
          <span style="display:block;font-size:0.7em;opacity:0.8">${I[a]}</span>
        </button>`).join("")}
      </div>

      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;let e=q.get("paperMode")||"practice";const o=()=>{p.querySelectorAll("[data-paper-mode]").forEach(m=>{const c=m.dataset.paperMode===e;m.classList.toggle("exam-hub-mode-btn--active",c),m.setAttribute("aria-pressed",String(c))});const a=p.querySelector("#exam-hub-selected-mode"),i=$[e];a&&i&&(a.textContent=`${i.icon} ${i.label} selected — ${i.desc}`),q.set("paperMode",e)};o(),p.querySelectorAll("[data-paper-mode]").forEach(a=>{a.addEventListener("click",()=>{e=a.dataset.paperMode,o()})}),p.querySelectorAll("[data-level]").forEach(a=>{a.addEventListener("click",()=>V(a.dataset.level,e))}),(r=p.querySelector("#paper-home"))==null||r.addEventListener("click",()=>y==null?void 0:y())}function V(e,o="practice"){var A,z,T,C;const r=U[e]||[],a=p==null?void 0:p.querySelector("#paper-playlist");if(!a)return;const i=t&&t.level===e&&!t.complete,m=B[e]||{},c=H[e]||{},s=r.reduce((n,b)=>n+(m[b]||0),0),d=W[e],h=I[e]||"",l=$[o]||$.practice,u=N().slice(0,3),f=u.length?`
    <div class="paper-weak-panel" role="note" aria-label="Weak skills to focus on">
      <p class="paper-weak-title">📊 Focus areas this paper:</p>
      <div class="paper-weak-chips">
        ${u.map(n=>`<span class="paper-weak-chip">${n.label} <span class="paper-weak-score">${Math.round(n.score*100)}%</span></span>`).join("")}
      </div>
    </div>`:"",w=n=>{const b=((t==null?void 0:t.marks)||[]).find(v=>v.key===n);return b?`<span class="paper-section-status paper-section-status--done" aria-label="Section completed">✓ ${b.scored}/${b.total}</span>`:'<span class="paper-section-status paper-section-status--pending" aria-label="Not started">○</span>'},M=(n,b)=>{const v=m[n]||"–",P=c[n],R=P?` · ${P}q`:"";return`<li>
      <button class="btn btn--ghost paper-section-btn" data-section="${n}" aria-label="Section ${b+1}: ${k[n]||n}, ${v} marks${R}">
        <span class="paper-section-no">${b+1}.</span>
        <span class="paper-section-label">${k[n]||n}</span>
        <span class="paper-section-meta" style="opacity:0.7">[${v} marks${R}]</span>
        ${w(n)}
      </button>
    </li>`};let E;if(d){const n=[],b=[];r.forEach((v,P)=>{d.bookletA.includes(v)?n.push(P):b.push(P)}),E=`
      <p style="font-weight:600;margin:8px 0 2px">Booklet A</p>
      <ol>${n.map(v=>M(r[v],v)).join("")}</ol>
      <p style="font-weight:600;margin:8px 0 2px">Booklet B</p>
      <ol start="${n.length+1}">${b.map(v=>M(r[v],v)).join("")}</ol>`}else E=`<ol>${r.map((n,b)=>M(n,b)).join("")}</ol>`;const D=t&&t.level===e&&t.complete&&((A=t.marks)==null?void 0:A.some(n=>(n.total||0)-(n.scored||0)>0));a.innerHTML=`
    <div class="dash-pattern-item exam-hub-playlist" style="margin-top:12px">
      <h3>${e} Paper · ${l.icon} ${l.label}</h3>
      <p class="sfq-instruction" style="margin:4px 0 8px">Total: ${s} marks · Suggested time: ${h} · ${r.length} sections</p>
      ${f}
      ${E}
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--primary" id="paper-start-all">${o==="review"?"🔄 Start Review Mistakes":"▶ Start Full Paper"}</button>
        ${i?'<button class="btn btn--ghost" id="paper-resume">Resume Session</button>':""}
        ${D?'<button class="btn btn--ghost" id="paper-review-mistakes">🔄 Review last paper mistakes</button>':""}
      </div>
      <div id="paper-session-card"></div>
    </div>`,a.querySelectorAll("[data-section]").forEach(n=>{n.addEventListener("click",()=>{q.set("paperMode",o),g==null||g(n.dataset.section,e)})}),(z=a.querySelector("#paper-start-all"))==null||z.addEventListener("click",()=>O(e,r,o)),(T=a.querySelector("#paper-resume"))==null||T.addEventListener("click",()=>S()),(C=a.querySelector("#paper-review-mistakes"))==null||C.addEventListener("click",()=>O(e,r,"review")),i&&S()}function O(e,o,r="practice"){t={level:e,sections:o,index:0,startedAt:Date.now(),marks:[],complete:!1,paperMode:r},q.set("paperMode",r),x(),S()}function S(){var m,c,s,d,h;const e=p==null?void 0:p.querySelector("#paper-session-card");if(!e||!t)return;const o=t.sections[t.index],r=Math.max(1,Math.round((Date.now()-t.startedAt)/6e4)),a=t.marks.reduce((l,u)=>(l.scored+=u.scored,l.total+=u.total,l),{scored:0,total:0});if(t.complete||!o){e.innerHTML=G(t,r),(m=e.querySelector("#paper-summary-restart"))==null||m.addEventListener("click",()=>{t=null,x(),y==null||y()}),e.querySelectorAll("[data-followup-target]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.followupTarget;u&&(g==null||g(u,t==null?void 0:t.level))})});return}const i=$[t.paperMode||"practice"];e.innerHTML=`
    <div class="dash-pattern-item exam-hub-session" style="margin-top:10px" role="region" aria-label="Active paper session">
      <h4>🧾 ${t.level} Paper · ${i.icon} ${i.label}</h4>
      <p class="sfq-instruction">Section ${t.index+1}/${t.sections.length}: ${k[o]||o}</p>
      <p class="sfq-instruction">Elapsed: ~${r} min · Running score: ${a.scored}/${a.total||0}</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="paper-launch-current">Launch Current Section</button>
        <button class="btn btn--ghost" id="paper-mark-done">Mark Section Done</button>
      </div>
      <div id="paper-mark-form" hidden>
        <div class="dash-pattern-item" style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
          <label for="paper-scored-input">Marks scored:</label>
          <input id="paper-scored-input" class="cp-name-input" type="number" min="0" value="0" aria-label="Marks scored" />
          <label for="paper-total-input">Total marks:</label>
          <input id="paper-total-input" class="cp-name-input" type="number" min="0" value="${(B[t.level]||{})[o]||5}" aria-label="Total marks" />
          <div class="sfq-actions" style="margin-top:4px">
            <button class="btn btn--primary btn--sm" id="paper-confirm-mark">Confirm</button>
            <button class="btn btn--ghost btn--sm" id="paper-cancel-mark">Cancel</button>
          </div>
        </div>
      </div>
    </div>`,(c=e.querySelector("#paper-launch-current"))==null||c.addEventListener("click",()=>{if(!t||t.complete)return;const l=(H[t.level]||{})[o];l&&q.set("paperItemLimit",l),q.set("paperMode",t.paperMode||"practice"),g==null||g(o,t.level)}),(s=e.querySelector("#paper-mark-done"))==null||s.addEventListener("click",()=>{const l=e.querySelector("#paper-mark-form");l&&(l.hidden=!1)}),(d=e.querySelector("#paper-cancel-mark"))==null||d.addEventListener("click",()=>{const l=e.querySelector("#paper-mark-form");l&&(l.hidden=!0)}),(h=e.querySelector("#paper-confirm-mark"))==null||h.addEventListener("click",()=>{const l=e.querySelector("#paper-scored-input"),u=e.querySelector("#paper-total-input"),f=Math.max(0,Number.parseInt((l==null?void 0:l.value)||"0",10)||0),w=Math.max(f,Number.parseInt((u==null?void 0:u.value)||"0",10)||0);t.marks.push({key:o,scored:f,total:w,finishedAt:Date.now(),sectionLabel:k[o]||o}),t.index+=1,t.index===t.sections.length&&(t.complete=!0,t.completedAt=Date.now()),x(),_(o,f,w)})}function _(e,o,r){var l;const a=p==null?void 0:p.querySelector("#paper-session-card");if(!a)return;const i=r>0?Math.round(o/r*100):0,m=k[e]||e,c=L[e],s=j[c]||m,d=N().slice(0,3),h=i>=80?"Strong section — ready to move on.":i>=60?"Solid effort — practise this module to push higher.":"This section needs revision. Use the recommended module before retrying.";a.innerHTML=`
    <div class="dash-pattern-item exam-hub-section-feedback" role="region" aria-label="Section feedback">
      <h4>📊 Section complete · ${m}</h4>
      <p class="sfq-instruction"><strong>Score:</strong> ${o}/${r} (${i}%)</p>
      <p class="sfq-instruction">${h}</p>
      ${d.length?`
        <p class="sfq-instruction"><strong>Weak skill tags:</strong></p>
        <div class="paper-weak-chips">
          ${d.map(u=>`<span class="paper-weak-chip">${u.label} <span class="paper-weak-score">${Math.round(u.score*100)}%</span></span>`).join("")}
        </div>`:""}
      <p class="sfq-instruction"><strong>Recommended follow-up:</strong> ${s}</p>
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--primary" data-followup-target="${c||e}">Practise ${s}</button>
        <button class="btn btn--ghost" id="paper-continue">Continue paper →</button>
      </div>
    </div>`,(l=a.querySelector("#paper-continue"))==null||l.addEventListener("click",()=>S()),a.querySelectorAll("[data-followup-target]").forEach(u=>{u.addEventListener("click",()=>{const f=u.dataset.followupTarget;f&&(g==null||g(f,t==null?void 0:t.level))})})}function G(e,o){const r=Q(e),a=$[e.paperMode||"practice"],i=(e.marks||[]).map((c,s)=>{const d=c.total?Math.round(c.scored/c.total*100):0;return`<li>${d>=80?"✅":d>=60?"🟡":"🔴"} Section ${s+1}: ${k[c.key]||c.key} — ${c.scored}/${c.total} (${d}%)</li>`}).join(""),m=r.recommendations.length?`<div class="exam-hub-followups">
        <p class="sfq-instruction"><strong>Suggested follow-up modules:</strong></p>
        <ul class="dash-pattern-list">
          ${r.recommendations.map(c=>`
            <li class="dash-pattern-item">
              <strong>${c.sectionLabel}</strong> — ${c.reason}
              <div class="sfq-actions" style="margin-top:6px">
                <button class="btn btn--primary btn--sm" data-followup-target="${c.target}">Open ${c.targetLabel}</button>
              </div>
            </li>`).join("")}
        </ul>
       </div>`:'<p class="sfq-instruction">🎉 Strong paper! No section dropped below 70%.</p>';return`
    <div class="dash-pattern-item exam-hub-summary" role="region" aria-label="Paper results summary">
      <h4>✅ ${e.level} Paper Complete · ${a.icon} ${a.label}</h4>
      <p class="sfq-instruction">Elapsed: ~${o} min · Total score: ${r.totalScored}/${r.totalTotal} (${r.accuracy}%)</p>
      <ol>${i}</ol>
      ${m}
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--ghost" id="paper-summary-restart">Back to Hub</button>
      </div>
    </div>`}export{Q as buildPaperSummary,X as cleanupPaperMode,K as initPaperMode,Z as showPaperModeBrowser};
