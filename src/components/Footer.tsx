import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, ArrowUpRight, Globe, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Custom SVG icons (Lucide style)                                    */
/* ------------------------------------------------------------------ */
function YouTubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.4 24.4 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.8 49.8 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.4 24.4 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.8 49.8 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Constants (prevents re-creation on each render)                    */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Services', path: '/services' },
  { label: 'Admin Panel', path: '/admin' },
] as const;

const SOCIAL_LINKS = [
  {
    icon: YouTubeIcon,
    href: 'https://www.youtube.com/@finntheory',
    label: 'YouTube',
    bg: 'bg-yellow-400',
  },
  {
    icon: Globe,
    href: '#',
    label: 'Website',
    bg: 'bg-blue-400',
  },
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/prinze.aex/',
    label: 'Instagram',
    bg: 'bg-purple-400',
  },
  {
    icon: Mail,
    href: 'mailto:prinzemedia19@gmail.com',
    label: 'Email',
    bg: 'bg-pink-400',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Animation variants (static – moved outside component)              */
/* ------------------------------------------------------------------ */
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Copy‑to‑clipboard hook                                             */
/* ------------------------------------------------------------------ */
function useCopyToClipboard(text: string, duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    }
  }, [text, duration]);

  return { copied, copy };
}

/* ------------------------------------------------------------------ */
/*  Footer Component                                                   */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const { copied, copy } = useCopyToClipboard('prinzemedia19@gmail.com');

  return (
    <motion.footer
      className="mt-20 border-t-[3px] border-black bg-white pt-12 md:pt-16 pb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={footerVariants}
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Main grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Column 1 – CTA + Email */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-normal leading-[1.18]"
              style={{
                transform: 'scaleY(1.05)',
                transformOrigin: 'left center',
              }}
            >
              Ready to create something{' '}
              <span className="text-pink-500">legendary?</span>
            </h2>
            <p className="text-lg font-medium text-slate-600 mt-4 mb-6 max-w-md leading-relaxed">
              Available for freelance scripts, video editing, and motion design
              projects.
            </p>
            <div className="relative inline-block w-full sm:w-auto">
              <button
                onClick={copy}
                className="brutalist-btn bg-pink-400 text-lg sm:text-xl py-2 px-4 sm:py-3 sm:px-6 w-full sm:w-auto flex items-center justify-center gap-2 group cursor-pointer transition-shadow duration-200 hover:shadow-[6px_6px_0_black] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold uppercase">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold break-words">
                      prinzemedia19@gmail.com
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Column 2 – Navigation */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">
              Navigation
            </h3>
            <ul className="space-y-3 font-bold">
              {NAV_ITEMS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="group inline-flex items-center gap-2 text-slate-900 hover:text-pink-500 transition-colors duration-200 py-1 px-2 -mx-2 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span className="relative inline-block">
                      <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 – Social icons */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">
              Socials
            </h3>
            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, bg }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  className={`w-12 h-12 brutalist-btn p-0 ${bg} flex items-center justify-center group transition-shadow duration-200 hover:shadow-[6px_6px_0_black] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="border-t-[3px] border-black pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="font-bold text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} PRINCE KUMAR YADAV. ALL RIGHTS
            RESERVED.
          </p>
          <p className="font-bold text-xs sm:text-sm uppercase text-center md:text-right">
            Made with a lot of coffee
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
