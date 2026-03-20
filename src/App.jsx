import { useState } from "react";

const B = {
  bg:        "#F6F3F2",  // Pristine — main background
  surface:   "#EDEAE8",  // slightly darker pristine for cards/surfaces
  night:     "#020503",  // Night — primary text
  sage:      "#6F815C",  // Sage — headings, accents
  seaSage:   "#95A78D",  // Sea Sage — secondary text, muted labels
  emerald:   "#053F33",  // Emerald — strong accents, borders
  chartreuse:"#638E4F",  // Chartreuse — buttons, highlights
  border:    "#C8C4C0",  // soft pristine border
  borderMid: "#9A9690",  // mid border
};
const sans  = "'Helvetica Neue', Arial, sans-serif";
const serif = "Georgia, serif";
const MEMBERS = ["Alexsis","Andrew","Anna","Chris","Kandi","Kelly"];

const ZONES = [
  { id:"sunny",    icon:"☀️", label:"Sunny",        title:"At my best, I…",                          hint:"When you're in flow — what conditions or behaviors show up? Connect to a team value if it feels right: Caring, Proactive, Collaborative, Adaptable, Unity.",                          placeholder:"e.g. I'm energized by clear priorities and space to think. At my best I ask questions before jumping to solutions.",   bg:"#0f1a05", border:"#3a6a0a", text:"#a8d870", pill:{bg:"#f5c842",border:"#e6b800",text:"#5a3e00"} },
  { id:"overcast", icon:"☁️", label:"Overcast",     title:"Early signs I'm stressed…",               hint:"Before the storm — subtle signals something's off. What do you go quiet about? What do you stop doing? This is your team's early warning system.",                                 placeholder:"e.g. I get quieter in group settings. I start over-checking my own work. My messages get shorter.",                    bg:"#0d0d20", border:"#3a3a6a", text:"#a0a8e8", pill:{bg:"#a0b8d8",border:"#7090b8",text:"#1a2e4a"} },
  { id:"stormy",   icon:"⛈️", label:"Stormy",       title:"When I'm overwhelmed, you might notice…",  hint:"No labels needed — just describe the behavior. If you did Saboteurs pre-work, think about what your top one looks like in practice. What do people around you observe?",            placeholder:"e.g. I over-communicate trying to control outcomes, or go the opposite way and go silent.",                            bg:"#1a0d05", border:"#6a3a0a", text:"#e0a870", pill:{bg:"#7b5ea7",border:"#5a3d8a",text:"#f0eaff"} },
  { id:"clearup",  icon:"🌈", label:"The clear-up", title:"How to help me when it's stormy…",         hint:"Be specific. 'Just check in' is less useful than 'send me a Slack instead of calling' or 'give me 10 min before we debrief.' What actually works for you?",                         placeholder:"e.g. Ask me 'do you need to vent or a solution?' A direct, kind nudge works better than tiptoeing.",                  bg:"#05101a", border:"#0a3a5a", text:"#70b8d8", pill:{bg:"#4caf89",border:"#2e8a60",text:"#0a2e1e"} },
];

const DISCUSS = [
  n=>`Does anything in ${n}'s forecast surprise you? What resonates most?`,
  n=>`Which team value shows up in ${n}'s sunny zone — Caring, Proactive, Collaborative, Adaptable, or Unity?`,
  n=>`Looking at ${n}'s clear-up — is there a specific commitment someone wants to make?`,
  n=>`Does ${n}'s stormy zone connect to anyone else's? What does that mean for how you work together?`,
  n=>`What's one thing you'd want ${n} to know you'll do differently after seeing their forecast?`,
  n=>`Which ELEVATE principle — Efficiency, Learning, Expertise, Vision, Accountability, Teamwork, Engagement — shows up in ${n}'s sunny zone?`,
];

const SABOTEURS = {
  judge:         {name:"The Judge",       desc:"Finds fault with self, others, and circumstances. The master saboteur everyone has.",       signs:["Critical of self or others","High standards never fully met","Replays past mistakes"],              gift:"Discernment, accountability, quality standards"},
  avoider:       {name:"Avoider",          desc:"Focuses on the positive to avoid difficult tasks and conflicts.",                            signs:["Avoids conflict at all costs","Puts off hard conversations","Distracted by pleasant tasks"],          gift:"Positivity, harmony, pleasure in the moment"},
  controller:    {name:"Controller",       desc:"Anxiety-based need to take charge and bend situations to their will.",                      signs:["Struggles to delegate","Frustrated when others don't follow direction","Takes over vs. trusts"],   gift:"Decisiveness, confidence, getting things done"},
  hyperAchiever: {name:"Hyper-Achiever",   desc:"Dependent on constant achievement for self-respect and self-validation.",                   signs:["Self-worth tied to performance","Guilt when not productive","Compares achievements"],              gift:"Drive, ambition, focus on results"},
  hyperRational: {name:"Hyper-Rational",   desc:"Relies on rational processing, dismissing emotions in self and others.",                    signs:["Prioritizes logic over feelings","Sees emotions as unproductive","Can seem detached"],             gift:"Clear thinking, objectivity, analytical precision"},
  hyperVigilant: {name:"Hyper-Vigilant",   desc:"Continuous anxiety about dangers and what could go wrong.",                                signs:["Anticipates worst-case scenarios","Difficulty relaxing","Always scanning for risks"],              gift:"Preparation, thoroughness, anticipating problems"},
  pleaser:       {name:"Pleaser",           desc:"Gains acceptance by helping and pleasing others. Loses sight of own needs.",               signs:["Struggles to say no","Helps even at personal cost","Needs approval to feel okay"],                 gift:"Empathy, generosity, collaborative spirit"},
  restless:      {name:"Restless",          desc:"Constantly seeking excitement in the next activity. Rarely at peace with the present.",    signs:["Moves quickly between things","Bored by routine","Difficulty being still"],                        gift:"Energy, curiosity, adaptability"},
  stickler:      {name:"Stickler",          desc:"Perfectionism and need for order. Turns everything into a should or must.",               signs:["Strong need for structure","Frustrated by messiness","High standards extend to others"],           gift:"Precision, reliability, attention to detail"},
  victim:        {name:"Victim",            desc:"Emotional and temperamental as a way to gain attention. A martyr streak.",                signs:["Feels unrecognized for effort","Takes things personally","Uses suffering to connect"],             gift:"Emotional depth, sensitivity, awareness of injustice"},
};

const QUESTIONS = [
  {id:"q1", text:"I often notice what's wrong before I notice what's right.",                            sab:"judge",         w:2},
  {id:"q2", text:"I tend to avoid difficult conversations until I absolutely have to.",                  sab:"avoider",       w:2},
  {id:"q3", text:"I find it hard to trust others to do things the way they should be done.",            sab:"controller",    w:2},
  {id:"q4", text:"My sense of worth is deeply tied to what I accomplish.",                              sab:"hyperAchiever", w:2},
  {id:"q5", text:"I prefer to analyze problems logically rather than talk about feelings.",             sab:"hyperRational", w:2},
  {id:"q6", text:"Even when things are good, I find myself looking for what could go wrong.",           sab:"hyperVigilant", w:2},
  {id:"q7", text:"I often put others' needs ahead of my own — sometimes to my detriment.",             sab:"pleaser",       w:2},
  {id:"q8", text:"I get bored easily and am always looking for the next exciting thing.",              sab:"restless",      w:2},
  {id:"q9", text:"I have strong standards for how things should be done and notice when they aren't.", sab:"stickler",      w:2},
  {id:"q10",text:"I sometimes feel my efforts go unrecognized, which really bothers me.",              sab:"victim",        w:2},
  {id:"q11",text:"I replay past mistakes and beat myself up about them.",                              sab:"judge",         w:1},
  {id:"q12",text:"I often say yes when I really want to say no.",                                      sab:"pleaser",       w:1},
  {id:"q13",text:"I struggle to delegate because I worry it won't be done right.",                     sab:"controller",    w:1},
  {id:"q14",text:"I jump from one project or idea to the next without finishing things.",              sab:"restless",      w:1},
  {id:"q15",text:"When I'm not being productive, I feel guilty.",                                      sab:"hyperAchiever", w:1},
  {id:"q16",text:"I judge others' mistakes as harshly as my own.",                                     sab:"judge",         w:1},
  {id:"q17",text:"I sometimes over-prepare just to feel safe.",                                        sab:"hyperVigilant", w:1},
  {id:"q18",text:"I suppress or minimize my own emotions in professional settings.",                   sab:"hyperRational", w:1},
  {id:"q19",text:"I hold myself (and sometimes others) to exacting standards.",                        sab:"stickler",      w:1},
  {id:"q20",text:"I focus on the positive to avoid dealing with something difficult.",                 sab:"avoider",       w:1},
];

function maxScore(k){return QUESTIONS.filter(q=>q.sab===k).reduce((s,q)=>s+q.w*5,0);}
function pct(score,k){return Math.round((score/maxScore(k))*100);}
function computeScores(ans){
  const s={};Object.keys(SABOTEURS).forEach(k=>s[k]=0);
  QUESTIONS.forEach(q=>{if(ans[q.id])s[q.sab]+=ans[q.id]*q.w;});
  return s;
}
function getTop(scores,n=3){return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k])=>k);}

// ── SHARED ────────────────────────────────────────────────────────────────────
function Btn({children,onClick,primary,ghost,disabled,style={}}){
  return(
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily:sans,fontSize:13,padding:"8px 18px",borderRadius:4,cursor:disabled?"default":"pointer",
      background:primary?(disabled?"#9A9690":B.chartreuse):ghost?"transparent":B.surface,
      border:`1px solid ${primary?(disabled?B.border:B.emerald):B.border}`,
      color:primary?(disabled?"#C8C4C0":"#FFFFFF"):B.night,
      opacity:disabled?0.6:1,...style
    }}>{children}</button>
  );
}

function TabBar({active,set,weatherCount,sabCount}){
  const tabs=[
    {id:"weather",  label:"Weather Map",   badge:weatherCount>0?`${weatherCount}/${MEMBERS.length}`:null},
    {id:"saboteurs",label:"Saboteurs",     badge:sabCount>0?`${sabCount}/${MEMBERS.length}`:null},
  ];
  return(
    <div style={{display:"flex",borderBottom:`2px solid ${B.border}`,marginBottom:"2rem"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>set(t.id)} style={{
          fontFamily:sans,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",
          padding:"0.65rem 1.25rem",background:"transparent",border:"none",
          borderBottom:active===t.id?`2px solid ${B.emerald}`:"2px solid transparent",
          color:active===t.id?B.emerald:B.seaSage,cursor:"pointer",marginBottom:-2,
          display:"flex",alignItems:"center",gap:8,
        }}>
          {t.label}
          {t.badge&&<span style={{fontSize:10,background:B.surface,border:`1px solid ${B.border}`,color:B.sage,borderRadius:10,padding:"1px 7px"}}>{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

function SessionWarning(){
  const[dismissed,setDismissed]=useState(false);
  if(dismissed)return null;
  return(
    <div style={{background:"#FFF8E1",border:`1px solid #F0C040`,borderRadius:8,padding:"0.875rem 1.25rem",marginBottom:"1.5rem",display:"flex",alignItems:"flex-start",gap:12}}>
      <span style={{fontSize:18,flexShrink:0,marginTop:1}}>⚠️</span>
      <div style={{flex:1}}>
        <p style={{fontFamily:sans,fontSize:13,color:"#7A5800",fontWeight:500,margin:"0 0 3px"}}>Save before you close</p>
        <p style={{fontFamily:sans,fontSize:12,color:"#9A7020",lineHeight:1.6,margin:0}}>This session lives in memory only. If anyone closes the app, all responses disappear. Use "Save to Notion" on the report screen before wrapping up — it takes 10 seconds and keeps everything forever.</p>
      </div>
      <button onClick={()=>setDismissed(true)} style={{background:"transparent",border:"none",color:"#C0A040",cursor:"pointer",fontSize:16,flexShrink:0,padding:0,lineHeight:1}}>✕</button>
    </div>
  );
}

// ── WEATHER TAB ───────────────────────────────────────────────────────────────
function WeatherTab({submissions,setSubmissions}){
  const[phase,setPhase]=useState("intro");
  const[currentName,setCurrentName]=useState("");
  const[weatherReport,setWeatherReport]=useState(null);
  const[generating,setGenerating]=useState(false);
  const[notionSaving,setNotionSaving]=useState(false);
  const[notionDone,setNotionDone]=useState(false);
  const[notionError,setNotionError]=useState(null);

  function handleSubmit(name,responses){setSubmissions(s=>({...s,[name]:{...responses}}));setPhase("waiting");}

  async function generateReport() {
  setGenerating(true);
  const summaries = Object.entries(submissions).map(([name, data]) =>
    `${name}:\n  ☀️ Sunny: ${data.sunny}\n  ☁️ Overcast: ${data.overcast}\n  ⛈️ Stormy: ${data.stormy}\n  🌈 Clear-up: ${data.clearup}`
  ).join("\n\n");

  try {
    const res = await fetch("/.netlify/functions/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summaries })
    });
    const data = await res.json();
    setWeatherReport(data.text);
  } catch (e) {
    setWeatherReport("Couldn't generate the report — but you have everything you need on screen to deliver it yourself!");
  }
  setGenerating(false);
}

  async function saveToNotion(saboteurResults) {
  setNotionSaving(true);
  setNotionError(null);
  try {
    await fetch("/.netlify/functions/save-to-notion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissions, sabResults: saboteurResults })
    });
    setNotionDone(true);
  } catch (e) {
    setNotionError("Couldn't save to Notion. Try again or screenshot the report as a backup.");
  }
  setNotionSaving(false);
}

  const names=Object.keys(submissions);

  if(phase==="intro")return(
    <div style={{maxWidth:520,margin:"0 auto"}}>
      <SessionWarning/>
      <p style={{fontFamily:sans,fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Team Weather Map<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontFamily:sans,fontSize:13,color:B.night,lineHeight:1.8,marginBottom:"2rem",opacity:0.7}}>A getting-to-know-you activity built around how we actually work. Fill out your four zones privately — then reveal and discuss as a group.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:"2rem"}}>
        {ZONES.map(z=>(
          <div key={z.id} style={{background:z.bg,border:`0.5px solid ${z.border}`,borderRadius:8,padding:"0.875rem"}}>
            <div style={{fontSize:18,marginBottom:5}}>{z.icon}</div>
            <div style={{fontFamily:sans,fontSize:12,color:z.text,marginBottom:3}}>{z.label}</div>
            <div style={{fontFamily:sans,fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{z.title}</div>
          </div>
        ))}
      </div>
      <label style={{fontFamily:sans,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,display:"block",marginBottom:8}}>Your name</label>
      <select onChange={e=>setCurrentName(e.target.value)} defaultValue="" style={{width:"100%",marginBottom:"1rem",fontSize:14,background:"#FFFFFF",color:B.night,border:`1px solid ${B.border}`,borderRadius:4,padding:"9px 10px"}}>
        <option value="">Select your name…</option>
        {MEMBERS.map(m=><option key={m} value={m}>{m}{submissions[m]?" ✓":""}</option>)}
      </select>
      <div style={{display:"flex",gap:10}}>
        <Btn primary onClick={()=>currentName&&setPhase("fill")} disabled={!currentName} style={{flex:1}}>Fill out my forecast →</Btn>
        {names.length>=2&&<Btn onClick={()=>setPhase("reveal")}>Reveal →</Btn>}
      </div>
      {names.length>0&&<p style={{fontFamily:sans,fontSize:12,color:B.seaSage,marginTop:12,textAlign:"center"}}>{names.length} of {MEMBERS.length} submitted · {names.join(", ")}</p>}
    </div>
  );

  if(phase==="fill")return<FillScreen name={currentName} onSubmit={r=>handleSubmit(currentName,r)} onBack={()=>setPhase("intro")}/>;

  if(phase==="waiting")return(
    <div style={{maxWidth:420,margin:"0 auto",textAlign:"center",fontFamily:sans}}>
      <div style={{fontSize:32,marginBottom:"1rem",color:B.chartreuse}}>✓</div>
      <h2 style={{fontFamily:serif,fontSize:"1.5rem",fontWeight:400,color:B.sage,marginBottom:"0.75rem"}}>Forecast submitted, {currentName}.</h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.8,marginBottom:"2rem"}}>
        {names.length} of {MEMBERS.length} in so far.<br/>
        <span style={{color:B.seaSage}}>{names.join(" · ")}</span>
      </p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <Btn onClick={()=>setPhase("intro")}>← Home</Btn>
        {names.length>=2&&<Btn primary onClick={()=>setPhase("reveal")}>Start reveal →</Btn>}
      </div>
    </div>
  );

  if(phase==="reveal")return<RevealScreen submissions={submissions} onHome={()=>setPhase("intro")} onReport={()=>setPhase("report")}/>;
  if(phase==="report")return<ReportScreen submissions={submissions} weatherReport={weatherReport} generating={generating} notionSaving={notionSaving} notionDone={notionDone} notionError={notionError} onGenerate={generateReport} onSaveToNotion={saveToNotion} onBack={()=>setPhase("reveal")} onHome={()=>setPhase("intro")}/>;
}

function FillScreen({name,onSubmit,onBack}){
  const[responses,setResponses]=useState({sunny:"",overcast:"",stormy:"",clearup:""});
  const[active,setActive]=useState("sunny");
  const zone=ZONES.find(z=>z.id===active);
  const zoneIdx=ZONES.findIndex(z=>z.id===active);
  const filledCount=ZONES.filter(z=>responses[z.id].trim()).length;
  const allFilled=filledCount===ZONES.length;
  return(
    <div style={{maxWidth:560,margin:"0 auto",fontFamily:sans}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage}}>{name}'s forecast</p>
        <button onClick={onBack} style={{fontSize:11,color:B.seaSage,background:"transparent",border:"none",cursor:"pointer"}}>← back</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {ZONES.map(z=>{
          const done=responses[z.id].trim().length>0;
          const isActive=active===z.id;
          return(
            <button key={z.id} onClick={()=>setActive(z.id)} style={{fontFamily:sans,fontSize:12,padding:"5px 14px",borderRadius:20,cursor:"pointer",fontWeight:isActive?500:400,transition:"all 0.15s",background:isActive?z.pill.bg:done?z.pill.bg+"44":"#E8E4E0",border:`1.5px solid ${isActive?z.pill.border:done?z.pill.border+"88":B.border}`,color:isActive?z.pill.text:done?"#444":"#888"}}>
              {z.icon} {z.label}{done?" ✓":""}
            </button>
          );
        })}
      </div>
      <div style={{background:zone.bg,border:`0.5px solid ${zone.border}`,borderRadius:10,padding:"1.5rem",marginBottom:"1.25rem"}}>
        <div style={{fontSize:22,marginBottom:"0.5rem"}}>{zone.icon}</div>
        <h2 style={{fontFamily:serif,fontSize:"1.2rem",fontWeight:400,color:zone.text,marginBottom:"0.75rem"}}>{zone.title}</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.75,marginBottom:"1.25rem"}}>{zone.hint}</p>
        <textarea value={responses[zone.id]} onChange={e=>setResponses(r=>({...r,[zone.id]:e.target.value}))} placeholder={zone.placeholder} rows={4} style={{width:"100%",background:"rgba(0,0,0,0.35)",border:`0.5px solid ${zone.border}`,borderRadius:6,color:"#FFFFFF",fontFamily:sans,fontSize:13,padding:"10px 12px",resize:"none",lineHeight:1.7,boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {zoneIdx>0&&<Btn onClick={()=>setActive(ZONES[zoneIdx-1].id)}>← Prev</Btn>}
          {zoneIdx<ZONES.length-1&&<Btn onClick={()=>setActive(ZONES[zoneIdx+1].id)}>Next →</Btn>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          {!allFilled&&<span style={{fontSize:11,color:B.seaSage}}>Fill all 4 zones to unlock submit</span>}
          <Btn primary onClick={()=>onSubmit(responses)} disabled={!allFilled}>{allFilled?"Submit ✓":`${filledCount}/4 complete`}</Btn>
        </div>
      </div>
    </div>
  );
}

function RevealScreen({submissions,onHome,onReport}){
  const names=Object.keys(submissions);
  const[idx,setIdx]=useState(0);
  const person=names[idx];
  const data=submissions[person];
  const prompt=DISCUSS[idx%DISCUSS.length](person);
  return(
    <div style={{maxWidth:700,margin:"0 auto",fontFamily:sans}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem"}}>
        <div>
          <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.seaSage,marginBottom:3}}>Weather report · {idx+1} of {names.length}</p>
          <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage}}>{person}</h2>
        </div>
        <button onClick={onHome} style={{fontSize:11,color:B.seaSage,background:"transparent",border:"none",cursor:"pointer",marginTop:4}}>← Home</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
        {ZONES.map(z=>(
          <div key={z.id} style={{background:z.bg,border:`0.5px solid ${z.border}`,borderRadius:10,padding:"1.25rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.75rem"}}>
              <span style={{fontSize:16}}>{z.icon}</span>
              <span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:z.text}}>{z.label}</span>
            </div>
            <p style={{fontFamily:serif,fontSize:"0.9rem",color:"#FFFFFF",lineHeight:1.75,margin:0,fontStyle:"italic"}}>"{data[z.id]}"</p>
          </div>
        ))}
      </div>
      <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:"1rem 1.25rem",marginBottom:"1.5rem"}}>
        <p style={{fontSize:10,color:B.sage,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Discuss</p>
        <p style={{fontSize:13,color:B.night,lineHeight:1.75,margin:0}}>{prompt}</p>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        {idx>0?<Btn onClick={()=>setIdx(i=>i-1)}>← {names[idx-1]}</Btn>:<div/>}
        {idx<names.length-1?<Btn primary onClick={()=>setIdx(i=>i+1)}>Next → {names[idx+1]}</Btn>:<Btn primary onClick={onReport}>Team report →</Btn>}
      </div>
    </div>
  );
}

function ReportScreen({submissions,weatherReport,generating,notionSaving,notionDone,notionError,onGenerate,onSaveToNotion,onBack,onHome}){
  const names=Object.keys(submissions);
  return(
    <div style={{maxWidth:700,margin:"0 auto",fontFamily:sans}}>
      <div style={{background:"#FFF8E1",border:`1px solid #F0C040`,borderRadius:8,padding:"1rem 1.25rem",marginBottom:"1.75rem",display:"flex",alignItems:"flex-start",gap:12}}>
        <span style={{fontSize:20,flexShrink:0}}>⚠️</span>
        <div>
          <p style={{fontSize:13,color:"#7A5800",fontWeight:500,margin:"0 0 3px"}}>Don't close this tab until you've saved</p>
          <p style={{fontSize:12,color:"#9A7020",lineHeight:1.6,margin:0}}>All responses live in memory only. Hit "Save to Notion" before anyone closes the app — it takes 10 seconds and keeps everything permanently.</p>
        </div>
      </div>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.4rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.4rem"}}>Our collective forecast<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.7,marginBottom:"2rem"}}>Everyone's climate, side by side.</p>
      {ZONES.map(z=>(
        <div key={z.id} style={{marginBottom:"2rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${B.border}`}}>
            <span style={{fontSize:18}}>{z.icon}</span>
            <div>
              <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage}}>{z.label}</div>
              <div style={{fontSize:12,color:B.night,opacity:0.6}}>{z.title}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
            {names.map(n=>(
              <div key={n} style={{background:z.bg,border:`0.5px solid ${z.border}`,borderRadius:8,padding:"0.875rem"}}>
                <p style={{fontSize:10,color:z.text,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{n}</p>
                <p style={{fontFamily:serif,fontSize:12,color:"rgba(255,255,255,0.85)",lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{submissions[n][z.id]}"</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:"1.25rem",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:weatherReport?"1rem":"0"}}>
          <div>
            <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,marginBottom:3}}>Team Weather Report</p>
            <p style={{fontSize:12,color:B.seaSage,margin:0}}>AI-generated wrap-up script based on everyone's responses</p>
          </div>
          {!weatherReport&&<Btn primary onClick={onGenerate} disabled={generating}>{generating?"Generating…":"Generate report ✦"}</Btn>}
        </div>
        {weatherReport&&<div style={{fontSize:13,color:B.night,lineHeight:1.85,whiteSpace:"pre-wrap",opacity:0.85}}>{weatherReport}</div>}
      </div>
      <div style={{background:B.surface,border:`1px solid ${notionDone?"#2a6a3a":B.border}`,borderRadius:8,padding:"1.25rem",marginBottom:"1.5rem"}}>
        {notionDone?(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>✅</span>
            <div>
              <p style={{fontSize:13,color:B.emerald,fontWeight:500,margin:"0 0 2px"}}>Saved to Notion</p>
              <p style={{fontSize:12,color:B.seaSage,margin:0}}>Find it under "Experience Team Offsite 2026" in your workspace.</p>
            </div>
          </div>
        ):(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,marginBottom:3}}>Save to Notion</p>
              <p style={{fontSize:12,color:B.seaSage,margin:0}}>Creates "Experience Team Offsite 2026" with a page per person</p>
            </div>
            <Btn primary onClick={()=>onSaveToNotion({})} disabled={notionSaving}>{notionSaving?"Saving…":"Save to Notion →"}</Btn>
          </div>
        )}
        {notionError&&<p style={{fontSize:12,color:"#cc4444",marginTop:10,margin:0}}>{notionError}</p>}
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn onClick={onBack}>← Back to reveal</Btn>
        <Btn onClick={onHome}>Home</Btn>
      </div>
    </div>
  );
}

// ── SABOTEURS TAB ─────────────────────────────────────────────────────────────
function SaboteursTab({sabResults,setSabResults}){
  const[phase,setPhase]=useState("intro");
  const[name,setName]=useState("");
  const[answers,setAnswers]=useState({});
  const[currentQ,setCurrentQ]=useState(0);
  const[selectedSab,setSelectedSab]=useState(null);
  const[viewTeam,setViewTeam]=useState(false);

  function handleAnswer(val){
    const q=QUESTIONS[currentQ];
    const newAns={...answers,[q.id]:val};
    setAnswers(newAns);
    if(currentQ<QUESTIONS.length-1){setCurrentQ(currentQ+1);}
    else{
      const scores=computeScores(newAns);
      const top=getTop(scores);
      setSabResults(prev=>({...prev,[name]:{top,scores}}));
      setSelectedSab(top[0]);setPhase("results");
    }
  }

  const submittedNames=Object.keys(sabResults);

  if(viewTeam){
    const sabCounts={};Object.keys(SABOTEURS).forEach(k=>sabCounts[k]=0);
    submittedNames.forEach(n=>sabResults[n].top.forEach(k=>sabCounts[k]++));
    const teamTop=Object.entries(sabCounts).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    return(
      <div style={{maxWidth:680,margin:"0 auto",fontFamily:sans}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.seaSage,marginBottom:4}}>{submittedNames.length} members completed</p>
        <h2 style={{fontFamily:serif,fontSize:"1.6rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Team saboteur summary</h2>
        <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.6,marginBottom:"2rem"}}>Which inner critics show up most across the team?</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginBottom:"2rem"}}>
          {submittedNames.map(n=>(
            <div key={n} style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:12,padding:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:B.surface,border:`1px solid ${B.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color:B.sage}}>{n[0]}</div>
                <span style={{fontSize:14,fontWeight:500,color:B.night}}>{n}</span>
              </div>
              {sabResults[n].top.map((k,j)=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontSize:11,color:B.sage,width:14}}>{j+1}.</span>
                  <span style={{fontSize:13,color:B.night,opacity:0.8}}>{SABOTEURS[k].name}</span>
                  <span style={{fontSize:11,color:B.seaSage,marginLeft:"auto"}}>{pct(sabResults[n].scores[k],k)}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,marginBottom:12}}>Most common across the team</p>
        {teamTop.map(([k,count])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <span style={{fontFamily:sans,fontSize:13,color:B.night,opacity:0.8,width:140,flexShrink:0}}>{SABOTEURS[k].name}</span>
            <div style={{flex:1,height:4,background:B.surface,borderRadius:2,border:`1px solid ${B.border}`}}>
              <div style={{height:"100%",width:`${(count/submittedNames.length)*100}%`,background:B.chartreuse,borderRadius:2}}/>
            </div>
            <span style={{fontSize:11,color:B.seaSage,width:60,textAlign:"right"}}>{count} of {submittedNames.length}</span>
          </div>
        ))}
        <div style={{marginTop:"1.5rem"}}><Btn onClick={()=>setViewTeam(false)}>← Back</Btn></div>
      </div>
    );
  }

  if(phase==="intro")return(
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.4rem"}}>Saboteurs assessment<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.8,marginBottom:"2rem"}}>20 questions · ~3 minutes · Discover your inner critics and how they show up at work. Your results will inform your "Stormy" zone in the Weather Map.</p>
      <label style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,display:"block",marginBottom:8}}>Your name</label>
      <select defaultValue="" onChange={e=>setName(e.target.value)} style={{width:"100%",marginBottom:"1rem",fontSize:14,background:"#FFFFFF",color:B.night,border:`1px solid ${B.border}`,borderRadius:4,padding:"9px 10px"}}>
        <option value="">Select your name…</option>
        {MEMBERS.map(m=><option key={m} value={m}>{m}{sabResults[m]?" ✓":""}</option>)}
      </select>
      <div style={{display:"flex",gap:10}}>
        <Btn primary onClick={()=>name&&setPhase("quiz")} disabled={!name} style={{flex:1}}>Start assessment →</Btn>
        {submittedNames.length>=2&&<Btn onClick={()=>setViewTeam(true)}>Team view →</Btn>}
      </div>
      {submittedNames.length>0&&(
        <div style={{marginTop:"1.5rem",background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:6,padding:"1rem"}}>
          <p style={{fontSize:11,color:B.sage,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Completed</p>
          {submittedNames.map(n=>(
            <div key={n} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
              <span style={{fontSize:13,color:B.night}}>{n}</span>
              <span style={{fontSize:12,color:B.seaSage}}>· {sabResults[n].top.slice(0,2).map(k=>SABOTEURS[k].name).join(", ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if(phase==="quiz"){
    const q=QUESTIONS[currentQ];
    const prog=Math.round((currentQ/QUESTIONS.length)*100);
    return(
      <div style={{maxWidth:480,margin:"0 auto",fontFamily:sans}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.5rem"}}>
          <span style={{fontSize:12,color:B.seaSage}}>{currentQ+1} of {QUESTIONS.length}</span>
          <span style={{fontSize:12,color:B.seaSage}}>{name}</span>
        </div>
        <div style={{height:3,background:B.surface,border:`1px solid ${B.border}`,borderRadius:2,marginBottom:"2rem"}}>
          <div style={{height:"100%",width:`${prog}%`,background:B.chartreuse,borderRadius:2,transition:"width 0.3s"}}/>
        </div>
        <p style={{fontFamily:serif,fontSize:"1.15rem",lineHeight:1.65,color:B.night,marginBottom:"2rem"}}>{q.text}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[1,2,3,4,5].map(v=>(
            <button key={v} onClick={()=>handleAnswer(v)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",textAlign:"left",background:answers[q.id]===v?B.surface:"#FFFFFF",border:`1px solid ${answers[q.id]===v?B.emerald:B.border}`,borderRadius:4,cursor:"pointer",fontFamily:sans}}>
              <span style={{width:22,height:22,borderRadius:"50%",background:answers[q.id]===v?B.chartreuse:"transparent",border:`1px solid ${answers[q.id]===v?B.emerald:B.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:answers[q.id]===v?"#FFFFFF":B.sage,flexShrink:0}}>{v}</span>
              <span style={{fontSize:13,color:B.night,opacity:0.8}}>{v===1?"Never":v===2?"Rarely":v===3?"Sometimes":v===4?"Often":"Always"}</span>
            </button>
          ))}
        </div>
        {currentQ>0&&<button onClick={()=>setCurrentQ(currentQ-1)} style={{marginTop:"1.5rem",fontSize:12,color:B.seaSage,background:"transparent",border:"none",cursor:"pointer",padding:0}}>← back</button>}
      </div>
    );
  }

  if(phase==="results"){
    const myResult=sabResults[name];
    const sorted=Object.entries(myResult.scores).sort((a,b)=>b[1]-a[1]);
    const sKey=selectedSab||myResult.top[0];
    const sab=SABOTEURS[sKey];
    return(
      <div style={{maxWidth:560,margin:"0 auto",fontFamily:sans}}>
        <p style={{fontSize:11,color:B.seaSage,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{name}'s results</p>
        <h2 style={{fontFamily:serif,fontSize:"1.6rem",fontWeight:400,color:B.sage,marginBottom:"1.25rem"}}>Your top saboteurs</h2>
        <div style={{display:"flex",gap:8,marginBottom:"1.5rem",flexWrap:"wrap"}}>
          {myResult.top.map((k,i)=>(
            <div key={k} style={{padding:"5px 14px",borderRadius:20,fontSize:13,background:i===0?B.chartreuse:B.surface,color:i===0?"#FFFFFF":B.night,border:`1px solid ${i===0?B.emerald:B.border}`}}>
              {i+1}. {SABOTEURS[k].name}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
          {sorted.map(([k])=>(
            <button key={k} onClick={()=>setSelectedSab(k)} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:sKey===k?B.surface:"transparent",border:`1px solid ${sKey===k?B.emerald:B.border}`,color:sKey===k?B.sage:B.seaSage,cursor:"pointer",fontFamily:sans}}>
              {SABOTEURS[k].name}
            </button>
          ))}
        </div>
        <div style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:8,padding:"1.25rem",marginBottom:"1.5rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:B.surface,border:`1px solid ${B.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:B.chartreuse,fontSize:16}}>✦</div>
            <div>
              <p style={{fontFamily:serif,fontWeight:400,margin:0,fontSize:15,color:B.sage}}>{sab.name}</p>
              <p style={{fontSize:11,color:B.seaSage,margin:0}}>{pct(myResult.scores[sKey],sKey)}% activation</p>
            </div>
          </div>
          <p style={{fontSize:13,lineHeight:1.7,color:B.night,opacity:0.8,marginBottom:12}}>{sab.desc}</p>
          <div style={{marginBottom:12}}>
            <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,margin:"0 0 6px"}}>Signs it's active</p>
            {sab.signs.map((s,i)=><p key={i} style={{fontSize:12,margin:"0 0 3px",color:B.night,opacity:0.75}}>· {s}</p>)}
          </div>
          <div style={{borderTop:`1px solid ${B.border}`,paddingTop:10}}>
            <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,margin:"0 0 4px"}}>The hidden gift</p>
            <p style={{fontSize:12,color:B.night,opacity:0.75,margin:0}}>{sab.gift}</p>
          </div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          {sorted.map(([k,score])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
              <span style={{fontSize:12,width:130,color:myResult.top.includes(k)?B.night:B.seaSage,opacity:myResult.top.includes(k)?1:0.6,flexShrink:0}}>{SABOTEURS[k].name}</span>
              <div style={{flex:1,height:4,background:B.surface,border:`1px solid ${B.border}`,borderRadius:2}}>
                <div style={{height:"100%",width:`${pct(score,k)}%`,background:myResult.top[0]===k?B.chartreuse:myResult.top.includes(k)?B.seaSage:B.border,borderRadius:2,transition:"width 0.5s"}}/>
              </div>
              <span style={{fontSize:11,color:B.seaSage,width:30,textAlign:"right"}}>{pct(score,k)}%</span>
            </div>
          ))}
        </div>
        <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
          <p style={{fontSize:11,color:B.sage,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Next step</p>
          <p style={{fontSize:13,color:B.night,opacity:0.8,lineHeight:1.7,margin:0}}>Head to the <strong style={{color:B.sage,fontWeight:500}}>Weather Map</strong> tab and fill out your four zones. Your Stormy zone is a great place to describe what your top saboteur looks like in practice — in your own words.</p>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn onClick={()=>{setPhase("intro");setAnswers({});setCurrentQ(0);setName("");}}>Take again</Btn>
          {submittedNames.length>=2&&<Btn primary onClick={()=>setViewTeam(true)}>View team summary →</Btn>}
        </div>
      </div>
    );
  }
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("weather");
  const[submissions,setSubmissions]=useState({});
  const[sabResults,setSabResults]=useState({});
  return(
    <div style={{background:B.bg,minHeight:"100vh",padding:"2rem 1.5rem",color:B.night}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{marginBottom:"1.5rem"}}>
          <p style={{fontFamily:sans,fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.3rem"}}>Experience Team · Offsite 2026</p>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}>
            <h1 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.emerald}}>Notable</h1>
            <span style={{fontFamily:serif,fontSize:"1.75rem",color:B.sage}}>.</span>
          </div>
        </div>
        <TabBar active={tab} set={setTab} weatherCount={Object.keys(submissions).length} sabCount={Object.keys(sabResults).length}/>
        {tab==="weather"&&<WeatherTab submissions={submissions} setSubmissions={setSubmissions}/>}
        {tab==="saboteurs"&&<SaboteursTab sabResults={sabResults} setSabResults={setSabResults}/>}
        <div style={{marginTop:"3rem",borderTop:`1px solid ${B.border}`,paddingTop:"1.25rem",textAlign:"center",fontFamily:sans,fontSize:11,letterSpacing:"0.08em",color:B.seaSage}}>
          Notable<span style={{color:B.sage}}>.</span> &nbsp;·&nbsp; Experience Team
        </div>
      </div>
    </div>
  );
}
