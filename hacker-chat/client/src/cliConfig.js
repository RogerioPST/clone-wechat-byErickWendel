//extrair os comandos do terminal
export default class CliConfig {
	constructor({ username, hostUri, room }) {
			this.username = username
			this.room = room 

			const { hostname, port, protocol } = new URL(hostUri)

			this.host = hostname
			this.port = port
			//regex - td q n for letra, vai remover
			this.protocol = protocol.replace(/\W/, '')
			
	}
	static parseArguments(commands) {
			const cmd = new Map()
			for(const key in commands) {

					const index = parseInt(key)
					const command = commands[key]

					const commandPreffix = '--'
					if(!command.includes(commandPreffix)) continue;
					
					cmd.set(
							command.replace(commandPreffix, ''),
							commands[index + 1]
					)
			}
//transformando de map p objeto e passando p o construtor da classe
			return new CliConfig(Object.fromEntries(cmd))
	}
}