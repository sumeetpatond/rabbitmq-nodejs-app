var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error, connection) {
    if (error) throw error;

    connection.createChannel(function (error, channel) {
        if (error) throw error;

        var exchangeName = "direct_logs";
        const message = process.argv.slice(3).join(" ") || "Hello Sumeet!";
        const severity =
            process.argv.slice(2).length > 0
                ? process.argv.slice(2)[0]
                : "info";

        channel.assertExchange(exchangeName, "direct", {
            durable: false,
        });

        channel.publish(exchangeName, severity, Buffer.from(message));

        console.log(" [x] Sent %s: '%s'", severity, message);
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
});

//node .\LogProvider.js error log1
//node .\LogProvider.js warning log2
//node .\LogProvider.js info log3
