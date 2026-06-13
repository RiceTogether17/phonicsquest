import{v as ge}from"./vocabPassages-Cavza-fi.js";import{s as k,O as ct,Q as it,q as Y,a as V,x as m,g as rt,K as ae,E as P,I as dt,F as Fe,H as fe}from"./index-CEXKm1qS.js";import{a as ut,b as Ve,c as te,L as ie,s as pt,j as vt,r as mt,M as ft,N as wt,o as bt,e as D,q as De,t as ht,K as yt,w as kt,x as gt,y as Ue,z as xt,A as je,B as $t,O as Et,D as me,E as ze,H as St,I as Ct,G as Lt,k as Tt,f as _t,h as Bt,p as It,i as At,v as Ge,J as Xe,F as qt}from"./masteryMap-Jo_7A1IS.js";import"./gsap-C8pce-KX.js";const Qe="srsSchedule",Pe=2.5,Mt=1.3,Pt=180;function Ye(){return new Date().toISOString().slice(0,10)}function Wt(e){const n=new Date;return n.setDate(n.getDate()+e),n.toISOString().slice(0,10)}function Je(){return k.get(Qe)||{}}function Rt(e){k.set(Qe,e)}function Ht(e){return e?{...e,repetitions:typeof e.repetitions=="number"?e.repetitions:0,easeFactor:typeof e.easeFactor=="number"?e.easeFactor:Pe}:{interval:1,repetitions:0,easeFactor:Pe,dueAt:Ye(),correct:0,wrong:0}}function Ot(e,n){let{interval:t,repetitions:l,easeFactor:o}=e;const s=n?4:1,i=.1-(5-s)*(.08+(5-s)*.02);return o=Math.max(Mt,o+i),n?(l+=1,l===1?t=1:l===2?t=6:t=Math.round(t*o),t=Math.min(t,Pt)):(l=0,t=1),{interval:t,repetitions:l,easeFactor:o,dueAt:Wt(t)}}function We(e,n){if(!e)return;const t=Je(),l=Ht(t[e]),o=Ot(l,n);t[e]={...l,...o,correct:l.correct+(n?1:0),wrong:l.wrong+(n?0:1)},Rt(t)}function Nt(e){const n=Je(),t=Ye();return(Array.isArray(e)?e:Object.keys(n)).filter(o=>n[o]&&t>=n[o].dueAt)}function Ft(){return Nt().length}let h=null,A=null,w=null,C="p1",L=[],$=[],B=null,xe=0,$e=0,we=0,be=0,q=null,_=-1,R={},z=0,H=!1,re=0,Ee=0;const F={p1:"P1",p2:"P2",p3:"P3",p4:"P4",p5:"P5",p6:"P6"},Ke={p1:"🌱",p2:"🌿",p3:"🌳",p4:"🔥",p5:"💎",p6:"👑"};function he(){const e=rt();if(!e)return"p3";if(e.schoolLevel!=="primary")return"p1";const n=e.primaryGrade;return n&&/^P[1-6]$/i.test(n)?n.toLowerCase():"p3"}function Vt(){return F[he()]||"P3"}let M=0,S="practice",Ze=0,G=!1,Z=[],ce={},I=[],de=0,ye=!1,J=!1,ue=0,ee=0,X={};const N={morphologicalAffix:{icon:"🧩",rule:"Word parts: a PREFIX comes before the root, a SUFFIX comes after it.",example:'"un-" + "happy" = "unhappy" (not happy)  ·  "teach" + "-er" = "teacher" (one who teaches)',tip:"Find the ROOT word meaning first, then choose the affix that changes it in the right direction."},synonymContrast:{icon:"📚",rule:"A synonym means nearly the same thing; an antonym means the opposite.",example:'"Happy" ↔ "joyful" (synonyms)  ·  "Happy" ↔ "sad" (antonyms)',tip:"Read the tone of the passage — does it need a SAME-meaning word or an OPPOSITE one?"},collocationCloze:{icon:"🤝",rule:"Collocations are word partners that always travel together in natural English.",example:'"make a decision" (not "do a decision")  ·  "heavy rain" (not "strong rain")',tip:"Ask: which option sounds most natural next to the surrounding words?"},connectorClue:{icon:"🔗",rule:"Connectors show HOW two ideas relate: contrast, reason, result, sequence, or addition.",example:'"She was tired, SO she rested." (result)  ·  "Although it rained, they played." (contrast)',tip:"Contrast: but/although · Reason: because/since · Result: so/therefore · Sequence: then/finally"},grammaticalRole:{icon:"🔤",rule:"Every word has a role: NOUN (thing), VERB (action), ADJECTIVE (describes noun), ADVERB (describes verb, often -ly).",example:'"The FAST (adj) car ZOOMED (verb) QUICKLY (adv) past the BUILDING (noun)."',tip:'After "the/a" = noun · Before a noun = adjective · Modifying a verb = adverb.'},default:{icon:"🔍",rule:"Context clues are hints in the surrounding sentences that help you find the right answer.",example:'"The scientist performed many ___. Each experiment took days." → the blank must be a noun meaning tests.',tip:"Read the whole sentence AND the sentence before/after. Together they usually reveal the answer."}},Dt={noun:"pos-noun",verb:"pos-verb",adjective:"pos-adjective",adverb:"pos-adverb"},et={reason:"Reason connector (because/since)",contrast:"Contrast connector (although/however)",sequence:"Sequence connector (then/next/finally)",result:"Result connector (so/therefore)",addition:"Addition connector (also/furthermore)"};function tt(e){const n=Math.max(1,Math.min(3,Number(e)||1));return`${"⭐".repeat(n)}${"☆".repeat(3-n)}`}function nt({accuracy:e=0,hintsUsed:n=0}){return e>=90&&n<=1?3:e>=70&&n<=3?2:1}function Ut(e,n=""){const t=(e||"").toLowerCase(),l=ct,o=it,s=(n.match(/(un-|re-|dis-|mis-|in-|im-|-ing|-ed|-ly|-er|-est|-ful|-less|-tion|-sion|-ment|-ness|-able|-ible)/i)||[])[0],i=s?s.replace(/^-/,"").replace(/-$/,""):"";if(s){if(s.startsWith("-")){const a=i;return{root:e.slice(0,Math.max(0,e.length-a.length)),affix:a,type:"suffix"}}const u=i;return{root:e.slice(u.length),affix:u,type:"prefix"}}const r=l.find(u=>t.startsWith(u)&&t.length>u.length+2);if(r)return{root:e.slice(r.length),affix:r,type:"prefix"};const c=o.find(u=>t.endsWith(u)&&t.length>u.length+2);return c?{root:e.slice(0,e.length-c.length),affix:c,type:"suffix"}:{root:e,affix:"",type:"suffix"}}function U(e){return w==="morphologicalAffix"||(e==null?void 0:e.mode)==="affix"}function lt(){const e=$.findIndex(n=>n===null);return e===-1?$.length-1:e}function jt(e,n){const t={...k.get("wvqWordPerformance")||{}},l=String(e||"").toLowerCase(),o=t[l]||{attempts:0,correct:0};t[l]={attempts:o.attempts+1,correct:o.correct+(n?1:0)},k.set("wvqWordPerformance",t)}function Re(e,n){if(!e)return;const t={...k.get("clueStats")||{}},l={...t.morphologicalAffix||{}},o=l[e]||{attempts:0,correct:0};l[e]={attempts:o.attempts+1,correct:o.correct+(n?1:0)},t.morphologicalAffix=l,k.set("clueStats",t)}function zt(e,n=["p1","p2","p3","p4","p5","p6"]){return n.reduce((t,l)=>t+ie({category:e,level:l,wvqCompletedByPassage:k.get("wvqCompletedByPassage")||{},wvqCompleted:k.get("wvqCompleted")||{}}),0)}function Gt(e){const n=e.definitions||{};return(e.wordBank||[]).map(t=>({word:t,definition:n[t]||"Use the sentence context and clue to infer this word.",pos:(e.partOfSpeechMap||{})[t]||"word",collocationHint:(e.collocationHintsByWord||{})[t]||e.collocationHint||""}))}function mn(e,n){h=e,A=n}function fn(){Se()}function ke(){h&&(h.innerHTML=""),L=[],$=[],B=null,q&&(document.removeEventListener("keydown",q),q=null)}function Se(){var u;if(!h)return;const e=k.get("wvqCompleted")||{};he();const n=Vt(),t=Ft();let l='<div class="wv-browser">';l+=`<div class="wv-level-context-banner" aria-live="polite">
    Currently practising: <strong>${n} Vocabulary Cloze</strong>
  </div>`,t>0&&(l+=`<div class="wv-srs-due-badge" aria-live="polite">📅 ${t} word${t===1?"":"s"} due for review</div>`),l+='<div class="wv-cat-grid">';const o=Object.keys(V),s=Y.getRecommendedSkill("wordVault",o),i=ut({mode:"wordVault",level:n,masteryMap:k.get("masteryMap")||{}}),r=i.length?i:Ve({level:n,weakSkillsMap:k.get("wvWeakSkills")||{}}).map(a=>({skill:a.skill,skillLabel:te(a.skill),attempts:a.attempts,wrong:a.wrong,accuracy:Math.round((a.attempts-a.wrong)/Math.max(1,a.attempts)*100),lastExample:null}));for(const[a,d]of Object.entries(V)){e[a];const p=["p1","p2","p3","p4","p5","p6"].filter(O=>ie({category:a,level:O,wvqCompletedByPassage:k.get("wvqCompletedByPassage")||{},wvqCompleted:e})>0).length,f=Object.values(ge[a]||{}),v=f.filter(O=>(O||[]).length>0).length,b=f.reduce((O,le)=>O+(le||[]).length,0),g=zt(a),y=v?Math.round(b/v):0,E=a===s;l+=`
      <button class="wv-cat-btn ${E?"wv-cat-btn--recommended":""}" data-cat="${a}"
              style="--cat-color:${d.color}"
              aria-label="${d.label}${E?" (recommended)":""}">
        <span class="wv-cat-icon">${d.icon}</span>
        <span class="wv-cat-label">${d.label}</span>
        <span class="wv-cat-desc">${d.desc}</span>
        <span class="wv-cat-progress">${p}/${v} levels · ${g}/${b} passages (~${y}/level)${E?" · Recommended":""}</span>
      </button>`}const c=r.map(a=>{const d=pt(a),p=a.lastExample?` · Last slip: "${m(a.lastExample.chosen||"—")}" → "${m(a.lastExample.correct||"?")}"`:"";return`<li>${m(a.skillLabel||te(a.skill))}: ${a.wrong}/${a.attempts} · ${m(d)}${p}</li>`}).join("");l+=`</div>
    <div class="cloze-cat-actions">
      <button class="btn btn--ghost btn--sm" id="wv-mastery-review">Review Weak Words</button>
      ${r.length?`<ul class="cloze-mastery-list">${c}</ul>`:'<p class="cloze-cat-subtitle">Read the sentence first. Weak skills will appear here.</p>'}
    </div>
  </div>`,h.innerHTML=l,h.querySelectorAll(".wv-cat-btn").forEach(a=>{a.addEventListener("click",()=>{w=a.dataset.cat,ne(w)})}),(u=document.getElementById("wv-mastery-review"))==null||u.addEventListener("click",()=>{w=s||o[0],C=he(),pe(w,C)})}function ne(e){var i,r,c,u;if(!h)return;const n=V[e],t=ge[e]||{},l=(k.get("wvqCompleted")||{})[e]||{},o=["p1","p2","p3","p4","p5","p6"];let s=`
    <div class="wv-level-browser">
      <div class="wv-level-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-cats">← Categories</button>
        <span class="wv-level-title" style="color:${n.color}">${n.icon} ${n.label}</span>
      </div>
      <p class="wv-level-desc">${n.desc}</p>
      <div class="cloze-mode-toggle">
        <span class="cloze-mode-label">Mode:</span>
        <button class="btn btn--ghost btn--sm ${S==="practice"?"is-active":""}" id="wv-mode-practice" aria-pressed="${S==="practice"}">Practice Mode</button>
        <button class="btn btn--ghost btn--sm ${S==="exam"?"is-active":""}" id="wv-mode-exam" aria-pressed="${S==="exam"}">Exam Mode</button>
        <span class="cloze-mode-hint">${S==="practice"?"Hints + scan + per-blank feedback.":"No hints, timed, review only at the end."}</span>
      </div>
      <div class="wv-level-grid">`;for(const a of o){const d=t[a],p=d&&d.length>0,f=ie({category:e,level:a,wvqCompletedByPassage:k.get("wvqCompletedByPassage")||{},wvqCompleted:k.get("wvqCompleted")||{}})>0,v=ie({category:e,level:a,wvqCompletedByPassage:k.get("wvqCompletedByPassage")||{},wvqCompleted:k.get("wvqCompleted")||{}});s+=`
      <button class="wv-level-btn ${f?"wv-level-btn--done":""} ${p?"":"wv-level-btn--locked"}"
              data-level="${a}"
              ${p?"":'disabled aria-disabled="true"'}
              style="--cat-color:${n.color}"
              aria-label="${F[a]}${f?" – completed":""}">
        <span class="wv-level-icon">${f?tt(((i=l[a])==null?void 0:i.stars)||1):Ke[a]}</span>
        <span class="wv-level-name">${F[a]}</span>
        <span class="wv-level-count">${v}/${(d||[]).length} passages</span>
      </button>`}s+="</div></div>",h.innerHTML=s,(r=document.getElementById("wv-back-cats"))==null||r.addEventListener("click",()=>Se()),(c=document.getElementById("wv-mode-practice"))==null||c.addEventListener("click",()=>{S="practice",ne(e)}),(u=document.getElementById("wv-mode-exam"))==null||u.addEventListener("click",()=>{S="exam",ne(e)}),h.querySelectorAll(".wv-level-btn:not([disabled])").forEach(a=>{a.addEventListener("click",()=>{C=a.dataset.level,pe(e,C)})})}function pe(e,n){const t=(ge[e]||{})[n]||[];if(!t.length)return;xe=0,$e=0,Ee=0,M=0,ue=0,ee=0,X={},Ze=Date.now(),Z=[],G=!1;const l=k.get("wvqWordPerformance")||{},o=t.map(r=>{const c=(r.answers||[]).reduce((a,d)=>{const p=l[String(d||"").toLowerCase()]||{attempts:0,correct:0},f=p.attempts?p.correct/p.attempts:.45;return a+f},0)/Math.max(1,(r.answers||[]).length),u=Math.max(.2,1.2-c);return{passage:r,weight:u}}),s=o.reduce((r,c)=>r+c.weight,0);let i=Math.random()*s;B=o[o.length-1].passage;for(const r of o)if(i-=r.weight,i<=0){B=r.passage;break}S!=="exam"?en(w,()=>He(B)):He(B)}function He(e){const n=vt(e);if(L=n.bankWords,$=n.blankFills,ce={},I=[],de=0,U(e)&&(I=(e.answers||[]).map((t,l)=>{const o=(e.hints||[])[l]||"";return{...Ut(t,o),answer:t,meaning:o,definition:(e.definitions||{})[t]||o||"Word built with affix."}}),L=I.map((t,l)=>({id:l,word:t.affix?`${t.type==="prefix"?t.affix+"-":"-"+t.affix}`:"base",used:!1}))),R={},z=0,re=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((l,o)=>l.blankIndex-o.blankIndex)[0];_=(t==null?void 0:t.blankIndex)??-1,H=!0}else _=-1,H=!1;ye=!1,J=!1,Xt(e)}function Xt(e){if(h){if(ye){Oe(e);return}mt({host:h,quest:"vault",passageTitle:e.title||"Word Vault",passageText:e.text||"",onContinue:()=>{ye=!0,Oe(e)},onQuit:()=>{ke(),A==null||A()}})}}function Oe(e){if(!h)return;if(J||S==="exam"){K(e);return}const n=ft(e);if(!n){J=!0,K(e);return}h.innerHTML=`
    <div class="wv-game wv-game--scan">
      <div class="wv-game-header">
        <span class="wv-game-badge">Scan Step</span>
      </div>
      <h3 class="wv-passage-title">${m(e.title||"Word Vault")}</h3>
      <p class="wv-instruction">What clue helps you?</p>
      <div id="wv-scan-host"></div>
    </div>`;const t=document.getElementById("wv-scan-host");wt({host:t,task:n,onAnswer:({correct:l})=>{J=!0,ee++,l&&ue++,K(e)},onSkip:()=>{J=!0,K(e)}})}function K(e){var i,r,c,u,a,d,p,f;if(!h)return;const n=V[w],t=C,l=e.clues&&e.clues.length>0&&H,o=w==="grammaticalRole",s=D(S);h.innerHTML=`
    <div class="wv-game">
      <div class="wv-game-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-levels">← Levels</button>
        <span class="wv-game-badge" style="color:${n.color}">${n.icon} ${n.label}</span>
        <span class="wv-game-level">${Ke[t]} ${F[t]}</span>
        <span class="wv-game-level">${s.label}</span>
      </div>

      <h3 class="wv-passage-title">${e.title}</h3>
      <div class="wv-progress"><span style="width:${(xe/Math.max(1,$e||1)*100).toFixed(0)}%"></span></div>

      ${l?Yt(e):""}

      <p class="wv-instruction" id="wv-instruction">
        ${l?`🔍 ${e.clueMission||"Tap the context clue in the passage first!"}`:"🔑 Tap a word to fill the next blank!"}
      </p>

      ${o?'<div class="wv-pos-legend">POS: <span class="pos-noun">Noun</span><span class="pos-verb">Verb</span><span class="pos-adjective">Adjective</span><span class="pos-adverb">Adverb (-ly)</span></div>':""}

      <div class="wv-passage-text" id="wv-passage-text" aria-live="polite"></div>

      <div class="wv-bank-wrapper ${l?"wv-bank-wrapper--locked":""}" id="wv-bank-wrapper">
        ${l?'<div class="wv-bank-lock-msg">🔒 Find the context clue first!</div>':""}
        <div class="wv-bank" id="wv-bank" aria-label="Word choices"></div>
      </div>

      ${s.allowInfoPanel?`<aside class="wv-info-panel ${G?"wv-info-panel--open":""}" id="wv-info-panel" aria-live="polite"></aside>`:""}

      <div class="wv-actions">
        <button class="btn btn--ghost btn--sm" id="wv-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="wv-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${s.allowInfoPanel?'<button class="btn btn--ghost btn--sm" id="wv-info" aria-label="Show definitions panel">ℹ️ Info</button>':""}
        ${s.allowHints?'<button class="btn btn--ghost btn--sm" id="wv-hint">💡 Hint</button>':""}
        ${s.allowInfoPanel?'<button class="btn btn--ghost btn--sm" id="wv-rule-hint" aria-expanded="false">📖 Show Rule</button>':""}
        <button class="btn btn--primary" id="wv-check" ${l?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="wv-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="wv-rule-hint-panel" hidden></div>

      <div class="wv-feedback" id="wv-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,Q(e),j(e),Ne(e),l&&Jt(e),(i=document.getElementById("wv-back-levels"))==null||i.addEventListener("click",()=>ne(w)),(r=document.getElementById("wv-clear"))==null||r.addEventListener("click",()=>{bt(L,$),U(e)&&($=Array(e.answers.length).fill(null),L.forEach(v=>{v.used=!1})),Q(e),j(e)}),(c=document.getElementById("wv-listen"))==null||c.addEventListener("click",()=>{let v=e.text;for(const b of e.answers)v=v.replace("___",b);P.speakWord(v)}),(u=document.getElementById("wv-info"))==null||u.addEventListener("click",()=>{G=!G,Ne(e)}),(a=document.getElementById("wv-hint"))==null||a.addEventListener("click",()=>{const v=lt(),b=(e.hints||[])[v]||(e.clueType?et[e.clueType]||e.clueType:"Look for nearby context clues.");M=Ge(M),T(`💡 ${b}`,!1),U(e)&&I[v]?P.speakWord(I[v].meaning||`Affix ${I[v].affix}`):w==="collocationCloze"&&e.collocationHint&&P.speakWord(e.collocationHint)}),(d=document.getElementById("wv-rule-hint"))==null||d.addEventListener("click",()=>{const v=document.getElementById("wv-rule-hint"),b=document.getElementById("wv-rule-hint-panel");if(!v||!b)return;const g=b.hidden;if(b.hidden=!g,v.setAttribute("aria-expanded",String(g)),v.textContent=g?"📖 Hide Rule":"📖 Show Rule",g){const y=N[w]||N.default;b.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${m(y.rule)}</p>
        <p class="mcq-hint-eg"><em>${m(y.example)}</em></p>
        <p class="mcq-hint-tip">${m(y.tip)}</p>`}}),(p=document.getElementById("wv-check"))==null||p.addEventListener("click",()=>Zt(e)),(f=document.getElementById("wv-quit"))==null||f.addEventListener("click",()=>{ke(),A==null||A()}),q&&document.removeEventListener("keydown",q),q=v=>{var b;v.key==="Enter"&&!H&&(v.preventDefault(),(b=document.getElementById("wv-check"))==null||b.click()),v.key==="Escape"&&(ke(),A==null||A())},document.addEventListener("keydown",q)}function Ne(e){if(!D(S).allowInfoPanel)return;const n=document.getElementById("wv-info-panel");if(!n)return;if(n.className=`wv-info-panel ${G?"wv-info-panel--open":""}`,!G){n.innerHTML="";return}const t=Gt(e);n.innerHTML=`<h4>Word Guide</h4>${t.map(l=>`<div class="wv-info-row"><strong>${m(l.word)}</strong><span>${m(l.definition)}</span><small>${m(l.pos)}${l.collocationHint?` · ${m(l.collocationHint)}`:""}</small></div>`).join("")}`}function Qt(){const e=Object.values(R||{}).map(ze);if(!e.length)return"☆ ☆ ☆";const n=e.reduce((l,o)=>l+o,0)/e.length,t=n>=.85?3:n>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function Yt(e){const n=Ce(e);if(!n)return"";const t=D(S);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Context Clue</span>
        <span class="clue-hunt-sub">Blank ${_+1} · Clue Score ${Qt()}</span>
      </div>
      <p class="clue-hunt-prompt">${m(n.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function Jt(e){var n,t;D(S).allowHints&&((n=document.getElementById("clue-hint-btn"))==null||n.addEventListener("click",()=>{const l=Ce(e);if(!l)return;z=Math.min(z+1,4),M=Ge(M);const{message:o}=kt(z,l),s=document.getElementById("clue-hint-msg");s&&(s.textContent=o,s.className="clue-hint-msg clue-hint-msg--visible"),z>=4&&(R[_]="weak",ve(e,"weak"))}),(t=document.getElementById("clue-skip-btn"))==null||t.addEventListener("click",()=>{_<0||(R[_]="weak",ve(e,"weak"))}))}function st(e,n){const t=Ce(n);if(!t)return;const l=qt(e,t),o=Xe(l),s=document.getElementById("clue-hunt-feedback");s&&(s.textContent=o.message,s.className=`clue-hunt-feedback ${o.cssClass}`);const i=document.getElementById("wv-passage-text");i&&De({container:i,text:n.text,activeBlankIndex:_,selectedWord:e,selectedResult:l,filledAnswers:$.map(r=>{var c;return r!==null&&((c=L.find(u=>u.id===r))==null?void 0:c.word)||""}),onTapWord:r=>st(r,n)}),k.recordClueAttempt({quest:"wordVault",result:l,clueType:t.clueType}),l==="strong"||l==="partial"?(R[_]=l,P.playSfx(l==="strong"?"correct":"pop"),setTimeout(()=>ve(n,l),800)):(re++,P.playSfx("wrong"),re>=2&&(R[_]="weak",setTimeout(()=>ve(n,"weak"),1e3)))}function ve(e,n){if(!H)return;H=!1,_=-1,Ee+=ze(n||"weak");const t=document.getElementById("wv-instruction");t&&(t.textContent="🔑 Now tap a word to fill the blank!");const l=document.getElementById("wv-bank-wrapper");l&&(l.className="wv-bank-wrapper");const o=document.getElementById("wv-check");o&&(o.disabled=!1),j(e)}function Q(e){const n=document.getElementById("wv-passage-text");if(n){if(H){const t=$.map(l=>{var o;return l!==null&&((o=L.find(s=>s.id===l))==null?void 0:o.word)||""});De({container:n,text:e.text,activeBlankIndex:_,filledAnswers:t,onTapWord:l=>st(l,e)});return}if(U(e)){const t=e.text.split("___");let l="";t.forEach((o,s)=>{if(l+=`<span>${o}</span>`,s<t.length-1){const i=$[s],r=i!==null?L.find(u=>u.id===i):null,c=I[s];if(r){const u=(c==null?void 0:c.answer)||"";l+=`<button class="wv-blank wv-blank--filled" data-blank="${s}" aria-label="Remove ${u}">${u}</button>`}else{const u=c?c.type==="prefix"?`${c.root}`:`${c.root}`:"";l+=`<button class="wv-blank wv-blank--affix" data-blank="${s}" aria-label="Blank ${s+1}">${u}<span class="wv-affix-slot">${(c==null?void 0:c.type)==="prefix"?"prefix":"suffix"}</span></button>`}}}),n.innerHTML=l,n.querySelectorAll(".wv-blank--filled").forEach(o=>{o.addEventListener("click",()=>{const s=parseInt(o.dataset.blank,10),i=$[s],r=L.find(c=>c.id===i);r&&(r.used=!1),$[s]=null,Q(e),j(e)})});return}ht({container:n,text:e.text,blankFills:$,bankWords:L,blankClass:"wv-blank",filledClass:"wv-blank--filled",emptyBlankAria:t=>`Blank ${t+1}`,removeBlankAria:t=>`Remove ${t}`,onRemoveWord:()=>{Q(e),j(e)}})}}function j(e){var o;const n=document.getElementById("wv-bank");if(!n)return;if(H){n.innerHTML=L.map(s=>`
      <button class="wv-word-chip wv-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${ae(s.word)}">${m(s.word)}</button>
    `).join("");return}const t=lt(),l=((o=e.answers)==null?void 0:o[t])||"";n.innerHTML=L.map(s=>{var a,d;const i=s.used,r=Kt(e,s.word),c=w==="collocationCloze"&&((a=e.collocationHintsByWord)!=null&&a[l])&&!i?` title="${ae(e.collocationHintsByWord[s.word]||"")}"`:"",u=w==="collocationCloze"&&((d=e.collocationHintsByWord)!=null&&d[s.word])?`${s.word} … ${(e.collocationHintsByWord[s.word].split("+")[1]||"").trim()}`:s.word;return`<button class="wv-word-chip ${r} ${i?"wv-word-chip--used":""}" data-id="${s.id}" ${i?'disabled aria-disabled="true"':""}${c} aria-label="${ae(u)}">${m(u)}</button>`}).join(""),n.querySelectorAll(".wv-word-chip:not([disabled])").forEach(s=>{s.addEventListener("click",()=>{var d,p,f,v,b,g;const i=parseInt(s.dataset.id,10),r=L.find(y=>y.id===i);if(!r||r.used)return;const c=$.findIndex(y=>y===null);if(c===-1)return;if(U(e)){const y=(d=I[c])==null?void 0:d.affix,E=r.word.replace(/^-/,"").replace(/-$/,"");if(y!==E){ce[c]=(ce[c]||0)+1,T(`Not quite. ${E||"That option"} does not fit this root.`,!1),ce[c]>=2&&T(`💡 Affix meaning: ${((p=I[c])==null?void 0:p.meaning)||"Use the affix that matches the word meaning."}`,!1),Re(E,!1);return}r.used=!0,$[c]=i,Re(E,!0)}else if(!yt(L,$,i))return;P.playSfx("pop");const u=(f=e.answers)==null?void 0:f[c];if(w==="synonymContrast"&&r.word!==u){const y=(e.contrastPairs||[]).find(E=>E.word===r.word);y&&T(y.explanation||`${y.word} is linked with ${y.pair}.`,!1)}if(w==="connectorClue"&&r.word!==u){const y=e.clueType||((v=ot(e,c))==null?void 0:v.clueType);T(`Connector type mismatch. ${et[y]||"Check connector meaning."}`,!1)}if(w==="collocationCloze"&&r.word!==u){const y=((b=e.collocationHintsByWord)==null?void 0:b[u])||e.collocationHint||"",E=((g=e.collocationHintsByWord)==null?void 0:g[r.word])||"";T(`Collocation tip: ${y||`Use ${u}`}${E?` (not ${E})`:""}`,!1)}const a=(e.clues||[]).slice().sort((y,E)=>y.blankIndex-E.blankIndex).find(y=>$[y.blankIndex]===null&&!R.hasOwnProperty(y.blankIndex));a?(_=a.blankIndex,H=!0,z=0,re=0,K(e)):(Q(e),j(e))})})}function Kt(e,n){if(w==="synonymContrast"){const t=(e.contrastPairs||[]).find(l=>l.word===n);return(t==null?void 0:t.type)==="antonym"?"wv-word-chip--antonym":(t==null?void 0:t.type)==="synonym"?"wv-word-chip--synonym":""}if(w==="grammaticalRole"){const t=(e.partOfSpeechMap||{})[n];return Dt[t]||""}return""}function Ce(e){return e.clues&&e.clues.find(n=>n.blankIndex===_)||null}function ot(e,n){return e.clues&&e.clues.find(t=>t.blankIndex===n)||null}function se(e,n){const t=w==="collocationCloze"?"collocation":"vocabularyInContext";return e.answers.map((l,o)=>{var b,g,y;const s=ot(e,o),i=je(e,o),r=Ue(i.primarySkill||e.skillTag||t),c=n[o]||"",u=c!==l,a=u?St({meta:i,chosen:c,correct:l}):null,d=i.simpleMeaning||(e.definitions||{})[l]||"Use context clues to find the meaning.",p=((b=(e.wrongOptionTraps||[]).find(E=>E.option===c))==null?void 0:b.reason)||((g=i.wrongOptionTraps)==null?void 0:g[c]),f=[d];p?f.push(`Trap check: ${p}`):f.push("Choose the word that matches the clue meaning.");const v=[Ct(r)];return i.partOfSpeech&&v.push(`POS: ${i.partOfSpeech}.`),i.writingUse&&v.push(`Writing tip: ${i.writingUse}`),{blank:`#${o+1}`,passageTitle:e.title,studentAnswer:c,correctAnswer:l,status:u?"Try again":"Correct",skillLabel:te(r),clueTypeLabel:Lt(i.clueType||(s==null?void 0:s.clueType)||e.clueType),clue:((y=s==null?void 0:s.acceptableSpans)==null?void 0:y[0])||(e.hints||[])[o]||"Look near this blank.",explanation:f.join(" "),nextStepPrompt:v.join(" "),whyWrong:a==null?void 0:a.whyWrong,whyRight:a==null?void 0:a.whyRight,missedClue:a==null?void 0:a.missedClue,examTip:i.examTip||(a?a.examTip:"")}})}function Zt(e){if($.some(d=>d===null)){T("Fill all the blanks first! 🔑",!1);return}const n=U(e)?$.map((d,p)=>{const f=L.find(g=>g.id===d),v=((f==null?void 0:f.word)||"").replace(/^-/,"").replace(/-$/,""),b=I[p];return b?b.type==="prefix"?`${v}${b.root}`:`${b.root}${v}`:""}):gt($,L),t=n.filter((d,p)=>d===e.answers[p]).length,l=e.answers.length,o=t===l,s=D(S),i=Ue(e.skillTag||(w==="collocationCloze"?"collocation":"vocabularyInContext"));$e++;const r=xt({storageKey:"wvWeakSkills",level:String(C).toUpperCase(),skills:e.answers.map(()=>i),wrongSkillSet:new Set(o?[]:[i]),current:k.get("wvWeakSkills")||{}});k.set("wvWeakSkills",r);let c=k.get("masteryMap")||{};const u=se(e,n),a=String(C).toUpperCase();if(u.forEach((d,p)=>{const f=je(e,p),v=d.status!=="Correct",b=f.primarySkill||i;X[b]||(X[b]={correct:0,total:0,label:d.skillLabel||te(b),lastWrongExamples:[]});const g=X[b];g.total+=1,v?d.correctAnswer&&g.lastWrongExamples.length<3&&g.lastWrongExamples.push(d.correctAnswer):g.correct+=1,c=$t({mode:"wordVault",level:a,category:w,skill:b,clueType:f.clueType,wasWrong:v,example:v?{passageId:e.id,blankIndex:p,chosen:d.studentAnswer,correct:d.correctAnswer,clueType:f.clueType}:null,current:c})}),k.set("masteryMap",c),n.forEach((d,p)=>jt(e.answers[p],d===e.answers[p])),s.showFinalReviewOnly){we=t,be=l,Z.push(...u.filter(p=>p.status!=="Correct").map(p=>({passageTitle:e.title,blank:p.blank,studentAnswer:p.studentAnswer,correctAnswer:p.correctAnswer,explanation:p.explanation,skillLabel:p.skillLabel})));const d=k.get("wvqExamAttempts")||[];d.push({category:w,level:C,passageId:e.id,blankCorrect:t,blankTotal:l,submittedAt:Date.now()}),k.set("wvqExamAttempts",d.slice(-150)),oe({blankCorrect:t,blankTotal:l});return}if(o){xe++,dt.recordCorrect(2e3,!1),D(S).confettiPerPassage&&Fe(),P.playSfx("correct"),fe.celebrate(!1);const d=Math.round(t/Math.max(1,l)*100),p=nt({accuracy:d,hintsUsed:M});if(e.id){const v=Et({category:w,level:C,passageId:e.id,stars:p,accuracy:d,wvqCompletedByPassage:k.get("wvqCompletedByPassage")||{},wvqCompleted:k.get("wvqCompleted")||{}});k.set("wvqCompletedByPassage",v.nextByPassage),k.set("wvqCompleted",v.nextCompleted)}Y.recordAttempt({quest:"wordVault",skill:w,correct:!0,responseMs:1500,level:C}),Y.updateSkill("wordVault",w,!0),document.querySelectorAll(".wv-blank--filled").forEach(v=>v.classList.add("wv-blank--correct")),we=t,be=l;const f=()=>{S==="practice"?rn(e,()=>oe({blankCorrect:t,blankTotal:l})):oe({blankCorrect:t,blankTotal:l})};me({host:h.querySelector(".wv-game"),title:"Answer Review",rows:se(e,n),onContinue:()=>{if(U(e))return ln(e,()=>setTimeout(()=>f(),300));if(w==="synonymContrast")return sn(e,()=>setTimeout(()=>f(),300));if(w==="collocationCloze")return on(e,()=>setTimeout(()=>f(),300));if(e.clues&&e.clues.length>0)return nn(e,()=>setTimeout(()=>f(),400));f()}})}else{if(P.playSfx("wrong"),Y.recordAttempt({quest:"wordVault",skill:w,correct:!1,responseMs:2e3,level:C}),Y.updateSkill("wordVault",w,!1),document.querySelectorAll(".wv-blank--filled").forEach((d,p)=>{const f=n[p]||"";d.classList.toggle("wv-blank--wrong",f!==e.answers[p])}),fe.encourage(),de++,S==="exam"){me({host:h.querySelector(".wv-game"),title:"Exam Submission Review",rows:se(e,n),onContinue:()=>oe({blankCorrect:t,blankTotal:l})});return}de>=2?(T("❌ Let's review the mistakes first.",!1),setTimeout(()=>{document.querySelectorAll(".wv-blank--wrong").forEach(d=>d.classList.remove("wv-blank--wrong")),me({host:h.querySelector(".wv-game"),title:"Review Mistakes",rows:se(e,n),onContinue:()=>tn(e)})},800)):(T("❌ Some blanks are wrong – check and try again!",!1),setTimeout(()=>{document.querySelectorAll(".wv-blank--wrong").forEach(p=>p.classList.remove("wv-blank--wrong"));const d=document.getElementById("wv-feedback");d&&(d.hidden=!0)},1800))}}function en(e,n){var o,s;if(!h)return;const t=N[e]||N.default,l=V[e]||{icon:"📘",label:e};h.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary tip: ${ae(l.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${t.icon||l.icon}</div>
      <h2 class="mcq-rule-title">${m(l.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${m(t.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${m(t.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${m(t.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="wv-rule-start">Got it — start passage →</button>
        <button class="btn btn--ghost" id="wv-rule-skip">Skip →</button>
      </div>
    </div>`,(o=h.querySelector("#wv-rule-start"))==null||o.addEventListener("click",n),(s=h.querySelector("#wv-rule-skip"))==null||s.addEventListener("click",n)}function tn(e){var o,s;if(!h)return;const n=N[w]||N.default,t=document.getElementById("wv-teachback-overlay");t&&t.remove();const l=document.createElement("div");l.id="wv-teachback-overlay",l.className="wv-teachback-overlay",l.innerHTML=`
    <div class="wv-tb-panel">
      <div class="wv-tb-header">
        <span class="wv-tb-icon">${n.icon}</span>
        <h3 class="wv-tb-title">Quick Skill Reminder</h3>
      </div>
      <p class="wv-tb-rule">${m(n.rule)}</p>
      <div class="wv-tb-example">${m(n.example)}</div>
      <p class="wv-tb-tip">💡 ${m(n.tip)}</p>
      <button class="btn btn--primary wv-tb-btn" id="wv-tb-got-it">
        Got it — Try again →
      </button>
    </div>`,(o=h.querySelector(".wv-game"))==null||o.appendChild(l),(s=document.getElementById("wv-tb-got-it"))==null||s.addEventListener("click",()=>{l.remove(),L.forEach(r=>{r.used=!1}),$.fill(null),de=0,Q(e),j(e);const i=document.getElementById("wv-feedback");i&&(i.hidden=!0)}),setTimeout(()=>{var i;return(i=document.getElementById("wv-tb-got-it"))==null?void 0:i.focus()},100)}function nn(e,n){var c,u;if(!h)return;const t=e.clues[0],l=(t.acceptableSpans||[])[0]||"",o=R[t.blankIndex]||"weak",{cssClass:s}=Xe(o),i=document.getElementById("wv-explanation-overlay");i&&i.remove();const r=document.createElement("div");r.id="wv-explanation-overlay",r.className="clue-explanation-overlay",r.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Brilliant! All correct!</p>
      <div class="clue-explanation-body">
        <p class="clue-explanation-label">Context clue:</p>
        <span class="clue-result-badge ${s}">${m(l||"No clue selected")}</span>
        <p class="clue-explanation-text">${m(t.explanation)}</p>
      </div>
      <button class="btn btn--primary" id="wv-explanation-next">Continue →</button>
    </div>`,(c=h.querySelector(".wv-game"))==null||c.appendChild(r),P.playSfx("correct"),(u=document.getElementById("wv-explanation-next"))==null||u.addEventListener("click",()=>{r.remove(),n()}),setTimeout(()=>{document.getElementById("wv-explanation-overlay")&&(r.remove(),n())},4e3)}function ln(e,n){var l,o;const t=document.createElement("div");t.className="clue-explanation-overlay",t.innerHTML=`<div class="clue-explanation-card"><p class="clue-explanation-title">🧩 Word Parts Recap</p>
    <div class="clue-explanation-body">${I.map(s=>`<p><strong>${m(s.answer)}</strong> = ${s.type==="prefix"?`${s.affix}- + ${s.root}`:`${s.root} + -${s.affix}`} → ${m(s.definition)}</p>`).join("")}</div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`,(l=h.querySelector(".wv-game"))==null||l.appendChild(t),(o=document.getElementById("wv-review-next"))==null||o.addEventListener("click",()=>{t.remove(),n==null||n()})}function sn(e,n){var o,s;const t=e.definitions||{},l=document.createElement("div");l.className="clue-explanation-overlay",l.innerHTML=`<div class="clue-explanation-card"><p class="clue-explanation-title">📚 Synonym & Contrast Review</p>
    <div class="clue-explanation-body"><table class="wv-review-table"><thead><tr><th>Answer</th><th>Definition</th><th>Synonym</th><th>Antonym</th></tr></thead>
    <tbody>${e.answers.map(i=>{var u,a;const r=((u=(e.contrastPairs||[]).find(d=>d.word===i&&d.type==="synonym"))==null?void 0:u.pair)||"—",c=((a=(e.contrastPairs||[]).find(d=>d.word===i&&d.type==="antonym"))==null?void 0:a.pair)||"—";return`<tr><td>${i}</td><td>${m(t[i]||"—")}</td><td>${m(r)}</td><td>${m(c)}</td></tr>`}).join("")}</tbody></table></div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`,(o=h.querySelector(".wv-game"))==null||o.appendChild(l),(s=document.getElementById("wv-review-next"))==null||s.addEventListener("click",()=>{l.remove(),n==null||n()})}function on(e,n){var l,o;const t=document.createElement("div");t.className="clue-explanation-overlay",t.innerHTML=`<div class="clue-explanation-card"><p class="clue-explanation-title">🤝 Collocation Guide</p>
    <div class="clue-explanation-body">${e.answers.map(s=>`<p><strong>${m(s)}</strong>: ${m((e.collocationHintsByWord||{})[s]||e.collocationHint||"Word partner pattern")}</p>`).join("")}</div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`,(l=h.querySelector(".wv-game"))==null||l.appendChild(t),(o=document.getElementById("wv-review-next"))==null||o.addEventListener("click",()=>{t.remove(),n==null||n()})}function an(e){const n=e.definitions||{},t=e.answers||[];return t.find(o=>n[o])||t[0]||null}function cn(e,n){const l=(e.answers||[]).indexOf(n);if(l===-1)return`Use "${n}" in a complete sentence.`;const o=(e.text||"").split("___");if(l>=o.length-1)return`Use "${n}" in a complete sentence.`;const s=o[l],i=o[l+1],r=s.match(/(?:^|[.!?]\s+)([^.!?]*)$/s),c=r?r[1]:s.slice(-60),u=i.match(/^([^.!?]*[.!?])/s),a=u?u[1]:i.slice(0,60);return`${c.trimStart()}${n}${a}`.trim()||`Use "${n}" in a complete sentence.`}function rn(e,n){var d,p,f;if(!h){n();return}const t=an(e);if(!t){n();return}const o=(e.definitions||{})[t]||"Use the sentence context to understand this word.",s=cn(e,t),i=`${w}__${t}`.toLowerCase().replace(/\s+/g,"_"),r=document.getElementById("wv-sentence-step-overlay");r&&r.remove();const c=document.createElement("div");c.id="wv-sentence-step-overlay",c.className="clue-explanation-overlay",c.innerHTML=`
    <div class="clue-explanation-card wv-sentence-step">
      <p class="clue-explanation-title">📝 Use the word in a sentence!</p>
      <div class="clue-explanation-body">
        <p class="wv-sentence-step__word">Word: <strong>${m(t)}</strong></p>
        <p class="wv-sentence-step__meaning">Meaning: ${m(o)}</p>
        <label class="wv-sentence-step__label" for="wv-sentence-input">
          Write a sentence using "<strong>${m(t)}</strong>":
        </label>
        <input
          type="text"
          id="wv-sentence-input"
          class="sfq-input wv-sentence-step__input"
          placeholder="Type your sentence here…"
          autocomplete="off"
          aria-label="Write a sentence using the word ${m(t)}"
        />
        <div class="wv-sentence-step__model" id="wv-sentence-model" hidden>
          <p class="wv-sentence-step__model-label">Model sentence:</p>
          <p class="wv-sentence-step__model-text">${m(s)}</p>
        </div>
      </div>
      <div class="wv-sentence-step__actions">
        <button class="btn btn--primary" id="wv-sentence-similar">✓ My sentence is similar</button>
        <button class="btn btn--ghost btn--sm" id="wv-sentence-skip">↩ Skip</button>
      </div>
    </div>`,(d=h.querySelector(".wv-game"))==null||d.appendChild(c);const u=c.querySelector("#wv-sentence-input"),a=c.querySelector("#wv-sentence-model");u==null||u.addEventListener("input",()=>{u.value.length>=5&&a&&(a.hidden=!1)}),(p=c.querySelector("#wv-sentence-similar"))==null||p.addEventListener("click",()=>{We(i,!0),c.remove(),n()}),(f=c.querySelector("#wv-sentence-skip"))==null||f.addEventListener("click",()=>{We(i,!1),c.remove(),n()}),setTimeout(()=>u==null?void 0:u.focus(),100)}function T(e,n){const t=document.getElementById("wv-feedback");t&&(t.textContent=e,t.className=`wv-feedback wv-feedback--${n?"success":"error"}`,t.hidden=!1,n&&setTimeout(()=>{t.hidden=!0},1600))}function oe(e={}){var le,Le,Te,_e,Be,Ie,Ae;if(!h)return;const n=V[w],t=["p1","p2","p3","p4","p5","p6"],l=t[t.indexOf(C)+1]||null;Fe(),P.playSfx("levelUp"),fe.celebrate(!0);const o=e.blankTotal??be??((le=B==null?void 0:B.answers)==null?void 0:le.length)??0,s=e.blankCorrect??we??0,i=o>0?Math.round(s/o*100):0,r=nt({accuracy:i,hintsUsed:M}),c=D(S),u=Math.max(1,Math.round((Date.now()-(Ze||Date.now()))/1e3)),a=Tt({accuracy:i,skillLabel:n.label,hintsUsed:M}),d=Ve({level:String(C).toUpperCase(),weakSkillsMap:k.get("wvWeakSkills")||{}}),p=d.length?`<p class="wv-complete-score">Weak skills: ${d.map(x=>`${te(x.skill)} ${x.wrong}/${x.attempts}`).join(" · ")}</p>`:"",f=S==="exam"&&Z.length?_t(Z):Z.map(x=>`- ${x.passageTitle} ${x.blank}: ${x.studentAnswer||"(blank)"} → ${x.correctAnswer}`),v=Object.keys(R).length,b=v>0?Math.round(Ee/v*100):null,g=b!==null?`<p class="wv-complete-clue">🔍 Clue accuracy: ${b}%</p>`:"",y=ee>0?Math.round(ue/ee*100):null,E=y!==null?`<p class="wv-complete-clue">🔎 Scan accuracy: ${y}% (${ue}/${ee})</p>`:"";let O="";if(i<70&&w){const x=N[w]||N.default,W=V[w]||{icon:"📘",label:w};O=`
      <div class="mcq-focus-tip">
        <p class="mcq-focus-tip-heading">${x.icon||W.icon} Focus on: <strong>${m(W.label)}</strong></p>
        <p class="mcq-focus-tip-rule">${m(x.rule)}</p>
        <p class="mcq-focus-tip-eg"><em>${m(x.example)}</em></p>
        <p class="mcq-focus-tip-tip">${m(x.tip)}</p>
      </div>`}h.innerHTML=`
    <div class="wv-summary-overlay"><div class="wv-complete">
      <div class="wv-complete-icon">${n.icon}</div>
      <h3 class="wv-complete-title">Vault Opened! 🔑</h3>
      <p class="wv-complete-sub">${n.label} · ${F[C]}</p>
      <div class="wv-stars">${tt(r)}</div>
      <p class="wv-complete-score">Blanks: ${s} / ${o} correct · ${i}%</p>
      <p class="wv-complete-score">Mode: ${c.label} · Hints used: ${M} · Time: ${u}s</p>
      ${p}
      ${g}
      ${E}${O}
      <p class="wv-complete-score">Next Step: ${a}</p>
      <div class="wv-complete-actions">
        ${l?`<button class="btn btn--primary btn--lg" id="wv-next-level">${F[l]} →</button>`:""}
        <button class="btn btn--ghost btn--sm" id="wv-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="wv-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="wv-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-lvls">All Levels</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-cats2">Categories</button>
      </div>
    </div></div>`,(Le=document.getElementById("wv-next-level"))==null||Le.addEventListener("click",()=>{C=l,pe(w,C)}),(Te=document.getElementById("wv-replay"))==null||Te.addEventListener("click",()=>pe(w,C)),(_e=document.getElementById("wv-copy-summary"))==null||_e.addEventListener("click",async()=>{var W;const x=Bt({modeLabel:c.label,title:(B==null?void 0:B.title)||"Word Vault Passage",category:n.label,level:F[C],scoreLine:`${s}/${o}`,accuracy:i,timeTaken:`${u}s`,hintsUsed:M,clueScore:b??0,wrongLines:f,nextStep:a});try{await((W=navigator.clipboard)==null?void 0:W.writeText(x)),T("Summary copied!",!0)}catch{T("Unable to copy summary on this device.",!1)}}),(Be=document.getElementById("wv-copy-parent-report"))==null||Be.addEventListener("click",async()=>{var qe,Me;const{strongest:x,weakest:W}=It(X),at=At({questLabel:"Word Vault",modeLabel:c.label,scoreLine:`${s}/${o}`,accuracy:i,strongest:x,weakest:W,weakExamples:W?((qe=X[W.skill])==null?void 0:qe.lastWrongExamples)||[]:[],recommendation:a});try{await((Me=navigator.clipboard)==null?void 0:Me.writeText(at)),T("Parent report copied!",!0)}catch{T("Unable to copy parent report on this device.",!1)}}),(Ie=document.getElementById("wv-back-lvls"))==null||Ie.addEventListener("click",()=>ne(w)),(Ae=document.getElementById("wv-back-cats2"))==null||Ae.addEventListener("click",()=>Se()),q&&(document.removeEventListener("keydown",q),q=null),setTimeout(()=>{var x;return(x=document.getElementById("wv-next-level")||document.getElementById("wv-replay"))==null?void 0:x.focus()},200)}export{Ut as buildAffixParts,ke as cleanupWordVault,nt as getWordVaultStars,mn as initWordVault,tt as renderSummaryStars,fn as showVaultBrowser};
