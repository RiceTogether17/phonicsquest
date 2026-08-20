import{s as i,b as p,ag as y,ah as b,F as P,ae as q}from"./index-rbv4C07F.js";const m=new Set(["P1","P2","P3","P4","P5","P6"]);function $(){var t,n;const e=i.get("recommendedPracticeLevel");if(m.has(e))return e;const r=(n=(t=p)==null?void 0:t())==null?void 0:n.primaryGrade;return m.has(r)?r:"P1"}function L(e){return e===i.get("recommendedPracticeLevel")}const f="mcqReviewLane",v=4,h=60,S=3,_=["id","seedId","level","category","subskill","difficulty","q","questionType","choices","answer","explain","optionExplanations","clueWords","reasoning","contextType"];function g(){const e=i.get(f);return e&&typeof e=="object"?e:{}}function E(e){const r={};for(const t of _)e[t]!==void 0&&(r[t]=e[t]);return r}function k(e,r){const t=Object.keys(e).filter(n=>e[n].mode===r);return t.length<=h||t.sort((n,a)=>Date.parse(e[n].lastSeen||0)-Date.parse(e[a].lastSeen||0)).slice(0,t.length-h).forEach(n=>delete e[n]),e}function R(e,r,t,n=Date.now(),{promote:a=!0}={}){const c=r==null?void 0:r.seedId;if(!c)return;const s={...g()},o=`${e}:${c}`,l=s[o];if(!l&&t)return;const d=b(l,t,n,{promote:a});if(t&&d.box>=v){delete s[o],i.set(f,s);return}s[o]={...d,mode:e,attempts:((l==null?void 0:l.attempts)||0)+1,correct:((l==null?void 0:l.correct)||0)+(t?1:0),lastSeen:new Date(n).toISOString(),item:E(r)},k(s,e),i.set(f,s)}function M(e,{level:r=null,category:t=null,limit:n=S,now:a=Date.now()}={}){const c=g();return Object.values(c).filter(s=>s.mode===e&&s.item&&y(s,a)).filter(s=>!r||s.item.level===r).filter(s=>!t||s.item.category===t).sort((s,o)=>(s.dueAt||0)-(o.dueAt||0)).slice(0,Math.max(0,n)).map(s=>({...s.item,isReview:!0}))}const u=Object.freeze({guided:{key:"guided",label:"Learn",hint:"See the rule and clue words before you answer — pick this when a skill is new to you."},normal:{key:"normal",label:"Practise",hint:"Answer on your own first, then learn from the feedback after each question."},challenge:{key:"challenge",label:"PSLE Challenge",hint:"Exam-style questions with no clue words — trust the rules you have learnt."}}),w=new Set(["P4","P5","P6"]);function I(e,{level:r=null,difficulty:t="normal"}={}){const n=[...e];if(t==="guided"){const s=n.filter(o=>(o.difficulty??1)<=2);return s.length?s:n}if(t!=="challenge")return n;const a=n.filter(s=>(s.difficulty??1)>=3),c=a.length?a:n;if(w.has(r)){const s=c.filter(o=>o.contextType==="multi");if(s.length>=Math.min(5,c.length))return s}return c}function O({selected:e="normal",prefix:r="mcq"}={}){var t;return`
    <div class="cloze-mode-toggle mcq-difficulty-toggle" role="group" aria-label="MCQ difficulty">
      <span class="cloze-mode-label">Mode:</span>
      ${Object.values(u).map(n=>`
        <button class="btn btn--ghost btn--sm ${e===n.key?"is-active":""}"
                data-${r}-difficulty="${n.key}"
                aria-pressed="${e===n.key}">${n.label}</button>
      `).join("")}
      <span class="cloze-mode-hint">${((t=u[e])==null?void 0:t.hint)||u.normal.hint}</span>
    </div>`}function A({prefix:e,level:r,recommended:t=!1,chooserHtml:n}){const a=P(r);return`
    <div class="mcq-quickstart">
      <button class="btn btn--primary mcq-quickstart__go" id="${e}-quick-start">
        Start ${q} questions · ${a}
      </button>
      <p class="mcq-quickstart__note">
        ${t?`${a} is the level we recommend for you right now.`:`Practising at ${a}.`}
      </p>
    </div>

    <details class="mcq-chooser">
      <summary class="mcq-chooser__summary">Change level, support or skill</summary>
      <div class="mcq-chooser__body">${n}</div>
    </details>`}export{u as M,O as a,M as b,R as c,I as f,$ as g,L as i,A as r};
