const formError = document.querySelector('#error');
const valorActual = document.querySelector('#dineroActual');
const abandonar = document.querySelector('#abandonar');
const mensaje = document.querySelector('#mensaje');
const btnForm = document.querySelector('#btnForm');
const formDinero = document.querySelector('#agregarDinero');
const maxGanadores = document.querySelector('#maxGanadores');
const resetGame = document.querySelector('#resetGame');

let valor;
let name;
let tablaRanking = JSON.parse(localStorage.getItem('jugadores')) || [];
let continuar = true;

//Agrego el contenido del Titulo
$('#title').text('CoderRuleta de la Suerte');
//animacion del titulo
$('#title').animate(
	{
		height: '100px',
	},
	2000
);

//almacenar jugador
class Ranking {
	constructor(name, valor) {
		(this.name = name), (this.valor = valor);
	}
}

/////////////INGRESAR DINERO a jugar///////////////
const validarGasto = (e) => {
	e.preventDefault();
	valor = parseInt(document.querySelector('#numero').value);
	name = document.querySelector('#name').value;

	//validar dinero ingresado
	if (valor <= 0 || valor > 15000 || !valor || isNaN(valor) || name == '') {
		//validacion negada
		formError.textContent =
			'Numero Ingresado no Valido, el valor debe ser mayor a 0 y menor a 15000';
		formError.classList.add('bg-danger', 'text-white', 'p-3', 'text-center', 'ms-2');

		valor = 0;
	} else {
		//validacion Pasada
		valorActual.textContent = `$ ${valor}`;
		btnForm.disabled = true;

		//si existe error activa borrar
		formError.remove();

		//desabilitar boton para evitar bugs
		document.getElementById('spin').disabled = false;
		formDinero.reset();
		abandonar.disabled = false;
	}
};

////////Evento al abandonar El juego//////////////
abandonar.addEventListener('click', () => {
	document.getElementById('spin').disabled = true;
	continuar = false;
	let ranking = new Ranking(name, valor);
	tablaRanking.push(ranking);
	localStorage.setItem('jugadores', JSON.stringify(tablaRanking));
	abandonar.disabled = true;
	resetGame.disabled = false;

	// paso el valor a la Api
	consultarApi(valor);
});

//eventos
const eventListener = () => {
	formDinero.addEventListener('submit', validarGasto);
};
eventListener();

//////////////Funcion ejecutada al frenarse el spin///////////////////
const ruleta = (text) => {
	switch (text) {
		case '$2500':
			valor = valor + 2500;
			mensaje.textContent = `felicidades ganaste $2500, tu monto es de  ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);

			break;
		case '/2':
			valor = valor / 2;
			mensaje.textContent = `Ups Perdiste la mitad de tu monto, tu monto es de  ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '0':
			valor = valor;
			mensaje.textContent = `tu monto se mantiene igual  ${valor}  `;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '-$5000':
			valor = valor - 5000;
			mensaje.textContent = `Paso el peronismo y te robo 5000 pesos, tu monto es de ${valor}  `;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case 'x3':
			valor = valor * 3;
			mensaje.textContent = `Felicidades Ganaste el triple, yo que vos me retiro porque la proxima perdes todo seguro, tu monto actual es de  ${valor}  `;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '$850':
			valor = valor + 850;
			mensaje.textContent = `Ganaste $850 Para que te compres 40 alfajores fulbito, tu monto actual es de  ${valor} `;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '-$1200':
			valor = valor - 1200;
			mensaje.textContent = `Ganaste 300, pero te cobramos 500 de iva, 600 de impuesto pais, y ademas debes 1 mes del monotributo, perdiste $1200 pesos, tu monto actual es de:  ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '/4':
			valor = valor / 4;
			mensaje.textContent = `Perdiste 1/4 de tu monto , tu monto actual es de  ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '$1000':
			valor = valor + 1000;
			mensaje.textContent = `Ganaste 1000 pesitos, hoy no comes polenta, tu monto actual es de  ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;
		case '-$9000':
			valor = valor - 9000;
			mensaje.textContent = `Deleteado Pa -$9000 , tu monto actual es de   ${valor}`;
			valorActual.textContent = valor;
			setTimeout(() => {
				mensaje.textContent = '';
			}, 5000);
			break;

		default:
			console.log('error');
			break;
	}
};

// //////////Array de los premios que contiene la ruleta//////////////
const options = ['$2500', '/2', '0', '-$5000', 'x3', '$850', '-$1200', '/4', '$1000', '-$9000'];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let ctx;

document.getElementById('spin').addEventListener('click', spin);

////////Funciones que se encargan del arranque recorrido y frenado de la ruleta///////////
function byte2Hex(n) {
	let nybHexString = '0123456789ABCDEF';
	return String(nybHexString.substr((n >> 4) & 0x0f, 1)) + nybHexString.substr(n & 0x0f, 1);
}

function RGB2Color(r, g, b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
	let phase = 0;
	let center = 128;
	let width = 127;
	let frequency = (Math.PI * 2) / maxitem;

	red = Math.sin(frequency * item + 2 + phase) * width + center;
	green = Math.sin(frequency * item + 0 + phase) * width + center;
	blue = Math.sin(frequency * item + 4 + phase) * width + center;

	return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
	let canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		let outsideRadius = 200;
		let textRadius = 160;
		let insideRadius = 125;

		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 500, 500);

		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;

		ctx.font = 'bold 12px Helvetica, Arial';

		for (let i = 0; i < options.length; i++) {
			let angle = startAngle + i * arc;
			//ctx.fillStyle = colors[i];
			ctx.fillStyle = getColor(i, options.length);

			ctx.beginPath();
			ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
			ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
			ctx.stroke();
			ctx.fill();

			ctx.save();
			ctx.shadowOffsetX = -1;
			ctx.shadowOffsetY = -1;
			ctx.shadowBlur = 0;
			ctx.shadowColor = 'rgb(220,220,220)';
			ctx.fillStyle = 'black';
			ctx.translate(
				250 + Math.cos(angle + arc / 2) * textRadius,
				250 + Math.sin(angle + arc / 2) * textRadius
			);
			ctx.rotate(angle + arc / 2 + Math.PI / 2);
			let text = options[i];
			ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
			ctx.restore();
		}

		//Arrow
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
		ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
		ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
		ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
		ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
		ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
		ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
		ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
		ctx.fill();
	}
}

function spin() {
	spinAngleStart = Math.random() * 10 + 10;
	spinTime = 0;
	spinTimeTotal = Math.random() * 3 + 4 * 1000;
	//Una vez ejecutada el spin el boton se desactiva para evitar inifitos spins
	document.getElementById('spin').disabled = true;
	rotateWheel();
}

function rotateWheel() {
	spinTime += 30;
	if (spinTime >= spinTimeTotal) {
		stopRotateWheel();
		return;
	}

	//Desactivar el boton de abandonar cuando el spin esta en recorrido
	abandonar.disabled = true;

	let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
	startAngle += (spinAngle * Math.PI) / 180;
	drawRouletteWheel();
	spinTimeout = setTimeout('rotateWheel()', 30);
}

//Funcion que se ejecuta Cuando la ruleta para
function stopRotateWheel() {
	clearTimeout(spinTimeout);
	let degrees = (startAngle * 180) / Math.PI + 90;
	let arcd = (arc * 180) / Math.PI;
	let index = Math.floor((360 - (degrees % 360)) / arcd);
	ctx.save();
	ctx.font = 'bold 30px Helvetica, Arial';
	let text = options[index];
	ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
	ctx.restore();

	///Una vez parado la funcion de la ruleta toma el valor para llevarla al Case////
	ruleta(text);
	document.getElementById('spin').disabled = false;
	abandonar.disabled = false;

	////validacion del monto actual del jugador para seguir jugando
	if (valor <= 0 || !continuar) {
		// si no cumple los requisitos termina el juego
		document.getElementById('spin').disabled = true;
		let ranking = new Ranking(name, valor);
		tablaRanking.push(ranking);
		localStorage.setItem('jugadores', JSON.stringify(tablaRanking));
		abandonar.disabled = true;
		resetGame.disabled = false;
		consultarApi(valor);
		return;
	}
}

function easeOut(t, b, c, d) {
	let ts = (t /= d) * t;
	let tc = ts * t;
	return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

tablaRanking.sort((a, b) => {
	if (a.valor > b.valor) {
		return -1;
	}
	if (a.valor < b.valor) {
		return 1;
	}
	return 0;
});

//imprimir tabla
tablaRanking.map(({ name, valor }) => {
	maxGanadores.innerHTML += `<p class="text-white mt-3 fs-5">${name} $${valor}</p>`;
});

// new game
resetGame.addEventListener('click', () => {
	location.reload();
});

// El monto retirado se pasa a dolares
const consultarApi = (valor) => {
	const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';

	$.get(url, (casa, estado) => {
		if (estado == 'success') {
			let montoDolar = parseInt(valor) / parseInt(casa[1].casa.compra);

			if (montoDolar > 0) {
				//mostrar cartel de abandonar con valor positivo en dinero
				Swal.fire({
					title: 'Felicidades!',
					text: `Retiraste $${montoDolar.toFixed(2)} Dolares`,
					imageUrl: '/img/money.jpg',
					imageWidth: 400,
					imageHeight: 200,
					imageAlt: 'Custom image',
				});
			} else {
				//mostrar cartel de perder dinero
				Swal.fire({
					title: 'Que Pena!',
					text: `Nos Debes $${montoDolar.toFixed(2)} Dolares`,
					imageUrl: '/img/hqdefault.jpg',
					imageWidth: 400,
					imageHeight: 200,
					imageAlt: 'Custom image',
				});
			}
		}
	});
};
