import Phaser from 'phaser';

const TILE_SIZE = 32;

/**
 * Represents a door that transitions the player to a new scene.
 * Doors are static, collidable, and interactable.
 */
export default class Door extends Phaser.GameObjects.Rectangle {
  /**
   * @param {Phaser.Scene} scene The scene to add this door to.
   * @param {number} x The x-coordinate of the door.
   * @param {number} y The y-coordinate of the door.
   * @param {string} targetScene The key of the scene this door leads to.
   * @param {number} targetX The x-coordinate the player will be moved to in the new scene.
   * @param {number} targetY The y-coordinate the player will be moved to in the new scene.
   */
  constructor(scene, x, y, targetScene, targetX, targetY) {
    // Doors are represented by a black rectangle for now
    super(scene, x, y, TILE_SIZE, TILE_SIZE, 0x000000);
    this.name = 'Door';
    this.targetScene = targetScene;
    this.targetX = targetX;
    this.targetY = targetY;

    // Add this object to the scene and the physics engine
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // `true` makes it a static body

    // Custom property to identify interactable objects
    this.isInteractable = true;
  }

  /**
   * This function is called when the player interacts with the door.
   * It starts the target scene and passes the player's destination coordinates.
   */
  onInteraction() {
    this.scene.scene.start(this.targetScene, {
      playerX: this.targetX,
      playerY: this.targetY,
    });
  }
}
