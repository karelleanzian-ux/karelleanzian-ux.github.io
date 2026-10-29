
"use strict";

// ========================================
// KARELLE ANZIAN — PORTFOLIO INTERACTIONS
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. ANNÉE AUTOMATIQUE
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MENU MOBILE
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // 3. TEXTE ANIMÉ
  const typingElement = document.getElementById("typing-text");

  if (typingElement) {
    const phrases = [
      "l'informatique.",
      "l'intelligence artificielle.",
      "la programmation.",
      "l'innovation."
    ];

    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion) {
      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (deleting) {
          characterIndex--;
          typingElement.textContent =
            currentPhrase.substring(0, characterIndex);
        } else {
          characterIndex++;
          typingElement.textContent =
            currentPhrase.substring(0, characterIndex);
        }

        let delay = deleting ? 35 : 65;

        if (!deleting && characterIndex === currentPhrase.length) {
          deleting = true;
          delay = 1500;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        }

        window.setTimeout(typeEffect, delay);
      }

      window.setTimeout(typeEffect, 1800);
    }
  }

  // 4. APPARITION DES ÉLÉMENTS AU SCROLL
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 5. FILTRES DES PROJETS
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        card.hidden = !shouldShow;
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // 6. THÈME SOMBRE / CLAIR
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = (() => {
    try {
      return localStorage.getItem("portfolio-theme");
    } catch {
      return null;
    }
  })();

  function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
      themeToggle.textContent = isLight ? "☾" : "☀";
      themeToggle.setAttribute(
        "aria-label",
        isLight
          ? "Activer le thème sombre"
          : "Activer le thème clair"
      );
      themeToggle.title = isLight
        ? "Activer le thème sombre"
        : "Activer le thème clair";
    }

    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isLight ? "#f5f7ff" : "#0b1020");
  }

  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // Le thème fonctionne même si le stockage est indisponible.
    }
  });

  // 7. NAVIGATION ACTIVE ET HEADER
  const header = document.getElementById("header");
  const backToTop = document.getElementById("back-to-top");

  function updateScrollUI() {
    const scrollPosition = window.scrollY;

    header?.classList.toggle("scrolled", scrollPosition > 20);
    backToTop?.classList.toggle("visible", scrollPosition > 450);

    const sections = document.querySelectorAll("main section[id]");
    let currentSection = "accueil";

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop - 180) {
        currentSection = section.id;
      }
    });

    navItems.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${currentSection}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollScheduled) {
        window.requestAnimationFrame(() => {
          updateScrollUI();
          scrollScheduled = false;
        });

        scrollScheduled = true;
      }
    },
    { passive: true }
  );

  updateScrollUI();

  // 8. RETOUR EN HAUT
  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  });

});
