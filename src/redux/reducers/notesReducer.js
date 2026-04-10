import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchNotes = createAsyncThunk(
    'notes/fetchnotes',
    async (user_id , thunkAPI) =>{
        try {
            const res = await window.api.getNotes({user_id})
            return res?.data || []
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const addNote = createAsyncThunk(
    'notes/addnotes',
    async (notes , thunkAPI) =>{
        try {
            const note = await window.api.addNote(notes)
            return note
        } catch (error) {
             return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const updateNote = createAsyncThunk(
    'notes/updateNotes',
    async (notes , thunkAPI)=>{
        try {
            const note = await window.api.editNote(notes)
            return note
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const deleteNote = createAsyncThunk(
    'notes/deleteNotes',
    async (id , thunkAPI)=>{
        try {
            await window.api.deleteNote({id})
            return id
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
) 
export const toggleFavourite = createAsyncThunk(
    'notes/toggleFavourite',
    async ({user_id , id , like } , thunkAPI)=>{
        try {
            if(like !== 1){
                await window.api.favourite({ user_id , id})
                return {id , like : 1}
            } else {
                await window.api.unfavourite({user_id , id})
                return {id , like : 0}
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const recycleNote = createAsyncThunk(
    'note/recyclenote',
    async (id , thunkAPI)=>{
        try {
            await window.api.recyclebin({id})
            return id
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    error : null
  },
  reducers: {
  },
  extraReducers : (builder)=>{
    builder
        .addCase(fetchNotes.pending , (state)=>{
            state.error = null
        })
        .addCase(fetchNotes.rejected , (state ,action)=>{
            state.error = action.payload
        })
        .addCase(fetchNotes.fulfilled , (state , action)=>{
            state.notes = action.payload
            state.error = null
        })

        .addCase(addNote.fulfilled , (state , action)=>{
            state.notes.push(action.payload)
        })

        .addCase(deleteNote.fulfilled , (state , action)=>{
            state.notes = state.notes.filter((note)=> note.id !== action.payload)
        })

        .addCase(updateNote.fulfilled , (state ,action)=>{
            state.notes = state.notes.map((note)=> note.id === action.payload.id ? action.payload : note)
        })

        .addCase(toggleFavourite.fulfilled , (state ,action)=>{
            const note = state.notes.find((note)=> note.id === action.payload.id)

            if(note){
                note.like = action.payload.like
            }
        })
        .addCase(recycleNote.fulfilled , (state , action)=>{
            state.notes = state.notes.filter((note)=> note.id !== action.payload)
        })

  }
});

export default noteSlice.reducer;
