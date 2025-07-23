// Importa o SDK do Google
import { GoogleGenerativeAI } from "https://unpkg.com/@google/generative-ai";

// Obtém os elementos do HTML
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

// Variáveis globais para o chat
let genAI;
let chat;

// Função para adicionar uma mensagem na tela
function addMessage(sender, text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    sender === "user" ? "user-message" : "bot-message"
  );
  messageElement.innerText = text;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para carregar os arquivos de contexto
async function loadContext() {
  console.log("Carregando arquivos de contexto...");
  try {
    const [initialPrompt, moodRules, otherInfo] = await Promise.all([
      fetch("context/initial_prompt.txt").then((res) => res.text()),
      fetch("context/mood_rules.txt").then((res) => res.text()),
      fetch("context/other_info.txt").then((res) => res.text()),
    ]);
    console.log("Contexto carregado com sucesso.");
    return `${initialPrompt}\n\n${moodRules}\n\n${otherInfo}`;
  } catch (error) {
    console.error("ERRO CRÍTICO ao carregar o contexto:", error);
    addMessage(
      "bot",
      'Desculpe, não consegui carregar meu contexto inicial. Verifique se a pasta "context" e seus arquivos existem e se você está executando o projeto a partir de um servidor local.'
    );
    return null; // Retorna nulo para indicar falha
  }
}

// Função principal para inicializar o chat
async function initializeChat() {
  console.log("Iniciando o chat...");

  const apiKey = prompt("Por favor, insira sua chave de API do Gemini:");
  if (!apiKey) {
    alert("A chave de API é necessária para iniciar o chat.");
    console.warn("Inicialização cancelada: Nenhuma chave de API fornecida.");
    return;
  }
  console.log("Chave de API recebida.");

  try {
    const context = await loadContext();
    // Se o contexto não pôde ser carregado, interrompe a inicialização
    if (context === null) return;

    genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: context }] },
        {
          role: "model",
          parts: [{ text: "Olá! Como posso ajudar você hoje?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    addMessage("bot", "Olá! Como posso ajudar você hoje?");
    console.log("Chat inicializado com sucesso!");
  } catch (error) {
    console.error("ERRO AO INICIALIZAR O CHAT:", error);
    addMessage(
      "bot",
      "Ocorreu um erro ao iniciar o chat. Verifique sua chave de API e a conexão. Veja o console (F12) para mais detalhes."
    );
  }
}

// Event listener para o envio de mensagens do usuário
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();

  // Verifica se o chat foi inicializado e se há mensagem
  if (!chat || !userMessage) {
    return;
  }

  addMessage("user", userMessage);
  messageInput.value = "";

  // Adiciona uma mensagem de "digitando..." para o bot
  const typingMessage = addMessage("bot", "Digitando...");

  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    // Remove a mensagem "Digitando..." e adiciona a resposta real
    typingMessage.remove();
    addMessage("bot", text);
  } catch (error) {
    console.error("Erro ao enviar mensagem para a API:", error);
    typingMessage.remove();
    addMessage("bot", "Desculpe, ocorreu um erro ao processar sua mensagem.");
  }
});

// --- PONTO DE PARTIDA DA APLICAÇÃO ---
// Garante que o DOM está pronto antes de executar o script
document.addEventListener("DOMContentLoaded", (event) => {
  initializeChat();
});
