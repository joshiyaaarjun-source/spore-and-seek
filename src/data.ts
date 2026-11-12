export type Mushroom = { id:number; name:string; rarity:string; habitat:string; effect:string; color:string; };
export const mushrooms:Mushroom[] = [
{ id:1,name:"Petal Cap",rarity:"Common",habitat:"Forest clearings",effect:"Restores a little stamina.",color:"#f08caa" },
{ id:2,name:"Starlight Shroom",rarity:"Common",habitat:"Night-time woodland",effect:"Reveals nearby secrets for a short while.",color:"#7698ff" },
{ id:3,name:"Mossy Button",rarity:"Common",habitat:"Tree trunks and old stones",effect:"A gentle mossy snack. Restores stamina.",color:"#a0bd67" },
{ id:4,name:"Amber Shroom",rarity:"Common",habitat:"Near lanterns",effect:"Warms you and restores a little health.",color:"#e6a33e" },
{ id:5,name:"Cloud Cap",rarity:"Common",habitat:"High places",effect:"Makes your next jumps floatier.",color:"#c9d7ef" },
{ id:6,name:"River Shroom",rarity:"Common",habitat:"Rivers and ponds",effect:"Restores stamina.",color:"#55bce9" },
{ id:7,name:"Lumincap",rarity:"Common",habitat:"Dark caves",effect:"Glows and briefly lights the way.",color:"#f0c44d" },
{ id:8,name:"Ivy Shroom",rarity:"Uncommon",habitat:"Overgrown ruins",effect:"Reveals a hidden clue.",color:"#69a969" },
{ id:9,name:"Spiral Shroom",rarity:"Uncommon",habitat:"Windy clearings",effect:"A playful dizzy spell briefly slows you.",color:"#ed7fbc" },
{ id:10,name:"Dawn Shroom",rarity:"Uncommon",habitat:"Sunrise groves",effect:"Restores stamina.",color:"#f2be71" },
{ id:11,name:"Dusk Shroom",rarity:"Uncommon",habitat:"Sunset groves",effect:"Sharpens your senses.",color:"#a58be8" },
{ id:12,name:"Bloodcap",rarity:"Uncommon",habitat:"Haunted places",effect:"A fictional dangerous species: drains health. Use a healing herb to recover.",color:"#d74c50" },
{ id:13,name:"Coral Shroom",rarity:"Uncommon",habitat:"Coral reefs",effect:"Restores stamina.",color:"#ec8295" },
{ id:14,name:"Tide Shroom",rarity:"Uncommon",habitat:"Tidal pools",effect:"Lets you explore underwater passages.",color:"#568fe0" },
{ id:15,name:"Sand Shroom",rarity:"Uncommon",habitat:"Desert dunes",effect:"Reveals buried objects.",color:"#d99d52" },
{ id:16,name:"Cacti Shroom",rarity:"Uncommon",habitat:"Dry hot regions",effect:"A prickly fictional mushroom that drains stamina.",color:"#8dbd58" },
{ id:17,name:"Snowcap",rarity:"Uncommon",habitat:"Snowy mountains",effect:"Restores stamina.",color:"#c9e2ff" },
{ id:18,name:"Frost Shroom",rarity:"Uncommon",habitat:"Frozen caves",effect:"Protects against icy terrain briefly.",color:"#8b9ee9" },
{ id:19,name:"Clockshroom",rarity:"Rare",habitat:"Clockwork Quarter",effect:"Slows the world briefly.",color:"#e9a64a" },
{ id:20,name:"Geode Shroom",rarity:"Rare",habitat:"Crystal caves",effect:"Reveals nearby crystals.",color:"#9d8be8" },
{ id:21,name:"Feather Shroom",rarity:"Rare",habitat:"Sky gardens",effect:"Grants a light jump boost.",color:"#e9a8db" },
{ id:22,name:"Nebula Shroom",rarity:"Rare",habitat:"Celestial places",effect:"Reveals a constellation clue.",color:"#9470eb" },
{ id:23,name:"Carnival Shroom",rarity:"Rare",habitat:"Stardust Carnival",effect:"A burst of joyful energy restores stamina.",color:"#ef77a7" },
{ id:24,name:"Lantern Shroom",rarity:"Rare",habitat:"Lantern-lit paths",effect:"Lights nearby objects.",color:"#f4b54f" },
{ id:25,name:"Void Shroom",rarity:"Epic",habitat:"Hidden realms",effect:"A strange fictional mushroom that briefly dims the world.",color:"#6548a8" },
{ id:26,name:"Rainbow Cap",rarity:"Epic",habitat:"Rainbow groves",effect:"Reveals hidden colours and paths.",color:"#e975b1" },
{ id:27,name:"Moonbloom",rarity:"Epic",habitat:"Full-moon clearings",effect:"Restores health and stamina.",color:"#b8b8f3" },
{ id:28,name:"Phantom Shroom",rarity:"Epic",habitat:"Haunted realms",effect:"Reveals hidden footprints.",color:"#7c8ae9" },
{ id:29,name:"Ancient Shroom",rarity:"Epic",habitat:"Sacred ruins",effect:"Unlocks an ancient memory clue.",color:"#c58d54" },
{ id:30,name:"Eternal Shroom",rarity:"Legendary",habitat:"A once-in-a-lifetime secret",effect:"A legendary discovery. Restores health and stamina.",color:"#f5cd78" }
];
export const arenas = [
"Enchanted Forest","Waterfall Lagoon","Tree Village","Glowing Grove","Ancient Ruins","Starlight Lake",
"Hidden Swamp","Snowy Mountain","Crystal Cave","Desert Oasis","Cloud Gardens","Autumn Fields",
"The Haunted Manor","The Forgotten Harbor","The Stardust Carnival","The Sunken Kingdom","The Clockwork Quarter","The Everbloom Gardens",
"Celestial Archipelago","Mirror Realm","Candyfall Caverns","Timelost Ruins","Dreamscape Meadows","Volcanic Gardens",
"Aether Library","Whispering Tides","Mechanical Skyline","Frostbloom Expanse","Shadow Grove","Astral Desert"
];
export const pets = ["Mushmellow","Starling","Bubbles","Puddle","Fern","Lumi","Pebble","Willow","Sprout","Taffy"];
export const outfits = ["Default","Rainy Day","Winter","Adventurer","Cottagecore","Pajamas","Festival","Swim","Formal","Foraging","Flower Dress"];