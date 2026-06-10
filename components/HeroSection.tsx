import React from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { MobileAppMockup } from './MobileAppMockup';
import styles from './HeroSection.module.css';

// Simple inline SVG components for store icons
const AppleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7l9 5.25L21 7" />
    <path d="M3 17l9-5.25L21 17" />
    <path d="M21 7v10" />
    <path d="M3 7v10" />
    <path d="M12 12.25v10.5" />
  </svg>
);

export const HeroSection = () => {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.mihrabArch}></div>
      <div className={styles.content}>
        <h1 className={styles.headline}>Maneviyat Teknoloji ile Buluşuyor</h1>
        <p className={styles.subheadline}>
          Mihrapp ile ibadetlerinizi takip edin, manevi hedefler belirleyin ve
          yolculuğunuza modern destekle devam edin.
        </p>
        <div className={styles.ctaContainer}>
          <Button size="lg" className={styles.ctaPrimary} disabled>
            Çok Yakında
          </Button>
          <div className={styles.appButtons}>
            <Button variant="outline" size="lg" className={styles.ctaSecondary} disabled>
              <AppleIcon /> App Store
              <Badge variant="secondary" className={styles.comingSoonBadge}>Yakında</Badge>
            </Button>
            <Button variant="outline" size="lg" className={styles.ctaSecondary} disabled>
              <GooglePlayIcon /> Google Play
              <Badge variant="secondary" className={styles.comingSoonBadge}>Yakında</Badge>
            </Button>
          </div>
        </div>
        <div className={styles.mockupsContainer}>
          <div className={styles.mockup}>
            <MobileAppMockup
              imageSrc="/screenshots/kuran-i-kerim.jpeg"
              altText="Mihrapp Kur'an-ı Kerim Ekranı"
              glowColor="rgba(212, 175, 55, 0.15)"
            />
          </div>
          <div className={`${styles.mockup} ${styles.mockupCenter}`}>
            <MobileAppMockup
              imageSrc="/screenshots/anasayfa.jpeg"
              altText="Mihrapp Anasayfa Ekranı"
              glowColor="rgba(212, 175, 55, 0.4)"
            />
          </div>
          <div className={styles.mockup}>
            <MobileAppMockup
              imageSrc="/screenshots/namaz-vakitleri.jpeg"
              altText="Mihrapp Namaz Vakitleri Ekranı"
              glowColor="rgba(212, 175, 55, 0.15)"
            />
          </div>
        </div>
      </div>
    </section>
  );
};