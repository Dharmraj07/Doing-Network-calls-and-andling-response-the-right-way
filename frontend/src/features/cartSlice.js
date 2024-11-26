import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base API URL
const API_URL = 'http://localhost:5000/api/cart';

// Utility function for handling fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Async Thunks
export const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}`);
      return await handleResponse(response);
      console.log(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCartAsync = createAsyncThunk(
  'cart/addItemToCart',
  async (item, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItemFromCart',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/remove/${id}`, { method: 'DELETE' });
      await handleResponse(response);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const increaseItemQuantityAsync = createAsyncThunk(
  'cart/increaseItemQuantity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/increase/${id}`, { method: 'PATCH' });
      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseItemQuantityAsync = createAsyncThunk(
  'cart/decreaseItemQuantity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/decrease/${id}`, { method: 'PATCH' });
      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Add Item to Cart
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        const existingItem = state.items.find((item) => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      // Remove Item from Cart
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // Increase Item Quantity
      .addCase(increaseItemQuantityAsync.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      // Decrease Item Quantity
      .addCase(decreaseItemQuantityAsync.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          if (action.payload.quantity === 0) {
            state.items = state.items.filter((i) => i.id !== item.id);
          } else {
            item.quantity = action.payload.quantity;
          }
        }
      })
      // Handle Loading State
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = 'succeeded';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default cartSlice.reducer;
