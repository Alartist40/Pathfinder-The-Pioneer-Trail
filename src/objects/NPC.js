import Phaser from 'phaser';

const TILE_SIZE = 32;

/**
 * Represents a non-player character in the game.
 * NPCs are static, collidable, and can be interacted with.
 */
export default class NPC extends Phaser.GameObjects.Rectangle {
  /**
   * @param {Phaser.Scene} scene The scene to add this NPC to.
   * @param {number} x The x-coordinate of the NPC.
   * @param {number} y The y-coordinate of the NPC.
   * @param {string} name The name of the NPC, to be displayed.
   * @param {string} verse The Bible verse the NPC will share.
   */
  constructor(scene, x, y, name, verse) {
    super(scene, x, y, TILE_SIZE, TILE_SIZE, 0xee82ee); // Violet color for NPCs
    this.name = name;
    this.verse = verse;

    // Add this object to the scene and the physics engine
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // `true` makes it a static body

    // Custom property to identify interactable objects
    this.isInteractable = true;
  }

  /**
   * This function is called when the player interacts with this NPC.
   * It emits an event to the UI scene to display the NPC's dialog.
   */
  onInteraction() {
    this.scene.events.emit('showDialog', `${this.name}:\n"${this.verse}"`);
  }
}
