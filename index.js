var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var csvWriter = require('csv-write-stream');

var crc = require('crc');
var fs = require('fs');

var port = new SerialPort('COM6', {
  baudrate: 1000000,
  parser: serialport.parsers.byteDelimiter([0xff,0xff,0xff,0xee,0xff]),
});


var writer = csvWriter({
  headers: ['ticks', 'phase']
});

writer.pipe(fs.createWriteStream('out.csv'));

port.on('data', data => {
  data = new Buffer(data.slice(0,4));
  var chk = crc.crc8(data);
  if (chk !== 0)
    return;

  var ticks = data[0];

  var mag = data.readUInt16LE(1);

  writer.write([ticks, mag]);
});
