import Phaser from 'phaser';

const TILE_SIZE = 32;

/**
 * Represents a non-player character in the game.
 * NPCs are static, collidable, and can be interacted with.
 */
export default class NPC extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene The scene to add this NPC to.
   * @param {number} x The x-coordinate of the NPC.
   * @param {number} y The y-coordinate of the NPC.
   * @param {string} texture The key of the texture to use for this NPC.
   * @param {object} npcData The data object for the NPC, containing name, colors, and dialogue.
   */
  constructor(scene, x, y, texture, npcData) {
    super(scene, x, y, texture);
    this.npcData = npcData;
    this.name = npcData.name; // Keep name for easy access, e.g., for interaction prompts

    // Add this object to the scene and the physics engine
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // `true` makes it a static body

    // Adjust sprite properties
    this.setScale(0.08).setOrigin(0.5, 0.5);
    this.body.setSize(this.width * 0.5, this.height * 0.7);


    // Custom property to identify interactable objects
    this.isInteractable = true;
  }

  /**
   * This function is called when the player interacts with this NPC.
   * It displays the NPC's dialog and adds the verse to the player's collection.
   */
  onInteraction() {
    // Show dialogue in the UI using the new structured data
    this.scene.events.emit('showDialog', this.npcData);

    // Format the verse for storage in the handbook
    const verseToAdd = `"${this.npcData.dialogue.verse}" – ${this.npcData.dialogue.ref}`;

    // Add the verse to the global registry if it's not already there
    const collectedVerses = this.scene.registry.get('collectedVerses');
    if (!collectedVerses.includes(verseToAdd)) {
        collectedVerses.push(verseToAdd);
        this.scene.registry.set('collectedVerses', collectedVerses);

        // This could be a sound effect or a small notification in the UI scene.
        this.scene.events.emit('showToast', 'New Verse Collected!');
    }
  }
}
