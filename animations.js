/**
 * ===================================================================
 * MICRO-ANIMATIONS & INTERACTION CONTROLS
 * Scroll Reveals, Sticky Navbar Blur, 3D Perspective Tilt, & ScrollSpy
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------
  // 1. STICKY NAVBAR TRANSFORMATION & SCROLLSPY
  // -----------------------------------------------------------------
  const navbar = document.getElementById('main-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Navbar backdrop blur & height compression
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy: highlight active link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  // -----------------------------------------------------------------
  // 2. SCROLL REVEAL OBSERVER (FADE & SLIDE)
  // -----------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // -----------------------------------------------------------------
  // 3. MOUSE-FOLLOW 3D TILT ON HERO BROWSER MOCKUP
  // -----------------------------------------------------------------
  const heroMockup = document.getElementById('hero-browser-window');
  const heroWrapper = document.getElementById('hero-mockup-wrapper');

  if (heroMockup && heroWrapper && window.innerWidth > 991) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      // Subtle 3D rotation
      const rotateX = -deltaY * 6; // max 6deg
      const rotateY = deltaX * 8;  // max 8deg

      heroMockup.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroWrapper.addEventListener('mouseleave', () => {
      heroMockup.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // -----------------------------------------------------------------
  // 4. CUSTOM MAGNETIC CURSOR (Desktop Viewports)
  // -----------------------------------------------------------------
  if (window.innerWidth > 991) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor';
    document.body.appendChild(cursorDot);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth follower interpolation
    function renderFollower() {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(renderFollower);
    }
    requestAnimationFrame(renderFollower);

    // Hover interactions
    const interactiveTargets = document.querySelectorAll('a, button, .project-card, .live-card, .service-card, input, select, textarea, .browser-tab, .filter-btn');
    interactiveTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      });
      target.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      });
    });
  }

  // -----------------------------------------------------------------
  // 5. RADIAL SPOTLIGHT HOVER FOR CARDS
  // -----------------------------------------------------------------
  const spotlightCards = document.querySelectorAll('.live-card, .project-card, .service-card, .pillar-card, .why-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});

