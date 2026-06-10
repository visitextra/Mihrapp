import React, { useState } from 'react';
import { BookOpen, Clock, Compass, Activity, ShieldCheck, Heart, Sparkles, BookMarked } from 'lucide-react';
import { MobileAppMockup } from './MobileAppMockup';
import styles from './FeaturesSection.module.css';

const features = [
  {
    id: 'anasayfa',
    icon: <Sparkles />,
    title: 'Manevi Arayüz',
    shortDesc: 'Günlük Ayet, Hadis ve Durum Özeti',
    description: 'Uygulama açılışında sizi karşılayan, o güne özel seçilmiş ayet-i kerime, hadis-i şerif ve dualar ile manevi güne huzurlu bir başlangıç yapın. Günlük ibadet hedeflerinize hızlıca göz atın.',
    image: '/screenshots/anasayfa.jpeg',
    glowColor: 'rgba(212, 175, 55, 0.3)'
  },
  {
    id: 'namaz',
    icon: <Clock />,
    title: 'Namaz Vakitleri',
    shortDesc: 'Canlı Geri Sayım ve Bildirimler',
    description: 'Bulunduğunuz konuma göre Diyanet İşleri Başkanlığı ile tamamen uyumlu namaz vakitlerini görün. Bir sonraki vakte kalan süreyi saniye saniye takip edin ve ezan bildirimleri alın.',
    image: '/screenshots/namaz-vakitleri.jpeg',
    glowColor: 'rgba(160, 50, 50, 0.25)'
  },
  {
    id: 'kuran',
    icon: <BookOpen />,
    title: 'Kur\'an-ı Kerim',
    shortDesc: 'Arapça Hat, Meal ve Sesli Kıraat',
    description: 'Yüksek çözünürlüklü Arapça hat sanatı ile Kur\'an okuyun, Türkçe mealleri karşılaştırın. Mishary Rashid Alafasy gibi ünlü hafızların sesli kıraatlerini dinleyin ve kaldığınız yeri işaretleyin.',
    image: '/screenshots/kuran-i-kerim.jpeg',
    glowColor: 'rgba(50, 160, 90, 0.25)'
  },
  {
    id: 'zikir',
    icon: <Activity />,
    title: 'Zikirmatik',
    shortDesc: 'Dokunsal Geri Bildirimli Tesbih',
    description: 'Ekrana bakmadan zikredebilmeniz için titreşimli ve sesli geri bildirim sağlayan akıllı zikirmatik. Günlük zikir hedeflerinizi belirleyin ve ilerlemenizi kayıt altında tutun.',
    image: '/screenshots/zikir.jpeg',
    glowColor: 'rgba(212, 175, 55, 0.25)'
  },
  {
    id: 'kible',
    icon: <Compass />,
    title: 'Kıble Pusulası',
    shortDesc: 'Hassas Yön Belirleme',
    description: 'Cihazınızın pusula ve ivmeölçer sensörlerini kullanarak, dünyanın neresinde olursanız olun kıble açınızı en doğru ve en hızlı şekilde belirleyin.',
    image: '/screenshots/kible-yonu.jpeg',
    glowColor: 'rgba(204, 150, 50, 0.25)'
  },
  {
    id: 'esmaul',
    icon: <Heart />,
    title: 'Esmaü\'l-Hüsna',
    shortDesc: '99 İsmin Anlamları ve Sırları',
    description: 'Allah Teala\'nın 99 esmasının Arapça yazılışlarını, Türkçe anlamlarını, zikir sayılarını (ebced değerlerini) ve bu isimleri zikretmenin faziletlerini keşfedin.',
    image: '/screenshots/esmaul-husna.jpeg',
    glowColor: 'rgba(212, 175, 55, 0.25)'
  },
  {
    id: 'dua',
    icon: <ShieldCheck />,
    title: 'Dua Arşivi',
    shortDesc: 'Tematik ve Koruyucu Dualar',
    description: 'Kur\'an-ı Kerim\'den dualar, Peygamber Efendimiz\'in (s.a.v.) dilinden sığınma duaları, şifa duaları ve günlük hayatta okunacak tematik dualardan oluşan zengin arşiv.',
    image: '/screenshots/dua-arsivi.jpeg',
    glowColor: 'rgba(70, 130, 180, 0.25)'
  },
  {
    id: 'kutuphane',
    icon: <BookMarked />,
    title: 'İslami Kütüphane',
    shortDesc: 'Temel Eserler ve İlmihal',
    description: 'İnanç, ibadet ve ahlak konularında temel ilmihal bilgileri, manevi gelişim kitapları ve rehber dökümanları barındıran cebinizdeki kütüphane.',
    image: '/screenshots/kutuphane.jpeg',
    glowColor: 'rgba(212, 175, 55, 0.25)'
  }
];

export const FeaturesSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeFeature = features[activeIdx];

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Uygulama İçi Özellikler</h2>
          <p className={styles.subtitle}>
            Manevi yaşantınızı kolaylaştırmak ve zenginleştirmek için özenle tasarlanmış premium araçlar.
          </p>
        </div>

        <div className={styles.showcaseGrid}>
          {/* Left Column: Interactive Feature List */}
          <div className={styles.featureSelector}>
            {features.map((feature, index) => {
              const isActive = index === activeIdx;
              return (
                <button
                  key={feature.id}
                  className={`${styles.featureItem} ${isActive ? styles.activeItem : ''}`}
                  onClick={() => setActiveIdx(index)}
                  onMouseEnter={() => setActiveIdx(index)}
                >
                  <div className={styles.iconBox}>{feature.icon}</div>
                  <div className={styles.itemMeta}>
                    <h3 className={styles.itemTitle}>{feature.title}</h3>
                    <p className={styles.itemSub}>{feature.shortDesc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Mobile App Preview Card */}
          <div className={styles.previewPanel}>
            <div className={styles.mockupWrapper}>
              <MobileAppMockup
                imageSrc={activeFeature.image}
                altText={activeFeature.title}
                glowColor={activeFeature.glowColor}
              />
            </div>
            
            <div className={styles.featureDetails} key={activeFeature.id}>
              <h3 className={styles.detailTitle}>{activeFeature.title}</h3>
              <p className={styles.detailText}>{activeFeature.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};