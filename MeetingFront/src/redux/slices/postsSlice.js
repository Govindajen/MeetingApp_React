import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import myAxios from '../../utils/intercepteur';

const fetchPosts = createAsyncThunk(
	'posts/fetchPosts',
	async (_, { getState, rejectWithValue }) => {
		try {
			const state = getState();
			const lastTimestamp = state.posts.lastTimestamp || Date.now();

			const response = await myAxios.get(`/forum/before/${lastTimestamp}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error && error.response.data);
		}
	}
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
		posts: [],
		lastTimestamp: null,
		hasMore: true,
		loading: false,
		error: null
    },
	reducers: {
		resetPosts: (state) => {
			state.posts = [];
			state.lastTimestamp = null;
			state.hasMore = true;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload.length === 0) {
					state.hasMore = false;
				} else {
					state.posts = [...state.posts, ...action.payload];
					state.lastTimestamp = action.payload[action.payload.length - 1].createdAt;
				}
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	}
});

export const {  } = postsSlice.actions;

export { fetchPosts };

export default postsSlice.reducer;