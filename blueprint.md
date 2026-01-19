# 📄 Game Design Bible – Ministerial Edition  
**Three Production-Ready Markdown Blueprints**

---

## **📘 DOCUMENT 1: Player Journey – From Bus to Camp**

### **1.1 Entry Sequence (First Launch)**

**Step 1: Loading Screen (3 seconds)**
- **Visual:** Static title card: **"Pathfinder: The Pioneer Trail"** with rotating compass behind text  
- **Technical:** Preloads Google Sheet JSON in background (cached for 5 min)  
- **Progress bar:** "Packing bus..." (fake but reassuring)

**Step 2: Bus Cinematic (5 seconds, skippable)**
- **Visual:** 2.5D top-down yellow bus moves north on forest road; parallax trees scroll left/right  
- **Animation:** Bus bobs slightly; wheels rotate; occasional bird flies across screen  
- **Audio:** Engine hum + piano melody; tap → skip → hard cut to Step 3  
- **End:** Bus fades, screen wipes to character select

**Step 3: Character Selection**
- **UI:** Full-screen overlay (Phaser DOM element), **not** separate React component  
- **Layout:** Boy sprite left, Girl sprite right, both waving 2-frame animation  
- **Details:**  
  - **Tap sprite** → enlarges with sparkle, name appears ("Alex" / "Sam")  
  - **Confirm button** at bottom: **"Let's Go!"** (big, 120×60 px)  
  - **Choice saved** to `localStorage.character` permanently  
- **No stats difference** – pure cosmetic  
- **Code:**  
  ```javascript
  const selectBoy = () => {
    localStorage.setItem('character', 'boy');
    scene.start('RegistrationScene');
  };
  ```

**Step 4: Registration Booth**
- **Visual:** Top-down view of tent with leader at desk, crowd of kids behind (non-interactive)  
- **UI:**  
  - **Top label:** "Enter Your Pathfinder ID"  
  - **Input field:** 6-digit numeric keypad pops on mobile; desktop allows typing  
  - **Submit button:** **"Find My Rank"**  
- **Validation:**  
  - If ID found in sheet → show rank badge popup  
  - If ID missing → **"Try again or play as Guest"** (Guest = auto-place as Friend)  
- **Privacy:** Input clears after 5 seconds; no ID stored permanently, only rank + name  

**Step 5: Rank Confirmation Popup**
- **Design:** Modal with:  
  - Large rank badge icon (Friend = pine tree, Companion = lake wave, etc.)  
  - Text: **"Welcome, Alex! You're a Friend."**  
  - **Button:** "Take me to Pine Valley!" (or appropriate camp)  
- **Audio:** Trumpet fanfare (short, 1 sec)  
- **On confirm:**  
  - Save `{rank: "Friend", name: "Alex", xp: 0}` to IndexedDB  
  - Start bus-warp cinematic  

**Step 6: Bus Warp (3 seconds)**
- **Visual:** Same bus, interior view; character sprite sits in seat; window shows road passing  
- **Destination sign:** Above windshield shows camp name **"Pine Valley"**  
- **Arrival:** Bus doors open, fade to camp gate  

**Step 7: Camp Gate Arrival**
- **Visual:** Sub-camp gate with arch sign, leader waiting  
- **Dialog box (auto-open):**  
  - **Leader:** "Welcome to Pine Valley, Alex! Here's your starter kit."  
  - **Rewards:** Class-A T-shirt sprite appears on character, + Water Bottle item  
- **Player gain control:** Can now move freely  

---

### **1.2 Returning Player Flow (Subsequent Launches)**

1. **Skip bus cinematic** → straight to loading screen  
2. **Read IndexedDB** → if rank exists, load last camp position  
3. **Check for daily login bonus** (last login date vs. today)  
4. **Show camp** with character at saved coordinates  
5. **If real-time > 7 days since last play:** Leader approaches: "Welcome back! We've missed you." + small XP gift (50)  

---

### **1.3 Google Sheet Integration (Technical)**

**Sheet Format:**  
```
Student_ID | First_Name | Rank        | Group
-----------------------------------------------
12345      | Alex       | Friend      | PF
67890      | Mia        | Explorer    | PF
11111      | Leo        | Sunbeam     | A
```

**Fetch Logic:**  
```javascript
// In RegistrationScene
const sheetURL = 'https://docs.google.com/spreadsheets/d/YOUR_KEY/gviz/tq?tqx=out:csv&sheet=Students';

fetch(`${sheetURL}&tq=id%3D${studentID}`)
  .then(res => res.text())
  .then(csv => {
    const [name, rank] = parseCSV(csv);
    if (rank) {
      localStorage.setItem('playerRank', rank);
      localStorage.setItem('playerName', name);
      scene.start('CampWarpScene', { destination: getCampFromRank(rank) });
    }
  });
```

**Privacy & Security:**  
- Sheet is **published to web** (read-only, no auth)  
- Use **Cloudflare Worker** (free) to proxy request and strip extra data  
- Client only receives: `{id: 12345, name: "Alex", rank: "Friend"}`  
- **No PII stored** – name discarded after welcome message  

---

## **📘 DOCUMENT 2: Camp Maps & Layouts**

### **Master Map Specifications**

| Parameter | Value |
|-----------|-------|
| **Tile size** | 16×16 px (HQ: 32×32) |
| **Collision layer** | `walls` (impassable) + `objects` (interactive) |
| **Parallax layers** | 3: `bg` (0.3x scroll), `mid` (1.0x), `fg` (trees/roofs) |
| **Day-night tint** | `#ffffff` (day) → `#2a4d6b` (night) → `#1a1a2e` (midnight) |
| **Zoom level** | 2x for mobile, 1.5x for desktop |

---

### **1. Pine Valley (Friend Rank) – Pathfinder**

**Size:** 40×30 tiles (640×480 px rendered at 2x = 1280×960 px)  
**Palette:** Sap green (#4a7c59), sky blue (#87CEEB), tent beige (#f5f5dc)  
**Theme:** Gentle forest intro, safety-first

**Layout Diagram:**
```
[Forest Edge (N)]
   ████████████████████████████
   ██╔══════════════════════╗██
   ██║  Devotional Spot 1   ║██
   ██╚══════════════════════╝██
   ████████╔════════╗██████████
   ████████║  River ║██████████
   ████████╚════════╝██████████
   ██╔═══════════════╗██████████
   ██║  Pine Valley  ║██████████
   ██║     Plaza     ║██████████
   ██╚═══════════════╝██████████
   ██╔════╗╔═══════╗╔═══════╗██
   ██║Cabin║║ Craft ║║ Chapel║██
   ██╚════╝╚═══════╝╚═══════╝██
   ████████████████████████████
[Exit Gate (NE) → Lake Cove]
```

**Key Buildings:**
| Building | Size (tiles) | Coords (x,y) | Purpose |
|----------|--------------|--------------|---------|
| Welcome Cabin | 8×6 | (12, 20) | Character uniform change, personal storage chest |
| Craft Hut | 6×4 | (22, 20) | Craft mini-games, material storage |
| Chapel Tent | 5×5 | (32, 20) | Devotions, verse memorization, daily prayer bonus |
| Leader HQ | 4×4 | (16, 14) | Ranger Rob spawns, mission board, first-aid tutorial |

**Interactive Objects:**
- **Honor Board** – (18, 12) – Billboard sprite, opens UI overlay  
- **Flower patches** – (10,18), (25,18), (35,18) – Daily harvest (tappable)  
- **Campfire pit** – (20, 16) – Dark until Fire Building honor complete  
- **Sleeping bags** – (15,22) to (20,22) – Tap to rest (heal, advance time)  
- **Devotional Spot 1** – (8, 8) – Sunbeam ray animates, verse appears  
- **River** – (20, 5) to (30, 5) – Walkable at (25,5) and (28,5) log crossings  

**NPC Spawn Points:**
- Ranger Rob: (16, 14) – Patrols radius 5 tiles  
- Camper Chloe: (10, 10) – Static, faces river  
- Squirrel: Random tree tiles (7,7), (33,8), etc.

**Unique Mechanics:**
- **Tutorial Shield:** First 2 honors must be completed here; exit gate locked until done  
- **River Splash:** Walking through shallow water plays splash SFX, slows movement 10%  
- **Daily Reset:** Flowers respawn at 6 AM game-time; NPCs return to spawn  

---

### **2. Lake Cove (Companion Rank) – Pathfinder**

**Size:** 50×40 tiles  
**Palette:** Deep blue (#1e3a8a), sand yellow (#facc15), sunset orange (#fb923c)  
**Theme:** Water safety, team bonding

**Layout:**  
West = forest buffer (path back to Pine Valley)  
Center = Lake House on stilts (10×8)  
South = Beach (wide sandy area)  
East = Fire Circle amphitheater  
North = Swim Safety Pier with buoy line

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Lake House | 10×8 | (25, 15) | Multi-floor: crafts, kitchen, Bible study room |
| Boat Rental Shack | 3×4 | (30, 20) | Canoe/kayak mini-game trigger |
| Changing Cabins | 2×2 each | (15,35) row | Cosmetic uniform swap |
| Lifeguard Tower | 2×2 | (40, 10) | Patrols beach, gives water-safety quest |

**Interactive Objects:**
- **Canoe** – (30, 20) – Tap → rhythm paddling mini-game  
- **Fire Circle** – (20, 35) – Evening devotion trigger (6 PM+)  
- **Beach shells** – Random beach tiles – Daily collect 10  
- **Weather vane** – (27, 12) – Tap → shows wind direction  
- **Bible verse rocks** – (18,33), (32,33), etc. – Tap → audio verse  

**NPCs:**
- Captain Cathy: (28, 18) – Docks area  
- Lifeguard Patty: (40, 10) – Pier  
- Fisher Finn: (45, 30) – North shore  

---

### **3. Maple Ridge (Explorer Rank) – Pathfinder**

**Size:** 60×50 tiles  
**Palette:** Autumn red (#dc2626), forest brown (#713f12), mist gray (#9ca3af)

**Layout:**  
- **Central:** Treehouse Village (3 houses connected by rope bridges)  
- **East cliff:** Cave entrance → 3-room interior map  
- **West:** Maple Syrup Shack near grove of 5 maple trees  
- **Hidden:** Devotional Ledge behind waterfall (requires cave key)

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Treehouse HQ | 8×6 | (30, 15) | Blueprint table, rope-bridge building mini-game |
| Cave Lodge | 5×5 | (50, 20) | Dark interior, lantern puzzles |
| Syrup Shack | 4×4 | (10, 30) | Tap trees → sap collection mini-game |

**Interactive Objects:**
- **Rope bridges** – (28,15) to (32,15) – Swing physics, cannot cross without balance badge  
- **Cave crystals** – (52,22), (53,24), etc. – Glow in dark, 7 colors  
- **Falling leaves** – Ambient particle overlay  
- **Treehouse ladder** – (31,18) – Rhythm tap mini-game to climb  

**NPCs:**
- Craftsman Carla: (30, 15) – Treehouse interior  
- Cave Ranger: (50, 18) – Cave entrance  

---

### **4. Summit Base (Ranger Rank) – Pathfinder**

**Size:** 70×60 tiles  
**Palette:** Stone gray (#64748b), deep green, snow white (#f8fafc)

**Layout:**  
- **Mountain spine:** Runs North-South, path switchbacks east side  
- **Base plateau:** Main buildings flat area  
- **West cliff:** Viewpoint with parallax clouds  
- **Cave network:** 5 interconnected rooms (rubble-blocked passages)

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Summit Lodge | 12×8 | (35, 30) | Fireplace, map room, trophy display |
| Tool Shed | 4×5 | (25, 35) | Locked until Axe Safety badge; contains pickaxe, rope |
| Weather Station | 3×3 | (40, 25) | Thermometer mini-game |

**Interactive Objects:**
- **Flagpole** – (35, 20) – Daily flag-raising mini-game  
- **Firewood pile** – (30, 40) – Chop 10 times daily for supply  
- **Rock wall** – (20, 45) – Tap handholds sequence mini-game  
- **Ice wall** – (45, 50) – Hardest climbing challenge  

---

### **5. Frontier Outpost (Voyager Rank) – Pathfinder**

**Size:** 80×70 tiles  
**Palette:** Desert sand (#fbbf24), cactus green, mission blue (#1e40af)

**Layout:**  
- **Biome blend:** North forest, South desert  
- **Central outpost:** Fort walls (10×10 interior)  
- **International village:** 5 cultural huts (4×4 each)  
- **Mission field:** 8 garden plots  
- **Trading post:** Swap items for artifacts

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Mission Hall | 10×10 | (40, 25) | Stage, world map mural, presentation space |
| Cultural Huts | 4×4 each | (20,40), (25,40), (30,40), (35,40), (40,40) | Country-specific mini-games |
| Trading Post | 5×5 | (50, 30) | Swap system for artifacts |

**Interactive Objects:**
- **World map mural** – (42, 27) – Tap countries → audio facts  
- **Packing crates** – (45, 25) – Tetris-fit supply mini-game  
- **Garden plots** – (55, 50) – Plant/water/harvest cycle  
- **Cultural instruments** – Drum, rain stick → rhythm mini-game  
- **Horse (Spirit)** – (60, 20) – Rideable mount, 2x speed  

---

### **6. Eagle Peak (Guide Rank) – Pathfinder**

**Size:** 90×80 tiles (largest)  
**Palette:** Snow white, eagle brown (#92400e), aurora teal (#14b8a6)

**Layout:**  
- **Summit plateau:** 20×20 flat area with flagpole, council circle  
- **East/West ridges:** Scenic overlooks (parallax cloud layers)  
- **North cliff:** Eagle nest (ambient)  
- **South slope:** Ski trails to Frontier Outpost  
- **Icy caves:** Crystal rooms with prismatic light  
- **Aurora overlay:** Night-only transparent animation

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Summit Lodge | 15×10 | (45, 40) | Library, trophies, fireplace |
| Council Circle | 8×8 | (45, 30) | Rank-up ceremonies |
| Eagle’s Nest | 6×6 | (85, 20) – via rope bridge | Ambient only, no entry |

**Interactive Objects:**
- **Flagpole** – (45, 30) – Most XP daily (100 XP)  
- **Trophy case** – (47, 42) – 3D display of earned honors  
- **Library books** – (50, 45) – 12 SDA pioneer stories (audio)  
- **Council fire** – (45, 32) – Only during ceremonies  
- **Snowman builder** – (40, 50) – 3-part mini-game  
- **Aurora viewer** – (70, 10) – Night only → photograph collectible  
- **Telescope** – (80, 15) – Fast-travel unlock after use  

---

### **7. Sunflower Meadow (Busy Bee) – Adventurer**

**Size:** 30×25 tiles (smallest)  
**Palette:** Sunflower yellow, sky cyan, cloud white

**Layout:**  
- **One loop path:** No dead ends  
- **Center:** Honeycomb Cabin (6×5)  
- **4 exits** (N/S/E/W) all loop back (safe)  
- **8 flower patches** always in bloom

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Honeycomb Cabin | 6×5 | (15, 12) | Simple interior, no complex mechanics |
| Story Stump | 3×3 | (8, 8) | Mama Bear tells 10-sec Bible stories |
| Slide | 2×1 | (20, 20) | Tap → auto-slide, +1 joy XP |

**Interactive Objects:**
- **Flowers** – All patches – Tap → bounce, +1 nature point  
- **Honey pot** – (15, 10) – Collect 5 flowers → tap → honey jar item  
- **Bee Buddy** – Follows player, buzzes near flowers  

---

### **8. Rainbow Ridge Jr. (Sunbeam) – Adventurer**

**Size:** 35×30 tiles  
**Palette:** Pastel rainbow

**Layout:**  
- **Rainbow bridge** – 7-color central bridge (bouncy)  
- **Cloud pads** – 5 floating platforms (auto-jump)  
- **Crystal cave** – Small cave with color-change crystals

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Paint Pavilion | 5×4 | (18, 15) | Canvas mini-game |
| Color Mix Hut | 4×4 | (10, 25) | Red+Blue=Purple tutorial |

**Interactive Objects:**
- **Bridge tiles** – (17,18) to (23,18) – Tap → play musical note sequence  
- **Clouds** – (15,10), (20,8), (25,10), (30,8), (32,12) – Auto-jump pads  
- **Crystals** – (5,5) – Tap → screen flashes color, +5 XP  

---

### **9. Lego Creek (Builder) – Adventurer**

**Size:** 40×35 tiles  
**Palette:** Bright orange, brick red, dirt brown

**Layout:**  
- **Creek** – Winding water path (shallow)  
- **Lego pond** – Square pond, floating bricks  
- **Construction zone** – Open area with scattered blocks

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Builder Barn | 6×5 | (20, 20) | Workbenches, blueprint wall |
| Crane Ride | 3×3 | (30, 10) | Tap → ride up, panoramic view |

**Interactive Objects:**
- **Blocks** – Random tiles – Drag to stack (physics, no fail)  
- **Crane** – (30,10) – Auto-lift, 3-second panoramic cutscene  
- **Creek stones** – (10,15), (15,15), (20,15) – Jump across (auto-path)  

---

### **10. Helping Harbor (Helping Hand) – Adventurer**

**Size:** 45×40 tiles  
**Palette:** Hot pink, ocean blue, sand beige

**Layout:**  
- **Harbor** – Dock with 2 boats  
- **Lost & Found office** – (10,10)  
- **Community garden** – (25,25) – 8 rows

**Key Buildings:**
| Building | Size | Coords | Purpose |
|----------|------|--------|---------|
| Lost & Found | 4×4 | (10, 10) | Return items to owners |
| Garden | 8×8 | (25, 25) | Water plants mini-game |

**Interactive Objects:**
- **Boats** – (15,5), (20,5) – Tap → rocking animation  
- **Lost items** – Spawn daily at (12,12), (8,8), etc. – Drag to NPC  
- **Watering can** – (28,30) – Drag over plants → auto-sprinkle  

---

## **📘 DOCUMENT 3: Counselors & NPCs**

### **Pathfinder Main Counselors**

| Name | Role | Visual Cue | Spawn Location | Honor Specialty | Personality |
|------|------|------------|----------------|-----------------|-------------|
| **Ranger Rob** | Outdoor Director | Plaid shirt, whistle, utility belt | Pine Valley HQ (16,14) | Camping, Survival, Hiking | Enthusiastic, safety-obsessed, uses phrases like "Check your gear!" |
| **Pastor Pete** | Spiritual Mentor | Neckerchief with cross pin, Bible | Chapel Tent (32,20) | Bible, Prayer, Doctrine | Gentle, storytelling, quotes verses naturally |
| **Craftsman Carla** | Activities Coordinator | Paint-stained apron, flower clip | Maple Ridge Treehouse (30,15) | Arts, Crafts, Nature Study | Creative, cheerful, detail-oriented |
| **Captain Cathy** | Leadership Trainer | Captain's hat, clipboard | Lake Cove Dock (28,18) | Leadership, Service, Teamwork | Confident, challenging, inspiring |

### **Adventurer Main Counselors**

| Name | Role | Visual Cue | Spawn Location | Honor Specialty | Personality |
|------|------|------------|----------------|-----------------|-------------|
| **Mama Bear** | Caregiver | Brown bear, apron, glasses | Sunflower Meadow Stump (8,8) | Kindness, Sharing, Bible Spark | Warm, hugs, repeats simple truths |
| **Mr. Sun** | Narrator | Floating sun emoji with smiley face | Follows player (0,0 offset) | All (guides globally) | Cheerful, says "Good job!" after every completion |
| **Builder Bob** | Construction Guide | Hard hat, orange vest | Lego Creek Barn (20,20) | Building, Stacking | Encourages "Try again!" with thumbs-up |
| **Harbor Master** | Helper Coordinator | Sailor hat, whistle | Helping Harbor Dock (15,5) | Service, Returning Lost Items | Praising, "You're a great helper!" |

### **Secondary NPCs (Ambient & Quest-Givers)**

| Name | Camp | Visual | Quest Type | XP Reward |
|------|------|--------|------------|-----------|
| **Camper Chloe** | Pine Valley | Blue shirt, shy stance | Friendship bracelet (first help quest) | 30 XP |
| **Fisher Finn** | Lake Cove | Fishing vest, hat | Fishing 5-tier quest line | 25 XP per tier |
| **Seagull** | Helping Harbor | White bird, flies | Steals item → chase mini-game | 20 XP |
| **Squirrel Scout** | Maple Ridge | Brown squirrel | Hidden 3 locations → reveals secret path | 15 XP |
| **Owl Mentor** | Maple Ridge (night) | Grey owl, glowing eyes | Wisdom riddles (3) | 40 XP total |
| **Junior Rangers** | Summit Base | Smaller PF uniforms | Assign tasks (delegate mini-game) | 50 XP/day |
| **Seagull** | Helping Harbor | White bird, flies | Steals item → chase mini-game | 20 XP |
| **Rusty (Rescue Dog)** | Summit Base | Golden retriever | Follows after Animal Care badge, digs items | Passive bonus |
| **Spirit (Horse)** | Frontier Outpost | Brown horse, saddle | Rideable mount, 2x speed | Unlock after badge |

### **NPC Interaction Mechanics**

**All NPCs share this base structure:**
```javascript
class NPC extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, name) {
    super(scene, x, y, key);
    this.name = name;
    this.questGiven = false;
    this.questComplete = false;
  }

  interact() {
    if (!this.questGiven) {
      this.showDialog(["Hello! Can you help me?"]);
      this.questGiven = true;
    } else if (this.questGiven && !this.questComplete) {
      this.checkQuestCompletion();
    } else {
      this.showDialog(["Thanks again!"]);
    }
  }
}
```

**Dialog System:**  
- **Text appears** above head in speech bubble (9-patch sprite)  
- **Voice-over** auto-plays for Adventurer NPCs (TTS or pre-recorded)  
- **Options:** Yes/No buttons for quests; Cancel to exit  
- **Visual feedback:** NPC nods when quest complete, sparkle effect  

**NPC Schedules (Simple):**
- **Day (6 AM – 6 PM):** Patrol spawn point ± 5 tiles  
- **Evening (6 PM – 8 PM):** Migrate to campfire/story circle  
- **Night (8 PM – 6 AM):** Return to cabin, invisible (except Owl)  

---

### **Spiritual Integration for All NPCs**

- **Every NPC** has a **plaque** near them with brief verse:  
  - Ranger Rob: *"The Lord is my shepherd" – Psalm 23:1*  
  - Mama Bear: *"Cast all your anxiety on Him" – 1 Peter 5:7*  
- **Daily devotions:** 2 NPCs per camp participate, giving +10 XP for watching  
- **Prayer prompts:** Tap NPC → "Would you like to pray together?" → simple voice prayer (optional)  

---

**You now have three production-ready documents:**  
1. **Player journey** from first click to camp arrival, with code snippets  
2. **10 camp maps** with exact tile coordinates, palettes, and layouts  
3. **All NPCs** with spawn locations, personalities, and interaction logic  

**Next actionable step:** Open **Tiled Map Editor**, create a new 40×30 map, and start placing tiles for **Pine Valley** using the specs in Document 2.




# 🎮 Game Interaction & Mini-Game Design Bible

## **Core Interaction Philosophy: "Tap, Drag, Talk"**
Every action in the game reduces to **three verbs**. No complex gestures—keeps it accessible for 6-year-olds on old tablets.

---

## **1. Player-to-World Interaction Matrix**

| Object Type | Interaction | Feedback | Example |
|-------------|-------------|----------|---------|
| **NPC** | Tap once | Speech bubble + voice line | Talk to Ranger Rob |
| **Harvestable** | Tap once | Item flies to inventory, sparkle | Pick flower |
| **Tool (axe, shovel)** | Tap & hold 0.5s | Progress ring, then action | Chop wood |
| **Mini-game trigger** | Tap once | Scene fade to mini-game UI | Start canoe race |
| **Door/Entrance** | Tap once | Screen swipe to interior scene | Enter cabin |
| **Sign/Plaque** | Tap once | Dialog box with text | Read verse |
| **Fast-travel** | Tap once | Bus arrives, fade to new camp | Take bus |
| **Inventory item** | Drag & drop | Snap to target or return | Give honey to Mama Bear |

**Technical in Phaser:** Use `this.input.on('pointerdown')` for taps, `this.input.on('drag')` for drags. All interactive objects have `setInteractive()` and custom `on('pointerdown')` handler.

---

## **2. Mini-Game Taxonomy (By Category)**

### **A. Outdoor Skills (40% of honors)**

#### **1. Fire Building (Pine Valley)**
**Rank:** Friend (Tutorial)  
**Pillar:** Apply  
**Mechanics:**
- **Screen:** Side-view of fire pit, wood pile at right, tinder at left  
- **Goal:** Drag items in order: **Tinder → Kindling → Fuelwood**  
- **Timing:** 30 seconds  
- **Feedback:**  
  - ✔️ Correct: Item snaps into pit, sparkles, fire grows  
  - ❌ Wrong: Item bounces back, X appears, no penalty (retry)  
- **Final step:** Hold finger/mouse on fire → breath meter fills → release → fire ignites  
- **Win:** Flames animate, +50 XP, badge popup  
- **Adventurer version:** Items glow in correct order, no timer

#### **2. Compass Navigation (Lake Cove)**
**Rank:** Companion  
**Pillar:** Practice  
**Mechanics:**
- **UI:** Top-down mini-map, player at center, compass rose top-right  
- **Goal:** Follow bearing (e.g., "Go 5 steps West")  
- **Input:** Tap tile in direction; character moves 1 tile per tap  
- **Obstacles:** Trees block path; must navigate around  
- **Success:** Reach target tile (glows green when close) → +40 XP  
- **Variations:**  
  - **Explorer tier:** Add "45° NE" directions  
  - **Adventurer:** Only N/S/E/W, target tile flashes  

#### **3. Knot Tying (Maple Ridge)**
**Rank:** Explorer  
**Pillar:** Practice  
**Mechanics:**
- **Screen:** Close-up of rope with numbered dots (1-4)  
- **Goal:** Tap dots in sequence for knot (e.g., Square knot = 1→3→2→4)  
- **Timing:** 15 seconds for simple, 30 for complex  
- **Visual:** Rope draws line between dots as tapped; glows gold when correct  
- **Win:** Knot tightens, +60 XP  
- **Lose:** Timer runs out → rope tangles → instant retry  

#### **4. Ice Climbing (Eagle Peak)**
**Rank:** Guide (Expert)  
**Pillar:** Time Trial  
**Mechanics:**
- **Screen:** Side-view ice wall, handholds as glowing blue spheres  
- **Goal:** Tap spheres in sequence (5-8 holds) before stamina runs out  
- **Stamina bar:** Drains constantly; each tap pauses drain for 0.5s  
- **Fail:** Fall to bottom, checkpoint at halfway  
- **Win:** Reach summit → +100 XP, dramatic eagle cry SFX  

---

### **B. Bible Knowledge (30% of honors)**

#### **5. Verse Scramble (All camps)**
**Pillar:** Memorize  
**Mechanics:**
- **UI:** Words of verse scattered like puzzle pieces  
- **Goal:** Drag words into correct order  
- **Hint:** First letter of each word visible on drop zone  
- **Audio:** Plays correct verse when completed  
- **Versions:**  
  - **Adventurer:** 3-4 words only ("God loves you")  
  - **Pathfinder:** Full verse (10-12 words)  
- **Reward:** +25 XP per verse  

#### **6. Bible Book Order (Chapel Tent)**
**Pillar:** Quiz  
**Mechanics:**
- **Screen:** Bookshelf with empty slots (66 slots for full Bible)  
- **Goal:** Drag book names into correct order (Genesis → Revelation)  
- **Segmented:** Only 5-10 books tested at a time per honor  
- **Feedback:** Shelf glows when section correct  
- **Adventurer:** Only first 5 books of OT/NT  

#### **7. Parable Matching (Pioneer Hall)**
**Pillar:** Learn  
**Mechanics:**
- **Screen:** 3 picture cards (e.g., lost sheep, sower, good Samaritan) + 3 story titles  
- **Goal:** Drag title to matching picture  
- **Audio:** Each picture plays 5-sec narration on tap  
- **Win:** All matched → unlocks "Apply" quest to help NPC  

---

### **C. Arts & Crafts (20% of honors)**

#### **8. Nature Craft (Pine Valley)**
**Pillar:** Craft  
**Mechanics:**
- **Screen:** Workbench with 3 slots (materials: flower, stick, leaf)  
- **Goal:** Arrange materials in pattern (e.g., flower→stick→leaf = nature wand)  
- **Drag & drop:** From inventory onto bench  
- **Preview:** Ghost image shows target pattern  
- **Success:** Item crafts, appears in inventory, +30 XP  

#### **9. Tie-Dye (Lake House)**
**Pillar:** Craft  
**Mechanics:**
- **Screen:** White shirt on table, 5 dye bottles (colors)  
- **Goal:** Tap bottle → shirt section fills with color; repeat 3 colors  
- **No fail:** Any combination works (celebrates creativity)  
- **Result:** Shirt sprite updates to dyed pattern (saved to avatar)  

#### **10. Rock Painting (Maple Ridge)**
**Pillar:** Craft  
**Mechanics:**
- **Screen:** Blank rock canvas, 4 paint colors, brush icon  
- **Goal:** Drag brush over rock to "paint" (simple stamp shapes)  
- **Template:** Optional ghost outline (heart, cross, smiley)  
- **Save:** Painted rock becomes inventory item (gift to Mama Bear)  

---

### **D. Leadership & Service (10% of honors)**

#### **11. Lost & Found (Helping Harbor)**
**Pillar:** Help  
**Mechanics:**
- **Screen:** Table with 5 items (hat, shoe, book, toy, water bottle)  
- **Goal:** Drag each item to correct NPC silhouette (e.g., hat → head outline)  
- **Hint:** NPCs in background wave when correct item dragged near  
- **Success:** All items returned → NPCs cheer, +40 XP  

#### **12. Delegate Tasks (Summit Base)**
**Pillar:** Apply  
**Mechanics:**
- **Screen:** 3 junior ranger NPCs, each with empty task bubble  
- **Goal:** Drag task icons (chop wood, carry water, tidy) onto NPCs  
- **Constraint:** Each NPC has 1-task limit per day  
- **Reward:** Next day, return to find XP bonus (50) + thank-you notes  

---

## **3. Player Interaction Deep-Dive**

### **A. NPC Interaction Flow**

```javascript
// Pseudo-code for all NPC interactions
class NPC {
  interact() {
    if (this.isFirstMeeting) {
      this.showDialog(["Hi! I'm " + this.name, "Need help?"]);
      this.isFirstMeeting = false;
    } else if (this.hasQuest && !this.questComplete) {
      this.giveQuest();
    } else if (this.questComplete) {
      this.showDialog(["Thanks for your help!"]);
      this.giveReward();
    } else {
      this.showRandomDialog();
    }
  }

  giveQuest() {
    // Show quest description in dialog box
    // Add quest to player.questLog
    // Highlight target on map (exclamation mark)
  }

  checkQuestCompletion() {
    if (player.hasQuestItems(this.requiredItems)) {
      this.questComplete = true;
      this.giveReward();
    } else {
      this.showDialog(["Still need " + this.requiredItems]);
    }
  }
}
```

**Visual Feedback:**
- **Exclamation mark** (!) above head = new quest  
- **Question mark** (?) = quest in progress  
- **Sparkles** = quest ready to turn in  
- **Heart** = quest complete, friendship increased  

### **B. Environmental Interaction**

**Harvestables (Flowers, Shells, etc.):**
- **Tap once** → item flies to inventory (Tween animation)  
- **Respawn:** Daily at 6 AM game-time  
- **Cap:** 10 per day to prevent grinding  

**Tools (Axe, Shovel):**
- **Tap & hold** → radial progress bar fills (0.5-1 second)  
- **Stamina cost:** Small drain (capped at 20 % of total)  
- **Sound effect:** Chop, dig, splash  

**Doors/Exits:**
- **Tap once** → screen swipe effect (left/right) to new scene  
- **Return:** Always a "Go Back" button or doorway  

**Signs/Plaques:**
- **Tap once** → dialog box with verse or info  
- **Adventurer:** Auto-play audio narration  

### **C. Inventory System (Simplified)**

**Slots:** 20 items max (visual grid 5×4)  
**Interaction:**  
- Tap item → **Equip/Use/Info** buttons appear  
- Drag item → **Drop** (if trash can area visible) or **Give** (to NPC)  

**Adventurer version:** No inventory management – items auto-use when tapped in world.  

---

## **4. Social & Cooperative Mechanics (Future-Proofing)**

### **A. Campfire Devotions (Shared Event)**
- **Trigger:** Real-time 7 PM (evening)  
- **Location:** Fire Circle in respective sub-camp  
- **Mechanics:**  
  - NPCs migrate to circle over 30 seconds  
  - Player can sit (tap stump) → camera zooms in  
  - Pastor Pete/Mama Bear tells 60-second story  
  - All present players receive +10 XP  
  - **No chat** – maintains safety for minors  

### **B. Mentor Mode (Post-Guide)**
- **Unlock:** Achieve Guide rank  
- **Mechanics:**  
  - Receive "distress signals" from junior players (NPC simulation for now)  
  - Teleport to their camp → help with quest → +50 XP  
  - Daily cap: 3 helps to prevent XP inflation  

### **C. Global Events (Quarterly)**
- **Example:** "World Pathfinder Day"  
  - Special quest available in all camps  
  - Collect virtual flags from 10 countries  
  - Turn in for exclusive badge + uniform trim  

---

## **5. Difficulty Scaling for Adventurer vs. Pathfinder**

| Mechanic | Adventurer (6-9) | Pathfinder (10-15) |
|----------|------------------|--------------------|
| **Timer** | None | 15-60 seconds |
| **Retries** | Unlimited, instant | Small XP penalty (-2%) |
| **Hints** | Always visible (glow) | Optional (tap "?" button) |
| **Text** | Voice-over + 3 words max | Full sentences |
| **Controls** | Tap zones ≥ 80×80 px | Standard 16×16 hit-box |
| **Collision** | Generous (50% larger) | Precise |
| **Stamina** | Infinite | Drains with heavy tasks |
| **XP rewards** | 50% of PF values | Standard |

---

## **6. MVP Mini-Game Priority (80/20 Rule)**

**Build these 4 first – they unlock 60% of early honors:**

1. **Fire Building** (Pine Valley) – Teaches drag & drop  
2. **Verse Scramble** (Chapel) – Teaches text interaction  
3. **Flower Collect** (Sunflower Meadow) – Teaches harvesting  
4. **Lost & Found** (Helping Harbor) – Teaches helping loop  

**Total dev time:** ~2 weeks for all 4 (1 week per game, overlapping art).  

---

**Next step:** Pick **one mini-game** and we'll write the full Phaser 3 scene code, including state management and animation.


# 🌲 **UPDATED Game Design Bible – Exploration & Nature Edition**

---

## **📘 DOCUMENT 2 (Revised): Camp Maps & Open-World Layout**

### **Core Philosophy: "Leave No Trace"**
- **No tree cutting** – All wood comes from **fallen branches** on ground
- **Interactive objects** are **fauna, flowers, rocks, signs** – never harm trees
- **Wildlife** (squirrels, birds, deer) **cannot be harmed** – only观察和feed

---

### **1. Pine Valley (Friend) – Open Exploration Version**

**Size:** **50×40 tiles** (expanded from 40×30 for wandering)  
**New Features:**
- **Winding trails:** 3 non-linear paths that loop back to plaza  
- **Hidden grottos:** 2 secret clearings behind dense trees (requires exploring)  
- **Observation deck:** (18,5) – Climbable wooden platform, reveals 30% of map fog  
- **Nature trail markers:** 5 numbered posts – find all = "Trailblazer" badge  

**Layout:**
```
[Forest Edge (N)]
   ████████████████████████████
   ██╔══════════════════════╗██
   ██║  Observation Deck   ║██  ← New: climb for view
   ██╚══════════════════════╝██
   ████████╔════════╗██████████
   ████████║  River ║██████████
   ████████╚════════╝██████████
   ██╔═══════════╗═══════════╗██  ← New: branching paths
   ██║ Pine Plaza║→ Hidden Grotto 1
   ██╚═══════════╝═══════════╝██
   ██╔════╗╔═════╗╔═════╗╔═══╗██
   ██║Cabin║║Craft║║Chapel║║HQ ║██
   ██╚════╝╚═════╝╚═════╝╚═══╝██
   ████████████████████████████
```

**Interactive Objects – Nature Edition:**
| Object | Interaction | Purpose |
|--------|-------------|---------|
| **Fallen branches** | Tap once | Collect for fire-building (respawn daily) |
| **Wildflowers** | Tap once | Harvest for crafts (8 patches, 3 flowers each) |
| **Bird nests** | Tap → binoculars zoom | Observe (educational popup, no touching) |
| **Deer tracks** | Tap → footprint stamp | Trail-marking mini-game (follow tracks) |
| **Mushrooms** | Tap → identification card | Learn fungi names (non-edible warning) |

---

### **2. Lake Cove (Companion) – Beach Expansion**

**New Beach Area:** 15 tiles deep (was 10)  
**Shoreline secrets:**
- **Tide pools:** 4 pools at low tide (6 AM game time) – tap hermit crabs  
- **Driftwood piles:** 3 piles – tap to collect (building material)  
- **Dune grass:** Tap → grass sways, reveals hidden shell  

---

### **3. Maple Ridge (Explorer) – Vertical Exploration**

**New:**
- **Hidden waterfall cave:** Behind maple grove, requires "Nature Key" (from Ranger Rob)  
- **Tree canopy bridges:** 2 additional rope bridges at y=8 (high elevation)  
- **Forest floor debris:** Random fallen leaves pile – tap to rustle (wildlife appears)  

---

### **4. Eagle Peak (Guide) – Summit Secrets**

**New:**
- **Eagle observation blind:** At (80,15) – hide, wait for eagle landing (30% chance at sunrise)  
- **Alpine flower patches:** 4 rare flowers only bloom at high elevation (2x XP)  
- **Snow shelters:** 3 igloos – tap to learn cold-weather survival facts  

---

## **📘 NEW DOCUMENT 4: Wandering Sage NPC System**

### **Wandering Sage – Ambient Verse NPC**

**Purpose:** Purely inspirational – no quests, no pressure, just discovery  
**Spawn:** 1-2 per sub-camp, roams **entire map** (no boundaries)

**Appearance:**
- **Pathfinder:** Elderly figure with walking stick, wide-brim hat, satchel  
- **Adventurer:** Smiling sun character with legs (Mr. Sun's cousin) or gentle sheep  
**Visual cue:** Gentle glow/pulse, never aggressive

**Movement AI:**
```javascript
class WanderingSage extends NPC {
  update() {
    // Every 5 seconds, pick random adjacent tile
    if (this.moveTimer <= 0) {
      const directions = [ {x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1} ];
      const pick = Phaser.Utils.Array.GetRandom(directions);
      this.moveTo(this.x + pick.x * 16, this.y + pick.y * 16);
      this.moveTimer = 5000; // 5 sec
    }
    this.moveTimer -= delta;
  }
}
```
- **Wall collision:** Automatically turns around (simple raycast)  
- **Idle:** Pauses 2-3 sec between moves, looks around  

**Interaction:**
- **Tap once:** Speech bubble appears with **random Bible verse** (no dialog choice)  
- **Verse pool:** 30 pre-selected verses per camp theme (e.g., Pine Valley: nature verses)  
- **Audio:** Voice-over plays automatically (can mute in settings)  
- **Cooldown:** Same verse won't repeat until all 30 have been heard  
- **Visual:** Glow intensifies when tapped, then fades  

**Verse Examples by Camp:**
| Camp | Theme | Sample Verses |
|------|-------|---------------|
| Pine Valley | Creation | Psalm 23:1, Gen 1:31, Psalm 96:12 |
| Lake Cove | Water/Baptism | John 4:14, Psalm 23:2, Isaiah 43:2 |
| Maple Ridge | Mountains | Psalm 121:1, Matt 17:20, Psalm 95:4 |
| Summit Base | Strength | Phil 4:13, Isaiah 40:31, Ps 73:26 |
| Frontier OP | Missions | Matt 28:19, Acts 1:8, Mark 16:15 |
| Eagle Peak | Mastery | 2 Tim 4:7, Heb 12:1, Matt 25:23 |
| Sunflower Meadow | Joy | John 15:11, Ps 100:1, Phil 4:4 |
| Rainbow Ridge | Promise | Gen 9:13, Jer 29:11, Num 23:19 |

**Memory System:**
```javascript
// Save heard verses locally
const heardVerses = JSON.parse(localStorage.getItem('heardVerses') || '[]');
if (!heardVerses.includes(verseId)) {
  heardVerses.push(verseId);
  localStorage.setItem('heardVerses', JSON.stringify(heardVerses));
}
```

**Reward:**
- **No XP** – pure spiritual enrichment  
- **Hidden stat:** "Wisdom" tracked silently; at 100 verses → unlocks "Seeker" badge (cosmetic)  

---

### **Wandering Sage Spawn Schedule**
- **Morning (6 AM – 10 AM):** Near chapel/story circle  
- **Midday (10 AM – 4 PM):** Patrols outer trails  
- **Evening (4 PM – 8 PM):** Near fire circle/plaza  
- **Night (8 PM – 6 AM):** Invisible (resting)

**Respawn:**  
- If player leaves camp and returns → Sage may be at new location  
- Guarantee: 2 sages per camp minimum, ensuring frequent encounters  

---

## **📘 UPDATED Document 1 (Revised): Player Journey with Exploration**

### **Step 7 Enhanced: Camp Gate Arrival**
**After receiving starter kit, Leader adds:**
> **"Take time to explore! You'll find friendly Sages wandering who love to share."**  
> Icon of glowing figure appears on mini-map legend.

### **Exploration Tutorial (First 2 minutes)**
- **Arrow guides** player to:  
  1. **Tap a flower** (harvest)  
  2. **Tap the Sage** (introduces verse mechanic)  
  3. **Tap signpost** (reading)  
- **Reward:** "Explorer" sticker (cosmetic) for completing all 3  

---

## **📘 UPDATED Document 3 (Revised): NPC List with Sages**

**Add to each camp:**

| Camp | Sage Name | Visual | Verse Theme | Favorite Spot |
|------|-----------|--------|-------------|---------------|
| Pine Valley | **Elder Sage** | Walking stick, hat | Nature Psalms | Observation deck |
| Lake Cove | **Seaside Sage** | Sun hat, sandals | Water metaphors | Pier at sunrise |
| Maple Ridge | **Mountain Sage** | Wool cloak | Mountain verses | Behind waterfall |
| Summit Base | **Snow Sage** | White beard, parka | Strength in trials | Meditation point |
| Frontier OP | **Mission Sage** | Cultural shawl | Great Commission | Mission hall entrance |
| Eagle Peak | **Eagle Sage** | Feathered hat | Mastery, completion | Flagpole base |
| Sunflower Meadow | **Mama Bee** | Bee antennae, smile | Joy, creation | Story stump |
| Rainbow Ridge | **Prism Sage** | Rainbow cape | Promise, hope | Bridge center |
| Lego Creek | **Builder Sage** | Tool belt | Foundation verses | Crane platform |
| Helping Harbor | **Harbor Sage** | Lighthouse shirt | Service, love | Dock end |

---

## **🎮 Updated Interaction Matrix**

| Object | Tap | Hold | Drag | Result |
|--------|-----|------|------|--------|
| **Wandering Sage** | ✔️ | – | – | Hear verse, glow, +Wisdom stat |
| **Fallen branch** | ✔️ | – | – | Branch → inventory |
| **Flower** | ✔️ | – | – | Flower → inventory |
| **Signpost** | ✔️ | – | – | Text + audio direction |
| **NPC with quest** | ✔️ | – | – | Dialog options |
| **NPC without quest** | ✔️ | – | – | Random friendly line |
| **Tool (shovel)** | – | ✔️ (0.5s) | – | Dig animation, find worm +5 XP |
| **Mini-game trigger** | ✔️ | – | – | Fade to game scene |
| **Door** | ✔️ | – | – | Scene transition |
| **Inventory item** | – | – | ✔️ | Drop or give to NPC |
| **Sage (cooldown)** | ✔️ | – | – | Says: "Seek and you'll find more!" |

---

## **🎯 MVP Mini-Game Priority (Now with Exploration)**

**Build these 5:**

1. **Fire Building** (Pine Valley) – Core drag mechanic  
2. **Verse Scramble** (Chapel) – Core text interaction  
3. **Fallen Branch Collect** (Pine Valley) – Teaches nature gathering  
4. **Sage Encounter** (All camps) – Simplest interaction, no fail  
5. **Flower Collect** (Sunflower Meadow) – Kid-friendly introduction  

**Total dev time:** ~2.5 weeks (adds Sage system = +3 days).  

---

**Your game now has: open exploration, nature protection, and spiritual wandering. Ready to code the Sage AI first?**