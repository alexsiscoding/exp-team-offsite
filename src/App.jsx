import { useState, useEffect } from "react";

const B = {
  bg:        "#F6F3F2",
  surface:   "#EDEAE8",
  night:     "#020503",
  sage:      "#6F815C",
  seaSage:   "#95A78D",
  emerald:   "#053F33",
  chartreuse:"#638E4F",
  border:    "#C8C4C0",
};
const sans  = "'Helvetica Neue', Arial, sans-serif";
const serif = "Georgia, serif";
const MEMBERS = ["Alexsis","Andrew","Anna","Chris","Kandi","Kelly"];
const ELEVATE = ["Efficiency","Learning","Expertise","Vision","Accountability","Teamwork","Engagement"];

const ZONES = [
  { id:"sunny",    icon:"☀️", label:"Sunny",        title:"At my best, I…",                          hint:"Describe your behaviors, mindset, and how you engage with others when you're feeling energized, focused, and effective. How does this connect with ELEVATE?",           placeholder:"e.g. I bring clarity to ambiguous situations and energize others around shared goals. I connect to Teamwork and Vision.",   bg:"#0f1a05", border:"#3a6a0a", text:"#a8d870", pill:{bg:"#f5c842",border:"#e6b800",text:"#5a3e00"} },
  { id:"overcast", icon:"☁️", label:"Overcast",     title:"Early signs I'm stressed…",               hint:"The subtle, early clues that you're starting to feel pressure. These are the small behavioral changes or shifts others might notice before things escalate.",            placeholder:"e.g. I get quieter in meetings. I start asking more questions than usual. My responses get shorter.",                    bg:"#0d0d20", border:"#3a3a6a", text:"#a0a8e8", pill:{bg:"#a0b8d8",border:"#7090b8",text:"#1a2e4a"} },
  { id:"stormy",   icon:"⛈️", label:"Stormy",       title:"When I'm overwhelmed, you might notice…",  hint:"What it looks like when you're at capacity or under significant stress. Be honest about how you show up when things feel difficult.",                                   placeholder:"e.g. I withdraw and stop asking for help. I can become overly focused on details and lose sight of the bigger picture.",   bg:"#1a0d05", border:"#6a3a0a", text:"#e0a870", pill:{bg:"#7b5ea7",border:"#5a3d8a",text:"#f0eaff"} },
  { id:"clearup",  icon:"🌈", label:"The clear-up", title:"How others can help…",                     hint:"What support is actually useful when you're stressed or overwhelmed. Be specific about what helps you reset, refocus, or move forward.",                                placeholder:"e.g. Give me 15 minutes to decompress, then check in with 'do you need to talk it through or just vent?'",               bg:"#05101a", border:"#0a3a5a", text:"#70b8d8", pill:{bg:"#4caf89",border:"#2e8a60",text:"#0a2e1e"} },
];

const DISCUSS = [
  n=>`Does anything in ${n}'s forecast surprise you? What resonates most?`,
  n=>`Which ELEVATE principle shows up most in ${n}'s sunny zone?`,
  n=>`Looking at ${n}'s clear-up — is there a specific commitment someone wants to make?`,
  n=>`Does ${n}'s stormy zone connect to anyone else's? What does that mean for how you work together?`,
  n=>`What's one thing you'd want ${n} to know you'll do differently after seeing their forecast?`,
  n=>`How does ${n}'s overcast zone help the team show up better for them day-to-day?`,
];

const SABOTEURS = {
  judge:         { name:"The Judge",       emoji:"⚖️",  desc:"The master saboteur that lives in everyone. It finds fault with yourself, others, and circumstances — and turns mistakes into lasting shame or resentment.",                                                                                        work:"At work, The Judge shows up as harsh self-criticism after mistakes, holding others to impossibly high standards, and difficulty moving forward after setbacks. It can make feedback feel like an attack rather than an opportunity.",                                       signs:["Replays past mistakes repeatedly","Highly critical of self and others","Turns small errors into big failures","Struggles to celebrate wins","Holds grudges or resentment toward others","Difficult to receive feedback without defensiveness"], gift:"Sharp discernment, high standards, strong accountability", famousQuote:null, famousPerson:null },
  avoider:       { name:"Avoider",          emoji:"🌿",  desc:"Focuses on the positive and pleasant to avoid difficult tasks, conflict, and hard conversations — often until it's too late.",                                                                                                                       work:"At work, Avoider shows up as procrastinating on tough decisions, sidestepping conflict, over-prioritizing pleasant tasks, and difficulty delivering hard news or feedback.",                                                                                               signs:["Delays difficult conversations","Changes subject when tension arises","Keeps busy with low-priority tasks","Agrees to keep the peace","Minimizes or dismisses serious issues","Struggles to set limits with others"],                         gift:"Positivity, pleasure in the moment, natural harmony-builder", famousQuote:null, famousPerson:null },
  controller:    { name:"Controller",       emoji:"🎯",  desc:"An anxiety-driven need to take charge and control outcomes — including bending people and situations to a specific will.",                                                                                                                          work:"At work, Controller shows up as micromanaging, difficulty trusting teammates, frustration when things go off-plan, and a tendency to take over rather than collaborate.",                                                                                                  signs:["Struggles to hand off tasks","Frustrated when direction isn't followed","Takes over when things feel uncertain","Difficulty sitting with ambiguity","Can come across as domineering","Needs to know every detail"],                           gift:"Decisive, action-oriented, excellent in high-pressure situations", famousQuote:null, famousPerson:null },
  hyperAchiever: { name:"Hyper-Achiever",   emoji:"🏆",  desc:"Dependent on constant performance and achievement for self-worth. Self-esteem is tied to the last result, not internal value.",                                                                                                                     work:"At work, Hyper-Achiever shows up as difficulty resting, guilt during slow periods, overworking, comparing output to others, and struggling to disconnect from work identity.",                                                                                             signs:["Self-worth rises and falls with results","Guilt when not producing","Compares own output to teammates","Difficulty celebrating 'enough'","Overcommits to prove value","Struggles to ask for help"],                                         gift:"High drive, ambition, strong results-orientation", famousQuote:null, famousPerson:null },
  hyperRational: { name:"Hyper-Rational",   emoji:"🔬",  desc:"Overreliance on logic and analysis — to the point of dismissing or minimizing emotions in themselves and others.",                                                                                                                                 work:"At work, Hyper-Rational shows up as seeming cold or detached, dismissing team morale concerns, prioritizing efficiency over connection, and struggling with empathy in conflict.",                                                                                         signs:["Dismisses emotional concerns as unimportant","Seen as cold or disconnected","Frustrated by 'irrational' behavior","Skips the human side of decisions","Struggles with ambiguous or people-centered problems","Difficulty showing vulnerability"], gift:"Clear-headed thinking, objectivity, analytical precision", famousQuote:null, famousPerson:null },
  hyperVigilant: { name:"Hyper-Vigilant",   emoji:"👁️", desc:"Persistent anxiety about what could go wrong. Always scanning for danger, risk, or failure — even when things are going well.",                                                                                                                    work:"At work, Hyper-Vigilant shows up as over-preparing, catastrophizing, difficulty relaxing into good news, and slowing down decisions with excessive risk analysis.",                                                                                                        signs:["Anticipates worst-case scenarios constantly","Difficulty trusting that things are actually okay","Over-prepares for every situation","Second-guesses decisions after the fact","Feels responsible for preventing all bad outcomes","Struggle to enjoy success before moving to the next worry"], gift:"Thorough preparation, risk awareness, anticipates problems early", famousQuote:null, famousPerson:null },
  pleaser:       { name:"Pleaser",           emoji:"🤝",  desc:"Gains acceptance and love by focusing on helping, pleasing, and flattering others — often at the expense of their own needs.",                                                                                                                     work:"At work, Pleaser shows up as difficulty saying no, over-helping to the point of burnout, avoiding feedback that might disappoint, and needing approval to feel secure.",                                                                                                   signs:["Says yes when they mean no","Struggles to set limits with colleagues","Over-invests in others' happiness","Needs approval to feel valued","Avoids disappointing others at all costs","Takes on too much to seem helpful"],                    gift:"Empathetic, generous, deeply collaborative", famousQuote:null, famousPerson:null },
  restless:      { name:"Restless",          emoji:"⚡",  desc:"Constantly seeking the next exciting thing — rarely at peace with the present. Novelty is safety; stillness feels like stagnation.",                                                                                                               work:"At work, Restless shows up as losing interest in projects mid-way, jumping to new ideas before finishing current ones, difficulty with routine, and being hard to pin down.",                                                                                              signs:["Moves quickly from one project to the next","Bored by repetitive or routine work","Starts things more easily than finishing them","Needs constant stimulation to stay engaged","Can seem scattered or uncommitted","Struggles with long, slow-burn initiatives"], gift:"High energy, creative curiosity, thrives in fast-moving environments", famousQuote:null, famousPerson:null },
  stickler:      { name:"Stickler",          emoji:"📐",  desc:"Perfectionism and an intense need for order and structure. Turns everything into a 'should' or 'must' — for themselves and others.",                                                                                                               work:"At work, Stickler shows up as difficulty letting go of details, frustration with messy processes, holding others to rigid standards, and getting stuck in 'perfect' rather than 'done'.",                                                                                  signs:["Difficulty letting 'good enough' be enough","Strong frustration with disorder","High standards that extend to teammates","Gets stuck refining rather than finishing","Finds it hard to delegate to a different process","Can slow teams down with over-editing"], gift:"Reliable, precise, sets the bar for quality", famousQuote:null, famousPerson:null },
  victim:        { name:"Victim",            emoji:"🫂",  desc:"Uses emotional intensity and a sense of being wronged to gain attention, connection, or sympathy — often without realizing it.",                                                                                                                   work:"At work, Victim shows up as feeling overlooked or unappreciated, taking feedback personally, building resentment quietly, and sometimes using struggle to connect with others.",                                                                                           signs:["Feels effort often goes unrecognized","Takes criticism personally","Builds quiet resentment over time","Uses stress or hardship to bond with others","Difficulty separating identity from setbacks","Can feel like the team doesn't understand their contribution"], gift:"Deep emotional sensitivity, strong sense of fairness and injustice", famousQuote:null, famousPerson:null },
};

const SAB_KEYS = Object.keys(SABOTEURS);

const QUESTIONS = [
  {id:"q1", text:"I often notice what's wrong before I notice what's right.",                            sab:"judge",         w:2},
  {id:"q2", text:"I tend to avoid difficult conversations until I absolutely have to.",                  sab:"avoider",       w:2},
  {id:"q3", text:"I find it hard to trust others to do things the way they should be done.",            sab:"controller",    w:2},
  {id:"q4", text:"My sense of worth is deeply tied to what I accomplish.",                              sab:"hyperAchiever", w:2},
  {id:"q5", text:"I prefer to analyze problems logically rather than talk about feelings.",             sab:"hyperRational", w:2},
  {id:"q6", text:"Even when things are going well, I find myself looking for what could go wrong.",     sab:"hyperVigilant", w:2},
  {id:"q7", text:"I often put others' needs ahead of my own — sometimes to my detriment.",             sab:"pleaser",       w:2},
  {id:"q8", text:"I get bored easily and am always looking for the next exciting thing.",              sab:"restless",      w:2},
  {id:"q9", text:"I have strong standards for how things should be done and notice when they aren't.", sab:"stickler",      w:2},
  {id:"q10",text:"I sometimes feel my efforts go unrecognized, which really bothers me.",              sab:"victim",        w:2},
  {id:"q11",text:"I replay past mistakes and beat myself up about them.",                              sab:"judge",         w:1},
  {id:"q12",text:"I often say yes when I really want to say no.",                                      sab:"pleaser",       w:1},
  {id:"q13",text:"I struggle to hand things off because I worry they won't be done right.",            sab:"controller",    w:1},
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
function computeScores(ans){const s={};Object.keys(SABOTEURS).forEach(k=>s[k]=0);QUESTIONS.forEach(q=>{if(ans[q.id])s[q.sab]+=ans[q.id]*q.w;});return s;}
function getTop(scores,n=3){return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k])=>k);}

function Btn({children,onClick,primary,disabled,style={}}){
  return(<button onClick={onClick} disabled={disabled} style={{fontFamily:sans,fontSize:13,padding:"8px 18px",borderRadius:4,cursor:disabled?"default":"pointer",background:primary?(disabled?"#9A9690":B.chartreuse):"transparent",border:`1px solid ${primary?(disabled?B.border:B.emerald):B.border}`,color:primary?(disabled?"#C8C4C0":"#FFFFFF"):B.night,opacity:disabled?0.6:1,...style}}>{children}</button>);
}

function ElevateFooter(){
  return(
    <div style={{marginTop:"3rem",borderTop:`1px solid ${B.border}`,paddingTop:"1.5rem",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
        {"ELEVATE".split("").map((l,i)=>(
          <span key={i} style={{fontFamily:serif,fontSize:15,fontWeight:400,color:[B.emerald,B.sage,B.chartreuse,B.seaSage,B.emerald,B.sage,B.chartreuse][i]}}>{l}</span>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
        {ELEVATE.map((w,i)=>(
          <span key={i} style={{fontFamily:sans,fontSize:10,letterSpacing:"0.08em",color:B.seaSage,textTransform:"uppercase"}}>
            {w}{i<ELEVATE.length-1&&<span style={{color:B.border,marginLeft:8}}>·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function TabBar({active,set,weatherCount,sabCount}){
  const tabs=[
    {id:"welcome",label:"Welcome"},
    {id:"guide",label:"Saboteur guide"},
    {id:"saboteurs",label:"Saboteurs",badge:sabCount>0?`${sabCount}/${MEMBERS.length}`:null},
    {id:"weather",label:"Weather map",badge:weatherCount>0?`${weatherCount}/${MEMBERS.length}`:null},
    {id:"facilitator",label:"·",title:"Facilitator"},
  ];
  return(
    <div style={{display:"flex",borderBottom:`2px solid ${B.border}`,marginBottom:"2rem",flexWrap:"wrap"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>set(t.id)} title={t.title||t.label} style={{fontFamily:sans,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",padding:"0.65rem 1rem",background:"transparent",border:"none",borderBottom:active===t.id?`2px solid ${B.emerald}`:"2px solid transparent",color:active===t.id?B.emerald:t.id==="facilitator"?B.border:B.seaSage,cursor:"pointer",marginBottom:-2,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          {t.label}
          {t.badge&&<span style={{fontSize:10,background:B.surface,border:`1px solid ${B.border}`,color:B.sage,borderRadius:10,padding:"1px 6px"}}>{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── WELCOME TAB ────────────────────────────────────────────────────────────
function WelcomeTab({setTab}){
  return(
    <div style={{maxWidth:580,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Welcome<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,lineHeight:1.8,marginBottom:"2rem",opacity:0.75}}>This is a getting-to-know-you activity built around how we actually work — not a personality test, not a therapy session. You describe your own experience, and we learn how to show up better for each other.</p>

      {/* Before */}
      <div style={{marginBottom:"1.5rem"}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,marginBottom:"0.75rem"}}>Before the offsite</p>
        <div style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:8,padding:"1rem 1.25rem"}}>
          <p style={{fontSize:13,color:B.night,lineHeight:1.8,margin:0,opacity:0.8}}>
            Review the <button onClick={()=>setTab("guide")} style={{background:"none",border:"none",padding:0,color:B.chartreuse,cursor:"pointer",fontSize:13,textDecoration:"underline",fontFamily:sans}}>Saboteur guide</button> for a shared understanding, then complete the assessment and Weather Map on your own time (about 20 minutes total). Your Saboteur results will be emailed to you for future reference — you can also view them within the assessment tab during your current session. Your Weather Map responses will stay visible on your results screen during your session. Your responses will be saved to our Experience Team Forecast page — a living record we can revisit as our team grows, changes, or simply wants to check in on where we're all at.
          </p>
        </div>
      </div>

      {/* During */}
      <div style={{marginBottom:"1.5rem"}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,marginBottom:"0.75rem"}}>During the offsite</p>
        <div style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:8,padding:"1rem 1.25rem"}}>
          <p style={{fontSize:13,color:B.night,lineHeight:1.8,margin:0,opacity:0.8}}>
            We'll review forecasts together — no additional prep needed.
          </p>
        </div>
      </div>

      {/* After / what happens */}
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,marginBottom:"0.75rem"}}>What happens during the reveal</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {icon:"👥",text:"Reveal screen — we go through each person's forecast one at a time, with a discussion prompt for the group."},
            {icon:"📋",text:"Collective report — everyone's responses side by side, so you can see patterns across the team."},
            {icon:"✦", text:"AI wrap-up — a generated Team Weather Report script that summarizes our collective strengths, stress signals, and commitments."},
            {icon:"💾",text:"Saved to Notion — all responses are stored as you go, so nothing is lost if you close the tab."},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"0.875rem 1rem",background:B.surface,borderRadius:6}}>
              <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
              <p style={{fontSize:12,color:B.night,opacity:0.75,lineHeight:1.65,margin:0}}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#F0F7F0",border:`1px solid #B8D4B8`,borderRadius:8,padding:"1rem 1.25rem",marginBottom:"1rem"}}>
        <p style={{fontSize:12,color:B.emerald,lineHeight:1.7,margin:0}}><strong style={{fontWeight:500}}>A note on privacy:</strong> Everything you share is yours. The goal is to help the team understand each other better — not to put anyone in a box. There are no right or wrong answers.</p>
      </div>
      <Btn primary onClick={()=>setTab("guide")} style={{width:"100%",marginTop:"0.5rem"}}>Start with the Saboteur guide →</Btn>
      <ElevateFooter/>
    </div>
  );
}

// ─── GUIDE TAB ───────────────────────────────────────────────────────────────
function GuideTab({setTab}){
  const[open,setOpen]=useState(null);
  return(
    <div style={{maxWidth:620,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Reference</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Saboteur field guide<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,lineHeight:1.8,marginBottom:"2rem",opacity:0.75}}>We all have inner critics — mental patterns that show up under stress and get in our way. These are the 10 saboteur types. Read through before taking the assessment. Tap any card to learn more.</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:"2rem"}}>
        {Object.keys(SABOTEURS).map(k=>{
          const s=SABOTEURS[k];const isOpen=open===k;
          return(
            <div key={k} style={{background:"#FFFFFF",border:`1px solid ${isOpen?B.emerald:B.border}`,borderRadius:8,overflow:"hidden"}}>
              <button onClick={()=>setOpen(isOpen?null:k)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.875rem 1rem",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{s.emoji}</span><span style={{fontFamily:serif,fontSize:15,color:B.sage,fontWeight:400}}>{s.name}</span></div>
                <span style={{fontSize:12,color:B.seaSage,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
              </button>
              {isOpen&&(
                <div style={{padding:"0 1rem 1.25rem",borderTop:`1px solid ${B.border}`}}>
                  <p style={{fontSize:13,color:B.night,lineHeight:1.75,marginBottom:"1rem",opacity:0.8,marginTop:"0.875rem"}}>{s.desc}</p>
                  <div style={{background:B.surface,borderRadius:6,padding:"0.875rem",marginBottom:"0.875rem"}}>
                    <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 6px"}}>How it shows up at work</p>
                    <p style={{fontSize:12,color:B.night,lineHeight:1.7,margin:0,opacity:0.8}}>{s.work}</p>
                  </div>
                  <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 6px"}}>Signs it's active</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:"0.875rem"}}>
                    {s.signs.map((sign,i)=><p key={i} style={{fontSize:12,color:B.night,opacity:0.75,margin:0,lineHeight:1.5}}>· {sign}</p>)}
                  </div>
                  <div style={{borderTop:`1px solid ${B.border}`,paddingTop:"0.75rem"}}>
                    <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 4px"}}>The hidden gift</p>
                    <p style={{fontSize:12,color:B.chartreuse,margin:0}}>{s.gift}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Btn primary onClick={()=>setTab("saboteurs")} style={{width:"100%"}}>Take the assessment →</Btn>
      <ElevateFooter/>
    </div>
  );
}

// ─── SABOTEURS TAB ────────────────────────────────────────────────────────────
function SaboteursTab({sabResults,setSabResults,setTab}){
  const[phase,setPhase]=useState("intro");
  const[name,setName]=useState("");
  const[answers,setAnswers]=useState({});
  const[currentQ,setCurrentQ]=useState(0);
  const[selectedSab,setSelectedSab]=useState(null);
  const[viewTeam,setViewTeam]=useState(false);
  const submittedNames=Object.keys(sabResults);

  async function handleAnswer(val){
    const q=QUESTIONS[currentQ];const newAns={...answers,[q.id]:val};setAnswers(newAns);
    if(currentQ<QUESTIONS.length-1){setCurrentQ(currentQ+1);}
    else{
      const scores=computeScores(newAns);const top=getTop(scores);
      try{await fetch("/.netlify/functions/save-saboteurs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,top,scores})});}
      catch(e){console.error("Save failed",e);}
      setSabResults(prev=>({...prev,[name]:{top,scores}}));setSelectedSab(top[0]);setPhase("results");
    }
  }

  if(viewTeam){
    const sabCounts={};Object.keys(SABOTEURS).forEach(k=>sabCounts[k]=0);
    submittedNames.forEach(n=>sabResults[n].top.forEach(k=>sabCounts[k]++));
    const teamTop=Object.entries(sabCounts).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    return(
      <div style={{maxWidth:680,margin:"0 auto",fontFamily:sans}}>
        <h2 style={{fontFamily:serif,fontSize:"1.6rem",fontWeight:400,color:B.sage,marginBottom:"1.5rem"}}>Team saboteur summary</h2>
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
        <ElevateFooter/>
      </div>
    );
  }

  if(phase==="intro")return(
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.4rem"}}>Saboteurs assessment<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.8,marginBottom:"0.75rem"}}>20 questions · ~3 minutes · Discover your top inner critics and how they show up at work.</p>
      <p style={{fontSize:12,color:B.seaSage,lineHeight:1.7,marginBottom:"2rem"}}>Not sure what a saboteur is? Check out the <button onClick={()=>setTab("guide")} style={{background:"none",border:"none",padding:0,color:B.chartreuse,cursor:"pointer",fontSize:12,textDecoration:"underline",fontFamily:sans}}>Saboteur guide</button> first.</p>
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
      <ElevateFooter/>
    </div>
  );

  if(phase==="quiz"){
    const q=QUESTIONS[currentQ];const prog=Math.round((currentQ/QUESTIONS.length)*100);
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
    const sorted=Object.entries(myResult.scores).sort((a,b)=>{const pA=pct(a[1],a[0]);const pB=pct(b[1],b[0]);if(pB!==pA)return pB-pA;return b[1]-a[1];});
    const sKey=selectedSab||myResult.top[0];const sab=SABOTEURS[sKey];
    return(
      <div style={{maxWidth:560,margin:"0 auto",fontFamily:sans}}>
        <p style={{fontSize:11,color:B.seaSage,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{name}'s results</p>
        <h2 style={{fontFamily:serif,fontSize:"1.6rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Your top saboteurs</h2>
        <p style={{fontSize:12,color:B.chartreuse,marginBottom:"1.25rem"}}>✓ Results saved</p>
        <div style={{display:"flex",gap:8,marginBottom:"1.5rem",flexWrap:"wrap"}}>
          {myResult.top.map((k,i)=>(
            <button key={k} onClick={()=>setSelectedSab(k)} style={{padding:"5px 14px",borderRadius:20,fontSize:13,background:sKey===k?(i===0?B.chartreuse:B.emerald):i===0?B.chartreuse:B.surface,color:i===0?"#FFFFFF":sKey===k?"#FFFFFF":B.night,border:`1px solid ${i===0?B.emerald:B.border}`,cursor:"pointer",fontFamily:sans,fontWeight:sKey===k?500:400}}>
              {i+1}. {SABOTEURS[k].name}
            </button>
          ))}
        </div>
        <div style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:8,padding:"1.25rem",marginBottom:"1.5rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:22}}>{sab.emoji}</span>
            <div>
              <p style={{fontFamily:serif,fontWeight:400,margin:0,fontSize:15,color:B.sage}}>{sab.name}</p>
            </div>
          </div>
          <p style={{fontSize:13,lineHeight:1.7,color:B.night,opacity:0.8,marginBottom:12}}>{sab.desc}</p>
          <div style={{background:B.surface,borderRadius:6,padding:"0.875rem",marginBottom:12}}>
            <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 6px"}}>How it shows up at work</p>
            <p style={{fontSize:12,color:B.night,opacity:0.8,lineHeight:1.7,margin:0}}>{sab.work}</p>
          </div>
          <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,margin:"0 0 8px"}}>Signs it's active</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:12}}>
            {sab.signs.map((s,i)=><p key={i} style={{fontSize:12,margin:0,color:B.night,opacity:0.75,lineHeight:1.5}}>· {s}</p>)}
          </div>
          {(sab.famousPerson||sab.famousQuote)&&(
            <div style={{borderTop:`1px solid ${B.border}`,paddingTop:10,marginBottom:10}}>
              <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,margin:"0 0 4px"}}>You're in good company</p>
              {sab.famousPerson&&<p style={{fontSize:12,color:B.seaSage,margin:"0 0 4px"}}>{sab.famousPerson}</p>}
              {sab.famousQuote&&<p style={{fontSize:12,color:B.night,opacity:0.75,fontStyle:"italic",margin:0}}>"{sab.famousQuote}"</p>}
            </div>
          )}
          <div style={{borderTop:`1px solid ${B.border}`,paddingTop:10}}>
            <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage,margin:"0 0 4px"}}>The hidden gift</p>
            <p style={{fontSize:12,color:B.chartreuse,margin:0}}>{sab.gift}</p>
          </div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          {sorted.map(([k,score])=>(
            <button key={k} onClick={()=>setSelectedSab(k)} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,width:"100%",background:sKey===k?B.surface:"transparent",border:`1px solid ${sKey===k?B.emerald:"transparent"}`,borderRadius:6,padding:"4px 6px",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:12,width:130,color:myResult.top.includes(k)?B.night:B.seaSage,opacity:myResult.top.includes(k)?1:0.6,flexShrink:0,fontFamily:sans}}>{SABOTEURS[k].name}</span>
              <div style={{flex:1,height:4,background:B.surface,border:`1px solid ${B.border}`,borderRadius:2}}>
                <div style={{height:"100%",width:`${pct(score,k)}%`,background:myResult.top[0]===k?B.chartreuse:myResult.top.includes(k)?B.seaSage:B.border,borderRadius:2,transition:"width 0.5s"}}/>
              </div>
              <span style={{fontSize:11,color:sKey===k?B.emerald:B.seaSage,width:34,textAlign:"right",fontFamily:sans,fontWeight:sKey===k?500:400}}>{pct(score,k)}%</span>
            </button>
          ))}
        </div>
        <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
          <p style={{fontSize:11,color:B.sage,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Next step</p>
          <p style={{fontSize:13,color:B.night,opacity:0.8,lineHeight:1.7,margin:0}}>Head to the <button onClick={()=>setTab("weather")} style={{background:"none",border:"none",padding:0,color:B.chartreuse,cursor:"pointer",fontSize:13,textDecoration:"underline",fontFamily:sans}}>Weather Map</button> tab and fill out your four zones. Use what you learned here — especially for the Stormy zone.</p>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn onClick={()=>{setPhase("intro");setAnswers({});setCurrentQ(0);setName("");}}>Take again</Btn>
          {submittedNames.length>=2&&<Btn primary onClick={()=>setViewTeam(true)}>View team summary →</Btn>}
        </div>
        <ElevateFooter/>
      </div>
    );
  }
}

// ─── WEATHER TAB ──────────────────────────────────────────────────────────────
function WeatherTab({submissions,setSubmissions,sabResults,setTab}){
  const[phase,setPhase]=useState("intro");
  const[currentName,setCurrentName]=useState("");
  const[weatherReport,setWeatherReport]=useState(null);
  const[generating,setGenerating]=useState(false);
  const names=Object.keys(submissions);

  async function handleSubmit(name,responses){
    try{await fetch("/.netlify/functions/save-weather-map",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,...responses})});}
    catch(e){console.error("Save failed",e);}
    setSubmissions(s=>({...s,[name]:{...responses}}));setPhase("waiting");
  }

  async function generateReport(){
    setGenerating(true);
    const summaries=Object.entries(submissions).map(([n,d])=>`${n}:\n  ☀️ Sunny: ${d.sunny}\n  ☁️ Overcast: ${d.overcast}\n  ⛈️ Stormy: ${d.stormy}\n  🌈 Clear-up: ${d.clearup}`).join("\n\n");
    try{const res=await fetch("/.netlify/functions/generate-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({summaries})});const data=await res.json();setWeatherReport(data.text);}
    catch(e){setWeatherReport("Couldn't generate the report — but you have everything you need on screen to deliver it yourself!");}
    setGenerating(false);
  }

  if(phase==="intro")return(
    <div style={{maxWidth:520,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Team Weather Map<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,lineHeight:1.8,marginBottom:"0.75rem",opacity:0.7}}>Fill out your four zones privately — then reveal and discuss as a group.</p>
      <p style={{fontSize:12,color:B.seaSage,lineHeight:1.7,marginBottom:"2rem"}}>Tip: Complete the <button onClick={()=>setTab("saboteurs")} style={{background:"none",border:"none",padding:0,color:B.chartreuse,cursor:"pointer",fontSize:12,textDecoration:"underline",fontFamily:sans}}>Saboteurs assessment</button> first — it gives you helpful vocabulary for the Stormy zone.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:"2rem"}}>
        {ZONES.map(z=>(
          <div key={z.id} style={{background:z.bg,border:`0.5px solid ${z.border}`,borderRadius:8,padding:"0.875rem"}}>
            <div style={{fontSize:18,marginBottom:5}}>{z.icon}</div>
            <div style={{fontFamily:sans,fontSize:12,color:z.text,marginBottom:3}}>{z.label}</div>
            <div style={{fontFamily:sans,fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{z.title}</div>
          </div>
        ))}
      </div>
      <label style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,display:"block",marginBottom:8}}>Your name</label>
      <select value={currentName} onChange={e=>setCurrentName(e.target.value)} style={{width:"100%",marginBottom:"1rem",fontSize:14,background:"#FFFFFF",color:B.night,border:`1px solid ${B.border}`,borderRadius:4,padding:"9px 10px"}}>
        <option value="">Select your name…</option>
        {MEMBERS.map(m=><option key={m} value={m}>{m}{submissions[m]?" ✓":""}</option>)}
      </select>
      <div style={{display:"flex",gap:10}}>
        <Btn primary onClick={()=>currentName&&setPhase("fill")} disabled={!currentName} style={{flex:1}}>Fill out my forecast →</Btn>
        {names.length>=2&&<Btn onClick={()=>setPhase("reveal")}>Reveal →</Btn>}
      </div>
      {names.length>0&&<p style={{fontFamily:sans,fontSize:12,color:B.seaSage,marginTop:12,textAlign:"center"}}>{names.length} of {MEMBERS.length} submitted · {names.join(", ")}</p>}
      <ElevateFooter/>
    </div>
  );

  if(phase==="fill")return<FillScreen name={currentName} onSubmit={r=>handleSubmit(currentName,r)} onBack={()=>setPhase("intro")}/>;

  if(phase==="waiting")return(
    <div style={{maxWidth:420,margin:"0 auto",textAlign:"center",fontFamily:sans}}>
      <div style={{fontSize:32,marginBottom:"1rem",color:B.chartreuse}}>✓</div>
      <h2 style={{fontFamily:serif,fontSize:"1.5rem",fontWeight:400,color:B.sage,marginBottom:"0.75rem"}}>Forecast saved, {currentName}.</h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.8,marginBottom:"0.5rem"}}>{names.length} of {MEMBERS.length} in so far.</p>
      <p style={{fontSize:12,color:B.seaSage,marginBottom:"0.5rem"}}>{names.join(" · ")}</p>
      <p style={{fontSize:12,color:B.chartreuse,marginBottom:"2rem"}}>✓ Saved — safe even if you close this tab.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <Btn onClick={()=>setPhase("intro")}>← Home</Btn>
        {names.length>=2&&<Btn primary onClick={()=>setPhase("reveal")}>Start reveal →</Btn>}
      </div>
      <ElevateFooter/>
    </div>
  );

  if(phase==="reveal")return<RevealScreen submissions={submissions} onHome={()=>setPhase("intro")} onReport={()=>setPhase("report")}/>;
  if(phase==="report")return<ReportScreen submissions={submissions} sabResults={sabResults} weatherReport={weatherReport} generating={generating} onGenerate={generateReport} onBack={()=>setPhase("reveal")} onHome={()=>setPhase("intro")}/>;
}

// ─── FILL SCREEN (with preview before submit) ─────────────────────────────────
function FillScreen({name,onSubmit,onBack}){
  const[responses,setResponses]=useState({sunny:"",overcast:"",stormy:"",clearup:""});
  const[active,setActive]=useState("sunny");
  const[showPreview,setShowPreview]=useState(false);
  const zone=ZONES.find(z=>z.id===active);const zoneIdx=ZONES.findIndex(z=>z.id===active);
  const filledCount=ZONES.filter(z=>responses[z.id].trim()).length;const allFilled=filledCount===ZONES.length;

  if(showPreview){
    return(
      <div style={{maxWidth:560,margin:"0 auto",fontFamily:sans}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage}}>{name}'s forecast — review</p>
          <button onClick={()=>setShowPreview(false)} style={{fontSize:11,color:B.seaSage,background:"transparent",border:"none",cursor:"pointer"}}>← edit</button>
        </div>
        <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.7,marginBottom:"1.25rem"}}>Take a moment to review your forecast before submitting. You can go back and edit any zone.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.5rem"}}>
          {ZONES.map(z=>(
            <div key={z.id} style={{background:z.bg,border:`0.5px solid ${z.border}`,borderRadius:10,padding:"1.25rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.75rem"}}>
                <span style={{fontSize:16}}>{z.icon}</span>
                <span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:z.text}}>{z.label}</span>
              </div>
              <p style={{fontFamily:serif,fontSize:"0.875rem",color:"#FFFFFF",lineHeight:1.75,margin:0,fontStyle:"italic",opacity:0.9}}>
                {responses[z.id]||<span style={{opacity:0.4,fontStyle:"normal",fontSize:"0.8rem"}}>Empty</span>}
              </p>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={()=>setShowPreview(false)}>← Edit a zone</Btn>
          <Btn primary onClick={()=>onSubmit(responses)}>Submit my forecast →</Btn>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:560,margin:"0 auto",fontFamily:sans}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:B.sage}}>{name}'s forecast</p>
        <button onClick={onBack} style={{fontSize:11,color:B.seaSage,background:"transparent",border:"none",cursor:"pointer"}}>← back</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {ZONES.map(z=>{const done=responses[z.id].trim().length>0;const isActive=active===z.id;return(
          <button key={z.id} onClick={()=>setActive(z.id)} style={{fontFamily:sans,fontSize:12,padding:"5px 14px",borderRadius:20,cursor:"pointer",fontWeight:isActive?500:400,transition:"all 0.15s",background:isActive?z.pill.bg:done?z.pill.bg+"44":"#E8E4E0",border:`1.5px solid ${isActive?z.pill.border:done?z.pill.border+"88":B.border}`,color:isActive?z.pill.text:done?"#444":"#888"}}>
            {z.icon} {z.label}{done?" ✓":""}
          </button>
        );})}
      </div>
      <div style={{background:zone.bg,border:`0.5px solid ${zone.border}`,borderRadius:10,padding:"1.5rem",marginBottom:"1.25rem"}}>
        <div style={{fontSize:22,marginBottom:"0.5rem"}}>{zone.icon}</div>
        <h2 style={{fontFamily:serif,fontSize:"1.2rem",fontWeight:400,color:zone.text,marginBottom:"0.75rem"}}>{zone.title}</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.75,marginBottom:"1.25rem"}}>{zone.hint}</p>
        <textarea value={responses[zone.id]} onChange={e=>setResponses(r=>({...r,[zone.id]:e.target.value}))} placeholder={zone.placeholder} rows={4} style={{width:"100%",background:"rgba(0,0,0,0.35)",border:`0.5px solid ${zone.border}`,borderRadius:6,color:"#FFFFFF",fontFamily:sans,fontSize:13,padding:"10px 12px",resize:"none",lineHeight:1.7,boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {zoneIdx>0&&<Btn onClick={()=>setActive(ZONES[zoneIdx-1].id)}>← Prev</Btn>}
          {zoneIdx<ZONES.length-1&&<Btn onClick={()=>setActive(ZONES[zoneIdx+1].id)}>Next →</Btn>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          {!allFilled&&<span style={{fontSize:11,color:B.seaSage}}>Fill all 4 zones to unlock submit</span>}
          <Btn primary onClick={()=>allFilled&&setShowPreview(true)} disabled={!allFilled}>{allFilled?"Review & submit →":`${filledCount}/4 complete`}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── REVEAL SCREEN ────────────────────────────────────────────────────────────
function RevealScreen({submissions,onHome,onReport}){
  const names=Object.keys(submissions);const[idx,setIdx]=useState(0);
  const person=names[idx];const data=submissions[person];const prompt=DISCUSS[idx%DISCUSS.length](person);
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

// ─── REPORT SCREEN ────────────────────────────────────────────────────────────
function ReportScreen({submissions,sabResults,weatherReport,generating,onGenerate,onBack,onHome}){
  const[sending,setSending]=useState(false);
  const[sent,setSent]=useState(false);
  const names=Object.keys(submissions);

  async function handleSendReport(){
    setSending(true);
    try{
      await fetch("/.netlify/functions/send-report",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          weatherMaps:submissions,
          saboteurResults:sabResults,
          aiWrapUp:weatherReport,
        }),
      });
      setSent(true);
    }catch(e){
      alert("Couldn't send — try again.");
    }
    setSending(false);
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.4rem"}}>Experience Team · Offsite 2026</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.4rem"}}>Our collective forecast<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.7,marginBottom:"2rem"}}>Everyone's climate, side by side.</p>
      {ZONES.map(z=>(
        <div key={z.id} style={{marginBottom:"2rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${B.border}`}}>
            <span style={{fontSize:18}}>{z.icon}</span>
            <div><div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage}}>{z.label}</div><div style={{fontSize:12,color:B.night,opacity:0.6}}>{z.title}</div></div>
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
        {weatherReport&&<div style={{fontSize:13,color:B.night,lineHeight:1.85,whiteSpace:"pre-wrap",opacity:0.85,marginTop:"1rem"}}>{weatherReport}</div>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn onClick={onBack}>← Back to reveal</Btn>
        <Btn onClick={onHome}>Home</Btn>
        <Btn primary onClick={handleSendReport} disabled={sending||sent}>
          {sent?"✓ Sent":sending?"Sending…":"Email me this report"}
        </Btn>
        {sent&&<span style={{fontSize:12,color:B.chartreuse}}>Sent to abass@notablecap.com</span>}
      </div>
      <ElevateFooter/>
    </div>
  );
}

// ─── FACILITATOR TAB ──────────────────────────────────────────────────────────
function FacilitatorTab({setSabResults,setSubmissions}){
  const defaultSab=()=>({top:["judge","judge","judge"],scores:Object.fromEntries(SAB_KEYS.map(k=>[k,0]))});
  const defaultWeather=()=>({sunny:"",overcast:"",stormy:"",clearup:""});

  const[data,setData]=useState(()=>Object.fromEntries(MEMBERS.map(m=>[m,{sab:defaultSab(),weather:defaultWeather()}])));
  const[saved,setSaved]=useState(false);

  function setSabTop(member,idx,val){
    setData(d=>{const updated={...d,[member]:{...d[member],sab:{...d[member].sab,top:d[member].sab.top.map((k,i)=>i===idx?val:k)}}});return updated;});
  }
  function setWeather(member,zone,val){
    setData(d=>({...d,[member]:{...d[member],weather:{...d[member].weather,[zone]:val}}}));
  }

  function handleSave(){
    const newSab={};const newWeather={};
    MEMBERS.forEach(m=>{
      const top=data[m].sab.top.filter(k=>k&&SAB_KEYS.includes(k));
      if(top.length>0){newSab[m]={top,scores:Object.fromEntries(SAB_KEYS.map(k=>[k,0]))};}
      const w=data[m].weather;
      if(Object.values(w).some(v=>v.trim())){newWeather[m]=w;}
    });
    setSabResults(prev=>({...prev,...newSab}));
    setSubmissions(prev=>({...prev,...newWeather}));
    setSaved(true);setTimeout(()=>setSaved(false),3000);
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto",fontFamily:sans}}>
      <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:B.seaSage,marginBottom:"0.5rem"}}>Facilitator view</p>
      <h2 style={{fontFamily:serif,fontSize:"1.75rem",fontWeight:400,color:B.sage,marginBottom:"0.5rem"}}>Enter team data<span style={{color:B.emerald}}>.</span></h2>
      <p style={{fontSize:13,color:B.night,opacity:0.7,lineHeight:1.7,marginBottom:"2rem"}}>Pre-fill saboteur results and weather maps on behalf of the team. Saving here will power the reveal screen and AI wrap-up.</p>
      <div style={{display:"flex",flexDirection:"column",gap:"2rem",marginBottom:"2rem"}}>
        {MEMBERS.map(m=>(
          <div key={m} style={{background:"#FFFFFF",border:`1px solid ${B.border}`,borderRadius:10,padding:"1.25rem"}}>
            <p style={{fontFamily:serif,fontSize:16,color:B.sage,margin:"0 0 1rem",fontWeight:400}}>{m}</p>
            <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 8px"}}>Top 3 saboteurs</p>
            <div style={{display:"flex",gap:8,marginBottom:"1.25rem",flexWrap:"wrap"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:140}}>
                  <label style={{fontSize:10,color:B.seaSage,letterSpacing:"0.06em"}}># {i+1}</label>
                  <select
                    value={data[m].sab.top[i]||""}
                    onChange={e=>setSabTop(m,i,e.target.value)}
                    style={{fontSize:13,background:B.surface,color:B.night,border:`1px solid ${B.border}`,borderRadius:4,padding:"7px 8px",fontFamily:sans}}
                  >
                    <option value="">Select…</option>
                    {SAB_KEYS.map(k=><option key={k} value={k}>{SABOTEURS[k].name}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:B.sage,margin:"0 0 8px"}}>Weather map</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ZONES.map(z=>(
                <div key={z.id}>
                  <label style={{fontSize:11,color:B.seaSage,display:"block",marginBottom:3}}>{z.icon} {z.label} — {z.title}</label>
                  <textarea
                    value={data[m].weather[z.id]}
                    onChange={e=>setWeather(m,z.id,e.target.value)}
                    placeholder={z.placeholder}
                    rows={2}
                    style={{width:"100%",fontSize:12,background:B.surface,color:B.night,border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontFamily:sans,lineHeight:1.6,resize:"vertical",boxSizing:"border-box"}}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Btn primary onClick={handleSave} style={{minWidth:160}}>Save all data →</Btn>
        {saved&&<span style={{fontSize:12,color:B.chartreuse}}>✓ Saved to reveal screen</span>}
      </div>
      <ElevateFooter/>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("welcome");
  const[submissions,setSubmissions]=useState({});
  const[sabResults,setSabResults]=useState({});
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/.netlify/functions/get-submissions")
      .then(r=>r.json())
      .then(data=>{
        if(data.submissions){const clean={};Object.entries(data.submissions).forEach(([k,v])=>{if(k&&k!=="undefined")clean[k]=v;});setSubmissions(clean);}
        if(data.sabResults){const clean={};Object.entries(data.sabResults).forEach(([k,v])=>{if(k&&k!=="undefined")clean[k]=v;});setSabResults(clean);}
      })
      .catch(e=>console.error("Could not load",e))
      .finally(()=>setLoading(false));
  },[]);

  if(loading)return(<div style={{background:B.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{fontFamily:sans,fontSize:13,color:B.seaSage}}>Loading…</p></div>);

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
        {tab==="welcome"     &&<WelcomeTab setTab={setTab}/>}
        {tab==="guide"       &&<GuideTab setTab={setTab}/>}
        {tab==="saboteurs"   &&<SaboteursTab sabResults={sabResults} setSabResults={setSabResults} setTab={setTab}/>}
        {tab==="weather"     &&<WeatherTab submissions={submissions} setSubmissions={setSubmissions} sabResults={sabResults} setTab={setTab}/>}
        {tab==="facilitator" &&<FacilitatorTab setSabResults={setSabResults} setSubmissions={setSubmissions}/>}
      </div>
    </div>
  );
}
