'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

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
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --qp-coral: #f43f64;
          --qp-blue: #1d4ed8;
        }
        body {
          font-family: 'Inter', sans-serif;
          scroll-behavior: smooth;
        }
        .text-coral { color: var(--qp-coral); }
        .bg-coral { background-color: var(--qp-coral); color: white; }
        .btn-coral { background-color: var(--qp-coral); color: white; border-radius: 8px; padding: 10px 24px; font-weight: 600; transition: all 0.2s; }
        .btn-coral:hover { background-color: #e11d48; color: white; transform: translateY(-2px); }
        .btn-outline-dark { border-radius: 8px; padding: 10px 24px; font-weight: 600; }
        
        .navbar-custom { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #eee; }
        .qp-logo { display: flex; align-items: center; font-weight: 800; font-size: 1.5rem; color: #111; text-decoration: none; }
        .qp-logo-icon { background: var(--qp-coral); color: white; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; margin-right: 8px; font-size: 1.2rem; }
        
        .hero-section { background: linear-gradient(180deg, #ffffff 0%, #fff5f7 100%); padding: 120px 0 80px; text-align: center; overflow: hidden; }
        .hero-title { font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 24px; animation: slideUp 0.8s ease-out forwards; }
        .hero-sub { font-size: 1.25rem; color: #4b5563; max-width: 600px; margin: 0 auto 40px; animation: slideUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .hero-ctas { animation: slideUp 0.8s ease-out 0.4s forwards; opacity: 0; display: flex; gap: 16px; justify-content: center; margin-bottom: 64px; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mockup-container { position: relative; max-width: 300px; margin: 0 auto; animation: slideUp 1s ease-out 0.6s forwards; opacity: 0; }
        .mockup-img { width: 100%; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 8px solid #111; }
        
        .stats-row { display: flex; justify-content: center; gap: 48px; margin-top: 60px; flex-wrap: wrap; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 2.5rem; font-weight: 800; color: #111; }
        .stat-label { color: #6b7280; font-weight: 500; }

        .section-padding { padding: 100px 0; }
        .section-title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 16px; }
        .section-sub { text-align: center; color: #6b7280; margin-bottom: 64px; font-size: 1.1rem; }

        .step-card { text-align: center; padding: 32px; }
        .step-icon { width: 80px; height: 80px; background: #fff5f7; color: var(--qp-coral); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 24px; }
        
        .feature-card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 32px; transition: all 0.3s ease; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 20px; }
        
        .pricing-card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 40px; text-align: center; transition: transform 0.3s; height: 100%; }
        .pricing-card.highlight { border: 2px solid var(--qp-coral); transform: scale(1.05); box-shadow: 0 20px 40px rgba(244, 63, 100, 0.1); }
        .price { font-size: 3.5rem; font-weight: 900; margin: 24px 0; }
        .price span { font-size: 1rem; color: #6b7280; font-weight: 500; }
        
        .testimonial-card { background: white; padding: 32px; border-radius: 16px; border: 1px solid #eee; }
        .stars { color: #fbbf24; margin-bottom: 16px; }

        .cta-banner { background: #111827; color: white; padding: 80px 0; text-align: center; border-radius: 32px; margin: 0 24px; }
        
        .footer { padding: 60px 0 30px; border-top: 1px solid #eee; }
        
        .whatsapp-float { position: fixed; bottom: 30px; right: 30px; background: #25d366; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); z-index: 100; transition: transform 0.2s; text-decoration: none; }
        .whatsapp-float:hover { transform: scale(1.1); color: white; }

        .fade-in-hidden { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .fade-in-visible { opacity: 1; transform: translateY(0); }
      `}} />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top navbar-custom py-3">
        <div className="container">
          <Link href="/" className="qp-logo">
            <span className="qp-logo-icon">QP</span>
            Qr To Print
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
              <Link href="/auth/login" className="btn btn-outline-dark">Login</Link>
              <Link href="/auth/register" className="btn btn-coral">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h1 className="hero-title">Turn Your Print Shop Into a <span className="text-coral">Smart Business</span></h1>
              <p className="hero-sub">Allow customers to print documents securely by simply scanning a QR code. Automate your workflow with our Windows Print Agent.</p>
              <div className="hero-ctas">
                <Link href="/auth/register" className="btn btn-coral btn-lg">Start 5-Day Free Trial</Link>
                <a href="#how-it-works" className="btn btn-outline-dark btn-lg bg-white">See How It Works</a>
              </div>
              
              <div className="mockup-container">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="QR Code Scan Mockup" className="mockup-img" />
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
                <p className="text-muted">Place your unique shop QR code on the counter. Customer scans it with their phone camera.</p>
              </div>
            </div>
            <div className="col-md-4 fade-in-hidden" style={{transitionDelay: '0.1s'}}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h4 className="fw-bold mb-3">Uploads Document</h4>
                <p className="text-muted">They select the file (PDF, Word, Images) and choose print settings (Color/B&W, Copies).</p>
              </div>
            </div>
            <div className="col-md-4 fade-in-hidden" style={{transitionDelay: '0.2s'}}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h4 className="fw-bold mb-3">Auto Prints</h4>
                <p className="text-muted">Our Windows Agent catches the file and sends it directly to your printer instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding">
        <div className="container">
          <h2 className="section-title fade-in-hidden">Everything you need to scale</h2>
          <p className="section-sub fade-in-hidden">Powerful features built for modern print shops</p>
          
          <div className="row g-4">
            {[
              { icon: '📱', title: 'Mobile Printing', desc: 'Customers don&apos;t need to connect cables or send emails. They print directly from their smartphones.' },
              { icon: '🖨️', title: 'Windows Agent', desc: 'Install our lightweight agent on your Windows PC for hands-free automatic printing.' },
              { icon: '📊', title: 'Live Dashboard', desc: 'Monitor your print queue, revenue, and active agents in real-time from anywhere.' },
              { icon: '🔒', title: 'Secure Storage', desc: 'Documents are temporarily stored securely and automatically deleted after printing to protect privacy.' },
              { icon: '🎁', title: 'Refer & Earn', desc: 'Invite other shop owners and earn free subscription months or cash rewards.' },
              { icon: '📈', title: 'Analytics', desc: 'Track your daily, weekly, and monthly print volumes to understand your business growth.' }
            ].map((f, i) => (
              <div key={i} className="col-md-4 fade-in-hidden" style={{transitionDelay: \`\${i * 0.1}s\`}}>
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
                  <li className="mb-3">✓ All premium features</li>
                  <li className="mb-3">✓ Windows Print Agent</li>
                  <li className="mb-3">✓ Unlimited prints</li>
                  <li className="mb-3 text-muted">✗ Community support</li>
                </ul>
                <Link href="/auth/register" className="btn btn-outline-dark w-100">Try for Free</Link>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 fade-in-hidden" style={{transitionDelay: '0.1s'}}>
              <div className="pricing-card highlight">
                <div className="badge bg-coral text-white mb-3 py-2 px-3 rounded-pill">Most Popular</div>
                <h4 className="fw-bold">Monthly Pro</h4>
                <div className="price">₹99<span>/mo</span></div>
                <ul className="list-unstyled text-start mb-4">
                  <li className="mb-3">✓ All premium features</li>
                  <li className="mb-3">✓ Windows Print Agent</li>
                  <li className="mb-3">✓ Unlimited prints</li>
                  <li className="mb-3">✓ Priority support</li>
                </ul>
                <Link href="/auth/register" className="btn btn-coral w-100">Subscribe Now</Link>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 fade-in-hidden" style={{transitionDelay: '0.2s'}}>
              <div className="pricing-card">
                <h4 className="fw-bold">Yearly Saver</h4>
                <div className="price">₹599<span>/yr</span></div>
                <ul className="list-unstyled text-start mb-4">
                  <li className="mb-3">✓ All premium features</li>
                  <li className="mb-3">✓ Windows Print Agent</li>
                  <li className="mb-3">✓ Unlimited prints</li>
                  <li className="mb-3">✓ Save 50% vs monthly</li>
                </ul>
                <Link href="/auth/register" className="btn btn-outline-dark w-100">Get Yearly Plan</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title fade-in-hidden">Loved by shop owners</h2>
          <div className="row g-4 mt-4">
            {[
              { text: "This has completely changed how my shop operates. No more pendrives with viruses!", author: "Rahul M., Print Shop Owner" },
              { text: "The Windows agent works flawlessly. Customers love how fast it is.", author: "Priya S., Stationery Store" },
              { text: "My revenue increased by 20% because customers don't have to wait in line anymore.", author: "Amit K., Cyber Cafe" }
            ].map((t, i) => (
              <div key={i} className="col-md-4 fade-in-hidden" style={{transitionDelay: \`\${i * 0.1}s\`}}>
                <div className="testimonial-card">
                  <div className="stars">★★★★★</div>
                  <p className="mb-4 text-muted fw-medium">&quot;{t.text}&quot;</p>
                  <h6 className="fw-bold mb-0">{t.author}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container fade-in-hidden">
          <div className="cta-banner">
            <h2 className="fw-bold mb-4">Ready to modernize your print shop?</h2>
            <p className="mb-5 text-light fs-5">Join 500+ shop owners saving time and increasing profits.</p>
            <Link href="/auth/register" className="btn btn-coral btn-lg">Start Your Free Trial Now</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-white mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <Link href="/" className="qp-logo mb-3">
                <span className="qp-logo-icon">QP</span>
                Qr To Print
              </Link>
              <p className="text-muted">The smartest way to accept print orders in your shop.</p>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled text-muted">
                <li className="mb-2"><a href="#features">Features</a></li>
                <li className="mb-2"><a href="#pricing">Pricing</a></li>
                <li className="mb-2">Download Agent</li>
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">About Us</li>
                <li className="mb-2">Contact</li>
                <li className="mb-2">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-top pt-4 mt-4 text-center text-muted">
            <p className="mb-0">© {new Date().getFullYear()} Qr To Print. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/917069525795" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <i className="bi bi-whatsapp"></i>
        {/* If bootstrap icons not loaded, using text as fallback, normally you'd put the svg here */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </>
  );
}
