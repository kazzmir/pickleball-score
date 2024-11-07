function makePlayer(id){
    return {
        'score': 0,
        'id': id,
        'stats': {
            'winners': 0,
            'errors': 0,
        }
    }
}

let player1 = makePlayer(1);
let player2 = makePlayer(2);

let undoLog = [];

function elem(id){
    return document.getElementById(id);
}

function undo(){
    if (undoLog.length > 0){
        undoLog.pop()();
    }
}

function updateStats(player){
    elem(`player${player.id}-score`).innerText = player.score;
    elem(`player${player.id}-winners`).innerText = player.stats.winners;
    elem(`player${player.id}-errors`).innerText = player.stats.errors;
}

function incrementScore(player, amount){
    player.score += amount;
    updateStats(player);

    undoLog.push(() => {
        player.score -= amount;
        updateStats(player);
    })
}

function incrementWinners(player){
    player.stats.winners += 1;
    updateStats(player);

    undoLog.push(() => {
        player.stats.winners -= 1;
        updateStats(player);
    })
}

function incrementErrors(player){
    player.stats.errors += 1;
    updateStats(player);

    undoLog.push(() => {
        player.stats.errors -= 1;
        updateStats(player);
    })
}

function incrementPlayer1Score(){
    incrementScore(player1, 1);
}

function decrementPlayer1Score(){
    incrementScore(player1, -1);
}

function incrementPlayer1Winners(){
    incrementWinners(player1);
}

function incrementPlayer1Errors(){
    incrementErrors(player1);
}

function incrementPlayer2Score(){
    incrementScore(player2, 1);
}

function decrementPlayer2Score(){
    incrementScore(player2, -1);
}

function incrementPlayer2Winners(){
    incrementWinners(player2);
}

function incrementPlayer2Errors(){
    incrementErrors(player2);
}
