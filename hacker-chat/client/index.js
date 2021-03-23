import Events from 'events'
import TerminalController from "./src/terminalController.js";

/*
esse componente -componentEmitter- vai trafegar entre as camadas (controller, view)
emitindo os eventos necessarios p atualizar tela ou até p falar
c backend q alguma acao necessaria precisa ser feita
*/
const componentEmitter = new Events()
const controller = new TerminalController()
await controller.initializeTable(componentEmitter)