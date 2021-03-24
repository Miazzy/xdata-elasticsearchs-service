/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

class KafkaController extends Controller {

    async index() {

        const { ctx } = this;

        const topic = ctx.query.topic || ctx.params.topic || 'message'; // 获取传入的Topic值
        const key = ctx.query.key || ctx.params.key || 'task'; // 获取传入的Key值
        const content = ctx.query.content || ctx.params.content || {};

        await ctx.kafka.sendMessage({
            topic: topic,
            key: key,
            messages: JSON.stringify(content),
        });
    }
}

module.exports = KafkaController;