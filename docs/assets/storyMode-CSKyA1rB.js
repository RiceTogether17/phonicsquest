import{S as K,B as G}from"./stories-BYImWThp.js";import{P as Pn,s as Dt,a as Ut,e as zt,i as Yt}from"./decodability-DBtBB7Y7.js";import{s as de,W as Pe,X as Fn,Y as Fe,Z as Kt,C as Vt,_ as ye,$ as O,M as Ge,a0 as se,a1 as Gn,q as te,a2 as jn,a3 as Dn}from"./index-Bl3D1ISb.js";import"./gsap-C8pce-KX.js";function Un(e,t,s){var g;if(!((g=t.comprehension)!=null&&g.length)){s==null||s();return}const n={phase:"intro",qIndex:0,vocabIndex:0,correct:0,total:t.comprehension.length,flipped:!1};function o(){switch(n.phase){case"intro":return a();case"comprehension":return r();case"vocab":return l();case"openEnded":return i();case"grammar":return u();case"done":return p()}}function a(){var d,h,m,f;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(d=t.vocab)!=null&&d.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(h=t.grammarSpotlight)!=null&&h.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(m=document.getElementById("sq-start"))==null||m.addEventListener("click",()=>{n.phase="comprehension",n.qIndex=0,o()}),(f=document.getElementById("sq-skip"))==null||f.addEventListener("click",()=>s==null?void 0:s())}function r(){const d=t.comprehension[n.qIndex],h=n.qIndex+1,m=n.total;e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${h/m*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${h} of ${m}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${d.q}</p>
          ${d.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${d.options.map((f,b)=>`
            <button class="sq-option" data-idx="${b}" aria-label="${f}">
              <span class="sq-option-letter">${String.fromCharCode(65+b)}</span>
              <span class="sq-option-text">${f}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(f=>{f.addEventListener("click",()=>c(f,d))})}function c(d,h){const m=parseInt(d.dataset.idx,10),f=m===h.answer;f&&n.correct++,document.querySelectorAll(".sq-option").forEach((q,w)=>{q.disabled=!0,w===h.answer&&q.classList.add("sq-option--correct"),w===m&&!f&&q.classList.add("sq-option--wrong")});const b=document.getElementById("sq-feedback");b&&(b.hidden=!1,b.className=`sq-feedback ${f?"sq-feedback--correct":"sq-feedback--wrong"}`,b.textContent=f?"✅ Great thinking!":`✨ The answer is: ${h.options[h.answer]}`);const k=document.getElementById("sq-next");k&&(k.hidden=!1,k.addEventListener("click",()=>{var q,w,E;n.qIndex++,n.qIndex<n.total||(n.phase=(q=t.openEnded)!=null&&q.length?"openEnded":(w=t.vocab)!=null&&w.length?"vocab":(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",n.vocabIndex=0),o()}))}function i(){var h,m,f;const d=t.openEnded||[];if(!d.length){n.phase=(h=t.vocab)!=null&&h.length?"vocab":(m=t.grammarSpotlight)!=null&&m.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${d.map((b,k)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${k+1}. ${b.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${b.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${b.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(f=document.getElementById("sq-open-next"))==null||f.addEventListener("click",()=>{var b,k;n.phase=(b=t.vocab)!=null&&b.length?"vocab":(k=t.grammarSpotlight)!=null&&k.length?"grammar":"done",o()})}function l(){var k,q,w;const d=t.vocab[n.vocabIndex],h=t.vocab.length,m=n.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${m} of ${h}</p>

        <div class="sq-flip-card ${n.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${d.icon}</div>
            <p class="sq-flip-word">${d.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${d.icon}</div>
            <p class="sq-flip-meaning">${d.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${n.flipped?`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${m<h?"Next word →":"Done with words!"}
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
    `;const f=document.getElementById("sq-flip-card"),b=()=>{n.flipped=!0,o()};f==null||f.addEventListener("click",b),f==null||f.addEventListener("keydown",E=>{(E.key==="Enter"||E.key===" ")&&b()}),(k=document.getElementById("sq-flip-btn"))==null||k.addEventListener("click",b),(q=document.getElementById("sq-vocab-next"))==null||q.addEventListener("click",()=>{var E;n.vocabIndex++,n.flipped=!1,n.vocabIndex<h||(n.phase=(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done"),o()}),(w=document.getElementById("sq-vocab-skip"))==null||w.addEventListener("click",()=>{var E;n.phase=(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",o()})}function u(){var m;const h=(t.grammarSpotlight??[]).map((f,b)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${b+1}</div>
        <h3 class="sq-grammar-pattern">${f.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${f.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${f.tip}</p>
      </div>
    `).join("");e.innerHTML=`
      <div class="sq-screen sq-grammar">
        <p class="sq-phase-label">✏️ Grammar Spotlight</p>
        <div class="sq-grammar-list">${h}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(m=document.getElementById("sq-grammar-done"))==null||m.addEventListener("click",()=>{n.phase="done",o()})}function p(){var q;const d=n.total>0?Math.round(n.correct/n.total*100):100,h=d>=80?3:d>=50?2:1,m="⭐".repeat(h)+"☆".repeat(3-h),f=n.correct*15+(d===100?25:0),b=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],k=h===3?b[2]:h===2?b[1]:b[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${m}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${k}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${n.correct}</span>
            <span class="sq-score-denom">/ ${n.total}</span>
            <span class="sq-score-label">correct</span>
          </div>
          <div class="sq-xp-badge">
            <span class="sq-xp-num">+${f}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `,(q=document.getElementById("sq-back"))==null||q.addEventListener("click",()=>s==null?void 0:s())}o()}function zn(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const s=Math.min(t,e.length-1);let n=-1,o=!1;for(let a=0;a<=s;a++){const r=/\s/.test(e.charAt(a));!r&&!o?(n++,o=!0):r&&(o=!1)}return n<0?-1:n}function Yn(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const s=80;return e.bottom<s||e.top>t-s}function Kn(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let be=null;function Jt(){if(be)return be;be=new Map;for(const e of Pe)e!=null&&e.word&&be.set(e.word.toLowerCase(),e);return be}function Vn(e){const t=Kn(e),s=Jt(),n=t?s.get(t):null;if(n){const o=de.get("wordStats")||{},a=!!o[n.id]&&(o[n.id].attempts||0)>0;return{text:n.word,word:n,foundInBank:!0,graphemes:Array.isArray(n.graphemes)?n.graphemes:[t],types:Array.isArray(n.types)?n.types:[],alreadyTracked:a}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Qt(e){return!e||typeof e!="string"||!(Jt().has(e)||Pe.some(n=>(n==null?void 0:n.id)===e))?!1:(de.recordWordAttempt(e,!0,Fn.EXPOSURE),!0)}const Jn=.62,Qn=.4,At=2;function Rt(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function Xn(e,t,s=(n,o)=>Fe.phoneticSimilarity(n,o)){const n=e.length,o=t.length;if(n===0)return[];if(o===0)return e.map(p=>({word:p,status:"miss",heard:null}));const a=-.4,r=Array.from({length:n+1},()=>new Array(o+1).fill(0));for(let p=1;p<=n;p++)r[p][0]=p*a;for(let p=1;p<=o;p++)r[0][p]=p*a;const c=Array.from({length:n},(p,g)=>Array.from({length:o},(d,h)=>s(e[g],t[h])));for(let p=1;p<=n;p++)for(let g=1;g<=o;g++){const d=c[p-1][g-1]-.5;r[p][g]=Math.max(r[p-1][g-1]+d,r[p-1][g]+a,r[p][g-1]+a)}const i=new Array(n);let l=n,u=o;for(;l>0;){const p=u>0?c[l-1][u-1]-.5:-1/0;if(u>0&&r[l][u]===r[l-1][u-1]+p){const g=c[l-1][u-1],d=e[l-1];let h;g>=Jn?h="match":g>=Qn||d.length<=At?h="unsure":h="miss",i[l-1]={word:d,status:h,heard:t[u-1]},l--,u--}else if(u>0&&r[l][u]===r[l][u-1]+a)u--;else{const g=e[l-1];i[l-1]={word:g,status:g.length<=At?"unsure":"miss",heard:null},l--}}return i}function Zn(e,t,s){const n=Rt(e);let o=null;for(const a of t||[]){const r=Xn(n,Rt(a.text),s),c=r.filter(i=>i.status==="match").length;(!o||c>o.matchCount)&&(o={words:r,matchCount:c,total:n.length})}return o||{words:n.map(a=>({word:a,status:"miss",heard:null})),matchCount:0,total:n.length}}function es(){return Fe.supported}async function ts(e){const t=await Fe.listenTranscript({timeoutMs:12e3});return t?Zn(e,t.transcripts):null}function ns(){Fe.stop()}const we=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function ss(e){const t=[];return e.forEach((s,n)=>{if(!s)return;const o=t[t.length-1];!o||(s.top+s.bottom)/2>o.bottom?t.push({top:s.top,bottom:s.bottom,first:n,last:n}):(o.top=Math.min(o.top,s.top),o.bottom=Math.max(o.bottom,s.bottom),o.last=n)}),t}const os=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function je(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const s=getComputedStyle(t).overflowY;if((s==="auto"||s==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function as(e,{mode:t,word:s=null,wordSelector:n=".wf-word",safeArea:o,onMove:a}){var It,_t,Tt;const r=[...e.querySelectorAll(n)];let c=[],i=0,l=0;const u=document.createElement("div");u.className=`ruler-layer ruler-layer--${t}`,u.setAttribute("aria-hidden","true"),u.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(u);const p=()=>{const v=r[i]??r[0]??e;return parseFloat(getComputedStyle(v).fontSize)||20},g=v=>u.querySelector(v),d=g(".ruler-veil--above"),h=g(".ruler-veil--below"),m=g(".ruler-strip"),f=g(".ruler-word"),b=g(".ruler-bar");function k(){const v=e.getBoundingClientRect();c=ss(r.map($=>{const x=$.getBoundingClientRect();return x.width||x.height?{top:x.top-v.top,bottom:x.bottom-v.top}:null}))}const q=v=>{const $=c.findIndex(x=>v>=x.first&&v<=x.last);return $<0?0:$};function w(){const v=c[l];if(!v)return;const $=p(),x=$*.6,R=v.bottom+$*.18,C=Math.max(12,$*.55),P=e.scrollHeight;d.style.height=`${Math.max(0,v.top-x)}px`,h.style.top=`${R+C}px`,h.style.height=`${Math.max(0,P-R-C)}px`,m.style.top=`${v.top-x}px`,m.style.height=`${R-(v.top-x)}px`,b.style.top=`${R}px`,b.style.height=`${C}px`;const Q=r[i];if(t==="word"&&Q){const X=e.getBoundingClientRect(),U=Q.getBoundingClientRect();f.style.left=`${U.left-X.left-3}px`,f.style.width=`${U.width+6}px`,f.style.top=`${U.top-X.top-2}px`,f.style.height=`${U.height+4}px`,b.style.setProperty("--x",`${U.left-X.left+U.width/2}px`)}r.forEach((X,U)=>X.classList.toggle("is-pointed",t==="word"&&U===i))}function E(){a==null||a({word:i,line:l,lines:c.length,words:r.length,atEnd:t==="word"?i>=r.length-1:l>=c.length-1})}function T(){const v=c[l];if(!v)return;const $=e.getBoundingClientRect(),x=p(),R=$.top+v.top-x*.6,C=$.top+v.bottom+x*1.2,P=o();if(R>=P.top&&C<=P.bottom)return;const Q=P.top+(P.bottom-P.top)*.28,X={top:R-Q,behavior:os()?"auto":"smooth"};(je(e)??window).scrollBy(X)}function A(v,{scroll:$=!0}={}){var x;l=Math.max(0,Math.min(c.length-1,v)),i=((x=c[l])==null?void 0:x.first)??0,w(),E(),$&&T()}function fe(v,{scroll:$=!0}={}){i=Math.max(0,Math.min(r.length-1,v)),l=q(i),w(),E(),$&&T()}function Lt(v){const $=v-e.getBoundingClientRect().top;let x=0,R=1/0;return c.forEach((C,P)=>{const Q=$<C.top?C.top-$:$>C.bottom?$-C.bottom:0;Q<R&&(R=Q,x=P)}),x}let Be=!1;b.addEventListener("pointerdown",v=>{var $;Be=!0,($=b.setPointerCapture)==null||$.call(b,v.pointerId),u.classList.add("is-dragging"),v.preventDefault()}),b.addEventListener("pointermove",v=>{if(!Be)return;const $=p(),x=Lt(v.clientY-$*.6);x!==l&&A(x,{scroll:!1})});const xt=()=>{Be&&(Be=!1,u.classList.remove("is-dragging"),T())};b.addEventListener("pointerup",xt),b.addEventListener("pointercancel",xt);let Xe=0;const qt=()=>{cancelAnimationFrame(Xe),Xe=requestAnimationFrame(()=>{var v;k(),l=q(i),t!=="word"&&(i=((v=c[l])==null?void 0:v.first)??i),u.classList.add("no-anim"),w(),E(),requestAnimationFrame(()=>u.classList.remove("no-anim"))})},oe=typeof ResizeObserver=="function"?new ResizeObserver(qt):null;if(oe==null||oe.observe(e),(_t=(It=document.fonts)==null?void 0:It.ready)==null||_t.then(qt).catch(()=>{}),k(),s==null){const v=o(),$=e.getBoundingClientRect().top,x=c.findIndex(R=>$+R.top>=v.top);l=Math.max(0,x),i=((Tt=c[l])==null?void 0:Tt.first)??0}else i=Math.max(0,Math.min(r.length-1,s)),l=q(i);return u.classList.add("no-anim"),w(),E(),requestAnimationFrame(()=>{u.classList.remove("no-anim"),s!=null&&T()}),{next(){t==="word"?fe(i+1):A(l+1)},prev(){t==="word"?fe(i-1):A(l-1)},nextLine:()=>A(l+1),prevLine:()=>A(l-1),tap(v,$){const x=$?r.indexOf($):-1;x>=0?t==="word"?fe(x,{scroll:!1}):A(q(x),{scroll:!1}):A(Lt(v),{scroll:!1})},follow(v){const $=r.indexOf(v);$<0||(t==="word"?$!==i&&fe($):q($)!==l&&A(q($)))},reveal:T,current:()=>r[i]??null,goTo(v){t==="word"?fe(v):A(q(Math.max(0,Math.min(r.length-1,v))))},destroy(){oe==null||oe.disconnect(),cancelAnimationFrame(Xe),r.forEach(v=>v.classList.remove("is-pointed")),e.classList.remove("has-ruler"),u.remove()}}}const rs="giri_story_place",is=40,ls=30,Xt=8,Zt=()=>Kt(rs);function pt(){try{const e=localStorage.getItem(Zt()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function ot(e){try{localStorage.setItem(Zt(),JSON.stringify(e))}catch{}}function cs(e,t=Date.now()){const s=t-ls*24*60*60*1e3,n=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=s);return n.sort((o,a)=>a[1].at-o[1].at),Object.fromEntries(n.slice(0,is))}function en(e,t,s=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const n=pt();if(t<Xt){if(!(e in n))return;delete n[e],ot(n);return}n[e]={word:Math.max(0,Math.round(t)),at:s},ot(cs(n,s))}function ds(e){const t=pt()[e];return t&&typeof t.word=="number"&&t.word>=Xt?t.word:null}function ht(e){const t=pt();e in t&&(delete t[e],ot(t))}function Bt(e){const t=de.get("groupMastery")||{},s=Vt.filter(o=>e.includes(o.phase));return s.length?s.filter(o=>(t[o.group]??0)>=.8).length/s.length:0}function Ze(e){const t=de.get("groupMastery")||{};return Vt.some(s=>e.includes(s.phase)&&typeof t[s.group]=="number"&&t[s.group]>0)}function tn(){const e=Bt([1,2,3,4,5]),t=Ze([6]),s=Bt([6])>=.5,n=Ze([8]),o=Ze([7]),a=e>=.6||t,r=a&&(s||n),c=r&&o;return{A:{ready:!0,hint:""},B:{ready:a,hint:a?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:r,hint:r?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:c,hint:c?"":"Best after starting Phase 7 — Diphthongs"}}}function us(e,t){const s=tn();for(const n of["A","B","C","D"]){if(!s[n].ready)break;const o=(t==null?void 0:t[n])||[];if(o.some(r=>!(e!=null&&e.includes(r.id)))||!o.length)return n}return"A"}const ue=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),ps=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...ue[e]}))),gt=new Set(["short","long","schwa","rcontrolled","diphthong"]),hs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),De="bcdfghjklmnpqrstvwxyz",gs=new RegExp(`[${De}]a$`),ms=new RegExp("[bcdfghjkmnprstvz]al$"),nn=/[ts]ion$/;function sn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(hs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&gs.test(e)&&t.add(e.length-1),e.length>=4&&ms.test(e)&&t.add(e.length-2),e.length>=5&&nn.test(e)&&t.add(e.length-3)),t.size?t:null}const fs=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),bs=new RegExp(`[${De}]e$`);function on(e){const t=new Set,s=e.length;if(s>=5&&nn.test(e)&&t.add(s-2),s>=4&&bs.test(e)&&!fs.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-1),s>=4&&e.endsWith("ed")){const n=e[s-3];De.includes(n)&&n!=="t"&&n!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-2)}return t.size?t:null}const ys=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),vs=new Set(["been"]),ws=new Set(["friend","friends"]),Ss=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),$s=["ing","ed","ly","es","s","n"];function Ce(e,t){if(e.has(t))return!0;for(const s of $s)if(t.endsWith(s)&&t.length-s.length>=2&&e.has(t.slice(0,-s.length)))return!0;return!1}function Se(e,t,s,n,o,a){return gt.has(n)?a!=null&&a.has(s)?"silent":o!=null&&o.has(s)?"schwa":t==="ea"&&Ce(ys,e)||t==="ee"&&Ce(vs,e)||t==="ie"&&Ce(ws,e)?"short":t==="ow"&&Ce(Ss,e)?"long":n:n}const S=null,an=new Map([["have",[S,"short",S,"silent"]],["love",[S,"short",S,"silent"]],["come",[S,"short",S,"silent"]],["some",[S,"short",S,"silent"]],["done",[S,"short",S,"silent"]],["gone",[S,"short",S,"silent"]],["none",[S,"short",S,"silent"]],["give",[S,"short",S,"silent"]],["live",[S,"short",S,"silent"]],["one",["short",S,"silent"]],["were",[S,"rcontrolled","rcontrolled","silent"]],["here",[S,"rcontrolled","rcontrolled","silent"]],["where",[S,S,"rcontrolled","rcontrolled","silent"]],["there",[S,S,"rcontrolled","rcontrolled","silent"]],["above",["schwa",S,"short",S,"silent"]],["become",[S,"short",S,"short",S,"silent"]],["people",[S,"long","silent",S,S,"silent"]],["again",["schwa",S,"long","long",S]],["said",[S,"short","short",S]],["says",[S,"short","short",S]]]),Es=new Map(Pe.map(e=>[e.word.toLowerCase(),e])),rn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function ks(e){return rn[e]??"consonant"}function ln(e,t,s){const n=String(e).toLowerCase().replace(/[^a-z]/g,""),o=sn(n),a=on(n),r=an.get(n),c=[];let i=0;for(let l=0;l<t.length;l++){const u=t[l]||"",p=u.length||1;let g=ks(s[l]);gt.has(g)&&(g=(r==null?void 0:r[i])??Se(n,u,i,g,o,a)),c.push(g),i+=p}return c}const Ls="aeiou",xs="bcdfghjklmnpqrstvwxyz",Ct=e=>Ls.includes(e),qs=e=>xs.includes(e),cn=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Is=Object.keys(cn).sort((e,t)=>t.length-e.length);function _s(e,t,s){const n=[],o=e.length;let a=0;for(;a<o;){if(a===o-3&&Ct(e[a])&&qs(e[a+1])&&e[a+2]==="e"){n.push({len:1,sound:Se(e,e[a],a,"long",t,s)}),n.push({len:1,sound:null}),n.push({len:1,sound:"silent"});break}let r=!1;for(const c of Is)if(e.startsWith(c,a)){n.push({len:c.length,sound:Se(e,c,a,cn[c],t,s)}),a+=c.length,r=!0;break}if(!r){if(Ct(e[a])||e[a]==="y"&&a>0){const c=a===o-1?"long":"short";n.push({len:1,sound:Se(e,e[a],a,c,t,s)}),a+=1;continue}n.push({len:1,sound:null}),a+=1}}return n}function Ts(e,t,s,n){const o=[];let a=0;for(let r=0;r<e.graphemes.length;r++){const c=e.graphemes[r],i=c.length;if(i===2&&c[1]==="e"&&De.includes(c[0])&&a+2===t.length&&(n!=null&&n.has(a+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),a+=2;continue}let l=rn[e.types[r]]??null;!gt.has(l)&&l!=="silent"&&(l=null),l=Se(t,c,a,l,s,n),o.push({len:i,sound:l}),a+=i}return o}function As(e){var r;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Pn.has(t))return null;const s=an.get(t);if(s){const c=[];for(const i of s){const l=c[c.length-1];l&&l.sound===i?l.len+=1:c.push({len:1,sound:i})}return c}const n=sn(t),o=on(t),a=Es.get(t);return(r=a==null?void 0:a.graphemes)!=null&&r.length?Ts(a,t,n,o):_s(t,n,o)}function Rs(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var a;const s=As(t);if(!s)return t;let n="",o=0;for(const{len:r,sound:c}of s){const i=t.slice(o,o+r);if(o+=r,!c){n+=i;continue}const l=(a=ue[c])==null?void 0:a.cue;n+=`<span class="vs vs--${c}"${l?` data-cue="${l}"`:""}>${i}</span>`}return o<t.length&&(n+=t.slice(o)),n})}const Bs="giri_friends_unlocked";function dn(){return Kt(Bs)}const Cs=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function Ms(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function un(e){if(!e||!e.id)return null;const t=Cs[e.id]||Ms(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function mt(){try{const e=localStorage.getItem(dn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function Hs(e){try{localStorage.setItem(dn(),JSON.stringify(Array.from(e)))}catch{}}function Ns(e){if(!e||typeof e!="string")return!1;const t=mt();return t.has(e)?!1:(t.add(e),Hs(t),!0)}function Ws(e){return mt().has(e)}function Os(e){const t=mt();if(!Array.isArray(e))return[];const s=[];for(const n of e){const o=un(n);o&&s.push({...o,unlocked:t.has(n.id)})}return s}function pn(e){const t=Os(e);return{unlocked:t.filter(n=>n.unlocked).length,total:t.length,roster:t}}const hn="giri_fluency_history",Mt=5,ne=new Map,Ps=10;function Fs(e,t){for(ne.set(e,t);ne.size>Ps;){const s=ne.keys().next().value;ne.delete(s)}}let ie=null,M=null,et=[],le=null,$e=null,Ue="idle",H=null;async function gn({storyId:e,lineIdx:t,onStateChange:s}={}){if(Ue==="recording")return!1;$e=s??null,et=[];try{ie=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return j("error"),!1}const n=Ds();try{M=new MediaRecorder(ie,n?{mimeType:n}:{})}catch{M=new MediaRecorder(ie)}return M.ondataavailable=o=>{o.data.size>0&&et.push(o.data)},M.onstop=()=>{const o=new Blob(et,{type:M.mimeType||"audio/webm"}),a=`rec_${e}_${t??"full"}_${Date.now()}`;le=a,Fs(a,o),rt(),j("recorded")},M.onerror=()=>{rt(),j("error")},M.start(),j("recording"),!0}function He(){M&&M.state==="recording"?M.stop():rt()}function mn(e){const t=le,s=t?ne.get(t):null;return s?new Promise(n=>{ze();const o=URL.createObjectURL(s);H=new Audio(o),j("playing"),H.onended=()=>{URL.revokeObjectURL(o),H=null,j("recorded"),n()},H.onerror=()=>{URL.revokeObjectURL(o),H=null,j("recorded"),n()},H.play().catch(()=>{URL.revokeObjectURL(o),H=null,j("recorded"),n()})}):Promise.resolve()}function ze(){H&&(H.pause(),H=null)}function at(e){const t=le;t&&ne.delete(t),t===le&&(le=null),ze(),j("idle")}function fn(){return Ue}function bn(){He(),ze(),ne.clear(),le=null,Ue="idle",$e=null}function Gs(e){const t=vn(),s=t[e.storyId]??[];s.push({date:new Date().toISOString(),wcpm:e.wcpm,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),s.length>Mt&&s.splice(0,s.length-Mt),t[e.storyId]=s,Us(t)}function yn(e){return vn()[e]??[]}function js(e){const t=yn(e);return t.length===0?null:Math.max(...t.map(s=>s.wcpm))}function j(e){Ue=e,$e==null||$e(e)}function rt(){ie&&(ie.getTracks().forEach(e=>e.stop()),ie=null)}function Ds(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function vn(){try{return JSON.parse(localStorage.getItem(hn)??"{}")}catch{return{}}}let Ht=!1;function Us(e){try{localStorage.setItem(hn,JSON.stringify(e))}catch{if(Ht)return;Ht=!0;const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className="toast toast--warning",s.setAttribute("role","alert"),s.textContent="Device storage full — reading history may not be saved.",t.appendChild(s),setTimeout(()=>s.remove(),8e3)}}const wn="/phonicsquest/";function zs(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return Pe.find(s=>s.word===t)??null}function Sn(e){return e.split(/(\s+|["""'',.!?;:()-]+)/).filter(s=>s.length>0).map(s=>({text:s,type:/^\s+$/.test(s)?"space":/^[^a-zA-Z0-9]+$/.test(s)?"punct":"word"}))}let y=null,F="A",Nt=!1,ae="band",ve="aloud",xe=!1,re=null,Ne=[],I=null,W="word",qe=!1,pe=-1,Ae=[],Ee=0,Ye=[],Ke=0,Ie=0;const $n="giri_stories_read";function D(){try{return JSON.parse(localStorage.getItem($n)??"[]")}catch{return[]}}function Re(e){const t=D();t.includes(e)||(t.push(e),localStorage.setItem($n,JSON.stringify(t))),ht(e),Ns(e)}let Me=null,ke=null,We=!1;const ft="giri_show_graphemes",En="giri_show_ruler",kn="giri_ruler_mode",bt="giri_follow_mode",Ln="giri_meet_words",Wt="giri_comp_log";let B=Ve(ft,!0),Z=Ve(En,!1),L=null,z=null,it=Ve(kn,"line"),ee=null,_e=0,N=null;W=Ve(bt,"word");function Ve(e,t){try{const s=localStorage.getItem(e);return s===null?t:JSON.parse(s)}catch{return t}}function ce(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const xn=new Set;function qn(){return new Date().toISOString().slice(0,10)}function In(){try{const e=localStorage.getItem(Ln);return e?JSON.parse(e):{}}catch{return{}}}function Ys(e){try{localStorage.setItem(Ln,JSON.stringify(e))}catch{}}function Ks(e){return xn.has(e)?!0:In()[e]===qn()}function Ot(e){xn.add(e);const t=In();t[e]=qn();const s=Date.now()-30*24*60*60*1e3;for(const[n,o]of Object.entries(t))(!o||Date.parse(o)<s)&&delete t[n];Ys(t)}const Pt=new Set,Vs=100;function tt(e){try{const t=localStorage.getItem(Wt),s=t?JSON.parse(t):[];for(s.push({ts:Date.now(),...e});s.length>Vs;)s.shift();localStorage.setItem(Wt,JSON.stringify(s))}catch{}}function qo(e,t){y=e}function Io(){_(),he()}function _o(){_(),ut(),bn(),vt(),Je()}function Je(){re==null||re.remove(),re=null}function he(){var s,n,o;Je(),ge(),Tn(),I=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ae==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ae==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ae==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${yo()}</button>
    </div>
  `;let t;if(ae==="band"){if(!Nt){Nt=!0;try{const d={};for(const h of K)(d[s=h.band]??(d[s]=[])).push(h);F=us(D(),d)||F}catch{}}const a=G.find(d=>d.band===F)??G[0],r=K.filter(d=>d.band===F&&d.category!=="chapter"&&d.category!=="nonfiction-sg"),c=D(),i=r.filter(d=>c.includes(d.id)).length,l=tn(),u=G.map(d=>{var h,m,f;return`
      <button
        class="story-tab${d.band===F?" active":""}${(h=l[d.band])!=null&&h.ready?"":" story-tab--not-ready"}"
        data-band="${d.band}"
        style="--tab-color:${d.color}"
        ${(m=l[d.band])!=null&&m.ready?"":`title="${l[d.band].hint}"`}
      >
        <span class="story-tab-num">${d.band}</span>
        <span class="story-tab-name">${d.label}</span>
        ${(f=l[d.band])!=null&&f.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),p=r.map(d=>nt(d,a,!1,c.includes(d.id))).join(""),g=r.length?Math.round(i/r.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${u}</div>
      <div class="stories-level-strip"
           style="--level-color:${a.color};--level-bg:${a.bg}">
        <span class="slstrip-label">Band ${F}</span>
        <span class="slstrip-name">${a.label}</span>
        <span class="slstrip-sounds">${a.targetSounds}</span>
        <span class="slstrip-prop">${a.prop}</span>
        <span class="slstrip-progress" title="${i} of ${r.length} stories read">
          ${i}/${r.length} read
          <span class="slstrip-progress-bar" style="--pct:${g}%"></span>
        </span>
      </div>
      ${(n=l[F])!=null&&n.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${l[F].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${p}</div>
    `}else if(ae==="singapore"){const a=K.filter(i=>i.category==="nonfiction-sg"),r=D();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${a.map(i=>{const l=G.find(u=>u.band===i.band)??G[0];return nt(i,l,!1,r.includes(i.id))}).join("")}</div>
    `}else{const a=K.filter(i=>i.category==="chapter").sort((i,l)=>(i.chapterNum??0)-(l.chapterNum??0)),r=D();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${a.map(i=>{const l=G.find(u=>u.band===i.band)??G[0];return nt(i,l,!0,r.includes(i.id))}).join("")}</div>
    `}y.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,y.querySelectorAll(".sb-cat-tab[data-cat]").forEach(a=>{a.addEventListener("click",()=>{ae=a.dataset.cat,he()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{vo()}),y.querySelectorAll(".story-tab").forEach(a=>{a.addEventListener("click",()=>{F=a.dataset.band,he()})}),y.querySelectorAll(".story-card").forEach(a=>{a.addEventListener("click",()=>yt(a.dataset.storyId))})}function nt(e,t,s=!1,n=!1){var c;const o=(c=e.comprehension)!=null&&c.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",a=s?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",r=n?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${s?" story-card--chapter":""}${n?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${wn}images/stories/${e.illustration}"
          alt="${e.title}"
          class="story-card-mascot"
          draggable="false"
          loading="lazy"
        />
        ${a}
        ${r}
      </div>
      <span class="story-card-title">${e.title}</span>
      <div class="story-card-meta">
        <span class="story-card-level" style="color:${t.color}">Band ${e.band??"A"}</span>
        ${o}
        ${Dt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const i=Ut(e).length;return i?`<span class="story-card-support" data-support="independent">👀 ${i} new ${i===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function yt(e){const t=K.find(s=>s.id===e);t&&(_(),ee=D().includes(t.id)?null:ds(t.id),me.clear(),Js(t))}function Js(e){var s,n,o;I=e;const t=G.find(a=>a.band===e.band)??G[(e.level??1)-1];y.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${wn}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Dt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      ${(()=>{const a=Ut(e);return a.length?`
          <div class="story-prep" aria-labelledby="story-prep-title">
            <p class="story-prep-title" id="story-prep-title">
              👀 Words to know first — tap to hear
            </p>
            <div class="story-prep-words">${a.map(({word:c,display:i,status:l})=>`<button type="button" class="story-prep-word" data-prep-word="${O(c)}"
                       data-status="${O(l)}" aria-label="Hear the word ${O(i)}"
                >${Ge(i)}</button>`).join("")}</div>
          </div>`:`
          <p class="story-prep story-prep--none">
            ✅ You can sound out every word in this story.
          </p>`})()}

      <!-- Mode toggle — plain-language labels so a grown-up knows which is
           which: listen together, or tap words to sound them out. -->
      <div class="story-mode-toggle" role="group" aria-label="Reading mode">
        <button class="smode-btn${ve==="aloud"?" active":""}" data-mode="aloud"  id="btn-mode-aloud">
          <span class="smode-btn-title">📖 Listen &amp; Follow</span>
          <span class="smode-btn-sub">Giri reads · you follow along</span>
        </button>
        <button class="smode-btn${ve==="decode"?" active":""}" data-mode="decode" id="btn-mode-decode">
          <span class="smode-btn-title">🔤 Sound It Out</span>
          <span class="smode-btn-sub">Tap any word to decode it</span>
        </button>
      </div>

      <!-- Dynamic content area (pre-teach + story body + controls) -->
      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(s=document.getElementById("btn-reader-back"))==null||s.addEventListener("click",()=>{_(),he()}),y.querySelectorAll("[data-prep-word]").forEach(a=>{a.addEventListener("click",()=>{var r,c;(c=(r=se.speakSightWord(a.dataset.prepWord))==null?void 0:r.catch)==null||c.call(r,()=>{}),a.classList.add("story-prep-word--said"),setTimeout(()=>a.classList.remove("story-prep-word--said"),600)})}),(n=document.getElementById("btn-mode-aloud"))==null||n.addEventListener("click",()=>{ve="aloud",_(),Ft("aloud"),Le(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{ve="decode",_(),Ft("decode"),Le(e)}),Le(e)}function Le(e){Ks(e.id)?ve==="aloud"?Te(e):Hn(e):Qs(e)}function Ft(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function Qs(e){var d,h;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Ne=e.vocab??[];const s=zt(e),n=e.lines.map(m=>m.text??"").join(" ").toLowerCase(),o=Ne.filter(m=>{const f=m.word.toLowerCase().split(/\s+/)[0];return n.includes(f)});if(!s.length&&!o.length){Ot(e.id),Le(e);return}const a=s.length+o.length,c=Math.min(3,a),i=new Set,l=s.map(m=>`
    <button class="hfw-chip" data-tap-id="hfw:${m}" data-word="${m}" aria-label="Hear sight word ${m}">
      ⭐ ${m}
    </button>
  `).join(""),u=o.map(m=>`
    <button class="vocab-chip" data-tap-id="vocab:${m.word}" data-word="${m.word}" aria-label="Key word: ${m.word}">
      <span class="vocab-chip-icon">${m.icon}</span>
      <span class="vocab-chip-word">${m.word}</span>
      <span class="vocab-chip-meaning">${m.meaning}</span>
    </button>
  `).join("");t.innerHTML=`
    <div class="meet-words-gate" role="region" aria-labelledby="gate-title">
      <h3 id="gate-title">🤝 Meet the Words</h3>
      <p class="gate-hello">
        Tap <strong>any ${c}</strong> to warm up — or skip if you already
        know them. Then read <strong>${e.title}</strong>.
      </p>

      ${l?`
        <div class="gate-section">
          <div class="gate-section-title">⭐ Sight words in this story</div>
          <div class="hfw-chip-list">${l}</div>
        </div>
      `:""}

      ${u?`
        <div class="gate-section">
          <div class="gate-section-title">📚 Key words to know</div>
          <div class="vocab-chip-list">${u}</div>
        </div>
      `:""}

      <div class="gate-continue-row">
        <span class="gate-progress" id="gate-progress" aria-live="polite">0 of ${c} tapped</span>
        <button class="btn btn--ghost" id="gate-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="gate-continue" type="button" disabled>Start Reading →</button>
      </div>
    </div>
  `;function p(m){const f=m.dataset.tapId;if(i.has(f))return;i.add(f),m.setAttribute("data-tapped","true");const b=document.getElementById("gate-progress");if(b&&(b.textContent=i.size>=c?`✓ Warmed up (${i.size} tapped) — keep going or start the story`:`${i.size} of ${c} tapped`),i.size>=c){const k=document.getElementById("gate-continue");k&&(k.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(m=>{m.addEventListener("click",async()=>{dt(m);try{await se.speakWord(m.dataset.word)}catch{}p(m)})});const g=()=>{Ot(e.id),Le(e)};(d=document.getElementById("gate-skip"))==null||d.addEventListener("click",g),(h=document.getElementById("gate-continue"))==null||h.addEventListener("click",g)}function _n(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,s)=>t+s.text.trim().split(/\s+/).length,0)}function Te(e){var u,p,g,d,h,m,f,b,k,q;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Je();const s=e.lines.map((w,E)=>ro(w,E,!0,e)).join(""),n=!!((u=e.comprehension)!=null&&u.length),a=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(w=>`<li>${w}</li>`).join("")}
      </ul>
    </div>
  `:"",r=yn(e.id),c=js(e.id),i=r.length>0?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent Attempts</span>
        ${c!==null?`<span class="fluency-history-best">Best: <strong>${c}</strong> wpm</span>`:""}
      </div>
      <div class="fluency-history-list">
        ${r.slice().reverse().map(w=>{const E=new Date(w.date);return`<span class="fluency-history-item">${`${E.getDate()}/${E.getMonth()+1}`}: <strong>${w.wcpm}</strong> wpm</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${B}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${Z}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${W==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${W==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${B?Mn():""}

      ${ee!==null?`
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`:""}

      <div class="story-body story-body--follow-${W}" id="story-body" aria-live="polite">${s}</div>

      <!-- The ruler's own controls. They live under the text, not in the
           tools sidebar, because they are used continuously while reading
           and a child should not have to look away from the line to press
           Next. Filled in by _startRuler when the ruler is switched on. -->
      <div class="ruler-nav-slot" id="ruler-nav-slot"></div>
      ${a}
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
          <!-- Fluency timer section (collapsible) -->
          <details class="story-tool-section fluency-bar" id="fluency-bar">
            <summary class="story-tool-summary fluency-summary">
              <span class="fluency-label">⏱ Fluency Read</span>
              <span class="fluency-hint">Time your reading speed</span>
            </summary>
            <div class="story-tool-body">
              <div class="fluency-controls">
                <button class="btn btn--ghost" id="btn-fluency-start">▶ Start timer</button>
                <span class="fluency-clock" id="fluency-clock" aria-live="polite">0:00</span>
                <button class="btn btn--primary" id="btn-fluency-done" disabled>✓ Done</button>
              </div>
              <div class="fluency-result" id="fluency-result" hidden></div>
              ${i}
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
              <span class="rtg-label">${Gn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${es()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(w=>{w.addEventListener("click",()=>{W=w.dataset.follow,ce(bt,W),Te(e)})}),t.querySelectorAll(".wf-word").forEach(w=>{w.setAttribute("role","button"),w.setAttribute("tabindex","0");const E=T=>{const A=St(w);A&&(T.preventDefault(),L==null||L.tap(T.clientY??0,w),po(A))};w.addEventListener("click",E),w.addEventListener("keydown",T=>{(T.key==="Enter"||T.key===" ")&&E(T)})}),(g=document.getElementById("btn-toggle-graphemes"))==null||g.addEventListener("click",()=>{B=!B,ce(ft,B),Te(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var w,E;Z=!Z,ce(En,Z),(w=document.getElementById("btn-toggle-ruler"))==null||w.setAttribute("aria-pressed",String(Z)),ge(),Z&&(ct(),(E=document.getElementById("btn-ruler-next"))==null||E.focus({preventScroll:!0}))}),Z?requestAnimationFrame(()=>ct(ee)):ee!==null&&requestAnimationFrame(()=>lt(ee)),Xs(e),(h=document.getElementById("btn-resume-restart"))==null||h.addEventListener("click",w=>{var E;ht(e.id),ee=null,(E=w.currentTarget.closest(".story-resume"))==null||E.remove(),lt(0),L&&L.goTo(0)}),Zs(),(m=document.getElementById("btn-story-play"))==null||m.addEventListener("click",()=>Wn(e)),(f=document.getElementById("btn-story-stop"))==null||f.addEventListener("click",()=>_());const l=_n(e);(b=document.getElementById("btn-fluency-start"))==null||b.addEventListener("click",()=>$o()),(k=document.getElementById("btn-fluency-done"))==null||k.addEventListener("click",()=>ut(l,e)),wo(e),vt(),no(e),So(e),(q=document.getElementById("btn-launch-quest"))==null||q.addEventListener("click",()=>{_(),ut(),bn(),Re(e.id),Un(y,e,()=>{he()})})}function lt(e){const t=y==null?void 0:y.querySelectorAll("#story-body .wf-word"),s=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];s&&(s.scrollIntoView({behavior:V(),block:"center"}),s.classList.add("wf-word--resumed"),setTimeout(()=>s.classList.remove("wf-word--resumed"),2600))}function Xs(e){Tn();const t=document.getElementById("story-body");if(!t)return;const s=je(t);s&&(N=s,N._pqPlaceHandler=()=>{clearTimeout(_e),_e=setTimeout(()=>{if(L||D().includes(e.id))return;const n=t.getBoundingClientRect(),o=An();if(n.bottom<o.top||n.top>o.bottom)return;const r=[...t.querySelectorAll(".wf-word")].findIndex(c=>c.getBoundingClientRect().top>=o.top);r>=0&&en(e.id,r)},500)},s.addEventListener("scroll",N._pqPlaceHandler,{passive:!0}))}function Zs(){const e=document.getElementById("story-resume");if(!e)return;const t=je(e);let s=0;const n=()=>{clearTimeout(s),t==null||t.removeEventListener("scroll",a),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const a=()=>{o&&n()};t==null||t.addEventListener("scroll",a,{passive:!0}),s=setTimeout(n,9e3)}function Tn(){clearTimeout(_e),N!=null&&N._pqPlaceHandler&&(N.removeEventListener("scroll",N._pqPlaceHandler),delete N._pqPlaceHandler),N=null}function An(){const e=document.getElementById("story-body"),t=e?je(e):null,s=t==null?void 0:t.getBoundingClientRect(),n=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),a=Math.max((s==null?void 0:s.top)??0,(n==null?void 0:n.getBoundingClientRect().bottom)??0)+12,r=Math.min((s==null?void 0:s.bottom)??window.innerHeight,window.innerHeight),c=(o?Math.min(o.getBoundingClientRect().top,r):r)-12;return{top:Math.max(0,a),bottom:Math.max(c,a+120)}}function Oe(){return we.find(e=>e.id===it)??we[1]}function eo(){const e=Oe();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${O(e.label)}. Tap to change."
              title="${O(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${Ge(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function ct(e=null){const t=document.getElementById("story-body"),s=document.getElementById("ruler-nav-slot");if(!t||!s)return;s.innerHTML=eo();const n=Oe(),o=s.querySelector(".ruler-pos small"),a=s.querySelector(".ruler-pos b"),r=s.querySelector("#btn-ruler-next"),c=s.querySelector("#btn-ruler-back");L=as(t,{mode:n.id,word:e,wordSelector:".wf-word",safeArea:An,onMove(i){z=i;const l=n.id==="word";o.textContent=l?"Word":"Line",a.textContent=l?`${i.word+1} / ${i.words}`:`${i.line+1} / ${i.lines}`,c.disabled=l?i.word===0:i.line===0,r.textContent=i.atEnd?"The end ✓":l?"Next word ▶":"Next line ▶",r.classList.toggle("is-end",i.atEnd),clearTimeout(_e),_e=setTimeout(()=>{D().includes((I==null?void 0:I.id)??"")||en(I==null?void 0:I.id,i.word)},400)}}),c.addEventListener("click",()=>L==null?void 0:L.prev()),r.addEventListener("click",()=>{if(!(z!=null&&z.atEnd))return L==null?void 0:L.next();const i=I;if(!i)return;Re(i.id);const l=document.getElementById("story-quest-cta");l&&(l.hidden=!1),Et(i),$t(i)}),s.querySelector("#btn-ruler-style").addEventListener("click",()=>{var u;const i=(z==null?void 0:z.word)??0,l=we.indexOf(Oe());it=we[(l+1)%we.length].id,ce(kn,it),ge(),ct(i),(u=document.getElementById("btn-ruler-style"))==null||u.focus({preventScroll:!0})})}function ge(){L==null||L.destroy(),L=null,z=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function to(e){var n,o;if(!L||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(n=e.target)==null?void 0:n.closest)!=null&&o.call(n,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Oe().id==="word",s={ArrowDown:()=>L.nextLine(),ArrowUp:()=>L.prevLine(),ArrowRight:()=>t?L.next():L.nextLine(),ArrowLeft:()=>t?L.prev():L.prevLine()}[e.key];s&&(e.preventDefault(),s())}document.addEventListener("keydown",to);function no(e){var t,s,n,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>so(e)),(s=document.getElementById("btn-rtg-listen"))==null||s.addEventListener("click",()=>oo(e)),(n=document.getElementById("btn-rtg-next"))==null||n.addEventListener("click",()=>Cn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{vt(),Te(e)})}function Y(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function Rn(){const e=Ae[pe];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function so(e){var s,n,o;if(W!=="word"){W="word",ce(bt,W),Te(e);const a=document.getElementById("practice-drawer");a&&(a.open=!0);const r=document.getElementById("rtg-bar");r&&(r.open=!0)}_();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(a=>a.querySelector(".wf-word")).map(a=>Number(a.dataset.line));t.length!==0&&(qe=!0,Ae=t,pe=0,Ee=0,Ye=[],Ke=0,Ie=0,(s=document.getElementById("btn-rtg-start"))==null||s.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Bn(),Y("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Bn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=Rn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:V()}))}async function oo(e){var u;const t=Rn(),s=document.getElementById("btn-rtg-listen");if(!t||!s||s.disabled)return;const n=Array.from(t.querySelectorAll(".wf-word")),o=n.map(St).filter(Boolean).join(" ");if(!o){Cn(e);return}s.disabled=!0,s.replaceChildren(Dn("encourage"),document.createTextNode("Giri is listening…")),Y("Go ahead — read the glowing line now.");const a=await ts(o);if(s.disabled=!1,s.textContent="🎙 Read this line",!qe)return;if(!a){Ee++,Ee>=2?Y("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):Y("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Ee=0;const r=[];a.words.forEach((p,g)=>{const d=n[g];if(d)if(d.classList.remove("rtg-word--match","rtg-word--check"),p.status==="miss"){d.classList.add("rtg-word--check");const h=p.word.replace(/[^a-z]/g,"");h.length>2&&(r.push(h),Qt(h))}else d.classList.add("rtg-word--match")});const c=a.words.filter(p=>p.status!=="miss").length;Ke+=c,Ie+=a.words.length,Ye.push(...r);const i=pe>=Ae.length-1;r.length>0?Y(`Nice reading! Let's check the orange ${r.length===1?"word":"words"} together — tap ${r.length===1?"it":"each one"} to hear it. Then ${i?"finish up":"go on"}!`):Y("⭐ Great — Giri heard every word!"),(u=document.getElementById("btn-rtg-listen"))==null||u.setAttribute("hidden","");const l=document.getElementById("btn-rtg-next");l&&(l.textContent=i?"🌟 Finish":"Next line →",l.removeAttribute("hidden"),l.focus())}function Cn(e){var t,s;if(pe>=Ae.length-1){ao(e);return}pe++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),Bn(),Y("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function ao(e){var c,i;const t=Ie>0?Math.round(Ke/Ie*100):0,s=[...new Set(Ye)],n={...de.get("readAloudStats")||{}},o=n[e.id]||{attempts:0};n[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:s.slice(0,12),updatedAt:new Date().toISOString()},de.set("readAloudStats",n),document.querySelectorAll("#story-body .sline--rtg-current").forEach(l=>l.classList.remove("sline--rtg-current")),(c=document.getElementById("btn-rtg-next"))==null||c.setAttribute("hidden",""),(i=document.getElementById("btn-rtg-exit"))==null||i.setAttribute("hidden","");const a=document.getElementById("btn-rtg-start");a&&(a.removeAttribute("hidden"),a.textContent="Read it again");const r=s.length?` Words to practise: <strong>${s.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";Y(`🌟 You read the whole story to Giri — ${t}% heard clearly.${r}`),Re(e.id),qe=!1}function vt(){qe&&ns(),qe=!1,pe=-1,Ae=[],Ee=0,Ye=[],Ke=0,Ie=0}function wt(e){return!B||!e?e:Rs(e)}function Mn(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${ps.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function ro(e,t,s=!1,n=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${Ge(o)}</div>`;const a=n?wt(o,n.targetGraphemes,n.band):o,r=s?io(o,n):a;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${r}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${r}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${r}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${r}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${r}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${r}</p>`;default:return`<p class="sline"                    data-line="${t}">${r}</p>`}}function io(e,t=null){if(!e)return"";const s=Sn(e);let n=0;return s.map(o=>{if(o.type==="word"){const a=t?wt(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${n++}" data-plain="${O(o.text)}" aria-label="${O(o.text)}">${a}</span>`}return o.text}).join("")}function St(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Hn(e){var l,u,p,g;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Je(),Ne=e.vocab??[];const n=zt(e).map(d=>`
    <button class="hfw-chip" data-word="${d}" aria-label="Hear sight word ${d}">
      ⭐ ${d}
    </button>
  `).join(""),o=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),r=Ne.filter(d=>{const h=d.word.toLowerCase().split(/\s+/)[0];return o.includes(h)}).map(d=>`
    <button class="vocab-chip" data-word="${d.word}" aria-label="Key word: ${d.word}">
      <span class="vocab-chip-icon">${d.icon}</span>
      <span class="vocab-chip-word">${d.word}</span>
      <span class="vocab-chip-meaning">${d.meaning}</span>
    </button>
  `).join(""),c=e.lines.map((d,h)=>{if(d.type==="label")return`<div class="sline sline--label" data-line="${h}">${d.text}</div>`;const f=Sn(d.text).map(k=>{if(k.type==="word"){const q=k.text.toLowerCase().replace(/[^a-z]/g,""),w=Yt(q),E=wt(k.text,e.targetGraphemes,e.band);return`<button class="decode-word${w?" decode-hfw":""}"
                         data-word="${k.text}"
                         aria-label="${w?"Sight word: ":"Decode: "}${k.text}"
                >${E}</button>`}return`<span class="decode-punct">${k.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[d.type]??""} decode-line" data-line="${h}">${f}</p>`}).join("");t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${B}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
      </div>
      ${B?Mn():""}

      <!-- Sight word pre-teach -->
      <div class="hfw-preteach" id="hfw-preteach">
        <div class="hfw-preteach-header">
          <span class="hfw-preteach-title">⭐ Sight Words in this story</span>
          <button class="hfw-toggle-btn" id="btn-hfw-toggle" aria-expanded="true" aria-controls="hfw-chip-list">
            Hide ▲
          </button>
        </div>
        <div id="hfw-chip-list" class="hfw-chip-list">
          ${n.length?n:'<span class="hfw-none">None — all words are fully decodable!</span>'}
          <p class="hfw-tip">Tap each word to hear it. These words are read aloud in the story.</p>
        </div>
      </div>

      <!-- Key vocabulary pre-teach -->
      ${r.length?`
      <div class="vocab-preteach" id="vocab-preteach">
        <div class="hfw-preteach-header">
          <span class="hfw-preteach-title">📚 Key Words — tap to hear</span>
          <button class="hfw-toggle-btn" id="btn-vocab-toggle" aria-expanded="true" aria-controls="vocab-chip-list">
            Hide ▲
          </button>
        </div>
        <div id="vocab-chip-list" class="vocab-chip-list">${r}</div>
      </div>
      `:""}

      <!-- Decode-mode story body -->
      <div class="story-body decode-body" id="story-body" aria-live="polite">
        ${c}
      </div>
    </div>

    <!-- Controls sidebar column -->
    <div class="story-controls-wrap">
      <!-- Mark as read bar -->
      <div class="story-done-bar">
        <button class="btn btn--primary" id="btn-mark-read">✓ Mark story as read</button>
      </div>

      <!-- Decode panel (slides up when a word is tapped) -->
      <div class="decode-panel" id="decode-panel" aria-live="polite" hidden>
        <div class="decode-panel-inner" id="decode-panel-inner">
          <!-- filled dynamically -->
        </div>
      </div>
    </div>
  `,(l=document.getElementById("btn-toggle-graphemes-decode"))==null||l.addEventListener("click",()=>{B=!B,ce(ft,B),Hn(e)}),(u=document.getElementById("btn-hfw-toggle"))==null||u.addEventListener("click",()=>{const d=document.getElementById("hfw-chip-list"),h=document.getElementById("btn-hfw-toggle"),m=h.getAttribute("aria-expanded")==="true";d.hidden=m,h.setAttribute("aria-expanded",String(!m)),h.textContent=m?"Show ▼":"Hide ▲"}),(p=document.getElementById("btn-vocab-toggle"))==null||p.addEventListener("click",()=>{const d=document.getElementById("vocab-chip-list"),h=document.getElementById("btn-vocab-toggle"),m=h.getAttribute("aria-expanded")==="true";d.hidden=m,h.setAttribute("aria-expanded",String(!m)),h.textContent=m?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(d=>{d.addEventListener("click",()=>{var f,b;const h=d.dataset.word;dt(d);const m=new SpeechSynthesisUtterance(h);m.rate=.85,J(m),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",()=>{var f,b;const h=d.dataset.word;dt(d),d.classList.toggle("vocab-chip--expanded");const m=new SpeechSynthesisUtterance(h);m.rate=.85,J(m),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),(g=document.getElementById("btn-mark-read"))==null||g.addEventListener("click",d=>{Re(e.id);const h=d.currentTarget;h.textContent="✓ Read!",h.disabled=!0,h.classList.add("btn--success"),Et(e),$t(e)});const i=document.getElementById("decode-panel");i&&(i.remove(),document.body.appendChild(i)),re=i,t.querySelectorAll(".decode-word").forEach(d=>{d.addEventListener("click",()=>lo(d))})}async function lo(e){var r,c,i,l;document.querySelectorAll(".decode-word.decoding").forEach(u=>u.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,s=t.toLowerCase().replace(/[^a-z]/g,"");s&&me.add(s);const n=zs(t),o=!n&&Yt(s),a=re;if(a)if(a.removeAttribute("hidden"),o){st({type:"hfw",word:s});const u=new SpeechSynthesisUtterance(s);u.rate=.85,J(u),(r=window.speechSynthesis)==null||r.cancel(),(c=window.speechSynthesis)==null||c.speak(u)}else if(n)st({type:"decode",word:n.word,wordObj:n}),await Nn(n);else{st({type:"tts",word:s});const u=new SpeechSynthesisUtterance(s);u.rate=.85,J(u),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(u)}}function st({type:e,word:t,wordObj:s}){var r,c,i;const n=document.getElementById("decode-panel-inner");if(!n)return;if(e==="hfw"){n.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(r=document.getElementById("dp-hear"))==null||r.addEventListener("click",()=>{var u,p;const l=new SpeechSynthesisUtterance(t);l.rate=.85,J(l),(u=window.speechSynthesis)==null||u.cancel(),(p=window.speechSynthesis)==null||p.speak(l)});return}if(e==="tts"){n.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(c=document.getElementById("dp-hear"))==null||c.addEventListener("click",()=>{var u,p;const l=new SpeechSynthesisUtterance(t);l.rate=.85,J(l),(u=window.speechSynthesis)==null||u.cancel(),(p=window.speechSynthesis)==null||p.speak(l)});return}const o=ln(s.word,s.graphemes,s.types),a=s.graphemes.map((l,u)=>{const p=ue[o[u]]??ue.consonant,g=p.mark?` data-mark="${O(p.mark)}"`:"";return`<span class="dp-tile" data-idx="${u}"${g} style="--tile-color:${p.color}"
                    title="${O(p.label)}" aria-label="${O(`${l}, ${p.label}`)}">${Ge(l)}</span>`}).join("");n.innerHTML=`
    <div class="dp-decode">
      <div class="dp-tiles" id="dp-tiles">${a}</div>
      <span class="dp-word" id="dp-word-label">${s.word}</span>
      <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
    </div>
  `,(i=document.getElementById("dp-hear"))==null||i.addEventListener("click",async()=>{await Nn(s)})}async function Nn(e){const t=document.querySelectorAll(".dp-tile");for(let n=0;n<e.graphemes.length;n++){t.forEach((a,r)=>a.classList.toggle("dp-tile--active",r===n));const o=n>0?e.graphemes[n-1]:null;await se.speakPhoneme(e.graphemes[n],e.types[n],{word:e.word,prevGrapheme:o}),await jt(200)}t.forEach(n=>n.classList.remove("dp-tile--active")),await jt(250);const s=document.getElementById("dp-word-label");s&&s.classList.add("dp-word--blend");try{await se.speakWord(e.word)}finally{s&&s.classList.remove("dp-word--blend")}}function dt(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function co(e){const t=[],s=e.lines;let n=0;for(;n<s.length;){const o=s[n];if(o.type==="label"){const a=s[n+1];if(a&&a.type==="beat"){t.push({text:`${o.text} ${a.text}`,highlightIdx:n+1}),n+=2;continue}n++;continue}t.push({text:o.text,highlightIdx:n}),n++}return t}function Wn(e){if(!window.speechSynthesis)return;_(),I=e,kt(!0),xe=!0;const t=co(e);On(t,0)}function On(e,t){if(!xe||t>=e.length){Gt();return}const s=e[t];mo(s.highlightIdx);const n=new SpeechSynthesisUtterance(s.text);n.rate=.82,J(n);const o=s.text.startsWith("Puff")?600:380;W==="word"&&uo(n,s.highlightIdx),n.onend=()=>{Qe(),xe&&setTimeout(()=>On(e,t+1),o)},n.onerror=()=>Gt(),window.speechSynthesis.speak(n)}function uo(e,t){const s=y==null?void 0:y.querySelector(`[data-line="${t}"]`);if(!s)return;const n=s.querySelectorAll(".wf-word");if(n.length===0)return;const o=e.text||"";let a=!1,r=-1,c=[],i=!1;function l(d){if(d<0||d>=n.length||d===r)return;r=d,n.forEach(m=>m.classList.remove("wf-word--active"));const h=n[d];h.classList.add("wf-word--active"),L?L.follow(h):go(h)}function u(){for(const d of c)clearTimeout(d);c=[]}function p(){var f;if(i)return;i=!0;const d=typeof e.rate=="number"&&e.rate>0?e.rate:.82,h=Array.from(n,St);let m=0;for(let b=0;b<n.length;b++){const k=b,q=((f=h[b])==null?void 0:f.length)||3,w=Math.max(160,Math.round((90+q*60)/d)),E=setTimeout(()=>{a||l(k)},m);c.push(E),m+=w}}e.addEventListener("boundary",d=>{d.name&&d.name!=="word"||(a=!0,u(),l(zn(o,d.charIndex??-1)))}),e.addEventListener("end",()=>{u()}),e.addEventListener("start",()=>{if(a)return;const d=setTimeout(()=>{a||(l(0),p())},180);c.push(d)});const g=setTimeout(()=>{a||i||(l(0),p())},800);c.push(g)}function po(e){var o;const t=document.getElementById("word-detective-content");if(!t)return;me.add(e.toLowerCase().replace(/[^a-z']/g,"")),_();const s=Vn(e);t.innerHTML=ho(s),ye.open("modal-word-detective");try{se.speakWord(s.text)}catch{}(o=t.querySelector('[data-action="hear"]'))==null||o.addEventListener("click",()=>{try{se.speakWord(s.text)}catch{}});const n=t.querySelector('[data-action="add-review"]');n==null||n.addEventListener("click",()=>{if(!s.word)return;Qt(s.word.id)&&(n.disabled=!0,n.textContent="✓ In your Review Lane")})}function ho(e){const t=a=>String(a??"").replace(/[<>&]/g,r=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[r]),s=ln(e.text,e.graphemes,e.types),n=e.graphemes.map((a,r)=>{const c=ue[s[r]]??ue.consonant,i=c.mark?` data-mark="${t(c.mark)}"`:"";return`<span class="wd-tile vs--${s[r]}"${i} style="--tile-color:${c.color}" aria-label="${t(a)}, ${t(c.label)}">${t(a)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:`<p class="wd-note">This word isn't in the practice bank — but you can still hear its sounds.</p>`;return`
    <div class="wd-card">
      <p class="wd-word">${t(e.text)}</p>
      <div class="wd-tiles" aria-label="Sound breakdown">${n}</div>
      <div class="wd-actions">
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
        ${o}
      </div>
    </div>`}function V(){return jn()?"auto":"smooth"}function go(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),s=window.innerHeight||document.documentElement.clientHeight;Yn(t,s)&&e.scrollIntoView({block:"center",behavior:V()})}catch{}}function Qe(){y==null||y.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function mo(e){y==null||y.querySelectorAll(".sline--active").forEach(s=>s.classList.remove("sline--active")),Qe();const t=y==null?void 0:y.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const s=t.querySelector(".wf-word");L&&s?L.follow(s):t.scrollIntoView({behavior:V(),block:"nearest"})}}function J(e){var s,n;let t;try{t=((n=(s=se).getTtsVoice)==null?void 0:n.call(s))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function _(){var e;xe=!1,(e=window.speechSynthesis)==null||e.cancel(),y==null||y.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Qe(),kt(!1)}function Gt(){xe=!1,y==null||y.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Qe(),kt(!1),I&&Re(I.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),I&&Et(I),I&&$t(I)}const me=new Set;function fo(e){const t=K.filter(n=>n.band===e.band&&n.category===e.category&&n.id!==e.id),s=D();return t.find(n=>!s.includes(n.id))??t[0]??null}function bo(e){var n,o;const t=[te`You read <strong>${e.title}</strong> — ${_n(e)} words.`];if(me.size){const a=me.size;t.push(te`You worked out ${a} ${a===1?"word":"words"} by sounding
      ${a===1?"it":"them"} out.`)}(e.roles||(n=e.talkAboutIt)!=null&&n.length)&&t.push(te`You had a think about what happened.`);const s=Ws(e.id)?(o=un(e))==null?void 0:o.name:"";return s&&t.push(te`<strong>${s}</strong> has joined your 🐾 Friends.`),t}function $t(e){var o,a,r;if(!e)return;const t=y==null?void 0:y.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const s=fo(e),n=document.createElement("section");n.className="story-ending",n.setAttribute("aria-label","You finished the story"),n.innerHTML=te`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${bo(e).map(c=>te`<li>${c}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${s?te`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${s.id}"
          >
            ➡️ Next: ${s.title}
          </button>`:""}
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `,t.appendChild(n),n.scrollIntoView({behavior:V(),block:"nearest"}),(o=n.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{me.clear(),ht(e.id),ee=null,n.remove(),lt(0),L&&L.goTo(0)}),(a=n.querySelector("#btn-ending-next"))==null||a.addEventListener("click",c=>{_(),yt(c.currentTarget.dataset.storyId)}),(r=n.querySelector("#btn-ending-done"))==null||r.addEventListener("click",()=>{_(),he()})}function Et(e){var r,c,i;if(!e||!((r=e.talkAboutIt)!=null&&r.length)||Pt.has(e.id))return;const t=y==null?void 0:y.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Pt.add(e.id);const s=e.talkAboutIt[0],n=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:V(),block:"nearest"});const a=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.resp;if(tt({storyId:e.id,question:s,response:u}),o.querySelectorAll(".comp-choice").forEach(g=>g.disabled=!0),l.classList.add("correct"),u==="confident")a.textContent="👍 Great! You understood the story.";else if(u==="reread")a.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Wn(e),300);else{a.textContent="💡 Look at the end of the story for clues.";const g=y==null?void 0:y.querySelector(".sline.sline--end, .sline:last-of-type");g==null||g.scrollIntoView({behavior:V(),block:"center"})}a.hidden=!1;const p=o.querySelector("#comp-more");p&&(p.hidden=!1)})}),(c=o.querySelector("#comp-more"))==null||c.addEventListener("click",()=>{var u;const l=o.querySelector("#comp-q");l&&(l.textContent=n),tt({storyId:e.id,question:n,response:"followup"}),(u=o.querySelector("#comp-more"))==null||u.remove(),a&&(a.textContent="💭 Have a think, then tell someone your answer.",a.hidden=!1),o.querySelectorAll(".comp-choice").forEach(p=>{p.disabled=!1,p.classList.remove("correct")})}),(i=o.querySelector("#comp-skip"))==null||i.addEventListener("click",()=>{tt({storyId:e.id,question:s,response:"skipped"}),o.remove()})}function yo(){try{const e=pn(K);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function vo(){var r,c;(r=document.getElementById("modal-story-friends"))==null||r.remove();const e=pn(K),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const s=i=>String(i??"").replace(/[<>&]/g,l=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[l]),n=new Map;for(const i of e.roster)n.has(i.band)||n.set(i.band,[]),n.get(i.band).push(i);const o=Array.from(n.entries()).sort((i,l)=>String(i[0]).localeCompare(String(l[0]))).map(([i,l])=>{const u=l.filter(g=>g.unlocked).length,p=l.map(g=>`
        <button class="sf-tile ${g.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${s(g.storyId)}"
                ${g.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${g.unlocked?`${s(g.name)} from ${s(g.storyTitle)} — tap to re-read`:`Locked — read ${s(g.storyTitle)} to meet ${s(g.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${g.unlocked?s(g.emoji):"🔒"}</span>
          <span class="sf-tile__name">${g.unlocked?s(g.name):"???"}</span>
          ${g.unlocked?`<span class="sf-tile__story">from ${s(g.storyTitle)}</span>`:`<span class="sf-tile__story">${s(g.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${s(i)} <small>${u}/${l.length} met</small></h3>
          <div class="sf-grid">${p}</div>
        </div>`}).join(""),a=e.unlocked===0?"🐾 Read a Giri Story and the co-star moves in here. No friends yet — start with Band A!":`🐾 You've met <strong>${e.unlocked}</strong> of <strong>${e.total}</strong>. Tap a friend to re-read their story.`;t.innerHTML=`
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
        <p class="sf-intro">${a}</p>
        ${o}
      </div>
    </div>`,document.body.appendChild(t),ye.open("modal-story-friends"),(c=t.querySelector("[data-close]"))==null||c.addEventListener("click",()=>{ye.close("modal-story-friends"),t.remove()}),t.addEventListener("click",i=>{i.target===t&&(ye.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.storyId;l&&(ye.close("modal-story-friends"),t.remove(),yt(l))})})}function kt(e){const t=document.getElementById("btn-story-play"),s=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),s&&(s.style.display=e?"":"none");const n=y==null?void 0:y.querySelector(".story-reader");n&&n.classList.toggle("story-reader--listening",e)}const jt=e=>new Promise(t=>setTimeout(t,e));function wo(e){const t=document.getElementById("btn-rec-start"),s=document.getElementById("btn-rec-stop"),n=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),a=document.getElementById("recording-status");if(!t)return;function r(c){if(t.hidden=c!=="idle",s.hidden=c!=="recording",n.hidden=c!=="recorded"&&c!=="playing",o.hidden=c!=="recorded"&&c!=="playing",a)switch(c){case"recording":a.textContent="🔴 Recording...",a.className="recording-status recording-status--active";break;case"recorded":a.textContent="✓ Recording ready",a.className="recording-status recording-status--ready";break;case"playing":a.textContent="▶ Playing...",a.className="recording-status recording-status--playing";break;case"error":a.textContent="⚠ Microphone not available — check permissions",a.className="recording-status recording-status--error";break;default:a.textContent="",a.className="recording-status";break}n&&(n.textContent=c==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await gn({storyId:e.id,onStateChange:r})||r("error")}),s.addEventListener("click",()=>{He()}),n.addEventListener("click",()=>{fn()==="playing"?(ze(),r("recorded")):mn()}),o.addEventListener("click",()=>{at(),r("idle")})}function So(e){const t=document.getElementById("btn-echo-start"),s=document.getElementById("btn-echo-next"),n=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),a=document.getElementById("btn-echo-stop"),r=document.getElementById("echo-read-status");if(!t)return;const c=e.lines.map((p,g)=>({...p,idx:g})).filter(p=>p.type!=="label"&&p.type!=="chapter"&&p.text);let i=-1;function l(){t.hidden=!1,s.hidden=!0,n.hidden=!0,o.hidden=!0,a.hidden=!0,r&&(r.textContent="",r.className="echo-read-status"),y==null||y.querySelectorAll(".sline--echo-active").forEach(p=>p.classList.remove("sline--echo-active")),i=-1}function u(p){var m,f;i=p;const g=c[p];if(!g){l();return}g.idx,y==null||y.querySelectorAll(".sline--echo-active").forEach(b=>b.classList.remove("sline--echo-active"));const d=y==null?void 0:y.querySelector(`[data-line="${g.idx}"]`);d&&(d.classList.add("sline--echo-active"),d.scrollIntoView({behavior:V(),block:"nearest"})),r&&(r.textContent=`Line ${p+1} of ${c.length}`,r.className="echo-read-status echo-read-status--active"),s.hidden=!0,n.hidden=!0,o.hidden=!0;const h=new SpeechSynthesisUtterance(g.text);h.rate=.82,J(h),h.onend=()=>{n.hidden=!1,n.textContent="🎙 Your Turn",r&&(r.textContent=`Your turn! Read line ${p+1}`)},h.onerror=()=>{n.hidden=!1},(m=window.speechSynthesis)==null||m.cancel(),(f=window.speechSynthesis)==null||f.speak(h)}t.addEventListener("click",()=>{t.hidden=!0,a.hidden=!1,u(0)}),n.addEventListener("click",async()=>{if(fn()==="recording"){He();return}const p=c[i];!await gn({storyId:e.id,lineIdx:p==null?void 0:p.idx,onStateChange:d=>{d==="recording"?(n.textContent="⏹ Stop Recording",r&&(r.textContent="🔴 Recording...",r.className="echo-read-status echo-read-status--recording")):d==="recorded"?(n.hidden=!0,o.hidden=!1,s.hidden=i>=c.length-1,r&&(r.textContent="✓ Great job!",r.className="echo-read-status echo-read-status--done")):d==="error"&&r&&(r.textContent="⚠ Microphone not available",r.className="echo-read-status echo-read-status--error")}})&&r&&(r.textContent="⚠ Microphone not available — check permissions",r.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{mn()}),s.addEventListener("click",()=>{at(),o.hidden=!0,i+1<c.length?u(i+1):(r&&(r.textContent="🎉 Echo Read complete!",r.className="echo-read-status echo-read-status--done"),s.hidden=!0,n.hidden=!0,setTimeout(l,2e3))}),a.addEventListener("click",()=>{_(),He(),at(),l()})}function $o(){We||(We=!0,ke=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,Me=setInterval(()=>{const e=Math.floor((Date.now()-ke)/1e3),t=Math.floor(e/60),s=e%60,n=document.getElementById("fluency-clock");n&&(n.textContent=`${t}:${String(s).padStart(2,"0")}`)},500))}function ut(e,t){if(!We&&Me===null||(clearInterval(Me),Me=null,We=!1,document.getElementById("btn-fluency-start").disabled=!1,document.getElementById("btn-fluency-done").disabled=!0,!e||!ke))return;const s=(Date.now()-ke)/1e3;if(ke=null,s<2)return;const n=Math.round(e/s*60),o=Math.floor(s/60),a=Math.round(s%60);t&&Gs({storyId:t.id,wcpm:n,durationSec:s,wordCount:e});let r;n>=60?r="🌟 Fluent reader!":n>=40?r="📈 Building fluency — great progress!":r="📖 Keep practising — try reading it again!";const c=document.getElementById("fluency-result");if(c){c.hidden=!1,c.innerHTML=`
      <div class="fluency-result-inner">
        <span class="fluency-time">Time: ${o}:${String(a).padStart(2,"0")}</span>
        <span class="fluency-wcpm"><strong>${n}</strong> words/min</span>
        <span class="fluency-level">${r}</span>
      </div>
      <p class="fluency-tip">Tip: Read the story again to improve your speed!</p>
    `;const i=document.getElementById("story-quest-cta");i&&(i.hidden=!1)}}export{wt as _highlightGraphemes,Ks as _isMeetWordsCompletedToday,tt as _logComprehensionAttempt,Ot as _setMeetWordsCompleted,_o as cleanupStoryMode,qo as initStoryMode,Io as showBrowser};
