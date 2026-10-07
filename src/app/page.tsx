'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './landing.css';

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-in-hidden');
    hiddenElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top navbar-custom py-3">
        <div className="container">
          <Link href="/" className="qp-logo">
            <span className="qp-logo-icon">QP</span>
            Qr To Print
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><a className="nav-link fw-medium" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link fw-medium" href="#how-it-works">How it Works</a></li>
              <li className="nav-item"><a className="nav-link fw-medium" href="#pricing">Pricing</a></li>
              <li className="nav-item"><a className="nav-link fw-medium" href="#contact">Contact</a></li>
            </ul>
            <div className="d-flex gap-2">
              <Link href="/login" className="btn btn-outline-dark">Login</Link>
              <Link href="/signup" className="btn btn-coral">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h1 className="hero-title">
                Turn Your Print Shop Into a{' '}
                <span className="text-coral">Smart Business</span>
              </h1>
              <p className="hero-sub">
                Allow customers to print documents securely by simply scanning a QR code.
                Automate your workflow with our Windows Print Agent.
              </p>
              <div className="hero-ctas">
                <Link href="/signup" className="btn btn-coral btn-lg">Start 5-Day Free Trial</Link>
                <a href="#how-it-works" className="btn btn-outline-dark btn-lg bg-white">See How It Works</a>
              </div>

              <div className="mockup-container">
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Customer scanning QR code to print document"
                  className="mockup-img"
                />
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-num">500+</div>
                  <div className="stat-label">Active Shops</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">50K+</div>
                  <div className="stat-label">Prints Monthly</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">4.9★</div>
                  <div className="stat-label">Shop Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title fade-in-hidden">How It Works</h2>
          <p className="section-sub fade-in-hidden">Three simple steps to modernize your print workflow</p>

          <div className="row g-4">
            <div className="col-md-4 fade-in-hidden">
              <div className="step-card">
                <div className="step-icon">1</div>
                <h4 className="fw-bold mb-3">Customer Scans QR</h4>
                <p className="text-muted">Place your unique shop QR code on the counter. Customer scans it with their phone camera — no app needed.</p>
              </div>
            </div>
            <div className="col-md-4 fade-in-hidden" style={{ transitionDelay: '0.1s' }}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h4 className="fw-bold mb-3">Uploads Document</h4>
                <p className="text-muted">They select the file (PDF, Word, Images) and choose print settings — Color/B&amp;W, Copies, Paper size.</p>
              </div>
            </div>
            <div className="col-md-4 fade-in-hidden" style={{ transitionDelay: '0.2s' }}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h4 className="fw-bold mb-3">Auto Prints</h4>
                <p className="text-muted">Our Windows Agent catches the file and sends it directly to your printer instantly. No manual work needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding" style={{ background: '#f9fafb' }}>
        <div className="container">
          <h2 className="section-title fade-in-hidden">Everything you need to scale</h2>
          <p className="section-sub fade-in-hidden">Powerful features built for modern print shops</p>

          <div className="row g-4">
            {[
              { icon: '📱', title: 'Mobile Printing', desc: 'Customers print directly from their smartphones. No pendrive, no email, no cables.' },
              { icon: '🖨️', title: 'Windows Agent', desc: 'Install our lightweight agent on your Windows PC for hands-free automatic printing.' },
              { icon: '📊', title: 'Live Dashboard', desc: 'Monitor your print queue, revenue, and active agents in real-time from anywhere.' },
              { icon: '🔒', title: 'Secure Storage', desc: 'Documents are temporarily stored securely and auto-deleted after printing to protect privacy.' },
              { icon: '🎁', title: 'Refer & Earn', desc: 'Invite other shop owners and earn free subscription months or cash rewards.' },
              { icon: '📈', title: 'Analytics', desc: 'Track your daily, weekly, and monthly print volumes to understand your business growth.' },
            ].map((f, i) => (
              <div key={i} className="col-md-4 fade-in-hidden" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h4 className="fw-bold mb-3">{f.title}</h4>
                  <p className="text-muted mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title fade-in-hidden">Simple, transparent pricing</h2>
          <p className="section-sub fade-in-hidden">Choose the plan that works best for your shop</p>

          <div className="row g-4 align-items-center justify-content-center">
            <div className="col-lg-4 col-md-6 fade-in-hidden">
              <div className="pricing-card">
                <h4 className="fw-bold">Demo Plan</h4>
                <div className="price">Free<span>/5 days</span></div>
                <ul className="list-unstyled text-start mb-4">
                  <li className="mb-3">✅ All premium features</li>
                  <li className="mb-3">✅ Windows Print Agent</li>
                  <li className="mb-3">✅ Up to 10 print jobs</li>
                  <li className="mb-3 text-muted">❌ Priority support</li>
                </ul>
                <Link href="/signup" className="btn btn-outline-dark w-100">Try for Free</Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 fade-in-hidden" style={{ transitionDelay: '0.1s' }}>
              <div className="pricing-card highlight">
                <span className="badge rounded-pill mb-3 d-inline-block py-2 px-3" style={{ background: '#f43f64', color: 'white', fontSize: '0.8rem' }}>⭐ Most Popular</span>
                <h4 className="fw-bold">Monthly Pro</h4>
                <div className="price">₹99<span>/mo</span></div>
                <ul className="list-unstyled text-start mb-4">
                  <li className="mb-3">✅ All premium features</li>
                  <li className="mb-3">✅ Windows Print Agent</li>
                  <li className="mb-3">✅ Unlimited prints</li>
                  <li className="mb-3">✅ Priority support</li>
                </ul>
                <Link href="/signup" className="btn btn-coral w-100">Subscribe Now</Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 fade-in-hidden" style={{ transitionDelay: '0.2s' }}>
              <div className="pricing-card">
                <h4 className="fw-bold">Yearly Saver</h4>
                <div className="price">₹599<span>/yr</span></div>
                <ul className="list-unstyled text-start mb-4">
                  <li className="mb-3">✅ All premium features</li>
                  <li className="mb-3">✅ Windows Print Agent</li>
                  <li className="mb-3">✅ Unlimited prints</li>
                  <li className="mb-3">✅ Save 50% vs monthly</li>
                </ul>
                <Link href="/signup" className="btn btn-outline-dark w-100">Get Yearly Plan</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding" style={{ background: '#f9fafb' }}>
        <div className="container">
          <h2 className="section-title fade-in-hidden">Loved by shop owners</h2>
          <div className="row g-4 mt-2">
            {[
              { text: 'This has completely changed how my shop operates. No more pendrives with viruses!', author: 'Rahul M.', role: 'Print Shop Owner, Surat' },
              { text: 'The Windows agent works flawlessly. Customers love how fast it is.', author: 'Priya S.', role: 'Stationery Store, Ahmedabad' },
              { text: 'My revenue increased by 20% because customers don\'t have to wait in line anymore.', author: 'Amit K.', role: 'Cyber Cafe, Vadodara' },
            ].map((t, i) => (
              <div key={i} className="col-md-4 fade-in-hidden" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testimonial-card">
                  <div className="stars">★★★★★</div>
                  <p className="mb-4 text-muted fw-medium">&quot;{t.text}&quot;</p>
                  <h6 className="fw-bold mb-0">{t.author}</h6>
                  <small className="text-muted">{t.role}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-5">
        <div className="container fade-in-hidden">
          <div className="cta-banner">
            <h2 className="fw-bold mb-4">Ready to modernize your print shop?</h2>
            <p className="mb-5 fs-5" style={{ color: '#d1d5db' }}>Join 500+ shop owners saving time and increasing profits.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link href="/signup" className="btn btn-coral btn-lg">Start Your Free Trial</Link>
              <a href="https://wa.me/917069525795" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', color: 'white', borderRadius: 8 }}>
                💬 Chat on WhatsApp
              </a>
            </div>
            <p className="mt-4" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              📞 +91 70695 25795 &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; 5-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-white mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <Link href="/" className="qp-logo mb-3" style={{ display: 'inline-flex' }}>
                <span className="qp-logo-icon">QP</span>
                Qr To Print
              </Link>
              <p className="text-muted mt-2">The smartest way to accept print orders in your shop.</p>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled text-muted">
                <li className="mb-2"><a href="#features">Features</a></li>
                <li className="mb-2"><a href="#pricing">Pricing</a></li>
                <li className="mb-2"><Link href="/setup-guide">Setup Guide</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3">Account</h6>
              <ul className="list-unstyled text-muted">
                <li className="mb-2"><Link href="/login">Login</Link></li>
                <li className="mb-2"><Link href="/signup">Register</Link></li>
                <li className="mb-2"><Link href="/admin/login">Admin</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">Contact</h6>
              <p className="text-muted mb-1">📞 +91 70695 25795</p>
              <a href="https://wa.me/917069525795" target="_blank" rel="noopener noreferrer" className="btn btn-sm mt-2" style={{ background: '#25d366', color: 'white', borderRadius: 6 }}>
                WhatsApp Support
              </a>
            </div>
          </div>
          <div className="border-top pt-4 mt-4 text-center text-muted">
            <p className="mb-0">© {new Date().getFullYear()} Qr To Print. All rights reserved. Made in India 🇮🇳</p>
          </div>
        </div>
      </footer>

      {/* Bootstrap JS for navbar toggle */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async></script>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/917069525795" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </>
  );
}
