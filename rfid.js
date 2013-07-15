/**
 * Requires
 */
var HID = require('node-hid'),
    events = require('events');

var keyEvents = [],
    keyMapper = {
        57: 0, 48: 1, 49: 2, 50: 3, 51: 4,
        52: 5, 53: 6, 54: 7, 55: 8, 56: 9 };

var Rfid = function(deviceId, vendorId) {
    this.deviceId = deviceId,
    this.vendorId = vendorId;
    this.device = null;
    this.rfidInterface = null;
    this.callbacks = {
        read: null
    };
    instance = this;
};

Rfid.prototype = new events.EventEmitter();

Rfid.prototype.listen = function() {
    var error, devices;

    devices = new HID.devices();

    if (devices.length > 0) {
        this.device = devices[0];
    }

    this.read();

    return this;
};

Rfid.prototype.read = function() {
    var _this = this,
        keyEvents = [],
        id,
        onRead = function(error, data) {
            if (data[2] !== 0 && data[2] !== 88) {
                keyEvents.push(keyMapper[parseInt(data[2], 16)]);
                _this.emit('input', data[2]);
            } else if (data[2] === 88) {
                id = parseInt(keyEvents.join(''), 10);
                _this.emit('scan', id);
                keyEvents = [];
            }

            if (data[2] !== 56)
                _this.rfidInterface.read(onRead);
        };

    this.rfidInterface = new HID.HID(this.device.path);
    this.rfidInterface.read(onRead);
};

module.exports = Rfid;