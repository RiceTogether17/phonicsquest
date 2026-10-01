import{S as V,B as j}from"./stories-Cton5YYn.js";import{P as Un,s as Vt,a as Jt,e as Qt,i as Xt}from"./decodability-CS1iTkjA.js";import{q as T,s as pe,W as je,X as Yn,Y as De,Z as Zt,C as en,o as Kn,_ as we,$ as se,M as bt,a0 as oe,a1 as Vn,b as Jn,a2 as Qn,a3 as Xn}from"./index-6A5a1VTd.js";import"./gsap-C8pce-KX.js";const Zn=/(\s+|["“”'',.!?;:()-]+)/;function yt(e){return String(e??"").split(Zn).filter(t=>t.length>0).map(t=>({text:t,type:/^\s+$/.test(t)?"space":/^[^a-zA-Z0-9]+$/.test(t)?"punct":"word"}))}const es=new Set(`a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just some any true false story about also`.split(/\s+/));function ts(e){let t=e.toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");/[^aeiou]ies$/.test(t)?t=`${t.slice(0,-3)}y`:/(ss|sh|ch|x|z)es$/.test(t)?t=t.slice(0,-2):(/[^s]es$/.test(t)||/[^su]s$/.test(t))&&(t=t.slice(0,-1));let n=!1;return/.{3,}ing$/.test(t)?(t=t.slice(0,-3),n=!0):(/.{3,}ed$/.test(t)||/.{3,}ly$/.test(t))&&(t=t.slice(0,-2),n=!0),n&&(t=t.replace(/([bdgmnprt])\1$/,"$1")),t}function tt(e){return new Set(String(e??"").split(/[\s\-—–/]+/).map(t=>t.toLowerCase().replace(/[^a-z']/g,"")).filter(t=>t.length>1&&!es.has(t)).map(ts).filter(t=>t.length>1))}function ns(e){const t=[];return((e==null?void 0:e.lines)??[]).forEach((n,s)=>{if(n.type==="label"||n.type==="chapter"||!n.text)return;const o=yt(n.text);let r=-1,a=null,i=[];const l=()=>{a!==null&&(t.push({line:s,from:a,to:r,text:i.join("").trim()}),a=null,i=[])};for(const c of o)c.type==="word"&&(r+=1,a===null&&(a=r)),a!==null&&i.push(c.text),c.type==="punct"&&/[.!?]/.test(c.text)&&l();l()}),t}const ss=3;function tn(e,t,n=""){const s=tt(`${t} ${n}`),o=tt(n);if(!s.size)return null;let r=null,a=0;for(const i of ns(e)){const l=tt(i.text);let c=0;for(const u of s)l.has(u)&&(c+=(u.length>3?2:1)*(o.has(u)?3:1));(c>a||c===a&&c>0&&r&&i.text.length<r.text.length)&&(r=i,a=c)}return a>=ss?r:null}function os(e,t){var s;if(!(t!=null&&t.q))return null;const n=((s=t.options)==null?void 0:s[t.answer])??"";return tn(e,t.q,n)}function rs(e,t,n){var f;if(!((f=t.comprehension)!=null&&f.length)){n==null||n();return}const s={phase:"intro",qIndex:0,vocabIndex:0,correct:0,firstTry:0,withClue:0,hadClue:!1,clue:null,total:t.comprehension.length,flipped:!1};function o(){switch(s.phase){case"intro":return r();case"comprehension":return a();case"vocab":return c();case"openEnded":return l();case"grammar":return u();case"done":return h()}}function r(){var d,p,m,g;e.innerHTML=`
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
    `,(m=document.getElementById("sq-start"))==null||m.addEventListener("click",()=>{s.phase="comprehension",s.qIndex=0,o()}),(g=document.getElementById("sq-skip"))==null||g.addEventListener("click",()=>n==null?void 0:n())}function a(){const d=t.comprehension[s.qIndex],p=s.qIndex+1,m=s.total;s.clue=os(t,d),s.hadClue=!1,e.innerHTML=`
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
          ${d.options.map((g,b)=>`
            <button class="sq-option" data-idx="${b}" aria-label="${g}">
              <span class="sq-option-letter">${String.fromCharCode(65+b)}</span>
              <span class="sq-option-text">${g}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(g=>{g.addEventListener("click",()=>i(g,d))})}function i(d,p){const m=parseInt(d.dataset.idx,10),g=m===p.answer,b=document.getElementById("sq-feedback"),E=s.clue;if(!g&&!s.hadClue&&E){s.hadClue=!0,d.disabled=!0,d.classList.add("sq-option--wrong"),b&&(b.hidden=!1,b.className="sq-feedback sq-feedback--retry",b.innerHTML=T`Not quite. The story says:
          <q class="sq-clue">${E.text}</q> Have another go.`);return}g&&(s.hadClue?s.withClue++:s.firstTry++,s.correct++),document.querySelectorAll(".sq-option").forEach((y,S)=>{y.disabled=!0,S===p.answer&&y.classList.add("sq-option--correct"),S===m&&!g&&y.classList.add("sq-option--wrong")}),b&&(b.hidden=!1,b.className=`sq-feedback ${g?"sq-feedback--correct":"sq-feedback--wrong"}`,g?b.textContent=s.hadClue?"✅ You found it!":"✅ Great thinking!":b.innerHTML=E?T`The answer is <strong>${p.options[p.answer]}</strong>. The story says:
              <q class="sq-clue">${E.text}</q>`:T`The answer is <strong>${p.options[p.answer]}</strong>.`);const v=document.getElementById("sq-next");v&&(v.hidden=!1,v.addEventListener("click",()=>{var y,S,I;s.qIndex++,s.qIndex<s.total||(s.phase=(y=t.openEnded)!=null&&y.length?"openEnded":(S=t.vocab)!=null&&S.length?"vocab":(I=t.grammarSpotlight)!=null&&I.length?"grammar":"done",s.vocabIndex=0),o()}))}function l(){var p,m,g;const d=t.openEnded||[];if(!d.length){s.phase=(p=t.vocab)!=null&&p.length?"vocab":(m=t.grammarSpotlight)!=null&&m.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${d.map((b,E)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${E+1}. ${b.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${b.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${b.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(g=document.getElementById("sq-open-next"))==null||g.addEventListener("click",()=>{var b,E;s.phase=(b=t.vocab)!=null&&b.length?"vocab":(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",o()})}function c(){var E,v,y;const d=t.vocab[s.vocabIndex],p=t.vocab.length,m=s.vocabIndex+1;e.innerHTML=`
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
    `;const g=document.getElementById("sq-flip-card"),b=()=>{s.flipped=!0,o()};g==null||g.addEventListener("click",b),g==null||g.addEventListener("keydown",S=>{(S.key==="Enter"||S.key===" ")&&b()}),(E=document.getElementById("sq-flip-btn"))==null||E.addEventListener("click",b),(v=document.getElementById("sq-vocab-next"))==null||v.addEventListener("click",()=>{var S;s.vocabIndex++,s.flipped=!1,s.vocabIndex<p||(s.phase=(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done"),o()}),(y=document.getElementById("sq-vocab-skip"))==null||y.addEventListener("click",()=>{var S;s.phase=(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done",o()})}function u(){var m;const p=(t.grammarSpotlight??[]).map((g,b)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${b+1}</div>
        <h3 class="sq-grammar-pattern">${g.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${g.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${g.tip}</p>
      </div>
    `).join("");e.innerHTML=`
      <div class="sq-screen sq-grammar">
        <p class="sq-phase-label">✏️ Grammar Spotlight</p>
        <div class="sq-grammar-list">${p}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(m=document.getElementById("sq-grammar-done"))==null||m.addEventListener("click",()=>{s.phase="done",o()})}function h(){var v;const d=s.total>0?Math.round(s.correct/s.total*100):100,p=d>=80?3:d>=50?2:1,m="⭐".repeat(p)+"☆".repeat(3-p),g=s.correct*15+(d===100?25:0),b=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],E=p===3?b[2]:p===2?b[1]:b[0];e.innerHTML=`
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
            <span class="sq-xp-num">+${g}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        ${s.withClue?`<p class="sq-breakdown">${s.firstTry} right first time · ${s.withClue} worked out from the story</p>`:""}
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `,(v=document.getElementById("sq-back"))==null||v.addEventListener("click",()=>n==null?void 0:n())}o()}function as(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const n=Math.min(t,e.length-1);let s=-1,o=!1;for(let r=0;r<=n;r++){const a=/\s/.test(e.charAt(r));!a&&!o?(s++,o=!0):a&&(o=!1)}return s<0?-1:s}function is(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const n=80;return e.bottom<n||e.top>t-n}function ls(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let ye=null;function nn(){if(ye)return ye;ye=new Map;for(const e of je)e!=null&&e.word&&ye.set(e.word.toLowerCase(),e);return ye}function cs(e){const t=ls(e),n=nn(),s=t?n.get(t):null;if(s){const o=pe.get("wordStats")||{},r=!!o[s.id]&&(o[s.id].attempts||0)>0;return{text:s.word,word:s,foundInBank:!0,graphemes:Array.isArray(s.graphemes)?s.graphemes:[t],types:Array.isArray(s.types)?s.types:[],alreadyTracked:r}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function sn(e){return!e||typeof e!="string"||!(nn().has(e)||je.some(s=>(s==null?void 0:s.id)===e))?!1:(pe.recordWordAttempt(e,!0,Yn.EXPOSURE),!0)}const ds=.62,us=.4,Nt=2;function Ot(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function ps(e,t,n=(s,o)=>De.phoneticSimilarity(s,o)){const s=e.length,o=t.length;if(s===0)return[];if(o===0)return e.map(h=>({word:h,status:"miss",heard:null}));const r=-.4,a=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let h=1;h<=s;h++)a[h][0]=h*r;for(let h=1;h<=o;h++)a[0][h]=h*r;const i=Array.from({length:s},(h,f)=>Array.from({length:o},(d,p)=>n(e[f],t[p])));for(let h=1;h<=s;h++)for(let f=1;f<=o;f++){const d=i[h-1][f-1]-.5;a[h][f]=Math.max(a[h-1][f-1]+d,a[h-1][f]+r,a[h][f-1]+r)}const l=new Array(s);let c=s,u=o;for(;c>0;){const h=u>0?i[c-1][u-1]-.5:-1/0;if(u>0&&a[c][u]===a[c-1][u-1]+h){const f=i[c-1][u-1],d=e[c-1];let p;f>=ds?p="match":f>=us||d.length<=Nt?p="unsure":p="miss",l[c-1]={word:d,status:p,heard:t[u-1]},c--,u--}else if(u>0&&a[c][u]===a[c][u-1]+r)u--;else{const f=e[c-1];l[c-1]={word:f,status:f.length<=Nt?"unsure":"miss",heard:null},c--}}return l}function hs(e,t,n){const s=Ot(e);let o=null;for(const r of t||[]){const a=ps(s,Ot(r.text),n),i=a.filter(l=>l.status==="match").length;(!o||i>o.matchCount)&&(o={words:a,matchCount:i,total:s.length})}return o||{words:s.map(r=>({word:r,status:"miss",heard:null})),matchCount:0,total:s.length}}function fs(){return De.supported}async function ms(e){const t=await De.listenTranscript({timeoutMs:12e3});return t?hs(e,t.transcripts):null}function gs(){De.stop()}const Se=Object.freeze([{id:"word",icon:"👆",label:"Word",hint:"Point at each word as you read it."},{id:"line",icon:"📏",label:"Line",hint:"Keep the ruler under the line you are reading."},{id:"window",icon:"🔦",label:"Window",hint:"Only the line you are reading is bright."}]);function bs(e){const t=[];return e.forEach((n,s)=>{if(!n)return;const o=t[t.length-1];!o||(n.top+n.bottom)/2>o.bottom?t.push({top:n.top,bottom:n.bottom,first:s,last:s}):(o.top=Math.min(o.top,n.top),o.bottom=Math.max(o.bottom,n.bottom),o.last=s)}),t}const ys=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function ze(e){for(let t=e==null?void 0:e.parentElement;t&&t!==document.body;t=t.parentElement){const n=getComputedStyle(t).overflowY;if((n==="auto"||n==="scroll")&&t.scrollHeight>t.clientHeight+2)return t}return null}function ws(e,{mode:t,word:n=null,wordSelector:s=".wf-word",safeArea:o,onMove:r}){var Ct,Mt,Ht;const a=[...e.querySelectorAll(s)];let i=[],l=0,c=0;const u=document.createElement("div");u.className=`ruler-layer ruler-layer--${t}`,u.setAttribute("aria-hidden","true"),u.innerHTML=`
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`,e.classList.add("has-ruler"),e.appendChild(u);const h=()=>{const $=a[l]??a[0]??e;return parseFloat(getComputedStyle($).fontSize)||20},f=$=>u.querySelector($),d=f(".ruler-veil--above"),p=f(".ruler-veil--below"),m=f(".ruler-strip"),g=f(".ruler-word"),b=f(".ruler-bar");function E(){const $=e.getBoundingClientRect();i=bs(a.map(x=>{const q=x.getBoundingClientRect();return q.width||q.height?{top:q.top-$.top,bottom:q.bottom-$.top}:null}))}const v=$=>{const x=i.findIndex(q=>$>=q.first&&$<=q.last);return x<0?0:x};function y(){const $=i[c];if(!$)return;const x=h(),q=x*.6,B=$.bottom+x*.18,M=Math.max(12,x*.55),F=e.scrollHeight;d.style.height=`${Math.max(0,$.top-q)}px`,p.style.top=`${B+M}px`,p.style.height=`${Math.max(0,F-B-M)}px`,m.style.top=`${$.top-q}px`,m.style.height=`${B-($.top-q)}px`,b.style.top=`${B}px`,b.style.height=`${M}px`;const X=a[l];if(t==="word"&&X){const Z=e.getBoundingClientRect(),U=X.getBoundingClientRect();g.style.left=`${U.left-Z.left-3}px`,g.style.width=`${U.width+6}px`,g.style.top=`${U.top-Z.top-2}px`,g.style.height=`${U.height+4}px`,b.style.setProperty("--x",`${U.left-Z.left+U.width/2}px`)}a.forEach((Z,U)=>Z.classList.toggle("is-pointed",t==="word"&&U===l))}function S(){r==null||r({word:l,line:c,lines:i.length,words:a.length,atEnd:t==="word"?l>=a.length-1:c>=i.length-1})}function I(){const $=i[c];if(!$)return;const x=e.getBoundingClientRect(),q=h(),B=x.top+$.top-q*.6,M=x.top+$.bottom+q*1.2,F=o();if(B>=F.top&&M<=F.bottom)return;const X=F.top+(F.bottom-F.top)*.28,Z={top:B-X,behavior:ys()?"auto":"smooth"};(ze(e)??window).scrollBy(Z)}function A($,{scroll:x=!0}={}){var q;c=Math.max(0,Math.min(i.length-1,$)),l=((q=i[c])==null?void 0:q.first)??0,y(),S(),x&&I()}function P($,{scroll:x=!0}={}){l=Math.max(0,Math.min(a.length-1,$)),c=v(l),y(),S(),x&&I()}function re($){const x=$-e.getBoundingClientRect().top;let q=0,B=1/0;return i.forEach((M,F)=>{const X=x<M.top?M.top-x:x>M.bottom?x-M.bottom:0;X<B&&(B=X,q=F)}),q}let Ce=!1;b.addEventListener("pointerdown",$=>{var x;Ce=!0,(x=b.setPointerCapture)==null||x.call(b,$.pointerId),u.classList.add("is-dragging"),$.preventDefault()}),b.addEventListener("pointermove",$=>{if(!Ce)return;const x=h(),q=re($.clientY-x*.6);q!==c&&A(q,{scroll:!1})});const Rt=()=>{Ce&&(Ce=!1,u.classList.remove("is-dragging"),I())};b.addEventListener("pointerup",Rt),b.addEventListener("pointercancel",Rt);let et=0;const Bt=()=>{cancelAnimationFrame(et),et=requestAnimationFrame(()=>{var $;E(),c=v(l),t!=="word"&&(l=(($=i[c])==null?void 0:$.first)??l),u.classList.add("no-anim"),y(),S(),requestAnimationFrame(()=>u.classList.remove("no-anim"))})},ae=typeof ResizeObserver=="function"?new ResizeObserver(Bt):null;if(ae==null||ae.observe(e),(Mt=(Ct=document.fonts)==null?void 0:Ct.ready)==null||Mt.then(Bt).catch(()=>{}),E(),n==null){const $=o(),x=e.getBoundingClientRect().top,q=i.findIndex(B=>x+B.top>=$.top);c=Math.max(0,q),l=((Ht=i[c])==null?void 0:Ht.first)??0}else l=Math.max(0,Math.min(a.length-1,n)),c=v(l);return u.classList.add("no-anim"),y(),S(),requestAnimationFrame(()=>{u.classList.remove("no-anim"),n!=null&&I()}),{next(){t==="word"?P(l+1):A(c+1)},prev(){t==="word"?P(l-1):A(c-1)},nextLine:()=>A(c+1),prevLine:()=>A(c-1),tap($,x){const q=x?a.indexOf(x):-1;q>=0?t==="word"?P(q,{scroll:!1}):A(v(q),{scroll:!1}):A(re($),{scroll:!1})},follow($){const x=a.indexOf($);x<0||(t==="word"?x!==l&&P(x):v(x)!==c&&A(v(x)))},reveal:I,current:()=>a[l]??null,goTo($){t==="word"?P($):A(v(Math.max(0,Math.min(a.length-1,$))))},destroy(){ae==null||ae.disconnect(),cancelAnimationFrame(et),a.forEach($=>$.classList.remove("is-pointed")),e.classList.remove("has-ruler"),u.remove()}}}const vs="giri_story_place",Ss=40,$s=30,on=8,rn=()=>Zt(vs);function wt(){try{const e=localStorage.getItem(rn()),t=e?JSON.parse(e):{};return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function lt(e){try{localStorage.setItem(rn(),JSON.stringify(e))}catch{}}function ks(e,t=Date.now()){const n=t-$s*24*60*60*1e3,s=Object.entries(e).filter(([,o])=>o&&typeof o.word=="number"&&typeof o.at=="number"&&o.at>=n);return s.sort((o,r)=>r[1].at-o[1].at),Object.fromEntries(s.slice(0,Ss))}function an(e,t,n=Date.now()){if(!e||typeof t!="number"||!Number.isFinite(t))return;const s=wt();if(t<on){if(!(e in s))return;delete s[e],lt(s);return}s[e]={word:Math.max(0,Math.round(t)),at:n},lt(ks(s,n))}function Es(e){const t=wt()[e];return t&&typeof t.word=="number"&&t.word>=on?t.word:null}function vt(e){const t=wt();e in t&&(delete t[e],lt(t))}function Wt(e){const t=pe.get("groupMastery")||{},n=en.filter(o=>e.includes(o.phase));return n.length?n.filter(o=>(t[o.group]??0)>=.8).length/n.length:0}function nt(e){const t=pe.get("groupMastery")||{};return en.some(n=>e.includes(n.phase)&&typeof t[n.group]=="number"&&t[n.group]>0)}function ln(){const e=Wt([1,2,3,4,5]),t=nt([6]),n=Wt([6])>=.5,s=nt([8]),o=nt([7]),r=e>=.6||t,a=r&&(n||s),i=a&&o;return{A:{ready:!0,hint:""},B:{ready:r,hint:r?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:a,hint:a?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:i,hint:i?"":"Best after starting Phase 7 — Diphthongs"}}}function xs(e,t){const n=ln();for(const s of["A","B","C","D"]){if(!n[s].ready)break;const o=(t==null?void 0:t[s])||[];if(o.some(a=>!(e!=null&&e.includes(a.id)))||!o.length)return s}return"A"}const he=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă",cue:"˘"},long:{label:"long vowel",color:"#1a7f37",mark:"ā",cue:"¯"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#0072c0",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),Ls=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...he[e]}))),St=new Set(["short","long","schwa","rcontrolled","diphthong"]),qs=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),Ue="bcdfghjklmnpqrstvwxyz",Is=new RegExp(`[${Ue}]a$`),Ts=new RegExp("[bcdfghjkmnprstvz]al$"),cn=/[ts]ion$/;function dn(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(qs.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&Is.test(e)&&t.add(e.length-1),e.length>=4&&Ts.test(e)&&t.add(e.length-2),e.length>=5&&cn.test(e)&&t.add(e.length-3)),t.size?t:null}const _s=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),As=new RegExp(`[${Ue}]e$`);function un(e){const t=new Set,n=e.length;if(n>=5&&cn.test(e)&&t.add(n-2),n>=4&&As.test(e)&&!_s.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-1),n>=4&&e.endsWith("ed")){const s=e[n-3];Ue.includes(s)&&s!=="t"&&s!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(n-2)}return t.size?t:null}const Rs=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),Bs=new Set(["been"]),Cs=new Set(["friend","friends"]),Ms=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),Hs=["ing","ed","ly","es","s","n"];function Me(e,t){if(e.has(t))return!0;for(const n of Hs)if(t.endsWith(n)&&t.length-n.length>=2&&e.has(t.slice(0,-n.length)))return!0;return!1}function $e(e,t,n,s,o,r){return St.has(s)?r!=null&&r.has(n)?"silent":o!=null&&o.has(n)?"schwa":t==="ea"&&Me(Rs,e)||t==="ee"&&Me(Bs,e)||t==="ie"&&Me(Cs,e)?"short":t==="ow"&&Me(Ms,e)?"long":s:s}const k=null,pn=new Map([["have",[k,"short",k,"silent"]],["love",[k,"short",k,"silent"]],["come",[k,"short",k,"silent"]],["some",[k,"short",k,"silent"]],["done",[k,"short",k,"silent"]],["gone",[k,"short",k,"silent"]],["none",[k,"short",k,"silent"]],["give",[k,"short",k,"silent"]],["live",[k,"short",k,"silent"]],["one",["short",k,"silent"]],["were",[k,"rcontrolled","rcontrolled","silent"]],["here",[k,"rcontrolled","rcontrolled","silent"]],["where",[k,k,"rcontrolled","rcontrolled","silent"]],["there",[k,k,"rcontrolled","rcontrolled","silent"]],["above",["schwa",k,"short",k,"silent"]],["become",[k,"short",k,"short",k,"silent"]],["people",[k,"long","silent",k,k,"silent"]],["again",["schwa",k,"long","long",k]],["said",[k,"short","short",k]],["says",[k,"short","short",k]]]),Ns=new Map(je.map(e=>[e.word.toLowerCase(),e])),hn=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function Os(e){return hn[e]??"consonant"}function fn(e,t,n){const s=String(e).toLowerCase().replace(/[^a-z]/g,""),o=dn(s),r=un(s),a=pn.get(s),i=[];let l=0;for(let c=0;c<t.length;c++){const u=t[c]||"",h=u.length||1;let f=Os(n[c]);St.has(f)&&(f=(a==null?void 0:a[l])??$e(s,u,l,f,o,r)),i.push(f),l+=h}return i}const Ws="aeiou",Ps="bcdfghjklmnpqrstvwxyz",Pt=e=>Ws.includes(e),Fs=e=>Ps.includes(e),mn=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),Gs=Object.keys(mn).sort((e,t)=>t.length-e.length);function js(e,t,n){const s=[],o=e.length;let r=0;for(;r<o;){if(r===o-3&&Pt(e[r])&&Fs(e[r+1])&&e[r+2]==="e"){s.push({len:1,sound:$e(e,e[r],r,"long",t,n)}),s.push({len:1,sound:null}),s.push({len:1,sound:"silent"});break}let a=!1;for(const i of Gs)if(e.startsWith(i,r)){s.push({len:i.length,sound:$e(e,i,r,mn[i],t,n)}),r+=i.length,a=!0;break}if(!a){if(Pt(e[r])||e[r]==="y"&&r>0){const i=r===o-1?"long":"short";s.push({len:1,sound:$e(e,e[r],r,i,t,n)}),r+=1;continue}s.push({len:1,sound:null}),r+=1}}return s}function Ds(e,t,n,s){const o=[];let r=0;for(let a=0;a<e.graphemes.length;a++){const i=e.graphemes[a],l=i.length;if(l===2&&i[1]==="e"&&Ue.includes(i[0])&&r+2===t.length&&(s!=null&&s.has(r+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),r+=2;continue}let c=hn[e.types[a]]??null;!St.has(c)&&c!=="silent"&&(c=null),c=$e(t,i,r,c,n,s),o.push({len:l,sound:c}),r+=l}return o}function gn(e){var a;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Un.has(t))return null;const n=pn.get(t);if(n){const i=[];for(const l of n){const c=i[i.length-1];c&&c.sound===l?c.len+=1:i.push({len:1,sound:l})}return i}const s=dn(t),o=un(t),r=Ns.get(t);return(a=r==null?void 0:r.graphemes)!=null&&a.length?Ds(r,t,s,o):js(t,s,o)}function zs(e){return e&&e.replace(/[A-Za-z]+/g,t=>{var r;const n=gn(t);if(!n)return t;let s="",o=0;for(const{len:a,sound:i}of n){const l=t.slice(o,o+a);if(o+=a,!i){s+=l;continue}const c=(r=he[i])==null?void 0:r.cue;s+=`<span class="vs vs--${i}"${c?` data-cue="${c}"`:""}>${l}</span>`}return o<t.length&&(s+=t.slice(o)),s})}function Us(e,t){const n=[];let s="",o="";return e.forEach((r,a)=>{const i=r.replace(/^-/,"");if(t[a]==="silent"){o+=i;return}s+=o+i,o="",n.push(s)}),o&&n.length&&(n[n.length-1]+=o),n}function Ys(e,t){let n=-1;for(let s=0;s<e.length;s++)if(e[s]!=="silent"&&++n===t)return s;return-1}function Ks(e,{word:t,graphemes:n,types:s,speakPhoneme:o,speakWord:r,extraActions:a=""}){const i=fn(t,n,s),l=Us(n,i),c=i.includes("silent");let u=0;const h=n.map((y,S)=>{const I=he[i[S]]??he.consonant;return T`<button
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
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${h}</div>
      ${c?T`<p class="bl-note">Grey letters are silent — skip them.</p>`:""}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${Kn(a)}
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
  `;const f=y=>e.querySelector(y),d=f(".bl-steps"),p=f(".bl-next"),m=f(".bl-again"),g=f(".bl-say"),b=[...e.querySelectorAll(".bl-tile")];function E(){d.innerHTML=T`${l.slice(0,u).map((S,I)=>T`<li class="${I===u-1?"is-new":""}">${S}</li>`)}`,b.forEach(S=>{const I=Number(S.dataset.idx),A=i.slice(0,I+1).filter(re=>re!=="silent").length-1,P=i[I]==="silent"?u>=l.length:A>-1&&A<u;S.classList.toggle("is-lit",P),S.classList.toggle("is-current",i[I]!=="silent"&&A===u-1)});const y=u>=l.length;p.hidden=y,m.hidden=!y,g.textContent=y?"🔊 Hear the word":"🔊 Just hear the word",g.classList.toggle("bl-say--escape",!y),y&&l.length&&d.insertAdjacentHTML("beforeend",String(T`<li class="bl-done">
          Now say the whole word, then tap 🔊 to check. Does it make sense in the sentence?
        </li>`))}function v(){if(u>=l.length)return;const y=Ys(i,u);u+=1,E(),y>=0&&Promise.resolve(o(n[y],s[y],{word:t,index:y})).catch(()=>{})}return p.addEventListener("click",v),m.addEventListener("click",()=>{u=0,E(),p.focus({preventScroll:!0})}),g.addEventListener("click",()=>{Promise.resolve(r(t)).catch(()=>{})}),b.forEach(y=>y.addEventListener("click",async()=>{const S=Number(y.dataset.idx);if(i[S]!=="silent"){y.classList.add("is-tapped"),setTimeout(()=>y.classList.remove("is-tapped"),300);try{await o(n[S],s[S],{word:t,index:S})}catch{}}})),E(),{destroy(){e.innerHTML=""}}}const Vs=Object.freeze(["tch","dge","ph","sh","ch","th","wh","ck","ng","qu","wr","kn","gn","ll","ss","tt","nn","gg","ff","dd","zz","bb","pp","mm","rr","cc"]),Js=Object.freeze(["-ness","-less","-ing","-est","-ful","-ed","-er","-ly"]),Qs=3,Xs=e=>/[aeiouy]/.test(e);function ct(e,t,n){const s=[];let o=0;for(;o<e.length;){let r=Vs.find(a=>e.startsWith(a,o));r==="ng"&&/[ei]/.test(t[n+o+2]??"")&&(r=null),r?(s.push(r),o+=r.length):(s.push(e[o]),o+=1)}return s}function Zs(e,t){const n=[],s=[];for(let o=0;o<e.length;o++){const r=e[o+1];if(e[o]==="q"&&(r!=null&&r.startsWith("u"))){n.push("qu"),s.push("c");const a=r.slice(1);a?e[o+1]=a:o+=1;continue}n.push(e[o]),s.push(t[o])}return{graphemes:n,types:s}}function eo(e){const t=[];for(const n of e){const s=t[t.length-1];s&&s.sound===null&&n.sound===null?s.len+=n.len:t.push({...n})}return t}const to=Object.freeze({short:"sv",long:"lv",rcontrolled:"rc",diphthong:"dp",silent:"se",schwa:"sv"});function no(e){const t=String(e??"").toLowerCase().replace(/[^a-z]/g,"");if(!t)return null;let n=t,s=null,o=!1;t.endsWith("s")&&/[aeiou][^aeiouy]e$/.test(t.slice(0,-1))&&(o=!0,n=t.slice(0,-1));for(const c of Js){const u=c.slice(1),h=n.slice(0,-u.length);if(n.endsWith(u)&&h.length>=Qs&&Xs(h)){s=c,n=h;break}}const r=gn(n);if(!r)return null;const a=[],i=[];let l=0;for(const{len:c,sound:u}of eo(r)){const h=n.slice(l,l+c);if(u)a.push(h),i.push(to[u]??"sv");else for(const f of ct(h,n,l))a.push(f),i.push("c");l+=c}if(l<n.length)for(const c of ct(n.slice(l),n,l))a.push(c),i.push("c");return o&&(a.push("s"),i.push("c")),s&&(a.push(s),i.push("sf")),a.length?Zs(a,i):null}function so(e,t){const n=[],s=[];return e.forEach((o,r)=>{if(t[r]!=="bl"){n.push(o),s.push(t[r]);return}const a=String(o).toLowerCase();for(const i of ct(a,a,0))n.push(i),s.push("c")}),{graphemes:n,types:s}}const oo=Object.freeze({1:{autumn:null,winter:29,spring:60},2:{autumn:50,winter:84,spring:100},3:{autumn:83,winter:97,spring:112},4:{autumn:94,winter:120,spring:133},5:{autumn:121,winter:133,spring:146},6:{autumn:132,winter:145,spring:146}}),ro=Object.freeze({1:{autumn:null,winter:16,spring:34},2:{autumn:25,winter:52,spring:72},3:{autumn:44,winter:62,spring:78},4:{autumn:68,winter:87,spring:98},5:{autumn:85,winter:99,spring:109},6:{autumn:112,winter:118,spring:122}});function ao(e=new Date){const t=e.getMonth();return t<=3?"autumn":t<=7?"winter":"spring"}function io(e){const t=/^P([1-6])$/i.exec(String(e??"").trim());return t?Number(t[1]):null}function lo(e,t,n=null){if(!(e>0)||!(t>0))return{wpm:0,wcpm:null,accuracy:null};const s=t/60,o=Math.round(e/s);if(n==null||Number.isNaN(n))return{wpm:o,wcpm:null,accuracy:null};const r=Math.max(0,Math.min(e,Math.round(n)));return{wpm:o,wcpm:Math.round((e-r)/s),accuracy:Math.round((e-r)/e*100)}}function co({wpm:e,wcpm:t=null,primaryGrade:n=null,now:s=new Date}){var c,u;const o=io(n),r=ao(s),a=o?(c=oo[o])==null?void 0:c[r]:null,i=o?(u=ro[o])==null?void 0:u[r]:null;if(t==null)return{band:"uncounted",headline:`${e} words per minute`,detail:"Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.",reference:null};if(!o||a==null)return{band:"unknown",headline:`${t} words correct per minute`,detail:o?"There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.":"Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.",reference:null};const l=`Around ${a} words correct per minute is the middle of P${o} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;return t>=a?{band:t>=a*1.25?"above":"at",headline:`${t} words correct per minute`,detail:"That is at or above the middle of this year group. Re-reading still builds smoothness and expression.",reference:l}:i!=null&&t>=i?{band:"approaching",headline:`${t} words correct per minute`,detail:"A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.",reference:l}:{band:"below",headline:`${t} words correct per minute`,detail:"Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.",reference:l}}const uo="giri_friends_unlocked";function bn(){return Zt(uo)}const po=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function ho(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function yn(e){if(!e||!e.id)return null;const t=po[e.id]||ho(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function $t(){try{const e=localStorage.getItem(bn()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function fo(e){try{localStorage.setItem(bn(),JSON.stringify(Array.from(e)))}catch{}}function mo(e){if(!e||typeof e!="string")return!1;const t=$t();return t.has(e)?!1:(t.add(e),fo(t),!0)}function go(e){return $t().has(e)}function bo(e){const t=$t();if(!Array.isArray(e))return[];const n=[];for(const s of e){const o=yn(s);o&&n.push({...o,unlocked:t.has(s.id)})}return n}function wn(e){const t=bo(e);return{unlocked:t.filter(s=>s.unlocked).length,total:t.length,roster:t}}const vn="giri_fluency_history",Ft=5,ne=new Map,yo=10;function wo(e,t){for(ne.set(e,t);ne.size>yo;){const n=ne.keys().next().value;ne.delete(n)}}let ce=null,H=null,st=[],de=null,ke=null,Ye="idle",N=null;async function Sn({storyId:e,lineIdx:t,onStateChange:n}={}){if(Ye==="recording")return!1;ke=n??null,st=[];try{ce=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return D("error"),!1}const s=$o();try{H=new MediaRecorder(ce,s?{mimeType:s}:{})}catch{H=new MediaRecorder(ce)}return H.ondataavailable=o=>{o.data.size>0&&st.push(o.data)},H.onstop=()=>{const o=new Blob(st,{type:H.mimeType||"audio/webm"}),r=`rec_${e}_${t??"full"}_${Date.now()}`;de=r,wo(r,o),ut(),D("recorded")},H.onerror=()=>{ut(),D("error")},H.start(),D("recording"),!0}function We(){H&&H.state==="recording"?H.stop():ut()}function $n(e){const t=de,n=t?ne.get(t):null;return n?new Promise(s=>{Ke();const o=URL.createObjectURL(n);N=new Audio(o),D("playing"),N.onended=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.onerror=()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()},N.play().catch(()=>{URL.revokeObjectURL(o),N=null,D("recorded"),s()})}):Promise.resolve()}function Ke(){N&&(N.pause(),N=null)}function dt(e){const t=de;t&&ne.delete(t),t===de&&(de=null),Ke(),D("idle")}function kn(){return Ye}function En(){We(),Ke(),ne.clear(),de=null,Ye="idle",ke=null}function vo(e){const t=xn(),n=t[e.storyId]??[];n.push({date:new Date().toISOString(),wpm:e.wpm??e.wcpm??null,wcpm:e.wcpm??null,errors:e.errors??null,accuracy:e.accuracy??null,support:e.support??null,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),n.length>Ft&&n.splice(0,n.length-Ft),t[e.storyId]=n,ko(t)}function So(e){return xn()[e]??[]}function D(e){Ye=e,ke==null||ke(e)}function ut(){ce&&(ce.getTracks().forEach(e=>e.stop()),ce=null)}function $o(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function xn(){try{return JSON.parse(localStorage.getItem(vn)??"{}")}catch{return{}}}let Gt=!1;function ko(e){try{localStorage.setItem(vn,JSON.stringify(e))}catch{if(Gt)return;Gt=!0;const t=document.getElementById("toast-container");if(!t)return;const n=document.createElement("div");n.className="toast toast--warning",n.setAttribute("role","alert"),n.textContent="Device storage full — reading history may not be saved.",t.appendChild(n),setTimeout(()=>n.remove(),8e3)}}const Ln="/phonicsquest/";function Eo(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return je.find(n=>n.word===t)??null}let w=null,G="A",jt=!1,ie="band",ve="aloud",qe=!1,le=null,Pe=[],_=null,W="word",Ie=!1,fe=-1,Re=[],Ee=0,Ve=[],Je=0,Te=0;const qn="giri_stories_read";function z(){try{return JSON.parse(localStorage.getItem(qn)??"[]")}catch{return[]}}function Be(e){const t=z();t.includes(e)||(t.push(e),localStorage.setItem(qn,JSON.stringify(t))),vt(e),mo(e)}let He=null,xe=null,Fe=!1,Ne=0;const kt="giri_show_graphemes",In="giri_show_ruler",Tn="giri_ruler_mode",Et="giri_follow_mode",_n="giri_meet_words",Dt="giri_comp_log";let C=Qe(kt,!0),ee=Qe(In,!1),L=null,Y=null,pt=Qe(Tn,"line"),te=null,_e=0,O=null;W=Qe(Et,"word");function Qe(e,t){try{const n=localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function ue(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const An=new Set;function Rn(){return new Date().toISOString().slice(0,10)}function Bn(){try{const e=localStorage.getItem(_n);return e?JSON.parse(e):{}}catch{return{}}}function xo(e){try{localStorage.setItem(_n,JSON.stringify(e))}catch{}}function Lo(e){return An.has(e)?!0:Bn()[e]===Rn()}function zt(e){An.add(e);const t=Bn();t[e]=Rn();const n=Date.now()-30*24*60*60*1e3;for(const[s,o]of Object.entries(t))(!o||Date.parse(o)<n)&&delete t[s];xo(t)}const Ut=new Set,qo=100;function ot(e){try{const t=localStorage.getItem(Dt),n=t?JSON.parse(t):[];for(n.push({ts:Date.now(),...e});n.length>qo;)n.shift();localStorage.setItem(Dt,JSON.stringify(n))}catch{}}function ar(e,t){w=e}function ir(){R(),me()}function lr(){R(),gt(),En(),Lt(),Xe()}function Xe(){le==null||le.remove(),le=null}function me(){var n,s,o;Xe(),ge(),Mn(),_=null;const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${ie==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${ie==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${ie==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${Jo()}</button>
    </div>
  `;let t;if(ie==="band"){if(!jt){jt=!0;try{const d={};for(const p of V)(d[n=p.band]??(d[n]=[])).push(p);G=xs(z(),d)||G}catch{}}const r=j.find(d=>d.band===G)??j[0],a=V.filter(d=>d.band===G&&d.category!=="chapter"&&d.category!=="nonfiction-sg"),i=z(),l=a.filter(d=>i.includes(d.id)).length,c=ln(),u=j.map(d=>{var p,m,g;return`
      <button
        class="story-tab${d.band===G?" active":""}${(p=c[d.band])!=null&&p.ready?"":" story-tab--not-ready"}"
        data-band="${d.band}"
        style="--tab-color:${d.color}"
        ${(m=c[d.band])!=null&&m.ready?"":`title="${c[d.band].hint}"`}
      >
        <span class="story-tab-num">${d.band}</span>
        <span class="story-tab-name">${d.label}</span>
        ${(g=c[d.band])!=null&&g.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),h=a.map(d=>rt(d,r,!1,i.includes(d.id))).join(""),f=a.length?Math.round(l/a.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${u}</div>
      <div class="stories-level-strip"
           style="--level-color:${r.color};--level-bg:${r.bg}">
        <span class="slstrip-label">Band ${G}</span>
        <span class="slstrip-name">${r.label}</span>
        <span class="slstrip-sounds">${r.targetSounds}</span>
        <span class="slstrip-prop">${r.prop}</span>
        <span class="slstrip-progress" title="${l} of ${a.length} stories read">
          ${l}/${a.length} read
          <span class="slstrip-progress-bar" style="--pct:${f}%"></span>
        </span>
      </div>
      ${(s=c[G])!=null&&s.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[G].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${h}</div>
    `}else if(ie==="singapore"){const r=V.filter(l=>l.category==="nonfiction-sg"),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${r.map(l=>{const c=j.find(u=>u.band===l.band)??j[0];return rt(l,c,!1,a.includes(l.id))}).join("")}</div>
    `}else{const r=V.filter(l=>l.category==="chapter").sort((l,c)=>(l.chapterNum??0)-(c.chapterNum??0)),a=z();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${r.map(l=>{const c=j.find(u=>u.band===l.band)??j[0];return rt(l,c,!0,a.includes(l.id))}).join("")}</div>
    `}w.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,w.querySelectorAll(".sb-cat-tab[data-cat]").forEach(r=>{r.addEventListener("click",()=>{ie=r.dataset.cat,me()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{Qo()}),w.querySelectorAll(".story-tab").forEach(r=>{r.addEventListener("click",()=>{G=r.dataset.band,me()})}),w.querySelectorAll(".story-card").forEach(r=>{r.addEventListener("click",()=>xt(r.dataset.storyId))})}function rt(e,t,n=!1,s=!1){var i;const o=(i=e.comprehension)!=null&&i.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",r=n?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",a=s?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${n?" story-card--chapter":""}${s?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${Ln}images/stories/${e.illustration}"
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
        ${Vt(e)==="adult-supported"?'<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>':(()=>{const l=Jt(e).length;return l?`<span class="story-card-support" data-support="independent">👀 ${l} new ${l===1?"word":"words"}</span>`:'<span class="story-card-support" data-support="independent">🙋 Read by myself</span>'})()}
      </div>
    </button>
  `}function xt(e){const t=V.find(n=>n.id===e);t&&(R(),te=z().includes(t.id)?null:Es(t.id),be.clear(),Io(t))}function Io(e){var n,s,o;_=e;const t=j.find(r=>r.band===e.band)??j[(e.level??1)-1];w.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${Ln}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
        ${Vt(e)==="adult-supported"?'<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>':'<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>'}
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      ${(()=>{const r=Jt(e);return r.length?`
          <div class="story-prep" aria-labelledby="story-prep-title">
            <p class="story-prep-title" id="story-prep-title">
              👀 Words to know first — tap to hear
            </p>
            <div class="story-prep-words">${r.map(({word:i,display:l,status:c})=>`<button type="button" class="story-prep-word" data-prep-word="${se(i)}"
                       data-status="${se(c)}" aria-label="Hear the word ${se(l)}"
                >${bt(l)}</button>`).join("")}</div>
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
  `,(n=document.getElementById("btn-reader-back"))==null||n.addEventListener("click",()=>{R(),me()}),w.querySelectorAll("[data-prep-word]").forEach(r=>{r.addEventListener("click",()=>{var a,i;(i=(a=oe.speakSightWord(r.dataset.prepWord))==null?void 0:a.catch)==null||i.call(a,()=>{}),r.classList.add("story-prep-word--said"),setTimeout(()=>r.classList.remove("story-prep-word--said"),600)})}),(s=document.getElementById("btn-mode-aloud"))==null||s.addEventListener("click",()=>{ve="aloud",R(),Yt("aloud"),Le(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{ve="decode",R(),Yt("decode"),Le(e)}),Le(e)}function Le(e){Lo(e.id)?ve==="aloud"?Ae(e):Fn(e):To(e)}function Yt(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function To(e){var d,p;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Pe=e.vocab??[];const n=Qt(e),s=e.lines.map(m=>m.text??"").join(" ").toLowerCase(),o=Pe.filter(m=>{const g=m.word.toLowerCase().split(/\s+/)[0];return s.includes(g)});if(!n.length&&!o.length){zt(e.id),Le(e);return}const r=n.length+o.length,i=Math.min(3,r),l=new Set,c=n.map(m=>`
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
  `;function h(m){const g=m.dataset.tapId;if(l.has(g))return;l.add(g),m.setAttribute("data-tapped","true");const b=document.getElementById("gate-progress");if(b&&(b.textContent=l.size>=i?`✓ Warmed up (${l.size} tapped) — keep going or start the story`:`${l.size} of ${i} tapped`),l.size>=i){const E=document.getElementById("gate-continue");E&&(E.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(m=>{m.addEventListener("click",async()=>{mt(m);try{await oe.speakWord(m.dataset.word)}catch{}h(m)})});const f=()=>{zt(e.id),Le(e)};(d=document.getElementById("gate-skip"))==null||d.addEventListener("click",f),(p=document.getElementById("gate-continue"))==null||p.addEventListener("click",f)}function Oe(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,n)=>t+n.text.trim().split(/\s+/).length,0)}function Ae(e){var c,u,h,f,d,p,m,g,b,E;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Xe();const n=e.lines.map((v,y)=>Wo(v,y,!0,e)).join(""),s=!!((c=e.comprehension)!=null&&c.length),r=!!((u=e.talkAboutIt)!=null&&u.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(v=>`<li>${v}</li>`).join("")}
      </ul>
    </div>
  `:"",a=So(e.id),i=a.length?`
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

      ${C?Pn():""}

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
              <span class="rtg-label">${Vn("encourage",18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${fs()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(v=>{v.addEventListener("click",()=>{W=v.dataset.follow,ue(Et,W),Ae(e)})}),t.querySelectorAll(".wf-word").forEach(v=>{v.setAttribute("role","button"),v.setAttribute("tabindex","0");const y=S=>{const I=It(v);I&&(S.preventDefault(),L==null||L.tap(S.clientY??0,v),Do(I))};v.addEventListener("click",y),v.addEventListener("keydown",S=>{(S.key==="Enter"||S.key===" ")&&y(S)})}),(h=document.getElementById("btn-toggle-graphemes"))==null||h.addEventListener("click",()=>{C=!C,ue(kt,C),Ae(e)}),(f=document.getElementById("btn-toggle-ruler"))==null||f.addEventListener("click",()=>{var v,y;ee=!ee,ue(In,ee),(v=document.getElementById("btn-toggle-ruler"))==null||v.setAttribute("aria-pressed",String(ee)),ge(),ee&&(ft(),(y=document.getElementById("btn-ruler-next"))==null||y.focus({preventScroll:!0}))}),ee?requestAnimationFrame(()=>ft(te)):te!==null&&requestAnimationFrame(()=>ht(te)),Ao(e),(d=document.getElementById("btn-resume-restart"))==null||d.addEventListener("click",v=>{var y;vt(e.id),te=null,(y=v.currentTarget.closest(".story-resume"))==null||y.remove(),ht(0),L&&L.goTo(0)}),Ro(),(p=document.getElementById("btn-story-play"))==null||p.addEventListener("click",()=>jn(e)),(m=document.getElementById("btn-story-stop"))==null||m.addEventListener("click",()=>R());const l=Oe(e);(g=document.getElementById("btn-fluency-start"))==null||g.addEventListener("click",()=>er()),(b=document.getElementById("btn-fluency-done"))==null||b.addEventListener("click",()=>gt(l)),tr(l,e),Xo(e),Lt(),Mo(e),Zo(e),(E=document.getElementById("btn-launch-quest"))==null||E.addEventListener("click",()=>{R(),gt(),En(),Be(e.id),rs(w,e,()=>{me()})})}let at="";function _o(e){Cn();const t=w==null?void 0:w.querySelector(`#story-body [data-line="${e.line}"]`);if(!t)return;const n=[...t.querySelectorAll(".wf-word")].filter(s=>{const o=Number(s.dataset.wordIdx);return o>=e.from&&o<=e.to});n.length&&(n.forEach(s=>s.classList.add("is-clue")),L?L.follow(n[0]):n[0].scrollIntoView({behavior:Q(),block:"center"}))}function Cn(){w==null||w.querySelectorAll(".wf-word.is-clue").forEach(e=>e.classList.remove("is-clue"))}function ht(e){const t=w==null?void 0:w.querySelectorAll("#story-body .wf-word"),n=t==null?void 0:t[Math.max(0,Math.min(((t==null?void 0:t.length)??1)-1,e))];n&&(n.scrollIntoView({behavior:Q(),block:"center"}),n.classList.add("wf-word--resumed"),setTimeout(()=>n.classList.remove("wf-word--resumed"),2600))}function Ao(e){Mn();const t=document.getElementById("story-body");if(!t)return;const n=ze(t);n&&(O=n,O._pqPlaceHandler=()=>{clearTimeout(_e),_e=setTimeout(()=>{if(L||z().includes(e.id))return;const s=t.getBoundingClientRect(),o=Hn();if(s.bottom<o.top||s.top>o.bottom)return;const a=[...t.querySelectorAll(".wf-word")].findIndex(i=>i.getBoundingClientRect().top>=o.top);a>=0&&an(e.id,a)},500)},n.addEventListener("scroll",O._pqPlaceHandler,{passive:!0}))}function Ro(){const e=document.getElementById("story-resume");if(!e)return;const t=ze(e);let n=0;const s=()=>{clearTimeout(n),t==null||t.removeEventListener("scroll",r),e.remove()};let o=!1;setTimeout(()=>{o=!0},1200);const r=()=>{o&&s()};t==null||t.addEventListener("scroll",r,{passive:!0}),n=setTimeout(s,9e3)}function Mn(){clearTimeout(_e),O!=null&&O._pqPlaceHandler&&(O.removeEventListener("scroll",O._pqPlaceHandler),delete O._pqPlaceHandler),O=null}function Hn(){const e=document.getElementById("story-body"),t=e?ze(e):null,n=t==null?void 0:t.getBoundingClientRect(),s=document.querySelector(".app-header"),o=document.querySelector(".ruler-nav"),r=Math.max((n==null?void 0:n.top)??0,(s==null?void 0:s.getBoundingClientRect().bottom)??0)+12,a=Math.min((n==null?void 0:n.bottom)??window.innerHeight,window.innerHeight),i=(o?Math.min(o.getBoundingClientRect().top,a):a)-12;return{top:Math.max(0,r),bottom:Math.max(i,r+120)}}function Ge(){return Se.find(e=>e.id===pt)??Se[1]}function Bo(){const e=Ge();return`
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${se(e.label)}. Tap to change."
              title="${se(e.hint)}">
        <span class="rs-i" aria-hidden="true">${e.icon}</span><small>${bt(e.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`}function ft(e=null){const t=document.getElementById("story-body"),n=document.getElementById("ruler-nav-slot");if(!t||!n)return;n.innerHTML=Bo();const s=Ge(),o=n.querySelector(".ruler-pos small"),r=n.querySelector(".ruler-pos b"),a=n.querySelector("#btn-ruler-next"),i=n.querySelector("#btn-ruler-back");L=ws(t,{mode:s.id,word:e,wordSelector:".wf-word",safeArea:Hn,onMove(l){Y=l;const c=s.id==="word";o.textContent=c?"Word":"Line",r.textContent=c?`${l.word+1} / ${l.words}`:`${l.line+1} / ${l.lines}`,i.disabled=c?l.word===0:l.line===0,a.textContent=l.atEnd?"The end ✓":c?"Next word ▶":"Next line ▶",a.classList.toggle("is-end",l.atEnd),clearTimeout(_e),_e=setTimeout(()=>{z().includes((_==null?void 0:_.id)??"")||an(_==null?void 0:_.id,l.word)},400)}}),i.addEventListener("click",()=>L==null?void 0:L.prev()),a.addEventListener("click",()=>{if(!(Y!=null&&Y.atEnd))return L==null?void 0:L.next();const l=_;if(!l)return;Be(l.id);const c=document.getElementById("story-quest-cta");c&&(c.hidden=!1),_t(l),Tt(l)}),n.querySelector("#btn-ruler-style").addEventListener("click",()=>{var u;const l=(Y==null?void 0:Y.word)??0,c=Se.indexOf(Ge());pt=Se[(c+1)%Se.length].id,ue(Tn,pt),ge(),ft(l),(u=document.getElementById("btn-ruler-style"))==null||u.focus({preventScroll:!0})})}function ge(){L==null||L.destroy(),L=null,Y=null;const e=document.getElementById("ruler-nav-slot");e&&(e.innerHTML="")}function Co(e){var s,o;if(!L||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(o=(s=e.target)==null?void 0:s.closest)!=null&&o.call(s,'input, textarea, select, summary, [contenteditable="true"]')||document.querySelector(".modal.active, .modal[open]"))return;const t=Ge().id==="word",n={ArrowDown:()=>L.nextLine(),ArrowUp:()=>L.prevLine(),ArrowRight:()=>t?L.next():L.nextLine(),ArrowLeft:()=>t?L.prev():L.prevLine()}[e.key];n&&(e.preventDefault(),n())}document.addEventListener("keydown",Co);function Mo(e){var t,n,s,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>Ho(e)),(n=document.getElementById("btn-rtg-listen"))==null||n.addEventListener("click",()=>No(e)),(s=document.getElementById("btn-rtg-next"))==null||s.addEventListener("click",()=>Wn(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{Lt(),Ae(e)})}function K(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function Nn(){const e=Re[fe];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function Ho(e){var n,s,o;if(W!=="word"){W="word",ue(Et,W),Ae(e);const r=document.getElementById("practice-drawer");r&&(r.open=!0);const a=document.getElementById("rtg-bar");a&&(a.open=!0)}R();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(r=>r.querySelector(".wf-word")).map(r=>Number(r.dataset.line));t.length!==0&&(Ie=!0,Re=t,fe=0,Ee=0,Ve=[],Je=0,Te=0,(n=document.getElementById("btn-rtg-start"))==null||n.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),On(),K("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function On(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=Nn();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:Q()}))}async function No(e){var u;const t=Nn(),n=document.getElementById("btn-rtg-listen");if(!t||!n||n.disabled)return;const s=Array.from(t.querySelectorAll(".wf-word")),o=s.map(It).filter(Boolean).join(" ");if(!o){Wn(e);return}n.disabled=!0,n.replaceChildren(Xn("encourage"),document.createTextNode("Giri is listening…")),K("Go ahead — read the glowing line now.");const r=await ms(o);if(n.disabled=!1,n.textContent="🎙 Read this line",!Ie)return;if(!r){Ee++,Ee>=2?K("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):K("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Ee=0;const a=[];r.words.forEach((h,f)=>{const d=s[f];if(d)if(d.classList.remove("rtg-word--match","rtg-word--check"),h.status==="miss"){d.classList.add("rtg-word--check");const p=h.word.replace(/[^a-z]/g,"");p.length>2&&(a.push(p),sn(p))}else d.classList.add("rtg-word--match")});const i=r.words.filter(h=>h.status!=="miss").length;Je+=i,Te+=r.words.length,Ve.push(...a);const l=fe>=Re.length-1;a.length>0?K(`Nice reading! Let's check the orange ${a.length===1?"word":"words"} together — tap ${a.length===1?"it":"each one"} to hear it. Then ${l?"finish up":"go on"}!`):K("⭐ Great — Giri heard every word!"),(u=document.getElementById("btn-rtg-listen"))==null||u.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=l?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Wn(e){var t,n;if(fe>=Re.length-1){Oo(e);return}fe++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),On(),K("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Oo(e){var i,l;const t=Te>0?Math.round(Je/Te*100):0,n=[...new Set(Ve)],s={...pe.get("readAloudStats")||{}},o=s[e.id]||{attempts:0};s[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:n.slice(0,12),updatedAt:new Date().toISOString()},pe.set("readAloudStats",s),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(i=document.getElementById("btn-rtg-next"))==null||i.setAttribute("hidden",""),(l=document.getElementById("btn-rtg-exit"))==null||l.setAttribute("hidden","");const r=document.getElementById("btn-rtg-start");r&&(r.removeAttribute("hidden"),r.textContent="Read it again");const a=n.length?` Words to practise: <strong>${n.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";K(`🌟 You read the whole story to Giri — ${t}% heard clearly.${a}`),Be(e.id),Ie=!1}function Lt(){Ie&&gs(),Ie=!1,fe=-1,Re=[],Ee=0,Ve=[],Je=0,Te=0}function qt(e){return!C||!e?e:zs(e)}function Pn(){return`<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b> and a long vowel wears <b class="vs--long">¯</b>:</span>
      ${Ls.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}
    </div>`}function Wo(e,t,n=!1,s=null){const o=e.text??"";if(e.type==="label")return`<div class="sline sline--label" data-line="${t}">${bt(o)}</div>`;const r=s?qt(o,s.targetGraphemes,s.band):o,a=n?Po(o,s):r;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${a}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${a}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${a}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${a}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${a}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${a}</p>`;default:return`<p class="sline"                    data-line="${t}">${a}</p>`}}function Po(e,t=null){if(!e)return"";const n=yt(e);let s=0;return n.map(o=>{if(o.type==="word"){const r=t?qt(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${s++}" data-plain="${se(o.text)}" aria-label="${se(o.text)}">${r}</span>`}return o.text}).join("")}function It(e){var t;return(((t=e==null?void 0:e.dataset)==null?void 0:t.plain)??(e==null?void 0:e.textContent)??"").trim()}function Fn(e){var c,u,h,f;const t=document.getElementById("story-dynamic");if(!t)return;ge(),Xe(),Pe=e.vocab??[];const s=Qt(e).map(d=>`
    <button class="hfw-chip" data-word="${d}" aria-label="Hear sight word ${d}">
      ⭐ ${d}
    </button>
  `).join(""),o=e.lines.map(d=>d.text??"").join(" ").toLowerCase(),a=Pe.filter(d=>{const p=d.word.toLowerCase().split(/\s+/)[0];return o.includes(p)}).map(d=>`
    <button class="vocab-chip" data-word="${d.word}" aria-label="Key word: ${d.word}">
      <span class="vocab-chip-icon">${d.icon}</span>
      <span class="vocab-chip-word">${d.word}</span>
      <span class="vocab-chip-meaning">${d.meaning}</span>
    </button>
  `).join(""),i=e.lines.map((d,p)=>{if(d.type==="label")return`<div class="sline sline--label" data-line="${p}">${d.text}</div>`;const g=yt(d.text).map(E=>{if(E.type==="word"){const v=E.text.toLowerCase().replace(/[^a-z]/g,""),y=Xt(v),S=qt(E.text,e.targetGraphemes,e.band);return`<button class="decode-word${y?" decode-hfw":""}"
                         data-word="${E.text}"
                         aria-label="${y?"Sight word: ":"Decode: "}${E.text}"
                >${S}</button>`}return`<span class="decode-punct">${E.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[d.type]??""} decode-line" data-line="${p}">${g}</p>`}).join("");t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${C}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
      </div>
      ${C?Pn():""}

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
  `,(c=document.getElementById("btn-toggle-graphemes-decode"))==null||c.addEventListener("click",()=>{C=!C,ue(kt,C),Fn(e)}),(u=document.getElementById("btn-hfw-toggle"))==null||u.addEventListener("click",()=>{const d=document.getElementById("hfw-chip-list"),p=document.getElementById("btn-hfw-toggle"),m=p.getAttribute("aria-expanded")==="true";d.hidden=m,p.setAttribute("aria-expanded",String(!m)),p.textContent=m?"Show ▼":"Hide ▲"}),(h=document.getElementById("btn-vocab-toggle"))==null||h.addEventListener("click",()=>{const d=document.getElementById("vocab-chip-list"),p=document.getElementById("btn-vocab-toggle"),m=p.getAttribute("aria-expanded")==="true";d.hidden=m,p.setAttribute("aria-expanded",String(!m)),p.textContent=m?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(d=>{d.addEventListener("click",()=>{var g,b;const p=d.dataset.word;mt(d);const m=new SpeechSynthesisUtterance(p);m.rate=.85,J(m),(g=window.speechSynthesis)==null||g.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),t.querySelectorAll(".vocab-chip").forEach(d=>{d.addEventListener("click",()=>{var g,b;const p=d.dataset.word;mt(d),d.classList.toggle("vocab-chip--expanded");const m=new SpeechSynthesisUtterance(p);m.rate=.85,J(m),(g=window.speechSynthesis)==null||g.cancel(),(b=window.speechSynthesis)==null||b.speak(m)})}),(f=document.getElementById("btn-mark-read"))==null||f.addEventListener("click",d=>{Be(e.id);const p=d.currentTarget;p.textContent="✓ Read!",p.disabled=!0,p.classList.add("btn--success"),_t(e),Tt(e)});const l=document.getElementById("decode-panel");l&&(l.remove(),document.body.appendChild(l)),le=l,t.querySelectorAll(".decode-word").forEach(d=>{d.addEventListener("click",()=>Fo(d))})}async function Fo(e){var a,i,l,c;document.querySelectorAll(".decode-word.decoding").forEach(u=>u.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,n=t.toLowerCase().replace(/[^a-z]/g,"");n&&be.add(n);const s=Eo(t),o=!s&&Xt(n),r=le;if(r){if(r.removeAttribute("hidden"),o){it({type:"hfw",word:n});const u=new SpeechSynthesisUtterance(n);u.rate=.85,J(u),(a=window.speechSynthesis)==null||a.cancel(),(i=window.speechSynthesis)==null||i.speak(u)}else if(!it({type:"decode",word:(s==null?void 0:s.word)??n,wordObj:s??{word:n}})){it({type:"tts",word:n});const h=new SpeechSynthesisUtterance(n);h.rate=.85,J(h),(l=window.speechSynthesis)==null||l.cancel(),(c=window.speechSynthesis)==null||c.speak(h)}}}function it({type:e,word:t,wordObj:n}){var o,r;const s=document.getElementById("decode-panel-inner");return s?e==="hfw"?(s.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(o=document.getElementById("dp-hear"))==null||o.addEventListener("click",()=>{var i,l;const a=new SpeechSynthesisUtterance(t);a.rate=.85,J(a),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(a)}),!0):e==="tts"?(s.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(r=document.getElementById("dp-hear"))==null||r.addEventListener("click",()=>{var i,l;const a=new SpeechSynthesisUtterance(t);a.rate=.85,J(a),(i=window.speechSynthesis)==null||i.cancel(),(l=window.speechSynthesis)==null||l.speak(a)}),!0):(s.innerHTML="",Gn(s,n)):!1}function Gn(e,t,n=!0){var a;const s=n&&((a=t.graphemes)!=null&&a.length)?{graphemes:t.graphemes,types:t.types}:no(t.word);if(!s)return!1;const{graphemes:o,types:r}=so(s.graphemes,s.types);return Ks(e,{word:t.word,graphemes:o,types:r,speakPhoneme:(i,l,c)=>oe.speakPhoneme(i,l,{word:t.word,prevGrapheme:c.index>0?o[c.index-1]:null}),speakWord:i=>oe.speakWord(i)}),!0}function mt(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function Go(e){const t=[],n=e.lines;let s=0;for(;s<n.length;){const o=n[s];if(o.type==="label"){const r=n[s+1];if(r&&r.type==="beat"){t.push({text:`${o.text} ${r.text}`,highlightIdx:s+1}),s+=2;continue}s++;continue}t.push({text:o.text,highlightIdx:s}),s++}return t}function jn(e){if(!window.speechSynthesis)return;R(),_=e,At(!0),qe=!0;const t=Go(e);Dn(t,0)}function Dn(e,t){if(!qe||t>=e.length){Kt();return}const n=e[t];Yo(n.highlightIdx);const s=new SpeechSynthesisUtterance(n.text);s.rate=.82,J(s);const o=n.text.startsWith("Puff")?600:380;W==="word"&&jo(s,n.highlightIdx),s.onend=()=>{Ze(),qe&&setTimeout(()=>Dn(e,t+1),o)},s.onerror=()=>Kt(),window.speechSynthesis.speak(s)}function jo(e,t){const n=w==null?void 0:w.querySelector(`[data-line="${t}"]`);if(!n)return;const s=n.querySelectorAll(".wf-word");if(s.length===0)return;const o=e.text||"";let r=!1,a=-1,i=[],l=!1;function c(d){if(d<0||d>=s.length||d===a)return;a=d,s.forEach(m=>m.classList.remove("wf-word--active"));const p=s[d];p.classList.add("wf-word--active"),L?L.follow(p):Uo(p)}function u(){for(const d of i)clearTimeout(d);i=[]}function h(){var g;if(l)return;l=!0;const d=typeof e.rate=="number"&&e.rate>0?e.rate:.82,p=Array.from(s,It);let m=0;for(let b=0;b<s.length;b++){const E=b,v=((g=p[b])==null?void 0:g.length)||3,y=Math.max(160,Math.round((90+v*60)/d)),S=setTimeout(()=>{r||c(E)},m);i.push(S),m+=y}}e.addEventListener("boundary",d=>{d.name&&d.name!=="word"||(r=!0,u(),c(as(o,d.charIndex??-1)))}),e.addEventListener("end",()=>{u()}),e.addEventListener("start",()=>{if(r)return;const d=setTimeout(()=>{r||(c(0),h())},180);i.push(d)});const f=setTimeout(()=>{r||l||(c(0),h())},800);i.push(f)}function Do(e){var a;const t=document.getElementById("word-detective-content");if(!t)return;be.add(e.toLowerCase().replace(/[^a-z']/g,"")),R();const n=cs(e);t.innerHTML=zo(n),we.open("modal-word-detective");const s=t.querySelector('[data-role="ladder"]');if(!(s&&Gn(s,{word:n.text,graphemes:n.graphemes,types:n.types},n.foundInBank))){const i=t.querySelector(".wd-fallback");i&&(i.hidden=!1);try{oe.speakWord(n.text)}catch{}}(a=t.querySelector('[data-action="hear"]'))==null||a.addEventListener("click",()=>{try{oe.speakWord(n.text)}catch{}});const r=t.querySelector('[data-action="add-review"]');r==null||r.addEventListener("click",()=>{if(!n.word)return;sn(n.word.id)&&(r.disabled=!0,r.textContent="✓ In your Review Lane")})}function zo(e){const t=r=>String(r??"").replace(/[<>&]/g,a=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[a]),n=fn(e.text,e.graphemes,e.types),s=e.graphemes.map((r,a)=>{const i=he[n[a]]??he.consonant,l=i.mark?` data-mark="${t(i.mark)}"`:"";return`<span class="wd-tile vs--${n[a]}"${l} style="--tile-color:${i.color}" aria-label="${t(r)}, ${t(i.label)}">${t(r)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
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
    </div>`}function Q(){return Qn()?"auto":"smooth"}function Uo(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight;is(t,n)&&e.scrollIntoView({block:"center",behavior:Q()})}catch{}}function Ze(){w==null||w.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function Yo(e){w==null||w.querySelectorAll(".sline--active").forEach(n=>n.classList.remove("sline--active")),Ze();const t=w==null?void 0:w.querySelector(`[data-line="${e}"]`);if(t){t.classList.add("sline--active");const n=t.querySelector(".wf-word");L&&n?L.follow(n):t.scrollIntoView({behavior:Q(),block:"nearest"})}}function J(e){var n,s;let t;try{t=((s=(n=oe).getTtsVoice)==null?void 0:s.call(n))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function R(){var e;qe=!1,(e=window.speechSynthesis)==null||e.cancel(),w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ze(),At(!1)}function Kt(){qe=!1,w==null||w.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),Ze(),At(!1),_&&Be(_.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),_&&_t(_),_&&Tt(_)}const be=new Set;function Ko(e){const t=V.filter(s=>s.band===e.band&&s.category===e.category&&s.id!==e.id),n=z();return t.find(s=>!n.includes(s.id))??t[0]??null}function Vo(e){var s,o;const t=[T`You read <strong>${e.title}</strong> — ${Oe(e)} words.`];if(be.size){const r=be.size;t.push(T`You worked out ${r} ${r===1?"word":"words"} by sounding
      ${r===1?"it":"them"} out.`)}(e.roles||(s=e.talkAboutIt)!=null&&s.length)&&t.push(T`You had a think about what happened.`);const n=go(e.id)?(o=yn(e))==null?void 0:o.name:"";return n&&t.push(T`<strong>${n}</strong> has joined your 🐾 Friends.`),t}function Tt(e){var o,r,a;if(!e)return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".story-ending"))return;const n=Ko(e),s=document.createElement("section");s.className="story-ending",s.setAttribute("aria-label","You finished the story"),s.innerHTML=T`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${Vo(e).map(i=>T`<li>${i}</li>`)}
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
  `,t.appendChild(s),s.scrollIntoView({behavior:Q(),block:"nearest"}),(o=s.querySelector("#btn-ending-again"))==null||o.addEventListener("click",()=>{be.clear(),vt(e.id),te=null,s.remove(),ht(0),L&&L.goTo(0)}),(r=s.querySelector("#btn-ending-next"))==null||r.addEventListener("click",i=>{R(),xt(i.currentTarget.dataset.storyId)}),(a=s.querySelector("#btn-ending-done"))==null||a.addEventListener("click",()=>{R(),me()})}function _t(e){var a,i,l;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Ut.has(e.id))return;const t=w==null?void 0:w.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Ut.add(e.id);const n=e.talkAboutIt[0];at=n;const s=e.talkAboutIt[1]||"",o=document.createElement("div");o.className="comp-check",o.setAttribute("role","region"),o.setAttribute("aria-label","Comprehension check"),o.innerHTML=`
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
  `,t.appendChild(o),o.scrollIntoView({behavior:Q(),block:"nearest"});const r=o.querySelector("#comp-feedback");o.querySelectorAll(".comp-choice").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.resp;if(ot({storyId:e.id,question:n,response:u}),o.querySelectorAll(".comp-choice").forEach(f=>f.disabled=!0),c.classList.add("correct"),u==="confident")r.textContent="👍 Great! You understood the story.";else if(u==="reread")r.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>jn(e),300);else{const f=tn(e,at||n);f?(r.textContent="💡 Have a look at the sentence we have lit up.",_o(f)):r.textContent="💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer."}r.hidden=!1;const h=o.querySelector("#comp-more");h&&(h.hidden=!1)})}),(i=o.querySelector("#comp-more"))==null||i.addEventListener("click",()=>{var u;const c=o.querySelector("#comp-q");c&&(c.textContent=s),at=s,Cn(),ot({storyId:e.id,question:s,response:"followup"}),(u=o.querySelector("#comp-more"))==null||u.remove(),r&&(r.textContent="💭 Have a think, then tell someone your answer.",r.hidden=!1),o.querySelectorAll(".comp-choice").forEach(h=>{h.disabled=!1,h.classList.remove("correct")})}),(l=o.querySelector("#comp-skip"))==null||l.addEventListener("click",()=>{ot({storyId:e.id,question:n,response:"skipped"}),o.remove()})}function Jo(){try{const e=wn(V);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function Qo(){var a,i;(a=document.getElementById("modal-story-friends"))==null||a.remove();const e=wn(V),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const n=l=>String(l??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),s=new Map;for(const l of e.roster)s.has(l.band)||s.set(l.band,[]),s.get(l.band).push(l);const o=Array.from(s.entries()).sort((l,c)=>String(l[0]).localeCompare(String(c[0]))).map(([l,c])=>{const u=c.filter(f=>f.unlocked).length,h=c.map(f=>`
        <button class="sf-tile ${f.unlocked?"sf-tile--unlocked":"sf-tile--locked"}"
                data-story-id="${n(f.storyId)}"
                ${f.unlocked?"":'disabled aria-disabled="true"'}
                aria-label="${f.unlocked?`${n(f.name)} from ${n(f.storyTitle)} — tap to re-read`:`Locked — read ${n(f.storyTitle)} to meet ${n(f.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${f.unlocked?n(f.emoji):"🔒"}</span>
          <span class="sf-tile__name">${f.unlocked?n(f.name):"???"}</span>
          ${f.unlocked?`<span class="sf-tile__story">from ${n(f.storyTitle)}</span>`:`<span class="sf-tile__story">${n(f.storyTitle)}</span>`}
        </button>
      `).join("");return`
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${n(l)} <small>${u}/${c.length} met</small></h3>
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
    </div>`,document.body.appendChild(t),we.open("modal-story-friends"),(i=t.querySelector("[data-close]"))==null||i.addEventListener("click",()=>{we.close("modal-story-friends"),t.remove()}),t.addEventListener("click",l=>{l.target===t&&(we.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.storyId;c&&(we.close("modal-story-friends"),t.remove(),xt(c))})})}function At(e){const t=document.getElementById("btn-story-play"),n=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),n&&(n.style.display=e?"":"none");const s=w==null?void 0:w.querySelector(".story-reader");s&&s.classList.toggle("story-reader--listening",e)}function Xo(e){const t=document.getElementById("btn-rec-start"),n=document.getElementById("btn-rec-stop"),s=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),r=document.getElementById("recording-status");if(!t)return;function a(i){if(t.hidden=i!=="idle",n.hidden=i!=="recording",s.hidden=i!=="recorded"&&i!=="playing",o.hidden=i!=="recorded"&&i!=="playing",r)switch(i){case"recording":r.textContent="🔴 Recording...",r.className="recording-status recording-status--active";break;case"recorded":r.textContent="✓ Recording ready",r.className="recording-status recording-status--ready";break;case"playing":r.textContent="▶ Playing...",r.className="recording-status recording-status--playing";break;case"error":r.textContent="⚠ Microphone not available — check permissions",r.className="recording-status recording-status--error";break;default:r.textContent="",r.className="recording-status";break}s&&(s.textContent=i==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await Sn({storyId:e.id,onStateChange:a})||a("error")}),n.addEventListener("click",()=>{We()}),s.addEventListener("click",()=>{kn()==="playing"?(Ke(),a("recorded")):$n()}),o.addEventListener("click",()=>{dt(),a("idle")})}function Zo(e){const t=document.getElementById("btn-echo-start"),n=document.getElementById("btn-echo-next"),s=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),r=document.getElementById("btn-echo-stop"),a=document.getElementById("echo-read-status");if(!t)return;const i=e.lines.map((h,f)=>({...h,idx:f})).filter(h=>h.type!=="label"&&h.type!=="chapter"&&h.text);let l=-1;function c(){t.hidden=!1,n.hidden=!0,s.hidden=!0,o.hidden=!0,r.hidden=!0,a&&(a.textContent="",a.className="echo-read-status"),w==null||w.querySelectorAll(".sline--echo-active").forEach(h=>h.classList.remove("sline--echo-active")),l=-1}function u(h){var m,g;l=h;const f=i[h];if(!f){c();return}f.idx,w==null||w.querySelectorAll(".sline--echo-active").forEach(b=>b.classList.remove("sline--echo-active"));const d=w==null?void 0:w.querySelector(`[data-line="${f.idx}"]`);d&&(d.classList.add("sline--echo-active"),d.scrollIntoView({behavior:Q(),block:"nearest"})),a&&(a.textContent=`Line ${h+1} of ${i.length}`,a.className="echo-read-status echo-read-status--active"),n.hidden=!0,s.hidden=!0,o.hidden=!0;const p=new SpeechSynthesisUtterance(f.text);p.rate=.82,J(p),p.onend=()=>{s.hidden=!1,s.textContent="🎙 Your Turn",a&&(a.textContent=`Your turn! Read line ${h+1}`)},p.onerror=()=>{s.hidden=!1},(m=window.speechSynthesis)==null||m.cancel(),(g=window.speechSynthesis)==null||g.speak(p)}t.addEventListener("click",()=>{t.hidden=!0,r.hidden=!1,u(0)}),s.addEventListener("click",async()=>{if(kn()==="recording"){We();return}const h=i[l];!await Sn({storyId:e.id,lineIdx:h==null?void 0:h.idx,onStateChange:d=>{d==="recording"?(s.textContent="⏹ Stop Recording",a&&(a.textContent="🔴 Recording...",a.className="echo-read-status echo-read-status--recording")):d==="recorded"?(s.hidden=!0,o.hidden=!1,n.hidden=l>=i.length-1,a&&(a.textContent="✓ Great job!",a.className="echo-read-status echo-read-status--done")):d==="error"&&a&&(a.textContent="⚠ Microphone not available",a.className="echo-read-status echo-read-status--error")}})&&a&&(a.textContent="⚠ Microphone not available — check permissions",a.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{$n()}),n.addEventListener("click",()=>{dt(),o.hidden=!0,l+1<i.length?u(l+1):(a&&(a.textContent="🎉 Echo Read complete!",a.className="echo-read-status echo-read-status--done"),n.hidden=!0,s.hidden=!0,setTimeout(c,2e3))}),r.addEventListener("click",()=>{R(),We(),dt(),c()})}function er(){Fe||(Fe=!0,xe=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,He=setInterval(()=>{const e=Math.floor((Date.now()-xe)/1e3),t=Math.floor(e/60),n=e%60,s=document.getElementById("fluency-clock");s&&(s.textContent=`${t}:${String(n).padStart(2,"0")}`)},500))}const zn=e=>`${Math.floor(e/60)}:${String(Math.round(e%60)).padStart(2,"0")}`;function gt(e,t){var l;if(!Fe&&He===null)return;clearInterval(He),He=null,Fe=!1;const n=document.getElementById("btn-fluency-start"),s=document.getElementById("btn-fluency-done");if(n&&(n.disabled=!1),s&&(s.disabled=!0),!e||!xe)return;const o=(Date.now()-xe)/1e3;xe=null;const r=document.getElementById("fluency-result"),a=document.getElementById("fluency-form");if(o<5){r&&(r.hidden=!1,r.textContent="That was very quick — start timing as the reading begins.");return}if(!a)return;Ne=o,r&&(r.hidden=!0),a.hidden=!1;const i=document.getElementById("fluency-time");i&&(i.textContent=`${e} words in ${zn(o)}.`),(l=a.querySelector('input[name="errors"]'))==null||l.focus({preventScroll:!0})}function tr(e,t){var o;const n=document.getElementById("fluency-form"),s=document.getElementById("fluency-result");!n||!s||(n.addEventListener("submit",r=>{var p,m,g;r.preventDefault();const a=((p=n.querySelector('input[name="errors"]'))==null?void 0:p.value)??"",i=a===""?null:Number(a),l=((m=n.querySelector('input[name="support"]:checked'))==null?void 0:m.value)??null,{wpm:c,wcpm:u,accuracy:h}=lo(e,Ne,i);vo({storyId:t.id,wpm:c,wcpm:u,errors:i,accuracy:h,support:l,durationSec:Ne,wordCount:e});const f=co({wpm:c,wcpm:u,primaryGrade:((g=Jn())==null?void 0:g.primaryGrade)??null});n.hidden=!0,n.reset(),s.hidden=!1,s.innerHTML=T`
      <div class="fluency-result-inner">
        <span class="fluency-time">${zn(Ne)}</span>
        <span class="fluency-wcpm">${f.headline}</span>
        ${h!=null?T`<span class="fluency-acc">${h}% accurate</span>`:""}
      </div>
      <p class="fluency-detail">${f.detail}</p>
      ${f.reference?T`<p class="fluency-reference">${f.reference}</p>`:""}
    `;const d=document.getElementById("story-quest-cta");d&&(d.hidden=!1)}),(o=document.getElementById("btn-fluency-discard"))==null||o.addEventListener("click",()=>{n.hidden=!0,n.reset(),s.hidden=!1,s.textContent="Not saved."}))}export{qt as _highlightGraphemes,Lo as _isMeetWordsCompletedToday,ot as _logComprehensionAttempt,zt as _setMeetWordsCompleted,lr as cleanupStoryMode,ar as initStoryMode,ir as showBrowser};
