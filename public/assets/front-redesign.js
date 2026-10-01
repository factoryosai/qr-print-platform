(() => {
  new Swiper('.review-swiper', {
    slidesPerView: 1.08,
    spaceBetween: 16,
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.review-swiper .swiper-pagination', clickable: true },
    breakpoints: { 700: { slidesPerView: 2 }, 1050: { slidesPerView: 3 } }
  });
  document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => {
    const menu = document.getElementById('mainNav');
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline().from('.eyebrow', { y: 14, opacity: 0, duration: .4 }).from('.hero h1, .hero .lead', { y: 24, opacity: 0, stagger: .1, duration: .55 }, '-=.15').from('.hero-actions, .hero-points', { y: 18, opacity: 0, stagger: .08, duration: .45 }, '-=.2').from('.product-visual', { x: 35, opacity: 0, duration: .7 }, '-=.65');
  gsap.utils.toArray('.section-intro, .section-heading, .flow-grid article, .service-row, .control-list article, .price-card').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 89%', once: true }, y: 24, opacity: 0, duration: .5, ease: 'power2.out' }));
  gsap.to('.product-visual img', { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
})();
