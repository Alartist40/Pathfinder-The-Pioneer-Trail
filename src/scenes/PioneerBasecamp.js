import Phaser from 'phaser';

const TILE_SIZE = 32;
const GRID_WIDTH = 40; // Expanded to 40
const GRID_HEIGHT = 30; // Expanded to 30

class WanderingSage extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, TILE_SIZE, TILE_SIZE, 0xffff00); // Yellow for Sage
    scene.add.existing(this);
    this.moveTimer = 0;
    this.setInteractive();

    this.message = "Psalm 23:1 - The Lord is my shepherd.";

    this.on('pointerdown', () => {
      scene.events.emit('showDialog', this.message);
      // Visual feedback
      scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 200,
        yoyo: true
      });
    });
  }

  preUpdate(time, delta) {
    this.moveTimer -= delta;
    if (this.moveTimer <= 0) {
      this.moveRandomly();
      this.moveTimer = 5000; // Move every 5 seconds
    }
  }

  moveRandomly() {
    // Simple random movement logic (1 tile in random direction)
    const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    const dir = Phaser.Utils.Array.GetRandom(directions);

    // Tween to new position (no collision check for MVP sage yet, assume ghost-like or check later)
    this.scene.tweens.add({
      targets: this,
      x: this.x + (dir.x * TILE_SIZE),
      y: this.y + (dir.y * TILE_SIZE),
      duration: 1000
    });
  }
}

export default class PioneerBasecamp extends Phaser.Scene {
  constructor() {
    super('PioneerBasecamp');
    this.player = null;
    this.cursors = null;
    this.sages = [];
    this.branches = [];
  }

  create() {
    this.scene.launch('UIScene'); // Launch UI overlay

    // Map Setup (Procedural via rectangles for now)
    this.createMap();

    // Player Setup
    // Get character color from registry or default
    const charData = this.registry.get('character');
    const color = charData ? charData.color : 0x00ff00;

    this.player = this.add.rectangle(12 * TILE_SIZE, 12 * TILE_SIZE, TILE_SIZE, TILE_SIZE, color);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE);

    // Wandering Sages
    this.sages.push(new WanderingSage(this, 18 * TILE_SIZE, 15 * TILE_SIZE));
    this.sages.push(new WanderingSage(this, 30 * TILE_SIZE, 20 * TILE_SIZE));

    // Fallen Branches (Harvestables)
    this.createBranches();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    // Tap to Move (Basic Implementation)
    this.input.on('pointerdown', (pointer) => {
      // Only if not clicking an interactive object
      if (pointer.topObject) return;

      const worldX = pointer.worldX;
      const worldY = pointer.worldY;

      // Simple move to target (linear, no pathfinding)
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldX, worldY);
      const duration = dist * 5; // Speed factor

      if (this.moveTween) this.moveTween.stop();
      this.moveTween = this.tweens.add({
        targets: this.player,
        x: worldX,
        y: worldY,
        duration: duration,
        onUpdate: () => {
          // Check collisions here if needed
        }
      });
    });
  }

  createMap() {
    // Grass Background
    this.add.rectangle(0, 0, GRID_WIDTH * TILE_SIZE * 2, GRID_HEIGHT * TILE_SIZE * 2, 0x4a7c59).setOrigin(0, 0);

    // River
    this.add.rectangle(0, 5 * TILE_SIZE, GRID_WIDTH * TILE_SIZE * 2, 2 * TILE_SIZE, 0x87CEEB).setOrigin(0, 0);

    // Buildings
    this.addBuilding(12, 10, 4, 3, 0x8B4513, 'Cabin'); // Player Cabin
    this.addBuilding(22, 10, 4, 3, 0x0000FF, 'Craft Hut');
    this.addBuilding(32, 10, 4, 3, 0xFFFFFF, 'Chapel', '#000');
  }

  addBuilding(tx, ty, w, h, color, label, textColor = '#fff') {
    const x = tx * TILE_SIZE;
    const y = ty * TILE_SIZE;
    const width = w * TILE_SIZE;
    const height = h * TILE_SIZE;

    const building = this.add.rectangle(x + width / 2, y + height / 2, width, height, color);
    this.add.text(x, y - 20, label, { fontSize: '14px', fill: textColor });

    // Make building solid (simple bounds check in update usually, but for now just visual)
  }

  createBranches() {
    // Create 5 random branches
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(5, 35) * TILE_SIZE;
      const y = Phaser.Math.Between(15, 25) * TILE_SIZE;

      const branch = this.add.rectangle(x, y, 20, 5, 0x654321).setInteractive();
      branch.on('pointerdown', () => {
        // Harvest logic
        branch.destroy();
        this.events.emit('updateInventory', 'Branch');
        this.events.emit('showDialog', 'Collected a fallen branch!');
      });
      this.branches.push(branch);
    }
  }

  update(time, delta) {
    if (this.sages) {
      this.sages.forEach(sage => sage.preUpdate(time, delta));
    }

    // Keyboard Movement override
    const speed = 200;
    this.player.body = { velocity: { x: 0, y: 0 } }; // Mock body for logic

    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) velocityX = -1;
    else if (this.cursors.right.isDown || this.keys.D.isDown) velocityX = 1;

    if (this.cursors.up.isDown || this.keys.W.isDown) velocityY = -1;
    else if (this.cursors.down.isDown || this.keys.S.isDown) velocityY = 1;

    if (velocityX !== 0 || velocityY !== 0) {
      if (this.moveTween) this.moveTween.stop(); // Cancel tap move
      this.player.x += velocityX * (speed * delta / 1000);
      this.player.y += velocityY * (speed * delta / 1000);
    }
  }
}
