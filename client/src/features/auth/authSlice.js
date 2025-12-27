import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, userAPI } from '../../services/api';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const user = await authAPI.login(data);
    return user;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const user = await authAPI.register(data);
    return user;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    return null;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await userAPI.getProfile();
    return user;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    // This endpoint should refresh the access token using the refresh token cookie
    const response = await userAPI.refreshToken();
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data;
        state.isAuthenticated = true;
      });
  },
});

export default authSlice.reducer;
