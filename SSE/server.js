var http = require("http");

http.createServer(function (req, res) {

  var fileName = "." + req.url;

  if (fileName === "./stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data: " + (new Date().toISOString()) + "\n\n");
    res.write("data: " + (new Date().toISOString()) + "\n\n");

    interval = setInterval(function () {
      res.write("data: " + (new Date().toISOString()) + "\n\n");
    }, 5000);

    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  }
}).listen(80, "127.0.0.1");