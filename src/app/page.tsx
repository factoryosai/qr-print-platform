import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/917069525795?text=Hello%20QR%20Print%20Support"
         className="whatsapp-float"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Chat on WhatsApp">

          <svg viewBox="0 0 32 32" aria-hidden="true">
              <path fill="currentColor"
                    d="M19.11 17.21c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.64.07-1.72-.86-2.84-1.53-3.98-3.48-.3-.52.3-.48.86-1.6.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35m-3.06 7.29h-.01a12.1 12.1 0 0 1-6.17-1.69l-.44-.26-4.59 1.2 1.22-4.47-.29-.46a12.08 12.08 0 1 1 10.28 5.68m10.3-22.2A14.46 14.46 0 0 0 16.05 0C8.08 0 1.59 6.49 1.59 14.46c0 2.55.67 5.04 1.93 7.23L1.47 29.2l7.69-2.02a14.45 14.45 0 0 0 6.89 1.76h.01c7.97 0 14.46-6.49 14.46-14.46 0-3.86-1.5-7.49-4.17-10.18"/>
          </svg>
          <span>WhatsApp</span>
      </a>

      <style dangerouslySetInnerHTML={{__html: `
      .whatsapp-float {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #25D366;
          color: #fff;
          padding: 12px 16px;
          border-radius: 50px;
          font-family: Arial, sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
          transition: 0.3s ease;
      }
      .whatsapp-float svg { width: 25px; height: 25px; }
      .whatsapp-float:hover { transform: translateY(-3px); background: #1ebe5d; color: #fff; }
      @media (max-width: 600px) {
          .whatsapp-float { right: 15px; bottom: 15px; padding: 12px; }
          .whatsapp-float span { display: none; }
          .whatsapp-float svg { width: 28px; height: 28px; }
      }
      .video-box {
          width: 100%; max-width: 900px; margin: 20px auto;
          background: #000; border-radius: 12px; overflow: hidden;
          box-shadow: 0 8px 25px rgba(0,0,0,0.20);
      }
      .video-box video { width: 100%; height: auto; display: block; }
      `}} />

      <div className="notice">
        <div className="container-xl">
          <span><i className="bi bi-stars"></i> 5-day demo available for print shops</span>
          <Link href="/signup">Create shop <i className="bi bi-arrow-right"></i></Link>  
          Support Number : <a href="tel:+917069525795" className="support-number"> <i className="bi bi-phone"></i> +91 70695 25795 </a>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-xl">
          <Link className="brand" href="/"><span>QP</span><strong>Qr To Print</strong></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Open menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav ms-auto align-items-lg-center">
              <a className="nav-link" href="#how">How it works</a>
              <a className="nav-link" href="#services">Print services</a>
              <a className="nav-link" href="#shops">For shops</a>
              <a className="nav-link" href="#pricing">Pricing</a>
              <Link className="nav-link" href="/signup">Setup guide</Link>
              <Link className="nav-link" href="/signup">Agent program</Link>
              <Link className="btn-login" href="/login"><i className="bi bi-box-arrow-in-right"></i> Shop login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="container-xl">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 hero-content">
                <div className="eyebrow"><span></span>Printing made simple for customers and shops</div>
                <h1>Scan the QR.<br/><em>Send it to print.</em></h1>
                <p className="lead">Customers upload from their phone, choose pages and payment, and the shop&apos;s Windows printer receives an organized print job.</p>
                <div className="hero-actions">
                  <Link className="btn-primary" href="/signup">Set up my shop <i className="bi bi-arrow-right"></i></Link>
                  <a className="btn-secondary" href="#how"><i className="bi bi-play-circle"></i> See the process</a>
                </div>
                <div className="hero-points">
                  <span><i className="bi bi-check-circle-fill"></i>No WhatsApp</span>
                  <span><i className="bi bi-check-circle-fill"></i>No pen drive</span>
                  <span><i className="bi bi-check-circle-fill"></i>Cash or online payment</span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="product-visual">
                  <img src="https://qrtoprint.in/assets/images/qr-print-hero.png" alt="Phone scanning QR and sending a document to a printer" />
                  <div className="agent-pill">
                    <span></span>
                    <div>
                      <strong>Print Agent connected</strong>
                      <small>Job sent to Windows printer</small>
                    </div>
                    <i className="bi bi-printer"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="process-strip">
          <div className="container-xl">
            <div className="process-track">
              <div><b>01</b><span><strong>Scan</strong><small>Shop QR code</small></span></div><i className="bi bi-arrow-right"></i>
              <div><b>02</b><span><strong>Upload</strong><small>PDF or image</small></span></div><i className="bi bi-arrow-right"></i>
              <div><b>03</b><span><strong>Pay</strong><small>Cash or online</small></span></div><i className="bi bi-arrow-right"></i>
              <div><b>04</b><span><strong>Print</strong><small>Automatic job</small></span></div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="container-xl">
            <div><strong>21139+</strong><span>shops registered</span></div>
            <div><strong>551561+</strong><span>successful prints</span></div>
            <div><strong>₹0.10</strong><span>wallet fee per job</span></div>
            <div><strong>24/7</strong><span>customer uploads</span></div>
          </div>
        </section>

        <section className="section how" id="how">
          <div className="container-xl">
            <div className="section-intro">
              <div><span className="section-tag">Customer flow</span><h2>From phone to paper without counter confusion</h2></div>
              <p>The print page asks only what is needed. The shop receives the file, settings, payment status and customer details in one job.</p>
            </div>
            <div className="row g-4 flow-grid">
              <div className="col-md-6 col-xl-3">
                <article><i className="bi bi-qr-code-scan"></i><b>01</b><h3>Open the shop QR</h3><p>The QR opens that shop&apos;s private mobile print page.</p></article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article><i className="bi bi-cloud-arrow-up"></i><b>02</b><h3>Choose and upload</h3><p>Add a file, select print service and adjust the layout.</p></article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article><i className="bi bi-sliders"></i><b>03</b><h3>Confirm print details</h3><p>Choose pages, copies, color, paper and payment mode.</p></article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article><i className="bi bi-printer"></i><b>04</b><h3>Collect the print</h3><p>The Print Agent routes the approved job to the printer.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container-xl">
            <div className="section-intro">
              <div><span className="section-tag">More than documents</span><h2>Every common counter service in one print page</h2></div>
              <p>Customers choose the job they need before uploading. Each service provides controls designed for that output.</p>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <article className="service-row">
                  <i className="bi bi-file-earmark-text"></i>
                  <div><h3>Document printing</h3><p>PDF and images with page range, copies, size and duplex controls.</p></div>
                  <span className="bi bi-arrow-up-right"></span>
                </article>
              </div>
              <div className="col-md-6">
                <article className="service-row">
                  <i className="bi bi-person-bounding-box"></i>
                  <div><h3>Passport photos</h3><p>Crop and arrange up to 25 passport photos on one A4 sheet.</p></div>
                  <span className="bi bi-arrow-up-right"></span>
                </article>
              </div>
              <div className="col-md-6">
                <article className="service-row">
                  <i className="bi bi-credit-card-2-front"></i>
                  <div><h3>ID / Aadhaar cards</h3><p>Place front and back together with drag, resize and rotate tools.</p></div>
                  <span className="bi bi-arrow-up-right"></span>
                </article>
              </div>
              <div className="col-md-6">
                <article className="service-row">
                  <i className="bi bi-file-earmark-person"></i>
                  <div><h3>Resume printing</h3><p>Clean, quick resume printing from PDF or image files.</p></div>
                  <span className="bi bi-arrow-up-right"></span>
                </article>
              </div>
            </div>
            <div className="service-note">
              <i className="bi bi-shield-check"></i>
              <div><strong>Customer files are handled for printing</strong><span>Uploaded files are removed after the print workflow completes.</span></div>
              <Link href="/signup">Read setup and privacy details</Link>
            </div>
          </div>
        </section>

        <section className="section shops" id="shops">
          <div className="container-xl">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <span className="section-tag">Built for the shop counter</span>
                <h2>Your printing operation, visible in one panel</h2>
                <p className="shop-lead">Connect existing Windows printers and manage jobs, payments, wallet balance and reports without changing how customers reach the shop.</p>
                <Link className="text-link" href="/signup">Start your 5-day demo <i className="bi bi-arrow-right"></i></Link>
              </div>
              <div className="col-lg-7">
                <div className="control-list">
                  <article>
                    <span><i className="bi bi-printer-fill"></i></span>
                    <div><h3>Printer and agent status</h3><p>Add B&W and color printers, see connection health and route each job correctly.</p></div>
                  </article>
                  <article>
                    <span><i className="bi bi-receipt"></i></span>
                    <div><h3>Jobs and searchable reports</h3><p>Track queued, picked, printed and failed jobs by date, customer, file or status.</p></div>
                  </article>
                  <article>
                    <span><i className="bi bi-wallet2"></i></span>
                    <div><h3>Wallet, packages and referrals</h3><p>Add wallet funds, purchase a package and review every transaction.</p></div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section pricing" id="pricing">
          <div className="container-xl">
            <div className="section-heading">
              <span className="section-tag">Simple pricing</span>
              <h2>Start small. Upgrade when your shop is ready.</h2>
              <p>Every package uses the same QR print workflow and Shop Panel.</p>
            </div>
            <div className="row g-3 justify-content-center">
              <div className="col-md-6 col-xl-3">
                <article className="price-card ">
                  <p className="plan-name">Demo</p><h3><sup>₹</sup>0</h3><small>5 days</small>
                  <ul><li><i className="bi bi-check2"></i>Personal shop QR</li><li><i className="bi bi-check2"></i>Print Agent access</li><li><i className="bi bi-check2"></i>10 demo jobs</li></ul>
                  <Link href="/signup">Start free <i className="bi bi-arrow-right"></i></Link>
                </article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article className="price-card featured">
                  <span className="popular">New</span><p className="plan-name">Starter</p><h3><sup>₹</sup>49</h3><small>per month</small>
                  <ul><li><i className="bi bi-check2"></i>400 completed print jobs</li><li><i className="bi bi-check2"></i>No per-print fee</li><li><i className="bi bi-check2"></i>Reports and support</li></ul>
                  <Link href="/signup">Choose starter <i className="bi bi-arrow-right"></i></Link>
                </article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article className="price-card ">
                  <p className="plan-name">Monthly</p><h3><sup>₹</sup>99</h3><small>per month</small>
                  <ul><li><i className="bi bi-check2"></i>Unlimited print jobs</li><li><i className="bi bi-check2"></i>No per-print fee</li><li><i className="bi bi-check2"></i>Reports and support</li></ul>
                  <Link href="/signup">Choose monthly <i className="bi bi-arrow-right"></i></Link>
                </article>
              </div>
              <div className="col-md-6 col-xl-3">
                <article className="price-card ">
                  <p className="plan-name">Yearly</p><h3><sup>₹</sup>599</h3><small>365 days</small>
                  <ul><li><i className="bi bi-check2"></i>365-day access</li><li><i className="bi bi-check2"></i>Full feature access</li><li><i className="bi bi-check2"></i>Updates and support</li></ul>
                  <Link href="/signup">Choose yearly <i className="bi bi-arrow-right"></i></Link>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section proof">
          <div className="container-xl">
            <div className="proof-head">
              <div><span className="section-tag">Why shops use it</span><h2>Less file handling.<br/>More organized printing.</h2></div>
              <p>Qr To Print keeps each customer request complete from upload to printed status, so the operator knows exactly what to print and where to send it.</p>
            </div>
            <div className="swiper review-swiper">
              <div className="swiper-wrapper">
                <blockquote className="swiper-slide">
                  <div className="review-icon"><i className="bi bi-phone"></i></div>
                  <p>Customers upload directly from their phone, so documents no longer get buried inside chat conversations.</p>
                  <div className="review-meta"><div><strong>Customer upload flow</strong><span>QR print page</span></div><small><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></small></div>
                </blockquote>
                <blockquote className="swiper-slide">
                  <div className="review-icon"><i className="bi bi-card-checklist"></i></div>
                  <p>Payment, print settings and job status remain together, making counter work easier to check.</p>
                  <div className="review-meta"><div><strong>Daily shop operations</strong><span>Reports and payments</span></div><small><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></small></div>
                </blockquote>
                <blockquote className="swiper-slide">
                  <div className="review-icon"><i className="bi bi-printer"></i></div>
                  <p>B&W and color jobs can be routed to their configured printers without checking every file manually.</p>
                  <div className="review-meta"><div><strong>Automatic printer routing</strong><span>Windows Print Agent</span></div><small><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></small></div>
                </blockquote>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>

        <section className="section faq">
          <div className="container-xl">
            <div className="row g-5">
              <div className="col-lg-4">
                <span className="section-tag">Common questions</span>
                <h2>Before you set up your shop</h2>
                <p>Everything needed for the first test print is included in the setup guide.</p>
                <Link href="/signup">Open full setup guide <i className="bi bi-arrow-right"></i></Link><br/>
                Support Number : <a href="tel:+917069525795" className="support-number"> <i className="bi bi-phone"></i> +91 70695 25795 </a>
              </div>
              <div className="col-lg-8">
                <div className="accordion accordion-flush" id="faqList">
                  <div className="accordion-item">
                    <h3 className="accordion-header"><button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#faq0">Do I need a Wi-Fi printer?</button></h3>
                    <div id="faq0" className="accordion-collapse collapse show" data-bs-parent="#faqList"><div className="accordion-body">No. The Windows Print Agent can use an installed USB or network printer.</div></div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">Can customers pay cash?</button></h3>
                    <div id="faq1" className="accordion-collapse collapse " data-bs-parent="#faqList"><div className="accordion-body">Yes. A shop can enable cash, online payment, or both payment methods.</div></div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">Which files can customers upload?</button></h3>
                    <div id="faq2" className="accordion-collapse collapse " data-bs-parent="#faqList"><div className="accordion-body">The print page supports PDF, JPG and PNG files with service-specific controls.</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container-xl">
            <div><span>Ready for your first test print?</span><h2>Create your shop QR and connect your printer.</h2></div>
            <div><Link href="/signup">Start free demo <i className="bi bi-arrow-right"></i></Link><Link href="/login">Shop login</Link></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container-xl footer-grid">
          <div>
            <Link className="brand footer-brand" href="/"><span>QP</span><strong>Qr To Print</strong></Link>
            <p>Mobile uploads and automatic printing for local print shops and cyber cafes.</p>
            <a href="tel:+917069525795" className="support-number"><i className="bi bi-telephone"></i> +91 70695 25795</a>
          </div>
          <div>
            <strong>Product</strong>
            <a href="#how">How it works</a>
            <a href="#services">Print services</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div>
            <strong>Shop owners</strong>
            <Link href="/signup">Register shop</Link>
            <Link href="/login">Shop login</Link>
            <Link href="/signup">Setup guide</Link>
          </div>
          <div>
            <strong>Company</strong>
            <Link href="/signup">Agent program</Link>
            <a href="#shops">Shop features</a>
            <a href="https://wa.me/917069525795" target="_blank" rel="noopener noreferrer">Contact support</a>
          </div>
          <div>
            <strong>Legal</strong>
            <Link href="/signup">Terms & Conditions</Link>
            <Link href="/signup">Privacy Policy</Link>
            <Link href="/signup">Refund Policy</Link>
          </div>
        </div>
        <div className="container-xl copyright">
          <span>© 2026 Qr To Print. Kaushik Savaliya. All rights reserved.</span>
          <div className="copyright-links">
            <Link href="/signup">Terms</Link>
            <Link href="/signup">Privacy</Link>
            <Link href="/signup">Refunds</Link>
            <a href="#home">Back to top <i className="bi bi-arrow-up"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
}
