var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        var exchangeName = "logs";
        const queueName = "";
        const message = "Hello Sumeet!";

        channel.assertExchange(exchangeName, "fanout", {
            durable: false,
        });

        channel.publish(exchangeName, queueName, Buffer.from(message));

        console.log(" [x] Sent %s", message);
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
