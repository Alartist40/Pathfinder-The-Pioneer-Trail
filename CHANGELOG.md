# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
