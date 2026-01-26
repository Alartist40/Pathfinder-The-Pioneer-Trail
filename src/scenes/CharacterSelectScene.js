import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x1e3a8a);

        this.add.text(width / 2, 100, 'Choose Your Pathfinder', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Render Boy Character
        const boy = this.renderCharacter(width / 3, height / 2, 'boy');
        this.add.text(width / 3, height / 2 + 100, 'Boy', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        boy.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectCharacter('boy'));

        // Render Girl Character
        const girl = this.renderCharacter(width * 2 / 3, height / 2, 'girl');
        this.add.text(width * 2 / 3, height / 2 + 100, 'Girl', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        girl.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectCharacter('girl'));
    }

    renderCharacter(x, y, gender) {
        const container = this.add.container(x, y);
        const head = this.add.circle(0, -50, 40, 0x5c4033); // Dark brown for hair/skin
        const body = this.add.rectangle(0, 20, 60, 80, 0xffffff); // White shirt
        const neck = this.add.rectangle(0, -20, 15, 10, 0xd2b48c); // Tan neck

        container.add([body, neck, head]);

        if (gender === 'girl') {
            const pigtailL = this.add.circle(-35, -55, 15, 0x5c4033);
            const pigtailR = this.add.circle(35, -55, 15, 0x5c4033);
            const collar = this.add.triangle(0, -15, -10, 0, 10, 0, 0, 10, 0xff0000);
            container.add([pigtailL, pigtailR, collar]);
        } else {
             const pants = this.add.rectangle(0, 80, 60, 40, 0x333333);
             container.add(pants);
        }

        return container;
    }

    selectCharacter(character) {
        this.registry.set('playerCharacter', character);
        this.scene.start('RegistrationScene');
    }
}
