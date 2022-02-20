var express = require("express");
import log from "./common/log";
var app = express();

// 本地宣传片视频内容放到c盘hgs文件夹中，供渲染进程调用
// TODO - hgs改名为 - dispatchCenter
app.use("/public", express.static("C:/fileServer"));

app.get("/", function(req, res) {
  res.send("Hello World");
});

export function setVideoServer() {
  // log.log("TODO!!!");
  var server = app.listen(8081, function() {
    // var host = server.address().address;
    // var port = server.address().port;
    log.info("START_FILE_SERVER_SUCCESS");
  });
  server.on("error", err => {
    log.info({ START_FILE_SERVER_FAILED: err });
  });
}
