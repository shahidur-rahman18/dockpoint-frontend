import { motion } from 'framer-motion';

export function LoaderOne() {
  return (
    <div className="flex items-center justify-center gap-1" role="status" aria-label="Loading">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-blue-500"
          initial={{ x: 0 }}
          animate={{
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export default LoaderOne;
