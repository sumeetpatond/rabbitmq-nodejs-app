var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        const queueName = "rpc_queue";

        channel.assertQueue(queueName, {
            durable: false,
        });

        console.log(" [x] Awaiting RPC requests");

        channel.consume(queueName, function reply(message) {
            const num = parseInt(message.content.toString());

            console.log(" [.] fib(%d)", num);

            const result = fibonacci(num);

            channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(result.toString()),
                {
                    correlationId: message.properties.correlationId,
                }
            );

            channel.ack(message);
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1) return n;
    else return fibonacci(n - 1) + fibonacci(n - 2);
}

//node .\LogProvider.js
