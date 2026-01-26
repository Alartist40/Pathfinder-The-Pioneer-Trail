import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets here
        this.load.image('boy_placeholder', 'assets/images/boy_placeholder.png');
        this.load.image('girl_placeholder', 'assets/images/girl_placeholder.png');
        this.load.image('bus', 'assets/images/bus.png');

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
        this.registry.set('collectedVerses', []);

        // Transition to Intro Scene
        this.time.delayedCall(1000, () => {
            this.scene.start('IntroScene');
        });
    }
}
