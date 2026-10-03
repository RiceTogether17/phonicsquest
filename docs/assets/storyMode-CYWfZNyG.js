import{X as Pn,q as T,s as ae,W as gt,Y as Gn,Z as Ue,_ as Ce,C as bt,o as jn,$ as Oe,a0 as zn,a1 as P,M as Yt,b as Dn,a2 as je,a3 as Yn,a4 as Un}from"./index-EnVt4BiE.js";import{S as Y,B as D}from"./stories-BPkdoF9i.js";import{s as Kn,e as Ut,P as Vn,a as Kt}from"./decodability-D13TwzNj.js";import{g as Jn}from"./sightWordCode-BzuQg0Hs.js";import"./gsap-C8pce-KX.js";const Qn=/(\s+|["“”'',.!?;:()-]+)/;function Vt(e){return String(e??"").split(Qn).filter(t=>t.length>0).map(t=>({text:t,type:/^\s+$/.test(t)?"space":/^[^a-zA-Z0-9]+$/.test(t)?"punct":"word"}))}const Xn=new Set(`a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just some any true false story about also`.split(/\s+/));function Zn(e){let t=e.toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");/[^aeiou]ies$/.test(t)?t=`${t.slice(0,-3)}y`:/(ss|sh|ch|x|z)es$/.test(t)?t=t.slice(0,-2):(/[^s]es$/.test(t)||/[^su]s$/.test(t))&&(t=t.slice(0,-1));let n=!1;return/.{3,}ing$/.test(t)?(t=t.slice(0,-3),n=!0):(/.{3,}ed$/.test(t)||/.{3,}ly$/.test(t))&&(t=t.slice(0,-2),n=!0),n&&(t=t.replace(/([bdgmnprt])\1$/,"$1")),t}function nt(e){return new Set(String(e??"").split(/[\s\-—–/]+/).map(t=>t.toLowerCase().replace(/[^a-z']/g,"")).filter(t=>t.length>1&&!Xn.has(t)).map(Zn).filter(t=>t.length>1))}function es(e){const t=[];return((e==null?void 0:e.lines)??[]).forEach((n,s)=>{if(n.type==="label"||n.type==="chapter"||!n.text)return;const o=Vt(n.text);let r=-1,a=null,l=[];const i=()=>{a!==null&&(t.push({line:s,from:a,to:r,text:l.join("").trim()}),a=null,l=[])};for(const c of o)c.type==="word"&&(r+=1,a===null&&(a=r)),a!==null&&l.push(c.text),c.type==="punct"&&/[.!?]/.test(c.text)&&i();i()}),t}const ts=3;function Jt(e,t,n=""){const s=nt(`${t} ${n}`),o=nt(n);if(!s.size)return null;let r=null,a=0;for(const l of es(e)){const i=nt(l.text);let c=0;for(const p of s)i.has(p)&&(c+=(p.length>3?2:1)*(o.has(p)?3:1));(c>a||c===a&&c>0&&r&&l.text.length<r.text.length)&&(r=l,a=c)}return a>=ts?r:null}function ns(e,t){var s;if(!(t!=null&&t.q))return null;const n=((s=t.options)==null?void 0:s[t.answer])??"";return Jt(e,t.q,n)}function ss(e,t,n){var d;if(!((d=t.comprehension)!=null&&d.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,firstTry:0,withClue:0,hadClue:!1,clue:null,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return r();case"comprehension":return a();case"vocab":return c();case"openEnded":return i();case"grammar":return p();case"done":return f()}}function r(){var u,h,v,b;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(u=t.vocab)!=null&&u.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(h=t.grammarSpotlight)!=null&&h.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(v=document.getElementById("sq-start"))==null||v.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(b=document.getElementById("sq-skip"))==null||b.addEventListener("click",()=>n==null?void 0:n())}function a(){const u=t.comprehension[s.qIndex],h=s.qIndex+1,v=s.total;s.clue=ns(t,u),s.hadClue=!1;const b=Pn(u.options.map((y,x)=>x));e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${h/v*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${h} of ${v}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${u.q}</p>
          ${u.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${b.map((y,x)=>`
            <button class="sq-option" data-idx="${y}" aria-label="${u.options[y]}">
              <span class="sq-option-letter">${String.fromCharCode(65+x)}</span>
              <span class="sq-option-text">${u.options[y]}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(y=>{y.addEventListener("click",()=>l(y,u))})}function l(u,h){const v=parseInt(u.dataset.idx,10),b=v===h.answer,y=document.getElementById("sq-feedback"),x=s.clue;if(!b&&!s.hadClue&&x){s.hadClue=!0,u.disabled=!0,u.classList.add("sq-option--wrong"),y&&(y.hidden=!1,y.className="sq-feedback sq-feedback--retry",y.innerHTML=T`Not quite. The story says:
          <q class="sq-clue">${x.text}</q> Have another go.`);return}b&&(s.hadClue?s.withClue++:s.firstTry++,s.correct++),document.querySelectorAll(".sq-option").forEach(m=>{const g=parseInt(m.dataset.idx,10);m.disabled=!0,g===h.answer&&m.classList.add("sq-option--correct"),g===v&&!b&&m.classList.add("sq-option--wrong")}),y&&(y.hidden=!1,y.className=`sq-feedback ${b?"sq-feedback--correct":"sq-feedback--wrong"}`,b?y.textContent=s.hadClue?"✅ You found it!":"✅ Great thinking!":y.innerHTML=x?T`The answer is <strong>${h.options[h.answer]}</strong>. The story says:
              <q class="sq-clue">${x.text}</q>`:T`The answer is <strong>${h.options[h.answer]}</strong>.`);const _=document.getElementById("sq-next");_&&(_.hidden=!1,_.addEventListener("click",()=>{var m,g,$;s.qIndex++,s.qIndex<s.total||(s.phase=(m=t.openEnded)!=null&&m.length?"openEnded":(g=t.vocab)!=null&&g.length?"vocab":($=t.grammarSpotlight)!=null&&$.length?"grammar":"done",s.vocabIndex=0),o()}))}function i(){var h,v,b;const u=t.openEnded||[];if(!u.length){s.phase=(h=t.vocab)!=null&&h.length?"vocab":(v=t.grammarSpotlight)!=null&&v.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${u.map((y,x)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${x+1}. ${y.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${y.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${y.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(b=document.getElementById("sq-open-next"))==null||b.addEventListener("click",()=>{var y,x;s.phase=(y=t.vocab)!=null&&y.length?"vocab":(x=t.grammarSpotlight)!=null&&x.length?"grammar":"done",o()})}function c(){var x,_,m;const u=t.vocab[s.vocabIndex],h=t.vocab.length,v=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${v} of ${h}</p>

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
              ${v<h?"Next word →":"Done with words!"}
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
    `;const b=document.getElementById("sq-flip-card"),y=()=>{s.flipped=!0,o()};b==null||b.addEventListener("click",y),b==null||b.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&y()}),(x=document.getElementById("sq-flip-btn"))==null||x.addEventListener("click",y),(_=document.getElementById("sq-vocab-next"))==null||_.addEventListener("click",()=>{var g;s.vocabIndex++,s.flipped=!1,s.vocabIndex<h||(s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done"),o()}),(m=document.getElementById("sq-vocab-skip"))==null||m.addEventListener("click",()=>{var g;s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done",o()})}function p(){var v;const h=(t.grammarSpotlight??[]).map((b,y)=>`
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
        <div class="sq-grammar-list">${h}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(v=document.getElementById("sq-grammar-done"))==null||v.addEventListener("click",()=>{s.phase="done",o()})}function f(){var _;const u=s.total>0?Math.round(s.correct/s.total*100):100,h=u>=80?3:u>=50?2:1,v="⭐".repeat(h)+"☆".repeat(3-h),b=s.correct*15+(u===100?25:0),y=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],x=h===3?y[2]:h===2?y[1]:y[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${v}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${x}</p>
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
    `,(_=document.getElementById("sq-back"))==null||_.addEventListener("click",()=>n==null?void 0:n())}o()}function os(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let r=0;r<=n;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(s++,o=!0):a&&(o=!1)}return s<0?-1:s}function rs(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function as(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let ke=null;function Qt(){if(ke)return ke;ke=new Map;for(const e of gt)e!=null&&e.word&&ke.set(e.word.toLowerCase(),e);return ke}function is(e){const t=as(e),n=Qt(),s=t?n.get(t):null;if(s){const o=ae.get("wordStats")||{},r=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Xt(e){return!e||typeof e!="string"||!(Qt().has(e)||gt.some(s=>(s==null?void 0:s.id)===e))?!1:(ae.recordWordAttempt(e,!0,Gn.EXPOSURE),!0)}const ls=.62,cs=.4,Nt=2;function Ht(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function ds(e,t,n=(s,o)=>Ue.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(f=>({word:f,status:"miss",heard:null}));const r=-.4,a=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let f=1;f<=s;f++)a[f][0]=f*r;for(let f=1;f<=o;f++)a[0][f]=f*r;const l=Array.from({length:s},(f,d)=>Array.from({length:o},(u,h)=>n(e[d],t[h])));for(let f=1;f<=s;f++)for(let d=1;d<=o;d++){const u=l[f-1][d-1]-.5;a[f][d]=Math.max(a[f-1][d-1]+u,a[f-1][d]+r,a[f][d-1]+r)}const i=new Array(s);let c=s,p=o;for(;c>0;){const f=p>0?l[c-1][p-1]-.5:-1/0;if(p>0&&a[c][p]===a[c-1][p-1]+f){const d=l[c-1][p-1],u=e[c-1];let h;d>=ls?h="match":d>=cs||u.length<=Nt?h="unsure":h="miss",i[c-1]={word:u,status:h,heard:t[p-1]},c--,p--}else if(p>0&&a[c][p]===a[c][p-1]+r)p--;else{const d=e[c-1];i[c-1]={word:d,status:d.length<=Nt?"unsure":"miss",heard:null},c--}}return i}function us(e,t,n){const s=Ht(e);let o=null;for(const r of t||[]){const a=ds(s,Ht(r.text),n),l=a.filter(i=>i.status==="match").length;(!o||l>o.matchCount)&&(o={words:a,matchCount:l,total:s.length})}return o||{words:s.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:s.length}}function ps(){return Ue.supported}async function hs(e){const t=await Ue.listenTranscript({timeoutMs:12e3});return t?us(e,t.transcripts):null}function fs(){Ue.stop()}const $e=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function ms(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const gs=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function Me(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function bs(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:r}){var Bt,Ct,Mt;const a=[...e.querySelectorAll(s)];let l=[],i=0,c=0;const p=document.createElement("div");p.className=`ruler-layer ruler-layer--${t}`,p.setAttribute("aria-hidden","true"),p.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(p);const f=()=>{const k=a[i]??a[0]??e;return parseFloat(getComputedStyle(k).fontSize)||20},d=k=>p.querySelector(k),u=d(".ruler-veil--above"),h=d(".ruler-veil--below"),v=d(".ruler-strip"),b=d(".ruler-word"),y=d(".ruler-bar");function x(){const k=e.getBoundingClientRect();l=ms(a.map(E=>{const q=E.getBoundingClientRect();return q.width||q.height?{top:q.top-k.top,bottom:q.bottom-k.top}:null}))}const _=k=>{const E=l.findIndex(q=>k>=q.first&&k<=q.last);return E<0?0:E};function m(){const k=l[c];if(!k)return;const E=f(),q=E*.6,B=k.bottom+E*.18,M=Math.max(12,E*.55),j=e.scrollHeight;u.style.height=`${Math.max(0,k.top-q)}px`,h.style.top=`${B+M}px`,h.style.height=`${Math.max(0,j-B-M)}px`,v.style.top=`${k.top-q}px`,v.style.height=`${B-(k.top-q)}px`,y.style.top=`${B}px`,y.style.height=`${M}px`;const te=a[i];if(t==="word"&&te){const ne=e.getBoundingClientRect(),Q=te.getBoundingClientRect();b.style.left=`${Q.left-ne.left-3}px`,b.style.width=`${Q.width+6}px`,b.style.top=`${Q.top-ne.top-2}px`,b.style.height=`${Q.height+4}px`,y.style.setProperty("--x",`${Q.left-ne.left+Q.width/2}px`)}a.forEach((ne,Q)=>ne.classList.toggle("is-pointed",t==="word"&&Q===i))}function g(){r==null||r({word:i,line:c,lines:l.length,words:a.length,atEnd:t==="word"?i>=a.length-1:c>=l.length-1})}function $(){const k=l[c];if(!k)return;const E=e.getBoundingClientRect(),q=f(),B=E.top+k.top-q*.6,M=E.top+k.bottom+q*1.2,j=o();if(B>=j.top&&M<=j.bottom)return;const te=j.top+(j.bottom-j.top)*.28,ne={top:B-te,behavior:gs()?"auto":"smooth"};(Me(e)??window).scrollBy(ne)}function I(k,{scroll:E=!0}={}){var q;c=Math.max(0,Math.min(l.length-1,k)),i=((q=l[c])==null?void 0:q.first)??0,m(),g(),E&&$()}function G(k,{scroll:E=!0}={}){i=Math.max(0,Math.min(a.length-1,k)),c=_(i),m(),g(),E&&$()}function le(k){const E=k-e.getBoundingClientRect().top;let q=0,B=1/0;return l.forEach((M,j)=>{const te=E<M.top?M.top-E:E>M.bottom?E-M.bottom:0;te<B&&(B=te,q=j)}),q}let ce=!1;y.addEventListener("pointerdown",k=>{var E;ce=!0,(E=y.setPointerCapture)==null||E.call(y,k.pointerId),p.classList.add("is-dragging"),k.preventDefault()}),y.addEventListener("pointermove",k=>{if(!ce)return;const E=f(),q=le(k.clientY-E*.6);q!==c&&I(q,{scroll:!1})});const At=()=>{ce&&(ce=!1,p.classList.remove("is-dragging"),$())};y.addEventListener("pointerup",At),y.addEventListener("pointercancel",At);let tt=0;const Rt=()=>{cancelAnimationFrame(tt),tt=requestAnimationFrame(()=>{var k;x(),c=_(i),t!=="word"&&(i=((k=l[c])==null?void 0:k.first)??i),p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>p.classList.remove("no-anim"))})},de=typeof ResizeObserver=="function"?new ResizeObserver(Rt):null;if(de==null||de.observe(e),(Ct=(Bt=document.fonts)==null?void 0:Bt.ready)==null||Ct.then(Rt).catch(()=>{}),x(),n==null){const k=o(),E=e.getBoundingClientRect().top,q=l.findIndex(B=>E+B.top>=k.top);c=Math.max(0,q),i=((Mt=l[c])==null?void 0:Mt.first)??0}else i=Math.max(0,Math.min(a.length-1,n)),c=_(i);return p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>{p.classList.remove("no-anim"),n!=null&&$()}),{next(){t==="word"?G(i+1):I(c+1)},prev(){t==="word"?G(i-1):I(c-1)},nextLine:()=>I(c+1),prevLine:()=>I(c-1),tap(k,E){const q=E?a.indexOf(E):-1;q>=0?t==="word"?G(q,{scroll:!1}):I(_(q),{scroll:!1}):I(le(k),{scroll:!1})},follow(k){const E=a.indexOf(k);E<0||(t==="word"?E!==i&&G(E):_(E)!==c&&I(_(E)))},reveal:$,current:()=>a[i]??null,goTo(k){t==="word"?G(k):I(_(Math.max(0,Math.min(a.length-1,k))))},destroy(){de==null||de.disconnect(),cancelAnimationFrame(tt),a.forEach(k=>k.classList.remove("is-pointed")),e.classList.remove("has-ruler"),p.remove()}}}const ys="giri_story_place",ws=40,vs=30,Zt=8,en=()=>Ce(ys);function yt(){try{const e=localStorage.getItem(en()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function lt(e){try{localStorage.setItem(en(),JSON.stringify(e))}catch{}}function ks(e,t=Date.now()){const n=t-vs*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(s.slice(0,ws))}function tn(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=yt();if(t<Zt){if(!(e in s))return;delete s[e],lt(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},lt(ks(s,n))}function Ss(e){const t=yt()[e];return t&&typeof t.word=="number"&&t.word>=Zt?t.word:null}function wt(e){const t=yt();e in t&&(delete t[e],lt(t))}function $s(e){const t=ae.get("groupMastery")||{},n=bt.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function Ot(e){const t=ae.get("groupMastery")||{};return bt.some(n=>e.includes(n.id)&&typeof t[n.group]=="number"&&t[n.group]>0)}function Es(e){const t=ae.get("groupMastery")||{};return bt.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function nn(){const e=$s([1,2,3,4,5]),t=Es([6]),n=Ot(["rc-ar-or","rc-er-ir-ur"]),s=Ot(["dip-oi","dip-ou","dip-aw"]),o=e>=.6||t,r=o&&n,a=r&&s;return{A:{ready:!0,hint:""},B:{ready:o,hint:o?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:r,hint:r?"":"Best after starting Phase 7 — Bossy R (ar, or, er)"},D:{ready:a,hint:a?"":"Best after starting Phase 8 — Diphthongs"}}}function xs(e,t){const n=nn();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return s}return"A"}const Ls=["A","B","C","D"];let Se=null;function qs(e){var t;if(!Se){Se=new Map;for(const n of Ls)for(const s of Y)if(s.band===n)for(const o of Ut(s))Se.has(o)||((t=Jn(o))==null?void 0:t.category)==="heart"&&Se.set(o,n)}return Se.get(e)??null}function vt(e){if(!e)return[];const t=new Map(Kn(e).map(o=>[o.word,o])),n=[],s=new Set;for(const o of Ut(e))s.has(o)||(s.add(o),t.has(o)?n.push(t.get(o)):qs(o)===e.band&&n.push({word:o,display:o==="i"?"I":o,status:"heart"}));return n}const ye=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),Ts=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...ye[e]}))),kt=new Set(["short","long","schwa","rcontrolled","diphthong"]),_s=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),Ke="bcdfghjklmnpqrstvwxyz",Is=new RegExp(`[${Ke}]a$`),As=new RegExp("[bcdfghjkmnprstvz]al$"),sn=/[ts]ion$/;function on(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(_s.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&Is.test(e)&&t.add(e.length-1),e.length>=4&&As.test(e)&&t.add(e.length-2),e.length>=5&&sn.test(e)&&t.add(e.length-3)),t.size?t:null}const Rs=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),Bs=new RegExp(`[${Ke}]e$`);function rn(e){const t=new Set,n=e.length;if(n>=5&&sn.test(e)&&t.add(n-2),n>=4&&Bs.test(e)&&!Rs.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];Ke.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const Cs=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Ms=new Set(["been"]),Ns=new Set(["friend","friends"]),Hs=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),Os=["ing","ed","ly","es","s","n"];function We(e,t){if(e.has(t))return!0;for(const n of Os)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function Ee(e,t,n,s,o,r){return kt.has(s)?r!=null&&r.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&We(Cs,e)||t==="ee"&&We(Ms,e)||t==="ie"&&We(Ns,e)?"short":t==="ow"&&We(Hs,e)?"long":s:s}const S=null,an=new Map([["have",[S,"short",S,"silent"]],["love",[S,"short",S,"silent"]],["come",[S,"short",S,"silent"]],["some",[S,"short",S,"silent"]],["done",[S,"short",S,"silent"]],["gone",[S,"short",S,"silent"]],["none",[S,"short",S,"silent"]],["give",[S,"short",S,"silent"]],["live",[S,"short",S,"silent"]],["one",["short",S,"silent"]],["were",[S,"rcontrolled","rcontrolled","silent"]],["here",[S,"rcontrolled","rcontrolled","silent"]],["where",[S,S,"rcontrolled","rcontrolled","silent"]],["there",[S,S,"rcontrolled","rcontrolled","silent"]],["above",["schwa",S,"short",S,"silent"]],["become",[S,"short",S,"short",S,"silent"]],["people",[S,"long","silent",S,S,"silent"]],["again",["schwa",S,"long","long",S]],["said",[S,"short","short",S]],["says",[S,"short","short",S]]]),Ws=new Map(gt.map(e=>[e.word.toLowerCase(),e])),ln=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function Fs(e){return ln[e]??"consonant"}function cn(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=on(s),r=rn(s),a=an.get(s),l=[];let i=0;for(let c=0;c<t.length;c++){const p=t[c]||"",f=p.length||1;let d=Fs(n[c]);kt.has(d)&&(d=(a==null?void 0:a[i])??Ee(s,p,i,d,o,r)),l.push(d),i+=f}return l}const Ps="aeiou",Gs="bcdfghjklmnpqrstvwxyz",Wt=e=>Ps.includes(e),js=e=>Gs.includes(e),dn=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),zs=Object.keys(dn).sort((e,t)=>t.length-e.length);function Ds(e,t,n){const s=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&Wt(e[r])&&js(e[r+1])&&e[r+2]==="e"){s.push({len:1,sound:Ee(e,e[r],r,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let a=!1;for(const l of zs)if(e.startsWith(l,r)){s.push({len:l.length,sound:Ee(e,l,r,dn[l],t,n)}),r+=l.length,a=!0;break}if(!a){if(Wt(e[r])||e[r]==="y"&&r>0){const l=r===o-1?"long":"short";s.push({len:1,sound:Ee(e,e[r],r,l,t,n)}),r+=1;continue}s.push({len:1,sound:null}),r+=1}}return s}function Ys(e,t,n,s){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const l=e.graphemes[a],i=l.length;if(i===2&&l[1]==="e"&&Ke.includes(l[0])&&r+2===t.length&&(s!=null&&s.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=ln[e.types[a]]??null;!kt.has(c)&&c!=="silent"&&(c=null),c=Ee(t,l,r,c,n,s),o.push({len:i,sound:c}),r+=i}return o}function un(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Vn.has(t))return null;const n=an.get(t);if(n){const l=[];for(const i of n){const c=l[l.length-1];c&&c.sound===i?c.len+=1:l.push({len:1,sound:i})}return l}const s=on(t),o=rn(t),r=Ws.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?Ys(r,t,s,o):Ds(t,s,o)}function Us(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const n=un(t);if(!n)return t;let s="",o=0;for(const{len:a,sound:l}of n){const i=t.slice(o,o+a);if(o+=a,!l){s+=i;continue}const c=(r=ye[l])==null?void 0:r.cue;s+=`<span class="vs vs--${l}"${c?` data-cue="${c}"`:""}>${i}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function Ks(e,t){const n=[];let s="",o="";return e.forEach((r,a)=>{const l=r.replace(/^-/,"");if(t[a]==="silent"){o+=l;return}s+=o+l,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Vs(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Js(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:r,extraActions:a=""}){const l=cn(t,n,s),i=Ks(n,l),c=l.includes("silent");let p=0;const f=n.map((m,g)=>{const $=ye[l[g]]??ye.consonant;return T`<button
      type="button"
      class="bl-tile${l[g]==="silent"?" bl-tile--silent":""}"
      data-idx="${g}"
      data-mark="${$.mark||""}"
      style="--tile-color:${$.color}"
      aria-label="${l[g]==="silent"?`${m} is silent`:`Hear the sound for ${m}, ${$.label}`}"
    >
      ${m}
    </button>`});e.innerHTML=T`
    <div class="blend-ladder" data-word="${t}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${f}</div>
      ${c?T`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${jn(a)}
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
  `;const d=m=>e.querySelector(m),u=d(".bl-steps"),h=d(".bl-next"),v=d(".bl-again"),b=d(".bl-say"),y=[...e.querySelectorAll(".bl-tile")];function x(){u.innerHTML=T`${i.slice(0,p).map((g,$)=>T`<li class="${$===p-1?"is-new":""}">${g}</li>`)}`,y.forEach(g=>{const $=Number(g.dataset.idx),I=l.slice(0,$+1).filter(le=>le!=="silent").length-1,G=l[$]==="silent"?p>=i.length:I>-1&&I<p;g.classList.toggle("is-lit",G),g.classList.toggle("is-current",l[$]!=="silent"&&I===p-1)});const m=p>=i.length;h.hidden=m,v.hidden=!m,b.textContent=m?"🔊 Hear the word":"🔊 Just hear the word",b.classList.toggle("bl-say--escape",!m),m&&i.length&&u.insertAdjacentHTML("beforeend",String(T`<li class="bl-done">
          Say the word. Tap 🔊 to check. Then read its sentence again — does it make sense?
        </li>`))}function _(){if(p>=i.length)return;const m=Vs(l,p);p+=1,x(),m>=0&&Promise.resolve(o(n[m],s[m],{word:t,index:m})).catch(()=>{})}return h.addEventListener("click",_),v.addEventListener("click",()=>{p=0,x(),h.focus({preventScroll:!0})}),b.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),y.forEach(m=>m.addEventListener("click",async()=>{const g=Number(m.dataset.idx);if(l[g]!=="silent"){m.classList.add("is-tapped"),setTimeout(()=>m.classList.remove("is-tapped"),300);try{await o(n[g],s[g],{word:t,index:g})}catch{}}})),x(),{destroy(){e.innerHTML=""}}}const Qs=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),Xs=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),Zs=3,eo=e=>/[aeiouy]/.test(e);function ct(e,t,n){const s=[];let o=0;for(;o<e.length;){let r=Qs.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(r=null),r?(s.push(r),o+=r.length):(s.push(e[o]),o+=1)}return s}function to(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){n.push("qu"),s.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function no(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const so=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function oo(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of Xs){const p=c.slice(1),f=n.slice(0,-p.length);if(n.endsWith(p)&&f.length>=Zs&&eo(f)){s=c,n=f;break}}const r=un(n);if(!r)return null;const a=[],l=[];let i=0;for(const{len:c,sound:p}of no(r)){const f=n.slice(i,i+c);if(p)a.push(f),l.push(so[p]??"sv");else for(const d of ct(f,n,i))a.push(d),l.push("c");i+=c}if(i<n.length)for(const c of ct(n.slice(i),n,i))a.push(c),l.push("c");return o&&(a.push("s"),l.push("c")),s&&(a.push(s),l.push("sf")),a.length?to(a,l):null}function ro(e,t){const n=[],s=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){n.push(o),s.push(t[r]);return}const a=String(o).toLowerCase();for(const l of ct(a,a,0))n.push(l),s.push("c")}),{graphemes:n,types:s}}const ao=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),io=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function lo(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function co(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function uo(e,t,n=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const s=t/60,o=Math.round(e/s);if(n==null||Number.isNaN(n))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(n)));return{wpm:o,wcpm:Math.round((e-r)/s),accuracy:Math.round((e-r)/e*100)}}function po({wpm:e,wcpm:t=null,primaryGrade:n=null,now:s=new Date}){var c,p;const o=co(n),r=lo(s),a=o?(c=ao[o])==null?void 0:c[r]:null,l=o?(p=io[o])==null?void 0:p[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const i=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:i}:l!=null&&t>=l?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:i}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:i}}const ho="giri_friends_unlocked";function pn(){return Ce(ho)}const fo=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function mo(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function hn(e){if(!e||!e.id)return null;const t=fo[e.id]||mo(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function St(){try{const e=localStorage.getItem(pn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function go(e){try{localStorage.setItem(pn(),JSON.stringify(Array.from(e)))}catch{}}function bo(e){if(!e||typeof e!="string")return!1;const t=St();return t.has(e)?!1:(t.add(e),go(t),!0)}function yo(e){return St().has(e)}function wo(e){const t=St();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=hn(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function fn(e){const t=wo(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const mn="giri_fluency_history",Ft=5,re=new Map,vo=10;function ko(e,t){for(re.set(e,t);re.size>vo;){const n=re.keys().next().value;re.delete(n)}}let me=null,N=null,st=[],ge=null,xe=null,Ve="idle",H=null;async function gn({storyId:e,lineIdx:t,onStateChange:n}={}){if(Ve==="recording")return!1;xe=n??null,st=[];try{me=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return U("error"),!1}const s=Eo();try{N=new MediaRecorder(me,s?{mimeType:s}:{})}catch{N=new MediaRecorder(me)}return N.ondataavailable=o=>{o.data.size>0&&st.push(o.data)},N.onstop=()=>{const o=new Blob(st,{type:N.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;ge=r,ko(r,o),ut(),U("recorded")},N.onerror=()=>{ut(),U("error")},N.start(),U("recording"),!0}function ze(){N&&N.state==="recording"?N.stop():ut()}function bn(e){const t=ge,n=t?re.get(t):null;return n?new Promise(s=>{Je();const o=URL.createObjectURL(n);H=new Audio(o),U("playing"),H.onended=()=>{URL.revokeObjectURL(o),H=null,U("recorded"),s()},H.onerror=()=>{URL.revokeObjectURL(o),H=null,U("recorded"),s()},H.play().catch(()=>{URL.revokeObjectURL(o),H=null,U("recorded"),s()})}):Promise.resolve()}function Je(){H&&(H.pause(),H=null)}function dt(e){const t=ge;t&&re.delete(t),t===ge&&(ge=null),Je(),U("idle")}function yn(){return Ve}function wn(){ze(),Je(),re.clear(),ge=null,Ve="idle",xe=null}function So(e){const t=vn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>Ft&&n.splice(0,n.length-Ft),t[e.storyId]=n,xo(t)}function $o(e){return vn()[e]??[]}function U(e){Ve=e,xe==null||xe(e)}function ut(){me&&(me.getTracks().forEach(e=>e.stop()),me=null)}function Eo(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function vn(){try{return JSON.parse(localStorage.getItem(mn)??"{}")}catch{return{}}}let Pt=!1;function xo(e){try{localStorage.setItem(mn,JSON.stringify(e))}catch{if(Pt)return;Pt=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const kn="/phonicsquest/";let w=null,z="A",Gt=!1,ue="band",Ne=!1,Sn=0,ee=0,C=null,O=null,be=null,he=null,fe=null,A=null,F="word",_e=!1,we=-1,He=[],Le=0,Qe=[],Xe=0,Ie=0;const Lo="giri_stories_read";function $n(){return Ce(Lo)}function K(){try{return JSON.parse(localStorage.getItem($n())??"[]")}catch{return[]}}function $t(e){const t=K();t.includes(e)||(t.push(e),localStorage.setItem($n(),JSON.stringify(t))),wt(e),bo(e)}let Fe=null,qe=null,De=!1,Pe=0;const En="giri_show_graphemes",xn="giri_show_ruler",Ln="giri_ruler_mode",Et="giri_follow_mode",qo="giri_meet_words";function qn(){return Ce(qo)}const To="giri_comp_log";function jt(){return Ce(To)}let pe=Ze(En,!0),se=Ze(xn,!1),L=null,X=null,pt=Ze(Ln,"line"),oe=null,Ae=0,W=null;F=Ze(Et,"word");function Ze(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function Te(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const Tn=new Set;function _n(){return new Date().toISOString().slice(0,10)}function In(){try{const e=localStorage.getItem(qn());return e?JSON.parse(e):{}}catch{return{}}}function _o(e){try{localStorage.setItem(qn(),JSON.stringify(e))}catch{}}function Io(e){return Tn.has(e)?!0:In()[e]===_n()}function zt(e){Tn.add(e);const t=In();t[e]=_n();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];_o(t)}const Dt=new Set,Ao=100;function ot(e){try{const t=localStorage.getItem(jt()),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>Ao;)n.shift();localStorage.setItem(jt(),JSON.stringify(n))}catch{}}function yr(e,t){w=e}function wr(){R(),ve()}function vr(){R(),V({restoreFocus:!1}),mt(),wn(),Lt()}function ve(){var n,s,o;Re(),V({restoreFocus:!1}),Rn(),A=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ue==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ue==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ue==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${ir()}</button>
    </div>
  `;let t;if(ue==="band"){if(!Gt){Gt=!0;try{const u={};for(const h of Y)(u[n=h.band]??(u[n]=[])).push(h);z=xs(K(),u)||z}catch{}}const r=D.find(u=>u.band===z)??D[0],a=Y.filter(u=>u.band===z&&u.category!=="chapter"&&u.category!=="nonfiction-sg"),l=K(),i=a.filter(u=>l.includes(u.id)).length,c=nn(),p=D.map(u=>{var h,v,b;return`
      <button
        class="story-tab${u.band===z?" active":""}${(h=c[u.band])!=null&&h.ready?"":" story-tab--not-ready"}"
        data-band="${u.band}"
        style="--tab-color:${u.color}"
        ${(v=c[u.band])!=null&&v.ready?"":`title="${c[u.band].hint}"`}
      >
        <span class="story-tab-num">${u.band}</span>
        <span class="story-tab-name">${u.label}</span>
        ${(b=c[u.band])!=null&&b.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),f=a.map(u=>rt(u,r,!1,l.includes(u.id))).join(""),d=a.length?Math.round(i/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${p}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${z}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${i} of ${a.length} stories read">
          ${i}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${d}%"></span>
        </span>
      </div>
      ${(s=c[z])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[z].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${f}</div>
    `}else if(ue==="singapore"){const r=Y.filter(i=>i.category==="nonfiction-sg"),a=K();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(i=>{const c=D.find(p=>p.band===i.band)??D[0];return rt(i,c,!1,a.includes(i.id))}).join("")}</div>
    `}else{const r=Y.filter(i=>i.category==="chapter").sort((i,c)=>(i.chapterNum??0)-(c.chapterNum??0)),a=K();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(i=>{const c=D.find(p=>p.band===i.band)??D[0];return rt(i,c,!0,a.includes(i.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{ue=r.dataset.cat,ve()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{lr()}),w.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{z=r.dataset.band,ve()})}),w.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>xt(r.dataset.storyId))})}function rt(e,t,n=!1,s=!1){var l;const o=(l=e.comprehension)!=null&&l.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${kn}images/stories/${e.illustration}"
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
        ${Kt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const i=vt(e).length;return i?`<span class="story-card-support" data-support="independent">👀 ${i} new ${i===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function xt(e){const t=Y.find(n=>n.id===e);t&&(R(),oe=K().includes(t.id)?null:Ss(t.id),Be.clear(),Ro(t))}function Ro(e){var n;A=e;const t=D.find(s=>s.band===e.band)??D[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${kn}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Kt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{R(),ve()}),Bo(e)}function Bo(e){Io(e.id)?ie(e):Co(e)}function Co(e){var f;const t=document.getElementById("story-dynamic");if(!t)return;Re();const n=vt(e),s=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),o=(e.vocab??[]).filter(d=>s.includes(d.word.toLowerCase().split(/\s+/)[0]));if(!n.length&&!o.length){zt(e.id),ie(e);return}const r=Math.min(3,n.length+o.length),a=new Set;t.innerHTML=T`
    <section class="warm-up" aria-labelledby="warm-up-title">
      <h3 id="warm-up-title">🤝 Meet the words</h3>
      <p class="warm-up-lead">
        ${n.length?T`These are the words in <strong>${e.title}</strong> you cannot sound out — so
              here they are first. Tap any ${r} to warm up.`:T`A few words worth knowing before you read
              <strong>${e.title}</strong>. Tap any ${r} to warm up.`}
      </p>

      ${n.length?T`<div class="warm-up-section">
            <div class="warm-up-section-title">👀 Words to know first — tap to hear</div>
            <div class="warm-up-words">
              ${n.map(({word:d,display:u,status:h})=>T`<button
                  type="button"
                  class="story-prep-word"
                  data-tap-id="prep:${d}"
                  data-prep-word="${d}"
                  data-status="${h}"
                  aria-label="Hear the word ${u}"
                >
                  ${u}
                </button>`)}
            </div>
          </div>`:""}

      ${o.length?T`<div class="warm-up-section">
            <div class="warm-up-section-title">📚 Key words — tap to hear what they mean</div>
            <div class="vocab-chip-list">
              ${o.map(d=>T`<button
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
  `;const l=document.getElementById("warm-up-progress"),i=document.getElementById("warm-up-go");function c(d){const u=d.dataset.tapId;a.has(u)||(a.add(u),d.setAttribute("data-tapped","true"),l&&(l.textContent=a.size>=r?"✓ Warmed up — start the story, or keep tapping":`${a.size} of ${r} tapped`),a.size>=r&&i&&(i.disabled=!1,i.focus({preventScroll:!0})))}t.querySelectorAll("[data-prep-word]").forEach(d=>{d.addEventListener("click",()=>{var u,h;(h=(u=P.speakSightWord(d.dataset.prepWord))==null?void 0:u.catch)==null||h.call(u,()=>{}),d.classList.add("story-prep-word--said"),setTimeout(()=>d.classList.remove("story-prep-word--said"),600),c(d)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",async()=>{var h,v;Ko(d),d.classList.add("vocab-chip--expanded"),c(d);const u=(v=(h=d.querySelector(".vocab-chip-meaning"))==null?void 0:h.textContent)==null?void 0:v.trim();try{await P.speakWord(d.dataset.word),u&&await P.speakText(u)}catch{}})});const p=()=>{zt(e.id),ie(e)};(f=document.getElementById("warm-up-skip"))==null||f.addEventListener("click",p),i==null||i.addEventListener("click",p)}function Ge(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function ie(e){var c,p,f,d,u,h,v,b,y,x,_;const t=document.getElementById("story-dynamic");if(!t)return;Re(),V({restoreFocus:!1});const n=e.lines.map((m,g)=>Do(m,g,!0,e)).join(""),s=!!((c=e.comprehension)!=null&&c.length),r=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(m=>`<li>${m}</li>`).join("")}
      </ul>
    </div>
  `:"",a=$o(e.id),l=a.length?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${a.slice().reverse().map(m=>{const g=new Date(m.date),$=`${g.getDate()}/${g.getMonth()+1}`,I=typeof m.wcpm=="number"&&m.errors!=null,G=I?m.wcpm:m.wpm??m.wcpm,le=I?"correct/min":"words/min",ce=m.support==="supported"?" · with help":"";return`<span class="fluency-history-item">${$}: <strong>${G}</strong> ${le}${ce}</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${pe}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${se}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${F==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${F==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${pe?zo():""}

      ${(()=>{const m=vt(e);return m.length?String(T`
          <details class="story-prep-strip">
            <summary>
              👀 ${m.length} ${m.length===1?"word":"words"} to know — tap to hear
            </summary>
            <div class="story-prep-words">
              ${m.map(({word:g,display:$,status:I})=>T`<button
                  type="button"
                  class="story-prep-word"
                  data-prep-word="${g}"
                  data-status="${I}"
                  aria-label="Hear the word ${$}"
                >
                  ${$}
                </button>`)}
            </div>
          </details>
        `):""})()}

      ${oe!==null?`
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`:""}

      <div class="story-body story-body--follow-${F}" id="story-body" aria-live="polite">${n}</div>

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
                Time one read-aloud of the whole story (${Ge(e)} words).
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
                  <input type="number" name="errors" min="0" max="${Ge(e)}" inputmode="numeric" />
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
              <span class="rtg-label">${zn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${ps()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(m=>{m.addEventListener("click",()=>{F=m.dataset.follow,Te(Et,F),ie(e)})}),t.querySelectorAll(".wf-word").forEach(m=>{m.setAttribute("role","button"),m.setAttribute("tabindex","0");const g=$=>{const I=qt(m);I&&($.preventDefault(),L==null||L.tap($.clientY??0,m),Qo(I,m))};m.addEventListener("click",g),m.addEventListener("keydown",$=>{($.key==="Enter"||$.key===" ")&&g($)})}),(f=document.getElementById("btn-toggle-graphemes"))==null||f.addEventListener("click",()=>{pe=!pe,Te(En,pe),ie(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var m,g;se=!se,Te(xn,se),(m=document.getElementById("btn-toggle-ruler"))==null||m.setAttribute("aria-pressed",String(se)),Re(),se&&(ft(),(g=document.getElementById("btn-ruler-next"))==null||g.focus({preventScroll:!0}))}),se?requestAnimationFrame(()=>ft(oe)):oe!==null&&requestAnimationFrame(()=>ht(oe)),No(e),(u=document.getElementById("btn-resume-restart"))==null||u.addEventListener("click",m=>{var g;wt(e.id),oe=null,(g=m.currentTarget.closest(".story-resume"))==null||g.remove(),ht(0),L&&L.goTo(0)}),Ho(),(h=document.getElementById("btn-story-play"))==null||h.addEventListener("click",()=>Tt(e)),(v=document.getElementById("btn-story-stop"))==null||v.addEventListener("click",()=>R()),t.querySelectorAll(".story-prep-strip [data-prep-word]").forEach(m=>{m.addEventListener("click",()=>{var g,$;($=(g=P.speakSightWord(m.dataset.prepWord))==null?void 0:g.catch)==null||$.call(g,()=>{}),m.classList.add("story-prep-word--said"),setTimeout(()=>m.classList.remove("story-prep-word--said"),600)})}),(b=document.getElementById("btn-finish-story"))==null||b.addEventListener("click",m=>{var I;_t(e);const g=m.currentTarget;g.disabled=!0,g.textContent="✓ Read — well done!";const $=document.querySelector(".story-finish-note");$&&($.textContent=(I=e.comprehension)!=null&&I.length?"Now have a go at the questions.":"")});const i=Ge(e);(y=document.getElementById("btn-fluency-start"))==null||y.addEventListener("click",()=>ur()),(x=document.getElementById("btn-fluency-done"))==null||x.addEventListener("click",()=>mt(i)),pr(i,e),cr(e),Lt(),Fo(e),dr(e),(_=document.getElementById("btn-launch-quest"))==null||_.addEventListener("click",()=>{R(),mt(),wn(),$t(e.id),ss(w,e,()=>{ve()})})}let at="";function Mo(e){An();const t=w==null?void 0:w.querySelector(`#story-body [data-line="${e.line}"]`);if(!t)return;const n=[...t.querySelectorAll(".wf-word")].filter(s=>{const o=Number(s.dataset.wordIdx);return o>=e.from&&o<=e.to});n.length&&(n.forEach(s=>s.classList.add("is-clue")),L?L.follow(n[0]):n[0].scrollIntoView({behavior:J(),block:"center"}))}function An(){w==null||w.querySelectorAll(".wf-word.is-clue").forEach(e=>e.classList.remove("is-clue"))}function ht(e){const t=w==null?void 0:w.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:J(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function No(e){Rn();const t=document.getElementById("story-body");if(!t)return;const n=Me(t);n&&(W=n,W._pqPlaceHandler=()=>{clearTimeout(Ae),Ae=setTimeout(()=>{if(L||K().includes(e.id))return;const s=t.getBoundingClientRect(),o=Bn();if(s.bottom<o.top||s.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(l=>l.getBoundingClientRect().top>=o.top);a>=0&&tn(e.id,a)},500)},n.addEventListener("scroll",W._pqPlaceHandler,{passive:!0}))}function Ho(){const e=document.getElementById("story-resume");if(!e)return;const t=Me(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&s()};t==null||t.addEventListener("scroll",r,{passive:!0}),n=setTimeout(s,9e3)}function Rn(){clearTimeout(Ae),W!=null&&W._pqPlaceHandler&&(W.removeEventListener("scroll",W._pqPlaceHandler),delete W._pqPlaceHandler),W=null}function Bn(){const e=document.getElementById("story-body"),t=e?Me(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,a=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),l=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(l,r+120)}}function Ye(){return $e.find(e=>e.id===pt)??$e[1]}function Oo(){const e=Ye();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${je(e.label)}. Tap to change."
              title="${je(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${Yt(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function ft(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=Oo();const s=Ye(),o=n.querySelector(".ruler-pos small"),r=n.querySelector(".ruler-pos b"),a=n.querySelector("#btn-ruler-next"),l=n.querySelector("#btn-ruler-back");L=bs(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Bn,onMove(i){X=i;const c=s.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${i.word+1} / ${i.words}`:`${i.line+1} / ${i.lines}`,l.disabled=c?i.word===0:i.line===0,a.textContent=i.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",i.atEnd),clearTimeout(Ae),Ae=setTimeout(()=>{K().includes((A==null?void 0:A.id)??"")||tn(A==null?void 0:A.id,i.word)},400)}}),l.addEventListener("click",()=>L==null?void 0:L.prev()),a.addEventListener("click",()=>{if(!(X!=null&&X.atEnd))return L==null?void 0:L.next();_t(A)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var p;const i=(X==null?void 0:X.word)??0,c=$e.indexOf(Ye());pt=$e[(c+1)%$e.length].id,Te(Ln,pt),Re(),ft(i),(p=document.getElementById("btn-ruler-style"))==null||p.focus({preventScroll:!0})})}function Re(){L==null||L.destroy(),L=null,X=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function Wo(e){var s,o,r,a;if(!L||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]")||(a=(r=e.target)==null?void 0:r.closest)!=null&&a.call(r,".word-panel"))return;const t=Ye().id==="word",n={ArrowDown:()=>L.nextLine(),ArrowUp:()=>L.prevLine(),ArrowRight:()=>t?L.next():L.nextLine(),ArrowLeft:()=>t?L.prev():L.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",Wo);function Fo(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>Po(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>Go(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Nn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{Lt(),ie(e)})}function Z(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function Cn(){const e=He[we];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function Po(e){var n,s,o;if(F!=="word"){F="word",Te(Et,F),ie(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}R();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(_e=!0,He=t,we=0,Le=0,Qe=[],Xe=0,Ie=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Mn(),Z("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Mn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=Cn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:J()}))}async function Go(e){var p;const t=Cn(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(qt).filter(Boolean).join(" ");if(!o){Nn(e);return}n.disabled=!0,n.replaceChildren(Un("encourage"),document.createTextNode("Giri is listening…")),Z("Go ahead — read the glowing line now.");const r=await hs(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!_e)return;if(!r){Le++,Le>=2?Z("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):Z("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Le=0;const a=[];r.words.forEach((f,d)=>{const u=s[d];if(u)if(u.classList.remove("rtg-word--match","rtg-word--check"),f.status==="miss"){u.classList.add("rtg-word--check");const h=f.word.replace(/[^a-z]/g,"");h.length>2&&(a.push(h),Xt(h))}else u.classList.add("rtg-word--match")});const l=r.words.filter(f=>f.status!=="miss").length;Xe+=l,Ie+=r.words.length,Qe.push(...a);const i=we>=He.length-1;a.length>0?Z(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${i?"finish up":"go on"}!`):Z("⭐ Great — Giri heard every word!"),(p=document.getElementById("btn-rtg-listen"))==null||p.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=i?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Nn(e){var t,n;if(we>=He.length-1){jo(e);return}we++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),Mn(),Z("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function jo(e){var l,i;const t=Ie>0?Math.round(Xe/Ie*100):0,n=[...new Set(Qe)],s={...ae.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},ae.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(l=document.getElementById("btn-rtg-next"))==null||l.setAttribute("hidden",""),(i=document.getElementById("btn-rtg-exit"))==null||i.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";Z(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),$t(e.id),_e=!1}function Lt(){_e&&fs(),_e=!1,we=-1,He=[],Le=0,Qe=[],Xe=0,Ie=0}function Hn(e){return!pe||!e?e:Us(e)}function zo(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${Ts.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Do(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${Yt(o)}</div>`;const r=s?Hn(o,s.targetGraphemes,s.band):o,a=n?Yo(o,s):r;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function Yo(e,t=null){if(!e)return"";const n=Vt(e);let s=0;return n.map(o=>{if(o.type==="word"){const r=t?Hn(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${je(o.text)}" aria-label="${je(o.text)}">${r}</span>`}return o.text}).join("")}function qt(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Uo(e,t,n=!0){var a;const s=n&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:oo(t.word);if(!s)return!1;const{graphemes:o,types:r}=ro(s.graphemes,s.types);return Js(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(l,i,c)=>P.speakPhoneme(l,i,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:l=>P.speakWord(l)}),!0}function Ko(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function Vo(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const r=n[s+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function Tt(e,t=0){if(!window.speechSynthesis)return;R(),V({restoreFocus:!1}),A=e,It(!0),Ne=!0;const n=Vo(e),s=n.findIndex(o=>o.highlightIdx>=t);On(n,Math.max(0,s))}function On(e,t,n=ee){if(n!==ee||!Ne)return;if(t>=e.length){nr();return}const s=e[t];Sn=s.highlightIdx,tr(s.highlightIdx);const o=new SpeechSynthesisUtterance(s.text);o.rate=.82,Wn(o);const r=s.text.startsWith("Puff")?600:380;F==="word"&&Jo(o,s.highlightIdx),o.onend=()=>{n===ee&&(et(),setTimeout(()=>On(e,t+1,n),r))},o.onerror=()=>{n===ee&&R()},window.speechSynthesis.speak(o)}function Jo(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=ee,r=e.text||"";let a=!1,l=-1,i=[],c=!1;function p(h){if(o!==ee||h<0||h>=s.length||h===l)return;l=h,s.forEach(b=>b.classList.remove("wf-word--active"));const v=s[h];v.classList.add("wf-word--active"),L?L.follow(v):er(v)}function f(){for(const h of i)clearTimeout(h);i=[]}function d(){var y;if(c)return;c=!0;const h=typeof e.rate=="number"&&e.rate>0?e.rate:.82,v=Array.from(s,qt);let b=0;for(let x=0;x<s.length;x++){const _=x,m=((y=v[x])==null?void 0:y.length)||3,g=Math.max(160,Math.round((90+m*60)/h)),$=setTimeout(()=>{a||p(_)},b);i.push($),b+=g}}e.addEventListener("boundary",h=>{h.name&&h.name!=="word"||(a=!0,f(),p(os(r,h.charIndex??-1)))}),e.addEventListener("end",()=>{f()}),e.addEventListener("start",()=>{if(a)return;const h=setTimeout(()=>{a||(p(0),d())},180);i.push(h)});const u=setTimeout(()=>{a||c||(p(0),d())},800);i.push(u)}function Qo(e,t){var u,h,v;Be.add(e.toLowerCase().replace(/[^a-z']/g,""));const n=Ne,s=Sn;R(),V({restoreFocus:!1});const o=is(e),r=Xo();r.setAttribute("aria-label",`Sound out the word ${o.text}`),r.innerHTML=Zo(o,{resume:n}),r.hidden=!1,document.body.classList.add("word-panel-open"),O=t!=null&&t.isConnected?t:null,O==null||O.classList.add("wf-word--looking"),be=O?O.closest(".stories-content")??Me(O):null;const a=r.querySelector('[data-role="ladder"]');if(!(a&&Uo(a,{word:o.text,graphemes:o.graphemes,types:o.types},o.foundInBank))){const b=r.querySelector(".wd-fallback");b&&(b.hidden=!1);try{P.speakWord(o.text)}catch{}}(u=r.querySelector('[data-action="hear"]'))==null||u.addEventListener("click",()=>{try{P.speakWord(o.text)}catch{}});const i=r.querySelector('[data-action="add-review"]');i==null||i.addEventListener("click",()=>{if(!o.word)return;Xt(o.word.id)&&(i.disabled=!0,i.textContent="✓ In your Review Lane")}),(h=r.querySelector('[data-action="close"]'))==null||h.addEventListener("click",()=>V()),(v=r.querySelector('[data-action="back"]'))==null||v.addEventListener("click",()=>{V(),n&&A&&Tt(A,s)});const c=r.querySelector(".bl-next:not([hidden])")??r.querySelector('[data-action="hear"]')??r.querySelector('[data-action="close"]');c==null||c.focus({preventScroll:!0}),it(),fe=new AbortController;const{signal:p}=fe,f=()=>{p.aborted||it()};(be??window).addEventListener("scrollend",f,{once:!0,signal:p}),window.addEventListener("scrollend",f,{once:!0,signal:p});const d=setTimeout(f,700);p.addEventListener("abort",()=>clearTimeout(d)),typeof ResizeObserver=="function"&&(he=new ResizeObserver(()=>it()),he.observe(r))}function Xo(){if(C!=null&&C.isConnected)return C;const e=document.createElement("aside");return e.id="word-panel",e.className="word-panel",e.setAttribute("role","dialog"),e.hidden=!0,document.body.appendChild(e),C=e,e}function V({restoreFocus:e=!0}={}){var n,s;he==null||he.disconnect(),he=null,fe==null||fe.abort(),fe=null,be&&(be.style.paddingBottom=""),be=null,document.body.classList.remove("word-panel-open"),document.querySelectorAll(".wf-word--looking").forEach(o=>o.classList.remove("wf-word--looking"));const t=O;if(O=null,!(!C||C.hidden)){try{(s=(n=P).cancelSpeech)==null||s.call(n)}catch{}C.hidden=!0,C.innerHTML="",e&&(t!=null&&t.isConnected)&&t.focus({preventScroll:!0})}}function it(){const e=C,t=O;if(!e||e.hidden||!(t!=null&&t.isConnected))return;const n=parseFloat(getComputedStyle(e).bottom)||0,s=window.innerHeight-n-e.offsetHeight,o=be,r=o==null?void 0:o.getBoundingClientRect();o&&r&&(o.style.paddingBottom=`${Math.max(0,Math.ceil(r.bottom-s)+24)}px`);const a=t.getBoundingClientRect(),l=(r==null?void 0:r.top)??0;let i=0;a.bottom>s-16?i=Math.min(a.bottom-s+32,Math.max(0,a.top-l-8)):a.top<l+8&&(i=a.top-(l+(s-l)*.4)),i&&(o??window).scrollBy({top:i,behavior:J()})}document.addEventListener("keydown",e=>{e.key!=="Escape"||!C||C.hidden||document.querySelector(".modal-overlay:not([hidden])")||(e.preventDefault(),V())});function Zo(e,{resume:t=!1}={}){const n=l=>String(l??"").replace(/[<>&"]/g,i=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[i]),s=cn(e.text,e.graphemes,e.types),o=e.graphemes.map((l,i)=>{const c=ye[s[i]]??ye.consonant,p=c.mark?` data-mark="${n(c.mark)}"`:"";return`<span class="wd-tile vs--${s[i]}"${p} style="--tile-color:${c.color}" aria-label="${n(l)}, ${n(c.label)}">${n(l)}</span>`}).join(""),r=e.foundInBank?`<button class="btn btn--ghost btn--sm" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:"",a=t?"▶ Keep listening":"↩ Back to my story";return`
    <div class="wd-card">
      <button class="wp-close" type="button" data-action="close" aria-label="Close">✕</button>
      <p class="wd-word">${n(e.text)}</p>
      <div data-role="ladder"></div>
      <div class="wd-fallback" hidden>
        ${o?`<div class="wd-tiles" aria-label="Sound breakdown">${o}</div>`:""}
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
      </div>
      <div class="wd-actions">
        <button class="btn btn--ghost btn--sm wp-back" type="button" data-action="back">${a}</button>
        ${r}
      </div>
    </div>`}function J(){return Yn()?"auto":"smooth"}function er(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;rs(t,n)&&e.scrollIntoView({block:"center",behavior:J()})}catch{}}function et(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function tr(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),et();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");L&&n?L.follow(n):t.scrollIntoView({behavior:J(),block:"nearest"})}}function Wn(e){var n,s;let t;try{t=((s=(n=P).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function R(){var e;ee++,Ne=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),et(),It(!1)}function nr(){ee++,Ne=!1,w==null||w.querySelectorAll(".sline--active").forEach(e=>e.classList.remove("sline--active")),et(),It(!1),_t(A)}function _t(e){if(!e)return;V({restoreFocus:!1}),$t(e.id);const t=document.getElementById("story-quest-cta");t&&(t.hidden=!1),ar(e),rr(e)}const Be=new Set;function sr(e){const t=Y.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=K();return t.find(s=>!n.includes(s.id))??t[0]??null}function or(e){var s,o;const t=[T`You read <strong>${e.title}</strong> — ${Ge(e)} words.`];if(Be.size){const r=Be.size;t.push(T`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(T`You had a think about what happened.`);const n=yo(e.id)?(o=hn(e))==null?void 0:o.name:"";return n&&t.push(T`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function rr(e){var o,r,a;if(!e)return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=sr(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=T`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${or(e).map(l=>T`<li>${l}</li>`)}
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
  `,t.appendChild(s),s.scrollIntoView({behavior:J(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{Be.clear(),wt(e.id),oe=null,s.remove(),ht(0),L&&L.goTo(0)}),(r=s.querySelector("#btn-ending-next"))==null||r.addEventListener("click",l=>{R(),xt(l.currentTarget.dataset.storyId)}),(a=s.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{R(),ve()})}function ar(e){var a,l,i;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Dt.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Dt.add(e.id);const n=e.talkAboutIt[0];at=n;const s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:J(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.resp;if(ot({storyId:e.id,question:n,response:p}),o.querySelectorAll(".comp-choice").forEach(d=>d.disabled=!0),c.classList.add("correct"),p==="confident")r.textContent="👍 Great! You understood the story.";else if(p==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Tt(e),300);else{const d=Jt(e,at||n);d?(r.textContent="💡 Have a look at the sentence we have lit up.",Mo(d)):r.textContent="💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer."}r.hidden=!1;const f=o.querySelector("#comp-more");f&&(f.hidden=!1)})}),(l=o.querySelector("#comp-more"))==null||l.addEventListener("click",()=>{var p;const c=o.querySelector("#comp-q");c&&(c.textContent=s),at=s,An(),ot({storyId:e.id,question:s,response:"followup"}),(p=o.querySelector("#comp-more"))==null||p.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(f=>{f.disabled=!1,f.classList.remove("correct")})}),(i=o.querySelector("#comp-skip"))==null||i.addEventListener("click",()=>{ot({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function ir(){try{const e=fn(Y);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function lr(){var a,l;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=fn(Y),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=i=>String(i??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const i of e.roster)s.has(i.band)||s.set(i.band,[]),s.get(i.band).push(i);const o=Array.from(s.entries()).sort((i,c)=>String(i[0]).localeCompare(String(c[0]))).map(([i,c])=>{const p=c.filter(d=>d.unlocked).length,f=c.map(d=>`
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
          <h3 class="sf-band__title">Band ${n(i)} <small>${p}/${c.length} met</small></h3>
          <div class="sf-grid">${f}</div>
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
    </div>`,document.body.appendChild(t),Oe.open("modal-story-friends"),(l=t.querySelector("[data-close]"))==null||l.addEventListener("click",()=>{Oe.close("modal-story-friends"),t.remove()}),t.addEventListener("click",i=>{i.target===t&&(Oe.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(i=>{i.addEventListener("click",()=>{const c=i.dataset.storyId;c&&(Oe.close("modal-story-friends"),t.remove(),xt(c))})})}function It(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function cr(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(l){if(t.hidden=l!=="idle",n.hidden=l!=="recording",s.hidden=l!=="recorded"&&l!=="playing",o.hidden=l!=="recorded"&&l!=="playing",r)switch(l){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}s&&(s.textContent=l==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await gn({storyId:e.id,onStateChange:a})||a("error")}),n.addEventListener("click",()=>{ze()}),s.addEventListener("click",()=>{yn()==="playing"?(Je(),a("recorded")):bn()}),o.addEventListener("click",()=>{dt(),a("idle")})}function dr(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const l=e.lines.map((f,d)=>({...f,idx:d})).filter(f=>f.type!=="label"&&f.type!=="chapter"&&f.text);let i=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(f=>f.classList.remove("sline--echo-active")),i=-1}function p(f){var v,b;i=f;const d=l[f];if(!d){c();return}d.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(y=>y.classList.remove("sline--echo-active"));const u=w==null?void 0:w.querySelector(`[data-line="${d.idx}"]`);u&&(u.classList.add("sline--echo-active"),u.scrollIntoView({behavior:J(),block:"nearest"})),a&&(a.textContent=`Line ${f+1} of ${l.length}`,a.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const h=new SpeechSynthesisUtterance(d.text);h.rate=.82,Wn(h),h.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${f+1}`)},h.onerror=()=>{s.hidden=!1},(v=window.speechSynthesis)==null||v.cancel(),(b=window.speechSynthesis)==null||b.speak(h)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,p(0)}),s.addEventListener("click",async()=>{if(yn()==="recording"){ze();return}const f=l[i];!await gn({storyId:e.id,lineIdx:f==null?void 0:f.idx,onStateChange:u=>{u==="recording"?(s.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):u==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=i>=l.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):u==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{bn()}),n.addEventListener("click",()=>{dt(),o.hidden=!0,i+1<l.length?p(i+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{R(),ze(),dt(),c()})}function ur(){De||(De=!0,qe=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,Fe=setInterval(()=>{const e=Math.floor((Date.now()-qe)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}const Fn=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function mt(e,t){var i;if(!De&&Fe===null)return;clearInterval(Fe),Fe=null,De=!1;const n=document.getElementById("btn-fluency-start"),s=document.getElementById("btn-fluency-done");if(n&&(n.disabled=!1),s&&(s.disabled=!0),!e||!qe)return;const o=(Date.now()-qe)/1e3;qe=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;Pe=o,r&&(r.hidden=!0),a.hidden=!1;const l=document.getElementById("fluency-time");l&&(l.textContent=`${e} words in ${Fn(o)}.`),(i=a.querySelector('input[name="errors"]'))==null||i.focus({preventScroll:!0})}function pr(e,t){var o;const n=document.getElementById("fluency-form"),s=document.getElementById("fluency-result");!n||!s||(n.addEventListener("submit",r=>{var h,v,b;r.preventDefault();const a=((h=n.querySelector('input[name="errors"]'))==null?void 0:h.value)??"",l=a===""?null:Number(a),i=((v=n.querySelector('input[name="support"]:checked'))==null?void 0:v.value)??null,{wpm:c,wcpm:p,accuracy:f}=uo(e,Pe,l);So({storyId:t.id,wpm:c,wcpm:p,errors:l,accuracy:f,support:i,durationSec:Pe,wordCount:e});const d=po({wpm:c,wcpm:p,primaryGrade:((b=Dn())==null?void 0:b.primaryGrade)??null});n.hidden=!0,n.reset(),s.hidden=!1,s.innerHTML=T`
      <div class="fluency-result-inner">
        <span class="fluency-time">${Fn(Pe)}</span>
        <span class="fluency-wcpm">${d.headline}</span>
        ${f!=null?T`<span class="fluency-acc">${f}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${d.detail}</p>
      ${d.reference?T`<p class="fluency-reference">${d.reference}</p>`:""}
    `;const u=document.getElementById("story-quest-cta");u&&(u.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{n.hidden=!0,n.reset(),s.hidden=!1,s.textContent="Not saved."}))}export{Hn as _highlightGraphemes,Io as _isMeetWordsCompletedToday,ot as _logComprehensionAttempt,zt as _setMeetWordsCompleted,vr as cleanupStoryMode,yr as initStoryMode,wr as showBrowser};
