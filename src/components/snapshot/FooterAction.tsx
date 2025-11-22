'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FooterAction() {
  const router = useRouter();

  const transferLearningPath = (): void => {
    router.push('/learn');
  };

  return (
    <footer className="mb-12 text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={transferLearningPath}
        className="h-[56px] w-[100%] cursor-pointer rounded-lg bg-[#0090E0] px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-violet-400 hover:to-pink-600 lg:w-[477px]"
      >
        Xem lộ trình học
      </motion.button>
    </footer>
  );
}
