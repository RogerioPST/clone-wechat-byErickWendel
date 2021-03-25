
import Event from 'events'

export default class SocketClient {
	#serverConnection = {}
	#serverListener = new Event()

	constructor({ host, port, protocol }) {
			this.host = host
			this.port = port
			this.protocol = protocol
	}
//no client, o envio de msg eh 1 (socket client) para 1 (socket servidor)
	sendMessage(event, message) {
			this.#serverConnection.write(JSON.stringify({ event, message }))
	}

	attachEvents(events) {
		this.#serverConnection.on('data', data => {
				try {
						data
								.toString()
								.split('\n')
				//so mantem no array o q tiver valor				
								.filter(line => !!line)
								.map(JSON.parse)
								.map(({ event, message }) => {
//esse event vai ser sempre o nome da funcao dentro eventManager									
//chegou uma msg do servidor, qdo der o emit, vai falar "dah um emit p mim
//la no 'updateUsers'", mas n tem ngm ouvindo esse cara. entao, preciso
//fazer o seguinte: qdo receber essa msg de 'updateUsers', quero q vc
//chame essa funcao especifica.
										this.#serverListener.emit(event, message)
								})

				} catch (error) {
						console.log('invalid!', data.toString(), error)
				}

		})

		this.#serverConnection.on('end', () => {
//tentativa de reconectar			
				console.log('I disconnected!!')
		})

		this.#serverConnection.on('error', (error) => {
				console.error('DEU RUIM', error)
		})
//esse events vem do GetEvents
		for( const [key, value] of events) {
				this.#serverListener.on(key, value)
		}
	}

	async createConnection() {
			const options = {
					port: this.port,
					host: this.host,
					headers: {
							Connection: 'Upgrade',
							Upgrade: 'websocket'
					}
			}

			//no nodejs, temos duas bibliotecas: uma p cada coisa. por isso o this.protocol
			//se for http ou https, pega dinamicamente
			const http = await import(this.protocol)
			const req = http.request(options)
			req.end()

			return new Promise(resolve => {
			//uma promise soh pode ser executada uma vez e se o evento ocorrer varias vezes,
			//vamos perder as prox. por isso, executamos so uma: ONCE	
					req.once('upgrade', (res, socket) => resolve(socket))
			})
	}

	async initialize() {
			this.#serverConnection = await this.createConnection()
			console.log('I connected to the server!!')
	}
}

