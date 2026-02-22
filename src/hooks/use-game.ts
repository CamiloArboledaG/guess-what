import { useEffect, useMemo, useRef, useState } from "react";

export type Difficulty = 'easy' | 'hard';
export type GameState = 'idle' | 'playing' | 'won';

const DIFFICULTY_CONFIG = {
  easy: { pairs: 4, total: 8 },
  hard: { pairs: 6, total: 12 },
} as const;

export const EMOJIS = ['🐶', '🐱', '🦊', '🐹', '🐰', '🐻'];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = (difficulty: Difficulty): string[] => {
  const { pairs } = DIFFICULTY_CONFIG[difficulty];
  return shuffleArray([...EMOJIS.slice(0, pairs), ...EMOJIS.slice(0, pairs)]);
};

export interface UseGameReturn {
  gameState: GameState;
  gameKey: number;
  difficulty: Difficulty;
  cards: string[];
  isRevealed: boolean[];
  error: boolean[];
  success: boolean[];
  attempts: number;
  elapsedTime: number;
  formattedTime: string;
  bestTime: number | null;
  formattedBestTime: string | null;
  isNewRecord: boolean;
  handleClick: (index: number) => void;
  startGame: (difficulty: Difficulty) => void;
  restartGame: () => void;
  goToStart: () => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [gameKey, setGameKey] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState<boolean[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [error, setError] = useState<boolean[]>([]);
  const [success, setSuccess] = useState<boolean[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const gameVersionRef = useRef(0);
  const difficultyRef = useRef<Difficulty>('easy');

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedTime(elapsedRef.current);
    }, 1000);
  };

  const resetBoard = (diff: Difficulty) => {
    const { total } = DIFFICULTY_CONFIG[diff];
    gameVersionRef.current += 1;
    setCards(buildDeck(diff));
    setIsRevealed(Array(total).fill(false));
    setSelectedIndices([]);
    setError(Array(total).fill(false));
    setSuccess(Array(total).fill(false));
    setAttempts(0);
    setElapsedTime(0);
    elapsedRef.current = 0;
    stopTimer();
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    difficultyRef.current = diff;
    resetBoard(diff);
    const stored = localStorage.getItem(`bestTime_${diff}`);
    setBestTime(stored ? parseInt(stored, 10) : null);
    setIsNewRecord(false);
    setGameKey(k => k + 1);
    setGameState('playing');
  };

  const restartGame = () => {
    const diff = difficultyRef.current;
    resetBoard(diff);
    const stored = localStorage.getItem(`bestTime_${diff}`);
    setBestTime(stored ? parseInt(stored, 10) : null);
    setIsNewRecord(false);
    setGameKey(k => k + 1);
    setGameState('playing');
  };

  const goToStart = () => {
    stopTimer();
    setGameState('idle');
  };

  const handleClick = (index: number) => {
    if (selectedIndices.length === 2 || isRevealed[index] || success[index]) return;

    startTimer();

    const newRevealed = isRevealed.map((r, i) => i === index ? true : r);
    const newSelected = [...selectedIndices, index];
    setIsRevealed(newRevealed);
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      setAttempts(a => a + 1);

      if (cards[first] === cards[second]) {
        const nextSuccess = success.map((s, i) => i === first || i === second ? true : s);
        setSuccess(nextSuccess);
        setSelectedIndices([]);

        if (nextSuccess.every(s => s)) {
          stopTimer();
          const finalTime = elapsedRef.current;
          const diff = difficultyRef.current;
          const key = `bestTime_${diff}`;
          const stored = localStorage.getItem(key);
          const best = stored ? parseInt(stored, 10) : null;
          if (best === null || finalTime < best) {
            localStorage.setItem(key, finalTime.toString());
            setBestTime(finalTime);
            setIsNewRecord(true);
          } else {
            setBestTime(best);
            setIsNewRecord(false);
          }
          setGameState('won');
        }
      } else {
        const { total } = DIFFICULTY_CONFIG[difficultyRef.current];
        const version = gameVersionRef.current;
        setError(prev => prev.map((e, i) => i === first || i === second ? true : e));
        setTimeout(() => {
          if (gameVersionRef.current !== version) return;
          setIsRevealed(prev => prev.map((r, i) => i === first || i === second ? false : r));
          setError(Array(total).fill(false));
          setSelectedIndices([]);
        }, 600);
      }
    }
  };

  const formattedTime = useMemo(() => formatTime(elapsedTime), [elapsedTime]);
  const formattedBestTime = useMemo(() => bestTime !== null ? formatTime(bestTime) : null, [bestTime]);

  return {
    gameState, gameKey, difficulty, cards, isRevealed, error, success,
    attempts, elapsedTime, formattedTime, bestTime, formattedBestTime, isNewRecord,
    handleClick, startGame, restartGame, goToStart,
  };
}
