import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import IntroScene from '../scenes/IntroScene';
import CharacterSelectScene from '../scenes/CharacterSelectScene';
import RegistrationScene from '../scenes/RegistrationScene';
import PioneerBasecamp from '../scenes/PioneerBasecamp';
import InteriorScene from '../scenes/InteriorScene';
import UIScene from '../scenes/UIScene';
import HandbookScene from '../scenes/HandbookScene';

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
        IntroScene,
        CharacterSelectScene,
        RegistrationScene,
        PioneerBasecamp,
        InteriorScene,
        UIScene,
        HandbookScene
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} className="game-container" />;
};

export default Game;
