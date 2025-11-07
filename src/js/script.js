/* JAVASCRIPT AJUSTADO PARA O SEU HTML */

// --- PARTE 1: LÓGICA DE ABRIR/FECHAR O CHAT ---

// Acessa os elementos do HTML
const togglerButton = document.getElementById('chatbot-toggler');
const chatbotWindow = document.getElementById('chatbot-window');

// Função que será executada ao clicar no botão
function toggleChatbot() {
    const isVisible = chatbotWindow.style.display === 'flex';
    
    if (isVisible) {
        chatbotWindow.style.display = 'none';
        togglerButton.innerHTML = '<i class="fa-solid fa-robot"></i>'; // Ícone para "abrir"
    } else {
        chatbotWindow.style.display = 'flex';
        togglerButton.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Ícone para "fechar"
    }
}

// Adiciona o 'ouvinte de clique' ao botão flutuante
togglerButton.addEventListener('click', toggleChatbot);

// --- PARTE 2: LÓGICA DO CHAT (SOCKET.IO) ---

// Inicializa o socket (isso requer a biblioteca do socket.io)
const socket = io();

// Acessa os elementos do chat no HTML usando os seletores corretos
const messagesList = document.querySelector('.chat-body');
const inputField = document.querySelector('.inputMessage');
const sendButton = document.querySelector('.enviarMensagem');

// Flag para saber se é a primeira mensagem (para limpar o "Olá!")
let isFirstMessage = true;

// Função principal para enviar a mensagem
function sendMessage() {
    const msg = inputField.value; // Pega o texto do campo
    
    if (msg.trim()) { // Verifica se a mensagem não está vazia
        addMessage(msg, 'user'); // Adiciona a mensagem do usuário à tela
        socket.emit('chat message', msg); // Envia a mensagem para o servidor (backend)
        inputField.value = ''; // Limpa o campo de input
    }
}

// Adiciona 'ouvinte' para o clique no botão Enviar
sendButton.addEventListener('click', sendMessage);

// Adiciona 'ouvinte' para a tecla 'Enter' no campo de input
inputField.addEventListener('keypress', (e) => {
    // Verifica se a tecla pressionada foi 'Enter'
    if (e.key === 'Enter') {
        e.preventDefault(); // Impede o comportamento padrão (quebrar linha)
        sendMessage();
    }
});

// Ouve por respostas do bot ('bot reply') vindas do servidor
socket.on('bot reply', (msg) => {
    addMessage(msg, 'bot');
});

// Função para adicionar uma nova mensagem na tela
function addMessage(msg, type) {
    // Se for a primeira mensagem, limpa o conteúdo inicial ("Olá!...")
    if (isFirstMessage) {
        messagesList.innerHTML = '';
        isFirstMessage = false;
    }

    // Cria um novo elemento <p> para a mensagem
    const messageElement = document.createElement('p');
    messageElement.textContent = msg;
    
    // Adiciona a classe 'user' ou 'bot' (para o CSS poder estilizar)
    messageElement.classList.add(type); 
    
    // Adiciona a nova mensagem à lista
    messagesList.appendChild(messageElement);
    
    // Rola a caixa de chat automaticamente para a última mensagem
    messagesList.scrollTop = messagesList.scrollHeight;
}