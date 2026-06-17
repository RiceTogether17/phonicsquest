import{S as Q,g as D}from"./shortAnswerGrader-BEpmfY49.js";import{s as I,q as C,Y as W,Z as Y,a0 as X,E as Z,M as V,N as z}from"./index-DWydfCN4.js";import"./gsap-C8pce-KX.js";const J={P4:"Primary 4",P5:"Primary 5",P6:"Primary 6"},ee=8,se=2,q={connectorContrast:{icon:"⚡",rule:"Contrast connectors join two opposing ideas",structure:"Although/Even though + [clause], [main clause].",tip:'Never use "but" in the same sentence as "although" — they do the same job.'},connectorResult:{icon:"💥",rule:'"So…that" and "such…that" express cause and result',structure:"so + [adjective] + that  /  such + a/an + [adjective + noun] + that.",tip:'Use "so" before an adjective alone; use "such" when a noun follows.'},connectorAddition:{icon:"➕",rule:'"Not only…but also" links two facts and emphasises both',structure:"[Subject] not only [verb phrase 1] but also [verb phrase 2].",tip:'When "not only" starts the sentence, invert subject and auxiliary: "Not only did he…"'},connectorTime:{icon:"⏰",rule:'"As soon as" and "no sooner…than" show immediate sequence',structure:"As soon as [past simple], [past simple].  /  No sooner had [subject] [past participle] than [past simple].",tip:'"No sooner had…" uses past perfect. No comma is needed when "as soon as" falls in the middle.'},connectorCondition:{icon:"🔐",rule:'"Unless" means "if not"; "provided that" means "on the condition that"',structure:"[Main clause] unless [condition].  /  [Main clause] provided that [condition].",tip:'Never pair "unless" with "not" in the same clause — "unless" already contains the negative.'},activeToPassive:{icon:"🔄",rule:"Active → Passive shifts focus from the doer to the receiver",structure:"[Object] + was/were + past participle + by + [agent].",tip:'Choose was/were based on the new subject. Drop "by [agent]" if obvious or unimportant.'},passiveToActive:{icon:"🔁",rule:"Passive → Active: the agent becomes the subject, verb returns to active form",structure:"[Agent] + [active verb in correct tense] + [original object].",tip:'Remove "was/were…by" and reconstruct the verb in the matching tense.'},reportedSpeechStatement:{icon:"💬",rule:"Reported statements shift tense back and change pronouns and time words",structure:"[He/She] said (that) + [back-shifted verb clause].",tip:'"Yesterday" → "the day before"; "ago" → "before/earlier"; present → past; past → past perfect.'},reportedSpeechQuestion:{icon:"❓",rule:"Reported questions use statement word order — no inversion, no question mark",structure:"[He/She] asked [who/what/whether/if] + [subject] + [verb].",tip:'No auxiliary "do/does/did" after the question word. Use "if/whether" for yes/no questions.'},reportedSpeechCommand:{icon:"📢",rule:'Reported commands use "told/asked + object + to + base verb"',structure:"[He/She] told/asked [person] + (not) to + [base verb].",tip:'For negative commands: "told her not to…". Use "asked" for polite requests.'},relativeClause:{icon:"🔗",rule:"Relative clauses add information about a noun using who/which/whose/whom/that",structure:"[Main noun] + who/which/whose/that + [relative clause].",tip:'Non-defining clauses (extra info) use commas and cannot use "that". Defining clauses can use "that".'},comparison:{icon:"⚖️",rule:"Comparison: as…as (equal), not as…as (unequal), more/less…than (different degrees)",structure:"[Subject] is as [adjective] as [comparison].  /  [Subject] is more [adj] than [comparison].",tip:'"The more…the more" shows proportional increase. Both halves use the comparative form.'},advancedConstruction:{icon:"🏆",rule:"Fronted negative/emphatic elements require subject-verb inversion",structure:"[Never/Seldom/Not until] + [auxiliary] + [subject] + [main verb].",tip:'"It was not until…that" and fronted negatives (never/seldom/rarely) all trigger inversion.'},causativeHave:{icon:"🛠️",rule:'"Have something done" shows that someone arranged for another person to perform an action',structure:"[Subject] + have/had + [object] + past participle.",tip:"The subject does NOT do the action — they arranged for someone else to do it."},cleftSentence:{icon:"🎯",rule:"Cleft sentences (It was/is…who/that) split a sentence to emphasise one element",structure:"It was/is + [emphasised element] + who/that + [rest of sentence].",tip:'Use "who" for people, "that" for things or ideas. Match "was/is" to the original tense.'},conditionalType2:{icon:"🌀",rule:"Type 2 conditional: imaginary or unlikely present/future situation",structure:"If + [past simple], [would/could/might] + [base verb].",tip:'Use "were" instead of "was" after "if" in formal writing: "If I were you…"'},conditionalType3:{icon:"⏮️",rule:"Type 3 conditional: imaginary past — something that did NOT happen",structure:"If + [past perfect], [would/could/might] + have + [past participle].",tip:'"Would have" is most common; "could have" = possibility; "might have" = weaker probability.'},despiteInSpiteOf:{icon:"🧱",rule:'"Despite" and "in spite of" show contrast — followed by a noun or -ing form, NOT a full clause',structure:"Despite/In spite of + [noun phrase or -ing form], [main clause].",tip:'Never write "despite of…". When a full clause follows the contrast, use "although/even though" instead.'}};let u=null,S=null,T=null,$=[],f=0,_=0,v=null;function te(){return{correct:0,total:0,firstTry:0,bySkill:{}}}function be(e,s){u=e,S=s}function ne(){u&&re()}function ae(){u&&(u.innerHTML=""),u=null,S=null}function re(){var n;const e=["P4","P5","P6"],s=((n=I.get("questMastery"))==null?void 0:n.synthesisQuest)||{};u.innerHTML=`
    <div class="sq-browser">
      <p class="sq-browser-intro">Choose a level to begin an 8-item session. Items are selected to target your weakest patterns first.</p>
      <div class="sq-level-grid">
        ${e.map(t=>{const a=Q.filter(i=>i.level===t),r=[...new Set(a.map(i=>i.skillKey))],o=r.filter(i=>(s[i]||0)>=.7).length;return`
          <button class="sq-level-btn" data-level="${t}">
            <span class="sq-level-badge">${t}</span>
            <span class="sq-level-name">${J[t]}</span>
            <span class="sq-level-meta">${a.length} items · ${r.length} patterns</span>
            ${o>0?`<span class="sq-level-progress">${o}/${r.length} patterns ≥70%</span>`:""}
          </button>`}).join("")}
      </div>
      <p class="sq-browser-tip">💡 Weak patterns are shown first. After 2 wrong attempts you see the rule and model answer.</p>
    </div>`,u.querySelectorAll(".sq-level-btn").forEach(t=>{t.addEventListener("click",()=>F(t.dataset.level))})}function F(e){T=e,v=te(),$=oe(e),f=0,M()}function oe(e){const n=Q.filter(t=>t.level===e).map(t=>{const a=C.getSkillScore("synthesisQuest",t.skillKey)??.5,r=(Math.random()-.5)*.12;return{item:t,score:1-a+r}});return n.sort((t,a)=>a.score-t.score),n.slice(0,ee).map(t=>t.item)}function M(){var t,a,r;if(f>=$.length){he();return}const e=$[f];_=0;const s=Math.round(f/$.length*100);u.innerHTML=`
    <div class="sq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ Synthesis — ${T}</span>
        <span class="sfq-progress">${f+1} / ${$.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${s}%"></div></div>

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
    </div>`;const n=document.getElementById("sq-answer-input");(t=document.getElementById("sq-check"))==null||t.addEventListener("click",()=>O(e)),n==null||n.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),O(e))}),(a=document.getElementById("sq-hint-btn"))==null||a.addEventListener("click",()=>ue(e)),(r=document.getElementById("sq-quit"))==null||r.addEventListener("click",()=>{ae(),S==null||S()}),n==null||n.focus()}function L(e){return e.toLowerCase().replace(/['']/g,"'").replace(/[""]/g,'"').replace(/\s+/g," ").replace(/[.,!?;:]+$/g,"").trim()}function ie(e,s){if(!e)return null;const n=L(e);if(!L(s).startsWith(n))return null;const a=e.trim().length;return s.trim().slice(a).replace(/^[\s,]+/,"").trim()}function ce(e){const s=[e.answer,...e.alternates||[]].filter(Boolean),n=[];for(const r of s){const o=ie(e.stem,r);o&&n.push(o)}const t=new Set,a=[];for(const r of[...n,...s]){const o=L(r);!o||t.has(o)||(t.add(o),a.push(r))}return a}function le(e,s){const n=ce(s);return D(e,{expected:n[0]||"",accepts:n.slice(1),requiredGroups:Array.isArray(s.requiredGroups)?s.requiredGroups:null})}async function O(e){var g,A,y;const s=document.getElementById("sq-answer-input"),n=((g=s==null?void 0:s.value)==null?void 0:g.trim())||"";if(!n){b("Type your rewritten sentence first.","neutral");return}_++;const t=le(n,e),a=t.fraction>=1,r=t.fraction>0&&t.fraction<1;if(!a&&Y()){b("✨ Checking with AI…","hint");const p=document.getElementById("sq-check");p&&(p.disabled=!0);const d=e.alternates||[],l=await X(e.original,e.stem||"",e.answer,d,n,e.skill||e.skillKey);if(p&&(p.disabled=!1),(l==null?void 0:l.verdict)==="CORRECT"){j(e,!0,n);return}if((l==null?void 0:l.verdict)==="PARTIAL"){j(e,!1);const h=q[e.skillKey],m=h!=null&&h.structure?`Structure: ${h.structure}`:`Use the "${e.pattern||e.skill}" pattern.`,E=l.feedback?` ${l.feedback}`:"";b(`◐ Almost!${E} ${m}`,"hint"),s&&(s.value=""),s==null||s.focus();return}}if(a){j(e,!0,n);return}if(j(e,!1),_>=se){pe(e,()=>{f++,M()},n);return}const o=q[e.skillKey],i=o!=null&&o.structure?`Structure: ${o.structure}`:`Use the "${e.pattern||e.skill}" pattern.`;if(r){const p=Math.round(t.fraction*100),d=((A=t.trace)==null?void 0:A.hits)||[],l=((y=t.trace)==null?void 0:y.misses)||[],h=d.length?` ✓ ${d.join(", ")}`:"",m=l.length?` ✗ still need: ${l.join(", ")}`:"";b(`◐ Partial (${p}% structure). ${i}${h}${m}`,"hint")}else b(`❌ Not quite. ${i}`,"error");s&&(s.value=""),s==null||s.focus()}function j(e,s,n){const t=v.bySkill[e.skillKey]||{correct:0,total:0,label:e.skill};t.total++,v.total++,C.recordAttempt({quest:"synthesisQuest",skill:e.skillKey,correct:s,level:T}),s&&(t.correct++,v.correct++,_===1&&v.firstTry++),v.bySkill[e.skillKey]=t,C.updateSkill("synthesisQuest",e.skillKey,s),Z.playSfx(s?"correct":"wrong"),s&&n!==void 0&&de(e,n)}function ue(e){const s=q[e.skillKey];b(`💡 ${(s==null?void 0:s.tip)||`Begin your sentence with: "${e.stem||e.pattern}"`}`,"hint")}function b(e,s){const n=document.getElementById("sq-feedback");n&&(n.hidden=!1,n.className=`sfq-feedback${s==="error"?" sfq-feedback--error":s==="hint"?" sfq-feedback--hint":""}`,n.textContent=e)}function de(e,s){var o;const n=u.querySelector(".sq-game");if(!n)return;const t=_===1?"⭐⭐":"⭐",a=document.createElement("div");a.className="sq-success-overlay";const r=e.stem?`${e.stem} ${s.trim()}`:s.trim();a.innerHTML=`
    <div class="sq-success-card">
      <div class="sq-success-icon">✅</div>
      <h4 class="sq-success-heading">${t} Correct!</h4>
      ${e.stem?`<p class="sq-success-stitched"><strong>Full sentence:</strong> <em>${c(r)}</em></p>`:`<p class="sq-success-your-answer"><em>${c(s)}</em></p>`}
      <p class="sq-success-explain">${c(e.explain)}</p>
      ${(o=e.alternates)!=null&&o.length?`<p class="sq-success-alts"><strong>Also accepted:</strong> ${e.alternates.map(i=>`<em>${c(i)}</em>`).join("; ")}</p>`:""}
      <button class="btn btn--primary sq-success-next">Next →</button>
    </div>`,n.appendChild(a),a.querySelector(".sq-success-next").addEventListener("click",()=>{a.remove(),f++,M()})}function pe(e,s,n=""){var o;const t=q[e.skillKey]||{icon:"📘",rule:e.skill,structure:"",tip:""},a=u.querySelector(".sq-game");if(!a){s();return}const r=document.createElement("div");r.className="eq-teachback-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-label","Grammar pattern explanation"),r.innerHTML=`
    <div class="eq-teachback-card">
      <div class="eq-teachback-icon">${t.icon}</div>
      <h4 class="eq-teachback-heading">Let's learn this pattern</h4>
      <p class="eq-teachback-rule">${c(t.rule)}</p>
      ${t.structure?`<div class="eq-teachback-example"><strong>Structure:</strong> ${c(t.structure)}</div>`:""}
      ${t.tip?`<p class="eq-teachback-tip">💡 <strong>Remember:</strong> ${c(t.tip)}</p>`:""}
      <div class="eq-teachback-answer">✅ Model answer: <strong>${c(e.answer)}</strong></div>
      ${(o=e.alternates)!=null&&o.length?`<p class="eq-teachback-explanation">Also accepted: ${e.alternates.map(i=>`<em>${c(i)}</em>`).join("; ")}</p>`:""}
      <p class="eq-teachback-explanation">${c(e.explain)}</p>
      <button class="btn btn--primary eq-teachback-continue">Got it — Continue</button>
    </div>`,a.appendChild(r),n&&V(r.querySelector(".eq-teachback-card"),()=>z({skillLabel:e.skill||e.skillKey,exercise:`Rewrite: "${e.original}"${e.stem?` starting with "${e.stem}"`:""}`,studentAnswer:n,correctAnswer:e.answer,level:T})),r.querySelector(".eq-teachback-continue").addEventListener("click",()=>{r.remove(),s()})}function he(){var h,m,E,N,B;const{correct:e,total:s,firstTry:n,bySkill:t}=v,a=s>0?e/s:0,r=s>0?n/s:0,o=a>=.9&&r>=.7?3:a>=.7?2:1,i=Math.round(30+e*8+(o-1)*10),g=(I.get("xp")||0)+i,A=W(g);I.patch({xp:g,level:A.level});const y=Object.entries(t).sort((k,w)=>k[1].correct/Math.max(k[1].total,1)-w[1].correct/Math.max(w[1].total,1)),p=y.map(([k,w])=>{var P,H,R,K;const x=Math.round(w.correct/Math.max(w.total,1)*100),U=((K=(R=(H=(P=q[k])==null?void 0:P.rule)==null?void 0:H.split(":")[0])==null?void 0:R.split("—")[0])==null?void 0:K.trim())||k,G=x>=70?"var(--color-success)":x>=40?"var(--color-primary)":"var(--color-error)";return`
      <div class="sq-skill-row">
        <span class="sq-skill-name">${c(U)}</span>
        <div class="sq-skill-track"><div class="sq-skill-bar" style="width:${x}%;background:${G}"></div></div>
        <span class="sq-skill-pct">${x}%</span>
      </div>`}).join(""),d=y[0],l=d&&d[1].correct/Math.max(d[1].total,1)<.7?`Review the "${((E=(m=(h=q[d[0]])==null?void 0:h.rule)==null?void 0:m.split(":")[0])==null?void 0:E.trim())||d[0]}" pattern.`:"Great work — try the next level!";u.innerHTML=`
    <div class="sq-game">
      <div class="sq-summary">
        <h3 class="sq-summary-title">🎉 Session Complete ${"⭐".repeat(o)}</h3>
        <div class="sq-summary-stats">
          <div class="sq-stat-chip"><span class="sq-stat-val">${e}/${s}</span><span class="sq-stat-lbl">Correct</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(a*100).toFixed(0)}%</span><span class="sq-stat-lbl">Accuracy</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(r*100).toFixed(0)}%</span><span class="sq-stat-lbl">First try</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">+${i}</span><span class="sq-stat-lbl">XP</span></div>
        </div>
        ${p?`<h4 class="sq-skills-heading">Skills breakdown</h4><div class="sq-skills-list">${p}</div>`:""}
        <p class="sq-focus-tip">📌 Focus next: ${c(l)}</p>
        <div class="sfq-actions">
          <button class="btn btn--primary" id="sq-retry">Try another set →</button>
          <button class="btn btn--ghost btn--sm" id="sq-home">Back to levels</button>
        </div>
      </div>
    </div>`,(N=document.getElementById("sq-retry"))==null||N.addEventListener("click",()=>F(T)),(B=document.getElementById("sq-home"))==null||B.addEventListener("click",()=>ne())}function c(e){return String(e??"").replace(/[<>&"']/g,s=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"})[s])}export{ce as buildAcceptableAnswers,ae as cleanupSynthesisQuest,be as initSynthesisQuest,ne as showSynthesisBrowser};
