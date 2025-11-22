# 🎮 Game Hub - Quick Registration Guide

## TL;DR - Register Your Game in 3 Steps

### For iframe Games (HTML/CSS/JS from any library)

#### Step 1: Place Files
```
public/games/your-game/
└── index.html  (your game entry point)
```

#### Step 2: Add Iruka SDK to index.html
```javascript
let host = null;
window.addEventListener('message', (e) => {
  if (e.data?.type === 'INIT') {
    host = {
      ready: () => window.parent.postMessage({
        sdkVersion: '1.0.0',
        source: 'game',
        type: 'READY'
      }, '*'),
      reportScore: s => window.parent.postMessage({
        sdkVersion: '1.0.0',
        source: 'game',
        type: 'SCORE_UPDATE',
        payload: { score: s }
      }, '*'),
      complete: d => window.parent.postMessage({
        sdkVersion: '1.0.0',
        source: 'game',
        type: 'COMPLETE',
        payload: d
      }, '*')
    };
    initGame();
    host.ready();
  }
});
```

#### Step 3: Register in API
Edit `src/app/[locale]/api/game-hub/games/route.ts`:
```typescript
{
  id: 'your-game',
  title: 'Your Game',
  runtime: 'iframe-html',
  entryUrl: '/games/your-game/index.html',
  // ... other fields
}
```

**Done!** ✅ Your game appears in Game Hub.

---

## Full Documentation

For detailed instructions and scenarios (Phaser, Three.js, Unity, etc.), see:
- **`README.md`** in this folder - Complete step-by-step guide

---

## Examples

**Study existing games**:
- Math Blitz (simple iframe): `public/games/math-blitz/`
- Word Scramble (medium iframe): `public/games/word-scramble/`
- Memory Match Pro (ESM React): `src/games/memory-match-pro/`

---

**Questions?** Read the full guide in `README.md` in this folder! 📖
