/* =========================================================
   Portfolio interactions: Akshaya Varshini
   1 Mobile menu | 2 Navbar scroll | 3 Active link | 4 Reveal
   5 Back-to-top | 6 Placeholder links | 7 Contact form | 8 Year
   ========================================================= */
(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const backToTop = document.getElementById("backToTop");

  /* 1. MOBILE MENU */
  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }
  navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* 2 & 5. SCROLL-BASED UI (navbar background + back-to-top button) */
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    backToTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* 3. ACTIVE NAV HIGHLIGHT */
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    /* 4. SCROLL REVEAL */
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + "ms"; // small stagger
      reveal.observe(el);
    });
  } else {
    // Very old browsers: just show everything
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* 6. PLACEHOLDER LINKS (e.g. GitHub): stop jumping to top, tell the user what to add */
  document.querySelectorAll(".placeholder-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      alert(a.dataset.placeholder + "\nOpen index.html and replace this link's href with your real URL.");
    });
  });

  /* 7. CONTACT FORM VALIDATION */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    subject: (v) => (v.trim().length < 3 ? "Please enter a subject (at least 3 characters)." : ""),
    message: (v) => (v.trim().length < 10 ? "Message should be at least 10 characters." : ""),
  };

  function validateField(name) {
    const input = form.elements[name];
    const msg = rules[name](input.value);
    document.getElementById(name + "Error").textContent = msg;
    input.closest(".field").classList.toggle("invalid", Boolean(msg));
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
    form.elements[name].addEventListener("input", () => {
      if (form.elements[name].closest(".field").classList.contains("invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) {
      const firstBad = form.querySelector(".invalid input, .invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }

    /* No backend here, so we open the visitor's email app with the message pre-filled.
       To get real delivery, replace this block with a fetch() call to Formspree / Netlify Forms. */
    const body = `Name: ${form.name.value}\nEmail: ${form.email.value}\n\n${form.message.value}`;
    const mailto = `mailto:achuakshu19@gmail.com?subject=${encodeURIComponent(form.subject.value)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    status.textContent = "Opening your email app. Please press send there to deliver the message.";
    form.reset();
  });

  /* 8. FOOTER YEAR */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
