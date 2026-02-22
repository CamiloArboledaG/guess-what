'use client'
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useGame, Difficulty, UseGameReturn } from "@/hooks/use-game";
import Card from "@/components/Card";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cardEntranceVariants = {
  hidden: { scale: 0, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
};

const screenTransition = { duration: 0.3 };

function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 5 + Math.random() * 6,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][
          Math.floor(Math.random() * 6)
        ],
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 1.5,
        rotate: 180 + Math.random() * 360,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, top: -10 }}
          animate={{ y: '105vh', rotate: p.rotate, opacity: [1, 1, 0.5, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function StartScreen({ onStart }: { onStart: (d: Difficulty) => void }) {
  const [selected, setSelected] = useState<Difficulty>('easy');

  return (
    <motion.div
      className="flex flex-col items-center gap-8 max-w-sm w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={screenTransition}
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Guess What!</h1>
        <p className="text-slate-400 text-base">Encuentra todos los pares y bate tu récord</p>
      </div>

      <div className="bg-slate-800/60 rounded-2xl p-5 w-full border border-slate-700">
        <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-widest mb-4">Cómo jugar</h2>
        <ul className="text-slate-400 text-sm space-y-2">
          <li>👆 Voltea dos cartas por turno</li>
          <li>🧠 Memoriza dónde están los pares</li>
          <li>✅ Encuentra todos los pares para ganar</li>
          <li>⏱️ El timer arranca con tu primer clic</li>
        </ul>
      </div>

      <div className="w-full">
        <p className="text-slate-400 text-sm font-medium mb-3">Dificultad</p>
        <div className="grid grid-cols-2 gap-3">
          {(['easy', 'hard'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => setSelected(diff)}
              className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all cursor-pointer ${
                selected === diff
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
              }`}
            >
              {diff === 'easy' ? '😌 Fácil (8 cartas)' : '🔥 Difícil (12 cartas)'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-colors cursor-pointer"
      >
        Jugar
      </button>
    </motion.div>
  );
}

function GameBoard({ game }: { game: UseGameReturn }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={screenTransition}
    >
      <div className="flex justify-between w-full items-center">
        <IconButton aria-label="inicio" onClick={game.goToStart} size="medium" sx={{ color: 'rgb(148,163,184)', '&:hover': { color: 'white' } }}>
          <ArrowBackIcon />
        </IconButton>

        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-xs uppercase tracking-widest">Intentos</span>
            <span className="text-white text-2xl font-bold">{game.attempts}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-xs uppercase tracking-widest">Tiempo</span>
            <span className="text-white text-2xl font-bold font-mono">{game.formattedTime}</span>
          </div>
        </div>

        <IconButton aria-label="reiniciar" onClick={game.restartGame} size="medium" sx={{ color: 'rgb(148,163,184)', '&:hover': { color: 'white' } }}>
          <RestartAltIcon />
        </IconButton>
      </div>

      <motion.div
        key={game.gameKey}
        className="grid grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {game.cards.map((emoji, i) => (
          <motion.div key={i} variants={cardEntranceVariants}>
            <Card
              emoji={emoji}
              isRevealed={game.isRevealed[i]}
              error={game.error[i]}
              success={game.success[i]}
              onClick={() => game.handleClick(i)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function WinScreen({ game }: { game: UseGameReturn }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 max-w-sm w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={screenTransition}
    >
      <Confetti />

      <motion.div
        className="text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <h1 className="text-5xl font-bold text-white mb-1">¡Ganaste! 🎉</h1>
        <p className="text-slate-400">
          {game.difficulty === 'easy' ? 'Fácil' : 'Difícil'}
          {game.isNewRecord && (
            <span className="ml-2 text-yellow-400 font-semibold">⭐ ¡Nuevo récord!</span>
          )}
        </p>
      </motion.div>

      <div className="bg-slate-800/60 rounded-2xl p-5 w-full border border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Intentos</span>
          <span className="text-white text-xl font-bold">{game.attempts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Tiempo</span>
          <span className="text-white text-xl font-bold font-mono">{game.formattedTime}</span>
        </div>
        {game.formattedBestTime && (
          <div className="flex justify-between items-center border-t border-slate-600 pt-4">
            <span className="text-slate-400">Mejor tiempo</span>
            <span className={`text-xl font-bold font-mono ${game.isNewRecord ? 'text-yellow-400' : 'text-slate-300'}`}>
              {game.formattedBestTime}
            </span>
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={game.restartGame}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          Jugar de nuevo
        </button>
        <button
          onClick={game.goToStart}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Cambiar dificultad
        </button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const game = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col items-center justify-center flex-1">
        <AnimatePresence mode="wait">
          {game.gameState === 'idle' && <StartScreen key="start" onStart={game.startGame} />}
          {game.gameState === 'playing' && <GameBoard key="game" game={game} />}
          {game.gameState === 'won' && <WinScreen key="won" game={game} />}
        </AnimatePresence>
      </main>
      <footer className="text-center text-sm mt-6">
        <p className="text-slate-600">Made with 💜 by Camilo Arboleda</p>
      </footer>
    </div>
  );
}
