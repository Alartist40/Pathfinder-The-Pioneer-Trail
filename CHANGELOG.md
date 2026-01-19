# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### `0.3.0` - Core Gameplay Overhaul - 2026-01-20

#### Added
- **Physics & Collision:** The game now uses Phaser's Arcade physics engine. Player, NPCs, and map elements have physical bodies, preventing overlapping.
- **Key-based Interaction System:** Implemented a new interaction system based on the 'E' key. A prompt appears when the player is near an interactable object.
- **Building Interiors:** Buildings now have functional doors that transport the player to and from a new, unique interior scene.
- **Interactable NPCs:** The camp is now populated with NPCs who share Bible verses when interacted with.
- **Organic Map Design:** The main camp map has been completely redesigned with a more natural layout, including winding paths, a stream, and bridges.

#### Changed
- **Player Movement:** Player movement is now velocity-based, integrated with the new physics engine for smoother and more robust control.
- **Camera System:** The camera now follows the player and is constrained to the world bounds, preventing the player from leaving the screen.
- **UI Flow:**
  - The character selection screen now offers "Boy" and "Girl" options.
  - The registration scene now includes "Skip to Camp" and "Dev Level Select" buttons for improved testing and faster onboarding.

### `0.2.0` - Game Expansion & Core Loop - 2026-01-19

#### Added
- **Global Scene Management:** Implemented a full game flow including `BootScene`, `TitleScene`, `CharacterSelectScene`, and `RegistrationScene`.
- **Wandering Sage NPC:** Added AI-driven NPCs that roam the map and share verses when tapped.
- **Interactive Resources:** Added "Fallen Branches" that can be collected via tap interaction.
- **UI System:** Created a dedicated `UIScene` for inventory overlay and toast notifications/dialogs.
- **Map Expansion:** Expanded `PioneerBasecamp` to a 40x30 grid with distinct zones (River, Cabin, Plaza).

#### Changed
- **Control Scheme:** Standardized on "Click/Tap" interaction for mobile compatibility, while retaining WASD for desktop movement.
- **Visuals:** Updated placeholder graphics to represent different character choices (Alex/Sam) and building types.

### `0.1.1` - Fixes & Improvements - 2026-01-19

#### Fixed
- **Critical Startup Bug:** Fixed a "White Screen of Death" issue caused by a compatibility mismatch between React 19 and the legacy `ReactDOM.render` API. Upgraded the entry point to use `ReactDOM.createRoot`.

#### Improved
- **UI/UX:** Added a decorative border and shadow to the game container to separate it from the background.
- **Code Quality:** Verified clean console output and React StrictMode compatibility.

### `0.1.0` - Initial Prototype - 2026-01-17

#### Added
- **Project Setup:**
  - Initialized a new project using `create-react-app`.
  - Integrated the Phaser 3 game engine into the React application structure.
  - Set up a basic file structure for game scenes and components.

- **Gameplay Features:**
  - Created the "Pioneer Basecamp" scene as a low-fidelity prototype.
  - Implemented a tile-based movement system for the player, controlled by Arrow Keys and WASD. The player character "snaps" to the grid during movement.
  - Added a placeholder player character (green square) and a non-player character (NPC, blue square).
  - Implemented a simple collision system to prevent the player from moving through building obstacles and the NPC.
  - Created a basic interaction system: pressing the spacebar when adjacent to the NPC displays a "Hello, Pathfinder!" dialogue box.

- **Testing:**
  - Set up a Jest testing environment.
  - Configured the test runner to handle Phaser's dependencies (`jest-canvas-mock`, `phaser3spectorjs`).
  - Wrote a unit test for the main `App` component, successfully mocking the Phaser `Game` component to allow for testing in a JSDOM environment.

- **Deployment:**
  - Diagnosed and fixed a blank page issue on the deployed GitHub Pages site.
  - Added the `homepage` field to `package.json` to ensure correct asset paths.
  - Installed the `gh-pages` package and added `predeploy` and `deploy` scripts to automate the deployment process.
