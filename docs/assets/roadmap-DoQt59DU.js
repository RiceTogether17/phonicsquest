import{b as B,s as m,x as Q,o as U,y as W,z as x,J as T,A as j,B as M,D as N,E as _,F as t,m as I,C as F,H as q,I as z}from"./index-p5sXDE7v.js";import{b as J,a as V}from"./curriculumMap-DGoTktFp.js";import"./gsap-C8pce-KX.js";const E={"pre-reader":"is learning what sounds the letters make — the foundation everything else builds on.","emerging-decoder":'can sound out simple words like "cat" and "ship", and is building speed and confidence.',"developing-reader":"reads short stories and is bridging into sentence-level grammar and vocabulary.",reader:"reads fluently and is working on primary school English: grammar, vocabulary, comprehension and writing."},Y={sentenceForge:"🔨 Sentence Forge",clozeCastle:"🏰 Cloze Castle",wordVault:"🔑 Word Vault",editingQuest:"✏️ Editing Quest",writingQuest:"📝 Writing Quest"};function D(n){const r=new Set(I(n)),e=[];for(const o of F){if(r.has(o.id))continue;const s=q(o.id,n);if(s&&(e.push({stage:o,reason:s}),e.length>=2))break}return e}function G(n){const r=z(m.get("wordStats")||{},n,void 0,m.get("placementProfile")||null);return Object.entries(Y).filter(([e])=>r[e]&&!r[e].unlocked).map(([e,o])=>({label:o,current:r[e].current,required:r[e].required}))}function O(n,{onClose:r,onOpenDashboard:e,onGoToday:o}={}){var $,y,w,f,S;if(!n)return;const s=B(),g=m.get("placementProfile")||null,c=Q(s,g),i=(($=s==null?void 0:s.name)==null?void 0:$.split(" ")[0])||"Your child",h=(s==null?void 0:s.avatar)||"🦁",d=(s==null?void 0:s.schoolLevel)==="primary"||c==="reader",l=U(),P=W(c,l.groupMastery||{},{measured:x(s,g)}),C=((y=T.find(a=>a.key===c))==null?void 0:y.label)||"Pre-reader",H=((w=j[c])==null?void 0:w.icon)||"🌱",u=d?[]:D(l),v=G(s),p=M(l),k=(N(l)||[]).slice(0,8),b=_(),L=u.length||v.length?`
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🔓</span> What's locked, and why</h3>
      <p class="cm-section-desc">Nothing is locked forever — each gate opens automatically as ${t(i)} practises. Here's exactly what each one is waiting for:</p>
      ${u.map(({stage:a,reason:A})=>`
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title">${a.icon} <strong>${t(a.name)}</strong> unlocks when:</p>
          <p class="roadmap-lock-reason">${t(A)}</p>
        </div>`).join("")}
      ${v.map(a=>`
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title"><strong>${a.label}</strong> opens after <strong>${a.required}</strong> mastered words</p>
          <p class="roadmap-lock-reason">${a.current} mastered so far — every word counts.</p>
        </div>`).join("")}
    </div>`:"",R=`
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🤝</span> How to help this week</h3>
      ${p&&!d?`
        <p class="cm-section-desc">The app recommends focusing on <strong>${p.icon} ${t(p.name)}</strong> — ${t(p.description||"")}</p>`:`
        <p class="cm-section-desc">Today's guided lesson always picks the most useful next step automatically — one sitting a day goes a long way.</p>`}
      ${k.length?`
        <p class="roadmap-tricky-label">Tricky words to practise out loud together:</p>
        <div class="progress-chips" aria-label="Tricky words to practise">
          ${k.map(a=>`<span class="progress-chip">${t(a.word)}</span>`).join("")}
        </div>`:""}
      ${b.length?`
        <p class="roadmap-tricky-label">Progress snapshot:</p>
        <div class="progress-chips" aria-label="Progress snapshot">
          ${b.map(a=>`<span class="progress-chip">${t(a)}</span>`).join("")}
        </div>`:""}
      <button class="btn btn--primary" id="roadmap-go-today">🎯 Start today's lesson together →</button>
    </div>`;n.innerHTML=`
    <div class="roadmap-wrapper">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${h}</span>
          <div>
            <h2 class="cm-title">${t(i)}'s Learning Roadmap</h2>
            <p class="cm-subtitle">Where ${t(i)} is · what's next · how to help</p>
          </div>
        </div>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">${H}</span> Where ${t(i)} is now</h3>
        ${P}
        <p class="roadmap-band-meaning"><strong>${C}</strong> means ${t(i)} ${E[c]||E["pre-reader"]}</p>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">🔤</span> Phonics foundations</h3>
        <p class="cm-section-desc">Each phase builds on the last. ✅ mastered · % in progress · 🔒 coming up.</p>
        <div class="cm-phase-grid">${J(h)}</div>
      </div>

      ${L}

      ${R}

      <div class="roadmap-section ${d?"":"cm-section--future"}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span> Primary English skills
          ${d?"":'<span class="cm-section-tag">Unlocks with phonics mastery</span>'}
        </h3>
        <p class="cm-section-desc">Grammar, vocabulary, editing and writing — the school-paper skills.</p>
        <div class="cm-domain-grid">${V()}</div>
      </div>

      <div class="roadmap-footer">
        <p class="roadmap-footer-note">Want detailed scores, the report card, and exports? They live in the Parent Dashboard (PIN-protected).</p>
        <button class="btn btn--ghost" id="roadmap-open-dashboard">📊 Open Parent Dashboard</button>
      </div>
    </div>`,(f=n.querySelector("#roadmap-go-today"))==null||f.addEventListener("click",()=>o==null?void 0:o()),(S=n.querySelector("#roadmap-open-dashboard"))==null||S.addEventListener("click",()=>e==null?void 0:e())}export{O as renderRoadmap};
