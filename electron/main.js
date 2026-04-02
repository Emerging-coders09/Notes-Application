import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path'
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3'
import { resolve } from 'dns';
let win

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbpath = path.join(__dirname , 'notes.db')




const createWindow = ()=>{
    win = new BrowserWindow({
        width : 1200 ,
        height : 800 ,
        webPreferences : {
            preload : path.join(__dirname , '../electron/preload.js'),
            contextIsolation : true
        }
    })
    
    if(process.env.VITE_SERVER){
        win.loadURL(process.env.VITE_SERVER)
    }else{
        
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }
    
}
const db = new sqlite3.Database(dbpath , (err)=>{
    if(err) console.log(err)
    else console.log('Connected to the DB')    
})

db.run(
    `
    CREATE TABLE IF NOT EXISTS Notes (
    id INTEGER ,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
    )
    `
)
db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER ,
    name TEXT ,
    email TEXT UNIQUE,
    password TEXT ,
    PRIMARY KEY("id" AUTOINCREMENT)
    )
    `
)

ipcMain.handle('register', async (event , user)=>{
    return new Promise((resolve , reject)=>{
        db.run(
            `INSERT INTO users (name , email , password) VALUES (? , ? , ?)`,
            [user.name , user.email , user.password],
            function(err){
                if(err) reject(err)
                else resolve ({ id : this.lastID})
            }
        )
    })
})

ipcMain.handle('login', async(event , user)=>{
    return new Promise((resolve , reject)=>{
        db.get(
            `SELECT * FROM users WHERE email = ? AND password = ?`,
            [user.email , user.password],
            (err , row)=>{
                if(err) reject(err)
                else resolve (row)    
            }
        )
    })
})

ipcMain.handle('add-note',async (event ,note)=>{
    return new Promise((resolve , reject)=>{
        db.run(
            `INSERT INTO Notes (user_id,title , content) VALUES (?, ? , ?)`,
            [note.userId,note.title, note.content],
            function (err){
                if (err) reject(err)
                else resolve ({ id : this.lastID })
            }
        )
    })
})

ipcMain.handle('get-notes', async (event , userId)=>{
    return new Promise((resolve , reject)=>{
        db.all(`SELECT * FROM Notes WHERE id = ?`, [userId], (err, rows)=>{
            if(err) reject(err)
            else resolve(rows)
        })
    })
})

app.whenReady().then(()=>{
    createWindow()
})

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin') app.quit()
    })