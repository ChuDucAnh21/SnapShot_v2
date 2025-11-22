/**
 * Game Component Route
 * Serves the Memory Match Pro game component as a JavaScript module
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // Serve the game component code directly
  // Import React from CDN to ensure it's available
  const moduleCode = `// Memory Match Pro Game Component
// This module is served by Next.js API route

// Import React from CDN
import React, { useState, useEffect } from 'https://esm.sh/react@19.1.1';

// Game component code
const THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'],
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'],
};

function MemoryMatchProGame({ host, context: _context }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(1000);
  const [startTime, setStartTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
    host.ready();
  }, []);

  function initializeGame() {
    const theme = THEMES.animals;
    const pairs = theme.slice(0, 8);
    
    const gameCards = [];
    pairs.forEach((value, index) => {
      gameCards.push({
        id: index * 2,
        value,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        value,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = gameCards[i];
      gameCards[i] = gameCards[j];
      gameCards[j] = temp;
    }

    setCards(gameCards);
    setStartTime(Date.now());
    setGameStarted(true);
  }

  function handleCardClick(cardId) {
    if (!gameStarted || isGameOver) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);
      
      if (!firstCard || !secondCard) return;

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          const matchedCards = newCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          const newScore = score + 50;
          setScore(newScore);
          host.reportScore(newScore);

          if (newMatchedPairs === 8) {
            completeGame(newScore);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = newCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);

          const newScore = Math.max(0, score - 10);
          setScore(newScore);
          host.reportScore(newScore);
        }, 1000);
      }
    }
  }

  function completeGame(finalScore) {
    setIsGameOver(true);
    const timeMs = Date.now() - (startTime || 0);
    
    host.complete({
      score: finalScore,
      timeMs,
      extras: {
        moves,
        matchedPairs,
        accuracy: Math.round((matchedPairs * 2 / moves) * 100),
      },
    });
  }

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      display: 'flex',
      gap: '30px',
      marginBottom: '30px',
    },
    stat: {
      textAlign: 'center',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
    },
    statLabel: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.8)',
      marginTop: '5px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '15px',
      maxWidth: '500px',
    },
    card: {
      width: '100px',
      height: '100px',
      background: 'white',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    cardFlipped: {
      transform: 'scale(1.05)',
    },
    cardMatched: {
      opacity: 0.6,
      transform: 'scale(0.9)',
    },
    cardFront: {
      fontSize: '48px',
    },
    cardBack: {
      fontSize: '48px',
      color: '#cbd5e0',
      fontWeight: 'bold',
    },
    gameOver: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    gameOverTitle: {
      fontSize: '36px',
      marginBottom: '20px',
      color: '#1f2937',
    },
    finalScore: {
      fontSize: '64px',
      fontWeight: 'bold',
      color: '#667eea',
      margin: '20px 0',
    },
    gameOverStats: {
      fontSize: '18px',
      color: '#6b7280',
    },
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: styles.header },
      React.createElement('div', { style: styles.stat },
        React.createElement('div', { style: styles.statValue }, moves),
        React.createElement('div', { style: styles.statLabel }, 'Moves')
      ),
      React.createElement('div', { style: styles.stat },
        React.createElement('div', { style: styles.statValue }, matchedPairs + '/8'),
        React.createElement('div', { style: styles.statLabel }, 'Pairs')
      ),
      React.createElement('div', { style: styles.stat },
        React.createElement('div', { style: styles.statValue }, score),
        React.createElement('div', { style: styles.statLabel }, 'Score')
      )
    ),
    React.createElement('div', { style: styles.grid },
      cards.map((card) =>
        React.createElement('div', {
          key: card.id,
          style: {
            ...styles.card,
            ...(card.isFlipped || card.isMatched ? styles.cardFlipped : {}),
            ...(card.isMatched ? styles.cardMatched : {}),
          },
          onClick: () => handleCardClick(card.id)
        },
          card.isFlipped || card.isMatched
            ? React.createElement('div', { style: styles.cardFront }, card.value)
            : React.createElement('div', { style: styles.cardBack }, '?')
        )
      )
    ),
    isGameOver && React.createElement('div', { style: styles.gameOver },
      React.createElement('h2', { style: styles.gameOverTitle }, '🎉 Hoàn thành!'),
      React.createElement('div', { style: styles.finalScore }, score),
      React.createElement('div', { style: styles.gameOverStats },
        moves + ' moves • ' + matchedPairs + ' pairs'
      )
    )
  );
}

export default MemoryMatchProGame;
`;

  return new NextResponse(moduleCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
