// Aguarda o carregamento completo da página para iniciar o script
document.addEventListener("DOMContentLoaded", () => {
  // Elementos da interface do chat
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  let geminiApiKey = "";

  // ALTERADO: Variáveis separadas para instruções e conhecimento
  let systemInstruction = "";
  let knowledgeBase = "";

  // Lista de arquivos de contexto para carregar automaticamente
  const contextFileNames = [
    "prompt-inicial.txt",
    "base-conhecimento-geral.txt",
    "base-conhecimento-licenciamento.txt",
  ];

  // Função principal que inicializa o chat
  async function initializeChat() {
    geminiApiKey = window.prompt(
      "Por favor, insira sua chave da API do Google Gemini para iniciar:"
    );

    if (!geminiApiKey || geminiApiKey.trim() === "") {
      addMessage(
        "bot",
        "A chave da API é necessária para iniciar. Por favor, recarregue a página e tente novamente."
      );
      return;
    }

    addMessage("bot", "Chave recebida. Carregando a base de conhecimento...");

    try {
      // ALTERADO: Lógica de carregamento para separar os contextos
      for (const fileName of contextFileNames) {
        const response = await fetch(`./context/${fileName}`);
        if (!response.ok) {
          throw new Error(`Não foi possível encontrar o arquivo: ${fileName}`);
        }
        const text = await response.text();

        // Coloca o conteúdo do prompt inicial na variável de instrução do sistema
        if (fileName === "prompt-inicial.txt") {
          systemInstruction = text;
        } else {
          // Acumula o resto dos arquivos na base de conhecimento
          knowledgeBase += text + "\n\n---\n\n";
        }
      }

      // Extrai a mensagem de boas-vindas da instrução do sistema
      const welcomeMessageMatch = systemInstruction.match(
        /Exemplo de Mensagem de Abertura:\s*([\s\S]*)/i
      );
      const welcomeMessage = welcomeMessageMatch
        ? welcomeMessageMatch[1].trim()
        : "Olá! Como posso ajudar?";

      addMessage("bot", welcomeMessage);

      // Habilita a interface do usuário
      userInput.disabled = false;
      sendBtn.disabled = false;
      userInput.placeholder = "Digite sua mensagem...";
    } catch (error) {
      console.error("Erro ao carregar contexto:", error);
      addMessage(
        "bot",
        `Ocorreu um erro ao carregar a base de conhecimento: ${error.message}`
      );
    }
  }

  // Adiciona uma mensagem na interface do chat
  function addMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Envia a mensagem para a API Gemini
  async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage || !geminiApiKey) return;

    addMessage("user", userMessage);
    userInput.value = "";

    try {
      // ALTERADO: Estrutura da requisição para usar system_instruction
      const fullUserPrompt = `Base de conhecimento para consulta:\n${knowledgeBase}\n\nHistórico da Conversa:\n${getChatHistory()}\n\nPergunta Atual do Usuário: ${userMessage}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // NOVO: Campo de instrução do sistema para definir a persona e regras
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: [
              {
                parts: [{ text: fullUserPrompt }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erro na resposta da API.");
      }

      const data = await response.json();
      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Desculpe, não consegui processar uma resposta.";
      addMessage("bot", botResponse);
    } catch (error) {
      console.error("Erro ao chamar a API Gemini:", error);
      addMessage(
        "bot",
        `Desculpe, ocorreu um erro ao se comunicar com a IA: ${error.message}`
      );
    }
  }

  // Função auxiliar para pegar o histórico simples da conversa
  function getChatHistory() {
    // Pega apenas as últimas 6 mensagens para não sobrecarregar o prompt
    const messages = Array.from(
      chatBox.querySelectorAll(".chat-message")
    ).slice(-6);
    return messages
      .map((msg) => {
        const prefix = msg.classList.contains("user-message")
          ? "Usuário:"
          : "Fernando Haddad:";
        return `${prefix} ${msg.textContent}`;
      })
      .join("\n");
  }

  // Event Listeners
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Inicia o processo de configuração do chat
  initializeChat();
});
