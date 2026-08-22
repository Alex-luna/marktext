# Arquivos para Extrair - Lógica de Renderização Markdown

Este documento lista os arquivos específicos que você precisa extrair/adaptar do MarkText para implementar a renderização de markdown em tempo real.

## 📁 Estrutura de Arquivos Recomendada

```
seu-editor/
├── parser/
│   ├── tokenizer.js          # Tokenização inline
│   ├── lexer.js              # Parsing de blocos
│   └── rules.js              # Regras de parsing
├── contentState/
│   ├── index.js              # Gerenciamento de estado
│   ├── inputCtrl.js          # Handler de input
│   └── updateCtrl.js         # Detecção de mudanças
├── render/
│   ├── index.js              # Renderer principal
│   ├── renderBlock.js        # Renderização de blocos
│   └── renderInlines.js     # Renderização inline
└── utils/
    ├── importMarkdown.js     # Markdown → Blocos
    └── exportMarkdown.js    # Blocos → Markdown
```

## 🔴 Arquivos Essenciais (Copiar/Adaptar)

### 1. Parser - Tokenização

**Arquivo Original**: `src/muya/lib/parser/index.js`
- **Função**: Tokeniza texto em tokens inline
- **O que extrair**: Função `tokenizer` completa
- **Dependências**: `parser/rules.js` (inlineRules)

**Arquivo Original**: `src/muya/lib/parser/rules.js`
- **Função**: Define regras de parsing
- **O que extrair**: Objetos `beginRules`, `inlineRules`, `inlineExtensionRules`

**Arquivo Original**: `src/muya/lib/parser/marked/inlineRules.js`
- **Função**: Regras específicas para tokens inline
- **O que extrair**: Regex patterns para cada tipo de token

### 2. Parser - Lexer de Blocos

**Arquivo Original**: `src/muya/lib/parser/marked/lexer.js`
- **Função**: Converte markdown em tokens de bloco
- **O que extrair**: Classe `Lexer` completa
- **Dependências**: `parser/marked/blockRules.js`

**Arquivo Original**: `src/muya/lib/parser/marked/blockRules.js`
- **Função**: Define regras de blocos
- **O que extrair**: Objeto `block` com regex patterns

**Arquivo Original**: `src/muya/lib/parser/marked/parser.js`
- **Função**: Processa tokens em estrutura
- **O que extrair**: Lógica de parsing de tokens

### 3. Content State

**Arquivo Original**: `src/muya/lib/contentState/index.js`
- **Função**: Gerencia estado do documento
- **O que extrair**: 
  - Classe `ContentState`
  - Métodos: `createBlock`, `getBlock`, `appendChild`, `removeBlock`
  - Propriedades: `blocks`, `cursor`

**Arquivo Original**: `src/muya/lib/contentState/inputCtrl.js`
- **Função**: Processa input do usuário
- **O que extrair**: Método `inputHandler`

**Arquivo Original**: `src/muya/lib/contentState/updateCtrl.js`
- **Função**: Detecta mudanças de tipo de bloco
- **O que extrair**: Método `checkInlineUpdate` e funções de atualização

### 4. Render

**Arquivo Original**: `src/muya/lib/parser/render/index.js`
- **Função**: Renderiza blocos em DOM
- **O que extrair**: Classe `StateRender` com métodos `render`, `partialRender`, `singleRender`
- **Dependências**: Snabbdom

**Arquivo Original**: `src/muya/lib/parser/render/snabbdom.js`
- **Função**: Setup do Virtual DOM
- **O que extrair**: Configuração do Snabbdom

**Arquivo Original**: `src/muya/lib/parser/render/renderBlock/renderLeafBlock.js`
- **Função**: Renderiza blocos folha (p, h1-h6, li)
- **O que extrair**: Função `renderLeafBlock`

**Arquivo Original**: `src/muya/lib/parser/render/renderBlock/renderContainerBlock.js`
- **Função**: Renderiza blocos container (tabelas, código)
- **O que extrair**: Função `renderContainerBlock`

**Arquivo Original**: `src/muya/lib/parser/render/renderInlines/index.js`
- **Função**: Exporta todas as funções de renderização inline
- **O que extrair**: Funções de renderização para cada tipo de token

**Arquivos de Renderização Inline** (`src/muya/lib/parser/render/renderInlines/`):
- `text.js` - Texto simples
- `strong.js` - Negrito
- `em.js` - Itálico
- `link.js` - Links
- `image.js` - Imagens
- `inlineCode.js` - Código inline
- `inlineMath.js` - Matemática inline
- `del.js` - Riscado
- `emoji.js` - Emojis

### 5. Utils

**Arquivo Original**: `src/muya/lib/utils/importMarkdown.js`
- **Função**: Converte markdown em blocos
- **O que extrair**: Método `markdownToState`

**Arquivo Original**: `src/muya/lib/utils/exportMarkdown.js`
- **Função**: Converte blocos em markdown
- **O que extrair**: Classe `ExportMarkdown`

## 🟡 Arquivos Importantes (Adaptar)

### Configuração

**Arquivo Original**: `src/muya/lib/config/index.js`
- **Função**: Constantes e configurações
- **O que extrair**: `CLASS_OR_ID`, constantes de configuração

### Seleção/Cursor

**Arquivo Original**: `src/muya/lib/selection/index.js`
- **Função**: Gerenciamento de seleção
- **O que extrair**: Funções de cursor e seleção

**Arquivo Original**: `src/muya/lib/selection/cursor.js`
- **Função**: Classe Cursor
- **O que extrair**: Estrutura de cursor

### Controllers Adicionais

**Arquivo Original**: `src/muya/lib/contentState/enterCtrl.js`
- **Função**: Handler de Enter
- **O que extrair**: Lógica de criação de novos blocos

**Arquivo Original**: `src/muya/lib/contentState/backspaceCtrl.js`
- **Função**: Handler de Backspace
- **O que extrair**: Lógica de remoção/fusão de blocos

## 🟢 Arquivos Opcionais (Para Features Avançadas)

### Tabelas
- `src/muya/lib/contentState/tableBlockCtrl.js`
- `src/muya/lib/parser/render/renderBlock/renderTable.js`

### Histórico/Undo-Redo
- `src/muya/lib/contentState/history.js`

### Drag & Drop
- `src/muya/lib/contentState/dragDropCtrl.js`

### Busca/Substituição
- `src/muya/lib/contentState/searchCtrl.js`

## 📦 Dependências Necessárias

```json
{
  "snabbdom": "^3.4.0",
  "snabbdom-to-html": "^7.0.0"
}
```

**Opcional** (se usar parser completo):
```json
{
  "marked": "^1.2.9"
}
```

## 🔧 Ordem de Implementação

### Fase 1: Parser Básico
1. ✅ `parser/rules.js` - Regras básicas
2. ✅ `parser/index.js` - Tokenizer simples
3. ✅ `parser/marked/lexer.js` - Lexer básico

### Fase 2: Content State
4. ✅ `contentState/index.js` - Estrutura básica
5. ✅ `utils/importMarkdown.js` - Importação
6. ✅ `utils/exportMarkdown.js` - Exportação

### Fase 3: Render
7. ✅ `render/snabbdom.js` - Setup Virtual DOM
8. ✅ `render/index.js` - Renderer principal
9. ✅ `render/renderBlock.js` - Renderização de blocos
10. ✅ `render/renderInlines.js` - Renderização inline

### Fase 4: Input Handling
11. ✅ `contentState/inputCtrl.js` - Handler de input
12. ✅ `contentState/updateCtrl.js` - Detecção de mudanças

### Fase 5: Refinamento
13. ✅ `contentState/enterCtrl.js` - Enter handler
14. ✅ `contentState/backspaceCtrl.js` - Backspace handler
15. ✅ Otimizações e features avançadas

## 📝 Notas de Adaptação

### Simplificações Possíveis

1. **Sem Virtual DOM**: Use manipulação DOM direta (menos eficiente)
2. **Renderização Completa**: Sempre renderize tudo (mais simples)
3. **Estrutura Simplificada**: Blocos sem referências complexas
4. **Parser Simplificado**: Apenas suporte básico de markdown

### Otimizações Recomendadas

1. **Manter Virtual DOM**: Snabbdom é essencial para performance
2. **Renderização Parcial**: Implemente desde o início
3. **Cache de Tokens**: Evita re-tokenização
4. **Debounce**: Para input rápido

## 🎯 Exemplo de Extração

```javascript
// 1. Copie o arquivo
cp src/muya/lib/parser/index.js seu-editor/parser/tokenizer.js

// 2. Adapte imports
// De:
import { beginRules, inlineRules } from './rules'
// Para:
import { beginRules, inlineRules } from './rules.js'

// 3. Remova dependências específicas do MarkText
// Remova referências a:
// - this.muya.options
// - CLASS_OR_ID específicos
// - Features não necessárias

// 4. Simplifique se necessário
// Remova suporte a features avançadas que não precisa
```

## ✅ Checklist de Extração

- [ ] Parser (tokenizer + lexer)
- [ ] Content State (estrutura de blocos)
- [ ] Render (Virtual DOM ou direto)
- [ ] Input Handler
- [ ] Update Detection
- [ ] Import/Export Markdown
- [ ] Renderização Inline
- [ ] Handlers de teclado (Enter, Backspace)
- [ ] Configurações e constantes
- [ ] Dependências instaladas

## 📚 Documentação Adicional

- `MARKDOWN_RENDERING_LOGIC.md` - Lógica completa explicada
- `RENDERING_SUMMARY.md` - Resumo executivo
- `EXTRACTED_RENDERING_EXAMPLE.js` - Exemplo prático

## 🚀 Próximos Passos

1. Leia `MARKDOWN_RENDERING_LOGIC.md` para entender a arquitetura
2. Veja `EXTRACTED_RENDERING_EXAMPLE.js` para exemplo prático
3. Comece pela Fase 1 (Parser Básico)
4. Teste cada fase antes de avançar
5. Adapte conforme suas necessidades

