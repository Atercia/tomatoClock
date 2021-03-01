import { Notify, date } from "quasar";
const ipc = require("electron").ipcRenderer;

function sendIpcMsg(msg) {
  ipc.send(msg);
  // window-min
}
function showNotify(
  type,
  msg,
  time = 3000,
  position = "center",
  cusCaption = ""
) {
  let color = null;
  let textColor = "white";
  let icon;
  let caption = "";
  if (type == "err" && !IS_DEBUG) {
    console.error("ERR_", msg);
    return;
  }
  switch (type) {
    case "err":
      color = "negative";
      icon = "error";
      caption = "错误";
      break;
    case "hint":
      color = "primary";
      icon = "message";
      caption = cusCaption || "";
      break;
    case "suc":
      color = "green-4";
      icon = "done";
      caption = cusCaption || "";
      break;
    case "fail":
      color = "fail";
      textColor = "white";
      caption = cusCaption || "失败";
      break;
    // case "notice":
    //   color = "warning";
    //   textColor = "white";
    //   caption = "警告";
    //   break;
    // case "msg":
    //   color = "white";
    //   textColor = "black";
    //   caption = "消息";
    //   break;
    default:
      break;
  }
  Notify.create({
    color,
    textColor,
    icon,
    position,
    caption,
    multiLine: true,
    html: true,
    timeout: Number(time),
    message: msg
  });
}

export default {
  sendIpcMsg,
  showNotify
};
