const input = document.getElementById("mensagem");
const btn = document.getElementById("enviar");
const chatBox = document.getElementById("chat-box");

btn.addEventListener("click", enviarMensagem);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensagem();
});

function adicionarMensagem(texto, classe) {
  const div = document.createElement("div");
  div.classList.add("mensagem", classe);
  div.textContent = texto;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function enviarMensagem() {
  const texto = input.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, "usuario");
  input.value = "";

  adicionarMensagem("Digitando...", "bot");

  try {
    const resposta = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: texto }),
    });

    const data = await resposta.json();
    chatBox.lastChild.remove();
    adicionarMensagem(data.resposta, "bot");
  } catch {
    chatBox.lastChild.remove();
    adicionarMensagem("❌ Erro ao se conectar ao servidor.", "bot");
  }
}
