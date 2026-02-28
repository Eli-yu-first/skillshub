/**
 * Languages Page - Skills available in different languages
 */
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Globe, ChevronRight } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  skillCount: number;
  contextCount: number;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', skillCount: 42300, contextCount: 18900 },
  { code: 'zh', name: 'Chinese', nativeName: '中文', skillCount: 12800, contextCount: 5600 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', skillCount: 6700, contextCount: 2800 },
  { code: 'fr', name: 'French', nativeName: 'Français', skillCount: 5400, contextCount: 2100 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', skillCount: 4800, contextCount: 1900 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', skillCount: 8900, contextCount: 3400 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', skillCount: 5200, contextCount: 2000 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', skillCount: 3600, contextCount: 1400 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', skillCount: 4100, contextCount: 1700 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', skillCount: 2800, contextCount: 1100 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', skillCount: 2400, contextCount: 900 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', skillCount: 2100, contextCount: 800 },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', skillCount: 1800, contextCount: 700 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', skillCount: 1500, contextCount: 600 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', skillCount: 1900, contextCount: 750 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', skillCount: 1200, contextCount: 500 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', skillCount: 980, contextCount: 400 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', skillCount: 870, contextCount: 350 },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', skillCount: 760, contextCount: 300 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', skillCount: 1100, contextCount: 450 },
];

export default function Languages() {
  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-3xl">Languages</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse skills and contexts available in different languages. SkillsHub supports {languages.length}+ languages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {languages.map((lang, i) => (
            <motion.div key={lang.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Link href={`/skills?lang=${lang.code}`}>
                <div className="group flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-xs font-display font-bold text-primary uppercase shrink-0">
                    {lang.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{lang.name}</h3>
                      <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{lang.skillCount.toLocaleString()} skills · {lang.contextCount.toLocaleString()} contexts</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
