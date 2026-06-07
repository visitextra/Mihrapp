import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'Hikayemiz' },
    { href: '#features', label: 'Neler Sunuyoruz' },
    { href: '#partnership', label: 'İş Ortaklığı' },
    { href: '#contact', label: 'İletişim' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link to="/#hero" className={styles.logoLink} onClick={closeMenu}>
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
          <PrivacyPolicyDialog
            trigger={
              <button type="button" className={styles.navLink} onClick={closeMenu}>
                Gizlilik Politikası
              </button>
            }
          />
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