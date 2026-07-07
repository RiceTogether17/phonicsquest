import{p as M,C as D,a as pe}from"./passages-DNXaSraU.js";import{s as v,p as fe,q as ge,G as q,x as y,K as Ae,L as be,F as Be,E as G,H as ye,I as De,M as Oe,N as Ge}from"./index-Blm0iG1P.js";import{g as Ie,a as Ue,b as Me,c as Z,s as Je,d as Ve,e as U,f as Ze,h as Ke,p as Qe,i as Xe,j as Ye,k as et,l as Te,r as tt,m as lt,n as nt,o as Re,q as Pe,t as at,u as st,v as ct,w as ot,x as rt,y as re,z as it,A as We,B as dt,C as ut,D as he,E as $e,F as mt,G as He,H as pt,I as bt,J as Fe,K as kt}from"./masteryMap-DHcI0I4u.js";import"./gsap-C8pce-KX.js";let b=null,T=null,z="P1",m="",I=0,le=[],L=[],E=[],ne=0,ae=0,ve=0,A=null,x=-1,R={},J=0,P=!1,ie=0,ke=0,C="practice",O=0,xe=0,V=[],W=0,N=0,ze=!1,Y=!1,de=0,te=0,F={};function qt(e,l){b=e,T=l}function At(){Ee()}function we(){b&&(b.innerHTML=""),L=[],E=[],A&&(document.removeEventListener("keydown",A),A=null)}function Ee(){if(!b)return;const e=v.get("ccqCompleted")||{},l=Object.keys(M);let t='<div class="cloze-browser">';t+='<h3 class="cloze-cat-title">🏰 Cloze Castle</h3>',t+='<p class="cloze-cat-subtitle">Each passage is a short story with missing words. Read it through first, then fill every blank. Pick your level to begin.</p>',t+='<div class="cloze-browser-grid">';for(const n of l){const a=Object.keys(M[n]),s=a.reduce((d,p)=>d+M[n][p].length,0),i=Ie({level:n,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCompleted:e}),k=i>=s,u=pe[n];t+=`
      <button class="cloze-level-btn ${k?"cloze-level-btn--done":""}"
              data-level="${n}" aria-label="${D[n]}">
        <span class="cloze-level-icon">${k?"⭐":u}</span>
        <span class="cloze-level-name">${D[n]}</span>
        <span class="cloze-level-count">${a.length} topics · ${Math.min(i,s)} / ${s} done</span>
      </button>`}t+="</div></div>",b.innerHTML=t,b.querySelectorAll(".cloze-level-btn").forEach(n=>{n.addEventListener("click",()=>{z=n.dataset.level,ue(z)})})}function ue(e){var r,c,w,g,h;if(!b)return;const l=Object.keys(M[e]),t=v.get("ccqCatCompleted")||{},n=pe[e];let a='<div class="cloze-browser">';a+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${n} ${D[e]}</h3>
  </div>`,a+='<p class="cloze-cat-subtitle">Choose one grammar topic to focus on — or Play All to mix them. Topics marked "Recommended" are the ones that need your attention most.</p>',a+='<div class="cloze-cat-grid">';const s=fe.getRecommendedGrammarCategory(e,l)||ge.getRecommendedSkill("clozeCastle",l);for(const o of l){const $=q[o]||{label:o,icon:"📝"},S=M[e][o].length,Q=Ie({level:e,category:o,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCatCompleted:t}),X=Q>=S,f=o===s;a+=`
      <button class="cloze-cat-btn ${X?"cloze-cat-btn--done":""} ${f?"cloze-cat-btn--recommended":""}"
              data-cat="${o}" aria-label="${$.label}${f?" (recommended)":""}">
        <span class="cloze-cat-icon">${X?"⭐":$.icon}</span>
        <span class="cloze-cat-label">${$.label}</span>
        <span class="cloze-cat-count">${Math.min(Q,S)} / ${S}${f?" · Recommended":""}</span>
      </button>`}a+="</div>";const i=U(C);a+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${i.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${i.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${i.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${i.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${i.mode==="practice"?"Learn as you go: hints, a warm-up read, and feedback after every passage.":"Just like the real paper: no hints, timed, and all feedback saved for the end."}</span>
  </div>`;const k=l.reduce((o,$)=>o+M[e][$].length,0),u=Ue({mode:"clozeCastle",level:e,masteryMap:v.get("masteryMap")||{}}),d=u.length?u:Me({level:e,weakSkillsMap:v.get("ccqWeakSkills")||{}}).map(o=>({skill:o.skill,skillLabel:Z(o.skill),attempts:o.attempts,wrong:o.wrong,accuracy:Math.round((o.attempts-o.wrong)/Math.max(1,o.attempts)*100),lastExample:null})),p=d.map(o=>{const $=o.accuracy!=null?Je(o):Ve({weakSkills:[o.skill],accuracy:o.accuracy,hintsUsed:0}),S=o.lastExample?` · Last slip: "${y(o.lastExample.chosen||"—")}" → "${y(o.lastExample.correct||"?")}"`:"";return`<li>${y(o.skillLabel||Z(o.skill))}: ${o.wrong}/${o.attempts} · ${y($)}${S}</li>`}).join("");a+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${k} passages)</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${d.length?`<ul class="cloze-mastery-list">${p}</ul>`:'<p class="cloze-cat-subtitle">Complete a few passages and the skills that need more practice will appear here.</p>'}
  </div>`,a+="</div>",b.innerHTML=a,(r=document.getElementById("cloze-back-levels"))==null||r.addEventListener("click",()=>Ee()),(c=document.getElementById("cloze-mode-practice"))==null||c.addEventListener("click",()=>{C="practice",ue(e)}),(w=document.getElementById("cloze-mode-exam"))==null||w.addEventListener("click",()=>{C="exam",ue(e)}),b.querySelectorAll(".cloze-cat-btn").forEach(o=>{o.addEventListener("click",()=>{m=o.dataset.cat,Ce(z,m)})}),(g=document.getElementById("cloze-play-all"))==null||g.addEventListener("click",()=>{m="__all__",Ne(z)}),(h=document.getElementById("cloze-mastery-review"))==null||h.addEventListener("click",()=>{m=fe.getRecommendedGrammarCategory(e,l)||l[0],Ce(z,m)})}function Ce(e,l){var n;le=[...((n=M[e])==null?void 0:n[l])||[]].sort(()=>Math.random()-.5),I=0,ne=0,ae=0,ke=0,O=0,xe=Date.now(),V=[],W=0,N=0,de=0,te=0,F={},C!=="exam"?Ct(l,()=>j()):j()}function Ne(e){le=[...Object.keys(M[e]||{}).flatMap(n=>M[e][n])].sort(()=>Math.random()-.5),I=0,ne=0,ae=0,ke=0,O=0,xe=Date.now(),V=[],W=0,N=0,de=0,te=0,F={},j()}function j(){if(I>=le.length){Et();return}ht(le[I])}function ht(e){const l=Ye(e);if(L=l.bankWords,E=l.blankFills,R={},J=0,ie=0,ve=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((n,a)=>n.blankIndex-a.blankIndex)[0];x=(t==null?void 0:t.blankIndex)??-1,P=!0}else x=-1,P=!1;ze=!1,Y=!1,ft(e)}function ee(e){var d,p,r,c,w;if(!b)return;const l=pe[z],t=`${I+1} / ${le.length}`,n=m!=="__all__"&&q[m]?`${q[m].icon} ${q[m].label}`:"All Topics",a=e.clues&&e.clues.length>0,s=a&&P,i=U(C),k=a?s?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",u=a?s?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Read the whole passage first, then tap a word from the bank to fill each blank.";b.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${D[z]}</span>
        <span class="cloze-badge cloze-badge--cat">${n}</span>
        <span class="cloze-badge">${i.label}</span>
        ${k}
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
        ${C!=="exam"?'<button class="btn btn--ghost btn--sm" id="cloze-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>':""}
        <button class="btn btn--primary" id="cloze-check" ${s?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="cloze-rule-hint-panel" hidden></div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,se(e),K(e),s&&vt(e),(d=document.getElementById("cloze-clear"))==null||d.addEventListener("click",()=>{Re(L,E),se(e),K(e)}),(p=document.getElementById("cloze-listen"))==null||p.addEventListener("click",()=>{let g=e.text;for(const h of e.answers)g=g.replace("___",h);G.speakWord(g)}),(r=document.getElementById("cloze-check"))==null||r.addEventListener("click",()=>wt(e)),(c=document.getElementById("cloze-rule-hint"))==null||c.addEventListener("click",()=>{const g=document.getElementById("cloze-rule-hint"),h=document.getElementById("cloze-rule-hint-panel");if(!g||!h)return;const o=h.hidden;if(h.hidden=!o,g.setAttribute("aria-expanded",String(o)),g.textContent=o?"💡 Hide the rule":"💡 Stuck? Show the rule",o){const $=m!=="__all__"?m:null,S=$?be($):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};h.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${y(S.rule)}</p>
        <p class="mcq-hint-eg"><em>${y(S.example)}</em></p>
        <p class="mcq-hint-tip">${y(S.tip)}</p>`}}),(w=document.getElementById("cloze-quit"))==null||w.addEventListener("click",()=>{we(),T==null||T()}),A&&document.removeEventListener("keydown",A),A=g=>{var h;g.key==="Enter"&&!P&&(g.preventDefault(),(h=document.getElementById("cloze-check"))==null||h.click()),g.key==="Escape"&&(we(),T==null||T())},document.addEventListener("keydown",A)}function ft(e){if(b){if(ze){qe(e);return}tt({host:b,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{ze=!0,qe(e)},onQuit:()=>{we(),T==null||T()}})}}function qe(e){if(!b)return;if(Y||C==="exam"){ee(e);return}const l=lt(e);if(!l){Y=!0,ee(e);return}b.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${y(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");nt({host:t,attention:l,onContinue:()=>{Y=!0,ee(e)},onSkip:()=>{Y=!0,ee(e)}})}function gt(){const e=Object.values(R||{}).map($e);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((n,a)=>n+a,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function yt(e){const l=_e(e);if(!l)return"";const t=U(C);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${x+1} · Clue Score ${gt()}</span>
      </div>
      <p class="clue-hunt-prompt">${y(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function vt(e){var t,n;U(C).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const a=_e(e);if(!a)return;J=Math.min(J+1,4),O=ct(O);const{message:s}=ot(J,a),i=document.getElementById("clue-hint-msg");i&&(i.textContent=s,i.className="clue-hint-msg clue-hint-msg--visible"),J>=4&&(R[x]="weak",me(e,"weak"))}),(n=document.getElementById("clue-skip-btn"))==null||n.addEventListener("click",()=>{x<0||(R[x]="weak",me(e,"weak"))}))}function je(e,l){var u;const t=_e(l);if(!t)return;const n=mt(e,t),a=Fe(n),s=re(((u=l.blankSkills)==null?void 0:u[x])||(m!=="__all__"?m:"sentenceLogic")),i=document.getElementById("clue-hunt-feedback");if(i){const d=He(t.clueType),p=Z(s),r=t.explanation||"Use the clue to choose the best-fitting word.";i.textContent=`${d} · ${p}. ${a.message} ${r}`,i.className=`clue-hunt-feedback ${a.cssClass}`}const k=document.getElementById("cloze-passage");k&&Pe({container:k,text:l.text,activeBlankIndex:x,selectedWord:e,selectedResult:n,filledAnswers:E.map((d,p)=>{var r;return d!==null&&((r=L.find(c=>c.id===d))==null?void 0:r.word)||""}),onTapWord:d=>je(d,l)}),v.recordClueAttempt({quest:"clozeCastle",result:n,clueType:t.clueType}),n==="strong"||n==="partial"?(R[x]=n,G.playSfx(n==="strong"?"correct":"pop"),setTimeout(()=>me(l,n),800)):(ie++,G.playSfx("wrong"),ie>=2&&(R[x]="weak",setTimeout(()=>me(l,"weak"),1e3)))}function me(e,l){if(!P)return;P=!1,x=-1,ke+=$e(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Clue found! Now tap the word from the bank that fits the blank.");const n=document.getElementById("cloze-bank-wrapper");n&&(n.className="cloze-bank-wrapper");const a=document.getElementById("cloze-check");a&&(a.disabled=!1),K(e)}function se(e){const l=document.getElementById("cloze-passage");if(l)if(P){const t=E.map(n=>{var a;return n!==null&&((a=L.find(s=>s.id===n))==null?void 0:a.word)||""});Pe({container:l,text:e.text,activeBlankIndex:x,filledAnswers:t,onTapWord:n=>je(n,e)})}else at({container:l,text:e.text,blankFills:E,bankWords:L,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{se(e),K(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function K(e){const l=document.getElementById("cloze-bank");if(l){if(P){l.innerHTML=L.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${Ae(t.word)}">${y(t.word)}</button>
    `).join("");return}st({container:l,bankWords:L,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!kt(L,E,t))return;G.playSfx("pop");const n=(e.clues||[]).slice().sort((a,s)=>a.blankIndex-s.blankIndex).find(a=>E[a.blankIndex]===null&&!Object.hasOwn(R,a.blankIndex));n?(x=n.blankIndex,P=!0,J=0,ie=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:x,passageId:e.id}),ee(e)):(se(e),K(e))}})}}function _e(e){return e.clues&&e.clues.find(l=>l.blankIndex===x)||null}function zt(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function oe(e,l){const t=m!=="__all__"?re(m):"sentenceLogic";return e.answers.map((n,a)=>{var r,c;const s=zt(e,a),i=l[a]||"",k=We(e,a),u=re(k.primarySkill||t),d=i!==n,p=d?pt({meta:k,chosen:i,correct:n}):null;return{blank:`#${a+1}`,passageTitle:e.title,studentAnswer:i,correctAnswer:n,status:d?"Try again":"Correct",skillLabel:Z(u),clueTypeLabel:He(k.clueType||(s==null?void 0:s.clueType)),clue:((r=s==null?void 0:s.acceptableSpans)==null?void 0:r[0])||"—",explanation:((c=e.grammarNotes)==null?void 0:c[a])||k.correctReason||(s==null?void 0:s.explanation)||"Read the words before and after the blank.",nextStepPrompt:bt(u),whyWrong:p==null?void 0:p.whyWrong,whyRight:p==null?void 0:p.whyRight,missedClue:p==null?void 0:p.missedClue,examTip:k.examTip||(p?p.examTip:"")}})}function wt(e){if(E.some(r=>r===null)){H("Fill in all the blanks first! 🏰",!1);return}const l=rt(E,L);[...l];const t=l.every((r,c)=>r===e.answers[c]),n=l.filter((r,c)=>r===e.answers[c]).length,a=U(C),s=m==="__all__"?"mixed":m,i=e.answers.map((r,c)=>{var w;return re(((w=e.blankSkills)==null?void 0:w[c])||(m!=="__all__"?m:"sentenceLogic"))}),k=new Set(i.filter((r,c)=>l[c]!==e.answers[c]));ge.recordAttempt({quest:"clozeCastle",skill:s,correct:t,responseMs:2e3,level:z}),ge.updateSkill("clozeCastle",s,t),fe.recordGrammarCategoryAttempt(z,s,t),ae++,W+=e.answers.length,N+=n;const u=it({storageKey:"ccqWeakSkills",level:z,skills:i,wrongSkillSet:k,current:v.get("ccqWeakSkills")||{}});v.set("ccqWeakSkills",u);let d=v.get("masteryMap")||{};const p=oe(e,l);if(p.forEach((r,c)=>{const w=We(e,c),g=r.status!=="Correct",h=w.primarySkill;F[h]||(F[h]={correct:0,total:0,label:r.skillLabel||Z(h),lastWrongExamples:[]});const o=F[h];o.total+=1,g?r.correctAnswer&&o.lastWrongExamples.length<3&&o.lastWrongExamples.push(r.correctAnswer):o.correct+=1,d=dt({mode:"clozeCastle",level:z,category:s,skill:h,clueType:w.clueType,wasWrong:g,example:g?{passageId:e.id,blankIndex:c,chosen:r.studentAnswer,correct:r.correctAnswer,clueType:w.clueType}:null,current:d})}),v.set("masteryMap",d),a.showFinalReviewOnly){V.push(...p.filter(c=>c.status!=="Correct").map(c=>({passageTitle:c.passageTitle,blank:c.blank,studentAnswer:c.studentAnswer,correctAnswer:c.correctAnswer,explanation:c.explanation,skillLabel:c.skillLabel})));const r=v.get("ccqExamAttempts")||[];r.push({level:z,category:s,passageId:e.id,blankCorrect:n,blankTotal:e.answers.length,submittedAt:Date.now()}),v.set("ccqExamAttempts",r.slice(-150)),I++,j();return}if(t){ne++,De.recordCorrect(2e3,!1),U(C).confettiPerPassage&&Be(),G.playSfx("correct"),ye.celebrate(!1);const r=Math.round(n/Math.max(1,e.answers.length)*100);if(m!=="__all__"&&e.id){const c=ut({level:z,category:m,passageId:e.id,accuracy:r,ccqCompletedByPassage:v.get("ccqCompletedByPassage")||{},ccqCompleted:v.get("ccqCompleted")||{},ccqCatCompleted:v.get("ccqCatCompleted")||{}});v.set("ccqCompletedByPassage",c.nextByPassage),v.set("ccqCompleted",c.nextCompleted),v.set("ccqCatCompleted",c.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(c=>c.classList.add("cloze-blank--correct")),he({host:b.querySelector(".cloze-game"),title:"Answer Review",rows:oe(e,l),onContinue:()=>{e.clues&&e.clues.length>0?xt(e,()=>setTimeout(()=>{I++,j()},600)):(H("✅ Excellent! All correct!",!0),setTimeout(()=>{I++,j()},1200))}})}else{if(G.playSfx("wrong"),ve++,document.querySelectorAll(".cloze-blank--filled").forEach((r,c)=>{var g;const w=((g=L.find(h=>h.id===E[c]))==null?void 0:g.word)||"";r.classList.toggle("cloze-blank--wrong",w!==e.answers[c])}),ye.encourage(),C==="exam"){he({host:b.querySelector(".cloze-game"),title:"Exam Submission Review",rows:oe(e,l),onContinue:()=>{I++,j()}});return}ve>=2?(H("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0),he({host:b.querySelector(".cloze-game"),title:"Review Mistakes",rows:oe(e,l),onContinue:()=>$t(e,l)})},800)):(H("❌ Not quite — the red blanks need another look. Reread those sentences before you try again.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(c=>c.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0)},1800))}}function Ct(e,l){var s,i;if(!b)return;const t={...v.get("lessonsSeen")||{}};t[`cloze:${e}`]||(t[`cloze:${e}`]=new Date().toISOString(),v.set("lessonsSeen",t));const n=be(e),a=q[e]||{icon:"🏰",label:e};b.innerHTML=`
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
    </div>`,(s=b.querySelector("#cloze-rule-start"))==null||s.addEventListener("click",l),(i=b.querySelector("#cloze-rule-skip"))==null||i.addEventListener("click",l)}function $t(e,l=[]){var k;if(!b)return;const t=document.getElementById("cloze-teachback-overlay");t&&t.remove();const n=m==="__all__"?null:m,a=n?be(n):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},s=document.createElement("div");s.id="cloze-teachback-overlay",s.className="cloze-teachback-overlay",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-label","Grammar tip"),s.innerHTML=`
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
    </div>`,b.appendChild(s);const i=e.answers.map((u,d)=>({n:d+1,correctAnswer:u,studentAnswer:l[d]||"(left blank)"})).filter(u=>u.studentAnswer!==u.correctAnswer);i.length>0&&Oe(s.querySelector(".ctb-panel"),()=>{var u;return Ge({skillLabel:n?((u=q[n])==null?void 0:u.label)||n:"grammar cloze",exercise:`Fill in the blanks: "${e.text}"`,studentAnswer:i.map(d=>`blank ${d.n}: ${d.studentAnswer}`).join(", "),correctAnswer:i.map(d=>`blank ${d.n}: ${d.correctAnswer}`).join(", "),level:z})}),(k=s.querySelector("#ctb-try-again"))==null||k.addEventListener("click",()=>{s.remove(),Re(L,E),E=E.map(()=>null),K(e),se(e)}),setTimeout(()=>{var u;return(u=s.querySelector("#ctb-try-again"))==null?void 0:u.focus()},100)}function xt(e,l){var s,i;if(!b)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const n=e.answers.map((k,u)=>{var h,o;const d=(e.clues||[]).find($=>$.blankIndex===u),p=R[u]||"weak",r=Fe(p),c=$e(p),w=((h=d==null?void 0:d.acceptableSpans)==null?void 0:h[0])||"Skipped / no clue",g=((o=e.grammarNotes)==null?void 0:o[u])||(d==null?void 0:d.explanation)||`"${k}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${u+1}:</strong> ${y(k)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${r.cssClass}">${y(w)}</span> · Score ${Math.round(c*100)}%</p>
        <p class="clue-explanation-text">${y(g)}</p>
      </div>`}).join(""),a=document.createElement("div");a.id="cloze-explanation-overlay",a.className="clue-explanation-overlay",a.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${n}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(s=b.querySelector(".cloze-game"))==null||s.appendChild(a),(i=document.getElementById("clue-explanation-next"))==null||i.addEventListener("click",()=>{a.remove(),l()})}function H(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function Et(){var o,$,S,Q,X;if(!b)return;const e=pe[z];Be(),G.playSfx("levelUp"),ye.celebrate(!0);const l=m!=="__all__"&&q[m]?`${q[m].icon} ${q[m].label}`:"All Topics",t=W>0?Math.round(N/W*100):100,n=t>=90?3:t>=70?2:1,a=U(C),s=Math.max(1,Math.round((Date.now()-(xe||Date.now()))/1e3)),i=et({accuracy:t,skillLabel:l,hintsUsed:O}),k=Me({level:z,weakSkillsMap:v.get("ccqWeakSkills")||{}}),u=k.length?`<p class="cloze-complete-score">Mastery focus: ${k.map(f=>`${Z(f.skill)} (${f.wrong}/${f.attempts})`).join(" · ")}</p>`:"",d=C==="exam"&&V.length?Ze(V):V.map(f=>`- ${f.passageTitle} ${f.blank}: ${f.studentAnswer||"(blank)"} → ${f.correctAnswer}`),p=Object.keys(R).length,r=p>0?Math.round(ke/p*100):null,c=r!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${r}%</p>`:"",w=te>0?Math.round(de/te*100):null,g=w!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${w}% (${de}/${te})</p>`:"";let h="";if(t<70){let f=m!=="__all__"?m:null;if(!f){const _=Object.entries(F).filter(([,B])=>B.total>0);_.length>0&&(f=_.sort(([,B],[,ce])=>B.correct/B.total-ce.correct/ce.total)[0][0])}if(f){const _=be(f),B=q[f]||{icon:"🏰",label:f};h=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${B.icon} Focus on: <strong>${y(B.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${y(_.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${y(_.example)}</em></p>
          <p class="mcq-focus-tip-tip">${y(_.tip)}</p>
        </div>`}}b.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${D[z]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(n)}${"☆".repeat(3-n)}</div>
      <p class="cloze-complete-score">Blanks: ${N} / ${W} correct · ${t}%</p>
      <p class="cloze-complete-score">Mode: ${a.label} · Hints used: ${O} · Time: ${s}s</p>
      ${u}
      ${c}
      ${g}
      ${h}
      <p class="cloze-complete-score">Next step: ${i}</p>
      <div class="cloze-complete-actions">
        <button class="btn btn--primary btn--lg" id="cloze-back-cat">Choose Another Topic</button>
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back-levels">All Levels</button>
      </div>
    </div>`,(o=document.getElementById("cloze-back-cat"))==null||o.addEventListener("click",()=>ue(z)),($=document.getElementById("cloze-replay"))==null||$.addEventListener("click",()=>{m==="__all__"?Ne(z):Ce(z,m)}),(S=document.getElementById("cloze-copy-summary"))==null||S.addEventListener("click",async()=>{var _;const f=Ke({modeLabel:a.label,title:`${D[z]} · ${l}`,category:l,level:D[z],scoreLine:Te({mode:C,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ae}),accuracy:t,timeTaken:`${s}s`,hintsUsed:O,clueScore:r??0,wrongLines:d,nextStep:i});try{await((_=navigator.clipboard)==null?void 0:_.writeText(f)),H("Summary copied!",!0)}catch{H("Unable to copy summary on this device.",!1)}}),(Q=document.getElementById("cloze-copy-parent-report"))==null||Q.addEventListener("click",async()=>{var Se,Le;const{strongest:f,weakest:_}=Qe(F),B=Te({mode:C,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ae}),ce=Xe({questLabel:"Cloze Castle",modeLabel:a.label,scoreLine:B,accuracy:t,strongest:f,weakest:_,weakExamples:_?((Se=F[_.skill])==null?void 0:Se.lastWrongExamples)||[]:[],recommendation:i});try{await((Le=navigator.clipboard)==null?void 0:Le.writeText(ce)),H("Parent report copied!",!0)}catch{H("Unable to copy parent report on this device.",!1)}}),(X=document.getElementById("cloze-back-levels"))==null||X.addEventListener("click",()=>Ee()),A&&(document.removeEventListener("keydown",A),A=null),setTimeout(()=>{var f;return(f=document.getElementById("cloze-back-cat"))==null?void 0:f.focus()},200)}export{we as cleanupClozeCastle,qt as initClozeCastle,At as showClozeBrowser};
