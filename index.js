import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { gerarRespostaIA } from "./services/aiService.js";

dotenv.config();
const app = express();
app.use(express.json());
//teste
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ erro: "Mensagem não informada" });
  }

  try {
    const resposta = await gerarRespostaIA(mensagem);
    res.json({ resposta });
  } catch (erro) {
    console.error("Erro na IA:", erro);
    res.status(500).json({ erro: "Falha ao gerar resposta" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🤖 Chatbot rodando em http://localhost:${PORT}`)
);
