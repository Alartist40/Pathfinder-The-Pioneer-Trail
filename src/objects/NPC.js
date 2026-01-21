import Phaser from 'phaser';

export default class NPC extends Phaser.GameObjects.Container {
    constructor(scene, x, y, data) {
        super(scene, x, y);
        this.npcName = data.name;
        this.dialogue = data.dialogue;

        // Set a reasonable size for the container for physics
        this.setSize(32, 48);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setImmovable(true);

        this.renderCharacter(data.name);

        this.isInteractable = true;
    }

    renderCharacter(name) {
        // Define base colors
        const skinTones = {
            africanAmerican: 0x8D5524,
            spanishItalian: 0xC68642,
            filipina: 0xDEB887
        };
        const shirtColor = 0x104d20; // Pathfinder green

        let skinColor;

        if (['Samuel', 'Marlon'].includes(name)) {
            skinColor = skinTones.africanAmerican;
        } else if (['Alex', 'Claudio'].includes(name)) {
            skinColor = skinTones.spanishItalian;
        } else if (name === 'Myra') {
            skinColor = skinTones.filipina;
        }

        // Base body parts
        const head = this.scene.add.circle(0, -30, 20, skinColor);
        const body = this.scene.add.rectangle(0, 15, 30, 50, shirtColor);
        this.add([body, head]);

        // Unique features
        switch (name) {
            case 'Samuel':
            case 'Marlon':
            case 'Alex':
            case 'Claudio':
                // Curly hair for these characters
                this.add(this.scene.add.circle(-10, -35, 10, 0x000000));
                this.add(this.scene.add.circle(10, -35, 10, 0x000000));
                this.add(this.scene.add.circle(0, -40, 12, 0x000000));
                break;
            case 'Myra':
                // Straight hair for Myra
                const hair = this.scene.add.graphics();
                hair.fillStyle(0x000000);
                hair.fillPoints([
                    new Phaser.Math.Vector2(-20, -45),
                    new Phaser.Math.Vector2(20, -45),
                    new Phaser.Math.Vector2(20, -15),
                    new Phaser.Math.Vector2(-20, -15),
                ], true);
                this.add(hair);
                break;
        }
    }

    onInteraction() {
        // Updated to use the new dialogue structure
        const dialogueText = `${this.npcName}:\n"${this.dialogue.greeting}\n${this.dialogue.verse} (${this.dialogue.ref})"`;
        this.scene.events.emit('showDialog', dialogueText);
    }
}
