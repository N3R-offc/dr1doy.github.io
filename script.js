const CHART_COLORS = [
  "#2c3e50",
  "#3d566e",
  "#4a7fb0",
  "#5a8fc4",
  "#6b9ec9",
  "#8eb5dc",
  "#a8c8e8",
];

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initInfographicBars();
  initCharts();
  initGlossarySearch();
  highlightActiveNav();
  initHeroScroll();
  initScrollReveal();
  initBackToTop();
  initPhraseCopy();
  initSidebarScrollSpy();
});

function initHeroScroll() {
  const scrollLink = document.querySelector(".hero-splash__scroll");
  const target = document.getElementById("site-content");
  if (!scrollLink || !target) return;

  scrollLink.addEventListener("click", (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".site-nav__toggle");
  const list = document.querySelector(".site-nav__list");
  if (!toggle || !list) return;

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  list.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const page = href.split("/").pop();
    link.classList.toggle("site-nav__link--active", page === current);
  });
}

function initScrollReveal() {
  const selectors = [
    ".section-card",
    ".content-block",
    ".glossary-term",
    ".chart-card",
    ".error-example",
    ".page-title",
    ".hero__text",
    ".phrases-intro",
    ".sidebar-nav",
  ].join(", ");

  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach((el, index) => {
    el.classList.add("reveal-on-scroll");
    el.style.transitionDelay = `${Math.min(index * 0.06, 0.45)}s`;
    observer.observe(el);
  });
}

function initBackToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Наверх");
  btn.textContent = "↑";
  document.body.appendChild(btn);

  const toggle = () => {
    btn.classList.toggle("is-visible", window.scrollY > 400);
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initPhraseCopy() {
  document.querySelectorAll(".phrases-list__item").forEach((item) => {
    item.setAttribute("title", "Нажмите, чтобы скопировать фразу");
    item.addEventListener("click", async () => {
      const text = item.textContent.replace(/^["«]|["»]$/g, "").trim();
      try {
        await navigator.clipboard.writeText(text);
        item.classList.add("is-copied");
        const prev = item.getAttribute("title");
        item.setAttribute("title", "Скопировано!");
        setTimeout(() => {
          item.classList.remove("is-copied");
          item.setAttribute("title", prev || "Нажмите, чтобы скопировать фразу");
        }, 1600);
      } catch {
        /* clipboard недоступен */
      }
    });
  });
}

function initSidebarScrollSpy() {
  const links = [...document.querySelectorAll(".sidebar-nav__link[href^='#']")];
  if (!links.length) return;

  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("sidebar-nav__link--active", link.getAttribute("href") === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        setActive(`#${visible.target.id}`);
      }
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
  );

  sections.forEach(({ section }) => observer.observe(section));
}

function initInfographicBars() {
  const fills = document.querySelectorAll(".infographic-item__fill");
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.width || "0%";
          animateValue(fill.closest(".infographic-item")?.querySelector(".infographic-item__value"));
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach((fill) => {
    fill.style.width = "0%";
    observer.observe(fill);
  });
}

function animateValue(valueEl) {
  if (!valueEl) return;
  const target = parseInt(valueEl.textContent, 10);
  if (Number.isNaN(target)) return;

  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    valueEl.textContent = `${Math.round(target * eased)}%`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  valueEl.textContent = "0%";
  requestAnimationFrame(tick);
}

function initCharts() {
  if (typeof Chart === "undefined") return;

  const pieCtx = document.getElementById("violationsPieChart");
  if (!pieCtx) return;

  new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels: [
        "Телефонный этикет",
        "Деловая переписка",
        "Приём посетителей",
        "Дресс-код",
        "Тайм-менеджмент",
        "Цифровая грамотность",
        "Культурные ошибки",
      ],
      datasets: [
        {
          data: [22, 18, 15, 12, 14, 11, 8],
          backgroundColor: CHART_COLORS,
          borderWidth: 2,
          borderColor: "#fff",
          hoverBorderWidth: 3,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 14,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length ? "pointer" : "default";
      },
    },
  });
}

function initGlossarySearch() {
  const input = document.getElementById("glossary-search");
  const terms = document.querySelectorAll(".glossary-term");
  if (!input || !terms.length) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    terms.forEach((term) => {
      const text = term.textContent.toLowerCase();
      const match = !query || text.includes(query);
      term.style.display = match ? "" : "none";
      term.classList.toggle("glossary-term--highlight", match && query.length > 0);
      if (match) visibleCount += 1;
    });

    input.setAttribute(
      "aria-describedby",
      visibleCount === 0 && query ? "glossary-empty" : ""
    );
  });
}
