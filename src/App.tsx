import { useEffect, useState } from "react";
import Forest from "./game/Forest";
import { arenas, mushrooms, outfits, pets } from "./data";

type Screen = "title" | "login" | "register" | "character" | "pet" | "game" | "home";
type Character = "Twix" | "Leaf";
type Save = {
  character: Character; pet: string; outfit: string; arena: number;
  inventory: number[]; discovered: number[]; health: number; stamina: number;
  questAccepted: boolean; questComplete: boolean; coins: number; petMood: number;
};
type Account = { passwordHash: string; email: string };
const STORE = "spore-seek-v1";
const freshSave: Save = {
  character: "Twix", pet: "Mushmellow", outfit: "Default", arena: 0,
  inventory: [], discovered: [], health: 6, stamina: 100,
  questAccepted: false, questComplete: false, coins: 0, petMood: 70
};
const readJson = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
};
async function hashPassword(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [save, setSave] = useState<Save>(freshSave);
  const [character, setCharacter] = useState<Character>("Twix");
  const [outfit, setOutfit] = useState("Default");
  const [pet, setPet] = useState(pets[0]);
  const [selectedMushroom, setSelectedMushroom] = useState<number | null>(null);
  const [modal, setModal] = useState<"mushroom" | "npc" | "journal" | "satchel" | null>(null);
  const [toast, setToast] = useState("");
  const [developerPreview, setDeveloperPreview] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const saveForUser = (next: Save) => {
    setSave(next);
    localStorage.setItem(`${STORE}:save:${username}`, JSON.stringify(next));
  };
  const startGame = (next: Save) => {
    saveForUser(next);
    setScreen("game");
    notify("Your adventure begins!");
  };

  useEffect(() => {
    if (screen === "game") localStorage.setItem(`${STORE}:save:${username}`, JSON.stringify(save));
  }, [screen, save, username]);

  const register = async () => {
    setError("");
    const id = username.trim().toLowerCase();
    if (id.length < 3) return setError("Choose a username with at least 3 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== confirmPassword) return setError("Your passwords do not match.");
    const accounts = readJson<Record<string, Account>>(`${STORE}:accounts`, {});
    if (accounts[id]) return setError("That username is already taken.");
    accounts[id] = { passwordHash: await hashPassword(password), email };
    localStorage.setItem(`${STORE}:accounts`, JSON.stringify(accounts));
    setUsername(id);
    setSave(freshSave);
    localStorage.setItem(`${STORE}:save:${id}`, JSON.stringify(freshSave));
    setCharacter("Twix");
    setScreen("character");
  };

  const login = async () => {
    setError("");
    const id = username.trim().toLowerCase();
    const accounts = readJson<Record<string, Account>>(`${STORE}:accounts`, {});
    const account = accounts[id];
    if (!account || account.passwordHash !== await hashPassword(password)) {
      return setError("That username and password did not match.");
    }
    const stored = readJson<Save | null>(`${STORE}:save:${id}`, null);
    setUsername(id);
    if (stored) {
      setSave(stored);
      setScreen("game");
      notify(`Welcome back, ${id}!`);
    } else {
      setSave(freshSave);
      setScreen("character");
    }
  };

  const beginAdventure = () => startGame({
    ...freshSave, character, pet, outfit, arena: 0
  });

  const collectMushroom = (id: number, action: "eat" | "pack" | "leave") => {
    if (action === "leave") { setModal(null); setSelectedMushroom(null); return; }
    const mushroom = mushrooms[id - 1];
    const discovered = [...new Set([...save.discovered, id])];
    const questAccepted = save.questAccepted;
    if (action === "pack") {
      saveForUser({
        ...save, discovered, inventory: [...save.inventory, id],
        stamina: Math.max(0, save.stamina - 3)
      });
      notify(`${mushroom.name} tucked into your satchel.`);
    } else {
      const harmful = id === 12 || id === 16;
      const health = harmful ? Math.max(0, save.health - 1) : Math.min(6, save.health + (id === 4 || id === 27 || id === 30 ? 1 : 0));
      const stamina = harmful ? Math.max(0, save.stamina - 18) : Math.min(100, save.stamina + 20);
      saveForUser({ ...save, discovered, health, stamina });
      notify(harmful ? "Oh no! A fictional harmful mushroom drained your energy." : `${mushroom.name}: ${mushroom.effect}`);
    }
    if (questAccepted && !save.questComplete && discovered.length >= 3) {
      notify("You have enough discoveries to return to Elder Willow!");
    }
    setModal(null);
    setSelectedMushroom(null);
  };

  const turnInQuest = () => {
    if (!save.questAccepted) {
      saveForUser({ ...save, questAccepted: true });
      notify("Quest accepted: discover any three mushrooms.");
    } else if (save.discovered.length >= 3 && !save.questComplete) {
      saveForUser({ ...save, questComplete: true, coins: save.coins + 30 });
      notify("Quest complete! You earned 30 forest coins.");
    } else if (save.questComplete) {
      notify("Elder Willow: Thank you again, little explorer.");
    } else {
      notify(`You have discovered ${save.discovered.length} of 3 mushrooms. Keep exploring!`);
    }
    setModal(null);
  };

  const discoveredSet = new Set(save.discovered);
  const activeMushroom = selectedMushroom === null ? null : mushrooms[selectedMushroom - 1];

  return (
    <main className="app-shell">
      {screen === "title" && <section className="title-screen">
        <div className="title-glow" />
        <div className="brand-mark">✦ SPORE <i>&</i> SEEK ✦</div>
        <p className="tagline">a tiny foraging adventure</p>
        <div className="title-mushrooms">✿　🍄　✧　🍄　✿</div>
        <div className="title-card">
          <p>Somewhere beneath the old trees, little wonders are waiting.</p>
          <button className="primary" onClick={() => setScreen("login")}>Log in</button>
          <button onClick={() => setScreen("register")}>Create account</button>
          <button onClick={() => { setUsername("guest"); setSave(freshSave); setScreen("character"); }}>Play a local demo</button>
        </div>
        <small>COLLECT · CARE · EXPLORE · TOGETHER</small>
      </section>}

      {(screen === "login" || screen === "register") && <section className="auth-screen">
        <button className="back" onClick={() => setScreen("title")}>← Back</button>
        <div className="auth-card">
          <div className="tiny-brand">✦ SPORE & SEEK ✦</div>
          <h1>{screen === "login" ? "Welcome back, forager" : "Begin your story"}</h1>
          <p>{screen === "login" ? "The woods remember you." : "A new adventure is growing."}</p>
          <label>Username<input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your forest name" autoComplete="username" /></label>
          {screen === "register" && <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>}
          <label>Password<div className="password-wrap">
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete={screen === "login" ? "current-password" : "new-password"} />
            <button className="tiny" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button>
          </div></label>
          {screen === "register" && <label>Confirm password<input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" /></label>}
          {error && <p className="error">{error}</p>}
          <button className="primary" onClick={screen === "login" ? login : register}>{screen === "login" ? "Log in" : "Create account"}</button>
          <button className="text-button" onClick={() => { setError(""); setScreen(screen === "login" ? "register" : "login"); }}>
            {screen === "login" ? "New here? Create an account" : "Already have an account? Log in"}
          </button>
          <button className="text-button" onClick={() => notify("Password recovery will be connected to verified email in the backend phase.")}>Forgot password?</button>
          <small>Local prototype only: accounts are stored in this browser. Do not reuse a real password.</small>
        </div>
      </section>}

      {screen === "character" && <section className="creator">
        <button className="back" onClick={() => setScreen("title")}>← Back</button>
        <h1>Who will wander?</h1><p>Choose the heart of your story.</p>
        <div className="choice-grid">
          {(["Twix", "Leaf"] as Character[]).map(c => <button key={c} className={`choice ${character === c ? "chosen" : ""}`} onClick={() => setCharacter(c)}>
            <div className={`avatar ${c.toLowerCase()}`}>{c === "Twix" ? "🍄" : "🌸"}</div>
            <h2>{c}</h2><p>{c === "Twix" ? "The curious explorer" : "The gentle forager"}</p>
          </button>)}
        </div>
        <h2>Choose an outfit</h2>
        <div className="outfit-row">{outfits.map(o => <button key={o} className={outfit === o ? "chosen" : ""} onClick={() => setOutfit(o)}>{o}</button>)}</div>
        <button className="primary" onClick={() => setScreen("pet")}>Choose a companion →</button>
      </section>}

      {screen === "pet" && <section className="creator">
        <button className="back" onClick={() => setScreen("character")}>← Back</button>
        <h1>One little friend</h1><p>Choose exactly one starter companion. More friends can be rescued later.</p>
        <div className="pet-grid">{pets.slice(0, 10).map((p, i) => <button key={p} className={`pet-choice ${pet === p ? "chosen" : ""}`} onClick={() => setPet(p)}>
          <span>{["🍄","🐦","🫧","🦆","🦊","🦋","🪨","🐰","🌱","🪼"][i]}</span><b>{p}</b>
        </button>)}</div>
        <button className="primary" onClick={beginAdventure}>Begin the adventure ✦</button>
      </section>}

      {screen === "game" && <section className="game-screen">
        <div className="game-top">
          <div><b>♥ {save.health}/6</b><div className="stamina"><span style={{ width: `${save.stamina}%` }} /></div><small>STAMINA</small></div>
          <div className="game-title">SPORE & SEEK <small>{arenas[save.arena]} · ARENA {String(save.arena + 1).padStart(2, "0")}</small></div>
          <button onClick={() => setScreen("home")}>⌂ HOME</button>
        </div>
        <div className="quest-card"><b>✧ Forest Scavenger</b><span>{save.questComplete ? "Quest complete!" : `Discover 3 mushrooms · ${save.discovered.length}/3`}</span><span>{save.questAccepted ? "Return to Elder Willow when ready" : "Speak to Elder Willow"}</span></div>
        <Forest character={save.character} pet={save.pet} onMushroom={id => { setSelectedMushroom(id); setModal("mushroom"); }} onNpc={() => setModal("npc")} />
        <div className="game-bottom">
          <button onClick={() => setModal("journal")}>✧ Journal <b>{save.discovered.length}/30</b></button>
          <button onClick={() => setModal("satchel")}>♧ Satchel <b>{save.inventory.length}</b></button>
          <button onClick={() => notify(`${save.pet} is following you.`)}>♡ {save.pet}</button>
          <button onClick={() => setModal("npc")}>☼ Quests</button>
        </div>
      </section>}

      {screen === "home" && <section className="home-screen">
        <button className="back" onClick={() => setScreen("game")}>← Return to the forest</button>
        <h1>Pet Haven</h1><p>A cosy home for every little friend you rescue.</p>
        <div className="treehouse">✧　🌳　✧<div className="treehouse-rooms">
          {["Main Lounge","Sleeping Loft","Greenhouse","Play Room","Gift & Memory Room","Rest Nests","Garden Terrace","Pet Kitchen"].map(room => <button key={room} onClick={() => notify(`${room}: this room is planned for the interactive treehouse phase.`)}>{room}</button>)}
        </div></div>
        <h2>Your companion</h2><p>{save.pet} · Mood {save.petMood}%</p>
        <div className="actions"><button onClick={() => saveForUser({ ...save, petMood: Math.min(100, save.petMood + 15) })}>Give affection</button><button onClick={() => saveForUser({ ...save, petMood: Math.min(100, save.petMood + 20) })}>Feed a treat</button></div>
      </section>}

      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}>
        <div className="dialog" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setModal(null)}>×</button>
          {modal === "mushroom" && activeMushroom && <><div className="mushroom-art" style={{ color: activeMushroom.color }}>✿</div>
            <small>{activeMushroom.rarity}</small><h2>{activeMushroom.name}</h2><p>{activeMushroom.habitat}</p>
            <p>{discoveredSet.has(activeMushroom.id) ? activeMushroom.effect : "A little mystery. Inspect it and add it to your journal."}</p>
            <div className="actions">
              <button className="danger" onClick={() => collectMushroom(activeMushroom.id, "eat")}>Eat</button>
              <button className="primary" onClick={() => collectMushroom(activeMushroom.id, "pack")}>Pack</button>
              <button onClick={() => collectMushroom(activeMushroom.id, "leave")}>Leave</button>
            </div><small>Fictional game effects only. Never eat wild mushrooms.</small>
          </>}
          {modal === "npc" && <><div className="npc-portrait">🌿</div><small>ELDER WILLOW · FOREST KEEPER</small>
            <h2>“So you've finally arrived...”</h2>
            <p>The forest has been waiting for a curious soul like you. Could you help me find three little mushrooms hidden along the path?</p>
            <p>Quest progress: {save.discovered.length}/3 · {save.coins} forest coins</p>
            <div className="actions"><button className="primary" onClick={turnInQuest}>{!save.questAccepted ? "Accept quest" : save.discovered.length >= 3 && !save.questComplete ? "Turn in quest" : "Continue"}</button><button onClick={() => setModal(null)}>Goodbye</button></div>
          </>}
          {modal === "journal" && <><small>FIELD NOTES</small><h2>Mushroom journal</h2><p>{save.discovered.length} of 30 species discovered</p>
            <div className="journal-list">{mushrooms.map(m => <div key={m.id} className={discoveredSet.has(m.id) ? "" : "unknown"}><span>{String(m.id).padStart(2,"0")}</span><b>{discoveredSet.has(m.id) ? m.name : "Undiscovered species"}</b><small>{discoveredSet.has(m.id) ? m.rarity : "???"}</small></div>)}</div>
          </>}
          {modal === "satchel" && <><small>WHAT YOU CARRY</small><h2>Your satchel</h2>
            {save.inventory.length ? <div className="journal-list">{save.inventory.map((id, i) => <div key={i}><span>✦</span><b>{mushrooms[id - 1].name}</b><small>×1</small></div>)}</div> : <p>Your satchel is empty. Find a mushroom and choose Pack.</p>}
          </>}
        </div>
      </div>}
      {toast && <div className="toast">{toast}</div>}
      <div className="corner-note">{developerPreview ? "DEVELOPER PREVIEW" : "A tiny foraging adventure"}</div>
    </main>
  );
}
