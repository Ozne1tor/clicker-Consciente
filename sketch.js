// Variáveis do jogo - tudo em inteiros para evitar bugs decimais
let game = {
    money: 0,
    totalMoney: 0,
    level: 1,
    eco: 50,
    clickValue: 10,
    autoClick: 0
};

// Custos das melhorias (x10 do original)
let costs = {
    worker: 500,
    fertilizer: 1500,
    tree: 3000,
    irrigation: 8000,
    tractor: 40000,
    cow: 15000,
    bee: 75000,
    rain: 120000,
    solar: 150000,
    biomass: 800000,
    tech: 2500000
};

let nextLevelCost = 500;

// Loop de produção automática (a cada segundo)
setInterval(function() {
    let gain = calculateGain();
    game.money += gain;
    game.totalMoney += gain;
    checkLevelUp();
    updateUI();
}, 1000);

// Regeneração natural (a cada 3 segundos)
setInterval(function() {
    if (game.eco < 100) {
        game.eco = Math.min(100, game.eco + 1);
        updateUI();
    }
}, 3000);

// Calcula quanto ganha por segundo
function calculateGain() {
    let baseGain = game.autoClick * game.level;
    let bonus = 1;
    
    if(game.eco > 70) {
        bonus = 15;
        showBonus("🌱 BÔNUS! +50%", "bonus-good");
    } else if (game.eco < 30) {
        bonus = 8;
        showBonus("⚠️ CRISE! -20%", "bonus-bad");
    } else {
        showBonus("⚖️ Equilíbrio", "bonus-neutral");
    }
    
    return Math.floor((baseGain * bonus) / 10);
}

// Verifica se sobe de nível
function checkLevelUp() {
    if(game.totalMoney >= nextLevelCost) {
        game.level++;
        game.totalMoney = 0;
        nextLevelCost = Math.floor(nextLevelCost * 1.5);
        showBonus("🎉 NÍVEL " + game.level + "!", "bonus-good");
    }
}

// Mostra mensagem de bônus/crise
function showBonus(text, cls) {
    document.getElementById('bonusText').innerText = text;
    document.getElementById('bonusText').className = "bonus " + cls;
}

// Função do clique no milho
function clickCorn(e) {
    let baseClick = game.clickValue * game.level;
    let clickPower = baseClick;
    
    if(game.eco > 80) clickPower = Math.floor(clickPower * 2);
    if(game.eco < 20) clickPower = Math.floor(clickPower / 2);
    
    game.money += clickPower;
    game.totalMoney += clickPower;
    checkLevelUp();
    
    let float = document.createElement('div');
    float.style.position = 'absolute';
    float.style.left = (Math.random() * 40 + e.clientX - 20) + 'px';
    float.style.top = (e.clientY - 40) + 'px';
    float.style.fontWeight = 'bold';
    float.style.color = '#2ecc71';
    float.style.fontSize = '20px';
    float.style.transition = 'all 1s ease-out';
    float.style.pointerEvents = 'none';
    float.style.zIndex = '1000';
    float.innerText = '+R$' + formatMoney(clickPower);
    document.body.appendChild(float);
    
    setTimeout(function() {
        float.style.opacity = '0';
        float.style.top = (e.clientY - 80) + 'px';
    }, 10);
    
    setTimeout(function() {
        float.remove();
    }, 1000);
    
    updateUI();
}

// Compra melhoria
function buyUpgrade(type) {
    if(game.money >= costs[type]) {
        game.money -= costs[type];
        
        switch(type) {
            case 'worker':
                game.autoClick += 1;
                costs.worker = Math.floor(costs.worker * 1.4);
                break;
            case 'fertilizer':
                game.clickValue += 30;
                game.eco = Math.max(0, game.eco - 15);
                costs.fertilizer = Math.floor(costs.fertilizer * 1.6);
                break;
            case 'tree':
                game.eco = Math.min(100, game.eco + 20);
                costs.tree = Math.floor(costs.tree * 1.4);
                break;
            case 'irrigation':
                game.clickValue += 50;
                costs.irrigation = Math.floor(costs.irrigation * 1.5);
                break;
            case 'tractor':
                game.autoClick += 30;
                game.eco = Math.min(100, game.eco + 5);
                costs.tractor = Math.floor(costs.tractor * 1.5);
                break;
            case 'cow':
                game.autoClick += 10;
                game.eco = Math.max(0, game.eco - 10);
                costs.cow = Math.floor(costs.cow * 1.5);
                break;
            case 'bee':
                game.autoClick += 15;
                game.eco = Math.min(100, game.eco + 15);
                costs.bee = Math.floor(costs.bee * 1.5);
                break;
            case 'rain':
                game.eco = Math.min(100, game.eco + 25);
                costs.rain = Math.floor(costs.rain * 1.5);
                break;
            case 'solar':
                game.autoClick += 100;
                game.eco = Math.min(100, game.eco + 10);
                costs.solar = Math.floor(costs.solar * 1.5);
                break;
            case 'biomass':
                game.autoClick += 500;
                game.eco = Math.max(0, game.eco - 20);
                costs.biomass = Math.floor(costs.biomass * 1.5);
                break;
            case 'tech':
                game.autoClick += 1000;
                game.eco = Math.min(100, game.eco + 5);
                costs.tech = Math.floor(costs.tech * 1.5);
                break;
        }
        
        updateUI();
    }
}

// Formata números grandes de forma segura
function formatMoney(num) {
    num = Math.floor(num);
    if(num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
    if(num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if(num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// Atualiza a tela
function updateUI() {
    document.getElementById('money').innerText = formatMoney(game.money);
    document.getElementById('level').innerText = game.level;
    document.getElementById('clickPower').innerText = formatMoney(game.clickValue * game.level);
    document.getElementById('levelBonus').innerText = (game.level / 10 + 0.9).toFixed(1);
    document.getElementById('nextLevelCost').innerText = formatMoney(nextLevelCost);
    
    let ecoFill = document.getElementById('ecoFill');
    let ecoText = document.getElementById('ecoText');
    ecoFill.style.width = game.eco + '%';
    ecoText.innerText = 'Sustentabilidade: ' + game.eco + '%';
    
    if(game.eco < 30) {
        ecoFill.style.background = '#e74c3c';
    } else if(game.eco < 70) {
        ecoFill.style.background = '#f1c40f';
    } else {
        ecoFill.style.background = '#2ecc71';
    }
    
    document.getElementById('costWorker').innerText = 'R$ ' + formatMoney(costs.worker);
    document.getElementById('costFertilizer').innerText = 'R$ ' + formatMoney(costs.fertilizer);
    document.getElementById('costTree').innerText = 'R$ ' + formatMoney(costs.tree);
    document.getElementById('costIrrigation').innerText = 'R$ ' + formatMoney(costs.irrigation);
    document.getElementById('costTractor').innerText = 'R$ ' + formatMoney(costs.tractor);
    document.getElementById('costCow').innerText = 'R$ ' + formatMoney(costs.cow);
    document.getElementById('costBee').innerText = 'R$ ' + formatMoney(costs.bee);
    document.getElementById('costRain').innerText = 'R$ ' + formatMoney(costs.rain);
    document.getElementById('costSolar').innerText = 'R$ ' + formatMoney(costs.solar);
    document.getElementById('costBiomass').innerText = 'R$ ' + formatMoney(costs.biomass);
    document.getElementById('costTech').innerText = 'R$ ' + formatMoney(costs.tech);
}

// Inicializa o jogo
updateUI();
