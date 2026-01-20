import Phaser from 'phaser';
import NPC from '../objects/NPC.js';
import Door from '../objects/Door.js';
import InteractionManager from '../managers/InteractionManager.js';

const TILE_SIZE = 32;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;

// The WanderingSage is a temporary, pre-existing class.
// It will be replaced by the more robust NPC system in the future.
class WanderingSage extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, TILE_SIZE, TILE_SIZE, 0xffff00);
        scene.add.existing(this);
        this.moveTimer = 0;
        this.setInteractive();
        this.message = "Psalm 23:1 - The Lord is my shepherd.";
        this.on('pointerdown', () => {
            scene.events.emit('showDialog', this.message);
            scene.tweens.add({ targets: this, alpha: 0.5, duration: 200, yoyo: true });
        });
    }
    preUpdate(time, delta) {
        this.moveTimer -= delta;
        if (this.moveTimer <= 0) {
            this.moveRandomly();
            this.moveTimer = 5000;
        }
    }
    moveRandomly() {
        const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
        const dir = Phaser.Utils.Array.GetRandom(directions);
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
        this.obstacles = null;
        this.interactables = null;
        this.interactionManager = null;
    }

    create() {
        this.scene.launch('UIScene');

        // --- World and Physics Setup ---
        this.obstacles = this.physics.add.staticGroup();
        this.interactables = this.add.group();
        this.createMap();

        // --- Player Setup ---
        const charData = this.registry.get('character');
        const color = charData ? charData.color : 0x00ff00;
        this.player = this.add.rectangle(12 * TILE_SIZE, 20 * TILE_SIZE, TILE_SIZE, TILE_SIZE, color);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // --- Collision ---
        this.physics.add.collider(this.player, this.obstacles);

        // --- Camera ---
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE);

        // --- Game Objects ---
        this.createNPCs();
        this.sages.push(new WanderingSage(this, 18 * TILE_SIZE, 15 * TILE_SIZE)); // Keep old sages for now
        this.createBranches();

        // --- Input and Interaction ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,E,H');
        this.interactionManager = new InteractionManager(this, this.player, this.interactables);

        // --- Handbook Toggle ---
        this.keys.H.on('down', () => {
            const handbook = this.scene.get('HandbookScene');
            if (handbook.scene.isSleeping()) {
                this.scene.wake('HandbookScene');
            } else {
                this.scene.sleep('HandbookScene');
            }
        });
    }

    createMap() {
        this.add.rectangle(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE, 0x4a7c59).setOrigin(0, 0);
        this.add.rectangle(10 * TILE_SIZE, 18 * TILE_SIZE, 25 * TILE_SIZE, 3 * TILE_SIZE, 0x966919).setOrigin(0);
        this.add.rectangle(15 * TILE_SIZE, 12 * TILE_SIZE, 3 * TILE_SIZE, 6 * TILE_SIZE, 0x966919).setOrigin(0);

        const streamColor = 0x87CEEB;
        this.obstacles.add(this.add.rectangle(0, 8 * TILE_SIZE, 16 * TILE_SIZE, TILE_SIZE, streamColor).setOrigin(0));
        this.obstacles.add(this.add.rectangle(16 * TILE_SIZE, 9 * TILE_SIZE, TILE_SIZE, 5 * TILE_SIZE, streamColor).setOrigin(0));
        this.obstacles.add(this.add.rectangle(10 * TILE_SIZE, 13 * TILE_SIZE, 6 * TILE_SIZE, TILE_SIZE, streamColor).setOrigin(0));
        this.add.rectangle(15 * TILE_SIZE, 13 * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE, 0x808080).setOrigin(0);

        this.addBuilding(5 * TILE_SIZE, 15 * TILE_SIZE, 4, 3, 0x8B4513, 'Cabin');
        this.addBuilding(20 * TILE_SIZE, 22 * TILE_SIZE, 4, 3, 0x0000FF, 'Craft Hut');
        this.addBuilding(30 * TILE_SIZE, 12 * TILE_SIZE, 4, 3, 0xFFFFFF, 'Chapel', '#000');
    }

    addBuilding(x, y, w, h, color, label, textColor = '#fff') {
        const width = w * TILE_SIZE;
        const height = h * TILE_SIZE;
        const building = this.add.rectangle(x, y, width, height, color).setOrigin(0, 0);
        this.obstacles.add(building);
        this.add.text(building.x + width / 2, building.y - 20, label, { fontSize: '14px', fill: textColor }).setOrigin(0.5);

        // --- Add a Door to the building ---
        // The door is placed in the center of the building's front-facing wall.
        const doorX = x + width / 2;
        const doorY = y + height - TILE_SIZE / 2;
        const door = new Door(this, doorX, doorY, 'InteriorScene', this.cameras.main.width / 2, this.cameras.main.height - TILE_SIZE * 2);
        this.interactables.add(door);
    }

    createNPCs() {
        // Samuel - GDD Aligned
        const samuelData = {
            name: 'Samuel',
            primaryColor: '#6b7d2a',
            accentColor: '#d76b2a',
            dialogue: {
                greeting: "Morning, Pathfinder! Here's a verse that's guided me for years...",
                verse: "Trust in the Lord with all your heart.",
                ref: "Proverbs 3:5"
            }
        };
        const samuel = new NPC(this, 15 * TILE_SIZE, 15 * TILE_SIZE, 'boy_placeholder', samuelData);
        this.obstacles.add(samuel);
        this.interactables.add(samuel);
    }

    createBranches() {
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(5, 35) * TILE_SIZE;
            const y = Phaser.Math.Between(15, 25) * TILE_SIZE;
            const branch = this.add.rectangle(x, y, 20, 5, 0x654321).setInteractive();
            branch.on('pointerdown', () => {
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

        this.interactionManager.update();

        const speed = 200;
        this.player.body.setVelocity(0, 0);
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.keys.A.isDown) velocityX = -1;
        else if (this.cursors.right.isDown || this.keys.D.isDown) velocityX = 1;

        if (this.cursors.up.isDown || this.keys.W.isDown) velocityY = -1;
        else if (this.cursors.down.isDown || this.keys.S.isDown) velocityY = 1;

        const normalizedVelocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize().scale(speed);
        this.player.body.setVelocity(normalizedVelocity.x, normalizedVelocity.y);
    }
}
