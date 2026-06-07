import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import styles from './PrivacyPolicyDialog.module.css';

export const PrivacyPolicyDialog = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(() => searchParams.get('gizlilik') === 'true');

  useEffect(() => {
    if (searchParams.get('gizlilik') === 'true') {
      setOpen(true);
    }
  }, [searchParams]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && searchParams.get('gizlilik') === 'true') {
      searchParams.delete('gizlilik');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.title}>Gizlilik Politikası</DialogTitle>
          <p className={styles.lastUpdated}>Son Güncelleme: 24 Ağustos 2024</p>
        </DialogHeader>
        <div className={styles.body}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Giriş</h2>
            <p>
              Mihrapp ("biz", "bize" veya "bizim") olarak, gizliliğinize değer veriyoruz. Bu Gizlilik Politikası, mobil uygulamamız ve ilgili hizmetlerimiz aracılığıyla topladığımız, kullandığımız, ifşa ettiğimiz ve koruduğumuz bilgileri anlamanıza yardımcı olmak için hazırlanmıştır. Hizmetimizi kullanarak, bu politikada açıklanan veri uygulamalarını kabul etmiş olursunuz.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Topladığımız Bilgiler</h2>
            <p>Hizmetlerimizi sunmak ve geliştirmek için çeşitli türde bilgiler toplayabiliriz:</p>
            <ul>
              <li><strong>Kişisel Bilgiler:</strong> Kayıt sırasında sağladığınız ad, e-posta adresi gibi bilgiler.</li>
              <li><strong>Kullanım Verileri:</strong> Uygulama içi etkileşimleriniz, ibadet takibi verileriniz, belirlediğiniz hedefler ve kazandığınız rozetler gibi bilgiler.</li>
              <li><strong>Cihaz Bilgileri:</strong> Mobil cihazınızın türü, işletim sistemi, benzersiz cihaz kimlikleri ve konum verileri (izninizle) gibi teknik bilgiler.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Bilgilerinizi Nasıl Kullanıyoruz?</h2>
            <p>Topladığımız bilgileri aşağıdaki amaçlar için kullanırız:</p>
            <ul>
              <li>Hizmetlerimizi sağlamak, sürdürmek ve kişiselleştirmek.</li>
              <li>Manevi yolculuğunuzu desteklemek için size özel içerikler ve hatırlatıcılar sunmak.</li>
              <li>Uygulama performansını analiz etmek ve yeni özellikler geliştirmek.</li>
              <li>Sizinle iletişim kurmak, destek sağlamak ve güncellemeler hakkında sizi bilgilendirmek.</li>
              <li>Yasal yükümlülüklere uymak ve dolandırıcılığı önlemek.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Çerezler ve Takip Teknolojileri</h2>
            <p>
              Uygulama deneyiminizi geliştirmek için çerez benzeri teknolojiler kullanabiliriz. Cihaz ayarlarınızdan bu teknolojileri kontrol edebilirsiniz, ancak bu durum bazı özelliklerin düzgün çalışmasını engelleyebilir.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Üçüncü Taraf Hizmetleri</h2>
            <p>
              Hizmetlerimizi analiz etmek ve geliştirmek için üçüncü taraf hizmet sağlayıcılarından yararlanabiliriz. Kişisel bilgilerinizi izniniz olmadan pazarlama amacıyla üçüncü taraflarla paylaşmayız.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Kullanıcı Hakları</h2>
            <p>
              Verileriniz üzerinde belirli haklara sahipsiniz: bilgilerinize erişme, onları düzeltme, silme veya işlenmesini kısıtlama talebinde bulunma. Bu haklarınızı kullanmak için aşağıdaki iletişim bilgileri üzerinden bizimle iletişime geçin.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Gizlilik Politikası Değişiklikleri</h2>
            <p>
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacak ve "Son Güncelleme" tarihi revize edilecektir.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. İletişim</h2>
            <p>
              Sorularınız için bizimle iletişime geçin:
              <br />
              E-posta: <a href="mailto:bilgi@mihrapp.com.tr" className={styles.contactLink}>bilgi@mihrapp.com.tr</a>
              <br />
              Telefon: <a href="tel:+905541312451" className={styles.contactLink}>+90 554 131 24 51</a>
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
