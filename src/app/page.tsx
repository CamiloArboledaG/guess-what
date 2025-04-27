'use client'
import Button from "@/components/Button";
import { useEffect, useState } from "react";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState<boolean[]>(Array(12).fill(false));
  const [numbers, setNumbers] = useState([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<boolean[]>(Array(12).fill(false));
  const [success, setSuccess] = useState<boolean[]>(Array(12).fill(false));

  useEffect(() => {
    setNumbers(numbers.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [firstIndex, secondIndex] = selectedIndices;
      const firstValue = numbers[firstIndex];
      const secondValue = numbers[secondIndex];

      if (firstValue === secondValue) {
        setScore(score + 1);
        setSelectedIndices([]);
        setSuccess(prevSuccess => prevSuccess.map((s, index) => index === firstIndex || index === secondIndex ? true : s));
      } else {
        setError(prevError => prevError.map((err, index) => index === firstIndex || index === secondIndex ? true : err));
        setTimeout(() => {
          setIsRevealed(prevRevealed => prevRevealed.map((rev, index) => index === firstIndex || index === secondIndex ? false : rev));
          setSelectedIndices([]);
          setError(Array(12).fill(false));
        }, 500);
      }
    }
  }, [selectedIndices, numbers, score]);

  const handleClick = (id: number) => {
    const newIndex = id - 1;
    if (selectedIndices.length === 2 || isRevealed[newIndex] || numbers[newIndex] === null) {
      return;
    }

    setIsRevealed(isRevealed.map((revealed, index) => index === newIndex ? true : revealed));
    setSelectedIndices([...selectedIndices, newIndex]);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Score: {score}</h1>
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
      </main>
    </div>
  );
}
