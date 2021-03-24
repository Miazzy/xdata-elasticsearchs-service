const Subscription = require('egg').Subscription;

class WorkSubscription extends Subscription {
    async subscribe(message) {
        //新增分布式锁，先上锁，在执行，避免并发问题
        const lock = await app.redlock.lock('locks:xdata.kafka.service.message.work', 300);

        try {
            const { value, topic, key } = message;
            console.log(`WorkSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
        } catch (error) {
            console.log(error);
        }

        await app.redlock.unlock(lock);
    }
}

module.exports = WorkSubscription;