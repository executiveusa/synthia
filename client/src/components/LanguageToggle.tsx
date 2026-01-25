import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all duration-300 group"
      aria-label="Toggle language"
    >
      {/* Language labels */}
      <span className={`text-sm font-medium transition-colors ${language === 'es' ? 'text-primary' : 'text-muted-foreground'}`}>
        ES
      </span>
      
      {/* Toggle switch */}
      <div className="relative w-14 h-7 rounded-full bg-muted">
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg"
          animate={{
            x: language === 'en' ? 28 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Flag icons */}
          <motion.div
            key={language}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg"
          >
            {language === 'es' ? '🇲🇽' : '🇺🇸'}
          </motion.div>
        </motion.div>
      </div>

      <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`}>
        EN
      </span>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
    </button>
  );
}
