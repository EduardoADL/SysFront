INSTALAÇÃO DO PROJETO/INICIALIZAÇÃO
- Clone o repositório em sua máquina
- Abra um prompt de comando no dentro diretório da aplicação clonada
- Digite o comando "yarn install"
- Logo após digite o comando "yarn dev"
- Abra o navegador e acesse: http://localhost:5173/
- ( obs: Para o funcionamento correto da aplicação é necessário que o backend esteja funcionando na porta 3000 da sua máquina => https://github.com/camargo-leonardo/mock-api)

TECNOLOGIAS UTILIZADAS
- React
- Type Script
- Vite
- Tailwind
- Material Tailwind
- React Toastify
- Axios

FUNCIONALIDADES DA APLICAÇÃO
- Página Inicial
  - Login   
  - Cadastro
- Página Landing
  - Sair 
  - Visualizar saldo 
  - Listagem de apostas
    - Cancelar aposta
  - Apostar
  - Filtrar apostas
  - Listagem de transações
  - Filtrar transações

ADENDOS
  - Foi necessário configurar o cors no backend para a utilização do axios. Configuração adicionada a seguir:
    
      ```
      const cors = require("cors");
      app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }));
      ```
