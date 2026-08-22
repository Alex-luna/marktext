# Instruções para Agente Developer

Este documento contém instruções específicas para um Agente AI implementar a funcionalidade de renderização de markdown em tempo real baseada no MarkText.

## 🎯 Objetivo

Implementar um editor de markdown com renderização WYSIWYG (What You See Is What You Get) em tempo real, similar ao MarkText.

## 📋 Tarefa Principal

Extrair e adaptar a lógica de renderização de markdown do MarkText para funcionar em outro editor, mantendo:
- Renderização em tempo real
- Suporte a formatação inline (negrito, itálico, links, etc.)
- Conversão automática de sintaxe markdown para blocos
- Performance otimizada com renderização parcial

## 🏗️ Arquitetura a Implementar

```
User Input → Input Handler → ContentState (Blocos) → Tokenizer → Renderer → Virtual DOM → DOM
```

### Componentes Principais

1. **Parser Layer**
   - Tokenizer: Converte texto em tokens inline
   - Lexer: Converte markdown em estrutura de blocos

2. **Content State Layer**
   - Gerencia documento como árvore de blocos
   - Cada bloco tem: type, text, parent, children, siblings

3. **Render Layer**
   - Virtual DOM (Snabbdom) para eficiência
   - Renderização parcial (apenas blocos modificados)

## 📚 Documentação Disponível

1. **`docs/README.md`** - Visão geral
2. **`docs/RENDERING_SUMMARY.md`** - Resumo executivo
3. **`docs/MARKDOWN_RENDERING_LOGIC.md`** - Arquitetura completa
4. **`docs/EXTRACTED_RENDERING_EXAMPLE.js`** - Exemplo prático
5. **`docs/FILES_TO_EXTRACT.md`** - Guia de arquivos
6. **`INDEX.md`** - Índice de todos os arquivos

## 🔧 Código Fonte Disponível

Todo o código fonte necessário está em `source-code/`:

- `parser/` - Parser completo
- `contentState/` - Gerenciamento de estado
- `render/` - Sistema de renderização
- `utils/` - Utilitários (import/export)
- `config/` - Configurações
- `selection/` - Gerenciamento de seleção

## 🚀 Plano de Implementação

### Fase 1: Setup Básico
1. Instalar dependências: `snabbdom`, `snabbdom-to-html`
2. Criar estrutura de pastas similar a `source-code/`
3. Copiar arquivos de configuração (`config/index.js`)

### Fase 2: Parser
1. Implementar tokenizer (`parser/index.js`)
2. Implementar lexer (`parser/marked/lexer.js`)
3. Testar parsing de markdown básico

### Fase 3: Content State
1. Implementar estrutura de blocos (`contentState/index.js`)
2. Implementar import markdown (`utils/importMarkdown.js`)
3. Implementar export markdown (`utils/exportMarkdown.js`)

### Fase 4: Render
1. Setup Virtual DOM (`render/snabbdom.js`)
2. Implementar renderer principal (`render/index.js`)
3. Implementar renderização de blocos
4. Implementar renderização inline

### Fase 5: Input Handling
1. Implementar input handler (`contentState/inputCtrl.js`)
2. Implementar detecção de mudanças (`contentState/updateCtrl.js`)
3. Conectar eventos do editor

### Fase 6: Refinamento
1. Handlers de teclado (Enter, Backspace)
2. Otimizações de performance
3. Testes e ajustes

## 📝 Checklist de Implementação

### Dependências
- [ ] Instalar `snabbdom@^3.4.0`
- [ ] Instalar `snabbdom-to-html@^7.0.0`
- [ ] (Opcional) `marked@^1.2.9` se usar parser completo

### Parser
- [ ] Copiar/adaptar `parser/rules.js`
- [ ] Implementar `parser/index.js` (tokenizer)
- [ ] Implementar `parser/marked/lexer.js` (lexer)
- [ ] Testar parsing de markdown básico

### Content State
- [ ] Implementar estrutura de blocos
- [ ] Implementar `createBlock()`, `getBlock()`, `appendChild()`
- [ ] Implementar import markdown
- [ ] Implementar export markdown

### Render
- [ ] Setup Snabbdom
- [ ] Implementar `StateRender` class
- [ ] Implementar `render()`, `partialRender()`, `singleRender()`
- [ ] Implementar renderização de blocos
- [ ] Implementar renderização inline

### Input
- [ ] Implementar input handler
- [ ] Conectar eventos do editor
- [ ] Implementar detecção de mudanças de tipo
- [ ] Testar edição em tempo real

### Otimizações
- [ ] Renderização parcial funcionando
- [ ] Cache de tokens
- [ ] Debounce de renderização (se necessário)

## 🎓 Conceitos Chave

### 1. Virtual DOM
**Por quê**: Performance - apenas atualiza diferenças
**Como**: Usar Snabbdom para criar e atualizar Virtual DOM
**Código**: Ver `source-code/render/snabbdom.js`

### 2. Estrutura de Blocos
**Por quê**: Representa documento como árvore, não texto
**Como**: Cada elemento é um bloco com referências
**Código**: Ver `source-code/contentState/index.js`

### 3. Tokenização Inline
**Por quê**: Formatação precisa ser processada separadamente
**Como**: Tokenizar texto de cada bloco
**Código**: Ver `source-code/parser/index.js`

### 4. Renderização Parcial
**Por quê**: Performance em documentos grandes
**Como**: Calcular range afetado e renderizar apenas isso
**Código**: Ver `source-code/render/index.js` método `partialRender()`

## 🔍 Arquivos Mais Importantes

### Para Entender a Arquitetura
1. `source-code/contentState/index.js` - Estrutura de estado
2. `source-code/render/index.js` - Sistema de renderização
3. `source-code/parser/index.js` - Tokenização

### Para Implementar
1. `source-code/parser/index.js` - Tokenizer
2. `source-code/parser/marked/lexer.js` - Lexer
3. `source-code/contentState/index.js` - ContentState
4. `source-code/render/index.js` - StateRender
5. `source-code/contentState/inputCtrl.js` - Input handler

## 💡 Dicas de Implementação

1. **Comece simples**: Use `docs/EXTRACTED_RENDERING_EXAMPLE.js` como base
2. **Virtual DOM é essencial**: Não tente fazer sem Snabbdom
3. **Renderização parcial**: Implemente desde o início
4. **Teste incrementalmente**: Teste cada fase antes de avançar
5. **Adapte conforme necessário**: Remova features que não precisa

## 🐛 Problemas Comuns

### Performance ruim
- **Solução**: Certifique-se de usar Virtual DOM e renderização parcial

### Formatação perdida
- **Solução**: Mantenha estrutura de blocos, não converta para texto

### Tokens não renderizam
- **Solução**: Verifique tokenização e renderização inline

### Mudanças não detectadas
- **Solução**: Verifique input handler e update detection

## 📖 Exemplo de Uso

```javascript
// 1. Criar editor
const editor = new MarkdownEditor(container)

// 2. Definir markdown
editor.setMarkdown('# Título\n\nTexto **negrito**')

// 3. Editor renderiza automaticamente
// 4. Usuário edita → input handler atualiza → re-renderiza
```

## ✅ Critérios de Sucesso

- [ ] Markdown é parseado corretamente em blocos
- [ ] Blocos são renderizados em DOM
- [ ] Formatação inline funciona (negrito, itálico, links)
- [ ] Edição em tempo real funciona
- [ ] Mudanças de tipo são detectadas (# → cabeçalho, - → lista)
- [ ] Performance é aceitável (renderização parcial)
- [ ] Markdown pode ser exportado de volta

## 📞 Recursos

- **Documentação**: Ver `docs/` para detalhes completos
- **Código**: Ver `source-code/` para implementação
- **Exemplo**: Ver `docs/EXTRACTED_RENDERING_EXAMPLE.js`
- **Índice**: Ver `INDEX.md` para navegação

## 🎯 Próximos Passos

1. Leia `docs/RENDERING_SUMMARY.md` para entender arquitetura
2. Veja `docs/EXTRACTED_RENDERING_EXAMPLE.js` para exemplo
3. Estude arquivos em `source-code/` relevantes
4. Implemente seguindo o plano acima
5. Teste e refine

---

**Boa sorte com a implementação!** 🚀


