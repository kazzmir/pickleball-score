function makePlayer(id){
    return {
        'score': 0,
        'id': id,
        'name': `Player ${id}`,
        'stats': {
            'winners': 0,
            'errors': 0,
            'third-shot-drop': 0,
            'third-shot-drive': 0,
            'dink': 0,
        }
    }
}

let serveTurn = 1;

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
    elem(`player${player.id}-third-shot-drop`).innerText = player.stats['third-shot-drop'];
    elem(`player${player.id}-third-shot-drive`).innerText = player.stats['third-shot-drive'];
    elem(`player${player.id}-dink`).innerText = player.stats.dink;

    if (serveTurn == 1){
        elem('server').innerText = player1.name;
    } else {
        elem('server').innerText = player2.name;
    }
}

function incrementScore(player, amount){
    player.score += amount;
    updateStats(player);

    undoLog.push(() => {
        player.score -= amount;
        updateStats(player);
    })
}

function incrementThirdShotDrop(player){
    player.stats['third-shot-drop'] += 1;
    updateStats(player);
    undoLog.push(() => {
        player.stats['third-shot-drop'] -= 1;
        updateStats(player);
    })
}

function incrementThirdShotDrive(player){
    player.stats['third-shot-drive'] += 1;
    updateStats(player);
    undoLog.push(() => {
        player.stats['third-shot-drive'] -= 1;
        updateStats(player);
    })
}

function maybeAddPoint(player){
    if (serveTurn == player.id){
        player.score += 1;
        return () => {
            player.score -= 1;
        }
    } else {
        serveTurn = 3 - player.id;
        return () => {
            serveTurn = player.id;
        }
    }
}

function maybeLosePoint(player){
    // if the currently serving player lost the point, then add a point to the other player
    if (serveTurn == player.id){
        serveTurn = 3 - player.id;
        return () => {
            serveTurn = player.id;
        }
    } else {
        if (player1.id == player.id){
            return maybeAddPoint(player2);
        } else {
            return maybeAddPoint(player1);
        }
    }
}

function incrementWinners(player){
    player.stats.winners += 1;
    let undo = maybeAddPoint(player);
    updateStats(player);

    undoLog.push(() => {
        player.stats.winners -= 1;
        undo();
        updateStats(player);
    })
}

function incrementErrors(player){
    player.stats.errors += 1;
    let undo = maybeLosePoint(player);
    updateStats(player1);
    updateStats(player2);

    undoLog.push(() => {
        player.stats.errors -= 1;
        undo();
        updateStats(player1);
        updateStats(player2);
    })
}

function incrementDink(player){
    player.stats.dink += 1
    updateStats(player);

    undoLog.push(() => {
        player.stats.dink -= 1;
        updateStats(player);
    })
}

function incrementPlayer1Score(){
    incrementScore(player1, 1);
}

function decrementPlayer1Score(){
    incrementScore(player1, -1);
}

function incrementPlayer1ThirdShotDrop(){
    incrementThirdShotDrop(player1);
}

function incrementPlayer1ThirdShotDrive(){
    incrementThirdShotDrive(player1);
}

function incrementPlayer1Dink(){
    incrementDink(player1);
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

function incrementPlayer2ThirdShotDrop(){
    incrementThirdShotDrop(player2);
}

function incrementPlayer2ThirdShotDrive(){
    incrementThirdShotDrive(player2);
}

function incrementPlayer2Dink(){
    incrementDink(player2);
}

function setPlayer1Name(){
    let input = document.getElementById('player1-name-input');
    let name = document.getElementById('player1-name');
    player1.name = input.value;
    name.innerText = player1.name
}

function setPlayer2Name(){
    let input = document.getElementById('player2-name-input');
    let name = document.getElementById('player2-name');
    player2.name = input.value;
    name.innerText = player2.name
}
