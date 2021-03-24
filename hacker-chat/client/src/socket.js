export default class SocketClient {
	#serverConnection = {}

	constructor({ host, port, protocol }) {
			this.host = host
			this.port = port
			this.protocol = protocol
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

