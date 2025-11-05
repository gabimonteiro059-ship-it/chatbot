// Acessa os elementos do HTML pelo ID
const togglerButton = document.getElementById('chatbot-toggler');
const chatbotWindow = document.getElementById('chatbot-window');
const body = document.body;

// Função que será executada ao clicar no botão
function toggleChatbot() {
    // Verifica se a janela do chatbot está visível
    const isVisible = chatbotWindow.style.display === 'flex';
    
    if (isVisible) {
        // Se estiver visível, esconde
        chatbotWindow.style.display = 'none';
        
        // Opcional: altera o ícone do botão (de 💬 para X ou vice-versa)
        togglerButton.textContent = '💬';
        
    } else {
        // Se estiver escondida, mostra
        chatbotWindow.style.display = 'flex';
        
        // Opcional: Altera o ícone do botão para um 'X' de fechar
        togglerButton.textContent = '✖'; 
    }
}

// Adiciona um "ouvinte de evento" (event listener) ao botão
// Quando o botão for clicado, a função 'toggleChatbot' será chamada
togglerButton.addEventListener('click', toggleChatbot);

// --- Alternativa mais moderna (usando uma classe CSS) ---
/*
    Se você preferir a lógica de adicionar/remover uma classe no body (como no CSS acima),
    o JS ficaria assim:
    
    function toggleChatbotClass() {
        body.classList.toggle('show-chatbot'); // Adiciona ou remove a classe 'show-chatbot' do <body>
        
        // Altera o ícone do botão
        if (body.classList.contains('show-chatbot')) {
            togglerButton.textContent = '✖';
        } else {
            togglerButton.textContent = '💬';
        }
    }
    togglerButton.addEventListener('click', toggleChatbotClass);
*/