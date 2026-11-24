import { FormEvent, useState } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/data/site';
import { pageSeo } from '@/data/seo';

export function Payment() {
  const hasProvider = Boolean(siteConfig.paymentProviderUrl);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      setMessage('Please complete customer details and amount.');
      return;
    }
    if (hasProvider) {
      window.location.href = siteConfig.paymentProviderUrl;
      return;
    }
    setMessage(
      'Payment provider not configured. No test credentials are used. Connect the approved provider URL in siteConfig before accepting payments.'
    );
  };

  return (
    <>
      <Seo
        title={pageSeo.payment.title}
        description={pageSeo.payment.description}
        keywords={pageSeo.payment.keywords}
        noindex
      />
      <PageHero
        eyebrow="Make a Payment"
        title="Secure checkout"
        description="Pay for approved invoices or consultation fees through the business-selected payment provider."
      />

      <Section>
        <Reveal>
          <form
            onSubmit={onSubmit}
            className="mx-auto max-w-xl space-y-5 border border-plum/10 bg-white/50 p-6 md:p-8"
          >
            <label className="block text-sm">
              <span>Payment description</span>
              <input
                className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Invoice reference or service"
              />
            </label>
            <label className="block text-sm">
              <span>Amount (ZAR)</span>
              <input
                type="number"
                min="1"
                step="0.01"
                className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span>Full name</span>
              <input
                className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span>Email</span>
              <input
                type="email"
                className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <Button type="submit" className="w-full">
              Continue to Paystack Checkout
            </Button>

            <div className="text-center pt-2">
              <a
                href={siteConfig.paymentProviderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-plum font-semibold hover:underline inline-flex items-center gap-1"
              >
                Or pay directly on Paystack &rarr;
              </a>
            </div>

            {message && <p className="text-sm text-deep-blue">{message}</p>}

            {!hasProvider && (
              <p className="text-xs text-dark-plum/55">
                Placeholder page — configure <code>paymentProviderUrl</code> with the approved
                provider (e.g. PayFast, Yoco, Stripe) before production use. Never embed test
                credentials in production.
              </p>
            )}
          </form>
        </Reveal>
      </Section>
    </>
  );
}
