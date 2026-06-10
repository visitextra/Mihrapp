import React from 'react';
import styles from './MihrabDoor.module.css';

export const MihrabDoor = () => {
  return (
    <div className={styles.doorContainer}>
      <div className={styles.door}>
        <svg
          viewBox="0 0 240 240"
          className={styles.doorSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9f5e8" />
              <stop offset="30%" stopColor="#e5c158" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
          {/* Exact logo icon geometry: square outer frame with inner pointed arch cutout, scaled inwards for spacing */}
          <path
            d="M 30 210 L 30 30 L 210 30 L 210 210 L 175 210 L 175 120 Q 175 80, 120 55 Q 65 80, 65 120 L 65 210 Z"
            className={styles.doorOutline}
            fill="url(#logoGoldGradient)"
            stroke="url(#logoGoldGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};