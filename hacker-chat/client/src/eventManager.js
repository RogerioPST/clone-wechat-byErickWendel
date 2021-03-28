import { constants } from "./constants.js"
/*
estamos trabalhando c dois tipos de eventos diferentes
{ componentEmitter, socketClient } -
qdo acontece alguma coisa no socket, a gente tem q receber essa msg
q veio do servidor e ao msm tempo, tem q falar p o componente q ele precisa
ser atualizado, pq o componente precisa receber a msg, atualizar o chat
, atualizar a tabela q criamos e td mais..
entao, essa classe abaixo vai servir p juntar esses caras..

*/

export default class EventManager {
    #allUsers = new Map()
    constructor({ componentEmitter, socketClient }) {
        this.componentEmitter = componentEmitter
        this.socketClient = socketClient
    }
//funcao usada p dizer q assim q estabilizar c o socket, 
//vou avisar q quero me
//comunicar p ficar esperando p receber as msg
    joinRoomAndWaitForMessages(data) {
        this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data)

        this.componentEmitter.on(constants.events.app.MESSAGE_SENT, msg => {
            this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg)
        })
    }
//uma vez q conectamos, o servidor vai mandar uma msg de volta p 
//a gente informando quais usuarios ele atualizou.		
    updateUsers(users) {
        const connectedUsers = users
        connectedUsers.forEach(({ id, userName }) => this.#allUsers.set(id, userName))
        this.#updateUsersComponent()
    }
//o servidor já está recebendo a msg de disconnected. 
//falta agora o client tb receber, deletar o user, atualizar
//activity e usersComponent
		disconnectUser(user) {
			const { userName, id } = user
			this.#allUsers.delete(id)

			this.#updateActivityLogComponent(`${userName} left!`)
			this.#updateUsersComponent()
		}

		message(message) {
			this.componentEmitter.emit(
					constants.events.app.MESSAGE_RECEIVED,
					message
			)
		}
//cada uma dessas funcoes publicas eh o mesmo nome da constants do server - newUserConnected
    newUserConnected(message) {
        const user = message
        this.#allUsers.set(user.id, user.userName)
        this.#updateUsersComponent()
        this.#updateActivityLogComponent(`${user.userName} joined!`)
    }

    #updateActivityLogComponent(message) {
        this.componentEmitter.emit(
            constants.events.app.ACTIVITYLOG_UPDATED,
            message
        )
    }

    #updateUsersComponent() {
        this.componentEmitter.emit(
            constants.events.app.STATUS_UPDATED,
            Array.from(this.#allUsers.values())
        )

    }

    getEvents() {
//buscando todas as funções dessa classe, sem ser construtor e as funcoes q n tem
//hashtag, pegando apenas as publicas			
        const functions = Reflect.ownKeys(EventManager.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)])

        return new Map(functions)
    }

}