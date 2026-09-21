import{S as U}from"./synthesisItems-BI7gkXfp.js";import{s as L,z as N,ap as V,ar as Z,au as J,a0 as ee,a7 as te,ac as se,ad as ne,av as ae}from"./index-BMk_8UTo.js";import{g as re}from"./shortAnswerGrader-zj_e83SX.js";import"./gsap-C8pce-KX.js";import"./stories-BYImWThp.js";const oe={P4:"Primary 4",P5:"Primary 5",P6:"Primary 6"},ie=8,O=2,k={connectorContrast:{icon:"⚡",rule:"Contrast connectors join two opposing ideas",structure:"Although/Even though + [clause], [main clause].",tip:'Never use "but" in the same sentence as "although" — they do the same job.'},connectorResult:{icon:"💥",rule:'"So…that" and "such…that" express cause and result',structure:"so + [adjective] + that  /  such + a/an + [adjective + noun] + that.",tip:'Use "so" before an adjective alone; use "such" when a noun follows.'},connectorAddition:{icon:"➕",rule:'"Not only…but also" links two facts and emphasises both',structure:"[Subject] not only [verb phrase 1] but also [verb phrase 2].",tip:'When "not only" starts the sentence, invert subject and auxiliary: "Not only did he…"'},connectorTime:{icon:"⏰",rule:'"As soon as" and "no sooner…than" show immediate sequence',structure:"As soon as [past simple], [past simple].  /  No sooner had [subject] [past participle] than [past simple].",tip:'"No sooner had…" uses past perfect. No comma is needed when "as soon as" falls in the middle.'},connectorCondition:{icon:"🔐",rule:'"Unless" means "if not"; "provided that" means "on the condition that"',structure:"[Main clause] unless [condition].  /  [Main clause] provided that [condition].",tip:`Because "unless" already carries the "not", adding another one usually reverses your meaning by accident: "unless you do not hurry" says the opposite of what you meant. Say the condition positively — "unless you hurry". (Some sentences genuinely need both, as in "unless you don't mind waiting", so check the meaning rather than counting negatives.)`},activeToPassive:{icon:"🔄",rule:"Active → Passive shifts focus from the doer to the receiver",structure:"[Object] + was/were + past participle + by + [agent].",tip:'Choose was/were based on the new subject. Drop "by [agent]" if obvious or unimportant.'},passiveToActive:{icon:"🔁",rule:"Passive → Active: the agent becomes the subject, verb returns to active form",structure:"[Agent] + [active verb in correct tense] + [original object].",tip:'Remove "was/were…by" and reconstruct the verb in the matching tense.'},reportedSpeechStatement:{icon:"💬",rule:"Reported statements shift tense back and change pronouns and time words",structure:"[He/She] said (that) + [back-shifted verb clause].",tip:'"Yesterday" → "the day before"; "ago" → "before/earlier"; present → past; past → past perfect.'},reportedSpeechQuestion:{icon:"❓",rule:"Reported questions use statement word order — no inversion, no question mark",structure:"[He/She] asked [who/what/whether/if] + [subject] + [verb].",tip:'No auxiliary "do/does/did" after the question word. Use "if/whether" for yes/no questions.'},reportedSpeechCommand:{icon:"📢",rule:'Reported commands use "told/asked + object + to + base verb"',structure:"[He/She] told/asked [person] + (not) to + [base verb].",tip:'For negative commands: "told her not to…". Use "asked" for polite requests.'},relativeClause:{icon:"🔗",rule:"Relative clauses add information about a noun using who/which/whose/whom/that",structure:"[Main noun] + who/which/whose/that + [relative clause].",tip:'Non-defining clauses (extra info) use commas and cannot use "that". Defining clauses can use "that".'},comparison:{icon:"⚖️",rule:"Comparison: as…as (equal), not as…as (unequal), more/less…than (different degrees)",structure:"[Subject] is as [adjective] as [comparison].  /  [Subject] is more [adj] than [comparison].",tip:'"The more…the more" shows proportional increase. Both halves use the comparative form.'},advancedConstruction:{icon:"🏆",rule:'A fronted negative inverts the verb; the "It was not until…that" cleft does not',structure:"Fronted: [Never/Seldom/Not until …] + [auxiliary] + [subject] + [verb].  /  Cleft: It was not until [time] that + [subject] + [verb].",tip:'Compare: "Not until noon did he arrive." (fronted — inverted) with "It was not until noon that he arrived." (cleft — normal order). Same meaning, and only the fronted one inverts.'},causativeHave:{icon:"🛠️",rule:'"Have something done" shows that someone arranged for another person to perform an action',structure:"[Subject] + have/had + [object] + past participle.",tip:"The subject does NOT do the action — they arranged for someone else to do it."},cleftSentence:{icon:"🎯",rule:"Cleft sentences (It was/is…who/that) split a sentence to emphasise one element",structure:"It was/is + [emphasised element] + who/that + [rest of sentence].",tip:'Use "who" for people, "that" for things or ideas. Match "was/is" to the original tense.'},conditionalType2:{icon:"🌀",rule:"Type 2 conditional: imaginary or unlikely present/future situation",structure:"If + [past simple], [would/could/might] + [base verb].",tip:'Use "were" instead of "was" after "if" in formal writing: "If I were you…"'},conditionalType3:{icon:"⏮️",rule:"Type 3 conditional: imaginary past — something that did NOT happen",structure:"If + [past perfect], [would/could/might] + have + [past participle].",tip:'"Would have" is most common; "could have" = possibility; "might have" = weaker probability.'},despiteInSpiteOf:{icon:"🧱",rule:'"Despite" and "in spite of" show contrast — followed by a noun or -ing form, NOT a full clause',structure:"Despite/In spite of + [noun phrase or -ing form], [main clause].",tip:'Never write "despite of…". When a full clause follows the contrast, use "although/even though" instead.'}};let d=null,C=null,E=null,A=[],m=0,y=0,b=null;function ce(){return{correct:0,total:0,firstTry:0,bySkill:{}}}function Ae(e,t){d=e,C=t}function le(){d&&de()}function ue(){d&&(d.innerHTML=""),d=null,C=null}function de(){var s;const e=["P4","P5","P6"],t=((s=L.get("questMastery"))==null?void 0:s.synthesisQuest)||{};d.innerHTML=`
    <div class="sq-browser">
      <p class="sq-browser-intro">Choose a level to begin an 8-item session. Items are selected to target your weakest patterns first.</p>
      <div class="sq-level-grid">
        ${e.map(n=>{const a=U.filter(i=>i.level===n),o=[...new Set(a.map(i=>i.skillKey))],r=o.filter(i=>(t[i]||0)>=.7).length;return`
          <button class="sq-level-btn" data-level="${n}">
            <span class="sq-level-badge">${n}</span>
            <span class="sq-level-name">${oe[n]}</span>
            <span class="sq-level-meta">${a.length} items · ${o.length} patterns</span>
            ${r>0?`<span class="sq-level-progress">${r}/${o.length} patterns ≥70%</span>`:""}
          </button>`}).join("")}
      </div>
      <p class="sq-browser-tip">💡 Weak patterns are shown first. After 2 wrong attempts you see the rule and model answer.</p>
    </div>`,d.querySelectorAll(".sq-level-btn").forEach(n=>{n.addEventListener("click",()=>G(n.dataset.level))})}function G(e){E=e,b=ce(),A=he(e),m=0,x()}function he(e){const s=U.filter(n=>n.level===e).map(n=>{const a=N.getSkillScore("synthesisQuest",n.skillKey)??.5,o=(Math.random()-.5)*.12;return{item:n,score:1-a+o}});return s.sort((n,a)=>a.score-n.score),s.slice(0,ie).map(n=>n.item)}function x(){var n,a,o;if(m>=A.length){ke();return}const e=A[m];y=0;const t=Math.round(m/A.length*100);d.innerHTML=`
    <div class="sq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ Synthesis — ${E}</span>
        <span class="sfq-progress">${m+1} / ${A.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${t}%"></div></div>

      <div class="sq-pattern-chip">${c(e.pattern||e.skill)}</div>

      <div class="sq-task-card">
        <p class="sq-task-label">Rewrite without changing the meaning. <small class="sq-task-note">(PSLE format — fill in the blank only)</small></p>
        <p class="sq-original">${c(e.original)}</p>
        ${e.stem?`
          <div class="sq-psle-prompt" aria-label="Sentence to complete">
            <span class="sq-psle-prefix">${c(e.stem)}</span>
            <span class="sq-psle-blank" aria-hidden="true">_______________</span>
          </div>`:""}
      </div>

      <div class="sq-input-wrap">
        <label for="sq-answer-input" class="sq-input-label">
          ${e.stem?"Type what fills the blank":"Type your rewritten sentence"}
        </label>
        <textarea
          id="sq-answer-input"
          class="sq-textarea"
          rows="2"
          placeholder="${e.stem?"continue the sentence…":"rewrite the sentence…"}"
          autocomplete="off"
          spellcheck="false"
          aria-label="Your answer"
        ></textarea>
        <div class="sq-input-actions">
          <button class="btn btn--primary" id="sq-check">Check ✓</button>
          <button class="btn btn--ghost btn--sm" id="sq-hint-btn">💡 Hint</button>
        </div>
      </div>

      <div id="sq-feedback" class="sfq-feedback" role="status" aria-live="polite" hidden></div>

      <div class="sfq-actions" style="margin-top:var(--space-3)">
        <button class="btn btn--ghost btn--sm" id="sq-quit">Menu</button>
      </div>
    </div>`;const s=document.getElementById("sq-answer-input");(n=document.getElementById("sq-check"))==null||n.addEventListener("click",()=>Q(e)),s==null||s.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),Q(e))}),(a=document.getElementById("sq-hint-btn"))==null||a.addEventListener("click",()=>qe(e)),(o=document.getElementById("sq-quit"))==null||o.addEventListener("click",()=>{ue(),C==null||C()}),s==null||s.focus()}function p(e){return e.toLowerCase().replace(/['']/g,"'").replace(/[""]/g,'"').replace(/\s+/g," ").replace(/[.,!?;:]+$/g,"").trim()}function pe(e,t){if(!e)return null;const s=p(e);if(!p(t).startsWith(s))return null;const a=e.trim().length;return t.trim().slice(a).replace(/^[\s,]+/,"").trim()}function D(e){return e.allowAnyStructure?{requiredStart:null,requiredConnector:null}:{requiredStart:e.requiredStart??e.stem??null,requiredConnector:e.requiredConnector??null}}function fe(e,t){const{requiredStart:s,requiredConnector:n}=D(t),a=p(e||"");if(!a)return{ok:!0,violation:null,message:null};if(n&&!a.includes(p(n)))return{ok:!1,violation:"connector",message:`This one asks you to use "${n}".`};if(s){const o=p(s);if(a.startsWith(o))return{ok:!0,violation:null,message:null};if(W.some(i=>o===i||o.startsWith(`${i} `))){if(a.includes(` ${o} `))return{ok:!1,violation:"connector-position",message:`You used "${s}" correctly — but this task asks you to begin the sentence with it. Move it to the front and rewrite.`};if(W.some(h=>a.startsWith(`${h} `)&&!o.startsWith(h)))return{ok:!1,violation:"start",message:`Good sentence — but this task asks you to begin with "${s}". Try again starting there.`}}}return{ok:!0,violation:null,message:null}}const W=Object.freeze(["although","though","even though","even if","despite","in spite of","because","since","as soon as","unless","until","whereas","while","if","not only","no sooner","hardly","provided that","so that","in order to","after","before","when","whenever"]);function me(e){const{requiredStart:t}=D(e);if(!t)return[];const s=p(t);return(e.alternates||[]).filter(n=>!p(n).startsWith(s))}function ve(e){const t=new Set(me(e).map(r=>p(r))),s=[e.answer,...e.alternates||[]].filter(Boolean).filter(r=>!t.has(p(r))),n=[];for(const r of s){const i=pe(e.stem,r);i&&n.push(i)}const a=new Set,o=[];for(const r of[...n,...s]){const i=p(r);!i||a.has(i)||(a.add(i),o.push(r))}return o}function be(e,t){const s=ve(t);return re(e,{expected:s[0]||"",accepts:s.slice(1),requiredGroups:Array.isArray(t.requiredGroups)?t.requiredGroups:null})}async function Q(e){var I,w,$;const t=document.getElementById("sq-answer-input"),s=((I=t==null?void 0:t.value)==null?void 0:I.trim())||"";if(!s){v("Type your rewritten sentence first.","neutral");return}y++;const n=fe(s,e);if(!n.ok){if(_(e,!1),y>=O){F(e,()=>{m++,x()},s);return}v(`◐ ${n.message}`,"hint"),t==null||t.focus(),t==null||t.select();return}const a=be(s,e),o=a.fraction>=1,r=a.fraction>0&&a.fraction<1;if(!o&&Z()){v("✨ Checking with AI…","hint");const l=document.getElementById("sq-check");l&&(l.disabled=!0);const g=e.alternates||[],u=await J(e.original,e.stem||"",e.answer,g,s,e.skill||e.skillKey);if(l&&(l.disabled=!1),(u==null?void 0:u.verdict)==="CORRECT"){_(e,!0,s);return}if((u==null?void 0:u.verdict)==="PARTIAL"){_(e,!1);const f=k[e.skillKey],q=f!=null&&f.structure?`Structure: ${f.structure}`:`Use the "${e.pattern||e.skill}" pattern.`,j=u.feedback?` ${u.feedback}`:"";v(`◐ Almost!${j} ${q}`,"hint"),t&&(t.value=""),t==null||t.focus();return}}if(o){_(e,!0,s);return}if(_(e,!1),y>=O){F(e,()=>{m++,x()},s);return}const i=k[e.skillKey],h=i!=null&&i.structure?`Structure: ${i.structure}`:`Use the "${e.pattern||e.skill}" pattern.`;if(r){const l=Math.round(a.fraction*100),g=((w=a.trace)==null?void 0:w.hits)||[],u=(($=a.trace)==null?void 0:$.misses)||[],f=g.length?` ✓ ${g.join(", ")}`:"",q=u.length?` ✗ still need: ${u.join(", ")}`:"";v(`◐ Partial (${l}% structure). ${h}${f}${q}`,"hint")}else{const l=Y(e,s);v(`Not yet. ${l.misconception.cue} ${h}`,"error")}t==null||t.focus(),t==null||t.select()}function ge(e){const t=String(e.stem||"").trim();return t?t.split(/\s+/).filter(Boolean):[]}function Y(e,t){return ae({given:t,model:e.answer,stem:e.original||"",requiredWords:ge(e),domain:"writing"})}function _(e,t,s){if(ee.playSfx(t?"correct":"wrong"),y===1){const n=b.bySkill[e.skillKey]||{correct:0,total:0,label:e.skill};n.total++,b.total++,N.recordAttempt({quest:"synthesisQuest",skill:e.skillKey,correct:t,level:E}),t&&(n.correct++,b.correct++,b.firstTry++),b.bySkill[e.skillKey]=n,N.updateSkill("synthesisQuest",e.skillKey,t)}t&&s!==void 0&&ye(e,s)}function qe(e){const t=k[e.skillKey];v(`💡 ${(t==null?void 0:t.tip)||`Begin your sentence with: "${e.stem||e.pattern}"`}`,"hint")}function v(e,t){const s=document.getElementById("sq-feedback");s&&(s.hidden=!1,s.className=`sfq-feedback${t==="error"?" sfq-feedback--error":t==="hint"?" sfq-feedback--hint":""}`,s.textContent=e)}function ye(e,t){var r;const s=d.querySelector(".sq-game");if(!s)return;const n=y===1?"⭐⭐":"⭐",a=document.createElement("div");a.className="sq-success-overlay";const o=e.stem?`${e.stem} ${t.trim()}`:t.trim();a.innerHTML=`
    <div class="sq-success-card">
      <div class="sq-success-icon">✅</div>
      <h4 class="sq-success-heading">${n} Correct!</h4>
      ${e.stem?`<p class="sq-success-stitched"><strong>Full sentence:</strong> <em>${c(o)}</em></p>`:`<p class="sq-success-your-answer"><em>${c(t)}</em></p>`}
      <p class="sq-success-explain">${c(e.explain)}</p>
      ${(r=e.alternates)!=null&&r.length?`<p class="sq-success-alts"><strong>Also accepted:</strong> ${e.alternates.map(i=>`<em>${c(i)}</em>`).join("; ")}</p>`:""}
      <button class="btn btn--primary sq-success-next">Next →</button>
    </div>`,s.appendChild(a),a.querySelector(".sq-success-next").addEventListener("click",()=>{a.remove(),m++,x()})}function F(e,t,s=""){var i;const n=k[e.skillKey]||{icon:"📘",rule:e.skill,structure:"",tip:""},a=d.querySelector(".sq-game");if(!a){t();return}const o=s?Y(e,s):null;o&&te(o.id,{skill:e.skillKey,mode:"synthesisQuest"});const r=document.createElement("div");r.className="eq-teachback-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-label","Grammar pattern explanation"),r.innerHTML=`
    <div class="eq-teachback-card">
      <div class="eq-teachback-icon">${n.icon}</div>
      <h4 class="eq-teachback-heading">Let's learn this pattern</h4>
      <p class="eq-teachback-rule">${c(n.rule)}</p>
      ${n.structure?`<div class="eq-teachback-example"><strong>Structure:</strong> ${c(n.structure)}</div>`:""}
      ${n.tip?`<p class="eq-teachback-tip">💡 <strong>Remember:</strong> ${c(n.tip)}</p>`:""}
      <div class="eq-teachback-answer">✅ Model answer: <strong>${c(e.answer)}</strong></div>
      ${(i=e.alternates)!=null&&i.length?`<p class="eq-teachback-explanation">Also accepted: ${e.alternates.map(h=>`<em>${c(h)}</em>`).join("; ")}</p>`:""}
      <p class="eq-teachback-explanation">${c(e.explain)}</p>
      ${o?`<p class="eq-teachback-noticed">👀 Your sentence — that is ${c(o.misconception.childName)}.</p>
      <p class="eq-teachback-nexttime">🧭 <strong>Next time:</strong> ${c(o.misconception.selfCheck)}</p>`:""}
      <button class="btn btn--primary eq-teachback-continue">Got it — Continue</button>
    </div>`,a.appendChild(r),s&&se(r.querySelector(".eq-teachback-card"),()=>ne({skillLabel:e.skill||e.skillKey,exercise:`Rewrite: "${e.original}"${e.stem?` starting with "${e.stem}"`:""}`,studentAnswer:s,correctAnswer:e.answer,level:E})),r.querySelector(".eq-teachback-continue").addEventListener("click",()=>{r.remove(),t()})}function ke(){var u,f,q,j,B;const{correct:e,total:t,firstTry:s,bySkill:n}=b,a=t>0?e/t:0,o=t>0?s/t:0,r=a>=.9&&o>=.7?3:a>=.7?2:1,i=Math.round(30+e*8+(r-1)*10),h=(L.get("xp")||0)+i,I=V(h);L.patch({xp:h,level:I.level});const w=Object.entries(n).sort((S,T)=>S[1].correct/Math.max(S[1].total,1)-T[1].correct/Math.max(T[1].total,1)),$=w.map(([S,T])=>{var R,P,H,K;const M=Math.round(T.correct/Math.max(T.total,1)*100),z=((K=(H=(P=(R=k[S])==null?void 0:R.rule)==null?void 0:P.split(":")[0])==null?void 0:H.split("—")[0])==null?void 0:K.trim())||S,X=M>=70?"var(--color-success)":M>=40?"var(--color-primary)":"var(--color-error)";return`
      <div class="sq-skill-row">
        <span class="sq-skill-name">${c(z)}</span>
        <div class="sq-skill-track"><div class="sq-skill-bar" style="width:${M}%;background:${X}"></div></div>
        <span class="sq-skill-pct">${M}%</span>
      </div>`}).join(""),l=w[0],g=l&&l[1].correct/Math.max(l[1].total,1)<.7?`Review the "${((q=(f=(u=k[l[0]])==null?void 0:u.rule)==null?void 0:f.split(":")[0])==null?void 0:q.trim())||l[0]}" pattern.`:"Great work — try the next level!";d.innerHTML=`
    <div class="sq-game">
      <div class="sq-summary">
        <h3 class="sq-summary-title">🎉 Session Complete ${"⭐".repeat(r)}</h3>
        <div class="sq-summary-stats">
          <div class="sq-stat-chip"><span class="sq-stat-val">${e}/${t}</span><span class="sq-stat-lbl">Correct</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(a*100).toFixed(0)}%</span><span class="sq-stat-lbl">Accuracy</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(o*100).toFixed(0)}%</span><span class="sq-stat-lbl">First try</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">+${i}</span><span class="sq-stat-lbl">XP</span></div>
        </div>
        ${$?`<h4 class="sq-skills-heading">Skills breakdown</h4><div class="sq-skills-list">${$}</div>`:""}
        <p class="sq-focus-tip">📌 Focus next: ${c(g)}</p>
        <div class="sfq-actions">
          <button class="btn btn--primary" id="sq-retry">Try another set →</button>
          <button class="btn btn--ghost btn--sm" id="sq-home">Back to levels</button>
        </div>
      </div>
    </div>`,(j=document.getElementById("sq-retry"))==null||j.addEventListener("click",()=>G(E)),(B=document.getElementById("sq-home"))==null||B.addEventListener("click",()=>le())}function c(e){return String(e??"").replace(/[<>&"']/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"})[t])}export{k as SQ_TEACHBACK,ve as buildAcceptableAnswers,fe as checkTaskConstraints,ue as cleanupSynthesisQuest,D as getTaskConstraints,Ae as initSynthesisQuest,me as offTaskAlternates,le as showSynthesisBrowser};
