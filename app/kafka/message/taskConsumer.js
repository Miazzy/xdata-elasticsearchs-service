const Subscription = require('egg').Subscription;

class TaskSubscription extends Subscription {
    async subscribe(message) {
        const { app } = this;
        const lock = await app.redlock.lock('locks:xdata.kafka.service.message.task', 10);

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