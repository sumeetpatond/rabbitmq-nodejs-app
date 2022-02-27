var amqp = require("amqplib/callback_api");

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        const exchangeName = "direct_logs";

        channel.assertExchange(exchangeName, "direct", {
            durable: false,
        });

        channel.assertQueue(
            "",
            {
                exclusive: true,
            },
            function (error, queue) {
                if (error) throw error;

                console.log(" [*] Waiting for messages. To exit press CTRL+C");

                args.forEach(function (severity) {
                    channel.bindQueue(queue.queue, exchangeName, severity);
                });

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
// node .\LogConsumer.js warning error
// node .\LogConsumer.js info warning error
// node .\LogConsumer.js info warning
