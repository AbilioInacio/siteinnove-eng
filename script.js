document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Função para atualizar o link ativo no menu
  function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      // O 71 é a altura do navbar + 1px para garantir a troca no momento certo
      if (pageYOffset >= sectionTop - 71) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      // Verifica se o href do link contém o ID da seção atual
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  // Adiciona o listener de scroll na janela
  window.addEventListener("scroll", updateActiveLink);

  // Chama a função uma vez para definir o estado inicial
  updateActiveLink();
});
