# Extração da Lógica de Renderização Markdown em Tempo Real

Este diretório contém toda a documentação e código fonte extraído do MarkText para implementar renderização de markdown em tempo real (WYSIWYG) em outro editor.

## 📁 Estrutura

```
markdown-rendering-extraction/
├── README.md                          # Este arquivo
├── docs/                              # Documentação completa
│   ├── MARKDOWN_RENDERING_LOGIC.md   # Arquitetura detalhada
│   ├── RENDERING_SUMMARY.md          # Resumo executivo
│   ├── FILES_TO_EXTRACT.md           # Guia de arquivos
│   └── EXTRACTED_RENDERING_EXAMPLE.js # Exemplo prático
│
└── source-code/                       # Código fonte extraído
    ├── config/                        # Configurações e constantes
    ├── parser/                        # Parser (tokenizer + lexer)
    ├── contentState/                  # Gerenciamento de estado
    ├── render/                        # Sistema de renderização
    ├── utils/                         # Utilitários
    └── selection/                     # Gerenciamento de seleção/cursor
```

## 🚀 Como Usar

### 1. Leia a Documentação

Comece lendo os documentos na ordem:

1. **`docs/RENDERING_SUMMARY.md`** - Visão geral rápida (5 min)
2. **`docs/EXTRACTED_RENDERING_EXAMPLE.js`** - Exemplo prático (10 min)
3. **`docs/MARKDOWN_RENDERING_LOGIC.md`** - Arquitetura completa (30 min)
4. **`docs/FILES_TO_EXTRACT.md`** - Guia de implementação (15 min)

### 2. Entenda a Arquitetura

O sistema funciona em 3 camadas:

```
Markdown Text
    ↓
[Parser] → Estrutura de Blocos (ContentState)
    ↓
[Tokenizer] → Tokens Inline
    ↓
[StateRender] → Virtual DOM (Snabbdom) → DOM Real
```

### 3. Use o Código Fonte

O código fonte em `source-code/` está organizado por módulos:

- **`parser/`** - Tokenização e parsing de markdown
- **`contentState/`** - Gerenciamento de estado como árvore de blocos
- **`render/`** - Renderização usando Virtual DOM
- **`utils/`** - Funções utilitárias (import/export markdown)

### 4. Adapte para Seu Editor

Veja `docs/EXTRACTED_RENDERING_EXAMPLE.js` para um exemplo simplificado que você pode adaptar.

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

## 🎯 Conceitos Principais

### 1. Virtual DOM
- Usa **Snabbdom** para renderização eficiente
- Apenas atualiza diferenças, não todo o DOM
- **Essencial** para performance

### 2. Estrutura de Blocos
- Documento representado como **árvore de blocos**, não texto
- Cada bloco tem referências (parent, siblings, children)
- Permite edição WYSIWYG sem perder formatação

### 3. Tokenização Inline
- Formatação inline (negrito, itálico, links) processada separadamente
- Cada bloco tokeniza seu texto para renderização rica

### 4. Renderização Parcial
- Renderiza apenas blocos que mudaram
- Calcula range afetado e atualiza apenas isso
- **Chave** para performance em documentos grandes

### 5. Detecção de Padrões
- Detecta quando texto deve virar outro tipo de bloco
- Ex: `# texto` → cabeçalho, `- texto` → lista

## 📋 Checklist de Implementação

Siga a ordem em `docs/FILES_TO_EXTRACT.md`:

- [ ] **Fase 1: Parser Básico**
  - [ ] Regras de parsing
  - [ ] Tokenizer inline
  - [ ] Lexer de blocos

- [ ] **Fase 2: Content State**
  - [ ] Estrutura de blocos
  - [ ] Import markdown
  - [ ] Export markdown

- [ ] **Fase 3: Render**
  - [ ] Setup Virtual DOM
  - [ ] Renderer principal
  - [ ] Renderização de blocos
  - [ ] Renderização inline

- [ ] **Fase 4: Input Handling**
  - [ ] Handler de input
  - [ ] Detecção de mudanças

- [ ] **Fase 5: Refinamento**
  - [ ] Enter handler
  - [ ] Backspace handler
  - [ ] Otimizações

## 🔧 Arquivos Essenciais

### Core
- `source-code/parser/index.js` - Tokenizer
- `source-code/parser/marked/lexer.js` - Lexer
- `source-code/contentState/index.js` - ContentState
- `source-code/render/index.js` - StateRender

### Controllers
- `source-code/contentState/inputCtrl.js` - Input handler
- `source-code/contentState/updateCtrl.js` - Update detection

### Utils
- `source-code/utils/importMarkdown.js` - Markdown → Blocos
- `source-code/utils/exportMarkdown.js` - Blocos → Markdown

## 📝 Notas Importantes

1. **Virtual DOM é essencial** - Não tente fazer sem Snabbdom, performance será ruim
2. **Estrutura de blocos** - Representa documento como árvore, não texto
3. **Renderização parcial** - Apenas atualiza o que mudou
4. **Tokenização inline** - Processa formatação separadamente dos blocos
5. **Adapte conforme necessário** - Remova features que não precisa

## 🎓 Exemplo Rápido

```javascript
// 1. Parse markdown em blocos
const blocks = parseMarkdown(markdown)

// 2. Renderiza blocos
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

Veja `docs/EXTRACTED_RENDERING_EXAMPLE.js` para exemplo completo.

## 📚 Recursos Adicionais

- **MarkText GitHub**: https://github.com/marktext/marktext
- **Snabbdom Docs**: https://github.com/snabbdom/snabbdom
- **CommonMark Spec**: https://spec.commonmark.org/

## ⚠️ Licença

Este código é extraído do MarkText, que usa licença MIT. Verifique a licença original antes de usar em produção.

## 🤝 Próximos Passos

1. Leia `docs/RENDERING_SUMMARY.md`
2. Veja `docs/EXTRACTED_RENDERING_EXAMPLE.js`
3. Estude os arquivos em `source-code/`
4. Adapte para seu editor
5. Teste e refine

---

**Boa sorte com sua implementação!** 🚀


