/**
 * EXEMPLO EXTRAÍDO: Lógica de Renderização de Markdown em Tempo Real
 * 
 * Este arquivo demonstra como extrair e usar os componentes principais
 * do sistema de renderização do MarkText em outro editor.
 * 
 * Componentes necessários:
 * 1. Tokenizer - Converte texto em tokens inline
 * 2. Lexer - Converte markdown em estrutura de blocos
 * 3. ContentState - Gerencia estado como árvore de blocos
 * 4. StateRender - Renderiza blocos em DOM
 * 5. Input Handler - Detecta e processa mudanças
 */

// ============================================================================
// 1. TOKENIZER - Converte texto em tokens inline
// ============================================================================

/**
 * Tokeniza texto markdown em tokens inline (negrito, itálico, links, etc.)
 * 
 * @param {string} text - Texto a tokenizar
 * @param {object} options - Opções de parsing
 * @returns {Array} Array de tokens
 */
function tokenizeInline(text, options = {}) {
  const tokens = []
  let pos = 0
  
  // Regex para diferentes tipos de tokens
  const patterns = {
    strong: /(\*\*|__)(.+?)\1/,
    em: /(\*|_)(.+?)\1/,
    code: /(`)(.+?)\1/,
    link: /\[([^\]]+)\]\(([^)]+)\)/,
    image: /!\[([^\]]*)\]\(([^)]+)\)/
  }
  
  while (pos < text.length) {
    let matched = false
    
    // Tenta cada padrão
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = text.slice(pos).match(pattern)
      if (match && match.index === 0) {
        tokens.push({
          type,
          raw: match[0],
          content: match[2] || match[1],
          range: { start: pos, end: pos + match[0].length }
        })
        pos += match[0].length
        matched = true
        break
      }
    }
    
    if (!matched) {
      // Texto simples
      tokens.push({
        type: 'text',
        raw: text[pos],
        content: text[pos],
        range: { start: pos, end: pos + 1 }
      })
      pos++
    }
  }
  
  return tokens
}

// ============================================================================
// 2. LEXER - Converte markdown em estrutura de blocos
// ============================================================================

/**
 * Converte markdown em estrutura de blocos
 * 
 * @param {string} markdown - Texto markdown
 * @returns {Array} Array de blocos
 */
function parseMarkdownToBlocks(markdown) {
  const blocks = []
  const lines = markdown.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Cabeçalho
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: `h${headingMatch[1].length}`,
        text: headingMatch[2],
        level: headingMatch[1].length
      })
      continue
    }
    
    // Lista
    const listMatch = line.match(/^([-*+]|\d+\.)\s+(.+)$/)
    if (listMatch) {
      blocks.push({
        type: 'li',
        text: listMatch[2],
        listType: /^\d+/.test(listMatch[1]) ? 'ordered' : 'unordered',
        marker: listMatch[1]
      })
      continue
    }
    
    // Bloco de código
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      let code = ''
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n'
        i++
      }
      blocks.push({
        type: 'code',
        text: code.trim(),
        lang
      })
      continue
    }
    
    // Parágrafo (padrão)
    if (line.trim()) {
      blocks.push({
        type: 'p',
        text: line
      })
    }
  }
  
  return blocks
}

// ============================================================================
// 3. CONTENT STATE - Gerencia estado como árvore de blocos
// ============================================================================

class ContentState {
  constructor() {
    this.blocks = []
    this.cursor = { start: { key: null, offset: 0 }, end: { key: null, offset: 0 } }
  }
  
  /**
   * Importa markdown e converte em blocos
   */
  importMarkdown(markdown) {
    const parsedBlocks = parseMarkdownToBlocks(markdown)
    this.blocks = parsedBlocks.map((block, index) => ({
      key: `block-${index}`,
      ...block,
      parent: null,
      children: []
    }))
  }
  
  /**
   * Atualiza texto de um bloco
   */
  updateBlock(key, text) {
    const block = this.blocks.find(b => b.key === key)
    if (block) {
      block.text = text
      
      // Verifica se precisa mudar tipo de bloco
      this.checkBlockTypeChange(block)
    }
  }
  
  /**
   * Verifica se texto deve mudar tipo de bloco
   */
  checkBlockTypeChange(block) {
    const text = block.text
    
    // Cabeçalho
    if (/^#{1,6}\s/.test(text)) {
      const match = text.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        block.type = `h${match[1].length}`
        block.text = match[2]
      }
      return true
    }
    
    // Lista
    if (/^[-*+]\s/.test(text)) {
      block.type = 'li'
      block.text = text.replace(/^[-*+]\s+/, '')
      return true
    }
    
    return false
  }
  
  /**
   * Exporta blocos para markdown
   */
  exportMarkdown() {
    return this.blocks.map(block => {
      switch (block.type) {
        case 'h1': return `# ${block.text}`
        case 'h2': return `## ${block.text}`
        case 'h3': return `### ${block.text}`
        case 'h4': return `#### ${block.text}`
        case 'h5': return `##### ${block.text}`
        case 'h6': return `###### ${block.text}`
        case 'li': return `- ${block.text}`
        case 'code': return `\`\`\`${block.lang || ''}\n${block.text}\n\`\`\``
        default: return block.text
      }
    }).join('\n\n')
  }
}

// ============================================================================
// 4. STATE RENDER - Renderiza blocos em DOM
// ============================================================================

class StateRender {
  constructor(container) {
    this.container = container
  }
  
  /**
   * Renderiza todos os blocos
   */
  render(blocks) {
    const fragment = document.createDocumentFragment()
    
    blocks.forEach(block => {
      const element = this.renderBlock(block)
      fragment.appendChild(element)
    })
    
    // Limpa container e adiciona novos elementos
    this.container.innerHTML = ''
    this.container.appendChild(fragment)
  }
  
  /**
   * Renderiza um único bloco
   */
  renderBlock(block) {
    const element = document.createElement('div')
    element.setAttribute('data-key', block.key)
    element.className = `ag-${block.type} ag-paragraph`
    
    // Renderiza conteúdo baseado no tipo
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        element.tagName = block.type
        this.renderInlines(element, block.text)
        break
        
      case 'p':
        element.tagName = 'p'
        this.renderInlines(element, block.text)
        break
        
      case 'li':
        element.tagName = 'li'
        this.renderInlines(element, block.text)
        break
        
      case 'code':
        const pre = document.createElement('pre')
        const code = document.createElement('code')
        code.textContent = block.text
        if (block.lang) code.className = `language-${block.lang}`
        pre.appendChild(code)
        element.appendChild(pre)
        break
        
      default:
        element.textContent = block.text
    }
    
    // Torna editável
    element.contentEditable = true
    
    return element
  }
  
  /**
   * Renderiza tokens inline dentro de um elemento
   */
  renderInlines(element, text) {
    const tokens = tokenizeInline(text)
    
    tokens.forEach(token => {
      let node
      
      switch (token.type) {
        case 'strong':
          node = document.createElement('strong')
          node.textContent = token.content
          node.className = 'ag-strong'
          break
          
        case 'em':
          node = document.createElement('em')
          node.textContent = token.content
          node.className = 'ag-emphasis'
          break
          
        case 'code':
          node = document.createElement('code')
          node.textContent = token.content
          node.className = 'ag-inline-code'
          break
          
        case 'link':
          node = document.createElement('a')
          node.textContent = token.content
          node.href = token.href
          node.className = 'ag-link'
          break
          
        case 'image':
          node = document.createElement('img')
          node.src = token.src
          node.alt = token.alt
          node.className = 'ag-image'
          break
          
        default:
          node = document.createTextNode(token.content)
      }
      
      element.appendChild(node)
    })
  }
  
  /**
   * Renderização parcial - atualiza apenas um bloco
   */
  partialRender(block) {
    const existing = this.container.querySelector(`[data-key="${block.key}"]`)
    if (existing) {
      const newElement = this.renderBlock(block)
      existing.replaceWith(newElement)
    }
  }
}

// ============================================================================
// 5. EDITOR PRINCIPAL - Integra tudo
// ============================================================================

class MarkdownEditor {
  constructor(container) {
    this.container = container
    this.contentState = new ContentState()
    this.renderer = new StateRender(container)
    
    this.setupEventListeners()
  }
  
  /**
   * Define markdown inicial
   */
  setMarkdown(markdown) {
    this.contentState.importMarkdown(markdown)
    this.renderer.render(this.contentState.blocks)
  }
  
  /**
   * Obtém markdown atual
   */
  getMarkdown() {
    return this.contentState.exportMarkdown()
  }
  
  /**
   * Configura listeners de eventos
   */
  setupEventListeners() {
    // Input event - detecta mudanças de texto
    this.container.addEventListener('input', (e) => {
      const element = e.target
      const key = element.getAttribute('data-key')
      
      if (key) {
        // Obtém texto do elemento (sem formatação HTML)
        const text = this.getTextContent(element)
        
        // Atualiza bloco
        this.contentState.updateBlock(key, text)
        
        // Re-renderiza apenas este bloco
        const block = this.contentState.blocks.find(b => b.key === key)
        if (block) {
          this.renderer.partialRender(block)
        }
      }
    })
    
    // Keydown - detecta Enter, Backspace, etc.
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleEnter(e)
      } else if (e.key === 'Backspace') {
        this.handleBackspace(e)
      }
    })
  }
  
  /**
   * Obtém texto puro de um elemento (sem HTML)
   */
  getTextContent(element) {
    // Remove elementos de formatação mas mantém texto
    const clone = element.cloneNode(true)
    const codeElements = clone.querySelectorAll('code, strong, em, a')
    codeElements.forEach(el => {
      const text = document.createTextNode(el.textContent)
      el.replaceWith(text)
    })
    return clone.textContent || clone.innerText || ''
  }
  
  /**
   * Handler para Enter
   */
  handleEnter(e) {
    // Cria novo parágrafo
    const newBlock = {
      key: `block-${Date.now()}`,
      type: 'p',
      text: '',
      parent: null,
      children: []
    }
    
    // Insere após bloco atual
    const currentKey = e.target.getAttribute('data-key')
    const currentIndex = this.contentState.blocks.findIndex(b => b.key === currentKey)
    this.contentState.blocks.splice(currentIndex + 1, 0, newBlock)
    
    // Re-renderiza
    this.renderer.render(this.contentState.blocks)
    
    // Foca no novo bloco
    const newElement = this.container.querySelector(`[data-key="${newBlock.key}"]`)
    if (newElement) {
      newElement.focus()
    }
    
    e.preventDefault()
  }
  
  /**
   * Handler para Backspace
   */
  handleBackspace(e) {
    const element = e.target
    const key = element.getAttribute('data-key')
    const block = this.contentState.blocks.find(b => b.key === key)
    
    // Se bloco está vazio e não é o primeiro, remove
    if (block && !block.text.trim() && this.contentState.blocks.length > 1) {
      const index = this.contentState.blocks.indexOf(block)
      this.contentState.blocks.splice(index, 1)
      this.renderer.render(this.contentState.blocks)
      e.preventDefault()
    }
  }
}

// ============================================================================
// EXEMPLO DE USO
// ============================================================================

/*
// HTML
<div id="editor"></div>

// JavaScript
const container = document.getElementById('editor')
const editor = new MarkdownEditor(container)

// Define markdown inicial
editor.setMarkdown(`
# Título

Este é um **parágrafo** com *formatação*.

- Item 1
- Item 2

\`\`\`javascript
console.log('Hello')
\`\`\`
`)

// Obtém markdown atualizado
const markdown = editor.getMarkdown()
console.log(markdown)
*/

// ============================================================================
// OTIMIZAÇÕES AVANÇADAS (do MarkText)
// ============================================================================

/**
 * 1. Virtual DOM (Snabbdom) - Apenas atualiza diferenças
 * 
 * Em vez de substituir todo o DOM, usa Virtual DOM para
 * calcular diferenças e atualizar apenas o necessário.
 */

/**
 * 2. Renderização Parcial
 * 
 * Em vez de renderizar tudo, renderiza apenas:
 * - Blocos que mudaram
 * - Range de blocos afetados
 * - Bloco do cursor se necessário
 */

/**
 * 3. Cache de Tokens
 * 
 * Cache tokens tokenizados para evitar re-tokenização
 * desnecessária do mesmo texto.
 */

/**
 * 4. Debounce de Renderização
 * 
 * Para mudanças rápidas, agrupa renderizações em batch.
 */

/**
 * 5. Lazy Loading
 * 
 * Renderiza elementos pesados (Mermaid, diagramas) de forma
 * assíncrona após renderização principal.
 */

// ============================================================================
// NOTAS IMPORTANTES
// ============================================================================

/*
1. O MarkText usa Snabbdom para Virtual DOM - muito mais eficiente
2. A estrutura de blocos permite edição WYSIWYG sem perder formatação
3. Tokenização inline separada permite formatação rica dentro de blocos
4. Sistema de referências (parent, siblings) mantém estrutura hierárquica
5. Renderização parcial é chave para performance

Para implementação completa, veja:
- src/muya/lib/parser/ - Parser completo
- src/muya/lib/contentState/ - Gerenciamento de estado
- src/muya/lib/parser/render/ - Sistema de renderização
*/

export {
  tokenizeInline,
  parseMarkdownToBlocks,
  ContentState,
  StateRender,
  MarkdownEditor
}

