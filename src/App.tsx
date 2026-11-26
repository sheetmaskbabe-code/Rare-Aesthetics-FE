import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ContentProvider } from '@/context/ContentContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Services } from '@/pages/Services';
import { ServiceDetail } from '@/pages/ServiceDetail';
import { Process } from '@/pages/Process';
import { Portfolio } from '@/pages/Portfolio';
import { PortfolioDetail } from '@/pages/PortfolioDetail';
import { WhyChooseUs } from '@/pages/WhyChooseUs';
import { Articles } from '@/pages/Articles';
import { OkoaArticles } from '@/pages/OkoaArticles';
import { OkoaReddit } from '@/pages/OkoaReddit';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Faqs } from '@/pages/Faqs';
import { Contact } from '@/pages/Contact';
import { BookConsultation } from '@/pages/BookConsultation';
import { Payment } from '@/pages/Payment';
import { Admin } from '@/pages/Admin';
import { PrivacyTerms } from '@/pages/PrivacyTerms';
import { Products } from '@/pages/Products';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/process" element={<Process />} />
          <Route path="/products" element={<Products />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/products" element={<Products />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/okoaskin" element={<OkoaArticles />} />
          <Route path="/articles/okoaskin-reddit" element={<OkoaReddit />} />
          <Route path="/articles/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/faq" element={<Faqs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookConsultation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/privacy" element={<PrivacyTerms type="privacy" />} />
          <Route path="/terms" element={<PrivacyTerms type="terms" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Dedicated standalone Admin page: NO public Navbar, NO public Footer
  if (isAdmin) {
    return <Admin />;
  }

  // Public website layout
  return (
    <div className="flex min-h-screen flex-col bg-lavender text-dark-plum">
      <Navbar />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ContentProvider>
        <Router>
          <ScrollToTop />
          <MainLayout />
        </Router>
      </ContentProvider>
    </HelmetProvider>
  );
}
