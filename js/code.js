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
            'lob': 0,
            'erne': 0,
            'atp': 0,
        },
        // score over time
        'x': [],
        // rally over time
        'y': [],
    }
}

let totalRallies = 1
let serveTurn = 1;

let player1 = makePlayer(1);
let player2 = makePlayer(2);

let undoLog = [];

function elem(id){
    return document.getElementById(id);
}

const PlotName = 'plot2'

function init(){
    var plot = elem(PlotName)

    let rallyLayout = {
        title: 'Rally flow',
        paper_bgcolor: '#eee',
        plot_bgcolor: '#eee',
        xaxis: {
            title: 'Rally',
            range: [1, 20]
        },
        yaxis: {
            title: 'Score',
            range: [0, 20],
        },
    }

    let plotRuns = Plotly.newPlot(plot, [{...player1}, {...player2}], rallyLayout)

    window.onresize = () => {
        Plotly.Plots.resize(plot)
    }
}

function updateRallyPlot(){
    let x1 = [...player1.x]

    let trace1 = {x: [...player1.x], y: [...player1.y], name: player1.name}
    let trace2 = {x: [...player2.x], y: [...player2.y], name: player2.name}

    let rangeX = Math.floor((Math.max(...x1, 15) + 5) / 5) * 5

    let transition = {
        transition: {
            duration: 300,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 300
        }
    }

    Plotly.animate(PlotName, {
        data: [trace1, trace2],
        traces: [0, 1],
        layout: {xaxis: {range: [1, rangeX]}}
    }, transition).then(() => {
        // console.log("did animate")
    })
}

function undo(){
    if (undoLog.length > 0){
        let f = undoLog.pop()
        f()
    }
}

function updateStats(player){
    elem(`player${player.id}-score`).innerText = player.score;
    elem(`player${player.id}-winners`).innerText = player.stats.winners;
    elem(`player${player.id}-errors`).innerText = player.stats.errors;
    elem(`player${player.id}-third-shot-drop`).innerText = player.stats['third-shot-drop'];
    elem(`player${player.id}-third-shot-drive`).innerText = player.stats['third-shot-drive'];
    elem(`player${player.id}-dink`).innerText = player.stats.dink;
    elem(`player${player.id}-lob`).innerText = player.stats.lob;
    elem(`player${player.id}-erne`).innerText = player.stats.erne;
    elem(`player${player.id}-atp`).innerText = player.stats.atp;

    if (serveTurn == 1){
        elem('server').innerText = player1.name;
    } else {
        elem('server').innerText = player2.name;
    }
}

function incrementScore(player, amount){
    player.score += amount;
    updateStats(player);

    updateRallyPlot()

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

function incrementATP(player){
    player.stats.atp += 1;
    updateStats(player);

    undoLog.push(() => {
        player.stats.atp -= 1;
        updateStats(player);
    })
}

function incrementWinners(player){
    player.stats.winners += 1;
    let undo = maybeAddPoint(player);
    updateStats(player);

    player1.x.push(totalRallies)
    player1.y.push(player1.score)
    player2.x.push(totalRallies)
    player2.y.push(player2.score)

    updateRallyPlot()

    totalRallies += 1

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

function incrementLob(player){
    player.stats.lob += 1;
    updateStats(player);

    undoLog.push(() => {
        player.stats.lob -= 1;
        updateStats(player);
    })
}

function incrementErne(player){
    player.stats.erne += 1;
    updateStats(player);

    undoLog.push(() => {
        player.stats.erne -= 1;
        updateStats(player);
    })
}

function incrementPlayer1Score(){
    incrementScore(player1, 1);
}

function incrementPlayer1Erne(){
    incrementErne(player1);
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

function incrementPlayer1Lob(){
    incrementLob(player1);
}

function incrementPlayer1ATP(){
    incrementATP(player1);
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

function incrementPlayer2Lob(){
    incrementLob(player2);
}

function incrementPlayer2Erne(){
    incrementErne(player2);
}

function incrementPlayer2ATP(){
    incrementATP(player2);
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
