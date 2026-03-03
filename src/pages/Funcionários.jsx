import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const mockDepartamentos = [
  { id: 1, nome: "Produção", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 2, nome: "Segurança do Trabalho", cor: "bg-green-100 text-green-700 border-green-200" },
  { id: 3, nome: "Administrativo / RH", cor: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: 4, nome: "Logística", cor: "bg-orange-100 text-orange-700 border-orange-200" },
];

const mockFuncoes = [
  { id: 1, nome: "Operador de Máquinas", idDepartamento: 1 },
  { id: 2, nome: "Auxiliar de Produção", idDepartamento: 1 },
  { id: 3, nome: "Supervisor de Turno", idDepartamento: 1 },
  { id: 4, nome: "Técnico de Segurança", idDepartamento: 2 },
  { id: 5, nome: "Engenheiro de Segurança", idDepartamento: 2 },
  { id: 6, nome: "Analista de RH", idDepartamento: 3 },
  { id: 7, nome: "Auxiliar Administrativo", idDepartamento: 3 },
  { id: 8, nome: "Conferente", idDepartamento: 4 },
];

const PERFIS = [
  { value: "admin", label: "Administrador", badge: "bg-red-100 text-red-700 border-red-200" },
  { value: "gerente", label: "Gerente", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "colaborador", label: "Colaborador", badge: "bg-slate-100 text-slate-700 border-slate-200" },
];

const mockFuncionariosInicial = [
  {
    id: 1,
    nome: "João Silva",
    matricula: "4839201",
    departamento: mockDepartamentos[0],
    funcao: mockFuncoes[0],
    perfil: "colaborador",
    role: "user", // compatibilidade
  },
  {
    id: 2,
    nome: "Maria Santos",
    matricula: "7391046",
    departamento: mockDepartamentos[1],
    funcao: mockFuncoes[3],
    perfil: "colaborador",
    role: "user", // compatibilidade
  },
];

function gerarMatricula() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

function getPerfilValue(func) {
  return func?.perfil || func?.role || "colaborador";
}

function getPerfilBadge(perfil) {
  const p = PERFIS.find((x) => x.value === perfil);
  return p?.badge || "bg-slate-100 text-slate-700 border-slate-200";
}

function getPerfilLabel(perfil) {
  const p = PERFIS.find((x) => x.value === perfil);
  return p?.label || perfil;
}

function Funcionarios({ usuarioLogado }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const perfilUsuario = usuarioLogado?.perfil || usuarioLogado?.role || "colaborador";
  const isAdmin = perfilUsuario === "admin";

  const [modalAberto, setModalAberto] = useState(false);
  const [funcSelecionado, setFuncSelecionado] = useState(null);
  const [formNome, setFormNome] = useState("");
  const [formDepartamento, setFormDepartamento] = useState("");
  const [formFuncao, setFormFuncao] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formPerfil, setFormPerfil] = useState("colaborador");
  const [carregando, setCarregando] = useState(false);

  const carregarFuncionarios = async () => {
    try {
      const resp = await api.get("/funcionarios");
      // compatível com axios (resp.data) ou fetch wrapper (resp)
      const dados = resp?.data ?? resp ?? [];
      if (Array.isArray(dados)) {
        setFuncionarios(dados);
      } else {
        // se vier algo inesperado, não quebrar a UI
        setFuncionarios(mockFuncionariosInicial);
      }
    } catch (erro) {
      setFuncionarios(mockFuncionariosInicial);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const listaFiltrada = useMemo(() => {
    const term = busca.trim().toLowerCase();
    if (!term) return funcionarios;

    return funcionarios.filter((f) => {
      const nome = (f.nome || "").toLowerCase();
      const matricula = String(f.matricula || "");
      return nome.includes(term) || matricula.includes(term);
    });
  }, [funcionarios, busca]);

  const funcionariosOrdenados = useMemo(() => {
    return [...listaFiltrada].sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
  }, [listaFiltrada]);

  const totalPaginas = Math.max(1, Math.ceil(funcionariosOrdenados.length / itensPorPagina));

  useEffect(() => {
    // segurança: se a lista diminui, garantir página válida
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [totalPaginas, paginaAtual]);

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosVisiveis = funcionariosOrdenados.slice(indexPrimeiroItem, indexUltimoItem);

  const funcoesDisponiveis = useMemo(() => {
    return mockFuncoes.filter((f) => f.idDepartamento === Number(formDepartamento));
  }, [formDepartamento]);

  const imprimirListaColaboradores = () => {
    const dataEmissao = new Date().toLocaleDateString("pt-BR");
    const totalColaboradores = funcionariosOrdenados.length;

    const conteudoHTML = `
      <html>
        <head><title>Relatório de Colaboradores</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Quadro de Colaboradores - SGEPI</h2>
          <p>Emissão: ${dataEmissao} | Total: ${totalColaboradores}</p>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #eee;">
                <th>Matrícula</th><th>Nome</th><th>Departamento</th><th>Função</th><th>Perfil</th>
              </tr>
            </thead>
            <tbody>
              ${funcionariosOrdenados
                .map(
                  (f) =>
                    `<tr>
                      <td>${String(f.matricula ?? "")}</td>
                      <td>${String(f.nome ?? "")}</td>
                      <td>${String(f.departamento?.nome ?? "")}</td>
                      <td>${String(f.funcao?.nome ?? "")}</td>
                      <td>${String(getPerfilLabel(getPerfilValue(f)))}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    const win = window.open("", "", "width=900,height=600");
    win.document.write(conteudoHTML);
    win.document.close();
  };

  const abrirNovo = () => {
    if (!isAdmin) {
      alert("Apenas administradores podem cadastrar colaboradores.");
      return;
    }

    setFuncSelecionado(null);
    setFormNome("");
    setFormDepartamento("");
    setFormFuncao("");
    setFormSenha("");
    setFormPerfil("colaborador");
    setModalAberto(true);
  };

  const abrirEdicao = (func) => {
    if (!isAdmin) return;

    setFuncSelecionado(func);
    setFormNome(func.nome || "");
    setFormDepartamento(String(func.departamento?.id ?? ""));
    setFormFuncao(String(func.funcao?.id ?? ""));
    setFormSenha("********"); // placeholder
    setFormPerfil(getPerfilValue(func));
    setModalAberto(true);
  };

  const salvarFuncionario = async () => {
    if (!isAdmin) {
      alert("Apenas administradores podem salvar alterações.");
      return;
    }

    if (!formNome || !formDepartamento || !formFuncao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!funcSelecionado) {
      // criando novo: exigir senha (opcional, mas recomendado)
      if (!formSenha || formSenha.trim().length < 4) {
        alert("Defina uma senha (mínimo 4 caracteres) para o novo colaborador.");
        return;
      }
    }

    setCarregando(true);

    const depObj = mockDepartamentos.find((d) => d.id === Number(formDepartamento));
    const funcObj = mockFuncoes.find((f) => f.id === Number(formFuncao));

    if (!depObj || !funcObj) {
      setCarregando(false);
      alert("Departamento ou função inválidos.");
      return;
    }

    const pacoteDados = {
      nome: formNome,
      departamento_id: Number(formDepartamento),
      funcao_id: Number(formFuncao),
      senha: formSenha === "********" ? undefined : formSenha,
      perfil: formPerfil,
    };

    try {
      if (funcSelecionado) {
        // await api.put(`/funcionario/${funcSelecionado.id}`, pacoteDados);

        setFuncionarios((prev) =>
          prev.map((f) =>
            f.id === funcSelecionado.id
              ? {
                  ...f,
                  nome: formNome,
                  departamento: depObj,
                  funcao: funcObj,
                  perfil: formPerfil,
                  role: formPerfil, // compatibilidade
                }
              : f
          )
        );
      } else {
        // await api.post("/funcionario", pacoteDados);

        const novoFunc = {
          id: Date.now(),
          nome: formNome,
          matricula: gerarMatricula(),
          departamento: depObj,
          funcao: funcObj,
          perfil: formPerfil,
          role: formPerfil, // compatibilidade
        };

        setFuncionarios((prev) => [...prev, novoFunc]);
      }

      setModalAberto(false);
    } catch (erro) {
      alert("Erro ao salvar no servidor. Salvando localmente para testes.");

      if (funcSelecionado) {
        setFuncionarios((prev) =>
          prev.map((f) =>
            f.id === funcSelecionado.id
              ? {
                  ...f,
                  nome: formNome,
                  departamento: depObj,
                  funcao: funcObj,
                  perfil: formPerfil,
                  role: formPerfil,
                }
              : f
          )
        );
      } else {
        const novoFunc = {
          id: Date.now(),
          nome: formNome,
          matricula: gerarMatricula(),
          departamento: depObj,
          funcao: funcObj,
          perfil: formPerfil,
          role: formPerfil,
        };
        setFuncionarios((prev) => [...prev, novoFunc]);
      }

      setModalAberto(false);
    } finally {
      setCarregando(false);
    }
  };

  const excluirFuncionario = async (id) => {
    if (!isAdmin) return;

    if (window.confirm("Tens a certeza que desejas excluir este funcionário?")) {
      try {
        // await api.delete(`/funcionario/${id}`);
        setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      } catch (error) {
        setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            👥 Colaboradores
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? "Gerencie a equipe e defina o nível de acesso ao sistema."
              : "Visualização somente leitura. Apenas administradores podem cadastrar/editar."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button
            onClick={imprimirListaColaboradores}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition shadow-sm border border-gray-300 flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <span>🖨️</span> Imprimir
          </button>

          {isAdmin && (
            <button
              onClick={abrirNovo}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2 shadow-sm justify-center w-full sm:w-auto"
            >
              <span>➕</span> Cadastrar
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm lg:text-base"
          />
        </div>
      </div>

      {/* Tabela desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Matrícula</th>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Departamento</th>
              <th className="p-4 font-semibold">Função</th>
              <th className="p-4 font-semibold">Perfil</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {funcionariosVisiveis.map((func) => {
              const perfil = getPerfilValue(func);
              return (
                <tr key={func.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-600">{func.matricula}</td>
                  <td className="p-4 font-medium text-gray-800">{func.nome}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${func.departamento?.cor || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                      {func.departamento?.nome || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{func.funcao?.nome || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getPerfilBadge(perfil)}`}>
                      {getPerfilLabel(perfil)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => abrirEdicao(func)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => excluirFuncionario(func.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                          >
                            🗑️ Excluir
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-300 text-xs italic">Apenas leitura</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="lg:hidden space-y-4">
        {funcionariosVisiveis.map((func) => {
          const perfil = getPerfilValue(func);
          return (
            <div key={func.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{func.nome}</h3>
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    Mat: {func.matricula}
                  </span>
                </div>

                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getPerfilBadge(perfil)}`}>
                  {getPerfilLabel(perfil)}
                </span>
              </div>

              <div className="space-y-2 mt-3">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border ${func.departamento?.cor || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {func.departamento?.nome || "-"}
                  </span>
                </div>

                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <span className="font-semibold text-gray-400 text-xs uppercase">Cargo:</span>
                  {func.funcao?.nome || "-"}
                </div>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => abrirEdicao(func)}
                    className="flex items-center justify-center gap-2 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-bold"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => excluirFuncionario(func.id)}
                    className="flex items-center justify-center gap-2 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className={`px-4 py-2 rounded text-sm font-bold border ${
              paginaAtual === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-blue-700 border-blue-200"
            }`}
          >
            ← Anterior
          </button>

          <span className="text-xs lg:text-sm text-gray-600">
            Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
          </span>

          <button
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className={`px-4 py-2 rounded text-sm font-bold border ${
              paginaAtual === totalPaginas ? "bg-gray-100 text-gray-400" : "bg-white text-blue-700 border-blue-200"
            }`}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {funcSelecionado ? "✏️ Editar Colaborador" : "➕ Novo Colaborador"}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-50"
                  value={formDepartamento}
                  onChange={(e) => {
                    setFormDepartamento(e.target.value);
                    setFormFuncao("");
                  }}
                >
                  <option value="">Selecione...</option>
                  {mockDepartamentos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função / Cargo</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-50"
                  value={formFuncao}
                  onChange={(e) => setFormFuncao(e.target.value)}
                >
                  <option value="">Selecione a função</option>
                  {funcoesDisponiveis.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin define o nível de acesso */}
              <div className="pt-4 border-t">
                <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">Acesso ao Sistema</h4>

                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formPerfil}
                  onChange={(e) => setFormPerfil(e.target.value)}
                >
                  {PERFIS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {funcSelecionado ? "Nova senha (opcional)" : "Senha de acesso"}
                  </label>
                  <input
                    type="password"
                    className="w-full p-2.5 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder={funcSelecionado ? "Deixe em branco para não alterar" : "Defina uma senha"}
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    * Esta senha é apenas para o sistema (quando você integrar o back-end).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={salvarFuncionario}
                disabled={carregando}
                className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-md disabled:opacity-60"
              >
                {carregando ? "A salvar..." : "Salvar Dados"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Funcionarios;