import{p as T,C as G,a as ke}from"./passages-Du4BUcGK.js";import{s as z,p as ve,z as ye,G as A,M as y,$ as Ae,a9 as he,a4 as Ie,a0 as Q,a5 as ze,aa as Qe,a6 as Ve,ab as Ze,ac as Je,ad as Xe}from"./index-BMk_8UTo.js";import{g as Ye,a as Y,s as Ke,b as et,c as V,d as tt,e as lt,p as nt,f as st,h as at,i as ct,j as qe,r as ot,k as rt,l as it,m as Me,n as Re,o as dt,q as ut,t as mt,u as pt,v as bt,w as de,x as Pe,y as kt,z as ge,A as xe,B as ht,C as We,D as ft,E as gt,F as He,G as vt}from"./masteryMap-BvKrmeSe.js";import{s as re,g as Fe,a as Oe,b as je,p as De,r as yt,c as zt}from"./clozeCompletionTracker-CWPOmOJP.js";import"./practiceExpansion-D0CCBel5.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";let b=null,B=null,w="P1",p="",R=0,ne=[],q=[],S=[],se=0,ae=0,ie=0,I=null,_=-1,P={},J=0,W=!1,ue=0,fe=0,E="practice",U=0,Ee=0,X=[],F=0,D=0,we=!1,ee=!1,me=0,le=0,j={};function Ft(e,l){b=e,B=l}function Ot(){_e()}function Ce(){b&&(b.innerHTML=""),q=[],S=[],I&&(document.removeEventListener("keydown",I),I=null)}function _e(){if(!b)return;const e=z.get("ccqCompleted")||{},l=Object.keys(T);let t='<div class="cloze-browser">';t+='<h3 class="cloze-cat-title">🏰 Cloze Castle</h3>',t+='<p class="cloze-cat-subtitle">Each passage is a short story with missing words. Read it through first, then fill every blank. Pick your level to begin.</p>',t+='<div class="cloze-browser-grid">';for(const n of l){const s=Object.keys(T[n]),a=s.map(c=>re(T[n][c])),r=a.reduce((c,f)=>c+f.seeds,0),h=a.reduce((c,f)=>c+f.seedQuestions,0),m=a.reduce((c,f)=>c+f.variants,0),d=Fe({level:n,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:e,seedIndex:Oe(s.flatMap(c=>T[n][c]))}),u=d>=r,o=ke[n];t+=`
      <button class="cloze-level-btn ${u?"cloze-level-btn--done":""}"
              data-level="${n}" aria-label="${G[n]}">
        <span class="cloze-level-icon">${u?"⭐":o}</span>
        <span class="cloze-level-name">${G[n]}</span>
        <span class="cloze-level-count">${s.length} topics · ${h} questions · ${Math.min(d,r)} / ${r} passages done</span>
        ${m?`<span class="cloze-level-revision">+ ${m} revision rounds of the same passages</span>`:""}
      </button>`}t+="</div></div>",b.innerHTML=t,b.querySelectorAll(".cloze-level-btn").forEach(n=>{n.addEventListener("click",()=>{w=n.dataset.level,pe(w)})})}function pe(e){var c,f,g,k,C;if(!b)return;const l=Object.keys(T[e]),t=z.get("ccqCatCompleted")||{},n=ke[e];let s='<div class="cloze-browser">';s+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${n} ${G[e]}</h3>
  </div>`,s+='<p class="cloze-cat-subtitle">Choose one grammar topic to focus on — or Play All to mix them. Topics marked "Recommended" are the ones that need your attention most.</p>',s+='<div class="cloze-cat-grid">';const a=ve.getRecommendedGrammarCategory(e,l)||ye.getRecommendedSkill("clozeCastle",l);for(const i of l){const $=A[i]||{label:i,icon:"📝"},M=re(T[e][i]),Z=M.seeds,v=M.seedQuestions,x=Fe({level:e,category:i,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCatCompleted:t,seedIndex:Oe(T[e][i])}),L=x>=Z,H=i===a;s+=`
      <button class="cloze-cat-btn ${L?"cloze-cat-btn--done":""} ${H?"cloze-cat-btn--recommended":""}"
              data-cat="${i}" aria-label="${$.label}${H?" (recommended)":""}">
        <span class="cloze-cat-icon">${L?"⭐":$.icon}</span>
        <span class="cloze-cat-label">${$.label}</span>
        <span class="cloze-cat-count">${v} questions · ${Math.min(x,Z)} / ${Z} passages${M.variants?` · +${M.variants} revision rounds`:""}${H?" · Recommended":""}</span>
      </button>`}s+="</div>";const r=V(E);s+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${r.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${r.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${r.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${r.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${r.mode==="practice"?"Learn as you go: hints, a warm-up read, and feedback after every passage.":"Just like the real paper: no hints, timed, and all feedback saved for the end."}</span>
  </div>`;const h=l.reduce((i,$)=>i+re(T[e][$]).seeds,0),m=l.reduce((i,$)=>i+re(T[e][$]).variants,0),d=Ye({mode:"clozeCastle",level:e,masteryMap:z.get("masteryMap")||{}}),u=d.length?d:je({level:e,weakSkillsMap:z.get("ccqWeakSkills")||{}}).map(i=>({skill:i.skill,skillLabel:Y(i.skill),attempts:i.attempts,wrong:i.wrong,accuracy:Math.round((i.attempts-i.wrong)/Math.max(1,i.attempts)*100),lastExample:null})),o=u.map(i=>{const $=i.accuracy!=null?Ke(i):et({weakSkills:[i.skill],accuracy:i.accuracy,hintsUsed:0}),M=i.lastExample?` · Last slip: "${y(i.lastExample.chosen||"—")}" → "${y(i.lastExample.correct||"?")}"`:"";return`<li>${y(i.skillLabel||Y(i.skill))}: ${i.wrong}/${i.attempts} · ${y($)}${M}</li>`}).join("");s+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${h} passages${m?" + revision":""})</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${u.length?`<ul class="cloze-mastery-list">${o}</ul>`:'<p class="cloze-cat-subtitle">Complete a few passages and the skills that need more practice will appear here.</p>'}
  </div>`,s+="</div>",b.innerHTML=s,(c=document.getElementById("cloze-back-levels"))==null||c.addEventListener("click",()=>_e()),(f=document.getElementById("cloze-mode-practice"))==null||f.addEventListener("click",()=>{E="practice",pe(e)}),(g=document.getElementById("cloze-mode-exam"))==null||g.addEventListener("click",()=>{E="exam",pe(e)}),b.querySelectorAll(".cloze-cat-btn").forEach(i=>{i.addEventListener("click",()=>{p=i.dataset.cat,$e(w,p)})}),(k=document.getElementById("cloze-play-all"))==null||k.addEventListener("click",()=>{p="__all__",Ge(w)}),(C=document.getElementById("cloze-mastery-review"))==null||C.addEventListener("click",()=>{p=ve.getRecommendedGrammarCategory(e,l)||l[0],$e(w,p)})}function Ne(e){const l=[...e].sort(()=>Math.random()-.5),t=new Set,n=[],s=[];for(const a of l){const r=De(a);t.has(r)?s.push(a):(t.add(r),n.push(a))}return[...n,...s]}function $e(e,l){var n;const t=((n=T[e])==null?void 0:n[l])||[];ne=Ne(t),R=0,se=0,ae=0,fe=0,U=0,Ee=Date.now(),X=[],F=0,D=0,me=0,le=0,j={},E!=="exam"?Lt(l,()=>N()):N()}function Ge(e){const t=Object.keys(T[e]||{}).flatMap(n=>T[e][n]);ne=Ne(t),R=0,se=0,ae=0,fe=0,U=0,Ee=Date.now(),X=[],F=0,D=0,me=0,le=0,j={},N()}function N(){if(R>=ne.length){Bt();return}wt(ne[R])}function wt(e){const l=at(e);if(q=l.bankWords,S=l.blankFills,P={},J=0,ue=0,ie=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((n,s)=>n.blankIndex-s.blankIndex)[0];_=(t==null?void 0:t.blankIndex)??-1,W=!0}else _=-1,W=!1;we=!1,ee=!1,Ct(e)}function te(e){var d,u,o,c,f;if(!b)return;const l=ke[w],t=`${R+1} / ${ne.length}`,n=p!=="__all__"&&A[p]?`${A[p].icon} ${A[p].label}`:"All Topics",s=e.clues&&e.clues.length>0,a=s&&W,r=V(E),h=s?a?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",m=s?a?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Read the whole passage first, then tap a word from the bank to fill each blank.";b.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${G[w]}</span>
        <span class="cloze-badge cloze-badge--cat">${n}</span>
        <span class="cloze-badge">${r.label}</span>
        ${h}
        <span class="cloze-progress">${t}</span>
        <span class="cloze-xp-badge">+${e.xp} XP</span>
      </div>

      <h3 class="cloze-title">${e.title}</h3>

      ${a?xt(e):""}

      <p class="cloze-instruction" id="cloze-instruction">
        ${m}
      </p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank-wrapper ${a?"cloze-bank-wrapper--locked":""}" id="cloze-bank-wrapper">
        ${a?'<div class="cloze-bank-lock-msg">🔒 Find the clue first!</div>':""}
        <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>
      </div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="cloze-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${E!=="exam"?'<button class="btn btn--ghost btn--sm" id="cloze-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>':""}
        <button class="btn btn--primary" id="cloze-check" ${a?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="cloze-rule-hint-panel" hidden></div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,ce(e),K(e),a&&Et(e),(d=document.getElementById("cloze-clear"))==null||d.addEventListener("click",()=>{Me(q,S),ce(e),K(e)}),(u=document.getElementById("cloze-listen"))==null||u.addEventListener("click",()=>{let g=e.text;for(const k of e.answers)g=g.replace("___",k);Q.speakWord(g)}),(o=document.getElementById("cloze-check"))==null||o.addEventListener("click",()=>St(e)),(c=document.getElementById("cloze-rule-hint"))==null||c.addEventListener("click",()=>{const g=document.getElementById("cloze-rule-hint"),k=document.getElementById("cloze-rule-hint-panel");if(!g||!k)return;const C=k.hidden;if(k.hidden=!C,g.setAttribute("aria-expanded",String(C)),g.textContent=C?"💡 Hide the rule":"💡 Stuck? Show the rule",C){const i=p!=="__all__"?p:null,$=i?he(i):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};k.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${y($.rule)}</p>
        <p class="mcq-hint-eg"><em>${y($.example)}</em></p>
        <p class="mcq-hint-tip">${y($.tip)}</p>`}}),(f=document.getElementById("cloze-quit"))==null||f.addEventListener("click",()=>{Ce(),B==null||B()}),I&&document.removeEventListener("keydown",I),I=g=>{var k;g.key==="Enter"&&!W&&(g.preventDefault(),(k=document.getElementById("cloze-check"))==null||k.click()),g.key==="Escape"&&(Ce(),B==null||B())},document.addEventListener("keydown",I)}function Ct(e){if(b){if(we){Be(e);return}ot({host:b,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{we=!0,Be(e)},onQuit:()=>{Ce(),B==null||B()}})}}function Be(e){if(!b)return;if(ee||E==="exam"){te(e);return}const l=rt(e);if(!l){ee=!0,te(e);return}b.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${y(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");it({host:t,attention:l,onContinue:()=>{ee=!0,te(e)},onSkip:()=>{ee=!0,te(e)}})}function $t(){const e=Object.values(P||{}).map(xe);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((n,s)=>n+s,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function xt(e){const l=Se(e);if(!l)return"";const t=V(E);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${_+1} · Clue Score ${$t()}</span>
      </div>
      <p class="clue-hunt-prompt">${y(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function Et(e){var t,n;V(E).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const s=Se(e);if(!s)return;J=Math.min(J+1,4),U=mt(U);const{message:a}=pt(J,s),r=document.getElementById("clue-hint-msg");r&&(r.textContent=a,r.className="clue-hint-msg clue-hint-msg--visible"),J>=4&&(P[_]="weak",be(e,"weak"))}),(n=document.getElementById("clue-skip-btn"))==null||n.addEventListener("click",()=>{_<0||(P[_]="weak",be(e,"weak"))}))}function Ue(e,l){var m;const t=Se(l);if(!t)return;const n=ht(e,t),s=He(n),a=de(((m=l.blankSkills)==null?void 0:m[_])||(p!=="__all__"?p:"sentenceLogic")),r=document.getElementById("clue-hunt-feedback");if(r){const d=We(t.clueType),u=Y(a),o=t.explanation||"Use the clue to choose the best-fitting word.";r.textContent=`${d} · ${u}. ${s.message} ${o}`,r.className=`clue-hunt-feedback ${s.cssClass}`}const h=document.getElementById("cloze-passage");h&&Re({container:h,text:l.text,activeBlankIndex:_,selectedWord:e,selectedResult:n,filledAnswers:S.map((d,u)=>{var o;return d!==null&&((o=q.find(c=>c.id===d))==null?void 0:o.word)||""}),onTapWord:d=>Ue(d,l)}),z.recordClueAttempt({quest:"clozeCastle",result:n,clueType:t.clueType}),n==="strong"||n==="partial"?(P[_]=n,Q.playSfx(n==="strong"?"correct":"pop"),setTimeout(()=>be(l,n),800)):(ue++,Q.playSfx("wrong"),ue>=2&&(P[_]="weak",setTimeout(()=>be(l,"weak"),1e3)))}function be(e,l){if(!W)return;W=!1,_=-1,fe+=xe(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Clue found! Now tap the word from the bank that fits the blank.");const n=document.getElementById("cloze-bank-wrapper");n&&(n.className="cloze-bank-wrapper");const s=document.getElementById("cloze-check");s&&(s.disabled=!1),K(e)}function ce(e){const l=document.getElementById("cloze-passage");if(l)if(W){const t=S.map(n=>{var s;return n!==null&&((s=q.find(a=>a.id===n))==null?void 0:s.word)||""});Re({container:l,text:e.text,activeBlankIndex:_,filledAnswers:t,onTapWord:n=>Ue(n,e)})}else dt({container:l,text:e.text,blankFills:S,bankWords:q,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{ce(e),K(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function K(e){const l=document.getElementById("cloze-bank");if(l){if(W){l.innerHTML=q.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${Ae(t.word)}">${y(t.word)}</button>
    `).join("");return}ut({container:l,bankWords:q,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!vt(q,S,t))return;Q.playSfx("pop");const n=(e.clues||[]).slice().sort((s,a)=>s.blankIndex-a.blankIndex).find(s=>S[s.blankIndex]===null&&!Object.hasOwn(P,s.blankIndex));n?(_=n.blankIndex,W=!0,J=0,ue=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:_,passageId:e.id}),te(e)):(ce(e),K(e))}})}}function Se(e){return e.clues&&e.clues.find(l=>l.blankIndex===_)||null}function _t(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function oe(e,l){const t=p!=="__all__"?de(p):"sentenceLogic";return e.answers.map((n,s)=>{var o,c;const a=_t(e,s),r=l[s]||"",h=Pe(e,s),m=de(h.primarySkill||t),d=r!==n,u=d?ft({meta:h,chosen:r,correct:n,stem:Ze(e.text,s,e.answers),domain:"grammar"}):null;return{blank:`#${s+1}`,passageTitle:e.title,studentAnswer:r,correctAnswer:n,status:d?"Try again":"Correct",skillTag:m,skillLabel:Y(m),clueTypeLabel:We(h.clueType||(a==null?void 0:a.clueType)),clue:((o=a==null?void 0:a.acceptableSpans)==null?void 0:o[0])||"—",explanation:((c=e.grammarNotes)==null?void 0:c[s])||h.correctReason||(a==null?void 0:a.explanation)||"Read the words before and after the blank.",nextStepPrompt:gt(m),whyWrong:u==null?void 0:u.whyWrong,whyRight:u==null?void 0:u.whyRight,missedClue:u==null?void 0:u.missedClue,examTip:h.examTip||(u?u.examTip:""),misconceptionId:(u==null?void 0:u.misconceptionId)||null}})}function St(e){if(S.some(o=>o===null)){O("Fill in all the blanks first! 🏰",!1);return}const l=bt(S,q);[...l];const t=l.every((o,c)=>o===e.answers[c]),n=l.filter((o,c)=>o===e.answers[c]).length,s=V(E),a=p==="__all__"?"mixed":p,r=e.answers.map((o,c)=>{var f;return de(((f=e.blankSkills)==null?void 0:f[c])||(p!=="__all__"?p:"sentenceLogic"))}),h=new Set(r.filter((o,c)=>l[c]!==e.answers[c]));ye.recordAttempt({quest:"clozeCastle",skill:a,correct:t,responseMs:2e3,level:w}),ye.updateSkill("clozeCastle",a,t),ve.recordGrammarCategoryAttempt(w,a,t),ae++,F+=e.answers.length,D+=n;const m=yt({storageKey:"ccqWeakSkills",level:w,skills:r,wrongSkillSet:h,current:z.get("ccqWeakSkills")||{}});z.set("ccqWeakSkills",m);let d=z.get("masteryMap")||{};const u=oe(e,l);if(ie===0&&Qe(u,{mode:"clozeCastle"}),u.forEach((o,c)=>{const f=Pe(e,c),g=o.status!=="Correct",k=f.primarySkill;j[k]||(j[k]={correct:0,total:0,label:o.skillLabel||Y(k),lastWrongExamples:[]});const C=j[k];C.total+=1,g?o.correctAnswer&&C.lastWrongExamples.length<3&&C.lastWrongExamples.push(o.correctAnswer):C.correct+=1,d=kt({mode:"clozeCastle",level:w,category:a,skill:k,clueType:f.clueType,wasWrong:g,example:g?{passageId:e.id,blankIndex:c,chosen:o.studentAnswer,correct:o.correctAnswer,clueType:f.clueType}:null,current:d})}),z.set("masteryMap",d),s.showFinalReviewOnly){X.push(...u.filter(c=>c.status!=="Correct").map(c=>({passageTitle:c.passageTitle,blank:c.blank,studentAnswer:c.studentAnswer,correctAnswer:c.correctAnswer,explanation:c.explanation,skillLabel:c.skillLabel})));const o=z.get("ccqExamAttempts")||[];o.push({level:w,category:a,passageId:e.id,blankCorrect:n,blankTotal:e.answers.length,submittedAt:Date.now()}),z.set("ccqExamAttempts",o.slice(-150)),R++,N();return}if(t){se++,Ve.recordCorrect(2e3,!1),V(E).confettiPerPassage&&Ie(),Q.playSfx("correct"),ze.celebrate(!1);const o=Math.round(n/Math.max(1,e.answers.length)*100);if(p!=="__all__"&&e.id){const c=zt({level:w,category:p,passageId:e.id,seedId:De(e),accuracy:o,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:z.get("ccqCompleted")||{},ccqCatCompleted:z.get("ccqCatCompleted")||{}});z.set("ccqCompletedByPassage",c.nextByPassage),z.set("ccqCompleted",c.nextCompleted),z.set("ccqCatCompleted",c.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(c=>c.classList.add("cloze-blank--correct")),ge({host:b.querySelector(".cloze-game"),title:"Answer Review",rows:oe(e,l),onContinue:()=>{e.clues&&e.clues.length>0?qt(e,()=>setTimeout(()=>{R++,N()},600)):(O("✅ Excellent! All correct!",!0),setTimeout(()=>{R++,N()},1200))}})}else{if(Q.playSfx("wrong"),ie++,document.querySelectorAll(".cloze-blank--filled").forEach((o,c)=>{var g;const f=((g=q.find(k=>k.id===S[c]))==null?void 0:g.word)||"";o.classList.toggle("cloze-blank--wrong",f!==e.answers[c])}),ze.encourage(),E==="exam"){ge({host:b.querySelector(".cloze-game"),title:"Exam Submission Review",rows:oe(e,l),onContinue:()=>{R++,N()}});return}ie>=2?(O("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const o=document.getElementById("cloze-feedback");o&&(o.hidden=!0),ge({host:b.querySelector(".cloze-game"),title:"Review Mistakes",rows:oe(e,l),onContinue:()=>Tt(e,l)})},800)):(O("❌ Not quite — the red blanks need another look. Reread those sentences before you try again.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const o=document.getElementById("cloze-feedback");o&&(o.hidden=!0)},1800))}}function Lt(e,l){var a,r;if(!b)return;const t={...z.get("lessonsSeen")||{}};t[`cloze:${e}`]||(t[`cloze:${e}`]=new Date().toISOString(),z.set("lessonsSeen",t));const n=he(e),s=A[e]||{icon:"🏰",label:e};b.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule: ${Ae(s.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${s.icon}</div>
      <h2 class="mcq-rule-title">${y(s.label)}</h2>
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
    </div>`,(a=b.querySelector("#cloze-rule-start"))==null||a.addEventListener("click",l),(r=b.querySelector("#cloze-rule-skip"))==null||r.addEventListener("click",l)}function Tt(e,l=[]){var h;if(!b)return;const t=document.getElementById("cloze-teachback-overlay");t&&t.remove();const n=p==="__all__"?null:p,s=n?he(n):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},a=document.createElement("div");a.id="cloze-teachback-overlay",a.className="cloze-teachback-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label","Grammar tip"),a.innerHTML=`
    <div class="ctb-panel">
      <div class="ctb-header">
        <span class="ctb-icon" aria-hidden="true">💡</span>
        <h3 class="ctb-title">Here's a tip!</h3>
      </div>
      <div class="ctb-rule">
        <p class="ctb-rule-text">${y(s.rule)}</p>
      </div>
      <div class="ctb-example">
        <span class="ctb-example-label">Example:</span>
        <p class="ctb-example-text">${y(s.example)}</p>
      </div>
      ${s.tip?`<p class="ctb-memory-tip">💡 ${y(s.tip)}</p>`:""}
      <p class="cloze-restart-note">Your blanks will be cleared so you can try the whole passage again with this rule in mind.</p>
      <button class="btn btn--primary ctb-btn" id="ctb-try-again">
        Got it — try again!
      </button>
    </div>`,b.appendChild(a);const r=e.answers.map((m,d)=>({n:d+1,correctAnswer:m,studentAnswer:l[d]||"(left blank)"})).filter(m=>m.studentAnswer!==m.correctAnswer);r.length>0&&Je(a.querySelector(".ctb-panel"),()=>{var m;return Xe({skillLabel:n?((m=A[n])==null?void 0:m.label)||n:"grammar cloze",exercise:`Fill in the blanks: "${e.text}"`,studentAnswer:r.map(d=>`blank ${d.n}: ${d.studentAnswer}`).join(", "),correctAnswer:r.map(d=>`blank ${d.n}: ${d.correctAnswer}`).join(", "),level:w})}),(h=a.querySelector("#ctb-try-again"))==null||h.addEventListener("click",()=>{a.remove(),Me(q,S),S=S.map(()=>null),K(e),ce(e)}),setTimeout(()=>{var m;return(m=a.querySelector("#ctb-try-again"))==null?void 0:m.focus()},100)}function qt(e,l){var a,r;if(!b)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const n=e.answers.map((h,m)=>{var k,C;const d=(e.clues||[]).find(i=>i.blankIndex===m),u=P[m]||"weak",o=He(u),c=xe(u),f=((k=d==null?void 0:d.acceptableSpans)==null?void 0:k[0])||"Skipped / no clue",g=((C=e.grammarNotes)==null?void 0:C[m])||(d==null?void 0:d.explanation)||`"${h}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${m+1}:</strong> ${y(h)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${o.cssClass}">${y(f)}</span> · Score ${Math.round(c*100)}%</p>
        <p class="clue-explanation-text">${y(g)}</p>
      </div>`}).join(""),s=document.createElement("div");s.id="cloze-explanation-overlay",s.className="clue-explanation-overlay",s.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${n}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(a=b.querySelector(".cloze-game"))==null||a.appendChild(s),(r=document.getElementById("clue-explanation-next"))==null||r.addEventListener("click",()=>{s.remove(),l()})}function O(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function Bt(){var C,i,$,M,Z;if(!b)return;const e=ke[w];Ie(),Q.playSfx("levelUp"),ze.celebrate(!0);const l=p!=="__all__"&&A[p]?`${A[p].icon} ${A[p].label}`:"All Topics",t=F>0?Math.round(D/F*100):100,n=t>=90?3:t>=70?2:1,s=V(E),a=Math.max(1,Math.round((Date.now()-(Ee||Date.now()))/1e3)),r=ct({accuracy:t,skillLabel:l,hintsUsed:U}),h=je({level:w,weakSkillsMap:z.get("ccqWeakSkills")||{}}),m=h.length?`<p class="cloze-complete-score">Mastery focus: ${h.map(v=>`${Y(v.skill)} (${v.wrong}/${v.attempts})`).join(" · ")}</p>`:"",d=E==="exam"&&X.length?tt(X):X.map(v=>`- ${v.passageTitle} ${v.blank}: ${v.studentAnswer||"(blank)"} → ${v.correctAnswer}`),u=Object.keys(P).length,o=u>0?Math.round(fe/u*100):null,c=o!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${o}%</p>`:"",f=le>0?Math.round(me/le*100):null,g=f!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${f}% (${me}/${le})</p>`:"";let k="";if(t<70){let v=p!=="__all__"?p:null;if(!v){const x=Object.entries(j).filter(([,L])=>L.total>0);x.length>0&&(v=x.sort(([,L],[,H])=>L.correct/L.total-H.correct/H.total)[0][0])}if(v){const x=he(v),L=A[v]||{icon:"🏰",label:v};k=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${L.icon} Focus on: <strong>${y(L.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${y(x.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${y(x.example)}</em></p>
          <p class="mcq-focus-tip-tip">${y(x.tip)}</p>
        </div>`}}b.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${G[w]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(n)}${"☆".repeat(3-n)}</div>
      <p class="cloze-complete-score">Blanks: ${D} / ${F} correct · ${t}%</p>
      <p class="cloze-complete-score">Mode: ${s.label} · Hints used: ${U} · Time: ${a}s</p>
      ${m}
      ${c}
      ${g}
      ${k}
      <p class="cloze-complete-score">Next step: ${r}</p>
      <div class="cloze-complete-actions">
        <button class="btn btn--primary btn--lg" id="cloze-back-cat">Choose Another Topic</button>
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back-levels">All Levels</button>
      </div>
    </div>`,(C=document.getElementById("cloze-back-cat"))==null||C.addEventListener("click",()=>pe(w)),(i=document.getElementById("cloze-replay"))==null||i.addEventListener("click",()=>{p==="__all__"?Ge(w):$e(w,p)}),($=document.getElementById("cloze-copy-summary"))==null||$.addEventListener("click",async()=>{var x;const v=lt({modeLabel:s.label,title:`${G[w]} · ${l}`,category:l,level:G[w],scoreLine:qe({mode:E,blankCorrect:D,blankTotal:F,passageCorrect:se,passageTotal:ae}),accuracy:t,timeTaken:`${a}s`,hintsUsed:U,clueScore:o??0,wrongLines:d,nextStep:r});try{await((x=navigator.clipboard)==null?void 0:x.writeText(v)),O("Summary copied!",!0)}catch{O("Unable to copy summary on this device.",!1)}}),(M=document.getElementById("cloze-copy-parent-report"))==null||M.addEventListener("click",async()=>{var Le,Te;const{strongest:v,weakest:x}=nt(j),L=qe({mode:E,blankCorrect:D,blankTotal:F,passageCorrect:se,passageTotal:ae}),H=st({questLabel:"Cloze Castle",modeLabel:s.label,scoreLine:L,accuracy:t,strongest:v,weakest:x,weakExamples:x?((Le=j[x.skill])==null?void 0:Le.lastWrongExamples)||[]:[],recommendation:r});try{await((Te=navigator.clipboard)==null?void 0:Te.writeText(H)),O("Parent report copied!",!0)}catch{O("Unable to copy parent report on this device.",!1)}}),(Z=document.getElementById("cloze-back-levels"))==null||Z.addEventListener("click",()=>_e()),I&&(document.removeEventListener("keydown",I),I=null),setTimeout(()=>{var v;return(v=document.getElementById("cloze-back-cat"))==null?void 0:v.focus()},200)}export{Ce as cleanupClozeCastle,Ft as initClozeCastle,Ot as showClozeBrowser};
