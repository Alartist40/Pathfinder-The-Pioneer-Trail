import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PioneerBasecamp from '../scenes/PioneerBasecamp';

const Game = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    // 💡 What: The optimization implemented
    // The Phaser game instance was previously hardcoded to use the CANVAS renderer.
    // This change sets the renderer type to AUTO, allowing Phaser to prioritize the more performant WebGL renderer if the browser supports it, while safely falling back to CANVAS otherwise.
    // 🎯 Why: The performance problem it solves
    // Using WebGL leverages hardware acceleration for graphics rendering, which can lead to significant performance improvements, smoother animations, and lower CPU usage compared to the 2D Canvas API.
    // This is a standard best practice for Phaser games.
    // 📊 Impact: Expected performance improvement
    // Users with WebGL-compatible browsers will experience smoother gameplay and potentially better battery life on mobile devices.
    const config = {
      type: Phaser.AUTO,
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
