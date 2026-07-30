import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Services', path: '/services' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const linkClass = (path: string) => `nav-link ${location.pathname === path ? 'nav-link--active' : ''}`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between border-[3px] border-black bg-white px-4 py-3 shadow-[4px_4px_0_#000] sm:px-6" aria-label="Main navigation">
        <Link to="/" className="text-xl font-extrabold tracking-tighter sm:text-2xl" aria-label="Prince Kumar Yadav home">
          PRINCE<span className="text-pink-500">.</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => <Link key={link.path} to={link.path} className={linkClass(link.path)}>{link.name}</Link>)}
          <a href="mailto:prinzemedia19@gmail.com" className="brutalist-btn bg-retro-yellow px-4 py-2 text-xs">LET&apos;S TALK</a>
        </div>
        <button className="grid h-10 w-10 place-items-center border-2 border-black bg-retro-yellow md:hidden" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 p-3 pt-3 backdrop-blur-sm sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}>
            <motion.div className="ml-auto flex min-h-full w-full max-w-sm flex-col border-[3px] border-black bg-bg-cream p-6 shadow-[7px_7px_0_#000]" initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40 }} onClick={(event) => event.stopPropagation()}>
              <button className="ml-auto grid h-10 w-10 place-items-center border-2 border-black bg-white" onClick={() => setIsOpen(false)} aria-label="Close menu"><X /></button>
              <div className="mt-12 flex flex-col gap-2">
                {links.map((link) => <Link key={link.path} to={link.path} className={`${linkClass(link.path)} border-b-2 border-black py-4 text-2xl`}>{link.name}</Link>)}
              </div>
              <a href="mailto:prinzemedia19@gmail.com" className="brutalist-btn mt-auto bg-retro-yellow text-lg">LET&apos;S TALK</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
