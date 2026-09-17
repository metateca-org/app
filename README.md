# Projeto: Metateca

O ciclo operacional principal está documentado em [WORKFLOW_BASICO.md](WORKFLOW_BASICO.md). A formação de duplas usa participantes canônicos, justificativa, revisão humana e decisão imutável com autoria.

Este projeto é um sistema completo desenvolvido para **Google Apps Script (GAS)** que integra cálculos astrológicos com ferramentas de gestão de produtividade e dinâmica de equipe.

## Estrutura do Projeto

O conjunto de componentes foi preparado seguindo as diretrizes do `Relatorio.md` e `base.txt`, totalizando:
- **42 Arquivos .gs**: Lógica de servidor, cálculos astrológicos, integração de API e utilitários.
- **37 Arquivos .html**: Interface do usuário, componentes modulares, páginas de erro e documentação legal.

## Como Instalar

1. Acesse [script.google.com](https://script.google.com).
2. Crie um novo projeto.
3. Copie o conteúdo de cada arquivo para o editor do Google Apps Script, mantendo os mesmos nomes de arquivos.
4. Salve e publique como um **Web App**.

## Funcionalidades Principais

- **Cálculo de Mapa Natal**: Sol, Lua, Ascendente, Casas e Aspectos.
- **Análise de Produtividade**: Sugestões baseadas nos elementos e modalidades dos membros.
- **Dinâmica de Equipe**: Matriz de compatibilidade e sugestão de papéis de projeto.
- **Guia de Comunicação**: Dicas personalizadas para melhorar a interação entre diferentes perfis.

## Arquitetura de Integração (Frontend ↔ Backend)

O app segue **um único modelo** de integração, sem caminhos paralelos:

1. **Shell + Views**: `doGet` (em `Code.gs`) serve o shell `index.html`, que injeta a
   view pedida com `includePage(view)`. A navegação é feita por `loadPage('View')`
   (em `scripts.html`), que recarrega o shell com `?page=index&view=<View>`. As views
   permitidas estão na allow-list `resolveViewName()`.
2. **Chamadas de dados**: cada view chama `Utils.callServer('acao', [args])`
   (`scripts.html`) → `google.script.run` → wrappers globais em `Code.gs`.
3. **Fonte única de verdade**: toda ação vive **uma vez** no registro `Api` (em
   `Code.gs`). Tanto os wrappers de `google.script.run` quanto o `doPost` (API HTTP/JSON)
   roteiam por `Api`, então os dois transportes nunca divergem.

> `FrontendRouter.gs` (gerador de páginas no servidor) foi **descontinuado** — não
> reintroduza markup de página lá; crie um fragmento `<View>.html` e registre-o em
> `resolveViewName()`.

### Autenticação (login por usuário/senha)

O app principal exige login com **usuário e senha** antes de liberar as views:

1. `Login.html` envia as credenciais via `Utils.callServer('login', [usuario, senha])`.
2. `Api.login` (em `Code.gs`) chama `loginWithPassword` (`Auth.gs`), que valida em
   **texto puro** contra a aba **`Usuarios`** (colunas `ID, Username, Password,
   Role, Nome, Email, Status`). O esquema é montado/semeado por `SchemaService.gs`
   (`SYNTHETIC_USERS_LOGIN_SCHEMAS`), que cria 15 admins (`admin01`…`admin15`,
   senha `admin123`).
3. Em caso de sucesso o usuário é guardado em `sessionStorage` (`Auth`, em
   `scripts.html`). Um gate em `DOMContentLoaded` redireciona qualquer view
   protegida para `Login` quando não há sessão; `Login`, `Register` e
   `ForgotPassword` são públicas. "Sair" limpa a sessão.

> Senhas ficam em texto puro na planilha, por design (admins sintéticos). Para uso
> real, troque a coluna por hash e ajuste `loginWithPassword`.

### Arquivos apenas locais (NÃO copiar para o editor do GAS)

- `verify_integration.js` — harness Node que roda o backend com stubs e valida os
  contratos ponta a ponta (`node verify_integration.js`).
- `_backup_unescape/` — cópia dos arquivos originais antes da correção de codificação.

---
*Preparado por Manus. Integração frontend/backend revisada e unificada.*


---

## Mapeamento de Schema da Planilha (item 6 — pré-requisito para fixtures analíticos)

> **Status do catálogo AI:** vazio — o `SchemaService` expõe apenas abas de infraestrutura (baseline). `AiAuditLogService.gs` (FROTA-06) está **ausente** neste projeto.

### Abas declaradas no SchemaService

| Aba (sheetName) | Entidade | Tipo | Colunas |
|---|---|---|---|
| `Usuarios` | — (login real) | Autenticação | `ID`, `Username`, `Password`, `Role`, `Nome`, `Email`, `Status` |
| `Users` | USERS | Autenticação (baseline) | `ID`, `Name`, `Email`, `Username`, `PasswordHash`, `Role`, `Status`, `LastLoginAt`, `CreatedAt`, `UpdatedAt` |
| `Settings` | SETTINGS | Configuração/Infra | `Key`, `Value`, `Description`, `Scope`, `UpdatedAt`, `UpdatedBy` |
| `Audit_Logs` | AUDIT_LOGS | Infraestrutura | `ID`, `Timestamp`, `Level`, `Action`, `Entity`, `RecordID`, `UserID`, `Message`, `Details`, `CreatedAt` |

> **Nota:** A aba `Usuarios` é a real usada pelo login (`SYNTHETIC_USERS_LOGIN_SCHEMAS`); a aba `Users` é o baseline da frota. Há duas abas de autenticação — isso foi identificado e está pendente de consolidação.

### Entidades pendentes de mapeamento analítico

O `SchemaService` atual não declara **nenhuma entidade de domínio** do projeto Metateca.org além das abas de infraestrutura. As entidades analíticas reais do projeto (conteúdo de metateca, coleções, categorias, interações de usuário) não estão mapeadas.

| Entidade esperada | Por que ausente | O que precisa ser feito |
|---|---|---|
| Itens / Coleção | Não declarada | Identificar abas reais na planilha e declarar no schema |
| Categorias / Taxonomia | Não declarada | Idem |
| Interações / Histórico | Não declarada | Idem |

> **Ação necessária para o item 6:** Inspecionar as abas reais da planilha vinculada e declarar as entidades de domínio no `SchemaService` antes de criar qualquer fixture. O schema atual expõe apenas infraestrutura — popular dados de teste agora geraria fixtures sem significado analítico.

> **Ação adicional:** Consolidar `Usuarios` e `Users` em uma única aba canônica para eliminar a duplicidade de autenticação.
