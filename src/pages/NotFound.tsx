import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="text-9xl mb-8"
        >
          🚧
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Oops! Looks like you took a wrong turn. This page doesn't exist.
          <span className="block mt-2 text-green-400">
            Ntabwo iyi paji ibaho!
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-2xl font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            <span>Start Quiz</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
