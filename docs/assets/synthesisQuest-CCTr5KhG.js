import{S as F}from"./synthesisItems-BI7gkXfp.js";import{s as I,u as C,ai as D,ak as Y,an as X,X as V,a0 as Z,a6 as z,a7 as J,ao as ee}from"./index-D7F_oDrj.js";import{g as se}from"./shortAnswerGrader-BbVaplnA.js";import"./gsap-C8pce-KX.js";const te={P4:"Primary 4",P5:"Primary 5",P6:"Primary 6"},ne=8,ae=2,q={connectorContrast:{icon:"⚡",rule:"Contrast connectors join two opposing ideas",structure:"Although/Even though + [clause], [main clause].",tip:'Never use "but" in the same sentence as "although" — they do the same job.'},connectorResult:{icon:"💥",rule:'"So…that" and "such…that" express cause and result',structure:"so + [adjective] + that  /  such + a/an + [adjective + noun] + that.",tip:'Use "so" before an adjective alone; use "such" when a noun follows.'},connectorAddition:{icon:"➕",rule:'"Not only…but also" links two facts and emphasises both',structure:"[Subject] not only [verb phrase 1] but also [verb phrase 2].",tip:'When "not only" starts the sentence, invert subject and auxiliary: "Not only did he…"'},connectorTime:{icon:"⏰",rule:'"As soon as" and "no sooner…than" show immediate sequence',structure:"As soon as [past simple], [past simple].  /  No sooner had [subject] [past participle] than [past simple].",tip:'"No sooner had…" uses past perfect. No comma is needed when "as soon as" falls in the middle.'},connectorCondition:{icon:"🔐",rule:'"Unless" means "if not"; "provided that" means "on the condition that"',structure:"[Main clause] unless [condition].  /  [Main clause] provided that [condition].",tip:'Never pair "unless" with "not" in the same clause — "unless" already contains the negative.'},activeToPassive:{icon:"🔄",rule:"Active → Passive shifts focus from the doer to the receiver",structure:"[Object] + was/were + past participle + by + [agent].",tip:'Choose was/were based on the new subject. Drop "by [agent]" if obvious or unimportant.'},passiveToActive:{icon:"🔁",rule:"Passive → Active: the agent becomes the subject, verb returns to active form",structure:"[Agent] + [active verb in correct tense] + [original object].",tip:'Remove "was/were…by" and reconstruct the verb in the matching tense.'},reportedSpeechStatement:{icon:"💬",rule:"Reported statements shift tense back and change pronouns and time words",structure:"[He/She] said (that) + [back-shifted verb clause].",tip:'"Yesterday" → "the day before"; "ago" → "before/earlier"; present → past; past → past perfect.'},reportedSpeechQuestion:{icon:"❓",rule:"Reported questions use statement word order — no inversion, no question mark",structure:"[He/She] asked [who/what/whether/if] + [subject] + [verb].",tip:'No auxiliary "do/does/did" after the question word. Use "if/whether" for yes/no questions.'},reportedSpeechCommand:{icon:"📢",rule:'Reported commands use "told/asked + object + to + base verb"',structure:"[He/She] told/asked [person] + (not) to + [base verb].",tip:'For negative commands: "told her not to…". Use "asked" for polite requests.'},relativeClause:{icon:"🔗",rule:"Relative clauses add information about a noun using who/which/whose/whom/that",structure:"[Main noun] + who/which/whose/that + [relative clause].",tip:'Non-defining clauses (extra info) use commas and cannot use "that". Defining clauses can use "that".'},comparison:{icon:"⚖️",rule:"Comparison: as…as (equal), not as…as (unequal), more/less…than (different degrees)",structure:"[Subject] is as [adjective] as [comparison].  /  [Subject] is more [adj] than [comparison].",tip:'"The more…the more" shows proportional increase. Both halves use the comparative form.'},advancedConstruction:{icon:"🏆",rule:"Fronted negative/emphatic elements require subject-verb inversion",structure:"[Never/Seldom/Not until] + [auxiliary] + [subject] + [main verb].",tip:'"It was not until…that" and fronted negatives (never/seldom/rarely) all trigger inversion.'},causativeHave:{icon:"🛠️",rule:'"Have something done" shows that someone arranged for another person to perform an action',structure:"[Subject] + have/had + [object] + past participle.",tip:"The subject does NOT do the action — they arranged for someone else to do it."},cleftSentence:{icon:"🎯",rule:"Cleft sentences (It was/is…who/that) split a sentence to emphasise one element",structure:"It was/is + [emphasised element] + who/that + [rest of sentence].",tip:'Use "who" for people, "that" for things or ideas. Match "was/is" to the original tense.'},conditionalType2:{icon:"🌀",rule:"Type 2 conditional: imaginary or unlikely present/future situation",structure:"If + [past simple], [would/could/might] + [base verb].",tip:'Use "were" instead of "was" after "if" in formal writing: "If I were you…"'},conditionalType3:{icon:"⏮️",rule:"Type 3 conditional: imaginary past — something that did NOT happen",structure:"If + [past perfect], [would/could/might] + have + [past participle].",tip:'"Would have" is most common; "could have" = possibility; "might have" = weaker probability.'},despiteInSpiteOf:{icon:"🧱",rule:'"Despite" and "in spite of" show contrast — followed by a noun or -ing form, NOT a full clause',structure:"Despite/In spite of + [noun phrase or -ing form], [main clause].",tip:'Never write "despite of…". When a full clause follows the contrast, use "although/even though" instead.'}};let d=null,S=null,A=null,$=[],v=0,_=0,f=null;function re(){return{correct:0,total:0,firstTry:0,bySkill:{}}}function we(e,s){d=e,S=s}function oe(){d&&ce()}function ie(){d&&(d.innerHTML=""),d=null,S=null}function ce(){var t;const e=["P4","P5","P6"],s=((t=I.get("questMastery"))==null?void 0:t.synthesisQuest)||{};d.innerHTML=`
    <div class="sq-browser">
      <p class="sq-browser-intro">Choose a level to begin an 8-item session. Items are selected to target your weakest patterns first.</p>
      <div class="sq-level-grid">
        ${e.map(n=>{const r=F.filter(c=>c.level===n),o=[...new Set(r.map(c=>c.skillKey))],a=o.filter(c=>(s[c]||0)>=.7).length;return`
          <button class="sq-level-btn" data-level="${n}">
            <span class="sq-level-badge">${n}</span>
            <span class="sq-level-name">${te[n]}</span>
            <span class="sq-level-meta">${r.length} items · ${o.length} patterns</span>
            ${a>0?`<span class="sq-level-progress">${a}/${o.length} patterns ≥70%</span>`:""}
          </button>`}).join("")}
      </div>
      <p class="sq-browser-tip">💡 Weak patterns are shown first. After 2 wrong attempts you see the rule and model answer.</p>
    </div>`,d.querySelectorAll(".sq-level-btn").forEach(n=>{n.addEventListener("click",()=>O(n.dataset.level))})}function O(e){A=e,f=re(),$=le(e),v=0,M()}function le(e){const t=F.filter(n=>n.level===e).map(n=>{const r=C.getSkillScore("synthesisQuest",n.skillKey)??.5,o=(Math.random()-.5)*.12;return{item:n,score:1-r+o}});return t.sort((n,r)=>r.score-n.score),t.slice(0,ne).map(n=>n.item)}function M(){var n,r,o;if(v>=$.length){be();return}const e=$[v];_=0;const s=Math.round(v/$.length*100);d.innerHTML=`
    <div class="sq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ Synthesis — ${A}</span>
        <span class="sfq-progress">${v+1} / ${$.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${s}%"></div></div>

      <div class="sq-pattern-chip">${i(e.pattern||e.skill)}</div>

      <div class="sq-task-card">
        <p class="sq-task-label">Rewrite without changing the meaning. <small class="sq-task-note">(PSLE format — fill in the blank only)</small></p>
        <p class="sq-original">${i(e.original)}</p>
        ${e.stem?`
          <div class="sq-psle-prompt" aria-label="Sentence to complete">
            <span class="sq-psle-prefix">${i(e.stem)}</span>
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
    </div>`;const t=document.getElementById("sq-answer-input");(n=document.getElementById("sq-check"))==null||n.addEventListener("click",()=>Q(e)),t==null||t.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),Q(e))}),(r=document.getElementById("sq-hint-btn"))==null||r.addEventListener("click",()=>me(e)),(o=document.getElementById("sq-quit"))==null||o.addEventListener("click",()=>{ie(),S==null||S()}),t==null||t.focus()}function L(e){return e.toLowerCase().replace(/['']/g,"'").replace(/[""]/g,'"').replace(/\s+/g," ").replace(/[.,!?;:]+$/g,"").trim()}function ue(e,s){if(!e)return null;const t=L(e);if(!L(s).startsWith(t))return null;const r=e.trim().length;return s.trim().slice(r).replace(/^[\s,]+/,"").trim()}function de(e){const s=[e.answer,...e.alternates||[]].filter(Boolean),t=[];for(const o of s){const a=ue(e.stem,o);a&&t.push(a)}const n=new Set,r=[];for(const o of[...t,...s]){const a=L(o);!a||n.has(a)||(n.add(a),r.push(o))}return r}function pe(e,s){const t=de(s);return se(e,{expected:t[0]||"",accepts:t.slice(1),requiredGroups:Array.isArray(s.requiredGroups)?s.requiredGroups:null})}async function Q(e){var m,T,y;const s=document.getElementById("sq-answer-input"),t=((m=s==null?void 0:s.value)==null?void 0:m.trim())||"";if(!t){g("Type your rewritten sentence first.","neutral");return}_++;const n=pe(t,e),r=n.fraction>=1,o=n.fraction>0&&n.fraction<1;if(!r&&Y()){g("✨ Checking with AI…","hint");const u=document.getElementById("sq-check");u&&(u.disabled=!0);const p=e.alternates||[],l=await X(e.original,e.stem||"",e.answer,p,t,e.skill||e.skillKey);if(u&&(u.disabled=!1),(l==null?void 0:l.verdict)==="CORRECT"){j(e,!0,t);return}if((l==null?void 0:l.verdict)==="PARTIAL"){j(e,!1);const h=q[e.skillKey],b=h!=null&&h.structure?`Structure: ${h.structure}`:`Use the "${e.pattern||e.skill}" pattern.`,E=l.feedback?` ${l.feedback}`:"";g(`◐ Almost!${E} ${b}`,"hint"),s&&(s.value=""),s==null||s.focus();return}}if(r){j(e,!0,t);return}if(j(e,!1),_>=ae){ve(e,()=>{v++,M()},t);return}const a=q[e.skillKey],c=a!=null&&a.structure?`Structure: ${a.structure}`:`Use the "${e.pattern||e.skill}" pattern.`;if(o){const u=Math.round(n.fraction*100),p=((T=n.trace)==null?void 0:T.hits)||[],l=((y=n.trace)==null?void 0:y.misses)||[],h=p.length?` ✓ ${p.join(", ")}`:"",b=l.length?` ✗ still need: ${l.join(", ")}`:"";g(`◐ Partial (${u}% structure). ${c}${h}${b}`,"hint")}else{const u=U(e,t);g(`Not yet. ${u.misconception.cue} ${c}`,"error")}s==null||s.focus(),s==null||s.select()}function he(e){const s=String(e.stem||"").trim();return s?s.split(/\s+/).filter(Boolean):[]}function U(e,s){return ee({given:s,model:e.answer,stem:e.original||"",requiredWords:he(e),domain:"writing"})}function j(e,s,t){if(V.playSfx(s?"correct":"wrong"),_===1){const n=f.bySkill[e.skillKey]||{correct:0,total:0,label:e.skill};n.total++,f.total++,C.recordAttempt({quest:"synthesisQuest",skill:e.skillKey,correct:s,level:A}),s&&(n.correct++,f.correct++,f.firstTry++),f.bySkill[e.skillKey]=n,C.updateSkill("synthesisQuest",e.skillKey,s)}s&&t!==void 0&&fe(e,t)}function me(e){const s=q[e.skillKey];g(`💡 ${(s==null?void 0:s.tip)||`Begin your sentence with: "${e.stem||e.pattern}"`}`,"hint")}function g(e,s){const t=document.getElementById("sq-feedback");t&&(t.hidden=!1,t.className=`sfq-feedback${s==="error"?" sfq-feedback--error":s==="hint"?" sfq-feedback--hint":""}`,t.textContent=e)}function fe(e,s){var a;const t=d.querySelector(".sq-game");if(!t)return;const n=_===1?"⭐⭐":"⭐",r=document.createElement("div");r.className="sq-success-overlay";const o=e.stem?`${e.stem} ${s.trim()}`:s.trim();r.innerHTML=`
    <div class="sq-success-card">
      <div class="sq-success-icon">✅</div>
      <h4 class="sq-success-heading">${n} Correct!</h4>
      ${e.stem?`<p class="sq-success-stitched"><strong>Full sentence:</strong> <em>${i(o)}</em></p>`:`<p class="sq-success-your-answer"><em>${i(s)}</em></p>`}
      <p class="sq-success-explain">${i(e.explain)}</p>
      ${(a=e.alternates)!=null&&a.length?`<p class="sq-success-alts"><strong>Also accepted:</strong> ${e.alternates.map(c=>`<em>${i(c)}</em>`).join("; ")}</p>`:""}
      <button class="btn btn--primary sq-success-next">Next →</button>
    </div>`,t.appendChild(r),r.querySelector(".sq-success-next").addEventListener("click",()=>{r.remove(),v++,M()})}function ve(e,s,t=""){var c;const n=q[e.skillKey]||{icon:"📘",rule:e.skill,structure:"",tip:""},r=d.querySelector(".sq-game");if(!r){s();return}const o=t?U(e,t):null;o&&Z(o.id,{skill:e.skillKey,mode:"synthesisQuest"});const a=document.createElement("div");a.className="eq-teachback-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label","Grammar pattern explanation"),a.innerHTML=`
    <div class="eq-teachback-card">
      <div class="eq-teachback-icon">${n.icon}</div>
      <h4 class="eq-teachback-heading">Let's learn this pattern</h4>
      <p class="eq-teachback-rule">${i(n.rule)}</p>
      ${n.structure?`<div class="eq-teachback-example"><strong>Structure:</strong> ${i(n.structure)}</div>`:""}
      ${n.tip?`<p class="eq-teachback-tip">💡 <strong>Remember:</strong> ${i(n.tip)}</p>`:""}
      <div class="eq-teachback-answer">✅ Model answer: <strong>${i(e.answer)}</strong></div>
      ${(c=e.alternates)!=null&&c.length?`<p class="eq-teachback-explanation">Also accepted: ${e.alternates.map(m=>`<em>${i(m)}</em>`).join("; ")}</p>`:""}
      <p class="eq-teachback-explanation">${i(e.explain)}</p>
      ${o?`<p class="eq-teachback-noticed">👀 Your sentence — that is ${i(o.misconception.childName)}.</p>
      <p class="eq-teachback-nexttime">🧭 <strong>Next time:</strong> ${i(o.misconception.selfCheck)}</p>`:""}
      <button class="btn btn--primary eq-teachback-continue">Got it — Continue</button>
    </div>`,r.appendChild(a),t&&z(a.querySelector(".eq-teachback-card"),()=>J({skillLabel:e.skill||e.skillKey,exercise:`Rewrite: "${e.original}"${e.stem?` starting with "${e.stem}"`:""}`,studentAnswer:t,correctAnswer:e.answer,level:A})),a.querySelector(".eq-teachback-continue").addEventListener("click",()=>{a.remove(),s()})}function be(){var h,b,E,N,B;const{correct:e,total:s,firstTry:t,bySkill:n}=f,r=s>0?e/s:0,o=s>0?t/s:0,a=r>=.9&&o>=.7?3:r>=.7?2:1,c=Math.round(30+e*8+(a-1)*10),m=(I.get("xp")||0)+c,T=D(m);I.patch({xp:m,level:T.level});const y=Object.entries(n).sort((k,w)=>k[1].correct/Math.max(k[1].total,1)-w[1].correct/Math.max(w[1].total,1)),u=y.map(([k,w])=>{var P,R,H,K;const x=Math.round(w.correct/Math.max(w.total,1)*100),W=((K=(H=(R=(P=q[k])==null?void 0:P.rule)==null?void 0:R.split(":")[0])==null?void 0:H.split("—")[0])==null?void 0:K.trim())||k,G=x>=70?"var(--color-success)":x>=40?"var(--color-primary)":"var(--color-error)";return`
      <div class="sq-skill-row">
        <span class="sq-skill-name">${i(W)}</span>
        <div class="sq-skill-track"><div class="sq-skill-bar" style="width:${x}%;background:${G}"></div></div>
        <span class="sq-skill-pct">${x}%</span>
      </div>`}).join(""),p=y[0],l=p&&p[1].correct/Math.max(p[1].total,1)<.7?`Review the "${((E=(b=(h=q[p[0]])==null?void 0:h.rule)==null?void 0:b.split(":")[0])==null?void 0:E.trim())||p[0]}" pattern.`:"Great work — try the next level!";d.innerHTML=`
    <div class="sq-game">
      <div class="sq-summary">
        <h3 class="sq-summary-title">🎉 Session Complete ${"⭐".repeat(a)}</h3>
        <div class="sq-summary-stats">
          <div class="sq-stat-chip"><span class="sq-stat-val">${e}/${s}</span><span class="sq-stat-lbl">Correct</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(r*100).toFixed(0)}%</span><span class="sq-stat-lbl">Accuracy</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(o*100).toFixed(0)}%</span><span class="sq-stat-lbl">First try</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">+${c}</span><span class="sq-stat-lbl">XP</span></div>
        </div>
        ${u?`<h4 class="sq-skills-heading">Skills breakdown</h4><div class="sq-skills-list">${u}</div>`:""}
        <p class="sq-focus-tip">📌 Focus next: ${i(l)}</p>
        <div class="sfq-actions">
          <button class="btn btn--primary" id="sq-retry">Try another set →</button>
          <button class="btn btn--ghost btn--sm" id="sq-home">Back to levels</button>
        </div>
      </div>
    </div>`,(N=document.getElementById("sq-retry"))==null||N.addEventListener("click",()=>O(A)),(B=document.getElementById("sq-home"))==null||B.addEventListener("click",()=>oe())}function i(e){return String(e??"").replace(/[<>&"']/g,s=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"})[s])}export{de as buildAcceptableAnswers,ie as cleanupSynthesisQuest,we as initSynthesisQuest,oe as showSynthesisBrowser};
