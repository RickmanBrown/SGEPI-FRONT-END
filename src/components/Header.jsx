import React, { useMemo, useState } from "react";

function Header({ paginaAtual, setPagina, onLogout, usuario }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const perfilUsuario = useMemo(() => {
    return usuario?.perfil || usuario?.role || "colaborador";
  }, [usuario]);

  const isAdmin = perfilUsuario === "admin";

  function Botao({ label, icone, nomePagina, isMobile = false }) {
    const ativo = paginaAtual === nomePagina;

    return (
      <button
        onClick={() => {
          setPagina(nomePagina);
          if (isMobile) setMenuAberto(false);
        }}
        className={`
          shrink-0 flex items-center gap-2.5 rounded-xl font-medium whitespace-nowrap transition-all
          ${
            isMobile
              ? "w-full justify-start px-4 py-3 text-sm"
              : "px-4 py-2.5 text-sm"
          }
          ${
            ativo
              ? "bg-white text-blue-900 shadow-md"
              : "text-blue-100 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        <span className="shrink-0">{icone}</span>
        <span>{label}</span>
      </button>
    );
  }

  const todosItens = [
    {
      label: "Dashboard",
      nome: "Dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      label: "Estoque",
      nome: "Estoque",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      label: "Funcionários",
      nome: "Funcionários",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: "Departamentos",
      nome: "Departamentos",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"
          />
        </svg>
      ),
    },
    {
      label: "Fornecedores",
      nome: "Fornecedores",
      somenteAdmin: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      label: "Entradas",
      nome: "Entradas",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      ),
    },
    {
      label: "Entregas",
      nome: "Entregas",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      label: "Devoluções",
      nome: "Devoluções",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      label: "Administração",
      nome: "Administracao",
      somenteAdmin: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-5l1.09 2.26 2.49.36-1.8 1.75.42 2.47L12 8.77 9.8 9.84l.42-2.47-1.8-1.75 2.49-.36L12 3zm0 14l1.09 2.26 2.49.36-1.8 1.75.42 2.47L12 22.77l-2.2 1.07.42-2.47-1.8-1.75 2.49-.36L12 17z"
          />
        </svg>
      ),
    },
  ];

  const navItems = todosItens.filter((item) => {
    if (item.somenteAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-xl">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4 lg:gap-6 w-full min-w-0">
          {/* Marca */}
          <div className="flex items-center gap-3 shrink-0 pr-1">
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-sm">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="leading-tight">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight">SGEPI</h1>
              <p className="hidden xl:block text-[10px] text-blue-300 uppercase tracking-[0.22em] font-semibold mt-0.5">
                Gestão de Estoque
              </p>
            </div>
          </div>

          {/* Botão mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden ml-auto p-2.5 text-blue-100 hover:text-white border border-white/10 rounded-xl hover:bg-white/10 transition shrink-0"
          >
            {menuAberto ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navegação desktop */}
          <div className="hidden lg:flex flex-1 min-w-0">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <nav className="flex items-center gap-2.5 overflow-x-auto pr-1">
                {navItems.map((item) => (
                  <Botao
                    key={item.nome}
                    label={item.label}
                    nomePagina={item.nome}
                    icone={item.icon}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Usuário */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 pl-1">
            <div className="hidden 2xl:flex flex-col items-end justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 min-w-[180px]">
              <span className="text-sm text-blue-100 whitespace-nowrap">
                Olá, <b>{usuario?.nome}</b>
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-blue-300 mt-0.5">
                {perfilUsuario}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-200 border border-red-500/30 px-4 py-2.5 rounded-xl font-medium transition text-sm whitespace-nowrap"
            >
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuAberto && (
          <div className="lg:hidden mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-lg">
            <div className="px-2 pb-3 mb-3 border-b border-white/10">
              <p className="text-sm text-blue-100">
                Olá, <b>{usuario?.nome}</b>
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-blue-300 mt-1">
                Perfil: {perfilUsuario}
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Botao
                  key={item.nome}
                  label={item.label}
                  nomePagina={item.nome}
                  icone={item.icon}
                  isMobile={true}
                />
              ))}
            </nav>

            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-200 hover:bg-red-600 hover:text-white transition"
              >
                <span>Sair do Sistema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;