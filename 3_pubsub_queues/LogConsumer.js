var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error1, channel) {
        if (error) throw error;

        var exchangeName = "logs";

        channel.assertExchange(exchangeName, "fanout", {
            durable: false,
        });

        channel.assertQueue(
            "",
            {
                exclusive: true,
            },
            function (error, queue) {
                if (error) throw error;

                console.log(
                    " [*] Waiting for messages in %s. To exit press CTRL+C",
                    queue.queue
                );
                channel.bindQueue(queue.queue, exchangeName, "");

                channel.consume(
                    queue.queue,
                    function (msg) {
                        if (msg.content) {
                            console.log(" [x] %s", msg.content.toString());
                        }
                    },
                    {
                        noAck: true,
                    }
                );
            }
        );
    });
});
