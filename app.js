var redis = require("redis");
var client = redis.createClient(); //2223, 'localhost'); //2221); //, 'localhost');


client.on("ready", function (err) {
    console.log("ready");
});

client.on("error", function (err) {
    console.log("Error " + err.stack);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});