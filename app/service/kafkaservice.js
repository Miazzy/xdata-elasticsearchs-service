const Service = require('egg').Service;

let count = 0;

class KafkaService extends Service {

    /**
     * @description 推送Kafka消息
     * @param {*} taskName 
     * @returns 
     */
    async doTask(taskName = 'job1') {

        const { ctx, app } = this;
        console.log(`message task : ${taskName} start ... `);

        try {
            await ctx.kafka.sendMessage({
                topic: 'message',
                key: 'task',
                messages: JSON.stringify({
                    userId: count++,
                    taskName,
                })
            });
            await ctx.kafka.sendMessage({
                topic: 'message',
                key: 'work',
                messages: JSON.stringify({
                    userId: count++,
                    taskName,
                })
            });
            console.log(`message task : ${taskName} count: ${count} end ... `);
        } catch (error) {
            console.log(error);
        }

        return true;
    }

}
module.exports = KafkaService;