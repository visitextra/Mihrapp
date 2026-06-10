import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/Accordion';
import styles from './faq.module.css';

const FAQPage = () => {
  const whatsappUrl = 'https://wa.me/905541312451?text=Merhaba%2C%20Mihrapp%20uygulamas%C4%B1%20hakk%C4%B1nda%20destek%20almak%20istiyorum.';

  const faqs = [
    {
      id: 'item-1',
      question: 'Mihrapp nedir ve neler sunar?',
      answer: 'Mihrapp, kutsal gelenekleri modern tasarımla birleştirerek ibadetlerinizi takip etmenize, manevi hedefler belirlemenize yardımcı olan modern bir maneviyat asistanıdır. Namaz vakitleri takibi, Kur\'an-ı Kerim okuma ve dinleme, ibadet raporları gibi zengin özellikler sunar.',
    },
    {
      id: 'item-2',
      question: 'Ezan vakitleri hangi kaynaktan alınmaktadır?',
      answer: 'Ezan vakitleri resmi Diyanet İşleri Başkanlığı verilerinden çekilmektedir. Cihazınızın konum servisi üzerinden en doğru il ve ilçe vakitleri otomatik olarak hesaplanır ve listelenir.',
    },
    {
      id: 'item-3',
      question: 'Namaz vakitleri için konumumu nasıl değiştirebilirim?',
      answer: 'Üst barda yer alan konum alanına tıklayarak şehir ve ilçe seçiminizi manuel olarak güncelleyebilirsiniz. Ayrıca "Konumumu Bul" butonunu kullanarak GPS üzerinden otomatik eşleştirme sağlayabilirsiniz.',
    },
    {
      id: 'item-4',
      question: 'Kur\'an-ı Kerim dinleme özelliği nasıl çalışır?',
      answer: 'Kur\'an-ı Kerim sayfamızda yer alan sure listesinden istediğiniz sureyi seçerek orijinal Arapça metni ve Türkçe meali ile birlikte okuyabilir, üst kısımdaki ses çalar butonu ile Mishary Rashid Alafasy kıraatiyle sesli olarak dinleyebilirsiniz.',
    },
    {
      id: 'item-5',
      question: 'Verilerimin gizliliği nasıl sağlanıyor?',
      answer: 'Mihrapp, gizliliğinize en üst düzeyde önem verir. Uygulama içerisindeki ibadet takipleriniz, raporlarınız ve kişisel verileriniz cihazınızda güvenle saklanır. Herhangi bir üçüncü taraf sunucuya veya şahsa verileriniz aktarılmaz.',
    },
    {
      id: 'item-6',
      question: 'Mihrapp uygulamasını mobil cihazıma nasıl indirebilirim?',
      answer: 'Mihrapp şu anda web platformunda aktiftir. Mobil uygulamalarımız (App Store ve Google Play) çok yakında indirilmeye sunulacaktır. Gelişmelerden haberdar olmak için bültenimize abone olabilirsiniz.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Destek & SSS | Mihrapp</title>
        <meta
          name="description"
          content="Mihrapp hakkında sıkça sorulan sorulara ulaşın, özellikler hakkında bilgi edinin ve doğrudan WhatsApp üzerinden destek ekibimizle iletişime geçin."
        />
        <body className="dark" />
      </Helmet>
      
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Destek & SSS</h1>
          <p className={styles.subtitle}>
            Mihrapp hakkında merak ettiğiniz soruların yanıtlarını bulun veya doğrudan destek ekibimizle iletişime geçin.
          </p>
        </header>

        <div className={styles.layoutGrid}>
          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Uygulama Hakkında (SSS)</h2>
            <Accordion type="single" collapsible className={styles.accordion}>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className={styles.accordionItem}>
                  <AccordionTrigger className={styles.accordionTrigger}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className={styles.accordionContent}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Contact / Support Section */}
          <section className={styles.contactSection}>
            <div className={styles.supportCard}>
              <h2 className={styles.supportTitle}>İletişime Geçin</h2>
              <p className={styles.supportText}>
                Sorunuza yanıt bulamadınız mı? Destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır. WhatsApp üzerinden anında bizimle sohbet edebilirsiniz.
              </p>

              <div className={styles.actionButtons}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  <MessageSquare size={20} />
                  <span>WhatsApp ile Destek Al</span>
                </a>

                <a
                  href="mailto:bilgi@mihrapp.com.tr"
                  className={styles.emailButton}
                >
                  <Mail size={20} />
                  <span>E-posta Gönder</span>
                </a>
              </div>

              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <Phone size={14} className={styles.goldIcon} />
                  <span>+90 554 131 24 51</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={14} className={styles.goldIcon} />
                  <span>bilgi@mihrapp.com.tr</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
