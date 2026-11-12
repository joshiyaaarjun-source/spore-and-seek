import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { mushrooms } from "../data";

type Props = { character:"Twix"|"Leaf"; pet:string; onMushroom:(id:number)=>void; onNpc:()=>void; };
type Spot = { id:number; x:number; y:number; graphic:Phaser.GameObjects.Graphics };

export default function Forest({character,pet,onMushroom,onNpc}:Props) {
  const host=useRef<HTMLDivElement>(null);
  const callbacks=useRef({onMushroom,onNpc});
  callbacks.current={onMushroom,onNpc};

  useEffect(()=>{
    if(!host.current) return;

    class ForestScene extends Phaser.Scene {
      player!:Phaser.GameObjects.Container;
      companion!:Phaser.GameObjects.Container;
      companionLabel!:Phaser.GameObjects.Text;
      cursors!:Phaser.Types.Input.Keyboard.CursorKeys;
      keys!:Record<string,Phaser.Input.Keyboard.Key>;
      spots:Spot[]=[];
      speed=190;
      moving=false;
      ambient:Phaser.GameObjects.Arc[]=[];
      handleMushroomRemove=(event:Event)=>{
        const id=Number((event as CustomEvent<number>).detail);
        const index=this.spots.findIndex(o=>o.id===id);
        if(index<0)return;
        const [spot]=this.spots.splice(index,1);
        spot.graphic.destroy();
      };
      constructor(){super("forest");}

      create(){
        window.addEventListener("spore:mushroom-remove",this.handleMushroomRemove);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener("spore:mushroom-remove",this.handleMushroomRemove));
        const w=1600,h=1050;
        this.cameras.main.setBounds(0,0,w,h);
        this.physics.world.setBounds(0,0,w,h);
        this.cameras.main.setZoom(.95);
        this.drawWorld(w,h);
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
          if(target) callbacks.current.onMushroom(target.id);
          else if(Phaser.Math.Distance.Between(world.x,world.y,740,490)<88) callbacks.current.onNpc();
        });
        this.events.on("update",this.move,this);
      }

      drawWorld(w:number,h:number){
        this.add.rectangle(w/2,h/2,w,h,0x243d32);
        // Pixel-clustered ground grain and moss patches.
        for(let i=0;i<300;i++){
          const x=Phaser.Math.Between(12,w-12),y=Phaser.Math.Between(12,h-12);
          const colors=[0x395a3f,0x456848,0x58754d,0x6f8658,0x7b7650];
          this.add.rectangle(x,y,Phaser.Math.Between(3,9),Phaser.Math.Between(3,7),colors[i%colors.length],.38).setDepth(0);
        }
        // Walkable parchment path with small cobbles and grass edges.
        const path=this.add.graphics().setDepth(1);
        path.lineStyle(154,0x876b52,1);path.beginPath();path.moveTo(1440,930);path.lineTo(1210,810);path.lineTo(1080,680);path.lineTo(890,620);path.lineTo(810,500);path.lineTo(650,455);path.lineTo(520,355);path.lineTo(470,190);path.strokePath();
        const inner=this.add.graphics().setDepth(2);
        inner.lineStyle(128,0xc3a57b,1);inner.beginPath();inner.moveTo(1440,930);inner.lineTo(1210,810);inner.lineTo(1080,680);inner.lineTo(890,620);inner.lineTo(810,500);inner.lineTo(650,455);inner.lineTo(520,355);inner.lineTo(470,190);inner.strokePath();
        for(let i=0;i<60;i++){
          const x=Phaser.Math.Between(470,1450),y=Phaser.Math.Between(200,940);
          this.add.rectangle(x,y,Phaser.Math.Between(12,26),Phaser.Math.Between(6,13),i%2?0xd8bd91:0xa88966,.7).setDepth(3);
        }
        // Waterfall lagoon: several layered bands, banks and animated shimmer.
        this.add.ellipse(238,500,320,570,0x1c5d60,.9).setDepth(2);
        this.add.ellipse(238,500,282,520,0x397f83,.9).setDepth(3);
        this.add.ellipse(238,500,245,470,0x5ea5a0,.68).setDepth(4);
        this.add.rectangle(115,480,62,385,0x8bc9b7,.65).setDepth(5);
        for(let i=0;i<24;i++){
          const x=Phaser.Math.Between(95,380),y=Phaser.Math.Between(260,750);
          const ripple=this.add.rectangle(x,y,Phaser.Math.Between(12,42),3,0xb4e5d4,.55).setDepth(6);
          this.tweens.add({targets:ripple,alpha:.1,scaleX:.4,duration:Phaser.Math.Between(900,1800),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,1600)});
        }
        // Tree trunks and layered canopy clusters framing the clearing.
        for(let i=0;i<26;i++){
          const x=(i%7)*255+Phaser.Math.Between(-30,30),y=Math.floor(i/7)*250+Phaser.Math.Between(30,95);
          if(x>420&&x<1210&&y>290&&y<780) continue;
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
        // Flowering shrubs and mushrooms around the outer edges.
        for(let i=0;i<42;i++){
          const x=Phaser.Math.Between(30,1570),y=Phaser.Math.Between(40,1000);
          if(x>450&&x<1260&&y>300&&y<770) continue;
          this.drawBush(x,y,i);
        }
        // A warm treehouse silhouette, distant from the walkable area.
        const house=this.add.container(1350,210).setDepth(215);
        house.add([
          this.add.rectangle(0,48,150,94,0x6a433a),this.add.rectangle(0,0,190,36,0x563737),
          this.add.rectangle(-38,47,30,42,0xffd383),this.add.rectangle(37,47,30,42,0xffd383),
          this.add.rectangle(0,96,20,47,0x4e372e),this.add.rectangle(-84,-18,18,24,0x805347),
          this.add.rectangle(84,-18,18,24,0x805347)
        ]);
        this.add.circle(1350,210,125,0xffc977,.06).setDepth(210);
        this.add.text(1350,310,"Willow's Treehouse",{fontFamily:"Georgia",fontSize:"18px",color:"#f4ddbb",stroke:"#3c2b27",strokeThickness:4}).setOrigin(.5).setDepth(9999);
        // Floating petals over the path.
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
        [[500,315],[1100,340],[520,760],[1100,745],[780,285],[840,800],[1285,465]].forEach(([x,y],i)=>{
          const glow=this.add.circle(x,y,48,0xf4ae55,.08).setDepth(y-1);
          this.tweens.add({targets:glow,alpha:{from:.04,to:.16},scale:{from:.85,to:1.18},duration:Phaser.Math.Between(1800,3200),yoyo:true,repeat:-1});
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
          this.tweens.add({targets:flower,angle:{from:-3,to:3},duration:Phaser.Math.Between(1900,3600),yoyo:true,repeat:-1});
        }
      }

      drawMushroomSpots(){
        const points=[[620,440],[930,430],[710,635],[1030,610],[490,530],[1190,520],[850,340],[850,730],[400,390],[1230,680]];
        points.forEach(([x,y],i)=>this.drawMushroom(x,y,(i%10)+1));
      }

      drawMushroom(x:number,y:number,id:number){
        const data=mushrooms[id-1];
        const c=Number.parseInt(data.color.slice(1),16);
        const g=this.add.graphics().setDepth(y+8);
        g.fillStyle(0x17251c,.32);g.fillRect(x-15,y+18,31,5);
        // Stem with pixel-shaded sides.
        g.fillStyle(0x6c4b3e,1);g.fillRect(x-7,y-2,14,23);
        g.fillStyle(0xf1dfc7,1);g.fillRect(x-5,y,10,19);
        g.fillStyle(0xd3b89d,1);g.fillRect(x+2,y+2,3,15);
        // Cap, underside and highlight.
        g.fillStyle(0x59383a,1);g.fillRect(x-23,y-10,46,11);g.fillRect(x-16,y-19,32,10);
        g.fillStyle(c,1);g.fillRect(x-21,y-11,42,8);g.fillRect(x-15,y-19,30,9);g.fillRect(x-8,y-23,16,5);
        g.fillStyle(0xffefcf,1);g.fillRect(x-13,y-14,7,4);g.fillRect(x+8,y-11,5,3);g.fillRect(x+1,y-21,4,3);
        g.fillStyle(0x78544c,1);g.fillRect(x-12,y-2,24,2);
        g.setInteractive(new Phaser.Geom.Rectangle(x-30,y-28,60,53),Phaser.Geom.Rectangle.Contains);
        g.setData("mushroomId",id);
        this.spots.push({id,x,y,graphic:g});
        const glow=this.add.rectangle(x,y-13,54,24,c,.035).setDepth(y+7);
        this.tweens.add({targets:glow,alpha:{from:.02,to:.13},duration:2000+iRand(id)*300,yoyo:true,repeat:-1});
      }

      drawElder(){
        const elder=this.add.container(740,490).setDepth(498);
        const body=this.add.graphics();
        body.fillStyle(0x16261e,.3);body.fillRect(-18,16,38,7);
        body.fillStyle(0x5c7754,1);body.fillRect(-16,-1,32,28);body.fillRect(-21,3,7,17);body.fillRect(14,3,7,17);
        body.fillStyle(0x6d4437,1);body.fillRect(-10,24,8,8);body.fillRect(3,24,8,8);
        body.fillStyle(0xe9c8a6,1);body.fillRect(-12,-25,24,25);
        body.fillStyle(0x6e6b54,1);body.fillRect(-16,-25,5,25);body.fillRect(11,-25,5,25);
        body.fillStyle(0x57403b,1);body.fillRect(-6,-16,3,3);body.fillRect(5,-16,3,3);
        body.fillStyle(0xc2787b,1);body.fillRect(-21,-31,42,7);body.fillRect(-15,-38,30,7);body.fillRect(-7,-41,14,4);
        body.fillStyle(0xf7dcb2,1);body.fillRect(-15,-35,5,3);body.fillRect(10,-35,4,3);
        elder.add(body);
        this.add.text(740,535,"Elder Willow",{fontFamily:"Georgia",fontSize:"16px",color:"#fff0d0",stroke:"#38251f",strokeThickness:4}).setOrigin(.5).setDepth(9999);
        const zone=this.add.zone(740,490,94,100).setInteractive();
        zone.on("pointerdown",()=>callbacks.current.onNpc());
        this.tweens.add({targets:elder,y:486,duration:1500,yoyo:true,repeat:-1,ease:"Sine.inOut"});
      }

      drawPlayer(){
        const p=this.add.container(800,550).setDepth(550);
        const art=this.add.graphics();
        const twix=character==="Twix";
        art.fillStyle(0x14251d,.32);art.fillRect(-17,21,36,5);
        art.fillStyle(0x503a31,1);art.fillRect(-10,9,8,10);art.fillRect(3,9,8,10);
        art.fillStyle(0x3d2c2a,1);art.fillRect(-12,17,11,4);art.fillRect(2,17,11,4);
        art.fillStyle(twix?0x8c4b5a:0x4f6d49,1);art.fillRect(-14,-3,28,17);art.fillRect(-18,0,5,12);art.fillRect(13,0,5,12);
        art.fillStyle(0xf0d0af,1);art.fillRect(-10,-19,20,19);
        art.fillStyle(twix?0x45302d:0x382c29,1);art.fillRect(-12,-25,24,9);art.fillRect(-15,-21,5,20);art.fillRect(10,-21,5,20);
        art.fillStyle(0xf0d0af,1);art.fillRect(-9,-19,18,15);
        art.fillStyle(0x44302c,1);art.fillRect(-5,-13,3,3);art.fillRect(3,-13,3,3);
        art.fillStyle(0xe1a1a0,1);art.fillRect(-2,-7,4,2);
        art.fillStyle(twix?0xb85a6a:0x718b5c,1);art.fillRect(-23,-31,46,9);art.fillRect(-16,-39,32,9);art.fillRect(-8,-44,16,6);
        art.fillStyle(twix?0xeaa2a5:0xa8bd82,1);art.fillRect(-17,-34,8,3);art.fillRect(8,-32,6,3);
        art.fillStyle(0xf5e1c2,1);art.fillRect(-7,-38,4,3);art.fillRect(9,-36,3,3);
        p.add(art);this.player=p;
      }

      drawCompanion(){
        this.companion=this.add.container(755,570).setDepth(570);
        const art=this.add.graphics();
        art.fillStyle(0x17251e,.28);art.fillRect(-11,10,22,4);
        art.fillStyle(0xe9d6bc,1);art.fillRect(-10,-6,20,16);art.fillRect(-7,-11,14,6);
        art.fillStyle(0xd98a9c,1);art.fillRect(-13,-12,26,7);art.fillRect(-8,-17,16,6);
        art.fillStyle(0xffebce,1);art.fillRect(-9,-11,4,3);art.fillRect(5,-11,4,3);
        art.fillStyle(0x4e3d38,1);art.fillRect(-5,-1,3,3);art.fillRect(3,-1,3,3);
        this.companion.add(art);
        this.companionLabel=this.add.text(755,590,pet,{fontFamily:"Georgia",fontSize:"11px",color:"#fff0d0",stroke:"#38251f",strokeThickness:3}).setOrigin(.5).setDepth(9999);
      }

      drawFireflies(){
        for(let i=0;i<22;i++){
          const x=Phaser.Math.Between(100,1500),y=Phaser.Math.Between(70,980);
          const glow=this.add.circle(x,y,9,0xffd680,.1).setDepth(1000);
          const dot=this.add.rectangle(x,y,4,4,0xffe8a6,.92).setDepth(1001);
          this.tweens.add({targets:[glow,dot],x:x+Phaser.Math.Between(-35,35),y:y+Phaser.Math.Between(-45,45),alpha:{from:.15,to:1},duration:Phaser.Math.Between(1300,3400),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,2200),ease:"Sine.inOut"});
          this.ambient.push(glow);
        }
      }

      move(){
        const left=this.cursors.left.isDown||this.keys.A.isDown;
        const right=this.cursors.right.isDown||this.keys.D.isDown;
        const up=this.cursors.up.isDown||this.keys.W.isDown;
        const down=this.cursors.down.isDown||this.keys.S.isDown;
        let dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);
        this.moving=dx!==0||dy!==0;
        const len=Math.hypot(dx,dy)||1; dx/=len;dy/=len;
        this.player.x=Phaser.Math.Clamp(this.player.x+dx*this.speed/60,30,1570);
        this.player.y=Phaser.Math.Clamp(this.player.y+dy*this.speed/60,30,1020);
        this.player.setDepth(this.player.y);
        this.companion.x=Phaser.Math.Linear(this.companion.x,this.player.x-42,0.08);
        this.companion.y=Phaser.Math.Linear(this.companion.y,this.player.y+16,0.08);
        this.companion.setDepth(this.companion.y);
        this.companionLabel.setPosition(this.companion.x,this.companion.y+22).setDepth(this.companion.y+1);
        this.player.setScale(1,this.moving?1:1+Math.sin(this.time.now/260)*.018);
        this.companion.setScale(1,1+Math.sin(this.time.now/210)*.04);
        if(Phaser.Input.Keyboard.JustDown(this.keys.E)){
          if(Phaser.Math.Distance.Between(this.player.x,this.player.y,740,490)<90) callbacks.current.onNpc();
          else {
            const closest=this.spots.reduce<{id:number;distance:number}|null>((best,o)=>{
              const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,o.x,o.y);
              return d<75&&(!best||d<best.distance)?{id:o.id,distance:d}:best;
            },null);
            if(closest) callbacks.current.onMushroom(closest.id);
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

function iRand(seed:number){return seed%5;}
