import{p as T,C as G,a as he}from"./passages-BYsoxLA5.js";import{s as z,p as ye,z as ze,G as A,M as y,$ as Ie,aa as fe,a5 as Me,a2 as Q,a6 as Ce,ab as Ze,a7 as Xe,ac as Ye,ad as Ke,ae as et}from"./index-BwAhntWc.js";import{g as tt,a as Y,s as lt,b as nt,c as J,d as st,e as at,p as ct,f as ot,h as rt,n as Re,i as it,j as Be,r as dt,k as ut,l as mt,m as Pe,o as We,q as He,t as pt,u as bt,v as kt,w as ht,x as ft,y as ee,z as ue,A as Fe,B as gt,C as ve,D as Ee,E as vt,F as De,G as yt,H as zt,I as Ct,J as Ne,K as wt}from"./masteryMap-DCJEOyxl.js";import{s as ie,g as je,a as Oe,b as Ge,p as Ue,r as $t,c as xt}from"./clozeCompletionTracker-CWPOmOJP.js";import"./practiceExpansion-CQrUQ_KO.js";import"./clozeAcceptableAnswers-DdV2KZ4F.js";import"./gsap-C8pce-KX.js";import"./stories-AHAdVrYV.js";let b=null,B=null,C="P1",p="",P=0,se=[],q=[],S=[],ae=0,ce=0,de=0,I=null,_=-1,M={},Z=0,N=!1,me=0,ge=0,E="practice",U=0,_e=0,X=[],H=0,j=0,we=!1,te=!1,pe=0,ne=0,D={};function Gt(e,l){b=e,B=l}function Ut(){Se()}function $e(){b&&(b.innerHTML=""),q=[],S=[],I&&(document.removeEventListener("keydown",I),I=null)}function Se(){if(!b)return;const e=z.get("ccqCompleted")||{},l=Object.keys(T);let t='<div class="cloze-browser">';t+='<h3 class="cloze-cat-title">🏰 Cloze Castle</h3>',t+='<p class="cloze-cat-subtitle">Each passage is a short story with missing words. Read it through first, then fill every blank. Pick your level to begin.</p>',t+='<div class="cloze-browser-grid">';for(const n of l){const s=Object.keys(T[n]),a=s.map(c=>ie(T[n][c])),r=a.reduce((c,f)=>c+f.seeds,0),h=a.reduce((c,f)=>c+f.seedQuestions,0),m=a.reduce((c,f)=>c+f.variants,0),i=je({level:n,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:e,seedIndex:Oe(s.flatMap(c=>T[n][c]))}),u=i>=r,o=he[n];t+=`
      <button class="cloze-level-btn ${u?"cloze-level-btn--done":""}"
              data-level="${n}" aria-label="${G[n]}">
        <span class="cloze-level-icon">${u?"⭐":o}</span>
        <span class="cloze-level-name">${G[n]}</span>
        <span class="cloze-level-count">${s.length} topics · ${h} questions · ${Math.min(i,r)} / ${r} passages done</span>
        ${m?`<span class="cloze-level-revision">+ ${m} revision rounds of the same passages</span>`:""}
      </button>`}t+="</div></div>",b.innerHTML=t,b.querySelectorAll(".cloze-level-btn").forEach(n=>{n.addEventListener("click",()=>{C=n.dataset.level,be(C)})})}function be(e){var c,f,g,k,w;if(!b)return;const l=Object.keys(T[e]),t=z.get("ccqCatCompleted")||{},n=he[e];let s='<div class="cloze-browser">';s+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${n} ${G[e]}</h3>
  </div>`,s+='<p class="cloze-cat-subtitle">Choose one grammar topic to focus on — or Play All to mix them. Topics marked "Recommended" are the ones that need your attention most.</p>',s+='<div class="cloze-cat-grid">';const a=ye.getRecommendedGrammarCategory(e,l)||ze.getRecommendedSkill("clozeCastle",l);for(const d of l){const $=A[d]||{label:d,icon:"📝"},R=ie(T[e][d]),V=R.seeds,v=R.seedQuestions,x=je({level:e,category:d,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCatCompleted:t,seedIndex:Oe(T[e][d])}),L=x>=V,W=d===a;s+=`
      <button class="cloze-cat-btn ${L?"cloze-cat-btn--done":""} ${W?"cloze-cat-btn--recommended":""}"
              data-cat="${d}" aria-label="${$.label}${W?" (recommended)":""}">
        <span class="cloze-cat-icon">${L?"⭐":$.icon}</span>
        <span class="cloze-cat-label">${$.label}</span>
        <span class="cloze-cat-count">${v} questions · ${Math.min(x,V)} / ${V} passages${R.variants?` · +${R.variants} revision rounds`:""}${W?" · Recommended":""}</span>
      </button>`}s+="</div>";const r=J(E);s+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${r.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${r.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${r.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${r.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${r.mode==="practice"?"Learn as you go: hints, a warm-up read, and feedback after every passage.":"Just like the real paper: no hints, timed, and all feedback saved for the end."}</span>
  </div>`;const h=l.reduce((d,$)=>d+ie(T[e][$]).seeds,0),m=l.reduce((d,$)=>d+ie(T[e][$]).variants,0),i=tt({mode:"clozeCastle",level:e,masteryMap:z.get("masteryMap")||{}}),u=i.length?i:Ge({level:e,weakSkillsMap:z.get("ccqWeakSkills")||{}}).map(d=>({skill:d.skill,skillLabel:Y(d.skill),attempts:d.attempts,wrong:d.wrong,accuracy:Math.round((d.attempts-d.wrong)/Math.max(1,d.attempts)*100),lastExample:null})),o=u.map(d=>{const $=d.accuracy!=null?lt(d):nt({weakSkills:[d.skill],accuracy:d.accuracy,hintsUsed:0}),R=d.lastExample?` · Last slip: "${y(d.lastExample.chosen||"—")}" → "${y(d.lastExample.correct||"?")}"`:"";return`<li>${y(d.skillLabel||Y(d.skill))}: ${d.wrong}/${d.attempts} · ${y($)}${R}</li>`}).join("");s+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${h} passages${m?" + revision":""})</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${u.length?`<ul class="cloze-mastery-list">${o}</ul>`:'<p class="cloze-cat-subtitle">Complete a few passages and the skills that need more practice will appear here.</p>'}
  </div>`,s+="</div>",b.innerHTML=s,(c=document.getElementById("cloze-back-levels"))==null||c.addEventListener("click",()=>Se()),(f=document.getElementById("cloze-mode-practice"))==null||f.addEventListener("click",()=>{E="practice",be(e)}),(g=document.getElementById("cloze-mode-exam"))==null||g.addEventListener("click",()=>{E="exam",be(e)}),b.querySelectorAll(".cloze-cat-btn").forEach(d=>{d.addEventListener("click",()=>{p=d.dataset.cat,xe(C,p)})}),(k=document.getElementById("cloze-play-all"))==null||k.addEventListener("click",()=>{p="__all__",Je(C)}),(w=document.getElementById("cloze-mastery-review"))==null||w.addEventListener("click",()=>{p=ye.getRecommendedGrammarCategory(e,l)||l[0],xe(C,p)})}function Qe(e){const l=[...e].sort(()=>Math.random()-.5),t=new Set,n=[],s=[];for(const a of l){const r=Ue(a);t.has(r)?s.push(a):(t.add(r),n.push(a))}return[...n,...s]}function xe(e,l){var n;const t=((n=T[e])==null?void 0:n[l])||[];se=Qe(t),P=0,ae=0,ce=0,ge=0,U=0,_e=Date.now(),X=[],H=0,j=0,pe=0,ne=0,D={},E!=="exam"?At(l,()=>O()):O()}function Je(e){const t=Object.keys(T[e]||{}).flatMap(n=>T[e][n]);se=Qe(t),P=0,ae=0,ce=0,ge=0,U=0,_e=Date.now(),X=[],H=0,j=0,pe=0,ne=0,D={},O()}function O(){if(P>=se.length){Rt();return}Et(se[P])}function Et(e){const l=rt(e);q=l.bankWords,S=l.blankFills,M={},Z=0,me=0,de=0,_=Re(e,S,M),N=_!==-1,we=!1,te=!1,_t(e)}function le(e){var i,u,o,c,f;if(!b)return;const l=he[C],t=`${P+1} / ${se.length}`,n=p!=="__all__"&&A[p]?`${A[p].icon} ${A[p].label}`:"All Topics",s=Pe(e),a=s&&N,r=J(E),h=s?a?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",m=s?a?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Read the whole passage first, then tap a word from the bank to fill each blank.";b.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${G[C]}</span>
        <span class="cloze-badge cloze-badge--cat">${n}</span>
        <span class="cloze-badge">${r.label}</span>
        ${h}
        <span class="cloze-progress">${t}</span>
        <span class="cloze-xp-badge">+${e.xp} XP</span>
      </div>

      <h3 class="cloze-title">${e.title}</h3>

      ${a?Lt(e):""}

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
    </div>`,oe(e),K(e),a&&Tt(e),(i=document.getElementById("cloze-clear"))==null||i.addEventListener("click",()=>{We(q,S),oe(e),K(e)}),(u=document.getElementById("cloze-listen"))==null||u.addEventListener("click",()=>{let g=e.text;for(const k of e.answers)g=g.replace("___",k);Q.speakWord(g)}),(o=document.getElementById("cloze-check"))==null||o.addEventListener("click",()=>Bt(e)),(c=document.getElementById("cloze-rule-hint"))==null||c.addEventListener("click",()=>{const g=document.getElementById("cloze-rule-hint"),k=document.getElementById("cloze-rule-hint-panel");if(!g||!k)return;const w=k.hidden;if(k.hidden=!w,g.setAttribute("aria-expanded",String(w)),g.textContent=w?"💡 Hide the rule":"💡 Stuck? Show the rule",w){const d=p!=="__all__"?p:null,$=d?fe(d):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};k.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${y($.rule)}</p>
        <p class="mcq-hint-eg"><em>${y($.example)}</em></p>
        <p class="mcq-hint-tip">${y($.tip)}</p>`}}),(f=document.getElementById("cloze-quit"))==null||f.addEventListener("click",()=>{$e(),B==null||B()}),I&&document.removeEventListener("keydown",I),I=g=>{var k;g.key==="Enter"&&!N&&(g.preventDefault(),(k=document.getElementById("cloze-check"))==null||k.click()),g.key==="Escape"&&($e(),B==null||B())},document.addEventListener("keydown",I)}function _t(e){if(b){if(we){Ae(e);return}dt({host:b,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{we=!0,Ae(e)},onQuit:()=>{$e(),B==null||B()}})}}function Ae(e){if(!b)return;if(te||E==="exam"){le(e);return}const l=ut(e);if(!l){te=!0,le(e);return}b.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${y(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");mt({host:t,attention:l,onContinue:()=>{te=!0,le(e)},onSkip:()=>{te=!0,le(e)}})}function St(){const e=Object.values(M||{}).map(Ee);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((n,s)=>n+s,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function Lt(e){const l=Le(e);if(!l)return"";const t=J(E);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${_+1} · Clue Score ${St()}</span>
      </div>
      <p class="clue-hunt-prompt">${y(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function Tt(e){var t,n;J(E).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const s=Le(e);if(!s)return;Z=Math.min(Z+1,4),U=kt(U);const{message:a}=ht(Z,s),r=document.getElementById("clue-hint-msg");r&&(r.textContent=a,r.className="clue-hint-msg clue-hint-msg--visible"),Z>=4&&(M[_]="weak",ke(e,"weak"))}),(n=document.getElementById("clue-skip-btn"))==null||n.addEventListener("click",()=>{_<0||(M[_]="weak",ke(e,"weak"))}))}function Ve(e,l){var m;const t=Le(l);if(!t)return;const n=vt(e,t),s=Ne(n),a=ue(((m=l.blankSkills)==null?void 0:m[_])||(p!=="__all__"?p:"sentenceLogic")),r=document.getElementById("clue-hunt-feedback");if(r){const i=De(t.clueType),u=Y(a),o=n==="weak"?t.prompt||"Look near the blank.":t.explanation||"Use the clue to choose the best-fitting word.";r.textContent=`${i} · ${u}. ${s.message} ${o}`,r.className=`clue-hunt-feedback ${s.cssClass}`}const h=document.getElementById("cloze-passage");h&&He({container:h,text:l.text,activeBlankIndex:_,selectedWord:e,selectedResult:n,filledAnswers:S.map((i,u)=>{var o;return i!==null&&((o=q.find(c=>c.id===i))==null?void 0:o.word)||""}),onTapWord:i=>Ve(i,l)}),z.recordClueAttempt({quest:"clozeCastle",result:n,clueType:t.clueType}),n==="strong"||n==="partial"?(M[_]=n,Q.playSfx(n==="strong"?"correct":"pop"),setTimeout(()=>ke(l,n),800)):(me++,Q.playSfx("wrong"),me>=2&&(M[_]="weak",setTimeout(()=>ke(l,"weak"),1e3)))}function ke(e,l){if(!N)return;N=!1,_=-1,ge+=Ee(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Clue found! Now tap the word from the bank that fits the blank.");const n=document.getElementById("cloze-bank-wrapper");n&&(n.className="cloze-bank-wrapper");const s=document.getElementById("cloze-check");s&&(s.disabled=!1),K(e)}function oe(e){const l=document.getElementById("cloze-passage");if(l)if(N){const t=S.map(n=>{var s;return n!==null&&((s=q.find(a=>a.id===n))==null?void 0:s.word)||""});He({container:l,text:e.text,activeBlankIndex:_,filledAnswers:t,onTapWord:n=>Ve(n,e)})}else pt({container:l,text:e.text,blankFills:S,bankWords:q,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{oe(e),K(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function K(e){const l=document.getElementById("cloze-bank");if(l){if(N){l.innerHTML=q.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${Ie(t.word)}">${y(t.word)}</button>
    `).join("");return}bt({container:l,bankWords:q,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!wt(q,S,t))return;Q.playSfx("pop");const n=Re(e,S,M);n!==-1?(_=n,N=!0,Z=0,me=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:_,passageId:e.id}),le(e)):(oe(e),K(e))}})}}function Le(e){return e.clues&&e.clues.find(l=>l.blankIndex===_)||null}function qt(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function re(e,l){const t=p!=="__all__"?ue(p):"sentenceLogic";return e.answers.map((n,s)=>{var o,c;const a=qt(e,s),r=l[s]||"",h=Fe(e,s),m=ue(h.primarySkill||t),i=!ee(e,s,r),u=i?yt({meta:h,chosen:r,correct:n,stem:Ye(e.text,s,e.answers),domain:"grammar"}):null;return{blank:`#${s+1}`,passageTitle:e.title,studentAnswer:r,correctAnswer:n,status:i?"Try again":"Correct",skillTag:m,skillLabel:Y(m),clueTypeLabel:De(h.clueType||(a==null?void 0:a.clueType)),clue:((o=a==null?void 0:a.acceptableSpans)==null?void 0:o[0])||"—",explanation:((c=e.grammarNotes)==null?void 0:c[s])||h.correctReason||(a==null?void 0:a.explanation)||"Read the words before and after the blank.",nextStepPrompt:zt(m),whyWrong:u==null?void 0:u.whyWrong,whyRight:u==null?void 0:u.whyRight,missedClue:u==null?void 0:u.missedClue,examTip:h.examTip||(u?u.examTip:""),misconceptionId:(u==null?void 0:u.misconceptionId)||null}})}function Bt(e){if(S.some(o=>o===null)){F("Fill in all the blanks first! 🏰",!1);return}const l=ft(S,q);[...l];const t=l.every((o,c)=>ee(e,c,o)),n=l.filter((o,c)=>ee(e,c,o)).length,s=J(E),a=p==="__all__"?"mixed":p,r=e.answers.map((o,c)=>{var f;return ue(((f=e.blankSkills)==null?void 0:f[c])||(p!=="__all__"?p:"sentenceLogic"))}),h=new Set(r.filter((o,c)=>!ee(e,c,l[c])));ze.recordAttempt({quest:"clozeCastle",skill:a,correct:t,responseMs:null,level:C}),ze.updateSkill("clozeCastle",a,t),ye.recordGrammarCategoryAttempt(C,a,t),ce++,H+=e.answers.length,j+=n;const m=$t({storageKey:"ccqWeakSkills",level:C,skills:r,wrongSkillSet:h,current:z.get("ccqWeakSkills")||{}});z.set("ccqWeakSkills",m);let i=z.get("masteryMap")||{};const u=re(e,l);if(de===0&&Ze(u,{mode:"clozeCastle"}),u.forEach((o,c)=>{const f=Fe(e,c),g=o.status!=="Correct",k=f.primarySkill;D[k]||(D[k]={correct:0,total:0,label:o.skillLabel||Y(k),lastWrongExamples:[]});const w=D[k];w.total+=1,g?o.correctAnswer&&w.lastWrongExamples.length<3&&w.lastWrongExamples.push(o.correctAnswer):w.correct+=1,i=gt({mode:"clozeCastle",level:C,category:a,skill:k,clueType:f.clueType,wasWrong:g,example:g?{passageId:e.id,blankIndex:c,chosen:o.studentAnswer,correct:o.correctAnswer,clueType:f.clueType}:null,current:i})}),z.set("masteryMap",i),s.showFinalReviewOnly){X.push(...u.filter(c=>c.status!=="Correct").map(c=>({passageTitle:c.passageTitle,blank:c.blank,studentAnswer:c.studentAnswer,correctAnswer:c.correctAnswer,explanation:c.explanation,skillLabel:c.skillLabel})));const o=z.get("ccqExamAttempts")||[];o.push({level:C,category:a,passageId:e.id,blankCorrect:n,blankTotal:e.answers.length,submittedAt:Date.now()}),z.set("ccqExamAttempts",o.slice(-150)),P++,O();return}if(t){ae++,Xe.recordCorrect(null,!1),J(E).confettiPerPassage&&Me(),Q.playSfx("correct"),Ce.celebrate(!1);const o=Math.round(n/Math.max(1,e.answers.length)*100);if(p!=="__all__"&&e.id){const c=xt({level:C,category:p,passageId:e.id,seedId:Ue(e),accuracy:o,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:z.get("ccqCompleted")||{},ccqCatCompleted:z.get("ccqCatCompleted")||{}});z.set("ccqCompletedByPassage",c.nextByPassage),z.set("ccqCompleted",c.nextCompleted),z.set("ccqCatCompleted",c.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(c=>c.classList.add("cloze-blank--correct")),ve({host:b.querySelector(".cloze-game"),title:"Answer Review",rows:re(e,l),onContinue:()=>{Pe(e)?Mt(e,()=>setTimeout(()=>{P++,O()},600)):(F("✅ Excellent! All correct!",!0),setTimeout(()=>{P++,O()},1200))}})}else{if(Q.playSfx("wrong"),de++,document.querySelectorAll(".cloze-blank--filled").forEach((o,c)=>{var g;const f=((g=q.find(k=>k.id===S[c]))==null?void 0:g.word)||"";o.classList.toggle("cloze-blank--wrong",!ee(e,c,f))}),Ce.encourage(),E==="exam"){ve({host:b.querySelector(".cloze-game"),title:"Exam Submission Review",rows:re(e,l),onContinue:()=>{P++,O()}});return}de>=2?(F("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const o=document.getElementById("cloze-feedback");o&&(o.hidden=!0),ve({host:b.querySelector(".cloze-game"),title:"Review Mistakes",rows:re(e,l),onContinue:()=>It(e,l)})},800)):(F("❌ Not quite — the red blanks need another look. Reread those sentences before you try again.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const o=document.getElementById("cloze-feedback");o&&(o.hidden=!0)},1800))}}function At(e,l){var a,r;if(!b)return;const t={...z.get("lessonsSeen")||{}};t[`cloze:${e}`]||(t[`cloze:${e}`]=new Date().toISOString(),z.set("lessonsSeen",t));const n=fe(e),s=A[e]||{icon:"🏰",label:e};b.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule: ${Ie(s.label)}">
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
    </div>`,(a=b.querySelector("#cloze-rule-start"))==null||a.addEventListener("click",l),(r=b.querySelector("#cloze-rule-skip"))==null||r.addEventListener("click",l)}function It(e,l=[]){var h;if(!b)return;const t=document.getElementById("cloze-teachback-overlay");t&&t.remove();const n=p==="__all__"?null:p,s=n?fe(n):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},a=document.createElement("div");a.id="cloze-teachback-overlay",a.className="cloze-teachback-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label","Grammar tip"),a.innerHTML=`
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
    </div>`,b.appendChild(a);const r=e.answers.map((m,i)=>({n:i+1,correctAnswer:m,studentAnswer:l[i]||"(left blank)"})).filter(m=>m.studentAnswer!==m.correctAnswer);r.length>0&&Ke(a.querySelector(".ctb-panel"),()=>{var m;return et({skillLabel:n?((m=A[n])==null?void 0:m.label)||n:"grammar cloze",exercise:`Fill in the blanks: "${e.text}"`,studentAnswer:r.map(i=>`blank ${i.n}: ${i.studentAnswer}`).join(", "),correctAnswer:r.map(i=>`blank ${i.n}: ${i.correctAnswer}`).join(", "),level:C})}),(h=a.querySelector("#ctb-try-again"))==null||h.addEventListener("click",()=>{a.remove(),We(q,S),S=S.map(()=>null),K(e),oe(e)}),setTimeout(()=>{var m;return(m=a.querySelector("#ctb-try-again"))==null?void 0:m.focus()},100)}function Mt(e,l){var a,r;if(!b)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const n=e.answers.map((h,m)=>{var k,w;const i=Ct(e,m),u=M[m]||"weak",o=Ne(u),c=Ee(u),f=((k=i==null?void 0:i.acceptableSpans)==null?void 0:k[0])||"Skipped / no clue",g=((w=e.grammarNotes)==null?void 0:w[m])||(i==null?void 0:i.explanation)||`"${h}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${m+1}:</strong> ${y(h)}</p>
        ${i?`<p>Clue chosen: <span class="clue-result-badge ${o.cssClass}">${y(f)}</span> · Score ${Math.round(c*100)}%</p>`:""}
        <p class="clue-explanation-text">${y(g)}</p>
      </div>`}).join(""),s=document.createElement("div");s.id="cloze-explanation-overlay",s.className="clue-explanation-overlay",s.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${n}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(a=b.querySelector(".cloze-game"))==null||a.appendChild(s),(r=document.getElementById("clue-explanation-next"))==null||r.addEventListener("click",()=>{s.remove(),l()})}function F(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function Rt(){var w,d,$,R,V;if(!b)return;const e=he[C];Me(),Q.playSfx("levelUp"),Ce.celebrate(!0);const l=p!=="__all__"&&A[p]?`${A[p].icon} ${A[p].label}`:"All Topics",t=H>0?Math.round(j/H*100):100,n=t>=90?3:t>=70?2:1,s=J(E),a=Math.max(1,Math.round((Date.now()-(_e||Date.now()))/1e3)),r=it({accuracy:t,skillLabel:l,hintsUsed:U}),h=Ge({level:C,weakSkillsMap:z.get("ccqWeakSkills")||{}}),m=h.length?`<p class="cloze-complete-score">Mastery focus: ${h.map(v=>`${Y(v.skill)} (${v.wrong}/${v.attempts})`).join(" · ")}</p>`:"",i=E==="exam"&&X.length?st(X):X.map(v=>`- ${v.passageTitle} ${v.blank}: ${v.studentAnswer||"(blank)"} → ${v.correctAnswer}`),u=Object.keys(M).length,o=u>0?Math.round(ge/u*100):null,c=o!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${o}%</p>`:"",f=ne>0?Math.round(pe/ne*100):null,g=f!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${f}% (${pe}/${ne})</p>`:"";let k="";if(t<70){let v=p!=="__all__"?p:null;if(!v){const x=Object.entries(D).filter(([,L])=>L.total>0);x.length>0&&(v=x.sort(([,L],[,W])=>L.correct/L.total-W.correct/W.total)[0][0])}if(v){const x=fe(v),L=A[v]||{icon:"🏰",label:v};k=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${L.icon} Focus on: <strong>${y(L.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${y(x.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${y(x.example)}</em></p>
          <p class="mcq-focus-tip-tip">${y(x.tip)}</p>
        </div>`}}b.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${G[C]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(n)}${"☆".repeat(3-n)}</div>
      <p class="cloze-complete-score">Blanks: ${j} / ${H} correct · ${t}%</p>
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
    </div>`,(w=document.getElementById("cloze-back-cat"))==null||w.addEventListener("click",()=>be(C)),(d=document.getElementById("cloze-replay"))==null||d.addEventListener("click",()=>{p==="__all__"?Je(C):xe(C,p)}),($=document.getElementById("cloze-copy-summary"))==null||$.addEventListener("click",async()=>{var x;const v=at({modeLabel:s.label,title:`${G[C]} · ${l}`,category:l,level:G[C],scoreLine:Be({mode:E,blankCorrect:j,blankTotal:H,passageCorrect:ae,passageTotal:ce}),accuracy:t,timeTaken:`${a}s`,hintsUsed:U,clueScore:o??0,wrongLines:i,nextStep:r});try{await((x=navigator.clipboard)==null?void 0:x.writeText(v)),F("Summary copied!",!0)}catch{F("Unable to copy summary on this device.",!1)}}),(R=document.getElementById("cloze-copy-parent-report"))==null||R.addEventListener("click",async()=>{var Te,qe;const{strongest:v,weakest:x}=ct(D),L=Be({mode:E,blankCorrect:j,blankTotal:H,passageCorrect:ae,passageTotal:ce}),W=ot({questLabel:"Cloze Castle",modeLabel:s.label,scoreLine:L,accuracy:t,strongest:v,weakest:x,weakExamples:x?((Te=D[x.skill])==null?void 0:Te.lastWrongExamples)||[]:[],recommendation:r});try{await((qe=navigator.clipboard)==null?void 0:qe.writeText(W)),F("Parent report copied!",!0)}catch{F("Unable to copy parent report on this device.",!1)}}),(V=document.getElementById("cloze-back-levels"))==null||V.addEventListener("click",()=>Se()),I&&(document.removeEventListener("keydown",I),I=null),setTimeout(()=>{var v;return(v=document.getElementById("cloze-back-cat"))==null?void 0:v.focus()},200)}export{$e as cleanupClozeCastle,Gt as initClozeCastle,Ut as showClozeBrowser};
