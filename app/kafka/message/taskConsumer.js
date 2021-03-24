const Subscription = require('egg').Subscription;

class TaskSubscription extends Subscription {
    async subscribe(message) {
        const { app } = this;
        const { value, topic, key } = message;

        try {
            const lock = await app.redlock.lock('locks:xdata.kafka.service.message.task', 10);
            console.log(`TaskSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
            await app.redlock.unlock(lock);
        } catch (error) {
            console.log(`TaskSubscription error message ${value} by topic ${topic} key ${key} consumer`);
        }

    }
}

module.exports = TaskSubscription;