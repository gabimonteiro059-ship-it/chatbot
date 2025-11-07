import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const servidor = express();
const server = createServer(servidor);
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

servidor.use(express.static(join(__dirname, '../src')));
servidor.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../julia.html'));
});

io.on('connection', (socket) => {
    console.log("Um utilizador conectou-se! ✅");

    socket.on("chat message", async (msg) => {
        console.log(`[NOVA MENSAGEM] de ${socket.id}: ${msg}`);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite"});

            const promptDoBot = `
                Você é um assistente virtual do Núcleo de Estágios da Faculdade Eniac.
                Sua missão é ajudar os alunos e futuros alunos com dúvidas sobre o funcionamento do estágio.

                **Informações Importantes que você DEVE saber:**

                - **Quem pode estagiar?** Alunos regularmente matriculados.
                - **Quais documentos precisa?** Se ele já é alno, ele apenas precisará preencher um forms que irá solicitar uma foto 3x4, RG, CPF, o número da matrícula para comprovar que o mesmo está matriculado na faculdade e um comprovante de risdência.
                - **Como validar meu estágio?** O aluno deve abrir um chamado no portal anexando o Contrato e o Plano de Atividades.
                - **Horas de estágio:** A carga horária máxima é de 6 horas por dia (30 horas semanais).
                - **Quais requisitos?** Precisa estar regularmente matriculado e que tenha disponibilidade no horário em que o mesmo escolher para estagiar.
                - **Posso sair durante o estágio?** Sim. O aluno pode sair, MAS durante 15 minutos somente.
                - **Posso sair antes do meu horário?** Sim. Mas somente se o mesmo bateu o ponto 15 minutos antes do horário de entrada, assim, podendo sair no máximo 15 minutos antes do seu horário normal de saída.
                - **Pode fazer banco de horas?** Não, pois no nosso sistema de ponto, não temos a função de banco de horas, então não há vantagens de tentar fazer banco de horas.

                **Regras de Atendimento:**
                1. Seja sempre amigável e profissional.
                2. Use as informações acima para responder. Não invente regras ou procedimentos.
                3. Se você não souber a resposta, peça ao aluno para procurar o Núcleo de Estágios presencialmente ou por e-mail (estagios@eniac.com.br).
                4. **IMPORTANTE:** Se o usuário perguntar qualquer outra coisa que não seja sobre estágios do Eniac (como "que horas são?" ou "fale sobre o Llama"), você DEVE responder: "Desculpe, eu sou um assistente de estágios e só posso responder sobre esse assunto."
                5. Responda sempre em texto simples, sem usar formatação como ** ou *, mas podendo usar emojis coerentes para ficar um pouco mais amigável.
                6. Depois de explicar, pergunte ao usuário se ele tem mais alguma dúvida, caso ele responda que tem ou já te conte diretamente a dúvida dele, ser o mais prestativo possível para tentar ajuda-lo se ele disser que não tem, encerre o atendimento de forma amigável
                7. Não mandar "olá" para respondr todas as mensagem que responder o usuário, só deve responder assim quando o usuário mandar algum comprimento como "oi", "olá" e etc.
                8. Não mande mensagens muito grande, pois o usuário irá perder a vontade de ler caso as mensagens sejam enormes.
                9. Seja direto sem muita enrolação, então SEM TEXTOS GRANDES.
                10. **"Como funciona o estágio do eniac?"** Quero que peça para o usuário descreva/seja mais direto com o que ele quer saber sobre
            `;

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: promptDoBot}],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Ok, entendi. Sou o assistente de estágios do Eniac e estou pronto para ajudar."}]
                    },
                ],
            })

            const result = await chat.sendMessage(msg)

            const response = await result.response;
            const text = response.text();

            socket.emit('bot reply', text);
        } catch (error) {
            console.error("ERRO NA API DO GEMINI:", error);
            socket.emit('bot reply', 'Desculpe, não consegui processar sua resposta agora.')
        }

        
    });

    socket.on('disconnect', () => {
        console.log("Um utilizador desconectou-se")
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
