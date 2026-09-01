/* ============================================
   SEIF ELMASRY — Portfolio JavaScript
   All interactive features, animations & effects
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ============ PRELOADER ============
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 800);
  });
  // Fallback: hide after 3s max
  setTimeout(() => preloader.classList.add("hidden"), 3000);

  // ============ AOS INIT ============
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    disable: "mobile",
  });

  // ============ PARTICLES BACKGROUND ============
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(
      Math.floor((canvas.width * canvas.height) / 12000),
      120,
    );
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();
  window.addEventListener("resize", initParticles);

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ============ CUSTOM CURSOR ============
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let cursorX = 0,
    cursorY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX + "px";
    cursorDot.style.top = cursorY + "px";
  });

  function animateCursorRing() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .project-card, .skill-item, .service-card, .contact-info-card, .form-control",
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () =>
      cursorRing.classList.remove("hover"),
    );
  });

  // ============ NAVBAR SCROLL & ACTIVE LINK ============
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll("section[id]");

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active nav link
    sections.forEach((section) => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });

    // Back to top
    const backToTop = document.getElementById("backToTop");
    if (scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }
  window.addEventListener("scroll", handleScroll);

  // Back to top click
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============ MOBILE NAV TOGGLE ============
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
  });

  // Close mobile nav on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("open");
    });
  });

  // ============ TYPEWRITER EFFECT ============
  const typewriterEl = document.getElementById("typewriter");
  const phrases = [
    "Node.js",
    "React.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "Socket.io",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeWriter() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriter, typingSpeed);
  }
  typeWriter();

  // ============ COUNTER ANIMATION ============
  const counters = document.querySelectorAll("[data-count]");
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count"));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      function updateCounter() {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current) + "+";
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + "+";
        }
      }
      updateCounter();
    });
    countersAnimated = true;
  }

  // Trigger counters when hero stats are visible
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
        }
      });
    },
    { threshold: 0.5 },
  );

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) statsObserver.observe(heroStats);

  // ============ TESTIMONIALS SLIDER ============
  const testimonials = [
    {
      quote:
        "Seif delivered an outstanding e-commerce platform that exceeded our expectations. His Node.js expertise and attention to detail are remarkable. Highly recommended!",
      name: "Ahmed Khalil",
      role: "CEO, TechVentures",
      avatar: "AK",
    },
    {
      quote:
        "Working with Seif was a fantastic experience. He built our task management tool from scratch with real-time collaboration features. The code quality is exceptional.",
      name: "Sarah Mitchell",
      role: "CTO, AgileFlow",
      avatar: "SM",
    },
    {
      quote:
        "Seif transformed our outdated website into a modern, fast, and beautiful web app. His full-stack skills and communication are top-notch. A true professional!",
      name: "Omar Hassan",
      role: "Founder, DigitalPeak",
      avatar: "OH",
    },
  ];

  let currentTestimonial = 0;
  const quoteEl = document.getElementById("testimonial-quote");
  const nameEl = document.getElementById("testimonial-name");
  const roleEl = document.getElementById("testimonial-role");
  const avatarEl = document.getElementById("testimonial-avatar");
  const navDots = document.querySelectorAll(".testimonial-nav-dot");

  function showTestimonial(index) {
    const t = testimonials[index];
    quoteEl.style.opacity = 0;
    quoteEl.style.transform = "translateY(10px)";

    setTimeout(() => {
      quoteEl.textContent = t.quote;
      nameEl.textContent = t.name;
      roleEl.textContent = t.role;
      avatarEl.textContent = t.avatar;
      quoteEl.style.opacity = 1;
      quoteEl.style.transform = "translateY(0)";
    }, 300);

    navDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentTestimonial = parseInt(dot.getAttribute("data-index"));
      showTestimonial(currentTestimonial);
    });
  });

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    // e.preventDefault();
    const submitBtn = document.getElementById("submitBtn");
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span>Sending...</span> <i class="bi bi-hourglass-split"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML =
        '<span>Message Sent!</span> <i class="bi bi-check-circle"></i>';
      submitBtn.style.background =
        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
        contactForm.reset();
      }, 2500);
    }, 1500);
  });

  // ============ SMOOTH SCROLL for all anchor links ============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ============ TILT EFFECT on project cards ============
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ============ SKILL ITEMS STAGGER ANIMATION ============
  const skillCategories = document.querySelectorAll(".skill-category");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll(".skill-item");
          items.forEach((item, i) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(15px)";
            setTimeout(() => {
              item.style.transition = "opacity 0.4s ease, transform 0.4s ease";
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, i * 80);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillCategories.forEach((cat) => skillObserver.observe(cat));

  // ============ MAGNETIC EFFECT on buttons ============
  const magneticBtns = document.querySelectorAll(
    ".btn-primary, .btn-outline, .btn-submit",
  );
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  // ============ PARALLAX on hero gradients ============
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    const g1 = document.querySelector(".hero-bg-gradient.g1");
    const g2 = document.querySelector(".hero-bg-gradient.g2");
    if (g1) g1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    if (g2) g2.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
  });
});

//======= emailJS >

// function sendMail() {
//   let parm = {
//     name: document.getElementById("name").value,
//     email: document.getElementById("email").value,
//     subject: document.getElementById("subject").value,
//     message: document.getElementById("message").value,
//   };
//   emailjs
//     .send("service_sdg3vjo", "template_2fpatie", parms)
//     .then(alert("Email sent..."));
// }
