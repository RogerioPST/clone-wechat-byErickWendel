/*EXEMPLO*
node index.js \
    --username erickwendel \
    --room sala01 \
    --hostUri localhost
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