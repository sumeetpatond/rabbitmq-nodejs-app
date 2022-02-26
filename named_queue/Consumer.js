var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error1, channel) {
        if (error) throw error;

        const queueName = "myQueue";

        channel.assertQueue(queueName, {
            durable: false,
        });

        console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            queueName
        );

        channel.consume(
            queueName,
            function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
                setTimeout(function () {
                    connection.close();
                    process.exit(0);
                }, 500);
            },
            {
                noAck: true,
            }
        );
    });
});
