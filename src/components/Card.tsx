import { motion } from "framer-motion";

interface CardProps {
  emoji: string;
  isRevealed: boolean;
  error: boolean;
  success: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ emoji, isRevealed, error, success, onClick }) => {
  const canClick = !isRevealed && !success;

  return (
    <motion.div
      className={`relative w-[72px] h-[72px] sm:w-20 sm:h-20 select-none ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
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
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 border-2 border-indigo-500 flex items-center justify-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-indigo-400 opacity-50" />
        </div>

        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 ${
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
