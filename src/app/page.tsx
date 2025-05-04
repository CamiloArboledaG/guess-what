'use client'
import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState<boolean[]>(Array(12).fill(false));
  const [numbers, setNumbers] = useState([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<boolean[]>(Array(12).fill(false));
  const [success, setSuccess] = useState<boolean[]>(Array(12).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showPenalty, setShowPenalty] = useState(false);

  const animatedScore = useMotionValue(0);
  const animatedPenalty = useMotionValue(0);

  useEffect(() => {
    setNumbers(numbers.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (!gameOver) {
      timerInterval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameOver]);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [firstIndex, secondIndex] = selectedIndices;
      const firstValue = numbers[firstIndex];
      const secondValue = numbers[secondIndex];

      if (firstValue === secondValue) {
        setSelectedIndices([]);
        const nextSuccess = success.map((s, index) => index === firstIndex || index === secondIndex ? true : s);
        setSuccess(nextSuccess);
        setScore(prevScore => prevScore + 6);

        if (nextSuccess.every(s => s)) {
          setGameOver(true);
        }
      } else {
        setScore(prevScore => prevScore - 1);
        setError(prevError => prevError.map((err, index) => index === firstIndex || index === secondIndex ? true : err));
        setTimeout(() => {
          setIsRevealed(prevRevealed => prevRevealed.map((rev, index) => index === firstIndex || index === secondIndex ? false : rev));
          setSelectedIndices([]);
          setError(Array(12).fill(false));
        }, 500);
      }
    }
  }, [selectedIndices, numbers, success]);

  useEffect(() => {
    if (gameOver) {
      const calculatedPenalty = Math.floor(elapsedTime);
      const calculatedFinalScore = score - calculatedPenalty;
      setFinalScore(calculatedFinalScore);
      // setShowPenalty(true);

      animatedScore.set(score);
      animatedPenalty.set(calculatedPenalty);

      const scoreControls = animate(animatedScore, calculatedFinalScore, {
        duration: 3,
        ease: "easeOut",
      });

      const penaltyControls = animate(animatedPenalty, 0, {
        duration: 3,
        ease: "easeOut",
        onComplete: () => {
          setTimeout(() => {
            // setShowPenalty(false);
          }, 250);
        }
      });

      return () => {
        scoreControls.stop();
        penaltyControls.stop();
      };
    } else {
      setFinalScore(null);
      animatedScore.set(0);
      animatedPenalty.set(0);
      setShowPenalty(false);
    }
  }, [gameOver, score, elapsedTime, animatedScore, animatedPenalty]);

  const roundedAnimatedScore = useTransform(animatedScore, value => Math.round(value));
  const roundedAnimatedPenalty = useTransform(animatedPenalty, value => Math.round(value));

  const handleClick = (id: number) => {
    const newIndex = id - 1;
    if (selectedIndices.length === 2 || isRevealed[newIndex] || numbers[newIndex] === null) {
      return;
    }

    setIsRevealed(isRevealed.map((revealed, index) => index === newIndex ? true : revealed));
    setSelectedIndices([...selectedIndices, newIndex]);
  }

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const formattedTime = useMemo(() => formatTime(elapsedTime), [elapsedTime]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {gameOver ? (
          <div className="flex flex-col justify-between w-full items-center sm:items-start">
            <h1 className="text-2xl font-bold text-center w-full m-10">Game Over</h1>
            <div className="flex flex-row gap-[32px] justify-between w-full items-center">
            <div className="flex flex-col justify-between w-full items-start sm:items-start">
              <h1 className="text-2xl font-bold">
                Score: {score}
              </h1>
              <h1 className="text-2xl font-bold">
                Time: {formattedTime}
              </h1>
            </div>
            <hr className="w-3 border-t border-gray-300 my-1" />
            </div>
            <hr className="w-full border-t border-gray-300 my-5" />
            <div className="flex flex-row gap-[32px] items-start w-full">
              <h1 className="text-2xl font-bold">
                Final Score: <motion.span>{roundedAnimatedScore}</motion.span>
              </h1>
              {showPenalty && (
                <h1 className="text-2xl font-bold">
                  -<motion.span>{roundedAnimatedPenalty}</motion.span>s
                </h1>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center sm:items-start">
            <h1 className="text-2xl font-bold">
              Score: {gameOver ? <motion.span>{roundedAnimatedScore}</motion.span> : score}
            </h1>
            <h1 className="text-2xl font-bold">
              Time: {formattedTime}
            </h1>
          </div>
          )}
        {!gameOver && (
          <>
          <div className="flex flex-row gap-[32px]">
            <Button id={1} number={numbers[0]} isRevealed={isRevealed[0]} onClick={handleClick} error={error[0]} success={success[0]} />
            <Button id={2} number={numbers[1]} isRevealed={isRevealed[1]} onClick={handleClick} error={error[1]} success={success[1]} />
            <Button id={3} number={numbers[2]} isRevealed={isRevealed[2]} onClick={handleClick} error={error[2]} success={success[2]} />
          </div>
          <div className="flex flex-row gap-[32px]">
            <Button id={4} number={numbers[3]} isRevealed={isRevealed[3]} onClick={handleClick} error={error[3]} success={success[3]} />
            <Button id={5} number={numbers[4]} isRevealed={isRevealed[4]} onClick={handleClick} error={error[4]} success={success[4]} />
            <Button id={6} number={numbers[5]} isRevealed={isRevealed[5]} onClick={handleClick} error={error[5]} success={success[5]} />
          </div>
          <div className="flex flex-row gap-[32px]">
            <Button id={7} number={numbers[6]} isRevealed={isRevealed[6]} onClick={handleClick} error={error[6]} success={success[6]} />
            <Button id={8} number={numbers[7]} isRevealed={isRevealed[7]} onClick={handleClick} error={error[7]} success={success[7]} />
            <Button id={9} number={numbers[8]} isRevealed={isRevealed[8]} onClick={handleClick} error={error[8]} success={success[8]} />
          </div>
          <div className="flex flex-row gap-[32px]">
            <Button id={10} number={numbers[9]} isRevealed={isRevealed[9]} onClick={handleClick} error={error[9]} success={success[9]} />
            <Button id={11} number={numbers[10]} isRevealed={isRevealed[10]} onClick={handleClick} error={error[10]} success={success[10]} />
            <Button id={12} number={numbers[11]} isRevealed={isRevealed[11]} onClick={handleClick} error={error[11]} success={success[11]} />
          </div>
          </>
        )}
      </main>
    </div>
  );
}
