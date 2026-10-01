import{S as V,B as G}from"./stories-Cton5YYn.js";import{q,s as de,W as it,X as An,Y as He,Z as Nt,C as Ht,o as Bn,_ as fe,$ as Cn,a0 as K,M as Ot,b as Mn,a1 as Be,a2 as Nn,a3 as Hn}from"./index-D-Q0yYy1.js";import{P as On,s as Wt,a as lt}from"./decodability-Bac4uWEZ.js";import"./gsap-C8pce-KX.js";const Wn=/(\s+|["“”'',.!?;:()-]+)/;function Pt(e){return String(e??"").split(Wn).filter(t=>t.length>0).map(t=>({text:t,type:/^\s+$/.test(t)?"space":/^[^a-zA-Z0-9]+$/.test(t)?"punct":"word"}))}const Pn=new Set(`a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just some any true false story about also`.split(/\s+/));function Fn(e){let t=e.toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");/[^aeiou]ies$/.test(t)?t=`${t.slice(0,-3)}y`:/(ss|sh|ch|x|z)es$/.test(t)?t=t.slice(0,-2):(/[^s]es$/.test(t)||/[^su]s$/.test(t))&&(t=t.slice(0,-1));let n=!1;return/.{3,}ing$/.test(t)?(t=t.slice(0,-3),n=!0):(/.{3,}ed$/.test(t)||/.{3,}ly$/.test(t))&&(t=t.slice(0,-2),n=!0),n&&(t=t.replace(/([bdgmnprt])\1$/,"$1")),t}function Ue(e){return new Set(String(e??"").split(/[\s\-—–/]+/).map(t=>t.toLowerCase().replace(/[^a-z']/g,"")).filter(t=>t.length>1&&!Pn.has(t)).map(Fn).filter(t=>t.length>1))}function Gn(e){const t=[];return((e==null?void 0:e.lines)??[]).forEach((n,s)=>{if(n.type==="label"||n.type==="chapter"||!n.text)return;const o=Pt(n.text);let r=-1,a=null,i=[];const l=()=>{a!==null&&(t.push({line:s,from:a,to:r,text:i.join("").trim()}),a=null,i=[])};for(const c of o)c.type==="word"&&(r+=1,a===null&&(a=r)),a!==null&&i.push(c.text),c.type==="punct"&&/[.!?]/.test(c.text)&&l();l()}),t}const jn=3;function Ft(e,t,n=""){const s=Ue(`${t} ${n}`),o=Ue(n);if(!s.size)return null;let r=null,a=0;for(const i of Gn(e)){const l=Ue(i.text);let c=0;for(const p of s)l.has(p)&&(c+=(p.length>3?2:1)*(o.has(p)?3:1));(c>a||c===a&&c>0&&r&&i.text.length<r.text.length)&&(r=i,a=c)}return a>=jn?r:null}function zn(e,t){var s;if(!(t!=null&&t.q))return null;const n=((s=t.options)==null?void 0:s[t.answer])??"";return Ft(e,t.q,n)}function Dn(e,t,n){var d;if(!((d=t.comprehension)!=null&&d.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,firstTry:0,withClue:0,hadClue:!1,clue:null,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return r();case"comprehension":return a();case"vocab":return c();case"openEnded":return l();case"grammar":return p();case"done":return h()}}function r(){var u,f,$,b;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(u=t.vocab)!=null&&u.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(f=t.grammarSpotlight)!=null&&f.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,($=document.getElementById("sq-start"))==null||$.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(b=document.getElementById("sq-skip"))==null||b.addEventListener("click",()=>n==null?void 0:n())}function a(){const u=t.comprehension[s.qIndex],f=s.qIndex+1,$=s.total;s.clue=zn(t,u),s.hadClue=!1,e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${f/$*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${f} of ${$}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${u.q}</p>
          ${u.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${u.options.map((b,y)=>`
            <button class="sq-option" data-idx="${y}" aria-label="${b}">
              <span class="sq-option-letter">${String.fromCharCode(65+y)}</span>
              <span class="sq-option-text">${b}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(b=>{b.addEventListener("click",()=>i(b,u))})}function i(u,f){const $=parseInt(u.dataset.idx,10),b=$===f.answer,y=document.getElementById("sq-feedback"),T=s.clue;if(!b&&!s.hadClue&&T){s.hadClue=!0,u.disabled=!0,u.classList.add("sq-option--wrong"),y&&(y.hidden=!1,y.className="sq-feedback sq-feedback--retry",y.innerHTML=q`Not quite. The story says:
          <q class="sq-clue">${T.text}</q> Have another go.`);return}b&&(s.hadClue?s.withClue++:s.firstTry++,s.correct++),document.querySelectorAll(".sq-option").forEach((m,g)=>{m.disabled=!0,g===f.answer&&m.classList.add("sq-option--correct"),g===$&&!b&&m.classList.add("sq-option--wrong")}),y&&(y.hidden=!1,y.className=`sq-feedback ${b?"sq-feedback--correct":"sq-feedback--wrong"}`,b?y.textContent=s.hadClue?"✅ You found it!":"✅ Great thinking!":y.innerHTML=T?q`The answer is <strong>${f.options[f.answer]}</strong>. The story says:
              <q class="sq-clue">${T.text}</q>`:q`The answer is <strong>${f.options[f.answer]}</strong>.`);const I=document.getElementById("sq-next");I&&(I.hidden=!1,I.addEventListener("click",()=>{var m,g,S;s.qIndex++,s.qIndex<s.total||(s.phase=(m=t.openEnded)!=null&&m.length?"openEnded":(g=t.vocab)!=null&&g.length?"vocab":(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done",s.vocabIndex=0),o()}))}function l(){var f,$,b;const u=t.openEnded||[];if(!u.length){s.phase=(f=t.vocab)!=null&&f.length?"vocab":($=t.grammarSpotlight)!=null&&$.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${u.map((y,T)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${T+1}. ${y.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${y.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${y.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(b=document.getElementById("sq-open-next"))==null||b.addEventListener("click",()=>{var y,T;s.phase=(y=t.vocab)!=null&&y.length?"vocab":(T=t.grammarSpotlight)!=null&&T.length?"grammar":"done",o()})}function c(){var T,I,m;const u=t.vocab[s.vocabIndex],f=t.vocab.length,$=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${$} of ${f}</p>

        <div class="sq-flip-card ${s.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${u.icon}</div>
            <p class="sq-flip-word">${u.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${u.icon}</div>
            <p class="sq-flip-meaning">${u.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${s.flipped?`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${$<f?"Next word →":"Done with words!"}
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
    `;const b=document.getElementById("sq-flip-card"),y=()=>{s.flipped=!0,o()};b==null||b.addEventListener("click",y),b==null||b.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&y()}),(T=document.getElementById("sq-flip-btn"))==null||T.addEventListener("click",y),(I=document.getElementById("sq-vocab-next"))==null||I.addEventListener("click",()=>{var g;s.vocabIndex++,s.flipped=!1,s.vocabIndex<f||(s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done"),o()}),(m=document.getElementById("sq-vocab-skip"))==null||m.addEventListener("click",()=>{var g;s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done",o()})}function p(){var $;const f=(t.grammarSpotlight??[]).map((b,y)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${y+1}</div>
        <h3 class="sq-grammar-pattern">${b.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${b.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${b.tip}</p>
      </div>
    `).join("");e.innerHTML=`
      <div class="sq-screen sq-grammar">
        <p class="sq-phase-label">✏️ Grammar Spotlight</p>
        <div class="sq-grammar-list">${f}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,($=document.getElementById("sq-grammar-done"))==null||$.addEventListener("click",()=>{s.phase="done",o()})}function h(){var I;const u=s.total>0?Math.round(s.correct/s.total*100):100,f=u>=80?3:u>=50?2:1,$="⭐".repeat(f)+"☆".repeat(3-f),b=s.correct*15+(u===100?25:0),y=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],T=f===3?y[2]:f===2?y[1]:y[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${$}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${T}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${s.correct}</span>
            <span class="sq-score-denom">/ ${s.total}</span>
            <span class="sq-score-label">correct</span>
          </div>
          <div class="sq-xp-badge">
            <span class="sq-xp-num">+${b}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        ${s.withClue?`<p class="sq-breakdown">${s.firstTry} right first time · ${s.withClue} worked out from the story</p>`:""}
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `,(I=document.getElementById("sq-back"))==null||I.addEventListener("click",()=>n==null?void 0:n())}o()}function Yn(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let r=0;r<=n;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(s++,o=!0):a&&(o=!1)}return s<0?-1:s}function Un(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function Vn(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let me=null;function Gt(){if(me)return me;me=new Map;for(const e of it)e!=null&&e.word&&me.set(e.word.toLowerCase(),e);return me}function Kn(e){const t=Vn(e),n=Gt(),s=t?n.get(t):null;if(s){const o=de.get("wordStats")||{},r=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function jt(e){return!e||typeof e!="string"||!(Gt().has(e)||it.some(s=>(s==null?void 0:s.id)===e))?!1:(de.recordWordAttempt(e,!0,An.EXPOSURE),!0)}const Jn=.62,Qn=.4,xt=2;function Lt(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function Xn(e,t,n=(s,o)=>He.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(h=>({word:h,status:"miss",heard:null}));const r=-.4,a=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let h=1;h<=s;h++)a[h][0]=h*r;for(let h=1;h<=o;h++)a[0][h]=h*r;const i=Array.from({length:s},(h,d)=>Array.from({length:o},(u,f)=>n(e[d],t[f])));for(let h=1;h<=s;h++)for(let d=1;d<=o;d++){const u=i[h-1][d-1]-.5;a[h][d]=Math.max(a[h-1][d-1]+u,a[h-1][d]+r,a[h][d-1]+r)}const l=new Array(s);let c=s,p=o;for(;c>0;){const h=p>0?i[c-1][p-1]-.5:-1/0;if(p>0&&a[c][p]===a[c-1][p-1]+h){const d=i[c-1][p-1],u=e[c-1];let f;d>=Jn?f="match":d>=Qn||u.length<=xt?f="unsure":f="miss",l[c-1]={word:u,status:f,heard:t[p-1]},c--,p--}else if(p>0&&a[c][p]===a[c][p-1]+r)p--;else{const d=e[c-1];l[c-1]={word:d,status:d.length<=xt?"unsure":"miss",heard:null},c--}}return l}function Zn(e,t,n){const s=Lt(e);let o=null;for(const r of t||[]){const a=Xn(s,Lt(r.text),n),i=a.filter(l=>l.status==="match").length;(!o||i>o.matchCount)&&(o={words:a,matchCount:i,total:s.length})}return o||{words:s.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:s.length}}function es(){return He.supported}async function ts(e){const t=await He.listenTranscript({timeoutMs:12e3});return t?Zn(e,t.transcripts):null}function ns(){He.stop()}const ge=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function ss(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const os=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function Oe(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function rs(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:r}){var kt,St,Et;const a=[...e.querySelectorAll(s)];let i=[],l=0,c=0;const p=document.createElement("div");p.className=`ruler-layer ruler-layer--${t}`,p.setAttribute("aria-hidden","true"),p.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(p);const h=()=>{const v=a[l]??a[0]??e;return parseFloat(getComputedStyle(v).fontSize)||20},d=v=>p.querySelector(v),u=d(".ruler-veil--above"),f=d(".ruler-veil--below"),$=d(".ruler-strip"),b=d(".ruler-word"),y=d(".ruler-bar");function T(){const v=e.getBoundingClientRect();i=ss(a.map(E=>{const L=E.getBoundingClientRect();return L.width||L.height?{top:L.top-v.top,bottom:L.bottom-v.top}:null}))}const I=v=>{const E=i.findIndex(L=>v>=L.first&&v<=L.last);return E<0?0:E};function m(){const v=i[c];if(!v)return;const E=h(),L=E*.6,R=v.bottom+E*.18,C=Math.max(12,E*.55),P=e.scrollHeight;u.style.height=`${Math.max(0,v.top-L)}px`,f.style.top=`${R+C}px`,f.style.height=`${Math.max(0,P-R-C)}px`,$.style.top=`${v.top-L}px`,$.style.height=`${R-(v.top-L)}px`,y.style.top=`${R}px`,y.style.height=`${C}px`;const Q=a[l];if(t==="word"&&Q){const X=e.getBoundingClientRect(),D=Q.getBoundingClientRect();b.style.left=`${D.left-X.left-3}px`,b.style.width=`${D.width+6}px`,b.style.top=`${D.top-X.top-2}px`,b.style.height=`${D.height+4}px`,y.style.setProperty("--x",`${D.left-X.left+D.width/2}px`)}a.forEach((X,D)=>X.classList.toggle("is-pointed",t==="word"&&D===l))}function g(){r==null||r({word:l,line:c,lines:i.length,words:a.length,atEnd:t==="word"?l>=a.length-1:c>=i.length-1})}function S(){const v=i[c];if(!v)return;const E=e.getBoundingClientRect(),L=h(),R=E.top+v.top-L*.6,C=E.top+v.bottom+L*1.2,P=o();if(R>=P.top&&C<=P.bottom)return;const Q=P.top+(P.bottom-P.top)*.28,X={top:R-Q,behavior:os()?"auto":"smooth"};(Oe(e)??window).scrollBy(X)}function _(v,{scroll:E=!0}={}){var L;c=Math.max(0,Math.min(i.length-1,v)),l=((L=i[c])==null?void 0:L.first)??0,m(),g(),E&&S()}function W(v,{scroll:E=!0}={}){l=Math.max(0,Math.min(a.length-1,v)),c=I(l),m(),g(),E&&S()}function se(v){const E=v-e.getBoundingClientRect().top;let L=0,R=1/0;return i.forEach((C,P)=>{const Q=E<C.top?C.top-E:E>C.bottom?E-C.bottom:0;Q<R&&(R=Q,L=P)}),L}let oe=!1;y.addEventListener("pointerdown",v=>{var E;oe=!0,(E=y.setPointerCapture)==null||E.call(y,v.pointerId),p.classList.add("is-dragging"),v.preventDefault()}),y.addEventListener("pointermove",v=>{if(!oe)return;const E=h(),L=se(v.clientY-E*.6);L!==c&&_(L,{scroll:!1})});const vt=()=>{oe&&(oe=!1,p.classList.remove("is-dragging"),S())};y.addEventListener("pointerup",vt),y.addEventListener("pointercancel",vt);let Ye=0;const $t=()=>{cancelAnimationFrame(Ye),Ye=requestAnimationFrame(()=>{var v;T(),c=I(l),t!=="word"&&(l=((v=i[c])==null?void 0:v.first)??l),p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>p.classList.remove("no-anim"))})},re=typeof ResizeObserver=="function"?new ResizeObserver($t):null;if(re==null||re.observe(e),(St=(kt=document.fonts)==null?void 0:kt.ready)==null||St.then($t).catch(()=>{}),T(),n==null){const v=o(),E=e.getBoundingClientRect().top,L=i.findIndex(R=>E+R.top>=v.top);c=Math.max(0,L),l=((Et=i[c])==null?void 0:Et.first)??0}else l=Math.max(0,Math.min(a.length-1,n)),c=I(l);return p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>{p.classList.remove("no-anim"),n!=null&&S()}),{next(){t==="word"?W(l+1):_(c+1)},prev(){t==="word"?W(l-1):_(c-1)},nextLine:()=>_(c+1),prevLine:()=>_(c-1),tap(v,E){const L=E?a.indexOf(E):-1;L>=0?t==="word"?W(L,{scroll:!1}):_(I(L),{scroll:!1}):_(se(v),{scroll:!1})},follow(v){const E=a.indexOf(v);E<0||(t==="word"?E!==l&&W(E):I(E)!==c&&_(I(E)))},reveal:S,current:()=>a[l]??null,goTo(v){t==="word"?W(v):_(I(Math.max(0,Math.min(a.length-1,v))))},destroy(){re==null||re.disconnect(),cancelAnimationFrame(Ye),a.forEach(v=>v.classList.remove("is-pointed")),e.classList.remove("has-ruler"),p.remove()}}}const as="giri_story_place",is=40,ls=30,zt=8,Dt=()=>Nt(as);function ct(){try{const e=localStorage.getItem(Dt()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function Ze(e){try{localStorage.setItem(Dt(),JSON.stringify(e))}catch{}}function cs(e,t=Date.now()){const n=t-ls*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(s.slice(0,is))}function Yt(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=ct();if(t<zt){if(!(e in s))return;delete s[e],Ze(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},Ze(cs(s,n))}function ds(e){const t=ct()[e];return t&&typeof t.word=="number"&&t.word>=zt?t.word:null}function dt(e){const t=ct();e in t&&(delete t[e],Ze(t))}function qt(e){const t=de.get("groupMastery")||{},n=Ht.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function Ve(e){const t=de.get("groupMastery")||{};return Ht.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function Ut(){const e=qt([1,2,3,4,5]),t=Ve([6]),n=qt([6])>=.5,s=Ve([8]),o=Ve([7]),r=e>=.6||t,a=r&&(n||s),i=a&&o;return{A:{ready:!0,hint:""},B:{ready:r,hint:r?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:a,hint:a?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:i,hint:i?"":"Best after starting Phase 7 — Diphthongs"}}}function us(e,t){const n=Ut();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return s}return"A"}const ue=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),ps=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...ue[e]}))),ut=new Set(["short","long","schwa","rcontrolled","diphthong"]),hs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),We="bcdfghjklmnpqrstvwxyz",ms=new RegExp(`[${We}]a$`),fs=new RegExp("[bcdfghjkmnprstvz]al$"),Vt=/[ts]ion$/;function Kt(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(hs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&ms.test(e)&&t.add(e.length-1),e.length>=4&&fs.test(e)&&t.add(e.length-2),e.length>=5&&Vt.test(e)&&t.add(e.length-3)),t.size?t:null}const gs=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),bs=new RegExp(`[${We}]e$`);function Jt(e){const t=new Set,n=e.length;if(n>=5&&Vt.test(e)&&t.add(n-2),n>=4&&bs.test(e)&&!gs.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];We.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const ys=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),ws=new Set(["been"]),vs=new Set(["friend","friends"]),$s=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),ks=["ing","ed","ly","es","s","n"];function Ie(e,t){if(e.has(t))return!0;for(const n of ks)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function be(e,t,n,s,o,r){return ut.has(s)?r!=null&&r.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&Ie(ys,e)||t==="ee"&&Ie(ws,e)||t==="ie"&&Ie(vs,e)?"short":t==="ow"&&Ie($s,e)?"long":s:s}const k=null,Qt=new Map([["have",[k,"short",k,"silent"]],["love",[k,"short",k,"silent"]],["come",[k,"short",k,"silent"]],["some",[k,"short",k,"silent"]],["done",[k,"short",k,"silent"]],["gone",[k,"short",k,"silent"]],["none",[k,"short",k,"silent"]],["give",[k,"short",k,"silent"]],["live",[k,"short",k,"silent"]],["one",["short",k,"silent"]],["were",[k,"rcontrolled","rcontrolled","silent"]],["here",[k,"rcontrolled","rcontrolled","silent"]],["where",[k,k,"rcontrolled","rcontrolled","silent"]],["there",[k,k,"rcontrolled","rcontrolled","silent"]],["above",["schwa",k,"short",k,"silent"]],["become",[k,"short",k,"short",k,"silent"]],["people",[k,"long","silent",k,k,"silent"]],["again",["schwa",k,"long","long",k]],["said",[k,"short","short",k]],["says",[k,"short","short",k]]]),Ss=new Map(it.map(e=>[e.word.toLowerCase(),e])),Xt=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function Es(e){return Xt[e]??"consonant"}function Zt(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=Kt(s),r=Jt(s),a=Qt.get(s),i=[];let l=0;for(let c=0;c<t.length;c++){const p=t[c]||"",h=p.length||1;let d=Es(n[c]);ut.has(d)&&(d=(a==null?void 0:a[l])??be(s,p,l,d,o,r)),i.push(d),l+=h}return i}const xs="aeiou",Ls="bcdfghjklmnpqrstvwxyz",Tt=e=>xs.includes(e),qs=e=>Ls.includes(e),en=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Ts=Object.keys(en).sort((e,t)=>t.length-e.length);function Is(e,t,n){const s=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&Tt(e[r])&&qs(e[r+1])&&e[r+2]==="e"){s.push({len:1,sound:be(e,e[r],r,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let a=!1;for(const i of Ts)if(e.startsWith(i,r)){s.push({len:i.length,sound:be(e,i,r,en[i],t,n)}),r+=i.length,a=!0;break}if(!a){if(Tt(e[r])||e[r]==="y"&&r>0){const i=r===o-1?"long":"short";s.push({len:1,sound:be(e,e[r],r,i,t,n)}),r+=1;continue}s.push({len:1,sound:null}),r+=1}}return s}function _s(e,t,n,s){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const i=e.graphemes[a],l=i.length;if(l===2&&i[1]==="e"&&We.includes(i[0])&&r+2===t.length&&(s!=null&&s.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=Xt[e.types[a]]??null;!ut.has(c)&&c!=="silent"&&(c=null),c=be(t,i,r,c,n,s),o.push({len:l,sound:c}),r+=l}return o}function tn(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||On.has(t))return null;const n=Qt.get(t);if(n){const i=[];for(const l of n){const c=i[i.length-1];c&&c.sound===l?c.len+=1:i.push({len:1,sound:l})}return i}const s=Kt(t),o=Jt(t),r=Ss.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?_s(r,t,s,o):Is(t,s,o)}function Rs(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const n=tn(t);if(!n)return t;let s="",o=0;for(const{len:a,sound:i}of n){const l=t.slice(o,o+a);if(o+=a,!i){s+=l;continue}const c=(r=ue[i])==null?void 0:r.cue;s+=`<span class="vs vs--${i}"${c?` data-cue="${c}"`:""}>${l}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function As(e,t){const n=[];let s="",o="";return e.forEach((r,a)=>{const i=r.replace(/^-/,"");if(t[a]==="silent"){o+=i;return}s+=o+i,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Bs(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Cs(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:r,extraActions:a=""}){const i=Zt(t,n,s),l=As(n,i),c=i.includes("silent");let p=0;const h=n.map((m,g)=>{const S=ue[i[g]]??ue.consonant;return q`<button
      type="button"
      class="bl-tile${i[g]==="silent"?" bl-tile--silent":""}"
      data-idx="${g}"
      data-mark="${S.mark||""}"
      style="--tile-color:${S.color}"
      aria-label="${i[g]==="silent"?`${m} is silent`:`Hear the sound for ${m}, ${S.label}`}"
    >
      ${m}
    </button>`});e.innerHTML=q`
    <div class="blend-ladder" data-word="${t}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${h}</div>
      ${c?q`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${Bn(a)}
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
  `;const d=m=>e.querySelector(m),u=d(".bl-steps"),f=d(".bl-next"),$=d(".bl-again"),b=d(".bl-say"),y=[...e.querySelectorAll(".bl-tile")];function T(){u.innerHTML=q`${l.slice(0,p).map((g,S)=>q`<li class="${S===p-1?"is-new":""}">${g}</li>`)}`,y.forEach(g=>{const S=Number(g.dataset.idx),_=i.slice(0,S+1).filter(se=>se!=="silent").length-1,W=i[S]==="silent"?p>=l.length:_>-1&&_<p;g.classList.toggle("is-lit",W),g.classList.toggle("is-current",i[S]!=="silent"&&_===p-1)});const m=p>=l.length;f.hidden=m,$.hidden=!m,b.textContent=m?"🔊 Hear the word":"🔊 Just hear the word",b.classList.toggle("bl-say--escape",!m),m&&l.length&&u.insertAdjacentHTML("beforeend",String(q`<li class="bl-done">
          Now say the whole word, then tap 🔊 to check. Does it make sense in the sentence?
        </li>`))}function I(){if(p>=l.length)return;const m=Bs(i,p);p+=1,T(),m>=0&&Promise.resolve(o(n[m],s[m],{word:t,index:m})).catch(()=>{})}return f.addEventListener("click",I),$.addEventListener("click",()=>{p=0,T(),f.focus({preventScroll:!0})}),b.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),y.forEach(m=>m.addEventListener("click",async()=>{const g=Number(m.dataset.idx);if(i[g]!=="silent"){m.classList.add("is-tapped"),setTimeout(()=>m.classList.remove("is-tapped"),300);try{await o(n[g],s[g],{word:t,index:g})}catch{}}})),T(),{destroy(){e.innerHTML=""}}}const Ms=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),Ns=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),Hs=3,Os=e=>/[aeiouy]/.test(e);function et(e,t,n){const s=[];let o=0;for(;o<e.length;){let r=Ms.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(r=null),r?(s.push(r),o+=r.length):(s.push(e[o]),o+=1)}return s}function Ws(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){n.push("qu"),s.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function Ps(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const Fs=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function Gs(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of Ns){const p=c.slice(1),h=n.slice(0,-p.length);if(n.endsWith(p)&&h.length>=Hs&&Os(h)){s=c,n=h;break}}const r=tn(n);if(!r)return null;const a=[],i=[];let l=0;for(const{len:c,sound:p}of Ps(r)){const h=n.slice(l,l+c);if(p)a.push(h),i.push(Fs[p]??"sv");else for(const d of et(h,n,l))a.push(d),i.push("c");l+=c}if(l<n.length)for(const c of et(n.slice(l),n,l))a.push(c),i.push("c");return o&&(a.push("s"),i.push("c")),s&&(a.push(s),i.push("sf")),a.length?Ws(a,i):null}function js(e,t){const n=[],s=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){n.push(o),s.push(t[r]);return}const a=String(o).toLowerCase();for(const i of et(a,a,0))n.push(i),s.push("c")}),{graphemes:n,types:s}}const zs=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),Ds=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function Ys(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function Us(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function Vs(e,t,n=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const s=t/60,o=Math.round(e/s);if(n==null||Number.isNaN(n))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(n)));return{wpm:o,wcpm:Math.round((e-r)/s),accuracy:Math.round((e-r)/e*100)}}function Ks({wpm:e,wcpm:t=null,primaryGrade:n=null,now:s=new Date}){var c,p;const o=Us(n),r=Ys(s),a=o?(c=zs[o])==null?void 0:c[r]:null,i=o?(p=Ds[o])==null?void 0:p[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const l=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:l}:i!=null&&t>=i?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:l}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:l}}const Js="giri_friends_unlocked";function nn(){return Nt(Js)}const Qs=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function Xs(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function sn(e){if(!e||!e.id)return null;const t=Qs[e.id]||Xs(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function pt(){try{const e=localStorage.getItem(nn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function Zs(e){try{localStorage.setItem(nn(),JSON.stringify(Array.from(e)))}catch{}}function eo(e){if(!e||typeof e!="string")return!1;const t=pt();return t.has(e)?!1:(t.add(e),Zs(t),!0)}function to(e){return pt().has(e)}function no(e){const t=pt();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=sn(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function on(e){const t=no(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const rn="giri_fluency_history",It=5,te=new Map,so=10;function oo(e,t){for(te.set(e,t);te.size>so;){const n=te.keys().next().value;te.delete(n)}}let le=null,M=null,Ke=[],ce=null,ye=null,Pe="idle",N=null;async function an({storyId:e,lineIdx:t,onStateChange:n}={}){if(Pe==="recording")return!1;ye=n??null,Ke=[];try{le=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return j("error"),!1}const s=io();try{M=new MediaRecorder(le,s?{mimeType:s}:{})}catch{M=new MediaRecorder(le)}return M.ondataavailable=o=>{o.data.size>0&&Ke.push(o.data)},M.onstop=()=>{const o=new Blob(Ke,{type:M.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;ce=r,oo(r,o),nt(),j("recorded")},M.onerror=()=>{nt(),j("error")},M.start(),j("recording"),!0}function Ce(){M&&M.state==="recording"?M.stop():nt()}function ln(e){const t=ce,n=t?te.get(t):null;return n?new Promise(s=>{Fe();const o=URL.createObjectURL(n);N=new Audio(o),j("playing"),N.onended=()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()},N.onerror=()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()},N.play().catch(()=>{URL.revokeObjectURL(o),N=null,j("recorded"),s()})}):Promise.resolve()}function Fe(){N&&(N.pause(),N=null)}function tt(e){const t=ce;t&&te.delete(t),t===ce&&(ce=null),Fe(),j("idle")}function cn(){return Pe}function dn(){Ce(),Fe(),te.clear(),ce=null,Pe="idle",ye=null}function ro(e){const t=un(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>It&&n.splice(0,n.length-It),t[e.storyId]=n,lo(t)}function ao(e){return un()[e]??[]}function j(e){Pe=e,ye==null||ye(e)}function nt(){le&&(le.getTracks().forEach(e=>e.stop()),le=null)}function io(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function un(){try{return JSON.parse(localStorage.getItem(rn)??"{}")}catch{return{}}}let _t=!1;function lo(e){try{localStorage.setItem(rn,JSON.stringify(e))}catch{if(_t)return;_t=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const pn="/phonicsquest/";let w=null,F="A",Rt=!1,ae="band",ke=!1,B=null,O="word",Se=!1,pe=-1,Te=[],we=0,Ge=[],je=0,Ee=0;const hn="giri_stories_read";function z(){try{return JSON.parse(localStorage.getItem(hn)??"[]")}catch{return[]}}function ht(e){const t=z();t.includes(e)||(t.push(e),localStorage.setItem(hn,JSON.stringify(t))),dt(e),eo(e)}let _e=null,ve=null,Me=!1,Re=0;const mn="giri_show_graphemes",fn="giri_show_ruler",gn="giri_ruler_mode",mt="giri_follow_mode",bn="giri_meet_words",At="giri_comp_log";let ie=ze(mn,!0),Z=ze(fn,!1),x=null,Y=null,st=ze(gn,"line"),ee=null,xe=0,H=null;O=ze(mt,"word");function ze(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function $e(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const yn=new Set;function wn(){return new Date().toISOString().slice(0,10)}function vn(){try{const e=localStorage.getItem(bn);return e?JSON.parse(e):{}}catch{return{}}}function co(e){try{localStorage.setItem(bn,JSON.stringify(e))}catch{}}function uo(e){return yn.has(e)?!0:vn()[e]===wn()}function Bt(e){yn.add(e);const t=vn();t[e]=wn();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];co(t)}const Ct=new Set,po=100;function Je(e){try{const t=localStorage.getItem(At),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>po;)n.shift();localStorage.setItem(At,JSON.stringify(n))}catch{}}function Jo(e,t){w=e}function Qo(){A(),he()}function Xo(){A(),at(),dn(),gt()}function he(){var n,s,o;Le(),kn(),B=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ae==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ae==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ae==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Po()}</button>
    </div>
  `;let t;if(ae==="band"){if(!Rt){Rt=!0;try{const u={};for(const f of V)(u[n=f.band]??(u[n]=[])).push(f);F=us(z(),u)||F}catch{}}const r=G.find(u=>u.band===F)??G[0],a=V.filter(u=>u.band===F&&u.category!=="chapter"&&u.category!=="nonfiction-sg"),i=z(),l=a.filter(u=>i.includes(u.id)).length,c=Ut(),p=G.map(u=>{var f,$,b;return`
      <button
        class="story-tab${u.band===F?" active":""}${(f=c[u.band])!=null&&f.ready?"":" story-tab--not-ready"}"
        data-band="${u.band}"
        style="--tab-color:${u.color}"
        ${($=c[u.band])!=null&&$.ready?"":`title="${c[u.band].hint}"`}
      >
        <span class="story-tab-num">${u.band}</span>
        <span class="story-tab-name">${u.label}</span>
        ${(b=c[u.band])!=null&&b.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),h=a.map(u=>Qe(u,r,!1,i.includes(u.id))).join(""),d=a.length?Math.round(l/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${p}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${F}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${l} of ${a.length} stories read">
          ${l}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${d}%"></span>
        </span>
      </div>
      ${(s=c[F])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[F].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${h}</div>
    `}else if(ae==="singapore"){const r=V.filter(l=>l.category==="nonfiction-sg"),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(l=>{const c=G.find(p=>p.band===l.band)??G[0];return Qe(l,c,!1,a.includes(l.id))}).join("")}</div>
    `}else{const r=V.filter(l=>l.category==="chapter").sort((l,c)=>(l.chapterNum??0)-(c.chapterNum??0)),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(l=>{const c=G.find(p=>p.band===l.band)??G[0];return Qe(l,c,!0,a.includes(l.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{ae=r.dataset.cat,he()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Fo()}),w.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{F=r.dataset.band,he()})}),w.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>ft(r.dataset.storyId))})}function Qe(e,t,n=!1,s=!1){var i;const o=(i=e.comprehension)!=null&&i.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${pn}images/stories/${e.illustration}"
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
        ${Wt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const l=lt(e).length;return l?`<span class="story-card-support" data-support="independent">👀 ${l} new ${l===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function ft(e){const t=V.find(n=>n.id===e);t&&(A(),ee=z().includes(t.id)?null:ds(t.id),qe.clear(),ho(t))}function ho(e){var n;B=e;const t=G.find(s=>s.band===e.band)??G[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${pn}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Wt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{A(),he()}),mo(e)}function mo(e){uo(e.id)?ne(e):fo(e)}function fo(e){var h;const t=document.getElementById("story-dynamic");if(!t)return;Le();const n=lt(e),s=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),o=(e.vocab??[]).filter(d=>s.includes(d.word.toLowerCase().split(/\s+/)[0]));if(!n.length&&!o.length){Bt(e.id),ne(e);return}const r=Math.min(3,n.length+o.length),a=new Set;t.innerHTML=q`
    <section class="warm-up" aria-labelledby="warm-up-title">
      <h3 id="warm-up-title">🤝 Meet the words</h3>
      <p class="warm-up-lead">
        ${n.length?q`These are the words in <strong>${e.title}</strong> you cannot sound out — so
              here they are first. Tap any ${r} to warm up.`:q`A few words worth knowing before you read
              <strong>${e.title}</strong>. Tap any ${r} to warm up.`}
      </p>

      ${n.length?q`<div class="warm-up-section">
            <div class="warm-up-section-title">👀 Words to know first — tap to hear</div>
            <div class="warm-up-words">
              ${n.map(({word:d,display:u,status:f})=>q`<button
                  type="button"
                  class="story-prep-word"
                  data-tap-id="prep:${d}"
                  data-prep-word="${d}"
                  data-status="${f}"
                  aria-label="Hear the word ${u}"
                >
                  ${u}
                </button>`)}
            </div>
          </div>`:""}

      ${o.length?q`<div class="warm-up-section">
            <div class="warm-up-section-title">📚 Key words — tap to hear what they mean</div>
            <div class="vocab-chip-list">
              ${o.map(d=>q`<button
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
  `;const i=document.getElementById("warm-up-progress"),l=document.getElementById("warm-up-go");function c(d){const u=d.dataset.tapId;a.has(u)||(a.add(u),d.setAttribute("data-tapped","true"),i&&(i.textContent=a.size>=r?"✓ Warmed up — start the story, or keep tapping":`${a.size} of ${r} tapped`),a.size>=r&&l&&(l.disabled=!1,l.focus({preventScroll:!0})))}t.querySelectorAll("[data-prep-word]").forEach(d=>{d.addEventListener("click",()=>{var u,f;(f=(u=K.speakSightWord(d.dataset.prepWord))==null?void 0:u.catch)==null||f.call(u,()=>{}),d.classList.add("story-prep-word--said"),setTimeout(()=>d.classList.remove("story-prep-word--said"),600),c(d)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",async()=>{Io(d);try{await K.speakWord(d.dataset.word)}catch{}c(d)})});const p=()=>{Bt(e.id),ne(e)};(h=document.getElementById("warm-up-skip"))==null||h.addEventListener("click",p),l==null||l.addEventListener("click",p)}function Ae(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function ne(e){var c,p,h,d,u,f,$,b,y,T,I;const t=document.getElementById("story-dynamic");if(!t)return;Le();const n=e.lines.map((m,g)=>Lo(m,g,!0,e)).join(""),s=!!((c=e.comprehension)!=null&&c.length),r=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(m=>`<li>${m}</li>`).join("")}
      </ul>
    </div>
  `:"",a=ao(e.id),i=a.length?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${a.slice().reverse().map(m=>{const g=new Date(m.date),S=`${g.getDate()}/${g.getMonth()+1}`,_=typeof m.wcpm=="number"&&m.errors!=null,W=_?m.wcpm:m.wpm??m.wcpm,se=_?"correct/min":"words/min",oe=m.support==="supported"?" · with help":"";return`<span class="fluency-history-item">${S}: <strong>${W}</strong> ${se}${oe}</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${ie}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${Z}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${O==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${O==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${ie?xo():""}

      ${(()=>{const m=lt(e);return m.length?String(q`
          <details class="story-prep-strip">
            <summary>
              👀 ${m.length} ${m.length===1?"word":"words"} to know — tap to hear
            </summary>
            <div class="story-prep-words">
              ${m.map(({word:g,display:S,status:_})=>q`<button
                  type="button"
                  class="story-prep-word"
                  data-prep-word="${g}"
                  data-status="${_}"
                  aria-label="Hear the word ${S}"
                >
                  ${S}
                </button>`)}
            </div>
          </details>
        `):""})()}

      ${ee!==null?`
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`:""}

      <div class="story-body story-body--follow-${O}" id="story-body" aria-live="polite">${n}</div>

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
                Time one read-aloud of the whole story (${Ae(e)} words).
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
                  <input type="number" name="errors" min="0" max="${Ae(e)}" inputmode="numeric" />
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
              <span class="rtg-label">${Cn("encourage",18)}Read to Giri</span>
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(m=>{m.addEventListener("click",()=>{O=m.dataset.follow,$e(mt,O),ne(e)})}),t.querySelectorAll(".wf-word").forEach(m=>{m.setAttribute("role","button"),m.setAttribute("tabindex","0");const g=S=>{const _=bt(m);_&&(S.preventDefault(),x==null||x.tap(S.clientY??0,m),Ao(_))};m.addEventListener("click",g),m.addEventListener("keydown",S=>{(S.key==="Enter"||S.key===" ")&&g(S)})}),(h=document.getElementById("btn-toggle-graphemes"))==null||h.addEventListener("click",()=>{ie=!ie,$e(mn,ie),ne(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var m,g;Z=!Z,$e(fn,Z),(m=document.getElementById("btn-toggle-ruler"))==null||m.setAttribute("aria-pressed",String(Z)),Le(),Z&&(rt(),(g=document.getElementById("btn-ruler-next"))==null||g.focus({preventScroll:!0}))}),Z?requestAnimationFrame(()=>rt(ee)):ee!==null&&requestAnimationFrame(()=>ot(ee)),bo(e),(u=document.getElementById("btn-resume-restart"))==null||u.addEventListener("click",m=>{var g;dt(e.id),ee=null,(g=m.currentTarget.closest(".story-resume"))==null||g.remove(),ot(0),x&&x.goTo(0)}),yo(),(f=document.getElementById("btn-story-play"))==null||f.addEventListener("click",()=>Tn(e)),($=document.getElementById("btn-story-stop"))==null||$.addEventListener("click",()=>A()),t.querySelectorAll(".story-prep-strip [data-prep-word]").forEach(m=>{m.addEventListener("click",()=>{var g,S;(S=(g=K.speakSightWord(m.dataset.prepWord))==null?void 0:g.catch)==null||S.call(g,()=>{}),m.classList.add("story-prep-word--said"),setTimeout(()=>m.classList.remove("story-prep-word--said"),600)})}),(b=document.getElementById("btn-finish-story"))==null||b.addEventListener("click",m=>{var _;yt(e);const g=m.currentTarget;g.disabled=!0,g.textContent="✓ Read — well done!";const S=document.querySelector(".story-finish-note");S&&(S.textContent=(_=e.comprehension)!=null&&_.length?"Now have a go at the questions.":"")});const l=Ae(e);(y=document.getElementById("btn-fluency-start"))==null||y.addEventListener("click",()=>zo()),(T=document.getElementById("btn-fluency-done"))==null||T.addEventListener("click",()=>at(l)),Do(l,e),Go(e),gt(),$o(e),jo(e),(I=document.getElementById("btn-launch-quest"))==null||I.addEventListener("click",()=>{A(),at(),dn(),ht(e.id),Dn(w,e,()=>{he()})})}let Xe="";function go(e){$n();const t=w==null?void 0:w.querySelector(`#story-body [data-line="${e.line}"]`);if(!t)return;const n=[...t.querySelectorAll(".wf-word")].filter(s=>{const o=Number(s.dataset.wordIdx);return o>=e.from&&o<=e.to});n.length&&(n.forEach(s=>s.classList.add("is-clue")),x?x.follow(n[0]):n[0].scrollIntoView({behavior:J(),block:"center"}))}function $n(){w==null||w.querySelectorAll(".wf-word.is-clue").forEach(e=>e.classList.remove("is-clue"))}function ot(e){const t=w==null?void 0:w.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:J(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function bo(e){kn();const t=document.getElementById("story-body");if(!t)return;const n=Oe(t);n&&(H=n,H._pqPlaceHandler=()=>{clearTimeout(xe),xe=setTimeout(()=>{if(x||z().includes(e.id))return;const s=t.getBoundingClientRect(),o=Sn();if(s.bottom<o.top||s.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(i=>i.getBoundingClientRect().top>=o.top);a>=0&&Yt(e.id,a)},500)},n.addEventListener("scroll",H._pqPlaceHandler,{passive:!0}))}function yo(){const e=document.getElementById("story-resume");if(!e)return;const t=Oe(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&s()};t==null||t.addEventListener("scroll",r,{passive:!0}),n=setTimeout(s,9e3)}function kn(){clearTimeout(xe),H!=null&&H._pqPlaceHandler&&(H.removeEventListener("scroll",H._pqPlaceHandler),delete H._pqPlaceHandler),H=null}function Sn(){const e=document.getElementById("story-body"),t=e?Oe(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,a=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),i=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(i,r+120)}}function Ne(){return ge.find(e=>e.id===st)??ge[1]}function wo(){const e=Ne();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${Be(e.label)}. Tap to change."
              title="${Be(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${Ot(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function rt(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=wo();const s=Ne(),o=n.querySelector(".ruler-pos small"),r=n.querySelector(".ruler-pos b"),a=n.querySelector("#btn-ruler-next"),i=n.querySelector("#btn-ruler-back");x=rs(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Sn,onMove(l){Y=l;const c=s.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${l.word+1} / ${l.words}`:`${l.line+1} / ${l.lines}`,i.disabled=c?l.word===0:l.line===0,a.textContent=l.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",l.atEnd),clearTimeout(xe),xe=setTimeout(()=>{z().includes((B==null?void 0:B.id)??"")||Yt(B==null?void 0:B.id,l.word)},400)}}),i.addEventListener("click",()=>x==null?void 0:x.prev()),a.addEventListener("click",()=>{if(!(Y!=null&&Y.atEnd))return x==null?void 0:x.next();yt(B)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var p;const l=(Y==null?void 0:Y.word)??0,c=ge.indexOf(Ne());st=ge[(c+1)%ge.length].id,$e(gn,st),Le(),rt(l),(p=document.getElementById("btn-ruler-style"))==null||p.focus({preventScroll:!0})})}function Le(){x==null||x.destroy(),x=null,Y=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function vo(e){var s,o;if(!x||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Ne().id==="word",n={ArrowDown:()=>x.nextLine(),ArrowUp:()=>x.prevLine(),ArrowRight:()=>t?x.next():x.nextLine(),ArrowLeft:()=>t?x.prev():x.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",vo);function $o(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>ko(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>So(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Ln(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{gt(),ne(e)})}function U(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function En(){const e=Te[pe];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function ko(e){var n,s,o;if(O!=="word"){O="word",$e(mt,O),ne(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}A();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(Se=!0,Te=t,pe=0,we=0,Ge=[],je=0,Ee=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),xn(),U("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function xn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=En();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:J()}))}async function So(e){var p;const t=En(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(bt).filter(Boolean).join(" ");if(!o){Ln(e);return}n.disabled=!0,n.replaceChildren(Hn("encourage"),document.createTextNode("Giri is listening…")),U("Go ahead — read the glowing line now.");const r=await ts(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!Se)return;if(!r){we++,we>=2?U("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):U("Giri couldn't hear that — move a little closer to the microphone and try again!");return}we=0;const a=[];r.words.forEach((h,d)=>{const u=s[d];if(u)if(u.classList.remove("rtg-word--match","rtg-word--check"),h.status==="miss"){u.classList.add("rtg-word--check");const f=h.word.replace(/[^a-z]/g,"");f.length>2&&(a.push(f),jt(f))}else u.classList.add("rtg-word--match")});const i=r.words.filter(h=>h.status!=="miss").length;je+=i,Ee+=r.words.length,Ge.push(...a);const l=pe>=Te.length-1;a.length>0?U(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${l?"finish up":"go on"}!`):U("⭐ Great — Giri heard every word!"),(p=document.getElementById("btn-rtg-listen"))==null||p.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=l?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Ln(e){var t,n;if(pe>=Te.length-1){Eo(e);return}pe++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),xn(),U("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Eo(e){var i,l;const t=Ee>0?Math.round(je/Ee*100):0,n=[...new Set(Ge)],s={...de.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},de.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(i=document.getElementById("btn-rtg-next"))==null||i.setAttribute("hidden",""),(l=document.getElementById("btn-rtg-exit"))==null||l.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";U(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),ht(e.id),Se=!1}function gt(){Se&&ns(),Se=!1,pe=-1,Te=[],we=0,Ge=[],je=0,Ee=0}function qn(e){return!ie||!e?e:Rs(e)}function xo(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${ps.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Lo(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${Ot(o)}</div>`;const r=s?qn(o,s.targetGraphemes,s.band):o,a=n?qo(o,s):r;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function qo(e,t=null){if(!e)return"";const n=Pt(e);let s=0;return n.map(o=>{if(o.type==="word"){const r=t?qn(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${Be(o.text)}" aria-label="${Be(o.text)}">${r}</span>`}return o.text}).join("")}function bt(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function To(e,t,n=!0){var a;const s=n&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:Gs(t.word);if(!s)return!1;const{graphemes:o,types:r}=js(s.graphemes,s.types);return Cs(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(i,l,c)=>K.speakPhoneme(i,l,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:i=>K.speakWord(i)}),!0}function Io(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function _o(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const r=n[s+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function Tn(e){if(!window.speechSynthesis)return;A(),B=e,wt(!0),ke=!0;const t=_o(e);In(t,0)}function In(e,t){if(!ke||t>=e.length){Mt();return}const n=e[t];Mo(n.highlightIdx);const s=new SpeechSynthesisUtterance(n.text);s.rate=.82,_n(s);const o=n.text.startsWith("Puff")?600:380;O==="word"&&Ro(s,n.highlightIdx),s.onend=()=>{De(),ke&&setTimeout(()=>In(e,t+1),o)},s.onerror=()=>Mt(),window.speechSynthesis.speak(s)}function Ro(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=e.text||"";let r=!1,a=-1,i=[],l=!1;function c(u){if(u<0||u>=s.length||u===a)return;a=u,s.forEach($=>$.classList.remove("wf-word--active"));const f=s[u];f.classList.add("wf-word--active"),x?x.follow(f):Co(f)}function p(){for(const u of i)clearTimeout(u);i=[]}function h(){var b;if(l)return;l=!0;const u=typeof e.rate=="number"&&e.rate>0?e.rate:.82,f=Array.from(s,bt);let $=0;for(let y=0;y<s.length;y++){const T=y,I=((b=f[y])==null?void 0:b.length)||3,m=Math.max(160,Math.round((90+I*60)/u)),g=setTimeout(()=>{r||c(T)},$);i.push(g),$+=m}}e.addEventListener("boundary",u=>{u.name&&u.name!=="word"||(r=!0,p(),c(Yn(o,u.charIndex??-1)))}),e.addEventListener("end",()=>{p()}),e.addEventListener("start",()=>{if(r)return;const u=setTimeout(()=>{r||(c(0),h())},180);i.push(u)});const d=setTimeout(()=>{r||l||(c(0),h())},800);i.push(d)}function Ao(e){var a;const t=document.getElementById("word-detective-content");if(!t)return;qe.add(e.toLowerCase().replace(/[^a-z']/g,"")),A();const n=Kn(e);t.innerHTML=Bo(n),fe.open("modal-word-detective");const s=t.querySelector('[data-role="ladder"]');if(!(s&&To(s,{word:n.text,graphemes:n.graphemes,types:n.types},n.foundInBank))){const i=t.querySelector(".wd-fallback");i&&(i.hidden=!1);try{K.speakWord(n.text)}catch{}}(a=t.querySelector('[data-action="hear"]'))==null||a.addEventListener("click",()=>{try{K.speakWord(n.text)}catch{}});const r=t.querySelector('[data-action="add-review"]');r==null||r.addEventListener("click",()=>{if(!n.word)return;jt(n.word.id)&&(r.disabled=!0,r.textContent="✓ In your Review Lane")})}function Bo(e){const t=r=>String(r??"").replace(/[<>&]/g,a=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[a]),n=Zt(e.text,e.graphemes,e.types),s=e.graphemes.map((r,a)=>{const i=ue[n[a]]??ue.consonant,l=i.mark?` data-mark="${t(i.mark)}"`:"";return`<span class="wd-tile vs--${n[a]}"${l} style="--tile-color:${i.color}" aria-label="${t(r)}, ${t(i.label)}">${t(r)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
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
    </div>`}function J(){return Nn()?"auto":"smooth"}function Co(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;Un(t,n)&&e.scrollIntoView({block:"center",behavior:J()})}catch{}}function De(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function Mo(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),De();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");x&&n?x.follow(n):t.scrollIntoView({behavior:J(),block:"nearest"})}}function _n(e){var n,s;let t;try{t=((s=(n=K).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function A(){var e;ke=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),De(),wt(!1)}function Mt(){ke=!1,w==null||w.querySelectorAll(".sline--active").forEach(e=>e.classList.remove("sline--active")),De(),wt(!1),yt(B)}function yt(e){if(!e)return;ht(e.id);const t=document.getElementById("story-quest-cta");t&&(t.hidden=!1),Wo(e),Oo(e)}const qe=new Set;function No(e){const t=V.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=z();return t.find(s=>!n.includes(s.id))??t[0]??null}function Ho(e){var s,o;const t=[q`You read <strong>${e.title}</strong> — ${Ae(e)} words.`];if(qe.size){const r=qe.size;t.push(q`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(q`You had a think about what happened.`);const n=to(e.id)?(o=sn(e))==null?void 0:o.name:"";return n&&t.push(q`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function Oo(e){var o,r,a;if(!e)return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=No(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=q`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${Ho(e).map(i=>q`<li>${i}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${n?q`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${n.id}"
          >
            ➡️ Next: ${n.title}
          </button>`:""}
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `,t.appendChild(s),s.scrollIntoView({behavior:J(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{qe.clear(),dt(e.id),ee=null,s.remove(),ot(0),x&&x.goTo(0)}),(r=s.querySelector("#btn-ending-next"))==null||r.addEventListener("click",i=>{A(),ft(i.currentTarget.dataset.storyId)}),(a=s.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{A(),he()})}function Wo(e){var a,i,l;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Ct.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Ct.add(e.id);const n=e.talkAboutIt[0];Xe=n;const s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:J(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.resp;if(Je({storyId:e.id,question:n,response:p}),o.querySelectorAll(".comp-choice").forEach(d=>d.disabled=!0),c.classList.add("correct"),p==="confident")r.textContent="👍 Great! You understood the story.";else if(p==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Tn(e),300);else{const d=Ft(e,Xe||n);d?(r.textContent="💡 Have a look at the sentence we have lit up.",go(d)):r.textContent="💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer."}r.hidden=!1;const h=o.querySelector("#comp-more");h&&(h.hidden=!1)})}),(i=o.querySelector("#comp-more"))==null||i.addEventListener("click",()=>{var p;const c=o.querySelector("#comp-q");c&&(c.textContent=s),Xe=s,$n(),Je({storyId:e.id,question:s,response:"followup"}),(p=o.querySelector("#comp-more"))==null||p.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(h=>{h.disabled=!1,h.classList.remove("correct")})}),(l=o.querySelector("#comp-skip"))==null||l.addEventListener("click",()=>{Je({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Po(){try{const e=on(V);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Fo(){var a,i;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=on(V),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=l=>String(l??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const l of e.roster)s.has(l.band)||s.set(l.band,[]),s.get(l.band).push(l);const o=Array.from(s.entries()).sort((l,c)=>String(l[0]).localeCompare(String(c[0]))).map(([l,c])=>{const p=c.filter(d=>d.unlocked).length,h=c.map(d=>`
        <button class="sf-tile ${d.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${n(d.storyId)}"
                ${d.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${d.unlocked?`${n(d.name)} from ${n(d.storyTitle)} — tap to re-read`:`Locked — read ${n(d.storyTitle)} to meet ${n(d.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${d.unlocked?n(d.emoji):"🔒"}</span>
          <span class="sf-tile__name">${d.unlocked?n(d.name):"???"}</span>
          ${d.unlocked?`<span class="sf-tile__story">from ${n(d.storyTitle)}</span>`:`<span class="sf-tile__story">${n(d.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${n(l)} <small>${p}/${c.length} met</small></h3>
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
    </div>`,document.body.appendChild(t),fe.open("modal-story-friends"),(i=t.querySelector("[data-close]"))==null||i.addEventListener("click",()=>{fe.close("modal-story-friends"),t.remove()}),t.addEventListener("click",l=>{l.target===t&&(fe.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.storyId;c&&(fe.close("modal-story-friends"),t.remove(),ft(c))})})}function wt(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function Go(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(i){if(t.hidden=i!=="idle",n.hidden=i!=="recording",s.hidden=i!=="recorded"&&i!=="playing",o.hidden=i!=="recorded"&&i!=="playing",r)switch(i){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}s&&(s.textContent=i==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await an({storyId:e.id,onStateChange:a})||a("error")}),n.addEventListener("click",()=>{Ce()}),s.addEventListener("click",()=>{cn()==="playing"?(Fe(),a("recorded")):ln()}),o.addEventListener("click",()=>{tt(),a("idle")})}function jo(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const i=e.lines.map((h,d)=>({...h,idx:d})).filter(h=>h.type!=="label"&&h.type!=="chapter"&&h.text);let l=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(h=>h.classList.remove("sline--echo-active")),l=-1}function p(h){var $,b;l=h;const d=i[h];if(!d){c();return}d.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(y=>y.classList.remove("sline--echo-active"));const u=w==null?void 0:w.querySelector(`[data-line="${d.idx}"]`);u&&(u.classList.add("sline--echo-active"),u.scrollIntoView({behavior:J(),block:"nearest"})),a&&(a.textContent=`Line ${h+1} of ${i.length}`,a.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const f=new SpeechSynthesisUtterance(d.text);f.rate=.82,_n(f),f.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${h+1}`)},f.onerror=()=>{s.hidden=!1},($=window.speechSynthesis)==null||$.cancel(),(b=window.speechSynthesis)==null||b.speak(f)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,p(0)}),s.addEventListener("click",async()=>{if(cn()==="recording"){Ce();return}const h=i[l];!await an({storyId:e.id,lineIdx:h==null?void 0:h.idx,onStateChange:u=>{u==="recording"?(s.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):u==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=l>=i.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):u==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{ln()}),n.addEventListener("click",()=>{tt(),o.hidden=!0,l+1<i.length?p(l+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{A(),Ce(),tt(),c()})}function zo(){Me||(Me=!0,ve=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,_e=setInterval(()=>{const e=Math.floor((Date.now()-ve)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}const Rn=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function at(e,t){var l;if(!Me&&_e===null)return;clearInterval(_e),_e=null,Me=!1;const n=document.getElementById("btn-fluency-start"),s=document.getElementById("btn-fluency-done");if(n&&(n.disabled=!1),s&&(s.disabled=!0),!e||!ve)return;const o=(Date.now()-ve)/1e3;ve=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;Re=o,r&&(r.hidden=!0),a.hidden=!1;const i=document.getElementById("fluency-time");i&&(i.textContent=`${e} words in ${Rn(o)}.`),(l=a.querySelector('input[name="errors"]'))==null||l.focus({preventScroll:!0})}function Do(e,t){var o;const n=document.getElementById("fluency-form"),s=document.getElementById("fluency-result");!n||!s||(n.addEventListener("submit",r=>{var f,$,b;r.preventDefault();const a=((f=n.querySelector('input[name="errors"]'))==null?void 0:f.value)??"",i=a===""?null:Number(a),l=(($=n.querySelector('input[name="support"]:checked'))==null?void 0:$.value)??null,{wpm:c,wcpm:p,accuracy:h}=Vs(e,Re,i);ro({storyId:t.id,wpm:c,wcpm:p,errors:i,accuracy:h,support:l,durationSec:Re,wordCount:e});const d=Ks({wpm:c,wcpm:p,primaryGrade:((b=Mn())==null?void 0:b.primaryGrade)??null});n.hidden=!0,n.reset(),s.hidden=!1,s.innerHTML=q`
      <div class="fluency-result-inner">
        <span class="fluency-time">${Rn(Re)}</span>
        <span class="fluency-wcpm">${d.headline}</span>
        ${h!=null?q`<span class="fluency-acc">${h}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${d.detail}</p>
      ${d.reference?q`<p class="fluency-reference">${d.reference}</p>`:""}
    `;const u=document.getElementById("story-quest-cta");u&&(u.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{n.hidden=!0,n.reset(),s.hidden=!1,s.textContent="Not saved."}))}export{qn as _highlightGraphemes,uo as _isMeetWordsCompletedToday,Je as _logComprehensionAttempt,Bt as _setMeetWordsCompleted,Xo as cleanupStoryMode,Jo as initStoryMode,Qo as showBrowser};
