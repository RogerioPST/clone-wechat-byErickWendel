/*
classe responsavel por construir o nosso layout sobre demanda
*/
import blessed from 'blessed'

export default class ComponentsBuilder{
	//componente privado screen
	#screen 
	#layout
	#input
	#chat
	#status
	#activityLog
	constructor(){

	}

//vai retornar as propriedades comuns p criar um componente	
//# - privado
	#baseComponent(){
		return {
			border: 'line', 
			mouse: true, 
			keys: true, 
			top:0,
			scrollbar:{
				ch: ' ', 
				inverse: true,			
			},
			//habilita colocar cores e tags no texto
			//por ex, 	items: '{bold}Messenger Title{/}'
			tags: true
		}	
	}
	setScreen({title}){
/*
smartCSR - funciona p fazer alguns redimensionamentos automaticos
*/	
		this.#screen = blessed.screen({
			smartCSR: true,
			title,

		})
/*qdo alguem digitar no terminal escape (esc) ou q ou 'C-c (control+c),
é p fechar
*/
		this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))	

		return this
	}

	setLayoutComponent(){
		this.#layout = blessed.layout({
			parent: this.#screen,
			width: '100%', 
			height: '100%'
		})
		return this
	}
//quando alguem estiver digitando no terminal, quero receber o evento
// q a pessoa digitou enter
	setInputComponent(onEnterPressed){
		//fg - foreground
		const input = blessed.textarea({
			parent: this.#screen,
			bottom: 0,
			height: '10%',
			inputOnFocus: true,
			padding:{
				top:1, 
				left:2,
			},
			style:{
				fg: '#f6f6f6',
				bg: '#353535'
			}
		})

		input.key('enter', onEnterPressed)
		this.#input = input

		return this
	}

	setChatComponent(){
		this.#chat = blessed.list({
			...this.#baseComponent(),
			parent: this.#layout,
			align: 'left', 
			width: '50%',
			height: '90%', 
			items: ['{bold}Messenger Title{/}']

		})
		return this
	}
	//vai saber se os usuarios continuam logados
	setStatusComponent() {
		this.#status = blessed.list({
				...this.#baseComponent(),
				parent: this.#layout,
				width: '25%',
				height: '90%',
				items: ['{bold}Users on Room{/}' ]
		})
		return this
	}
//vai registrar a atividade, se saiu, se entrou etc
	setActivityLogComponent() {
		this.#activityLog = blessed.list({
				...this.#baseComponent(),
				parent: this.#layout,
				width: '25%',
				height: '90%',
				style: {
						fg: 'yellow'
				},
				items: ['{bold}Activity Log{/}' ]
		})
		return this
	}
//responsavel por entregar o obj q precisamos
	build(){
		const components ={
			screen: this.#screen,
			input: this.#input,
			chat: this.#chat,
			activityLog: this.#activityLog,
			status: this.#status
		}

		return components
	}
}