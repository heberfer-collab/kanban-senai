# 🚀 Modern Kanban Board - SENAI

Um sistema de gerenciamento de tarefas (Kanban) completo, com estética premium "Cyber-Luxury", desenvolvido para a atividade do curso SENAI. O projeto utiliza as tecnologias mais modernas do ecossistema JavaScript para garantir performance, tipagem forte e uma experiência de usuário fluida.

## ✨ Funcionalidades Principais

- **Dashboard de Métricas:** Visualize sua produtividade com gráficos e cards de resumo.
- **Quadro Kanban Interativo:** Arraste e solte tarefas entre colunas com feedback sonoro e visual.
- **Mutações Otimistas:** As alterações são refletidas instantaneamente na interface.
- **Sistema de Categorias:** Organize suas tarefas por tags dinâmicas.
- **Compartilhamento de Tarefas:** Gere links públicos para visualizar detalhes de tarefas específicas.
- **Autenticação Completa:** Sistema de Login e Registro seguro com JWT.
- **Modo Escuro Nativo:** Design adaptado para alta performance visual em ambientes escuros.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** + **Vite**
- **TypeScript** (Tipagem estática)
- **Tailwind CSS** (Estilização moderna e responsiva)
- **TanStack Query (v5)** (Gerenciamento de estado de servidor e cache)
- **Zustand** (Estado global leve)
- **Hello Pangea DnD** (Drag and Drop performático)
- **Recharts** (Gráficos de produtividade)
- **Lucide React** (Pacote de ícones premium)

### Backend
- **Node.js** + **Express**
- **Prisma ORM** (Manipulação de banco de dados SQL)
- **SQLite** (Banco de dados local em arquivo)
- **JSON Web Token (JWT)** (Segurança)
- **Bcrypt** (Criptografia de senhas)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- NPM ou Yarn

### 1. Configuração do Backend
```bash
cd backend
npm install
# O banco de dados SQLite já está pré-configurado
npx prisma generate
npx prisma db push
npm run dev
```
O servidor rodará em: `http://localhost:3000`

### 2. Configuração do Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse no navegador: `http://localhost:5173`

---

## 🎨 Design System (Cyber-Luxury)
O projeto utiliza uma paleta de cores baseada em tons de **Slate**, **Primary (Indigo/Violet)** e **Emerald**, com efeitos de:
- **Glassmorphism:** Cartões com fundo translúcido e desfoque.
- **Backdrop Blur:** Elementos que desfocam o fundo para destaque.
- **Micro-animações:** Transições suaves em botões e estados de hover.

---

## 👨‍💻 Autor
Desenvolvido como parte das atividades do curso SENAI.
