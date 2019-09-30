const path = require('path');
const fs = require('fs');

const rutaArchivo = path.join(`${__dirname}/pedidos.json`);
let contenidoPedidos = fs.readFileSync(rutaArchivo);
let pedidosEnArray = JSON.parse(contenidoPedidos);

// 9. Si no hay pedidos no se generará el reporte
if (pedidosEnArray.length > 0) {
	// 1. Cantidad total de pedidos 
	const totalDePedidos = pedidosEnArray.length;

	// 2. Cantidad de pizzas vendidas por gusto [Muzzarela', 'Jamón y morrón', 'Calabresa', 'Napolitana']
	const pizzasDeMuzza = pedidosEnArray.filter(pedido => pedido.gustoPizza == 'Muzzarela')
	const pizzasDeJamon = pedidosEnArray.filter(pedido => pedido.gustoPizza == 'Jamón y morrón')
	const pizzasDeCalabresa = pedidosEnArray.filter(pedido => pedido.gustoPizza == 'Calabresa')
	const pizzasDeNapolitana = pedidosEnArray.filter(pedido => pedido.gustoPizza == 'Napolitana')

	// 3. Cantidad de pedidos para delivery
	const paraDelivery = pedidosEnArray.filter(pedido => pedido.paraDelivery == true);

	// 4. Cantidad de ventas por tamaño
	const contarPorTamanio = (contador, tamanio, tamanioABuscar) => {
		return tamanio == tamanioABuscar ? contador + 1 : contador;
	};
	const tamaniosDeTodosLosPedidos = pedidosEnArray.map(pedido => pedido.tamanioPizza.toLowerCase());
	const cantPersonal = tamaniosDeTodosLosPedidos.reduce((contador, tamanio) => {
		return contarPorTamanio(contador, tamanio, 'personal');
	}, 0);
	const cantMediana = tamaniosDeTodosLosPedidos.reduce((contador, tamanio) => {
		return contarPorTamanio(contador, tamanio, 'mediana');
	}, 0);
	const cantGrande = tamaniosDeTodosLosPedidos.reduce((contador, tamanio) => {
		return contarPorTamanio(contador, tamanio, 'grande');
	}, 0);

	// 5. Cantidad de bebidas vendidas
	const cantBebidas = pedidosEnArray.reduce((acum, pedido) => {
		return pedido.conBebida ? acum + 1 : acum;
	}, 0);

	// 6. Cantidad de clientes habituales
	const cantClientesHabituales = pedidosEnArray.reduce((acum, pedido)=> {
		return pedido.clienteHabitual ? acum + 1: acum;
	}, 0);

	// 8. Formatear fecha
	let fecha = new Date();
	let formatoFecha = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	};

	let final = `
	|===*** Reporte de ventas ***====|
	Fecha de generación: ${fecha.toLocaleDateString('es-ES', formatoFecha)}
	Hora: ${fecha.toLocaleTimeString()}
	
	|===*** Cantidad de pedidos realizados ***====|
	Total: ${totalDePedidos}
	
	|===*** Cantidad de pedidos para delivery ***====|
	Total: ${paraDelivery.length}

	|===*** Cantidad de pizzas vendidas por gusto ***====|
	Total Muzzarela: ${pizzasDeMuzza.length}
	Total Jamón y morrón: ${pizzasDeJamon.length}
	Total Calabresa: ${pizzasDeCalabresa.length}
	Total Napolitana: ${pizzasDeNapolitana.length}

	|===*** Cantidad de pizzas vendidas por tamaño ***====|
	Total Personal: ${cantPersonal}
	Total Mediana: ${cantMediana}
	Total Grande: ${cantGrande}

	|===*** Cantidad de pedidos con bebida ***====|
	Total: ${cantBebidas}

	|===*** Cantidad de clientes habituales ***====|
	Total: ${cantClientesHabituales}

	|===*** Cantidad de empanadas regaladas ***====|
	Total: ${cantClientesHabituales * 3}
`;

	// 7. Lanzar reporte en consola
	fs.writeFileSync(path.join(`${__dirname}/reporte.txt`), final);
	let contenidoReporte = fs.readFileSync(path.join(`${__dirname}/reporte.txt`), 'utf-8');

	console.log('¡Reporte generado con éxito!');
	console.log(contenidoReporte);
} else {
	console.log('Actualmente el sistema no tiene pedidos para generar el reporte');
}
