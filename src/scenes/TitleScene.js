import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c5f2d);

        // Title
        this.add.text(width / 2, height / 3, 'Pathfinder:\nThe Pioneer Trail', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Rotating Compass Visual (Placeholder)
        const compass = this.add.circle(width / 2, height / 2, 50, 0x8b4513);
        this.add.line(width / 2, height / 2, 0, -40, 0, 40, 0xff0000).setOrigin(0, 0); // Needle

        this.tweens.add({
            targets: compass,
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        // Start Button
        const startButton = this.add.rectangle(width / 2, height * 0.75, 200, 60, 0xfacc15)
            .setInteractive({ useHandCursor: true });

        const startText = this.add.text(width / 2, height * 0.75, 'Start Adventure', {
            fontSize: '24px',
            fill: '#000000'
        }).setOrigin(0.5);

        // Button Interaction
        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });

        startButton.on('pointerover', () => {
            startButton.setFillStyle(0xffd700);
            startText.setScale(1.1);
        });

        startButton.on('pointerout', () => {
            startButton.setFillStyle(0xfacc15);
            startText.setScale(1);
        });
    }
}
