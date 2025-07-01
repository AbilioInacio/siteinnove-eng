document.addEventListener("DOMContentLoaded", () => {
  // --- Função para carregar o rodapé ---
  const loadFooter = () => {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      fetch("footer.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Não foi possível carregar o rodapé.");
          }
          return response.text();
        })
        .then((data) => {
          footerPlaceholder.innerHTML = data;
        })
        .catch((error) => {
          console.error("Erro ao carregar o rodapé:", error);
          footerPlaceholder.innerHTML =
            '<p style="text-align:center; color:red;">Erro ao carregar o conteúdo do rodapé.</p>';
        });
    }
  };

  // --- Funcionalidade do FAQ (Perguntas Frequentes) ---
  const setupFaq = () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");

      question.addEventListener("click", () => {
        const answer = item.querySelector(".faq-answer");
        const isActive = question.classList.contains("active");

        if (isActive) {
          question.classList.remove("active");
          answer.style.maxHeight = null;
        } else {
          question.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  };

  // Executa as funções
  loadFooter();
  setupFaq();
});
