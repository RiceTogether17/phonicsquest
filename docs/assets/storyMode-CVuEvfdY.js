import{S as K,B as G}from"./stories-BYImWThp.js";import{P as Fn,s as Dt,a as zt,e as Ut,i as Yt}from"./decodability-DfxP0G0n.js";import{s as ue,W as Fe,X as Gn,Y as Ge,Z as Kt,C as Vt,q as R,o as jn,_ as ye,$ as se,M as ht,a0 as oe,a1 as Dn,a2 as zn,a3 as Un}from"./index-agXtMfC_.js";import"./gsap-C8pce-KX.js";function Yn(e,t,n){var g;if(!((g=t.comprehension)!=null&&g.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return a();case"comprehension":return r();case"vocab":return c();case"openEnded":return l();case"grammar":return u();case"done":return h()}}function a(){var d,p,m,f;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(d=t.vocab)!=null&&d.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(p=t.grammarSpotlight)!=null&&p.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(m=document.getElementById("sq-start"))==null||m.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(f=document.getElementById("sq-skip"))==null||f.addEventListener("click",()=>n==null?void 0:n())}function r(){const d=t.comprehension[s.qIndex],p=s.qIndex+1,m=s.total;e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${p/m*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${p} of ${m}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${d.q}</p>
          ${d.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${d.options.map((f,y)=>`
            <button class="sq-option" data-idx="${y}" aria-label="${f}">
              <span class="sq-option-letter">${String.fromCharCode(65+y)}</span>
              <span class="sq-option-text">${f}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(f=>{f.addEventListener("click",()=>i(f,d))})}function i(d,p){const m=parseInt(d.dataset.idx,10),f=m===p.answer;f&&s.correct++,document.querySelectorAll(".sq-option").forEach((x,b)=>{x.disabled=!0,b===p.answer&&x.classList.add("sq-option--correct"),b===m&&!f&&x.classList.add("sq-option--wrong")});const y=document.getElementById("sq-feedback");y&&(y.hidden=!1,y.className=`sq-feedback ${f?"sq-feedback--correct":"sq-feedback--wrong"}`,y.textContent=f?"✅ Great thinking!":`✨ The answer is: ${p.options[p.answer]}`);const E=document.getElementById("sq-next");E&&(E.hidden=!1,E.addEventListener("click",()=>{var x,b,v;s.qIndex++,s.qIndex<s.total||(s.phase=(x=t.openEnded)!=null&&x.length?"openEnded":(b=t.vocab)!=null&&b.length?"vocab":(v=t.grammarSpotlight)!=null&&v.length?"grammar":"done",s.vocabIndex=0),o()}))}function l(){var p,m,f;const d=t.openEnded||[];if(!d.length){s.phase=(p=t.vocab)!=null&&p.length?"vocab":(m=t.grammarSpotlight)!=null&&m.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${d.map((y,E)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${E+1}. ${y.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${y.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${y.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(f=document.getElementById("sq-open-next"))==null||f.addEventListener("click",()=>{var y,E;s.phase=(y=t.vocab)!=null&&y.length?"vocab":(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",o()})}function c(){var E,x,b;const d=t.vocab[s.vocabIndex],p=t.vocab.length,m=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${m} of ${p}</p>

        <div class="sq-flip-card ${s.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
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
          ${s.flipped?`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${m<p?"Next word →":"Done with words!"}
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
    `;const f=document.getElementById("sq-flip-card"),y=()=>{s.flipped=!0,o()};f==null||f.addEventListener("click",y),f==null||f.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&y()}),(E=document.getElementById("sq-flip-btn"))==null||E.addEventListener("click",y),(x=document.getElementById("sq-vocab-next"))==null||x.addEventListener("click",()=>{var v;s.vocabIndex++,s.flipped=!1,s.vocabIndex<p||(s.phase=(v=t.grammarSpotlight)!=null&&v.length?"grammar":"done"),o()}),(b=document.getElementById("sq-vocab-skip"))==null||b.addEventListener("click",()=>{var v;s.phase=(v=t.grammarSpotlight)!=null&&v.length?"grammar":"done",o()})}function u(){var m;const p=(t.grammarSpotlight??[]).map((f,y)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${y+1}</div>
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
        <div class="sq-grammar-list">${p}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(m=document.getElementById("sq-grammar-done"))==null||m.addEventListener("click",()=>{s.phase="done",o()})}function h(){var x;const d=s.total>0?Math.round(s.correct/s.total*100):100,p=d>=80?3:d>=50?2:1,m="⭐".repeat(p)+"☆".repeat(3-p),f=s.correct*15+(d===100?25:0),y=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],E=p===3?y[2]:p===2?y[1]:y[0];e.innerHTML=`
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
    `,(x=document.getElementById("sq-back"))==null||x.addEventListener("click",()=>n==null?void 0:n())}o()}function Kn(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let a=0;a<=n;a++){const r=/\s/.test(e.charAt(a));!r&&!o?(s++,o=!0):r&&(o=!1)}return s<0?-1:s}function Vn(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function Jn(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let be=null;function Jt(){if(be)return be;be=new Map;for(const e of Fe)e!=null&&e.word&&be.set(e.word.toLowerCase(),e);return be}function Qn(e){const t=Jn(e),n=Jt(),s=t?n.get(t):null;if(s){const o=ue.get("wordStats")||{},a=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:a}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Qt(e){return!e||typeof e!="string"||!(Jt().has(e)||Fe.some(s=>(s==null?void 0:s.id)===e))?!1:(ue.recordWordAttempt(e,!0,Gn.EXPOSURE),!0)}const Xn=.62,Zn=.4,Rt=2;function Bt(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function es(e,t,n=(s,o)=>Ge.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(h=>({word:h,status:"miss",heard:null}));const a=-.4,r=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let h=1;h<=s;h++)r[h][0]=h*a;for(let h=1;h<=o;h++)r[0][h]=h*a;const i=Array.from({length:s},(h,g)=>Array.from({length:o},(d,p)=>n(e[g],t[p])));for(let h=1;h<=s;h++)for(let g=1;g<=o;g++){const d=i[h-1][g-1]-.5;r[h][g]=Math.max(r[h-1][g-1]+d,r[h-1][g]+a,r[h][g-1]+a)}const l=new Array(s);let c=s,u=o;for(;c>0;){const h=u>0?i[c-1][u-1]-.5:-1/0;if(u>0&&r[c][u]===r[c-1][u-1]+h){const g=i[c-1][u-1],d=e[c-1];let p;g>=Xn?p="match":g>=Zn||d.length<=Rt?p="unsure":p="miss",l[c-1]={word:d,status:p,heard:t[u-1]},c--,u--}else if(u>0&&r[c][u]===r[c][u-1]+a)u--;else{const g=e[c-1];l[c-1]={word:g,status:g.length<=Rt?"unsure":"miss",heard:null},c--}}return l}function ts(e,t,n){const s=Bt(e);let o=null;for(const a of t||[]){const r=es(s,Bt(a.text),n),i=r.filter(l=>l.status==="match").length;(!o||i>o.matchCount)&&(o={words:r,matchCount:i,total:s.length})}return o||{words:s.map(a=>({word:a,status:"miss",heard:null})),matchCount:0,total:s.length}}function ns(){return Ge.supported}async function ss(e){const t=await Ge.listenTranscript({timeoutMs:12e3});return t?ts(e,t.transcripts):null}function os(){Ge.stop()}const we=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function as(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const rs=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function je(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function is(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:a}){var _t,Tt,At;const r=[...e.querySelectorAll(s)];let i=[],l=0,c=0;const u=document.createElement("div");u.className=`ruler-layer ruler-layer--${t}`,u.setAttribute("aria-hidden","true"),u.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(u);const h=()=>{const S=r[l]??r[0]??e;return parseFloat(getComputedStyle(S).fontSize)||20},g=S=>u.querySelector(S),d=g(".ruler-veil--above"),p=g(".ruler-veil--below"),m=g(".ruler-strip"),f=g(".ruler-word"),y=g(".ruler-bar");function E(){const S=e.getBoundingClientRect();i=as(r.map(k=>{const q=k.getBoundingClientRect();return q.width||q.height?{top:q.top-S.top,bottom:q.bottom-S.top}:null}))}const x=S=>{const k=i.findIndex(q=>S>=q.first&&S<=q.last);return k<0?0:k};function b(){const S=i[c];if(!S)return;const k=h(),q=k*.6,B=S.bottom+k*.18,M=Math.max(12,k*.55),P=e.scrollHeight;d.style.height=`${Math.max(0,S.top-q)}px`,p.style.top=`${B+M}px`,p.style.height=`${Math.max(0,P-B-M)}px`,m.style.top=`${S.top-q}px`,m.style.height=`${B-(S.top-q)}px`,y.style.top=`${B}px`,y.style.height=`${M}px`;const X=r[l];if(t==="word"&&X){const Z=e.getBoundingClientRect(),z=X.getBoundingClientRect();f.style.left=`${z.left-Z.left-3}px`,f.style.width=`${z.width+6}px`,f.style.top=`${z.top-Z.top-2}px`,f.style.height=`${z.height+4}px`,y.style.setProperty("--x",`${z.left-Z.left+z.width/2}px`)}r.forEach((Z,z)=>Z.classList.toggle("is-pointed",t==="word"&&z===l))}function v(){a==null||a({word:l,line:c,lines:i.length,words:r.length,atEnd:t==="word"?l>=r.length-1:c>=i.length-1})}function I(){const S=i[c];if(!S)return;const k=e.getBoundingClientRect(),q=h(),B=k.top+S.top-q*.6,M=k.top+S.bottom+q*1.2,P=o();if(B>=P.top&&M<=P.bottom)return;const X=P.top+(P.bottom-P.top)*.28,Z={top:B-X,behavior:rs()?"auto":"smooth"};(je(e)??window).scrollBy(Z)}function _(S,{scroll:k=!0}={}){var q;c=Math.max(0,Math.min(i.length-1,S)),l=((q=i[c])==null?void 0:q.first)??0,b(),v(),k&&I()}function Q(S,{scroll:k=!0}={}){l=Math.max(0,Math.min(r.length-1,S)),c=x(l),b(),v(),k&&I()}function Be(S){const k=S-e.getBoundingClientRect().top;let q=0,B=1/0;return i.forEach((M,P)=>{const X=k<M.top?M.top-k:k>M.bottom?k-M.bottom:0;X<B&&(B=X,q=P)}),q}let Ce=!1;y.addEventListener("pointerdown",S=>{var k;Ce=!0,(k=y.setPointerCapture)==null||k.call(y,S.pointerId),u.classList.add("is-dragging"),S.preventDefault()}),y.addEventListener("pointermove",S=>{if(!Ce)return;const k=h(),q=Be(S.clientY-k*.6);q!==c&&_(q,{scroll:!1})});const qt=()=>{Ce&&(Ce=!1,u.classList.remove("is-dragging"),I())};y.addEventListener("pointerup",qt),y.addEventListener("pointercancel",qt);let Xe=0;const It=()=>{cancelAnimationFrame(Xe),Xe=requestAnimationFrame(()=>{var S;E(),c=x(l),t!=="word"&&(l=((S=i[c])==null?void 0:S.first)??l),u.classList.add("no-anim"),b(),v(),requestAnimationFrame(()=>u.classList.remove("no-anim"))})},ae=typeof ResizeObserver=="function"?new ResizeObserver(It):null;if(ae==null||ae.observe(e),(Tt=(_t=document.fonts)==null?void 0:_t.ready)==null||Tt.then(It).catch(()=>{}),E(),n==null){const S=o(),k=e.getBoundingClientRect().top,q=i.findIndex(B=>k+B.top>=S.top);c=Math.max(0,q),l=((At=i[c])==null?void 0:At.first)??0}else l=Math.max(0,Math.min(r.length-1,n)),c=x(l);return u.classList.add("no-anim"),b(),v(),requestAnimationFrame(()=>{u.classList.remove("no-anim"),n!=null&&I()}),{next(){t==="word"?Q(l+1):_(c+1)},prev(){t==="word"?Q(l-1):_(c-1)},nextLine:()=>_(c+1),prevLine:()=>_(c-1),tap(S,k){const q=k?r.indexOf(k):-1;q>=0?t==="word"?Q(q,{scroll:!1}):_(x(q),{scroll:!1}):_(Be(S),{scroll:!1})},follow(S){const k=r.indexOf(S);k<0||(t==="word"?k!==l&&Q(k):x(k)!==c&&_(x(k)))},reveal:I,current:()=>r[l]??null,goTo(S){t==="word"?Q(S):_(x(Math.max(0,Math.min(r.length-1,S))))},destroy(){ae==null||ae.disconnect(),cancelAnimationFrame(Xe),r.forEach(S=>S.classList.remove("is-pointed")),e.classList.remove("has-ruler"),u.remove()}}}const ls="giri_story_place",cs=40,ds=30,Xt=8,Zt=()=>Kt(ls);function gt(){try{const e=localStorage.getItem(Zt()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function ot(e){try{localStorage.setItem(Zt(),JSON.stringify(e))}catch{}}function us(e,t=Date.now()){const n=t-ds*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,a)=>a[1].at-o[1].at),Object.fromEntries(s.slice(0,cs))}function en(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=gt();if(t<Xt){if(!(e in s))return;delete s[e],ot(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},ot(us(s,n))}function ps(e){const t=gt()[e];return t&&typeof t.word=="number"&&t.word>=Xt?t.word:null}function mt(e){const t=gt();e in t&&(delete t[e],ot(t))}function Ct(e){const t=ue.get("groupMastery")||{},n=Vt.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function Ze(e){const t=ue.get("groupMastery")||{};return Vt.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function tn(){const e=Ct([1,2,3,4,5]),t=Ze([6]),n=Ct([6])>=.5,s=Ze([8]),o=Ze([7]),a=e>=.6||t,r=a&&(n||s),i=r&&o;return{A:{ready:!0,hint:""},B:{ready:a,hint:a?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:r,hint:r?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:i,hint:i?"":"Best after starting Phase 7 — Diphthongs"}}}function hs(e,t){const n=tn();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(r=>!(e!=null&&e.includes(r.id)))||!o.length)return s}return"A"}const pe=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),gs=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...pe[e]}))),ft=new Set(["short","long","schwa","rcontrolled","diphthong"]),ms=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),De="bcdfghjklmnpqrstvwxyz",fs=new RegExp(`[${De}]a$`),bs=new RegExp("[bcdfghjkmnprstvz]al$"),nn=/[ts]ion$/;function sn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(ms.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&fs.test(e)&&t.add(e.length-1),e.length>=4&&bs.test(e)&&t.add(e.length-2),e.length>=5&&nn.test(e)&&t.add(e.length-3)),t.size?t:null}const ys=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),vs=new RegExp(`[${De}]e$`);function on(e){const t=new Set,n=e.length;if(n>=5&&nn.test(e)&&t.add(n-2),n>=4&&vs.test(e)&&!ys.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];De.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const ws=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Ss=new Set(["been"]),$s=new Set(["friend","friends"]),ks=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),Es=["ing","ed","ly","es","s","n"];function Me(e,t){if(e.has(t))return!0;for(const n of Es)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function Se(e,t,n,s,o,a){return ft.has(s)?a!=null&&a.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&Me(ws,e)||t==="ee"&&Me(Ss,e)||t==="ie"&&Me($s,e)?"short":t==="ow"&&Me(ks,e)?"long":s:s}const $=null,an=new Map([["have",[$,"short",$,"silent"]],["love",[$,"short",$,"silent"]],["come",[$,"short",$,"silent"]],["some",[$,"short",$,"silent"]],["done",[$,"short",$,"silent"]],["gone",[$,"short",$,"silent"]],["none",[$,"short",$,"silent"]],["give",[$,"short",$,"silent"]],["live",[$,"short",$,"silent"]],["one",["short",$,"silent"]],["were",[$,"rcontrolled","rcontrolled","silent"]],["here",[$,"rcontrolled","rcontrolled","silent"]],["where",[$,$,"rcontrolled","rcontrolled","silent"]],["there",[$,$,"rcontrolled","rcontrolled","silent"]],["above",["schwa",$,"short",$,"silent"]],["become",[$,"short",$,"short",$,"silent"]],["people",[$,"long","silent",$,$,"silent"]],["again",["schwa",$,"long","long",$]],["said",[$,"short","short",$]],["says",[$,"short","short",$]]]),Ls=new Map(Fe.map(e=>[e.word.toLowerCase(),e])),rn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function xs(e){return rn[e]??"consonant"}function ln(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=sn(s),a=on(s),r=an.get(s),i=[];let l=0;for(let c=0;c<t.length;c++){const u=t[c]||"",h=u.length||1;let g=xs(n[c]);ft.has(g)&&(g=(r==null?void 0:r[l])??Se(s,u,l,g,o,a)),i.push(g),l+=h}return i}const qs="aeiou",Is="bcdfghjklmnpqrstvwxyz",Mt=e=>qs.includes(e),_s=e=>Is.includes(e),cn=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Ts=Object.keys(cn).sort((e,t)=>t.length-e.length);function As(e,t,n){const s=[],o=e.length;let a=0;for(;a<o;){if(a===o-3&&Mt(e[a])&&_s(e[a+1])&&e[a+2]==="e"){s.push({len:1,sound:Se(e,e[a],a,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let r=!1;for(const i of Ts)if(e.startsWith(i,a)){s.push({len:i.length,sound:Se(e,i,a,cn[i],t,n)}),a+=i.length,r=!0;break}if(!r){if(Mt(e[a])||e[a]==="y"&&a>0){const i=a===o-1?"long":"short";s.push({len:1,sound:Se(e,e[a],a,i,t,n)}),a+=1;continue}s.push({len:1,sound:null}),a+=1}}return s}function Rs(e,t,n,s){const o=[];let a=0;for(let r=0;r<e.graphemes.length;r++){const i=e.graphemes[r],l=i.length;if(l===2&&i[1]==="e"&&De.includes(i[0])&&a+2===t.length&&(s!=null&&s.has(a+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),a+=2;continue}let c=rn[e.types[r]]??null;!ft.has(c)&&c!=="silent"&&(c=null),c=Se(t,i,a,c,n,s),o.push({len:l,sound:c}),a+=l}return o}function dn(e){var r;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Fn.has(t))return null;const n=an.get(t);if(n){const i=[];for(const l of n){const c=i[i.length-1];c&&c.sound===l?c.len+=1:i.push({len:1,sound:l})}return i}const s=sn(t),o=on(t),a=Ls.get(t);return(r=a==null?void 0:a.graphemes)!=null&&r.length?Rs(a,t,s,o):As(t,s,o)}function Bs(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var a;const n=dn(t);if(!n)return t;let s="",o=0;for(const{len:r,sound:i}of n){const l=t.slice(o,o+r);if(o+=r,!i){s+=l;continue}const c=(a=pe[i])==null?void 0:a.cue;s+=`<span class="vs vs--${i}"${c?` data-cue="${c}"`:""}>${l}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function Cs(e,t){const n=[];let s="",o="";return e.forEach((a,r)=>{const i=a.replace(/^-/,"");if(t[r]==="silent"){o+=i;return}s+=o+i,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Ms(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Hs(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:a,extraActions:r=""}){const i=ln(t,n,s),l=Cs(n,i),c=i.includes("silent");let u=0;const h=n.map((b,v)=>{const I=pe[i[v]]??pe.consonant;return R`<button
      type="button"
      class="bl-tile${i[v]==="silent"?" bl-tile--silent":""}"
      data-idx="${v}"
      data-mark="${I.mark||""}"
      style="--tile-color:${I.color}"
      aria-label="${i[v]==="silent"?`${b} is silent`:`Hear the sound for ${b}, ${I.label}`}"
    >
      ${b}
    </button>`});e.innerHTML=R`
    <div class="blend-ladder" data-word="${t}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${h}</div>
      ${c?R`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${jn(r)}
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
  `;const g=b=>e.querySelector(b),d=g(".bl-steps"),p=g(".bl-next"),m=g(".bl-again"),f=g(".bl-say"),y=[...e.querySelectorAll(".bl-tile")];function E(){d.innerHTML=R`${l.slice(0,u).map((v,I)=>R`<li class="${I===u-1?"is-new":""}">${v}</li>`)}`,y.forEach(v=>{const I=Number(v.dataset.idx),_=i.slice(0,I+1).filter(Be=>Be!=="silent").length-1,Q=i[I]==="silent"?u>=l.length:_>-1&&_<u;v.classList.toggle("is-lit",Q),v.classList.toggle("is-current",i[I]!=="silent"&&_===u-1)});const b=u>=l.length;p.hidden=b,m.hidden=!b,f.textContent=b?"🔊 Hear the word":"🔊 Just hear the word",f.classList.toggle("bl-say--escape",!b),b&&l.length&&d.insertAdjacentHTML("beforeend",String(R`<li class="bl-done">
          Now say the whole word, then tap 🔊 to check. Does it make sense in the sentence?
        </li>`))}function x(){if(u>=l.length)return;const b=Ms(i,u);u+=1,E(),b>=0&&Promise.resolve(o(n[b],s[b],{word:t,index:b})).catch(()=>{})}return p.addEventListener("click",x),m.addEventListener("click",()=>{u=0,E(),p.focus({preventScroll:!0})}),f.addEventListener("click",()=>{Promise.resolve(a(t)).catch(()=>{})}),y.forEach(b=>b.addEventListener("click",async()=>{const v=Number(b.dataset.idx);if(i[v]!=="silent"){b.classList.add("is-tapped"),setTimeout(()=>b.classList.remove("is-tapped"),300);try{await o(n[v],s[v],{word:t,index:v})}catch{}}})),E(),{destroy(){e.innerHTML=""}}}const Ns=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),Os=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),Ws=3,Ps=e=>/[aeiouy]/.test(e);function at(e,t,n){const s=[];let o=0;for(;o<e.length;){let a=Ns.find(r=>e.startsWith(r,o));a==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(a=null),a?(s.push(a),o+=a.length):(s.push(e[o]),o+=1)}return s}function Fs(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const a=e[o+1];if(e[o]==="q"&&(a!=null&&a.startsWith("u"))){n.push("qu"),s.push("c");const r=a.slice(1);r?e[o+1]=r:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function Gs(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const js=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function Ds(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of Os){const u=c.slice(1),h=n.slice(0,-u.length);if(n.endsWith(u)&&h.length>=Ws&&Ps(h)){s=c,n=h;break}}const a=dn(n);if(!a)return null;const r=[],i=[];let l=0;for(const{len:c,sound:u}of Gs(a)){const h=n.slice(l,l+c);if(u)r.push(h),i.push(js[u]??"sv");else for(const g of at(h,n,l))r.push(g),i.push("c");l+=c}if(l<n.length)for(const c of at(n.slice(l),n,l))r.push(c),i.push("c");return o&&(r.push("s"),i.push("c")),s&&(r.push(s),i.push("sf")),r.length?Fs(r,i):null}function zs(e,t){const n=[],s=[];return e.forEach((o,a)=>{if(t[a]!=="bl"){n.push(o),s.push(t[a]);return}const r=String(o).toLowerCase();for(const i of at(r,r,0))n.push(i),s.push("c")}),{graphemes:n,types:s}}const Us="giri_friends_unlocked";function un(){return Kt(Us)}const Ys=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function Ks(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function pn(e){if(!e||!e.id)return null;const t=Ys[e.id]||Ks(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function bt(){try{const e=localStorage.getItem(un()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function Vs(e){try{localStorage.setItem(un(),JSON.stringify(Array.from(e)))}catch{}}function Js(e){if(!e||typeof e!="string")return!1;const t=bt();return t.has(e)?!1:(t.add(e),Vs(t),!0)}function Qs(e){return bt().has(e)}function Xs(e){const t=bt();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=pn(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function hn(e){const t=Xs(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const gn="giri_fluency_history",Ht=5,ne=new Map,Zs=10;function eo(e,t){for(ne.set(e,t);ne.size>Zs;){const n=ne.keys().next().value;ne.delete(n)}}let le=null,H=null,et=[],ce=null,$e=null,ze="idle",N=null;async function mn({storyId:e,lineIdx:t,onStateChange:n}={}){if(ze==="recording")return!1;$e=n??null,et=[];try{le=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return j("error"),!1}const s=so();try{H=new MediaRecorder(le,s?{mimeType:s}:{})}catch{H=new MediaRecorder(le)}return H.ondataavailable=o=>{o.data.size>0&&et.push(o.data)},H.onstop=()=>{const o=new Blob(et,{type:H.mimeType||"audio/webm"}),a=`rec_${e}_${t??"full"}_${Date.now()}`;ce=a,eo(a,o),it(),j("recorded")},H.onerror=()=>{it(),j("error")},H.start(),j("recording"),!0}function Ne(){H&&H.state==="recording"?H.stop():it()}function fn(e){const t=ce,n=t?ne.get(t):null;return n?new Promise(s=>{Ue();const o=URL.createObjectURL(n);N=new Audio(o),j("playing"),N.onended=()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()},N.onerror=()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()},N.play().catch(()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()})}):Promise.resolve()}function Ue(){N&&(N.pause(),N=null)}function rt(e){const t=ce;t&&ne.delete(t),t===ce&&(ce=null),Ue(),j("idle")}function bn(){return ze}function yn(){Ne(),Ue(),ne.clear(),ce=null,ze="idle",$e=null}function to(e){const t=wn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wcpm:e.wcpm,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>Ht&&n.splice(0,n.length-Ht),t[e.storyId]=n,oo(t)}function vn(e){return wn()[e]??[]}function no(e){const t=vn(e);return t.length===0?null:Math.max(...t.map(n=>n.wcpm))}function j(e){ze=e,$e==null||$e(e)}function it(){le&&(le.getTracks().forEach(e=>e.stop()),le=null)}function so(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function wn(){try{return JSON.parse(localStorage.getItem(gn)??"{}")}catch{return{}}}let Nt=!1;function oo(e){try{localStorage.setItem(gn,JSON.stringify(e))}catch{if(Nt)return;Nt=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const Sn="/phonicsquest/";function ao(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return Fe.find(n=>n.word===t)??null}function $n(e){return e.split(/(\s+|["""'',.!?;:()-]+)/).filter(n=>n.length>0).map(n=>({text:n,type:/^\s+$/.test(n)?"space":/^[^a-zA-Z0-9]+$/.test(n)?"punct":"word"}))}let w=null,F="A",Ot=!1,re="band",ve="aloud",xe=!1,ie=null,Oe=[],T=null,W="word",qe=!1,he=-1,Ae=[],ke=0,Ye=[],Ke=0,Ie=0;const kn="giri_stories_read";function D(){try{return JSON.parse(localStorage.getItem(kn)??"[]")}catch{return[]}}function Re(e){const t=D();t.includes(e)||(t.push(e),localStorage.setItem(kn,JSON.stringify(t))),mt(e),Js(e)}let He=null,Ee=null,We=!1;const yt="giri_show_graphemes",En="giri_show_ruler",Ln="giri_ruler_mode",vt="giri_follow_mode",xn="giri_meet_words",Wt="giri_comp_log";let C=Ve(yt,!0),ee=Ve(En,!1),L=null,U=null,lt=Ve(Ln,"line"),te=null,_e=0,O=null;W=Ve(vt,"word");function Ve(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function de(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const qn=new Set;function In(){return new Date().toISOString().slice(0,10)}function _n(){try{const e=localStorage.getItem(xn);return e?JSON.parse(e):{}}catch{return{}}}function ro(e){try{localStorage.setItem(xn,JSON.stringify(e))}catch{}}function io(e){return qn.has(e)?!0:_n()[e]===In()}function Pt(e){qn.add(e);const t=_n();t[e]=In();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];ro(t)}const Ft=new Set,lo=100;function tt(e){try{const t=localStorage.getItem(Wt),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>lo;)n.shift();localStorage.setItem(Wt,JSON.stringify(n))}catch{}}function Po(e,t){w=e}function Fo(){A(),ge()}function Go(){A(),pt(),yn(),St(),Je()}function Je(){ie==null||ie.remove(),ie=null}function ge(){var n,s,o;Je(),me(),An(),T=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${re==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${re==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${re==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Ao()}</button>
    </div>
  `;let t;if(re==="band"){if(!Ot){Ot=!0;try{const d={};for(const p of K)(d[n=p.band]??(d[n]=[])).push(p);F=hs(D(),d)||F}catch{}}const a=G.find(d=>d.band===F)??G[0],r=K.filter(d=>d.band===F&&d.category!=="chapter"&&d.category!=="nonfiction-sg"),i=D(),l=r.filter(d=>i.includes(d.id)).length,c=tn(),u=G.map(d=>{var p,m,f;return`
      <button
        class="story-tab${d.band===F?" active":""}${(p=c[d.band])!=null&&p.ready?"":" story-tab--not-ready"}"
        data-band="${d.band}"
        style="--tab-color:${d.color}"
        ${(m=c[d.band])!=null&&m.ready?"":`title="${c[d.band].hint}"`}
      >
        <span class="story-tab-num">${d.band}</span>
        <span class="story-tab-name">${d.label}</span>
        ${(f=c[d.band])!=null&&f.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),h=r.map(d=>nt(d,a,!1,i.includes(d.id))).join(""),g=r.length?Math.round(l/r.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${u}</div>
      <div class="stories-level-strip"
           style="--level-color:${a.color};--level-bg:${a.bg}">
        <span class="slstrip-label">Band ${F}</span>
        <span class="slstrip-name">${a.label}</span>
        <span class="slstrip-sounds">${a.targetSounds}</span>
        <span class="slstrip-prop">${a.prop}</span>
        <span class="slstrip-progress" title="${l} of ${r.length} stories read">
          ${l}/${r.length} read
          <span class="slstrip-progress-bar" style="--pct:${g}%"></span>
        </span>
      </div>
      ${(s=c[F])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[F].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${h}</div>
    `}else if(re==="singapore"){const a=K.filter(l=>l.category==="nonfiction-sg"),r=D();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${a.map(l=>{const c=G.find(u=>u.band===l.band)??G[0];return nt(l,c,!1,r.includes(l.id))}).join("")}</div>
    `}else{const a=K.filter(l=>l.category==="chapter").sort((l,c)=>(l.chapterNum??0)-(c.chapterNum??0)),r=D();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${a.map(l=>{const c=G.find(u=>u.band===l.band)??G[0];return nt(l,c,!0,r.includes(l.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(a=>{a.addEventListener("click",()=>{re=a.dataset.cat,ge()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Ro()}),w.querySelectorAll(".story-tab").forEach(a=>{a.addEventListener("click",()=>{F=a.dataset.band,ge()})}),w.querySelectorAll(".story-card").forEach(a=>{a.addEventListener("click",()=>wt(a.dataset.storyId))})}function nt(e,t,n=!1,s=!1){var i;const o=(i=e.comprehension)!=null&&i.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",a=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",r=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${Sn}images/stories/${e.illustration}"
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
        ${Dt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const l=zt(e).length;return l?`<span class="story-card-support" data-support="independent">👀 ${l} new ${l===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function wt(e){const t=K.find(n=>n.id===e);t&&(A(),te=D().includes(t.id)?null:ps(t.id),fe.clear(),co(t))}function co(e){var n,s,o;T=e;const t=G.find(a=>a.band===e.band)??G[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${Sn}images/stories/${e.illustration}" alt="${e.title}"
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

      ${(()=>{const a=zt(e);return a.length?`
          <div class="story-prep" aria-labelledby="story-prep-title">
            <p class="story-prep-title" id="story-prep-title">
              👀 Words to know first — tap to hear
            </p>
            <div class="story-prep-words">${a.map(({word:i,display:l,status:c})=>`<button type="button" class="story-prep-word" data-prep-word="${se(i)}"
                       data-status="${se(c)}" aria-label="Hear the word ${se(l)}"
                >${ht(l)}</button>`).join("")}</div>
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
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{A(),ge()}),w.querySelectorAll("[data-prep-word]").forEach(a=>{a.addEventListener("click",()=>{var r,i;(i=(r=oe.speakSightWord(a.dataset.prepWord))==null?void 0:r.catch)==null||i.call(r,()=>{}),a.classList.add("story-prep-word--said"),setTimeout(()=>a.classList.remove("story-prep-word--said"),600)})}),(s=document.getElementById("btn-mode-aloud"))==null||s.addEventListener("click",()=>{ve="aloud",A(),Gt("aloud"),Le(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{ve="decode",A(),Gt("decode"),Le(e)}),Le(e)}function Le(e){io(e.id)?ve==="aloud"?Te(e):Nn(e):uo(e)}function Gt(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function uo(e){var d,p;const t=document.getElementById("story-dynamic");if(!t)return;me(),Oe=e.vocab??[];const n=Ut(e),s=e.lines.map(m=>m.text??"").join(" ").toLowerCase(),o=Oe.filter(m=>{const f=m.word.toLowerCase().split(/\s+/)[0];return s.includes(f)});if(!n.length&&!o.length){Pt(e.id),Le(e);return}const a=n.length+o.length,i=Math.min(3,a),l=new Set,c=n.map(m=>`
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
        Tap <strong>any ${i}</strong> to warm up — or skip if you already
        know them. Then read <strong>${e.title}</strong>.
      </p>

      ${c?`
        <div class="gate-section">
          <div class="gate-section-title">⭐ Sight words in this story</div>
          <div class="hfw-chip-list">${c}</div>
        </div>
      `:""}

      ${u?`
        <div class="gate-section">
          <div class="gate-section-title">📚 Key words to know</div>
          <div class="vocab-chip-list">${u}</div>
        </div>
      `:""}

      <div class="gate-continue-row">
        <span class="gate-progress" id="gate-progress" aria-live="polite">0 of ${i} tapped</span>
        <button class="btn btn--ghost" id="gate-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="gate-continue" type="button" disabled>Start Reading →</button>
      </div>
    </div>
  `;function h(m){const f=m.dataset.tapId;if(l.has(f))return;l.add(f),m.setAttribute("data-tapped","true");const y=document.getElementById("gate-progress");if(y&&(y.textContent=l.size>=i?`✓ Warmed up (${l.size} tapped) — keep going or start the story`:`${l.size} of ${i} tapped`),l.size>=i){const E=document.getElementById("gate-continue");E&&(E.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(m=>{m.addEventListener("click",async()=>{ut(m);try{await oe.speakWord(m.dataset.word)}catch{}h(m)})});const g=()=>{Pt(e.id),Le(e)};(d=document.getElementById("gate-skip"))==null||d.addEventListener("click",g),(p=document.getElementById("gate-continue"))==null||p.addEventListener("click",g)}function Tn(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function Te(e){var u,h,g,d,p,m,f,y,E,x;const t=document.getElementById("story-dynamic");if(!t)return;me(),Je();const n=e.lines.map((b,v)=>wo(b,v,!0,e)).join(""),s=!!((u=e.comprehension)!=null&&u.length),a=!!((h=e.talkAboutIt)!=null&&h.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(b=>`<li>${b}</li>`).join("")}
      </ul>
    </div>
  `:"",r=vn(e.id),i=no(e.id),l=r.length>0?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent Attempts</span>
        ${i!==null?`<span class="fluency-history-best">Best: <strong>${i}</strong> wpm</span>`:""}
      </div>
      <div class="fluency-history-list">
        ${r.slice().reverse().map(b=>{const v=new Date(b.date);return`<span class="fluency-history-item">${`${v.getDate()}/${v.getMonth()+1}`}: <strong>${b.wcpm}</strong> wpm</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${C}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${ee}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
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

      ${C?Hn():""}

      ${te!==null?`
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`:""}

      <div class="story-body story-body--follow-${W}" id="story-body" aria-live="polite">${n}</div>

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
              <span class="rtg-label">${Dn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${ns()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(b=>{b.addEventListener("click",()=>{W=b.dataset.follow,de(vt,W),Te(e)})}),t.querySelectorAll(".wf-word").forEach(b=>{b.setAttribute("role","button"),b.setAttribute("tabindex","0");const v=I=>{const _=kt(b);_&&(I.preventDefault(),L==null||L.tap(I.clientY??0,b),Lo(_))};b.addEventListener("click",v),b.addEventListener("keydown",I=>{(I.key==="Enter"||I.key===" ")&&v(I)})}),(g=document.getElementById("btn-toggle-graphemes"))==null||g.addEventListener("click",()=>{C=!C,de(yt,C),Te(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var b,v;ee=!ee,de(En,ee),(b=document.getElementById("btn-toggle-ruler"))==null||b.setAttribute("aria-pressed",String(ee)),me(),ee&&(dt(),(v=document.getElementById("btn-ruler-next"))==null||v.focus({preventScroll:!0}))}),ee?requestAnimationFrame(()=>dt(te)):te!==null&&requestAnimationFrame(()=>ct(te)),po(e),(p=document.getElementById("btn-resume-restart"))==null||p.addEventListener("click",b=>{var v;mt(e.id),te=null,(v=b.currentTarget.closest(".story-resume"))==null||v.remove(),ct(0),L&&L.goTo(0)}),ho(),(m=document.getElementById("btn-story-play"))==null||m.addEventListener("click",()=>Wn(e)),(f=document.getElementById("btn-story-stop"))==null||f.addEventListener("click",()=>A());const c=Tn(e);(y=document.getElementById("btn-fluency-start"))==null||y.addEventListener("click",()=>Mo()),(E=document.getElementById("btn-fluency-done"))==null||E.addEventListener("click",()=>pt(c,e)),Bo(e),St(),fo(e),Co(e),(x=document.getElementById("btn-launch-quest"))==null||x.addEventListener("click",()=>{A(),pt(),yn(),Re(e.id),Yn(w,e,()=>{ge()})})}function ct(e){const t=w==null?void 0:w.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:V(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function po(e){An();const t=document.getElementById("story-body");if(!t)return;const n=je(t);n&&(O=n,O._pqPlaceHandler=()=>{clearTimeout(_e),_e=setTimeout(()=>{if(L||D().includes(e.id))return;const s=t.getBoundingClientRect(),o=Rn();if(s.bottom<o.top||s.top>o.bottom)return;const r=[...t.querySelectorAll(".wf-word")].findIndex(i=>i.getBoundingClientRect().top>=o.top);r>=0&&en(e.id,r)},500)},n.addEventListener("scroll",O._pqPlaceHandler,{passive:!0}))}function ho(){const e=document.getElementById("story-resume");if(!e)return;const t=je(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",a),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const a=()=>{o&&s()};t==null||t.addEventListener("scroll",a,{passive:!0}),n=setTimeout(s,9e3)}function An(){clearTimeout(_e),O!=null&&O._pqPlaceHandler&&(O.removeEventListener("scroll",O._pqPlaceHandler),delete O._pqPlaceHandler),O=null}function Rn(){const e=document.getElementById("story-body"),t=e?je(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),a=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,r=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),i=(o?Math.min(o.getBoundingClientRect().top,r):r)-12;return{top:Math.max(0,a),bottom:Math.max(i,a+120)}}function Pe(){return we.find(e=>e.id===lt)??we[1]}function go(){const e=Pe();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${se(e.label)}. Tap to change."
              title="${se(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${ht(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function dt(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=go();const s=Pe(),o=n.querySelector(".ruler-pos small"),a=n.querySelector(".ruler-pos b"),r=n.querySelector("#btn-ruler-next"),i=n.querySelector("#btn-ruler-back");L=is(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Rn,onMove(l){U=l;const c=s.id==="word";o.textContent=c?"Word":"Line",a.textContent=c?`${l.word+1} / ${l.words}`:`${l.line+1} / ${l.lines}`,i.disabled=c?l.word===0:l.line===0,r.textContent=l.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",r.classList.toggle("is-end",l.atEnd),clearTimeout(_e),_e=setTimeout(()=>{D().includes((T==null?void 0:T.id)??"")||en(T==null?void 0:T.id,l.word)},400)}}),i.addEventListener("click",()=>L==null?void 0:L.prev()),r.addEventListener("click",()=>{if(!(U!=null&&U.atEnd))return L==null?void 0:L.next();const l=T;if(!l)return;Re(l.id);const c=document.getElementById("story-quest-cta");c&&(c.hidden=!1),Lt(l),Et(l)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var u;const l=(U==null?void 0:U.word)??0,c=we.indexOf(Pe());lt=we[(c+1)%we.length].id,de(Ln,lt),me(),dt(l),(u=document.getElementById("btn-ruler-style"))==null||u.focus({preventScroll:!0})})}function me(){L==null||L.destroy(),L=null,U=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function mo(e){var s,o;if(!L||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Pe().id==="word",n={ArrowDown:()=>L.nextLine(),ArrowUp:()=>L.prevLine(),ArrowRight:()=>t?L.next():L.nextLine(),ArrowLeft:()=>t?L.prev():L.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",mo);function fo(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>bo(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>yo(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Mn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{St(),Te(e)})}function Y(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function Bn(){const e=Ae[he];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function bo(e){var n,s,o;if(W!=="word"){W="word",de(vt,W),Te(e);const a=document.getElementById("practice-drawer");a&&(a.open=!0);const r=document.getElementById("rtg-bar");r&&(r.open=!0)}A();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(a=>a.querySelector(".wf-word")).map(a=>Number(a.dataset.line));t.length!==0&&(qe=!0,Ae=t,he=0,ke=0,Ye=[],Ke=0,Ie=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Cn(),Y("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Cn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=Bn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:V()}))}async function yo(e){var u;const t=Bn(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(kt).filter(Boolean).join(" ");if(!o){Mn(e);return}n.disabled=!0,n.replaceChildren(Un("encourage"),document.createTextNode("Giri is listening…")),Y("Go ahead — read the glowing line now.");const a=await ss(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!qe)return;if(!a){ke++,ke>=2?Y("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):Y("Giri couldn't hear that — move a little closer to the microphone and try again!");return}ke=0;const r=[];a.words.forEach((h,g)=>{const d=s[g];if(d)if(d.classList.remove("rtg-word--match","rtg-word--check"),h.status==="miss"){d.classList.add("rtg-word--check");const p=h.word.replace(/[^a-z]/g,"");p.length>2&&(r.push(p),Qt(p))}else d.classList.add("rtg-word--match")});const i=a.words.filter(h=>h.status!=="miss").length;Ke+=i,Ie+=a.words.length,Ye.push(...r);const l=he>=Ae.length-1;r.length>0?Y(`Nice reading! Let's check the orange ${r.length===1?"word":"words"} together — tap ${r.length===1?"it":"each one"} to hear it. Then ${l?"finish up":"go on"}!`):Y("⭐ Great — Giri heard every word!"),(u=document.getElementById("btn-rtg-listen"))==null||u.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=l?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Mn(e){var t,n;if(he>=Ae.length-1){vo(e);return}he++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),Cn(),Y("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function vo(e){var i,l;const t=Ie>0?Math.round(Ke/Ie*100):0,n=[...new Set(Ye)],s={...ue.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},ue.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(i=document.getElementById("btn-rtg-next"))==null||i.setAttribute("hidden",""),(l=document.getElementById("btn-rtg-exit"))==null||l.setAttribute("hidden","");const a=document.getElementById("btn-rtg-start");a&&(a.removeAttribute("hidden"),a.textContent="Read it again");const r=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";Y(`🌟 You read the whole story to Giri — ${t}% heard clearly.${r}`),Re(e.id),qe=!1}function St(){qe&&os(),qe=!1,he=-1,Ae=[],ke=0,Ye=[],Ke=0,Ie=0}function $t(e){return!C||!e?e:Bs(e)}function Hn(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${gs.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function wo(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${ht(o)}</div>`;const a=s?$t(o,s.targetGraphemes,s.band):o,r=n?So(o,s):a;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${r}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${r}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${r}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${r}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${r}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${r}</p>`;default:return`<p class="sline"                    data-line="${t}">${r}</p>`}}function So(e,t=null){if(!e)return"";const n=$n(e);let s=0;return n.map(o=>{if(o.type==="word"){const a=t?$t(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${se(o.text)}" aria-label="${se(o.text)}">${a}</span>`}return o.text}).join("")}function kt(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Nn(e){var c,u,h,g;const t=document.getElementById("story-dynamic");if(!t)return;me(),Je(),Oe=e.vocab??[];const s=Ut(e).map(d=>`
    <button class="hfw-chip" data-word="${d}" aria-label="Hear sight word ${d}">
      ⭐ ${d}
    </button>
  `).join(""),o=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),r=Oe.filter(d=>{const p=d.word.toLowerCase().split(/\s+/)[0];return o.includes(p)}).map(d=>`
    <button class="vocab-chip" data-word="${d.word}" aria-label="Key word: ${d.word}">
      <span class="vocab-chip-icon">${d.icon}</span>
      <span class="vocab-chip-word">${d.word}</span>
      <span class="vocab-chip-meaning">${d.meaning}</span>
    </button>
  `).join(""),i=e.lines.map((d,p)=>{if(d.type==="label")return`<div class="sline sline--label" data-line="${p}">${d.text}</div>`;const f=$n(d.text).map(E=>{if(E.type==="word"){const x=E.text.toLowerCase().replace(/[^a-z]/g,""),b=Yt(x),v=$t(E.text,e.targetGraphemes,e.band);return`<button class="decode-word${b?" decode-hfw":""}"
                         data-word="${E.text}"
                         aria-label="${b?"Sight word: ":"Decode: "}${E.text}"
                >${v}</button>`}return`<span class="decode-punct">${E.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[d.type]??""} decode-line" data-line="${p}">${f}</p>`}).join("");t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${C}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
      </div>
      ${C?Hn():""}

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
        ${i}
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
  `,(c=document.getElementById("btn-toggle-graphemes-decode"))==null||c.addEventListener("click",()=>{C=!C,de(yt,C),Nn(e)}),(u=document.getElementById("btn-hfw-toggle"))==null||u.addEventListener("click",()=>{const d=document.getElementById("hfw-chip-list"),p=document.getElementById("btn-hfw-toggle"),m=p.getAttribute("aria-expanded")==="true";d.hidden=m,p.setAttribute("aria-expanded",String(!m)),p.textContent=m?"Show ▼":"Hide ▲"}),(h=document.getElementById("btn-vocab-toggle"))==null||h.addEventListener("click",()=>{const d=document.getElementById("vocab-chip-list"),p=document.getElementById("btn-vocab-toggle"),m=p.getAttribute("aria-expanded")==="true";d.hidden=m,p.setAttribute("aria-expanded",String(!m)),p.textContent=m?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(d=>{d.addEventListener("click",()=>{var f,y;const p=d.dataset.word;ut(d);const m=new SpeechSynthesisUtterance(p);m.rate=.85,J(m),(f=window.speechSynthesis)==null||f.cancel(),(y=window.speechSynthesis)==null||y.speak(m)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",()=>{var f,y;const p=d.dataset.word;ut(d),d.classList.toggle("vocab-chip--expanded");const m=new SpeechSynthesisUtterance(p);m.rate=.85,J(m),(f=window.speechSynthesis)==null||f.cancel(),(y=window.speechSynthesis)==null||y.speak(m)})}),(g=document.getElementById("btn-mark-read"))==null||g.addEventListener("click",d=>{Re(e.id);const p=d.currentTarget;p.textContent="✓ Read!",p.disabled=!0,p.classList.add("btn--success"),Lt(e),Et(e)});const l=document.getElementById("decode-panel");l&&(l.remove(),document.body.appendChild(l)),ie=l,t.querySelectorAll(".decode-word").forEach(d=>{d.addEventListener("click",()=>$o(d))})}async function $o(e){var r,i,l,c;document.querySelectorAll(".decode-word.decoding").forEach(u=>u.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,n=t.toLowerCase().replace(/[^a-z]/g,"");n&&fe.add(n);const s=ao(t),o=!s&&Yt(n),a=ie;if(a){if(a.removeAttribute("hidden"),o){st({type:"hfw",word:n});const u=new SpeechSynthesisUtterance(n);u.rate=.85,J(u),(r=window.speechSynthesis)==null||r.cancel(),(i=window.speechSynthesis)==null||i.speak(u)}else if(!st({type:"decode",word:(s==null?void 0:s.word)??n,wordObj:s??{word:n}})){st({type:"tts",word:n});const h=new SpeechSynthesisUtterance(n);h.rate=.85,J(h),(l=window.speechSynthesis)==null||l.cancel(),(c=window.speechSynthesis)==null||c.speak(h)}}}function st({type:e,word:t,wordObj:n}){var o,a;const s=document.getElementById("decode-panel-inner");return s?e==="hfw"?(s.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(o=document.getElementById("dp-hear"))==null||o.addEventListener("click",()=>{var i,l;const r=new SpeechSynthesisUtterance(t);r.rate=.85,J(r),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(r)}),!0):e==="tts"?(s.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(a=document.getElementById("dp-hear"))==null||a.addEventListener("click",()=>{var i,l;const r=new SpeechSynthesisUtterance(t);r.rate=.85,J(r),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(r)}),!0):(s.innerHTML="",On(s,n)):!1}function On(e,t,n=!0){var r;const s=n&&((r=t.graphemes)!=null&&r.length)?{graphemes:t.graphemes,types:t.types}:Ds(t.word);if(!s)return!1;const{graphemes:o,types:a}=zs(s.graphemes,s.types);return Hs(e,{word:t.word,graphemes:o,types:a,speakPhoneme:(i,l,c)=>oe.speakPhoneme(i,l,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:i=>oe.speakWord(i)}),!0}function ut(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function ko(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const a=n[s+1];if(a&&a.type==="beat"){t.push({text:`${o.text} ${a.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function Wn(e){if(!window.speechSynthesis)return;A(),T=e,xt(!0),xe=!0;const t=ko(e);Pn(t,0)}function Pn(e,t){if(!xe||t>=e.length){jt();return}const n=e[t];Io(n.highlightIdx);const s=new SpeechSynthesisUtterance(n.text);s.rate=.82,J(s);const o=n.text.startsWith("Puff")?600:380;W==="word"&&Eo(s,n.highlightIdx),s.onend=()=>{Qe(),xe&&setTimeout(()=>Pn(e,t+1),o)},s.onerror=()=>jt(),window.speechSynthesis.speak(s)}function Eo(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=e.text||"";let a=!1,r=-1,i=[],l=!1;function c(d){if(d<0||d>=s.length||d===r)return;r=d,s.forEach(m=>m.classList.remove("wf-word--active"));const p=s[d];p.classList.add("wf-word--active"),L?L.follow(p):qo(p)}function u(){for(const d of i)clearTimeout(d);i=[]}function h(){var f;if(l)return;l=!0;const d=typeof e.rate=="number"&&e.rate>0?e.rate:.82,p=Array.from(s,kt);let m=0;for(let y=0;y<s.length;y++){const E=y,x=((f=p[y])==null?void 0:f.length)||3,b=Math.max(160,Math.round((90+x*60)/d)),v=setTimeout(()=>{a||c(E)},m);i.push(v),m+=b}}e.addEventListener("boundary",d=>{d.name&&d.name!=="word"||(a=!0,u(),c(Kn(o,d.charIndex??-1)))}),e.addEventListener("end",()=>{u()}),e.addEventListener("start",()=>{if(a)return;const d=setTimeout(()=>{a||(c(0),h())},180);i.push(d)});const g=setTimeout(()=>{a||l||(c(0),h())},800);i.push(g)}function Lo(e){var r;const t=document.getElementById("word-detective-content");if(!t)return;fe.add(e.toLowerCase().replace(/[^a-z']/g,"")),A();const n=Qn(e);t.innerHTML=xo(n),ye.open("modal-word-detective");const s=t.querySelector('[data-role="ladder"]');if(!(s&&On(s,{word:n.text,graphemes:n.graphemes,types:n.types},n.foundInBank))){const i=t.querySelector(".wd-fallback");i&&(i.hidden=!1);try{oe.speakWord(n.text)}catch{}}(r=t.querySelector('[data-action="hear"]'))==null||r.addEventListener("click",()=>{try{oe.speakWord(n.text)}catch{}});const a=t.querySelector('[data-action="add-review"]');a==null||a.addEventListener("click",()=>{if(!n.word)return;Qt(n.word.id)&&(a.disabled=!0,a.textContent="✓ In your Review Lane")})}function xo(e){const t=a=>String(a??"").replace(/[<>&]/g,r=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[r]),n=ln(e.text,e.graphemes,e.types),s=e.graphemes.map((a,r)=>{const i=pe[n[r]]??pe.consonant,l=i.mark?` data-mark="${t(i.mark)}"`:"";return`<span class="wd-tile vs--${n[r]}"${l} style="--tile-color:${i.color}" aria-label="${t(a)}, ${t(i.label)}">${t(a)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:"";return`
    <div class="wd-card">
      <p class="wd-word">${t(e.text)}</p>
      <div data-role="ladder"></div>
      <div class="wd-fallback" hidden>
        ${s?`<div class="wd-tiles" aria-label="Sound breakdown">${s}</div>`:""}
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
      </div>
      <div class="wd-actions">${o}</div>
    </div>`}function V(){return zn()?"auto":"smooth"}function qo(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;Vn(t,n)&&e.scrollIntoView({block:"center",behavior:V()})}catch{}}function Qe(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function Io(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),Qe();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");L&&n?L.follow(n):t.scrollIntoView({behavior:V(),block:"nearest"})}}function J(e){var n,s;let t;try{t=((s=(n=oe).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function A(){var e;xe=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Qe(),xt(!1)}function jt(){xe=!1,w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Qe(),xt(!1),T&&Re(T.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),T&&Lt(T),T&&Et(T)}const fe=new Set;function _o(e){const t=K.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=D();return t.find(s=>!n.includes(s.id))??t[0]??null}function To(e){var s,o;const t=[R`You read <strong>${e.title}</strong> — ${Tn(e)} words.`];if(fe.size){const a=fe.size;t.push(R`You worked out ${a} ${a===1?"word":"words"} by sounding
      ${a===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(R`You had a think about what happened.`);const n=Qs(e.id)?(o=pn(e))==null?void 0:o.name:"";return n&&t.push(R`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function Et(e){var o,a,r;if(!e)return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=_o(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=R`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${To(e).map(i=>R`<li>${i}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${n?R`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${n.id}"
          >
            ➡️ Next: ${n.title}
          </button>`:""}
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `,t.appendChild(s),s.scrollIntoView({behavior:V(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{fe.clear(),mt(e.id),te=null,s.remove(),ct(0),L&&L.goTo(0)}),(a=s.querySelector("#btn-ending-next"))==null||a.addEventListener("click",i=>{A(),wt(i.currentTarget.dataset.storyId)}),(r=s.querySelector("#btn-ending-done"))==null||r.addEventListener("click",()=>{A(),ge()})}function Lt(e){var r,i,l;if(!e||!((r=e.talkAboutIt)!=null&&r.length)||Ft.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Ft.add(e.id);const n=e.talkAboutIt[0],s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:V(),block:"nearest"});const a=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.resp;if(tt({storyId:e.id,question:n,response:u}),o.querySelectorAll(".comp-choice").forEach(g=>g.disabled=!0),c.classList.add("correct"),u==="confident")a.textContent="👍 Great! You understood the story.";else if(u==="reread")a.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Wn(e),300);else{a.textContent="💡 Look at the end of the story for clues.";const g=w==null?void 0:w.querySelector(".sline.sline--end, .sline:last-of-type");g==null||g.scrollIntoView({behavior:V(),block:"center"})}a.hidden=!1;const h=o.querySelector("#comp-more");h&&(h.hidden=!1)})}),(i=o.querySelector("#comp-more"))==null||i.addEventListener("click",()=>{var u;const c=o.querySelector("#comp-q");c&&(c.textContent=s),tt({storyId:e.id,question:s,response:"followup"}),(u=o.querySelector("#comp-more"))==null||u.remove(),a&&(a.textContent="💭 Have a think, then tell someone your answer.",a.hidden=!1),o.querySelectorAll(".comp-choice").forEach(h=>{h.disabled=!1,h.classList.remove("correct")})}),(l=o.querySelector("#comp-skip"))==null||l.addEventListener("click",()=>{tt({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Ao(){try{const e=hn(K);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Ro(){var r,i;(r=document.getElementById("modal-story-friends"))==null||r.remove();const e=hn(K),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=l=>String(l??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const l of e.roster)s.has(l.band)||s.set(l.band,[]),s.get(l.band).push(l);const o=Array.from(s.entries()).sort((l,c)=>String(l[0]).localeCompare(String(c[0]))).map(([l,c])=>{const u=c.filter(g=>g.unlocked).length,h=c.map(g=>`
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
          <h3 class="sf-band__title">Band ${n(l)} <small>${u}/${c.length} met</small></h3>
          <div class="sf-grid">${h}</div>
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
    </div>`,document.body.appendChild(t),ye.open("modal-story-friends"),(i=t.querySelector("[data-close]"))==null||i.addEventListener("click",()=>{ye.close("modal-story-friends"),t.remove()}),t.addEventListener("click",l=>{l.target===t&&(ye.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.storyId;c&&(ye.close("modal-story-friends"),t.remove(),wt(c))})})}function xt(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function Bo(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),a=document.getElementById("recording-status");if(!t)return;function r(i){if(t.hidden=i!=="idle",n.hidden=i!=="recording",s.hidden=i!=="recorded"&&i!=="playing",o.hidden=i!=="recorded"&&i!=="playing",a)switch(i){case"recording":a.textContent="🔴 Recording...",a.className="recording-status recording-status--active";break;case"recorded":a.textContent="✓ Recording ready",a.className="recording-status recording-status--ready";break;case"playing":a.textContent="▶ Playing...",a.className="recording-status recording-status--playing";break;case"error":a.textContent="⚠ Microphone not available — check permissions",a.className="recording-status recording-status--error";break;default:a.textContent="",a.className="recording-status";break}s&&(s.textContent=i==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await mn({storyId:e.id,onStateChange:r})||r("error")}),n.addEventListener("click",()=>{Ne()}),s.addEventListener("click",()=>{bn()==="playing"?(Ue(),r("recorded")):fn()}),o.addEventListener("click",()=>{rt(),r("idle")})}function Co(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),a=document.getElementById("btn-echo-stop"),r=document.getElementById("echo-read-status");if(!t)return;const i=e.lines.map((h,g)=>({...h,idx:g})).filter(h=>h.type!=="label"&&h.type!=="chapter"&&h.text);let l=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,a.hidden=!0,r&&(r.textContent="",r.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(h=>h.classList.remove("sline--echo-active")),l=-1}function u(h){var m,f;l=h;const g=i[h];if(!g){c();return}g.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(y=>y.classList.remove("sline--echo-active"));const d=w==null?void 0:w.querySelector(`[data-line="${g.idx}"]`);d&&(d.classList.add("sline--echo-active"),d.scrollIntoView({behavior:V(),block:"nearest"})),r&&(r.textContent=`Line ${h+1} of ${i.length}`,r.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const p=new SpeechSynthesisUtterance(g.text);p.rate=.82,J(p),p.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",r&&(r.textContent=`Your turn! Read line ${h+1}`)},p.onerror=()=>{s.hidden=!1},(m=window.speechSynthesis)==null||m.cancel(),(f=window.speechSynthesis)==null||f.speak(p)}t.addEventListener("click",()=>{t.hidden=!0,a.hidden=!1,u(0)}),s.addEventListener("click",async()=>{if(bn()==="recording"){Ne();return}const h=i[l];!await mn({storyId:e.id,lineIdx:h==null?void 0:h.idx,onStateChange:d=>{d==="recording"?(s.textContent="⏹ Stop Recording",r&&(r.textContent="🔴 Recording...",r.className="echo-read-status echo-read-status--recording")):d==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=l>=i.length-1,r&&(r.textContent="✓ Great job!",r.className="echo-read-status echo-read-status--done")):d==="error"&&r&&(r.textContent="⚠ Microphone not available",r.className="echo-read-status echo-read-status--error")}})&&r&&(r.textContent="⚠ Microphone not available — check permissions",r.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{fn()}),n.addEventListener("click",()=>{rt(),o.hidden=!0,l+1<i.length?u(l+1):(r&&(r.textContent="🎉 Echo Read complete!",r.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),a.addEventListener("click",()=>{A(),Ne(),rt(),c()})}function Mo(){We||(We=!0,Ee=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,He=setInterval(()=>{const e=Math.floor((Date.now()-Ee)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}function pt(e,t){if(!We&&He===null||(clearInterval(He),He=null,We=!1,document.getElementById("btn-fluency-start").disabled=!1,document.getElementById("btn-fluency-done").disabled=!0,!e||!Ee))return;const n=(Date.now()-Ee)/1e3;if(Ee=null,n<2)return;const s=Math.round(e/n*60),o=Math.floor(n/60),a=Math.round(n%60);t&&to({storyId:t.id,wcpm:s,durationSec:n,wordCount:e});let r;s>=60?r="🌟 Fluent reader!":s>=40?r="📈 Building fluency — great progress!":r="📖 Keep practising — try reading it again!";const i=document.getElementById("fluency-result");if(i){i.hidden=!1,i.innerHTML=`
      <div class="fluency-result-inner">
        <span class="fluency-time">Time: ${o}:${String(a).padStart(2,"0")}</span>
        <span class="fluency-wcpm"><strong>${s}</strong> words/min</span>
        <span class="fluency-level">${r}</span>
      </div>
      <p class="fluency-tip">Tip: Read the story again to improve your speed!</p>
    `;const l=document.getElementById("story-quest-cta");l&&(l.hidden=!1)}}export{$t as _highlightGraphemes,io as _isMeetWordsCompletedToday,tt as _logComprehensionAttempt,Pt as _setMeetWordsCompleted,Go as cleanupStoryMode,Po as initStoryMode,Fo as showBrowser};
