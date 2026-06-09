import{O as A}from"./openComprehensionPassages-ptKvqu40.js";import{s as S}from"./index-B5kQgz7F.js";import{e as d}from"./escapeHtml-Bz2f3NU1.js";import"./gsap-C8pce-KX.js";let i=null,r=null,k="P3",o=null,m=!1,f=0,y=[],b=null;function I(t){window.speechSynthesis.cancel(),b=new SpeechSynthesisUtterance(t),b.rate=S.get("voiceSpeed")||.9,b.lang="en-SG",window.speechSynthesis.speak(b)}function v(){window.speechSynthesis.cancel(),b=null}function R(t,a){t&&(i=t,r=typeof a=="function"?a:()=>{},k="P3",o=null,m=!1,f=0,y=[],b=null)}function x(){v(),o=null,m=!1,f=0,y=[],$()}function W(){v(),i&&(i.innerHTML=""),i=null,r=null,o=null,m=!1,b=null}const P=["P1","P2","P3","P4","P5","P6"];function M(t){return A.filter(a=>a.level===t)}function $(){var a;if(!i)return;const t=P.map(e=>`
    <button class="btn ${e===k?"btn--primary":"btn--ghost"} lc-level-tab"
            type="button" data-level="${e}" aria-pressed="${e===k}">
      ${d(e)}
    </button>`).join("");i.innerHTML=`
    <section class="lc-browser" aria-label="Listening Comprehension">
      <header style="margin-bottom:var(--space-3,12px)">
        <h2 style="margin:0 0 var(--space-2,8px)">&#128066; Listening Comprehension</h2>
        <p style="color:var(--text-muted,#888);margin:0">Choose a level and a passage. Listen, then answer questions.</p>
      </header>

      <div class="lc-level-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-3,12px)">
        ${t}
      </div>

      <div id="lc-passage-grid" class="lc-passage-grid" aria-live="polite"></div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home">&#8592; Back to home</button>
      </footer>
    </section>`,i.querySelectorAll(".lc-level-tab").forEach(e=>{e.addEventListener("click",()=>{k=e.dataset.level,$()})}),(a=document.getElementById("lc-btn-home"))==null||a.addEventListener("click",()=>{r==null||r()}),C()}function C(){const t=document.getElementById("lc-passage-grid");if(!t)return;const a=M(k);if(a.length===0){t.innerHTML='<p style="color:var(--text-muted,#888)">No passages available for this level yet.</p>';return}t.innerHTML=a.map(e=>{const n=Array.isArray(e.questions)?e.questions.length:0;return`
      <button class="lc-passage-card" type="button" data-id="${d(e.id)}"
              aria-label="Start ${d(e.title)}, ${n} question${n!==1?"s":""}">
        <div class="lc-passage-title">${d(e.title)}</div>
        <div class="lc-passage-meta">${n} question${n!==1?"s":""}</div>
      </button>`}).join(""),t.querySelectorAll(".lc-passage-card").forEach(e=>{e.addEventListener("click",()=>{const n=a.find(c=>c.id===e.dataset.id);n&&L(n)})})}function L(t){v(),o=t,m=!1,w()}function w(){var u,l,s;if(!i||!o)return;const t=o,a=Array.isArray(t.questions)?t.questions.length:0;i.innerHTML=`
    <section class="lc-browser" aria-label="Listen to Passage">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-browser" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passages</button>
        <h2 style="margin:0">${d(t.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">
          ${d(t.level)} &middot; ${a} question${a!==1?"s":""}
        </p>
      </header>

      <div class="lc-player">
        <p style="color:var(--text-muted,#888);margin-bottom:var(--space-3,12px)">
          Press <strong>Listen</strong> to hear the passage read aloud. You can listen as many times as you like.
        </p>
        <button class="btn btn--primary lc-listen-btn" type="button" id="lc-btn-listen">&#9654; Listen to Passage</button>
        <button class="btn btn--ghost lc-listen-btn" type="button" id="lc-btn-stop" style="display:none">&#9632; Stop</button>
        <div id="lc-answer-btn-wrap" style="${m?"":"display:none"}">
          <hr style="margin:var(--space-4,16px) 0;border:none;border-top:1px solid var(--border,#e5e3fa)">
          <button class="btn btn--success" type="button" id="lc-btn-to-questions">Answer Questions &#8594;</button>
        </div>
      </div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home2">&#8592; Back to home</button>
      </footer>
    </section>`;const e=document.getElementById("lc-btn-listen"),n=document.getElementById("lc-btn-stop"),c=document.getElementById("lc-answer-btn-wrap");e==null||e.addEventListener("click",()=>{I(t.passage),e.style.display="none",n.style.display="",b&&b.addEventListener("end",()=>{n.style.display="none",e.style.display=""}),m||(m=!0,c.style.display="")}),n==null||n.addEventListener("click",()=>{v(),n.style.display="none",e.style.display=""}),(u=document.getElementById("lc-btn-to-questions"))==null||u.addEventListener("click",()=>{v(),f=0,y=[],Q()}),(l=document.getElementById("lc-back-browser"))==null||l.addEventListener("click",()=>{v(),x()}),(s=document.getElementById("lc-btn-home2"))==null||s.addEventListener("click",()=>{r==null||r()})}function T(){return(o==null?void 0:o.level)==="P1"||(o==null?void 0:o.level)==="P2"}function Q(){!i||!o||(T()?_():B(f))}function _(){var n,c,u;const t=o,a=t.questions||[],e=a.map((l,s)=>`
    <div class="lc-question-box" id="lc-q-block-${s}">
      <p style="font-weight:700;margin:0 0 var(--space-2,8px)">
        Q${s+1}. ${d(l.q||l.question||"")}
      </p>
      <textarea class="lc-answer-area" id="lc-answer-${s}"
                placeholder="Write your answer here&#8230;"
                aria-label="Answer for question ${s+1}"></textarea>
      <div style="margin-top:8px">
        <button class="btn btn--secondary" type="button" data-check="${s}">Check Answer</button>
      </div>
      <div id="lc-reveal-${s}" style="display:none">
        <div class="lc-model-answer">
          <strong>Model Answer:</strong> ${d(l.model||l.modelAnswer||"")}
        </div>
        <div class="lc-self-mark">
          <button class="btn btn--success" type="button" data-mark="right" data-qi="${s}">&#10003; Got it right</button>
          <button class="btn btn--danger"  type="button" data-mark="wrong" data-qi="${s}">&#10007; Got it wrong</button>
        </div>
        <p id="lc-marked-${s}" style="display:none;font-size:0.9em;color:var(--text-muted,#888);margin-top:4px"></p>
      </div>
    </div>`).join("");i.innerHTML=`
    <section class="lc-browser" aria-label="Answer Questions">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-passage2" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passage</button>
        <h2 style="margin:0">${d(t.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">Answer all questions, then see your score.</p>
      </header>

      <div id="lc-questions-body">
        ${e}
      </div>

      <div style="margin-top:var(--space-4,16px)">
        <button class="btn btn--primary" type="button" id="lc-btn-finish">See My Score &#8594;</button>
      </div>

      <footer style="margin-top:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home3">&#8592; Back to home</button>
      </footer>
    </section>`,i.querySelectorAll("[data-check]").forEach(l=>{l.addEventListener("click",()=>{const s=parseInt(l.dataset.check,10),p=document.getElementById(`lc-reveal-${s}`);p&&(p.style.display=""),l.style.display="none"})}),i.querySelectorAll("[data-mark]").forEach(l=>{l.addEventListener("click",()=>{const s=parseInt(l.dataset.qi,10),p=l.dataset.mark;y[s]=p==="right"?1:0;const g=document.getElementById(`lc-marked-${s}`);g&&(g.style.display="",g.textContent=p==="right"?"✓ Marked as correct":"✗ Marked as incorrect");const h=document.getElementById(`lc-q-block-${s}`);h==null||h.querySelectorAll("[data-mark]").forEach(E=>{E.disabled=!0})})}),(n=document.getElementById("lc-btn-finish"))==null||n.addEventListener("click",()=>{const l=a.length;for(let s=0;s<l;s++)y[s]===void 0&&(y[s]=0);q()}),(c=document.getElementById("lc-back-passage2"))==null||c.addEventListener("click",()=>{w()}),(u=document.getElementById("lc-btn-home3"))==null||u.addEventListener("click",()=>{r==null||r()})}function B(t){var l,s,p,g,h;const a=o,e=a.questions||[];if(t>=e.length){q();return}const n=e[t],c=e.length;i.innerHTML=`
    <section class="lc-browser" aria-label="Question ${t+1} of ${c}">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-passage3" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passage</button>
        <h2 style="margin:0">${d(a.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">Question ${t+1} of ${c}</p>
      </header>

      <div class="lc-question-box" id="lc-single-q-block">
        <p style="font-weight:700;margin:0 0 var(--space-2,8px)">
          Q${t+1}. ${d(n.q||n.question||"")}
        </p>
        <textarea class="lc-answer-area" id="lc-single-answer"
                  placeholder="Write your answer here&#8230;"
                  aria-label="Answer for question ${t+1}"></textarea>
        <div style="margin-top:8px">
          <button class="btn btn--secondary" type="button" id="lc-check-btn">Check Answer</button>
        </div>
        <div id="lc-single-reveal" style="display:none">
          <div class="lc-model-answer">
            <strong>Model Answer:</strong> ${d(n.model||n.modelAnswer||"")}
          </div>
          <div class="lc-self-mark">
            <button class="btn btn--success" type="button" id="lc-mark-right">&#10003; Got it right</button>
            <button class="btn btn--danger"  type="button" id="lc-mark-wrong">&#10007; Got it wrong</button>
          </div>
        </div>
      </div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home4">&#8592; Back to home</button>
      </footer>
    </section>`,(l=document.getElementById("lc-check-btn"))==null||l.addEventListener("click",()=>{document.getElementById("lc-single-reveal").style.display="",document.getElementById("lc-check-btn").style.display="none"});function u(E){y[t]=E?1:0,f=t+1,B(f)}(s=document.getElementById("lc-mark-right"))==null||s.addEventListener("click",()=>u(!0)),(p=document.getElementById("lc-mark-wrong"))==null||p.addEventListener("click",()=>u(!1)),(g=document.getElementById("lc-back-passage3"))==null||g.addEventListener("click",()=>{v(),w()}),(h=document.getElementById("lc-btn-home4"))==null||h.addEventListener("click",()=>{r==null||r()})}function q(){var l,s,p;if(!i||!o)return;const t=o,a=(t.questions||[]).length,e=y.filter(g=>g===1).length,n=a>0?Math.round(e/a*100):0;let c;n===100?c="Perfect score! Outstanding listening and comprehension!":n>=75?c="Great job! You understood the passage really well.":n>=50?c="Good effort! Keep practising — you are getting there.":c="Keep it up! Try listening again and re-reading your answers.";const u=n===100?"&#127942;":n>=75?"&#11088;":n>=50?"&#128077;":"&#128170;";i.innerHTML=`
    <section class="lc-browser" aria-label="Results">
      <div style="text-align:center;padding:var(--space-5,24px) 0">
        <div style="font-size:3rem;margin-bottom:var(--space-2,8px)">${u}</div>
        <h2 style="margin:0 0 var(--space-1,4px)">${d(t.title)}</h2>
        <p style="font-size:1.4em;font-weight:700;margin:var(--space-2,8px) 0">
          ${e} / ${a} correct
        </p>
        <p style="color:var(--text-muted,#888);margin:0 0 var(--space-4,16px)">${d(c)}</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn--primary" type="button" id="lc-btn-try-again">Try Again</button>
          <button class="btn btn--ghost"   type="button" id="lc-btn-back-passages">Back to Passages</button>
          <button class="btn btn--ghost"   type="button" id="lc-btn-home5">&#8592; Back to home</button>
        </div>
      </div>
    </section>`,(l=document.getElementById("lc-btn-try-again"))==null||l.addEventListener("click",()=>{L(t)}),(s=document.getElementById("lc-btn-back-passages"))==null||s.addEventListener("click",()=>{x()}),(p=document.getElementById("lc-btn-home5"))==null||p.addEventListener("click",()=>{r==null||r()})}export{W as cleanupListeningComp,R as initListeningComp,x as showListeningBrowser};
