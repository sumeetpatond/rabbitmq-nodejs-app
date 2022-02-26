var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        const queueName = "myTaskQueue";
        const message = process.argv[2] || "10";

        channel.assertQueue(queueName, {
            durable: true,
        });

        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        });

        console.log(" [x] Sent %s to %s", message, queueName);
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
