const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    register : (User)=> ipcRenderer.invoke('register', User),
    login : (User) => ipcRenderer.invoke('login', User),
    addNote : (note)=> ipcRenderer.invoke('add-note', note),
    getNotes : (id)=> ipcRenderer.invoke('get-notes', id),
    deleteNote : (id)=> ipcRenderer.invoke('delete-note' , id),
    editNote : (note)=> ipcRenderer.invoke('edit-note', note),
    getNotebyid : (id)=> ipcRenderer.invoke('getnotebyid', id),
    favourite : (like)=> ipcRenderer.invoke('favourite-note' , like)
})