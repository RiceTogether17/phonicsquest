import{S as Z,B as z}from"./stories-Cton5YYn.js";import{q as T,s as me,W as ht,X as Wn,Y as ze,Z as jt,C as zt,o as Fn,_ as Me,$ as Pn,a0 as K,M as Dt,b as Gn,a1 as Fe,a2 as jn,a3 as zn}from"./index-C3Wc_ho5.js";import{P as Dn,s as Yt,a as ft}from"./decodability-HWNNZ063.js";import"./gsap-C8pce-KX.js";const Yn=/(\s+|["“”'',.!?;:()-]+)/;function Ut(e){return String(e??"").split(Yn).filter(t=>t.length>0).map(t=>({text:t,type:/^\s+$/.test(t)?"space":/^[^a-zA-Z0-9]+$/.test(t)?"punct":"word"}))}const Un=new Set(`a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just some any true false story about also`.split(/\s+/));function Kn(e){let t=e.toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");/[^aeiou]ies$/.test(t)?t=`${t.slice(0,-3)}y`:/(ss|sh|ch|x|z)es$/.test(t)?t=t.slice(0,-2):(/[^s]es$/.test(t)||/[^su]s$/.test(t))&&(t=t.slice(0,-1));let n=!1;return/.{3,}ing$/.test(t)?(t=t.slice(0,-3),n=!0):(/.{3,}ed$/.test(t)||/.{3,}ly$/.test(t))&&(t=t.slice(0,-2),n=!0),n&&(t=t.replace(/([bdgmnprt])\1$/,"$1")),t}function Ze(e){return new Set(String(e??"").split(/[\s\-—–/]+/).map(t=>t.toLowerCase().replace(/[^a-z']/g,"")).filter(t=>t.length>1&&!Un.has(t)).map(Kn).filter(t=>t.length>1))}function Vn(e){const t=[];return((e==null?void 0:e.lines)??[]).forEach((n,s)=>{if(n.type==="label"||n.type==="chapter"||!n.text)return;const o=Ut(n.text);let r=-1,a=null,l=[];const i=()=>{a!==null&&(t.push({line:s,from:a,to:r,text:l.join("").trim()}),a=null,l=[])};for(const c of o)c.type==="word"&&(r+=1,a===null&&(a=r)),a!==null&&l.push(c.text),c.type==="punct"&&/[.!?]/.test(c.text)&&i();i()}),t}const Jn=3;function Kt(e,t,n=""){const s=Ze(`${t} ${n}`),o=Ze(n);if(!s.size)return null;let r=null,a=0;for(const l of Vn(e)){const i=Ze(l.text);let c=0;for(const p of s)i.has(p)&&(c+=(p.length>3?2:1)*(o.has(p)?3:1));(c>a||c===a&&c>0&&r&&l.text.length<r.text.length)&&(r=l,a=c)}return a>=Jn?r:null}function Qn(e,t){var s;if(!(t!=null&&t.q))return null;const n=((s=t.options)==null?void 0:s[t.answer])??"";return Kt(e,t.q,n)}function Xn(e,t,n){var d;if(!((d=t.comprehension)!=null&&d.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,firstTry:0,withClue:0,hadClue:!1,clue:null,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return r();case"comprehension":return a();case"vocab":return c();case"openEnded":return i();case"grammar":return p();case"done":return h()}}function r(){var u,f,k,b;e.innerHTML=`
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
    `,(k=document.getElementById("sq-start"))==null||k.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(b=document.getElementById("sq-skip"))==null||b.addEventListener("click",()=>n==null?void 0:n())}function a(){const u=t.comprehension[s.qIndex],f=s.qIndex+1,k=s.total;s.clue=Qn(t,u),s.hadClue=!1,e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${f/k*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${f} of ${k}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${u.q}</p>
          ${u.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${u.options.map((b,w)=>`
            <button class="sq-option" data-idx="${w}" aria-label="${b}">
              <span class="sq-option-letter">${String.fromCharCode(65+w)}</span>
              <span class="sq-option-text">${b}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(b=>{b.addEventListener("click",()=>l(b,u))})}function l(u,f){const k=parseInt(u.dataset.idx,10),b=k===f.answer,w=document.getElementById("sq-feedback"),L=s.clue;if(!b&&!s.hadClue&&L){s.hadClue=!0,u.disabled=!0,u.classList.add("sq-option--wrong"),w&&(w.hidden=!1,w.className="sq-feedback sq-feedback--retry",w.innerHTML=T`Not quite. The story says:
          <q class="sq-clue">${L.text}</q> Have another go.`);return}b&&(s.hadClue?s.withClue++:s.firstTry++,s.correct++),document.querySelectorAll(".sq-option").forEach((m,g)=>{m.disabled=!0,g===f.answer&&m.classList.add("sq-option--correct"),g===k&&!b&&m.classList.add("sq-option--wrong")}),w&&(w.hidden=!1,w.className=`sq-feedback ${b?"sq-feedback--correct":"sq-feedback--wrong"}`,b?w.textContent=s.hadClue?"✅ You found it!":"✅ Great thinking!":w.innerHTML=L?T`The answer is <strong>${f.options[f.answer]}</strong>. The story says:
              <q class="sq-clue">${L.text}</q>`:T`The answer is <strong>${f.options[f.answer]}</strong>.`);const _=document.getElementById("sq-next");_&&(_.hidden=!1,_.addEventListener("click",()=>{var m,g,$;s.qIndex++,s.qIndex<s.total||(s.phase=(m=t.openEnded)!=null&&m.length?"openEnded":(g=t.vocab)!=null&&g.length?"vocab":($=t.grammarSpotlight)!=null&&$.length?"grammar":"done",s.vocabIndex=0),o()}))}function i(){var f,k,b;const u=t.openEnded||[];if(!u.length){s.phase=(f=t.vocab)!=null&&f.length?"vocab":(k=t.grammarSpotlight)!=null&&k.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${u.map((w,L)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${L+1}. ${w.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${w.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${w.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(b=document.getElementById("sq-open-next"))==null||b.addEventListener("click",()=>{var w,L;s.phase=(w=t.vocab)!=null&&w.length?"vocab":(L=t.grammarSpotlight)!=null&&L.length?"grammar":"done",o()})}function c(){var L,_,m;const u=t.vocab[s.vocabIndex],f=t.vocab.length,k=s.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${k} of ${f}</p>

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
              ${k<f?"Next word →":"Done with words!"}
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
    `;const b=document.getElementById("sq-flip-card"),w=()=>{s.flipped=!0,o()};b==null||b.addEventListener("click",w),b==null||b.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&w()}),(L=document.getElementById("sq-flip-btn"))==null||L.addEventListener("click",w),(_=document.getElementById("sq-vocab-next"))==null||_.addEventListener("click",()=>{var g;s.vocabIndex++,s.flipped=!1,s.vocabIndex<f||(s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done"),o()}),(m=document.getElementById("sq-vocab-skip"))==null||m.addEventListener("click",()=>{var g;s.phase=(g=t.grammarSpotlight)!=null&&g.length?"grammar":"done",o()})}function p(){var k;const f=(t.grammarSpotlight??[]).map((b,w)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${w+1}</div>
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
    `,(k=document.getElementById("sq-grammar-done"))==null||k.addEventListener("click",()=>{s.phase="done",o()})}function h(){var _;const u=s.total>0?Math.round(s.correct/s.total*100):100,f=u>=80?3:u>=50?2:1,k="⭐".repeat(f)+"☆".repeat(3-f),b=s.correct*15+(u===100?25:0),w=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],L=f===3?w[2]:f===2?w[1]:w[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${k}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${L}</p>
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
    `,(_=document.getElementById("sq-back"))==null||_.addEventListener("click",()=>n==null?void 0:n())}o()}function Zn(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let r=0;r<=n;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(s++,o=!0):a&&(o=!1)}return s<0?-1:s}function es(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function ts(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let we=null;function Vt(){if(we)return we;we=new Map;for(const e of ht)e!=null&&e.word&&we.set(e.word.toLowerCase(),e);return we}function ns(e){const t=ts(e),n=Vt(),s=t?n.get(t):null;if(s){const o=me.get("wordStats")||{},r=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function Jt(e){return!e||typeof e!="string"||!(Vt().has(e)||ht.some(s=>(s==null?void 0:s.id)===e))?!1:(me.recordWordAttempt(e,!0,Wn.EXPOSURE),!0)}const ss=.62,os=.4,At=2;function Ct(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function rs(e,t,n=(s,o)=>ze.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(h=>({word:h,status:"miss",heard:null}));const r=-.4,a=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let h=1;h<=s;h++)a[h][0]=h*r;for(let h=1;h<=o;h++)a[0][h]=h*r;const l=Array.from({length:s},(h,d)=>Array.from({length:o},(u,f)=>n(e[d],t[f])));for(let h=1;h<=s;h++)for(let d=1;d<=o;d++){const u=l[h-1][d-1]-.5;a[h][d]=Math.max(a[h-1][d-1]+u,a[h-1][d]+r,a[h][d-1]+r)}const i=new Array(s);let c=s,p=o;for(;c>0;){const h=p>0?l[c-1][p-1]-.5:-1/0;if(p>0&&a[c][p]===a[c-1][p-1]+h){const d=l[c-1][p-1],u=e[c-1];let f;d>=ss?f="match":d>=os||u.length<=At?f="unsure":f="miss",i[c-1]={word:u,status:f,heard:t[p-1]},c--,p--}else if(p>0&&a[c][p]===a[c][p-1]+r)p--;else{const d=e[c-1];i[c-1]={word:d,status:d.length<=At?"unsure":"miss",heard:null},c--}}return i}function as(e,t,n){const s=Ct(e);let o=null;for(const r of t||[]){const a=rs(s,Ct(r.text),n),l=a.filter(i=>i.status==="match").length;(!o||l>o.matchCount)&&(o={words:a,matchCount:l,total:s.length})}return o||{words:s.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:s.length}}function is(){return ze.supported}async function ls(e){const t=await ze.listenTranscript({timeoutMs:12e3});return t?as(e,t.transcripts):null}function cs(){ze.stop()}const ve=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function ds(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const us=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function Ae(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function ps(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:r}){var _t,It,Rt;const a=[...e.querySelectorAll(s)];let l=[],i=0,c=0;const p=document.createElement("div");p.className=`ruler-layer ruler-layer--${t}`,p.setAttribute("aria-hidden","true"),p.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(p);const h=()=>{const v=a[i]??a[0]??e;return parseFloat(getComputedStyle(v).fontSize)||20},d=v=>p.querySelector(v),u=d(".ruler-veil--above"),f=d(".ruler-veil--below"),k=d(".ruler-strip"),b=d(".ruler-word"),w=d(".ruler-bar");function L(){const v=e.getBoundingClientRect();l=ds(a.map(E=>{const q=E.getBoundingClientRect();return q.width||q.height?{top:q.top-v.top,bottom:q.bottom-v.top}:null}))}const _=v=>{const E=l.findIndex(q=>v>=q.first&&v<=q.last);return E<0?0:E};function m(){const v=l[c];if(!v)return;const E=h(),q=E*.6,C=v.bottom+E*.18,M=Math.max(12,E*.55),G=e.scrollHeight;u.style.height=`${Math.max(0,v.top-q)}px`,f.style.top=`${C+M}px`,f.style.height=`${Math.max(0,G-C-M)}px`,k.style.top=`${v.top-q}px`,k.style.height=`${C-(v.top-q)}px`,w.style.top=`${C}px`,w.style.height=`${M}px`;const te=a[i];if(t==="word"&&te){const ne=e.getBoundingClientRect(),J=te.getBoundingClientRect();b.style.left=`${J.left-ne.left-3}px`,b.style.width=`${J.width+6}px`,b.style.top=`${J.top-ne.top-2}px`,b.style.height=`${J.height+4}px`,w.style.setProperty("--x",`${J.left-ne.left+J.width/2}px`)}a.forEach((ne,J)=>ne.classList.toggle("is-pointed",t==="word"&&J===i))}function g(){r==null||r({word:i,line:c,lines:l.length,words:a.length,atEnd:t==="word"?i>=a.length-1:c>=l.length-1})}function $(){const v=l[c];if(!v)return;const E=e.getBoundingClientRect(),q=h(),C=E.top+v.top-q*.6,M=E.top+v.bottom+q*1.2,G=o();if(C>=G.top&&M<=G.bottom)return;const te=G.top+(G.bottom-G.top)*.28,ne={top:C-te,behavior:us()?"auto":"smooth"};(Ae(e)??window).scrollBy(ne)}function I(v,{scroll:E=!0}={}){var q;c=Math.max(0,Math.min(l.length-1,v)),i=((q=l[c])==null?void 0:q.first)??0,m(),g(),E&&$()}function P(v,{scroll:E=!0}={}){i=Math.max(0,Math.min(a.length-1,v)),c=_(i),m(),g(),E&&$()}function ie(v){const E=v-e.getBoundingClientRect().top;let q=0,C=1/0;return l.forEach((M,G)=>{const te=E<M.top?M.top-E:E>M.bottom?E-M.bottom:0;te<C&&(C=te,q=G)}),q}let le=!1;w.addEventListener("pointerdown",v=>{var E;le=!0,(E=w.setPointerCapture)==null||E.call(w,v.pointerId),p.classList.add("is-dragging"),v.preventDefault()}),w.addEventListener("pointermove",v=>{if(!le)return;const E=h(),q=ie(v.clientY-E*.6);q!==c&&I(q,{scroll:!1})});const qt=()=>{le&&(le=!1,p.classList.remove("is-dragging"),$())};w.addEventListener("pointerup",qt),w.addEventListener("pointercancel",qt);let Xe=0;const Tt=()=>{cancelAnimationFrame(Xe),Xe=requestAnimationFrame(()=>{var v;L(),c=_(i),t!=="word"&&(i=((v=l[c])==null?void 0:v.first)??i),p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>p.classList.remove("no-anim"))})},ce=typeof ResizeObserver=="function"?new ResizeObserver(Tt):null;if(ce==null||ce.observe(e),(It=(_t=document.fonts)==null?void 0:_t.ready)==null||It.then(Tt).catch(()=>{}),L(),n==null){const v=o(),E=e.getBoundingClientRect().top,q=l.findIndex(C=>E+C.top>=v.top);c=Math.max(0,q),i=((Rt=l[c])==null?void 0:Rt.first)??0}else i=Math.max(0,Math.min(a.length-1,n)),c=_(i);return p.classList.add("no-anim"),m(),g(),requestAnimationFrame(()=>{p.classList.remove("no-anim"),n!=null&&$()}),{next(){t==="word"?P(i+1):I(c+1)},prev(){t==="word"?P(i-1):I(c-1)},nextLine:()=>I(c+1),prevLine:()=>I(c-1),tap(v,E){const q=E?a.indexOf(E):-1;q>=0?t==="word"?P(q,{scroll:!1}):I(_(q),{scroll:!1}):I(ie(v),{scroll:!1})},follow(v){const E=a.indexOf(v);E<0||(t==="word"?E!==i&&P(E):_(E)!==c&&I(_(E)))},reveal:$,current:()=>a[i]??null,goTo(v){t==="word"?P(v):I(_(Math.max(0,Math.min(a.length-1,v))))},destroy(){ce==null||ce.disconnect(),cancelAnimationFrame(Xe),a.forEach(v=>v.classList.remove("is-pointed")),e.classList.remove("has-ruler"),p.remove()}}}const hs="giri_story_place",fs=40,ms=30,Qt=8,Xt=()=>jt(hs);function mt(){try{const e=localStorage.getItem(Xt()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function rt(e){try{localStorage.setItem(Xt(),JSON.stringify(e))}catch{}}function gs(e,t=Date.now()){const n=t-ms*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(s.slice(0,fs))}function Zt(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=mt();if(t<Qt){if(!(e in s))return;delete s[e],rt(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},rt(gs(s,n))}function bs(e){const t=mt()[e];return t&&typeof t.word=="number"&&t.word>=Qt?t.word:null}function gt(e){const t=mt();e in t&&(delete t[e],rt(t))}function Bt(e){const t=me.get("groupMastery")||{},n=zt.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function et(e){const t=me.get("groupMastery")||{};return zt.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function en(){const e=Bt([1,2,3,4,5]),t=et([6]),n=Bt([6])>=.5,s=et([8]),o=et([7]),r=e>=.6||t,a=r&&(n||s),l=a&&o;return{A:{ready:!0,hint:""},B:{ready:r,hint:r?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:a,hint:a?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:l,hint:l?"":"Best after starting Phase 7 — Diphthongs"}}}function ys(e,t){const n=en();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return s}return"A"}const ge=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),ws=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...ge[e]}))),bt=new Set(["short","long","schwa","rcontrolled","diphthong"]),vs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),De="bcdfghjklmnpqrstvwxyz",ks=new RegExp(`[${De}]a$`),Ss=new RegExp("[bcdfghjkmnprstvz]al$"),tn=/[ts]ion$/;function nn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(vs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&ks.test(e)&&t.add(e.length-1),e.length>=4&&Ss.test(e)&&t.add(e.length-2),e.length>=5&&tn.test(e)&&t.add(e.length-3)),t.size?t:null}const $s=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),Es=new RegExp(`[${De}]e$`);function sn(e){const t=new Set,n=e.length;if(n>=5&&tn.test(e)&&t.add(n-2),n>=4&&Es.test(e)&&!$s.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];De.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const xs=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Ls=new Set(["been"]),qs=new Set(["friend","friends"]),Ts=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),_s=["ing","ed","ly","es","s","n"];function He(e,t){if(e.has(t))return!0;for(const n of _s)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function ke(e,t,n,s,o,r){return bt.has(s)?r!=null&&r.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&He(xs,e)||t==="ee"&&He(Ls,e)||t==="ie"&&He(qs,e)?"short":t==="ow"&&He(Ts,e)?"long":s:s}const S=null,on=new Map([["have",[S,"short",S,"silent"]],["love",[S,"short",S,"silent"]],["come",[S,"short",S,"silent"]],["some",[S,"short",S,"silent"]],["done",[S,"short",S,"silent"]],["gone",[S,"short",S,"silent"]],["none",[S,"short",S,"silent"]],["give",[S,"short",S,"silent"]],["live",[S,"short",S,"silent"]],["one",["short",S,"silent"]],["were",[S,"rcontrolled","rcontrolled","silent"]],["here",[S,"rcontrolled","rcontrolled","silent"]],["where",[S,S,"rcontrolled","rcontrolled","silent"]],["there",[S,S,"rcontrolled","rcontrolled","silent"]],["above",["schwa",S,"short",S,"silent"]],["become",[S,"short",S,"short",S,"silent"]],["people",[S,"long","silent",S,S,"silent"]],["again",["schwa",S,"long","long",S]],["said",[S,"short","short",S]],["says",[S,"short","short",S]]]),Is=new Map(ht.map(e=>[e.word.toLowerCase(),e])),rn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function Rs(e){return rn[e]??"consonant"}function an(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=nn(s),r=sn(s),a=on.get(s),l=[];let i=0;for(let c=0;c<t.length;c++){const p=t[c]||"",h=p.length||1;let d=Rs(n[c]);bt.has(d)&&(d=(a==null?void 0:a[i])??ke(s,p,i,d,o,r)),l.push(d),i+=h}return l}const As="aeiou",Cs="bcdfghjklmnpqrstvwxyz",Mt=e=>As.includes(e),Bs=e=>Cs.includes(e),ln=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Ms=Object.keys(ln).sort((e,t)=>t.length-e.length);function Hs(e,t,n){const s=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&Mt(e[r])&&Bs(e[r+1])&&e[r+2]==="e"){s.push({len:1,sound:ke(e,e[r],r,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let a=!1;for(const l of Ms)if(e.startsWith(l,r)){s.push({len:l.length,sound:ke(e,l,r,ln[l],t,n)}),r+=l.length,a=!0;break}if(!a){if(Mt(e[r])||e[r]==="y"&&r>0){const l=r===o-1?"long":"short";s.push({len:1,sound:ke(e,e[r],r,l,t,n)}),r+=1;continue}s.push({len:1,sound:null}),r+=1}}return s}function Ns(e,t,n,s){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const l=e.graphemes[a],i=l.length;if(i===2&&l[1]==="e"&&De.includes(l[0])&&r+2===t.length&&(s!=null&&s.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=rn[e.types[a]]??null;!bt.has(c)&&c!=="silent"&&(c=null),c=ke(t,l,r,c,n,s),o.push({len:i,sound:c}),r+=i}return o}function cn(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Dn.has(t))return null;const n=on.get(t);if(n){const l=[];for(const i of n){const c=l[l.length-1];c&&c.sound===i?c.len+=1:l.push({len:1,sound:i})}return l}const s=nn(t),o=sn(t),r=Is.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?Ns(r,t,s,o):Hs(t,s,o)}function Os(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const n=cn(t);if(!n)return t;let s="",o=0;for(const{len:a,sound:l}of n){const i=t.slice(o,o+a);if(o+=a,!l){s+=i;continue}const c=(r=ge[l])==null?void 0:r.cue;s+=`<span class="vs vs--${l}"${c?` data-cue="${c}"`:""}>${i}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function Ws(e,t){const n=[];let s="",o="";return e.forEach((r,a)=>{const l=r.replace(/^-/,"");if(t[a]==="silent"){o+=l;return}s+=o+l,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Fs(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Ps(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:r,extraActions:a=""}){const l=an(t,n,s),i=Ws(n,l),c=l.includes("silent");let p=0;const h=n.map((m,g)=>{const $=ge[l[g]]??ge.consonant;return T`<button
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
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${h}</div>
      ${c?T`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${Fn(a)}
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
  `;const d=m=>e.querySelector(m),u=d(".bl-steps"),f=d(".bl-next"),k=d(".bl-again"),b=d(".bl-say"),w=[...e.querySelectorAll(".bl-tile")];function L(){u.innerHTML=T`${i.slice(0,p).map((g,$)=>T`<li class="${$===p-1?"is-new":""}">${g}</li>`)}`,w.forEach(g=>{const $=Number(g.dataset.idx),I=l.slice(0,$+1).filter(ie=>ie!=="silent").length-1,P=l[$]==="silent"?p>=i.length:I>-1&&I<p;g.classList.toggle("is-lit",P),g.classList.toggle("is-current",l[$]!=="silent"&&I===p-1)});const m=p>=i.length;f.hidden=m,k.hidden=!m,b.textContent=m?"🔊 Hear the word":"🔊 Just hear the word",b.classList.toggle("bl-say--escape",!m),m&&i.length&&u.insertAdjacentHTML("beforeend",String(T`<li class="bl-done">
          Say the word. Tap 🔊 to check. Then read its sentence again — does it make sense?
        </li>`))}function _(){if(p>=i.length)return;const m=Fs(l,p);p+=1,L(),m>=0&&Promise.resolve(o(n[m],s[m],{word:t,index:m})).catch(()=>{})}return f.addEventListener("click",_),k.addEventListener("click",()=>{p=0,L(),f.focus({preventScroll:!0})}),b.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),w.forEach(m=>m.addEventListener("click",async()=>{const g=Number(m.dataset.idx);if(l[g]!=="silent"){m.classList.add("is-tapped"),setTimeout(()=>m.classList.remove("is-tapped"),300);try{await o(n[g],s[g],{word:t,index:g})}catch{}}})),L(),{destroy(){e.innerHTML=""}}}const Gs=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),js=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),zs=3,Ds=e=>/[aeiouy]/.test(e);function at(e,t,n){const s=[];let o=0;for(;o<e.length;){let r=Gs.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(r=null),r?(s.push(r),o+=r.length):(s.push(e[o]),o+=1)}return s}function Ys(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){n.push("qu"),s.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function Us(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const Ks=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function Vs(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of js){const p=c.slice(1),h=n.slice(0,-p.length);if(n.endsWith(p)&&h.length>=zs&&Ds(h)){s=c,n=h;break}}const r=cn(n);if(!r)return null;const a=[],l=[];let i=0;for(const{len:c,sound:p}of Us(r)){const h=n.slice(i,i+c);if(p)a.push(h),l.push(Ks[p]??"sv");else for(const d of at(h,n,i))a.push(d),l.push("c");i+=c}if(i<n.length)for(const c of at(n.slice(i),n,i))a.push(c),l.push("c");return o&&(a.push("s"),l.push("c")),s&&(a.push(s),l.push("sf")),a.length?Ys(a,l):null}function Js(e,t){const n=[],s=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){n.push(o),s.push(t[r]);return}const a=String(o).toLowerCase();for(const l of at(a,a,0))n.push(l),s.push("c")}),{graphemes:n,types:s}}const Qs=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),Xs=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function Zs(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function eo(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function to(e,t,n=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const s=t/60,o=Math.round(e/s);if(n==null||Number.isNaN(n))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(n)));return{wpm:o,wcpm:Math.round((e-r)/s),accuracy:Math.round((e-r)/e*100)}}function no({wpm:e,wcpm:t=null,primaryGrade:n=null,now:s=new Date}){var c,p;const o=eo(n),r=Zs(s),a=o?(c=Qs[o])==null?void 0:c[r]:null,l=o?(p=Xs[o])==null?void 0:p[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const i=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:i}:l!=null&&t>=l?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:i}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:i}}const so="giri_friends_unlocked";function dn(){return jt(so)}const oo=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function ro(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function un(e){if(!e||!e.id)return null;const t=oo[e.id]||ro(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function yt(){try{const e=localStorage.getItem(dn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function ao(e){try{localStorage.setItem(dn(),JSON.stringify(Array.from(e)))}catch{}}function io(e){if(!e||typeof e!="string")return!1;const t=yt();return t.has(e)?!1:(t.add(e),ao(t),!0)}function lo(e){return yt().has(e)}function co(e){const t=yt();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=un(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function pn(e){const t=co(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const hn="giri_fluency_history",Ht=5,re=new Map,uo=10;function po(e,t){for(re.set(e,t);re.size>uo;){const n=re.keys().next().value;re.delete(n)}}let he=null,H=null,tt=[],fe=null,Se=null,Ye="idle",N=null;async function fn({storyId:e,lineIdx:t,onStateChange:n}={}){if(Ye==="recording")return!1;Se=n??null,tt=[];try{he=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return D("error"),!1}const s=mo();try{H=new MediaRecorder(he,s?{mimeType:s}:{})}catch{H=new MediaRecorder(he)}return H.ondataavailable=o=>{o.data.size>0&&tt.push(o.data)},H.onstop=()=>{const o=new Blob(tt,{type:H.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;fe=r,po(r,o),lt(),D("recorded")},H.onerror=()=>{lt(),D("error")},H.start(),D("recording"),!0}function Pe(){H&&H.state==="recording"?H.stop():lt()}function mn(e){const t=fe,n=t?re.get(t):null;return n?new Promise(s=>{Ue();const o=URL.createObjectURL(n);N=new Audio(o),D("playing"),N.onended=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.onerror=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.play().catch(()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()})}):Promise.resolve()}function Ue(){N&&(N.pause(),N=null)}function it(e){const t=fe;t&&re.delete(t),t===fe&&(fe=null),Ue(),D("idle")}function gn(){return Ye}function bn(){Pe(),Ue(),re.clear(),fe=null,Ye="idle",Se=null}function ho(e){const t=yn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>Ht&&n.splice(0,n.length-Ht),t[e.storyId]=n,go(t)}function fo(e){return yn()[e]??[]}function D(e){Ye=e,Se==null||Se(e)}function lt(){he&&(he.getTracks().forEach(e=>e.stop()),he=null)}function mo(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function yn(){try{return JSON.parse(localStorage.getItem(hn)??"{}")}catch{return{}}}let Nt=!1;function go(e){try{localStorage.setItem(hn,JSON.stringify(e))}catch{if(Nt)return;Nt=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const wn="/phonicsquest/";let y=null,j="A",Ot=!1,de="band",Ce=!1,vn=0,ee=0,B=null,O=null,$e=null,pe=null,R=null,F="word",qe=!1,be=-1,Be=[],Ee=0,Ke=[],Ve=0,Te=0;const kn="giri_stories_read";function Y(){try{return JSON.parse(localStorage.getItem(kn)??"[]")}catch{return[]}}function wt(e){const t=Y();t.includes(e)||(t.push(e),localStorage.setItem(kn,JSON.stringify(t))),gt(e),io(e)}let Ne=null,xe=null,Ge=!1,Oe=0;const Sn="giri_show_graphemes",$n="giri_show_ruler",En="giri_ruler_mode",vt="giri_follow_mode",xn="giri_meet_words",Wt="giri_comp_log";let ue=Je(Sn,!0),se=Je($n,!1),x=null,Q=null,ct=Je(En,"line"),oe=null,_e=0,W=null;F=Je(vt,"word");function Je(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function Le(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const Ln=new Set;function qn(){return new Date().toISOString().slice(0,10)}function Tn(){try{const e=localStorage.getItem(xn);return e?JSON.parse(e):{}}catch{return{}}}function bo(e){try{localStorage.setItem(xn,JSON.stringify(e))}catch{}}function yo(e){return Ln.has(e)?!0:Tn()[e]===qn()}function Ft(e){Ln.add(e);const t=Tn();t[e]=qn();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];bo(t)}const Pt=new Set,wo=100;function nt(e){try{const t=localStorage.getItem(Wt),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>wo;)n.shift();localStorage.setItem(Wt,JSON.stringify(n))}catch{}}function rr(e,t){y=e}function ar(){A(),ye()}function ir(){A(),U({restoreFocus:!1}),pt(),bn(),St()}function ye(){var n,s,o;Ie(),U({restoreFocus:!1}),In(),R=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${de==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${de==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${de==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Vo()}</button>
    </div>
  `;let t;if(de==="band"){if(!Ot){Ot=!0;try{const u={};for(const f of Z)(u[n=f.band]??(u[n]=[])).push(f);j=ys(Y(),u)||j}catch{}}const r=z.find(u=>u.band===j)??z[0],a=Z.filter(u=>u.band===j&&u.category!=="chapter"&&u.category!=="nonfiction-sg"),l=Y(),i=a.filter(u=>l.includes(u.id)).length,c=en(),p=z.map(u=>{var f,k,b;return`
      <button
        class="story-tab${u.band===j?" active":""}${(f=c[u.band])!=null&&f.ready?"":" story-tab--not-ready"}"
        data-band="${u.band}"
        style="--tab-color:${u.color}"
        ${(k=c[u.band])!=null&&k.ready?"":`title="${c[u.band].hint}"`}
      >
        <span class="story-tab-num">${u.band}</span>
        <span class="story-tab-name">${u.label}</span>
        ${(b=c[u.band])!=null&&b.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),h=a.map(u=>st(u,r,!1,l.includes(u.id))).join(""),d=a.length?Math.round(i/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${p}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${j}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${i} of ${a.length} stories read">
          ${i}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${d}%"></span>
        </span>
      </div>
      ${(s=c[j])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[j].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${h}</div>
    `}else if(de==="singapore"){const r=Z.filter(i=>i.category==="nonfiction-sg"),a=Y();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(i=>{const c=z.find(p=>p.band===i.band)??z[0];return st(i,c,!1,a.includes(i.id))}).join("")}</div>
    `}else{const r=Z.filter(i=>i.category==="chapter").sort((i,c)=>(i.chapterNum??0)-(c.chapterNum??0)),a=Y();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(i=>{const c=z.find(p=>p.band===i.band)??z[0];return st(i,c,!0,a.includes(i.id))}).join("")}</div>
    `}y.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,y.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{de=r.dataset.cat,ye()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Jo()}),y.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{j=r.dataset.band,ye()})}),y.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>kt(r.dataset.storyId))})}function st(e,t,n=!1,s=!1){var l;const o=(l=e.comprehension)!=null&&l.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${wn}images/stories/${e.illustration}"
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
        ${Yt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const i=ft(e).length;return i?`<span class="story-card-support" data-support="independent">👀 ${i} new ${i===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function kt(e){const t=Z.find(n=>n.id===e);t&&(A(),oe=Y().includes(t.id)?null:bs(t.id),Re.clear(),vo(t))}function vo(e){var n;R=e;const t=z.find(s=>s.band===e.band)??z[(e.level??1)-1];y.innerHTML=`
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
        ${Yt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{A(),ye()}),ko(e)}function ko(e){yo(e.id)?ae(e):So(e)}function So(e){var h;const t=document.getElementById("story-dynamic");if(!t)return;Ie();const n=ft(e),s=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),o=(e.vocab??[]).filter(d=>s.includes(d.word.toLowerCase().split(/\s+/)[0]));if(!n.length&&!o.length){Ft(e.id),ae(e);return}const r=Math.min(3,n.length+o.length),a=new Set;t.innerHTML=T`
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
              ${n.map(({word:d,display:u,status:f})=>T`<button
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
  `;const l=document.getElementById("warm-up-progress"),i=document.getElementById("warm-up-go");function c(d){const u=d.dataset.tapId;a.has(u)||(a.add(u),d.setAttribute("data-tapped","true"),l&&(l.textContent=a.size>=r?"✓ Warmed up — start the story, or keep tapping":`${a.size} of ${r} tapped`),a.size>=r&&i&&(i.disabled=!1,i.focus({preventScroll:!0})))}t.querySelectorAll("[data-prep-word]").forEach(d=>{d.addEventListener("click",()=>{var u,f;(f=(u=K.speakSightWord(d.dataset.prepWord))==null?void 0:u.catch)==null||f.call(u,()=>{}),d.classList.add("story-prep-word--said"),setTimeout(()=>d.classList.remove("story-prep-word--said"),600),c(d)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",async()=>{Ho(d);try{await K.speakWord(d.dataset.word)}catch{}c(d)})});const p=()=>{Ft(e.id),ae(e)};(h=document.getElementById("warm-up-skip"))==null||h.addEventListener("click",p),i==null||i.addEventListener("click",p)}function We(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function ae(e){var c,p,h,d,u,f,k,b,w,L,_;const t=document.getElementById("story-dynamic");if(!t)return;Ie(),U({restoreFocus:!1});const n=e.lines.map((m,g)=>Co(m,g,!0,e)).join(""),s=!!((c=e.comprehension)!=null&&c.length),r=!!((p=e.talkAboutIt)!=null&&p.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(m=>`<li>${m}</li>`).join("")}
      </ul>
    </div>
  `:"",a=fo(e.id),l=a.length?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${a.slice().reverse().map(m=>{const g=new Date(m.date),$=`${g.getDate()}/${g.getMonth()+1}`,I=typeof m.wcpm=="number"&&m.errors!=null,P=I?m.wcpm:m.wpm??m.wcpm,ie=I?"correct/min":"words/min",le=m.support==="supported"?" · with help":"";return`<span class="fluency-history-item">${$}: <strong>${P}</strong> ${ie}${le}</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${ue}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
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

      ${ue?Ao():""}

      ${(()=>{const m=ft(e);return m.length?String(T`
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
                Time one read-aloud of the whole story (${We(e)} words).
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
                  <input type="number" name="errors" min="0" max="${We(e)}" inputmode="numeric" />
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
              <span class="rtg-label">${Pn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${is()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(m=>{m.addEventListener("click",()=>{F=m.dataset.follow,Le(vt,F),ae(e)})}),t.querySelectorAll(".wf-word").forEach(m=>{m.setAttribute("role","button"),m.setAttribute("tabindex","0");const g=$=>{const I=$t(m);I&&($.preventDefault(),x==null||x.tap($.clientY??0,m),Wo(I,m))};m.addEventListener("click",g),m.addEventListener("keydown",$=>{($.key==="Enter"||$.key===" ")&&g($)})}),(h=document.getElementById("btn-toggle-graphemes"))==null||h.addEventListener("click",()=>{ue=!ue,Le(Sn,ue),ae(e)}),(d=document.getElementById("btn-toggle-ruler"))==null||d.addEventListener("click",()=>{var m,g;se=!se,Le($n,se),(m=document.getElementById("btn-toggle-ruler"))==null||m.setAttribute("aria-pressed",String(se)),Ie(),se&&(ut(),(g=document.getElementById("btn-ruler-next"))==null||g.focus({preventScroll:!0}))}),se?requestAnimationFrame(()=>ut(oe)):oe!==null&&requestAnimationFrame(()=>dt(oe)),Eo(e),(u=document.getElementById("btn-resume-restart"))==null||u.addEventListener("click",m=>{var g;gt(e.id),oe=null,(g=m.currentTarget.closest(".story-resume"))==null||g.remove(),dt(0),x&&x.goTo(0)}),xo(),(f=document.getElementById("btn-story-play"))==null||f.addEventListener("click",()=>Et(e)),(k=document.getElementById("btn-story-stop"))==null||k.addEventListener("click",()=>A()),t.querySelectorAll(".story-prep-strip [data-prep-word]").forEach(m=>{m.addEventListener("click",()=>{var g,$;($=(g=K.speakSightWord(m.dataset.prepWord))==null?void 0:g.catch)==null||$.call(g,()=>{}),m.classList.add("story-prep-word--said"),setTimeout(()=>m.classList.remove("story-prep-word--said"),600)})}),(b=document.getElementById("btn-finish-story"))==null||b.addEventListener("click",m=>{var I;xt(e);const g=m.currentTarget;g.disabled=!0,g.textContent="✓ Read — well done!";const $=document.querySelector(".story-finish-note");$&&($.textContent=(I=e.comprehension)!=null&&I.length?"Now have a go at the questions.":"")});const i=We(e);(w=document.getElementById("btn-fluency-start"))==null||w.addEventListener("click",()=>Zo()),(L=document.getElementById("btn-fluency-done"))==null||L.addEventListener("click",()=>pt(i)),er(i,e),Qo(e),St(),To(e),Xo(e),(_=document.getElementById("btn-launch-quest"))==null||_.addEventListener("click",()=>{A(),pt(),bn(),wt(e.id),Xn(y,e,()=>{ye()})})}let ot="";function $o(e){_n();const t=y==null?void 0:y.querySelector(`#story-body [data-line="${e.line}"]`);if(!t)return;const n=[...t.querySelectorAll(".wf-word")].filter(s=>{const o=Number(s.dataset.wordIdx);return o>=e.from&&o<=e.to});n.length&&(n.forEach(s=>s.classList.add("is-clue")),x?x.follow(n[0]):n[0].scrollIntoView({behavior:V(),block:"center"}))}function _n(){y==null||y.querySelectorAll(".wf-word.is-clue").forEach(e=>e.classList.remove("is-clue"))}function dt(e){const t=y==null?void 0:y.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:V(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function Eo(e){In();const t=document.getElementById("story-body");if(!t)return;const n=Ae(t);n&&(W=n,W._pqPlaceHandler=()=>{clearTimeout(_e),_e=setTimeout(()=>{if(x||Y().includes(e.id))return;const s=t.getBoundingClientRect(),o=Rn();if(s.bottom<o.top||s.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(l=>l.getBoundingClientRect().top>=o.top);a>=0&&Zt(e.id,a)},500)},n.addEventListener("scroll",W._pqPlaceHandler,{passive:!0}))}function xo(){const e=document.getElementById("story-resume");if(!e)return;const t=Ae(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&s()};t==null||t.addEventListener("scroll",r,{passive:!0}),n=setTimeout(s,9e3)}function In(){clearTimeout(_e),W!=null&&W._pqPlaceHandler&&(W.removeEventListener("scroll",W._pqPlaceHandler),delete W._pqPlaceHandler),W=null}function Rn(){const e=document.getElementById("story-body"),t=e?Ae(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,a=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),l=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(l,r+120)}}function je(){return ve.find(e=>e.id===ct)??ve[1]}function Lo(){const e=je();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${Fe(e.label)}. Tap to change."
              title="${Fe(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${Dt(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function ut(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=Lo();const s=je(),o=n.querySelector(".ruler-pos small"),r=n.querySelector(".ruler-pos b"),a=n.querySelector("#btn-ruler-next"),l=n.querySelector("#btn-ruler-back");x=ps(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Rn,onMove(i){Q=i;const c=s.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${i.word+1} / ${i.words}`:`${i.line+1} / ${i.lines}`,l.disabled=c?i.word===0:i.line===0,a.textContent=i.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",i.atEnd),clearTimeout(_e),_e=setTimeout(()=>{Y().includes((R==null?void 0:R.id)??"")||Zt(R==null?void 0:R.id,i.word)},400)}}),l.addEventListener("click",()=>x==null?void 0:x.prev()),a.addEventListener("click",()=>{if(!(Q!=null&&Q.atEnd))return x==null?void 0:x.next();xt(R)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var p;const i=(Q==null?void 0:Q.word)??0,c=ve.indexOf(je());ct=ve[(c+1)%ve.length].id,Le(En,ct),Ie(),ut(i),(p=document.getElementById("btn-ruler-style"))==null||p.focus({preventScroll:!0})})}function Ie(){x==null||x.destroy(),x=null,Q=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function qo(e){var s,o,r,a;if(!x||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]")||(a=(r=e.target)==null?void 0:r.closest)!=null&&a.call(r,".word-panel"))return;const t=je().id==="word",n={ArrowDown:()=>x.nextLine(),ArrowUp:()=>x.prevLine(),ArrowRight:()=>t?x.next():x.nextLine(),ArrowLeft:()=>t?x.prev():x.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",qo);function To(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>_o(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>Io(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Bn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{St(),ae(e)})}function X(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function An(){const e=Be[be];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function _o(e){var n,s,o;if(F!=="word"){F="word",Le(vt,F),ae(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}A();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(qe=!0,Be=t,be=0,Ee=0,Ke=[],Ve=0,Te=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Cn(),X("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Cn(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=An();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:V()}))}async function Io(e){var p;const t=An(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map($t).filter(Boolean).join(" ");if(!o){Bn(e);return}n.disabled=!0,n.replaceChildren(zn("encourage"),document.createTextNode("Giri is listening…")),X("Go ahead — read the glowing line now.");const r=await ls(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!qe)return;if(!r){Ee++,Ee>=2?X("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):X("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Ee=0;const a=[];r.words.forEach((h,d)=>{const u=s[d];if(u)if(u.classList.remove("rtg-word--match","rtg-word--check"),h.status==="miss"){u.classList.add("rtg-word--check");const f=h.word.replace(/[^a-z]/g,"");f.length>2&&(a.push(f),Jt(f))}else u.classList.add("rtg-word--match")});const l=r.words.filter(h=>h.status!=="miss").length;Ve+=l,Te+=r.words.length,Ke.push(...a);const i=be>=Be.length-1;a.length>0?X(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${i?"finish up":"go on"}!`):X("⭐ Great — Giri heard every word!"),(p=document.getElementById("btn-rtg-listen"))==null||p.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=i?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Bn(e){var t,n;if(be>=Be.length-1){Ro(e);return}be++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),Cn(),X("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Ro(e){var l,i;const t=Te>0?Math.round(Ve/Te*100):0,n=[...new Set(Ke)],s={...me.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},me.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(l=document.getElementById("btn-rtg-next"))==null||l.setAttribute("hidden",""),(i=document.getElementById("btn-rtg-exit"))==null||i.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";X(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),wt(e.id),qe=!1}function St(){qe&&cs(),qe=!1,be=-1,Be=[],Ee=0,Ke=[],Ve=0,Te=0}function Mn(e){return!ue||!e?e:Os(e)}function Ao(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${ws.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Co(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${Dt(o)}</div>`;const r=s?Mn(o,s.targetGraphemes,s.band):o,a=n?Bo(o,s):r;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function Bo(e,t=null){if(!e)return"";const n=Ut(e);let s=0;return n.map(o=>{if(o.type==="word"){const r=t?Mn(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${Fe(o.text)}" aria-label="${Fe(o.text)}">${r}</span>`}return o.text}).join("")}function $t(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Mo(e,t,n=!0){var a;const s=n&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:Vs(t.word);if(!s)return!1;const{graphemes:o,types:r}=Js(s.graphemes,s.types);return Ps(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(l,i,c)=>K.speakPhoneme(l,i,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:l=>K.speakWord(l)}),!0}function Ho(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function No(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const r=n[s+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function Et(e,t=0){if(!window.speechSynthesis)return;A(),U({restoreFocus:!1}),R=e,Lt(!0),Ce=!0;const n=No(e),s=n.findIndex(o=>o.highlightIdx>=t);Hn(n,Math.max(0,s))}function Hn(e,t,n=ee){if(n!==ee||!Ce)return;if(t>=e.length){zo();return}const s=e[t];vn=s.highlightIdx,jo(s.highlightIdx);const o=new SpeechSynthesisUtterance(s.text);o.rate=.82,Nn(o);const r=s.text.startsWith("Puff")?600:380;F==="word"&&Oo(o,s.highlightIdx),o.onend=()=>{n===ee&&(Qe(),setTimeout(()=>Hn(e,t+1,n),r))},o.onerror=()=>{n===ee&&A()},window.speechSynthesis.speak(o)}function Oo(e,t){const n=y==null?void 0:y.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=ee,r=e.text||"";let a=!1,l=-1,i=[],c=!1;function p(f){if(o!==ee||f<0||f>=s.length||f===l)return;l=f,s.forEach(b=>b.classList.remove("wf-word--active"));const k=s[f];k.classList.add("wf-word--active"),x?x.follow(k):Go(k)}function h(){for(const f of i)clearTimeout(f);i=[]}function d(){var w;if(c)return;c=!0;const f=typeof e.rate=="number"&&e.rate>0?e.rate:.82,k=Array.from(s,$t);let b=0;for(let L=0;L<s.length;L++){const _=L,m=((w=k[L])==null?void 0:w.length)||3,g=Math.max(160,Math.round((90+m*60)/f)),$=setTimeout(()=>{a||p(_)},b);i.push($),b+=g}}e.addEventListener("boundary",f=>{f.name&&f.name!=="word"||(a=!0,h(),p(Zn(r,f.charIndex??-1)))}),e.addEventListener("end",()=>{h()}),e.addEventListener("start",()=>{if(a)return;const f=setTimeout(()=>{a||(p(0),d())},180);i.push(f)});const u=setTimeout(()=>{a||c||(p(0),d())},800);i.push(u)}function Wo(e,t){var p,h,d;Re.add(e.toLowerCase().replace(/[^a-z']/g,""));const n=Ce,s=vn;A(),U({restoreFocus:!1});const o=ns(e),r=Fo();r.setAttribute("aria-label",`Sound out the word ${o.text}`),r.innerHTML=Po(o,{resume:n}),r.hidden=!1,document.body.classList.add("word-panel-open"),O=t!=null&&t.isConnected?t:null,O==null||O.classList.add("wf-word--looking"),$e=O?O.closest(".stories-content")??Ae(O):null;const a=r.querySelector('[data-role="ladder"]');if(!(a&&Mo(a,{word:o.text,graphemes:o.graphemes,types:o.types},o.foundInBank))){const u=r.querySelector(".wd-fallback");u&&(u.hidden=!1);try{K.speakWord(o.text)}catch{}}(p=r.querySelector('[data-action="hear"]'))==null||p.addEventListener("click",()=>{try{K.speakWord(o.text)}catch{}});const i=r.querySelector('[data-action="add-review"]');i==null||i.addEventListener("click",()=>{if(!o.word)return;Jt(o.word.id)&&(i.disabled=!0,i.textContent="✓ In your Review Lane")}),(h=r.querySelector('[data-action="close"]'))==null||h.addEventListener("click",()=>U()),(d=r.querySelector('[data-action="back"]'))==null||d.addEventListener("click",()=>{U(),n&&R&&Et(R,s)});const c=r.querySelector(".bl-next:not([hidden])")??r.querySelector('[data-action="hear"]')??r.querySelector('[data-action="close"]');c==null||c.focus({preventScroll:!0}),Gt(),typeof ResizeObserver=="function"&&(pe=new ResizeObserver(()=>Gt()),pe.observe(r))}function Fo(){if(B!=null&&B.isConnected)return B;const e=document.createElement("aside");return e.id="word-panel",e.className="word-panel",e.setAttribute("role","dialog"),e.hidden=!0,document.body.appendChild(e),B=e,e}function U({restoreFocus:e=!0}={}){var n,s;pe==null||pe.disconnect(),pe=null,$e&&($e.style.paddingBottom=""),$e=null,document.body.classList.remove("word-panel-open"),document.querySelectorAll(".wf-word--looking").forEach(o=>o.classList.remove("wf-word--looking"));const t=O;if(O=null,!(!B||B.hidden)){try{(s=(n=K).cancelSpeech)==null||s.call(n)}catch{}B.hidden=!0,B.innerHTML="",e&&(t!=null&&t.isConnected)&&t.focus({preventScroll:!0})}}function Gt(){const e=B,t=O;if(!e||e.hidden||!(t!=null&&t.isConnected))return;const n=parseFloat(getComputedStyle(e).bottom)||0,s=window.innerHeight-n-e.offsetHeight,o=$e,r=o==null?void 0:o.getBoundingClientRect();o&&r&&(o.style.paddingBottom=`${Math.max(0,Math.ceil(r.bottom-s)+24)}px`);const a=t.getBoundingClientRect(),l=(r==null?void 0:r.top)??0;let i=0;a.bottom>s-16?i=Math.min(a.bottom-s+32,Math.max(0,a.top-l-8)):a.top<l+8&&(i=a.top-(l+(s-l)*.4)),i&&(o??window).scrollBy({top:i,behavior:V()})}document.addEventListener("keydown",e=>{e.key!=="Escape"||!B||B.hidden||document.querySelector(".modal-overlay:not([hidden])")||(e.preventDefault(),U())});function Po(e,{resume:t=!1}={}){const n=l=>String(l??"").replace(/[<>&"]/g,i=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[i]),s=an(e.text,e.graphemes,e.types),o=e.graphemes.map((l,i)=>{const c=ge[s[i]]??ge.consonant,p=c.mark?` data-mark="${n(c.mark)}"`:"";return`<span class="wd-tile vs--${s[i]}"${p} style="--tile-color:${c.color}" aria-label="${n(l)}, ${n(c.label)}">${n(l)}</span>`}).join(""),r=e.foundInBank?`<button class="btn btn--ghost btn--sm" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
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
    </div>`}function V(){return jn()?"auto":"smooth"}function Go(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;es(t,n)&&e.scrollIntoView({block:"center",behavior:V()})}catch{}}function Qe(){y==null||y.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function jo(e){y==null||y.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),Qe();const t=y==null?void 0:y.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");x&&n?x.follow(n):t.scrollIntoView({behavior:V(),block:"nearest"})}}function Nn(e){var n,s;let t;try{t=((s=(n=K).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function A(){var e;ee++,Ce=!1,(e=window.speechSynthesis)==null||e.cancel(),y==null||y.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Qe(),Lt(!1)}function zo(){ee++,Ce=!1,y==null||y.querySelectorAll(".sline--active").forEach(e=>e.classList.remove("sline--active")),Qe(),Lt(!1),xt(R)}function xt(e){if(!e)return;U({restoreFocus:!1}),wt(e.id);const t=document.getElementById("story-quest-cta");t&&(t.hidden=!1),Ko(e),Uo(e)}const Re=new Set;function Do(e){const t=Z.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=Y();return t.find(s=>!n.includes(s.id))??t[0]??null}function Yo(e){var s,o;const t=[T`You read <strong>${e.title}</strong> — ${We(e)} words.`];if(Re.size){const r=Re.size;t.push(T`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(T`You had a think about what happened.`);const n=lo(e.id)?(o=un(e))==null?void 0:o.name:"";return n&&t.push(T`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function Uo(e){var o,r,a;if(!e)return;const t=y==null?void 0:y.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=Do(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=T`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${Yo(e).map(l=>T`<li>${l}</li>`)}
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
  `,t.appendChild(s),s.scrollIntoView({behavior:V(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{Re.clear(),gt(e.id),oe=null,s.remove(),dt(0),x&&x.goTo(0)}),(r=s.querySelector("#btn-ending-next"))==null||r.addEventListener("click",l=>{A(),kt(l.currentTarget.dataset.storyId)}),(a=s.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{A(),ye()})}function Ko(e){var a,l,i;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Pt.has(e.id))return;const t=y==null?void 0:y.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Pt.add(e.id);const n=e.talkAboutIt[0];ot=n;const s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:V(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.resp;if(nt({storyId:e.id,question:n,response:p}),o.querySelectorAll(".comp-choice").forEach(d=>d.disabled=!0),c.classList.add("correct"),p==="confident")r.textContent="👍 Great! You understood the story.";else if(p==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Et(e),300);else{const d=Kt(e,ot||n);d?(r.textContent="💡 Have a look at the sentence we have lit up.",$o(d)):r.textContent="💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer."}r.hidden=!1;const h=o.querySelector("#comp-more");h&&(h.hidden=!1)})}),(l=o.querySelector("#comp-more"))==null||l.addEventListener("click",()=>{var p;const c=o.querySelector("#comp-q");c&&(c.textContent=s),ot=s,_n(),nt({storyId:e.id,question:s,response:"followup"}),(p=o.querySelector("#comp-more"))==null||p.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(h=>{h.disabled=!1,h.classList.remove("correct")})}),(i=o.querySelector("#comp-skip"))==null||i.addEventListener("click",()=>{nt({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Vo(){try{const e=pn(Z);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Jo(){var a,l;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=pn(Z),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=i=>String(i??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const i of e.roster)s.has(i.band)||s.set(i.band,[]),s.get(i.band).push(i);const o=Array.from(s.entries()).sort((i,c)=>String(i[0]).localeCompare(String(c[0]))).map(([i,c])=>{const p=c.filter(d=>d.unlocked).length,h=c.map(d=>`
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
    </div>`,document.body.appendChild(t),Me.open("modal-story-friends"),(l=t.querySelector("[data-close]"))==null||l.addEventListener("click",()=>{Me.close("modal-story-friends"),t.remove()}),t.addEventListener("click",i=>{i.target===t&&(Me.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(i=>{i.addEventListener("click",()=>{const c=i.dataset.storyId;c&&(Me.close("modal-story-friends"),t.remove(),kt(c))})})}function Lt(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=y==null?void 0:y.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function Qo(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(l){if(t.hidden=l!=="idle",n.hidden=l!=="recording",s.hidden=l!=="recorded"&&l!=="playing",o.hidden=l!=="recorded"&&l!=="playing",r)switch(l){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}s&&(s.textContent=l==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await fn({storyId:e.id,onStateChange:a})||a("error")}),n.addEventListener("click",()=>{Pe()}),s.addEventListener("click",()=>{gn()==="playing"?(Ue(),a("recorded")):mn()}),o.addEventListener("click",()=>{it(),a("idle")})}function Xo(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const l=e.lines.map((h,d)=>({...h,idx:d})).filter(h=>h.type!=="label"&&h.type!=="chapter"&&h.text);let i=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),y==null||y.querySelectorAll(".sline--echo-active").forEach(h=>h.classList.remove("sline--echo-active")),i=-1}function p(h){var k,b;i=h;const d=l[h];if(!d){c();return}d.idx,y==null||y.querySelectorAll(".sline--echo-active").forEach(w=>w.classList.remove("sline--echo-active"));const u=y==null?void 0:y.querySelector(`[data-line="${d.idx}"]`);u&&(u.classList.add("sline--echo-active"),u.scrollIntoView({behavior:V(),block:"nearest"})),a&&(a.textContent=`Line ${h+1} of ${l.length}`,a.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const f=new SpeechSynthesisUtterance(d.text);f.rate=.82,Nn(f),f.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${h+1}`)},f.onerror=()=>{s.hidden=!1},(k=window.speechSynthesis)==null||k.cancel(),(b=window.speechSynthesis)==null||b.speak(f)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,p(0)}),s.addEventListener("click",async()=>{if(gn()==="recording"){Pe();return}const h=l[i];!await fn({storyId:e.id,lineIdx:h==null?void 0:h.idx,onStateChange:u=>{u==="recording"?(s.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):u==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=i>=l.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):u==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{mn()}),n.addEventListener("click",()=>{it(),o.hidden=!0,i+1<l.length?p(i+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{A(),Pe(),it(),c()})}function Zo(){Ge||(Ge=!0,xe=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,Ne=setInterval(()=>{const e=Math.floor((Date.now()-xe)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}const On=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function pt(e,t){var i;if(!Ge&&Ne===null)return;clearInterval(Ne),Ne=null,Ge=!1;const n=document.getElementById("btn-fluency-start"),s=document.getElementById("btn-fluency-done");if(n&&(n.disabled=!1),s&&(s.disabled=!0),!e||!xe)return;const o=(Date.now()-xe)/1e3;xe=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;Oe=o,r&&(r.hidden=!0),a.hidden=!1;const l=document.getElementById("fluency-time");l&&(l.textContent=`${e} words in ${On(o)}.`),(i=a.querySelector('input[name="errors"]'))==null||i.focus({preventScroll:!0})}function er(e,t){var o;const n=document.getElementById("fluency-form"),s=document.getElementById("fluency-result");!n||!s||(n.addEventListener("submit",r=>{var f,k,b;r.preventDefault();const a=((f=n.querySelector('input[name="errors"]'))==null?void 0:f.value)??"",l=a===""?null:Number(a),i=((k=n.querySelector('input[name="support"]:checked'))==null?void 0:k.value)??null,{wpm:c,wcpm:p,accuracy:h}=to(e,Oe,l);ho({storyId:t.id,wpm:c,wcpm:p,errors:l,accuracy:h,support:i,durationSec:Oe,wordCount:e});const d=no({wpm:c,wcpm:p,primaryGrade:((b=Gn())==null?void 0:b.primaryGrade)??null});n.hidden=!0,n.reset(),s.hidden=!1,s.innerHTML=T`
      <div class="fluency-result-inner">
        <span class="fluency-time">${On(Oe)}</span>
        <span class="fluency-wcpm">${d.headline}</span>
        ${h!=null?T`<span class="fluency-acc">${h}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${d.detail}</p>
      ${d.reference?T`<p class="fluency-reference">${d.reference}</p>`:""}
    `;const u=document.getElementById("story-quest-cta");u&&(u.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{n.hidden=!0,n.reset(),s.hidden=!1,s.textContent="Not saved."}))}export{Mn as _highlightGraphemes,yo as _isMeetWordsCompletedToday,nt as _logComprehensionAttempt,Ft as _setMeetWordsCompleted,ir as cleanupStoryMode,rr as initStoryMode,ar as showBrowser};
