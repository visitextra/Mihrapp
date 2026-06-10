import React from 'react';
import { PrayerTimesHeader } from '../components/PrayerTimesHeader';
import { Header } from '../components/Header';
import styles from '../components/SharedLayout.module.css';

const KuranLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout} style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <PrayerTimesHeader />
        <Header />
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>
  );
};

export default [KuranLayout];
