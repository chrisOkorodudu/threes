let computer = [];
let pinsRemaining = 5;


let computerTotal = 0;
let playerTotal = 0;



document.addEventListener('DOMContentLoaded', init);
console.log('running');

function init() {
	console.log('init');
	const gameDiv = document.getElementById('game'), 
		overlay = document.querySelector('.overlay');

	gameDiv.style.display = 'none';
	overlay.style.display = 'none';


	const button = document.querySelector('button');

	button.addEventListener('click', Go);
}


function Go() {
	const intro = document.getElementById('intro');
	intro.style.display = 'none';

	const userInput = document.getElementById('diceValues').value;
	const diceValues = ((userInput.length>0) ? userInput.split(',') : []);

	genComputerScore(computer, diceValues);
	

	initGameUI();
	const game = document.getElementById('game');
	const compScore = document.createElement('p');
	compScore.id = 'compScore';
	game.appendChild(compScore);


	const startButton = document.getElementById('start');
	const rollButton = document.getElementById('roll');
	const pinButton = document.getElementById('pin');
	const resetButton = document.getElementById('reset');
	const dice = document.getElementById('container').childNodes;
	const results = document.createElement('p');

	//creating overlay that will display message conent if 
	//user tries to make illegal move
	const overlay = document.createElement('div');
	overlay.id = 'overlay';
	const body = document.querySelector('body');
	body.appendChild(overlay);


//OVERLAY CONTENT
	const needpin = document.createElement('div');
	needpin.textContent = 'You must pin at least one die to continue';
	overlay.appendChild(needpin);
	needpin.id = 'needpin';
	
	const mustroll = document.createElement('div');
	mustroll.textContent = 'You must roll before you can select a die to pin';
	overlay.appendChild(mustroll);
	mustroll.id = 'mustroll';

	const dismissButton = document.createElement('button');
	dismissButton.textContent = 'Ok. Got it!';
	dismissButton.id = 'dismiss';
	overlay.appendChild(dismissButton);
	dismissButton.addEventListener('click', () => {
		overlay.style.display = 'none';
		needpin.style.display = 'none';
		mustroll.style.display = 'none';
	});


	const playerScore = document.createElement('p');
	playerScore.id = 'player';


//START BUTTON CLICK EVENT HANDLER
	startButton.addEventListener('click', () => {
		displayComputerScore();	
		game.appendChild(playerScore);
		displayPlayerScore(dice);
		
		playerScore.style.display = 'block';
		compScore.style.display = 'block';
		startButton.disabled = true;
		rollButton.disabled = false;
	});


//DICE CLICK EVENT HANDLERS
	dice.forEach((die) => {
		die.addEventListener('click', () => {
			if (rollButton.disabled === false || startButton.disabled === false) {
				overlay.style.display = 'block';
				console.log(mustroll);
				mustroll.style.display = 'block';
			}
			else if (!die.classList.contains('pinned')) {
				die.classList.toggle('pin');
			}
		});
	});


//ROLL BUTTON EVENT HANDLER 
	rollButton.addEventListener('click', () => {
		playerRoll(diceValues, pinsRemaining);
		rollButton.disabled = true;
		pinButton.disabled = false;

	});


	const message = document.createElement('p');
	game.appendChild(message);



//PIN BUTTON CLICK EVENT HANDLER 
	pinButton.addEventListener('click', () => {
		let onePinned = false;
		dice.forEach((die) => {
			if (die.classList.contains('pin')) {
				onePinned = true;
			}
		});

		if (onePinned) {
			dice.forEach((die) => {
				if (die.classList.contains('pin')) {
					die.classList.toggle('pin');
					die.classList.add('pinned');
					pinsRemaining--;
				} else if (!die.classList.contains('pinned')) {
					die.textContent = "";
				}
			});

			pinButton.disabled = true;
			rollButton.disabled = false;

		} else {
			overlay.style.display = 'block';
			needpin.style.display = 'block';
		}
		displayPlayerScore(dice);

		
		results.id = 'results';

		//if game is over 
		if (pinsRemaining === 0) {

			if (playerTotal < computerTotal) {
				results.classList.add('win');
				results.textContent = 'YOU WIN!!!';
			} else if (playerTotal === computerTotal) {
				results.classList.add('tie');
				results.textContent = 'Its a tie!! No winner.';
			} else {
				results.classList.add('lose');
				results.textContent = 'Sorry, you lose!';
			}
			results.style.display = 'block';

			rollButton.disabled = true;
			resetButton.disabled = false;
			game.appendChild(results);
		}
	});


//RESET BUTTON CLICK EVENT HANDLER
	resetButton.addEventListener('click', () => {
		pinsRemaining = 5;
		computer = [];
		startButton.disabled = false;
		rollButton.disabled = true;
		pinButton.disabled = true;
		genComputerScore(computer, diceValues);
		computerTotal = 0;
		playerTotal = 0;

		dice.forEach((die) => {
			die.classList.toggle('pinned');
			die.textContent = "";
		});

		results.style.display = 'none';

		compScore.style.display = 'none';
		playerScore.style.display = 'none';
		resetButton.disabled = true;
	});
}


function playerRoll(diceValues, pinsRemaining) {
	let roll = [];
	if (diceValues.length >= pinsRemaining) {
		roll = diceValues.splice(0, pinsRemaining);
	} else {
		for (let i=0; i<(pinsRemaining-diceValues.length); i++) {
			roll.push(Math.floor(Math.random() * Math.floor(6)) + 1);
		}

		diceValues.forEach((roll) => {
			roll.push(roll);
		});
	}

	const dice = document.getElementById('container').childNodes;

	for (let i=0; i<5; i++) {
		if (!dice[i].classList.contains('pinned')) {
			dice[i].textContent = roll.shift();
		}
	}	
}

function displayPlayerScore(dice) {
	
	const playerScore = document.getElementById('player');
	playerScore.textContent = 'Player Score: ';
	let score = 0;
	dice.forEach((die) => {
		if (die.classList.contains('pinned')) {
			const val = parseInt(die.textContent);
			if (val !== 3) {
				score += val;
			}
		}
	});

	playerTotal = score;

	playerScore.textContent += score;
	
}


function displayComputerScore() {
	const compScore = document.getElementById('compScore');
	let total = 0;
	let cScore = "Computer Score: ";
	for (let i=0; i<computer.length; i++) {
		const pin = computer[i];

		
		if (pin === 3) {
			cScore += '0 (3)';
		} else {
			cScore += pin;
			total += pin;
		}
		if (i<computer.length-1){
			cScore += '+';
		} else {
			cScore += '=';	
		}
	}
	cScore += total;
	computerTotal = total;

	compScore.textContent = cScore;
}


function initGameUI() {
	const game = document.getElementById("game");
	game.style.display = 'block';
	const div = document.createElement("div");

	div.id = 'container';

	for (let i=0; i<5; i++) {
		const dice = document.createElement('div');
		dice.classList.add('dice'); 
		dice.style.border = 'medium solid #000000';
		div.appendChild(dice);
	}

	game.appendChild(div);	

	const buttons = document.createElement('div');
	buttons.id = 'buttons';

	const start = document.createElement('button');
	start.textContent = 'Start';
	start.id = 'start';
	buttons.appendChild(start);

	const roll = document.createElement('button');
	roll.textContent = 'Roll';
	roll.disabled = true;
	roll.id = 'roll';
	buttons.appendChild(roll);

	const pin = document.createElement('button');
	pin.textContent = 'Pin';
	pin.disabled = true;
	pin.id = 'pin';
	buttons.appendChild(pin);

	//option to restart game
	const resetButton = document.createElement('button');
	resetButton.textContent = 'Reset';
	resetButton.disabled = true;
	resetButton.id = 'reset';
	buttons.appendChild(resetButton);

	game.appendChild(buttons);
}


function genComputerScore(player, diceValues) {
	let turnsRemaining = 5;
	while (turnsRemaining > 0) {
		if (diceValues.length >= turnsRemaining) {
			const currentPin = Math.min(...diceValues.splice(0,turnsRemaining));
			player.push(currentPin);
		} else {
			const currentTurn = [];
			for (let i=0; i<(turnsRemaining - (diceValues.length)); i++) {
				currentTurn.push(Math.floor(Math.random() * Math.floor(6)) + 1);
			}

			diceValues.forEach((roll) => {
				currentTurn.push(roll);
			});

			player.push(Math.min(...currentTurn)); 
		}
		
		turnsRemaining--;
	}
}