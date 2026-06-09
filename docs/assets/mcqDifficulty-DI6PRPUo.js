import{e as c}from"./escapeHtml-Bz2f3NU1.js";function u(n,a){const t=n==null?void 0:n.optionExplanations;return!t||typeof t!="object"?"":t[a]||""}function f(n){return!Array.isArray(n)||n.length===0?"":`<br><span class="mcq-clue-words"><strong>🔍 Clue words:</strong> ${n.map(a=>`<span class="mcq-clue-chip">${c(a)}</span>`).join(" ")}</span>`}function d(n,a,t,{showClueWords:e=!0}={}){let l=t?"✅ <strong>Correct!</strong>":`❌ <strong>Correct answer:</strong> ${c(n.answer)}`;e&&(l+=f(n.clueWords));const s=u(n,a);return s&&(l+=`<br><span class="mcq-option-feedback">${c(s)}</span>`),n.reasoning?l+=`<br><span class="mcq-reasoning">${n.reasoning}</span>`:n.explain&&(l+=`<br>${n.explain}`),l}const o=Object.freeze({guided:{key:"guided",label:"Learn",hint:"Rule tip shown before answering; easier mix."},normal:{key:"normal",label:"Practise",hint:"Post-answer feedback and normal adaptive mix."},challenge:{key:"challenge",label:"PSLE Challenge",hint:"Harder items, no clue chips, multi-sentence contexts where available."}}),p=new Set(["P4","P5","P6"]);function b(n,{level:a=null,difficulty:t="normal"}={}){const e=[...n];if(t==="guided"){const r=e.filter(i=>(i.difficulty??1)<=2);return r.length?r:e}if(t!=="challenge")return e;const l=e.filter(r=>(r.difficulty??1)>=3),s=l.length?l:e;if(p.has(a)){const r=s.filter(i=>i.contextType==="multi");if(r.length>=Math.min(5,s.length))return r}return s}function h({selected:n="normal",prefix:a="mcq"}={}){var t;return`
    <div class="cloze-mode-toggle mcq-difficulty-toggle" role="group" aria-label="MCQ difficulty">
      <span class="cloze-mode-label">Mode:</span>
      ${Object.values(o).map(e=>`
        <button class="btn btn--ghost btn--sm ${n===e.key?"is-active":""}"
                data-${a}-difficulty="${e.key}"
                aria-pressed="${n===e.key}">${e.label}</button>
      `).join("")}
      <span class="cloze-mode-hint">${((t=o[n])==null?void 0:t.hint)||o.normal.hint}</span>
    </div>`}export{o as M,d as b,b as f,h as r};
