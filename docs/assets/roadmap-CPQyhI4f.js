import{g as U,s as m,o as W,j,r as x,J as A,t as T,u as B,v as N,w as _,x as t,i as M,C as I,y as q,z}from"./index-BYMXJ50q.js";import{c as F,d as J}from"./curriculumMap-CyF_p3Qg.js";import"./gsap-C8pce-KX.js";const S={"pre-reader":"is learning what sounds the letters make — the foundation everything else builds on.","emerging-decoder":'can sound out simple words like "cat" and "ship", and is building speed and confidence.',"developing-reader":"reads short stories and is bridging into sentence-level grammar and vocabulary.",reader:"reads fluently and is working on primary school English: grammar, vocabulary, comprehension and writing."},V={sentenceForge:"🔨 Sentence Forge",clozeCastle:"🏰 Cloze Castle",wordVault:"🔑 Word Vault",editingQuest:"✏️ Editing Quest",writingQuest:"📝 Writing Quest"};function Y(o){const c=new Set(M(o)),e=[];for(const n of I){if(c.has(n.id))continue;const s=q(n.id,o);if(s&&(e.push({stage:n,reason:s}),e.length>=2))break}return e}function D(o){const c=z(m.get("wordStats")||{},o,void 0,m.get("placementProfile")||null);return Object.entries(V).filter(([e])=>c[e]&&!c[e].unlocked).map(([e,n])=>({label:n,current:c[e].current,required:c[e].required}))}function Z(o,{onClose:c,onOpenDashboard:e,onGoToday:n}={}){var $,b,y,w,f;if(!o)return;const s=U(),P=m.get("placementProfile")||null,r=W(s,P),i=(($=s==null?void 0:s.name)==null?void 0:$.split(" ")[0])||"Your child",g=(s==null?void 0:s.avatar)||"🦁",d=(s==null?void 0:s.schoolLevel)==="primary"||r==="reader",l=j(),E=x(r,l.groupMastery||{}),C=((b=A.find(a=>a.key===r))==null?void 0:b.label)||"Pre-reader",L=((y=T[r])==null?void 0:y.icon)||"🌱",h=d?[]:Y(l),u=D(s),p=B(l),v=(N(l)||[]).slice(0,8),k=_(),H=h.length||u.length?`
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🔓</span> What's locked, and why</h3>
      <p class="cm-section-desc">Nothing is locked forever — each gate opens automatically as ${t(i)} practises. Here's exactly what each one is waiting for:</p>
      ${h.map(({stage:a,reason:Q})=>`
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title">${a.icon} <strong>${t(a.name)}</strong> unlocks when:</p>
          <p class="roadmap-lock-reason">${t(Q)}</p>
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
    </div>`;o.innerHTML=`
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
    </div>`,(w=o.querySelector("#roadmap-go-today"))==null||w.addEventListener("click",()=>n==null?void 0:n()),(f=o.querySelector("#roadmap-open-dashboard"))==null||f.addEventListener("click",()=>e==null?void 0:e())}export{Z as renderRoadmap};
