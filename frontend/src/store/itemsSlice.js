import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const API_URL = 'http://localhost:3000/items'

// Sends a JSON request to the backend and returns the parsed response body.
// Throws on network failures and non-2xx responses so the thunk is rejected.
async function request(url, options = {}) {
  let res
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Cannot reach the API. Is the backend running on port 3000?')
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`)
  return data
}

// GET /items
export const fetchItems = createAsyncThunk('items/fetchItems', () => request(API_URL))

// GET /items/:id
export const fetchItem = createAsyncThunk('items/fetchItem', (id) => request(`${API_URL}/${id}`))

// POST /items
export const addItem = createAsyncThunk('items/addItem', (item) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(item) }),
)

// PUT /items/:id
export const updateItem = createAsyncThunk('items/updateItem', ({ id, ...changes }) =>
  request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
)

// DELETE /items/:id
export const deleteItem = createAsyncThunk('items/deleteItem', (id) =>
  request(`${API_URL}/${id}`, { method: 'DELETE' }),
)

const initialState = {
  list: [],
  status: 'idle', // status of the list: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  current: null, // the single shoe shown on the details, edit and delete views
  currentStatus: 'idle',
  currentError: null,
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(fetchItem.pending, (state) => {
        state.currentStatus = 'loading'
        state.currentError = null
        state.current = null
      })
      .addCase(fetchItem.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded'
        state.current = action.payload
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.currentStatus = 'failed'
        state.currentError = action.error.message
      })

      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.list.findIndex((item) => item.id === updated.id)
        if (index !== -1) state.list[index] = updated
        if (state.current?.id === updated.id) state.current = updated
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        const { id } = action.payload
        state.list = state.list.filter((item) => item.id !== id)
        if (state.current?.id === id) state.current = null
      })
  },
})

export default itemsSlice.reducer
