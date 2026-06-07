import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Form, FormControl, FormItem, FormLabel, FormMessage, useForm } from './Form';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import { z } from 'zod';
import styles from './ContactSection.module.css';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Ad en az 2 karakter olmalıdır' }),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  subject: z.string().min(3, { message: 'Konu en az 3 karakter olmalıdır' }),
  message: z.string().min(10, { message: 'Mesaj en az 10 karakter olmalıdır' }),
});

export const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    schema: contactFormSchema,
  });

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    console.log('Form submitted:', values);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      form.setValues({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.title}>Bize Ulaşın</h2>
        <p className={styles.description}>
          Sorularınız, önerileriniz veya iş birliği talepleriniz için formu doldurun.
        </p>
        <p className={styles.privacyNote}>
          Formu göndererek{' '}
          <PrivacyPolicyDialog
            trigger={
              <button type="button" className={styles.privacyLink}>Gizlilik Politikası</button>
            }
          />
          {`'nı kabul etmiş olursunuz.`}
        </p>
        <div className={styles.formWrapper}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              <FormItem name="name">
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Adınızı giriniz"
                    value={form.values.name}
                    onChange={(e) =>
                      form.setValues((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="email">
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="E-posta adresinizi giriniz"
                    value={form.values.email}
                    onChange={(e) =>
                      form.setValues((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="subject">
                <FormLabel>Konu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Konu giriniz"
                    value={form.values.subject}
                    onChange={(e) =>
                      form.setValues((prev) => ({ ...prev, subject: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="message">
                <FormLabel>Mesaj</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mesajınızı yazınız"
                    rows={6}
                    value={form.values.message}
                    onChange={(e) =>
                      form.setValues((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <Button 
                type="submit" 
                size="lg" 
                className={styles.submitButton}
                disabled={isSubmitted}
              >
                {isSubmitted ? 'Gönderildi ✓' : 'Gönder'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};