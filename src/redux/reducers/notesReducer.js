import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    error: null,
    PrintNotes : []
  },
  reducers: {
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action) => {
      const { id } = action.payload;
      state.notes = state.notes.filter((note) => note.id !== id);
    },
    multipleDeleteNote: (state, action) => {
      const ids = action.payload;

      state.notes = state.notes.filter((note) => !ids.includes(note.id));
    },
    updateNote: (state, action) => {
      const { id, title, content } = action.payload;
      const note = state.notes.find((note) => note.id === Number(id));
      if (note) {
        note.title = title;
        note.content = content;
      }
    },
    getNotes: (state, action) => {
      state.notes = action.payload;
    },
    clearAll: (state, action) => {
      state.notes = [];
      state.error = null
    },
    toggleFavourite: (state, action) => {
      const { id, like } = action.payload;
      const note = state.notes.find((note) => note.id === Number(id));
      if (note) {
        note.like = like;
      }
    },
    moveToRecycle: (state, action) => {
      state.notes = state.notes.map((note)=> note.id === action.payload.id ? {...note , recycle : 'bin', like : 0} : note )
    },
    moveMultipleToRecycle: (state, action) => {
      const ids = action.payload;   
      state.notes = state.notes.map((note)=> ids.includes(note.id) ? {...note , recycle : 'bin' , like : 0} : note)
        
    },
    restoreFromRecycle: (state, action) => {
      const { id } = action.payload;

      const note = state.notes.find((n) => n.id === id);

      if (note) {
        note.recycle = "recover";
      }
    },
    multipeRestore : (state ,action)=>{
        const ids = action.payload
        state.notes.forEach(note => {
            if(ids.includes(note.id)){
                note.recycle = 'recover'
            }
        })
    },
    PrintData : (state ,action)=>{
      state.PrintNotes = action.payload
    }
  },
});
export const {
  addNote,
  deleteNote,
  multipleDeleteNote,
  updateNote,
  getNotes,
  clearAll,
  toggleFavourite,
  moveToRecycle,
  moveMultipleToRecycle,
  restoreFromRecycle,
  multipeRestore,
  PrintData
} = noteSlice.actions;
export default noteSlice.reducer;
