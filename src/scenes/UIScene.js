import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Inventory Bar (Bottom)
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Inventory Container
        this.inventoryContainer = this.add.container(width / 2, height - 50);
        const bg = this.add.rectangle(0, 0, 400, 60, 0x000000, 0.7).setStrokeStyle(2, 0xffffff);
        this.inventoryContainer.add(bg);

        const invLabel = this.add.text(-180, 0, 'Inventory:', { fontSize: '16px' }).setOrigin(0, 0.5);
        this.inventoryContainer.add(invLabel);

        // Initial item slots (up to 5)
        for (let i = 0; i < 5; i++) {
            const slot = this.add.rectangle(-100 + (i * 50), 0, 40, 40, 0x333333).setStrokeStyle(1, 0x888888);
            this.inventoryContainer.add(slot);
        }

        // Dialog Box (Hidden by default)
        this.createDialogBox(width, height);

        // Listen for Game Scene events
        const gameScene = this.scene.get('PioneerBasecamp');
        gameScene.events.on('updateInventory', this.updateInventory, this);
        gameScene.events.on('showDialog', this.showDialog, this);
    }

    createDialogBox(width, height) {
        this.dialogContainer = this.add.container(width / 2, height - 100);
        const dialogBg = this.add.rectangle(0, 0, 700, 120, 0xf5f5dc, 0.9).setStrokeStyle(4, 0x5c4033);
        this.dialogContainer.add(dialogBg);

        // Name Tag (Top-left of the dialog box)
        this.nameTagContainer = this.add.container(-320, -70);
        const nameTagBg = this.add.rectangle(0, 0, 150, 40, 0x000000).setOrigin(0);
        this.nameTagText = this.add.text(75, 20, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.nameTagContainer.add([nameTagBg, this.nameTagText]);
        this.dialogContainer.add(this.nameTagContainer);

        // Text lines
        this.dialogueElements = []; // To keep track of all created text objects for easy cleanup

        this.dialogContainer.setVisible(false);
    }

    updateInventory(inventory) {
        console.log('Inventory Updated:', inventory);
    }

    showDialog(dialogueData) {
        // --- Reset from previous dialogue ---
        if (this.dialogTimer) this.dialogTimer.remove();
        this.dialogueElements.forEach(el => el.destroy());
        this.dialogueElements = [];
        this.input.off('pointerdown'); // Remove previous skip listener

        this.dialogContainer.setVisible(true);

        // --- Populate Name Tag ---
        this.nameTagText.setText(dialogueData.name);
        this.nameTagContainer.getAt(0).setFillStyle(Phaser.Display.Color.HexStringToColor(dialogueData.primaryColor).color);

        // --- Create Text Objects (initially invisible) ---
        const baseTextConfig = {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#2c2c2c',
            wordWrap: { width: 680 }
        };

        const greetingText = this.add.text(-340, -30, dialogueData.dialogue.greeting, baseTextConfig).setOrigin(0).setVisible(false);
        const verseText = this.add.text(-340, 10, `"${dialogueData.dialogue.verse}"`, baseTextConfig).setOrigin(0).setVisible(false);
        const refText = this.add.text(-340, 50, `– ${dialogueData.dialogue.ref}`, baseTextConfig).setOrigin(0).setVisible(false);

        this.dialogContainer.add([greetingText, verseText, refText]);
        this.dialogueElements.push(greetingText, verseText, refText);

        // --- Timed, sequential reveal ---
        const revealAndDismiss = () => {
            greetingText.setVisible(true);
            this.time.delayedCall(2000, () => verseText.setVisible(true));
            this.time.delayedCall(4000, () => refText.setVisible(true));
            this.dialogTimer = this.time.delayedCall(7000, () => this.dialogContainer.setVisible(false));
        };

        // --- Skip functionality ---
        const skip = () => {
            if (this.dialogTimer) this.dialogTimer.remove();
            this.dialogContainer.setVisible(false);
        };
        this.input.once('pointerdown', skip);

        revealAndDismiss();
    }
}
