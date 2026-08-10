import React from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { MobileAppMockup } from './MobileAppMockup';
import { AppleIcon, GooglePlayIcon } from './StoreIcons';
import styles from './HeroSection.module.css';

export const APP_STORE_URL = 'https://apps.apple.com/tr/app/mihrapp/id6779521636?l=tr';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mihrapapp.app';

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
          <div className={styles.statusPill}>
            <span className={styles.statusDot}></span> Yayında
          </div>
          <div className={styles.appButtons}>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroStoreCard}
              aria-label="App Store'dan Hemen İndirin"
            >
              <AppleIcon size={30} className={styles.heroStoreIcon} />
              <div className={styles.heroStoreText}>
                <span className={styles.heroStoreSub}>App Store'dan</span>
                <span className={styles.heroStoreMain}>Hemen İndirin</span>
              </div>
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroStoreCard}
              aria-label="Google Play'den Hemen İndirin"
            >
              <GooglePlayIcon size={26} className={styles.heroStoreIcon} />
              <div className={styles.heroStoreText}>
                <span className={styles.heroStoreSub}>Google Play'den</span>
                <span className={styles.heroStoreMain}>Hemen İndirin</span>
              </div>
            </a>
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