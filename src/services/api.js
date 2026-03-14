const BASE_URL =
  process.env.REACT_APP_API_URL || "http://empresa.lvh.me:8080/api";

function getToken() {
  return localStorage.getItem("token");
}

function montarHeaders(headersExtras = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...headersExtras,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function tratarResposta(resposta, rota, mensagemErroPadrao) {
  const contentType = resposta.headers.get("content-type");
  let dados;

  if (contentType && contentType.includes("application/json")) {
    dados = await resposta.json();
  } else {
    dados = await resposta.text();
  }

  if (!resposta.ok) {
    const mensagemErro =
      typeof dados === "object" && dados?.error
        ? dados.error
        : typeof dados === "string" && dados
        ? dados
        : `${mensagemErroPadrao} ${rota}`;

    throw new Error(mensagemErro);
  }

  return dados;
}

export const api = {
  get: async (rota) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "GET",
      headers: montarHeaders(),
    });

    return await tratarResposta(resposta, rota, "Erro ao buscar dados de");
  },

  post: async (rota, dados) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "POST",
      headers: montarHeaders(),
      body: JSON.stringify(dados),
    });

    return await tratarResposta(resposta, rota, "Erro ao salvar dados em");
  },

  put: async (rota, dados) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "PUT",
      headers: montarHeaders(),
      body: JSON.stringify(dados),
    });

    return await tratarResposta(resposta, rota, "Erro ao atualizar dados em");
  },

  patch: async (rota, dados) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "PATCH",
      headers: montarHeaders(),
      body: JSON.stringify(dados),
    });

    return await tratarResposta(resposta, rota, "Erro ao atualizar dados em");
  },

  delete: async (rota) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "DELETE",
      headers: montarHeaders(),
    });

    return await tratarResposta(resposta, rota, "Erro ao excluir dados em");
  },
};