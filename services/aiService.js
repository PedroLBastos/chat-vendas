import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function gerarRespostaIA(messages) {
  try {
    if (typeof messages === "string") {
      messages = [{ role: "user", content: messages }];
    }

    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    const systemPrompt = `
    Você é um assistente de vendas com fluxo SEQUENCIAL.
    Leia todo o histórico e continue exatamente da etapa correta.

    ---- FLUXO ----
    1️⃣ Apresentar produtos (somente se ainda não apresentados).
    2️⃣ Esperar o cliente escolher um produto.
    3️⃣ Após a escolha, pedir:
         - email
    4️⃣ Perguntar a forma de pagamento.
         Aceitar SOMENTE:
            - pix (qualquer variação contendo "pix")
            - boleto (qualquer variação contendo "boleto")
         Se vier algo diferente, dizer:
            "Forma de pagamento inválida. Deseja pagar por pix ou boleto?"
         Quando a forma for válida, avance.
    5️⃣ Finalização:
         Responder exatamente:
         "Perfeito! Obrigado pela compra. Todas as instruções e detalhes foram enviados para o seu e-mail."
         Depois encerrar o fluxo.

    ---- Produtos ----
    - Notebook Gamer X15 – R$ 4.999
    - Smartphone Ultra S – R$ 2.499
    - Fone Bluetooth Pro – R$ 299
    - Smart TV 55" VisionMax – R$ 3.299
    - Caixa de Som Portátil SoundBox – R$ 399
    - Tablet MaxTab 10 – R$ 1.199

    ---- Regras ----
    - Nunca volte etapas já concluídas.
    - Nunca reapresente produtos se o usuário já escolheu.
    - Não peça nome/email se já tiver recebido.
    - Na etapa 4, só aceite "pix" ou "boleto".
    - Ao receber a forma de pagamento válida, finalize.
    - Responda de forma curta, amigável e objetiva.
    `;

    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    });

    return resposta.choices[0].message.content;

  } catch (erro) {
    console.error("Erro na IA:", erro);
    return "Erro ao gerar resposta da IA.";
  }
}
