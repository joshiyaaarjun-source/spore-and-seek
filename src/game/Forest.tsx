import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { mushrooms } from "../data";

type Props = { character:"Twix"|"Leaf"; pet:string; onMushroom:(id:number)=>void; onNpc:()=>void; };
export default function Forest({character,pet,onMushroom,onNpc}:Props) {
 const host=useRef<HTMLDivElement>(null);
 const callbacks=useRef({onMushroom,onNpc}); callbacks.current={onMushroom,onNpc};
 useEffect(()=>{
  if(!host.current) return;
  class ForestScene extends Phaser.Scene {
   player!:Phaser.GameObjects.Container; cursors!:Phaser.Types.Input.Keyboard.CursorKeys;
   keys!:Record<string,Phaser.Input.Keyboard.Key>; speed=190; nearby:{id:number,x:number,y:number}[]=[];
   constructor(){super("forest");}
   create(){
    const w=1600,h=1050;
    this.cameras.main.setBounds(0,0,w,h); this.physics.world.setBounds(0,0,w,h);
    this.add.rectangle(w/2,h/2,w,h,0x243d32);
    // Layered woodland floor, clearings, stepping stones, water and lantern-lit paths.
    for(let i=0;i<170;i++){
     const x=Phaser.Math.Between(20,w-20),y=Phaser.Math.Between(20,h-20);
     const leaf=this.add.ellipse(x,y,Phaser.Math.Between(18,55),Phaser.Math.Between(10,28),[0x395a3f,0x4d7047,0x607c55,0x8e5963][i%4],.65);
     leaf.setDepth(y-2);
    }
    this.add.ellipse(800,525,640,360,0xb99a70,.88).setDepth(1);
    this.add.ellipse(800,525,590,315,0xc8a77b,.8).setDepth(1);
    // Lagoon and falls on the left
    this.add.ellipse(235,500,310,560,0x3b8e91,.9).setDepth(2);
    this.add.rectangle(115,480,55,380,0x73c1bb,.8).setDepth(3);
    for(let i=0;i<28;i++){this.add.ellipse(Phaser.Math.Between(80,380),Phaser.Math.Between(260,760),Phaser.Math.Between(25,75),8,0xb0e4d5,.35).setDepth(4);}
    // Tree canopy clusters frame the clearing.
    for(let i=0;i<55;i++){
     const x=Phaser.Math.Between(0,w),y=Phaser.Math.Between(0,h);
     if(x>460&&x<1120&&y>310&&y<760) continue;
     this.add.circle(x,y,Phaser.Math.Between(24,62),[0x203e32,0x2c513b,0x405d42][i%3],.95).setDepth(y);
    }
    // Warm lanterns
    [[500,315],[1100,340],[520,760],[1100,745],[780,285],[840,800]].forEach(([x,y])=>{
      this.add.circle(x,y,35,0xf4ae55,.09).setDepth(8);
      this.add.rectangle(x,y,9,18,0xd99b52).setDepth(9);
      this.add.circle(x,y-7,5,0xffd98b).setDepth(10);
    });
    // Mushroom and forage objects
    const spots=[[620,440],[930,430],[710,635],[1030,610],[490,530],[1190,520],[850,340],[850,730],[400,390],[1230,680]];
    this.nearby=spots.map(([x,y],i)=>({id:(i%10)+1,x,y}));
    this.nearby.forEach(o=>this.drawMushroom(o.x,o.y,o.id));
    // NPC Elder Willow
    this.add.circle(740,490,26,0xd8b28d).setDepth(490);
    this.add.circle(730,482,7,0x49352f).setDepth(491); this.add.circle(750,482,7,0x49352f).setDepth(491);
    this.add.ellipse(740,456,63,25,0x914e58).setDepth(492);
    this.add.text(740,525,"Elder Willow",{fontFamily:"Georgia",fontSize:"16px",color:"#fff0d0",stroke:"#38251f",strokeThickness:4}).setOrigin(.5).setDepth(9999);
    this.add.rectangle(740,490,100,100,0xffffff,0).setInteractive().on("pointerdown",()=>callbacks.current.onNpc());
    // Player token: placeholder stylised chibi while sprite sheets are being prepared.
    this.player=this.add.container(800,550);
    const shadow=this.add.ellipse(0,23,35,13,0x15231e,.45);
    const body=this.add.ellipse(0,2,27,34,character==="Twix"?0x76513f:0xe9c8a1).setStrokeStyle(3,0x49352f);
    const face=this.add.ellipse(0,-8,21,18,0xf0c9a6);
    const hat=this.add.ellipse(0,-23,48,18,0xb75c67).setStrokeStyle(3,0x5a3038);
    this.player.add([shadow,body,face,hat]); this.player.setDepth(550);
    this.cameras.main.startFollow(this.player,true,.09,.09);
    this.cameras.main.setZoom(.95);
    this.cursors=this.input.keyboard!.createCursorKeys();
    this.keys=this.input.keyboard!.addKeys("W,A,S,D,E") as Record<string,Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown",(p:Phaser.Input.Pointer)=>{
      const world=this.cameras.main.getWorldPoint(p.x,p.y);
      const obj=this.nearby.find(o=>Phaser.Math.Distance.Between(world.x,world.y,o.x,o.y)<55);
      if(obj) callbacks.current.onMushroom(obj.id);
      else if(Phaser.Math.Distance.Between(world.x,world.y,740,490)<90) callbacks.current.onNpc();
    });
    this.events.on("update",this.move,this);
   }
   drawMushroom(x:number,y:number,id:number){
    const data=mushrooms[id-1]; const g=this.add.graphics().setDepth(y);
    g.fillStyle(0xf3dfc6);g.fillRoundedRect(x-5,y-3,10,24,4);
    g.fillStyle(parseInt(data.color.slice(1),16));g.fillEllipse(x,y-8,35,19);
    g.lineStyle(2,0x563b39);g.strokeEllipse(x,y-8,35,19);
    g.fillStyle(0xfff0d0);g.fillCircle(x-8,y-10,3);g.fillCircle(x+7,y-5,2);
    this.add.circle(x,y+5,24,0xffffff,0).setInteractive().on("pointerdown",()=>callbacks.current.onMushroom(id));
   }
   move(){
    const left=this.cursors.left.isDown||this.keys.A.isDown, right=this.cursors.right.isDown||this.keys.D.isDown;
    const up=this.cursors.up.isDown||this.keys.W.isDown, down=this.cursors.down.isDown||this.keys.S.isDown;
    let dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);
    const len=Math.hypot(dx,dy)||1; dx/=len;dy/=len;
    this.player.x=Phaser.Math.Clamp(this.player.x+dx*this.speed/60,30,1570);
    this.player.y=Phaser.Math.Clamp(this.player.y+dy*this.speed/60,30,1020);
    this.player.setDepth(this.player.y);
   }
  }
  const game=new Phaser.Game({type:Phaser.AUTO,parent:host.current,width:"100%",height:"100%",backgroundColor:"#243d32",physics:{default:"arcade"},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[ForestScene]});
  return()=>game.destroy(true);
 },[character]);
 return <div className="forest-host" ref={host} aria-label="Playable Enchanted Forest. Use WASD or arrow keys to move, click mushrooms and NPCs." />;
}