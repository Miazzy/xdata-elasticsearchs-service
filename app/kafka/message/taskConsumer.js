const Subscription = require('egg').Subscription;

class TaskSubscription extends Subscription {
    async subscribe(message) {
        const { value, topic, key } = message;
        console.log(`TaskSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
    }
}


module.exports = TaskSubscription;