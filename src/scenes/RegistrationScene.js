import Phaser from 'phaser';

export default class RegistrationScene extends Phaser.Scene {
    constructor() {
        super('RegistrationScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0xf5f5dc); // Beige tent color

        this.add.text(width / 2, 150, 'Registration Booth', {
            fontSize: '32px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mock ID Input (Visual Representation)
        this.add.text(width / 2, 250, 'Enter Pathfinder ID:', {
            fontSize: '20px',
            fill: '#000000'
        }).setOrigin(0.5);

        // In a real app we'd use a DOM element for input, for now simulating a keypad/button
        this.add.rectangle(width / 2, 300, 300, 50, 0xffffff).setStrokeStyle(2, 0x000000);
        this.add.text(width / 2, 300, '123456', {
            fontSize: '24px',
            fill: '#333333'
        }).setOrigin(0.5);

        // "Find My Rank" Button
        const submitBtn = this.add.rectangle(width / 2, 400, 200, 50, 0x4a7c59)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 400, 'Find My Rank', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        submitBtn.on('pointerdown', () => {
            this.processRegistration();
        });
    }

    processRegistration() {
        // Simulate API call/processing
        const rank = 'Friend';
        this.registry.set('rank', rank);

        // Popup
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const popup = this.add.container(width / 2, height / 2);
        const bg = this.add.rectangle(0, 0, 400, 300, 0xffffff).setStrokeStyle(4, 0x000000);
        const msg = this.add.text(0, -50, `Welcome!\nYou are a ${rank}.`, {
            fontSize: '28px',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        const goBtn = this.add.rectangle(0, 80, 200, 50, 0x0000ff).setInteractive({ useHandCursor: true });
        const goText = this.add.text(0, 80, 'Go to Pine Valley!', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        popup.add([bg, msg, goBtn, goText]);

        // Animate entry
        popup.setScale(0);
        this.tweens.add({
            targets: popup,
            scale: 1,
            duration: 300,
            ease: 'Back.out'
        });

        goBtn.on('pointerdown', () => {
            this.scene.start('PioneerBasecamp');
        });
    }
}
