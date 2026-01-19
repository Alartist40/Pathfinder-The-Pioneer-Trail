import Phaser from 'phaser';

const INTERACTION_RADIUS = 60; // The distance in pixels to trigger an interaction prompt

/**
 * Manages player interactions with game objects.
 * It detects nearby interactable objects, displays a prompt, and handles the interaction input.
 */
export default class InteractionManager {
  /**
   * @param {Phaser.Scene} scene The scene this manager belongs to.
   * @param {Phaser.GameObjects.Sprite} player The player character.
   * @param {Phaser.GameObjects.Group} interactables A group of all interactable objects.
   */
  constructor(scene, player, interactables) {
    this.scene = scene;
    this.player = player;
    this.interactables = interactables;

    this.closestInteractable = null;

    // --- Create the interaction prompt UI ---
    this.promptText = this.scene.add.text(0, 0, '', {
      fontSize: '14px',
      fill: '#ffffff',
      backgroundColor: '#000000a0',
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5, 1).setVisible(false).setDepth(100);

    // --- Listen for the interaction key ---
    this.scene.input.keyboard.on('keydown-E', this.onInteract, this);
  }

  /**
   * Called every frame. Finds the closest interactable object and updates the prompt.
   */
  update() {
    this.closestInteractable = this.findClosestInteractable();

    if (this.closestInteractable) {
      this.showPrompt();
    } else {
      this.hidePrompt();
    }
  }

  /**
   * Finds the closest interactable object within the interaction radius.
   * @returns {Phaser.GameObjects.GameObject|null} The closest object, or null if none are in range.
   */
  findClosestInteractable() {
    let closest = null;
    let minDistance = INTERACTION_RADIUS;

    this.interactables.getChildren().forEach(obj => {
      // Ensure the object is active and has the required properties
      if (obj.active && obj.isInteractable && typeof obj.onInteraction === 'function') {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          obj.x, obj.y
        );

        if (distance < minDistance) {
          minDistance = distance;
          closest = obj;
        }
      }
    });

    return closest;
  }

  /**
   * Displays the interaction prompt above the closest interactable object.
   */
  showPrompt() {
    if (!this.closestInteractable) return;

    const name = this.closestInteractable.name || 'Object';
    this.promptText.setText(`${name}\n[E] to Interact`);
    this.promptText.setPosition(this.closestInteractable.x, this.closestInteractable.y - this.closestInteractable.height);
    this.promptText.setVisible(true);
  }

  /**
   * Hides the interaction prompt.
   */
  hidePrompt() {
    this.promptText.setVisible(false);
  }

  /**
   * Handles the 'E' key press. If there's a close interactable object, its interaction is triggered.
   */
  onInteract() {
    if (this.closestInteractable) {
      this.closestInteractable.onInteraction();
    }
  }
}
