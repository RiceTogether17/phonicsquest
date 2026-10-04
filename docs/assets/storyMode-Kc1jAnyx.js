import{q as S,X as Jt,s as pe,W as vt,Y as Dn,Z as Qe,_ as He,C as kt,o as Yn,M as ut,$ as Ye,a0 as Pe,a1 as Un,a2 as K,b as Kn,a3 as Vn,a4 as Jn}from"./index-DE7PXkqr.js";import{S as X,B as Q}from"./stories-wHw8goVZ.js";import{s as Qn,e as Qt,P as Xn,a as Xt}from"./decodability-BF4x6TQg.js";import{g as Zn}from"./sightWordCode-BzuQg0Hs.js";import"./gsap-C8pce-KX.js";const es=/(\s+|["“”'',.!?;:()-]+)/;function Zt(e){return String(e??"").split(es).filter(t=>t.length>0).map(t=>({text:t,type:/^\s+$/.test(t)?"space":/^[^a-zA-Z0-9]+$/.test(t)?"punct":"word"}))}const ts=new Set(`a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just some any true false story about also`.split(/\s+/));function ns(e){let t=e.toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");/[^aeiou]ies$/.test(t)?t=`${t.slice(0,-3)}y`:/(ss|sh|ch|x|z)es$/.test(t)?t=t.slice(0,-2):(/[^s]es$/.test(t)||/[^su]s$/.test(t))&&(t=t.slice(0,-1));let s=!1;return/.{3,}ing$/.test(t)?(t=t.slice(0,-3),s=!0):(/.{3,}ed$/.test(t)||/.{3,}ly$/.test(t))&&(t=t.slice(0,-2),s=!0),s&&(t=t.replace(/([bdgmnprt])\1$/,"$1")),t}function rt(e){return new Set(String(e??"").split(/[\s\-—–/]+/).map(t=>t.toLowerCase().replace(/[^a-z']/g,"")).filter(t=>t.length>1&&!ts.has(t)).map(ns).filter(t=>t.length>1))}function ss(e){const t=[];return((e==null?void 0:e.lines)??[]).forEach((s,n)=>{if(s.type==="label"||s.type==="chapter"||!s.text)return;const o=Zt(s.text);let r=-1,a=null,l=[];const i=()=>{a!==null&&(t.push({line:n,from:a,to:r,text:l.join("").trim()}),a=null,l=[])};for(const c of o)c.type==="word"&&(r+=1,a===null&&(a=r)),a!==null&&l.push(c.text),c.type==="punct"&&/[.!?]/.test(c.text)&&i();i()}),t}const os=3;function en(e,t,s=""){const n=rt(`${t} ${s}`),o=rt(s);if(!n.size)return null;let r=null,a=0;for(const l of ss(e)){const i=rt(l.text);let c=0;for(const p of n)i.has(p)&&(c+=(p.length>3?2:1)*(o.has(p)?3:1));(c>a||c===a&&c>0&&r&&l.text.length<r.text.length)&&(r=l,a=c)}return a>=os?r:null}function rs(e,t){var n;if(!(t!=null&&t.q))return null;const s=((n=t.options)==null?void 0:n[t.answer])??"";return en(e,t.q,s)}const as="___",Ue="The story does not say",Ot=e=>{var t;return((t=e.options)==null?void 0:t[e.answer])===Ue};function is(e){const t=e.options.map((o,r)=>r),s=t.filter(o=>e.options[o]===Ue),n=t.filter(o=>e.options[o]!==Ue);return[...e.kind==="tf"?n:Jt(n),...s]}function ls(e,t,s){var T;if(!((T=t.comprehension)!=null&&T.length)){s==null||s();return}const n={phase:"intro",qIndex:0,vocabIndex:0,correct:0,firstTry:0,withClue:0,hadClue:!1,clue:null,total:t.comprehension.length,flipped:!1};function o(){switch(n.phase){case"intro":return r();case"comprehension":return i();case"vocab":return m();case"openEnded":return d();case"grammar":return b();case"done":return I()}}function r(){var g,w,k,u;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(g=t.vocab)!=null&&g.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(w=t.grammarSpotlight)!=null&&w.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(k=document.getElementById("sq-start"))==null||k.addEventListener("click",()=>{n.phase="comprehension",n.qIndex=0,o()}),(u=document.getElementById("sq-skip"))==null||u.addEventListener("click",()=>s==null?void 0:s())}function a(){const g=n.qIndex+1;return S`
      <div class="sq-progress-bar">
        <div class="sq-progress-fill" style="width:${g/n.total*100}%"></div>
      </div>
      <p class="sq-phase-label">❓ Question ${g} of ${n.total}</p>
    `}function l(g){if(g.kind==="tf")return S`<p class="sq-kind-label">True or false?</p>
        <p class="sq-question-text">${g.q}</p>`;if(g.kind==="gap"){const[w,k=""]=g.q.split(as);return S`<p class="sq-kind-label">Pick the word that fits.</p>
        <p class="sq-question-text">
          ${w}<span class="sq-gap" id="sq-gap"><span class="visually-hidden">blank</span></span>${k}
        </p>`}return S`<p class="sq-question-text">${g.q}</p>
      ${g.type==="inferential"&&S`<span class="sq-infer-badge">🤔 Think about it…</span>`}`}function i(){const g=t.comprehension[n.qIndex];if(g.kind==="order")return p(g);n.clue=Ot(g)?null:rs(t,g),n.hadClue=!1;const w=is(g);e.innerHTML=S`
      <div class="sq-screen sq-comprehension">
        ${a()}
        <div class="sq-question-card">${l(g)}</div>

        <div class="sq-options" id="sq-options">
          ${w.map((k,u)=>S`
              <button class="sq-option" data-idx="${k}" aria-label="${g.options[k]}">
                <span class="sq-option-letter">${String.fromCharCode(65+u)}</span>
                <span class="sq-option-text">${g.options[k]}</span>
              </button>
            `)}
        </div>

        <div class="sq-feedback" id="sq-feedback" aria-live="polite" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>Next →</button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(k=>{k.addEventListener("click",()=>c(k,g))})}function c(g,w){const k=parseInt(g.dataset.idx,10),u=k===w.answer,f=document.getElementById("sq-feedback"),y=n.clue,E=Ot(w);if(!u&&!n.hadClue&&(y||E)){n.hadClue=!0,g.disabled=!0,g.classList.add("sq-option--wrong"),f&&(f.hidden=!1,f.className="sq-feedback sq-feedback--retry",f.innerHTML=y?S`Not quite. The story says: <q class="sq-clue">${y.text}</q> Have another go.`:S`Not quite. Look back at the story: can you find a sentence that says this? Have
              another go.`);return}u&&(n.hadClue?n.withClue++:n.firstTry++,n.correct++),document.querySelectorAll(".sq-option").forEach(R=>{const F=parseInt(R.dataset.idx,10);R.disabled=!0,F===w.answer&&R.classList.add("sq-option--correct"),F===k&&!u&&R.classList.add("sq-option--wrong")});const C=document.getElementById("sq-gap");C&&(C.textContent=w.options[w.answer],C.classList.add("sq-gap--filled")),f&&(f.hidden=!1,f.className=`sq-feedback ${u?"sq-feedback--correct":"sq-feedback--wrong"}`,u?f.textContent=E?"✅ Good checking — the story never says that.":n.hadClue?"✅ You found it!":"✅ Great thinking!":E?f.innerHTML=S`The answer is <strong>${Ue}</strong>. Nothing in it tells us
          that.`:f.innerHTML=y?S`The answer is <strong>${w.options[w.answer]}</strong>. The story says:
              <q class="sq-clue">${y.text}</q>`:S`The answer is <strong>${w.options[w.answer]}</strong>.`),h()}function p(g){n.clue=null,n.hadClue=!1;const w=[];let k=Jt(g.events.map((L,B)=>B));k.every((L,B)=>L===B)&&(k=[...k.slice(1),k[0]]),e.innerHTML=S`
      <div class="sq-screen sq-comprehension">
        ${a()}
        <div class="sq-question-card">
          <p class="sq-kind-label">Tap them from first to last.</p>
          <p class="sq-question-text">${g.q}</p>
        </div>

        <div class="sq-options" id="sq-options">
          ${k.map(L=>S`
              <button class="sq-option sq-order-event" data-idx="${L}">
                <span class="sq-option-letter" aria-hidden="true">?</span>
                <span class="sq-option-text">${g.events[L]}</span>
              </button>
            `)}
        </div>
        <button class="btn btn--ghost" id="sq-order-undo" disabled>↩ Undo</button>

        <div class="sq-feedback" id="sq-feedback" aria-live="polite" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>Next →</button>
      </div>
    `;const u=[...document.querySelectorAll(".sq-order-event")],f=document.getElementById("sq-order-undo"),y=document.getElementById("sq-feedback"),E=(L,B)=>{L.querySelector(".sq-option-letter").textContent=B},C=L=>{const B=w.indexOf(Number(L.dataset.idx)),M=L.querySelector(".sq-option-text").textContent.trim();L.setAttribute("aria-label",B>=0?`${B+1}: ${M}`:M)},R=()=>{w.length=0,u.forEach(L=>{L.disabled=!1,L.classList.remove("sq-order-event--picked"),E(L,"?"),C(L)}),f.disabled=!0};u.forEach(L=>{C(L),L.addEventListener("click",()=>{w.push(Number(L.dataset.idx)),L.disabled=!0,L.classList.add("sq-order-event--picked"),E(L,String(w.length)),C(L),f.disabled=!1,y&&(y.hidden=!0),w.length===g.events.length&&F()})}),f.addEventListener("click",()=>{const L=w.pop(),B=u.find(M=>Number(M.dataset.idx)===L);B&&(B.disabled=!1,B.classList.remove("sq-order-event--picked"),E(B,"?"),C(B)),f.disabled=w.length===0});function F(){const L=w.every((M,P)=>M===P);if(!L&&!n.hadClue){n.hadClue=!0,R(),y&&(y.hidden=!1,y.className="sq-feedback sq-feedback--retry",y.textContent="Not quite. Think about what happened first in the story, then try again.");return}L&&(n.hadClue?n.withClue++:n.firstTry++,n.correct++);const B=document.getElementById("sq-options");[...u].sort((M,P)=>Number(M.dataset.idx)-Number(P.dataset.idx)).forEach(M=>{B.appendChild(M),M.disabled=!0,M.classList.remove("sq-order-event--picked"),E(M,String(Number(M.dataset.idx)+1)),M.classList.add(L?"sq-option--correct":"sq-order-event--shown")}),f.hidden=!0,y&&(y.hidden=!1,y.className=`sq-feedback ${L?"sq-feedback--correct":"sq-feedback--wrong"}`,y.textContent=L?n.hadClue?"✅ You worked it out!":"✅ That is the order it happened in!":"This is the order it happened in the story."),h()}}function h(){const g=document.getElementById("sq-next");g&&(g.hidden=!1,g.addEventListener("click",()=>{var w,k,u;n.qIndex++,n.qIndex<n.total||(n.phase=(w=t.openEnded)!=null&&w.length?"openEnded":(k=t.vocab)!=null&&k.length?"vocab":(u=t.grammarSpotlight)!=null&&u.length?"grammar":"done",n.vocabIndex=0),o()}))}function d(){var w,k,u;const g=t.openEnded||[];if(!g.length){n.phase=(w=t.vocab)!=null&&w.length?"vocab":(k=t.grammarSpotlight)!=null&&k.length?"grammar":"done",o();return}e.innerHTML=S`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">✍️ Your turn to write</p>
        ${g.map((f,y)=>S`
            <div class="sq-question-card sq-written">
              <label class="sq-question-text" for="sq-written-${y}">${f.q}</label>
              <textarea
                class="cp-name-input sq-written-input"
                id="sq-written-${y}"
                rows="3"
                placeholder="Write your answer here…"
              ></textarea>
              <details class="sq-written-model">
                <summary>See a good answer</summary>
                <p>${f.sampleAnswer}</p>
                <p class="sq-written-check">✅ ${f.markingGuide}</p>
              </details>
            </div>
          `)}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>
    `,(u=document.getElementById("sq-open-next"))==null||u.addEventListener("click",()=>{var f,y;n.phase=(f=t.vocab)!=null&&f.length?"vocab":(y=t.grammarSpotlight)!=null&&y.length?"grammar":"done",o()})}function m(){var y,E,C;const g=t.vocab[n.vocabIndex],w=t.vocab.length,k=n.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${k} of ${w}</p>

        <div class="sq-flip-card ${n.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${g.icon}</div>
            <p class="sq-flip-word">${g.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${g.icon}</div>
            <p class="sq-flip-meaning">${g.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${n.flipped?`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${k<w?"Next word →":"Done with words!"}
            </button>
          `:`
            <button class="btn btn--ghost btn--xl" id="sq-flip-btn">
              👀 Flip card
            </button>
          `}
        </div>
        <button class="btn btn--ghost sq-skip-btn" id="sq-vocab-skip">
          Skip vocab
        </button>
      </div>
    `;const u=document.getElementById("sq-flip-card"),f=()=>{n.flipped=!0,o()};u==null||u.addEventListener("click",f),u==null||u.addEventListener("keydown",R=>{(R.key==="Enter"||R.key===" ")&&f()}),(y=document.getElementById("sq-flip-btn"))==null||y.addEventListener("click",f),(E=document.getElementById("sq-vocab-next"))==null||E.addEventListener("click",()=>{var R;n.vocabIndex++,n.flipped=!1,n.vocabIndex<w||(n.phase=(R=t.grammarSpotlight)!=null&&R.length?"grammar":"done"),o()}),(C=document.getElementById("sq-vocab-skip"))==null||C.addEventListener("click",()=>{var R;n.phase=(R=t.grammarSpotlight)!=null&&R.length?"grammar":"done",o()})}function b(){var k;const w=(t.grammarSpotlight??[]).map((u,f)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${f+1}</div>
        <h3 class="sq-grammar-pattern">${u.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${u.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${u.tip}</p>
      </div>
    `).join("");e.innerHTML=`
      <div class="sq-screen sq-grammar">
        <p class="sq-phase-label">✏️ Grammar Spotlight</p>
        <div class="sq-grammar-list">${w}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(k=document.getElementById("sq-grammar-done"))==null||k.addEventListener("click",()=>{n.phase="done",o()})}function I(){var E;const g=n.total>0?Math.round(n.correct/n.total*100):100,w=g>=80?3:g>=50?2:1,k="⭐".repeat(w)+"☆".repeat(3-w),u=n.correct*15+(g===100?25:0),f=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],y=w===3?f[2]:w===2?f[1]:f[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${k}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${y}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${n.correct}</span>
            <span class="sq-score-denom">/ ${n.total}</span>
            <span class="sq-score-label">correct</span>
          </div>
          <div class="sq-xp-badge">
            <span class="sq-xp-num">+${u}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        ${n.withClue?`<p class="sq-breakdown">${n.firstTry} right first time · ${n.withClue} worked out from the story</p>`:""}
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `,(E=document.getElementById("sq-back"))==null||E.addEventListener("click",()=>s==null?void 0:s())}o()}function cs(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const s=Math.min(t,e.length-1);let n=-1,o=!1;for(let r=0;r<=s;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(n++,o=!0):a&&(o=!1)}return n<0?-1:n}function ds(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const s=80;return e.bottom<s||e.top>t-s}function us(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let Ee=null;function tn(){if(Ee)return Ee;Ee=new Map;for(const e of vt)e!=null&&e.word&&Ee.set(e.word.toLowerCase(),e);return Ee}function ps(e){const t=us(e),s=tn(),n=t?s.get(t):null;if(n){const o=pe.get("wordStats")||{},r=!!o[n.id]&&(o[n.id].attempts||0)>0;return{text:n.word,word:n,foundInBank:!0,graphemes:Array.isArray(n.graphemes)?n.graphemes:[t],types:Array.isArray(n.types)?n.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function nn(e){return!e||typeof e!="string"||!(tn().has(e)||vt.some(n=>(n==null?void 0:n.id)===e))?!1:(pe.recordWordAttempt(e,!0,Dn.EXPOSURE),!0)}const hs=.62,fs=.4,Wt=2;function Ft(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function ms(e,t,s=(n,o)=>Qe.phoneticSimilarity(n,o)){const n=e.length,o=t.length;if(n===0)return[];if(o===0)return e.map(h=>({word:h,status:"miss",heard:null}));const r=-.4,a=Array.from({length:n+1},()=>new Array(o+1).fill(0));for(let h=1;h<=n;h++)a[h][0]=h*r;for(let h=1;h<=o;h++)a[0][h]=h*r;const l=Array.from({length:n},(h,d)=>Array.from({length:o},(m,b)=>s(e[d],t[b])));for(let h=1;h<=n;h++)for(let d=1;d<=o;d++){const m=l[h-1][d-1]-.5;a[h][d]=Math.max(a[h-1][d-1]+m,a[h-1][d]+r,a[h][d-1]+r)}const i=new Array(n);let c=n,p=o;for(;c>0;){const h=p>0?l[c-1][p-1]-.5:-1/0;if(p>0&&a[c][p]===a[c-1][p-1]+h){const d=l[c-1][p-1],m=e[c-1];let b;d>=hs?b="match":d>=fs||m.length<=Wt?b="unsure":b="miss",i[c-1]={word:m,status:b,heard:t[p-1]},c--,p--}else if(p>0&&a[c][p]===a[c][p-1]+r)p--;else{const d=e[c-1];i[c-1]={word:d,status:d.length<=Wt?"unsure":"miss",heard:null},c--}}return i}function gs(e,t,s){const n=Ft(e);let o=null;for(const r of t||[]){const a=ms(n,Ft(r.text),s),l=a.filter(i=>i.status==="match").length;(!o||l>o.matchCount)&&(o={words:a,matchCount:l,total:n.length})}return o||{words:n.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:n.length}}function bs(){return Qe.supported}async function ys(e){const t=await Qe.listenTranscript({timeoutMs:12e3});return t?gs(e,t.transcripts):null}function ws(){Qe.stop()}const qe=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function vs(e){const t=[];return e.forEach((s,n)=>{if(!s)return;const o=t[t.length-1];!o||(s.top+s.bottom)/2>o.bottom?t.push({top:s.top,bottom:s.bottom,first:n,last:n}):(o.top=Math.min(o.top,s.top),o.bottom=Math.max(o.bottom,s.bottom),o.last=n)}),t}const ks=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function Oe(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const s=getComputedStyle(t).overflowY;if((s==="auto"||s==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function $s(e,{mode:t,word:s=null,wordSelector:n=".wf-word",safeArea:o,onMove:r}){var Mt,Nt,Ht;const a=[...e.querySelectorAll(n)];let l=[],i=0,c=0;const p=document.createElement("div");p.className=`ruler-layer ruler-layer--${t}`,p.setAttribute("aria-hidden","true"),p.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(p);const h=()=>{const $=a[i]??a[0]??e;return parseFloat(getComputedStyle($).fontSize)||20},d=$=>p.querySelector($),m=d(".ruler-veil--above"),b=d(".ruler-veil--below"),I=d(".ruler-strip"),T=d(".ruler-word"),g=d(".ruler-bar");function w(){const $=e.getBoundingClientRect();l=vs(a.map(q=>{const A=q.getBoundingClientRect();return A.width||A.height?{top:A.top-$.top,bottom:A.bottom-$.top}:null}))}const k=$=>{const q=l.findIndex(A=>$>=A.first&&$<=A.last);return q<0?0:q};function u(){const $=l[c];if(!$)return;const q=h(),A=q*.6,O=$.bottom+q*.18,G=Math.max(12,q*.55),V=e.scrollHeight;m.style.height=`${Math.max(0,$.top-A)}px`,b.style.top=`${O+G}px`,b.style.height=`${Math.max(0,V-O-G)}px`,I.style.top=`${$.top-A}px`,I.style.height=`${O-($.top-A)}px`,g.style.top=`${O}px`,g.style.height=`${G}px`;const ie=a[i];if(t==="word"&&ie){const le=e.getBoundingClientRect(),se=ie.getBoundingClientRect();T.style.left=`${se.left-le.left-3}px`,T.style.width=`${se.width+6}px`,T.style.top=`${se.top-le.top-2}px`,T.style.height=`${se.height+4}px`,g.style.setProperty("--x",`${se.left-le.left+se.width/2}px`)}a.forEach((le,se)=>le.classList.toggle("is-pointed",t==="word"&&se===i))}function f(){r==null||r({word:i,line:c,lines:l.length,words:a.length,atEnd:t==="word"?i>=a.length-1:c>=l.length-1})}function y(){const $=l[c];if(!$)return;const q=e.getBoundingClientRect(),A=h(),O=q.top+$.top-A*.6,G=q.top+$.bottom+A*1.2,V=o();if(O>=V.top&&G<=V.bottom)return;const ie=V.top+(V.bottom-V.top)*.28,le={top:O-ie,behavior:ks()?"auto":"smooth"};(Oe(e)??window).scrollBy(le)}function E($,{scroll:q=!0}={}){var A;c=Math.max(0,Math.min(l.length-1,$)),i=((A=l[c])==null?void 0:A.first)??0,u(),f(),q&&y()}function C($,{scroll:q=!0}={}){i=Math.max(0,Math.min(a.length-1,$)),c=k(i),u(),f(),q&&y()}function R($){const q=$-e.getBoundingClientRect().top;let A=0,O=1/0;return l.forEach((G,V)=>{const ie=q<G.top?G.top-q:q>G.bottom?q-G.bottom:0;ie<O&&(O=ie,A=V)}),A}let F=!1;g.addEventListener("pointerdown",$=>{var q;F=!0,(q=g.setPointerCapture)==null||q.call(g,$.pointerId),p.classList.add("is-dragging"),$.preventDefault()}),g.addEventListener("pointermove",$=>{if(!F)return;const q=h(),A=R($.clientY-q*.6);A!==c&&E(A,{scroll:!1})});const L=()=>{F&&(F=!1,p.classList.remove("is-dragging"),y())};g.addEventListener("pointerup",L),g.addEventListener("pointercancel",L);let B=0;const M=()=>{cancelAnimationFrame(B),B=requestAnimationFrame(()=>{var $;w(),c=k(i),t!=="word"&&(i=(($=l[c])==null?void 0:$.first)??i),p.classList.add("no-anim"),u(),f(),requestAnimationFrame(()=>p.classList.remove("no-anim"))})},P=typeof ResizeObserver=="function"?new ResizeObserver(M):null;if(P==null||P.observe(e),(Nt=(Mt=document.fonts)==null?void 0:Mt.ready)==null||Nt.then(M).catch(()=>{}),w(),s==null){const $=o(),q=e.getBoundingClientRect().top,A=l.findIndex(O=>q+O.top>=$.top);c=Math.max(0,A),i=((Ht=l[c])==null?void 0:Ht.first)??0}else i=Math.max(0,Math.min(a.length-1,s)),c=k(i);return p.classList.add("no-anim"),u(),f(),requestAnimationFrame(()=>{p.classList.remove("no-anim"),s!=null&&y()}),{next(){t==="word"?C(i+1):E(c+1)},prev(){t==="word"?C(i-1):E(c-1)},nextLine:()=>E(c+1),prevLine:()=>E(c-1),tap($,q){const A=q?a.indexOf(q):-1;A>=0?t==="word"?C(A,{scroll:!1}):E(k(A),{scroll:!1}):E(R($),{scroll:!1})},follow($){const q=a.indexOf($);q<0||(t==="word"?q!==i&&C(q):k(q)!==c&&E(k(q)))},reveal:y,current:()=>a[i]??null,goTo($){t==="word"?C($):E(k(Math.max(0,Math.min(a.length-1,$))))},destroy(){P==null||P.disconnect(),cancelAnimationFrame(B),a.forEach($=>$.classList.remove("is-pointed")),e.classList.remove("has-ruler"),p.remove()}}}const Ss="giri_story_place",Es=40,xs=30,sn=8,on=()=>He(Ss);function $t(){try{const e=localStorage.getItem(on()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function pt(e){try{localStorage.setItem(on(),JSON.stringify(e))}catch{}}function qs(e,t=Date.now()){const s=t-xs*24*60*60*1e3,n=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=s);return n.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(n.slice(0,Es))}function rn(e,t,s=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const n=$t();if(t<sn){if(!(e in n))return;delete n[e],pt(n);return}n[e]={word:Math.max(0,Math.round(t)),at:s},pt(qs(n,s))}function Ls(e){const t=$t()[e];return t&&typeof t.word=="number"&&t.word>=sn?t.word:null}function St(e){const t=$t();e in t&&(delete t[e],pt(t))}function Ts(e){const t=pe.get("groupMastery")||{},s=kt.filter(o=>e.includes(o.phase));return s.length?s.filter(o=>(t[o.group]??0)>=.8).length/s.length:0}function Pt(e){const t=pe.get("groupMastery")||{};return kt.some(s=>e.includes(s.id)&&typeof t[s.group]=="number"&&t[s.group]>0)}function Gt(e){const t=pe.get("groupMastery")||{};return kt.some(s=>e.includes(s.phase)&&typeof t[s.group]=="number"&&t[s.group]>0)}function an(){const e=Ts([1,2,3,4,5]),t=Gt([6]),s=Pt(["rc-ar-or","rc-er-ir-ur"]),n=Pt(["dip-oi","dip-ou","dip-aw"]),o=Gt([9,10]),r=e>=.6||t,a=r&&s,l=a&&n,i=l&&o;return{A:{ready:!0,hint:""},B:{ready:r,hint:r?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:a,hint:a?"":"Best after starting Phase 7 — Bossy R (ar, or, er)"},D:{ready:l,hint:l?"":"Best after starting Phase 8 — Diphthongs"},E:{ready:i,hint:i?"":"Best after starting Phase 9 — Suffixes"}}}function _s(e,t){const s=an();for(const n of["A","B","C","D","E"]){if(!s[n].ready)break;const o=(t==null?void 0:t[n])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return n}return"A"}const Is=["A","B","C","D","E"];let xe=null;function As(e){var t;if(!xe){xe=new Map;for(const s of Is)for(const n of X)if(n.band===s)for(const o of Qt(n))xe.has(o)||((t=Zn(o))==null?void 0:t.category)==="heart"&&xe.set(o,s)}return xe.get(e)??null}function Et(e){if(!e)return[];const t=new Map(Qn(e).map(o=>[o.word,o])),s=[],n=new Set;for(const o of Qt(e))n.has(o)||(n.add(o),t.has(o)?s.push(t.get(o)):As(o)===e.band&&s.push({word:o,display:o==="i"?"I":o,status:"heart"}));return s}const ke=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),Rs=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...ke[e]}))),xt=new Set(["short","long","schwa","rcontrolled","diphthong"]),Cs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),Xe="bcdfghjklmnpqrstvwxyz",Bs=new RegExp(`[${Xe}]a$`),Ms=new RegExp("[bcdfghjkmnprstvz]al$"),ln=/[ts]ion$/;function cn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(Cs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&Bs.test(e)&&t.add(e.length-1),e.length>=4&&Ms.test(e)&&t.add(e.length-2),e.length>=5&&ln.test(e)&&t.add(e.length-3)),t.size?t:null}const Ns=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),Hs=new RegExp(`[${Xe}]e$`);function dn(e){const t=new Set,s=e.length;if(s>=5&&ln.test(e)&&t.add(s-2),s>=4&&Hs.test(e)&&!Ns.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-1),s>=4&&e.endsWith("ed")){const n=e[s-3];Xe.includes(n)&&n!=="t"&&n!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-2)}return t.size?t:null}const Os=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Ws=new Set(["been"]),Fs=new Set(["friend","friends"]),Ps=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),Gs=["ing","ed","ly","es","s","n"];function Ge(e,t){if(e.has(t))return!0;for(const s of Gs)if(t.endsWith(s)&&t.length-s.length>=2&&e.has(t.slice(0,-s.length)))return!0;return!1}function Le(e,t,s,n,o,r){return xt.has(n)?r!=null&&r.has(s)?"silent":o!=null&&o.has(s)?"schwa":t==="ea"&&Ge(Os,e)||t==="ee"&&Ge(Ws,e)||t==="ie"&&Ge(Fs,e)?"short":t==="ow"&&Ge(Ps,e)?"long":n:n}const x=null,un=new Map([["have",[x,"short",x,"silent"]],["love",[x,"short",x,"silent"]],["come",[x,"short",x,"silent"]],["some",[x,"short",x,"silent"]],["done",[x,"short",x,"silent"]],["gone",[x,"short",x,"silent"]],["none",[x,"short",x,"silent"]],["give",[x,"short",x,"silent"]],["live",[x,"short",x,"silent"]],["one",["short",x,"silent"]],["were",[x,"rcontrolled","rcontrolled","silent"]],["here",[x,"rcontrolled","rcontrolled","silent"]],["where",[x,x,"rcontrolled","rcontrolled","silent"]],["there",[x,x,"rcontrolled","rcontrolled","silent"]],["above",["schwa",x,"short",x,"silent"]],["become",[x,"short",x,"short",x,"silent"]],["people",[x,"long","silent",x,x,"silent"]],["again",["schwa",x,"long","long",x]],["said",[x,"short","short",x]],["says",[x,"short","short",x]]]),js=new Map(vt.map(e=>[e.word.toLowerCase(),e])),pn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function zs(e){return pn[e]??"consonant"}function hn(e,t,s){const n=String(e).toLowerCase().replace(/[^a-z]/g,""),o=cn(n),r=dn(n),a=un.get(n),l=[];let i=0;for(let c=0;c<t.length;c++){const p=t[c]||"",h=p.length||1;let d=zs(s[c]);xt.has(d)&&(d=(a==null?void 0:a[i])??Le(n,p,i,d,o,r)),l.push(d),i+=h}return l}const Ds="aeiou",Ys="bcdfghjklmnpqrstvwxyz",jt=e=>Ds.includes(e),Us=e=>Ys.includes(e),fn=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Ks=Object.keys(fn).sort((e,t)=>t.length-e.length);function Vs(e,t,s){const n=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&jt(e[r])&&Us(e[r+1])&&e[r+2]==="e"){n.push({len:1,sound:Le(e,e[r],r,"long",t,s)}),n.push({len:1,sound:null}),n.push({len:1,sound:"silent"});break}let a=!1;for(const l of Ks)if(e.startsWith(l,r)){n.push({len:l.length,sound:Le(e,l,r,fn[l],t,s)}),r+=l.length,a=!0;break}if(!a){if(jt(e[r])||e[r]==="y"&&r>0){const l=r===o-1?"long":"short";n.push({len:1,sound:Le(e,e[r],r,l,t,s)}),r+=1;continue}n.push({len:1,sound:null}),r+=1}}return n}function Js(e,t,s,n){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const l=e.graphemes[a],i=l.length;if(i===2&&l[1]==="e"&&Xe.includes(l[0])&&r+2===t.length&&(n!=null&&n.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=pn[e.types[a]]??null;!xt.has(c)&&c!=="silent"&&(c=null),c=Le(t,l,r,c,s,n),o.push({len:i,sound:c}),r+=i}return o}function mn(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Xn.has(t))return null;const s=un.get(t);if(s){const l=[];for(const i of s){const c=l[l.length-1];c&&c.sound===i?c.len+=1:l.push({len:1,sound:i})}return l}const n=cn(t),o=dn(t),r=js.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?Js(r,t,n,o):Vs(t,n,o)}function Qs(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const s=mn(t);if(!s)return t;let n="",o=0;for(const{len:a,sound:l}of s){const i=t.slice(o,o+a);if(o+=a,!l){n+=i;continue}const c=(r=ke[l])==null?void 0:r.cue;n+=`<span class="vs vs--${l}"${c?` data-cue="${c}"`:""}>${i}</span>`}return o<t.length&&(n+=t.slice(o)),n})}function Xs(e,t){const s=[];let n="",o="";return e.forEach((r,a)=>{const l=r.replace(/^-/,"");if(t[a]==="silent"){o+=l;return}n+=o+l,o="",s.push(n)}),o&&s.length&&(s[s.length-1]+=o),s}function Zs(e,t){let s=-1;for(let n=0;n<e.length;n++)if(e[n]!=="silent"&&++s===t)return n;return-1}function eo(e,{word:t,graphemes:s,types:n,speakPhoneme:o,speakWord:r,extraActions:a=""}){const l=hn(t,s,n),i=Xs(s,l),c=l.includes("silent");let p=0;const h=s.map((u,f)=>{const y=ke[l[f]]??ke.consonant;return S`<button
      type="button"
      class="bl-tile${l[f]==="silent"?" bl-tile--silent":""}"
      data-idx="${f}"
      data-mark="${y.mark||""}"
      style="--tile-color:${y.color}"
      aria-label="${l[f]==="silent"?`${u} is silent`:`Hear the sound for ${u}, ${y.label}`}"
    >
      ${u}
    </button>`});e.innerHTML=S`
    <div class="blend-ladder" data-word="${t}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${h}</div>
      ${c?S`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${Yn(a)}
      </div>
      <details class="bl-help">
        <summary>🧑‍🏫 How to help</summary>
        <p>
          Point at each sound and let your child say it first, then tap to check. Blend as you go —
          <em>m… ma… map</em>. If they are tired or stuck, just tell them the word and keep the
          story moving.
        </p>
      </details>
    </div>
  `;const d=u=>e.querySelector(u),m=d(".bl-steps"),b=d(".bl-next"),I=d(".bl-again"),T=d(".bl-say"),g=[...e.querySelectorAll(".bl-tile")];function w(){m.innerHTML=S`${i.slice(0,p).map((f,y)=>S`<li class="${y===p-1?"is-new":""}">${f}</li>`)}`,g.forEach(f=>{const y=Number(f.dataset.idx),E=l.slice(0,y+1).filter(R=>R!=="silent").length-1,C=l[y]==="silent"?p>=i.length:E>-1&&E<p;f.classList.toggle("is-lit",C),f.classList.toggle("is-current",l[y]!=="silent"&&E===p-1)});const u=p>=i.length;b.hidden=u,I.hidden=!u,T.textContent=u?"🔊 Hear the word":"🔊 Just hear the word",T.classList.toggle("bl-say--escape",!u),u&&i.length&&m.insertAdjacentHTML("beforeend",String(S`<li class="bl-done">
          Say the word. Tap 🔊 to check. Then read its sentence again — does it make sense?
        </li>`))}function k(){if(p>=i.length)return;const u=Zs(l,p);p+=1,w(),u>=0&&Promise.resolve(o(s[u],n[u],{word:t,index:u})).catch(()=>{})}return b.addEventListener("click",k),I.addEventListener("click",()=>{p=0,w(),b.focus({preventScroll:!0})}),T.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),g.forEach(u=>u.addEventListener("click",async()=>{const f=Number(u.dataset.idx);if(l[f]!=="silent"){u.classList.add("is-tapped"),setTimeout(()=>u.classList.remove("is-tapped"),300);try{await o(s[f],n[f],{word:t,index:f})}catch{}}})),w(),{destroy(){e.innerHTML=""}}}const to=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),no=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),so=3,oo=e=>/[aeiouy]/.test(e);function ht(e,t,s){const n=[];let o=0;for(;o<e.length;){let r=to.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[s+o+2]??"")&&(r=null),r?(n.push(r),o+=r.length):(n.push(e[o]),o+=1)}return n}function ro(e,t){const s=[],n=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){s.push("qu"),n.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}s.push(e[o]),n.push(t[o])}return{graphemes:s,types:n}}function ao(e){const t=[];for(const s of e){const n=t[t.length-1];n&&n.sound===null&&s.sound===null?n.len+=s.len:t.push({...s})}return t}const io=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function lo(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let s=t,n=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,s=t.slice(0,-1));for(const c of no){const p=c.slice(1),h=s.slice(0,-p.length);if(s.endsWith(p)&&h.length>=so&&oo(h)){n=c,s=h;break}}const r=mn(s);if(!r)return null;const a=[],l=[];let i=0;for(const{len:c,sound:p}of ao(r)){const h=s.slice(i,i+c);if(p)a.push(h),l.push(io[p]??"sv");else for(const d of ht(h,s,i))a.push(d),l.push("c");i+=c}if(i<s.length)for(const c of ht(s.slice(i),s,i))a.push(c),l.push("c");return o&&(a.push("s"),l.push("c")),n&&(a.push(n),l.push("sf")),a.length?ro(a,l):null}function co(e,t){const s=[],n=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){s.push(o),n.push(t[r]);return}const a=String(o).toLowerCase();for(const l of ht(a,a,0))s.push(l),n.push("c")}),{graphemes:s,types:n}}const uo=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),po=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function ho(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function fo(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function mo(e,t,s=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const n=t/60,o=Math.round(e/n);if(s==null||Number.isNaN(s))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(s)));return{wpm:o,wcpm:Math.round((e-r)/n),accuracy:Math.round((e-r)/e*100)}}function go({wpm:e,wcpm:t=null,primaryGrade:s=null,now:n=new Date}){var c,p;const o=fo(s),r=ho(n),a=o?(c=uo[o])==null?void 0:c[r]:null,l=o?(p=po[o])==null?void 0:p[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const i=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:i}:l!=null&&t>=l?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:i}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:i}}const bo="giri_friends_unlocked";function gn(){return He(bo)}const yo=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow","review-b-01":"Blue the Snail","play-b-01":"Mole","review-c-01":"Mei Ling","review-d-01":"The Kittens","core-b-18":"The White Kite","core-b-19":"Lime Pie","core-b-20":"Loose Tooth","core-b-21":"The Goose","howto-d-01":"Kaya Toast","journal-penang-1":"Grandpa","journal-penang-2":"The Trishaw","journal-penang-3":"The Monkey","tale-e-01":"The Kingfisher"});function wo(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function bn(e){if(!e||!e.id)return null;const t=yo[e.id]||wo(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function qt(){try{const e=localStorage.getItem(gn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function vo(e){try{localStorage.setItem(gn(),JSON.stringify(Array.from(e)))}catch{}}function ko(e){if(!e||typeof e!="string")return!1;const t=qt();return t.has(e)?!1:(t.add(e),vo(t),!0)}function $o(e){return qt().has(e)}function So(e){const t=qt();if(!Array.isArray(e))return[];const s=[];for(const n of e){const o=bn(n);o&&s.push({...o,unlocked:t.has(n.id)})}return s}function yn(e){const t=So(e);return{unlocked:t.filter(n=>n.unlocked).length,total:t.length,roster:t}}const wn="giri_fluency_history",zt=5,ue=new Map,Eo=10;function xo(e,t){for(ue.set(e,t);ue.size>Eo;){const s=ue.keys().next().value;ue.delete(s)}}let ye=null,j=null,at=[],we=null,Te=null,Ze="idle",z=null;async function vn({storyId:e,lineIdx:t,onStateChange:s}={}){if(Ze==="recording")return!1;Te=s??null,at=[];try{ye=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return Z("error"),!1}const n=To();try{j=new MediaRecorder(ye,n?{mimeType:n}:{})}catch{j=new MediaRecorder(ye)}return j.ondataavailable=o=>{o.data.size>0&&at.push(o.data)},j.onstop=()=>{const o=new Blob(at,{type:j.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;we=r,xo(r,o),mt(),Z("recorded")},j.onerror=()=>{mt(),Z("error")},j.start(),Z("recording"),!0}function Ke(){j&&j.state==="recording"?j.stop():mt()}function kn(e){const t=we,s=t?ue.get(t):null;return s?new Promise(n=>{et();const o=URL.createObjectURL(s);z=new Audio(o),Z("playing"),z.onended=()=>{URL.revokeObjectURL(o),z=null,Z("recorded"),n()},z.onerror=()=>{URL.revokeObjectURL(o),z=null,Z("recorded"),n()},z.play().catch(()=>{URL.revokeObjectURL(o),z=null,Z("recorded"),n()})}):Promise.resolve()}function et(){z&&(z.pause(),z=null)}function ft(e){const t=we;t&&ue.delete(t),t===we&&(we=null),et(),Z("idle")}function $n(){return Ze}function Sn(){Ke(),et(),ue.clear(),we=null,Ze="idle",Te=null}function qo(e){const t=En(),s=t[e.storyId]??[];s.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),s.length>zt&&s.splice(0,s.length-zt),t[e.storyId]=s,_o(t)}function Lo(e){return En()[e]??[]}function Z(e){Ze=e,Te==null||Te(e)}function mt(){ye&&(ye.getTracks().forEach(e=>e.stop()),ye=null)}function To(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function En(){try{return JSON.parse(localStorage.getItem(wn)??"{}")}catch{return{}}}let Dt=!1;function _o(e){try{localStorage.setItem(wn,JSON.stringify(e))}catch{if(Dt)return;Dt=!0;const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className="toast toast--warning",s.setAttribute("role","alert"),s.textContent="Device storage full — reading history may not be saved.",t.appendChild(s),setTimeout(()=>s.remove(),8e3)}}const xn="/phonicsquest/";let v=null,J="A",Yt=!1,fe="band",We=!1,qn=0,ae=0,W=null,D=null,ve=null,ge=null,be=null,N=null,U="word",Re=!1,$e=-1,Fe=[],_e=0,tt=[],nt=0,Ce=0;const Io="giri_stories_read";function Ln(){return He(Io)}function ee(){try{return JSON.parse(localStorage.getItem(Ln())??"[]")}catch{return[]}}function Lt(e){const t=ee();t.includes(e)||(t.push(e),localStorage.setItem(Ln(),JSON.stringify(t))),St(e),ko(e)}let je=null,Ie=null,Ve=!1,ze=0;const Tn="giri_show_graphemes",_n="giri_show_ruler",In="giri_ruler_mode",Tt="giri_follow_mode",Ao="giri_meet_words";function An(){return He(Ao)}const Ro="giri_comp_log";function Ut(){return He(Ro)}let me=st(Tn,!0),ce=st(_n,!1),_=null,oe=null,gt=st(In,"line"),de=null,Be=0,Y=null;U=st(Tt,"word");function st(e,t){try{const s=localStorage.getItem(e);return s===null?t:JSON.parse(s)}catch{return t}}function Ae(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const Rn=new Set;function Cn(){return new Date().toISOString().slice(0,10)}function Bn(){try{const e=localStorage.getItem(An());return e?JSON.parse(e):{}}catch{return{}}}function Co(e){try{localStorage.setItem(An(),JSON.stringify(e))}catch{}}function Bo(e){return Rn.has(e)?!0:Bn()[e]===Cn()}function Kt(e){Rn.add(e);const t=Bn();t[e]=Cn();const s=Date.now()-30*24*60*60*1e3;for(const[n,o]of Object.entries(t))(!o||Date.parse(o)<s)&&delete t[n];Co(t)}const Vt=new Set,Mo=100;function it(e){try{const t=localStorage.getItem(Ut()),s=t?JSON.parse(t):[];for(s.push({ts:Date.now(),...e});s.length>Mo;)s.shift();localStorage.setItem(Ut(),JSON.stringify(s))}catch{}}function Sr(e,t){v=e}function Er(){H(),Se()}function xr(){H(),te({restoreFocus:!1}),wt(),Sn(),It()}function Se(){var s,n,o;Me(),te({restoreFocus:!1}),Nn(),N=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${fe==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${fe==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${fe==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${pr()}</button>
    </div>
  `;let t;if(fe==="band"){if(!Yt){Yt=!0;try{const m={};for(const b of X)(m[s=b.band]??(m[s]=[])).push(b);J=_s(ee(),m)||J}catch{}}const r=Q.find(m=>m.band===J)??Q[0],a=X.filter(m=>m.band===J&&m.category!=="chapter"&&m.category!=="nonfiction-sg"),l=ee(),i=a.filter(m=>l.includes(m.id)).length,c=an(),p=Q.map(m=>{var b,I,T;return`
      <button
        class="story-tab${m.band===J?" active":""}${(b=c[m.band])!=null&&b.ready?"":" story-tab--not-ready"}"
        data-band="${m.band}"
        style="--tab-color:${m.color}"
        ${(I=c[m.band])!=null&&I.ready?"":`title="${c[m.band].hint}"`}
      >
        <span class="story-tab-num">${m.band}</span>
        <span class="story-tab-name">${m.label}</span>
        ${(T=c[m.band])!=null&&T.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),h=a.map(m=>lt(m,r,!1,l.includes(m.id))).join(""),d=a.length?Math.round(i/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${p}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${J}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${i} of ${a.length} stories read">
          ${i}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${d}%"></span>
        </span>
      </div>
      ${(n=c[J])!=null&&n.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[J].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${h}</div>
    `}else if(fe==="singapore"){const r=X.filter(i=>i.category==="nonfiction-sg"),a=ee();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(i=>{const c=Q.find(p=>p.band===i.band)??Q[0];return lt(i,c,!1,a.includes(i.id))}).join("")}</div>
    `}else{const r=X.filter(i=>i.category==="chapter").sort((i,c)=>(i.chapterNum??0)-(c.chapterNum??0)),a=ee();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(i=>{const c=Q.find(p=>p.band===i.band)??Q[0];return lt(i,c,!0,a.includes(i.id))}).join("")}</div>
    `}v.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,v.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{fe=r.dataset.cat,Se()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{hr()}),v.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{J=r.dataset.band,Se()})}),v.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>_t(r.dataset.storyId))})}function lt(e,t,s=!1,n=!1){var l;const o=(l=e.comprehension)!=null&&l.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=s?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=n?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${s?" story-card--chapter":""}${n?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${xn}images/stories/${e.illustration}"
          alt="${e.title}"
          class="story-card-mascot"
          draggable="false"
          loading="lazy"
        />
        ${r}
        ${a}
      </div>
      <span class="story-card-title">${e.title}</span>
      <div class="story-card-meta">
        <span class="story-card-level" style="color:${t.color}">Band ${e.band??"A"}</span>
        ${o}
        ${Xt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const i=Et(e).length;return i?`<span class="story-card-support" data-support="independent">👀 ${i} new ${i===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function _t(e){const t=X.find(s=>s.id===e);t&&(H(),de=ee().includes(t.id)?null:Ls(t.id),Ne.clear(),No(t))}function No(e){var s;N=e;const t=Q.find(n=>n.band===e.band)??Q[(e.level??1)-1];v.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${xn}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Xt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(s=document.getElementById("btn-reader-back"))==null||s.addEventListener("click",()=>{H(),Se()}),Ho(e)}function Ho(e){Bo(e.id)?he(e):Oo(e)}function Oo(e){var h;const t=document.getElementById("story-dynamic");if(!t)return;Me();const s=Et(e),n=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),o=(e.vocab??[]).filter(d=>n.includes(d.word.toLowerCase().split(/\s+/)[0]));if(!s.length&&!o.length){Kt(e.id),he(e);return}const r=Math.min(3,s.length+o.length),a=new Set;t.innerHTML=S`
    <section class="warm-up" aria-labelledby="warm-up-title">
      <h3 id="warm-up-title">🤝 Meet the words</h3>
      <p class="warm-up-lead">
        ${s.length?S`These are the words in <strong>${e.title}</strong> you cannot sound out — so
              here they are first. Tap any ${r} to warm up.`:S`A few words worth knowing before you read
              <strong>${e.title}</strong>. Tap any ${r} to warm up.`}
      </p>

      ${s.length?S`<div class="warm-up-section">
            <div class="warm-up-section-title">👀 Words to know first — tap to hear</div>
            <div class="warm-up-words">
              ${s.map(({word:d,display:m,status:b})=>S`<button
                  type="button"
                  class="story-prep-word"
                  data-tap-id="prep:${d}"
                  data-prep-word="${d}"
                  data-status="${b}"
                  aria-label="Hear the word ${m}"
                >
                  ${m}
                </button>`)}
            </div>
          </div>`:""}

      ${o.length?S`<div class="warm-up-section">
            <div class="warm-up-section-title">📚 Key words — tap to hear what they mean</div>
            <div class="vocab-chip-list">
              ${o.map(d=>S`<button
                  class="vocab-chip"
                  type="button"
                  data-tap-id="vocab:${d.word}"
                  data-word="${d.word}"
                  aria-label="Key word: ${d.word}. ${d.meaning}"
                >
                  <span class="vocab-chip-icon">${d.icon}</span>
                  <span class="vocab-chip-word">${d.word}</span>
                  <span class="vocab-chip-meaning">${d.meaning}</span>
                </button>`)}
            </div>
          </div>`:""}

      <div class="warm-up-row">
        <span class="warm-up-progress" id="warm-up-progress" aria-live="polite"
          >0 of ${r} tapped</span
        >
        <button class="btn btn--ghost" id="warm-up-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="warm-up-go" type="button" disabled>
          Start reading →
        </button>
      </div>
    </section>
  `;const l=document.getElementById("warm-up-progress"),i=document.getElementById("warm-up-go");function c(d){const m=d.dataset.tapId;a.has(m)||(a.add(m),d.setAttribute("data-tapped","true"),l&&(l.textContent=a.size>=r?"✓ Warmed up — start the story, or keep tapping":`${a.size} of ${r} tapped`),a.size>=r&&i&&(i.disabled=!1,i.focus({preventScroll:!0})))}t.querySelectorAll("[data-prep-word]").forEach(d=>{d.addEventListener("click",()=>{var m,b;(b=(m=K.speakSightWord(d.dataset.prepWord))==null?void 0:m.catch)==null||b.call(m,()=>{}),d.classList.add("story-prep-word--said"),setTimeout(()=>d.classList.remove("story-prep-word--said"),600),c(d)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",async()=>{var b,I;Zo(d),d.classList.add("vocab-chip--expanded"),c(d);const m=(I=(b=d.querySelector(".vocab-chip-meaning"))==null?void 0:b.textContent)==null?void 0:I.trim();try{await K.speakWord(d.dataset.word),m&&await K.speakText(m)}catch{}})});const p=()=>{Kt(e.id),he(e)};(h=document.getElementById("warm-up-skip"))==null||h.addEventListener("click",p),i==null||i.addEventListener("click",p)}function De(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,s)=>t+s.text.trim().split(/\s+/).length,0)}function he(e){var c,p,h,d,m,b,I,T,g,w,k;const t=document.getElementById("story-dynamic");if(!t)return;Me(),te({restoreFocus:!1});const s=e.lines.map((u,f)=>Jo(u,f,!0,e)).join(""),n=!!((c=e.comprehension)!=null&&c.length),r=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(u=>`<li>${u}</li>`).join("")}
      </ul>
    </div>
  `:"",a=Lo(e.id),l=a.length?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${a.slice().reverse().map(u=>{const f=new Date(u.date),y=`${f.getDate()}/${f.getMonth()+1}`,E=typeof u.wcpm=="number"&&u.errors!=null,C=E?u.wcpm:u.wpm??u.wcpm,R=E?"correct/min":"words/min",F=u.support==="supported"?" · with help":"";return`<span class="fluency-history-item">${y}: <strong>${C}</strong> ${R}${F}</span>`}).join("")}
      </div>
    </div>
  `:"";t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading toolbar. Three tools, each with a clear payoff:
           Sound colours (teach the vowel sound), Follow along (track the
           voice), Tap a word (hear it + see its sounds). -->
      <div class="story-reader-toolbar" role="group" aria-label="Reading controls">
        <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${me}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${ce}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${U==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${U==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${me?Ko():""}

      ${(()=>{const u=Et(e);return u.length?String(S`
          <details class="story-prep-strip">
            <summary>
              👀 ${u.length} ${u.length===1?"word":"words"} to know — tap to hear
            </summary>
            <div class="story-prep-words">
              ${u.map(({word:f,display:y,status:E})=>S`<button
                  type="button"
                  class="story-prep-word"
                  data-prep-word="${f}"
                  data-status="${E}"
                  aria-label="Hear the word ${y}"
                >
                  ${y}
                </button>`)}
            </div>
          </details>
        `):""})()}

      ${de!==null?`
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`:""}

      ${Vo(e)}
      <div class="story-body story-body--follow-${U}" id="story-body" aria-live="polite">${s}</div>

      <!-- The ruler's own controls. They live under the text, not in the
           tools sidebar, because they are used continuously while reading
           and a child should not have to look away from the line to press
           Next. Filled in by _startRuler when the ruler is switched on. -->
      <div class="ruler-nav-slot" id="ruler-nav-slot"></div>

      <!-- A child reading quietly to themselves needs a way to say they have
           finished. The read-aloud running out and the ruler reaching the
           last line both end the story, but neither happens when someone
           simply reads it — which is the point of the whole thing. -->
      <div class="story-finish">
        <button class="btn btn--primary btn--xl" type="button" id="btn-finish-story">
          ✓ I have read the story
        </button>
        <p class="story-finish-note">Tap this when you get to the end.</p>
      </div>
      ${r}
    </div>

    <!-- Controls sidebar column -->
    <div class="story-controls-wrap">
      <div class="story-tts-bar">
        <button class="btn btn--primary btn--xl" id="btn-story-play" aria-label="Listen — play this story">
          ▶ Listen
        </button>
        <button class="btn btn--ghost btn--xl" id="btn-story-stop" style="display:none" aria-label="Stop listening">
          ⏹ Stop
        </button>
      </div>

      <!-- Story Quest CTA (shown after TTS or fluency) — the payoff, kept
           right by the primary Listen button instead of buried under tools. -->
      ${n?`
        <div class="story-quest-cta" id="story-quest-cta" hidden>
          <div class="sq-cta-inner">
            <span class="sq-cta-icon">🌟</span>
            <div>
              <strong>Story Quest ready!</strong>
              <p>Check your understanding with questions, vocab, and grammar.</p>
            </div>
            <button class="btn btn--primary" id="btn-launch-quest">Start Quest →</button>
          </div>
        </div>
      `:""}

      <!-- Extra practice tools fold into one optional grown-up drawer, so the
           reader isn't a wall of competing accordions. Listening to the story
           and sounding words out (Decode mode) are the child-facing basics;
           these four are for a grown-up choosing to practise reading aloud. -->
      <details class="story-tool-section story-practice-drawer" id="practice-drawer">
        <summary class="story-tool-summary practice-summary">
          <span class="practice-label">🧑‍🏫 More ways to practise</span>
          <span class="practice-hint">Optional · for grown-ups</span>
        </summary>
        <div class="story-tool-body practice-drawer-body">
          <!-- Reading pace. A grown-up tool, and never shown to the child as
               a score: reading speed is a screening measure for a teacher,
               and put in front of a six-year-old it teaches that reading
               fast is the goal — the habit most likely to wreck
               comprehension. It asks for the error count, because without
               one the number is words per minute, which cannot be compared
               to a words-CORRECT-per-minute benchmark. -->
          <details class="story-tool-section fluency-bar" id="fluency-bar">
            <summary class="story-tool-summary fluency-summary">
              <span class="fluency-label">⏱ Reading pace</span>
              <span class="fluency-hint">For grown-ups · not shown as a score</span>
            </summary>
            <div class="story-tool-body">
              <p class="fluency-intro">
                Time one read-aloud of the whole story (${De(e)} words).
                The app can't hear mistakes, so count them yourself to get
                <strong>words correct per minute</strong> — the measure the benchmarks use.
              </p>
              <div class="fluency-controls">
                <button class="btn btn--ghost" id="btn-fluency-start">▶ Start timing</button>
                <span class="fluency-clock" id="fluency-clock" aria-live="polite">0:00</span>
                <button class="btn btn--primary" id="btn-fluency-done" disabled>✓ Stop</button>
              </div>
              <form class="fluency-form" id="fluency-form" hidden>
                <p class="fluency-time" id="fluency-time"></p>
                <label class="fluency-field">
                  Words read wrongly <small>(skipped, guessed, or given to them)</small>
                  <input type="number" name="errors" min="0" max="${De(e)}" inputmode="numeric" />
                </label>
                <fieldset class="fluency-field">
                  <legend>How did they read it?</legend>
                  <label><input type="radio" name="support" value="independent" checked /> On their own</label>
                  <label><input type="radio" name="support" value="supported" /> With some help</label>
                </fieldset>
                <div class="fluency-controls">
                  <button class="btn btn--primary btn--sm" type="submit">Save</button>
                  <button class="btn btn--ghost btn--sm" type="button" id="btn-fluency-discard">Don't save</button>
                </div>
              </form>
              <div class="fluency-result" id="fluency-result" hidden aria-live="polite"></div>
              ${l}
            </div>
          </details>

          <!-- Recording controls (collapsible) -->
          <details class="story-tool-section recording-bar" id="recording-bar">
            <summary class="story-tool-summary recording-summary">
              <span class="recording-label">🎙 Record Reading</span>
              <span class="recording-hint">Record yourself reading aloud</span>
            </summary>
            <div class="story-tool-body">
              <div class="recording-controls" id="recording-controls">
                <button class="btn btn--ghost" id="btn-rec-start">🎙 Start Recording</button>
                <button class="btn btn--ghost btn--danger" id="btn-rec-stop" hidden>⏹ Stop</button>
                <button class="btn btn--ghost" id="btn-rec-play" hidden>▶ Play Back</button>
                <button class="btn btn--ghost btn--sm" id="btn-rec-delete" hidden>🗑 Delete</button>
              </div>
              <div class="recording-status" id="recording-status"></div>
            </div>
          </details>

          <!-- Read to Giri section (collapsible) — Giri listens while you read -->
          <details class="story-tool-section rtg-bar" id="rtg-bar">
            <summary class="story-tool-summary rtg-summary">
              <span class="rtg-label">${Un("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${bs()?`
                <div class="rtg-controls" id="rtg-controls">
                  <button class="btn btn--ghost" id="btn-rtg-start">Start</button>
                  <button class="btn btn--primary" id="btn-rtg-listen" hidden>🎙 Read this line</button>
                  <button class="btn btn--ghost" id="btn-rtg-next" hidden>Next line →</button>
                  <button class="btn btn--ghost btn--sm" id="btn-rtg-exit" hidden>✕ Exit</button>
                </div>
                <div class="rtg-status" id="rtg-status" aria-live="polite"></div>
              `:`
                <p class="rtg-status">Giri can't listen in this browser — use 🎙 Record Reading instead and play it back together.</p>
              `}
            </div>
          </details>

          <!-- Echo Read section (collapsible) -->
          <details class="story-tool-section echo-read-bar" id="echo-read-bar">
            <summary class="story-tool-summary echo-read-summary">
              <span class="echo-read-label">🔁 Echo Read</span>
              <span class="echo-read-hint">Listen, then repeat each line</span>
            </summary>
            <div class="story-tool-body">
              <div class="echo-read-controls">
                <button class="btn btn--ghost" id="btn-echo-start">Start Echo Read</button>
                <button class="btn btn--ghost" id="btn-echo-next" hidden>Next Line →</button>
                <button class="btn btn--ghost" id="btn-echo-rec" hidden>🎙 Your Turn</button>
                <button class="btn btn--ghost" id="btn-echo-play" hidden>▶ Hear Yourself</button>
                <button class="btn btn--ghost btn--sm" id="btn-echo-stop" hidden>✕ Exit Echo Read</button>
              </div>
              <div class="echo-read-status" id="echo-read-status"></div>
            </div>
          </details>
        </div>
      </details>
    </div>
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(u=>{u.addEventListener("click",()=>{U=u.dataset.follow,Ae(Tt,U),he(e)})}),t.querySelectorAll(".wf-word").forEach(u=>{u.setAttribute("role","button"),u.setAttribute("tabindex","0");const f=y=>{const E=At(u);E&&(y.preventDefault(),_==null||_.tap(y.clientY??0,u),nr(E,u))};u.addEventListener("click",f),u.addEventListener("keydown",y=>{(y.key==="Enter"||y.key===" ")&&f(y)})}),(h=document.getElementById("btn-toggle-graphemes"))==null||h.addEventListener("click",()=>{me=!me,Ae(Tn,me),he(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var u,f;ce=!ce,Ae(_n,ce),(u=document.getElementById("btn-toggle-ruler"))==null||u.setAttribute("aria-pressed",String(ce)),Me(),ce&&(yt(),(f=document.getElementById("btn-ruler-next"))==null||f.focus({preventScroll:!0}))}),ce?requestAnimationFrame(()=>yt(de)):de!==null&&requestAnimationFrame(()=>bt(de)),Fo(e),(m=document.getElementById("btn-resume-restart"))==null||m.addEventListener("click",u=>{var f;St(e.id),de=null,(f=u.currentTarget.closest(".story-resume"))==null||f.remove(),bt(0),_&&_.goTo(0)}),Po(),(b=document.getElementById("btn-story-play"))==null||b.addEventListener("click",()=>Rt(e)),(I=document.getElementById("btn-story-stop"))==null||I.addEventListener("click",()=>H()),t.querySelectorAll(".story-prep-strip [data-prep-word]").forEach(u=>{u.addEventListener("click",()=>{var f,y;(y=(f=K.speakSightWord(u.dataset.prepWord))==null?void 0:f.catch)==null||y.call(f,()=>{}),u.classList.add("story-prep-word--said"),setTimeout(()=>u.classList.remove("story-prep-word--said"),600)})}),(T=document.getElementById("btn-finish-story"))==null||T.addEventListener("click",u=>{var E;Ct(e);const f=u.currentTarget;f.disabled=!0,f.textContent="✓ Read — well done!";const y=document.querySelector(".story-finish-note");y&&(y.textContent=(E=e.comprehension)!=null&&E.length?"Now have a go at the questions.":"")});const i=De(e);(g=document.getElementById("btn-fluency-start"))==null||g.addEventListener("click",()=>gr()),(w=document.getElementById("btn-fluency-done"))==null||w.addEventListener("click",()=>wt(i)),br(i,e),fr(e),It(),zo(e),mr(e),(k=document.getElementById("btn-launch-quest"))==null||k.addEventListener("click",()=>{H(),wt(),Sn(),Lt(e.id),ls(v,e,()=>{Se()})})}let ct="";function Wo(e){Mn();const t=v==null?void 0:v.querySelector(`#story-body [data-line="${e.line}"]`);if(!t)return;const s=[...t.querySelectorAll(".wf-word")].filter(n=>{const o=Number(n.dataset.wordIdx);return o>=e.from&&o<=e.to});s.length&&(s.forEach(n=>n.classList.add("is-clue")),_?_.follow(s[0]):s[0].scrollIntoView({behavior:ne(),block:"center"}))}function Mn(){v==null||v.querySelectorAll(".wf-word.is-clue").forEach(e=>e.classList.remove("is-clue"))}function bt(e){const t=v==null?void 0:v.querySelectorAll("#story-body .wf-word"),s=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];s&&(s.scrollIntoView({behavior:ne(),block:"center"}),s.classList.add("wf-word--resumed"),setTimeout(()=>s.classList.remove("wf-word--resumed"),2600))}function Fo(e){Nn();const t=document.getElementById("story-body");if(!t)return;const s=Oe(t);s&&(Y=s,Y._pqPlaceHandler=()=>{clearTimeout(Be),Be=setTimeout(()=>{if(_||ee().includes(e.id))return;const n=t.getBoundingClientRect(),o=Hn();if(n.bottom<o.top||n.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(l=>l.getBoundingClientRect().top>=o.top);a>=0&&rn(e.id,a)},500)},s.addEventListener("scroll",Y._pqPlaceHandler,{passive:!0}))}function Po(){const e=document.getElementById("story-resume");if(!e)return;const t=Oe(e);let s=0;const n=()=>{clearTimeout(s),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&n()};t==null||t.addEventListener("scroll",r,{passive:!0}),s=setTimeout(n,9e3)}function Nn(){clearTimeout(Be),Y!=null&&Y._pqPlaceHandler&&(Y.removeEventListener("scroll",Y._pqPlaceHandler),delete Y._pqPlaceHandler),Y=null}function Hn(){const e=document.getElementById("story-body"),t=e?Oe(e):null,s=t==null?void 0:t.getBoundingClientRect(),n=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((s==null?void 0:s.top)??0,(n==null?void 0:n.getBoundingClientRect().bottom)??0)+12,a=Math.min((s==null?void 0:s.bottom)??window.innerHeight,window.innerHeight),l=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(l,r+120)}}function Je(){return qe.find(e=>e.id===gt)??qe[1]}function Go(){const e=Je();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${Ye(e.label)}. Tap to change."
              title="${Ye(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${ut(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function yt(e=null){const t=document.getElementById("story-body"),s=document.getElementById("ruler-nav-slot");if(!t||!s)return;s.innerHTML=Go();const n=Je(),o=s.querySelector(".ruler-pos small"),r=s.querySelector(".ruler-pos b"),a=s.querySelector("#btn-ruler-next"),l=s.querySelector("#btn-ruler-back");_=$s(t,{mode:n.id,word:e,wordSelector:".wf-word",safeArea:Hn,onMove(i){oe=i;const c=n.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${i.word+1} / ${i.words}`:`${i.line+1} / ${i.lines}`,l.disabled=c?i.word===0:i.line===0,a.textContent=i.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",i.atEnd),clearTimeout(Be),Be=setTimeout(()=>{ee().includes((N==null?void 0:N.id)??"")||rn(N==null?void 0:N.id,i.word)},400)}}),l.addEventListener("click",()=>_==null?void 0:_.prev()),a.addEventListener("click",()=>{if(!(oe!=null&&oe.atEnd))return _==null?void 0:_.next();Ct(N)}),s.querySelector("#btn-ruler-style").addEventListener("click",()=>{var p;const i=(oe==null?void 0:oe.word)??0,c=qe.indexOf(Je());gt=qe[(c+1)%qe.length].id,Ae(In,gt),Me(),yt(i),(p=document.getElementById("btn-ruler-style"))==null||p.focus({preventScroll:!0})})}function Me(){_==null||_.destroy(),_=null,oe=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function jo(e){var n,o,r,a;if(!_||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(n=e.target)==null?void 0:n.closest)!=null&&o.call(n,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]")||(a=(r=e.target)==null?void 0:r.closest)!=null&&a.call(r,".word-panel"))return;const t=Je().id==="word",s={ArrowDown:()=>_.nextLine(),ArrowUp:()=>_.prevLine(),ArrowRight:()=>t?_.next():_.nextLine(),ArrowLeft:()=>t?_.prev():_.prevLine()}[e.key];s&&(e.preventDefault(),s())}document.addEventListener("keydown",jo);function zo(e){var t,s,n,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>Do(e)),(s=document.getElementById("btn-rtg-listen"))==null||s.addEventListener("click",()=>Yo(e)),(n=document.getElementById("btn-rtg-next"))==null||n.addEventListener("click",()=>Fn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{It(),he(e)})}function re(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function On(){const e=Fe[$e];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function Do(e){var s,n,o;if(U!=="word"){U="word",Ae(Tt,U),he(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}H();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(Re=!0,Fe=t,$e=0,_e=0,tt=[],nt=0,Ce=0,(s=document.getElementById("btn-rtg-start"))==null||s.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Wn(),re("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Wn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=On();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:ne()}))}async function Yo(e){var p;const t=On(),s=document.getElementById("btn-rtg-listen");if(!t||!s||s.disabled)return;const n=Array.from(t.querySelectorAll(".wf-word")),o=n.map(At).filter(Boolean).join(" ");if(!o){Fn(e);return}s.disabled=!0,s.replaceChildren(Jn("encourage"),document.createTextNode("Giri is listening…")),re("Go ahead — read the glowing line now.");const r=await ys(o);if(s.disabled=!1,s.textContent="🎙 Read this line",!Re)return;if(!r){_e++,_e>=2?re("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):re("Giri couldn't hear that — move a little closer to the microphone and try again!");return}_e=0;const a=[];r.words.forEach((h,d)=>{const m=n[d];if(m)if(m.classList.remove("rtg-word--match","rtg-word--check"),h.status==="miss"){m.classList.add("rtg-word--check");const b=h.word.replace(/[^a-z]/g,"");b.length>2&&(a.push(b),nn(b))}else m.classList.add("rtg-word--match")});const l=r.words.filter(h=>h.status!=="miss").length;nt+=l,Ce+=r.words.length,tt.push(...a);const i=$e>=Fe.length-1;a.length>0?re(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${i?"finish up":"go on"}!`):re("⭐ Great — Giri heard every word!"),(p=document.getElementById("btn-rtg-listen"))==null||p.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=i?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Fn(e){var t,s;if($e>=Fe.length-1){Uo(e);return}$e++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),Wn(),re("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Uo(e){var l,i;const t=Ce>0?Math.round(nt/Ce*100):0,s=[...new Set(tt)],n={...pe.get("readAloudStats")||{}},o=n[e.id]||{attempts:0};n[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:s.slice(0,12),updatedAt:new Date().toISOString()},pe.set("readAloudStats",n),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(l=document.getElementById("btn-rtg-next"))==null||l.setAttribute("hidden",""),(i=document.getElementById("btn-rtg-exit"))==null||i.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=s.length?` Words to practise: <strong>${s.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";re(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),Lt(e.id),Re=!1}function It(){Re&&ws(),Re=!1,$e=-1,Fe=[],_e=0,tt=[],nt=0,Ce=0}function Pn(e){return!me||!e?e:Qs(e)}function Ko(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${Rs.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Vo(e){var t;return(t=e==null?void 0:e.roles)!=null&&t.length?S`<p class="story-cast" role="note">
    🎭 <strong>A play to read together.</strong> The parts:
    ${e.roles.map((s,n)=>S`<span class="story-cast-part" data-part="${n}">${s}</span>${n<e.roles.length-1?", ":"."}`)}
    Pick a part each and read your lines with feeling. Then swap parts and read it again!
  </p>`:""}function Jo(e,t,s=!1,n=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${ut(o)}</div>`;const r=n?Pn(o,n.targetGraphemes,n.band):o,a=s?Qo(o,n):r;if(e.type==="script"){const l=Math.max(0,((n==null?void 0:n.roles)??[]).indexOf(e.role));return`<p class="sline sline--script" data-line="${t}" data-part="${l}"><span class="sline-role">${ut(e.role??"")}:</span> ${a}</p>`}switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"refrain":return`<p class="sline sline--refrain"     data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function Qo(e,t=null){if(!e)return"";const s=Zt(e);let n=0;return s.map(o=>{if(o.type==="word"){const r=t?Pn(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${n++}" data-plain="${Ye(o.text)}" aria-label="${Ye(o.text)}">${r}</span>`}return o.text}).join("")}function At(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Xo(e,t,s=!0){var a;const n=s&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:lo(t.word);if(!n)return!1;const{graphemes:o,types:r}=co(n.graphemes,n.types);return eo(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(l,i,c)=>K.speakPhoneme(l,i,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:l=>K.speakWord(l)}),!0}function Zo(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function er(e){const t=[],s=e.lines;let n=0;for(;n<s.length;){const o=s[n];if(o.type==="label"){const r=s[n+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:n+1}),n+=2;continue}n++;continue}t.push({text:o.text,highlightIdx:n}),n++}return t}function Rt(e,t=0){if(!window.speechSynthesis)return;H(),te({restoreFocus:!1}),N=e,Bt(!0),We=!0;const s=er(e),n=s.findIndex(o=>o.highlightIdx>=t);Gn(s,Math.max(0,n))}function Gn(e,t,s=ae){if(s!==ae||!We)return;if(t>=e.length){ir();return}const n=e[t];qn=n.highlightIdx,ar(n.highlightIdx);const o=new SpeechSynthesisUtterance(n.text);o.rate=.82,jn(o);const r=n.text.startsWith("Puff")?600:380;U==="word"&&tr(o,n.highlightIdx),o.onend=()=>{s===ae&&(ot(),setTimeout(()=>Gn(e,t+1,s),r))},o.onerror=()=>{s===ae&&H()},window.speechSynthesis.speak(o)}function tr(e,t){const s=v==null?void 0:v.querySelector(`[data-line="${t}"]`);if(!s)return;const n=s.querySelectorAll(".wf-word");if(n.length===0)return;const o=ae,r=e.text||"";let a=!1,l=-1,i=[],c=!1;function p(b){if(o!==ae||b<0||b>=n.length||b===l)return;l=b,n.forEach(T=>T.classList.remove("wf-word--active"));const I=n[b];I.classList.add("wf-word--active"),_?_.follow(I):rr(I)}function h(){for(const b of i)clearTimeout(b);i=[]}function d(){var g;if(c)return;c=!0;const b=typeof e.rate=="number"&&e.rate>0?e.rate:.82,I=Array.from(n,At);let T=0;for(let w=0;w<n.length;w++){const k=w,u=((g=I[w])==null?void 0:g.length)||3,f=Math.max(160,Math.round((90+u*60)/b)),y=setTimeout(()=>{a||p(k)},T);i.push(y),T+=f}}e.addEventListener("boundary",b=>{b.name&&b.name!=="word"||(a=!0,h(),p(cs(r,b.charIndex??-1)))}),e.addEventListener("end",()=>{h()}),e.addEventListener("start",()=>{if(a)return;const b=setTimeout(()=>{a||(p(0),d())},180);i.push(b)});const m=setTimeout(()=>{a||c||(p(0),d())},800);i.push(m)}function nr(e,t){var m,b,I;Ne.add(e.toLowerCase().replace(/[^a-z']/g,""));const s=We,n=qn;H(),te({restoreFocus:!1});const o=ps(e),r=sr();r.setAttribute("aria-label",`Sound out the word ${o.text}`),r.innerHTML=or(o,{resume:s}),r.hidden=!1,document.body.classList.add("word-panel-open"),D=t!=null&&t.isConnected?t:null,D==null||D.classList.add("wf-word--looking"),ve=D?D.closest(".stories-content")??Oe(D):null;const a=r.querySelector('[data-role="ladder"]');if(!(a&&Xo(a,{word:o.text,graphemes:o.graphemes,types:o.types},o.foundInBank))){const T=r.querySelector(".wd-fallback");T&&(T.hidden=!1);try{K.speakWord(o.text)}catch{}}(m=r.querySelector('[data-action="hear"]'))==null||m.addEventListener("click",()=>{try{K.speakWord(o.text)}catch{}});const i=r.querySelector('[data-action="add-review"]');i==null||i.addEventListener("click",()=>{if(!o.word)return;nn(o.word.id)&&(i.disabled=!0,i.textContent="✓ In your Review Lane")}),(b=r.querySelector('[data-action="close"]'))==null||b.addEventListener("click",()=>te()),(I=r.querySelector('[data-action="back"]'))==null||I.addEventListener("click",()=>{te(),s&&N&&Rt(N,n)});const c=r.querySelector(".bl-next:not([hidden])")??r.querySelector('[data-action="hear"]')??r.querySelector('[data-action="close"]');c==null||c.focus({preventScroll:!0}),dt(),be=new AbortController;const{signal:p}=be,h=()=>{p.aborted||dt()};(ve??window).addEventListener("scrollend",h,{once:!0,signal:p}),window.addEventListener("scrollend",h,{once:!0,signal:p});const d=setTimeout(h,700);p.addEventListener("abort",()=>clearTimeout(d)),typeof ResizeObserver=="function"&&(ge=new ResizeObserver(()=>dt()),ge.observe(r))}function sr(){if(W!=null&&W.isConnected)return W;const e=document.createElement("aside");return e.id="word-panel",e.className="word-panel",e.setAttribute("role","dialog"),e.hidden=!0,document.body.appendChild(e),W=e,e}function te({restoreFocus:e=!0}={}){var s,n;ge==null||ge.disconnect(),ge=null,be==null||be.abort(),be=null,ve&&(ve.style.paddingBottom=""),ve=null,document.body.classList.remove("word-panel-open"),document.querySelectorAll(".wf-word--looking").forEach(o=>o.classList.remove("wf-word--looking"));const t=D;if(D=null,!(!W||W.hidden)){try{(n=(s=K).cancelSpeech)==null||n.call(s)}catch{}W.hidden=!0,W.innerHTML="",e&&(t!=null&&t.isConnected)&&t.focus({preventScroll:!0})}}function dt(){const e=W,t=D;if(!e||e.hidden||!(t!=null&&t.isConnected))return;const s=parseFloat(getComputedStyle(e).bottom)||0,n=window.innerHeight-s-e.offsetHeight,o=ve,r=o==null?void 0:o.getBoundingClientRect();o&&r&&(o.style.paddingBottom=`${Math.max(0,Math.ceil(r.bottom-n)+24)}px`);const a=t.getBoundingClientRect(),l=(r==null?void 0:r.top)??0;let i=0;a.bottom>n-16?i=Math.min(a.bottom-n+32,Math.max(0,a.top-l-8)):a.top<l+8&&(i=a.top-(l+(n-l)*.4)),i&&(o??window).scrollBy({top:i,behavior:ne()})}document.addEventListener("keydown",e=>{e.key!=="Escape"||!W||W.hidden||document.querySelector(".modal-overlay:not([hidden])")||(e.preventDefault(),te())});function or(e,{resume:t=!1}={}){const s=l=>String(l??"").replace(/[<>&"]/g,i=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[i]),n=hn(e.text,e.graphemes,e.types),o=e.graphemes.map((l,i)=>{const c=ke[n[i]]??ke.consonant,p=c.mark?` data-mark="${s(c.mark)}"`:"";return`<span class="wd-tile vs--${n[i]}"${p} style="--tile-color:${c.color}" aria-label="${s(l)}, ${s(c.label)}">${s(l)}</span>`}).join(""),r=e.foundInBank?`<button class="btn btn--ghost btn--sm" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:"",a=t?"▶ Keep listening":"↩ Back to my story";return`
    <div class="wd-card">
      <button class="wp-close" type="button" data-action="close" aria-label="Close">✕</button>
      <p class="wd-word">${s(e.text)}</p>
      <div data-role="ladder"></div>
      <div class="wd-fallback" hidden>
        ${o?`<div class="wd-tiles" aria-label="Sound breakdown">${o}</div>`:""}
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
      </div>
      <div class="wd-actions">
        <button class="btn btn--ghost btn--sm wp-back" type="button" data-action="back">${a}</button>
        ${r}
      </div>
    </div>`}function ne(){return Vn()?"auto":"smooth"}function rr(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),s=window.innerHeight||document.documentElement.clientHeight;ds(t,s)&&e.scrollIntoView({block:"center",behavior:ne()})}catch{}}function ot(){v==null||v.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function ar(e){v==null||v.querySelectorAll(".sline--active").forEach(s=>s.classList.remove("sline--active")),ot();const t=v==null?void 0:v.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const s=t.querySelector(".wf-word");_&&s?_.follow(s):t.scrollIntoView({behavior:ne(),block:"nearest"})}}function jn(e){var s,n;let t;try{t=((n=(s=K).getTtsVoice)==null?void 0:n.call(s))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function H(){var e;ae++,We=!1,(e=window.speechSynthesis)==null||e.cancel(),v==null||v.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),ot(),Bt(!1)}function ir(){ae++,We=!1,v==null||v.querySelectorAll(".sline--active").forEach(e=>e.classList.remove("sline--active")),ot(),Bt(!1),Ct(N)}function Ct(e){if(!e)return;te({restoreFocus:!1}),Lt(e.id);const t=document.getElementById("story-quest-cta");t&&(t.hidden=!1),ur(e),dr(e)}const Ne=new Set;function lr(e){const t=X.filter(n=>n.band===e.band&&n.category===e.category&&n.id!==e.id),s=ee();return t.find(n=>!s.includes(n.id))??t[0]??null}function cr(e){var n,o;const t=[S`You read <strong>${e.title}</strong> — ${De(e)} words.`];if(Ne.size){const r=Ne.size;t.push(S`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(n=e.talkAboutIt)!=null&&n.length)&&t.push(S`You had a think about what happened.`);const s=$o(e.id)?(o=bn(e))==null?void 0:o.name:"";return s&&t.push(S`<strong>${s}</strong> has joined your 🐾 Friends.`),t}function dr(e){var o,r,a;if(!e)return;const t=v==null?void 0:v.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const s=lr(e),n=document.createElement("section");n.className="story-ending",n.setAttribute("aria-label","You finished the story"),n.innerHTML=S`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${cr(e).map(l=>S`<li>${l}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${s?S`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${s.id}"
          >
            ➡️ Next: ${s.title}
          </button>`:""}
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `,t.appendChild(n),n.scrollIntoView({behavior:ne(),block:"nearest"}),(o=n.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{Ne.clear(),St(e.id),de=null,n.remove(),bt(0),_&&_.goTo(0)}),(r=n.querySelector("#btn-ending-next"))==null||r.addEventListener("click",l=>{H(),_t(l.currentTarget.dataset.storyId)}),(a=n.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{H(),Se()})}function ur(e){var a,l,i;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Vt.has(e.id))return;const t=v==null?void 0:v.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Vt.add(e.id);const s=e.talkAboutIt[0];ct=s;const n=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
    <h4>💬 Quick check</h4>
    <div class="comp-q" id="comp-q">${s}</div>
    <div class="comp-choices">
      <button class="comp-choice" data-resp="confident" type="button">🙂 I can answer this</button>
      <button class="comp-choice" data-resp="reread" type="button">🤔 Let me re-read</button>
      <button class="comp-choice" data-resp="hint" type="button">💭 Show me where</button>
    </div>
    <div class="comp-feedback" id="comp-feedback" hidden></div>
    ${n?'<button class="comp-more" id="comp-more" type="button" hidden>💬 One more question</button>':""}
    <button class="comp-skip" id="comp-skip" type="button">Skip</button>
  `,t.appendChild(o),o.scrollIntoView({behavior:ne(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.resp;if(it({storyId:e.id,question:s,response:p}),o.querySelectorAll(".comp-choice").forEach(d=>d.disabled=!0),c.classList.add("correct"),p==="confident")r.textContent="👍 Great! You understood the story.";else if(p==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Rt(e),300);else{const d=en(e,ct||s);d?(r.textContent="💡 Have a look at the sentence we have lit up.",Wo(d)):r.textContent="💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer."}r.hidden=!1;const h=o.querySelector("#comp-more");h&&(h.hidden=!1)})}),(l=o.querySelector("#comp-more"))==null||l.addEventListener("click",()=>{var p;const c=o.querySelector("#comp-q");c&&(c.textContent=n),ct=n,Mn(),it({storyId:e.id,question:n,response:"followup"}),(p=o.querySelector("#comp-more"))==null||p.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(h=>{h.disabled=!1,h.classList.remove("correct")})}),(i=o.querySelector("#comp-skip"))==null||i.addEventListener("click",()=>{it({storyId:e.id,question:s,response:"skipped"}),o.remove()})}function pr(){try{const e=yn(X);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function hr(){var a,l;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=yn(X),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const s=i=>String(i??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),n=new Map;for(const i of e.roster)n.has(i.band)||n.set(i.band,[]),n.get(i.band).push(i);const o=Array.from(n.entries()).sort((i,c)=>String(i[0]).localeCompare(String(c[0]))).map(([i,c])=>{const p=c.filter(d=>d.unlocked).length,h=c.map(d=>`
        <button class="sf-tile ${d.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${s(d.storyId)}"
                ${d.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${d.unlocked?`${s(d.name)} from ${s(d.storyTitle)} — tap to re-read`:`Locked — read ${s(d.storyTitle)} to meet ${s(d.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${d.unlocked?s(d.emoji):"🔒"}</span>
          <span class="sf-tile__name">${d.unlocked?s(d.name):"???"}</span>
          ${d.unlocked?`<span class="sf-tile__story">from ${s(d.storyTitle)}</span>`:`<span class="sf-tile__story">${s(d.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${s(i)} <small>${p}/${c.length} met</small></h3>
          <div class="sf-grid">${h}</div>
        </div>`}).join(""),r=e.unlocked===0?"🐾 Read a Giri Story and the co-star moves in here. No friends yet — start with Band A!":`🐾 You've met <strong>${e.unlocked}</strong> of <strong>${e.total}</strong>. Tap a friend to re-read their story.`;t.innerHTML=`
    <div class="modal-panel">
      <div class="modal-header">
        <h2 class="modal-title">🐾 Giri's Friends</h2>
        <button class="modal-close" aria-label="Close Friends gallery" data-close="modal-story-friends">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="sf-intro">${r}</p>
        ${o}
      </div>
    </div>`,document.body.appendChild(t),Pe.open("modal-story-friends"),(l=t.querySelector("[data-close]"))==null||l.addEventListener("click",()=>{Pe.close("modal-story-friends"),t.remove()}),t.addEventListener("click",i=>{i.target===t&&(Pe.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(i=>{i.addEventListener("click",()=>{const c=i.dataset.storyId;c&&(Pe.close("modal-story-friends"),t.remove(),_t(c))})})}function Bt(e){const t=document.getElementById("btn-story-play"),s=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),s&&(s.style.display=e?"":"none");const n=v==null?void 0:v.querySelector(".story-reader");n&&n.classList.toggle("story-reader--listening",e)}function fr(e){const t=document.getElementById("btn-rec-start"),s=document.getElementById("btn-rec-stop"),n=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(l){if(t.hidden=l!=="idle",s.hidden=l!=="recording",n.hidden=l!=="recorded"&&l!=="playing",o.hidden=l!=="recorded"&&l!=="playing",r)switch(l){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}n&&(n.textContent=l==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await vn({storyId:e.id,onStateChange:a})||a("error")}),s.addEventListener("click",()=>{Ke()}),n.addEventListener("click",()=>{$n()==="playing"?(et(),a("recorded")):kn()}),o.addEventListener("click",()=>{ft(),a("idle")})}function mr(e){const t=document.getElementById("btn-echo-start"),s=document.getElementById("btn-echo-next"),n=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const l=e.lines.map((h,d)=>({...h,idx:d})).filter(h=>h.type!=="label"&&h.type!=="chapter"&&h.text);let i=-1;function c(){t.hidden=!1,s.hidden=!0,n.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),v==null||v.querySelectorAll(".sline--echo-active").forEach(h=>h.classList.remove("sline--echo-active")),i=-1}function p(h){var I,T;i=h;const d=l[h];if(!d){c();return}d.idx,v==null||v.querySelectorAll(".sline--echo-active").forEach(g=>g.classList.remove("sline--echo-active"));const m=v==null?void 0:v.querySelector(`[data-line="${d.idx}"]`);m&&(m.classList.add("sline--echo-active"),m.scrollIntoView({behavior:ne(),block:"nearest"})),a&&(a.textContent=`Line ${h+1} of ${l.length}`,a.className="echo-read-status echo-read-status--active"),s.hidden=!0,n.hidden=!0,o.hidden=!0;const b=new SpeechSynthesisUtterance(d.text);b.rate=.82,jn(b),b.onend=()=>{n.hidden=!1,n.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${h+1}`)},b.onerror=()=>{n.hidden=!1},(I=window.speechSynthesis)==null||I.cancel(),(T=window.speechSynthesis)==null||T.speak(b)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,p(0)}),n.addEventListener("click",async()=>{if($n()==="recording"){Ke();return}const h=l[i];!await vn({storyId:e.id,lineIdx:h==null?void 0:h.idx,onStateChange:m=>{m==="recording"?(n.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):m==="recorded"?(n.hidden=!0,o.hidden=!1,s.hidden=i>=l.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):m==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{kn()}),s.addEventListener("click",()=>{ft(),o.hidden=!0,i+1<l.length?p(i+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),s.hidden=!0,n.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{H(),Ke(),ft(),c()})}function gr(){Ve||(Ve=!0,Ie=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,je=setInterval(()=>{const e=Math.floor((Date.now()-Ie)/1e3),t=Math.floor(e/60),s=e%60,n=document.getElementById("fluency-clock");n&&(n.textContent=`${t}:${String(s).padStart(2,"0")}`)},500))}const zn=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function wt(e,t){var i;if(!Ve&&je===null)return;clearInterval(je),je=null,Ve=!1;const s=document.getElementById("btn-fluency-start"),n=document.getElementById("btn-fluency-done");if(s&&(s.disabled=!1),n&&(n.disabled=!0),!e||!Ie)return;const o=(Date.now()-Ie)/1e3;Ie=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;ze=o,r&&(r.hidden=!0),a.hidden=!1;const l=document.getElementById("fluency-time");l&&(l.textContent=`${e} words in ${zn(o)}.`),(i=a.querySelector('input[name="errors"]'))==null||i.focus({preventScroll:!0})}function br(e,t){var o;const s=document.getElementById("fluency-form"),n=document.getElementById("fluency-result");!s||!n||(s.addEventListener("submit",r=>{var b,I,T;r.preventDefault();const a=((b=s.querySelector('input[name="errors"]'))==null?void 0:b.value)??"",l=a===""?null:Number(a),i=((I=s.querySelector('input[name="support"]:checked'))==null?void 0:I.value)??null,{wpm:c,wcpm:p,accuracy:h}=mo(e,ze,l);qo({storyId:t.id,wpm:c,wcpm:p,errors:l,accuracy:h,support:i,durationSec:ze,wordCount:e});const d=go({wpm:c,wcpm:p,primaryGrade:((T=Kn())==null?void 0:T.primaryGrade)??null});s.hidden=!0,s.reset(),n.hidden=!1,n.innerHTML=S`
      <div class="fluency-result-inner">
        <span class="fluency-time">${zn(ze)}</span>
        <span class="fluency-wcpm">${d.headline}</span>
        ${h!=null?S`<span class="fluency-acc">${h}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${d.detail}</p>
      ${d.reference?S`<p class="fluency-reference">${d.reference}</p>`:""}
    `;const m=document.getElementById("story-quest-cta");m&&(m.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{s.hidden=!0,s.reset(),n.hidden=!1,n.textContent="Not saved."}))}export{Vo as _castNoteHtml,Pn as _highlightGraphemes,Bo as _isMeetWordsCompletedToday,Jo as _lineHtml,it as _logComprehensionAttempt,Kt as _setMeetWordsCompleted,xr as cleanupStoryMode,Sr as initStoryMode,Er as showBrowser};
