const Service = require('egg').Service;

let count = 0;

class KafkaService extends Service {

    /**
     * @description 同步ES数据
     * @param {*} taskName 
     * @returns 
     */
    async doTask(taskName = 'job1') {

        const { ctx, app } = this;

        console.log(`message task : ${taskName} start ... `);
        try {
            await ctx.kafka.sendMessage({
                topic: 'message', // Specify topics in the Kafka directory
                key: 'task', // Specify consumer for the corresponding key under topic
                messages: JSON.stringify({
                    username: 'JohnApache',
                    userId: count++,
                    taskName,
                    gender: 0
                })
            });
            await ctx.kafka.sendMessage({
                topic: 'message', // Specify topics in the Kafka directory
                key: 'work', // Specify consumer for the corresponding key under topic
                messages: JSON.stringify({
                    username: 'Worker',
                    userId: count++,
                    taskName,
                    gender: 0
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