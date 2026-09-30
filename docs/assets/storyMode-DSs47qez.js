import{S as V,B as O}from"./stories-BYImWThp.js";import{P as $n,s as Rt,a as Tt,e as At,i as Bt}from"./decodability-Dvm7FWfd.js";import{s as ae,W as Ce,X as En,Y as Me,C as Ct,Z as kn,_ as ue,$ as M,M as He,a0 as Q,a1 as xn,a2 as Ln,a3 as qn}from"./index-DjN2kf3Z.js";import"./gsap-C8pce-KX.js";function In(e,t,n){var g;if(!((g=t.comprehension)!=null&&g.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return a();case"comprehension":return r();case"vocab":return l();case"openEnded":return i();case"grammar":return u();case"done":return p()}}function a(){var c,h,m,f;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(c=t.vocab)!=null&&c.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(h=t.grammarSpotlight)!=null&&h.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(m=document.getElementById("sq-start"))==null||m.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(f=document.getElementById("sq-skip"))==null||f.addEventListener("click",()=>n==null?void 0:n())}function r(){const c=t.comprehension[s.qIndex],h=s.qIndex+1,m=s.total;e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${h/m*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${h} of ${m}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${c.q}</p>
          ${c.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${c.options.map((f,b)=>`
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
    `,document.querySelectorAll(".sq-option").forEach(f=>{f.addEventListener("click",()=>d(f,c))})}function d(c,h){const m=parseInt(c.dataset.idx,10),f=m===h.answer;f&&s.correct++,document.querySelectorAll(".sq-option").forEach((y,k)=>{y.disabled=!0,k===h.answer&&y.classList.add("sq-option--correct"),k===m&&!f&&y.classList.add("sq-option--wrong")});const b=document.getElementById("sq-feedback");b&&(b.hidden=!1,b.className=`sq-feedback ${f?"sq-feedback--correct":"sq-feedback--wrong"}`,b.textContent=f?"✅ Great thinking!":`✨ The answer is: ${h.options[h.answer]}`);const E=document.getElementById("sq-next");E&&(E.hidden=!1,E.addEventListener("click",()=>{var y,k,L;s.qIndex++,s.qIndex<s.total||(s.phase=(y=t.openEnded)!=null&&y.length?"openEnded":(k=t.vocab)!=null&&k.length?"vocab":(L=t.grammarSpotlight)!=null&&L.length?"grammar":"done",s.vocabIndex=0),o()}))}function i(){var h,m,f;const c=t.openEnded||[];if(!c.length){s.phase=(h=t.vocab)!=null&&h.length?"vocab":(m=t.grammarSpotlight)!=null&&m.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${c.map((b,E)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${E+1}. ${b.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${b.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${b.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(f=document.getElementById("sq-open-next"))==null||f.addEventListener("click",()=>{var b,E;s.phase=(b=t.vocab)!=null&&b.length?"vocab":(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",o()})}function l(){var E,y,k;const c=t.vocab[s.vocabIndex],h=t.vocab.length,m=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${m} of ${h}</p>

        <div class="sq-flip-card ${s.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${c.icon}</div>
            <p class="sq-flip-word">${c.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${c.icon}</div>
            <p class="sq-flip-meaning">${c.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${s.flipped?`
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
    `;const f=document.getElementById("sq-flip-card"),b=()=>{s.flipped=!0,o()};f==null||f.addEventListener("click",b),f==null||f.addEventListener("keydown",L=>{(L.key==="Enter"||L.key===" ")&&b()}),(E=document.getElementById("sq-flip-btn"))==null||E.addEventListener("click",b),(y=document.getElementById("sq-vocab-next"))==null||y.addEventListener("click",()=>{var L;s.vocabIndex++,s.flipped=!1,s.vocabIndex<h||(s.phase=(L=t.grammarSpotlight)!=null&&L.length?"grammar":"done"),o()}),(k=document.getElementById("sq-vocab-skip"))==null||k.addEventListener("click",()=>{var L;s.phase=(L=t.grammarSpotlight)!=null&&L.length?"grammar":"done",o()})}function u(){var m;const h=(t.grammarSpotlight??[]).map((f,b)=>`
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
    `,(m=document.getElementById("sq-grammar-done"))==null||m.addEventListener("click",()=>{s.phase="done",o()})}function p(){var y;const c=s.total>0?Math.round(s.correct/s.total*100):100,h=c>=80?3:c>=50?2:1,m="⭐".repeat(h)+"☆".repeat(3-h),f=s.correct*15+(c===100?25:0),b=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],E=h===3?b[2]:h===2?b[1]:b[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${m}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${E}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${s.correct}</span>
            <span class="sq-score-denom">/ ${s.total}</span>
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
    `,(y=document.getElementById("sq-back"))==null||y.addEventListener("click",()=>n==null?void 0:n())}o()}function _n(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let a=0;a<=n;a++){const r=/\s/.test(e.charAt(a));!r&&!o?(s++,o=!0):r&&(o=!1)}return s<0?-1:s}function Rn(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function Tn(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let de=null;function Mt(){if(de)return de;de=new Map;for(const e of Ce)e!=null&&e.word&&de.set(e.word.toLowerCase(),e);return de}function An(e){const t=Tn(e),n=Mt(),s=t?n.get(t):null;if(s){const o=ae.get("wordStats")||{},a=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:a}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Ht(e){return!e||typeof e!="string"||!(Mt().has(e)||Ce.some(s=>(s==null?void 0:s.id)===e))?!1:(ae.recordWordAttempt(e,!0,En.EXPOSURE),!0)}const Bn=.62,Cn=.4,bt=2;function yt(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function Mn(e,t,n=(s,o)=>Me.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(p=>({word:p,status:"miss",heard:null}));const a=-.4,r=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let p=1;p<=s;p++)r[p][0]=p*a;for(let p=1;p<=o;p++)r[0][p]=p*a;const d=Array.from({length:s},(p,g)=>Array.from({length:o},(c,h)=>n(e[g],t[h])));for(let p=1;p<=s;p++)for(let g=1;g<=o;g++){const c=d[p-1][g-1]-.5;r[p][g]=Math.max(r[p-1][g-1]+c,r[p-1][g]+a,r[p][g-1]+a)}const i=new Array(s);let l=s,u=o;for(;l>0;){const p=u>0?d[l-1][u-1]-.5:-1/0;if(u>0&&r[l][u]===r[l-1][u-1]+p){const g=d[l-1][u-1],c=e[l-1];let h;g>=Bn?h="match":g>=Cn||c.length<=bt?h="unsure":h="miss",i[l-1]={word:c,status:h,heard:t[u-1]},l--,u--}else if(u>0&&r[l][u]===r[l][u-1]+a)u--;else{const g=e[l-1];i[l-1]={word:g,status:g.length<=bt?"unsure":"miss",heard:null},l--}}return i}function Hn(e,t,n){const s=yt(e);let o=null;for(const a of t||[]){const r=Mn(s,yt(a.text),n),d=r.filter(i=>i.status==="match").length;(!o||d>o.matchCount)&&(o={words:r,matchCount:d,total:s.length})}return o||{words:s.map(a=>({word:a,status:"miss",heard:null})),matchCount:0,total:s.length}}function Nn(){return Me.supported}async function Wn(e){const t=await Me.listenTranscript({timeoutMs:12e3});return t?Hn(e,t.transcripts):null}function On(){Me.stop()}const me=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function Gn(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const Fn=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function Nt(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function Pn(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:a}){var gt,mt,ft;const r=[...e.querySelectorAll(s)];let d=[],i=0,l=0;const u=document.createElement("div");u.className=`ruler-layer ruler-layer--${t}`,u.setAttribute("aria-hidden","true"),u.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(u);const p=()=>{const v=r[i]??r[0]??e;return parseFloat(getComputedStyle(v).fontSize)||20},g=v=>u.querySelector(v),c=g(".ruler-veil--above"),h=g(".ruler-veil--below"),m=g(".ruler-strip"),f=g(".ruler-word"),b=g(".ruler-bar");function E(){const v=e.getBoundingClientRect();d=Gn(r.map($=>{const x=$.getBoundingClientRect();return x.width||x.height?{top:x.top-v.top,bottom:x.bottom-v.top}:null}))}const y=v=>{const $=d.findIndex(x=>v>=x.first&&v<=x.last);return $<0?0:$};function k(){const v=d[l];if(!v)return;const $=p(),x=$*.6,I=v.bottom+$*.18,T=Math.max(12,$*.55),N=e.scrollHeight;c.style.height=`${Math.max(0,v.top-x)}px`,h.style.top=`${I+T}px`,h.style.height=`${Math.max(0,N-I-T)}px`,m.style.top=`${v.top-x}px`,m.style.height=`${I-(v.top-x)}px`,b.style.top=`${I}px`,b.style.height=`${T}px`;const z=r[i];if(t==="word"&&z){const Y=e.getBoundingClientRect(),P=z.getBoundingClientRect();f.style.left=`${P.left-Y.left-3}px`,f.style.width=`${P.width+6}px`,f.style.top=`${P.top-Y.top-2}px`,f.style.height=`${P.height+4}px`,b.style.setProperty("--x",`${P.left-Y.left+P.width/2}px`)}r.forEach((Y,P)=>Y.classList.toggle("is-pointed",t==="word"&&P===i))}function L(){a==null||a({word:i,line:l,lines:d.length,words:r.length,atEnd:t==="word"?i>=r.length-1:l>=d.length-1})}function F(){const v=d[l];if(!v)return;const $=e.getBoundingClientRect(),x=p(),I=$.top+v.top-x*.6,T=$.top+v.bottom+x*1.2,N=o();if(I>=N.top&&T<=N.bottom)return;const z=N.top+(N.bottom-N.top)*.28,Y={top:I-z,behavior:Fn()?"auto":"smooth"};(Nt(e)??window).scrollBy(Y)}function H(v,{scroll:$=!0}={}){var x;l=Math.max(0,Math.min(d.length-1,v)),i=((x=d[l])==null?void 0:x.first)??0,k(),L(),$&&F()}function ce(v,{scroll:$=!0}={}){i=Math.max(0,Math.min(r.length-1,v)),l=y(i),k(),L(),$&&F()}function ut(v){const $=v-e.getBoundingClientRect().top;let x=0,I=1/0;return d.forEach((T,N)=>{const z=$<T.top?T.top-$:$>T.bottom?$-T.bottom:0;z<I&&(I=z,x=N)}),x}let qe=!1;b.addEventListener("pointerdown",v=>{var $;qe=!0,($=b.setPointerCapture)==null||$.call(b,v.pointerId),u.classList.add("is-dragging"),v.preventDefault()}),b.addEventListener("pointermove",v=>{if(!qe)return;const $=p(),x=ut(v.clientY-$*.6);x!==l&&H(x,{scroll:!1})});const pt=()=>{qe&&(qe=!1,u.classList.remove("is-dragging"),F())};b.addEventListener("pointerup",pt),b.addEventListener("pointercancel",pt);let ze=0;const ht=()=>{cancelAnimationFrame(ze),ze=requestAnimationFrame(()=>{var v;E(),l=y(i),t!=="word"&&(i=((v=d[l])==null?void 0:v.first)??i),u.classList.add("no-anim"),k(),L(),requestAnimationFrame(()=>u.classList.remove("no-anim"))})},Z=typeof ResizeObserver=="function"?new ResizeObserver(ht):null;if(Z==null||Z.observe(e),(mt=(gt=document.fonts)==null?void 0:gt.ready)==null||mt.then(ht).catch(()=>{}),E(),n==null){const v=o(),$=e.getBoundingClientRect().top,x=d.findIndex(I=>$+I.top>=v.top);l=Math.max(0,x),i=((ft=d[l])==null?void 0:ft.first)??0}else i=Math.max(0,Math.min(r.length-1,n)),l=y(i);return u.classList.add("no-anim"),k(),L(),requestAnimationFrame(()=>{u.classList.remove("no-anim"),n!=null&&F()}),{next(){t==="word"?ce(i+1):H(l+1)},prev(){t==="word"?ce(i-1):H(l-1)},nextLine:()=>H(l+1),prevLine:()=>H(l-1),tap(v,$){const x=$?r.indexOf($):-1;x>=0?t==="word"?ce(x,{scroll:!1}):H(y(x),{scroll:!1}):H(ut(v),{scroll:!1})},follow(v){const $=r.indexOf(v);$<0||(t==="word"?$!==i&&ce($):y($)!==l&&H(y($)))},reveal:F,current:()=>r[i]??null,goTo(v){t==="word"?ce(v):H(y(Math.max(0,Math.min(r.length-1,v))))},destroy(){Z==null||Z.disconnect(),cancelAnimationFrame(ze),r.forEach(v=>v.classList.remove("is-pointed")),e.classList.remove("has-ruler"),u.remove()}}}function vt(e){const t=ae.get("groupMastery")||{},n=Ct.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function Ye(e){const t=ae.get("groupMastery")||{};return Ct.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function Wt(){const e=vt([1,2,3,4,5]),t=Ye([6]),n=vt([6])>=.5,s=Ye([8]),o=Ye([7]),a=e>=.6||t,r=a&&(n||s),d=r&&o;return{A:{ready:!0,hint:""},B:{ready:a,hint:a?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:r,hint:r?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:d,hint:d?"":"Best after starting Phase 7 — Diphthongs"}}}function jn(e,t){const n=Wt();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(r=>!(e!=null&&e.includes(r.id)))||!o.length)return s}return"A"}const re=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),Dn=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...re[e]}))),ot=new Set(["short","long","schwa","rcontrolled","diphthong"]),Un=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),Ne="bcdfghjklmnpqrstvwxyz",zn=new RegExp(`[${Ne}]a$`),Yn=new RegExp("[bcdfghjkmnprstvz]al$"),Ot=/[ts]ion$/;function Gt(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(Un.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&zn.test(e)&&t.add(e.length-1),e.length>=4&&Yn.test(e)&&t.add(e.length-2),e.length>=5&&Ot.test(e)&&t.add(e.length-3)),t.size?t:null}const Kn=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),Vn=new RegExp(`[${Ne}]e$`);function Ft(e){const t=new Set,n=e.length;if(n>=5&&Ot.test(e)&&t.add(n-2),n>=4&&Vn.test(e)&&!Kn.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];Ne.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const Jn=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Qn=new Set(["been"]),Xn=new Set(["friend","friends"]),Zn=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),es=["ing","ed","ly","es","s","n"];function Ie(e,t){if(e.has(t))return!0;for(const n of es)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function fe(e,t,n,s,o,a){return ot.has(s)?a!=null&&a.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&Ie(Jn,e)||t==="ee"&&Ie(Qn,e)||t==="ie"&&Ie(Xn,e)?"short":t==="ow"&&Ie(Zn,e)?"long":s:s}const S=null,Pt=new Map([["have",[S,"short",S,"silent"]],["love",[S,"short",S,"silent"]],["come",[S,"short",S,"silent"]],["some",[S,"short",S,"silent"]],["done",[S,"short",S,"silent"]],["gone",[S,"short",S,"silent"]],["none",[S,"short",S,"silent"]],["give",[S,"short",S,"silent"]],["live",[S,"short",S,"silent"]],["one",["short",S,"silent"]],["were",[S,"rcontrolled","rcontrolled","silent"]],["here",[S,"rcontrolled","rcontrolled","silent"]],["where",[S,S,"rcontrolled","rcontrolled","silent"]],["there",[S,S,"rcontrolled","rcontrolled","silent"]],["above",["schwa",S,"short",S,"silent"]],["become",[S,"short",S,"short",S,"silent"]],["people",[S,"long","silent",S,S,"silent"]],["again",["schwa",S,"long","long",S]],["said",[S,"short","short",S]],["says",[S,"short","short",S]]]),ts=new Map(Ce.map(e=>[e.word.toLowerCase(),e])),jt=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function ns(e){return jt[e]??"consonant"}function Dt(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=Gt(s),a=Ft(s),r=Pt.get(s),d=[];let i=0;for(let l=0;l<t.length;l++){const u=t[l]||"",p=u.length||1;let g=ns(n[l]);ot.has(g)&&(g=(r==null?void 0:r[i])??fe(s,u,i,g,o,a)),d.push(g),i+=p}return d}const ss="aeiou",os="bcdfghjklmnpqrstvwxyz",wt=e=>ss.includes(e),as=e=>os.includes(e),Ut=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),rs=Object.keys(Ut).sort((e,t)=>t.length-e.length);function is(e,t,n){const s=[],o=e.length;let a=0;for(;a<o;){if(a===o-3&&wt(e[a])&&as(e[a+1])&&e[a+2]==="e"){s.push({len:1,sound:fe(e,e[a],a,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let r=!1;for(const d of rs)if(e.startsWith(d,a)){s.push({len:d.length,sound:fe(e,d,a,Ut[d],t,n)}),a+=d.length,r=!0;break}if(!r){if(wt(e[a])||e[a]==="y"&&a>0){const d=a===o-1?"long":"short";s.push({len:1,sound:fe(e,e[a],a,d,t,n)}),a+=1;continue}s.push({len:1,sound:null}),a+=1}}return s}function ls(e,t,n,s){const o=[];let a=0;for(let r=0;r<e.graphemes.length;r++){const d=e.graphemes[r],i=d.length;if(i===2&&d[1]==="e"&&Ne.includes(d[0])&&a+2===t.length&&(s!=null&&s.has(a+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),a+=2;continue}let l=jt[e.types[r]]??null;!ot.has(l)&&l!=="silent"&&(l=null),l=fe(t,d,a,l,n,s),o.push({len:i,sound:l}),a+=i}return o}function cs(e){var r;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||$n.has(t))return null;const n=Pt.get(t);if(n){const d=[];for(const i of n){const l=d[d.length-1];l&&l.sound===i?l.len+=1:d.push({len:1,sound:i})}return d}const s=Gt(t),o=Ft(t),a=ts.get(t);return(r=a==null?void 0:a.graphemes)!=null&&r.length?ls(a,t,s,o):is(t,s,o)}function ds(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var a;const n=cs(t);if(!n)return t;let s="",o=0;for(const{len:r,sound:d}of n){const i=t.slice(o,o+r);if(o+=r,!d){s+=i;continue}const l=(a=re[d])==null?void 0:a.cue;s+=`<span class="vs vs--${d}"${l?` data-cue="${l}"`:""}>${i}</span>`}return o<t.length&&(s+=t.slice(o)),s})}const us="giri_friends_unlocked";function zt(){return kn(us)}const ps=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function hs(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function gs(e){if(!e||!e.id)return null;const t=ps[e.id]||hs(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function Yt(){try{const e=localStorage.getItem(zt()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function ms(e){try{localStorage.setItem(zt(),JSON.stringify(Array.from(e)))}catch{}}function fs(e){if(!e||typeof e!="string")return!1;const t=Yt();return t.has(e)?!1:(t.add(e),ms(t),!0)}function bs(e){const t=Yt();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=gs(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function Kt(e){const t=bs(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const Vt="giri_fluency_history",St=5,J=new Map,ys=10;function vs(e,t){for(J.set(e,t);J.size>ys;){const n=J.keys().next().value;J.delete(n)}}let ne=null,A=null,Ke=[],se=null,be=null,We="idle",B=null;async function Jt({storyId:e,lineIdx:t,onStateChange:n}={}){if(We==="recording")return!1;be=n??null,Ke=[];try{ne=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return G("error"),!1}const s=$s();try{A=new MediaRecorder(ne,s?{mimeType:s}:{})}catch{A=new MediaRecorder(ne)}return A.ondataavailable=o=>{o.data.size>0&&Ke.push(o.data)},A.onstop=()=>{const o=new Blob(Ke,{type:A.mimeType||"audio/webm"}),a=`rec_${e}_${t??"full"}_${Date.now()}`;se=a,vs(a,o),Ze(),G("recorded")},A.onerror=()=>{Ze(),G("error")},A.start(),G("recording"),!0}function Re(){A&&A.state==="recording"?A.stop():Ze()}function Qt(e){const t=se,n=t?J.get(t):null;return n?new Promise(s=>{Oe();const o=URL.createObjectURL(n);B=new Audio(o),G("playing"),B.onended=()=>{URL.revokeObjectURL(o),B=null,G("recorded"),s()},B.onerror=()=>{URL.revokeObjectURL(o),B=null,G("recorded"),s()},B.play().catch(()=>{URL.revokeObjectURL(o),B=null,G("recorded"),s()})}):Promise.resolve()}function Oe(){B&&(B.pause(),B=null)}function Xe(e){const t=se;t&&J.delete(t),t===se&&(se=null),Oe(),G("idle")}function Xt(){return We}function Zt(){Re(),Oe(),J.clear(),se=null,We="idle",be=null}function ws(e){const t=tn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wcpm:e.wcpm,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>St&&n.splice(0,n.length-St),t[e.storyId]=n,Es(t)}function en(e){return tn()[e]??[]}function Ss(e){const t=en(e);return t.length===0?null:Math.max(...t.map(n=>n.wcpm))}function G(e){We=e,be==null||be(e)}function Ze(){ne&&(ne.getTracks().forEach(e=>e.stop()),ne=null)}function $s(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function tn(){try{return JSON.parse(localStorage.getItem(Vt)??"{}")}catch{return{}}}let $t=!1;function Es(e){try{localStorage.setItem(Vt,JSON.stringify(e))}catch{if($t)return;$t=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const nn="/phonicsquest/";function ks(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return Ce.find(n=>n.word===t)??null}function sn(e){return e.split(/(\s+|["""'',.!?;:()-]+)/).filter(n=>n.length>0).map(n=>({text:n,type:/^\s+$/.test(n)?"space":/^[^a-zA-Z0-9]+$/.test(n)?"punct":"word"}))}let w=null,W="A",Et=!1,ee="band",pe="aloud",Se=!1,te=null,Te=[],he=null,C="word",$e=!1,ie=-1,Le=[],ye=0,Ge=[],Fe=0,Ee=0;const on="giri_stories_read";function ge(){try{return JSON.parse(localStorage.getItem(on)??"[]")}catch{return[]}}function Pe(e){const t=ge();t.includes(e)||(t.push(e),localStorage.setItem(on,JSON.stringify(t))),fs(e)}let _e=null,ve=null,Ae=!1;const at="giri_show_graphemes",an="giri_show_ruler",rn="giri_ruler_mode",rt="giri_follow_mode",ln="giri_meet_words",kt="giri_comp_log";let R=je(at,!0),K=je(an,!1),q=null,j=null,et=je(rn,"line");C=je(rt,"word");function je(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function oe(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const cn=new Set;function dn(){return new Date().toISOString().slice(0,10)}function un(){try{const e=localStorage.getItem(ln);return e?JSON.parse(e):{}}catch{return{}}}function xs(e){try{localStorage.setItem(ln,JSON.stringify(e))}catch{}}function Ls(e){return cn.has(e)?!0:un()[e]===dn()}function xt(e){cn.add(e);const t=un();t[e]=dn();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];xs(t)}const Lt=new Set,qs=100;function Ve(e){try{const t=localStorage.getItem(kt),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>qs;)n.shift();localStorage.setItem(kt,JSON.stringify(n))}catch{}}function no(e,t){w=e}function so(){_(),ke()}function oo(){_(),st(),Zt(),it(),De()}function De(){te==null||te.remove(),te=null}function ke(){var n,s,o;De(),le();const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ee==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ee==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ee==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Ys()}</button>
    </div>
  `;let t;if(ee==="band"){if(!Et){Et=!0;try{const c={};for(const h of V)(c[n=h.band]??(c[n]=[])).push(h);W=jn(ge(),c)||W}catch{}}const a=O.find(c=>c.band===W)??O[0],r=V.filter(c=>c.band===W&&c.category!=="chapter"&&c.category!=="nonfiction-sg"),d=ge(),i=r.filter(c=>d.includes(c.id)).length,l=Wt(),u=O.map(c=>{var h,m,f;return`
      <button
        class="story-tab${c.band===W?" active":""}${(h=l[c.band])!=null&&h.ready?"":" story-tab--not-ready"}"
        data-band="${c.band}"
        style="--tab-color:${c.color}"
        ${(m=l[c.band])!=null&&m.ready?"":`title="${l[c.band].hint}"`}
      >
        <span class="story-tab-num">${c.band}</span>
        <span class="story-tab-name">${c.label}</span>
        ${(f=l[c.band])!=null&&f.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),p=r.map(c=>Je(c,a,!1,d.includes(c.id))).join(""),g=r.length?Math.round(i/r.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${u}</div>
      <div class="stories-level-strip"
           style="--level-color:${a.color};--level-bg:${a.bg}">
        <span class="slstrip-label">Band ${W}</span>
        <span class="slstrip-name">${a.label}</span>
        <span class="slstrip-sounds">${a.targetSounds}</span>
        <span class="slstrip-prop">${a.prop}</span>
        <span class="slstrip-progress" title="${i} of ${r.length} stories read">
          ${i}/${r.length} read
          <span class="slstrip-progress-bar" style="--pct:${g}%"></span>
        </span>
      </div>
      ${(s=l[W])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${l[W].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${p}</div>
    `}else if(ee==="singapore"){const a=V.filter(i=>i.category==="nonfiction-sg"),r=ge();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${a.map(i=>{const l=O.find(u=>u.band===i.band)??O[0];return Je(i,l,!1,r.includes(i.id))}).join("")}</div>
    `}else{const a=V.filter(i=>i.category==="chapter").sort((i,l)=>(i.chapterNum??0)-(l.chapterNum??0)),r=ge();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${a.map(i=>{const l=O.find(u=>u.band===i.band)??O[0];return Je(i,l,!0,r.includes(i.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(a=>{a.addEventListener("click",()=>{ee=a.dataset.cat,ke()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Ks()}),w.querySelectorAll(".story-tab").forEach(a=>{a.addEventListener("click",()=>{W=a.dataset.band,ke()})}),w.querySelectorAll(".story-card").forEach(a=>{a.addEventListener("click",()=>pn(a.dataset.storyId))})}function Je(e,t,n=!1,s=!1){var d;const o=(d=e.comprehension)!=null&&d.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",a=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",r=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${nn}images/stories/${e.illustration}"
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
        ${Rt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const i=Tt(e).length;return i?`<span class="story-card-support" data-support="independent">👀 ${i} new ${i===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function pn(e){const t=V.find(n=>n.id===e);t&&(_(),Is(t))}function Is(e){var n,s,o;const t=O.find(a=>a.band===e.band)??O[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${nn}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Rt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      ${(()=>{const a=Tt(e);return a.length?`
          <div class="story-prep" aria-labelledby="story-prep-title">
            <p class="story-prep-title" id="story-prep-title">
              👀 Words to know first — tap to hear
            </p>
            <div class="story-prep-words">${a.map(({word:d,display:i,status:l})=>`<button type="button" class="story-prep-word" data-prep-word="${M(d)}"
                       data-status="${M(l)}" aria-label="Hear the word ${M(i)}"
                >${He(i)}</button>`).join("")}</div>
          </div>`:`
          <p class="story-prep story-prep--none">
            ✅ You can sound out every word in this story.
          </p>`})()}

      <!-- Mode toggle — plain-language labels so a grown-up knows which is
           which: listen together, or tap words to sound them out. -->
      <div class="story-mode-toggle" role="group" aria-label="Reading mode">
        <button class="smode-btn${pe==="aloud"?" active":""}" data-mode="aloud"  id="btn-mode-aloud">
          <span class="smode-btn-title">📖 Listen &amp; Follow</span>
          <span class="smode-btn-sub">Giri reads · you follow along</span>
        </button>
        <button class="smode-btn${pe==="decode"?" active":""}" data-mode="decode" id="btn-mode-decode">
          <span class="smode-btn-title">🔤 Sound It Out</span>
          <span class="smode-btn-sub">Tap any word to decode it</span>
        </button>
      </div>

      <!-- Dynamic content area (pre-teach + story body + controls) -->
      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{_(),ke()}),w.querySelectorAll("[data-prep-word]").forEach(a=>{a.addEventListener("click",()=>{var r,d;(d=(r=Q.speakSightWord(a.dataset.prepWord))==null?void 0:r.catch)==null||d.call(r,()=>{}),a.classList.add("story-prep-word--said"),setTimeout(()=>a.classList.remove("story-prep-word--said"),600)})}),(s=document.getElementById("btn-mode-aloud"))==null||s.addEventListener("click",()=>{pe="aloud",_(),qt("aloud"),we(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{pe="decode",_(),qt("decode"),we(e)}),we(e)}function we(e){Ls(e.id)?pe==="aloud"?xe(e):bn(e):_s(e)}function qt(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function _s(e){var c,h;const t=document.getElementById("story-dynamic");if(!t)return;le(),Te=e.vocab??[];const n=At(e),s=e.lines.map(m=>m.text??"").join(" ").toLowerCase(),o=Te.filter(m=>{const f=m.word.toLowerCase().split(/\s+/)[0];return s.includes(f)});if(!n.length&&!o.length){xt(e.id),we(e);return}const a=n.length+o.length,d=Math.min(3,a),i=new Set,l=n.map(m=>`
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
        Tap <strong>any ${d}</strong> to warm up — or skip if you already
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
        <span class="gate-progress" id="gate-progress" aria-live="polite">0 of ${d} tapped</span>
        <button class="btn btn--ghost" id="gate-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="gate-continue" type="button" disabled>Start Reading →</button>
      </div>
    </div>
  `;function p(m){const f=m.dataset.tapId;if(i.has(f))return;i.add(f),m.setAttribute("data-tapped","true");const b=document.getElementById("gate-progress");if(b&&(b.textContent=i.size>=d?`✓ Warmed up (${i.size} tapped) — keep going or start the story`:`${i.size} of ${d} tapped`),i.size>=d){const E=document.getElementById("gate-continue");E&&(E.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(m=>{m.addEventListener("click",async()=>{nt(m);try{await Q.speakWord(m.dataset.word)}catch{}p(m)})});const g=()=>{xt(e.id),we(e)};(c=document.getElementById("gate-skip"))==null||c.addEventListener("click",g),(h=document.getElementById("gate-continue"))==null||h.addEventListener("click",g)}function Rs(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function xe(e){var u,p,g,c,h,m,f,b,E;const t=document.getElementById("story-dynamic");if(!t)return;le(),De();const n=e.lines.map((y,k)=>Ws(y,k,!0,e)).join(""),s=!!((u=e.comprehension)!=null&&u.length),a=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(y=>`<li>${y}</li>`).join("")}
      </ul>
    </div>
  `:"",r=en(e.id),d=Ss(e.id),i=r.length>0?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent Attempts</span>
        ${d!==null?`<span class="fluency-history-best">Best: <strong>${d}</strong> wpm</span>`:""}
      </div>
      <div class="fluency-history-list">
        ${r.slice().reverse().map(y=>{const k=new Date(y.date);return`<span class="fluency-history-item">${`${k.getDate()}/${k.getMonth()+1}`}: <strong>${y.wcpm}</strong> wpm</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${R}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${K}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${C==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${C==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${R?fn():""}

      <div class="story-body story-body--follow-${C}" id="story-body" aria-live="polite">${n}</div>

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
      ${s?`
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
              <span class="rtg-label">${xn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${Nn()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(y=>{y.addEventListener("click",()=>{C=y.dataset.follow,oe(rt,C),xe(e)})}),t.querySelectorAll(".wf-word").forEach(y=>{y.setAttribute("role","button"),y.setAttribute("tabindex","0");const k=L=>{const F=ct(y);F&&(L.preventDefault(),q==null||q.tap(L.clientY??0,y),js(F))};y.addEventListener("click",k),y.addEventListener("keydown",L=>{(L.key==="Enter"||L.key===" ")&&k(L)})}),(g=document.getElementById("btn-toggle-graphemes"))==null||g.addEventListener("click",()=>{R=!R,oe(at,R),xe(e)}),(c=document.getElementById("btn-toggle-ruler"))==null||c.addEventListener("click",()=>{var y,k;K=!K,oe(an,K),(y=document.getElementById("btn-toggle-ruler"))==null||y.setAttribute("aria-pressed",String(K)),le(),K&&(tt(),(k=document.getElementById("btn-ruler-next"))==null||k.focus({preventScroll:!0}))}),K&&requestAnimationFrame(()=>tt()),(h=document.getElementById("btn-story-play"))==null||h.addEventListener("click",()=>vn(e)),(m=document.getElementById("btn-story-stop"))==null||m.addEventListener("click",()=>_());const l=Rs(e);(f=document.getElementById("btn-fluency-start"))==null||f.addEventListener("click",()=>Qs()),(b=document.getElementById("btn-fluency-done"))==null||b.addEventListener("click",()=>st(l,e)),Vs(e),it(),Cs(e),Js(e),(E=document.getElementById("btn-launch-quest"))==null||E.addEventListener("click",()=>{_(),st(),Zt(),Pe(e.id),In(w,e,()=>{ke()})})}function Ts(){const e=document.getElementById("story-body"),t=e?Nt(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),a=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,r=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),d=(o?Math.min(o.getBoundingClientRect().top,r):r)-12;return{top:Math.max(0,a),bottom:Math.max(d,a+120)}}function Be(){return me.find(e=>e.id===et)??me[1]}function As(){const e=Be();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${M(e.label)}. Tap to change."
              title="${M(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${He(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function tt(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=As();const s=Be(),o=n.querySelector(".ruler-pos small"),a=n.querySelector(".ruler-pos b"),r=n.querySelector("#btn-ruler-next"),d=n.querySelector("#btn-ruler-back");q=Pn(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Ts,onMove(i){j=i;const l=s.id==="word";o.textContent=l?"Word":"Line",a.textContent=l?`${i.word+1} / ${i.words}`:`${i.line+1} / ${i.lines}`,d.disabled=l?i.word===0:i.line===0,r.textContent=i.atEnd?"The end ✓":l?"Next word ▶":"Next line ▶",r.classList.toggle("is-end",i.atEnd)}}),d.addEventListener("click",()=>q==null?void 0:q.prev()),r.addEventListener("click",()=>{var l;if(!(j!=null&&j.atEnd))return q==null?void 0:q.next();const i=((l=document.getElementById("story-quest-cta"))==null?void 0:l.hidden)===!1?document.getElementById("btn-launch-quest"):document.getElementById("btn-story-play");i==null||i.scrollIntoView({behavior:X(),block:"center"}),i==null||i.focus({preventScroll:!0})}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var u;const i=(j==null?void 0:j.word)??0,l=me.indexOf(Be());et=me[(l+1)%me.length].id,oe(rn,et),le(),tt(i),(u=document.getElementById("btn-ruler-style"))==null||u.focus({preventScroll:!0})})}function le(){q==null||q.destroy(),q=null,j=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function Bs(e){var s,o;if(!q||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Be().id==="word",n={ArrowDown:()=>q.nextLine(),ArrowUp:()=>q.prevLine(),ArrowRight:()=>t?q.next():q.nextLine(),ArrowLeft:()=>t?q.prev():q.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",Bs);function Cs(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>Ms(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>Hs(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>mn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{it(),xe(e)})}function D(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function hn(){const e=Le[ie];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function Ms(e){var n,s,o;if(C!=="word"){C="word",oe(rt,C),xe(e);const a=document.getElementById("practice-drawer");a&&(a.open=!0);const r=document.getElementById("rtg-bar");r&&(r.open=!0)}_();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(a=>a.querySelector(".wf-word")).map(a=>Number(a.dataset.line));t.length!==0&&($e=!0,Le=t,ie=0,ye=0,Ge=[],Fe=0,Ee=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),gn(),D("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function gn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=hn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:X()}))}async function Hs(e){var u;const t=hn(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(ct).filter(Boolean).join(" ");if(!o){mn(e);return}n.disabled=!0,n.replaceChildren(qn("encourage"),document.createTextNode("Giri is listening…")),D("Go ahead — read the glowing line now.");const a=await Wn(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!$e)return;if(!a){ye++,ye>=2?D("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):D("Giri couldn't hear that — move a little closer to the microphone and try again!");return}ye=0;const r=[];a.words.forEach((p,g)=>{const c=s[g];if(c)if(c.classList.remove("rtg-word--match","rtg-word--check"),p.status==="miss"){c.classList.add("rtg-word--check");const h=p.word.replace(/[^a-z]/g,"");h.length>2&&(r.push(h),Ht(h))}else c.classList.add("rtg-word--match")});const d=a.words.filter(p=>p.status!=="miss").length;Fe+=d,Ee+=a.words.length,Ge.push(...r);const i=ie>=Le.length-1;r.length>0?D(`Nice reading! Let's check the orange ${r.length===1?"word":"words"} together — tap ${r.length===1?"it":"each one"} to hear it. Then ${i?"finish up":"go on"}!`):D("⭐ Great — Giri heard every word!"),(u=document.getElementById("btn-rtg-listen"))==null||u.setAttribute("hidden","");const l=document.getElementById("btn-rtg-next");l&&(l.textContent=i?"🌟 Finish":"Next line →",l.removeAttribute("hidden"),l.focus())}function mn(e){var t,n;if(ie>=Le.length-1){Ns(e);return}ie++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),gn(),D("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Ns(e){var d,i;const t=Ee>0?Math.round(Fe/Ee*100):0,n=[...new Set(Ge)],s={...ae.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},ae.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(l=>l.classList.remove("sline--rtg-current")),(d=document.getElementById("btn-rtg-next"))==null||d.setAttribute("hidden",""),(i=document.getElementById("btn-rtg-exit"))==null||i.setAttribute("hidden","");const a=document.getElementById("btn-rtg-start");a&&(a.removeAttribute("hidden"),a.textContent="Read it again");const r=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";D(`🌟 You read the whole story to Giri — ${t}% heard clearly.${r}`),Pe(e.id),$e=!1}function it(){$e&&On(),$e=!1,ie=-1,Le=[],ye=0,Ge=[],Fe=0,Ee=0}function lt(e){return!R||!e?e:ds(e)}function fn(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${Dn.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Ws(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${He(o)}</div>`;const a=s?lt(o,s.targetGraphemes,s.band):o,r=n?Os(o,s):a;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${r}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${r}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${r}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${r}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${r}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${r}</p>`;default:return`<p class="sline"                    data-line="${t}">${r}</p>`}}function Os(e,t=null){if(!e)return"";const n=sn(e);let s=0;return n.map(o=>{if(o.type==="word"){const a=t?lt(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${M(o.text)}" aria-label="${M(o.text)}">${a}</span>`}return o.text}).join("")}function ct(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function bn(e){var l,u,p,g;const t=document.getElementById("story-dynamic");if(!t)return;le(),De(),Te=e.vocab??[];const s=At(e).map(c=>`
    <button class="hfw-chip" data-word="${c}" aria-label="Hear sight word ${c}">
      ⭐ ${c}
    </button>
  `).join(""),o=e.lines.map(c=>c.text??"").join(" ").toLowerCase(),r=Te.filter(c=>{const h=c.word.toLowerCase().split(/\s+/)[0];return o.includes(h)}).map(c=>`
    <button class="vocab-chip" data-word="${c.word}" aria-label="Key word: ${c.word}">
      <span class="vocab-chip-icon">${c.icon}</span>
      <span class="vocab-chip-word">${c.word}</span>
      <span class="vocab-chip-meaning">${c.meaning}</span>
    </button>
  `).join(""),d=e.lines.map((c,h)=>{if(c.type==="label")return`<div class="sline sline--label" data-line="${h}">${c.text}</div>`;const f=sn(c.text).map(E=>{if(E.type==="word"){const y=E.text.toLowerCase().replace(/[^a-z]/g,""),k=Bt(y),L=lt(E.text,e.targetGraphemes,e.band);return`<button class="decode-word${k?" decode-hfw":""}"
                         data-word="${E.text}"
                         aria-label="${k?"Sight word: ":"Decode: "}${E.text}"
                >${L}</button>`}return`<span class="decode-punct">${E.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[c.type]??""} decode-line" data-line="${h}">${f}</p>`}).join("");t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${R}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
      </div>
      ${R?fn():""}

      <!-- Sight word pre-teach -->
      <div class="hfw-preteach" id="hfw-preteach">
        <div class="hfw-preteach-header">
          <span class="hfw-preteach-title">⭐ Sight Words in this story</span>
          <button class="hfw-toggle-btn" id="btn-hfw-toggle" aria-expanded="true" aria-controls="hfw-chip-list">
            Hide ▲
          </button>
        </div>
        <div id="hfw-chip-list" class="hfw-chip-list">
          ${s.length?s:'<span class="hfw-none">None — all words are fully decodable!</span>'}
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
        ${d}
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
  `,(l=document.getElementById("btn-toggle-graphemes-decode"))==null||l.addEventListener("click",()=>{R=!R,oe(at,R),bn(e)}),(u=document.getElementById("btn-hfw-toggle"))==null||u.addEventListener("click",()=>{const c=document.getElementById("hfw-chip-list"),h=document.getElementById("btn-hfw-toggle"),m=h.getAttribute("aria-expanded")==="true";c.hidden=m,h.setAttribute("aria-expanded",String(!m)),h.textContent=m?"Show ▼":"Hide ▲"}),(p=document.getElementById("btn-vocab-toggle"))==null||p.addEventListener("click",()=>{const c=document.getElementById("vocab-chip-list"),h=document.getElementById("btn-vocab-toggle"),m=h.getAttribute("aria-expanded")==="true";c.hidden=m,h.setAttribute("aria-expanded",String(!m)),h.textContent=m?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(c=>{c.addEventListener("click",()=>{var f,b;const h=c.dataset.word;nt(c);const m=new SpeechSynthesisUtterance(h);m.rate=.85,U(m),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),t.querySelectorAll(".vocab-chip").forEach(c=>{c.addEventListener("click",()=>{var f,b;const h=c.dataset.word;nt(c),c.classList.toggle("vocab-chip--expanded");const m=new SpeechSynthesisUtterance(h);m.rate=.85,U(m),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),(g=document.getElementById("btn-mark-read"))==null||g.addEventListener("click",c=>{Pe(e.id);const h=c.currentTarget;h.textContent="✓ Read!",h.disabled=!0,h.classList.add("btn--success"),Sn(e)});const i=document.getElementById("decode-panel");i&&(i.remove(),document.body.appendChild(i)),te=i,t.querySelectorAll(".decode-word").forEach(c=>{c.addEventListener("click",()=>Gs(c))})}async function Gs(e){var r,d,i,l;document.querySelectorAll(".decode-word.decoding").forEach(u=>u.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,n=t.toLowerCase().replace(/[^a-z]/g,""),s=ks(t),o=!s&&Bt(n),a=te;if(a)if(a.removeAttribute("hidden"),o){Qe({type:"hfw",word:n});const u=new SpeechSynthesisUtterance(n);u.rate=.85,U(u),(r=window.speechSynthesis)==null||r.cancel(),(d=window.speechSynthesis)==null||d.speak(u)}else if(s)Qe({type:"decode",word:s.word,wordObj:s}),await yn(s);else{Qe({type:"tts",word:n});const u=new SpeechSynthesisUtterance(n);u.rate=.85,U(u),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(u)}}function Qe({type:e,word:t,wordObj:n}){var r,d,i;const s=document.getElementById("decode-panel-inner");if(!s)return;if(e==="hfw"){s.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(r=document.getElementById("dp-hear"))==null||r.addEventListener("click",()=>{var u,p;const l=new SpeechSynthesisUtterance(t);l.rate=.85,U(l),(u=window.speechSynthesis)==null||u.cancel(),(p=window.speechSynthesis)==null||p.speak(l)});return}if(e==="tts"){s.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(d=document.getElementById("dp-hear"))==null||d.addEventListener("click",()=>{var u,p;const l=new SpeechSynthesisUtterance(t);l.rate=.85,U(l),(u=window.speechSynthesis)==null||u.cancel(),(p=window.speechSynthesis)==null||p.speak(l)});return}const o=Dt(n.word,n.graphemes,n.types),a=n.graphemes.map((l,u)=>{const p=re[o[u]]??re.consonant,g=p.mark?` data-mark="${M(p.mark)}"`:"";return`<span class="dp-tile" data-idx="${u}"${g} style="--tile-color:${p.color}"
                    title="${M(p.label)}" aria-label="${M(`${l}, ${p.label}`)}">${He(l)}</span>`}).join("");s.innerHTML=`
    <div class="dp-decode">
      <div class="dp-tiles" id="dp-tiles">${a}</div>
      <span class="dp-word" id="dp-word-label">${n.word}</span>
      <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
    </div>
  `,(i=document.getElementById("dp-hear"))==null||i.addEventListener("click",async()=>{await yn(n)})}async function yn(e){const t=document.querySelectorAll(".dp-tile");for(let s=0;s<e.graphemes.length;s++){t.forEach((a,r)=>a.classList.toggle("dp-tile--active",r===s));const o=s>0?e.graphemes[s-1]:null;await Q.speakPhoneme(e.graphemes[s],e.types[s],{word:e.word,prevGrapheme:o}),await _t(200)}t.forEach(s=>s.classList.remove("dp-tile--active")),await _t(250);const n=document.getElementById("dp-word-label");n&&n.classList.add("dp-word--blend");try{await Q.speakWord(e.word)}finally{n&&n.classList.remove("dp-word--blend")}}function nt(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function Fs(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const a=n[s+1];if(a&&a.type==="beat"){t.push({text:`${o.text} ${a.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function vn(e){if(!window.speechSynthesis)return;_(),he=e,dt(!0),Se=!0;const t=Fs(e);wn(t,0)}function wn(e,t){if(!Se||t>=e.length){It();return}const n=e[t];zs(n.highlightIdx);const s=new SpeechSynthesisUtterance(n.text);s.rate=.82,U(s);const o=n.text.startsWith("Puff")?600:380;C==="word"&&Ps(s,n.highlightIdx),s.onend=()=>{Ue(),Se&&setTimeout(()=>wn(e,t+1),o)},s.onerror=()=>It(),window.speechSynthesis.speak(s)}function Ps(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=e.text||"";let a=!1,r=-1,d=[],i=!1;function l(c){if(c<0||c>=s.length||c===r)return;r=c,s.forEach(m=>m.classList.remove("wf-word--active"));const h=s[c];h.classList.add("wf-word--active"),q?q.follow(h):Us(h)}function u(){for(const c of d)clearTimeout(c);d=[]}function p(){var f;if(i)return;i=!0;const c=typeof e.rate=="number"&&e.rate>0?e.rate:.82,h=Array.from(s,ct);let m=0;for(let b=0;b<s.length;b++){const E=b,y=((f=h[b])==null?void 0:f.length)||3,k=Math.max(160,Math.round((90+y*60)/c)),L=setTimeout(()=>{a||l(E)},m);d.push(L),m+=k}}e.addEventListener("boundary",c=>{c.name&&c.name!=="word"||(a=!0,u(),l(_n(o,c.charIndex??-1)))}),e.addEventListener("end",()=>{u()}),e.addEventListener("start",()=>{if(a)return;const c=setTimeout(()=>{a||(l(0),p())},180);d.push(c)});const g=setTimeout(()=>{a||i||(l(0),p())},800);d.push(g)}function js(e){var o;const t=document.getElementById("word-detective-content");if(!t)return;_();const n=An(e);t.innerHTML=Ds(n),ue.open("modal-word-detective");try{Q.speakWord(n.text)}catch{}(o=t.querySelector('[data-action="hear"]'))==null||o.addEventListener("click",()=>{try{Q.speakWord(n.text)}catch{}});const s=t.querySelector('[data-action="add-review"]');s==null||s.addEventListener("click",()=>{if(!n.word)return;Ht(n.word.id)&&(s.disabled=!0,s.textContent="✓ In your Review Lane")})}function Ds(e){const t=a=>String(a??"").replace(/[<>&]/g,r=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[r]),n=Dt(e.text,e.graphemes,e.types),s=e.graphemes.map((a,r)=>{const d=re[n[r]]??re.consonant,i=d.mark?` data-mark="${t(d.mark)}"`:"";return`<span class="wd-tile vs--${n[r]}"${i} style="--tile-color:${d.color}" aria-label="${t(a)}, ${t(d.label)}">${t(a)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:`<p class="wd-note">This word isn't in the practice bank — but you can still hear its sounds.</p>`;return`
    <div class="wd-card">
      <p class="wd-word">${t(e.text)}</p>
      <div class="wd-tiles" aria-label="Sound breakdown">${s}</div>
      <div class="wd-actions">
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
        ${o}
      </div>
    </div>`}function X(){return Ln()?"auto":"smooth"}function Us(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;Rn(t,n)&&e.scrollIntoView({block:"center",behavior:X()})}catch{}}function Ue(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function zs(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),Ue();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");q&&n?q.follow(n):t.scrollIntoView({behavior:X(),block:"nearest"})}}function U(e){var n,s;let t;try{t=((s=(n=Q).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function _(){var e;Se=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ue(),dt(!1)}function It(){Se=!1,w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ue(),dt(!1),he&&Pe(he.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),he&&Sn(he)}function Sn(e){var r,d,i;if(!e||!((r=e.talkAboutIt)!=null&&r.length)||Lt.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Lt.add(e.id);const n=e.talkAboutIt[0],s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
    <h4>💬 Quick check</h4>
    <div class="comp-q" id="comp-q">${n}</div>
    <div class="comp-choices">
      <button class="comp-choice" data-resp="confident" type="button">🙂 I can answer this</button>
      <button class="comp-choice" data-resp="reread" type="button">🤔 Let me re-read</button>
      <button class="comp-choice" data-resp="hint" type="button">💭 Show me where</button>
    </div>
    <div class="comp-feedback" id="comp-feedback" hidden></div>
    ${s?'<button class="comp-more" id="comp-more" type="button" hidden>💬 One more question</button>':""}
    <button class="comp-skip" id="comp-skip" type="button">Skip</button>
  `,t.appendChild(o),o.scrollIntoView({behavior:X(),block:"nearest"});const a=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.resp;if(Ve({storyId:e.id,question:n,response:u}),o.querySelectorAll(".comp-choice").forEach(g=>g.disabled=!0),l.classList.add("correct"),u==="confident")a.textContent="👍 Great! You understood the story.";else if(u==="reread")a.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>vn(e),300);else{a.textContent="💡 Look at the end of the story for clues.";const g=w==null?void 0:w.querySelector(".sline.sline--end, .sline:last-of-type");g==null||g.scrollIntoView({behavior:X(),block:"center"})}a.hidden=!1;const p=o.querySelector("#comp-more");p&&(p.hidden=!1)})}),(d=o.querySelector("#comp-more"))==null||d.addEventListener("click",()=>{var u;const l=o.querySelector("#comp-q");l&&(l.textContent=s),Ve({storyId:e.id,question:s,response:"followup"}),(u=o.querySelector("#comp-more"))==null||u.remove(),a&&(a.textContent="💭 Have a think, then tell someone your answer.",a.hidden=!1),o.querySelectorAll(".comp-choice").forEach(p=>{p.disabled=!1,p.classList.remove("correct")})}),(i=o.querySelector("#comp-skip"))==null||i.addEventListener("click",()=>{Ve({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Ys(){try{const e=Kt(V);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Ks(){var r,d;(r=document.getElementById("modal-story-friends"))==null||r.remove();const e=Kt(V),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=i=>String(i??"").replace(/[<>&]/g,l=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[l]),s=new Map;for(const i of e.roster)s.has(i.band)||s.set(i.band,[]),s.get(i.band).push(i);const o=Array.from(s.entries()).sort((i,l)=>String(i[0]).localeCompare(String(l[0]))).map(([i,l])=>{const u=l.filter(g=>g.unlocked).length,p=l.map(g=>`
        <button class="sf-tile ${g.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${n(g.storyId)}"
                ${g.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${g.unlocked?`${n(g.name)} from ${n(g.storyTitle)} — tap to re-read`:`Locked — read ${n(g.storyTitle)} to meet ${n(g.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${g.unlocked?n(g.emoji):"🔒"}</span>
          <span class="sf-tile__name">${g.unlocked?n(g.name):"???"}</span>
          ${g.unlocked?`<span class="sf-tile__story">from ${n(g.storyTitle)}</span>`:`<span class="sf-tile__story">${n(g.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${n(i)} <small>${u}/${l.length} met</small></h3>
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
    </div>`,document.body.appendChild(t),ue.open("modal-story-friends"),(d=t.querySelector("[data-close]"))==null||d.addEventListener("click",()=>{ue.close("modal-story-friends"),t.remove()}),t.addEventListener("click",i=>{i.target===t&&(ue.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.storyId;l&&(ue.close("modal-story-friends"),t.remove(),pn(l))})})}function dt(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}const _t=e=>new Promise(t=>setTimeout(t,e));function Vs(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),a=document.getElementById("recording-status");if(!t)return;function r(d){if(t.hidden=d!=="idle",n.hidden=d!=="recording",s.hidden=d!=="recorded"&&d!=="playing",o.hidden=d!=="recorded"&&d!=="playing",a)switch(d){case"recording":a.textContent="🔴 Recording...",a.className="recording-status recording-status--active";break;case"recorded":a.textContent="✓ Recording ready",a.className="recording-status recording-status--ready";break;case"playing":a.textContent="▶ Playing...",a.className="recording-status recording-status--playing";break;case"error":a.textContent="⚠ Microphone not available — check permissions",a.className="recording-status recording-status--error";break;default:a.textContent="",a.className="recording-status";break}s&&(s.textContent=d==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await Jt({storyId:e.id,onStateChange:r})||r("error")}),n.addEventListener("click",()=>{Re()}),s.addEventListener("click",()=>{Xt()==="playing"?(Oe(),r("recorded")):Qt()}),o.addEventListener("click",()=>{Xe(),r("idle")})}function Js(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),a=document.getElementById("btn-echo-stop"),r=document.getElementById("echo-read-status");if(!t)return;const d=e.lines.map((p,g)=>({...p,idx:g})).filter(p=>p.type!=="label"&&p.type!=="chapter"&&p.text);let i=-1;function l(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,a.hidden=!0,r&&(r.textContent="",r.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(p=>p.classList.remove("sline--echo-active")),i=-1}function u(p){var m,f;i=p;const g=d[p];if(!g){l();return}g.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(b=>b.classList.remove("sline--echo-active"));const c=w==null?void 0:w.querySelector(`[data-line="${g.idx}"]`);c&&(c.classList.add("sline--echo-active"),c.scrollIntoView({behavior:X(),block:"nearest"})),r&&(r.textContent=`Line ${p+1} of ${d.length}`,r.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const h=new SpeechSynthesisUtterance(g.text);h.rate=.82,U(h),h.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",r&&(r.textContent=`Your turn! Read line ${p+1}`)},h.onerror=()=>{s.hidden=!1},(m=window.speechSynthesis)==null||m.cancel(),(f=window.speechSynthesis)==null||f.speak(h)}t.addEventListener("click",()=>{t.hidden=!0,a.hidden=!1,u(0)}),s.addEventListener("click",async()=>{if(Xt()==="recording"){Re();return}const p=d[i];!await Jt({storyId:e.id,lineIdx:p==null?void 0:p.idx,onStateChange:c=>{c==="recording"?(s.textContent="⏹ Stop Recording",r&&(r.textContent="🔴 Recording...",r.className="echo-read-status echo-read-status--recording")):c==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=i>=d.length-1,r&&(r.textContent="✓ Great job!",r.className="echo-read-status echo-read-status--done")):c==="error"&&r&&(r.textContent="⚠ Microphone not available",r.className="echo-read-status echo-read-status--error")}})&&r&&(r.textContent="⚠ Microphone not available — check permissions",r.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{Qt()}),n.addEventListener("click",()=>{Xe(),o.hidden=!0,i+1<d.length?u(i+1):(r&&(r.textContent="🎉 Echo Read complete!",r.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(l,2e3))}),a.addEventListener("click",()=>{_(),Re(),Xe(),l()})}function Qs(){Ae||(Ae=!0,ve=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,_e=setInterval(()=>{const e=Math.floor((Date.now()-ve)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}function st(e,t){if(!Ae&&_e===null||(clearInterval(_e),_e=null,Ae=!1,document.getElementById("btn-fluency-start").disabled=!1,document.getElementById("btn-fluency-done").disabled=!0,!e||!ve))return;const n=(Date.now()-ve)/1e3;if(ve=null,n<2)return;const s=Math.round(e/n*60),o=Math.floor(n/60),a=Math.round(n%60);t&&ws({storyId:t.id,wcpm:s,durationSec:n,wordCount:e});let r;s>=60?r="🌟 Fluent reader!":s>=40?r="📈 Building fluency — great progress!":r="📖 Keep practising — try reading it again!";const d=document.getElementById("fluency-result");if(d){d.hidden=!1,d.innerHTML=`
      <div class="fluency-result-inner">
        <span class="fluency-time">Time: ${o}:${String(a).padStart(2,"0")}</span>
        <span class="fluency-wcpm"><strong>${s}</strong> words/min</span>
        <span class="fluency-level">${r}</span>
      </div>
      <p class="fluency-tip">Tip: Read the story again to improve your speed!</p>
    `;const i=document.getElementById("story-quest-cta");i&&(i.hidden=!1)}}export{lt as _highlightGraphemes,Ls as _isMeetWordsCompletedToday,Ve as _logComprehensionAttempt,xt as _setMeetWordsCompleted,oo as cleanupStoryMode,no as initStoryMode,so as showBrowser};
