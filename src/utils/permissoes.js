export const PERFIS = {
  ADMIN: "admin",
  COLABORADOR: "colaborador",
  GERENTE: "gerente",
};

export const PERMISSOES = {
  visualizar_dashboard: [PERFIS.ADMIN, PERFIS.COLABORADOR, PERFIS.GERENTE],
  visualizar_estoque: [PERFIS.ADMIN, PERFIS.COLABORADOR, PERFIS.GERENTE],
  visualizar_departamentos: [PERFIS.ADMIN, PERFIS.COLABORADOR, PERFIS.GERENTE],

  cadastrar_departamento: [PERFIS.ADMIN],
  excluir_departamento: [PERFIS.ADMIN],
  cadastrar_funcionario: [PERFIS.ADMIN],
  editar_perfil_funcionario: [PERFIS.ADMIN],

  visualizar_fornecedores: [PERFIS.ADMIN],
};

export function temPermissao(usuario, permissao) {
  if (!usuario) return false;

  const perfisPermitidos = PERMISSOES[permissao] || [];
  return perfisPermitidos.includes(usuario.perfil);
}