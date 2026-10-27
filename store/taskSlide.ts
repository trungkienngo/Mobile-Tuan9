import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const getTasks = createAsyncThunk('tasks/get', async () => {
  const res = await fetch(`${API_URL}?_limit=5`);
  if (!res.ok) throw new Error('Lỗi tải dữ liệu');
  return (await res.json()) as Task[];
});

export const createTask = createAsyncThunk(
  'tasks/create',
  async (title: string) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false, userId: 1 })
    });
    if (!res.ok) throw new Error('Lỗi thêm');
    const data = await res.json();
    return { ...data, id: Date.now(), title, completed: false } as Task;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (task: Task) => {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Lỗi sửa');
    await res.json();
    return task;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Lỗi xóa');
    return id;
  }
);

type State = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  tasks: [],
  loading: false,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, state => {
        state.loading = false;
        state.error = 'Không tải được dữ liệu';
      })
      .addCase(createTask.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi thêm công việc';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const i = state.tasks.findIndex(t => t.id === action.payload.id);
        if (i !== -1) state.tasks[i] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  }
});

export default taskSlice.reducer