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
        // Dialogue box styled according to the game design document
        this.dialogContainer = this.add.container(width / 2, height - 100);

        // Background: Light parchment with 90% opacity
        const dialogBg = this.add.rectangle(0, 0, 700, 120, 0xf5f5dc, 0.9);

        // Border: Dark brown
        dialogBg.setStrokeStyle(4, 0x5c4033);

        // Text: Deep charcoal
        this.dialogText = this.add.text(0, 0, '', {
            fontSize: '22px',
            fill: '#2c2c2c', // Deep charcoal
            wordWrap: { width: 680 },
            align: 'left',
            lineSpacing: 8,
            padding: { top: 10, left: 10, right: 10, bottom: 10 }
        }).setOrigin(0.5);

        this.dialogContainer.add([dialogBg, this.dialogText]);
        this.dialogContainer.setVisible(false);
    }

    updateInventory(inventory) {
        // Simple text update for now, or sprite rendering
        // In a real implementation we would redraw the slots
        console.log('Inventory Updated:', inventory);
    }

    showDialog(text, duration = 3000) {
        this.dialogText.setText(text);
        this.dialogContainer.setVisible(true);

        // Auto hide
        if (this.dialogTimer) this.dialogTimer.remove();
        this.dialogTimer = this.time.delayedCall(duration, () => {
            this.dialogContainer.setVisible(false);
        });
    }
}
