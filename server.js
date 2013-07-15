var Rfid = require('./rfid');

var rfid = new Rfid(16700, 8454).listen();

rfid.on('scan', function(data) {
    console.log('scan', data);
});

rfid.on('input', function(data) {
    console.log('input', data);
});