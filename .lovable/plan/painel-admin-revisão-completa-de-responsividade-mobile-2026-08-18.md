# Painel Admin — revisão completa de responsividade mobile

Objetivo: deixar todas as telas do admin totalmente usáveis em celular, tablet e desktop, sem botões cortados ou inacessíveis.

## Problema confirmado (Banners)

Em `admin.banners.tsx` cada banner é uma linha horizontal: imagem fixa de 224px + texto + coluna de ações, tudo dentro de um container com `overflow-hidden`. Em telas estreitas a coluna com os botões "lápis" (editar) e lixeira (excluir) é empurrada para fora e fica invisível/inacessível — exatamente o que você relatou.

Correção: card empilhado no mobile (imagem em cima, conteúdo abaixo) e linha horizontal só a partir de `sm:`; botões de ação sempre visíveis, com área de toque maior e rótulos "Editar"/"Excluir" no mobile.

## Revisão tela a tela

- **Banners** — layout empilhado no mobile, ações sempre visíveis com rótulo e alvo de toque de 44px.
- **Catálogo (Produtos)** — a tabela vira lista de cards no mobile (foto, nome, preço, estoque, categoria e botões editar/excluir); tabela mantida do `md:` para cima. Barra de busca e filtro em coluna no mobile.
- **Pedidos** — mesma conversão: cards no mobile com número, cliente, data, total e seletor de status; tabela no desktop. Faixa de filtros com rolagem horizontal e busca em linha própria.
- **Coleções** — grade já responsiva; ampliar alvos de toque dos botões e evitar truncamento do título.
- **Categorias / Cupons** — formulários de criação empilham no mobile (campo, valor, botão em largura total); linhas da lista passam a empilhar texto e ações.
- **Clientes** — campo de busca em largura total no mobile (hoje fica apertado no cabeçalho).
- **Conteúdo** — cards e ações empilhados; painel lateral ajustado.
- **Página Inicial** — grades de seleção passam a 2 colunas no mobile em vez de 1 coluna gigante; feedback de seleção mantido.
- **Instagram / Configurações / Perfil** — botões em largura total no mobile, campos sem estouro de largura.
- **Dashboard** — cartões e listas com truncamento correto de nomes longos.

## Padrões aplicados em todo o admin

- Painéis laterais (drawers) de edição: fecham ao tocar no fundo, cabeçalho fixo, e ocupam a tela inteira no mobile com rolagem correta.
- `PageHeader`: botão de ação em largura total no mobile.
- Regras de layout responsivo: `min-w-0` em containers de texto, `shrink-0` em ícones/miniaturas, `truncate` em títulos de linha única.
- Todos os botões só com ícone ganham rótulo visível ou área mínima de toque de 44×44px.

## Verificação

Após a implementação, navegar por todas as rotas do admin em viewport de celular (375px), tablet (768px) e desktop com automação de navegador, capturando telas para confirmar que cada botão de editar/excluir está visível e clicável, e rodar a verificação de tipos.  
  
**IMPORTANTE:** Faça somente as alterações necessárias para corrigir a responsividade e usabilidade mobile do painel administrativo. NÃO altere regras de negócio, autenticação, banco de dados, permissões, CRUD, lógica de produtos, banners, pedidos ou outras funcionalidades que já estejam funcionando corretamente. Preserve toda a funcionalidade existente. Antes de finalizar, confirme que as alterações não introduziram regressões em desktop/tablet e que todas as ações continuam funcionando normalmente.