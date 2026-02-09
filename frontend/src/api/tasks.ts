const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

export interface TasksResponse {
  data: Task[];
  total: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json();
}

export const tasksApi = {
  list: (page = 1, limit = 50) =>
    request<TasksResponse>(`/tasks?page=${page}&limit=${limit}`),

  get: (id: string) => request<Task>(`/tasks/${id}`),

  create: (body: CreateTaskInput) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: UpdateTaskInput) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
