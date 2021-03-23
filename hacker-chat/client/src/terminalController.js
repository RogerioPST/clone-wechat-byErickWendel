//receber as regras de negocio e fazer as delegacoes dos eventos
//chega uma msg do chat, ele delega p o componente alterar a tela etc
//n tem permissao p alterar os comandos do terminal e n tem permissao p alterar o socket
//inicializa td mundo
import ComponentsBuilder from "./components.js"
import { constants } from "./constants.js"

export default class TerminalController{
	#usersCollors = new Map()

	constructor(){
	}
	#pickCollor() {
		return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
	}

	#getUserCollor(userName) {
			if (this.#usersCollors.has(userName))
					return this.#usersCollors.get(userName)

			const collor = this.#pickCollor()
			this.#usersCollors.set(userName, collor)

			return collor
	}
	/*recebe um eventEmitter, pois uma vez q chega uma msg no chat, preciso avisar 
	o backend, a view etc q chegou a msg nova
	
	*/
	#onInputReceived(eventEmitter){
		return function(){
			const message = this.getValue()
			console.log(message)
			this.clearValue()
		}
	}
////passo o componente inteiro, mas no metodo onReceive, soh vai extrair o q ele precisa do obj components	
	#onMessageReceived({ screen, chat }) {
		return msg => {			
				const { userName, message } = msg
				const collor = this.#getUserCollor(userName)
				
				chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
				//chat.addItem(`{bold}${userName}{/}: ${message}`)
//toda vez q atualizar o componente, precisa chamar o render p atualizar a tela
				screen.render()
		}
}

	#onLogChanged({ screen, activityLog }) {

		return msg => {
				// erickwendel saiu/left
				// erickwendel entrou/join
//regex em td q for espaço
				const [userName] = msg.split(/\s/)
				const collor = this.#getUserCollor(userName)
				activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

				screen.render()
		}
	}
	#onStatusChanged({ screen, status }) {

		// [ 'erickwendel', 'mariazinha']
		return users => {
/*quero substituir td q estava no status pelo array novo
p eu n ter q fazer a logica p saber o q tinha de usuario aqui etc
*/ 
// vamos pegar o primeiro elemento da lista:
//no caso, items: ['{bold}Users on Room{/}' ]
//shift remove o primeiro elemento e retorna ele
				const { content } = status.items.shift()
				status.clearItems()
				status.addItem(content)

				users.forEach(userName => {
						const collor = this.#getUserCollor(userName)
						status.addItem(`{${collor}}{bold}${userName}{/}`)
				})

				screen.render()
		}
	}
/*componente p qdo uma msg for recebida, 
p atualizar o componente do chat, mas APENAS qdo vier resposta do servidor, 
p q n ocorra uma atualizacao sem estar online c o server*/	
	#registerEvents(eventEmitter, components) {
//emite uma msg p o canal turma01 
		eventEmitter.emit('turma01', 'hey')
//p quem tiver escutando esse canal turma01
		eventEmitter.on('turma01', msg => console.log(msg.toString()))		
//passo o componente inteiro, mas no metodo onReceive, soh vai extrair o q ele precisa do obj components
		eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
		eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
		eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))

	}
//recebe um eventEmitter, emissor de eventos do Node js 
//p a gente falar	"qdo der alguma coisa no socket, me traz esse evento
//p eu fazer o de/para desses eventos p a gente gerenciar como
//os componentens vao receber as msg ou ate relatorio de uso"
//qdo trabalha c socket, evento, melhor usar async 
	async initializeTable(eventEmitter){
		console.log("[initializeTable]")
		const components = new ComponentsBuilder()
			.setScreen({ title: 'Hacker-chat - Rogerio'})
			.setLayoutComponent()
			.setInputComponent(this.#onInputReceived(eventEmitter))
			.setChatComponent()
			.setActivityLogComponent()
			.setStatusComponent()
			.build()

		this.#registerEvents(eventEmitter, components)


		components.input.focus()
		components.screen.render()
//simulando q varias msg estao chegando
/*
setInterval(() =>{
	//na linha abaixo, dah erro, usar como na outra linha
	//eventEmitter.emit('message:received', 'hello world!!!')
	
	eventEmitter.emit('message:received', {message: 'hey', userName: 'rogerio'})
	eventEmitter.emit('message:received', {message: 'ho', userName: 'erick'})
	eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'eu saih')
	eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'ele saiu')
	
	const users = ['erick']
	eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
	users.push('rogerio')
	eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
	users.push('ironman01', 'troll001')
	eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
	users.push('asv21', 'rog23')
	eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
}, 2000)		
		*/
	}
}