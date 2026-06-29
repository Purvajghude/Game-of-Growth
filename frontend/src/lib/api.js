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
  // contact
  createContact: (data) => http.post("/contact", data).then((r) => r.data),
  // stats
  stats: () => http.get("/stats").then((r) => r.data),
};
