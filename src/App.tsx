import { useEffect,useMemo,useState } from "react";
import Forest from "./game/Forest";
import { arenas,mushrooms,outfits,pets } from "./data";

type Save={user:string;character:"Twix"|"Leaf";pet:string;outfit:string;arena:number;inventory:number[];discovered:number[];health:number;stamina:number;quest:boolean;};
const key="spore-seek-save-v1";
const blank:Save={user:"",character:"Twix",pet:"Mushmellow",outfit:"Default",arena:1,inventory:[],discovered:[],health:6,stamina:100,quest:false};
function load():Save|null{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}}
export default function App(){
 const [save,setSave]=useState<Save|null>(load),[screen,setScreen]=useState<"title"|"login"|"register"|"character"|"pet"|"game"|"home">(load()?"title":"title");
 const [name,setName]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[selected,setSelected]=useState<"Twix"|"Leaf">("Twix"),[pet,setPet]=useState(pets[0]),[outfit,setOutfit]=useState(outfits[0]);
 const [modal,setModal]=useState<{id:number}|{npc:true}|null>(null),[toast,setToast]=useState("");
 const current=save||blank;
 const persist=(next:Save)=>{setSave(next);localStorage.setItem(key,JSON.stringify(next));};
 const notify=(m:string)=>{setToast(m);window.setTimeout(()=>setToast(""),2600)};
 const discovered=useMemo(()=>new Set(current.discovered),[current.discovered]);
 function start(){persist({...blank,user:name.trim(),character:selected,pet,outfit});setScreen("game");notify("Your adventure begins!");}
 function collect(id:number,action:"eat"|"pack"|"leave"){
  const m=mushrooms[id-1];if(action==="leave"){setModal(null);return;}
  const d=[...new Set([...current.discovered,id])];
  if(action==="pack"){persist({...current,inventory:[...current.inventory,id],discovered:d});notify(m.name+" added to your satchel.");}
  else {
   let health=current.health,stamina=current.stamina;
   if(id===12||id===16){health=Math.max(1,health-1);stamina=Math.max(0,stamina-18);notify("Oh no! "+m.name+" had a nasty fictional effect. Find a healing herb!");}
   else {health=Math.min(6,health+(id===4||id===27||id===30?1:0));stamina=Math.min(100,stamina+22);notify(m.name+": "+m.effect);}
   persist({...current,health,stamina,discovered:d});
  }
  setModal(null);
 }
 function login(){const existing=load();if(existing&&existing.user===name.trim()){setSave(existing);setScreen("game");notify("Welcome back, "+existing.user+"!");}else notify("No local save found for that username. Create an account to begin.");}
 function register(){if(name.trim().length<3||password.length<6||password!==confirm){notify("Use a 3+ character username, 6+ character password, and matching confirmation.");return;}start();}
 function home(){persist(current);setScreen("home");}
 useEffect(()=>{if(screen==="game")localStorage.setItem(key,JSON.stringify(current));},[screen,current]);
 const counts=current.inventory.reduce((acc,id)=>{acc[id]=(acc[id]||0)+1;return acc;},{} as Record<number,number>);
 return <main className="app-shell">
  {screen==="title"&&<section className="title-screen">
   <div className="title-glow"/><div className="brand-mark">✦ SPORE <i>&</i> SEEK ✦</div><p className="tagline">a tiny foraging adventure</p>
   <div className="title-mushrooms">✿　🍄　✧　🍄　✿</div>
   <div className="title-card"><p>Somewhere beneath the old trees, little wonders are waiting.</p>
    <button className="primary" onClick={()=>setScreen("login")}>Enter the forest</button>
    <button onClick={()=>setScreen("register")}>Create an account</button>
    {save&&<button onClick={()=>setScreen("game")}>Continue as {save.user}</button>}
   </div><small>COLLECT · CARE · EXPLORE · TOGETHER</small>
  </section>}
  {(screen==="login"||screen==="register")&&<section className="auth-screen"><button className="back" onClick={()=>setScreen("title")}>← Back</button><div className="auth-card"><div className="tiny-brand">✦ SPORE & SEEK ✦</div><h1>{screen==="login"?"Welcome back, forager":"Begin your story"}</h1><p>{screen==="login"?"The woods remember you.":"A new adventure is growing."}</p>
   <label>Username<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your forest name"/></label>
   <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/></label>
   {screen==="register"&&<label>Confirm password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password"/></label>}
   <button className="primary" onClick={screen==="login"?login:register}>{screen==="login"?"Log in":"Create account"}</button>
   <button className="text-button" onClick={()=>setScreen(screen==="login"?"register":"login")}>{screen==="login"?"New here? Create an account":"Already have an account? Log in"}</button>
   <small>Prototype accounts are saved on this device only. Do not reuse a real password.</small>
  </div></section>}
  {screen==="character"&&<section className="creator"><button className="back" onClick={()=>setScreen("title")}>← Back</button><h1>Who will wander?</h1><p>Choose the heart of your story.</p><div className="choice-grid">{(["Twix","Leaf"] as const).map(c=><button className={"choice "+(selected===c?"chosen":"")} onClick={()=>setSelected(c)}><div className={"avatar "+c.toLowerCase()}>{c==="Twix"?"🍄":"🌸"}</div><h2>{c}</h2><p>{c==="Twix"?"The curious explorer":"The gentle forager"}</p></button>)}</div><h2>Choose an outfit</h2><div className="outfit-row">{outfits.map(o=><button className={outfit===o?"chosen":""} onClick={()=>setOutfit(o)}>{o}</button>)}</div><button className="primary" onClick={()=>setScreen("pet")}>Choose a companion →</button></section>}
  {screen==="pet"&&<section className="creator"><button className="back" onClick={()=>setScreen("character")}>← Back</button><h1>One little friend</h1><p>Choose exactly one starter companion. More friends can be rescued later.</p><div className="pet-grid">{pets.map((p,i)=><button className={"pet-choice "+(pet===p?"chosen":"")} onClick={()=>setPet(p)}><span>{["🍄","🐦","🫧","🦆","🦊","🦋","🪨","🐰","🌱","🪼"][i]}</span><b>{p}</b></button>)}</div><button className="primary" onClick={start}>Begin the adventure ✦</button></section>}
  {screen==="game"&&<section className="game-screen"><div className="game-top"><div><b>♡ {current.health}/6</b><div className="stamina"><span style={{width:current.stamina+"%"}}/></div><small>STAMINA</small></div><div className="game-title">SPORE & SEEK <small>ENCHANTED FOREST · ARENA 01</small></div><button onClick={home}>⌂ HOME</button></div>
   <div className="quest-card"><b>✧ Forest Scavenger</b><span>Discover 3 mushrooms · {current.discovered.length}/3</span><span>Speak to Elder Willow</span></div>
   <Forest character={current.character} pet={current.pet} onMushroom={id=>setModal({id})} onNpc={()=>setModal({npc:true})}/>
   <div className="game-bottom"><button onClick={()=>notify("Journal: "+current.discovered.length+" / 30 discovered.")}>✧ Journal <b>{current.discovered.length}/30</b></button><button onClick={()=>notify("Satchel: "+current.inventory.length+" mushrooms packed.")}>♧ Satchel <b>{current.inventory.length}</b></button><button onClick={()=>notify(current.pet+" is following you.")}>♡ {current.pet}</button><button onClick={()=>notify("Quest: discover three mushrooms and speak with Elder Willow.")}>☼ Quests</button></div>
  </section>}
  {screen==="home"&&<section className="home-screen"><button className="back" onClick={()=>setScreen("game")}>← Return to the forest</button><h1>Pet Haven</h1><p>A cosy home for every little friend you rescue.</p><div className="treehouse">✧　🌳　✧<div className="treehouse-rooms">{["Main Lounge","Sleeping Loft","Greenhouse","Play Room","Gift & Memory Room","Rest Nests","Garden Terrace","Pet Kitchen"].map(r=><button onClick={()=>notify(r+" · Room prototype")}>{r}</button>)}</div></div><h2>Your companion</h2><p>{current.pet} · active roaming pet</p></section>}
  {modal&&("id" in modal)&&<div className="modal-backdrop"><div className="dialog"><button className="close" onClick={()=>setModal(null)}>×</button><div className="mushroom-art" style={{color:mushrooms[modal.id-1].color}}>✿</div><small>{mushrooms[modal.id-1].rarity}</small><h2>{mushrooms[modal.id-1].name}</h2><p>{mushrooms[modal.id-1].habitat}</p><p>{discovered.has(modal.id)?mushrooms[modal.id-1].effect:"A little mystery. Inspect it and add it to your journal."}</p><div className="actions"><button className="danger" onClick={()=>collect(modal.id,"eat")}>Eat</button><button className="primary" onClick={()=>collect(modal.id,"pack")}>Pack</button><button onClick={()=>collect(modal.id,"leave")}>Leave</button></div></div></div>}
  {modal&&("npc" in modal)&&<div className="modal-backdrop"><div className="dialog npc-dialog"><button className="close" onClick={()=>setModal(null)}>×</button><div className="npc-portrait">🌿</div><small>ELDER WILLOW · FOREST KEEPER</small><h2>"So you've finally arrived..."</h2><p>The forest has been waiting for a curious soul like you. Could you help me find three little mushrooms hidden along the path?</p><div className="actions"><button className="primary" onClick={()=>{if(current.discovered.length>=3){persist({...current,quest:true});notify("Quest complete! Elder Willow thanks you.");}else notify("The forest still has discoveries waiting. Find three mushrooms first.");setModal(null);}}>Tell me more / Turn in quest</button><button onClick={()=>setModal(null)}>Goodbye</button></div></div></div>}
  {toast&&<div className="toast">{toast}</div>}
 </main>
}