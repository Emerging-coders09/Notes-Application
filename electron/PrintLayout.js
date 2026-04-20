import { BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win = null;

const Printwindow = (size) => {
  switch (size) {
    case "A4":
      win = new BrowserWindow({
        width: 800,
        height: 700,
        show: false,
        titleBarStyle: "hiddenInset",
        webPreferences: {
          preload: path.join(__dirname, "../electron/preload.js"),
        },
      });
      win.loadURL(`http://localhost:5173/#/print/${size}`);

         win.webContents.on("did-finish-load", async () => {

        setTimeout(() => {
          
          win.webContents.print({
            silent: false,
            printBackground: true,
  
          });
        }, 1000);
      });

      win.once("ready-to-show", () => {
        win.show(); // NOW it becomes visible
      });

      win.on("closed", () => {
        win = null;
      });
      return win;

    case "3-inch":
      win = new BrowserWindow({
        width: 288,
        height: 400,
        show: false,
        titleBarStyle: "hiddenInset",
        webPreferences: {
          preload: path.join(__dirname, "../electron/preload.js"),
        },
      });
      win.loadURL(`http://localhost:5173/#/print/${size}`);

      // win.webContents.getPrintersAsync().then(console.log)
      win.webContents.on("did-finish-load", async () => {

        setTimeout(() => {
          
          win.webContents.print({
            silent: false,
            printBackground: true,
  
          });
        }, 1000);
      });
      win.once("ready-to-show", () => {
        win.show(); // NOW it becomes visible
      });

      win.on("closed", () => {
        win = null;
      });
      return win;
    case "2-inch":
      win = new BrowserWindow({
        width: 202,
        height: 300,
        show: false,
        titleBarStyle: "hiddenInset",
        webPreferences: {
          preload: path.join(__dirname, "../electron/preload.js"),
        },
      });
      win.loadURL(`http://localhost:5173/#/print/${size}`);

         win.webContents.on("did-finish-load", async () => {

        setTimeout(() => {
          
          win.webContents.print({
            silent: false,
            printBackground: true,
  
          });
        }, 1000);
      });

      win.once("ready-to-show", () => {
        win.show(); // NOW it becomes visible
      });

      win.on("closed", () => {
        win = null;
      });
      return win;
    default:
      break;
  }
};

export default Printwindow;
