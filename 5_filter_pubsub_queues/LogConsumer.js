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

        const exchangeName = "topic_logs";

        channel.assertExchange(exchangeName, "topic", {
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

                args.forEach(function (key) {
                    channel.bindQueue(queue.queue, exchangeName, key);
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

// node .\LogConsumer.js "*.orange.*"
// [*] Waiting for messages. To exit press CTRL+C
// [x] 1
// [x] 2
// [x] 3

// node .\LogConsumer.js  "*.*.rabbit" "lazy.#"
// [*] Waiting for messages. To exit press CTRL+C
// [x] 1
// [x] 2
// [x] 4
