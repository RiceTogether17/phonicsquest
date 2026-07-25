import{b as Q,s as m,u as U,l as W,v as x,J as B,w as T,x as j,y as N,z as _,A as t,k as M,C as I,B as q,D as z}from"./index-gYO_fZOl.js";import{b as F,a as J}from"./curriculumMap-DhmZD5de.js";import"./gsap-C8pce-KX.js";const S={"pre-reader":"is learning what sounds the letters make — the foundation everything else builds on.","emerging-decoder":'can sound out simple words like "cat" and "ship", and is building speed and confidence.',"developing-reader":"reads short stories and is bridging into sentence-level grammar and vocabulary.",reader:"reads fluently and is working on primary school English: grammar, vocabulary, comprehension and writing."},V={sentenceForge:"🔨 Sentence Forge",clozeCastle:"🏰 Cloze Castle",wordVault:"🔑 Word Vault",editingQuest:"✏️ Editing Quest",writingQuest:"📝 Writing Quest"};function Y(n){const c=new Set(M(n)),e=[];for(const o of I){if(c.has(o.id))continue;const s=q(o.id,n);if(s&&(e.push({stage:o,reason:s}),e.length>=2))break}return e}function D(n){const c=z(m.get("wordStats")||{},n,void 0,m.get("placementProfile")||null);return Object.entries(V).filter(([e])=>c[e]&&!c[e].unlocked).map(([e,o])=>({label:o,current:c[e].current,required:c[e].required}))}function Z(n,{onClose:c,onOpenDashboard:e,onGoToday:o}={}){var b,$,y,w,f;if(!n)return;const s=Q(),P=m.get("placementProfile")||null,r=U(s,P),i=((b=s==null?void 0:s.name)==null?void 0:b.split(" ")[0])||"Your child",g=(s==null?void 0:s.avatar)||"🦁",d=(s==null?void 0:s.schoolLevel)==="primary"||r==="reader",l=W(),E=x(r,l.groupMastery||{}),C=(($=B.find(a=>a.key===r))==null?void 0:$.label)||"Pre-reader",L=((y=T[r])==null?void 0:y.icon)||"🌱",h=d?[]:Y(l),u=D(s),p=j(l),v=(N(l)||[]).slice(0,8),k=_(),H=h.length||u.length?`
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🔓</span> What's locked, and why</h3>
      <p class="cm-section-desc">Nothing is locked forever — each gate opens automatically as ${t(i)} practises. Here's exactly what each one is waiting for:</p>
      ${h.map(({stage:a,reason:A})=>`
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title">${a.icon} <strong>${t(a.name)}</strong> unlocks when:</p>
          <p class="roadmap-lock-reason">${t(A)}</p>
        </div>`).join("")}
      ${u.map(a=>`
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
      ${v.length?`
        <p class="roadmap-tricky-label">Tricky words to practise out loud together:</p>
        <div class="progress-chips" aria-label="Tricky words to practise">
          ${v.map(a=>`<span class="progress-chip">${t(a.word)}</span>`).join("")}
        </div>`:""}
      ${k.length?`
        <p class="roadmap-tricky-label">Progress snapshot:</p>
        <div class="progress-chips" aria-label="Progress snapshot">
          ${k.map(a=>`<span class="progress-chip">${t(a)}</span>`).join("")}
        </div>`:""}
      <button class="btn btn--primary" id="roadmap-go-today">🎯 Start today's lesson together →</button>
    </div>`;n.innerHTML=`
    <div class="roadmap-wrapper">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${g}</span>
          <div>
            <h2 class="cm-title">${t(i)}'s Learning Roadmap</h2>
            <p class="cm-subtitle">Where ${t(i)} is · what's next · how to help</p>
          </div>
        </div>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">${L}</span> Where ${t(i)} is now</h3>
        ${E}
        <p class="roadmap-band-meaning"><strong>${C}</strong> means ${t(i)} ${S[r]||S["pre-reader"]}</p>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">🔤</span> Phonics foundations</h3>
        <p class="cm-section-desc">Each phase builds on the last. ✅ mastered · % in progress · 🔒 coming up.</p>
        <div class="cm-phase-grid">${F(g)}</div>
      </div>

      ${H}

      ${R}

      <div class="roadmap-section ${d?"":"cm-section--future"}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span> Primary English skills
          ${d?"":'<span class="cm-section-tag">Unlocks with phonics mastery</span>'}
        </h3>
        <p class="cm-section-desc">Grammar, vocabulary, editing and writing — the school-paper skills.</p>
        <div class="cm-domain-grid">${J()}</div>
      </div>

      <div class="roadmap-footer">
        <p class="roadmap-footer-note">Want detailed scores, the report card, and exports? They live in the Parent Dashboard (PIN-protected).</p>
        <button class="btn btn--ghost" id="roadmap-open-dashboard">📊 Open Parent Dashboard</button>
      </div>
    </div>`,(w=n.querySelector("#roadmap-go-today"))==null||w.addEventListener("click",()=>o==null?void 0:o()),(f=n.querySelector("#roadmap-open-dashboard"))==null||f.addEventListener("click",()=>e==null?void 0:e())}export{Z as renderRoadmap};
