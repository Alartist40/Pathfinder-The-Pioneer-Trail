import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sky background
        this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb);

        // Ground
        this.add.rectangle(width / 2, height, width, 100, 0x228b22).setOrigin(0.5, 1);

        // Road
        const road = this.add.graphics();
        road.fillStyle(0x696969, 1);
        road.beginPath();
        road.moveTo(width / 2 - 100, height);
        road.lineTo(0, height / 2);
        road.lineTo(width, height / 2);
        road.lineTo(width / 2 + 100, height);
        road.closePath();
        road.fillPath();

        // Mt. Fuji
        const fuji = this.add.graphics();
        fuji.fillStyle(0xd3d3d3, 1);
        fuji.beginPath();
        fuji.moveTo(width / 2, 150);
        fuji.lineTo(width / 2 - 150, height / 2);
        fuji.lineTo(width / 2 + 150, height / 2);
        fuji.closePath();
        fuji.fillPath();
        // Snow cap
        fuji.fillStyle(0xffffff, 1);
        fuji.beginPath();
        fuji.moveTo(width / 2, 150);
        fuji.lineTo(width / 2 - 40, 220);
        fuji.lineTo(width / 2 + 40, 220);
        fuji.closePath();
        fuji.fillPath();

        // Scrolling Forest
        this.trees = this.add.group();
        for (let i = 0; i < 2; i++) {
            const x = i * width;
            // Create a variety of trees
            for (let j = 0; j < 20; j++) {
                const treeX = x + Phaser.Math.Between(0, width);
                const treeY = Phaser.Math.Between(height / 2 + 20, height - 70);
                const treeHeight = Phaser.Math.Between(40, 80);
                const treeColor = Phaser.Math.RND.pick([0x006400, 0x2e8b57, 0x004d00]);
                this.trees.add(this.add.triangle(treeX, treeY, 0, treeHeight, 40, treeHeight, 20, 0, treeColor));
            }
        }

        // Bus
        const bus = this.add.container(width / 2, height - 100);
        const busBody = this.add.rectangle(0, 0, 120, 60, 0xffd700);
        busBody.setStrokeStyle(2, 0x000000);
        bus.add(busBody);
        bus.add(this.add.rectangle(-30, 0, 20, 40, 0xadd8e6));
        bus.add(this.add.rectangle(10, 0, 20, 40, 0xadd8e6));
        bus.add(this.add.circle(-40, 30, 15, 0x000000));
        bus.add(this.add.circle(40, 30, 15, 0x000000));

        // Start Button
        const startButton = this.add.rectangle(width / 2, height - 100, 150, 50, 0xfacc15, 0.8)
            .setInteractive({ useHandCursor: true });
        const startText = this.add.text(width / 2, height - 100, 'Start Adventure', {
            fontSize: '20px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Title
        this.add.text(width / 2, 80, 'Pathfinder: The Pioneer Trail', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });
    }

    update() {
        // Scroll the trees
        this.trees.incX(-1);
        this.trees.getChildren().forEach(tree => {
            if (tree.x < -50) {
                tree.x += this.cameras.main.width + 100;
            }
        });
    }
}
