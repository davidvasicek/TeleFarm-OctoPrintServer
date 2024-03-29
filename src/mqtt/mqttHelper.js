const mqtt = require('mqtt');
const config = require('./config');
const logger = require('./util/log.js');

//logger("I", "Omluvenky", "Firebase", "Nepodařilo se zapsat do databáze");


const brokerUrl = config.mqttBrokerUrl; //'mqtt://localhost'; // URL adresa vašeho MQTT brokera

const client = mqtt.connect(brokerUrl);

function connect(topics, messageCallback) {
    client.on('connect', function () {
        console.log('Připojení k MQTT brokeru');
        topics.forEach(topic => {
            client.subscribe(topic, function (err) {
                if (err) {
                    console.error('Chyba při připojení k tématu:', err);
                } else {
                    console.log('Úspěšně připojen k tématu:', topic);
                }
            });
        });
    });

    client.on('message', function (receivedTopic, message) {
        console.log('Přijata zpráva na tématu:', receivedTopic.toString());
        console.log('Obsah zprávy:', message.toString());
        // Zavolání zpětného volání s přijatou zprávou
        messageCallback(receivedTopic.toString(), message.toString());
    });
}

function publish(topic, message) {
    client.publish(topic, message, function (err) {
        if (err) {
            console.error('Chyba při publikování zprávy:', err);
        } else {
            console.log('Zpráva úspěšně publikována');
        }
    });
}

module.exports = { connect, publish };
