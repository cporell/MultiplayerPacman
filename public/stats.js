var socket;

var statDiv = document.getElementById("stats");

connect();
function connect(){
    if(!socket){
        socket = io();
    }   
    else{
        socket.io.reconnect();
    }

    socket.on('stats received', function (statManager) {
        console.log(statManager);

        statManager.statsForUser.sort(function(a, b) {
          return b.timesWonAsPacman - a.timesWonAsPacman;
        })
        var pacmanTable = "<h1>Pacman Stats</h1><table class='stats'><thead><tr><td>Username</td><td>Times Won</td><td>Times Played</td><td>Ghosts Eaten</td><td>Pellets Eaten</td><td>Power Pellets Eaten</td></tr></thead>";
        for(statIndex = 0; statIndex < statManager.statsForUser.length; statIndex++){
            if(statManager.statsForUser[statIndex].timesPlayedAsPacman > 0){
                pacmanTable += compiledPacman(statManager.statsForUser[statIndex]);
            }  
        }
        statDiv.innerHTML += pacmanTable + "</table>";

        statManager.statsForUser.sort(function(a, b) {
          return b.timesWonAsGhost - a.timesWonAsGhost;
        })
        var ghostTable = "<h1>Ghosts Stats</h1><table class='stats'><thead><tr><td>Username</td><td>Times Won</td><td>Times Played</td><td>Pacman Caught</td></tr></thead>";
        for(statIndex = 0; statIndex < statManager.statsForUser.length; statIndex++){

            if(statManager.statsForUser[statIndex].timesPlayedAsGhost > 0){
                ghostTable += compiledGhosts(statManager.statsForUser[statIndex]);
            }
        }
        statDiv.innerHTML += ghostTable + "</table>";
    });

    socket.emit('get stats');
}

var pacmanRows = 
    "<tr> <td> <%= username %> </td> <td> <%= timesWonAsPacman %> </td> <td> <%= timesPlayedAsPacman %> </td> <td> <%= timesEatenGhosts %> </td> <td> <%= pelletsEaten %> </td> <td> <%= powerPelletsEaten %> </td></tr>";
compiledPacman = _.template(pacmanRows);

var ghostRows = 
    "<tr> <td> <%= username %> </td> <td> <%= timesWonAsGhost %> </td> <td> <%= timesPlayedAsGhost %> </td> <td> <%= timesEatenPacman %> </td></tr>";
compiledGhosts = _.template(ghostRows);

