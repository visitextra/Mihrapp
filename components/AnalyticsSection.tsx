import React from 'react';
import { BarChart3, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { MobileAppMockup } from './MobileAppMockup';
import styles from './AnalyticsSection.module.css';

export const AnalyticsSection = () => {
  return (
    <section id="analytics" className={styles.analytics}>
      <div className={styles.container}>
        <div className={styles.contentGrid}>
          
          {/* Left Column: Visual Mockup Showcase */}
          <div className={styles.mockupShowcase}>
            <div className={styles.mockupLeft}>
              <MobileAppMockup
                imageSrc="/screenshots/raporlar-namaz.jpeg"
                altText="Namaz İbadet Raporları"
                glowColor="rgba(212, 175, 55, 0.2)"
              />
              <span className={styles.mockupLabel}>Namaz Raporları</span>
            </div>
            
            <div className={styles.mockupRight}>
              <MobileAppMockup
                imageSrc="/screenshots/raporlar-sunnet.jpeg"
                altText="Sünnet Takip Raporları"
                glowColor="rgba(50, 160, 90, 0.2)"
              />
              <span className={styles.mockupLabel}>Sünnet Analizleri</span>
            </div>
          </div>

          {/* Right Column: Descriptions & Stats Widgets */}
          <div className={styles.textDetails}>
            <div className={styles.sectionHeader}>
              <span className={styles.tag}>GRAFİK VE RAPORLAR</span>
              <h2 className={styles.title}>Manevi Rutininizi Görselleştirin</h2>
              <p className={styles.description}>
                İbadetlerinizi sadece takip etmekle kalmayın, geriye dönük grafiksel raporlarla manevi istikrarınızı analiz edin. Haftalık, aylık ve yıllık ilerleme tablolarıyla hedeflerinize sadık kalın.
              </p>
            </div>

            {/* Stats Cards / Widgets */}
            <div className={styles.widgetsGrid}>
              <div className={styles.statWidget}>
                <div className={styles.widgetHeader}>
                  <div className={`${styles.iconBg} ${styles.goldBg}`}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className={styles.widgetTitle}>İbadet Raporu</h3>
                    <p className={styles.widgetSub}>Namaz İyileşme Analizi</p>
                  </div>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>Cemaatle Namaz Oranı</span>
                    <span className={styles.progressPercent}>%88</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBar} style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              <div className={styles.statWidget}>
                <div className={styles.widgetHeader}>
                  <div className={`${styles.iconBg} ${styles.greenBg}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className={styles.widgetTitle}>Sünnet Takibi</h3>
                    <p className={styles.widgetSub}>Haftalık Ritüeller</p>
                  </div>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>Sünnet Tamamlama</span>
                    <span className={styles.progressPercent}>18 / 20</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={`${styles.progressBar} ${styles.greenBar}`} style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>

              <div className={styles.statWidget}>
                <div className={styles.widgetHeader}>
                  <div className={`${styles.iconBg} ${styles.blueBg}`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className={styles.widgetTitle}>Haftalık Çizelge</h3>
                    <p className={styles.widgetSub}>İstikrarlı Gün Sayısı</p>
                  </div>
                </div>
                <div className={styles.daysStreak}>
                  {[ 'P', 'P', 'S', 'Ç', 'P', 'C', 'C' ].map((day, idx) => (
                    <div key={idx} className={`${styles.dayCircle} ${idx < 6 ? styles.dayActive : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.statWidget}>
                <div className={styles.widgetHeader}>
                  <div className={`${styles.iconBg} ${styles.purpleBg}`}>
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className={styles.widgetTitle}>Disiplin Skoru</h3>
                    <p className={styles.widgetSub}>Manevi Kararlılık Derecesi</p>
                  </div>
                </div>
                <div className={styles.scoreText}>
                  <strong>9.4</strong><span> / 10</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
