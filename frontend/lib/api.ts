const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("ticked_token") : null;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handle = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
};

// ── Auth ────────────────────────────────────────────────
export const registerUser = (body: object) =>
  fetch(`${API_BASE}/auth/register`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handle);

export const loginUser = (body: object) =>
  fetch(`${API_BASE}/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handle);

export const getMe = () =>
  fetch(`${API_BASE}/auth/me`, { headers: headers() }).then(handle);

// ── Todos ───────────────────────────────────────────────
export const fetchTodos = (filter?: string) =>
  fetch(`${API_BASE}/todos${filter ? `?filter=${filter}` : ""}`, { headers: headers() }).then(handle);

export const createTodo = (body: object) =>
  fetch(`${API_BASE}/todos`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handle);

export const updateTodo = (id: string | number, body: object) =>
  fetch(`${API_BASE}/todos/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handle);

export const deleteTodo = (id: string | number) =>
  fetch(`${API_BASE}/todos/${id}`, { method: "DELETE", headers: headers() }).then(handle);

export const clearCompleted = () =>
  fetch(`${API_BASE}/todos/completed`, { method: "DELETE", headers: headers() }).then(handle);

// ── Categories ──────────────────────────────────────────
export const fetchCategories = () =>
  fetch(`${API_BASE}/categories`, { headers: headers() }).then(handle);

export const createCategory = (body: object) =>
  fetch(`${API_BASE}/categories`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handle);

export const deleteCategory = (id: string | number) =>
  fetch(`${API_BASE}/categories/${id}`, { method: "DELETE", headers: headers() }).then(handle);

// ── Profile ─────────────────────────────────────────────
export const fetchProfile = () =>
  fetch(`${API_BASE}/profile`, { headers: headers() }).then(handle);

export const updateProfile = (body: object) =>
  fetch(`${API_BASE}/profile`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handle);

// ── Settings ────────────────────────────────────────────
export const fetchSettings = () =>
  fetch(`${API_BASE}/settings`, { headers: headers() }).then(handle);

export const updateSettings = (body: object) =>
  fetch(`${API_BASE}/settings`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handle);

// ── Stats ───────────────────────────────────────────────
export const fetchStats = () =>
  fetch(`${API_BASE}/stats`, { headers: headers() }).then(handle);

export const fetchWeeklyStats = () =>
  fetch(`${API_BASE}/stats/weekly`, { headers: headers() }).then(handle);

export const fetchActivity = () =>
  fetch(`${API_BASE}/stats/activity`, { headers: headers() }).then(handle);

export const fetchAchievements = () =>
  fetch(`${API_BASE}/stats/achievements`, { headers: headers() }).then(handle);
