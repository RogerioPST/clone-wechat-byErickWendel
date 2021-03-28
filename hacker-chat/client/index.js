#!/usr/bin/env node
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
*/
/*EXEMPLO*
node index.js \
    --username erickwendel \
    --room sala01 \
    --hostUri localhost

		ou sem as barras:
		node index.js --username ani01 --room sala02 --hostUri http://localhost:9898
		ou transformando o index.js em executavel:
		./index.js --username ani01 --room sala02 --hostUri http://localhost:9898
*/
import Events from 'events'
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import EventManager from './src/eventManager.js';
import TerminalController from "./src/terminalController.js";

//considerando o EXEMPLO*, em nodepath=node, filePath=arquivo index.js,
//commands=--username erickwendel \     --room sala01 \    --hostUri localhost
const [nodePath, filePath, ...commands] = process.argv

const config = CliConfig.parseArguments(commands)

/*
esse componente -componentEmitter- vai trafegar entre as camadas (controller, view)
emitindo os eventos necessarios p atualizar tela ou até p falar
c backend q alguma acao necessaria precisa ser feita
*/
const componentEmitter = new Events()

const socketClient = new SocketClient(config)
await socketClient.initialize()

const eventManager = new EventManager({ componentEmitter, socketClient})
const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
    roomId: config.room,
    userName: config.username
}
eventManager.joinRoomAndWaitForMessages(data)

const controller = new TerminalController()
await controller.initializeTable(componentEmitter)