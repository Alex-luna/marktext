# Resumo Executivo: Lógica de Renderização Markdown em Tempo Real

## Visão Geral

O MarkText usa uma arquitetura de **Virtual DOM** com **estrutura de blocos** para renderização eficiente de markdown em tempo real.

## Fluxo Principal

```
MARKDOWN TEXT
    ↓
[LEXER] → Estrutura de Blocos (ContentState)
    ↓
[TOKENIZER] → Tokens Inline (por bloco)
    ↓
[STATE RENDER] → Virtual DOM (Snabbdom)
    ↓
[PATCH] → DOM Real
```

## Componentes Essenciais

### 1. **Parser Layer** (`src/muya/lib/parser/`)

**Tokenizer** (`parser/index.js`):
- Converte texto em tokens inline: `strong`, `em`, `link`, `image`, `code`, etc.
- Processa formatação dentro de blocos

**Lexer** (`parser/marked/lexer.js`):
- Converte markdown em blocos estruturais: `p`, `h1-h6`, `ul`, `ol`, `li`, `pre`, etc.
- Processa sintaxe de bloco

### 2. **Content State** (`src/muya/lib/contentState/`)

**Estrutura de Blocos**:
```javascript
{
  key: 'unique-id',
  type: 'p',              // Tipo: p, h1, ul, li, etc.
  text: 'conteúdo',      // Texto do bloco
  functionType: 'paragraphContent',
  parent: 'parent-key',
  children: []
}
```

**Operações**:
- `importMarkdown()` - Converte markdown → blocos
- `exportMarkdown()` - Converte blocos → markdown
- `updateBlock()` - Atualiza bloco
- `checkBlockTypeChange()` - Detecta mudança de tipo

### 3. **State Render** (`src/muya/lib/parser/render/`)

**Renderização**:
- `render()` - Renderiza todos os blocos
- `partialRender()` - Renderiza apenas range modificado
- `singleRender()` - Renderiza um único bloco

**Virtual DOM (Snabbdom)**:
- Usa `h()` para criar Virtual DOM
- Usa `patch()` para aplicar diferenças
- Muito mais eficiente que manipulação direta

### 4. **Input Handler** (`contentState/inputCtrl.js`)

**Processamento de Input**:
1. Detecta mudança no DOM
2. Atualiza texto do bloco no ContentState
3. Verifica se precisa mudar tipo de bloco
4. Re-renderiza (parcial ou completo)

### 5. **Update Controller** (`contentState/updateCtrl.js`)

**Detecção de Mudanças**:
- Detecta quando texto deve virar outro tipo de bloco
- Ex: `# texto` → cabeçalho, `- texto` → lista

## Arquivos Chave para Extrair

### Core
- `src/muya/lib/index.js` - Classe Muya principal
- `src/muya/lib/contentState/index.js` - Gerenciamento de estado
- `src/muya/lib/parser/index.js` - Tokenizer
- `src/muya/lib/parser/marked/lexer.js` - Lexer
- `src/muya/lib/parser/render/index.js` - Renderer

### Parsing
- `src/muya/lib/parser/rules.js` - Regras de parsing
- `src/muya/lib/parser/marked/blockRules.js` - Regras de blocos
- `src/muya/lib/parser/marked/inlineRules.js` - Regras inline

### Rendering
- `src/muya/lib/parser/render/snabbdom.js` - Virtual DOM setup
- `src/muya/lib/parser/render/renderBlock/` - Renderização de blocos
- `src/muya/lib/parser/render/renderInlines/` - Renderização inline

### Controllers
- `src/muya/lib/contentState/inputCtrl.js` - Handler de input
- `src/muya/lib/contentState/updateCtrl.js` - Detecção de mudanças
- `src/muya/lib/contentState/enterCtrl.js` - Handler Enter
- `src/muya/lib/contentState/backspaceCtrl.js` - Handler Backspace

### Utils
- `src/muya/lib/utils/importMarkdown.js` - Markdown → Blocos
- `src/muya/lib/utils/exportMarkdown.js` - Blocos → Markdown

## Dependências Principais

```json
{
  "snabbdom": "^3.4.0",           // Virtual DOM
  "snabbdom-to-html": "^7.0.0",   // VNode → HTML
  "marked": "^1.2.9"              // Parser markdown (modificado)
}
```

## Conceitos Importantes

### 1. Virtual DOM
- **Por quê**: Permite atualizações incrementais eficientes
- **Como**: Snabbdom calcula diferenças e atualiza apenas o necessário
- **Benefício**: Performance muito melhor que manipulação direta

### 2. Estrutura de Blocos
- **Por quê**: Representa documento como árvore, não texto plano
- **Como**: Cada elemento é um bloco com referências (parent, siblings)
- **Benefício**: Permite edição WYSIWYG sem perder formatação

### 3. Tokenização Inline
- **Por quê**: Formatação inline precisa ser processada separadamente
- **Como**: Cada bloco tokeniza seu texto para formatação
- **Benefício**: Suporta formatação rica (negrito, itálico, links, etc.)

### 4. Renderização Parcial
- **Por quê**: Performance - não precisa renderizar tudo
- **Como**: Calcula range afetado e renderiza apenas isso
- **Benefício**: Resposta rápida mesmo em documentos grandes

### 5. Detecção de Padrões
- **Por quê**: Converte texto em tipo de bloco automaticamente
- **Como**: Regex patterns detectam sintaxe markdown
- **Benefício**: Experiência WYSIWYG natural

## Otimizações Implementadas

1. **Renderização Parcial**: Apenas blocos modificados
2. **Cache de Tokens**: Evita re-tokenização
3. **Virtual DOM**: Apenas diferenças são aplicadas
4. **Lazy Rendering**: Elementos pesados (Mermaid) assíncronos
5. **Debounce**: Agrupa renderizações rápidas

## Como Adaptar para Outro Editor

### Passo 1: Parser
```javascript
// Implemente tokenizer e lexer
const tokens = tokenizer(text, options)
const blocks = lexer(markdown)
```

### Passo 2: Content State
```javascript
// Gerencie estado como blocos
class ContentState {
  blocks = []
  importMarkdown(markdown) { ... }
  exportMarkdown() { ... }
}
```

### Passo 3: Renderer
```javascript
// Renderize blocos em DOM
class StateRender {
  render(blocks) {
    // Virtual DOM ou manipulação otimizada
  }
}
```

### Passo 4: Input Handler
```javascript
// Detecte mudanças e atualize estado
container.addEventListener('input', (e) => {
  updateBlock(key, text)
  render()
})
```

### Passo 5: Update Detection
```javascript
// Detecte mudanças de tipo
checkBlockTypeChange(block) {
  if (/^#\s/.test(block.text)) {
    convertToHeading(block)
  }
}
```

## Exemplo Mínimo

```javascript
// 1. Parse markdown
const blocks = parseMarkdown(markdown)

// 2. Renderiza
blocks.forEach(block => {
  const element = renderBlock(block)
  container.appendChild(element)
})

// 3. Detecta mudanças
container.addEventListener('input', (e) => {
  const block = getBlock(e.target)
  block.text = e.target.textContent
  reRender(block)
})
```

## Diferenças do MarkText

O MarkText adiciona:
- Virtual DOM completo (Snabbdom)
- Renderização parcial otimizada
- Sistema de referências complexo
- Suporte a elementos avançados (tabelas, diagramas)
- Histórico/undo-redo
- Múltiplos cursors
- Drag & drop

Para um editor mais simples, você pode:
- Usar manipulação DOM direta (menos eficiente)
- Renderizar tudo sempre (mais simples)
- Simplificar estrutura de blocos
- Remover features avançadas

## Conclusão

A chave do sistema é:
1. **Estado como estrutura** (não texto)
2. **Virtual DOM** para eficiência
3. **Renderização parcial** para performance
4. **Tokenização inline** para formatação rica

Veja `EXTRACTED_RENDERING_EXAMPLE.js` para exemplo prático completo.

