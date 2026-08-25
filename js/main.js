const SAHE_WHATSAPP = "527131296386";

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initReveal();
  initMarquee();
  initCounters();
  initWhatsAppForm();
  initHeroCanvas();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const hide = () => loader.classList.add("is-hidden");
  window.setTimeout(hide, 900);
  window.addEventListener("load", () => window.setTimeout(hide, 250), { once: true });
}

function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const setState = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 18);
  };

  setState();
  window.addEventListener("scroll", setState, { passive: true });
}

function initMobileMenu() {
  const button = document.getElementById("hamburger");
  const menu = document.getElementById("mob-menu");
  if (!button || !menu) return;

  const close = () => {
    button.classList.remove("is-active");
    button.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  button.addEventListener("click", () => {
    const isOpen = button.classList.toggle("is-active");
    button.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function initMarquee() {
  const marquee = document.getElementById("marquee");
  if (!marquee) return;

  const items = [
    "IMSS",
    "SAT",
    "Infonavit",
    "Fonacot",
    "REPSE",
    "Desarrollo Organizacional",
    "Asesoria empresarial",
    "Cumplimiento patronal",
    "Gestion documental"
  ];

  const content = [...items, ...items, ...items, ...items]
    .map((item) => `<span>${item}</span>`)
    .join("");

  marquee.innerHTML = content;
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-count]");
  if (!counters.length) return;

  const animate = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initWhatsAppForm() {
  const form = document.getElementById("wa-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name");
    const interest = document.getElementById("f-interest");
    const message = document.getElementById("f-msg");

    if (!name.value.trim() || !message.value.trim()) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola SAHE Consultores, visite su landing page y quiero solicitar un diagnostico.",
      `Nombre: ${name.value.trim()}`,
      `Area de interes: ${interest.value}`,
      `Contexto: ${message.value.trim()}`
    ].join("\n");

    window.open(`https://wa.me/${SAHE_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const points = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    points.length = 0;
    const total = Math.max(24, Math.floor(width / 46));
    for (let index = 0; index < total; index += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.5 + 0.6
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    points.forEach((point, index) => {
      if (!reduceMotion) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      }

      for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
        const next = points[nextIndex];
        const distance = Math.hypot(point.x - next.x, point.y - next.y);
        if (distance > 145) continue;

        context.strokeStyle = `rgba(241, 217, 149, ${0.16 * (1 - distance / 145)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }

      context.fillStyle = "rgba(241, 217, 149, 0.52)";
      context.fillRect(point.x, point.y, point.size, point.size);
    });

    if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    draw();
  });
}
