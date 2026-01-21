import Phaser from 'phaser';
import NPC from '../objects/NPC.js';
import Door from '../objects/Door.js';
import Player from '../objects/Player.js'; // Import the new Player class
import InteractionManager from '../managers/InteractionManager.js';

const TILE_SIZE = 32;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;

export default class PioneerBasecamp extends Phaser.Scene {
    constructor() {
        super('PioneerBasecamp');
        this.player = null;
        this.cursors = null;
        this.obstacles = null;
        this.interactables = null;
        this.interactionManager = null;
    }

    create() {
        this.scene.launch('UIScene');

        this.obstacles = this.physics.add.staticGroup();
        this.interactables = this.add.group();
        this.createMap();

        const playerGender = this.registry.get('playerCharacter') || 'boy';
        this.player = new Player(this, 12 * TILE_SIZE, 20 * TILE_SIZE, playerGender);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.obstacles);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE);

        this.createNPCs();
        this.createBranches();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,E');
        this.interactionManager = new InteractionManager(this, this.player, this.interactables);
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

        const doorX = x + width / 2;
        const doorY = y + height - TILE_SIZE / 2;
        const door = new Door(this, doorX, doorY, 'InteriorScene', this.cameras.main.width / 2, this.cameras.main.height - TILE_SIZE * 2);
        this.interactables.add(door);
    }

    createNPCs() {
        const npcData = [
            { x: 10, y: 17, name: 'Samuel', primaryColor: 0x8B4513, dialogue: { greeting: "...", verse: "...", ref: "..." } },
            { x: 18, y: 15, name: 'Marlon', primaryColor: 0x8B4513, dialogue: { greeting: "...", verse: "...", ref: "..." } },
            { x: 25, y: 21, name: 'Alex', primaryColor: 0xDEB887, dialogue: { greeting: "...", verse: "...", ref: "..." } },
            { x: 32, y: 15, name: 'Claudio', primaryColor: 0xDEB887, dialogue: { greeting: "...", verse: "...", ref: "..." } },
            { x: 8, y: 22, name: 'Myra', primaryColor: 0xFFC0CB, dialogue: { greeting: "...", verse: "...", ref: "..." } }
        ];

        npcData.forEach(data => {
            const npc = new NPC(this, data.x * TILE_SIZE, data.y * TILE_SIZE, data);
            this.obstacles.add(npc);
            this.interactables.add(npc);
        });
    }

    update(time, delta) {
        this.interactionManager.update();
        this.player.update(this.cursors, this.keys);
    }

    createBranches() {
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(5, 35) * TILE_SIZE;
            const y = Phaser.Math.Between(15, 25) * TILE_SIZE;
            const branch = this.add.rectangle(x, y, 20, 5, 0x654321).setInteractive({ useHandCursor: true });
            branch.isInteractable = true; // For the interaction manager
            branch.onInteraction = () => {
                branch.destroy();
                this.events.emit('updateInventory', 'Branch');
                this.events.emit('showDialog', 'Collected a fallen branch!');
            };
            this.interactables.add(branch);
        }
    }
}
