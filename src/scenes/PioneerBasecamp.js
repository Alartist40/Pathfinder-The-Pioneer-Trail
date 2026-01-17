import Phaser from 'phaser';

const TILE_SIZE = 32;
const GRID_WIDTH = 25; // 800 / 32
const GRID_HEIGHT = 19; // 608 / 32 (close to 600)

export default class PioneerBasecamp extends Phaser.Scene {
  constructor() {
    super('PioneerBasecamp');
    this.player = null;
    this.npc = null;
    this.cursors = null;
    this.isMoving = false;
    this.grid = [];
    this.interactionKey = null;
    this.textBox = null;
    this.text = null;
  }

  addBuilding(x, y, width, height, color, text, textColor = '#fff') {
    // ... (same as before)
    const building = this.add.rectangle(x, y, width, height, color);
    this.add.text(x - width / 2 + 5, y - 10, text, { fill: textColor });
    const startTileX = Math.floor((x - width / 2) / TILE_SIZE);
    const startTileY = Math.floor((y - height / 2) / TILE_SIZE);
    const endTileX = Math.ceil((x + width / 2) / TILE_SIZE);
    const endTileY = Math.ceil((y + height / 2) / TILE_SIZE);
    for (let ty = startTileY; ty < endTileY; ty++) {
      for (let tx = startTileX; tx < endTileX; tx++) {
        if (this.grid[ty] && this.grid[ty][tx] !== undefined) {
          this.grid[ty][tx] = 1;
        }
      }
    }
    return building;
  }

  create() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      this.grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.grid[y][x] = 0;
      }
    }

    this.cameras.main.setBackgroundColor('#2c5f2d');
    this.add.rectangle(400, 300, 700, 500, 0x4a7c59);
    this.addBuilding(150, 150, 150, 100, 0x8B4513, 'Pathfinder Lodge');
    this.addBuilding(650, 150, 150, 100, 0x0000FF, 'Craft Pavilion');
    this.addBuilding(150, 450, 150, 100, 0xFFFFFF, 'Chapel Tent', '#000');
    this.addBuilding(650, 450, 150, 100, 0x8B4513, 'My Cabin');

    // Player setup
    const playerStartX = 12 * TILE_SIZE + TILE_SIZE / 2;
    const playerStartY = 9 * TILE_SIZE + TILE_SIZE / 2;
    this.player = this.add.rectangle(playerStartX, playerStartY, TILE_SIZE, TILE_SIZE, 0x00ff00);

    // NPC setup
    const npcStartX = 15 * TILE_SIZE + TILE_SIZE / 2;
    const npcStartY = 9 * TILE_SIZE + TILE_SIZE / 2;
    this.npc = this.add.rectangle(npcStartX, npcStartY, TILE_SIZE, TILE_SIZE, 0x0000ff); // Blue square for NPC
    const npcTileX = Math.floor(npcStartX / TILE_SIZE);
    const npcTileY = Math.floor(npcStartY / TILE_SIZE);
    this.grid[npcTileY][npcTileX] = 1; // Mark NPC tile as collidable

    // Input setup
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');
    this.interactionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Text box setup
    this.textBox = this.add.rectangle(400, 550, 750, 80, 0x000000, 0.8).setStrokeStyle(2, 0xffffff).setVisible(false);
    this.text = this.add.text(50, 525, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 700 } }).setVisible(false);
  }

  isTileWalkable(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    return this.grid[tileY] && this.grid[tileY][tileX] === 0;
  }

  update() {
    // Handle interaction
    if (Phaser.Input.Keyboard.JustDown(this.interactionKey)) {
      if (this.textBox.visible) {
        this.textBox.setVisible(false);
        this.text.setVisible(false);
      } else {
        const playerTileX = Math.floor(this.player.x / TILE_SIZE);
        const playerTileY = Math.floor(this.player.y / TILE_SIZE);
        const npcTileX = Math.floor(this.npc.x / TILE_SIZE);
        const npcTileY = Math.floor(this.npc.y / TILE_SIZE);

        const distance = Math.abs(playerTileX - npcTileX) + Math.abs(playerTileY - npcTileY);
        if (distance === 1) {
          this.text.setText('Hello, Pathfinder!');
          this.textBox.setVisible(true);
          this.text.setVisible(true);
        }
      }
    }

    // Handle movement
    if (this.isMoving || this.textBox.visible) {
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;
    let moved = false;

    if (this.cursors.left.isDown || this.keys.A.isDown) {
      targetX -= TILE_SIZE; moved = true;
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      targetX += TILE_SIZE; moved = true;
    } else if (this.cursors.up.isDown || this.keys.W.isDown) {
      targetY -= TILE_SIZE; moved = true;
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      targetY += TILE_SIZE; moved = true;
    }

    if (moved && this.isTileWalkable(targetX, targetY)) {
      this.isMoving = true;
      this.tweens.add({
        targets: this.player, x: targetX, y: targetY, duration: 200, ease: 'Linear',
        onComplete: () => { this.isMoving = false; },
      });
    }
  }
}
