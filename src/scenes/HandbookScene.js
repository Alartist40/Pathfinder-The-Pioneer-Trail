import Phaser from 'phaser';

export default class HandbookScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HandbookScene', active: false });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Book-like background
        this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.9, 0xf5f5dc)
            .setStrokeStyle(4, 0x5c4033);

        // Title
        this.add.text(width / 2, height * 0.1, 'Pathfinder Handbook', {
            fontSize: '32px',
            fill: '#5c4033',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Divider line
        this.add.line(width / 2, height * 0.15, 0, 0, width * 0.7, 0, 0x5c4033).setOrigin(0.5);

        // Verses title
        this.add.text(width / 2, height * 0.2, 'Collected Verses', {
            fontSize: '24px',
            fill: '#2c2c2c',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Placeholder for verse text
        this.verseText = this.add.text(width * 0.2, height * 0.25, 'No verses collected yet.', {
            fontSize: '18px',
            fill: '#2c2c2c',
            wordWrap: { width: width * 0.6 }
        });

        // Close instruction
        this.add.text(width / 2, height * 0.9, '[ Press H to Close ]', {
            fontSize: '16px',
            fill: '#5c4033'
        }).setOrigin(0.5);

        // Input listener to close the handbook
        this.input.keyboard.on('keydown-H', () => {
            this.scene.sleep();
        });

        // Refresh the content when the scene is woken up
        this.events.on('wake', this.onWake, this);
    }

    onWake() {
        this.updateVerseList();
    }

    updateVerseList() {
        const verses = this.registry.get('collectedVerses');
        if (verses && verses.length > 0) {
            this.verseText.setText(verses.join('\n\n'));
        } else {
            this.verseText.setText('No verses collected yet.');
        }
    }
}
