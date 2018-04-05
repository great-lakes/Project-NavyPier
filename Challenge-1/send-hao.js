require('dotenv').config()
var uuid = require('uuid/v4')
var Protocol = require('azure-iot-device-mqtt').Mqtt
var Client = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message

// String containing Hostname, Device Id & Device Key in the following formats:
var connectionString = process.env.HUB_DEVICE_HAO

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol)
var sendInterval
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message)
  } else {
    console.log('Client connected')

    client.on('error', function (err) {
      console.error(err.message)
    })

    client.on('disconnect', function () {
      clearInterval(sendInterval)
      client.removeAllListeners()
      client.open(connectCallback)
    })
  }
}

client.open(function () {
  sendInterval = setInterval(() => {
    // create payload
    var time = new Date()
    var data = JSON.stringify({ ticketId: 'hao-' + uuid(), entryTime: time })
    var message = new Message(data)

    // send payload
    client.sendEvent(message, printResultFor('send'))
  }, 1000)
})

function printResultFor (op) {
  return function printResult (err, res) {
    if (err) console.log(op + ' error: ' + err.toString())
    if (res) console.log(op + ' status: ' + res.constructor.name)
  }
}
