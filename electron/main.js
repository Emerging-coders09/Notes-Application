import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
let win;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../electron/preload.js"),
    },
  });

  if (process.env.VITE_SERVER) {
    win.loadURL(process.env.VITE_SERVER);
  } else {
    win.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
  }
};
const db = new Database("notes.db");
db.pragma("journal_mode = WAL");

db.exec(
  `
    CREATE TABLE IF NOT EXISTS Notes (
    id INTEGER ,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    like INTEGER,
    recycle TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
    )
    `,
);
db.exec(
  `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER ,
    name TEXT ,
    email TEXT UNIQUE,
    password TEXT ,
    PRIMARY KEY("id" AUTOINCREMENT)
    )
    `,
);


ipcMain.handle("register", async (event, user) => {
  try {
    const query = `INSERT INTO users (name , email , password) VALUES (?,?,?)`;
    const insert = db.prepare(query).run(user.name, user.email, user.password);

    return {
      success: true,
      data: insert,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle('get-users' , async (event , user)=>{
  try {
    const query = `SELECT * FROM users WHERE email = ?`
    const User = db.prepare(query).get(user.email)

    return {
      success : true,
      data : User
    }
  } catch (error) {
      return {
        success : false ,
        error : error.message
      }
  }
})

ipcMain.handle("login", async (event, user) => {
  try {
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    const data = db.prepare(query).get(user.email, user.password);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("add-note", async (event, note) => {
  try {
    const query =
      "INSERT INTO notes (user_id , title , content) VALUES (?,?,?)";
    const insert = db
      .prepare(query)
      .run(note.user_id, note.title, note.content);

    return {
      success: true,
      data: insert,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("get-notes", async (event, user) => {
  try {
    const query = `SELECT * FROM notes WHERE user_id = ? AND (recycle != 'bin' OR recycle IS NULL);`;
    const getdata = db.prepare(query).all(user.user_id);
    return {
      success: true,
      data: getdata,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("delete-note", async (event, note) => {
  try {
    const query = `DELETE FROM notes WHERE id = ?`;
    const deleteNote = db.prepare(query).run(note.id);
    return {
      success: true,
      data: deleteNote,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("edit-note", async (event, note) => {
  try {
    const query = `UPDATE Notes SET title = ? , content = ? WHERE id = ?`;
    const updateNote = db.prepare(query).run(note.title, note.content, note.id);

    return {
      success: true,
      data: updateNote,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("getnotebyid", async (event, id) => {
  try {
    const query = `SELECT * FROM Notes WHERE id = ?`;
    const getbyid = db.prepare(query).get(id.id);

    return {
      success: true,
      data: getbyid,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("favourite-note", async (event, like) => {
  try {
    const query = `UPDATE Notes SET like = 1 WHERE user_id = ? AND id = ?`;
    const favourite = db.prepare(query).run(like.user_id, like.id);

    return {
      success: true,
      data: favourite,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("get-favourites", async (event, like) => {
  try {
    const query = `SELECT * FROM Notes WHERE user_id = ? AND like = 1`;
    const getfavouritedata = db.prepare(query).all(like.user_id);

    return {
      success: true,
      data: getfavouritedata,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("unfavourite", async (event, like) => {
  try {
    const query = `UPDATE Notes SET like = 0 WHERE user_id = ? AND id = ?`;
    const unfavourite = db.prepare(query).run(like.user_id, like.id);

    return {
      success: true,
      data: unfavourite,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("delete-multiple", async (event, ids) => {
  try {
    if (!ids || ids.length === 0) {
      return { success: false, error: "No IDs provided" };
    }
    const placeholders = ids.map(() => "?").join(",");
    const query = `DELETE FROM Notes WHERE id IN (${placeholders})`;
    const deletemultiple = db.prepare(query).run(...ids);

    return {
      success: true,
      deleted: deletemultiple.changes,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("recycle-bin", async (event, id) => {
  try {
    const query = `UPDATE Notes SET recycle = 'bin' WHERE id = ?`;
    const recyclebin = db.prepare(query).run(id.id);
    return {
      success: true,
      deleted: recyclebin.changes,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("get-recycle", async (event, notes) => {
  try {
    const query = `SELECT * FROM Notes WHERE user_id = ? AND recycle = 'bin' `;
    const getrecycle = db.prepare(query).all(notes.user_id);

    return {
      success: true,
      data: getrecycle,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle('recover' , async (event , notes)=>{
  try {
    const query = `UPDATE Notes SET recycle = 'recover' WHERE id = ?`
    const recover = db.prepare(query).run(notes.id)

    return {
      success : true ,
      recover : recover.changes
    }
  } catch (error) {
    return {
      success : false ,
      error : error.message
    }
  }
})

ipcMain.handle('recycle-multitple' , async (event , ids)=>{
  if (!ids || ids.length === 0) {
      return { success: false, error: "No IDs provided" };
    }
  try {

    const placeholders = ids.map(()=> '?').join(',')
    const query = `UPDATE Notes SET recycle = 'bin' WHERE id IN (${placeholders})`  
    const recycleMultiple = db.prepare(query).run(...ids)

    return {
      success : true,
      recycle : recycleMultiple.changes
    }
  } catch (error) {
    return {
      success : false ,
      error : error.message
    }
  }
})

ipcMain.handle('recover-Multiple', async (event , notes)=>{
  if (!notes || notes.length === 0) {
      return { success: false, error: "No IDs provided" };
    }
  try {
      const placeholders = notes.map(()=> '?').join(',')
      const query = `UPDATE Notes SET recycle = 'recover' WHERE id IN (${placeholders})`
      const recoverMultiple = db.prepare(query).run(...notes)

      return {
        success : true,
        recover : recoverMultiple.changes
      }

  } catch (error) {
    return {
      success : false ,
      error : error.message
    }
  }
})



app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
