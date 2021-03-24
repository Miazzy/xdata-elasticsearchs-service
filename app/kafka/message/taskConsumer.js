const Subscription = require('egg').Subscription;

class TaskSubscription extends Subscription {
    async subscribe(message) {
        //新增分布式锁，先上锁，在执行，避免并发问题
        const lock = await app.redlock.lock('locks:xdata.kafka.service.message.task', 300);

        try {
            const { value, topic, key } = message;
            console.log(`TaskSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
        } catch (error) {
            console.log(error);
        }

        await app.redlock.unlock(lock);
    }
}

module.exports = TaskSubscription;