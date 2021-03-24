/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

class KafkaController extends Controller {

    async index() {
        await this.ctx.kafka.sendMessage({
            topic: 'someTopic', // Specify topics in the Kafka directory
            key: 'someKey', // Specify consumer for the corresponding key under topic
            messages: JSON.stringify({
                username: 'JohnApache',
                userId: 10001,
                gender: 0
            })
        });
    }
}