import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './_index.module.css';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { PartnershipSection } from '../components/PartnershipSection';
import { ContactSection } from '../components/ContactSection';

const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>Mihrapp | Maneviyat Teknoloji ile Buluşuyor</title>
        <meta
          name="description"
          content="Mihrapp ile ibadetlerinizi takip edin, manevi hedefler belirleyin ve yolculuğunuza modern destekle devam edin."
        />
        <meta
          name="keywords"
          content="Mihrapp, maneviyat, teknoloji, ibadet takibi, spiritual app, islamic app, modern, minimal"
        />
        <html lang="tr" />
        <body className="dark" />
      </Helmet>
      <div className={styles.pageContainer}>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <AnalyticsSection />
        <PartnershipSection />
        <ContactSection />
      </div>
    </>
  );
};

export default IndexPage;