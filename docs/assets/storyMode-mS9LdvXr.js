import{s as P,W as me,N as Pt,O as be,C as tt,Q as jt,R as M,T,U as Y,X as j,Y as Ut}from"./index-CD8XPrJh.js";import{P as Dt,g as zt,e as nt,i as st}from"./sightStoryWeave-DIivzFec.js";import"./gsap-C8pce-KX.js";function Yt(e,t,s){var g;if(!((g=t.comprehension)!=null&&g.length)){s==null||s();return}const n={phase:"intro",qIndex:0,vocabIndex:0,correct:0,total:t.comprehension.length,flipped:!1};function o(){switch(n.phase){case"intro":return a();case"comprehension":return r();case"vocab":return c();case"openEnded":return d();case"grammar":return m();case"done":return p()}}function a(){var i,u,h,b;e.innerHTML=`
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${t.comprehension.length} questions</span>
          ${(i=t.vocab)!=null&&i.length?`<span class="sq-badge sq-badge--green">📖 ${t.vocab.length} words</span>`:""}
          ${(u=t.grammarSpotlight)!=null&&u.length?'<span class="sq-badge sq-badge--purple">✏️ grammar</span>':""}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `,(h=document.getElementById("sq-start"))==null||h.addEventListener("click",()=>{n.phase="comprehension",n.qIndex=0,o()}),(b=document.getElementById("sq-skip"))==null||b.addEventListener("click",()=>s==null?void 0:s())}function r(){const i=t.comprehension[n.qIndex],u=n.qIndex+1,h=n.total;e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${u/h*100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${u} of ${h}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${i.q}</p>
          ${i.type==="inferential"?'<span class="sq-infer-badge">🤔 Think about it…</span>':""}
        </div>

        <div class="sq-options" id="sq-options">
          ${i.options.map((b,f)=>`
            <button class="sq-option" data-idx="${f}" aria-label="${b}">
              <span class="sq-option-letter">${String.fromCharCode(65+f)}</span>
              <span class="sq-option-text">${b}</span>
            </button>
          `).join("")}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `,document.querySelectorAll(".sq-option").forEach(b=>{b.addEventListener("click",()=>l(b,i))})}function l(i,u){const h=parseInt(i.dataset.idx,10),b=h===u.answer;b&&n.correct++,document.querySelectorAll(".sq-option").forEach((k,w)=>{k.disabled=!0,w===u.answer&&k.classList.add("sq-option--correct"),w===h&&!b&&k.classList.add("sq-option--wrong")});const f=document.getElementById("sq-feedback");f&&(f.hidden=!1,f.className=`sq-feedback ${b?"sq-feedback--correct":"sq-feedback--wrong"}`,f.textContent=b?"✅ Great thinking!":`✨ The answer is: ${u.options[u.answer]}`);const S=document.getElementById("sq-next");S&&(S.hidden=!1,S.addEventListener("click",()=>{var k,w,E;n.qIndex++,n.qIndex<n.total||(n.phase=(k=t.openEnded)!=null&&k.length?"openEnded":(w=t.vocab)!=null&&w.length?"vocab":(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",n.vocabIndex=0),o()}))}function d(){var u,h,b;const i=t.openEnded||[];if(!i.length){n.phase=(u=t.vocab)!=null&&u.length?"vocab":(h=t.grammarSpotlight)!=null&&h.length?"grammar":"done",o();return}e.innerHTML=`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">🗣️ Open-ended response</p>
        ${i.map((f,S)=>`
          <div class="sq-question-card" style="margin-bottom:12px">
            <p class="sq-question-text">${S+1}. ${f.q}</p>
            <textarea class="cp-name-input" rows="3" placeholder="Type your answer..."></textarea>
            <details style="margin-top:8px"><summary>Show sample and marking guide</summary>
              <p><strong>Sample:</strong> ${f.sampleAnswer}</p>
              <p><strong>Guide:</strong> ${f.markingGuide}</p>
            </details>
          </div>`).join("")}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>`,(b=document.getElementById("sq-open-next"))==null||b.addEventListener("click",()=>{var f,S;n.phase=(f=t.vocab)!=null&&f.length?"vocab":(S=t.grammarSpotlight)!=null&&S.length?"grammar":"done",o()})}function c(){var S,k,w;const i=t.vocab[n.vocabIndex],u=t.vocab.length,h=n.vocabIndex+1;e.innerHTML=`
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${h} of ${u}</p>

        <div class="sq-flip-card ${n.flipped?"sq-flip-card--flipped":""}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${i.icon}</div>
            <p class="sq-flip-word">${i.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${i.icon}</div>
            <p class="sq-flip-meaning">${i.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${n.flipped?`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${h<u?"Next word →":"Done with words!"}
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
    `;const b=document.getElementById("sq-flip-card"),f=()=>{n.flipped=!0,o()};b==null||b.addEventListener("click",f),b==null||b.addEventListener("keydown",E=>{(E.key==="Enter"||E.key===" ")&&f()}),(S=document.getElementById("sq-flip-btn"))==null||S.addEventListener("click",f),(k=document.getElementById("sq-vocab-next"))==null||k.addEventListener("click",()=>{var E;n.vocabIndex++,n.flipped=!1,n.vocabIndex<u||(n.phase=(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done"),o()}),(w=document.getElementById("sq-vocab-skip"))==null||w.addEventListener("click",()=>{var E;n.phase=(E=t.grammarSpotlight)!=null&&E.length?"grammar":"done",o()})}function m(){var h;const u=(t.grammarSpotlight??[]).map((b,f)=>`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${f+1}</div>
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
        <div class="sq-grammar-list">${u}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `,(h=document.getElementById("sq-grammar-done"))==null||h.addEventListener("click",()=>{n.phase="done",o()})}function p(){var k;const i=n.total>0?Math.round(n.correct/n.total*100):100,u=i>=80?3:i>=50?2:1,h="⭐".repeat(u)+"☆".repeat(3-u),b=n.correct*15+(i===100?25:0),f=["Great job — keep it up!","Nice work! Read the story again to practise.","Super reader! You aced this Story Quest!"],S=u===3?f[2]:u===2?f[1]:f[0];e.innerHTML=`
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${h}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${S}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${n.correct}</span>
            <span class="sq-score-denom">/ ${n.total}</span>
            <span class="sq-score-label">correct</span>
          </div>
          <div class="sq-xp-badge">
            <span class="sq-xp-num">+${b}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `,(k=document.getElementById("sq-back"))==null||k.addEventListener("click",()=>s==null?void 0:s())}o()}function Vt(e,t){if(typeof e!="string"||e.length===0||typeof t!="number"||!Number.isFinite(t)||t<0)return-1;const s=Math.min(t,e.length-1);let n=-1,o=!1;for(let a=0;a<=s;a++){const r=/\s/.test(e.charAt(a));!r&&!o?(n++,o=!0):r&&(o=!1)}return n<0?-1:n}function Kt(e,t){if(!e||typeof e.top!="number"||typeof e.bottom!="number"||typeof t!="number"||t<=0)return!1;const s=80;return e.bottom<s||e.top>t-s}function Jt(e){return typeof e!="string"?"":e.toLowerCase().replace(/^[^a-z0-9]+/,"").replace(/[^a-z0-9]+$/,"").trim()}let z=null;function at(){if(z)return z;z=new Map;for(const e of me)e!=null&&e.word&&z.set(e.word.toLowerCase(),e);return z}function Qt(e){const t=Jt(e),s=at(),n=t?s.get(t):null;if(n){const o=P.get("wordStats")||{},a=!!o[n.id]&&(o[n.id].attempts||0)>0;return{text:n.word,word:n,foundInBank:!0,graphemes:Array.isArray(n.graphemes)?n.graphemes:[t],types:Array.isArray(n.types)?n.types:[],alreadyTracked:a}}return{text:t,word:null,foundInBank:!1,graphemes:t?t.split(""):[],types:[],alreadyTracked:!1}}function ot(e){return!e||typeof e!="string"||!(at().has(e)||me.some(n=>(n==null?void 0:n.id)===e))?!1:(P.recordWordAttempt(e,!0,Pt.EXPOSURE),!0)}const Xt=.62,Zt=.4,Fe=2;function Pe(e){return String(e||"").toLowerCase().replace(/[’']/g,"'").split(/[^a-z0-9']+/).map(t=>t.replace(/^'+|'+$/g,"")).filter(Boolean)}function en(e,t,s=(n,o)=>be.phoneticSimilarity(n,o)){const n=e.length,o=t.length;if(n===0)return[];if(o===0)return e.map(p=>({word:p,status:"miss",heard:null}));const a=-.4,r=Array.from({length:n+1},()=>new Array(o+1).fill(0));for(let p=1;p<=n;p++)r[p][0]=p*a;for(let p=1;p<=o;p++)r[0][p]=p*a;const l=Array.from({length:n},(p,g)=>Array.from({length:o},(i,u)=>s(e[g],t[u])));for(let p=1;p<=n;p++)for(let g=1;g<=o;g++){const i=l[p-1][g-1]-.5;r[p][g]=Math.max(r[p-1][g-1]+i,r[p-1][g]+a,r[p][g-1]+a)}const d=new Array(n);let c=n,m=o;for(;c>0;){const p=m>0?l[c-1][m-1]-.5:-1/0;if(m>0&&r[c][m]===r[c-1][m-1]+p){const g=l[c-1][m-1],i=e[c-1];let u;g>=Xt?u="match":g>=Zt||i.length<=Fe?u="unsure":u="miss",d[c-1]={word:i,status:u,heard:t[m-1]},c--,m--}else if(m>0&&r[c][m]===r[c][m-1]+a)m--;else{const g=e[c-1];d[c-1]={word:g,status:g.length<=Fe?"unsure":"miss",heard:null},c--}}return d}function tn(e,t,s){const n=Pe(e);let o=null;for(const a of t||[]){const r=en(n,Pe(a.text),s),l=r.filter(d=>d.status==="match").length;(!o||l>o.matchCount)&&(o={words:r,matchCount:l,total:n.length})}return o||{words:n.map(a=>({word:a,status:"miss",heard:null})),matchCount:0,total:n.length}}function nn(){return be.supported}async function sn(e){const t=await be.listenTranscript({timeoutMs:12e3});return t?tn(e,t.transcripts):null}function an(){be.stop()}function je(e){const t=P.get("groupMastery")||{},s=tt.filter(o=>e.includes(o.phase));return s.length?s.filter(o=>(t[o.group]??0)>=.8).length/s.length:0}function Le(e){const t=P.get("groupMastery")||{};return tt.some(s=>e.includes(s.phase)&&typeof t[s.group]=="number"&&t[s.group]>0)}function rt(){const e=je([1,2,3,4,5]),t=Le([6]),s=je([6])>=.5,n=Le([8]),o=Le([7]),a=e>=.6||t,r=a&&(s||n),l=r&&o;return{A:{ready:!0,hint:""},B:{ready:a,hint:a?"":"Best after starting Phase 6 — Long Vowels"},C:{ready:r,hint:r?"":"Best after Phase 6 and Bossy-R practice"},D:{ready:l,hint:l?"":"Best after starting Phase 7 — Diphthongs"}}}function on(e,t){const s=rt();for(const n of["A","B","C","D"]){if(!s[n].ready)break;const o=(t==null?void 0:t[n])||[];if(o.some(r=>!(e!=null&&e.includes(r.id)))||!o.length)return n}return"A"}const se=Object.freeze({short:{label:"short vowel",color:"#d62828",mark:"ă"},long:{label:"long vowel",color:"#1a7f37",mark:"ā"},schwa:{label:"schwa · lazy “uh”",color:"#6b7280",mark:"ə"},rcontrolled:{label:"bossy-r vowel",color:"#7c3aed",mark:"ûr"},diphthong:{label:"sliding vowel",color:"#ea580c",mark:"oi"},silent:{label:"silent letter",color:"#9aa3af",mark:"∅"},consonant:{label:"consonant",color:"#2563eb",mark:""},digraph:{label:"digraph",color:"#0891b2",mark:""},blend:{label:"blend",color:"#d97706",mark:""},affix:{label:"word part",color:"#db2777",mark:""}}),rn=Object.freeze(["short","long","schwa","rcontrolled","diphthong","silent"].map(e=>({key:e,...se[e]}))),Ae=new Set(["short","long","schwa","rcontrolled","diphthong"]),ln=new Set(["about","above","again","ago","along","alone","around","away","aside","awake","aboard","aloud","ashore","alike","asleep","amaze","alarm","across","aware","another","awhile","ahead","afraid","apart","alive","awoke","ajar","aloft","amount","account","asleep","aglow"]),fe="bcdfghjklmnpqrstvwxyz",cn=new RegExp(`[${fe}]a$`),dn=new RegExp("[bcdfghjkmnprstvz]al$"),it=/[ts]ion$/;function lt(e){const t=new Set;return e==="a"?t.add(0):e==="the"?t.add(2):(ln.has(e)&&e[0]==="a"&&t.add(0),e.length>=3&&cn.test(e)&&t.add(e.length-1),e.length>=4&&dn.test(e)&&t.add(e.length-2),e.length>=5&&it.test(e)&&t.add(e.length-3)),t.size?t:null}const un=new Set(["maybe","recipe","karate","sesame","ukulele","finale"]),pn=new RegExp(`[${fe}]e$`);function ct(e){const t=new Set,s=e.length;if(s>=5&&it.test(e)&&t.add(s-2),s>=4&&pn.test(e)&&!un.has(e)&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-1),s>=4&&e.endsWith("ed")){const n=e[s-3];fe.includes(n)&&n!=="t"&&n!=="d"&&/[aeiou]/.test(e.slice(0,-2))&&t.add(s-2)}return t.size?t:null}const hn=new Set(["head","bread","dead","ready","heavy","instead","meant","health","wealth","weather","feather","leather","thread","spread","breath","death","sweat","meadow","steady","already","breakfast","dread","heaven","peasant","pleasant","treasure","measure"]),gn=new Set(["been"]),mn=new Set(["friend","friends"]),bn=new Set(["snow","show","shown","low","below","grow","grown","blow","blown","glow","flow","slow","throw","thrown","own","owned","know","known","yellow","follow","window","arrow","narrow","elbow","rainbow","bowl","sparrow","pillow","shadow","meadow","borrow","tomorrow","below","row","mow","sow","bow","crow","flown","growth"]),fn=["ing","ed","ly","es","s","n"];function de(e,t){if(e.has(t))return!0;for(const s of fn)if(t.endsWith(s)&&t.length-s.length>=2&&e.has(t.slice(0,-s.length)))return!0;return!1}function Q(e,t,s,n,o,a){return Ae.has(n)?a!=null&&a.has(s)?"silent":o!=null&&o.has(s)?"schwa":t==="ea"&&de(hn,e)||t==="ee"&&de(gn,e)||t==="ie"&&de(mn,e)?"short":t==="ow"&&de(bn,e)?"long":n:n}const v=null,dt=new Map([["have",[v,"short",v,"silent"]],["love",[v,"short",v,"silent"]],["come",[v,"short",v,"silent"]],["some",[v,"short",v,"silent"]],["done",[v,"short",v,"silent"]],["gone",[v,"short",v,"silent"]],["none",[v,"short",v,"silent"]],["give",[v,"short",v,"silent"]],["live",[v,"short",v,"silent"]],["one",["short",v,"silent"]],["were",[v,"rcontrolled","rcontrolled","silent"]],["here",[v,"rcontrolled","rcontrolled","silent"]],["where",[v,v,"rcontrolled","rcontrolled","silent"]],["there",[v,v,"rcontrolled","rcontrolled","silent"]],["above",["schwa",v,"short",v,"silent"]],["become",[v,"short",v,"short",v,"silent"]],["people",[v,"long","silent",v,v,"silent"]],["again",["schwa",v,"long","long",v]],["said",[v,"short","short",v]],["says",[v,"short","short",v]]]),yn=new Map(me.map(e=>[e.word.toLowerCase(),e])),ut=Object.freeze({sv:"short",lv:"long",rc:"rcontrolled",dp:"diphthong",se:"silent",c:"consonant",bl:"blend",d:"digraph",soft_c:"consonant",soft_g:"consonant",p:"affix",sf:"affix"});function vn(e){return ut[e]??"consonant"}function pt(e,t,s){const n=String(e).toLowerCase().replace(/[^a-z]/g,""),o=lt(n),a=ct(n),r=dt.get(n),l=[];let d=0;for(let c=0;c<t.length;c++){const m=t[c]||"",p=m.length||1;let g=vn(s[c]);Ae.has(g)&&(g=(r==null?void 0:r[d])??Q(n,m,d,g,o,a)),l.push(g),d+=p}return l}const wn="aeiou",Sn="bcdfghjklmnpqrstvwxyz",Ue=e=>wn.includes(e),En=e=>Sn.includes(e),ht=Object.freeze({igh:"long",ar:"rcontrolled",or:"rcontrolled",er:"rcontrolled",ir:"rcontrolled",ur:"rcontrolled",ai:"long",ay:"long",ee:"long",ea:"long",ie:"long",oa:"long",oe:"long",ue:"long",ew:"long",oo:"long",ey:"long",oi:"diphthong",oy:"diphthong",ou:"diphthong",au:"diphthong",aw:"diphthong",ow:"diphthong"}),kn=Object.keys(ht).sort((e,t)=>t.length-e.length);function $n(e,t,s){const n=[],o=e.length;let a=0;for(;a<o;){if(a===o-3&&Ue(e[a])&&En(e[a+1])&&e[a+2]==="e"){n.push({len:1,sound:Q(e,e[a],a,"long",t,s)}),n.push({len:1,sound:null}),n.push({len:1,sound:"silent"});break}let r=!1;for(const l of kn)if(e.startsWith(l,a)){n.push({len:l.length,sound:Q(e,l,a,ht[l],t,s)}),a+=l.length,r=!0;break}if(!r){if(Ue(e[a])||e[a]==="y"&&a>0){const l=a===o-1?"long":"short";n.push({len:1,sound:Q(e,e[a],a,l,t,s)}),a+=1;continue}n.push({len:1,sound:null}),a+=1}}return n}function Ln(e,t,s,n){const o=[];let a=0;for(let r=0;r<e.graphemes.length;r++){const l=e.graphemes[r],d=l.length;if(d===2&&l[1]==="e"&&fe.includes(l[0])&&a+2===t.length&&(n!=null&&n.has(a+1))){o.push({len:1,sound:null}),o.push({len:1,sound:"silent"}),a+=2;continue}let c=ut[e.types[r]]??null;!Ae.has(c)&&c!=="silent"&&(c=null),c=Q(t,l,a,c,s,n),o.push({len:d,sound:c}),a+=d}return o}function xn(e){var r;const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t||Dt.has(t))return null;const s=dt.get(t);if(s){const l=[];for(const d of s){const c=l[l.length-1];c&&c.sound===d?c.len+=1:l.push({len:1,sound:d})}return l}const n=lt(t),o=ct(t),a=yn.get(t);return(r=a==null?void 0:a.graphemes)!=null&&r.length?Ln(a,t,n,o):$n(t,n,o)}function qn(e){return e&&e.replace(/[A-Za-z]+/g,t=>{const s=xn(t);if(!s)return t;let n="",o=0;for(const{len:a,sound:r}of s){const l=t.slice(o,o+a);o+=a,n+=r?`<span class="vs vs--${r}">${l}</span>`:l}return o<t.length&&(n+=t.slice(o)),n})}const In="giri_friends_unlocked";function gt(){return jt(In)}const _n=Object.freeze({"core-a-14":"Wet Boots","core-a-16":"Fast Feet","core-b-04":"Sun Day","core-a-06":"Shovel","core-a-04":"Pillow"});function Tn(e){return typeof e!="string"||!e.trim()?"":e.replace(/^Giri's\s+/i,"").replace(/^Giri\s+and\s+the\s+/i,"").replace(/^Giri\s+and\s+/i,"").replace(/^Giri\s+/i,"").trim()||e}function Bn(e){if(!e||!e.id)return null;const t=_n[e.id]||Tn(e.title||"")||"Friend";return{id:e.id,storyId:e.id,name:t,emoji:e.emoji||"✨",band:e.band||"A",phase:e.phase||"",storyTitle:e.title||""}}function mt(){try{const e=localStorage.getItem(gt()),t=e?JSON.parse(e):[];return new Set(Array.isArray(t)?t:[])}catch{return new Set}}function Rn(e){try{localStorage.setItem(gt(),JSON.stringify(Array.from(e)))}catch{}}function An(e){if(!e||typeof e!="string")return!1;const t=mt();return t.has(e)?!1:(t.add(e),Rn(t),!0)}function Cn(e){const t=mt();if(!Array.isArray(e))return[];const s=[];for(const n of e){const o=Bn(n);o&&s.push({...o,unlocked:t.has(n.id)})}return s}function bt(e){const t=Cn(e);return{unlocked:t.filter(n=>n.unlocked).length,total:t.length,roster:t}}const ft="giri_fluency_history",De=5,H=new Map,Mn=10;function Hn(e,t){for(H.set(e,t);H.size>Mn;){const s=H.keys().next().value;H.delete(s)}}let G=null,q=null,xe=[],F=null,X=null,ye="idle",I=null;async function yt({storyId:e,lineIdx:t,onStateChange:s}={}){if(ye==="recording")return!1;X=s??null,xe=[];try{G=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return B("error"),!1}const n=On();try{q=new MediaRecorder(G,n?{mimeType:n}:{})}catch{q=new MediaRecorder(G)}return q.ondataavailable=o=>{o.data.size>0&&xe.push(o.data)},q.onstop=()=>{const o=new Blob(xe,{type:q.mimeType||"audio/webm"}),a=`rec_${e}_${t??"full"}_${Date.now()}`;F=a,Hn(a,o),Te(),B("recorded")},q.onerror=()=>{Te(),B("error")},q.start(),B("recording"),!0}function pe(){q&&q.state==="recording"?q.stop():Te()}function vt(e){const t=F,s=t?H.get(t):null;return s?new Promise(n=>{ve();const o=URL.createObjectURL(s);I=new Audio(o),B("playing"),I.onended=()=>{URL.revokeObjectURL(o),I=null,B("recorded"),n()},I.onerror=()=>{URL.revokeObjectURL(o),I=null,B("recorded"),n()},I.play().catch(()=>{URL.revokeObjectURL(o),I=null,B("recorded"),n()})}):Promise.resolve()}function ve(){I&&(I.pause(),I=null)}function _e(e){const t=F;t&&H.delete(t),t===F&&(F=null),ve(),B("idle")}function wt(){return ye}function St(){pe(),ve(),H.clear(),F=null,ye="idle",X=null}function Nn(e){const t=kt(),s=t[e.storyId]??[];s.push({date:new Date().toISOString(),wcpm:e.wcpm,durationSec:Math.round(e.durationSec),wordCount:e.wordCount,hasRecording:!!e.recordingId}),s.length>De&&s.splice(0,s.length-De),t[e.storyId]=s,Gn(t)}function Et(e){return kt()[e]??[]}function Wn(e){const t=Et(e);return t.length===0?null:Math.max(...t.map(s=>s.wcpm))}function B(e){ye=e,X==null||X(e)}function Te(){G&&(G.getTracks().forEach(e=>e.stop()),G=null)}function On(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const t of e)try{if(MediaRecorder.isTypeSupported(t))return t}catch{}return""}function kt(){try{return JSON.parse(localStorage.getItem(ft)??"{}")}catch{return{}}}let ze=!1;function Gn(e){try{localStorage.setItem(ft,JSON.stringify(e))}catch{if(ze)return;ze=!0;const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className="toast toast--warning",s.setAttribute("role","alert"),s.textContent="Device storage full — reading history may not be saved.",t.appendChild(s),setTimeout(()=>s.remove(),8e3)}}const $t="/phonicsquest/";function Fn(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return me.find(s=>s.word===t)??null}function Lt(e){return e.split(/(\s+|["""'',.!?;:()-]+)/).filter(s=>s.length>0).map(s=>({text:s,type:/^\s+$/.test(s)?"space":/^[^a-zA-Z0-9]+$/.test(s)?"punct":"word"}))}let y=null,_="A",Ye=!1,W="band",V="aloud",ae=!1,O=null,he=[],K=null,L="word",oe=!1,U=-1,ce=[],Z=0,we=[],Se=0,re=0;const xt="giri_stories_read";function J(){try{return JSON.parse(localStorage.getItem(xt)??"[]")}catch{return[]}}function Ee(e){const t=J();t.includes(e)||(t.push(e),localStorage.setItem(xt,JSON.stringify(t))),An(e)}let ue=null,ee=null,ge=!1;const Ce="giri_show_graphemes",qt="giri_show_ruler",Me="giri_follow_mode",It="giri_meet_words",Ve="giri_comp_log";let x=He(Ce,!0),C=He(qt,!1);L=He(Me,"word");function He(e,t){try{const s=localStorage.getItem(e);return s===null?t:JSON.parse(s)}catch{return t}}function te(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const _t=new Set;function Tt(){return new Date().toISOString().slice(0,10)}function Bt(){try{const e=localStorage.getItem(It);return e?JSON.parse(e):{}}catch{return{}}}function Pn(e){try{localStorage.setItem(It,JSON.stringify(e))}catch{}}function jn(e){return _t.has(e)?!0:Bt()[e]===Tt()}function Ke(e){_t.add(e);const t=Bt();t[e]=Tt();const s=Date.now()-30*24*60*60*1e3;for(const[n,o]of Object.entries(t))(!o||Date.parse(o)<s)&&delete t[n];Pn(t)}const Je=new Set,Un=100;function Qe(e){try{const t=localStorage.getItem(Ve),s=t?JSON.parse(t):[];for(s.push({ts:Date.now(),...e});s.length>Un;)s.shift();localStorage.setItem(Ve,JSON.stringify(s))}catch{}}function ms(e,t){y=e}function bs(){$(),ie()}function fs(){$(),Re(),St(),Ne(),ke()}function ke(){O==null||O.remove(),O=null}function ie(){var s,n,o;ke();const e=`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${W==="band"?" active":""}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${W==="singapore"?" active":""}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${W==="chapter"?" active":""}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${is()}</button>
    </div>
  `;let t;if(W==="band"){if(!Ye){Ye=!0;try{const i={};for(const u of M)(i[s=u.band]??(i[s]=[])).push(u);_=on(J(),i)||_}catch{}}const a=T.find(i=>i.band===_)??T[0],r=M.filter(i=>i.band===_&&i.category!=="chapter"&&i.category!=="nonfiction-sg"),l=J(),d=r.filter(i=>l.includes(i.id)).length,c=rt(),m=T.map(i=>{var u,h,b;return`
      <button
        class="story-tab${i.band===_?" active":""}${(u=c[i.band])!=null&&u.ready?"":" story-tab--not-ready"}"
        data-band="${i.band}"
        style="--tab-color:${i.color}"
        ${(h=c[i.band])!=null&&h.ready?"":`title="${c[i.band].hint}"`}
      >
        <span class="story-tab-num">${i.band}</span>
        <span class="story-tab-name">${i.label}</span>
        ${(b=c[i.band])!=null&&b.ready?"":'<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `}).join(""),p=r.map(i=>qe(i,a,!1,l.includes(i.id))).join(""),g=r.length?Math.round(d/r.length*100):0;t=`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${m}</div>
      <div class="stories-level-strip"
           style="--level-color:${a.color};--level-bg:${a.bg}">
        <span class="slstrip-label">Band ${_}</span>
        <span class="slstrip-name">${a.label}</span>
        <span class="slstrip-sounds">${a.targetSounds}</span>
        <span class="slstrip-prop">${a.prop}</span>
        <span class="slstrip-progress" title="${d} of ${r.length} stories read">
          ${d}/${r.length} read
          <span class="slstrip-progress-bar" style="--pct:${g}%"></span>
        </span>
      </div>
      ${(n=c[_])!=null&&n.ready?"":`
        <p class="stories-readiness-note" role="note">
          🧭 ${c[_].hint}. You can still read together with a grown-up!
        </p>`}
      <div class="story-cards-grid">${p}</div>
    `}else if(W==="singapore"){const a=M.filter(d=>d.category==="nonfiction-sg"),r=J();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${a.map(d=>{const c=T.find(m=>m.band===d.band)??T[0];return qe(d,c,!1,r.includes(d.id))}).join("")}</div>
    `}else{const a=M.filter(d=>d.category==="chapter").sort((d,c)=>(d.chapterNum??0)-(c.chapterNum??0)),r=J();t=`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${a.map(d=>{const c=T.find(m=>m.band===d.band)??T[0];return qe(d,c,!0,r.includes(d.id))}).join("")}</div>
    `}y.innerHTML=`
    <div class="stories-browser">
      ${e}
      ${t}
    </div>
  `,y.querySelectorAll(".sb-cat-tab[data-cat]").forEach(a=>{a.addEventListener("click",()=>{W=a.dataset.cat,ie()})}),(o=document.getElementById("btn-open-friends"))==null||o.addEventListener("click",()=>{ls()}),y.querySelectorAll(".story-tab").forEach(a=>{a.addEventListener("click",()=>{_=a.dataset.band,ie()})}),y.querySelectorAll(".story-card").forEach(a=>{a.addEventListener("click",()=>Rt(a.dataset.storyId))})}function qe(e,t,s=!1,n=!1){var l;const o=(l=e.comprehension)!=null&&l.length?'<span class="story-card-quest-badge">⭐ Quest</span>':"",a=s?`<span class="story-card-chapter-badge">Ch. ${e.chapterNum}</span>`:"",r=n?'<span class="story-card-read-badge" title="Story read">✓</span>':"";return`
    <button class="story-card${s?" story-card--chapter":""}${n?" story-card--read":""}" data-story-id="${e.id}">
      <div class="story-card-illo" style="background:${t.bg}">
        <img
          src="${$t}images/stories/${e.illustration}"
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
      </div>
    </button>
  `}function Rt(e){const t=M.find(s=>s.id===e);t&&($(),Dn(t))}function Dn(e){var s,n,o;const t=T.find(a=>a.band===e.band)??T[(e.level??1)-1];y.innerHTML=`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${t.color};--level-bg:${t.bg}">
        <img src="${$t}images/stories/${e.illustration}" alt="${e.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${t.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${e.band??"A"} · ${t.label}</span>
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${e.title}</h2>

      ${(()=>{const a=zt(e);return a.length?`
          <p class="story-spot-words" aria-label="Sight words to spot in this story">
            ⭐ Words to spot: ${a.map(r=>`<span class="story-spot-word">${r}</span>`).join(" ")}
          </p>`:""})()}

      <!-- Mode toggle — plain-language labels so a grown-up knows which is
           which: listen together, or tap words to sound them out. -->
      <div class="story-mode-toggle" role="group" aria-label="Reading mode">
        <button class="smode-btn${V==="aloud"?" active":""}" data-mode="aloud"  id="btn-mode-aloud">
          <span class="smode-btn-title">📖 Listen &amp; Follow</span>
          <span class="smode-btn-sub">Giri reads · you follow along</span>
        </button>
        <button class="smode-btn${V==="decode"?" active":""}" data-mode="decode" id="btn-mode-decode">
          <span class="smode-btn-title">🔤 Sound It Out</span>
          <span class="smode-btn-sub">Tap any word to decode it</span>
        </button>
      </div>

      <!-- Dynamic content area (pre-teach + story body + controls) -->
      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `,(s=document.getElementById("btn-reader-back"))==null||s.addEventListener("click",()=>{$(),ie()}),(n=document.getElementById("btn-mode-aloud"))==null||n.addEventListener("click",()=>{V="aloud",$(),Xe("aloud"),ne(e)}),(o=document.getElementById("btn-mode-decode"))==null||o.addEventListener("click",()=>{V="decode",$(),Xe("decode"),ne(e)}),ne(e)}function ne(e){jn(e.id)?V==="aloud"?le(e):Nt(e):zn(e)}function Xe(e){document.querySelectorAll(".smode-btn").forEach(t=>{t.classList.toggle("active",t.dataset.mode===e)})}function zn(e){var i,u;const t=document.getElementById("story-dynamic");if(!t)return;he=e.vocab??[];const s=nt(e),n=e.lines.map(h=>h.text??"").join(" ").toLowerCase(),o=he.filter(h=>{const b=h.word.toLowerCase().split(/\s+/)[0];return n.includes(b)});if(!s.length&&!o.length){Ke(e.id),ne(e);return}const a=s.length+o.length,l=Math.min(3,a),d=new Set,c=s.map(h=>`
    <button class="hfw-chip" data-tap-id="hfw:${h}" data-word="${h}" aria-label="Hear sight word ${h}">
      ⭐ ${h}
    </button>
  `).join(""),m=o.map(h=>`
    <button class="vocab-chip" data-tap-id="vocab:${h.word}" data-word="${h.word}" aria-label="Key word: ${h.word}">
      <span class="vocab-chip-icon">${h.icon}</span>
      <span class="vocab-chip-word">${h.word}</span>
      <span class="vocab-chip-meaning">${h.meaning}</span>
    </button>
  `).join("");t.innerHTML=`
    <div class="meet-words-gate" role="region" aria-labelledby="gate-title">
      <h3 id="gate-title">🤝 Meet the Words</h3>
      <p class="gate-hello">
        Tap <strong>any ${l}</strong> to warm up — or skip if you already
        know them. Then read <strong>${e.title}</strong>.
      </p>

      ${c?`
        <div class="gate-section">
          <div class="gate-section-title">⭐ Sight words in this story</div>
          <div class="hfw-chip-list">${c}</div>
        </div>
      `:""}

      ${m?`
        <div class="gate-section">
          <div class="gate-section-title">📚 Key words to know</div>
          <div class="vocab-chip-list">${m}</div>
        </div>
      `:""}

      <div class="gate-continue-row">
        <span class="gate-progress" id="gate-progress" aria-live="polite">0 of ${l} tapped</span>
        <button class="btn btn--ghost" id="gate-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="gate-continue" type="button" disabled>Start Reading →</button>
      </div>
    </div>
  `;function p(h){const b=h.dataset.tapId;if(d.has(b))return;d.add(b),h.setAttribute("data-tapped","true");const f=document.getElementById("gate-progress");if(f&&(f.textContent=d.size>=l?`✓ Warmed up (${d.size} tapped) — keep going or start the story`:`${d.size} of ${l} tapped`),d.size>=l){const S=document.getElementById("gate-continue");S&&(S.disabled=!1)}}t.querySelectorAll(".hfw-chip, .vocab-chip").forEach(h=>{h.addEventListener("click",async()=>{Be(h);try{await j.speakWord(h.dataset.word)}catch{}p(h)})});const g=()=>{Ke(e.id),ne(e)};(i=document.getElementById("gate-skip"))==null||i.addEventListener("click",g),(u=document.getElementById("gate-continue"))==null||u.addEventListener("click",g)}function Yn(e){return e.lines.filter(t=>t.type!=="label"&&t.type!=="chapter"&&t.text).reduce((t,s)=>t+s.text.trim().split(/\s+/).length,0)}function le(e){var p,g,i,u,h,b,f,S,k;const t=document.getElementById("story-dynamic");if(!t)return;ke();const s=L==="word",n=e.lines.map((w,E)=>Xn(w,E,s,e)).join(""),o=!!((p=e.comprehension)!=null&&p.length),r=!!((g=e.talkAboutIt)!=null&&g.length)?`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${e.talkAboutIt.map(w=>`<li>${w}</li>`).join("")}
      </ul>
    </div>
  `:"",l=Et(e.id),d=Wn(e.id),c=l.length>0?`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent Attempts</span>
        ${d!==null?`<span class="fluency-history-best">Best: <strong>${d}</strong> wpm</span>`:""}
      </div>
      <div class="fluency-history-list">
        ${l.slice().reverse().map(w=>{const E=new Date(w.date);return`<span class="fluency-history-item">${`${E.getDate()}/${E.getMonth()+1}`}: <strong>${w.wcpm}</strong> wpm</span>`}).join("")}
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
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${x}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${C}" title="Underline the line being read to keep your eyes on track">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${L==="line"?" active":""}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${L==="word"?" active":""}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${x?Ht():""}

      <div class="story-body story-body--follow-${L}${C?" story-ruler-on":""}" id="story-body" aria-live="polite">${n}</div>
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
      ${o?`
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
              ${c}
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
              <span class="rtg-label">🦉 Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${nn()?`
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
  `,t.querySelectorAll(".follow-mode-btn[data-follow]").forEach(w=>{w.addEventListener("click",()=>{L=w.dataset.follow,te(Me,L),le(e)})}),t.querySelectorAll(".wf-word").forEach(w=>{w.setAttribute("role","button"),w.setAttribute("tabindex","0");const E=N=>{const Ge=(w.textContent||"").trim();Ge&&(N.preventDefault(),ss(Ge))};w.addEventListener("click",E),w.addEventListener("keydown",N=>{(N.key==="Enter"||N.key===" ")&&E(N)})}),(i=document.getElementById("btn-toggle-graphemes"))==null||i.addEventListener("click",()=>{x=!x,te(Ce,x),le(e)}),(u=document.getElementById("btn-toggle-ruler"))==null||u.addEventListener("click",()=>{C=!C,te(qt,C);const w=document.getElementById("btn-toggle-ruler"),E=document.getElementById("story-body");w==null||w.setAttribute("aria-pressed",String(C)),E==null||E.classList.toggle("story-ruler-on",C)}),(h=document.getElementById("btn-story-play"))==null||h.addEventListener("click",()=>Ot(e)),(b=document.getElementById("btn-story-stop"))==null||b.addEventListener("click",()=>$());const m=Yn(e);(f=document.getElementById("btn-fluency-start"))==null||f.addEventListener("click",()=>us()),(S=document.getElementById("btn-fluency-done"))==null||S.addEventListener("click",()=>Re(m,e)),cs(e),Ne(),Vn(e),ds(e),(k=document.getElementById("btn-launch-quest"))==null||k.addEventListener("click",()=>{$(),Re(),St(),Ee(e.id),Yt(y,e,()=>{ie()})})}function Vn(e){var t,s,n,o;(t=document.getElementById("btn-rtg-start"))==null||t.addEventListener("click",()=>Kn(e)),(s=document.getElementById("btn-rtg-listen"))==null||s.addEventListener("click",()=>Jn(e)),(n=document.getElementById("btn-rtg-next"))==null||n.addEventListener("click",()=>Mt(e)),(o=document.getElementById("btn-rtg-exit"))==null||o.addEventListener("click",()=>{Ne(),le(e)})}function R(e){const t=document.getElementById("rtg-status");t&&(t.innerHTML=e)}function At(){const e=ce[U];return document.querySelector(`#story-body .sline[data-line="${e}"]`)||null}function Kn(e){var s,n,o;if(L!=="word"){L="word",te(Me,L),le(e);const a=document.getElementById("practice-drawer");a&&(a.open=!0);const r=document.getElementById("rtg-bar");r&&(r.open=!0)}$();const t=Array.from(document.querySelectorAll("#story-body .sline")).filter(a=>a.querySelector(".wf-word")).map(a=>Number(a.dataset.line));t.length!==0&&(oe=!0,ce=t,U=0,Z=0,we=[],Se=0,re=0,(s=document.getElementById("btn-rtg-start"))==null||s.setAttribute("hidden",""),(n=document.getElementById("btn-rtg-listen"))==null||n.removeAttribute("hidden"),(o=document.getElementById("btn-rtg-exit"))==null||o.removeAttribute("hidden"),Ct(),R("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>."))}function Ct(){document.querySelectorAll("#story-body .sline--rtg-current").forEach(t=>t.classList.remove("sline--rtg-current"));const e=At();e&&(e.classList.add("sline--rtg-current"),e.scrollIntoView({block:"center",behavior:D()}))}async function Jn(e){var m;const t=At(),s=document.getElementById("btn-rtg-listen");if(!t||!s||s.disabled)return;const n=Array.from(t.querySelectorAll(".wf-word")),o=n.map(p=>(p.textContent||"").trim()).filter(Boolean).join(" ");if(!o){Mt(e);return}s.disabled=!0,s.textContent="🦉 Giri is listening…",R("Go ahead — read the glowing line now.");const a=await sn(o);if(s.disabled=!1,s.textContent="🎙 Read this line",!oe)return;if(!a){Z++,Z>=2?R("Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together."):R("Giri couldn't hear that — move a little closer to the microphone and try again!");return}Z=0;const r=[];a.words.forEach((p,g)=>{const i=n[g];if(i)if(i.classList.remove("rtg-word--match","rtg-word--check"),p.status==="miss"){i.classList.add("rtg-word--check");const u=p.word.replace(/[^a-z]/g,"");u.length>2&&(r.push(u),ot(u))}else i.classList.add("rtg-word--match")});const l=a.words.filter(p=>p.status!=="miss").length;Se+=l,re+=a.words.length,we.push(...r);const d=U>=ce.length-1;r.length>0?R(`Nice reading! Let's check the orange ${r.length===1?"word":"words"} together — tap ${r.length===1?"it":"each one"} to hear it. Then ${d?"finish up":"go on"}!`):R("⭐ Great — Giri heard every word!"),(m=document.getElementById("btn-rtg-listen"))==null||m.setAttribute("hidden","");const c=document.getElementById("btn-rtg-next");c&&(c.textContent=d?"🌟 Finish":"Next line →",c.removeAttribute("hidden"),c.focus())}function Mt(e){var t,s;if(U>=ce.length-1){Qn(e);return}U++,(t=document.getElementById("btn-rtg-next"))==null||t.setAttribute("hidden",""),(s=document.getElementById("btn-rtg-listen"))==null||s.removeAttribute("hidden"),Ct(),R("Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.")}function Qn(e){var l,d;const t=re>0?Math.round(Se/re*100):0,s=[...new Set(we)],n={...P.get("readAloudStats")||{}},o=n[e.id]||{attempts:0};n[e.id]={attempts:(o.attempts||0)+1,lastMatchPct:t,lastMissedWords:s.slice(0,12),updatedAt:new Date().toISOString()},P.set("readAloudStats",n),document.querySelectorAll("#story-body .sline--rtg-current").forEach(c=>c.classList.remove("sline--rtg-current")),(l=document.getElementById("btn-rtg-next"))==null||l.setAttribute("hidden",""),(d=document.getElementById("btn-rtg-exit"))==null||d.setAttribute("hidden","");const a=document.getElementById("btn-rtg-start");a&&(a.removeAttribute("hidden"),a.textContent="Read it again");const r=s.length?` Words to practise: <strong>${s.slice(0,6).join(", ")}</strong> — they've been added to your review pile.`:" Every word was loud and clear!";R(`🌟 You read the whole story to Giri — ${t}% heard clearly.${r}`),Ee(e.id),oe=!1}function Ne(){oe&&an(),oe=!1,U=-1,ce=[],Z=0,we=[],Se=0,re=0}function We(e){return!x||!e?e:qn(e)}function Ht(){return`<div class="sound-legend" aria-label="What the vowel colours mean">${rn.map(t=>`
    <span class="sl-item">
      <span class="sl-chip vs--${t.key}">${t.mark||"•"}</span>${t.label}
    </span>`).join("")}</div>`}function Xn(e,t,s=!1,n=null){const o=e.text??"",a=n?We(o,n.targetGraphemes,n.band):o,r=s?Zn(o,n):a;switch(e.type){case"chapter":return`<div class="sline sline--chapter"   data-line="${t}">📚 ${r}</div>`;case"label":return`<div class="sline sline--label"     data-line="${t}">${r}</div>`;case"beat":return`<p class="sline sline--beat"        data-line="${t}">${r}</p>`;case"intro":return`<p class="sline sline--intro"       data-line="${t}">${r}</p>`;case"end":return`<p class="sline sline--end"         data-line="${t}">${r}</p>`;case"text":return`<p class="sline sline--text"        data-line="${t}">${r}</p>`;case"paragraph":return`<p class="sline sline--paragraph"   data-line="${t}">${r}</p>`;default:return`<p class="sline"                    data-line="${t}">${r}</p>`}}function Zn(e,t=null){if(!e)return"";const s=Lt(e);let n=0;return s.map(o=>{if(o.type==="word"){const a=t?We(o.text,t.targetGraphemes,t.band):o.text;return`<span class="wf-word" data-word-idx="${n++}">${a}</span>`}return o.text}).join("")}function Nt(e){var c,m,p,g;const t=document.getElementById("story-dynamic");if(!t)return;ke(),he=e.vocab??[];const n=nt(e).map(i=>`
    <button class="hfw-chip" data-word="${i}" aria-label="Hear sight word ${i}">
      ⭐ ${i}
    </button>
  `).join(""),o=e.lines.map(i=>i.text??"").join(" ").toLowerCase(),r=he.filter(i=>{const u=i.word.toLowerCase().split(/\s+/)[0];return o.includes(u)}).map(i=>`
    <button class="vocab-chip" data-word="${i.word}" aria-label="Key word: ${i.word}">
      <span class="vocab-chip-icon">${i.icon}</span>
      <span class="vocab-chip-word">${i.word}</span>
      <span class="vocab-chip-meaning">${i.meaning}</span>
    </button>
  `).join(""),l=e.lines.map((i,u)=>{if(i.type==="label")return`<div class="sline sline--label" data-line="${u}">${i.text}</div>`;const b=Lt(i.text).map(S=>{if(S.type==="word"){const k=S.text.toLowerCase().replace(/[^a-z]/g,""),w=st(k),E=We(S.text,e.targetGraphemes,e.band);return`<button class="decode-word${w?" decode-hfw":""}"
                         data-word="${S.text}"
                         aria-label="${w?"Sight word: ":"Decode: "}${S.text}"
                >${E}</button>`}return`<span class="decode-punct">${S.text}</span>`}).join("");return`<p class="sline ${{intro:"sline--intro",beat:"sline--beat",end:"sline--end",text:"sline--text",paragraph:"sline--paragraph"}[i.type]??""} decode-line" data-line="${u}">${b}</p>`}).join("");t.innerHTML=`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${x}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
      </div>
      ${x?Ht():""}

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
        ${l}
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
  `,(c=document.getElementById("btn-toggle-graphemes-decode"))==null||c.addEventListener("click",()=>{x=!x,te(Ce,x),Nt(e)}),(m=document.getElementById("btn-hfw-toggle"))==null||m.addEventListener("click",()=>{const i=document.getElementById("hfw-chip-list"),u=document.getElementById("btn-hfw-toggle"),h=u.getAttribute("aria-expanded")==="true";i.hidden=h,u.setAttribute("aria-expanded",String(!h)),u.textContent=h?"Show ▼":"Hide ▲"}),(p=document.getElementById("btn-vocab-toggle"))==null||p.addEventListener("click",()=>{const i=document.getElementById("vocab-chip-list"),u=document.getElementById("btn-vocab-toggle"),h=u.getAttribute("aria-expanded")==="true";i.hidden=h,u.setAttribute("aria-expanded",String(!h)),u.textContent=h?"Show ▼":"Hide ▲"}),t.querySelectorAll(".hfw-chip").forEach(i=>{i.addEventListener("click",()=>{var b,f;const u=i.dataset.word;Be(i);const h=new SpeechSynthesisUtterance(u);h.rate=.85,A(h),(b=window.speechSynthesis)==null||b.cancel(),(f=window.speechSynthesis)==null||f.speak(h)})}),t.querySelectorAll(".vocab-chip").forEach(i=>{i.addEventListener("click",()=>{var b,f;const u=i.dataset.word;Be(i),i.classList.toggle("vocab-chip--expanded");const h=new SpeechSynthesisUtterance(u);h.rate=.85,A(h),(b=window.speechSynthesis)==null||b.cancel(),(f=window.speechSynthesis)==null||f.speak(h)})}),(g=document.getElementById("btn-mark-read"))==null||g.addEventListener("click",i=>{Ee(e.id);const u=i.currentTarget;u.textContent="✓ Read!",u.disabled=!0,u.classList.add("btn--success"),Ft(e)});const d=document.getElementById("decode-panel");d&&(d.remove(),document.body.appendChild(d)),O=d,t.querySelectorAll(".decode-word").forEach(i=>{i.addEventListener("click",()=>es(i))})}async function es(e){var r,l,d,c;document.querySelectorAll(".decode-word.decoding").forEach(m=>m.classList.remove("decoding")),e.classList.add("decoding");const t=e.dataset.word,s=t.toLowerCase().replace(/[^a-z]/g,""),n=Fn(t),o=!n&&st(s),a=O;if(a)if(a.removeAttribute("hidden"),o){Ie({type:"hfw",word:s});const m=new SpeechSynthesisUtterance(s);m.rate=.85,A(m),(r=window.speechSynthesis)==null||r.cancel(),(l=window.speechSynthesis)==null||l.speak(m)}else if(n)Ie({type:"decode",word:n.word,wordObj:n}),await Wt(n);else{Ie({type:"tts",word:s});const m=new SpeechSynthesisUtterance(s);m.rate=.85,A(m),(d=window.speechSynthesis)==null||d.cancel(),(c=window.speechSynthesis)==null||c.speak(m)}}function Ie({type:e,word:t,wordObj:s}){var r,l,d;const n=document.getElementById("decode-panel-inner");if(!n)return;if(e==="hfw"){n.innerHTML=`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(r=document.getElementById("dp-hear"))==null||r.addEventListener("click",()=>{var m,p;const c=new SpeechSynthesisUtterance(t);c.rate=.85,A(c),(m=window.speechSynthesis)==null||m.cancel(),(p=window.speechSynthesis)==null||p.speak(c)});return}if(e==="tts"){n.innerHTML=`
      <div class="dp-tts">
        <span class="dp-word">${t}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `,(l=document.getElementById("dp-hear"))==null||l.addEventListener("click",()=>{var m,p;const c=new SpeechSynthesisUtterance(t);c.rate=.85,A(c),(m=window.speechSynthesis)==null||m.cancel(),(p=window.speechSynthesis)==null||p.speak(c)});return}const o=pt(s.word,s.graphemes,s.types),a=s.graphemes.map((c,m)=>{const p=se[o[m]]??se.consonant;return`<span class="dp-tile" data-idx="${m}" style="--tile-color:${p.color}" title="${p.label}">${c}</span>`}).join("");n.innerHTML=`
    <div class="dp-decode">
      <div class="dp-tiles" id="dp-tiles">${a}</div>
      <span class="dp-word" id="dp-word-label">${s.word}</span>
      <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
    </div>
  `,(d=document.getElementById("dp-hear"))==null||d.addEventListener("click",async()=>{await Wt(s)})}async function Wt(e){const t=document.querySelectorAll(".dp-tile");for(let n=0;n<e.graphemes.length;n++){t.forEach((a,r)=>a.classList.toggle("dp-tile--active",r===n));const o=n>0?e.graphemes[n-1]:null;await j.speakPhoneme(e.graphemes[n],e.types[n],{word:e.word,prevGrapheme:o}),await et(200)}t.forEach(n=>n.classList.remove("dp-tile--active")),await et(250);const s=document.getElementById("dp-word-label");s&&s.classList.add("dp-word--blend");try{await j.speakWord(e.word)}finally{s&&s.classList.remove("dp-word--blend")}}function Be(e){e.classList.add("hfw-chip--flash"),setTimeout(()=>e.classList.remove("hfw-chip--flash"),500)}function ts(e){const t=[],s=e.lines;let n=0;for(;n<s.length;){const o=s[n];if(o.type==="label"){const a=s[n+1];if(a&&a.type==="beat"){t.push({text:`${o.text} ${a.text}`,highlightIdx:n+1}),n+=2;continue}n++;continue}t.push({text:o.text,highlightIdx:n}),n++}return t}function Ot(e){if(!window.speechSynthesis)return;$(),K=e,Oe(!0),ae=!0;const t=ts(e);Gt(t,0)}function Gt(e,t){if(!ae||t>=e.length){Ze();return}const s=e[t];rs(s.highlightIdx);const n=new SpeechSynthesisUtterance(s.text);n.rate=.82,A(n);const o=s.text.startsWith("Puff")?600:380;L==="word"&&ns(n,s.highlightIdx),n.onend=()=>{$e(),ae&&setTimeout(()=>Gt(e,t+1),o)},n.onerror=()=>Ze(),window.speechSynthesis.speak(n)}function ns(e,t){const s=y==null?void 0:y.querySelector(`[data-line="${t}"]`);if(!s)return;const n=s.querySelectorAll(".wf-word");if(n.length===0)return;const o=e.text||"";let a=!1,r=-1,l=[],d=!1;function c(i){if(i<0||i>=n.length||i===r)return;r=i,n.forEach(h=>h.classList.remove("wf-word--active"));const u=n[i];u.classList.add("wf-word--active"),os(u)}function m(){for(const i of l)clearTimeout(i);l=[]}function p(){var b;if(d)return;d=!0;const i=typeof e.rate=="number"&&e.rate>0?e.rate:.82,u=Array.from(n,f=>(f.textContent||"").trim());let h=0;for(let f=0;f<n.length;f++){const S=f,k=((b=u[f])==null?void 0:b.length)||3,w=Math.max(160,Math.round((90+k*60)/i)),E=setTimeout(()=>{a||c(S)},h);l.push(E),h+=w}}e.addEventListener("boundary",i=>{i.name&&i.name!=="word"||(a=!0,m(),c(Vt(o,i.charIndex??-1)))}),e.addEventListener("end",()=>{m()}),e.addEventListener("start",()=>{if(a)return;const i=setTimeout(()=>{a||(c(0),p())},180);l.push(i)});const g=setTimeout(()=>{a||d||(c(0),p())},800);l.push(g)}function ss(e){var o;const t=document.getElementById("word-detective-content");if(!t)return;$();const s=Qt(e);t.innerHTML=as(s),Y.open("modal-word-detective");try{j.speakWord(s.text)}catch{}(o=t.querySelector('[data-action="hear"]'))==null||o.addEventListener("click",()=>{try{j.speakWord(s.text)}catch{}});const n=t.querySelector('[data-action="add-review"]');n==null||n.addEventListener("click",()=>{if(!s.word)return;ot(s.word.id)&&(n.disabled=!0,n.textContent="✓ In your Review Lane")})}function as(e){const t=a=>String(a??"").replace(/[<>&]/g,r=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[r]),s=pt(e.text,e.graphemes,e.types),n=e.graphemes.map((a,r)=>{const l=se[s[r]]??se.consonant;return`<span class="wd-tile vs--${s[r]}" style="--tile-color:${l.color}" aria-label="${t(a)}, ${t(l.label)}">${t(a)}</span>`}).join(""),o=e.foundInBank?`<button class="btn btn--primary" type="button" data-action="add-review" ${e.alreadyTracked?"disabled":""}>
         ${e.alreadyTracked?"✓ Already in your Review Lane":"🎯 Add to my Review Lane"}
       </button>`:`<p class="wd-note">This word isn't in the practice bank — but you can still hear its sounds.</p>`;return`
    <div class="wd-card">
      <p class="wd-word">${t(e.text)}</p>
      <div class="wd-tiles" aria-label="Sound breakdown">${n}</div>
      <div class="wd-actions">
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
        ${o}
      </div>
    </div>`}function D(){return Ut()?"auto":"smooth"}function os(e){if(!(!e||typeof e.getBoundingClientRect!="function"))try{const t=e.getBoundingClientRect(),s=window.innerHeight||document.documentElement.clientHeight;Kt(t,s)&&e.scrollIntoView({block:"center",behavior:D()})}catch{}}function $e(){y==null||y.querySelectorAll(".wf-word--active").forEach(e=>e.classList.remove("wf-word--active"))}function rs(e){y==null||y.querySelectorAll(".sline--active").forEach(s=>s.classList.remove("sline--active")),$e();const t=y==null?void 0:y.querySelector(`[data-line="${e}"]`);t&&(t.classList.add("sline--active"),t.scrollIntoView({behavior:D(),block:"nearest"}))}function A(e){var s,n;let t;try{t=((n=(s=j).getTtsVoice)==null?void 0:n.call(s))||null}catch{t=null}t?(e.voice=t,e.lang=t.lang||"en-GB"):e.lang="en-GB"}function $(){var e;ae=!1,(e=window.speechSynthesis)==null||e.cancel(),y==null||y.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),$e(),Oe(!1)}function Ze(){ae=!1,y==null||y.querySelectorAll(".sline--active").forEach(t=>t.classList.remove("sline--active")),$e(),Oe(!1),K&&Ee(K.id);const e=document.getElementById("story-quest-cta");e&&(e.hidden=!1),K&&Ft(K)}function Ft(e){var a,r;if(!e||!((a=e.talkAboutIt)!=null&&a.length)||Je.has(e.id))return;const t=y==null?void 0:y.querySelector(".story-content-wrap");if(!t||t.querySelector(".comp-check"))return;Je.add(e.id);const s=e.talkAboutIt[0],n=document.createElement("div");n.className="comp-check",n.setAttribute("role","region"),n.setAttribute("aria-label","Comprehension check"),n.innerHTML=`
    <h4>💬 Quick check</h4>
    <div class="comp-q">${s}</div>
    <div class="comp-choices">
      <button class="comp-choice" data-resp="confident" type="button">🙂 I can answer this</button>
      <button class="comp-choice" data-resp="reread" type="button">🤔 Let me re-read</button>
      <button class="comp-choice" data-resp="hint" type="button">💭 Show me where</button>
    </div>
    <div class="comp-feedback" id="comp-feedback" hidden></div>
    <button class="comp-skip" id="comp-skip" type="button">Skip</button>
  `,t.appendChild(n),n.scrollIntoView({behavior:D(),block:"nearest"});const o=n.querySelector("#comp-feedback");n.querySelectorAll(".comp-choice").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.resp;if(Qe({storyId:e.id,question:s,response:d}),n.querySelectorAll(".comp-choice").forEach(c=>c.disabled=!0),l.classList.add("correct"),d==="confident")o.textContent="👍 Great! You understood the story.";else if(d==="reread")o.textContent="📖 Good plan — listening again helps build fluency.",setTimeout(()=>Ot(e),300);else{o.textContent="💡 Look at the end of the story for clues.";const c=y==null?void 0:y.querySelector(".sline.sline--end, .sline:last-of-type");c==null||c.scrollIntoView({behavior:D(),block:"center"})}o.hidden=!1})}),(r=n.querySelector("#comp-skip"))==null||r.addEventListener("click",()=>{Qe({storyId:e.id,question:s,response:"skipped"}),n.remove()})}function is(){try{const e=bt(M);return`<span class="sb-friends-count">${e.unlocked}/${e.total}</span>`}catch{return""}}function ls(){var r,l;(r=document.getElementById("modal-story-friends"))==null||r.remove();const e=bt(M),t=document.createElement("div");t.id="modal-story-friends",t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Giri's Friends gallery");const s=d=>String(d??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c]),n=new Map;for(const d of e.roster)n.has(d.band)||n.set(d.band,[]),n.get(d.band).push(d);const o=Array.from(n.entries()).sort((d,c)=>String(d[0]).localeCompare(String(c[0]))).map(([d,c])=>{const m=c.filter(g=>g.unlocked).length,p=c.map(g=>`
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
          <h3 class="sf-band__title">Band ${s(d)} <small>${m}/${c.length} met</small></h3>
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
    </div>`,document.body.appendChild(t),Y.open("modal-story-friends"),(l=t.querySelector("[data-close]"))==null||l.addEventListener("click",()=>{Y.close("modal-story-friends"),t.remove()}),t.addEventListener("click",d=>{d.target===t&&(Y.close("modal-story-friends"),t.remove())}),t.querySelectorAll(".sf-tile--unlocked[data-story-id]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.storyId;c&&(Y.close("modal-story-friends"),t.remove(),Rt(c))})})}function Oe(e){const t=document.getElementById("btn-story-play"),s=document.getElementById("btn-story-stop");t&&(t.style.display=e?"none":""),s&&(s.style.display=e?"":"none");const n=y==null?void 0:y.querySelector(".story-reader");n&&n.classList.toggle("story-reader--listening",e)}const et=e=>new Promise(t=>setTimeout(t,e));function cs(e){const t=document.getElementById("btn-rec-start"),s=document.getElementById("btn-rec-stop"),n=document.getElementById("btn-rec-play"),o=document.getElementById("btn-rec-delete"),a=document.getElementById("recording-status");if(!t)return;function r(l){if(t.hidden=l!=="idle",s.hidden=l!=="recording",n.hidden=l!=="recorded"&&l!=="playing",o.hidden=l!=="recorded"&&l!=="playing",a)switch(l){case"recording":a.textContent="🔴 Recording...",a.className="recording-status recording-status--active";break;case"recorded":a.textContent="✓ Recording ready",a.className="recording-status recording-status--ready";break;case"playing":a.textContent="▶ Playing...",a.className="recording-status recording-status--playing";break;case"error":a.textContent="⚠ Microphone not available — check permissions",a.className="recording-status recording-status--error";break;default:a.textContent="",a.className="recording-status";break}n&&(n.textContent=l==="playing"?"⏹ Stop":"▶ Play Back")}t.addEventListener("click",async()=>{await yt({storyId:e.id,onStateChange:r})||r("error")}),s.addEventListener("click",()=>{pe()}),n.addEventListener("click",()=>{wt()==="playing"?(ve(),r("recorded")):vt()}),o.addEventListener("click",()=>{_e(),r("idle")})}function ds(e){const t=document.getElementById("btn-echo-start"),s=document.getElementById("btn-echo-next"),n=document.getElementById("btn-echo-rec"),o=document.getElementById("btn-echo-play"),a=document.getElementById("btn-echo-stop"),r=document.getElementById("echo-read-status");if(!t)return;const l=e.lines.map((p,g)=>({...p,idx:g})).filter(p=>p.type!=="label"&&p.type!=="chapter"&&p.text);let d=-1;function c(){t.hidden=!1,s.hidden=!0,n.hidden=!0,o.hidden=!0,a.hidden=!0,r&&(r.textContent="",r.className="echo-read-status"),y==null||y.querySelectorAll(".sline--echo-active").forEach(p=>p.classList.remove("sline--echo-active")),d=-1}function m(p){var h,b;d=p;const g=l[p];if(!g){c();return}g.idx,y==null||y.querySelectorAll(".sline--echo-active").forEach(f=>f.classList.remove("sline--echo-active"));const i=y==null?void 0:y.querySelector(`[data-line="${g.idx}"]`);i&&(i.classList.add("sline--echo-active"),i.scrollIntoView({behavior:D(),block:"nearest"})),r&&(r.textContent=`Line ${p+1} of ${l.length}`,r.className="echo-read-status echo-read-status--active"),s.hidden=!0,n.hidden=!0,o.hidden=!0;const u=new SpeechSynthesisUtterance(g.text);u.rate=.82,A(u),u.onend=()=>{n.hidden=!1,n.textContent="🎙 Your Turn",r&&(r.textContent=`Your turn! Read line ${p+1}`)},u.onerror=()=>{n.hidden=!1},(h=window.speechSynthesis)==null||h.cancel(),(b=window.speechSynthesis)==null||b.speak(u)}t.addEventListener("click",()=>{t.hidden=!0,a.hidden=!1,m(0)}),n.addEventListener("click",async()=>{if(wt()==="recording"){pe();return}const p=l[d];!await yt({storyId:e.id,lineIdx:p==null?void 0:p.idx,onStateChange:i=>{i==="recording"?(n.textContent="⏹ Stop Recording",r&&(r.textContent="🔴 Recording...",r.className="echo-read-status echo-read-status--recording")):i==="recorded"?(n.hidden=!0,o.hidden=!1,s.hidden=d>=l.length-1,r&&(r.textContent="✓ Great job!",r.className="echo-read-status echo-read-status--done")):i==="error"&&r&&(r.textContent="⚠ Microphone not available",r.className="echo-read-status echo-read-status--error")}})&&r&&(r.textContent="⚠ Microphone not available — check permissions",r.className="echo-read-status echo-read-status--error")}),o.addEventListener("click",()=>{vt()}),s.addEventListener("click",()=>{_e(),o.hidden=!0,d+1<l.length?m(d+1):(r&&(r.textContent="🎉 Echo Read complete!",r.className="echo-read-status echo-read-status--done"),s.hidden=!0,n.hidden=!0,setTimeout(c,2e3))}),a.addEventListener("click",()=>{$(),pe(),_e(),c()})}function us(){ge||(ge=!0,ee=Date.now(),document.getElementById("btn-fluency-start").disabled=!0,document.getElementById("btn-fluency-done").disabled=!1,ue=setInterval(()=>{const e=Math.floor((Date.now()-ee)/1e3),t=Math.floor(e/60),s=e%60,n=document.getElementById("fluency-clock");n&&(n.textContent=`${t}:${String(s).padStart(2,"0")}`)},500))}function Re(e,t){if(!ge&&ue===null||(clearInterval(ue),ue=null,ge=!1,document.getElementById("btn-fluency-start").disabled=!1,document.getElementById("btn-fluency-done").disabled=!0,!e||!ee))return;const s=(Date.now()-ee)/1e3;if(ee=null,s<2)return;const n=Math.round(e/s*60),o=Math.floor(s/60),a=Math.round(s%60);t&&Nn({storyId:t.id,wcpm:n,durationSec:s,wordCount:e});let r;n>=60?r="🌟 Fluent reader!":n>=40?r="📈 Building fluency — great progress!":r="📖 Keep practising — try reading it again!";const l=document.getElementById("fluency-result");if(l){l.hidden=!1,l.innerHTML=`
      <div class="fluency-result-inner">
        <span class="fluency-time">Time: ${o}:${String(a).padStart(2,"0")}</span>
        <span class="fluency-wcpm"><strong>${n}</strong> words/min</span>
        <span class="fluency-level">${r}</span>
      </div>
      <p class="fluency-tip">Tip: Read the story again to improve your speed!</p>
    `;const d=document.getElementById("story-quest-cta");d&&(d.hidden=!1)}}export{We as _highlightGraphemes,jn as _isMeetWordsCompletedToday,Qe as _logComprehensionAttempt,Ke as _setMeetWordsCompleted,fs as cleanupStoryMode,ms as initStoryMode,bs as showBrowser};
