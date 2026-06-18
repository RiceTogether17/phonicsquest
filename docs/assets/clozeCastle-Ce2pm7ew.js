import{p as M,C as j,a as pe}from"./passages-DNXaSraU.js";import{s as y,p as fe,q as ge,G as B,x as v,K as qe,L as be,F as Ae,E as G,H as ve,I as je,M as Oe,N as Ge}from"./index-BS3YxgK-.js";import{g as Ie,a as Ue,b as Me,c as J,s as Ve,d as Ze,e as U,f as Je,h as Ke,p as Qe,i as Xe,j as Ye,k as et,l as Te,r as tt,m as lt,n as nt,o as Re,q as Pe,t as ct,u as at,v as st,w as ot,x as rt,y as re,z as it,A as We,B as dt,C as ut,D as he,E as $e,F as mt,G as He,H as pt,I as bt,J as Fe,K as kt}from"./masteryMap-DUQRFEpC.js";import"./gsap-C8pce-KX.js";let b=null,T=null,z="P1",m="",I=0,le=[],L=[],E=[],ne=0,ce=0,ye=0,q=null,x=-1,R={},V=0,P=!1,ie=0,ke=0,C="practice",O=0,xe=0,Z=[],W=0,N=0,ze=!1,Y=!1,de=0,te=0,F={};function Bt(e,l){b=e,T=l}function qt(){Ee()}function we(){b&&(b.innerHTML=""),L=[],E=[],q&&(document.removeEventListener("keydown",q),q=null)}function Ee(){if(!b)return;const e=y.get("ccqCompleted")||{},l=Object.keys(M);let t='<div class="cloze-browser">';t+='<div class="cloze-browser-grid">';for(const n of l){const c=Object.keys(M[n]),a=c.reduce((d,p)=>d+M[n][p].length,0),i=Ie({level:n,ccqCompletedByPassage:y.get("ccqCompletedByPassage")||{},ccqCompleted:e}),k=i>=a,u=pe[n];t+=`
      <button class="cloze-level-btn ${k?"cloze-level-btn--done":""}"
              data-level="${n}" aria-label="${j[n]}">
        <span class="cloze-level-icon">${k?"⭐":u}</span>
        <span class="cloze-level-name">${j[n]}</span>
        <span class="cloze-level-count">${c.length} topics · ${Math.min(i,a)} / ${a} done</span>
      </button>`}t+="</div></div>",b.innerHTML=t,b.querySelectorAll(".cloze-level-btn").forEach(n=>{n.addEventListener("click",()=>{z=n.dataset.level,ue(z)})})}function ue(e){var r,s,w,g,h;if(!b)return;const l=Object.keys(M[e]),t=y.get("ccqCatCompleted")||{},n=pe[e];let c='<div class="cloze-browser">';c+=`<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${n} ${j[e]}</h3>
  </div>`,c+='<p class="cloze-cat-subtitle">Choose a grammar topic:</p>',c+='<div class="cloze-cat-grid">';const a=fe.getRecommendedGrammarCategory(e,l)||ge.getRecommendedSkill("clozeCastle",l);for(const o of l){const $=B[o]||{label:o,icon:"📝"},S=M[e][o].length,Q=Ie({level:e,category:o,ccqCompletedByPassage:y.get("ccqCompletedByPassage")||{},ccqCatCompleted:t}),X=Q>=S,f=o===a;c+=`
      <button class="cloze-cat-btn ${X?"cloze-cat-btn--done":""} ${f?"cloze-cat-btn--recommended":""}"
              data-cat="${o}" aria-label="${$.label}${f?" (recommended)":""}">
        <span class="cloze-cat-icon">${X?"⭐":$.icon}</span>
        <span class="cloze-cat-label">${$.label}</span>
        <span class="cloze-cat-count">${Math.min(Q,S)} / ${S}${f?" · Recommended":""}</span>
      </button>`}c+="</div>";const i=U(C);c+=`<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${i.mode==="practice"?"is-active":""}" id="cloze-mode-practice" aria-pressed="${i.mode==="practice"}">Practice Mode</button>
    <button class="btn btn--ghost btn--sm ${i.mode==="exam"?"is-active":""}" id="cloze-mode-exam" aria-pressed="${i.mode==="exam"}">Exam Mode</button>
    <span class="cloze-mode-hint">${i.mode==="practice"?"Hints + scan + per-blank feedback.":"No hints, timed, review only at the end."}</span>
  </div>`;const k=l.reduce((o,$)=>o+M[e][$].length,0),u=Ue({mode:"clozeCastle",level:e,masteryMap:y.get("masteryMap")||{}}),d=u.length?u:Me({level:e,weakSkillsMap:y.get("ccqWeakSkills")||{}}).map(o=>({skill:o.skill,skillLabel:J(o.skill),attempts:o.attempts,wrong:o.wrong,accuracy:Math.round((o.attempts-o.wrong)/Math.max(1,o.attempts)*100),lastExample:null})),p=d.map(o=>{const $=o.accuracy!=null?Ve(o):Ze({weakSkills:[o.skill],accuracy:o.accuracy,hintsUsed:0}),S=o.lastExample?` · Last slip: "${v(o.lastExample.chosen||"—")}" → "${v(o.lastExample.correct||"?")}"`:"";return`<li>${v(o.skillLabel||J(o.skill))}: ${o.wrong}/${o.attempts} · ${v($)}${S}</li>`}).join("");c+=`<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${k} passages)</button>
    <button class="btn btn--ghost btn--sm" id="cloze-mastery-review">Practise Recommended Topic</button>
    ${d.length?`<ul class="cloze-mastery-list">${p}</ul>`:'<p class="cloze-cat-subtitle">Mastery tip: complete a few passages to unlock weak-skill hints.</p>'}
  </div>`,c+="</div>",b.innerHTML=c,(r=document.getElementById("cloze-back-levels"))==null||r.addEventListener("click",()=>Ee()),(s=document.getElementById("cloze-mode-practice"))==null||s.addEventListener("click",()=>{C="practice",ue(e)}),(w=document.getElementById("cloze-mode-exam"))==null||w.addEventListener("click",()=>{C="exam",ue(e)}),b.querySelectorAll(".cloze-cat-btn").forEach(o=>{o.addEventListener("click",()=>{m=o.dataset.cat,Ce(z,m)})}),(g=document.getElementById("cloze-play-all"))==null||g.addEventListener("click",()=>{m="__all__",Ne(z)}),(h=document.getElementById("cloze-mastery-review"))==null||h.addEventListener("click",()=>{m=fe.getRecommendedGrammarCategory(e,l)||l[0],Ce(z,m)})}function Ce(e,l){var n;le=[...((n=M[e])==null?void 0:n[l])||[]].sort(()=>Math.random()-.5),I=0,ne=0,ce=0,ke=0,O=0,xe=Date.now(),Z=[],W=0,N=0,de=0,te=0,F={},C!=="exam"?Ct(l,()=>D()):D()}function Ne(e){le=[...Object.keys(M[e]||{}).flatMap(n=>M[e][n])].sort(()=>Math.random()-.5),I=0,ne=0,ce=0,ke=0,O=0,xe=Date.now(),Z=[],W=0,N=0,de=0,te=0,F={},D()}function D(){if(I>=le.length){Et();return}ht(le[I])}function ht(e){const l=Ye(e);if(L=l.bankWords,E=l.blankFills,R={},V=0,ie=0,ye=0,e.clues&&e.clues.length>0){const t=[...e.clues].sort((n,c)=>n.blankIndex-c.blankIndex)[0];x=(t==null?void 0:t.blankIndex)??-1,P=!0}else x=-1,P=!1;ze=!1,Y=!1,ft(e)}function ee(e){var d,p,r,s,w;if(!b)return;const l=pe[z],t=`${I+1} / ${le.length}`,n=m!=="__all__"&&B[m]?`${B[m].icon} ${B[m].label}`:"All Topics",c=e.clues&&e.clues.length>0,a=c&&P,i=U(C),k=c?a?'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-clue">🔍 Step 1 · Clue Hunt</span>':'<span class="cloze-badge cloze-badge--phase cloze-badge--phase-fill">🏰 Step 2 · Fill the Blanks</span>':"",u=c?a?"🔍 Step 1 of 2 — Tap the clue word in the passage that hints at the answer.":"🏰 Step 2 of 2 — Now tap a word from the bank to fill the next blank.":"🏰 Tap a word from the bank to fill the next blank.";b.innerHTML=`
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${l} ${j[z]}</span>
        <span class="cloze-badge cloze-badge--cat">${n}</span>
        <span class="cloze-badge">${i.label}</span>
        ${k}
        <span class="cloze-progress">${t}</span>
        <span class="cloze-xp-badge">+${e.xp} XP</span>
      </div>

      <h3 class="cloze-title">${e.title}</h3>

      ${a?vt(e):""}

      <p class="cloze-instruction" id="cloze-instruction">
        ${u}
      </p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank-wrapper ${a?"cloze-bank-wrapper--locked":""}" id="cloze-bank-wrapper">
        ${a?'<div class="cloze-bank-lock-msg">🔒 Find the clue first!</div>':""}
        <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>
      </div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="cloze-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${C!=="exam"?'<button class="btn btn--ghost btn--sm" id="cloze-rule-hint" aria-expanded="false">💡 Show Rule</button>':""}
        <button class="btn btn--primary" id="cloze-check" ${a?"disabled":""}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="cloze-rule-hint-panel" hidden></div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`,ae(e),K(e),a&&yt(e),(d=document.getElementById("cloze-clear"))==null||d.addEventListener("click",()=>{Re(L,E),ae(e),K(e)}),(p=document.getElementById("cloze-listen"))==null||p.addEventListener("click",()=>{let g=e.text;for(const h of e.answers)g=g.replace("___",h);G.speakWord(g)}),(r=document.getElementById("cloze-check"))==null||r.addEventListener("click",()=>wt(e)),(s=document.getElementById("cloze-rule-hint"))==null||s.addEventListener("click",()=>{const g=document.getElementById("cloze-rule-hint"),h=document.getElementById("cloze-rule-hint-panel");if(!g||!h)return;const o=h.hidden;if(h.hidden=!o,g.setAttribute("aria-expanded",String(o)),g.textContent=o?"💡 Hide Rule":"💡 Show Rule",o){const $=m!=="__all__"?m:null,S=$?be($):{rule:"Read each sentence and look for grammar clues about which word fits best.",example:"The words around each blank — tense, pronouns, singular/plural — point to the answer.",tip:"Check tense markers, subject–verb agreement, and pronoun reference."};h.innerHTML=`
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${v(S.rule)}</p>
        <p class="mcq-hint-eg"><em>${v(S.example)}</em></p>
        <p class="mcq-hint-tip">${v(S.tip)}</p>`}}),(w=document.getElementById("cloze-quit"))==null||w.addEventListener("click",()=>{we(),T==null||T()}),q&&document.removeEventListener("keydown",q),q=g=>{var h;g.key==="Enter"&&!P&&(g.preventDefault(),(h=document.getElementById("cloze-check"))==null||h.click()),g.key==="Escape"&&(we(),T==null||T())},document.addEventListener("keydown",q)}function ft(e){if(b){if(ze){Be(e);return}tt({host:b,quest:"cloze",passageTitle:e.title||"Cloze Castle",passageText:e.text||"",onContinue:()=>{ze=!0,Be(e)},onQuit:()=>{we(),T==null||T()}})}}function Be(e){if(!b)return;if(Y||C==="exam"){ee(e);return}const l=lt(e);if(!l){Y=!0,ee(e);return}b.innerHTML=`
    <div class="cloze-game cloze-game--scan">
      <div class="cloze-game-header">
        <span class="cloze-badge">Scan Step</span>
      </div>
      <h3 class="cloze-title">${v(e.title||"Cloze Castle")}</h3>
      <div id="cloze-scan-host"></div>
    </div>`;const t=document.getElementById("cloze-scan-host");nt({host:t,attention:l,onContinue:()=>{Y=!0,ee(e)},onSkip:()=>{Y=!0,ee(e)}})}function gt(){const e=Object.values(R||{}).map($e);if(!e.length)return"☆ ☆ ☆";const l=e.reduce((n,c)=>n+c,0)/e.length,t=l>=.85?3:l>=.45?2:1;return`${"★".repeat(t)}${"☆".repeat(3-t)}`}function vt(e){const l=_e(e);if(!l)return"";const t=U(C);return`
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${x+1} · Clue Score ${gt()}</span>
      </div>
      <p class="clue-hunt-prompt">${v(l.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>':""}
        ${t.allowHints?'<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>':""}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`}function yt(e){var t,n;U(C).allowHints&&((t=document.getElementById("clue-hint-btn"))==null||t.addEventListener("click",()=>{const c=_e(e);if(!c)return;V=Math.min(V+1,4),O=st(O);const{message:a}=ot(V,c),i=document.getElementById("clue-hint-msg");i&&(i.textContent=a,i.className="clue-hint-msg clue-hint-msg--visible"),V>=4&&(R[x]="weak",me(e,"weak"))}),(n=document.getElementById("clue-skip-btn"))==null||n.addEventListener("click",()=>{x<0||(R[x]="weak",me(e,"weak"))}))}function De(e,l){var u;const t=_e(l);if(!t)return;const n=mt(e,t),c=Fe(n),a=re(((u=l.blankSkills)==null?void 0:u[x])||(m!=="__all__"?m:"sentenceLogic")),i=document.getElementById("clue-hunt-feedback");if(i){const d=He(t.clueType),p=J(a),r=t.explanation||"Use the clue to choose the best-fitting word.";i.textContent=`${d} · ${p}. ${c.message} ${r}`,i.className=`clue-hunt-feedback ${c.cssClass}`}const k=document.getElementById("cloze-passage");k&&Pe({container:k,text:l.text,activeBlankIndex:x,selectedWord:e,selectedResult:n,filledAnswers:E.map((d,p)=>{var r;return d!==null&&((r=L.find(s=>s.id===d))==null?void 0:r.word)||""}),onTapWord:d=>De(d,l)}),y.recordClueAttempt({quest:"clozeCastle",result:n,clueType:t.clueType}),n==="strong"||n==="partial"?(R[x]=n,G.playSfx(n==="strong"?"correct":"pop"),setTimeout(()=>me(l,n),800)):(ie++,G.playSfx("wrong"),ie>=2&&(R[x]="weak",setTimeout(()=>me(l,"weak"),1e3)))}function me(e,l){if(!P)return;P=!1,x=-1,ke+=$e(l);const t=document.getElementById("cloze-instruction");t&&(t.textContent="🏰 Now tap a word to fill the blank!");const n=document.getElementById("cloze-bank-wrapper");n&&(n.className="cloze-bank-wrapper");const c=document.getElementById("cloze-check");c&&(c.disabled=!1),K(e)}function ae(e){const l=document.getElementById("cloze-passage");if(l)if(P){const t=E.map(n=>{var c;return n!==null&&((c=L.find(a=>a.id===n))==null?void 0:c.word)||""});Pe({container:l,text:e.text,activeBlankIndex:x,filledAnswers:t,onTapWord:n=>De(n,e)})}else ct({container:l,text:e.text,blankFills:E,bankWords:L,blankClass:"cloze-blank",filledClass:"cloze-blank--filled",emptyBlankAria:t=>`Empty blank ${t+1}`,removeBlankAria:t=>`Remove ${t} from blank`,onRemoveWord:()=>{ae(e),K(e)},onTapEmpty:t=>{t.classList.add("cloze-blank--selected"),setTimeout(()=>t.classList.remove("cloze-blank--selected"),800)}})}function K(e){const l=document.getElementById("cloze-bank");if(l){if(P){l.innerHTML=L.map(t=>`
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${qe(t.word)}">${v(t.word)}</button>
    `).join("");return}at({container:l,bankWords:L,chipClass:"cloze-word-chip",usedClass:"cloze-word-chip--used",onChooseWord:t=>{if(!kt(L,E,t))return;G.playSfx("pop");const n=(e.clues||[]).slice().sort((c,a)=>c.blankIndex-a.blankIndex).find(c=>E[c.blankIndex]===null&&!R.hasOwnProperty(c.blankIndex));n?(x=n.blankIndex,P=!0,V=0,ie=0,console.info("[ClozeCastle] Activating next clue target",{blankIndex:x,passageId:e.id}),ee(e)):(ae(e),K(e))}})}}function _e(e){return e.clues&&e.clues.find(l=>l.blankIndex===x)||null}function zt(e,l){return e.clues&&e.clues.find(t=>t.blankIndex===l)||null}function oe(e,l){const t=m!=="__all__"?re(m):"sentenceLogic";return e.answers.map((n,c)=>{var r,s;const a=zt(e,c),i=l[c]||"",k=We(e,c),u=re(k.primarySkill||t),d=i!==n,p=d?pt({meta:k,chosen:i,correct:n}):null;return{blank:`#${c+1}`,passageTitle:e.title,studentAnswer:i,correctAnswer:n,status:d?"Try again":"Correct",skillLabel:J(u),clueTypeLabel:He(k.clueType||(a==null?void 0:a.clueType)),clue:((r=a==null?void 0:a.acceptableSpans)==null?void 0:r[0])||"—",explanation:((s=e.grammarNotes)==null?void 0:s[c])||k.correctReason||(a==null?void 0:a.explanation)||"Read the words before and after the blank.",nextStepPrompt:bt(u),whyWrong:p==null?void 0:p.whyWrong,whyRight:p==null?void 0:p.whyRight,missedClue:p==null?void 0:p.missedClue,examTip:k.examTip||(p?p.examTip:"")}})}function wt(e){if(E.some(r=>r===null)){H("Fill in all the blanks first! 🏰",!1);return}const l=rt(E,L);[...l];const t=l.every((r,s)=>r===e.answers[s]),n=l.filter((r,s)=>r===e.answers[s]).length,c=U(C),a=m==="__all__"?"mixed":m,i=e.answers.map((r,s)=>{var w;return re(((w=e.blankSkills)==null?void 0:w[s])||(m!=="__all__"?m:"sentenceLogic"))}),k=new Set(i.filter((r,s)=>l[s]!==e.answers[s]));ge.recordAttempt({quest:"clozeCastle",skill:a,correct:t,responseMs:2e3,level:z}),ge.updateSkill("clozeCastle",a,t),fe.recordGrammarCategoryAttempt(z,a,t),ce++,W+=e.answers.length,N+=n;const u=it({storageKey:"ccqWeakSkills",level:z,skills:i,wrongSkillSet:k,current:y.get("ccqWeakSkills")||{}});y.set("ccqWeakSkills",u);let d=y.get("masteryMap")||{};const p=oe(e,l);if(p.forEach((r,s)=>{const w=We(e,s),g=r.status!=="Correct",h=w.primarySkill;F[h]||(F[h]={correct:0,total:0,label:r.skillLabel||J(h),lastWrongExamples:[]});const o=F[h];o.total+=1,g?r.correctAnswer&&o.lastWrongExamples.length<3&&o.lastWrongExamples.push(r.correctAnswer):o.correct+=1,d=dt({mode:"clozeCastle",level:z,category:a,skill:h,clueType:w.clueType,wasWrong:g,example:g?{passageId:e.id,blankIndex:s,chosen:r.studentAnswer,correct:r.correctAnswer,clueType:w.clueType}:null,current:d})}),y.set("masteryMap",d),c.showFinalReviewOnly){Z.push(...p.filter(s=>s.status!=="Correct").map(s=>({passageTitle:s.passageTitle,blank:s.blank,studentAnswer:s.studentAnswer,correctAnswer:s.correctAnswer,explanation:s.explanation,skillLabel:s.skillLabel})));const r=y.get("ccqExamAttempts")||[];r.push({level:z,category:a,passageId:e.id,blankCorrect:n,blankTotal:e.answers.length,submittedAt:Date.now()}),y.set("ccqExamAttempts",r.slice(-150)),I++,D();return}if(t){ne++,je.recordCorrect(2e3,!1),U(C).confettiPerPassage&&Ae(),G.playSfx("correct"),ve.celebrate(!1);const r=Math.round(n/Math.max(1,e.answers.length)*100);if(m!=="__all__"&&e.id){const s=ut({level:z,category:m,passageId:e.id,accuracy:r,ccqCompletedByPassage:y.get("ccqCompletedByPassage")||{},ccqCompleted:y.get("ccqCompleted")||{},ccqCatCompleted:y.get("ccqCatCompleted")||{}});y.set("ccqCompletedByPassage",s.nextByPassage),y.set("ccqCompleted",s.nextCompleted),y.set("ccqCatCompleted",s.nextCatCompleted)}document.querySelectorAll(".cloze-blank--filled").forEach(s=>s.classList.add("cloze-blank--correct")),he({host:b.querySelector(".cloze-game"),title:"Answer Review",rows:oe(e,l),onContinue:()=>{e.clues&&e.clues.length>0?xt(e,()=>setTimeout(()=>{I++,D()},600)):(H("✅ Excellent! All correct!",!0),setTimeout(()=>{I++,D()},1200))}})}else{if(G.playSfx("wrong"),ye++,document.querySelectorAll(".cloze-blank--filled").forEach((r,s)=>{var g;const w=((g=L.find(h=>h.id===E[s]))==null?void 0:g.word)||"";r.classList.toggle("cloze-blank--wrong",w!==e.answers[s])}),ve.encourage(),C==="exam"){he({host:b.querySelector(".cloze-game"),title:"Exam Submission Review",rows:oe(e,l),onContinue:()=>{I++,D()}});return}ye>=2?(H("❌ Let's review your answers first.",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(s=>s.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0),he({host:b.querySelector(".cloze-game"),title:"Review Mistakes",rows:oe(e,l),onContinue:()=>$t(e,l)})},800)):(H("❌ Some blanks are wrong – try again!",!1),setTimeout(()=>{document.querySelectorAll(".cloze-blank--wrong").forEach(s=>s.classList.remove("cloze-blank--wrong"));const r=document.getElementById("cloze-feedback");r&&(r.hidden=!0)},1800))}}function Ct(e,l){var a,i;if(!b)return;const t={...y.get("lessonsSeen")||{}};t[`cloze:${e}`]||(t[`cloze:${e}`]=new Date().toISOString(),y.set("lessonsSeen",t));const n=be(e),c=B[e]||{icon:"🏰",label:e};b.innerHTML=`
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule: ${qe(c.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${c.icon}</div>
      <h2 class="mcq-rule-title">${v(c.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${v(n.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${v(n.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${v(n.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="cloze-rule-start">Got it — start passages →</button>
        <button class="btn btn--ghost" id="cloze-rule-skip">Skip →</button>
      </div>
    </div>`,(a=b.querySelector("#cloze-rule-start"))==null||a.addEventListener("click",l),(i=b.querySelector("#cloze-rule-skip"))==null||i.addEventListener("click",l)}function $t(e,l=[]){var k;if(!b)return;const t=document.getElementById("cloze-teachback-overlay");t&&t.remove();const n=m==="__all__"?null:m,c=n?be(n):{rule:"Read each sentence carefully and look for clues about which word fits best.",example:"Look at the words around the blank — they often tell you what grammar rule to use."},a=document.createElement("div");a.id="cloze-teachback-overlay",a.className="cloze-teachback-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label","Grammar tip"),a.innerHTML=`
    <div class="ctb-panel">
      <div class="ctb-header">
        <span class="ctb-icon" aria-hidden="true">💡</span>
        <h3 class="ctb-title">Here's a tip!</h3>
      </div>
      <div class="ctb-rule">
        <p class="ctb-rule-text">${v(c.rule)}</p>
      </div>
      <div class="ctb-example">
        <span class="ctb-example-label">Example:</span>
        <p class="ctb-example-text">${v(c.example)}</p>
      </div>
      ${c.tip?`<p class="ctb-memory-tip">💡 ${v(c.tip)}</p>`:""}
      <button class="btn btn--primary ctb-btn" id="ctb-try-again">
        Got it — try again!
      </button>
    </div>`,b.appendChild(a);const i=e.answers.map((u,d)=>({n:d+1,correctAnswer:u,studentAnswer:l[d]||"(left blank)"})).filter(u=>u.studentAnswer!==u.correctAnswer);i.length>0&&Oe(a.querySelector(".ctb-panel"),()=>{var u;return Ge({skillLabel:n?((u=B[n])==null?void 0:u.label)||n:"grammar cloze",exercise:`Fill in the blanks: "${e.text}"`,studentAnswer:i.map(d=>`blank ${d.n}: ${d.studentAnswer}`).join(", "),correctAnswer:i.map(d=>`blank ${d.n}: ${d.correctAnswer}`).join(", "),level:z})}),(k=a.querySelector("#ctb-try-again"))==null||k.addEventListener("click",()=>{a.remove(),Re(L,E),E=E.map(()=>null),K(e),ae(e)}),setTimeout(()=>{var u;return(u=a.querySelector("#ctb-try-again"))==null?void 0:u.focus()},100)}function xt(e,l){var a,i;if(!b)return;const t=document.getElementById("cloze-explanation-overlay");t&&t.remove();const n=e.answers.map((k,u)=>{var h,o;const d=(e.clues||[]).find($=>$.blankIndex===u),p=R[u]||"weak",r=Fe(p),s=$e(p),w=((h=d==null?void 0:d.acceptableSpans)==null?void 0:h[0])||"Skipped / no clue",g=((o=e.grammarNotes)==null?void 0:o[u])||(d==null?void 0:d.explanation)||`"${k}" is the best fit for the sentence meaning and grammar.`;return`
      <div class="clue-explanation-item">
        <p><strong>Blank ${u+1}:</strong> ${v(k)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${r.cssClass}">${v(w)}</span> · Score ${Math.round(s*100)}%</p>
        <p class="clue-explanation-text">${v(g)}</p>
      </div>`}).join(""),c=document.createElement("div");c.id="cloze-explanation-overlay",c.className="clue-explanation-overlay",c.innerHTML=`
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${n}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`,(a=b.querySelector(".cloze-game"))==null||a.appendChild(c),(i=document.getElementById("clue-explanation-next"))==null||i.addEventListener("click",()=>{c.remove(),l()})}function H(e,l){const t=document.getElementById("cloze-feedback");t&&(t.textContent=e,t.className=`cloze-feedback cloze-feedback--${l?"success":"error"}`,t.hidden=!1,l&&setTimeout(()=>{t.hidden=!0},1600))}function Et(){var o,$,S,Q,X;if(!b)return;const e=pe[z];Ae(),G.playSfx("levelUp"),ve.celebrate(!0);const l=m!=="__all__"&&B[m]?`${B[m].icon} ${B[m].label}`:"All Topics",t=W>0?Math.round(N/W*100):100,n=t>=90?3:t>=70?2:1,c=U(C),a=Math.max(1,Math.round((Date.now()-(xe||Date.now()))/1e3)),i=et({accuracy:t,skillLabel:l,hintsUsed:O}),k=Me({level:z,weakSkillsMap:y.get("ccqWeakSkills")||{}}),u=k.length?`<p class="cloze-complete-score">Mastery focus: ${k.map(f=>`${J(f.skill)} (${f.wrong}/${f.attempts})`).join(" · ")}</p>`:"",d=C==="exam"&&Z.length?Je(Z):Z.map(f=>`- ${f.passageTitle} ${f.blank}: ${f.studentAnswer||"(blank)"} → ${f.correctAnswer}`),p=Object.keys(R).length,r=p>0?Math.round(ke/p*100):null,s=r!==null?`<p class="cloze-complete-clue">🔍 Clue accuracy: ${r}%</p>`:"",w=te>0?Math.round(de/te*100):null,g=w!==null?`<p class="cloze-complete-clue">🔎 Scan accuracy: ${w}% (${de}/${te})</p>`:"";let h="";if(t<70){let f=m!=="__all__"?m:null;if(!f){const _=Object.entries(F).filter(([,A])=>A.total>0);_.length>0&&(f=_.sort(([,A],[,se])=>A.correct/A.total-se.correct/se.total)[0][0])}if(f){const _=be(f),A=B[f]||{icon:"🏰",label:f};h=`
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${A.icon} Focus on: <strong>${v(A.label)}</strong></p>
          <p class="mcq-focus-tip-rule">${v(_.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${v(_.example)}</em></p>
          <p class="mcq-focus-tip-tip">${v(_.tip)}</p>
        </div>`}}b.innerHTML=`
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${e}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${j[z]} · ${l}</p>
      <div class="cloze-stars">${"⭐".repeat(n)}${"☆".repeat(3-n)}</div>
      <p class="cloze-complete-score">Blanks: ${N} / ${W} correct · ${t}%</p>
      <p class="cloze-complete-score">Mode: ${c.label} · Hints used: ${O} · Time: ${a}s</p>
      ${u}
      ${s}
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
    </div>`,(o=document.getElementById("cloze-back-cat"))==null||o.addEventListener("click",()=>ue(z)),($=document.getElementById("cloze-replay"))==null||$.addEventListener("click",()=>{m==="__all__"?Ne(z):Ce(z,m)}),(S=document.getElementById("cloze-copy-summary"))==null||S.addEventListener("click",async()=>{var _;const f=Ke({modeLabel:c.label,title:`${j[z]} · ${l}`,category:l,level:j[z],scoreLine:Te({mode:C,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ce}),accuracy:t,timeTaken:`${a}s`,hintsUsed:O,clueScore:r??0,wrongLines:d,nextStep:i});try{await((_=navigator.clipboard)==null?void 0:_.writeText(f)),H("Summary copied!",!0)}catch{H("Unable to copy summary on this device.",!1)}}),(Q=document.getElementById("cloze-copy-parent-report"))==null||Q.addEventListener("click",async()=>{var Se,Le;const{strongest:f,weakest:_}=Qe(F),A=Te({mode:C,blankCorrect:N,blankTotal:W,passageCorrect:ne,passageTotal:ce}),se=Xe({questLabel:"Cloze Castle",modeLabel:c.label,scoreLine:A,accuracy:t,strongest:f,weakest:_,weakExamples:_?((Se=F[_.skill])==null?void 0:Se.lastWrongExamples)||[]:[],recommendation:i});try{await((Le=navigator.clipboard)==null?void 0:Le.writeText(se)),H("Parent report copied!",!0)}catch{H("Unable to copy parent report on this device.",!1)}}),(X=document.getElementById("cloze-back-levels"))==null||X.addEventListener("click",()=>Ee()),q&&(document.removeEventListener("keydown",q),q=null),setTimeout(()=>{var f;return(f=document.getElementById("cloze-back-cat"))==null?void 0:f.focus()},200)}export{we as cleanupClozeCastle,Bt as initClozeCastle,qt as showClozeBrowser};
