# Todo!

Neste projeto, foi desenvolvido uma apliação web que permite os usuários gerenciarem suas próprias tarefas. O projeto foi desenvolvido com NodeJS, utilizando o framework express para rodar o servidor, EJS para a view engine, mysql2 para gerenciar o banco de dados, bcrypt para criptografar as senhas e jsonwebtoken para autenticar o usuário.

# Estrutura

    - /config
	    - /db
    - /public
	    - /assets
		    - /icons
	    - /css
	    - /js
    - /views
	    - /includes
    - index.js


## Config

Na pasta **Config**, existe uma pasta com o nome de **db**, dentro dela há um arquivo com o nome de **index.js**, onde dentro deste contém a configuração de conexão ao banco de dados.

## Public
O diretório **public** é utilizado para armazenar todo arquivo auxiliar, como folha de estilo, script, imagens, entre outros.

## Views
Na pasta **views** estão os arquivos das páginas da applicação e a pasta **includes**, onde estão armazenados componentes reutilizáveis.

## index.js

A **index.js** na pasta raíz do proojeto é responsável pelo servidor em geral, como gerenciamento de rotas, porta do servidor, middlewares e dependências.

# Rodar o projeto local
Para rodar o projeto local, você precisa:
- Clonar o [repositório no github](https://github.com/toom-dev/todo-kanban.git);
	>git clone https://github.com/toom-dev/todo-kanban.git
- Entrar na pasta do projeto;
	>cd todo-kanban
- Instalar as dependências;
	>npm install
	
- Executar o comando de produção ou de desenvolvimento;
	> (desenvolvimento) npm run dev; (produção) npm start

# Banco de Dados
Para o banco de dados foi utilizado o MySQL, onde está hospedado em meu servidor, então não há necessidade de subir a tabela no local.