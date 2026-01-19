import Phaser from 'phaser';
import Door from '../objects/Door.js';
import InteractionManager from '../managers/InteractionManager.js';

const TILE_SIZE = 32;

/**
 * A basic template scene for the interior of buildings.
 */
export default class InteriorScene extends Phaser.Scene {
    constructor() {
        super('InteriorScene');
        this.player = null;
        this.cursors = null;
        this.interactables = null;
        this.interactionManager = null;
    }

    /**
     * Data sent from the previous scene is received here.
     * @param {object} data The data object passed from the previous scene.
     */
    init(data) {
        // Default spawn point if none is provided
        this.playerSpawn = {
            x: data.playerX || this.cameras.main.width / 2,
            y: data.playerY || this.cameras.main.height / 2,
        };
    }

    create() {
        // --- Scene Setup ---
        this.cameras.main.setBackgroundColor('#a0522d');
        this.interactables = this.add.group();

        // --- Player ---
        const charData = this.registry.get('character');
        const color = charData ? charData.color : 0x00ff00;
        this.player = this.add.rectangle(this.playerSpawn.x, this.playerSpawn.y, TILE_SIZE, TILE_SIZE, color);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // --- Exit Door ---
        const exitDoor = new Door(this, this.cameras.main.width / 2, this.cameras.main.height - TILE_SIZE, 'PioneerBasecamp', 12 * TILE_SIZE, 20 * TILE_SIZE);
        this.interactables.add(exitDoor);

        // --- Input and Interaction ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,E');
        this.interactionManager = new InteractionManager(this, this.player, this.interactables);
    }

    update() {
        this.interactionManager.update();

        // --- Player Movement ---
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
