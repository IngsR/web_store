'use client';

import { ArrowUp, ExternalLink, FileText } from 'lucide-react';
import React, { useState } from 'react';
import portfolioData from '../../data/portfolio.json';
import { PageId } from '../../types';
import { useRouter } from 'next/navigation';

const { userProfile } = portfolioData;

interface FooterProps {
  setActivePage?: (page: PageId) => void;
  onOpenCV?: () => void;
}

export function Footer({ setActivePage, onOpenCV }: FooterProps) {
  const router = useRouter();
  const [logoError, setLogoError] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavigation = (page: PageId) => {
    if (setActivePage) {
      setActivePage(page);
    } else {
      if (page === 'home') {
        router.push('/');
      } else if (page === 'portfolio') {
        router.push('/products');
      } else if (page === 'contact') {
        if (typeof window !== 'undefined') {
          window.open(userProfile.whatsappUrl, '_blank');
        }
      } else {
        router.push('/');
      }
    }
    scrollToTop();
  };

  const handleOpenCV = () => {
    if (onOpenCV) {
      onOpenCV();
    } else {
      if (typeof window !== 'undefined') {
        window.open('https://ikhwann.my.id', '_blank');
      }
    }
  };

  const navigationItems: [PageId, string][] = [
    ['home', 'Beranda'],
    ['portfolio', 'Portofolio Proyek'],
    ['about', 'Tentang Saya'],
    ['contact', 'Kontak & Pesan'],
  ];

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-800 transition-colors duration-200 sm:mt-14 dark:border-white/10 dark:bg-[#0c0c0d] dark:text-slate-200">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10 xl:px-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8 xl:gap-x-16">
          {/* Brand */}
          <div className="space-y-3.5 sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/uploads/products/logo.jpg"
                  alt="Logo Ing Store"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  onError={() => setLogoError(true)}
                  className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm sm:h-11 sm:w-11 bg-black"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm sm:h-11 sm:w-11">
                  IR
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-bold leading-tight text-slate-950 dark:text-white sm:text-base">
                  {userProfile.name}
                </h3>

                <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {userProfile.title}
                </p>
              </div>
            </div>

            <p className="max-w-[620px] text-[13px] leading-5.5 text-slate-700 dark:text-slate-300 sm:text-sm sm:leading-6">
              {userProfile.tagline}
            </p>

            {/* Social */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {userProfile.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  <span>{social.name}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3 sm:col-span-1 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-950 dark:text-white">
              Menu Navigasi
            </h4>

            {/* Navigation Pills */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-1">
              {navigationItems.map(([page, label]) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handleNavigation(page)}
                  className="group flex min-h-[36px] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[12px] font-medium leading-tight text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white lg:justify-start lg:px-3.5"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:col-span-1 lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-950 dark:text-white">
              Kontak Cepat
            </h4>

            <div className="space-y-2.5">
              {/* Email */}
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                  Email
                </p>

                <a
                  href={`mailto:${userProfile.email}`}
                  className="block break-all text-[13px] font-semibold text-slate-900 transition-colors hover:text-slate-600 hover:underline dark:text-white dark:hover:text-slate-300"
                >
                  {userProfile.email}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                  WhatsApp
                </p>

                <a
                  href={userProfile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-[13px] font-semibold text-emerald-700 transition-colors hover:underline dark:text-emerald-400"
                >
                  {userProfile.phone}
                </a>
              </div>

              {/* CV */}
              <button
                type="button"
                onClick={handleOpenCV}
                className="mt-1 inline-flex min-h-[36px] w-fit items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.08]"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Curriculum Vitae</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-[11px] leading-5 text-slate-600 dark:text-slate-400 sm:text-[12px]">
            © {new Date().getFullYear()} {userProfile.name}. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex w-fit items-center gap-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
