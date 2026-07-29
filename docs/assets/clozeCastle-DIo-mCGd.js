import{p as q,C as D,a as be}from"./passages-CrCp32Wn.js";import{s as v,p as fe,q as ye,G as B,A as y,T as Ae,U as ke,O as Be,M as G,Q as ve,R as De,X as Ne,Y as Ge}from"./index-CkYopHYb.js";import{g as Ie,a as Ue,b as Me,c as X,s as Je,d as Qe,e as U,f as Ve,h as Xe,p as Ye,i as Ze,j as Ke,k as et,l as Te,r as tt,m as lt,n as nt,o as Re,q as Pe,t as at,u as st,v as ct,w as ot,x as rt,y as ie,z as it,A as We,B as dt,C as ut,D as ge,E as xe,F as mt,G as He,H as pt,I as bt,J as Fe,K as kt}from"./masteryMap-C1IYFcwV.js";import"./practiceExpansion-67d_LqFm.js";import"./gsap-C8pce-KX.js";let k=null,A=null,z="P1",p="",M=0,ne=[],L=[],_=[],ae=0,se=0,ze=0,I=null,E=-1,R={},Q=0,P=!1,de=0,he=0,$="practice",N=0,Ee=0,V=[],W=0,O=0,we=!1,ee=!1,ue=0,le=0,F={};function At(e,l){k=e,A=l}function Bt(){_e()}function Ce(){k&&(k.innerHTML=""),L=[],_=[],I&&(document.removeEventListener("keydown",I),I=null)}function _e(){if(!k)return;const e=v.get("ccqCompleted")||{},l=Object.keys(q);let t='<div class="cloze-browser">';t+='<h3 class="cloze-cat-title">🏰 Cloze Castle</h3>',t+='<p class="cloze-cat-subtitle">Each passage is a short story with missing words. Read it through first, then fill every blank. Pick your level to begin.</p>',t+='<div class="cloze-browser-grid">';for(const n of l){const a=Object.keys(q[n]),s=a.reduce((m,c)=>m+q[n][c].length,0),d=a.reduce((m,c)=>m+q[n][c].reduce((o,w)=>{var b;return o+(((b=w.answers)==null?void 0:b.length)||0)},0),0),h=Ie({level:n,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCompleted:e}),u=h>=s,i=be[n];t+=`
      <button class="cloze-level-btn ${u?"cloze-level-btn--done":""}"
              data-level="${n}" aria-label="${D[n]}">
        <span class="cloze-level-icon">${u?"⭐":i}</span>
        <span class="cloze-level-name">${D[n]}</span>
        <span class="cloze-level-count">${a.length} topics · ${d} questions · ${Math.min(h,s)} / ${s} passages done</span>
      </button>`}t+="</div></div>",k.innerHTML=t,k.querySelectorAll(".cloze-level-btn").forEach(n=>{n.addEventListener("click",()=>{z=n.dataset.level,me(z)})})}function me(e){var c,o,w,b,g;if(!k)return;const l=Object.keys(q[e]),t=v.get("ccqCatCompleted")||{},n=be[e];let a='<div class="cloze-browser">';a+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${n} ${D[e]}</h3>
  </div>`,a+='<p class="cloze-cat-subtitle">Choose one grammar topic to focus on — or Play All to mix them. Topics marked "Recommended" are the ones that need your attention most.</p>',a+='<div class="cloze-cat-grid">';const s=fe.getRecommendedGrammarCategory(e,l)||ye.getRecommendedSkill("clozeCastle",l);for(const r of l){const x=B[r]||{label:r,icon:"📝"},S=q[e][r].length,oe=q[e][r].reduce((T,J)=>{var K;return T+(((K=J.answers)==null?void 0:K.length)||0)},0),Z=Ie({level:e,category:r,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCatCompleted:t}),f=Z>=S,C=r===s;a+=`
      <button class="cloze-cat-btn ${f?"cloze-cat-btn--done":""} ${C?"cloze-cat-btn--recommended":""}"
              data-cat="${r}" aria-label="${x.label}${C?" (recommended)":""}">
        <span class="cloze-cat-icon">${f?"⭐":x.icon}</span>
        <span class="cloze-cat-label">${x.label}</span>
        <span class="cloze-cat-count">${oe} questions · ${Math.min(Z,S)} / ${S} passages${C?" · Recommended":""}</span>
      </button>`}a+="</div>";const d=U($);a+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${d.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${d.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${d.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${d.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${d.mode==="practice"?"Learn as you go: hints, a warm-up read, and feedback after every passage.":"Just like the real paper: no hints, timed, and all feedback saved for the end."}</span>
  </div>`;const h=l.reduce((r,x)=>r+q[e][x].length,0),u=Ue({mode:"clozeCastle",level:e,masteryMap:v.get("masteryMap")||{}}),i=u.length?u:Me({level:e,weakSkillsMap:v.get("ccqWeakSkills")||{}}).map(r=>({skill:r.skill,skillLabel:X(r.skill),attempts:r.attempts,wrong:r.wrong,accuracy:Math.round((r.attempts-r.wrong)/Math.max(1,r.attempts)*100),lastExample:null})),m=i.map(r=>{const x=r.accuracy!=null?Je(r):Qe({weakSkills:[r.skill],accuracy:r.accuracy,hintsUsed:0}),S=r.lastExample?` · Last slip: "${y(r.lastExample.chosen||"—")}" → "${y(r.lastExample.correct||"?")}"`:"";return`<li>${y(r.skillLabel||X(r.skill))}: ${r.wrong}/${r.attempts} · ${y(x)}${S}</li>`}).join("");a+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${h} passages)</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${i.length?`<ul class="cloze-mastery-list">${m}</ul>`:'<p class="cloze-cat-subtitle">Complete a few passages and the skills that need more practice will appear here.</p>'}
  </div>`,a+="</div>",k.innerHTML=a,(c=document.getElementById("cloze-back-levels"))==null||c.addEventListener("click",()=>_e()),(o=document.getElementById("cloze-mode-practice"))==null||o.addEventListener("click",()=>{$="practice",me(e)}),(w=document.getElementById("cloze-mode-exam"))==null||w.addEventListener("click",()=>{$="exam",me(e)}),k.querySelectorAll(".cloze-cat-btn").forEach(r=>{r.addEventListener("click",()=>{p=r.dataset.cat,$e(z,p)})}),(b=document.getElementById("cloze-play-all"))==null||b.addEventListener("click",()=>{p="__all__",Oe(z)}),(g=document.getElementById("cloze-mastery-review"))==null||g.addEventListener("click",()=>{p=fe.getRecommendedGrammarCategory(e,l)||l[0],$e(z,p)})}function $e(e,l){var n;ne=[...((n=q[e])==null?void 0:n[l])||[]].sort(()=>Math.random()-.5),M=0,ae=0,se=0,he=0,N=0,Ee=Date.now(),V=[],W=0,O=0,ue=0,le=0,F={},$!=="exam"?Ct(l,()=>j()):j()}function Oe(e){ne=[...Object.keys(q[e]||{}).flatMap(n=>q[e][n])].sort(()=>Math.random()-.5),M=0,ae=0,se=0,he=0,N=0,Ee=Date.now(),V=[],W=0,O=0,ue=0,le=0,F={},j()}function j(){if(M>=ne.length){Et();return}ht(ne[M])}function ht(e){const l=Ke(e);if(L=l.bankWords,_=l.blankFills,R={},Q=0,de=0,ze=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((n,a)=>n.blankIndex-a.blankIndex)[0];E=(t==null?void 0:t.blankIndex)??-1,P=!0}else E=-1,P=!1;we=!1,ee=!1,gt(e)}function te(e){var i,m,c,o,w;if(!k)return;const l=be[z],t=`${M+1} / ${ne.length}`,n=p!=="__all__"&&B[p]?`${B[p].icon} ${B[p].label}`:"All Topics",a=e.clues&&e.clues.length>0,s=a&&P,d=U($),h=a?s?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",u=a?s?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Read the whole passage first, then tap a word from the bank to fill each blank.";k.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${D[z]}</span>
        <span class="cloze-badge cloze-badge--cat">${n}</span>
        <span class="cloze-badge">${d.label}</span>
        ${h}
        <span class="cloze-progress">${t}</span>
        <span class="cloze-xp-badge">+${e.xp} XP</span>
      </div>

      <h3 class="cloze-title">${e.title}</h3>

      ${s?yt(e):""}

      <p class="cloze-instruction" id="cloze-instruction">
        ${u}
      </p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank-wrapper ${s?"cloze-bank-wrapper--locked":""}" id="cloze-bank-wrapper">
        ${s?'<div class="cloze-bank-lock-msg">🔒 Find the clue first!</div>':""}
        <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>
      </div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="cloze-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${$!=="exam"?'<button class="btn btn--ghost btn--sm" id="cloze-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>':""}
        <button class="btn btn--primary" id="cloze-check" ${s?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="cloze-rule-hint-panel" hidden></div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,ce(e),Y(e),s&&vt(e),(i=document.getElementById("cloze-clear"))==null||i.addEventListener("click",()=>{Re(L,_),ce(e),Y(e)}),(m=document.getElementById("cloze-listen"))==null||m.addEventListener("click",()=>{let b=e.text;for(const g of e.answers)b=b.replace("___",g);G.speakWord(b)}),(c=document.getElementById("cloze-check"))==null||c.addEventListener("click",()=>wt(e)),(o=document.getElementById("cloze-rule-hint"))==null||o.addEventListener("click",()=>{const b=document.getElementById("cloze-rule-hint"),g=document.getElementById("cloze-rule-hint-panel");if(!b||!g)return;const r=g.hidden;if(g.hidden=!r,b.setAttribute("aria-expanded",String(r)),b.textContent=r?"💡 Hide the rule":"💡 Stuck? Show the rule",r){const x=p!=="__all__"?p:null,S=x?ke(x):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};g.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${y(S.rule)}</p>
        <p class="mcq-hint-eg"><em>${y(S.example)}</em></p>
        <p class="mcq-hint-tip">${y(S.tip)}</p>`}}),(w=document.getElementById("cloze-quit"))==null||w.addEventListener("click",()=>{Ce(),A==null||A()}),I&&document.removeEventListener("keydown",I),I=b=>{var g;b.key==="Enter"&&!P&&(b.preventDefault(),(g=document.getElementById("cloze-check"))==null||g.click()),b.key==="Escape"&&(Ce(),A==null||A())},document.addEventListener("keydown",I)}function gt(e){if(k){if(we){qe(e);return}tt({host:k,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{we=!0,qe(e)},onQuit:()=>{Ce(),A==null||A()}})}}function qe(e){if(!k)return;if(ee||$==="exam"){te(e);return}const l=lt(e);if(!l){ee=!0,te(e);return}k.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${y(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");nt({host:t,attention:l,onContinue:()=>{ee=!0,te(e)},onSkip:()=>{ee=!0,te(e)}})}function ft(){const e=Object.values(R||{}).map(xe);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((n,a)=>n+a,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function yt(e){const l=Se(e);if(!l)return"";const t=U($);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${E+1} · Clue Score ${ft()}</span>
      </div>
      <p class="clue-hunt-prompt">${y(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function vt(e){var t,n;U($).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const a=Se(e);if(!a)return;Q=Math.min(Q+1,4),N=ct(N);const{message:s}=ot(Q,a),d=document.getElementById("clue-hint-msg");d&&(d.textContent=s,d.className="clue-hint-msg clue-hint-msg--visible"),Q>=4&&(R[E]="weak",pe(e,"weak"))}),(n=document.getElementById("clue-skip-btn"))==null||n.addEventListener("click",()=>{E<0||(R[E]="weak",pe(e,"weak"))}))}function je(e,l){var u;const t=Se(l);if(!t)return;const n=mt(e,t),a=Fe(n),s=ie(((u=l.blankSkills)==null?void 0:u[E])||(p!=="__all__"?p:"sentenceLogic")),d=document.getElementById("clue-hunt-feedback");if(d){const i=He(t.clueType),m=X(s),c=t.explanation||"Use the clue to choose the best-fitting word.";d.textContent=`${i} · ${m}. ${a.message} ${c}`,d.className=`clue-hunt-feedback ${a.cssClass}`}const h=document.getElementById("cloze-passage");h&&Pe({container:h,text:l.text,activeBlankIndex:E,selectedWord:e,selectedResult:n,filledAnswers:_.map((i,m)=>{var c;return i!==null&&((c=L.find(o=>o.id===i))==null?void 0:c.word)||""}),onTapWord:i=>je(i,l)}),v.recordClueAttempt({quest:"clozeCastle",result:n,clueType:t.clueType}),n==="strong"||n==="partial"?(R[E]=n,G.playSfx(n==="strong"?"correct":"pop"),setTimeout(()=>pe(l,n),800)):(de++,G.playSfx("wrong"),de>=2&&(R[E]="weak",setTimeout(()=>pe(l,"weak"),1e3)))}function pe(e,l){if(!P)return;P=!1,E=-1,he+=xe(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Clue found! Now tap the word from the bank that fits the blank.");const n=document.getElementById("cloze-bank-wrapper");n&&(n.className="cloze-bank-wrapper");const a=document.getElementById("cloze-check");a&&(a.disabled=!1),Y(e)}function ce(e){const l=document.getElementById("cloze-passage");if(l)if(P){const t=_.map(n=>{var a;return n!==null&&((a=L.find(s=>s.id===n))==null?void 0:a.word)||""});Pe({container:l,text:e.text,activeBlankIndex:E,filledAnswers:t,onTapWord:n=>je(n,e)})}else at({container:l,text:e.text,blankFills:_,bankWords:L,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{ce(e),Y(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function Y(e){const l=document.getElementById("cloze-bank");if(l){if(P){l.innerHTML=L.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${Ae(t.word)}">${y(t.word)}</button>
    `).join("");return}st({container:l,bankWords:L,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!kt(L,_,t))return;G.playSfx("pop");const n=(e.clues||[]).slice().sort((a,s)=>a.blankIndex-s.blankIndex).find(a=>_[a.blankIndex]===null&&!Object.hasOwn(R,a.blankIndex));n?(E=n.blankIndex,P=!0,Q=0,de=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:E,passageId:e.id}),te(e)):(ce(e),Y(e))}})}}function Se(e){return e.clues&&e.clues.find(l=>l.blankIndex===E)||null}function zt(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function re(e,l){const t=p!=="__all__"?ie(p):"sentenceLogic";return e.answers.map((n,a)=>{var c,o;const s=zt(e,a),d=l[a]||"",h=We(e,a),u=ie(h.primarySkill||t),i=d!==n,m=i?pt({meta:h,chosen:d,correct:n}):null;return{blank:`#${a+1}`,passageTitle:e.title,studentAnswer:d,correctAnswer:n,status:i?"Try again":"Correct",skillLabel:X(u),clueTypeLabel:He(h.clueType||(s==null?void 0:s.clueType)),clue:((c=s==null?void 0:s.acceptableSpans)==null?void 0:c[0])||"—",explanation:((o=e.grammarNotes)==null?void 0:o[a])||h.correctReason||(s==null?void 0:s.explanation)||"Read the words before and after the blank.",nextStepPrompt:bt(u),whyWrong:m==null?void 0:m.whyWrong,whyRight:m==null?void 0:m.whyRight,missedClue:m==null?void 0:m.missedClue,examTip:h.examTip||(m?m.examTip:"")}})}function wt(e){if(_.some(c=>c===null)){H("Fill in all the blanks first! 🏰",!1);return}const l=rt(_,L);[...l];const t=l.every((c,o)=>c===e.answers[o]),n=l.filter((c,o)=>c===e.answers[o]).length,a=U($),s=p==="__all__"?"mixed":p,d=e.answers.map((c,o)=>{var w;return ie(((w=e.blankSkills)==null?void 0:w[o])||(p!=="__all__"?p:"sentenceLogic"))}),h=new Set(d.filter((c,o)=>l[o]!==e.answers[o]));ye.recordAttempt({quest:"clozeCastle",skill:s,correct:t,responseMs:2e3,level:z}),ye.updateSkill("clozeCastle",s,t),fe.recordGrammarCategoryAttempt(z,s,t),se++,W+=e.answers.length,O+=n;const u=it({storageKey:"ccqWeakSkills",level:z,skills:d,wrongSkillSet:h,current:v.get("ccqWeakSkills")||{}});v.set("ccqWeakSkills",u);let i=v.get("masteryMap")||{};const m=re(e,l);if(m.forEach((c,o)=>{const w=We(e,o),b=c.status!=="Correct",g=w.primarySkill;F[g]||(F[g]={correct:0,total:0,label:c.skillLabel||X(g),lastWrongExamples:[]});const r=F[g];r.total+=1,b?c.correctAnswer&&r.lastWrongExamples.length<3&&r.lastWrongExamples.push(c.correctAnswer):r.correct+=1,i=dt({mode:"clozeCastle",level:z,category:s,skill:g,clueType:w.clueType,wasWrong:b,example:b?{passageId:e.id,blankIndex:o,chosen:c.studentAnswer,correct:c.correctAnswer,clueType:w.clueType}:null,current:i})}),v.set("masteryMap",i),a.showFinalReviewOnly){V.push(...m.filter(o=>o.status!=="Correct").map(o=>({passageTitle:o.passageTitle,blank:o.blank,studentAnswer:o.studentAnswer,correctAnswer:o.correctAnswer,explanation:o.explanation,skillLabel:o.skillLabel})));const c=v.get("ccqExamAttempts")||[];c.push({level:z,category:s,passageId:e.id,blankCorrect:n,blankTotal:e.answers.length,submittedAt:Date.now()}),v.set("ccqExamAttempts",c.slice(-150)),M++,j();return}if(t){ae++,De.recordCorrect(2e3,!1),U($).confettiPerPassage&&Be(),G.playSfx("correct"),ve.celebrate(!1);const c=Math.round(n/Math.max(1,e.answers.length)*100);if(p!=="__all__"&&e.id){const o=ut({level:z,category:p,passageId:e.id,accuracy:c,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCompleted:v.get("ccqCompleted")||{},ccqCatCompleted:v.get("ccqCatCompleted")||{}});v.set("ccqCompletedByPassage",o.nextByPassage),v.set("ccqCompleted",o.nextCompleted),v.set("ccqCatCompleted",o.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(o=>o.classList.add("cloze-blank--correct")),ge({host:k.querySelector(".cloze-game"),title:"Answer Review",rows:re(e,l),onContinue:()=>{e.clues&&e.clues.length>0?xt(e,()=>setTimeout(()=>{M++,j()},600)):(H("✅ Excellent! All correct!",!0),setTimeout(()=>{M++,j()},1200))}})}else{if(G.playSfx("wrong"),ze++,document.querySelectorAll(".cloze-blank--filled").forEach((c,o)=>{var b;const w=((b=L.find(g=>g.id===_[o]))==null?void 0:b.word)||"";c.classList.toggle("cloze-blank--wrong",w!==e.answers[o])}),ve.encourage(),$==="exam"){ge({host:k.querySelector(".cloze-game"),title:"Exam Submission Review",rows:re(e,l),onContinue:()=>{M++,j()}});return}ze>=2?(H("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(o=>o.classList.remove("cloze-blank--wrong"));const c=document.getElementById("cloze-feedback");c&&(c.hidden=!0),ge({host:k.querySelector(".cloze-game"),title:"Review Mistakes",rows:re(e,l),onContinue:()=>$t(e,l)})},800)):(H("❌ Not quite — the red blanks need another look. Reread those sentences before you try again.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(o=>o.classList.remove("cloze-blank--wrong"));const c=document.getElementById("cloze-feedback");c&&(c.hidden=!0)},1800))}}function Ct(e,l){var s,d;if(!k)return;const t={...v.get("lessonsSeen")||{}};t[`cloze:${e}`]||(t[`cloze:${e}`]=new Date().toISOString(),v.set("lessonsSeen",t));const n=ke(e),a=B[e]||{icon:"🏰",label:e};k.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule: ${Ae(a.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${a.icon}</div>
      <h2 class="mcq-rule-title">${y(a.label)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you start — read it once, then use it in the passages.</p>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${y(n.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${y(n.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${y(n.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="cloze-rule-start">Got it — start passages →</button>
        <button class="btn btn--ghost" id="cloze-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`,(s=k.querySelector("#cloze-rule-start"))==null||s.addEventListener("click",l),(d=k.querySelector("#cloze-rule-skip"))==null||d.addEventListener("click",l)}function $t(e,l=[]){var h;if(!k)return;const t=document.getElementById("cloze-teachback-overlay");t&&t.remove();const n=p==="__all__"?null:p,a=n?ke(n):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},s=document.createElement("div");s.id="cloze-teachback-overlay",s.className="cloze-teachback-overlay",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-label","Grammar tip"),s.innerHTML=`
    <div class="ctb-panel">
      <div class="ctb-header">
        <span class="ctb-icon" aria-hidden="true">💡</span>
        <h3 class="ctb-title">Here's a tip!</h3>
      </div>
      <div class="ctb-rule">
        <p class="ctb-rule-text">${y(a.rule)}</p>
      </div>
      <div class="ctb-example">
        <span class="ctb-example-label">Example:</span>
        <p class="ctb-example-text">${y(a.example)}</p>
      </div>
      ${a.tip?`<p class="ctb-memory-tip">💡 ${y(a.tip)}</p>`:""}
      <p class="cloze-restart-note">Your blanks will be cleared so you can try the whole passage again with this rule in mind.</p>
      <button class="btn btn--primary ctb-btn" id="ctb-try-again">
        Got it — try again!
      </button>
    </div>`,k.appendChild(s);const d=e.answers.map((u,i)=>({n:i+1,correctAnswer:u,studentAnswer:l[i]||"(left blank)"})).filter(u=>u.studentAnswer!==u.correctAnswer);d.length>0&&Ne(s.querySelector(".ctb-panel"),()=>{var u;return Ge({skillLabel:n?((u=B[n])==null?void 0:u.label)||n:"grammar cloze",exercise:`Fill in the blanks: "${e.text}"`,studentAnswer:d.map(i=>`blank ${i.n}: ${i.studentAnswer}`).join(", "),correctAnswer:d.map(i=>`blank ${i.n}: ${i.correctAnswer}`).join(", "),level:z})}),(h=s.querySelector("#ctb-try-again"))==null||h.addEventListener("click",()=>{s.remove(),Re(L,_),_=_.map(()=>null),Y(e),ce(e)}),setTimeout(()=>{var u;return(u=s.querySelector("#ctb-try-again"))==null?void 0:u.focus()},100)}function xt(e,l){var s,d;if(!k)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const n=e.answers.map((h,u)=>{var g,r;const i=(e.clues||[]).find(x=>x.blankIndex===u),m=R[u]||"weak",c=Fe(m),o=xe(m),w=((g=i==null?void 0:i.acceptableSpans)==null?void 0:g[0])||"Skipped / no clue",b=((r=e.grammarNotes)==null?void 0:r[u])||(i==null?void 0:i.explanation)||`"${h}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${u+1}:</strong> ${y(h)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${c.cssClass}">${y(w)}</span> · Score ${Math.round(o*100)}%</p>
        <p class="clue-explanation-text">${y(b)}</p>
      </div>`}).join(""),a=document.createElement("div");a.id="cloze-explanation-overlay",a.className="clue-explanation-overlay",a.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${n}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(s=k.querySelector(".cloze-game"))==null||s.appendChild(a),(d=document.getElementById("clue-explanation-next"))==null||d.addEventListener("click",()=>{a.remove(),l()})}function H(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function Et(){var r,x,S,oe,Z;if(!k)return;const e=be[z];Be(),G.playSfx("levelUp"),ve.celebrate(!0);const l=p!=="__all__"&&B[p]?`${B[p].icon} ${B[p].label}`:"All Topics",t=W>0?Math.round(O/W*100):100,n=t>=90?3:t>=70?2:1,a=U($),s=Math.max(1,Math.round((Date.now()-(Ee||Date.now()))/1e3)),d=et({accuracy:t,skillLabel:l,hintsUsed:N}),h=Me({level:z,weakSkillsMap:v.get("ccqWeakSkills")||{}}),u=h.length?`<p class="cloze-complete-score">Mastery focus: ${h.map(f=>`${X(f.skill)} (${f.wrong}/${f.attempts})`).join(" · ")}</p>`:"",i=$==="exam"&&V.length?Ve(V):V.map(f=>`- ${f.passageTitle} ${f.blank}: ${f.studentAnswer||"(blank)"} → ${f.correctAnswer}`),m=Object.keys(R).length,c=m>0?Math.round(he/m*100):null,o=c!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${c}%</p>`:"",w=le>0?Math.round(ue/le*100):null,b=w!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${w}% (${ue}/${le})</p>`:"";let g="";if(t<70){let f=p!=="__all__"?p:null;if(!f){const C=Object.entries(F).filter(([,T])=>T.total>0);C.length>0&&(f=C.sort(([,T],[,J])=>T.correct/T.total-J.correct/J.total)[0][0])}if(f){const C=ke(f),T=B[f]||{icon:"🏰",label:f};g=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${T.icon} Focus on: <strong>${y(T.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${y(C.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${y(C.example)}</em></p>
          <p class="mcq-focus-tip-tip">${y(C.tip)}</p>
        </div>`}}k.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${D[z]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(n)}${"☆".repeat(3-n)}</div>
      <p class="cloze-complete-score">Blanks: ${O} / ${W} correct · ${t}%</p>
      <p class="cloze-complete-score">Mode: ${a.label} · Hints used: ${N} · Time: ${s}s</p>
      ${u}
      ${o}
      ${b}
      ${g}
      <p class="cloze-complete-score">Next step: ${d}</p>
      <div class="cloze-complete-actions">
        <button class="btn btn--primary btn--lg" id="cloze-back-cat">Choose Another Topic</button>
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back-levels">All Levels</button>
      </div>
    </div>`,(r=document.getElementById("cloze-back-cat"))==null||r.addEventListener("click",()=>me(z)),(x=document.getElementById("cloze-replay"))==null||x.addEventListener("click",()=>{p==="__all__"?Oe(z):$e(z,p)}),(S=document.getElementById("cloze-copy-summary"))==null||S.addEventListener("click",async()=>{var C;const f=Xe({modeLabel:a.label,title:`${D[z]} · ${l}`,category:l,level:D[z],scoreLine:Te({mode:$,blankCorrect:O,blankTotal:W,passageCorrect:ae,passageTotal:se}),accuracy:t,timeTaken:`${s}s`,hintsUsed:N,clueScore:c??0,wrongLines:i,nextStep:d});try{await((C=navigator.clipboard)==null?void 0:C.writeText(f)),H("Summary copied!",!0)}catch{H("Unable to copy summary on this device.",!1)}}),(oe=document.getElementById("cloze-copy-parent-report"))==null||oe.addEventListener("click",async()=>{var K,Le;const{strongest:f,weakest:C}=Ye(F),T=Te({mode:$,blankCorrect:O,blankTotal:W,passageCorrect:ae,passageTotal:se}),J=Ze({questLabel:"Cloze Castle",modeLabel:a.label,scoreLine:T,accuracy:t,strongest:f,weakest:C,weakExamples:C?((K=F[C.skill])==null?void 0:K.lastWrongExamples)||[]:[],recommendation:d});try{await((Le=navigator.clipboard)==null?void 0:Le.writeText(J)),H("Parent report copied!",!0)}catch{H("Unable to copy parent report on this device.",!1)}}),(Z=document.getElementById("cloze-back-levels"))==null||Z.addEventListener("click",()=>_e()),I&&(document.removeEventListener("keydown",I),I=null),setTimeout(()=>{var f;return(f=document.getElementById("cloze-back-cat"))==null?void 0:f.focus()},200)}export{Ce as cleanupClozeCastle,At as initClozeCastle,Bt as showClozeBrowser};
