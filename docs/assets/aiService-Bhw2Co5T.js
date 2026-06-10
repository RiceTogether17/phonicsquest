const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/aiGuardrails-C831OhIJ.js","assets/index-dTE5fncO.js","assets/gsap-C8pce-KX.js","assets/index-BPtttdqC.css"])))=>i.map(i=>d[i]);
import{_ as m,s as y}from"./index-dTE5fncO.js";const w="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";function p(){return y.get("geminiApiKey")||""}function k(){return!!p()}async function g(t,{maxTokens:n=1024,temperature:i=.3}={}){var a,r,o,s,c;const e=p();if(!e)return null;try{const h=await fetch(`${w}?key=${encodeURIComponent(e)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:t}]}],generationConfig:{maxOutputTokens:n,temperature:i}})});if(!h.ok)return null;const u=await h.json();return((c=(s=(o=(r=(a=u==null?void 0:u.candidates)==null?void 0:a[0])==null?void 0:r.content)==null?void 0:o.parts)==null?void 0:s[0])==null?void 0:c.text)??null}catch{return null}}async function f({question:t,options:n,chosen:i,correct:e,authoredExplanation:a="",level:r=""}){const{askGiriConstrained:o}=await m(async()=>{const{askGiriConstrained:h}=await import("./aiGuardrails-C831OhIJ.js");return{askGiriConstrained:h}},__vite__mapDeps([0,1,2,3])),s=i===e,c=`A ${r?`${r} `:""}student answered a multiple-choice English question.

Question: ${t}
Choices: ${n.join(" / ")}
Student chose: "${i}" — ${s?"CORRECT":`wrong (correct answer: "${e}")`}
${a?`The app already told them: "${a}"`:""}

${s?"In 1–2 short sentences, reinforce WHY their answer is right so the idea transfers to the next question.":"In 2–3 short sentences, explain the thinking mistake that leads to their choice, then how to spot the right answer next time. Be kind — mistakes are how we learn."}`;return o("explain",c,{maxTokens:160,logSummary:`Why: ${String(t).slice(0,80)}`})}async function T({question:t,options:n,correct:i,categoryLabel:e="",level:a=""}){const{askGiriConstrained:r}=await m(async()=>{const{askGiriConstrained:s}=await import("./aiGuardrails-C831OhIJ.js");return{askGiriConstrained:s}},__vite__mapDeps([0,1,2,3])),o=`A ${a?`${a} `:""}student is stuck on this English question${e?` about ${e}`:""}:

Question: ${t}
Choices: ${n.join(" / ")}
(The correct answer is "${i}" — you must NOT say it or name any choice.)

Give ONE short hint (max 25 words) that points at the clue in the sentence or the rule to think about, WITHOUT revealing or naming any answer choice.`;return r("hint",o,{maxTokens:80,logSummary:`Hint: ${String(t).slice(0,80)}`})}async function E({skillLabel:t,exercise:n,studentAnswer:i,correctAnswer:e,level:a=""}){const{askGiriConstrained:r}=await m(async()=>{const{askGiriConstrained:s}=await import("./aiGuardrails-C831OhIJ.js");return{askGiriConstrained:s}},__vite__mapDeps([0,1,2,3])),o=`A ${a?`${a} `:""}student is practising ${t||"English"} and has tried twice without success. They have already been shown the rule and the correct answer — your job is to make it click.

Exercise: ${n}
Student's answer: "${i}"
Correct answer: "${e}"

In 2–3 short sentences, explain the thinking mistake behind their answer and how to spot the right one next time. Be kind — mistakes are how we learn.`;return r("explain",o,{maxTokens:160,logSummary:`Teach-back: ${String(t||n).slice(0,80)}`})}async function x(t,n,i=""){const e=`You are a Singapore primary school English teacher marking a P${n} student's composition.

Task: ${i||"Write a story or composition."}

Student's draft:
"""
${t}
"""

Give sentence-level feedback. For each sentence that has an issue, quote the exact sentence and give a short, encouraging correction in plain English. Use simple language a primary school child can understand.

Format your response EXACTLY like this — one finding per line, no extra text:
SENTENCE: [exact quote] | ISSUE: [1-sentence tip]

Focus only on: grammar errors, word choice, punctuation, sentence structure.
Give at most 5 findings. If the draft is good, say: GOOD: Well done!`;return g(e,{maxTokens:600,temperature:.2})}async function C(t,n,i,e,a,r){const o=e.length?`Also accepted:
${e.map(l=>`- ${l}`).join(`
`)}`:"",s=`You are a Singapore PSLE English examiner.

Task type: ${r}
Original sentence: ${t}
${n?`Sentence stem given to student: ${n}`:""}
Model answer: ${i}
${o}
Student's answer: ${a}

Decide if the student's answer is:
CORRECT — grammatically correct AND semantically equivalent to the model answer
PARTIAL — correct structure but a minor tense, agreement, or punctuation error
WRONG — incorrect meaning, wrong structure, or grammatically unacceptable

Reply on the FIRST LINE with exactly one word: CORRECT, PARTIAL, or WRONG.
On the SECOND LINE give one short sentence of feedback (max 15 words, encouraging tone, plain English for a primary student).
No other text.`,c=await g(s,{maxTokens:80,temperature:.1});if(!c)return null;const h=c.trim().split(`
`).map(l=>l.trim()).filter(Boolean),u=["CORRECT","PARTIAL","WRONG"].find(l=>{var d;return(d=h[0])==null?void 0:d.startsWith(l)});return u?{verdict:u,feedback:h[1]||""}:null}export{f as a,x as b,C as c,g as d,E as e,T as g,k as h};
