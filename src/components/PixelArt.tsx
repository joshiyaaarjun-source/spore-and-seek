import React from "react";

type Character = "Twix" | "Leaf";

export function PixelCharacter({ character, className = "" }: { character: Character; className?: string }) {
  const twix = character === "Twix";
  return (
    <svg className={`pixel-character ${twix ? "twix" : "leaf"} ${className}`} viewBox="0 0 96 112" role="img" aria-label={character} shapeRendering="crispEdges">
      <ellipse cx="48" cy="104" rx="25" ry="5" fill="#17261d" opacity=".35" />
      <g stroke="#4d302d" strokeWidth="2" strokeLinejoin="round">
        <path d="M26 40h8V31h8V25h22v6h8v10h6v29h-7v18H32V78h-8z" fill={twix ? "#3d292c" : "#322d2a"} />
        <path d="M34 39h28v29H34z" fill="#edc4a4" />
        <path d="M30 43h5v20h-5zm31-4h7v25h-7z" fill={twix ? "#4a2d2d" : "#3b302b"} />
        <path d="M37 43h7v5h-7zm17 0h7v5h-7z" fill="#fff0d4" stroke="none" />
        <path d="M40 48h4v5h-4zm16 0h4v5h-4z" fill="#5a3b35" stroke="none" />
        <path d="M47 57h5v3h-5z" fill="#b86e68" stroke="none" />
        <path d="M34 67h28v9h-5v7H39v-7h-5z" fill="#f0d9bd" />
        <path d="M29 75h38v13H29z" fill={twix ? "#8b4658" : "#4c6b4a"} />
        <path d="M27 84h42v8H27z" fill={twix ? "#4d3d36" : "#354a3b"} />
        <path d="M37 89h8v10H37zm15 0h8v10h-8z" fill="#654238" />
        <path d="M35 98h12v5H35zm15 0h12v5H50z" fill="#422f2c" />
        <path d="M22 27h11V19h10V13h27v6h8v9h-8v6H29v-6h-7z" fill={twix ? "#bb5768" : "#58734d"} />
        <path d="M30 17h10v-5h18v5h12v6H30z" fill={twix ? "#e78c98" : "#87a66c"} />
        <path d="M39 13h7v5h-7zm17 0h7v5h-7z" fill={twix ? "#fff0d7" : "#e4e5b9"} stroke="none" />
        <path d="M28 27h7v-5h8v5h-8v5h-7zm36-5h8v5h-8z" fill={twix ? "#8a3d50" : "#3f5b3e"} />
        <path d="M24 32h6v10h-6zm42 0h7v10h-7z" fill={twix ? "#55302f" : "#3c302b"} />
        {twix ? (
          <>
            <path d="M24 22h7v7h-7zm45-4h7v7h-7z" fill="#d88a94" />
            <path d="M17 28h8v6h-8zm56-7h7v6h-7z" fill="#f4d5c0" />
            <path d="M18 29h4v4h-4zm60-8h4v4h-4z" fill="#e9b85e" stroke="none" />
            <path d="M26 72h7v8h-7zm39 0h7v8h-7z" fill="#db9aa0" />
            <path d="M28 85h7v4h-7zm33 0h7v4h-7z" fill="#d7b77a" stroke="none" />
          </>
        ) : (
          <>
            <path d="M18 30h8v5h-8zm51-11h8v5h-8z" fill="#96ad73" />
            <path d="M19 30h4v4h-4zm53-10h4v4h-4z" fill="#ebcb86" stroke="none" />
            <path d="M29 70h7v9h-7zm31 0h7v9h-7z" fill="#7b9a70" />
            <path d="M35 86h7v4h-7zm20 0h7v4h-7z" fill="#bd9464" stroke="none" />
          </>
        )}
      </g>
      <g fill="#fff4db">
        <rect x="37" y="47" width="3" height="2"/><rect x="57" y="47" width="3" height="2"/>
      </g>
      <g fill="#fff1d4">
        <rect x="30" y="25" width="4" height="3"/><rect x="65" y="24" width="4" height="3"/>
      </g>
    </svg>
  );
}

const petStyles: Record<string, { body: string; shade: string; accent: string; ear: string; kind: string }> = {
  Mushmellow: { body:"#e8b7c5",shade:"#bb788c",accent:"#fff0d8",ear:"mushroom",kind:"mellow" },
  Starling: { body:"#d3a56d",shade:"#9c704c",accent:"#f6d77e",ear:"wing",kind:"bird" },
  Bubbles: { body:"#91cbd3",shade:"#5798aa",accent:"#e8f8ef",ear:"bubble",kind:"orb" },
  Puddle: { body:"#9cc9b9",shade:"#5b9a88",accent:"#f3d7a0",ear:"duck",kind:"duck" },
  Fern: { body:"#93b57a",shade:"#5e8057",accent:"#e8d5a2",ear:"leaf",kind:"fox" },
  Lumi: { body:"#a8a3d8",shade:"#6d6ca6",accent:"#f8e6a7",ear:"wing",kind:"moth" },
  Pebble: { body:"#b7aaa0",shade:"#81766f",accent:"#e8d5b7",ear:"stone",kind:"rock" },
  Willow: { body:"#e8d6bd",shade:"#b69b7d",accent:"#d88999",ear:"bunny",kind:"bunny" },
  Sprout: { body:"#a8c77c",shade:"#6c965a",accent:"#f4d78f",ear:"sprout",kind:"plant" },
  Taffy: { body:"#c5a3d8",shade:"#886aa6",accent:"#f6dce2",ear:"bubble",kind:"jelly" }
};

export function PixelPet({ pet, className = "" }: { pet: string; className?: string }) {
  const p = petStyles[pet] || petStyles.Mushmellow;
  return (
    <svg className={`pixel-pet ${className}`} viewBox="0 0 72 66" role="img" aria-label={pet} shapeRendering="crispEdges">
      <ellipse cx="36" cy="59" rx="20" ry="4" fill="#17261d" opacity=".3"/>
      <g stroke="#55413a" strokeWidth="2" strokeLinejoin="round">
        {p.ear==="bunny" && <><path d="M21 23 17 5 28 17z" fill={p.body}/><path d="M46 18 55 5 54 26z" fill={p.body}/></>}
        {p.ear==="wing" && <><path d="M17 34 4 21 7 42 18 47z" fill={p.accent}/><path d="M54 34 67 21 64 42 53 47z" fill={p.accent}/></>}
        {p.ear==="leaf" && <><path d="M25 20Q10 4 8 17Q13 29 27 27z" fill={p.accent}/><path d="M44 19Q58 2 64 17Q59 29 44 27z" fill={p.accent}/></>}
        {p.ear==="sprout" && <><path d="M35 17Q21 0 18 12Q22 26 35 24z" fill="#90b76f"/><path d="M37 17Q50 0 55 12Q50 26 37 24z" fill="#b8ce87"/></>}
        {p.ear==="stone" && <path d="M18 36 20 24 30 18 45 20 55 33 53 50 44 56 25 54 16 45z" fill={p.body}/>}
        {p.ear==="mushroom" && <><path d="M16 28Q18 11 36 8Q54 11 57 28z" fill={p.shade}/><path d="M23 19h5v5h-5zm17-5h5v5h-5zm8 10h4v4h-4z" fill={p.accent} stroke="none"/></>}
        {p.ear==="duck" && <path d="M52 34h13v5H53l-7 5v-8z" fill="#e4aa58"/>}
        {p.ear==="bubble" && <><circle cx="19" cy="21" r="5" fill={p.accent}/><circle cx="56" cy="17" r="4" fill={p.accent}/></>}
        {p.kind==="bird" && <path d="M51 37h12l-8 8z" fill="#e3aa5b"/>}
        <path d="M16 36 22 25 34 21 49 26 56 38 53 51 44 57 26 55 17 48z" fill={p.body}/>
        <path d="M18 43h-5v8h9zm36 0h5v8h-9z" fill={p.shade}/>
        <path d="M25 52h8v5h-8zm16 0h8v5h-8z" fill={p.shade}/>
      </g>
      <g fill="#403331"><rect x="27" y="36" width="4" height="6"/><rect x="42" y="36" width="4" height="6"/></g>
      <path d="M34 45h5v3h-5z" fill="#a85d69"/>
      <path d="M20 30h5v5h-5z" fill="#fff1d7" opacity=".7"/>
      <path d="M50 27h3v4h-3z" fill={p.accent}/>
    </svg>
  );
}

export function MushroomSprite({ color = "#d87c86", size = 76, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <svg className={`pixel-mushroom ${className}`} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Mushroom" shapeRendering="crispEdges">
      <ellipse cx="32" cy="58" rx="17" ry="3" fill="#17261d" opacity=".25"/>
      <path d="M26 35h12l4 19H22z" fill="#f2dfc4" stroke="#6c4a3f" strokeWidth="2"/>
      <path d="M18 32h28v5H18z" fill="#d9bda0"/>
      <path d="M10 31Q11 12 31 9Q52 11 55 31L50 35H14z" fill={color} stroke="#56363a" strokeWidth="2" />
      <path d="M17 28h7v5h-7zm26-5h6v5h-6zm-10-8h5v5h-5z" fill="#fff0d6"/>
      <path d="M22 36h20" stroke="#b08a75" strokeWidth="2"/>
      <rect x="24" y="43" width="3" height="3" fill="#cba98e"/>
      <rect x="38" y="43" width="3" height="3" fill="#cba98e"/>
    </svg>
  );
}

export function PixelElder({ className = "" }: { className?: string }) {
  return (
    <svg className={`pixel-elder ${className}`} viewBox="0 0 88 92" role="img" aria-label="Elder Willow" shapeRendering="crispEdges">
      <ellipse cx="44" cy="86" rx="22" ry="4" fill="#17261d" opacity=".3"/>
      <path d="M24 44h40v31H24z" fill="#758d63" stroke="#3c513b" strokeWidth="3"/>
      <path d="M30 32h28v22H30z" fill="#e9c6a5" stroke="#594039" strokeWidth="3"/>
      <path d="M25 34h7v30h-7zm31-3h7v34h-7z" fill="#b5b9a0"/>
      <path d="M26 23h9v-8h28v8h8v9H26z" fill="#b55f69" stroke="#5a3541" strokeWidth="3"/>
      <path d="M35 15h24v6H35z" fill="#e2a0a0"/>
      <path d="M34 43h5v6h-5zm17 0h5v6h-5z" fill="#493632"/>
      <path d="M40 53h9v3h-9z" fill="#b46b68"/>
      <path d="M14 52h5v29h-5zm-3-3h11v6H11z" fill="#a98a56"/>
      <path d="M32 74h10v9H32zm15 0h10v9H47z" fill="#6c4838"/>
      <path d="M21 24h5v5h-5zm43-2h5v5h-5z" fill="#e5c37f"/>
      <path d="M18 16 10 8 20 11 25 17z" fill="#779a68"/>
    </svg>
  );
}
