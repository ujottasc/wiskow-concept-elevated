# Correção definitiva do upload de imagens de produtos

## Objetivo
Garantir que toda imagem nova de produto, inclusive por cor, seja enviada ao bucket público `media` e salva como URL pública permanente, sem dependência de caminhos `/__l5e/` ou do domínio do Lovable.

## Implementação
- Corrigir o `ImageUploader` existente para obter a URL pública diretamente do Storage após cada upload, mantendo formatos, múltiplos arquivos, arrastar/soltar, progresso e mensagens de erro.
- Aplicar o modo permanente apenas ao cadastro e edição de produtos; banners, coleções, página Sobre e assets antigos não serão alterados.
- Organizar novos arquivos em `produtos/{productId}/{uuid}.{ext}` para a galeria geral e as galerias das cores.
- Gerar o ID do produto antes do upload, permitindo uma pasta estável mesmo para produtos ainda não salvos.
- Bloquear a gravação de qualquer imagem nova com `/__l5e/` ou fora da URL pública do bucket, preservando URLs antigas já existentes.
- Manter `products.images` como lista de URLs e `products.variants` com o JSON atual, incluindo `images` e `primaryImage`.
- Remover do Storage somente arquivos identificados com segurança como uploads desse produto e somente após uma gravação bem-sucedida; arquivos antigos não identificáveis serão apenas desvinculados.
- Confirmar que as políticas permitem upload e remoção apenas por administradores autenticados.

## Validação
- Testar JPG, PNG, WEBP, múltiplos arquivos, recarga, reedição e imagens por cor no Preview.
- Conferir no banco e na rede que as novas URLs usam `/storage/v1/object/public/media/` e não `/__l5e/`.
- Não publicar nem alterar o domínio de produção nesta etapa.

## Detalhes técnicos
A correção reutilizará o uploader e a integração atuais; não será criado um segundo fluxo. O endpoint intermediário existente continuará disponível para dados antigos, mas não será usado por novos uploads de produtos.
