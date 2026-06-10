import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { Logo } from './Logo';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'Hikayemiz' },
    { href: '#features', label: 'Uygulama Özellikleri' },
    { href: '#partnership', label: 'İş Ortaklığı' },
    { href: '#contact', label: 'İletişim' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logoLink}
          onClick={(e) => {
            closeMenu();
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Logo />
        </Link>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={`/${link.href}`}
              className={styles.navLink}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/kuran"
            className={styles.quranNavLinkBtn}
            onClick={closeMenu}
          >
            <BookOpen size={16} />
            <span>Kur'an-ı Kerim</span>
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
  );
};