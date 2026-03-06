import { useMemo, useState } from "react";
import { api } from "../../services/api";

const categoriasDisponiveis = [
  { id: 1, nome: "Proteção da Cabeça (Capacetes/Toucas)" },
  { id: 2, nome: "Proteção Auditiva (Protetores/Abafadores)" },
  { id: 3, nome: "Proteção Respiratória (Máscaras/Filtros)" },
  { id: 4, nome: "Proteção Visual (Óculos/Viseiras)" },
  { id: 5, nome: "Proteção de Mãos (Luvas)" },
  { id: 6, nome: "Proteção de Pés (Botinas/Sapatos)" },
  { id: 7, nome: "Proteção contra Quedas (Cintos)" },
];

function ModalNovoEpi({ onClose, onSalvar }) {
  const [nome, setNome] = useState("");
  const [ca, setCa] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [preco, setPreco] = useState("");
  const [lote, setLote] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");
  const [dataChegada, setDataChegada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [tamanhos, setTamanhos] = useState([
    { id: Date.now(), tamanho: "", quantidade: "" },
  ]);

  const quantidadeTotalTamanhos = useMemo(() => {
    return tamanhos.reduce((acc, item) => {
      const qtd = parseInt(item.quantidade || 0, 10);
      return acc + (Number.isNaN(qtd) ? 0 : qtd);
    }, 0);
  }, [tamanhos]);

  const adicionarLinhaTamanho = () => {
    setTamanhos((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), tamanho: "", quantidade: "" },
    ]);
  };

  const removerLinhaTamanho = (id) => {
    setTamanhos((prev) => {
      if (prev.length === 1) {
        return [{ ...prev[0], tamanho: "", quantidade: "" }];
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const atualizarLinhaTamanho = (id, campo, valor) => {
    setTamanhos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  };

  const salvarEpi = async () => {
    if (!nome || !categoria || !preco) {
      alert("Por favor, preencha os campos obrigatórios (*).");
      return;
    }

    const tamanhosValidos = tamanhos.filter(
      (item) => item.tamanho.trim() || item.quantidade !== ""
    );

    const quantidadeFinal =
      quantidade !== ""
        ? parseInt(quantidade, 10)
        : quantidadeTotalTamanhos;

    if (!quantidadeFinal && quantidadeFinal !== 0) {
      alert("Informe a quantidade total ou preencha a tabela de tamanhos.");
      return;
    }

    if (tamanhosValidos.some((item) => !item.tamanho.trim() || item.quantidade === "")) {
      alert("Preencha corretamente o tamanho e a quantidade em todas as linhas da tabela.");
      return;
    }

    const descricaoMontada = [
      fabricante ? `Fabricante: ${fabricante}` : null,
      ca ? `CA: ${ca}` : null,
      tamanhosValidos.length
        ? `Tamanhos: ${tamanhosValidos
            .map((item) => `${item.tamanho} (${item.quantidade})`)
            .join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const novoProduto = {
      nome: nome,
      descricao: descricaoMontada,
      ca: ca,
      fabricante: fabricante,
      tamanhos: tamanhosValidos.map((item) => ({
        tamanho: item.tamanho.trim(),
        quantidade: parseInt(item.quantidade, 10),
      })),
      preco: parseFloat(preco),
      lote: lote,
      quantidade: quantidadeFinal,
      validade: validade ? `${validade}T00:00:00Z` : null,
      categoria: parseInt(categoria, 10),
      dataChegada: dataChegada ? `${dataChegada}T00:00:00Z` : new Date().toISOString(),
    };

    setCarregando(true);

    try {
      await api.post("/produto", novoProduto);
      alert("Produto guardado com sucesso no banco de dados!");
      if (onSalvar) onSalvar();
      onClose();
    } catch (erro) {
      alert("Não foi possível conectar ao servidor ou houve um erro ao guardar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 p-2 rounded-lg text-slate-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Cadastrar Novo Produto (EPI)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold text-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Identificação
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: Bota de Segurança de Couro"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {categoriasDisponiveis.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabricante
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: Bracol"
                  value={fabricante}
                  onChange={(e) => setFabricante(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: 15432"
                  value={ca}
                  onChange={(e) => setCa(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lote
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: LOTE-2026A"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Tamanhos do EPI
            </h3>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Tamanho</th>
                      <th className="text-left px-4 py-3 font-semibold">Quantidade</th>
                      <th className="text-center px-4 py-3 font-semibold w-[120px]">Ação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tamanhos.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <input
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Ex: P, M, G, 38, 40, 42"
                            value={item.tamanho}
                            onChange={(e) =>
                              atualizarLinhaTamanho(item.id, "tamanho", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="0"
                            value={item.quantidade}
                            onChange={(e) =>
                              atualizarLinhaTamanho(item.id, "quantidade", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removerLinhaTamanho(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xs underline"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={adicionarLinhaTamanho}
                  className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition text-sm w-full sm:w-auto"
                >
                  + Adicionar tamanho
                </button>

                <div className="text-sm text-gray-600">
                  Total pelos tamanhos:{" "}
                  <span className="font-bold text-slate-800">{quantidadeTotalTamanhos}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Controle e Valores
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Total
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Se quiser, informe manualmente"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Se deixar em branco, será usada a soma da tabela de tamanhos.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Unit. (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="0.00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Chegada
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={dataChegada}
                  onChange={(e) => setDataChegada(e.target.value)}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validade do Produto / CA
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={validade}
                  onChange={(e) => setValidade(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            onClick={onClose}
            disabled={carregando}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={salvarEpi}
            disabled={carregando}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition flex items-center gap-2 ${
              carregando ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <span>{carregando ? "⏳" : "💾"}</span>
            {carregando ? "A guardar..." : "Salvar Produto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalNovoEpi;