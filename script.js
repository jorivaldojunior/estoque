
// =============================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÕES INICIAIS
// =============================================
let idProduto = localStorage.getItem("ultimoId") ? parseInt(localStorage.getItem("ultimoId")) + 1 : 1;
let produtoAtual;
let carrinho = [];
let produtoAtualParaPedido = null;

// Lista de imagens para o slideshow de fundo
const backgroundImages = [
  "./image/13.png",
  "./image/12.jpg",
  "./image/2.webp"
];

// =============================================
// FUNÇÕES DE NAVEGAÇÃO E INICIALIZAÇÃO
// =============================================

function navigateToListaProdutos() {
  document.getElementById("cadastroProdutoScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.add("hidden");
  document.getElementById("listaProdutosScreen").classList.remove("hidden");
  exibirProdutos();
}

function navigateToCadastroProduto() {
  document.getElementById("listaProdutosScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.add("hidden");
  document.getElementById("cadastroProdutoScreen").classList.remove("hidden");
}

function navigateToEstoqueZerado() {
  document.getElementById("listaProdutosScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.remove("hidden");
  exibirEstoqueZerado();
}

// =============================================
// FUNÇÕES DE PRODUTO (CRUD)
// =============================================

function gerarId() {
  return idProduto.toString().padStart(3, "0");
}

function cadastrarProduto() {
  const nome = document.getElementById("nomeProduto").value;
  const marca = document.getElementById("marcaProduto").value;
  const quantidade = document.getElementById("quantidadeProduto").value;
  const dataRecebimento = document.getElementById("dataRecebimento").value;

  if (nome && marca && quantidade && dataRecebimento) {
    const id = gerarId();

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos.push({
      id,
      nome,
      marca,
      quantidade,
      dataRecebimento,
      ultimaMovimentacao: "",
      colaborador: "",
    });
    localStorage.setItem("produtos", JSON.stringify(produtos));
    localStorage.setItem("ultimoId", idProduto);
    idProduto++;

    Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
    document.getElementById("produtoForm").reset();
  } else {
    Swal.fire("Erro!", "Preencha todos os campos.", "error");
  }
}

function exibirProdutos() {
  const listaProdutos = document.getElementById("listaProdutos");
  listaProdutos.innerHTML = "";

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.forEach((produto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${produto.id}</td>
      <td class="border px-4 py-2">${produto.nome}</td>
      <td class="border px-4 py-2">${produto.marca}</td>
      <td class="border px-4 py-2">${produto.quantidade}</td>
      <td class="border px-4 py-2">${produto.dataRecebimento}</td>
      <td class="border px-4 py-2">${produto.ultimaMovimentacao || "N/A"}</td>
      <td class="border px-4 py-2">${produto.colaborador || "N/A"}</td>
      <td class="border px-4 py-2">
        <button onclick="abrirModalPedir('${produto.id}')" class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Pedir</button>
        <button onclick="abrirModalEditar('${produto.id}')" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Editar</button>
        <button onclick="confirmarExclusao('${produto.id}')" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Excluir</button>
      </td>
    `;
    listaProdutos.appendChild(row);
  });
}

function exibirEstoqueZerado() {
  const listaEstoqueZerado = document.getElementById("listaEstoqueZerado");
  listaEstoqueZerado.innerHTML = "";

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const produtosZerados = produtos.filter((produto) => produto.quantidade == 0);

  if (produtosZerados.length > 0) {
    produtosZerados.forEach((produto) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-4 py-2">${produto.id}</td>
        <td class="border px-4 py-2">${produto.nome}</td>
        <td class="border px-4 py-2">${produto.marca}</td>
        <td class="border px-4 py-2">${produto.quantidade}</td>
        <td class="border px-4 py-2">${produto.dataRecebimento}</td>
        <td class="border px-4 py-2">${produto.ultimaMovimentacao || "N/A"}</td>
        <td class="border px-4 py-2">${produto.colaborador || "N/A"}</td>
      `;
      listaEstoqueZerado.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7" class="border px-4 py-2 text-center">Nenhum produto com estoque zerado.</td>`;
    listaEstoqueZerado.appendChild(row);
  }
}

// =============================================
// FUNÇÕES DE EDIÇÃO E EXCLUSÃO
// =============================================

function abrirModalEditar(id) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtoAtual = produtos.find((produto) => produto.id === id);

  if (produtoAtual) {
    document.getElementById("editarNome").value = produtoAtual.nome;
    document.getElementById("editarMarca").value = produtoAtual.marca;
    document.getElementById("editarQuantidade").value = produtoAtual.quantidade;
    document.getElementById("editarDataRecebimento").value = produtoAtual.dataRecebimento;
    document.getElementById("nomeColaborador").value = "";

    document.getElementById("editarModal").classList.remove("hidden");
  }
}

function atualizarProduto() {
  const nome = document.getElementById("editarNome").value;
  const marca = document.getElementById("editarMarca").value;
  const quantidade = document.getElementById("editarQuantidade").value;
  const nomeColaborador = document.getElementById("nomeColaborador").value;
  const dataMovimentacao = new Date().toLocaleString();

  if (nome && marca && quantidade !== "" && nomeColaborador) {
    produtoAtual.nome = nome;
    produtoAtual.marca = marca;
    produtoAtual.quantidade = quantidade;
    produtoAtual.ultimaMovimentacao = dataMovimentacao;
    produtoAtual.colaborador = nomeColaborador;

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos = produtos.map((produto) =>
      produto.id === produtoAtual.id ? produtoAtual : produto
    );
    localStorage.setItem("produtos", JSON.stringify(produtos));

    exibirProdutos();
    fecharModal();
    Swal.fire("Sucesso!", "Produto atualizado com sucesso!", "success");
  } else {
    Swal.fire("Erro!", "Preencha todos os campos.", "error");
  }
}

function fecharModal() {
  document.getElementById("editarModal").classList.add("hidden");
}

function confirmarExclusao(id) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Você não poderá reverter esta ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      excluirProduto(id);
    }
  });
}

function excluirProduto(id) {
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos = produtos.filter((produto) => produto.id !== id);
  localStorage.setItem("produtos", JSON.stringify(produtos));

  exibirProdutos();
  Swal.fire("Excluído!", "O produto foi excluído.", "success");
}

// =============================================
// FUNÇÕES DE PEDIDOS E CARRINHO
// =============================================

function abrirModalPedir(id) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtoAtualParaPedido = produtos.find(produto => produto.id === id);

  if (produtoAtualParaPedido) {
    document.getElementById("pedidoNomeProduto").value = produtoAtualParaPedido.nome;
    document.getElementById("pedidoMarcaProduto").value = produtoAtualParaPedido.marca;
    document.getElementById("pedidoQuantidade").value = "";
    document.getElementById("modalPedido").classList.remove("hidden");
  }
}

function adicionarAoCarrinho() {
  const quantidade = document.getElementById("pedidoQuantidade").value;
  if (quantidade > 0) {
    carrinho.push({ ...produtoAtualParaPedido, quantidade });
    atualizarContadorCarrinho();
    fecharModalPedido();
  } else {
    Swal.fire("Erro!", "Informe uma quantidade válida para o pedido.", "error");
  }
}

function fecharModalPedido() {
  document.getElementById("modalPedido").classList.add("hidden");
}

function atualizarContadorCarrinho() {
  document.getElementById("contadorCarrinho").innerText = carrinho.length;
}

function abrirCarrinho() {
  const listaCarrinho = document.getElementById("listaCarrinho");
  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<li class='text-gray-600'>Carrinho vazio.</li>";
  } else {
    carrinho.forEach(produto => {
      const li = document.createElement("li");
      li.innerHTML = `${produto.nome} (Marca: ${produto.marca}) - Quantidade: ${produto.quantidade}`;
      listaCarrinho.appendChild(li);
    });
  }

  document.getElementById("modalCarrinho").classList.remove("hidden");
}

function fecharModalCarrinho() {
  document.getElementById("modalCarrinho").classList.add("hidden");
}

function enviarPedidoWhatsApp() {
  if (carrinho.length > 0) {
    let mensagem = "Olá temos uma nova demanda para vocês do departamento de Compras! (Gerente de Manutenção):\n\n";
    
    carrinho.forEach(produto => {
      mensagem += `- Produto: ${produto.nome} (Marca: ${produto.marca}) - Quantidade: ${produto.quantidade}\n`;
    });

    const numeroWhatsApp = "5581991152307";
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
    fecharModalCarrinho();
  } else {
    Swal.fire("Erro!", "O carrinho está vazio.", "error");
  }
}

// =============================================
// FUNÇÕES DE LOGIN E BACKGROUND
// =============================================

function verificarLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const usuarioCorreto = "jr";
  const senhaCorreta = "dev";

  if (username === usuarioCorreto && password === senhaCorreta) {
    window.location.href = "pagina1.html";
  } else {
    Swal.fire({
      icon: "error",
      title: "Login inválido",
      text: "Usuário ou senha incorretos!",
    });
  }
}

function changeBackground() {
  const screen = document.getElementById('backgroundScreen');
  if (screen) {
    let currentIndex = 0;
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % backgroundImages.length;
      screen.style.backgroundImage = `url('${backgroundImages[currentIndex]}')`;
    }, 4000);
  }
}

function filtrarProdutos() {
  const filtro = document.getElementById("filtroProduto").value.toLowerCase();
  const sugestoes = document.getElementById("sugestoes");
  sugestoes.innerHTML = "";
  sugestoes.classList.add("hidden");

  if (filtro.length > 0) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produtosFiltrados = produtos.filter((produto) =>
      produto.nome.toLowerCase().startsWith(filtro)
    );

    if (produtosFiltrados.length > 0) {
      produtosFiltrados.forEach((produto) => {
        const li = document.createElement("li");
        li.classList.add("px-4", "py-2", "hover:bg-gray-200", "cursor-pointer");
        li.textContent = produto.nome;
        li.onclick = function () {
          abrirModalEditar(produto.id);
          document.getElementById("filtroProduto").value = "";
          sugestoes.classList.add("hidden");
        };
        sugestoes.appendChild(li);
      });
      sugestoes.classList.remove("hidden");
    }
  }
}

// =============================================
// INICIALIZAÇÃO DO SISTEMA
// =============================================

window.onload = function() {
  // Ativa o slideshow de fundo apenas na página de login
  if (document.getElementById('backgroundScreen')) {
    changeBackground();
  }
  
  // Carrega produtos se estiver na página correta
  if (document.getElementById('listaProdutos')) {
    exibirProdutos();
  }
  
  // Carrega estoque zerado se estiver na página correta
  if (document.getElementById('listaEstoqueZerado')) {
    exibirEstoqueZerado();
  }
  
  // Configura o botão de fechar
  if (document.getElementById("btnFechar")) {
    document.getElementById("btnFechar").addEventListener("click", function() {
      window.location.href = "index.html";
    });
  }
};

