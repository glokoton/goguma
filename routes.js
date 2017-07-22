
module.exports = function(app){
    

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/client/public/game.html');
    });
    
    app.get('/game', function(req, res) {
        res.sendFile(__dirname + '/client/public/index.html');
    });
    
    app.get('/room', function(req, res) {
        res.sendFile(__dirname + '/client/public/room.html');
    });

}
