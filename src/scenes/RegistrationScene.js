import Phaser from 'phaser';

export default class RegistrationScene extends Phaser.Scene {
    constructor() {
        super('RegistrationScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0xf5f5dc); // Beige tent color

        this.add.text(width / 2, 100, 'Registration', {
            fontSize: '32px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // --- Main Options ---

        // 1. Find My Rank Button (Original functionality)
        const findRankBtn = this.add.rectangle(width / 2, 250, 300, 50, 0x4a7c59)
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 2, 250, 'Find My Rank', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        findRankBtn.on('pointerdown', () => {
            // For now, this simulates finding a "Friend" rank.
            // In the future, this would open an ID input dialog.
            this.showRankPopup('Friend');
        });

        // 2. Skip Button
        const skipBtn = this.add.rectangle(width / 2, 325, 300, 50, 0x6c757d) // A gray color
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 2, 325, 'Skip to Camp', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        skipBtn.on('pointerdown', () => {
            this.registry.set('rank', 'Friend'); // Set lowest rank
            this.scene.start('PioneerBasecamp');
        });

        // 3. Development Button
        const devBtn = this.add.rectangle(width / 2, 400, 300, 50, 0x333333) // A dark color
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 2, 400, 'Dev Level Select', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        devBtn.on('pointerdown', () => {
            this.showDevMenu();
        });
    }

    showRankPopup(rank) {
        // This function shows the confirmation popup, same as the original processRegistration
        this.registry.set('rank', rank);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const popup = this.add.container(width / 2, height / 2);
        const bg = this.add.rectangle(0, 0, 400, 250, 0xffffff).setStrokeStyle(4, 0x000000);
        const msg = this.add.text(0, -50, `Welcome!\nYou are a ${rank}.`, {
            fontSize: '28px',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        const goBtn = this.add.rectangle(0, 50, 200, 50, 0x0000ff).setInteractive({ useHandCursor: true });
        const goText = this.add.text(0, 50, 'Go to Pine Valley!', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        popup.add([bg, msg, goBtn, goText]);
        popup.setDepth(10);

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

    showDevMenu() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // A simple menu for selecting a level to test
        const devMenu = this.add.container(width / 2, height / 2);
        const bg = this.add.rectangle(0, 0, 400, 300, 0xcccccc).setStrokeStyle(4, 0x000000);
        const title = this.add.text(0, -100, 'Select Level', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);

        // Since we only have one level scene for now, we'll just have one button.
        // This can be expanded later.
        const level1Btn = this.add.rectangle(0, 0, 250, 50, 0x4a7c59).setInteractive({ useHandCursor: true });
        const level1Text = this.add.text(0, 0, 'Pioneer Basecamp', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        devMenu.add([bg, title, level1Btn, level1Text]);
        devMenu.setDepth(10); // Ensure it's on top

        level1Btn.on('pointerdown', () => {
            this.registry.set('rank', 'Developer'); // Use a special rank for testing
            this.scene.start('PioneerBasecamp');
        });

        // Animate entry
        devMenu.setScale(0);
        this.tweens.add({
            targets: devMenu,
            scale: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }
}
