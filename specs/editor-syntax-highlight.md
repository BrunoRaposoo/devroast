# Especificação: Editor com Syntax Highlight

## 1. Conclusão da Pesquisa

### Bibliotecas Analisadas

| Biblioteca | Uso no Ray.so | Tamanho | Linguagens | Tipo |
|------------|---------------|---------|------------|------|
| **Shiki** | ✅ (principal) | Grande | ~100 | Estático |
| **highlight.js** | ✅ (secundário) | Médio | ~190 | Auto-detect |
| **Prism.js** | ❌ | Pequeno | ~300 | Client-side |

### O que o Ray.so usa

O Ray.so utiliza **Shiki** como syntax highlighter principal, complementado com highlight.js. Shiki usa as mesmas TextMate grammars do VS Code, oferecendo o highlight mais preciso e bonito disponível.

### Abordagens para Editor Editável

Para um editor onde o usuário pode digitar/colar código, existem duas abordagens principais:

1. **Overlay Technique** (usada pela maioria das libs leve):
   - Textarea transparente sobre um elemento `<pre><code>` com highlight
   - Funciona em tempo real
   - Leve e simples

2. **Editor completo** (Monaco, CodeMirror, Ace):
   - heavy-weight (~300KB+)
   - Overkill para用例 simples

### Recomendação

Para este projeto (DevRoast - ferramenta de code review), a recomendação é:

**Prism.js + react-simple-code-editor** ou **@uiw/react-textarea-code-editor**

Justificativa:
- Leve (~10KB vs Shiki que é ~1MB+)
- Suporta auto-detecção de linguagem
- Funciona bem para edição de trechos pequenos
- Integração simples com React
- Suporta ~300 linguagens

---

## 2. Especificação da Feature

### Requisitos Funcionais

- [ ] Editor editável para entrada de código
- [ ] Syntax highlight automático baseado na linguagem detectada
- [ ] Selector manual de linguagem (dropdown na homepage)
- [ ] Auto-detecção de linguagem quando o usuário cola código
- [ ] Suporte às linguagens mais populares (JS, TS, Python, Go, Rust, Java, etc.)

### Fluxo do Usuário

1. Usuário acessa a homepage
2. Pode selecionar linguagem manualmente (opcional)
3. Cola um trecho de código no editor
4. Sistema detecta a linguagem automaticamente
5. Aplica o syntax highlight correspondente

### Stack Recomendada

- **Syntax Highlighting**: Prism.js (via react-syntax-highlighter ou prism-react-renderer)
- **Editor**: @uiw/react-textarea-code-editor ou react-simple-code-editor
- **Detecção de Linguagem**: highlight.js (função `highlightAuto`)

---

## 3. To-Dos

- [ ] **TODO 1**: Instalar dependências (prismjs, react-syntax-highlighter ou @uiw/react-textarea-code-editor)
- [ ] **TODO 2**: Criar componente `CodeEditor` em `src/components/ui/`
- [ ] **TODO 3**: Implementar detecção automática de linguagem usando highlight.js
- [ ] **TODO 4**: Adicionar seletor de linguagem na homepage
- [ ] **TODO 5**: Integrar o editor na página principal
- [ ] **TODO 6**: Testar com diferentes linguagens

---

## 4. Perguntas para Compreensão

### ❓ Pergunta 1: Onde o editor será usado?

O editor será usado apenas na homepage para o usuário colar o código inicial, ou será necessário em outras partes da aplicação (ex: para exibir código já processado no dashboard de resultados)?

### ❓ Pergunta 2: Qual o tamanho esperado dos trechos de código?

Pequenos trechos (1-50 linhas) ou código maior? Isso impacta na escolha da biblioteca (algumas têm problemas de performance com código muito grande).

### ❓ Pergunta 3: Precisa de alguma funcionalidade extra no editor?

- Line numbers?
- Copiar código com um clique?
- Tema escuro/claro?
- Indentação automática?

### ❓ Pergunta 4: O código colado precisa ser executável/editável posteriormente?

Ou é apenas para leitura e análise (como no código que será revisado pelo DevRoast)?

### ❓ Pergunta 5: Quais linguagens são prioritárias?

Todas as ~300 linguagens do Prism.js ou apenas um subconjunto específico (JS, TS, Python, Go, Rust, etc.)?

---

## 5. Referências

- Ray.so: https://github.com/raycast/ray-so (usa Shiki + highlight.js)
- react-simple-code-editor: https://github.com/react-simple-code-editor/react-simple-code-editor
- @uiw/react-textarea-code-editor: https://uiwjs.github.io/react-textarea-code-editor/
- Prism.js: https://prismjs.com/
- highlight.js: https://highlightjs.org/
- Shiki: https://shiki.style/
