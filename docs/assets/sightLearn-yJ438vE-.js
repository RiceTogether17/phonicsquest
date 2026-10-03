import{a1 as h,_ as ut,s as F}from"./index-DyGSqsps.js";import{s as pt,g as et}from"./sightWordCode-BzuQg0Hs.js";import"./gsap-C8pce-KX.js";import"./stories-CYWAyRRZ.js";const ht="lscwc_stats";function V(){return ut(ht)}const st="lscwc_input_mode",Z=200;let c=null,L=[],I=0,f="look",u="",M=[],T=[],$=ft(),S=null,W=null,N=null,H=0,R=0;function bt(t,s,{onDone:e,onCancel:l}={}){if(D(),c=t,L=(s||[]).map(n=>String(n).trim()).filter(Boolean),I=0,f="look",u="",S=e,W=l,H=0,R=0,!c||L.length===0){S==null||S({totalWords:0,correctFirstTry:0,attempts:0});return}O(q()),E()}function D(){N&&(clearTimeout(N),N=null),c=null,L=[],I=0,u="",M=[],T=[],S=null,W=null}function X(t,s,e){return typeof t!="string"||typeof s!="string"||typeof e!="string"||s.length>=t.length?"wrong":t[s.length].toLowerCase()===e.toLowerCase()?"correct":"wrong"}function gt(t,s=Math.random){const e=[...String(t).toLowerCase()];for(let l=e.length-1;l>0;l--){const n=Math.floor(s()*(l+1));[e[l],e[n]]=[e[n],e[l]]}return e}function lt(t,s){try{const e=localStorage.getItem(V()),l=e?JSON.parse(e):{},n=String(t).toLowerCase();l[n]||(l[n]={attempts:0,correct:0,lastTs:0}),l[n].attempts++,s&&l[n].correct++,l[n].lastTs=Date.now();const r=Object.keys(l);if(r.length>Z){const o=r.map(a=>({k:a,ts:l[a].lastTs??0})).sort((a,i)=>a.ts-i.ts),b=r.length-Z;for(let a=0;a<b;a++)delete l[o[a].k]}localStorage.setItem(V(),JSON.stringify(l))}catch{}}function q(){return L[I]??""}function O(t){M=gt(t),T=M.map(()=>!1),u=""}function ft(){try{return localStorage.getItem(st)==="tap"?"tap":"type"}catch{return"type"}}function wt(){try{localStorage.setItem(st,$)}catch{}}function E(){var o;if(!c)return;const t=L.length,s=Math.min(I+1,t),e=["look","say","cover","write","check"],l={look:"Look",say:"Say",cover:"Cover",write:"Write",check:"Check"},n=e.map(b=>{const a=e.indexOf(b),i=e.indexOf(f);return`<li class="lscwc-dot ${a<i?"done":a===i?"active":""}" data-stage="${b}">${l[b]}</li>`}).join(""),r=mt(q());c.innerHTML=`
    <div class="lscwc-panel" role="region" aria-label="Spell-It drill">
      <header class="lscwc-header">
        <div class="lscwc-progress" aria-live="polite">
          Word <strong>${s}</strong> of ${t}
        </div>
        <ol class="lscwc-dots" aria-label="Stages">${n}</ol>
        <button class="lscwc-close" id="lscwc-close" type="button"
                aria-label="Close drill">✕</button>
      </header>
      <div class="lscwc-body">${r}</div>
    </div>
  `,(o=c.querySelector("#lscwc-close"))==null||o.addEventListener("click",()=>{D(),W==null||W()}),qt(q())}function mt(t){switch(f){case"look":return vt(t);case"say":return yt(t);case"cover":return kt(t);case"write":return St(t);case"check":return Lt(t);default:return""}}function vt(t){return`
    <div class="lscwc-stage lscwc-look">
      <h3 class="lscwc-stage-title">👀 Look</h3>
      <p class="lscwc-stage-hint">Look at every letter and listen.</p>
      <div class="lscwc-word lscwc-word--look">${K(t)}</div>
      <div class="lscwc-actions">
        <button class="btn btn--ghost" id="lscwc-replay" type="button"
                aria-label="Hear the word again">🔊 Hear it again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          Next →
        </button>
      </div>
    </div>
  `}function yt(t){return`
    <div class="lscwc-stage lscwc-say">
      <h3 class="lscwc-stage-title">🗣️ Say</h3>
      <p class="lscwc-stage-hint">Say the word out loud. You can whisper if you like.</p>
      <div class="lscwc-word lscwc-word--say">${K(t)}</div>
      <div class="lscwc-actions">
        <button class="btn btn--ghost" id="lscwc-replay" type="button"
                aria-label="Hear the word again">🔊 Hear it again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          I said it →
        </button>
      </div>
    </div>
  `}function kt(t){return`
    <div class="lscwc-stage lscwc-cover">
      <h3 class="lscwc-stage-title">🫥 Cover</h3>
      <p class="lscwc-stage-hint">Picture the word in your mind…</p>
      <div class="lscwc-word lscwc-word--cover" id="lscwc-cover-word">
        ${K(t)}
      </div>
      <div class="lscwc-actions">
        <button class="btn btn--primary" id="lscwc-next-stage" type="button" disabled>
          Ready to write →
        </button>
      </div>
    </div>
  `}function St(t){const s=t.split("").map((r,o)=>`
    <span class="lscwc-slot" data-slot-idx="${o}" aria-hidden="true"></span>
  `).join(""),e=M.map((r,o)=>`
    <button class="lscwc-bank-tile" data-bank-idx="${o}" type="button"
            aria-label="Letter ${r}" ${T[o]?"disabled":""}>
      ${r}
    </button>
  `).join(""),l=$==="type"?`<button class="lscwc-mode-chip" id="lscwc-mode-toggle" type="button"
               aria-pressed="false">⌨️ Type · tap to switch</button>`:`<button class="lscwc-mode-chip" id="lscwc-mode-toggle" type="button"
               aria-pressed="true">👆 Tap · tap to switch</button>`,n=$==="type"?`
        <div class="lscwc-write-input">
          <label for="lscwc-input" class="visually-hidden">Spell the word</label>
          <input type="text" id="lscwc-input" class="lscwc-input"
                 autocomplete="off" autocapitalize="off" spellcheck="false"
                 maxlength="${t.length}"
                 aria-label="Spell the word"
                 inputmode="text" />
          <button class="btn btn--ghost btn--sm" id="lscwc-backspace" type="button"
                  aria-label="Delete last letter">⌫</button>
        </div>
      `:`
        <div class="lscwc-write-bank" role="group" aria-label="Tap letters in order">
          ${e}
        </div>
        <button class="btn btn--ghost btn--sm" id="lscwc-backspace" type="button"
                aria-label="Delete last letter">⌫ Undo last</button>
      `;return`
    <div class="lscwc-stage lscwc-write">
      <h3 class="lscwc-stage-title">✍️ Write</h3>
      <p class="lscwc-stage-hint">${$==="type"?"Type the word.":"Tap the letters in the right order."}</p>
      <div class="lscwc-slots" id="lscwc-slots" aria-live="polite">${s}</div>
      <div class="lscwc-write-toolbar">
        ${l}
      </div>
      ${n}
    </div>
  `}function Lt(t){const s=u,e=s.toLowerCase()===t.toLowerCase(),l=t.split("").map((o,b)=>{const a=s[b]??"",i=a&&a.toLowerCase()===o.toLowerCase();return`
      <span class="lscwc-check-slot ${a?i?"right":"wrong":"missing"}"
            aria-label="${i?"correct":"wrong"}: ${o}">
        <span class="lscwc-check-got">${a||"·"}</span>
        <span class="lscwc-check-exp">${o}</span>
      </span>
    `}).join(""),n=I>=L.length-1;return`
    <div class="lscwc-stage lscwc-check ${e?"lscwc-check--ok":"lscwc-check--bad"}">
      <h3 class="lscwc-stage-title">${e?"🎉 Check":"🤔 Check"}</h3>
      <p class="lscwc-stage-hint">
        ${e?"You spelled it!":"Almost — look at the red letters."}
      </p>
      <div class="lscwc-check-row">${l}</div>
      <div class="lscwc-actions">${e?n?'<button class="btn btn--primary" id="lscwc-next-stage" type="button">🎉 Finish!</button>':'<button class="btn btn--primary" id="lscwc-next-stage" type="button">Next word →</button>':`
        <button class="btn btn--ghost" id="lscwc-retry" type="button">🔁 Try again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          ${n?"Finish":"Next word →"}
        </button>
      `}</div>
    </div>
  `}function K(t){return t.split("").map(s=>`<span class="lscwc-letter">${s}</span>`).join("")}function qt(t){var s,e;switch((f==="look"||f==="say")&&((e=(s=h).speakWord)==null||e.call(s,t)),f){case"look":return Et();case"say":return xt();case"cover":return Tt();case"write":return $t(t);case"check":return Ct(t)}}function Et(){var t,s;(t=c==null?void 0:c.querySelector("#lscwc-replay"))==null||t.addEventListener("click",()=>{var e,l;(l=(e=h).speakWord)==null||l.call(e,q())}),(s=c==null?void 0:c.querySelector("#lscwc-next-stage"))==null||s.addEventListener("click",()=>{f="say",E()})}function xt(){var t,s;(t=c==null?void 0:c.querySelector("#lscwc-replay"))==null||t.addEventListener("click",()=>{var e,l;(l=(e=h).speakWord)==null||l.call(e,q())}),(s=c==null?void 0:c.querySelector("#lscwc-next-stage"))==null||s.addEventListener("click",()=>{f="cover",E()})}function Tt(){const t=c==null?void 0:c.querySelector("#lscwc-cover-word"),s=c==null?void 0:c.querySelector("#lscwc-next-stage");t&&t.classList.add("lscwc-fading"),N=setTimeout(()=>{t&&t.classList.add("lscwc-covered"),s&&(s.disabled=!1)},1500),s==null||s.addEventListener("click",()=>{f="write",O(q()),E()})}function $t(t){var o,b;const s=()=>(c==null?void 0:c.querySelectorAll(".lscwc-slot"))??[];function e(){s().forEach((a,i)=>{const d=u[i];a.textContent=d??"",a.classList.toggle("filled",!!d),a.classList.remove("wrong")})}function l(){const a=u.length,i=s();a<i.length&&(i[a].classList.add("wrong"),setTimeout(()=>{var d;return(d=i[a])==null?void 0:d.classList.remove("wrong")},320))}function n(a){X(t,u,a)==="correct"?(u+=a.toLowerCase(),e(),u.length===t.length&&(H++,lt(t,!0),H===1&&R++,f="check",setTimeout(()=>E(),220))):l()}const r=c==null?void 0:c.querySelector("#lscwc-input");r&&(r.focus(),r.addEventListener("keydown",a=>{if(a.key==="Backspace"){a.preventDefault(),u.length>0&&(u=u.slice(0,-1),e());return}a.key.length===1&&/[a-zA-Z]/.test(a.key)&&(a.preventDefault(),n(a.key))}),r.addEventListener("input",a=>{a.preventDefault(),a.target.value=""})),c==null||c.querySelectorAll(".lscwc-bank-tile").forEach(a=>{a.addEventListener("click",()=>{if(a.disabled)return;const i=Number(a.dataset.bankIdx),d=M[i];X(t,u,d)==="correct"?(T[i]=!0,a.disabled=!0,a.classList.add("used")):(a.classList.add("flash-wrong"),setTimeout(()=>a.classList.remove("flash-wrong"),320)),n(d)})}),(o=c==null?void 0:c.querySelector("#lscwc-backspace"))==null||o.addEventListener("click",()=>{if(u.length===0)return;const a=u[u.length-1];if(u=u.slice(0,-1),e(),$==="tap"){for(let i=T.length-1;i>=0;i--)if(T[i]&&M[i]===a){T[i]=!1;const d=c==null?void 0:c.querySelector(`.lscwc-bank-tile[data-bank-idx="${i}"]`);d&&(d.disabled=!1,d.classList.remove("used"));break}}}),(b=c==null?void 0:c.querySelector("#lscwc-mode-toggle"))==null||b.addEventListener("click",()=>{$=$==="type"?"tap":"type",wt(),E()}),e()}function Ct(t){var e,l;u.toLowerCase()===t.toLowerCase()||(H++,lt(t,!1)),(e=c==null?void 0:c.querySelector("#lscwc-retry"))==null||e.addEventListener("click",()=>{f="write",O(q()),E()}),(l=c==null?void 0:c.querySelector("#lscwc-next-stage"))==null||l.addEventListener("click",()=>{It()})}function It(){if(I>=L.length-1){const t={totalWords:L.length,correctFirstTry:R,attempts:R};D(),S==null||S(t);return}I++,f="look",H=0,O(q()),E()}let w=null,g={},p=null,B=[],k=new Set,P=new Set,A=!1,C=!1,z=!1,x=0;const _=3;let j=0,m=null,v=[],Q=!1;function Ot(t,s={}){w=t,g=s||{}}function Ft(t){t&&(p=t,B=[...t.words],k=new Set,P=new Set,A=!1,C=!1,z=!1,x=0,j=0,at())}function Ut(){C=!0,A=!1,z=!1,D(),w&&(w.innerHTML=""),p=null,k=new Set,P=new Set}function at(){var l,n,r,o,b,a;if(!w||!p)return;const t=p,s=jt(t.id),e=`
    <div class="sl-learn" id="sl-learn">
      <header class="sl-header">
        <div class="sl-header-row">
          <span class="sl-quest-icon" aria-hidden="true">${t.icon}</span>
          <h3 class="sl-quest-title">${t.name}</h3>
          ${s?'<span class="sl-studied-pill" aria-label="Already studied">📖 Studied</span>':""}
        </div>
        <p class="sl-hello">
          Hi friend! Let's meet ${t.words.length} new sight words.
          Tap each card to hear it. You can listen as many times as you like!
        </p>
      </header>

      <div class="sl-toolbar" role="group" aria-label="Practice controls">
        <button class="btn btn--ghost btn--sm sl-tool-btn" id="sl-btn-listen-all"
                aria-label="Listen to all five words in order">
          <span aria-hidden="true">📢</span> Listen to all
        </button>
        <button class="btn btn--ghost btn--sm sl-tool-btn" id="sl-btn-shuffle"
                aria-label="Shuffle the order of the word cards">
          <span aria-hidden="true">🔀</span> Shuffle
        </button>
        <span class="sl-progress" id="sl-progress" aria-live="polite">
          Met <strong id="sl-progress-count">0</strong> / ${t.words.length}
          &middot; Remembered <strong id="sl-recalled-count">0</strong> / ${t.words.length}
        </span>
      </div>

      <div class="sl-card-grid" id="sl-card-grid" role="list"
           aria-label="Sight words to practise">
        ${B.map((i,d)=>ct(i,d)).join("")}
      </div>

      <div class="sl-recall" id="sl-recall" hidden aria-live="polite"></div>

      <div class="sl-bottom-actions">
        <button class="btn btn--ghost btn--sm" id="sl-btn-back-to-quests"
                aria-label="Back to the quest list">
          ← Quests
        </button>
        <button class="btn btn--ghost btn--sm" id="sl-btn-practiced"
                aria-label="Mark this quest as practised">
          ✅ I've practised these words!
        </button>
        <button class="btn btn--ghost btn--sm" id="sl-btn-spell-direct"
                aria-label="Practise spelling these words now">
          🔤 Spell it!
        </button>
        <button class="btn btn--primary sl-btn-play" id="sl-btn-play-match"
                aria-label="Start the matching card game for this quest">
          🃏 Ready to play the matching game?
        </button>
      </div>
    </div>
  `;w.innerHTML=e,w.querySelectorAll(".sl-word-card").forEach(i=>{i.addEventListener("click",()=>Y(i)),i.addEventListener("keydown",d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),Y(i))})}),(l=document.getElementById("sl-btn-listen-all"))==null||l.addEventListener("click",zt),(n=document.getElementById("sl-btn-shuffle"))==null||n.addEventListener("click",Bt),(r=document.getElementById("sl-btn-back-to-quests"))==null||r.addEventListener("click",()=>{var i;C=!0,(i=g.onBackToBrowser)==null||i.call(g)}),(o=document.getElementById("sl-btn-practiced"))==null||o.addEventListener("click",()=>{U(),Pt("Great job! Your progress is saved 🌟"),h.playSfx("correct"),at()}),(b=document.getElementById("sl-btn-spell-direct"))==null||b.addEventListener("click",()=>{C=!0,J()}),(a=document.getElementById("sl-btn-play-match"))==null||a.addEventListener("click",()=>{var i;C=!0,U(),(i=g.onStartMatch)==null||i.call(g,p)})}function _t(t){const s=et(t);return s?s.segments.map(e=>e.tricky?`<span class="sl-heart">${y(e.text)}</span>`:y(e.text)).join(""):y(t)}function ct(t,s){const e=k.has(t),l=P.has(t),n=y(t),r=pt(et(t));return`
    <div class="sl-word-card ${e?"sl-word-card--met":""} ${l?"sl-word-card--recalled":""}"
         data-word="${n}" data-index="${s}"
         role="listitem"
         tabindex="0"
         aria-label="Sight word ${n}${l?", remembered":e?", heard":""}, tap to hear it${r?`. ${y(r)}`:""}">
      <span class="sl-word-check" aria-hidden="true">${l?"✓":e?"♪":""}</span>
      <span class="sl-word-text">${_t(t)}</span>
      ${r?`<span class="sl-word-tip" aria-hidden="true">${y(r)}</span>`:""}
      <span class="sl-word-hear" aria-hidden="true">
        <span class="sl-speaker-icon">🔊</span>
        <span class="sl-hear-label">Hear</span>
      </span>
    </div>
  `}function Y(t){if(z)return;const s=t.dataset.word;if(s&&(t.classList.remove("sl-word-card--pop"),t.offsetWidth,t.classList.add("sl-word-card--pop"),h.playSfx("pop"),h.speakSightWord(s),!k.has(s))){k.add(s),t.classList.add("sl-word-card--met");const e=t.querySelector(".sl-word-check");e&&(e.textContent="♪"),t.setAttribute("aria-label",`Sight word ${s}, practised, tap to hear it again`),G(),nt()}}function G(){const t=document.getElementById("sl-progress-count");t&&(t.textContent=String(k.size));const s=document.getElementById("sl-recalled-count");s&&(s.textContent=String(P.size))}async function zt(){if(!p||A)return;A=!0,C=!1;const t=document.getElementById("sl-btn-listen-all");t&&(t.setAttribute("disabled",""),t.classList.add("sl-tool-btn--busy"));for(const s of B){if(C)break;const e=w==null?void 0:w.querySelector(`.sl-word-card[data-word="${dt(s)}"]`);if(e==null||e.classList.add("sl-word-card--highlight"),h.playSfx("pop"),h.speakSightWord(s),!k.has(s)){k.add(s),e==null||e.classList.add("sl-word-card--met");const l=e==null?void 0:e.querySelector(".sl-word-check");l&&(l.textContent="♪"),G()}await tt(900),e==null||e.classList.remove("sl-word-card--highlight"),await tt(150)}A=!1,t&&(t.removeAttribute("disabled"),t.classList.remove("sl-tool-btn--busy")),nt()}function Bt(){if(!p)return;const t=[...B];for(let e=t.length-1;e>0;e--){const l=Math.floor(Math.random()*(e+1));[t[e],t[l]]=[t[l],t[e]]}B=t;const s=document.getElementById("sl-card-grid");s&&(s.classList.add("sl-card-grid--shuffling"),s.innerHTML=B.map((e,l)=>ct(e,l)).join(""),s.querySelectorAll(".sl-word-card").forEach(e=>{e.addEventListener("click",()=>Y(e)),e.addEventListener("keydown",l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),Y(e))})}),h.playSfx("spin"),setTimeout(()=>s.classList.remove("sl-card-grid--shuffling"),350))}function nt(){p&&(k.size<p.words.length||z||Mt())}function Mt(){var s;const t=document.getElementById("sl-recall");t&&(t.hidden=!1,t.innerHTML=`
    <div class="sl-recall-card sl-recall-card--teaser">
      <div class="sl-recall-emoji" aria-hidden="true">🎯</div>
      <div class="sl-recall-copy">
        <div class="sl-recall-title">Nice — you've met every word!</div>
        <div class="sl-recall-sub">Try a quick check: hear a word, tap the right card.</div>
      </div>
      <button class="btn btn--primary btn--sm" id="sl-btn-start-quiz"
              aria-label="Start a quick three-question check">
        Start quick check
      </button>
    </div>
  `,(s=document.getElementById("sl-btn-start-quiz"))==null||s.addEventListener("click",it))}function it(){z=!0,x=0,j=0,Q=!1,h.playSfx("reveal"),rt()}function rt(){if(!p)return;if(x>=_){ot();return}x++;const t=p.words;m=t[Math.floor(Math.random()*t.length)];const s=[...t];for(let e=s.length-1;e>0;e--){const l=Math.floor(Math.random()*(e+1));[s[e],s[l]]=[s[l],s[e]]}if(v=s.slice(0,Math.min(4,s.length)),!v.includes(m)){v[0]=m;for(let e=v.length-1;e>0;e--){const l=Math.floor(Math.random()*(e+1));[v[e],v[l]]=[v[l],v[e]]}}Wt()}function Wt(){var s;const t=document.getElementById("sl-recall");t&&(t.innerHTML=`
    <div class="sl-recall-card sl-recall-card--quiz" role="group"
         aria-label="Quick check round ${x} of ${_}">
      <div class="sl-quiz-head">
        <span class="sl-quiz-step">Quick check ${x} / ${_}</span>
        <button class="btn btn--ghost btn--sm" id="sl-btn-quiz-hear"
                aria-label="Hear the word again">
          🔊 Hear it again
        </button>
      </div>
      <p class="sl-quiz-prompt">Tap the word you hear.</p>
      <div class="sl-quiz-choices" role="list">
        ${v.map(e=>`
          <button class="sl-quiz-choice" type="button"
                  data-word="${y(e)}"
                  aria-label="Choice ${y(e)}">
            ${y(e)}
          </button>
        `).join("")}
      </div>
    </div>
  `,(s=document.getElementById("sl-btn-quiz-hear"))==null||s.addEventListener("click",()=>{m&&h.speakSightWord(m)}),t.querySelectorAll(".sl-quiz-choice").forEach(e=>{e.addEventListener("click",()=>At(e))}),setTimeout(()=>{m&&h.speakSightWord(m)},250))}function At(t){if(Q)return;const s=t.dataset.word;if(!s)return;Q=!0;const e=document.getElementById("sl-recall");if(s===m)t.classList.add("sl-quiz-choice--correct"),j++,P.add(m),G(),h.playSfx("correct");else{t.classList.add("sl-quiz-choice--wrong"),t.setAttribute("disabled",""),h.playSfx("wrong");const n=e==null?void 0:e.querySelector(`.sl-quiz-choice[data-word="${dt(m)}"]`);n==null||n.classList.add("sl-quiz-choice--hint")}const l=e==null?void 0:e.querySelector(".sl-recall-card--quiz");if(l){const n=document.createElement("div");n.className="vmcq-next-wrap";const r=document.createElement("button");r.className="btn btn--primary vmcq-next-btn",r.textContent=x>=_?"See Results →":"Next →",r.setAttribute("aria-label",x>=_?"See results":"Next word"),n.appendChild(r),l.appendChild(n),r.addEventListener("click",()=>{Q=!1,rt()}),r.focus()}}function ot(){var e,l,n;z=!1,U(),h.playSfx("levelUp");const t=document.getElementById("sl-recall");if(!t)return;const s=j===_;t.innerHTML=`
    <div class="sl-recall-card sl-recall-card--done">
      <div class="sl-recall-emoji" aria-hidden="true">${s?"🎉":"🌟"}</div>
      <div class="sl-recall-copy">
        <div class="sl-recall-title">
          ${s?"Perfect! You got them all!":"Nice work!"}
        </div>
        <div class="sl-recall-sub">
          You got ${j} out of ${_} right.
          You're ready for the matching game!
        </div>
      </div>
      <div class="sl-recall-actions">
        <button class="btn btn--ghost btn--sm" id="sl-btn-quiz-retry"
                aria-label="Try the quick check again">
          🔁 Try again
        </button>
        <button class="btn btn--ghost btn--sm" id="sl-btn-spell-it"
                aria-label="Practise spelling these words">
          🔤 Spell it!
        </button>
        <button class="btn btn--primary btn--sm" id="sl-btn-quiz-to-match"
                aria-label="Play the matching game now">
          🃏 Play matching game
        </button>
      </div>
    </div>
  `,(e=document.getElementById("sl-btn-quiz-retry"))==null||e.addEventListener("click",it),(l=document.getElementById("sl-btn-spell-it"))==null||l.addEventListener("click",J),(n=document.getElementById("sl-btn-quiz-to-match"))==null||n.addEventListener("click",()=>{var r;(r=g.onStartMatch)==null||r.call(g,p)})}function J(){var s,e;if(!p)return;const t=document.getElementById("sl-recall");t&&(t.hidden=!1,z=!1,(e=(s=h).playSfx)==null||e.call(s,"reveal"),t.scrollIntoView({behavior:"smooth",block:"center"}),bt(t,p.words,{onDone:l=>Ht(l),onCancel:ot}))}function Ht(t){var r,o,b,a;const s=document.getElementById("sl-recall");if(!s)return;(o=(r=h).playSfx)==null||o.call(r,"levelUp");const e=(t==null?void 0:t.totalWords)??0,l=(t==null?void 0:t.correctFirstTry)??0,n=e>0&&l===e;s.innerHTML=`
    <div class="sl-recall-card sl-recall-card--done">
      <div class="sl-recall-emoji" aria-hidden="true">${n?"🏆":"✨"}</div>
      <div class="sl-recall-copy">
        <div class="sl-recall-title">
          ${n?"Perfect spelling!":"Great spelling practice!"}
        </div>
        <div class="sl-recall-sub">
          You spelled ${l} of ${e} on the first try.
          ${n?"You're a spelling star!":"Keep practising and you'll get them all."}
        </div>
      </div>
      <div class="sl-recall-actions">
        <button class="btn btn--ghost btn--sm" id="sl-btn-spell-it-again"
                aria-label="Spell these words again">
          🔁 Spell again
        </button>
        <button class="btn btn--primary btn--sm" id="sl-btn-spell-to-match"
                aria-label="Play the matching game now">
          🃏 Play matching game
        </button>
      </div>
    </div>
  `,(b=document.getElementById("sl-btn-spell-it-again"))==null||b.addEventListener("click",J),(a=document.getElementById("sl-btn-spell-to-match"))==null||a.addEventListener("click",()=>{var i;(i=g.onStartMatch)==null||i.call(g,p)})}function U(){if(!p)return;const t=F.get("sightQuestsStudied")||{};t[p.id]||(t[p.id]=!0,F.set("sightQuestsStudied",t))}function jt(t){return!!(F.get("sightQuestsStudied")||{})[t]}function tt(t){return new Promise(s=>setTimeout(s,t))}function y(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function dt(t){return String(t).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function Pt(t){if(!w)return;const s=document.createElement("div");s.className="sl-inline-toast",s.setAttribute("role","status"),s.textContent=t,w.appendChild(s),setTimeout(()=>{s.classList.add("sl-inline-toast--leave"),setTimeout(()=>s.remove(),350)},1800)}export{Ut as cleanupSightLearn,Ot as initSightLearn,Ft as showSightLearn};
