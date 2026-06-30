import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const http = axios.create({ baseURL: API, headers: { "Content-Type": "application/json" } });

export const api = {
  // leads
  listLeads: () => http.get("/leads").then((r) => r.data),
  createLead: (data) => http.post("/leads", data).then((r) => r.data),
  updateLead: (id, data) => http.patch(`/leads/${id}`, data).then((r) => r.data),
  deleteLead: (id) => http.delete(`/leads/${id}`).then((r) => r.data),
  // pipeline
  listPipeline: () => http.get("/pipeline").then((r) => r.data),
  createPipeline: (data) => http.post("/pipeline", data).then((r) => r.data),
  updatePipeline: (id, data) => http.patch(`/pipeline/${id}`, data).then((r) => r.data),
  deletePipeline: (id) => http.delete(`/pipeline/${id}`).then((r) => r.data),
  // content
  listContent: () => http.get("/content").then((r) => r.data),
  createContent: (data) => http.post("/content", data).then((r) => r.data),
  updateContent: (id, data) => http.patch(`/content/${id}`, data).then((r) => r.data),
  deleteContent: (id) => http.delete(`/content/${id}`).then((r) => r.data),
  // projects
  listProjects: () => http.get("/projects").then((r) => r.data),
  createProject: (data) => http.post("/projects", data).then((r) => r.data),
  updateProject: (id, data) => http.patch(`/projects/${id}`, data).then((r) => r.data),
  deleteProject: (id) => http.delete(`/projects/${id}`).then((r) => r.data),
  // invoices
  listInvoices: () => http.get("/invoices").then((r) => r.data),
  createInvoice: (data) => http.post("/invoices", data).then((r) => r.data),
  updateInvoice: (id, data) => http.patch(`/invoices/${id}`, data).then((r) => r.data),
  deleteInvoice: (id) => http.delete(`/invoices/${id}`).then((r) => r.data),
  // tasks
  listTasks: () => http.get("/tasks").then((r) => r.data),
  createTask: (data) => http.post("/tasks", data).then((r) => r.data),
  updateTask: (id, data) => http.patch(`/tasks/${id}`, data).then((r) => r.data),
  deleteTask: (id) => http.delete(`/tasks/${id}`).then((r) => r.data),
  // notes
  listNotes: () => http.get("/notes").then((r) => r.data),
  createNote: (data) => http.post("/notes", data).then((r) => r.data),
  updateNote: (id, data) => http.patch(`/notes/${id}`, data).then((r) => r.data),
  deleteNote: (id) => http.delete(`/notes/${id}`).then((r) => r.data),
  // contact
  createContact: (data) => http.post("/contact", data).then((r) => r.data),
  // stats
  stats: () => http.get("/stats").then((r) => r.data),
};
