# Índice de Arquivos - Extração Markdown Rendering

## 📚 Documentação (`docs/`)

| Arquivo | Descrição | Tempo de Leitura |
|---------|-----------|------------------|
| `README.md` | Visão geral e guia de uso | 5 min |
| `RENDERING_SUMMARY.md` | Resumo executivo da arquitetura | 10 min |
| `EXTRACTED_RENDERING_EXAMPLE.js` | Exemplo prático completo | 15 min |
| `MARKDOWN_RENDERING_LOGIC.md` | Documentação completa detalhada | 30 min |
| `FILES_TO_EXTRACT.md` | Guia de arquivos e implementação | 15 min |

## 💻 Código Fonte (`source-code/`)

### Config (`config/`)
- `index.js` - Constantes, configurações, CLASS_OR_ID

### Parser (`parser/`)
- `index.js` - **Tokenizer principal** (tokenização inline)
- `rules.js` - **Regras de parsing** (beginRules, inlineRules)
- `escapeCharacter.js` - Caracteres de escape
- `marked/` - Parser de blocos
  - `lexer.js` - **Lexer principal** (markdown → tokens de bloco)
  - `blockRules.js` - Regras de blocos
  - `inlineRules.js` - Regras inline detalhadas
  - `parser.js` - Processamento de tokens
  - `renderer.js` - Renderização de tokens
  - Outros arquivos de suporte

### Content State (`contentState/`)
- `index.js` - **ContentState principal** (gerenciamento de estado)
- `inputCtrl.js` - **Input handler** (processa input do usuário)
- `updateCtrl.js` - **Update detection** (detecta mudanças de tipo)
- `enterCtrl.js` - Handler de Enter
- `backspaceCtrl.js` - Handler de Backspace

### Render (`render/`)
- `index.js` - **StateRender principal** (renderização)
- `snabbdom.js` - **Setup Virtual DOM** (Snabbdom)
- `renderBlock/` - Renderização de blocos
  - `index.js` - Exportações
  - `renderBlock.js` - Renderização geral
  - `renderLeafBlock.js` - Blocos folha (p, h1-h6, li)
  - `renderContainerBlock.js` - Blocos container (tabelas, código)
  - Outros arquivos de suporte
- `renderInlines/` - Renderização inline
  - `index.js` - Exportações
  - `text.js` - Texto simples
  - `strong.js` - Negrito
  - `em.js` - Itálico
  - `link.js` - Links
  - `image.js` - Imagens
  - `inlineCode.js` - Código inline
  - `inlineMath.js` - Matemática inline
  - `del.js` - Riscado
  - `emoji.js` - Emojis
  - Outros arquivos de renderização inline

### Utils (`utils/`)
- `importMarkdown.js` - **Markdown → Blocos**
- `exportMarkdown.js` - **Blocos → Markdown**
- `index.js` - Funções utilitárias
- `random.js` - Geração de IDs únicos
- `hash.js` - Funções de hash
- `dompurify.js` - Sanitização HTML

### Selection (`selection/`)
- `index.js` - Gerenciamento de seleção
- `cursor.js` - Classe Cursor
- `dom.js` - Manipulação DOM relacionada à seleção

## 🎯 Arquivos Mais Importantes (Prioridade)

### 🔴 Essenciais (Copiar Primeiro)
1. `parser/index.js` - Tokenizer
2. `parser/marked/lexer.js` - Lexer
3. `contentState/index.js` - ContentState
4. `render/index.js` - StateRender
5. `render/snabbdom.js` - Virtual DOM setup
6. `contentState/inputCtrl.js` - Input handler
7. `contentState/updateCtrl.js` - Update detection
8. `utils/importMarkdown.js` - Import
9. `utils/exportMarkdown.js` - Export

### 🟡 Importantes (Segunda Prioridade)
10. `parser/rules.js` - Regras
11. `config/index.js` - Configurações
12. `render/renderBlock/` - Renderização de blocos
13. `render/renderInlines/` - Renderização inline
14. `selection/` - Seleção/cursor

### 🟢 Opcionais (Features Avançadas)
15. `contentState/enterCtrl.js` - Enter handler
16. `contentState/backspaceCtrl.js` - Backspace handler
17. Outros controllers e features avançadas

## 📖 Ordem de Leitura Recomendada

1. **`docs/README.md`** - Comece aqui
2. **`docs/RENDERING_SUMMARY.md`** - Entenda a arquitetura
3. **`docs/EXTRACTED_RENDERING_EXAMPLE.js`** - Veja exemplo prático
4. **`source-code/parser/index.js`** - Entenda tokenização
5. **`source-code/parser/marked/lexer.js`** - Entenda parsing de blocos
6. **`source-code/contentState/index.js`** - Entenda gerenciamento de estado
7. **`source-code/render/index.js`** - Entenda renderização
8. **`docs/MARKDOWN_RENDERING_LOGIC.md`** - Leia documentação completa
9. **`docs/FILES_TO_EXTRACT.md`** - Siga guia de implementação

## 🔍 Busca Rápida

### Quero entender...
- **Tokenização**: `parser/index.js`
- **Parsing de blocos**: `parser/marked/lexer.js`
- **Gerenciamento de estado**: `contentState/index.js`
- **Renderização**: `render/index.js`
- **Input handling**: `contentState/inputCtrl.js`
- **Detecção de mudanças**: `contentState/updateCtrl.js`
- **Virtual DOM**: `render/snabbdom.js`
- **Import/Export**: `utils/importMarkdown.js`, `utils/exportMarkdown.js`

### Quero implementar...
- **Parser básico**: `parser/` + `config/rules.js`
- **Content State**: `contentState/index.js`
- **Render**: `render/` + `render/snabbdom.js`
- **Input**: `contentState/inputCtrl.js`
- **Updates**: `contentState/updateCtrl.js`

## 📝 Notas

- Todos os arquivos mantêm suas dependências originais
- Alguns imports podem precisar ser ajustados ao adaptar
- Veja `FILES_TO_EXTRACT.md` para detalhes de adaptação
- Use `EXTRACTED_RENDERING_EXAMPLE.js` como base simplificada


