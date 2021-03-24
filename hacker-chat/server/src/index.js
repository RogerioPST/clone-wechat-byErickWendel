import SocketServer from "./socket.js";
import Event from 'events'
import { constants } from "./constants.js";
import Controller from "./controller.js";

const eventEmitter = new Event()

//vamos enviar uma conexao http e informar q queremos trabalhar c websocket
//inicio
/* async function testServer(){
	const options ={
		port: 9898,
		host: 'localhost',
		headers: {
			Connection: 'Upgrade',
			Upgrade: 'websocket'
		}
	}

	const http = await import('http')
	const req = http.request(options)
	req.end()

	req.on('upgrade', (res, socket) =>{
		socket.on('data', data => {
			console.log('client received', data.toString())
		})

		setInterval(() => {
			socket.write('Hello!')
		}, 500)
	})

}
 */
//vamos enviar ACIMA uma conexao http e informar q queremos trabalhar c websocket
//fim

const port = process.env.PORT || 9898
const socketServer = new SocketServer({ port })
const server = await socketServer.initialize(eventEmitter)
console.log('socket server is running at', server.address().port)


//vamos enviar uma conexao http e informar q queremos trabalhar c websocket
//inicio
/* eventEmitter.on(
	constants.event.NEW_USER_CONNECTED, (socket) => {
		console.log('new connection', socket.id)
		socket.on('data', data => {
			console.log('server received', data.toString())
	//nesse caso, quero dar um reply		
			socket.write('World!')
		})
	}) */

	//await testServer()
	
//vamos enviar ACIMA uma conexao http e informar q queremos trabalhar c websocket
//fim
	
const controller = new Controller({ socketServer })
eventEmitter.on(
    constants.event.NEW_USER_CONNECTED,
	//faço o bind p considerar o this do controller	
    controller.onNewConnection.bind(controller)
)
