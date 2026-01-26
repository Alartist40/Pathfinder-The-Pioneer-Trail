import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gender) {
        super(scene, x, y);

        this.setSize(32, 48); // Set a reasonable size for the container
        scene.add.existing(this);

        this.gender = gender;
        this.speed = 200;

        // Render the character using minimalist vector art
        const head = scene.add.circle(0, -30, 20, 0x5c4033);
        const body = scene.add.rectangle(0, 10, 30, 40, 0xffffff);
        const neck = scene.add.rectangle(0, -10, 8, 5, 0xd2b48c);

        this.add([body, neck, head]);

        if (this.gender === 'girl') {
            const pigtailL = scene.add.circle(-18, -32, 8, 0x5c4033);
            const pigtailR = scene.add.circle(18, -32, 8, 0x5c4033);
            const collar = scene.add.triangle(0, -5, -5, 0, 5, 0, 0, 5, 0xff0000);
            this.add([pigtailL, pigtailR, collar]);
        } else {
            const pants = scene.add.rectangle(0, 40, 30, 20, 0x333333);
            this.add(pants);
        }

        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
    }

    update(cursors, keys) {
        this.body.setVelocity(0);
        let velocityX = 0;
        let velocityY = 0;

        if (cursors.left.isDown || keys.A.isDown) velocityX = -1;
        else if (cursors.right.isDown || keys.D.isDown) velocityX = 1;

        if (cursors.up.isDown || keys.W.isDown) velocityY = -1;
        else if (cursors.down.isDown || keys.S.isDown) velocityY = 1;

        const normalized = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        this.body.setVelocity(normalized.x * this.speed, normalized.y * this.speed);
    }
}
