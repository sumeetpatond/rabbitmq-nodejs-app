var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        const queueName = "myQueue";
        const message = "Hello Sumeet!";

        channel.assertQueue(queueName, {
            durable: false,
        });

        channel.sendToQueue(queueName, Buffer.from(message));

        console.log(" [x] Sent %s to %s", message, queueName);
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
