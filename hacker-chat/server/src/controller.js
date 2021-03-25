//responsavel por mapear as req do socket e gerenciar
import { constants } from "./constants.js"

export default class Controller {
//se quisermos acessar todos os usuarios no geral
	#users = new Map()
//se quisermos acessar os usuarios de uma sala especifica, conseguimos
	#rooms = new Map()


	constructor({ socketServer }) {
			this.socketServer = socketServer
	}
	onNewConnection(socket) {
			const { id } = socket
			console.log('connection stablished with', id)
			const userData = { id, socket }
			this.#updateGlobalUserData(id, userData)

			socket.on('data', this.#onSocketData(id))
			socket.on('error', this.#onSocketClosed(id))
			socket.on('end', this.#onSocketClosed(id))
	}	

	async joinRoom(socketId, data) {
		const userData = data
		console.log(`${userData.userName} joined! ${[socketId]}`)
		const user = this.#updateGlobalUserData(socketId, userData)

		const { roomId } = userData
		const users = this.#joinUserOnRoom(roomId, user)

//devolve os usuarios ativos
		const currentUsers = Array.from(users.values())
				.map(({ id, userName }) => ({ userName, id }))

//uma vez q me conectei c esse socket, posso mandar uma msg 
//de volta p ele dizendo q consegui conectar c vc e eu vou te 
//mandar agora todos os usuarios q estao online nesse momento p vc
//atualizar a sua interface
		//  atualiza o usuario corrente sobre todos os usuarios
		// que jaa estao conectados na mesma sala
		this.socketServer
				.sendMessage(user.socket, constants.event.UPDATE_USERS, currentUsers)

		// avisa a rede que um novo usuario conectou-se
		this.broadCast({
				socketId,
				roomId,
				message: { id: socketId, userName: userData.userName},
				event: constants.event.NEW_USER_CONNECTED,
		})
	}

	//includeCurrentSocket = false - usado p n receber msg duplicada e entrar em loop infinito
	//includeCurrentSocket = true - p mandar msg inclusive p quem mandou a msg
	broadCast({ socketId, roomId, event, message, includeCurrentSocket = false }) {
			const usersOnRoom = this.#rooms.get(roomId)

			for (const [key, user] of usersOnRoom) {
					if(!includeCurrentSocket && key === socketId) continue;

					this.socketServer.sendMessage(user.socket, event, message)
			}

	}
	//se quisermos acessar os usuarios de uma sala especifica, conseguimos
	#joinUserOnRoom(roomId, user) {
			const usersOnRoom = this.#rooms.get(roomId) ?? new Map()
			usersOnRoom.set(user.id, user)
			this.#rooms.set(roomId, usersOnRoom)
			return usersOnRoom
	}

	#onSocketClosed(id) {
			return data => {
					console.log('onSocketClosed', id)
			}
	}
//toda vez q alguem emitir um evento, vai cair aqui, daih vai extrair	o
//evento e a message, vai descobrir a funcao q vai chamar e passar os param p essa funcao
	#onSocketData(id) {
		return data => {
			try {
					const { event, message } = JSON.parse(data)
//os eventos vao ser os	mesmos nomes da funcao q teremos nessa classe				
					this[event](id, message)
			} catch (error) {
					console.error(`wrong event format!!`, data.toString())
			}
	}
	}

	#updateGlobalUserData(socketId, userData) {
			const users = this.#users
	//se tiver valor, pego ele, se ele vier undefined ou null, vou retornar o objeto vazio
			const user = users.get(socketId) ?? {}

			const updatedUserData = {
					...user, 
					...userData
			}

			users.set(socketId, updatedUserData)

			return users.get(socketId)
	}
}