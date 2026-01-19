import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x1e3a8a); // Blue background

        this.add.text(width / 2, 100, 'Choose Your Pathfinder', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Option 1: Alex (Green/Boy)
        const char1 = this.add.rectangle(width / 3, height / 2, 100, 100, 0x00ff00)
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 3, height / 2 + 70, 'Alex', { fontSize: '24px' }).setOrigin(0.5);

        // Option 2: Sam (Orange/Girl)
        const char2 = this.add.rectangle(width * 2 / 3, height / 2, 100, 100, 0xffa500)
            .setInteractive({ useHandCursor: true });
        this.add.text(width * 2 / 3, height / 2 + 70, 'Sam', { fontSize: '24px' }).setOrigin(0.5);

        // Selection Logic
        const selectCharacter = (name, color) => {
            this.registry.set('character', { name, color });

            // Visual feedback
            this.tweens.add({
                targets: name === 'Alex' ? char1 : char2,
                scale: 1.2,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('RegistrationScene');
                }
            });
        };

        char1.on('pointerdown', () => selectCharacter('Alex', 0x00ff00));
        char2.on('pointerdown', () => selectCharacter('Sam', 0xffa500));
    }
}
