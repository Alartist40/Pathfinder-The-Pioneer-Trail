import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PioneerBasecamp from '../scenes/PioneerBasecamp';

const Game = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      parent: gameContainer.current,
      scene: [PioneerBasecamp],
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

  return <div ref={gameContainer} />;
};

export default Game;
