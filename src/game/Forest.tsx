import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { mushrooms } from "../data";

type Props = { character:"Twix"|"Leaf"; pet:string; onMushroom:(id:number)=>void; onNpc:()=>void; };
type Spot = { id:number; x:number; y:number; graphic:Phaser.GameObjects.Graphics; glow:Phaser.GameObjects.Rectangle };

function frameArt(character:"Twix"|"Leaf",direction:"down"|"up"|"side",step:number){
  const twix=character==="Twix";
  const coat=twix?"#874957":"#4e704a";
  const hat=twix?"#ba5b6b":"#708a59";
  const hair=twix?"#49302d":"#392c29";
  const legA=step%2?1:0,legB=step%2?0:1;
  const back=direction==="up";
  const side=direction==="side";
  const face=back?"":side
    ? `<rect x="25" y="13" width="9" height="15" fill="#efcdaa"/><rect x="31" y="19" width="2" height="3" fill="#44302c"/>`
    : `<rect x="16" y="17" width="5" height="4" fill="#fff2da"/><rect x="27" y="17" width="5" height="4" fill="#fff2da"/><rect x="18" y="18" width="3" height="4" fill="#49322e"/><rect x="29" y="18" width="3" height="4" fill="#49322e"/><rect x="23" y="25" width="5" height="2" fill="#bb7776"/>`;
  const head=back
    ? `<rect x="13" y="11" width="23" height="20" fill="${hair}"/><rect x="10" y="16" width="6" height="17" fill="${hair}"/><rect x="34" y="16" width="6" height="17" fill="${hair}"/>`
    : `<rect x="14" y="11" width="21" height="22" fill="${hair}"/><rect x="11" y="17" width="5" height="13" fill="${hair}"/><rect x="34" y="17" width="5" height="13" fill="${hair}"/><rect x="16" y="13" width="17" height="16" fill="#efcdaa"/>`;
  const arms=step%2
    ? `<rect x="8" y="29" width="6" height="11" fill="#efcdaa"/><rect x="34" y="29" width="6" height="11" fill="#efcdaa"/>`
    : `<rect x="8" y="26" width="6" height="12" fill="#efcdaa"/><rect x="34" y="26" width="6" height="12" fill="#efcdaa"/>`;
  const legs=`<rect x="16" y="38" width="8" height="${8+legA*3}" fill="#6b4437"/><rect x="27" y="38" width="8" height="${8+legB*3}" fill="#6b4437"/><rect x="${15+legA*2}" y="${45+legA*2}" width="10" height="3" fill="#49332e"/><rect x="${27+legB*2}" y="${45+legB*2}" width="10" height="3" fill="#49332e"/>`;
  const cap=`<rect x="8" y="10" width="31" height="6" fill="${hat}"/><rect x="13" y="5" width="21" height="7" fill="${hat}"/><rect x="19" y="2" width="10" height="4" fill="${hat}"/><rect x="13" y="10" width="6" height="3" fill="${twix?"#f1b1a6":"#b7c98b"}"/><rect x="29" y="8" width="5" height="3" fill="#f4e1c0"/>`;
  const sideBag=`<rect x="${side?35:7}" y="30" width="7" height="10" fill="${twix?"#a55f59":"#92704b"}"/><rect x="${side?36:8}" y="29" width="5" height="3" fill="#d9b77c"/>`;
  return `<g shape-rendering="crispEdges"><ellipse cx="24" cy="48" rx="15" ry="2" fill="#1b281e" opacity=".35"/>${legs}<rect x="14" y="29" width="22" height="12" fill="${coat}"/><rect x="11" y="32" width="5" height="9" fill="${coat}"/><rect x="34" y="32" width="5" height="9" fill="${coat}"/>${arms}<rect x="16" y="35" width="18" height="3" fill="${twix?"#d89097":"#9bad78"}"/>${sideBag}${head}${face}<rect x="9" y="13" width="31" height="5" fill="${hat}"/>${cap}<rect x="21" y="7" width="5" height="3" fill="#fff0d7"/>${twix?'<rect x="9" y="9" width="4" height="4" fill="#e9a1a7"/><rect x="35" y="7" width="4" height="4" fill="#f0d5bd"/>':'<rect x="8" y="9" width="6" height="3" fill="#9fb77b"/><rect x="34" y="8" width="5" height="3" fill="#d7dca8"/>'}</g>`;
}

function createAtlas(character:"Twix"|"Leaf"){
  const frames:string[]=[];
  frames.push(frameArt(character,"down",0),frameArt(character,"up",0),frameArt(character,"side",0),frameArt(character,"side",1));
  for(let i=0;i<4;i++)frames.push(frameArt(character,"down",i));
  for(let i=0;i<4;i++)frames.push(frameArt(character,"up",i));
  for(let i=0;i<4;i++)frames.push(frameArt(character,"side",i));
  const groups=frames.map((frame,i)=>`<g transform="translate(${(i%4)*48} ${Math.floor(i/4)*48}) translate(0 0)">${frame}</g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">${groups}</svg>`;
}
function petArt(pet:string){
  const palette:Record<string,[string,string,string]> = {
    Mushmellow:["#efc9d1","#bd8495","#fff0d6"],Starling:["#d6ad75","#926b48","#f5dc94"],Bubbles:["#9bd5dd","#5b9eaf","#edfbf4"],
    Puddle:["#b0d6c5","#649b88","#f3d79f"],Fern:["#a4c386","#698c5e","#f2d9a0"],Lumi:["#c0b5e4","#8777bd","#fff0ca"],
    Pebble:["#c2b2a4","#86786f","#eadbc7"],Willow:["#f0ddc8","#b69a7b","#d99ba4"],Sprout:["#b5d18b","#78995d","#f7df9b"],Taffy:["#d7b9e4","#9276b0","#f8e0e8"]
  };
  const [body,shade,accent]=palette[pet]||palette.Mushmellow;
  const crown=pet==="Mushmellow"
    ? `<rect x="12" y="14" width="24" height="7" fill="${shade}"/><rect x="17" y="9" width="14" height="7" fill="${shade}"/><rect x="20" y="7" width="7" height="3" fill="${shade}"/><rect x="15" y="15" width="4" height="3" fill="${accent}"/><rect x="29" y="13" width="4" height="3" fill="${accent}"/>`
    : `<rect x="12" y="11" width="7" height="9" fill="${accent}"/><rect x="29" y="11" width="7" height="9" fill="${accent}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g shape-rendering="crispEdges"><ellipse cx="24" cy="44" rx="14" ry="2" fill="#1b281e" opacity=".3"/>${crown}<rect x="10" y="20" width="28" height="18" fill="${body}"/><rect x="14" y="17" width="20" height="22" fill="${body}"/><rect x="8" y="29" width="6" height="8" fill="${shade}"/><rect x="34" y="29" width="6" height="8" fill="${shade}"/><rect x="14" y="35" width="8" height="6" fill="${shade}"/><rect x="27" y="35" width="8" height="6" fill="${shade}"/><rect x="17" y="26" width="4" height="5" fill="#453831"/><rect x="28" y="26" width="4" height="5" fill="#453831"/><rect x="22" y="32" width="5" height="2" fill="#ba7775"/><rect x="12" y="21" width="4" height="4" fill="${accent}"/></g></svg>`;
}
function elderArt(){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="72" viewBox="0 0 64 72"><g shape-rendering="crispEdges"><ellipse cx="32" cy="68" rx="16" ry="2" fill="#17251e" opacity=".3"/><rect x="17" y="39" width="30" height="25" fill="#758b62"/><rect x="11" y="43" width="7" height="15" fill="#617c58"/><rect x="46" y="43" width="7" height="15" fill="#617c58"/><rect x="23" y="60" width="7" height="7" fill="#6b4638"/><rect x="35" y="60" width="7" height="7" fill="#6b4638"/><rect x="19" y="20" width="26" height="25" fill="#e9c9a8"/><rect x="14" y="25" width="7" height="25" fill="#8b8b6a"/><rect x="43" y="25" width="7" height="25" fill="#8b8b6a"/><rect x="24" y="29" width="4" height="4" fill="#493630"/><rect x="36" y="29" width="4" height="4" fill="#493630"/><rect x="28" y="37" width="9" height="2" fill="#bd7774"/><rect x="9" y="16" width="46" height="9" fill="#b75f6d"/><rect x="16" y="10" width="32" height="8" fill="#cd7983"/><rect x="22" y="6" width="20" height="5" fill="#e5a2a3"/><rect x="15" y="14" width="5" height="3" fill="#ffe5c3"/><rect x="42" y="12" width="5" height="3" fill="#ffe5c3"/></g></svg>`;
}

export default function Forest({character,pet,onMushroom,onNpc}:Props) {
  const host=useRef<HTMLDivElement>(null);
  const callbacks=useRef({onMushroom,onNpc});
  callbacks.current={onMushroom,onNpc};

  useEffect(()=>{
    if(!host.current)return;
    class ForestScene extends Phaser.Scene {
      player!:Phaser.Physics.Arcade.Sprite;
      companion!:Phaser.GameObjects.Image;
      companionLabel!:Phaser.GameObjects.Text;
      elder!:Phaser.GameObjects.Image;
      cursors!:Phaser.Types.Input.Keyboard.CursorKeys;
      keys!:Record<string,Phaser.Input.Keyboard.Key>;
      spots:Spot[]=[];
      speed=190;
      constructor(){super("forest");}
      preload(){
        this.load.spritesheet("spore-player",`data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAtlas(character))}`,{frameWidth:48,frameHeight:48});
        this.load.svg("spore-pet",`data:image/svg+xml;charset=utf-8,${encodeURIComponent(petArt(pet))}`,{width:48,height:48});
        this.load.svg("elder-willow",`data:image/svg+xml;charset=utf-8,${encodeURIComponent(elderArt())}`,{width:64,height:72});
      }
      create(){
        window.addEventListener("spore:mushroom-remove",this.handleMushroomRemove);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener("spore:mushroom-remove",this.handleMushroomRemove));
        this.cameras.main.setBounds(0,0,1600,1050);
        this.physics.world.setBounds(0,0,1600,1050);
        this.cameras.main.setZoom(.95);
        this.drawWorld();
        this.drawLanterns();
        this.drawFlowers();
        this.drawMushroomSpots();
        this.drawElder();
        this.drawPlayer();
        this.drawCompanion();
        this.drawFireflies();
        this.cameras.main.startFollow(this.player,true,.09,.09);
        this.cursors=this.input.keyboard!.createCursorKeys();
        this.keys=this.input.keyboard!.addKeys("W,A,S,D,E") as Record<string,Phaser.Input.Keyboard.Key>;
        this.input.on("pointerdown",(p:Phaser.Input.Pointer)=>{
          const world=this.cameras.main.getWorldPoint(p.x,p.y);
          const target=this.spots.find(o=>Phaser.Math.Distance.Between(world.x,world.y,o.x,o.y)<55);
          if(target)callbacks.current.onMushroom(target.id);
          else if(Phaser.Math.Distance.Between(world.x,world.y,740,490)<90)callbacks.current.onNpc();
        });
        this.events.on("update",this.move,this);
      }
      handleMushroomRemove=(event:Event)=>{
        const id=Number((event as CustomEvent<number>).detail);
        const index=this.spots.findIndex(o=>o.id===id);
        if(index<0)return;
        const [spot]=this.spots.splice(index,1);
        spot.graphic.destroy();spot.glow.destroy();
      };
      drawWorld(){
        const w=1600,h=1050;
        this.add.rectangle(w/2,h/2,w,h,0x243d32);
        for(let i=0;i<300;i++){
          const x=Phaser.Math.Between(12,w-12),y=Phaser.Math.Between(12,h-12);
          const colors=[0x395a3f,0x456848,0x58754d,0x6f8658,0x7b7650];
          this.add.rectangle(x,y,Phaser.Math.Between(3,9),Phaser.Math.Between(3,7),colors[i%colors.length],.38);
        }
        const path=this.add.graphics().setDepth(1);
        path.lineStyle(154,0x876b52,1);path.beginPath();path.moveTo(1440,930);path.lineTo(1210,810);path.lineTo(1080,680);path.lineTo(890,620);path.lineTo(810,500);path.lineTo(650,455);path.lineTo(520,355);path.lineTo(470,190);path.strokePath();
        const inner=this.add.graphics().setDepth(2);
        inner.lineStyle(128,0xc3a57b,1);inner.beginPath();inner.moveTo(1440,930);inner.lineTo(1210,810);inner.lineTo(1080,680);inner.lineTo(890,620);inner.lineTo(810,500);inner.lineTo(650,455);inner.lineTo(520,355);inner.lineTo(470,190);inner.strokePath();
        for(let i=0;i<60;i++){
          const x=Phaser.Math.Between(470,1450),y=Phaser.Math.Between(200,940);
          this.add.rectangle(x,y,Phaser.Math.Between(12,26),Phaser.Math.Between(6,13),i%2?0xd8bd91:0xa88966,.7).setDepth(3);
        }
        this.add.ellipse(238,500,320,570,0x1c5d60,.9).setDepth(2);
        this.add.ellipse(238,500,282,520,0x397f83,.9).setDepth(3);
        this.add.ellipse(238,500,245,470,0x5ea5a0,.68).setDepth(4);
        this.add.rectangle(115,480,62,385,0x8bc9b7,.65).setDepth(5);
        for(let i=0;i<24;i++){
          const x=Phaser.Math.Between(95,380),y=Phaser.Math.Between(260,750);
          const ripple=this.add.rectangle(x,y,Phaser.Math.Between(12,42),3,0xb4e5d4,.55).setDepth(6);
          this.tweens.add({targets:ripple,alpha:.1,scaleX:.4,duration:Phaser.Math.Between(900,1800),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,1600)});
        }
        for(let i=0;i<26;i++){
          const x=(i%7)*255+Phaser.Math.Between(-30,30),y=Math.floor(i/7)*250+Phaser.Math.Between(30,95);
          if(x>420&&x<1210&&y>290&&y<780)continue;
          const trunk=this.add.rectangle(x,y+35,24,110,0x604338).setDepth(y+20);
          this.add.rectangle(x-5,y+28,6,92,0x8a6346).setDepth(y+21);
          const canopy=this.add.container(x,y).setDepth(y+40);
          [[-24,-7,42,32],[10,-19,46,38],[34,4,42,31],[-4,15,48,33]].forEach(([dx,dy,ww,hh],j)=>{
            canopy.add(this.add.rectangle(dx,dy,ww,hh,[0x1f4936,0x2b583d,0x3b6544,0x53734b][(i+j)%4]));
          });
          canopy.add(this.add.rectangle(-14,-30,7,5,0x9baf73));
          this.tweens.add({targets:canopy,angle:{from:-.5,to:.5},duration:Phaser.Math.Between(2600,4200),yoyo:true,repeat:-1});
          trunk.setAlpha(.97);
        }
        for(let i=0;i<42;i++){
          const x=Phaser.Math.Between(30,1570),y=Phaser.Math.Between(40,1000);
          if(x>450&&x<1260&&y>300&&y<770)continue;
          this.drawBush(x,y,i);
        }
        const house=this.add.container(1350,210).setDepth(215);
        house.add([
          this.add.rectangle(0,48,150,94,0x6a433a),this.add.rectangle(0,0,190,36,0x563737),
          this.add.rectangle(-38,47,30,42,0xffd383),this.add.rectangle(37,47,30,42,0xffd383),
          this.add.rectangle(0,96,20,47,0x4e372e),this.add.rectangle(-84,-18,18,24,0x805347),
          this.add.rectangle(84,-18,18,24,0x805347)
        ]);
        this.add.circle(1350,210,125,0xffc977,.06).setDepth(210);
        this.add.text(1350,310,"Willow's Treehouse",{fontFamily:"Georgia",fontSize:"18px",color:"#f4ddbb",stroke:"#3c2b27",strokeThickness:4}).setOrigin(.5).setDepth(9999);
        for(let i=0;i<22;i++){
          const petal=this.add.rectangle(Phaser.Math.Between(430,1300),Phaser.Math.Between(250,900),4,7,i%2?0xe7a6b1:0xf0d6a7,.7).setDepth(990);
          this.tweens.add({targets:petal,x:petal.x+Phaser.Math.Between(10,42),y:petal.y-Phaser.Math.Between(20,90),alpha:.15,duration:Phaser.Math.Between(2600,5000),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,2200)});
        }
      }
      drawBush(x:number,y:number,index:number){
        const g=this.add.graphics().setDepth(y);
        const green=[0x284b36,0x355d40,0x4d7047][index%3];
        g.fillStyle(0x172c23,.3);g.fillRect(x-20,y+14,45,7);
        g.fillStyle(green,1);g.fillRect(x-20,y-4,16,20);g.fillRect(x-8,y-14,22,28);g.fillRect(x+8,y-2,15,18);
        g.fillStyle(0x8da76d,1);g.fillRect(x-7,y-10,7,4);g.fillRect(x+12,y-1,5,4);
        if(index%3===0){g.fillStyle(0xe7a7ad,1);g.fillRect(x-18,y-19,5,5);g.fillRect(x+13,y-23,5,5);g.fillStyle(0xf3d58a,1);g.fillRect(x-16,y-17,2,2);}
      }
      drawLanterns(){
        [[500,315],[1100,340],[520,760],[1100,745],[780,285],[840,800],[1285,465]].forEach(([x,y])=>{
          const glow=this.add.circle(x,y,48,0xf4ae55,.08).setDepth(y-1);
          this.tweens.add({targets:glow,alpha:{from:.04,to:.16},scale:{from:.85,to:1.18},duration:2100,yoyo:true,repeat:-1});
          const lamp=this.add.container(x,y).setDepth(y+12);
          lamp.add([this.add.rectangle(0,0,5,30,0x594033),this.add.rectangle(0,2,20,18,0x856047),this.add.rectangle(0,2,12,11,0xffd68b),this.add.rectangle(0,-10,10,3,0xb98d51)]);
          this.add.rectangle(x,y+17,5,10,0x594033).setDepth(y+13);
        });
      }
      drawFlowers(){
        for(let i=0;i<38;i++){
          const x=Phaser.Math.Between(410,1480),y=Phaser.Math.Between(250,930);
          const petal=i%2?0xf1b4b3:0xf6dca2;
          const flower=this.add.container(x,y).setDepth(y+4);
          flower.add([
            this.add.rectangle(-5,0,4,6,petal),this.add.rectangle(5,0,4,6,petal),
            this.add.rectangle(0,-5,6,4,petal),this.add.rectangle(0,5,6,4,petal),
            this.add.rectangle(0,0,3,3,0xf4ce76),this.add.rectangle(0,7,3,6,0x597744)
          ]);
          this.tweens.add({targets:flower,angle:{from:-3,to:3},duration:2400,yoyo:true,repeat:-1});
        }
      }
      drawMushroomSpots(){
        const points=[[620,440],[930,430],[710,635],[1030,610],[490,530],[1190,520],[850,340],[850,730],[400,390],[1230,680]];
        points.forEach(([x,y],i)=>this.drawMushroom(x,y,(i%10)+1));
      }
      drawMushroom(x:number,y:number,id:number){
        const data=mushrooms[id-1],c=Number.parseInt(data.color.slice(1),16);
        const g=this.add.graphics().setDepth(y+8);
        g.fillStyle(0x17251c,.32);g.fillRect(x-15,y+18,31,5);
        g.fillStyle(0x6c4b3e,1);g.fillRect(x-7,y-2,14,23);
        g.fillStyle(0xf1dfc7,1);g.fillRect(x-5,y,10,19);
        g.fillStyle(0xd3b89d,1);g.fillRect(x+2,y+2,3,15);
        g.fillStyle(0x59383a,1);g.fillRect(x-23,y-10,46,11);g.fillRect(x-16,y-19,32,10);
        g.fillStyle(c,1);g.fillRect(x-21,y-11,42,8);g.fillRect(x-15,y-19,30,9);g.fillRect(x-8,y-23,16,5);
        g.fillStyle(0xffefcf,1);g.fillRect(x-13,y-14,7,4);g.fillRect(x+8,y-11,5,3);g.fillRect(x+1,y-21,4,3);
        g.fillStyle(0x78544c,1);g.fillRect(x-12,y-2,24,2);
        g.setInteractive(new Phaser.Geom.Rectangle(x-30,y-28,60,53),Phaser.Geom.Rectangle.Contains);
        g.setData("mushroomId",id);
        const glow=this.add.rectangle(x,y-13,54,24,c,.035).setDepth(y+7);
        this.tweens.add({targets:glow,alpha:{from:.02,to:.13},duration:2000+(id%5)*300,yoyo:true,repeat:-1});
        this.spots.push({id,x,y,graphic:g,glow});
      }
      drawElder(){
        this.elder=this.add.image(740,490,"elder-willow").setDepth(498).setScale(1.15);
        this.add.text(740,535,"Elder Willow",{fontFamily:"Georgia",fontSize:"16px",color:"#fff0d0",stroke:"#38251f",strokeThickness:4}).setOrigin(.5).setDepth(9999);
        this.add.zone(740,490,94,100).setInteractive().on("pointerdown",()=>callbacks.current.onNpc());
        this.tweens.add({targets:this.elder,y:486,duration:1500,yoyo:true,repeat:-1,ease:"Sine.inOut"});
      }
      drawPlayer(){
        this.player=this.physics.add.sprite(800,550,"spore-player",0).setDepth(550).setScale(1.5);
        this.player.setCollideWorldBounds(true);
        const anims=[
          {key:"idle-front",frames:[0],rate:1,repeat:-1},
          {key:"idle-back",frames:[1],rate:1,repeat:-1},
          {key:"idle-side",frames:[2],rate:1,repeat:-1},
          {key:"walk-down",frames:[4,5,6,7],rate:8,repeat:-1},
          {key:"walk-up",frames:[8,9,10,11],rate:8,repeat:-1},
          {key:"walk-side",frames:[12,13,14,15],rate:8,repeat:-1}
        ];
        anims.forEach(a=>this.anims.create({key:a.key,frames:a.frames.map(frame=>({key:"spore-player",frame})),frameRate:a.rate,repeat:a.repeat}));
        this.player.play("idle-front");
        this.player.setOrigin(.5,.88);
      }
      drawCompanion(){
        this.companion=this.add.image(755,570,"spore-pet").setDepth(570).setScale(1.35);
        this.companionLabel=this.add.text(755,600,pet,{fontFamily:"Georgia",fontSize:"11px",color:"#fff0d0",stroke:"#38251f",strokeThickness:3}).setOrigin(.5).setDepth(9999);
        this.tweens.add({targets:this.companion,scaleY:{from:1.28,to:1.4},duration:900,yoyo:true,repeat:-1,ease:"Sine.inOut"});
      }
      drawFireflies(){
        for(let i=0;i<22;i++){
          const x=Phaser.Math.Between(100,1500),y=Phaser.Math.Between(70,980);
          const glow=this.add.circle(x,y,9,0xffd680,.1).setDepth(1000);
          const dot=this.add.rectangle(x,y,4,4,0xffe8a6,.92).setDepth(1001);
          this.tweens.add({targets:[glow,dot],x:x+Phaser.Math.Between(-35,35),y:y+Phaser.Math.Between(-45,45),alpha:{from:.15,to:1},duration:2200,yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,2200),ease:"Sine.inOut"});
        }
      }
      move(){
        const left=this.cursors.left.isDown||this.keys.A.isDown,right=this.cursors.right.isDown||this.keys.D.isDown;
        const up=this.cursors.up.isDown||this.keys.W.isDown,down=this.cursors.down.isDown||this.keys.S.isDown;
        let dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);
        const moving=dx!==0||dy!==0;
        const len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;
        this.player.setVelocity(dx*this.speed,dy*this.speed);
        this.player.setDepth(this.player.y);
        if(moving){
          if(Math.abs(dx)>Math.abs(dy)){
            this.player.anims.play("walk-side",true);
            this.player.setFlipX(dx>0);
          }else{
            this.player.setFlipX(false);
            this.player.anims.play(dy>0?"walk-down":"walk-up",true);
          }
        }else{
          this.player.setVelocity(0,0);
          this.player.anims.play("idle-front",true);
        }
        this.companion.x=Phaser.Math.Linear(this.companion.x,this.player.x-48,0.08);
        this.companion.y=Phaser.Math.Linear(this.companion.y,this.player.y+18,0.08);
        this.companion.setDepth(this.companion.y);
        this.companionLabel.setPosition(this.companion.x,this.companion.y+24).setDepth(this.companion.y+1);
        this.companion.setRotation(Math.sin(this.time.now/260)*.03);
        if(Phaser.Input.Keyboard.JustDown(this.keys.E)){
          if(Phaser.Math.Distance.Between(this.player.x,this.player.y,740,490)<90)callbacks.current.onNpc();
          else{
            const closest=this.spots.reduce<{id:number;distance:number}|null>((best,o)=>{
              const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,o.x,o.y);
              return d<75&&(!best||d<best.distance)?{id:o.id,distance:d}:best;
            },null);
            if(closest)callbacks.current.onMushroom(closest.id);
          }
        }
      }
    }
    const game=new Phaser.Game({
      type:Phaser.AUTO,parent:host.current,width:1280,height:720,backgroundColor:"#243d32",
      pixelArt:true,antialias:false,roundPixels:true,
      physics:{default:"arcade"},
      scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
      scene:[ForestScene]
    });
    return()=>game.destroy(true);
  },[character,pet]);

  return <div className="forest-host" ref={host} aria-label="Pixel-art Enchanted Forest. Use WASD or arrow keys to move, click mushrooms and talk to Elder Willow."/>;
}
