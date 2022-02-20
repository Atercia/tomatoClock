const path = require("path");
const log = require("electron-log"); // 日志插件 - 输出到/log文件夹
log.transports.console.level = "silly"; // 设置控制台的日志级别为全部
log.transports.file.level = "silly"; // 设置输出文件的日志级别为全部

// log.transports.console.level = false; //是否输出到 控制台
log.transports.file.resolvePath = () =>
  path.join(process.cwd(), "logs/main.log");

// log.error("error!");
// log.info("info!");
// log.warn("warn!");
// log.verbose("verbose!");
// log.debug("debug!");
// log.silly("silly!");

/**
 * @AIM 配置日志输出
 */
const LEVELS = ["info", "error", "debug", "warn", "verbose", "debug", "silly"];
for (let level of LEVELS) {
  console[level] = log[level];
}
// log.info(
//   "init_log - 渲染进程应用日志初始化配置成功，日志输出目录:",
//   __dirname,
//   process.cwd() + "logs/main.log"
// );
// ***************
export default log;
