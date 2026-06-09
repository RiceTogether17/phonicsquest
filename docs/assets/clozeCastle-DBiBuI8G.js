import{p as M,C as j,a as pe}from"./passages-DNXaSraU.js";import{g as be}from"./grammarTips-D9YQFGRf.js";import{s as z,p as he,k as Be,j as G,l as ge,o as je}from"./index-B5kQgz7F.js";import{q as ye}from"./questMastery-BOzozjkU.js";import{g as Ae,a as Oe,b as Ie,c as Z,s as Ge,d as Ue,e as U,f as Ke,h as Ve,p as Ze,i as Je,j as Qe,k as Xe,l as Te,r as Ye,m as et,n as tt,o as Me,q as Re,t as lt,u as nt,v as ct,w as at,x as st,y as re,z as ot,A as Pe,B as rt,C as it,D as fe,E as $e,F as dt,G as We,H as ut,I as mt,J as He,K as pt}from"./masteryMap-BhgKgjXT.js";import{e as h,a as Fe}from"./escapeHtml-Bz2f3NU1.js";import{G as A}from"./grammarCategories-sjlxVdzw.js";import"./gsap-C8pce-KX.js";let p=null,T=null,v="P1",d="",I=0,le=[],L=[],E=[],ne=0,ce=0,ve=0,q=null,x=-1,R={},K=0,P=!1,ie=0,ke=0,w="practice",O=0,xe=0,V=[],W=0,N=0,ze=!1,Y=!1,de=0,te=0,F={};function At(e,l){p=e,T=l}function It(){Ee()}function Ce(){p&&(p.innerHTML=""),L=[],E=[],q&&(document.removeEventListener("keydown",q),q=null)}function Ee(){if(!p)return;const e=z.get("ccqCompleted")||{},l=Object.keys(M);let t='<div class="cloze-browser">';t+='<div class="cloze-browser-grid">';for(const c of l){const n=Object.keys(M[c]),a=n.reduce((u,m)=>u+M[c][m].length,0),i=Ae({level:c,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:e}),g=i>=a,y=pe[c];t+=`
      <button class="cloze-level-btn ${g?"cloze-level-btn--done":""}"
              data-level="${c}" aria-label="${j[c]}">
        <span class="cloze-level-icon">${g?"⭐":y}</span>
        <span class="cloze-level-name">${j[c]}</span>
        <span class="cloze-level-count">${n.length} topics · ${Math.min(i,a)} / ${a} done</span>
      </button>`}t+="</div></div>",p.innerHTML=t,p.querySelectorAll(".cloze-level-btn").forEach(c=>{c.addEventListener("click",()=>{v=c.dataset.level,ue(v)})})}function ue(e){var r,s,C,f,b;if(!p)return;const l=Object.keys(M[e]),t=z.get("ccqCatCompleted")||{},c=pe[e];let n='<div class="cloze-browser">';n+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${c} ${j[e]}</h3>
  </div>`,n+='<p class="cloze-cat-subtitle">Choose a grammar topic:</p>',n+='<div class="cloze-cat-grid">';const a=he.getRecommendedGrammarCategory(e,l)||ye.getRecommendedSkill("clozeCastle",l);for(const o of l){const $=A[o]||{label:o,icon:"📝"},S=M[e][o].length,Q=Ae({level:e,category:o,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCatCompleted:t}),X=Q>=S,k=o===a;n+=`
      <button class="cloze-cat-btn ${X?"cloze-cat-btn--done":""} ${k?"cloze-cat-btn--recommended":""}"
              data-cat="${o}" aria-label="${$.label}${k?" (recommended)":""}">
        <span class="cloze-cat-icon">${X?"⭐":$.icon}</span>
        <span class="cloze-cat-label">${$.label}</span>
        <span class="cloze-cat-count">${Math.min(Q,S)} / ${S}${k?" · Recommended":""}</span>
      </button>`}n+="</div>";const i=U(w);n+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${i.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${i.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${i.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${i.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${i.mode==="practice"?"Hints + scan + per-blank feedback.":"No hints, timed, review only at the end."}</span>
  </div>`;const g=l.reduce((o,$)=>o+M[e][$].length,0),y=Oe({mode:"clozeCastle",level:e,masteryMap:z.get("masteryMap")||{}}),u=y.length?y:Ie({level:e,weakSkillsMap:z.get("ccqWeakSkills")||{}}).map(o=>({skill:o.skill,skillLabel:Z(o.skill),attempts:o.attempts,wrong:o.wrong,accuracy:Math.round((o.attempts-o.wrong)/Math.max(1,o.attempts)*100),lastExample:null})),m=u.map(o=>{const $=o.accuracy!=null?Ge(o):Ue({weakSkills:[o.skill],accuracy:o.accuracy,hintsUsed:0}),S=o.lastExample?` · Last slip: "${h(o.lastExample.chosen||"—")}" → "${h(o.lastExample.correct||"?")}"`:"";return`<li>${h(o.skillLabel||Z(o.skill))}: ${o.wrong}/${o.attempts} · ${h($)}${S}</li>`}).join("");n+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${g} passages)</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${u.length?`<ul class="cloze-mastery-list">${m}</ul>`:'<p class="cloze-cat-subtitle">Mastery tip: complete a few passages to unlock weak-skill hints.</p>'}
  </div>`,n+="</div>",p.innerHTML=n,(r=document.getElementById("cloze-back-levels"))==null||r.addEventListener("click",()=>Ee()),(s=document.getElementById("cloze-mode-practice"))==null||s.addEventListener("click",()=>{w="practice",ue(e)}),(C=document.getElementById("cloze-mode-exam"))==null||C.addEventListener("click",()=>{w="exam",ue(e)}),p.querySelectorAll(".cloze-cat-btn").forEach(o=>{o.addEventListener("click",()=>{d=o.dataset.cat,we(v,d)})}),(f=document.getElementById("cloze-play-all"))==null||f.addEventListener("click",()=>{d="__all__",Ne(v)}),(b=document.getElementById("cloze-mastery-review"))==null||b.addEventListener("click",()=>{d=he.getRecommendedGrammarCategory(e,l)||l[0],we(v,d)})}function we(e,l){var c;le=[...((c=M[e])==null?void 0:c[l])||[]].sort(()=>Math.random()-.5),I=0,ne=0,ce=0,ke=0,O=0,xe=Date.now(),V=[],W=0,N=0,de=0,te=0,F={},w!=="exam"?zt(l,()=>D()):D()}function Ne(e){le=[...Object.keys(M[e]||{}).flatMap(c=>M[e][c])].sort(()=>Math.random()-.5),I=0,ne=0,ce=0,ke=0,O=0,xe=Date.now(),V=[],W=0,N=0,de=0,te=0,F={},D()}function D(){if(I>=le.length){$t();return}bt(le[I])}function bt(e){const l=Qe(e);if(L=l.bankWords,E=l.blankFills,R={},K=0,ie=0,ve=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((c,n)=>c.blankIndex-n.blankIndex)[0];x=(t==null?void 0:t.blankIndex)??-1,P=!0}else x=-1,P=!1;ze=!1,Y=!1,kt(e)}function ee(e){var u,m,r,s,C;if(!p)return;const l=pe[v],t=`${I+1} / ${le.length}`,c=d!=="__all__"&&A[d]?`${A[d].icon} ${A[d].label}`:"All Topics",n=e.clues&&e.clues.length>0,a=n&&P,i=U(w),g=n?a?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",y=n?a?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Tap a word from the bank to fill the next blank.";p.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${j[v]}</span>
        <span class="cloze-badge cloze-badge--cat">${c}</span>
        <span class="cloze-badge">${i.label}</span>
        ${g}
        <span class="cloze-progress">${t}</span>
        <span class="cloze-xp-badge">+${e.xp} XP</span>
      </div>

      <h3 class="cloze-title">${e.title}</h3>

      ${a?ht(e):""}

      <p class="cloze-instruction" id="cloze-instruction">
        ${y}
      </p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank-wrapper ${a?"cloze-bank-wrapper--locked":""}" id="cloze-bank-wrapper">
        ${a?'<div class="cloze-bank-lock-msg">🔒 Find the clue first!</div>':""}
        <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>
      </div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="cloze-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${w!=="exam"?'<button class="btn btn--ghost btn--sm" id="cloze-rule-hint" aria-expanded="false">💡 Show Rule</button>':""}
        <button class="btn btn--primary" id="cloze-check" ${a?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="cloze-rule-hint-panel" hidden></div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,ae(e),J(e),a&&gt(e),(u=document.getElementById("cloze-clear"))==null||u.addEventListener("click",()=>{Me(L,E),ae(e),J(e)}),(m=document.getElementById("cloze-listen"))==null||m.addEventListener("click",()=>{let f=e.text;for(const b of e.answers)f=f.replace("___",b);G.speakWord(f)}),(r=document.getElementById("cloze-check"))==null||r.addEventListener("click",()=>vt(e)),(s=document.getElementById("cloze-rule-hint"))==null||s.addEventListener("click",()=>{const f=document.getElementById("cloze-rule-hint"),b=document.getElementById("cloze-rule-hint-panel");if(!f||!b)return;const o=b.hidden;if(b.hidden=!o,f.setAttribute("aria-expanded",String(o)),f.textContent=o?"💡 Hide Rule":"💡 Show Rule",o){const $=d!=="__all__"?d:null,S=$?be($):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};b.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${h(S.rule)}</p>
        <p class="mcq-hint-eg"><em>${h(S.example)}</em></p>
        <p class="mcq-hint-tip">${h(S.tip)}</p>`}}),(C=document.getElementById("cloze-quit"))==null||C.addEventListener("click",()=>{Ce(),T==null||T()}),q&&document.removeEventListener("keydown",q),q=f=>{var b;f.key==="Enter"&&!P&&(f.preventDefault(),(b=document.getElementById("cloze-check"))==null||b.click()),f.key==="Escape"&&(Ce(),T==null||T())},document.addEventListener("keydown",q)}function kt(e){if(p){if(ze){qe(e);return}Ye({host:p,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{ze=!0,qe(e)},onQuit:()=>{Ce(),T==null||T()}})}}function qe(e){if(!p)return;if(Y||w==="exam"){ee(e);return}const l=et(e);if(!l){Y=!0,ee(e);return}p.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${h(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");tt({host:t,attention:l,onContinue:()=>{Y=!0,ee(e)},onSkip:()=>{Y=!0,ee(e)}})}function ft(){const e=Object.values(R||{}).map($e);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((c,n)=>c+n,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function ht(e){const l=_e(e);if(!l)return"";const t=U(w);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${x+1} · Clue Score ${ft()}</span>
      </div>
      <p class="clue-hunt-prompt">${h(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function gt(e){var t,c;U(w).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const n=_e(e);if(!n)return;K=Math.min(K+1,4),O=ct(O);const{message:a}=at(K,n),i=document.getElementById("clue-hint-msg");i&&(i.textContent=a,i.className="clue-hint-msg clue-hint-msg--visible"),K>=4&&(R[x]="weak",me(e,"weak"))}),(c=document.getElementById("clue-skip-btn"))==null||c.addEventListener("click",()=>{x<0||(R[x]="weak",me(e,"weak"))}))}function De(e,l){var y;const t=_e(l);if(!t)return;const c=dt(e,t),n=He(c),a=re(((y=l.blankSkills)==null?void 0:y[x])||(d!=="__all__"?d:"sentenceLogic")),i=document.getElementById("clue-hunt-feedback");if(i){const u=We(t.clueType),m=Z(a),r=t.explanation||"Use the clue to choose the best-fitting word.";i.textContent=`${u} · ${m}. ${n.message} ${r}`,i.className=`clue-hunt-feedback ${n.cssClass}`}const g=document.getElementById("cloze-passage");g&&Re({container:g,text:l.text,activeBlankIndex:x,selectedWord:e,selectedResult:c,filledAnswers:E.map((u,m)=>{var r;return u!==null&&((r=L.find(s=>s.id===u))==null?void 0:r.word)||""}),onTapWord:u=>De(u,l)}),z.recordClueAttempt({quest:"clozeCastle",result:c,clueType:t.clueType}),c==="strong"||c==="partial"?(R[x]=c,G.playSfx(c==="strong"?"correct":"pop"),setTimeout(()=>me(l,c),800)):(ie++,G.playSfx("wrong"),ie>=2&&(R[x]="weak",setTimeout(()=>me(l,"weak"),1e3)))}function me(e,l){if(!P)return;P=!1,x=-1,ke+=$e(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Now tap a word to fill the blank!");const c=document.getElementById("cloze-bank-wrapper");c&&(c.className="cloze-bank-wrapper");const n=document.getElementById("cloze-check");n&&(n.disabled=!1),J(e)}function ae(e){const l=document.getElementById("cloze-passage");if(l)if(P){const t=E.map(c=>{var n;return c!==null&&((n=L.find(a=>a.id===c))==null?void 0:n.word)||""});Re({container:l,text:e.text,activeBlankIndex:x,filledAnswers:t,onTapWord:c=>De(c,e)})}else lt({container:l,text:e.text,blankFills:E,bankWords:L,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{ae(e),J(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function J(e){const l=document.getElementById("cloze-bank");if(l){if(P){l.innerHTML=L.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${Fe(t.word)}">${h(t.word)}</button>
    `).join("");return}nt({container:l,bankWords:L,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!pt(L,E,t))return;G.playSfx("pop");const c=(e.clues||[]).slice().sort((n,a)=>n.blankIndex-a.blankIndex).find(n=>E[n.blankIndex]===null&&!R.hasOwnProperty(n.blankIndex));c?(x=c.blankIndex,P=!0,K=0,ie=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:x,passageId:e.id}),ee(e)):(ae(e),J(e))}})}}function _e(e){return e.clues&&e.clues.find(l=>l.blankIndex===x)||null}function yt(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function oe(e,l){const t=d!=="__all__"?re(d):"sentenceLogic";return e.answers.map((c,n)=>{var r,s;const a=yt(e,n),i=l[n]||"",g=Pe(e,n),y=re(g.primarySkill||t),u=i!==c,m=u?ut({meta:g,chosen:i,correct:c}):null;return{blank:`#${n+1}`,passageTitle:e.title,studentAnswer:i,correctAnswer:c,status:u?"Try again":"Correct",skillLabel:Z(y),clueTypeLabel:We(g.clueType||(a==null?void 0:a.clueType)),clue:((r=a==null?void 0:a.acceptableSpans)==null?void 0:r[0])||"—",explanation:((s=e.grammarNotes)==null?void 0:s[n])||g.correctReason||(a==null?void 0:a.explanation)||"Read the words before and after the blank.",nextStepPrompt:mt(y),whyWrong:m==null?void 0:m.whyWrong,whyRight:m==null?void 0:m.whyRight,missedClue:m==null?void 0:m.missedClue,examTip:g.examTip||(m?m.examTip:"")}})}function vt(e){if(E.some(r=>r===null)){H("Fill in all the blanks first! 🏰",!1);return}const l=st(E,L);[...l];const t=l.every((r,s)=>r===e.answers[s]),c=l.filter((r,s)=>r===e.answers[s]).length,n=U(w),a=d==="__all__"?"mixed":d,i=e.answers.map((r,s)=>{var C;return re(((C=e.blankSkills)==null?void 0:C[s])||(d!=="__all__"?d:"sentenceLogic"))}),g=new Set(i.filter((r,s)=>l[s]!==e.answers[s]));ye.recordAttempt({quest:"clozeCastle",skill:a,correct:t,responseMs:2e3,level:v}),ye.updateSkill("clozeCastle",a,t),he.recordGrammarCategoryAttempt(v,a,t),ce++,W+=e.answers.length,N+=c;const y=ot({storageKey:"ccqWeakSkills",level:v,skills:i,wrongSkillSet:g,current:z.get("ccqWeakSkills")||{}});z.set("ccqWeakSkills",y);let u=z.get("masteryMap")||{};const m=oe(e,l);if(m.forEach((r,s)=>{const C=Pe(e,s),f=r.status!=="Correct",b=C.primarySkill;F[b]||(F[b]={correct:0,total:0,label:r.skillLabel||Z(b),lastWrongExamples:[]});const o=F[b];o.total+=1,f?r.correctAnswer&&o.lastWrongExamples.length<3&&o.lastWrongExamples.push(r.correctAnswer):o.correct+=1,u=rt({mode:"clozeCastle",level:v,category:a,skill:b,clueType:C.clueType,wasWrong:f,example:f?{passageId:e.id,blankIndex:s,chosen:r.studentAnswer,correct:r.correctAnswer,clueType:C.clueType}:null,current:u})}),z.set("masteryMap",u),n.showFinalReviewOnly){V.push(...m.filter(s=>s.status!=="Correct").map(s=>({passageTitle:s.passageTitle,blank:s.blank,studentAnswer:s.studentAnswer,correctAnswer:s.correctAnswer,explanation:s.explanation,skillLabel:s.skillLabel})));const r=z.get("ccqExamAttempts")||[];r.push({level:v,category:a,passageId:e.id,blankCorrect:c,blankTotal:e.answers.length,submittedAt:Date.now()}),z.set("ccqExamAttempts",r.slice(-150)),I++,D();return}if(t){ne++,je.recordCorrect(2e3,!1),U(w).confettiPerPassage&&Be(),G.playSfx("correct"),ge.celebrate(!1);const r=Math.round(c/Math.max(1,e.answers.length)*100);if(d!=="__all__"&&e.id){const s=it({level:v,category:d,passageId:e.id,accuracy:r,ccqCompletedByPassage:z.get("ccqCompletedByPassage")||{},ccqCompleted:z.get("ccqCompleted")||{},ccqCatCompleted:z.get("ccqCatCompleted")||{}});z.set("ccqCompletedByPassage",s.nextByPassage),z.set("ccqCompleted",s.nextCompleted),z.set("ccqCatCompleted",s.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(s=>s.classList.add("cloze-blank--correct")),fe({host:p.querySelector(".cloze-game"),title:"Answer Review",rows:oe(e,l),onContinue:()=>{e.clues&&e.clues.length>0?wt(e,()=>setTimeout(()=>{I++,D()},600)):(H("✅ Excellent! All correct!",!0),setTimeout(()=>{I++,D()},1200))}})}else{if(G.playSfx("wrong"),ve++,document.querySelectorAll(".cloze-blank--filled").forEach((r,s)=>{var f;const C=((f=L.find(b=>b.id===E[s]))==null?void 0:f.word)||"";r.classList.toggle("cloze-blank--wrong",C!==e.answers[s])}),ge.encourage(),w==="exam"){fe({host:p.querySelector(".cloze-game"),title:"Exam Submission Review",rows:oe(e,l),onContinue:()=>{I++,D()}});return}ve>=2?(H("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(s=>s.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0),fe({host:p.querySelector(".cloze-game"),title:"Review Mistakes",rows:oe(e,l),onContinue:()=>Ct(e)})},800)):(H("❌ Some blanks are wrong – try again!",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(s=>s.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0)},1800))}}function zt(e,l){var n,a;if(!p)return;const t=be(e),c=A[e]||{icon:"🏰",label:e};p.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule: ${Fe(c.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${c.icon}</div>
      <h2 class="mcq-rule-title">${h(c.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${h(t.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${h(t.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${h(t.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="cloze-rule-start">Got it — start passages →</button>
        <button class="btn btn--ghost" id="cloze-rule-skip">Skip →</button>
      </div>
    </div>`,(n=p.querySelector("#cloze-rule-start"))==null||n.addEventListener("click",l),(a=p.querySelector("#cloze-rule-skip"))==null||a.addEventListener("click",l)}function Ct(e){var a;if(!p)return;const l=document.getElementById("cloze-teachback-overlay");l&&l.remove();const t=d==="__all__"?null:d,c=t?be(t):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},n=document.createElement("div");n.id="cloze-teachback-overlay",n.className="cloze-teachback-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-label","Grammar tip"),n.innerHTML=`
    <div class="ctb-panel">
      <div class="ctb-header">
        <span class="ctb-icon" aria-hidden="true">💡</span>
        <h3 class="ctb-title">Here's a tip!</h3>
      </div>
      <div class="ctb-rule">
        <p class="ctb-rule-text">${h(c.rule)}</p>
      </div>
      <div class="ctb-example">
        <span class="ctb-example-label">Example:</span>
        <p class="ctb-example-text">${h(c.example)}</p>
      </div>
      ${c.tip?`<p class="ctb-memory-tip">💡 ${h(c.tip)}</p>`:""}
      <button class="btn btn--primary ctb-btn" id="ctb-try-again">
        Got it — try again!
      </button>
    </div>`,p.appendChild(n),(a=n.querySelector("#ctb-try-again"))==null||a.addEventListener("click",()=>{n.remove(),Me(L,E),E=E.map(()=>null),J(e),ae(e)}),setTimeout(()=>{var i;return(i=n.querySelector("#ctb-try-again"))==null?void 0:i.focus()},100)}function wt(e,l){var a,i;if(!p)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const c=e.answers.map((g,y)=>{var b,o;const u=(e.clues||[]).find($=>$.blankIndex===y),m=R[y]||"weak",r=He(m),s=$e(m),C=((b=u==null?void 0:u.acceptableSpans)==null?void 0:b[0])||"Skipped / no clue",f=((o=e.grammarNotes)==null?void 0:o[y])||(u==null?void 0:u.explanation)||`"${g}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${y+1}:</strong> ${h(g)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${r.cssClass}">${h(C)}</span> · Score ${Math.round(s*100)}%</p>
        <p class="clue-explanation-text">${h(f)}</p>
      </div>`}).join(""),n=document.createElement("div");n.id="cloze-explanation-overlay",n.className="clue-explanation-overlay",n.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${c}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(a=p.querySelector(".cloze-game"))==null||a.appendChild(n),(i=document.getElementById("clue-explanation-next"))==null||i.addEventListener("click",()=>{n.remove(),l()})}function H(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function $t(){var o,$,S,Q,X;if(!p)return;const e=pe[v];Be(),G.playSfx("levelUp"),ge.celebrate(!0);const l=d!=="__all__"&&A[d]?`${A[d].icon} ${A[d].label}`:"All Topics",t=W>0?Math.round(N/W*100):100,c=t>=90?3:t>=70?2:1,n=U(w),a=Math.max(1,Math.round((Date.now()-(xe||Date.now()))/1e3)),i=Xe({accuracy:t,skillLabel:l,hintsUsed:O}),g=Ie({level:v,weakSkillsMap:z.get("ccqWeakSkills")||{}}),y=g.length?`<p class="cloze-complete-score">Mastery focus: ${g.map(k=>`${Z(k.skill)} (${k.wrong}/${k.attempts})`).join(" · ")}</p>`:"",u=w==="exam"&&V.length?Ke(V):V.map(k=>`- ${k.passageTitle} ${k.blank}: ${k.studentAnswer||"(blank)"} → ${k.correctAnswer}`),m=Object.keys(R).length,r=m>0?Math.round(ke/m*100):null,s=r!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${r}%</p>`:"",C=te>0?Math.round(de/te*100):null,f=C!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${C}% (${de}/${te})</p>`:"";let b="";if(t<70){let k=d!=="__all__"?d:null;if(!k){const _=Object.entries(F).filter(([,B])=>B.total>0);_.length>0&&(k=_.sort(([,B],[,se])=>B.correct/B.total-se.correct/se.total)[0][0])}if(k){const _=be(k),B=A[k]||{icon:"🏰",label:k};b=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${B.icon} Focus on: <strong>${h(B.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${h(_.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${h(_.example)}</em></p>
          <p class="mcq-focus-tip-tip">${h(_.tip)}</p>
        </div>`}}p.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${j[v]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(c)}${"☆".repeat(3-c)}</div>
      <p class="cloze-complete-score">Blanks: ${N} / ${W} correct · ${t}%</p>
      <p class="cloze-complete-score">Mode: ${n.label} · Hints used: ${O} · Time: ${a}s</p>
      ${y}
      ${s}
      ${f}
      ${b}
      <p class="cloze-complete-score">Next step: ${i}</p>
      <div class="cloze-complete-actions">
        <button class="btn btn--primary btn--lg" id="cloze-back-cat">Choose Another Topic</button>
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back-levels">All Levels</button>
      </div>
    </div>`,(o=document.getElementById("cloze-back-cat"))==null||o.addEventListener("click",()=>ue(v)),($=document.getElementById("cloze-replay"))==null||$.addEventListener("click",()=>{d==="__all__"?Ne(v):we(v,d)}),(S=document.getElementById("cloze-copy-summary"))==null||S.addEventListener("click",async()=>{var _;const k=Ve({modeLabel:n.label,title:`${j[v]} · ${l}`,category:l,level:j[v],scoreLine:Te({mode:w,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ce}),accuracy:t,timeTaken:`${a}s`,hintsUsed:O,clueScore:r??0,wrongLines:u,nextStep:i});try{await((_=navigator.clipboard)==null?void 0:_.writeText(k)),H("Summary copied!",!0)}catch{H("Unable to copy summary on this device.",!1)}}),(Q=document.getElementById("cloze-copy-parent-report"))==null||Q.addEventListener("click",async()=>{var Se,Le;const{strongest:k,weakest:_}=Ze(F),B=Te({mode:w,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ce}),se=Je({questLabel:"Cloze Castle",modeLabel:n.label,scoreLine:B,accuracy:t,strongest:k,weakest:_,weakExamples:_?((Se=F[_.skill])==null?void 0:Se.lastWrongExamples)||[]:[],recommendation:i});try{await((Le=navigator.clipboard)==null?void 0:Le.writeText(se)),H("Parent report copied!",!0)}catch{H("Unable to copy parent report on this device.",!1)}}),(X=document.getElementById("cloze-back-levels"))==null||X.addEventListener("click",()=>Ee()),q&&(document.removeEventListener("keydown",q),q=null),setTimeout(()=>{var k;return(k=document.getElementById("cloze-back-cat"))==null?void 0:k.focus()},200)}export{Ce as cleanupClozeCastle,At as initClozeCastle,It as showClozeBrowser};
