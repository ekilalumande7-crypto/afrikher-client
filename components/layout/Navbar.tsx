"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "01", name: "Accueil", href: "/" },
    { id: "02", name: "Magazine", href: "/magazine" },
    { id: "03", name: "Rubriques", href: "/rubriques" },
    { id: "04", name: "Boutique", href: "/boutique" },
    { id: "05", name: "Blog", href: "/blog" },
    { id: "06", name: "Abonnement", href: "/abonnement" },
    { id: "07", name: "Contact", href: "/contact" },
    { id: "08", name: "Partenaires", href: "/partenaires" },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 py-6",
          isScrolled ? "bg-black/40 backdrop-blur-sm py-4 border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Wordmark Logo */}
          <div className="flex flex-col items-start">
            <span 
              className="px-2 py-0.5 text-[#0A0A0A] text-[0.45rem] tracking-[0.2em] uppercase font-body font-bold rounded-[1px] mb-1 shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-gold-shine"
              style={{
                background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
                backgroundSize: "200% 200%",
              }}
            >
              Magazine
            </span>
            <Link href="/" className="text-[1.5rem] font-display font-light tracking-[0.3em] text-[#F5F0E8] uppercase leading-none">
              AFRIKHER
            </Link>
          </div>

          {/* Right Side: Links & Menu Toggle */}
          <div className="flex items-center space-x-8">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="text-[0.7rem] font-body font-light tracking-[0.2em] text-[#F5F0E8] uppercase hover:opacity-70 transition-opacity cursor-pointer"
              >
                EN SAVOIR PLUS
              </button>
              
              <button 
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="group flex items-center space-x-4 text-[#F5F0E8] transition-colors duration-300"
              >
                <span className="text-[0.7rem] font-body font-light tracking-[0.25em] uppercase group-hover:text-[#C9A84C] transition-colors duration-300">
                  {isMegaMenuOpen ? "FERMER" : "MENU"}
                </span>
                <div className="flex flex-col justify-center items-end space-y-[5px] w-[18px]">
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "w-[18px] translate-y-[6px] rotate-45" : "w-[18px]"
                  )} />
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "opacity-0" : "w-[18px]"
                  )} />
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "w-[18px] -translate-y-[6px] -rotate-45" : "w-[18px]"
                  )} />
                </div>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-[#F5F0E8]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="flex flex-col justify-center items-end space-y-[5px] w-[24px]">
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "rotate-45 translate-y-[6px]" : "")} />
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "opacity-0" : "")} />
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : "")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#C9A84C]/20 p-8 md:p-16 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="absolute top-6 right-6 text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>

              <div className="flex flex-col items-center text-center">
                <h3 className="font-display italic text-[2rem] md:text-[2.5rem] text-[#F5F0E8] mb-8">
                  Le Magazine.
                </h3>
                
                <div className="space-y-6 text-[#F5F0E8]/80 font-display font-light text-[1.1rem] md:text-[1.2rem] leading-relaxed">
                  <p>
                    AFRIKHER est un magazine éditorial premium dédié à l’entrepreneuriat féminin africain. 
                    Nous mettons en lumière les femmes qui entreprennent, innovent et transforment l’Afrique d’aujourd’hui et de demain.
                  </p>
                  
                  <p>
                    À travers des portraits inspirants, des récits authentiques et des analyses business, 
                    AFRIKHER célèbre un leadership féminin audacieux, élégant et visionnaire.
                  </p>
                  
                  <p className="gold-text-tagline font-normal">
                    Plus qu’un média, AFRIKHER est une plateforme d’inspiration, de visibilité et d’influence pour celles qui osent bâtir leur propre avenir.
                  </p>
                </div>

                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="mt-12 border border-[#C9A84C] text-[#C9A84C] px-12 py-3 font-body text-[0.7rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Side Drawer (Mega Menu) */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMegaMenuOpen(false)}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 bg-black backdrop-blur-[2px] z-[120]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[38%] bg-[#080808]/97 z-[130] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-12">
                <span className="text-[#9A9A8A] font-body text-[0.65rem] tracking-[0.35em] uppercase">
                  NAVIGATION
                </span>
                <button 
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="group relative w-8 h-8 flex items-center justify-center border border-white/20 rounded-full text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
                >
                  <span className="text-[1.2rem] leading-none mt-[-2px]">×</span>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 flex flex-col justify-center">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  const delays = [0.15, 0.22, 0.29, 0.36, 0.43, 0.50, 0.57, 0.64];
                  
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: delays[idx], 
                        duration: 0.7, 
                        ease: [0.33, 1, 0.68, 1] 
                      }}
                      className="group relative"
                    >
                      {/* Delimiter Line - Refined Gray Style */}
                      <div className="absolute top-0 left-[4.5rem] right-[15%] h-[1px] bg-[#9A9A8A]/30 transition-all duration-500 group-hover:bg-[#9A9A8A]/60 group-hover:right-[10%]" />
                      
                      <Link
                        href={link.href}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="flex items-center px-10 py-5 md:py-6 transition-all duration-500 ease-[0.33,1,0.68,1] group-hover:translate-x-[10px]"
                      >
                        <span className={cn(
                          "font-body text-[0.7rem] tracking-[0.1em] mr-8 transition-colors duration-300",
                          isActive ? "text-[#C9A84C]" : "text-[#9A9A8A] group-hover:text-[#C9A84C]"
                        )}>
                          {link.id}
                        </span>
                        <span className={cn(
                          "font-display font-light text-[1.8rem] md:text-[2.4rem] leading-none transition-colors duration-300",
                          isActive ? "text-[#C9A84C]" : "text-[#F5F0E8] group-hover:text-[#C9A84C]"
                        )}>
                          {link.name}
                        </span>
                        {isActive && (
                          <span className="ml-6 text-[#C9A84C] font-display text-[1.5rem] leading-none">——</span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="relative h-[1px]">
                  <div className="absolute top-0 left-[4.5rem] right-[15%] h-[1px] bg-[#9A9A8A]/30" />
                </div>
              </nav>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="border-t border-white/5 px-10 py-8"
              >
                <p className="font-display italic text-[0.9rem] text-[#9A9A8A]">
                  L'élégance hors du commun.
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-[#0A0A0A] p-12 flex flex-col items-center justify-center space-y-8"
          >
            <button 
              className="absolute top-8 right-8 text-[#F5F0E8]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-display font-light text-[#C9A84C] hover:text-[#F5F0E8] transition-colors uppercase tracking-tight"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
