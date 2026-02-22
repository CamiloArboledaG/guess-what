import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

interface CardProps {
  emoji: string;
  isRevealed: boolean;
  error: boolean;
  success: boolean;
  onClick: () => void;
}

const Card = ({ emoji, isRevealed, error, success, onClick }: CardProps) => {
  const canClick = !isRevealed && !success;
  const [scope, animateCard] = useAnimate();

  useEffect(() => {
    if (success && scope.current) {
      animateCard(scope.current, { scale: [1, 1.2, 0.9, 1.08, 1] }, { duration: 0.45, delay: 0.35 });
    }
  }, [success, animateCard, scope]);

  return (
    <motion.div
      ref={scope}
      className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-20 md:h-20 select-none ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={canClick ? onClick : undefined}
      whileHover={canClick ? { scale: 1.08, y: -3 } : {}}
      whileTap={canClick ? { scale: 0.95 } : {}}
      animate={error ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
      transition={error ? { duration: 0.4 } : { duration: 0.15 }}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isRevealed || success ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 rounded-xl border-2 border-indigo-500 shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            backgroundColor: 'rgb(55, 48, 163)',
            backgroundImage: 'radial-gradient(circle, rgba(129, 140, 248, 0.55) 1.5px, transparent 1.5px)',
            backgroundSize: '10px 10px',
          }}
        />

        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg border-2 ${
            error
              ? 'bg-red-500 border-red-400'
              : success
              ? 'bg-emerald-500 border-emerald-400'
              : 'bg-white border-slate-200'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {emoji}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
