gsap.registerPlugin(ScrollTrigger);

const DEFAULT_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "portfolio-language";

let portfolioData;
let currentLanguage = getInitialLanguage();
let currentCertIndex = 0;
let certificationsData = [];
let animationsInitialized = false;
let mobileMenuInitialized = false;

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLanguage === "es" || savedLanguage === "en"
    ? savedLanguage
    : DEFAULT_LANGUAGE;
}

async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`Failed to load portfolio data: ${response.status}`);
    }

    portfolioData = await response.json();
    renderPage();
  } catch (error) {
    console.error(error);
  }
}

function renderPage() {
  if (!portfolioData) return;

  const ui = portfolioData.ui[currentLanguage] ?? portfolioData.ui.en;
  updateStaticCopy(ui);
  updateLanguageToggle();

  renderHero(portfolioData.hero, ui);
  renderAbout(portfolioData.about, ui);
  renderExperience(portfolioData.experience, ui);
  renderSkills(portfolioData.skills);
  renderEducation(portfolioData.education);
  renderCertifications(portfolioData.certifications, ui);
  renderProjects(portfolioData.projects, ui);
  renderSocials(portfolioData.socials);

  lucide.createIcons();

  if (!animationsInitialized) {
    initAnimations();
    animationsInitialized = true;
  }

  initMobileMenu();
  initHoverEffects();
}

function updateStaticCopy(ui) {
  document.documentElement.lang = currentLanguage;
  document.title = ui.documentTitle;

  setText("site-brand", ui.brand);
  setText("nav-about", ui.nav.about);
  setText("nav-experience", ui.nav.experience);
  setText("nav-skills", ui.nav.skills);
  setText("nav-education", ui.nav.education);
  setText("nav-certifications", ui.nav.certifications);
  setText("nav-projects", ui.nav.projects);
  setText("nav-contact-label", ui.nav.contact);

  setText("heading-about", ui.sections.about);
  setText("heading-experience", ui.sections.experience);
  setText("heading-skills", ui.sections.skills);
  setText("heading-education", ui.sections.education);
  setText("heading-certifications", ui.sections.certifications);
  setText("heading-projects", ui.sections.projects);

  setText("footer-title", ui.footer.title);
  setText("footer-description", ui.footer.description);
  setText("footer-copyright", ui.footer.copyright);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function updateLanguageToggle() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    const wasActive = button.classList.contains("active");

    if (animationsInitialized && isActive && !wasActive) {
      button.classList.add("animate-lang-pop");
      button.addEventListener(
        "animationend",
        () => {
          button.classList.remove("animate-lang-pop");
        },
        { once: true },
      );
    }

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getLocalizedValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if (value[currentLanguage] !== undefined) {
    return value[currentLanguage];
  }

  if (value[DEFAULT_LANGUAGE] !== undefined) {
    return value[DEFAULT_LANGUAGE];
  }

  return value;
}

function interpolate(template, variables) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

document.addEventListener("click", (event) => {
  const languageButton = event.target.closest("[data-language]");
  if (languageButton) {
    const selectedLanguage = languageButton.dataset.language;
    if (
      selectedLanguage &&
      selectedLanguage !== currentLanguage &&
      (selectedLanguage === "en" || selectedLanguage === "es")
    ) {
      currentLanguage = selectedLanguage;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
      renderPage();
    }
    return;
  }

  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const panel = document.getElementById("mobile-nav-panel");
  if (
    toggleBtn &&
    panel &&
    toggleBtn.getAttribute("aria-expanded") === "true" &&
    !toggleBtn.contains(event.target) &&
    !panel.contains(event.target)
  ) {
    closeMobileMenu();
  }

  const btn = event.target.closest(".redirect");
  if (btn) {
    event.preventDefault();
    closeMobileMenu();

    const nav = document.querySelector("nav");
    if (!nav) return;

    const sectionName = btn.getAttribute("name");
    const section = sectionName ? document.getElementById(sectionName) : null;
    if (!section) return;

    const navHeight = nav.offsetHeight;
    const topPos =
      section.getBoundingClientRect().top + window.scrollY - (navHeight + 60);
    window.scrollTo({ top: topPos, behavior: "smooth" });
    return;
  }

  const toggle = event.target.closest("[data-exp-toggle]");
  if (toggle) {
    toggle.classList.toggle("expanded");
    const isExpanded = toggle.classList.contains("expanded");
    toggle.setAttribute("aria-expanded", String(isExpanded));
  }
});

function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const panel = document.getElementById("mobile-nav-panel");

  if (!toggle || !panel || mobileMenuInitialized) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));

    if (!isOpen) {
      panel.classList.remove(
        "grid-rows-[0fr]",
        "opacity-0",
        "pointer-events-none",
      );
      panel.classList.add(
        "grid-rows-[1fr]",
        "opacity-100",
        "pointer-events-auto",
      );
    } else {
      panel.classList.add(
        "grid-rows-[0fr]",
        "opacity-0",
        "pointer-events-none",
      );
      panel.classList.remove(
        "grid-rows-[1fr]",
        "opacity-100",
        "pointer-events-auto",
      );
    }

    document.body.classList.toggle("mobile-menu-open", !isOpen);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu();
    }
  });

  mobileMenuInitialized = true;
}

function closeMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const panel = document.getElementById("mobile-nav-panel");

  if (!toggle || !panel) return;

  toggle.setAttribute("aria-expanded", "false");
  panel.classList.add("grid-rows-[0fr]", "opacity-0", "pointer-events-none");
  panel.classList.remove(
    "grid-rows-[1fr]",
    "opacity-100",
    "pointer-events-auto",
  );
  document.body.classList.remove("mobile-menu-open");
}

function renderHero(hero, ui) {
  const container = document.getElementById("hero-content");
  const role = getLocalizedValue(hero.role);
  const bio = getLocalizedValue(hero.bio);
  const imageAlt = interpolate(ui.hero.imageAlt, { name: hero.name });

  container.innerHTML = `
    <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-20">
      <div class="text-center md:text-left flex-1">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4 tracking-tighter">
          ${hero.name}.
        </h1>
        <h2 class="text-xl md:text-2xl lg:text-3xl text-gray-400 mb-8 font-light tracking-wide">
          ${role}
        </h2>
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md text-sm text-gray-300 shadow-sm">
            <i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>
            ${hero.location}
          </div>
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md text-sm text-gray-300 shadow-sm">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            ${ui.hero.availability}
          </div>
        </div>
        <p class="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10">
          ${bio}
        </p>
        <a href="#about" class="cta-btn redirect inline-flex items-center justify-center relative overflow-hidden group" name="about">
          <span class="relative z-10">${ui.hero.cta}</span>
          <span class="absolute inset-0 bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))] opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-0"></span>
        </a>
      </div>
      ${
        hero.image
          ? `<div class="hero-img-wrap relative flex-shrink-0 mt-4 md:mt-0"><img src="${hero.image}" alt="${imageAlt}" class="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover hero-img-inner shadow-2xl" /></div>`
          : ""
      }
    </div>
  `;
}

function renderAbout(about, ui) {
  const container = document.getElementById("about-content");
  if (!about || !container) return;

  const paragraphs = getLocalizedValue(about.text) ?? [];
  const cvUrl = getLocalizedValue(about.cvUrl);

  let html = `
    <div class="glass-card p-6 mb-8 relative overflow-hidden group/cv group about-me-card">
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-0 transition-opacity duration-300" style="background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.08), transparent 40%)"></div>
      ${paragraphs.map((paragraph) => `<p class="text-gray-500 leading-relaxed relative z-10 mb-4 last:mb-0">${paragraph}</p>`).join("")}

      <div class="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <p class="text-sm text-gray-400 flex items-center gap-2">
          <i data-lucide="file-badge" class="w-5 h-5 text-blue-400 animate-pulse"></i>
          ${ui.about.cvNote}
        </p>
        <a href="${cvUrl || "#"}" target="_blank" rel="noopener noreferrer" class="cta-btn !px-5 !py-2.5 !text-sm !mt-0 relative inline-flex items-center justify-center gap-2 group/btn hover:-translate-y-1 transition-transform">
          <span class="absolute inset-0 bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))] opacity-0 blur-lg transition-all duration-500 group-hover/btn:opacity-100 group-hover/btn:blur-md rounded-[inherit]"></span>
          <span class="relative z-10 flex items-center gap-2 whitespace-nowrap">
            <i data-lucide="download" class="w-4 h-4"></i>
            ${ui.about.downloadCv}
          </span>
        </a>
      </div>

      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover/cv:bg-blue-500/20 transition-colors duration-500 pointer-events-none"></div>
    </div>
  `;

  if (about.stats && about.stats.length > 0) {
    html += `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${about.stats
          .map(
            (stat) => `
          <div class="stat-card glass-card relative overflow-hidden p-6 flex flex-col items-center justify-center text-center gap-3 group">
            <div class="spotlight absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-0" style="background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.15), transparent 40%)"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

            <div class="stat-card-icon relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300 shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <i data-lucide="${stat.icon}" class="w-7 h-7"></i>
            </div>

            <div class="stat-card-content relative z-10 mt-2">
              <h3 class="text-2xl md:text-2xl font-bold text-gray-300 tracking-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${getLocalizedValue(stat.value)}</h3>
              <p class="text-xs font-medium text-gray-400 tracking-widest uppercase mt-1 opacity-80 group-hover:opacity-100 transition-opacity">${getLocalizedValue(stat.label)}</p>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderExperience(experience, ui) {
  const container = document.getElementById("experience-list");
  container.innerHTML = experience
    .map((exp, index) => {
      const role = getLocalizedValue(exp.role);
      const company = getLocalizedValue(exp.company);
      const description = getLocalizedValue(exp.description);
      const achievements = getLocalizedValue(exp.achievements) ?? [];

      return `
        <button type="button" class="experience-toggle glass-card relative overflow-hidden p-6 cursor-pointer group hover:-translate-y-2 transition-all duration-300 hover:bg-white/[0.03]" data-exp-toggle aria-expanded="false" aria-controls="experience-details-${index}">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h3 class="text-lg font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${role}</h3>
            <span class="text-sm text-gray-500 font-mono group-hover:text-blue-400 transition-colors duration-300">${getLocalizedValue(exp.period)}</span>
          </div>
          <h4 class="relative z-10 text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">${company}</h4>
          <p class="relative z-10 text-gray-500 text-sm leading-relaxed">${description}</p>

          <div id="experience-details-${index}" class="relative z-10 grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-[.expanded]:grid-rows-[1fr]">
            <div class="overflow-hidden opacity-0 transition-opacity duration-500 ease-in-out group-[.expanded]:opacity-100">
              <div class="mt-6 pt-6 border-t border-white/10">
                ${
                  achievements.length > 0
                    ? `
                  <div class="mb-6">
                    <h5 class="text-white font-medium mb-3 text-sm">${ui.experience.achievements}</h5>
                    <ul class="list-disc list-inside text-sm text-gray-400 space-y-2">
                      ${achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
                    </ul>
                  </div>`
                    : ""
                }

                ${
                  exp.techStack && exp.techStack.length > 0
                    ? `
                  <div>
                    <h5 class="text-white font-medium mb-3 text-sm">${ui.experience.techStack}</h5>
                    <div class="flex flex-wrap gap-2">
                      ${exp.techStack
                        .map(
                          (tech) => `
                        <span class="relative overflow-hidden px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                          <span class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span class="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${tech}</span>
                        </span>`,
                        )
                        .join("")}
                    </div>
                  </div>`
                    : ""
                }
              </div>
            </div>
          </div>

          <div class="relative z-10 flex justify-end mt-4">
            <i data-lucide="chevron-down" class="w-5 h-5 text-gray-500 transition-transform duration-500 ease-in-out group-[.expanded]:rotate-180 group-hover:text-blue-400"></i>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderSkills(skills) {
  const container = document.getElementById("skills-list");
  container.innerHTML = skills
    .map((skill) => {
      const skillName = getLocalizedValue(skill.name);
      return `
        <div class="glass-card relative overflow-hidden p-6 flex flex-col items-center justify-center text-center gap-3 group hover:-translate-y-2 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <i class="${skill.icon} text-4xl text-gray-400 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-300 relative z-10"></i>

          <div class="relative z-10 mt-2">
            <span class="text-sm font-medium text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${skillName}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderProjects(projects, ui) {
  const container = document.getElementById("projects-list");
  container.innerHTML = projects
    .map((project) => {
      const title = getLocalizedValue(project.title);
      const description = getLocalizedValue(project.description);

      return `
        <div class="glass-card project-card-glow flex flex-col h-full overflow-hidden relative group hover:-translate-y-2 transition-transform duration-300">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-300" style="background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.1), transparent 40%)"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"></div>
          ${project.image ? `<img src="${project.image}" alt="${title}" class="w-full h-48 object-cover border-b border-white/5 relative z-20" />` : ""}
          <div class="p-6 flex flex-col flex-grow relative z-20">
            <h3 class="text-lg font-medium text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${title}</h3>
            <p class="text-sm text-gray-500 mb-6 flex-grow group-hover:text-gray-300 transition-colors duration-300">${description}</p>
            <div class="flex flex-wrap gap-2 mb-6">
              ${project.tech.map((tech) => `<span class="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors duration-300">${tech}</span>`).join("")}
            </div>
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors w-fit relative z-30 group-hover:text-blue-400 transition-colors duration-300">
              ${ui.projects.viewProject}
              <i data-lucide="arrow-up-right" class="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"></i>
            </a>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderEducation(education) {
  const container = document.getElementById("education-list");
  container.innerHTML = education
    .map((item) => {
      const degree = getLocalizedValue(item.degree);
      const institution = getLocalizedValue(item.institution);

      return `
        <div class="glass-card relative overflow-hidden p-6 flex flex-col md:flex-row md:justify-between md:items-center group hover:-translate-y-2 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"></div>
          <div class="relative z-10">
            <h3 class="text-lg font-medium text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">${degree}</h3>
            <p class="text-gray-500 group-hover:text-gray-300 transition-colors duration-300">${institution}</p>
          </div>
          <span class="text-sm text-gray-500 font-mono mt-2 md:mt-0 relative z-10 group-hover:text-blue-400 transition-colors duration-300">${getLocalizedValue(item.period)}</span>
        </div>
      `;
    })
    .join("");
}

function renderCertifications(certifications, ui) {
  certificationsData = certifications;
  currentCertIndex = 0;

  const container = document.getElementById("certifications-list");
  if (!certifications || !container) return;

  container.innerHTML = `
    <div class="relative glass-card overflow-hidden group">
      <div id="cert-carousel-track" class="flex overflow-x-auto overflow-y-hidden touch-pan-y snap-x snap-mandatory scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        ${certifications
          .map((cert, idx) => {
            const title = getLocalizedValue(cert.title);
            const issuer = getLocalizedValue(cert.issuer);
            const noImageText = ui.certifications.noImage;

            return `
              <div class="w-full flex-shrink-0 snap-center relative group/slide overflow-hidden" id="cert-slide-${idx}">
                ${
                  cert.image
                    ? `<img src="${cert.image}" alt="${title}" class="w-full h-80 md:h-[500px] object-cover object-center border-b border-white/5 transition-transform duration-700 group-hover/slide:scale-105" />`
                    : `<div class="w-full h-80 md:h-[500px] bg-white/5 flex items-center justify-center border-b border-white/5"><i data-lucide="image" class="w-12 h-12 text-gray-500"></i><span class="ml-3 text-gray-500">${noImageText}</span></div>`
                }

                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10"></div>

                <div class="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:justify-between md:items-end z-20">
                  <div>
                    <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-md">${title}</h3>
                    <p class="text-gray-300 drop-shadow-md">${issuer}</p>
                  </div>
                  <span class="inline-block px-4 py-1.5 mt-4 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white font-mono shadow-lg">${cert.year}</span>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="absolute inset-y-0 left-0 flex items-center z-30">
        <button type="button" data-cert-prev class="ml-4 p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-lg" aria-label="${ui.certifications.previous}">
          <i data-lucide="chevron-left" class="w-6 h-6"></i>
        </button>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center z-30">
        <button type="button" data-cert-next class="mr-4 p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-lg" aria-label="${ui.certifications.next}">
          <i data-lucide="chevron-right" class="w-6 h-6"></i>
        </button>
      </div>
    </div>

    <div class="flex justify-center gap-3 mt-6" id="cert-indicators">
      ${certifications
        .map(
          (_, idx) => `
        <button type="button" id="cert-indicator-${idx}" data-cert-go="${idx}" aria-label="${interpolate(ui.certifications.goToSlide, { index: idx + 1 })}" class="h-2 rounded-full transition-all duration-500 ease-in-out ${idx === 0 ? "bg-blue-500 w-10" : "bg-white/20 hover:bg-white/40 w-2"}"></button>
      `,
        )
        .join("")}
    </div>
  `;

  const track = document.getElementById("cert-carousel-track");
  let isScrolling;

  container.querySelector("[data-cert-prev]")?.addEventListener("click", () => {
    prevCertification();
  });

  container.querySelector("[data-cert-next]")?.addEventListener("click", () => {
    nextCertification();
  });

  container.querySelectorAll("[data-cert-go]").forEach((button) => {
    button.addEventListener("click", () => {
      goToCertification(Number(button.dataset.certGo));
    });
  });

  track.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      const scrollPos = track.scrollLeft;
      const slideWidth = track.clientWidth;
      const newIndex = Math.round(scrollPos / slideWidth);
      if (
        newIndex !== currentCertIndex &&
        newIndex >= 0 &&
        newIndex < certificationsData.length
      ) {
        currentCertIndex = newIndex;
        updateIndicators();
      }
    }, 50);
  });
}

function updateIndicators() {
  certificationsData.forEach((_, idx) => {
    const indicator = document.getElementById(`cert-indicator-${idx}`);
    if (!indicator) return;

    indicator.className =
      idx === currentCertIndex
        ? "h-2 rounded-full transition-all duration-500 ease-in-out bg-blue-500 w-10"
        : "h-2 rounded-full transition-all duration-500 ease-in-out bg-white/20 hover:bg-white/40 w-2";
  });
}

function prevCertification() {
  currentCertIndex =
    currentCertIndex === 0
      ? certificationsData.length - 1
      : currentCertIndex - 1;
  scrollToCurrentCert();
}

function nextCertification() {
  currentCertIndex =
    currentCertIndex === certificationsData.length - 1
      ? 0
      : currentCertIndex + 1;
  scrollToCurrentCert();
}

function goToCertification(index) {
  currentCertIndex = index;
  scrollToCurrentCert();
}

function scrollToCurrentCert() {
  const track = document.getElementById("cert-carousel-track");
  if (!track) return;

  const slideWidth = track.clientWidth;
  track.scrollTo({
    left: currentCertIndex * slideWidth,
    behavior: "smooth",
  });
  updateIndicators();
}

function renderSocials(socials) {
  const container = document.getElementById("social-links");
  container.innerHTML = socials
    .map((social) => {
      const label = getLocalizedValue(social.label);

      return `
        <a href="${social.url}" aria-label="${label}" class="group w-10 h-10 rounded-full bg-white/5 border border-transparent flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
          ${
            social.icon.startsWith("devicon-")
              ? `<i class="${social.icon} text-xl transition-transform duration-300 group-hover:scale-110"></i>`
              : `<i data-lucide="${social.icon}" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"></i>`
          }
        </a>
      `;
    })
    .join("");
}

function initAnimations() {
  const sections = document.querySelectorAll(".animate-section");
  sections.forEach((section) => {
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  });
}

document.addEventListener("DOMContentLoaded", loadData);

function initHoverEffects() {
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    });
  });

  const trackingCards = document.querySelectorAll(
    ".project-card-glow, .about-me-card",
  );
  trackingCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    });
  });
}
