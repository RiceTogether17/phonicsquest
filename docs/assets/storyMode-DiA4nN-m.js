import{S as V,B as j}from"./stories-BYImWThp.js";import{P as Gn,s as Ut,a as Yt,e as Kt,i as Vt}from"./decodability-B0KbM-y2.js";import{s as pe,W as je,X as jn,Y as De,Z as Jt,C as Qt,q as T,o as Dn,_ as ve,$ as se,M as gt,a0 as oe,a1 as zn,b as Un,a2 as Yn,a3 as Kn}from"./index-BOOudMZe.js";import"./gsap-C8pce-KX.js";function Vn(e,t,n){var m;if(!((m=t.comprehension)!=null&&m.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return r();case"comprehension":return a();case"vocab":return c();case"openEnded":return l();case"grammar":return u();case"done":return p()}}function r(){var d,h,g,f;e.innerHTML=`
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
    `,(g=document.getElementById("sq-start"))==null||g.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(f=document.getElementById("sq-skip"))==null||f.addEventListener("click",()=>n==null?void 0:n())}function a(){const d=t.comprehension[s.qIndex],h=s.qIndex+1,g=s.total;e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${h/g*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${h} of ${g}</p>

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
    `,document.querySelectorAll(".sq-option").forEach(f=>{f.addEventListener("click",()=>i(f,d))})}function i(d,h){const g=parseInt(d.dataset.idx,10),f=g===h.answer;f&&s.correct++,document.querySelectorAll(".sq-option").forEach((v,y)=>{v.disabled=!0,y===h.answer&&v.classList.add("sq-option--correct"),y===g&&!f&&v.classList.add("sq-option--wrong")});const b=document.getElementById("sq-feedback");b&&(b.hidden=!1,b.className=`sq-feedback ${f?"sq-feedback--correct":"sq-feedback--wrong"}`,b.textContent=f?"✅ Great thinking!":`✨ The answer is: ${h.options[h.answer]}`);const x=document.getElementById("sq-next");x&&(x.hidden=!1,x.addEventListener("click",()=>{var v,y,S;s.qIndex++,s.qIndex<s.total||(s.phase=(v=t.openEnded)!=null&&v.length?"openEnded":(y=t.vocab)!=null&&y.length?"vocab":(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done",s.vocabIndex=0),o()}))}function l(){var h,g,f;const d=t.openEnded||[];if(!d.length){s.phase=(h=t.vocab)!=null&&h.length?"vocab":(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${d.map((b,x)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${x+1}. ${b.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${b.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${b.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(f=document.getElementById("sq-open-next"))==null||f.addEventListener("click",()=>{var b,x;s.phase=(b=t.vocab)!=null&&b.length?"vocab":(x=t.grammarSpotlight)!=null&&x.length?"grammar":"done",o()})}function c(){var x,v,y;const d=t.vocab[s.vocabIndex],h=t.vocab.length,g=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${g} of ${h}</p>

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
              ${g<h?"Next word →":"Done with words!"}
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
    `;const f=document.getElementById("sq-flip-card"),b=()=>{s.flipped=!0,o()};f==null||f.addEventListener("click",b),f==null||f.addEventListener("keydown",S=>{(S.key==="Enter"||S.key===" ")&&b()}),(x=document.getElementById("sq-flip-btn"))==null||x.addEventListener("click",b),(v=document.getElementById("sq-vocab-next"))==null||v.addEventListener("click",()=>{var S;s.vocabIndex++,s.flipped=!1,s.vocabIndex<h||(s.phase=(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done"),o()}),(y=document.getElementById("sq-vocab-skip"))==null||y.addEventListener("click",()=>{var S;s.phase=(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done",o()})}function u(){var g;const h=(t.grammarSpotlight??[]).map((f,b)=>`
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
    `,(g=document.getElementById("sq-grammar-done"))==null||g.addEventListener("click",()=>{s.phase="done",o()})}function p(){var v;const d=s.total>0?Math.round(s.correct/s.total*100):100,h=d>=80?3:d>=50?2:1,g="⭐".repeat(h)+"☆".repeat(3-h),f=s.correct*15+(d===100?25:0),b=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],x=h===3?b[2]:h===2?b[1]:b[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${g}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${x}</p>
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
    `,(v=document.getElementById("sq-back"))==null||v.addEventListener("click",()=>n==null?void 0:n())}o()}function Jn(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let r=0;r<=n;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(s++,o=!0):a&&(o=!1)}return s<0?-1:s}function Qn(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function Xn(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let ye=null;function Xt(){if(ye)return ye;ye=new Map;for(const e of je)e!=null&&e.word&&ye.set(e.word.toLowerCase(),e);return ye}function Zn(e){const t=Xn(e),n=Xt(),s=t?n.get(t):null;if(s){const o=pe.get("wordStats")||{},r=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Zt(e){return!e||typeof e!="string"||!(Xt().has(e)||je.some(s=>(s==null?void 0:s.id)===e))?!1:(pe.recordWordAttempt(e,!0,jn.EXPOSURE),!0)}const es=.62,ts=.4,Ct=2;function Mt(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function ns(e,t,n=(s,o)=>De.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(p=>({word:p,status:"miss",heard:null}));const r=-.4,a=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let p=1;p<=s;p++)a[p][0]=p*r;for(let p=1;p<=o;p++)a[0][p]=p*r;const i=Array.from({length:s},(p,m)=>Array.from({length:o},(d,h)=>n(e[m],t[h])));for(let p=1;p<=s;p++)for(let m=1;m<=o;m++){const d=i[p-1][m-1]-.5;a[p][m]=Math.max(a[p-1][m-1]+d,a[p-1][m]+r,a[p][m-1]+r)}const l=new Array(s);let c=s,u=o;for(;c>0;){const p=u>0?i[c-1][u-1]-.5:-1/0;if(u>0&&a[c][u]===a[c-1][u-1]+p){const m=i[c-1][u-1],d=e[c-1];let h;m>=es?h="match":m>=ts||d.length<=Ct?h="unsure":h="miss",l[c-1]={word:d,status:h,heard:t[u-1]},c--,u--}else if(u>0&&a[c][u]===a[c][u-1]+r)u--;else{const m=e[c-1];l[c-1]={word:m,status:m.length<=Ct?"unsure":"miss",heard:null},c--}}return l}function ss(e,t,n){const s=Mt(e);let o=null;for(const r of t||[]){const a=ns(s,Mt(r.text),n),i=a.filter(l=>l.status==="match").length;(!o||i>o.matchCount)&&(o={words:a,matchCount:i,total:s.length})}return o||{words:s.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:s.length}}function os(){return De.supported}async function rs(e){const t=await De.listenTranscript({timeoutMs:12e3});return t?ss(e,t.transcripts):null}function as(){De.stop()}const Se=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function is(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const ls=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function ze(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function cs(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:r}){var At,Rt,Bt;const a=[...e.querySelectorAll(s)];let i=[],l=0,c=0;const u=document.createElement("div");u.className=`ruler-layer ruler-layer--${t}`,u.setAttribute("aria-hidden","true"),u.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(u);const p=()=>{const $=a[l]??a[0]??e;return parseFloat(getComputedStyle($).fontSize)||20},m=$=>u.querySelector($),d=m(".ruler-veil--above"),h=m(".ruler-veil--below"),g=m(".ruler-strip"),f=m(".ruler-word"),b=m(".ruler-bar");function x(){const $=e.getBoundingClientRect();i=is(a.map(E=>{const q=E.getBoundingClientRect();return q.width||q.height?{top:q.top-$.top,bottom:q.bottom-$.top}:null}))}const v=$=>{const E=i.findIndex(q=>$>=q.first&&$<=q.last);return E<0?0:E};function y(){const $=i[c];if(!$)return;const E=p(),q=E*.6,B=$.bottom+E*.18,M=Math.max(12,E*.55),F=e.scrollHeight;d.style.height=`${Math.max(0,$.top-q)}px`,h.style.top=`${B+M}px`,h.style.height=`${Math.max(0,F-B-M)}px`,g.style.top=`${$.top-q}px`,g.style.height=`${B-($.top-q)}px`,b.style.top=`${B}px`,b.style.height=`${M}px`;const X=a[l];if(t==="word"&&X){const Z=e.getBoundingClientRect(),U=X.getBoundingClientRect();f.style.left=`${U.left-Z.left-3}px`,f.style.width=`${U.width+6}px`,f.style.top=`${U.top-Z.top-2}px`,f.style.height=`${U.height+4}px`,b.style.setProperty("--x",`${U.left-Z.left+U.width/2}px`)}a.forEach((Z,U)=>Z.classList.toggle("is-pointed",t==="word"&&U===l))}function S(){r==null||r({word:l,line:c,lines:i.length,words:a.length,atEnd:t==="word"?l>=a.length-1:c>=i.length-1})}function I(){const $=i[c];if(!$)return;const E=e.getBoundingClientRect(),q=p(),B=E.top+$.top-q*.6,M=E.top+$.bottom+q*1.2,F=o();if(B>=F.top&&M<=F.bottom)return;const X=F.top+(F.bottom-F.top)*.28,Z={top:B-X,behavior:ls()?"auto":"smooth"};(ze(e)??window).scrollBy(Z)}function A($,{scroll:E=!0}={}){var q;c=Math.max(0,Math.min(i.length-1,$)),l=((q=i[c])==null?void 0:q.first)??0,y(),S(),E&&I()}function P($,{scroll:E=!0}={}){l=Math.max(0,Math.min(a.length-1,$)),c=v(l),y(),S(),E&&I()}function re($){const E=$-e.getBoundingClientRect().top;let q=0,B=1/0;return i.forEach((M,F)=>{const X=E<M.top?M.top-E:E>M.bottom?E-M.bottom:0;X<B&&(B=X,q=F)}),q}let Ce=!1;b.addEventListener("pointerdown",$=>{var E;Ce=!0,(E=b.setPointerCapture)==null||E.call(b,$.pointerId),u.classList.add("is-dragging"),$.preventDefault()}),b.addEventListener("pointermove",$=>{if(!Ce)return;const E=p(),q=re($.clientY-E*.6);q!==c&&A(q,{scroll:!1})});const _t=()=>{Ce&&(Ce=!1,u.classList.remove("is-dragging"),I())};b.addEventListener("pointerup",_t),b.addEventListener("pointercancel",_t);let et=0;const Tt=()=>{cancelAnimationFrame(et),et=requestAnimationFrame(()=>{var $;x(),c=v(l),t!=="word"&&(l=(($=i[c])==null?void 0:$.first)??l),u.classList.add("no-anim"),y(),S(),requestAnimationFrame(()=>u.classList.remove("no-anim"))})},ae=typeof ResizeObserver=="function"?new ResizeObserver(Tt):null;if(ae==null||ae.observe(e),(Rt=(At=document.fonts)==null?void 0:At.ready)==null||Rt.then(Tt).catch(()=>{}),x(),n==null){const $=o(),E=e.getBoundingClientRect().top,q=i.findIndex(B=>E+B.top>=$.top);c=Math.max(0,q),l=((Bt=i[c])==null?void 0:Bt.first)??0}else l=Math.max(0,Math.min(a.length-1,n)),c=v(l);return u.classList.add("no-anim"),y(),S(),requestAnimationFrame(()=>{u.classList.remove("no-anim"),n!=null&&I()}),{next(){t==="word"?P(l+1):A(c+1)},prev(){t==="word"?P(l-1):A(c-1)},nextLine:()=>A(c+1),prevLine:()=>A(c-1),tap($,E){const q=E?a.indexOf(E):-1;q>=0?t==="word"?P(q,{scroll:!1}):A(v(q),{scroll:!1}):A(re($),{scroll:!1})},follow($){const E=a.indexOf($);E<0||(t==="word"?E!==l&&P(E):v(E)!==c&&A(v(E)))},reveal:I,current:()=>a[l]??null,goTo($){t==="word"?P($):A(v(Math.max(0,Math.min(a.length-1,$))))},destroy(){ae==null||ae.disconnect(),cancelAnimationFrame(et),a.forEach($=>$.classList.remove("is-pointed")),e.classList.remove("has-ruler"),u.remove()}}}const ds="giri_story_place",us=40,ps=30,en=8,tn=()=>Jt(ds);function ft(){try{const e=localStorage.getItem(tn()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function at(e){try{localStorage.setItem(tn(),JSON.stringify(e))}catch{}}function hs(e,t=Date.now()){const n=t-ps*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(s.slice(0,us))}function nn(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=ft();if(t<en){if(!(e in s))return;delete s[e],at(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},at(hs(s,n))}function ms(e){const t=ft()[e];return t&&typeof t.word=="number"&&t.word>=en?t.word:null}function bt(e){const t=ft();e in t&&(delete t[e],at(t))}function Ht(e){const t=pe.get("groupMastery")||{},n=Qt.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function tt(e){const t=pe.get("groupMastery")||{};return Qt.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function sn(){const e=Ht([1,2,3,4,5]),t=tt([6]),n=Ht([6])>=.5,s=tt([8]),o=tt([7]),r=e>=.6||t,a=r&&(n||s),i=a&&o;return{A:{ready:!0,hint:""},B:{ready:r,hint:r?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:a,hint:a?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:i,hint:i?"":"Best after starting Phase 7 — Diphthongs"}}}function gs(e,t){const n=sn();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return s}return"A"}const he=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),fs=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...he[e]}))),yt=new Set(["short","long","schwa","rcontrolled","diphthong"]),bs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),Ue="bcdfghjklmnpqrstvwxyz",ys=new RegExp(`[${Ue}]a$`),vs=new RegExp("[bcdfghjkmnprstvz]al$"),on=/[ts]ion$/;function rn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(bs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&ys.test(e)&&t.add(e.length-1),e.length>=4&&vs.test(e)&&t.add(e.length-2),e.length>=5&&on.test(e)&&t.add(e.length-3)),t.size?t:null}const ws=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),Ss=new RegExp(`[${Ue}]e$`);function an(e){const t=new Set,n=e.length;if(n>=5&&on.test(e)&&t.add(n-2),n>=4&&Ss.test(e)&&!ws.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];Ue.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const $s=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),ks=new Set(["been"]),Es=new Set(["friend","friends"]),xs=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),Ls=["ing","ed","ly","es","s","n"];function Me(e,t){if(e.has(t))return!0;for(const n of Ls)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function $e(e,t,n,s,o,r){return yt.has(s)?r!=null&&r.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&Me($s,e)||t==="ee"&&Me(ks,e)||t==="ie"&&Me(Es,e)?"short":t==="ow"&&Me(xs,e)?"long":s:s}const k=null,ln=new Map([["have",[k,"short",k,"silent"]],["love",[k,"short",k,"silent"]],["come",[k,"short",k,"silent"]],["some",[k,"short",k,"silent"]],["done",[k,"short",k,"silent"]],["gone",[k,"short",k,"silent"]],["none",[k,"short",k,"silent"]],["give",[k,"short",k,"silent"]],["live",[k,"short",k,"silent"]],["one",["short",k,"silent"]],["were",[k,"rcontrolled","rcontrolled","silent"]],["here",[k,"rcontrolled","rcontrolled","silent"]],["where",[k,k,"rcontrolled","rcontrolled","silent"]],["there",[k,k,"rcontrolled","rcontrolled","silent"]],["above",["schwa",k,"short",k,"silent"]],["become",[k,"short",k,"short",k,"silent"]],["people",[k,"long","silent",k,k,"silent"]],["again",["schwa",k,"long","long",k]],["said",[k,"short","short",k]],["says",[k,"short","short",k]]]),qs=new Map(je.map(e=>[e.word.toLowerCase(),e])),cn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function Is(e){return cn[e]??"consonant"}function dn(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=rn(s),r=an(s),a=ln.get(s),i=[];let l=0;for(let c=0;c<t.length;c++){const u=t[c]||"",p=u.length||1;let m=Is(n[c]);yt.has(m)&&(m=(a==null?void 0:a[l])??$e(s,u,l,m,o,r)),i.push(m),l+=p}return i}const _s="aeiou",Ts="bcdfghjklmnpqrstvwxyz",Nt=e=>_s.includes(e),As=e=>Ts.includes(e),un=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Rs=Object.keys(un).sort((e,t)=>t.length-e.length);function Bs(e,t,n){const s=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&Nt(e[r])&&As(e[r+1])&&e[r+2]==="e"){s.push({len:1,sound:$e(e,e[r],r,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let a=!1;for(const i of Rs)if(e.startsWith(i,r)){s.push({len:i.length,sound:$e(e,i,r,un[i],t,n)}),r+=i.length,a=!0;break}if(!a){if(Nt(e[r])||e[r]==="y"&&r>0){const i=r===o-1?"long":"short";s.push({len:1,sound:$e(e,e[r],r,i,t,n)}),r+=1;continue}s.push({len:1,sound:null}),r+=1}}return s}function Cs(e,t,n,s){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const i=e.graphemes[a],l=i.length;if(l===2&&i[1]==="e"&&Ue.includes(i[0])&&r+2===t.length&&(s!=null&&s.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=cn[e.types[a]]??null;!yt.has(c)&&c!=="silent"&&(c=null),c=$e(t,i,r,c,n,s),o.push({len:l,sound:c}),r+=l}return o}function pn(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Gn.has(t))return null;const n=ln.get(t);if(n){const i=[];for(const l of n){const c=i[i.length-1];c&&c.sound===l?c.len+=1:i.push({len:1,sound:l})}return i}const s=rn(t),o=an(t),r=qs.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?Cs(r,t,s,o):Bs(t,s,o)}function Ms(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const n=pn(t);if(!n)return t;let s="",o=0;for(const{len:a,sound:i}of n){const l=t.slice(o,o+a);if(o+=a,!i){s+=l;continue}const c=(r=he[i])==null?void 0:r.cue;s+=`<span class="vs vs--${i}"${c?` data-cue="${c}"`:""}>${l}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function Hs(e,t){const n=[];let s="",o="";return e.forEach((r,a)=>{const i=r.replace(/^-/,"");if(t[a]==="silent"){o+=i;return}s+=o+i,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Ns(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Os(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:r,extraActions:a=""}){const i=dn(t,n,s),l=Hs(n,i),c=i.includes("silent");let u=0;const p=n.map((y,S)=>{const I=he[i[S]]??he.consonant;return T`<button
      type="button"
      class="bl-tile${i[S]==="silent"?" bl-tile--silent":""}"
      data-idx="${S}"
      data-mark="${I.mark||""}"
      style="--tile-color:${I.color}"
      aria-label="${i[S]==="silent"?`${y} is silent`:`Hear the sound for ${y}, ${I.label}`}"
    >
      ${y}
    </button>`});e.innerHTML=T`
    <div class="blend-ladder" data-word="${t}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${p}</div>
      ${c?T`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${Dn(a)}
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
  `;const m=y=>e.querySelector(y),d=m(".bl-steps"),h=m(".bl-next"),g=m(".bl-again"),f=m(".bl-say"),b=[...e.querySelectorAll(".bl-tile")];function x(){d.innerHTML=T`${l.slice(0,u).map((S,I)=>T`<li class="${I===u-1?"is-new":""}">${S}</li>`)}`,b.forEach(S=>{const I=Number(S.dataset.idx),A=i.slice(0,I+1).filter(re=>re!=="silent").length-1,P=i[I]==="silent"?u>=l.length:A>-1&&A<u;S.classList.toggle("is-lit",P),S.classList.toggle("is-current",i[I]!=="silent"&&A===u-1)});const y=u>=l.length;h.hidden=y,g.hidden=!y,f.textContent=y?"🔊 Hear the word":"🔊 Just hear the word",f.classList.toggle("bl-say--escape",!y),y&&l.length&&d.insertAdjacentHTML("beforeend",String(T`<li class="bl-done">
          Now say the whole word, then tap 🔊 to check. Does it make sense in the sentence?
        </li>`))}function v(){if(u>=l.length)return;const y=Ns(i,u);u+=1,x(),y>=0&&Promise.resolve(o(n[y],s[y],{word:t,index:y})).catch(()=>{})}return h.addEventListener("click",v),g.addEventListener("click",()=>{u=0,x(),h.focus({preventScroll:!0})}),f.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),b.forEach(y=>y.addEventListener("click",async()=>{const S=Number(y.dataset.idx);if(i[S]!=="silent"){y.classList.add("is-tapped"),setTimeout(()=>y.classList.remove("is-tapped"),300);try{await o(n[S],s[S],{word:t,index:S})}catch{}}})),x(),{destroy(){e.innerHTML=""}}}const Ws=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),Ps=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),Fs=3,Gs=e=>/[aeiouy]/.test(e);function it(e,t,n){const s=[];let o=0;for(;o<e.length;){let r=Ws.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(r=null),r?(s.push(r),o+=r.length):(s.push(e[o]),o+=1)}return s}function js(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){n.push("qu"),s.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function Ds(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const zs=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function Us(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of Ps){const u=c.slice(1),p=n.slice(0,-u.length);if(n.endsWith(u)&&p.length>=Fs&&Gs(p)){s=c,n=p;break}}const r=pn(n);if(!r)return null;const a=[],i=[];let l=0;for(const{len:c,sound:u}of Ds(r)){const p=n.slice(l,l+c);if(u)a.push(p),i.push(zs[u]??"sv");else for(const m of it(p,n,l))a.push(m),i.push("c");l+=c}if(l<n.length)for(const c of it(n.slice(l),n,l))a.push(c),i.push("c");return o&&(a.push("s"),i.push("c")),s&&(a.push(s),i.push("sf")),a.length?js(a,i):null}function Ys(e,t){const n=[],s=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){n.push(o),s.push(t[r]);return}const a=String(o).toLowerCase();for(const i of it(a,a,0))n.push(i),s.push("c")}),{graphemes:n,types:s}}const Ks=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),Vs=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function Js(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function Qs(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function Xs(e,t,n=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const s=t/60,o=Math.round(e/s);if(n==null||Number.isNaN(n))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(n)));return{wpm:o,wcpm:Math.round((e-r)/s),accuracy:Math.round((e-r)/e*100)}}function Zs({wpm:e,wcpm:t=null,primaryGrade:n=null,now:s=new Date}){var c,u;const o=Qs(n),r=Js(s),a=o?(c=Ks[o])==null?void 0:c[r]:null,i=o?(u=Vs[o])==null?void 0:u[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const l=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:l}:i!=null&&t>=i?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:l}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:l}}const eo="giri_friends_unlocked";function hn(){return Jt(eo)}const to=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function no(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function mn(e){if(!e||!e.id)return null;const t=to[e.id]||no(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function vt(){try{const e=localStorage.getItem(hn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function so(e){try{localStorage.setItem(hn(),JSON.stringify(Array.from(e)))}catch{}}function oo(e){if(!e||typeof e!="string")return!1;const t=vt();return t.has(e)?!1:(t.add(e),so(t),!0)}function ro(e){return vt().has(e)}function ao(e){const t=vt();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=mn(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function gn(e){const t=ao(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const fn="giri_fluency_history",Ot=5,ne=new Map,io=10;function lo(e,t){for(ne.set(e,t);ne.size>io;){const n=ne.keys().next().value;ne.delete(n)}}let ce=null,H=null,nt=[],de=null,ke=null,Ye="idle",N=null;async function bn({storyId:e,lineIdx:t,onStateChange:n}={}){if(Ye==="recording")return!1;ke=n??null,nt=[];try{ce=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return D("error"),!1}const s=po();try{H=new MediaRecorder(ce,s?{mimeType:s}:{})}catch{H=new MediaRecorder(ce)}return H.ondataavailable=o=>{o.data.size>0&&nt.push(o.data)},H.onstop=()=>{const o=new Blob(nt,{type:H.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;de=r,lo(r,o),ct(),D("recorded")},H.onerror=()=>{ct(),D("error")},H.start(),D("recording"),!0}function We(){H&&H.state==="recording"?H.stop():ct()}function yn(e){const t=de,n=t?ne.get(t):null;return n?new Promise(s=>{Ke();const o=URL.createObjectURL(n);N=new Audio(o),D("playing"),N.onended=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.onerror=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.play().catch(()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()})}):Promise.resolve()}function Ke(){N&&(N.pause(),N=null)}function lt(e){const t=de;t&&ne.delete(t),t===de&&(de=null),Ke(),D("idle")}function vn(){return Ye}function wn(){We(),Ke(),ne.clear(),de=null,Ye="idle",ke=null}function co(e){const t=Sn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>Ot&&n.splice(0,n.length-Ot),t[e.storyId]=n,ho(t)}function uo(e){return Sn()[e]??[]}function D(e){Ye=e,ke==null||ke(e)}function ct(){ce&&(ce.getTracks().forEach(e=>e.stop()),ce=null)}function po(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function Sn(){try{return JSON.parse(localStorage.getItem(fn)??"{}")}catch{return{}}}let Wt=!1;function ho(e){try{localStorage.setItem(fn,JSON.stringify(e))}catch{if(Wt)return;Wt=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const $n="/phonicsquest/";function mo(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return je.find(n=>n.word===t)??null}function kn(e){return e.split(/(\s+|["""'',.!?;:()-]+)/).filter(n=>n.length>0).map(n=>({text:n,type:/^\s+$/.test(n)?"space":/^[^a-zA-Z0-9]+$/.test(n)?"punct":"word"}))}let w=null,G="A",Pt=!1,ie="band",we="aloud",qe=!1,le=null,Pe=[],_=null,W="word",Ie=!1,me=-1,Re=[],Ee=0,Ve=[],Je=0,_e=0;const En="giri_stories_read";function z(){try{return JSON.parse(localStorage.getItem(En)??"[]")}catch{return[]}}function Be(e){const t=z();t.includes(e)||(t.push(e),localStorage.setItem(En,JSON.stringify(t))),bt(e),oo(e)}let He=null,xe=null,Fe=!1,Ne=0;const wt="giri_show_graphemes",xn="giri_show_ruler",Ln="giri_ruler_mode",St="giri_follow_mode",qn="giri_meet_words",Ft="giri_comp_log";let C=Qe(wt,!0),ee=Qe(xn,!1),L=null,Y=null,dt=Qe(Ln,"line"),te=null,Te=0,O=null;W=Qe(St,"word");function Qe(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function ue(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const In=new Set;function _n(){return new Date().toISOString().slice(0,10)}function Tn(){try{const e=localStorage.getItem(qn);return e?JSON.parse(e):{}}catch{return{}}}function go(e){try{localStorage.setItem(qn,JSON.stringify(e))}catch{}}function fo(e){return In.has(e)?!0:Tn()[e]===_n()}function Gt(e){In.add(e);const t=Tn();t[e]=_n();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];go(t)}const jt=new Set,bo=100;function st(e){try{const t=localStorage.getItem(Ft),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>bo;)n.shift();localStorage.setItem(Ft,JSON.stringify(n))}catch{}}function Vo(e,t){w=e}function Jo(){R(),ge()}function Qo(){R(),mt(),wn(),kt(),Xe()}function Xe(){le==null||le.remove(),le=null}function ge(){var n,s,o;Xe(),fe(),An(),_=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ie==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ie==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ie==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Wo()}</button>
    </div>
  `;let t;if(ie==="band"){if(!Pt){Pt=!0;try{const d={};for(const h of V)(d[n=h.band]??(d[n]=[])).push(h);G=gs(z(),d)||G}catch{}}const r=j.find(d=>d.band===G)??j[0],a=V.filter(d=>d.band===G&&d.category!=="chapter"&&d.category!=="nonfiction-sg"),i=z(),l=a.filter(d=>i.includes(d.id)).length,c=sn(),u=j.map(d=>{var h,g,f;return`
      <button
        class="story-tab${d.band===G?" active":""}${(h=c[d.band])!=null&&h.ready?"":" story-tab--not-ready"}"
        data-band="${d.band}"
        style="--tab-color:${d.color}"
        ${(g=c[d.band])!=null&&g.ready?"":`title="${c[d.band].hint}"`}
      >
        <span class="story-tab-num">${d.band}</span>
        <span class="story-tab-name">${d.label}</span>
        ${(f=c[d.band])!=null&&f.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),p=a.map(d=>ot(d,r,!1,i.includes(d.id))).join(""),m=a.length?Math.round(l/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${u}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${G}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${l} of ${a.length} stories read">
          ${l}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${m}%"></span>
        </span>
      </div>
      ${(s=c[G])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[G].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${p}</div>
    `}else if(ie==="singapore"){const r=V.filter(l=>l.category==="nonfiction-sg"),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(l=>{const c=j.find(u=>u.band===l.band)??j[0];return ot(l,c,!1,a.includes(l.id))}).join("")}</div>
    `}else{const r=V.filter(l=>l.category==="chapter").sort((l,c)=>(l.chapterNum??0)-(c.chapterNum??0)),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(l=>{const c=j.find(u=>u.band===l.band)??j[0];return ot(l,c,!0,a.includes(l.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{ie=r.dataset.cat,ge()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Po()}),w.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{G=r.dataset.band,ge()})}),w.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>$t(r.dataset.storyId))})}function ot(e,t,n=!1,s=!1){var i;const o=(i=e.comprehension)!=null&&i.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${$n}images/stories/${e.illustration}"
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
        ${Ut(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const l=Yt(e).length;return l?`<span class="story-card-support" data-support="independent">👀 ${l} new ${l===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function $t(e){const t=V.find(n=>n.id===e);t&&(R(),te=z().includes(t.id)?null:ms(t.id),be.clear(),yo(t))}function yo(e){var n,s,o;_=e;const t=j.find(r=>r.band===e.band)??j[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${$n}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Ut(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      ${(()=>{const r=Yt(e);return r.length?`
          <div class="story-prep" aria-labelledby="story-prep-title">
            <p class="story-prep-title" id="story-prep-title">
              👀 Words to know first — tap to hear
            </p>
            <div class="story-prep-words">${r.map(({word:i,display:l,status:c})=>`<button type="button" class="story-prep-word" data-prep-word="${se(i)}"
                       data-status="${se(c)}" aria-label="Hear the word ${se(l)}"
                >${gt(l)}</button>`).join("")}</div>
          </div>`:`
          <p class="story-prep story-prep--none">
            ✅ You can sound out every word in this story.
          </p>`})()}

      <!-- Mode toggle — plain-language labels so a grown-up knows which is
           which: listen together, or tap words to sound them out. -->
      <div class="story-mode-toggle" role="group" aria-label="Reading mode">
        <button class="smode-btn${we==="aloud"?" active":""}" data-mode="aloud"  id="btn-mode-aloud">
          <span class="smode-btn-title">📖 Listen &amp; Follow</span>
          <span class="smode-btn-sub">Giri reads · you follow along</span>
        </button>
        <button class="smode-btn${we==="decode"?" active":""}" data-mode="decode" id="btn-mode-decode">
          <span class="smode-btn-title">🔤 Sound It Out</span>
          <span class="smode-btn-sub">Tap any word to decode it</span>
        </button>
      </div>

      <!-- Dynamic content area (pre-teach + story body + controls) -->
      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{R(),ge()}),w.querySelectorAll("[data-prep-word]").forEach(r=>{r.addEventListener("click",()=>{var a,i;(i=(a=oe.speakSightWord(r.dataset.prepWord))==null?void 0:a.catch)==null||i.call(a,()=>{}),r.classList.add("story-prep-word--said"),setTimeout(()=>r.classList.remove("story-prep-word--said"),600)})}),(s=document.getElementById("btn-mode-aloud"))==null||s.addEventListener("click",()=>{we="aloud",R(),Dt("aloud"),Le(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{we="decode",R(),Dt("decode"),Le(e)}),Le(e)}function Le(e){fo(e.id)?we==="aloud"?Ae(e):Nn(e):vo(e)}function Dt(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function vo(e){var d,h;const t=document.getElementById("story-dynamic");if(!t)return;fe(),Pe=e.vocab??[];const n=Kt(e),s=e.lines.map(g=>g.text??"").join(" ").toLowerCase(),o=Pe.filter(g=>{const f=g.word.toLowerCase().split(/\s+/)[0];return s.includes(f)});if(!n.length&&!o.length){Gt(e.id),Le(e);return}const r=n.length+o.length,i=Math.min(3,r),l=new Set,c=n.map(g=>`
    <button class="hfw-chip" data-tap-id="hfw:${g}" data-word="${g}" aria-label="Hear sight word ${g}">
      ⭐ ${g}
    </button>
  `).join(""),u=o.map(g=>`
    <button class="vocab-chip" data-tap-id="vocab:${g.word}" data-word="${g.word}" aria-label="Key word: ${g.word}">
      <span class="vocab-chip-icon">${g.icon}</span>
      <span class="vocab-chip-word">${g.word}</span>
      <span class="vocab-chip-meaning">${g.meaning}</span>
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
  `;function p(g){const f=g.dataset.tapId;if(l.has(f))return;l.add(f),g.setAttribute("data-tapped","true");const b=document.getElementById("gate-progress");if(b&&(b.textContent=l.size>=i?`✓ Warmed up (${l.size} tapped) — keep going or start the story`:`${l.size} of ${i} tapped`),l.size>=i){const x=document.getElementById("gate-continue");x&&(x.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(g=>{g.addEventListener("click",async()=>{ht(g);try{await oe.speakWord(g.dataset.word)}catch{}p(g)})});const m=()=>{Gt(e.id),Le(e)};(d=document.getElementById("gate-skip"))==null||d.addEventListener("click",m),(h=document.getElementById("gate-continue"))==null||h.addEventListener("click",m)}function Oe(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function Ae(e){var c,u,p,m,d,h,g,f,b,x;const t=document.getElementById("story-dynamic");if(!t)return;fe(),Xe();const n=e.lines.map((v,y)=>Io(v,y,!0,e)).join(""),s=!!((c=e.comprehension)!=null&&c.length),r=!!((u=e.talkAboutIt)!=null&&u.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(v=>`<li>${v}</li>`).join("")}
      </ul>
    </div>
  `:"",a=uo(e.id),i=a.length?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${a.slice().reverse().map(v=>{const y=new Date(v.date),S=`${y.getDate()}/${y.getMonth()+1}`,I=typeof v.wcpm=="number"&&v.errors!=null,A=I?v.wcpm:v.wpm??v.wcpm,P=I?"correct/min":"words/min",re=v.support==="supported"?" · with help":"";return`<span class="fluency-history-item">${S}: <strong>${A}</strong> ${P}${re}</span>`}).join("")}
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
                Time one read-aloud of the whole story (${Oe(e)} words).
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
                  <input type="number" name="errors" min="0" max="${Oe(e)}" inputmode="numeric" />
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
              <span class="rtg-label">${zn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${os()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(v=>{v.addEventListener("click",()=>{W=v.dataset.follow,ue(St,W),Ae(e)})}),t.querySelectorAll(".wf-word").forEach(v=>{v.setAttribute("role","button"),v.setAttribute("tabindex","0");const y=S=>{const I=xt(v);I&&(S.preventDefault(),L==null||L.tap(S.clientY??0,v),Bo(I))};v.addEventListener("click",y),v.addEventListener("keydown",S=>{(S.key==="Enter"||S.key===" ")&&y(S)})}),(p=document.getElementById("btn-toggle-graphemes"))==null||p.addEventListener("click",()=>{C=!C,ue(wt,C),Ae(e)}),(m=document.getElementById("btn-toggle-ruler"))==null||m.addEventListener("click",()=>{var v,y;ee=!ee,ue(xn,ee),(v=document.getElementById("btn-toggle-ruler"))==null||v.setAttribute("aria-pressed",String(ee)),fe(),ee&&(pt(),(y=document.getElementById("btn-ruler-next"))==null||y.focus({preventScroll:!0}))}),ee?requestAnimationFrame(()=>pt(te)):te!==null&&requestAnimationFrame(()=>ut(te)),wo(e),(d=document.getElementById("btn-resume-restart"))==null||d.addEventListener("click",v=>{var y;bt(e.id),te=null,(y=v.currentTarget.closest(".story-resume"))==null||y.remove(),ut(0),L&&L.goTo(0)}),So(),(h=document.getElementById("btn-story-play"))==null||h.addEventListener("click",()=>Wn(e)),(g=document.getElementById("btn-story-stop"))==null||g.addEventListener("click",()=>R());const l=Oe(e);(f=document.getElementById("btn-fluency-start"))==null||f.addEventListener("click",()=>jo()),(b=document.getElementById("btn-fluency-done"))==null||b.addEventListener("click",()=>mt(l)),Do(l,e),Fo(e),kt(),Eo(e),Go(e),(x=document.getElementById("btn-launch-quest"))==null||x.addEventListener("click",()=>{R(),mt(),wn(),Be(e.id),Vn(w,e,()=>{ge()})})}function ut(e){const t=w==null?void 0:w.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:J(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function wo(e){An();const t=document.getElementById("story-body");if(!t)return;const n=ze(t);n&&(O=n,O._pqPlaceHandler=()=>{clearTimeout(Te),Te=setTimeout(()=>{if(L||z().includes(e.id))return;const s=t.getBoundingClientRect(),o=Rn();if(s.bottom<o.top||s.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(i=>i.getBoundingClientRect().top>=o.top);a>=0&&nn(e.id,a)},500)},n.addEventListener("scroll",O._pqPlaceHandler,{passive:!0}))}function So(){const e=document.getElementById("story-resume");if(!e)return;const t=ze(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&s()};t==null||t.addEventListener("scroll",r,{passive:!0}),n=setTimeout(s,9e3)}function An(){clearTimeout(Te),O!=null&&O._pqPlaceHandler&&(O.removeEventListener("scroll",O._pqPlaceHandler),delete O._pqPlaceHandler),O=null}function Rn(){const e=document.getElementById("story-body"),t=e?ze(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,a=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),i=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(i,r+120)}}function Ge(){return Se.find(e=>e.id===dt)??Se[1]}function $o(){const e=Ge();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${se(e.label)}. Tap to change."
              title="${se(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${gt(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function pt(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=$o();const s=Ge(),o=n.querySelector(".ruler-pos small"),r=n.querySelector(".ruler-pos b"),a=n.querySelector("#btn-ruler-next"),i=n.querySelector("#btn-ruler-back");L=cs(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Rn,onMove(l){Y=l;const c=s.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${l.word+1} / ${l.words}`:`${l.line+1} / ${l.lines}`,i.disabled=c?l.word===0:l.line===0,a.textContent=l.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",l.atEnd),clearTimeout(Te),Te=setTimeout(()=>{z().includes((_==null?void 0:_.id)??"")||nn(_==null?void 0:_.id,l.word)},400)}}),i.addEventListener("click",()=>L==null?void 0:L.prev()),a.addEventListener("click",()=>{if(!(Y!=null&&Y.atEnd))return L==null?void 0:L.next();const l=_;if(!l)return;Be(l.id);const c=document.getElementById("story-quest-cta");c&&(c.hidden=!1),qt(l),Lt(l)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var u;const l=(Y==null?void 0:Y.word)??0,c=Se.indexOf(Ge());dt=Se[(c+1)%Se.length].id,ue(Ln,dt),fe(),pt(l),(u=document.getElementById("btn-ruler-style"))==null||u.focus({preventScroll:!0})})}function fe(){L==null||L.destroy(),L=null,Y=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function ko(e){var s,o;if(!L||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Ge().id==="word",n={ArrowDown:()=>L.nextLine(),ArrowUp:()=>L.prevLine(),ArrowRight:()=>t?L.next():L.nextLine(),ArrowLeft:()=>t?L.prev():L.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",ko);function Eo(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>xo(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>Lo(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Mn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{kt(),Ae(e)})}function K(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function Bn(){const e=Re[me];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function xo(e){var n,s,o;if(W!=="word"){W="word",ue(St,W),Ae(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}R();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(Ie=!0,Re=t,me=0,Ee=0,Ve=[],Je=0,_e=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Cn(),K("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Cn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=Bn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:J()}))}async function Lo(e){var u;const t=Bn(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(xt).filter(Boolean).join(" ");if(!o){Mn(e);return}n.disabled=!0,n.replaceChildren(Kn("encourage"),document.createTextNode("Giri is listening…")),K("Go ahead — read the glowing line now.");const r=await rs(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!Ie)return;if(!r){Ee++,Ee>=2?K("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):K("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Ee=0;const a=[];r.words.forEach((p,m)=>{const d=s[m];if(d)if(d.classList.remove("rtg-word--match","rtg-word--check"),p.status==="miss"){d.classList.add("rtg-word--check");const h=p.word.replace(/[^a-z]/g,"");h.length>2&&(a.push(h),Zt(h))}else d.classList.add("rtg-word--match")});const i=r.words.filter(p=>p.status!=="miss").length;Je+=i,_e+=r.words.length,Ve.push(...a);const l=me>=Re.length-1;a.length>0?K(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${l?"finish up":"go on"}!`):K("⭐ Great — Giri heard every word!"),(u=document.getElementById("btn-rtg-listen"))==null||u.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=l?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Mn(e){var t,n;if(me>=Re.length-1){qo(e);return}me++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),Cn(),K("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function qo(e){var i,l;const t=_e>0?Math.round(Je/_e*100):0,n=[...new Set(Ve)],s={...pe.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},pe.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(i=document.getElementById("btn-rtg-next"))==null||i.setAttribute("hidden",""),(l=document.getElementById("btn-rtg-exit"))==null||l.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";K(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),Be(e.id),Ie=!1}function kt(){Ie&&as(),Ie=!1,me=-1,Re=[],Ee=0,Ve=[],Je=0,_e=0}function Et(e){return!C||!e?e:Ms(e)}function Hn(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${fs.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Io(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${gt(o)}</div>`;const r=s?Et(o,s.targetGraphemes,s.band):o,a=n?_o(o,s):r;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function _o(e,t=null){if(!e)return"";const n=kn(e);let s=0;return n.map(o=>{if(o.type==="word"){const r=t?Et(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${se(o.text)}" aria-label="${se(o.text)}">${r}</span>`}return o.text}).join("")}function xt(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Nn(e){var c,u,p,m;const t=document.getElementById("story-dynamic");if(!t)return;fe(),Xe(),Pe=e.vocab??[];const s=Kt(e).map(d=>`
    <button class="hfw-chip" data-word="${d}" aria-label="Hear sight word ${d}">
      ⭐ ${d}
    </button>
  `).join(""),o=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),a=Pe.filter(d=>{const h=d.word.toLowerCase().split(/\s+/)[0];return o.includes(h)}).map(d=>`
    <button class="vocab-chip" data-word="${d.word}" aria-label="Key word: ${d.word}">
      <span class="vocab-chip-icon">${d.icon}</span>
      <span class="vocab-chip-word">${d.word}</span>
      <span class="vocab-chip-meaning">${d.meaning}</span>
    </button>
  `).join(""),i=e.lines.map((d,h)=>{if(d.type==="label")return`<div class="sline sline--label" data-line="${h}">${d.text}</div>`;const f=kn(d.text).map(x=>{if(x.type==="word"){const v=x.text.toLowerCase().replace(/[^a-z]/g,""),y=Vt(v),S=Et(x.text,e.targetGraphemes,e.band);return`<button class="decode-word${y?" decode-hfw":""}"
                         data-word="${x.text}"
                         aria-label="${y?"Sight word: ":"Decode: "}${x.text}"
                >${S}</button>`}return`<span class="decode-punct">${x.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[d.type]??""} decode-line" data-line="${h}">${f}</p>`}).join("");t.innerHTML=`
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
      ${a.length?`
      <div class="vocab-preteach" id="vocab-preteach">
        <div class="hfw-preteach-header">
          <span class="hfw-preteach-title">📚 Key Words — tap to hear</span>
          <button class="hfw-toggle-btn" id="btn-vocab-toggle" aria-expanded="true" aria-controls="vocab-chip-list">
            Hide ▲
          </button>
        </div>
        <div id="vocab-chip-list" class="vocab-chip-list">${a}</div>
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
  `,(c=document.getElementById("btn-toggle-graphemes-decode"))==null||c.addEventListener("click",()=>{C=!C,ue(wt,C),Nn(e)}),(u=document.getElementById("btn-hfw-toggle"))==null||u.addEventListener("click",()=>{const d=document.getElementById("hfw-chip-list"),h=document.getElementById("btn-hfw-toggle"),g=h.getAttribute("aria-expanded")==="true";d.hidden=g,h.setAttribute("aria-expanded",String(!g)),h.textContent=g?"Show ▼":"Hide ▲"}),(p=document.getElementById("btn-vocab-toggle"))==null||p.addEventListener("click",()=>{const d=document.getElementById("vocab-chip-list"),h=document.getElementById("btn-vocab-toggle"),g=h.getAttribute("aria-expanded")==="true";d.hidden=g,h.setAttribute("aria-expanded",String(!g)),h.textContent=g?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(d=>{d.addEventListener("click",()=>{var f,b;const h=d.dataset.word;ht(d);const g=new SpeechSynthesisUtterance(h);g.rate=.85,Q(g),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(g)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",()=>{var f,b;const h=d.dataset.word;ht(d),d.classList.toggle("vocab-chip--expanded");const g=new SpeechSynthesisUtterance(h);g.rate=.85,Q(g),(f=window.speechSynthesis)==null||f.cancel(),(b=window.speechSynthesis)==null||b.speak(g)})}),(m=document.getElementById("btn-mark-read"))==null||m.addEventListener("click",d=>{Be(e.id);const h=d.currentTarget;h.textContent="✓ Read!",h.disabled=!0,h.classList.add("btn--success"),qt(e),Lt(e)});const l=document.getElementById("decode-panel");l&&(l.remove(),document.body.appendChild(l)),le=l,t.querySelectorAll(".decode-word").forEach(d=>{d.addEventListener("click",()=>To(d))})}async function To(e){var a,i,l,c;document.querySelectorAll(".decode-word.decoding").forEach(u=>u.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,n=t.toLowerCase().replace(/[^a-z]/g,"");n&&be.add(n);const s=mo(t),o=!s&&Vt(n),r=le;if(r){if(r.removeAttribute("hidden"),o){rt({type:"hfw",word:n});const u=new SpeechSynthesisUtterance(n);u.rate=.85,Q(u),(a=window.speechSynthesis)==null||a.cancel(),(i=window.speechSynthesis)==null||i.speak(u)}else if(!rt({type:"decode",word:(s==null?void 0:s.word)??n,wordObj:s??{word:n}})){rt({type:"tts",word:n});const p=new SpeechSynthesisUtterance(n);p.rate=.85,Q(p),(l=window.speechSynthesis)==null||l.cancel(),(c=window.speechSynthesis)==null||c.speak(p)}}}function rt({type:e,word:t,wordObj:n}){var o,r;const s=document.getElementById("decode-panel-inner");return s?e==="hfw"?(s.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(o=document.getElementById("dp-hear"))==null||o.addEventListener("click",()=>{var i,l;const a=new SpeechSynthesisUtterance(t);a.rate=.85,Q(a),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(a)}),!0):e==="tts"?(s.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(r=document.getElementById("dp-hear"))==null||r.addEventListener("click",()=>{var i,l;const a=new SpeechSynthesisUtterance(t);a.rate=.85,Q(a),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(a)}),!0):(s.innerHTML="",On(s,n)):!1}function On(e,t,n=!0){var a;const s=n&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:Us(t.word);if(!s)return!1;const{graphemes:o,types:r}=Ys(s.graphemes,s.types);return Os(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(i,l,c)=>oe.speakPhoneme(i,l,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:i=>oe.speakWord(i)}),!0}function ht(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function Ao(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const r=n[s+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function Wn(e){if(!window.speechSynthesis)return;R(),_=e,It(!0),qe=!0;const t=Ao(e);Pn(t,0)}function Pn(e,t){if(!qe||t>=e.length){zt();return}const n=e[t];Ho(n.highlightIdx);const s=new SpeechSynthesisUtterance(n.text);s.rate=.82,Q(s);const o=n.text.startsWith("Puff")?600:380;W==="word"&&Ro(s,n.highlightIdx),s.onend=()=>{Ze(),qe&&setTimeout(()=>Pn(e,t+1),o)},s.onerror=()=>zt(),window.speechSynthesis.speak(s)}function Ro(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=e.text||"";let r=!1,a=-1,i=[],l=!1;function c(d){if(d<0||d>=s.length||d===a)return;a=d,s.forEach(g=>g.classList.remove("wf-word--active"));const h=s[d];h.classList.add("wf-word--active"),L?L.follow(h):Mo(h)}function u(){for(const d of i)clearTimeout(d);i=[]}function p(){var f;if(l)return;l=!0;const d=typeof e.rate=="number"&&e.rate>0?e.rate:.82,h=Array.from(s,xt);let g=0;for(let b=0;b<s.length;b++){const x=b,v=((f=h[b])==null?void 0:f.length)||3,y=Math.max(160,Math.round((90+v*60)/d)),S=setTimeout(()=>{r||c(x)},g);i.push(S),g+=y}}e.addEventListener("boundary",d=>{d.name&&d.name!=="word"||(r=!0,u(),c(Jn(o,d.charIndex??-1)))}),e.addEventListener("end",()=>{u()}),e.addEventListener("start",()=>{if(r)return;const d=setTimeout(()=>{r||(c(0),p())},180);i.push(d)});const m=setTimeout(()=>{r||l||(c(0),p())},800);i.push(m)}function Bo(e){var a;const t=document.getElementById("word-detective-content");if(!t)return;be.add(e.toLowerCase().replace(/[^a-z']/g,"")),R();const n=Zn(e);t.innerHTML=Co(n),ve.open("modal-word-detective");const s=t.querySelector('[data-role="ladder"]');if(!(s&&On(s,{word:n.text,graphemes:n.graphemes,types:n.types},n.foundInBank))){const i=t.querySelector(".wd-fallback");i&&(i.hidden=!1);try{oe.speakWord(n.text)}catch{}}(a=t.querySelector('[data-action="hear"]'))==null||a.addEventListener("click",()=>{try{oe.speakWord(n.text)}catch{}});const r=t.querySelector('[data-action="add-review"]');r==null||r.addEventListener("click",()=>{if(!n.word)return;Zt(n.word.id)&&(r.disabled=!0,r.textContent="✓ In your Review Lane")})}function Co(e){const t=r=>String(r??"").replace(/[<>&]/g,a=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[a]),n=dn(e.text,e.graphemes,e.types),s=e.graphemes.map((r,a)=>{const i=he[n[a]]??he.consonant,l=i.mark?` data-mark="${t(i.mark)}"`:"";return`<span class="wd-tile vs--${n[a]}"${l} style="--tile-color:${i.color}" aria-label="${t(r)}, ${t(i.label)}">${t(r)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
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
    </div>`}function J(){return Yn()?"auto":"smooth"}function Mo(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;Qn(t,n)&&e.scrollIntoView({block:"center",behavior:J()})}catch{}}function Ze(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function Ho(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),Ze();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");L&&n?L.follow(n):t.scrollIntoView({behavior:J(),block:"nearest"})}}function Q(e){var n,s;let t;try{t=((s=(n=oe).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function R(){var e;qe=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ze(),It(!1)}function zt(){qe=!1,w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ze(),It(!1),_&&Be(_.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),_&&qt(_),_&&Lt(_)}const be=new Set;function No(e){const t=V.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=z();return t.find(s=>!n.includes(s.id))??t[0]??null}function Oo(e){var s,o;const t=[T`You read <strong>${e.title}</strong> — ${Oe(e)} words.`];if(be.size){const r=be.size;t.push(T`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(T`You had a think about what happened.`);const n=ro(e.id)?(o=mn(e))==null?void 0:o.name:"";return n&&t.push(T`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function Lt(e){var o,r,a;if(!e)return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=No(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=T`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${Oo(e).map(i=>T`<li>${i}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${n?T`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${n.id}"
          >
            ➡️ Next: ${n.title}
          </button>`:""}
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `,t.appendChild(s),s.scrollIntoView({behavior:J(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{be.clear(),bt(e.id),te=null,s.remove(),ut(0),L&&L.goTo(0)}),(r=s.querySelector("#btn-ending-next"))==null||r.addEventListener("click",i=>{R(),$t(i.currentTarget.dataset.storyId)}),(a=s.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{R(),ge()})}function qt(e){var a,i,l;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||jt.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;jt.add(e.id);const n=e.talkAboutIt[0],s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:J(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.resp;if(st({storyId:e.id,question:n,response:u}),o.querySelectorAll(".comp-choice").forEach(m=>m.disabled=!0),c.classList.add("correct"),u==="confident")r.textContent="👍 Great! You understood the story.";else if(u==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Wn(e),300);else{r.textContent="💡 Look at the end of the story for clues.";const m=w==null?void 0:w.querySelector(".sline.sline--end, .sline:last-of-type");m==null||m.scrollIntoView({behavior:J(),block:"center"})}r.hidden=!1;const p=o.querySelector("#comp-more");p&&(p.hidden=!1)})}),(i=o.querySelector("#comp-more"))==null||i.addEventListener("click",()=>{var u;const c=o.querySelector("#comp-q");c&&(c.textContent=s),st({storyId:e.id,question:s,response:"followup"}),(u=o.querySelector("#comp-more"))==null||u.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(p=>{p.disabled=!1,p.classList.remove("correct")})}),(l=o.querySelector("#comp-skip"))==null||l.addEventListener("click",()=>{st({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Wo(){try{const e=gn(V);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Po(){var a,i;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=gn(V),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=l=>String(l??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const l of e.roster)s.has(l.band)||s.set(l.band,[]),s.get(l.band).push(l);const o=Array.from(s.entries()).sort((l,c)=>String(l[0]).localeCompare(String(c[0]))).map(([l,c])=>{const u=c.filter(m=>m.unlocked).length,p=c.map(m=>`
        <button class="sf-tile ${m.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${n(m.storyId)}"
                ${m.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${m.unlocked?`${n(m.name)} from ${n(m.storyTitle)} — tap to re-read`:`Locked — read ${n(m.storyTitle)} to meet ${n(m.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${m.unlocked?n(m.emoji):"🔒"}</span>
          <span class="sf-tile__name">${m.unlocked?n(m.name):"???"}</span>
          ${m.unlocked?`<span class="sf-tile__story">from ${n(m.storyTitle)}</span>`:`<span class="sf-tile__story">${n(m.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${n(l)} <small>${u}/${c.length} met</small></h3>
          <div class="sf-grid">${p}</div>
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
    </div>`,document.body.appendChild(t),ve.open("modal-story-friends"),(i=t.querySelector("[data-close]"))==null||i.addEventListener("click",()=>{ve.close("modal-story-friends"),t.remove()}),t.addEventListener("click",l=>{l.target===t&&(ve.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.storyId;c&&(ve.close("modal-story-friends"),t.remove(),$t(c))})})}function It(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function Fo(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(i){if(t.hidden=i!=="idle",n.hidden=i!=="recording",s.hidden=i!=="recorded"&&i!=="playing",o.hidden=i!=="recorded"&&i!=="playing",r)switch(i){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}s&&(s.textContent=i==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await bn({storyId:e.id,onStateChange:a})||a("error")}),n.addEventListener("click",()=>{We()}),s.addEventListener("click",()=>{vn()==="playing"?(Ke(),a("recorded")):yn()}),o.addEventListener("click",()=>{lt(),a("idle")})}function Go(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const i=e.lines.map((p,m)=>({...p,idx:m})).filter(p=>p.type!=="label"&&p.type!=="chapter"&&p.text);let l=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(p=>p.classList.remove("sline--echo-active")),l=-1}function u(p){var g,f;l=p;const m=i[p];if(!m){c();return}m.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(b=>b.classList.remove("sline--echo-active"));const d=w==null?void 0:w.querySelector(`[data-line="${m.idx}"]`);d&&(d.classList.add("sline--echo-active"),d.scrollIntoView({behavior:J(),block:"nearest"})),a&&(a.textContent=`Line ${p+1} of ${i.length}`,a.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const h=new SpeechSynthesisUtterance(m.text);h.rate=.82,Q(h),h.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${p+1}`)},h.onerror=()=>{s.hidden=!1},(g=window.speechSynthesis)==null||g.cancel(),(f=window.speechSynthesis)==null||f.speak(h)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,u(0)}),s.addEventListener("click",async()=>{if(vn()==="recording"){We();return}const p=i[l];!await bn({storyId:e.id,lineIdx:p==null?void 0:p.idx,onStateChange:d=>{d==="recording"?(s.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):d==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=l>=i.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):d==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{yn()}),n.addEventListener("click",()=>{lt(),o.hidden=!0,l+1<i.length?u(l+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{R(),We(),lt(),c()})}function jo(){Fe||(Fe=!0,xe=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,He=setInterval(()=>{const e=Math.floor((Date.now()-xe)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}const Fn=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function mt(e,t){var l;if(!Fe&&He===null)return;clearInterval(He),He=null,Fe=!1;const n=document.getElementById("btn-fluency-start"),s=document.getElementById("btn-fluency-done");if(n&&(n.disabled=!1),s&&(s.disabled=!0),!e||!xe)return;const o=(Date.now()-xe)/1e3;xe=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;Ne=o,r&&(r.hidden=!0),a.hidden=!1;const i=document.getElementById("fluency-time");i&&(i.textContent=`${e} words in ${Fn(o)}.`),(l=a.querySelector('input[name="errors"]'))==null||l.focus({preventScroll:!0})}function Do(e,t){var o;const n=document.getElementById("fluency-form"),s=document.getElementById("fluency-result");!n||!s||(n.addEventListener("submit",r=>{var h,g,f;r.preventDefault();const a=((h=n.querySelector('input[name="errors"]'))==null?void 0:h.value)??"",i=a===""?null:Number(a),l=((g=n.querySelector('input[name="support"]:checked'))==null?void 0:g.value)??null,{wpm:c,wcpm:u,accuracy:p}=Xs(e,Ne,i);co({storyId:t.id,wpm:c,wcpm:u,errors:i,accuracy:p,support:l,durationSec:Ne,wordCount:e});const m=Zs({wpm:c,wcpm:u,primaryGrade:((f=Un())==null?void 0:f.primaryGrade)??null});n.hidden=!0,n.reset(),s.hidden=!1,s.innerHTML=T`
      <div class="fluency-result-inner">
        <span class="fluency-time">${Fn(Ne)}</span>
        <span class="fluency-wcpm">${m.headline}</span>
        ${p!=null?T`<span class="fluency-acc">${p}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${m.detail}</p>
      ${m.reference?T`<p class="fluency-reference">${m.reference}</p>`:""}
    `;const d=document.getElementById("story-quest-cta");d&&(d.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{n.hidden=!0,n.reset(),s.hidden=!1,s.textContent="Not saved."}))}export{Et as _highlightGraphemes,fo as _isMeetWordsCompletedToday,st as _logComprehensionAttempt,Gt as _setMeetWordsCompleted,Qo as cleanupStoryMode,Vo as initStoryMode,Jo as showBrowser};
