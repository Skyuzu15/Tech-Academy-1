// Variáveis globais
let gameState = {
    player: { x: 400, y: 300, speed: 5 },
    enemies: [],
    collectibles: [],
    score: 0,
    lives: 3,
    level: 1,
    collected: 0,
    gameRunning: true,
    keys: {},
    questionActive: false
};

// Perguntas educativas
const questions = [
    {
        question: "Qual é o planeta mais próximo do Sol?",
        answers: ["Mercúrio", "Vênus", "Terra", "Marte"],
        correct: 0
    },
    {
        question: "Quantas luas tem o planeta Terra?",
        answers: ["0", "1", "2", "3"],
        correct: 1
    },
    {
        question: "Qual é a força que nos mantém no chão?",
        answers: ["Magnetismo", "Gravidade", "Pressão", "Vento"],
        correct: 1
    },
    {
        question: "Qual é o maior planeta do sistema solar?",
        answers: ["Saturno", "Netuno", "Júpiter", "Urano"],
        correct: 2
    },
    {
        question: "O que é necessário para que haja vida na Terra?",
        answers: ["Apenas água", "Apenas oxigênio", "Água e oxigênio", "Apenas luz solar"],
        correct: 2
    }
];

// Elementos DOM (usando let para poder reatribuir depois)
let gameCanvas = document.getElementById('gameCanvas');
let player = document.getElementById('player');
let questionModal = document.getElementById('questionModal');
let gameOver = document.getElementById('gameOver');

// Inicialização
function initGame() {
    createStars();
    updatePlayerPosition();
    spawnEnemies();
    spawnCollectibles();
    updateUI();
    gameLoop();
}

// Criar estrelas
function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        gameCanvas.appendChild(star);
    }
}

// Controles
document.addEventListener('keydown', (e) => {
    if (!gameState.questionActive) gameState.keys[e.key] = true;
});
document.addEventListener('keyup', (e) => gameState.keys[e.key] = false);

// Atualizar jogador
function updatePlayerPosition() {
    if (gameState.gameRunning && !gameState.questionActive) {
        if (gameState.keys['ArrowLeft'] && gameState.player.x > 0) gameState.player.x -= gameState.player.speed;
        if (gameState.keys['ArrowRight'] && gameState.player.x < 760) gameState.player.x += gameState.player.speed;
        if (gameState.keys['ArrowUp'] && gameState.player.y > 0) gameState.player.y -= gameState.player.speed;
        if (gameState.keys['ArrowDown'] && gameState.player.y < 560) gameState.player.y += gameState.player.speed;

        player.style.left = gameState.player.x + 'px';
        player.style.top = gameState.player.y + 'px';
    }
}

// Criar inimigos
function spawnEnemies() {
    const enemyCount = 2 + gameState.level;
    for (let i = 0; i < enemyCount; i++) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.left = Math.random() * 770 + 'px';
        enemy.style.top = Math.random() * 570 + 'px';
        gameCanvas.appendChild(enemy);

        gameState.enemies.push({
            element: enemy,
            x: parseInt(enemy.style.left),
            y: parseInt(enemy.style.top),
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        });
    }
}

// Criar coletáveis
function spawnCollectibles() {
    for (let i = 0; i < 5; i++) {
        const collectible = document.createElement('div');
        collectible.className = 'collectible';
        collectible.style.left = Math.random() * 780 + 'px';
        collectible.style.top = Math.random() * 580 + 'px';
        gameCanvas.appendChild(collectible);

        gameState.collectibles.push({
            element: collectible,
            x: parseInt(collectible.style.left),
            y: parseInt(collectible.style.top)
        });
    }
}

// Perguntas
function showQuestion() {
    const question = questions[Math.floor(Math.random() * questions.length)];
    gameState.questionActive = true;

    document.getElementById('questionText').textContent = question.question;
    const buttonsContainer = document.getElementById('answerButtons');
    buttonsContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => checkAnswer(index === question.correct);
        buttonsContainer.appendChild(button);
    });

    questionModal.style.display = 'block';
}

function checkAnswer(correct) {
    questionModal.style.display = 'none';
    gameState.questionActive = false;

    if (correct) {
        gameState.score += 100;
    } else {
        gameState.lives--;
        if (gameState.lives <= 0) {
            endGame(false);
            return;
        }
    }
    updateUI();
}

// Interface
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('collected').textContent = gameState.collected;
}

// Colisões
function checkCollisions() {
    // Inimigos
    gameState.enemies.forEach((enemy) => {
        const distance = Math.hypot(gameState.player.x - enemy.x, gameState.player.y - enemy.y);
        if (distance < 35) {
            gameState.lives--;
            if (gameState.lives <= 0) {
                endGame(false);
                return;
            }
            gameState.player.x = 400;
            gameState.player.y = 300;
            updateUI();
        }
    });

    // Coletáveis
    gameState.collectibles.forEach((collectible, index) => {
        const distance = Math.hypot(gameState.player.x - collectible.x, gameState.player.y - collectible.y);
        if (distance < 30) {
            gameState.score += 50;
            gameState.collected++;
            collectible.element.remove();
            gameState.collectibles.splice(index, 1);

            if (gameState.collected % 2 === 0) showQuestion();
            if (gameState.collected >= 5) nextLevel();
            updateUI();
        }
    });
}

// Próximo nível
function nextLevel() {
    gameState.level++;
    gameState.collected = 0;

    gameState.enemies.forEach(e => e.element.remove());
    gameState.collectibles.forEach(c => c.element.remove());
    gameState.enemies = [];
    gameState.collectibles = [];

    spawnEnemies();
    spawnCollectibles();
    gameState.player.speed = Math.min(gameState.player.speed + 0.5, 10);
    updateUI();
}

// Mover inimigos
function moveEnemies() {
    gameState.enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        if (enemy.x <= 0 || enemy.x >= 770) enemy.dx *= -1;
        if (enemy.y <= 0 || enemy.y >= 570) enemy.dy *= -1;

        enemy.element.style.left = enemy.x + 'px';
        enemy.element.style.top = enemy.y + 'px';
    });
}

// Finalizar jogo
function endGame(victory) {
    gameState.gameRunning = false;
    document.getElementById('finalScore').textContent = gameState.score;

    if (victory) {
        document.getElementById('gameOverTitle').textContent = 'Parabéns!';
        document.getElementById('gameOverText').textContent = `Você completou todos os níveis! Pontuação final: ${gameState.score}`;
        gameOver.classList.add('victory');
    } else {
        document.getElementById('gameOverTitle').textContent = 'Game Over!';
        document.getElementById('gameOverText').textContent = `Tente novamente! Pontuação final: ${gameState.score}`;
        gameOver.classList.remove('victory');
    }

    gameOver.style.display = 'block';
}

// Reiniciar
function restartGame() {
    gameCanvas.innerHTML = '';

    gameState = {
        player: { x: 400, y: 300, speed: 5 },
        enemies: [],
        collectibles: [],
        score: 0,
        lives: 3,
        level: 1,
        collected: 0,
        gameRunning: true,
        keys: {},
        questionActive: false
    };

    const ui = document.createElement('div');
    ui.className = 'ui';
    ui.innerHTML = `
        <div>Pontuação: <span id="score">0</span></div>
        <div>Vidas: <span id="lives">3</span></div>
        <div>Nível: <span id="level">1</span></div>
        <div>Coletados: <span id="collected">0</span>/5</div>
    `;
    gameCanvas.appendChild(ui);

    const newPlayer = document.createElement('div');
    newPlayer.className = 'player';
    newPlayer.id = 'player';
    gameCanvas.appendChild(newPlayer);

    const newQuestionModal = document.createElement('div');
    newQuestionModal.className = 'question-modal';
    newQuestionModal.id = 'questionModal';
    newQuestionModal.innerHTML = `
        <h3 id="questionText"></h3>
        <div id="answerButtons"></div>
    `;
    gameCanvas.appendChild(newQuestionModal);

    const newGameOver = document.createElement('div');
    newGameOver.className = 'game-over';
    newGameOver.id = 'gameOver';
    newGameOver.innerHTML = `
        <h2 id="gameOverTitle">Game Over!</h2>
        <p id="gameOverText">Sua pontuação final: <span id="finalScore">0</span></p>
        <button class="restart-btn" onclick="restartGame()">Jogar Novamente</button>
    `;
    gameCanvas.appendChild(newGameOver);

    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Use as setas do teclado para mover. Colete estrelas e evite inimigos!';
    gameCanvas.appendChild(instructions);

    // Atualizar referências
    player = document.getElementById('player');
    questionModal = document.getElementById('questionModal');
    gameOver = document.getElementById('gameOver');

    initGame();
}

// Loop principal
function gameLoop() {
    if (gameState.gameRunning) {
        updatePlayerPosition();
        moveEnemies();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar jogo
initGame();

document.addEventListener('keydown', (e) => {
    // Impedir rolagem da página com as setas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    if (!gameState.questionActive) {
        gameState.keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    gameState.keys[e.key] = false;
});
