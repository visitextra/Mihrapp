import React from 'react';
import styles from './MobileAppMockup.module.css';

interface MobileAppMockupProps {
  imageSrc: string;
  altText?: string;
  className?: string;
  glowColor?: string;
}

export const MobileAppMockup: React.FC<MobileAppMockupProps> = ({
  imageSrc,
  altText = 'Mihrapp Ekran Görüntüsü',
  className = '',
  glowColor = 'rgba(212, 175, 55, 0.25)',
}) => {
  return (
    <div 
      className={`${styles.phoneContainer} ${className}`} 
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      <div className={styles.phoneFrame}>
        <div className={styles.notch}>
          <div className={styles.speaker}></div>
          <div className={styles.camera}></div>
        </div>
        <div className={styles.screen}>
          <img src={imageSrc} alt={altText} className={styles.screenImage} key={imageSrc} />
          <div className={styles.screenGlint}></div>
        </div>
        <div className={styles.volumeButtons}></div>
        <div className={styles.powerButton}></div>
        <div className={styles.homeIndicator}></div>
      </div>
    </div>
  );
};