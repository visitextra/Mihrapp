import React from 'react';
import { useLocation } from 'react-router-dom';
import { PrayerTimesHeader } from './PrayerTimesHeader';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './SharedLayout.module.css';

export const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={styles.layout}>
      <div className={styles.headerWrapper}>
        <PrayerTimesHeader />
        <Header />
      </div>
      <main className={`${styles.main} ${isHome ? '' : styles.withPadding}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};