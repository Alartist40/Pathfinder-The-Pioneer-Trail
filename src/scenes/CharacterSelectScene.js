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

        // --- Boy Character Option ---
        const boyContainer = this.add.container(width / 3, height / 2);
        const boyBox = this.add.rectangle(0, 0, 180, 220, 0x6facf0); // Blue box
        // Replaceable placeholder image. Future artists can replace 'boy_placeholder' asset.
        const boyImage = this.add.image(0, -10, 'boy_placeholder').setScale(0.25);
        const boyText = this.add.text(0, 90, 'Boy', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        boyContainer.add([boyBox, boyImage, boyText]);
        boyContainer.setSize(boyBox.width, boyBox.height).setInteractive({ useHandCursor: true });

        // --- Girl Character Option ---
        const girlContainer = this.add.container(width * 2 / 3, height / 2);
        const girlBox = this.add.rectangle(0, 0, 180, 220, 0xf06fa2); // Pink box
        // Replaceable placeholder image. Future artists can replace 'girl_placeholder' asset.
        const girlImage = this.add.image(0, -10, 'girl_placeholder').setScale(0.25);
        const girlText = this.add.text(0, 90, 'Girl', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        girlContainer.add([girlBox, girlImage, girlText]);
        girlContainer.setSize(girlBox.width, girlBox.height).setInteractive({ useHandCursor: true });


        // --- Hover Effects ---
        const originalY = boyContainer.y;
        const hoverEffect = (container, image, isOver) => {
            this.tweens.add({
                targets: container,
                y: isOver ? originalY - 10 : originalY,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
            // The setShadow method is not available on Image objects.
            // Using tint as an alternative hover effect.
            if (isOver) {
                image.setTint(0xcccccc); // Light grey tint on hover
            } else {
                image.clearTint(); // Remove tint when not hovering
            }
        };

        boyContainer.on('pointerover', () => hoverEffect(boyContainer, boyImage, true));
        boyContainer.on('pointerout', () => hoverEffect(boyContainer, boyImage, false));
        girlContainer.on('pointerover', () => hoverEffect(girlContainer, girlImage, true));
        girlContainer.on('pointerout', () => hoverEffect(girlContainer, girlImage, false));


        // --- Selection Logic ---
        const selectCharacter = (name, container, color) => {
            this.registry.set('character', { name, color });

            // Visual feedback
            this.tweens.add({
                targets: container,
                scale: 1.1,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('RegistrationScene');
                }
            });
        };

        boyContainer.on('pointerdown', () => selectCharacter('Boy', boyContainer, 0x6facf0));
        girlContainer.on('pointerdown', () => selectCharacter('Girl', girlContainer, 0xf06fa2));
    }
}
