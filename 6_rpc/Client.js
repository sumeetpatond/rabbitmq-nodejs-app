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

        channel.assertQueue(
            "",
            {
                exclusive: true,
            },
            function (error, queue) {
                if (error) throw error;

                const correlationId =
                    Math.random().toString() +
                    Math.random().toString() +
                    Math.random().toString();
                const num = parseInt(args[0]);

                console.log(" [x] Requesting fib(%d)", num);

                channel.consume(
                    queue.queue,
                    function (message) {
                        if (message.properties.correlationId == correlationId) {
                            console.log(
                                " [.] Got %s",
                                message.content.toString()
                            );
                            setTimeout(function () {
                                connection.close();
                                process.exit(0);
                            }, 500);
                        }
                    },
                    {
                        noAck: true,
                    }
                );

                channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: queue.queue,
                });
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
