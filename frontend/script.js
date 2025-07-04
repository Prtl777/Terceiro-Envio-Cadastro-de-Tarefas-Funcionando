class Tarefa {
  #status;

  constructor(titulo, descricao, responsavel, status = "Pendente") {
    if (!titulo || !descricao || !responsavel) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    this.titulo = titulo;
    this.descricao = descricao;
    this.responsavel = responsavel;
    this.#status = status;
  }

  get status() {
    return this.#status;
  }

  alterarStatus() {
    const estados = ["Pendente", "Em Andamento", "Concluída"];
    const idx = estados.indexOf(this.#status);
    this.#status = estados[(idx + 1) % estados.length];
  }

  toJSON() {
    return {
      titulo: this.titulo,
      descricao: this.descricao,
      responsavel: this.responsavel,
      status: this.#status
    };
  }
}

const tarefas = carregarTarefas();

document.getElementById("tarefa-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const responsavel = document.getElementById("responsavel").value;

  try {
    const novaTarefa = new Tarefa(titulo, descricao, responsavel);
    tarefas.push(novaTarefa);
    salvarTarefas();
    atualizarTabela();
    e.target.reset();
  } catch (erro) {
    alert(erro.message);
  }
});

function atualizarTabela() {
  const tbody = document.querySelector("#tabela-tarefas tbody");
  tbody.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tarefa.titulo}</td>
      <td>${tarefa.responsavel}</td>
      <td>${tarefa.status}</td>
      <td>
        <button onclick="alterarStatus(${index})">Alterar Status</button>
        <button onclick="removerTarefa(${index})">Remover</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  atualizarResumo();
}

function alterarStatus(index) {
  tarefas[index].alterarStatus();
  salvarTarefas();
  atualizarTabela();
}

function removerTarefa(index) {
  tarefas.splice(index, 1);
  salvarTarefas();
  atualizarTabela();
}

function atualizarResumo() {
  const contagem = { "Pendente": 0, "Em Andamento": 0, "Concluída": 0 };
  tarefas.forEach(t => contagem[t.status]++);
  document.getElementById("resumo-status").textContent =
    `Pendente: ${contagem["Pendente"]} | Em Andamento: ${contagem["Em Andamento"]} | Concluída: ${contagem["Concluída"]}`;
}

function salvarTarefas() {
  const tarefasJSON = tarefas.map(t => t.toJSON());
  localStorage.setItem("tarefas", JSON.stringify(tarefasJSON));
}

function carregarTarefas() {
  const dados = JSON.parse(localStorage.getItem("tarefas")) || [];
  return dados.map(t => new Tarefa(t.titulo, t.descricao, t.responsavel, t.status));
}

// Carrega tarefas salvas ao abrir a página
atualizarTabela();
