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

  const btnEmail = document.getElementById("btnContato");

  btnEmail.addEventListener("click", (event) => {
    event.preventDefault();
    console.clear();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const msg = document.getElementById("mensagem").value;

    const service = "service_05to81p";
    const template = "template_k7fk304";
    const user = "lXxeveM7Aru2-xXuf";

    if (nome != "" && email != "") {
      const mensagem =
        "Olá, Meu nome é " +
        nome +
        "\nmeu email é: " +
        email +
        "\nmensagem: " +
        msg;
      console.log(mensagem);

      const data = {
        service_id: service,
        template_id: template,
        user_id: user,
        template_params: {
          username: "Site Innove",
          message: mensagem,
        },
      };

      $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
      })
        .done(function () {
          alert("Seu e-mail foi enviado!");
        })
        .fail(function (error) {
          alert("Erro: " + JSON.stringify(error));
        });

      emailjs.init(user);
    } else {
      alert("preencha os campos");
      console.log("preencha os campos");
    }
  });
});
