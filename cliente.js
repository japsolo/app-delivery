// @ts-check
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// Funciones necesarias
const estaVacio = (text) => text.trim() === '';

// Bienvenida al sistema
console.log('Bienvenido a DH Pizzas. Estamos listos para tomar tu pedido');

// Preguntas del pedido - Array de objetos
/*
	Cada objeto debe tener las siguientes claves obligatorias
	type: String - Especifica el tipo de pregunta, default 'input'. 
		Opciones: 
			- input -> retorna un string
			- confirm -> retorna un booleano
			- list -> retorna la opción elegida, lista desordenada
			- rawlist -> retorna la opción elegida, lista ordenada
			- expand -> retorna la opción elegida, lista de autocomplete
			- checkbox -> retornas las opciones elegidas (array)
	name: String - Nombre de la clave que almacenará la respuesta,
	message: String - Texto de la pregunta
	
	* Opcionales *
	
	default: valor default de la pregunta
	choices: array - arreglo de opciones (strings), necesario para preguntas de tipo list, rawlist, expand y checkbox
	validate: función - Recibe la respuesta del usuario. Retorna true
	si la respuesta es valida, o un mensaje de error (String) si no.
	when: función - Recibe una respuesta de otra clave. Retorna true o false dependiendo de la validación que se ejecute.
*/ 
const opcionesPedido = [
	// Pregunta 1 - ¿La pizza es para delivery?
	{
		type: 'confirm',
		name: 'paraDelivery',
		message: '¿La pizza es para delivery?',
		default: false
	},
	// Pregunta 1a - Si la pizza es para delivery se dispara esta pregunta
	{
		type: 'input',
		name: 'direccion',
		message: 'Ingresá la calle, altura, piso y departamento:',
		when: function (respuestas) {
			// Cuando la pregunta 1 da true, se dispara esta pregunta
			return respuestas.paraDelivery;
		},
		validate: function (valor) {
			// validación para para cuando el campo está vacío
			if (estaVacio(valor)) {
				return '¡Ingresá tu dirección!';
			}
			return true;
		}
	},
	// Pregunta 2 - Nombre del cliente
	{
		type: 'input',
		name: 'nombreCliente',
		message: 'Ingresá tu nombre:',
		validate: function (valor) {
			// validación para para cuando el campo está vacío
			if (estaVacio(valor)) {
				return '¡Ingresá tu nombre!';
			}
			return true;
		}
	},
	// Pregunta 3 - Teléfono del cliente
	{
		type: 'input',
		name: 'telefonoCliente',
		message: 'Ingresá tu número de teléfono:',
		validate: function (valor) {
			// validación para para cuando el campo está vacío
			if (estaVacio(valor)) {
				return '¡Ingresá tu número de teléfono!';
			} else if (isNaN(valor)) { // validación por si el dato contiene letras
				return '¡Ingresá solo números!';
			}
			return true;
		}
	},
	// Pregunta 4 - Gusto de la pizza
	{
		type: 'rawlist',
		name: 'gustoPizza',
		message: '¿De qué gusto querés la pizza?',
		choices: ['Muzzarela', 'Jamón y morrón', 'Calabresa', 'Napolitana'],
		default: 'Muzzarela'
	},
	// Pregunta 5 - Tamaño de la pizza
	{
		type: 'list',
		name: 'tamanioPizza',
		message: 'Elegí el tamaño para tu pizza (P: $430, M: $560, G: $650)',
		choices: ['Personal', 'Mediana', 'Grande'],
		default: 'Grande'
	},
	// Pregunta 6 - ¿Lleva bebida?
	{
		type: 'confirm',
		name: 'conBebida',
		message: '¿Deseás agregar una bebida 650ml por sólo $80?',
		default: false,
	},
	// Pregunta 6a - Si lleva bebida se dispara esta pregunta
	{
		type: 'list',
		name: 'gustoBebida',
		message: 'Elegí el gusto de la bebida:',
		choices: [
			new inquirer.Separator('Línea Coca-cola'),
			'Coca cola',
			'Fanta',
			'Sprite',
			new inquirer.Separator('Línea Pepsi'),
			'Pepsi',
			'Mirinda',
			'7 Up',
			new inquirer.Separator('Aguas minerales'),
			'Villavicencio',
			'Villa del Sur',
			'Bon aqua',
		],
		when: function (respuestas) {
			// Cuando la pregunta 6 da true, se dispara esta pregunta
			return respuestas.conBebida;
		}
	},
	// Pregunta 7 - ¿Es cliente habitual?
	{
		type: 'confirm',
		name: 'clienteHabitual',
		message: '¿Ya has hecho un pedido con nosotros?',
		default: false
	},
	// Pregunta 7a - Si es cliente habitual
	{
		type: 'checkbox',
		name: 'empanadas',
		message: 'Por ser cliente habitual te regalamos 3 empanadas, elegí tres gustos distintos:',
		choices: ['Carne picante', 'Carne cortada a cuchillo', 'Jamon y muzzarela', 'Pollo', 'Ananá y jamón', 'Queso y cebolla'],
		when: function (respuestas) {
			// Cuando la pregunta 7 da true, se dispara esta pregunta
			return respuestas.clienteHabitual;
		},
		validate: function (valor) {
			if (valor.length < 3 || valor.length > 3) {
				return 'Debés elegir tres gustos';
			}
			return true;
		}
	},
]

inquirer.prompt(opcionesPedido).then(opciones => {
	let fecha = new Date();

	console.log('\n=== Resumen de tu pedido ===\n ');
	console.log(`Fecha: ${fecha.toLocaleDateString()}`);
	console.log(`Hora: ${fecha.toLocaleTimeString()}`);
	console.log(`Tu datos - Nombre: ${opciones.nombreCliente} | Teléfono: ${opciones.telefonoCliente}`);
	
	// Si el pedido es para delivery
	if (opciones.paraDelivery) {
		console.log(`Tu pedido será entregado en: ${opciones.direccion}`);
	} else {
		console.log('Pasás a retirar tu pedido');
	}

	// Datos del pedido
	console.log('\n=== Productos solicitados ===\n');
	console.log(`Pizza: ${opciones.gustoPizza}`);
	console.log(`Tamaño: ${opciones.tamanioPizza}`);

	// Si elegió bebida
	if (opciones.conBebida) {
		console.log(`Bebida: ${opciones.gustoBebida}`);
	}

	// Si es cliente habitual
	if (opciones.clienteHabitual) {
		console.log('\nTus tres empanadas de regalo serán de:\n');
		for (const gustoEmpanada of opciones.empanadas) {
			console.log(`• ${gustoEmpanada}`);			
		}
	}

	// Precios
	let precioPizza = 0;
	let precioBebida = 0;
	let descuento = 0;

	if (opciones.conBebida) {
		precioBebida = 80;
	}

	switch (opciones.tamanioPizza.toLowerCase()) {
		case 'personal':
			descuento = opciones.conBebida ? 3 : 0;
			precioPizza = 430 + precioBebida;
			break;
		case 'mediana':
			descuento = opciones.conBebida ? 5 : 0;
			precioPizza = 560 + precioBebida;
			break;
		default:
			descuento = opciones.conBebida ? 8 : 0;
			precioPizza = 650 + precioBebida;
			break;
	}

	console.log('\n===============================\n');
	console.log(`Total productos: \$${precioPizza}`);
	if (opciones.paraDelivery) {		
		console.log('Total delivery: $20');
		precioPizza += 20;
	}
	console.log(`Descuentos: ${descuento}%`);
	console.log(`TOTAL: \$${(precioPizza - (precioPizza * descuento) / 100)}`);
	console.log('\n===============================\n');
	console.log('Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.');
	
	// Persistencia de datos en JSON
	const rutaArchivo = path.join(`${__dirname}/pedidos.json`);
	let contenidoPedidos = fs.readFileSync(rutaArchivo);
	let pedidosEnArray = JSON.parse(contenidoPedidos);

	opciones.fechaPedido = fecha.toLocaleDateString();
	opciones.horaPedido = fecha.toLocaleTimeString();
	opciones.totalProductos = precioPizza;
	opciones.descuento = descuento;

	if (pedidosEnArray.length === 0) {
		opciones.numeroPedido = 1;
	} else {
		let ultimoPedido = pedidosEnArray[pedidosEnArray.length - 1];
		opciones.numeroPedido = ultimoPedido.numeroPedido + 1;
	}
	pedidosEnArray.push(opciones);

	let pedidoEnJson = JSON.stringify(pedidosEnArray, null, ' ');

	fs.writeFileSync(rutaArchivo, pedidoEnJson);
});
