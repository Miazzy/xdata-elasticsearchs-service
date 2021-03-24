const Subscription = require('egg').Subscription;

class WorkSubscription extends Subscription {
    async subscribe(message) {
        const { app } = this;
        const { value, topic, key } = message;

        try {
            const lock = await app.redlock.lock('locks:xdata.kafka.service.message.work', 10);
            console.log(`WorkSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
            await app.redlock.unlock(lock);
        } catch (error) {
            console.log(`WorkSubscription error message ${value} by topic ${topic} key ${key} consumer`);
        }

    }
}

module.exports = WorkSubscription;