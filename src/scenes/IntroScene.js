import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Green background to represent a grassy landscape
        this.add.rectangle(width / 2, height / 2, width, height, 0x228B22);

        // Bus sprite
        const bus = this.add.image(-200, height * 0.6, 'bus').setScale(0.5);

        // Animate the bus moving from left to right
        this.tweens.add({
            targets: bus,
            x: width + 200,
            duration: 10000,
            ease: 'Linear',
            repeat: -1, // Loop forever
            yoyo: false,
        });

        // Title
        this.add.text(width / 2, height / 4, 'Pathfinder:\nThe Pioneer Trail', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // --- Start Game Button ---
        const startButton = this.add.rectangle(width / 2, height * 0.7, 250, 70, 0xfacc15)
            .setInteractive({ useHandCursor: true });
        const startText = this.add.text(width / 2, height * 0.7, 'Start Game', {
            fontSize: '28px', fill: '#2c2c2c'
        }).setOrigin(0.5);

        // --- Options Button (Placeholder) ---
        const optionsButton = this.add.rectangle(width / 2, height * 0.8, 250, 70, 0xcccccc)
            .setInteractive({ useHandCursor: true });
        const optionsText = this.add.text(width / 2, height * 0.8, 'Options', {
            fontSize: '28px', fill: '#2c2c2c'
        }).setOrigin(0.5);


        // --- Button Interactions ---
        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });

        startButton.on('pointerover', () => startButton.setFillStyle(0xffd700));
        startButton.on('pointerout', () => startButton.setFillStyle(0xfacc15));

        optionsButton.on('pointerover', () => optionsButton.setFillStyle(0xeeeeee));
        optionsButton.on('pointerout', () => optionsButton.setFillStyle(0xcccccc));

        // Options button is a placeholder, so it doesn't do anything on click yet.
    }
}
