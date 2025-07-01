document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const answer = item.querySelector(".faq-answer");
      const isActive = question.classList.contains("active");

      // Opcional: Fechar outras perguntas abertas
      // faqItems.forEach(otherItem => {
      //     otherItem.querySelector('.faq-question').classList.remove('active');
      //     otherItem.querySelector('.faq-answer').style.maxHeight = null;
      // });

      if (isActive) {
        question.classList.remove("active");
        answer.style.maxHeight = null;
      } else {
        question.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});
