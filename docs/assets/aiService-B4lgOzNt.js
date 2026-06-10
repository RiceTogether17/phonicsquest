import{s as h}from"./index-CM1ztChD.js";const f="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";function p(){return h.get("geminiApiKey")||""}function E(){return!!p()}async function d(r,{maxTokens:t=1024,temperature:o=.3}={}){var c,l,u,g,a;const e=p();if(!e)return null;try{const i=await fetch(`${f}?key=${encodeURIComponent(e)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:r}]}],generationConfig:{maxOutputTokens:t,temperature:o}})});if(!i.ok)return null;const n=await i.json();return((a=(g=(u=(l=(c=n==null?void 0:n.candidates)==null?void 0:c[0])==null?void 0:l.content)==null?void 0:u.parts)==null?void 0:g[0])==null?void 0:a.text)??null}catch{return null}}async function R(r,t,o=""){const e=`You are a Singapore primary school English teacher marking a P${t} student's composition.

Task: ${o||"Write a story or composition."}

Student's draft:
"""
${r}
"""

Give sentence-level feedback. For each sentence that has an issue, quote the exact sentence and give a short, encouraging correction in plain English. Use simple language a primary school child can understand.

Format your response EXACTLY like this — one finding per line, no extra text:
SENTENCE: [exact quote] | ISSUE: [1-sentence tip]

Focus only on: grammar errors, word choice, punctuation, sentence structure.
Give at most 5 findings. If the draft is good, say: GOOD: Well done!`;return d(e,{maxTokens:600,temperature:.2})}async function T(r,t,o,e,c,l){const u=e.length?`Also accepted:
${e.map(s=>`- ${s}`).join(`
`)}`:"",g=`You are a Singapore PSLE English examiner.

Task type: ${l}
Original sentence: ${r}
${t?`Sentence stem given to student: ${t}`:""}
Model answer: ${o}
${u}
Student's answer: ${c}

Decide if the student's answer is:
CORRECT — grammatically correct AND semantically equivalent to the model answer
PARTIAL — correct structure but a minor tense, agreement, or punctuation error
WRONG — incorrect meaning, wrong structure, or grammatically unacceptable

Reply on the FIRST LINE with exactly one word: CORRECT, PARTIAL, or WRONG.
On the SECOND LINE give one short sentence of feedback (max 15 words, encouraging tone, plain English for a primary student).
No other text.`,a=await d(g,{maxTokens:80,temperature:.1});if(!a)return null;const i=a.trim().split(`
`).map(s=>s.trim()).filter(Boolean),n=["CORRECT","PARTIAL","WRONG"].find(s=>{var m;return(m=i[0])==null?void 0:m.startsWith(s)});return n?{verdict:n,feedback:i[1]||""}:null}export{T as a,R as g,E as h};
