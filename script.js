document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DO SCROLL SPY (JÁ EXISTENTE) ---
  const sections = document.querySelectorAll("section[id]");
  const navLinksDesktop = document.querySelectorAll(".nav-links a");

  function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 71) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinksDesktop.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  // --- NOVA LÓGICA PARA O MENU HAMBÚRGUER ---
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  // 1. Alterna a classe 'active' no menu quando o hambúrguer é clicado
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  // 2. Fecha o menu quando um dos links é clicado
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Verifica se o menu está ativo antes de tentar removê-lo
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
      }
    });
  });
});
