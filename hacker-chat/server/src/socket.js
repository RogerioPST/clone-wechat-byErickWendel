//a conexao do http pode ser atualizada para o protocolo do web socket
import http from 'http'
import { v4 } from 'uuid'
import { constants } from './constants.js'

export default class SocketServer {
    constructor({ port }) {
        this.port = port
    }
		async sendMessage(socket, event, message) {
				const data = JSON.stringify({ event, message })
				socket.write(`${data}\n`)
		}	
    async initialize(eventEmitter) {

        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('hey there!!')
        })
/*
WEBSOCKET - a conexao do http pode ser atualizada para o protocolo do web socket
tem q sofrer uma atualizacao e ai tem q ter uma comunicacao entre eles, 
uma troca de header p poder entender q aconteceu alguma coisa, q a conexao foi
atualizada e n tem q devolver td no request, response; tem q devolver sobre demanda, 
tem q continuar. uma vez q alguem pediu p fazer o upgrade, vou responder q concordo como abaixo:
criando uns headers customizados.
*/
        server.on('upgrade', (req, socket) => {
            socket.id = v4()
            const headers = [
                'HTTP/1.1 101 Web Socket Protocol Handshake',
                'Upgrade: WebSocket',
                'Connection: Upgrade',
                ''
            ].map(line => line.concat('\r\n')).join('')

            socket.write(headers)
            eventEmitter.emit(constants.event.NEW_USER_CONNECTED, socket)
        })


        return new Promise((resolve, reject) => {
            server.on('error', reject)
//qdo der certo, chamo resolve e retorno a instancia do server						
            server.listen(this.port, () => resolve(server))
        })

    }
}