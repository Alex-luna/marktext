# Lógica de Renderização de Markdown em Tempo Real - MarkText

Este documento explica como o MarkText implementa a renderização de markdown em tempo real (WYSIWYG).

## Arquitetura Geral

O MarkText usa uma arquitetura baseada em **Virtual DOM** com **Snabbdom** para renderização eficiente. O sistema funciona em três camadas principais:

1. **Parser Layer**: Converte markdown em tokens e depois em blocos estruturados
2. **Content State Layer**: Gerencia o estado do documento como uma árvore de blocos
3. **Render Layer**: Converte blocos em Virtual DOM e depois em DOM real

## Fluxo de Dados

```
Markdown Text
    ↓
[Tokenizer] → Tokens
    ↓
[Lexer] → Block Structure (ContentState)
    ↓
[StateRender] → Virtual DOM (Snabbdom)
    ↓
[Patch] → Real DOM
    ↓
User Input → [Input Handler] → Update ContentState → Re-render
```

## Componentes Principais

### 1. Parser (`src/muya/lib/parser/`)

#### Tokenizer (`parser/index.js`)
Converte texto markdown em tokens inline (links, imagens, formatação, etc.)

```javascript
// Exemplo de uso
const tokens = tokenizer(text, {
  hasBeginRules: false,
  options: this.muya.options
})
```

**Principais tipos de tokens:**
- `text`: Texto simples
- `strong`: **negrito**
- `em`: *itálico*
- `link`: Links
- `image`: Imagens
- `inline_code`: Código inline
- `inline_math`: Matemática inline
- `del`: ~~riscado~~
- `emoji`: Emojis

#### Lexer (`parser/marked/lexer.js`)
Converte markdown em blocos de estrutura (parágrafos, listas, tabelas, etc.)

**Principais tipos de blocos:**
- `p`: Parágrafo
- `h1-h6`: Cabeçalhos
- `ul/ol`: Listas
- `li`: Item de lista
- `pre`: Bloco de código
- `hr`: Linha horizontal
- `figure`: Container (tabelas, diagramas, etc.)

### 2. Content State (`src/muya/lib/contentState/`)

Gerencia o estado do documento como uma árvore de blocos.

#### Estrutura de um Bloco

```javascript
{
  key: 'unique-id',           // ID único do bloco
  type: 'p',                  // Tipo: p, h1, ul, li, etc.
  text: 'conteúdo',          // Texto do bloco
  functionType: 'paragraphContent', // Função específica
  parent: 'parent-key',       // Referência ao pai
  preSibling: 'sibling-key', // Irmão anterior
  nextSibling: 'sibling-key', // Próximo irmão
  children: [],               // Filhos do bloco
  editable: true              // Se é editável
}
```

#### Operações Principais

```javascript
// Criar um bloco
const block = this.createBlock('p', { text: 'Hello' })

// Adicionar filho
this.appendChild(parentBlock, childBlock)

// Inserir antes/depois
this.insertBefore(newBlock, oldBlock)
this.insertAfter(newBlock, oldBlock)

// Remover bloco
this.removeBlock(block)

// Obter bloco por key
const block = this.getBlock(key)
```

### 3. State Render (`src/muya/lib/parser/render/`)

Converte blocos em Virtual DOM usando Snabbdom.

#### Renderização Completa

```javascript
render(blocks, activeBlocks, matches) {
  // 1. Cria Virtual DOM a partir dos blocos
  const newVdom = h('div#ag-editor-id', 
    blocks.map(block => this.renderBlock(null, block, activeBlocks, matches))
  )
  
  // 2. Obtém o DOM atual como Virtual DOM
  const rootDom = document.querySelector('div#ag-editor-id')
  const oldVdom = toVNode(rootDom)
  
  // 3. Aplica diferenças (patch)
  patch(oldVdom, newVdom)
  
  // 4. Renderiza elementos especiais (Mermaid, diagramas)
  this.renderMermaid()
  this.renderDiagram()
}
```

#### Renderização Parcial (Otimização)

```javascript
partialRender(blocks, activeBlocks, matches, startKey, endKey) {
  // Renderiza apenas os blocos que mudaram
  // Remove DOM antigo e insere novo HTML
  // Usa patch apenas para o bloco do cursor se necessário
}
```

#### Renderização de Blocos

Cada tipo de bloco tem sua função de renderização:

- `renderLeafBlock`: Parágrafos, cabeçalhos, listas
- `renderContainerBlock`: Tabelas, blocos de código, HTML
- `renderInlines`: Tokens inline dentro de blocos

### 4. Input Handler (`contentState/inputCtrl.js`)

Detecta mudanças no DOM e atualiza o ContentState.

```javascript
inputHandler(event) {
  // 1. Obtém o texto atual do DOM
  const text = getTextContent(paragraph)
  
  // 2. Atualiza o bloco no ContentState
  block.text = text
  
  // 3. Verifica se precisa re-renderizar
  if (needRender) {
    this.singleRender(block) // Renderiza apenas este bloco
  } else if (needRenderAll) {
    this.render() // Renderiza tudo
  }
}
```

### 5. Update Controller (`contentState/updateCtrl.js`)

Detecta quando o texto precisa ser convertido em um tipo diferente de bloco.

```javascript
checkInlineUpdate(block) {
  // Verifica se o texto corresponde a um padrão de bloco
  // Ex: "# " → cabeçalho, "- " → lista, etc.
  
  if (text.match(/^#{1,6}\s/)) {
    return this.updateHeading(block)
  }
  if (text.match(/^[-*+]\s/)) {
    return this.updateList(block, 'bullet')
  }
  // etc...
}
```

## Fluxo de Renderização em Tempo Real

### 1. Inicialização

```javascript
// 1. Cria instância do Muya
const muya = new Muya(container, { markdown: '# Hello' })

// 2. Converte markdown em blocos
const blocks = this.markdownToState(markdown)

// 3. Renderiza blocos
this.render(blocks, activeBlocks, matches)
```

### 2. Durante a Edição

```javascript
// 1. Usuário digita → evento input
inputHandler(event) {
  // 2. Atualiza texto do bloco
  block.text = newText
  
  // 3. Verifica se precisa atualizar tipo de bloco
  if (this.checkInlineUpdate(block)) {
    // Converte para novo tipo (ex: parágrafo → lista)
    this.updateList(block)
  }
  
  // 4. Tokeniza o texto para renderização inline
  const tokens = tokenizer(block.text, { ... })
  
  // 5. Re-renderiza apenas o bloco modificado
  this.singleRender(block)
}
```

### 3. Renderização de Tokens Inline

```javascript
renderInlines(block, tokens, activeBlocks, matches) {
  return tokens.map(token => {
    switch (token.type) {
      case 'strong':
        return h('strong.ag-strong', token.children)
      case 'em':
        return h('em.ag-emphasis', token.children)
      case 'link':
        return h('a.ag-link', { attrs: { href: token.href } }, token.children)
      case 'image':
        return h('img.ag-image', { attrs: { src: token.src, alt: token.alt } })
      // etc...
    }
  })
}
```

## Otimizações

### 1. Renderização Parcial
- Renderiza apenas blocos que mudaram
- Usa `partialRender` para atualizar range específico
- Usa `singleRender` para um único bloco

### 2. Cache de Tokens
```javascript
// Cache tokens para evitar re-tokenização
this.tokenCache = new Map()
```

### 3. Virtual DOM (Snabbdom)
- Apenas atualiza diferenças no DOM
- Muito mais eficiente que manipulação direta

### 4. Lazy Rendering
- Mermaid, diagramas e matemática são renderizados assincronamente
- Não bloqueia a renderização principal

## Exemplo de Implementação Simplificada

```javascript
class SimpleMarkdownEditor {
  constructor(container) {
    this.container = container
    this.blocks = []
    this.renderer = new StateRender()
  }
  
  setMarkdown(markdown) {
    // 1. Parse markdown em blocos
    this.blocks = this.parseMarkdown(markdown)
    
    // 2. Renderiza
    this.render()
  }
  
  parseMarkdown(markdown) {
    const lexer = new Lexer()
    const tokens = lexer.lex(markdown)
    return this.tokensToBlocks(tokens)
  }
  
  render() {
    // Cria Virtual DOM
    const vdom = this.blocks.map(block => this.renderBlock(block))
    
    // Aplica ao DOM real
    const oldVdom = toVNode(this.container)
    patch(oldVdom, h('div', vdom))
  }
  
  onInput(event) {
    // Atualiza bloco
    const block = this.getCurrentBlock()
    block.text = event.target.textContent
    
    // Re-renderiza
    this.render()
  }
}
```

## Arquivos Chave

### Core
- `src/muya/lib/index.js` - Classe principal Muya
- `src/muya/lib/contentState/index.js` - Gerenciamento de estado
- `src/muya/lib/parser/index.js` - Tokenizer
- `src/muya/lib/parser/marked/lexer.js` - Lexer de blocos
- `src/muya/lib/parser/render/index.js` - Renderer principal

### Controllers
- `src/muya/lib/contentState/inputCtrl.js` - Handler de input
- `src/muya/lib/contentState/updateCtrl.js` - Detecção de mudanças de tipo
- `src/muya/lib/contentState/enterCtrl.js` - Handler de Enter
- `src/muya/lib/contentState/backspaceCtrl.js` - Handler de Backspace

### Utils
- `src/muya/lib/utils/importMarkdown.js` - Conversão markdown → blocos
- `src/muya/lib/utils/exportMarkdown.js` - Conversão blocos → markdown

## Dependências Principais

- **Snabbdom**: Virtual DOM library
- **Marked**: Parser de markdown (modificado)
- **Turndown**: HTML → Markdown converter

## Pontos Importantes

1. **Virtual DOM é essencial**: Permite renderização eficiente e atualizações incrementais
2. **Estrutura de blocos**: Representa o documento como árvore, não como texto plano
3. **Tokenização inline**: Formatação inline é processada separadamente dos blocos
4. **Renderização parcial**: Apenas atualiza o que mudou, não tudo
5. **Detecção de padrões**: Detecta quando texto deve virar outro tipo de bloco

## Adaptação para Outro Editor

Para adaptar essa lógica:

1. **Implemente o parser**: Tokenizer + Lexer
2. **Crie estrutura de blocos**: Sistema de árvore com referências
3. **Implemente renderer**: Virtual DOM ou manipulação direta otimizada
4. **Handler de input**: Detecta mudanças e atualiza estado
5. **Sistema de atualização**: Detecta mudanças de tipo de bloco

A chave é manter o estado como estrutura de dados (blocos) e não como texto, permitindo renderização eficiente e edição WYSIWYG.

