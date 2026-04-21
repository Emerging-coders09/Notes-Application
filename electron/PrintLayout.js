import { BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win = null;
const WINDOW_CONFIG = {
  "A4" : {width : 800 , height : 700},
   "3-inch": { width: 288, height: 400 },
  "2-inch": { width: 202, height: 300 },
}

const Printwindow = (size) => {
  const config = WINDOW_CONFIG[size]

  if(!config){
    throw new Error(`Invalid print size: ${size}`);
  }
  const win = new BrowserWindow({
    ...config,
    show : false ,
    titleBarStyle : 'hiddenInset',
    webPreferences : {
      preload : path.join(__dirname , '../electron/preload.js')
    }
  })

  win.loadURL(`http://localhost:5173/#/print/${size}`)

  win.webContents.once('did-finish-load',  ()=>{
    try {
      setTimeout(()=>{
         win.webContents.print({
          silent : false ,
          printBackground : true
        })
      }, 500)
    } catch (error) {
      console.error("Print error :", error)
    } 
  })


  win.once('ready-to-show', ()=>{
    win.show()
  })

  return win
};

export default Printwindow;
