const Subscription = require('egg').Subscription;

class WorkSubscription extends Subscription {
    async subscribe(message) {
        const { value, topic, key } = message;
        console.log(`WorkSubscription consume message ${value} by topic ${topic} key ${key} consumer`);
    }
}


module.exports = WorkSubscription;