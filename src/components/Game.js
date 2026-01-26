import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import TitleScene from '../scenes/TitleScene';
import CharacterSelectScene from '../scenes/CharacterSelectScene';
import RegistrationScene from '../scenes/RegistrationScene';
import PioneerBasecamp from '../scenes/PioneerBasecamp';
import InteriorScene from '../scenes/InteriorScene';
import UIScene from '../scenes/UIScene';

const Game = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer.current,
      scene: [
        BootScene,
        TitleScene,
        CharacterSelectScene,
        RegistrationScene,
        PioneerBasecamp,
        InteriorScene,
        UIScene
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
    };

    try {
      const game = new Phaser.Game(config);
      window.phaserGame = game; // Expose for verification scripts
      return () => {
        game.destroy(true);
      };
    } catch (e) {
      console.error('Failed to create Phaser game:', e);
    }
  }, []);

  return <div ref={gameContainer} className="game-container" />;
};

export default Game;
