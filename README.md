# Pathfinder: The Pioneer Trail

This is a top-down, 2.5D RPG-style game built with Phaser 3 and React. The game is inspired by classic Pokémon games and is designed to be a fun, interactive experience for Pathfinders.

This repository contains the source code and all the assets for the game. The game is designed to be played directly in a web browser.

## How to Play

The game is hosted on GitHub Pages. You can play the latest version by visiting the following URL:

[https://alartist40.github.io/Pathfinder-The-Pioneer-Trail/](https://alartist40.github.io/Pathfinder-The-Pioneer-Trail/)

## For Developers

This section is for developers who want to modify, contribute to, or understand the project's technical setup.

### Local Development (Running the Game on Your Computer)

To test changes before they go live, you can run a local development server on your machine.

1.  **Prerequisites:**
    *   [Node.js and npm](https://nodejs.org/en/)
    *   [Git](https://git-scm.com/)

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/alartist40/Pathfinder-The-Pioneer-Trail.git
    cd Pathfinder-The-Pioneer-Trail
    ```

3.  **Setup and Run the Project:**
    This single command installs all dependencies, runs the test suite, and starts the development server.
    ```bash
    npm run setup
    ```
    **What to expect:**
    1.  Dependencies will install.
    2.  Tests will run (and pass).
    3.  The browser will automatically open to the game.

4.  **Verifying the Fix (Troubleshooting):**
    If you previously saw a **plain blank white screen**, this update has fixed the React 19 compatibility issue causing it.
    *   **Success:** You should see the game title and the game world (green background with buildings).
    *   **Still Blank?**
        *   Open Developer Tools (F12 or Right Click > Inspect > Console).
        *   Check for red errors.
        *   Ensure you are not running an old cached version (try `Ctrl+F5` or `Cmd+Shift+R`).

### Deployment (Publishing the Game to the Live Website)

The live version of the game is hosted using GitHub Pages. The following command automates the process of building the project and publishing it to a clean `gh-pages-production` branch.

**Important:** This is the only command you need to run to make your local changes appear on the live website. After running this command, you will need to configure your GitHub repository to deploy from the `gh-pages-production` branch in the **Settings > Pages** section.

1.  **Ensure you have installed all dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Deploy Command:**
    ```bash
    npm run deploy:fresh
    ```

This command will create a production build of the game and push it to the `gh-pages-production` branch on your repository. GitHub Pages will then automatically update the live website. Please allow a few minutes for the changes to become visible.
