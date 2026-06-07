import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import styles from './SharedLayout.module.css';

export const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      <PrivacyPolicyDialog />
    </div>
  );
};