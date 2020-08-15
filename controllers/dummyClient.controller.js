
module.exports.connectTest = (req, res) => {
    var socket = require('socket.io-client')('http://localhost:3003');

    socket.on('connect', function (d) {
        console.log("received: ", d)
        res.send("OKay")
     });
    // socket.on('event', function (data) { });
    // socket.on('disconnect', function () { });

    
}