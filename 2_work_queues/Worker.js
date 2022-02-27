var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error1, channel) {
        if (error) throw error;

        const queueName = "myTaskQueue";

        channel.assertQueue(queueName, {
            durable: true,
        });

        channel.prefetch(1);
        console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            queueName
        );

        channel.consume(
            queueName,
            function (msg) {
                const seconds = parseInt(msg.content.toString());
                console.log(" [x] Received %s", msg.content.toString());
                setTimeout(function () {
                    console.log(" [x] Done in %s seconds ", seconds);
                }, seconds * 1000);
            },
            {
                noAck: false,
            }
        );
    });
});
