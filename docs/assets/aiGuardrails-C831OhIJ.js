import{s as i}from"./index-dTE5fncO.js";import{h as u,d as p}from"./aiService-Bhw2Co5T.js";import"./gsap-C8pce-KX.js";const m=40,l=700,d=100,f=`You are Giri, a friendly owl tutor inside a children's English learning app (ages 5–12, Singapore primary school).

Rules you must always follow:
- Answer in at most 60 words of plain, encouraging English a child can read.
- Talk ONLY about English learning: sounds, words, grammar, vocabulary, reading and writing.
- If asked about anything else (personal questions, other topics, who made you), reply exactly: "Let's keep learning English together!"
- Never ask the child for personal information. Never suggest visiting websites or links.
- No markdown, no HTML, no emoji spam (one emoji is fine).

Task:
`;function g(e=new Date){const t=n=>String(n).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}function h(e){if(typeof e!="string")return"";let t=e.replace(/<[^>]*>/g," ").replace(/https?:\/\/\S+/gi,"").replace(/www\.\S+/gi,"").replace(/[*_#`>|]/g,"").replace(/\s{2,}/g," ").trim();return t.length>l&&(t=`${t.slice(0,l).replace(/\s+\S*$/,"")}…`),t}function y(e=new Date){const t=g(e);return(i.get("aiUsageLog")||[]).filter(n=>n&&n.date===t).length}function w(e=new Date){return u()&&y(e)<m}function S(e,t,n=new Date){const a=[{date:g(n),at:new Date().toISOString(),kind:e,summary:String(t||"").slice(0,120)},...i.get("aiUsageLog")||[]].slice(0,d);i.set("aiUsageLog",a)}async function E(e,t,n={}){if(!w())return null;const{maxTokens:r=160,temperature:a=.2,logSummary:c=""}=n;S(e,c||t.slice(0,120));const o=await p(f+t,{maxTokens:r,temperature:Math.min(a,.3)});if(!o)return null;const s=h(o);return s.length>0?s:null}export{m as DAILY_AI_CALL_CAP,f as GIRI_SYSTEM_PREFIX,y as aiCallsToday,E as askGiriConstrained,w as canCallAi,S as logAiUse,h as sanitizeAiText};
