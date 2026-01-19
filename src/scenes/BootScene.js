import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets here
        // For now, we are using shapes, but we can load fonts or placeholder logic
        this.initialText = this.add.text(400, 300, 'Packing the bus...', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    create() {
        // Simulate loading time or setup global registry
        this.registry.set('score', 0);
        this.registry.set('rank', null);
        this.registry.set('character', null);
        this.registry.set('inventory', []);

        // Transition to Title Scene
        this.time.delayedCall(1000, () => {
            this.scene.start('TitleScene');
        });
    }
}
