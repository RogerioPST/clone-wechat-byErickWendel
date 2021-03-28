versao usada do node : 15.11.0

para trabalhar com script module, colocar "type:" "module" no package.json

npm install blessed p interface do chat no terminal
npm i -D nodemon


deletando qualquer pasta node_modules dentro de hacker-chat-aula02:

```
rm - rf hacker-chat-aula02/**/node_modules
```

após isso, copiar e colar, criar a pasta aula03, entrar em cada projeto e fazer p instalar as dependencias:

```
npm ci --silent
```

/*
para usar o seguinte comando que não existe: "hacker-chat --username ani01 --room sala02 --hostUri http://localhost:9898", fazer:
I. para executar o projeto como um executavel ao instalar o nosso projeto com npm hacker-chat, precisamos transformar
para aceitar:
1. bash node index.js
ou
2. bash ./node index.js

II. para isso, precisamos informar onde o node está localizado. no caso do padrao unix, 
proceder como abaixo:
#!/usr/bin/env node

III. dar permissao p o arquivo ser executado: chmod +x index.js

IV. qdo rodamos um comando 'mocha', internamente, está apontando p um package.json q aciona:
-"bin": {
		"hacker-chat": "index.js"
	},
V. rodar o comando "npm link" p permitir executar 'hacker-chat' pela linha de comando.

VI. posso usar o cmd:
"
hacker-chat --username ani01 --room sala02 --hostUri http://localhost:9898
"

VII. p subir p o npm:
1. npm login
2. npm publish --access public


obs: nome do pacote, vai de acordo c o " "name": "@meunomusuarionpm/hacker-chat-client"," no package.json!!!!

apos publicar no npm, p desvincular o cmd na maquina/no path, fazer:
npm unlink -g @meunomusuarionpm/hacker-chat-client
e aih, p rodar a partir do q enviei p o npm, fazer:
npm link -g @meunomusuarionpm/hacker-chat-client
daih, dah p usar p instalar:
npm i -g @meunomusuarionpm/hacker-chat-client

obs2: p despublicar, fazer:
npm unlink -g @meunomusuarionpm/hacker-chat-client
npm unpublish --force
*/
