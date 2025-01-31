import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myAxios from '../../utils/intercepteur';

export const fetchAllUsers = createAsyncThunk('user/fetchAll',async()=>{
    try{
        const response = await myAxios.get('/auth/allusers');
        return response.data;
    }catch(error){
        throw error
        }
})

export const fetchSlice = createSlice({
    name:'fetchAllUsers',
    initialState:{
        allUsers :[],
        status:"",
        error:"",
    },
    reducers:{
        reset:(state)=>{
            state.allUsers=[]
        },
    },
    extraReducers:(b)=>{
        b.addCase(fetchAllUsers.pending,(state)=>{
                state.status="loading";
        });
        b.addCase(fetchAllUsers.fulfilled,(state, action)=>{
                state.allUsers = action.payload;
                state.status = "success";
        })
        b.addCase(fetchAllUsers.rejected,(state, action)=>{
                state.status = "failed";
                state.error = action.error.message || "";
        });
    }
});

export const {reset} = fetchSlice.actions;
export default fetchSlice.reducer;