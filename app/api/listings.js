import client from "./client";

const getDashboardListings = () =>
  client.get("/api/dashboard-info?only_counts=true");
const getTicketListings = (params = "") => client.get(`/api/tickets${params}`);
const getTicketDetails = (ticketId) => client.get(`/api/tickets/${ticketId}`);
const getDashboardInfo = () => client.get(`/api/dashboard-info`);
const getAllUsers = () => client.get(`/api/users?all=true`);
const getAllIntents = () => client.get(`/api/intent-list`);
const setTicketSolved = (obj) => client.post("/api/tickets/set-solved", obj);
const ticketMerge = (ticketId, ticketIds) =>
  client.post(`/api/tickets/${ticketId}/merge`, ticketIds);
const ticketAssign = (obj) => client.post(`/api/tickets/assign-teams`, obj);
const ticketCreate = (obj) => client.post(`/api/tickets`, obj);
const updateTicketDetail = (ticketId, obj) =>
  client.put(`/api/tickets/${ticketId}`, obj);
const signedImageUrl = (obj) => client.post(`/api/signed-storage-url`, obj);
const forwardTicket = (ticketId, obj) =>
  client.post(`/api/tickets/${ticketId}/forward`, obj);
const socketSubscribe = (ticketId) =>
  client.post(`/api/tickets/${ticketId}/subscribe`);
const socketUnsubscribe = (ticketId) =>
  client.post(`/api/tickets/${ticketId}/unsubscribe`);
const ticketTyping = (ticketId, state) =>
  client.post(`/api/tickets/${ticketId}/typing?${state}=true`);

export default {
  getDashboardListings,
  getTicketListings,
  getTicketDetails,
  getDashboardInfo,
  getAllUsers,
  setTicketSolved,
  ticketMerge,
  ticketAssign,
  updateTicketDetail,
  getAllIntents,
  signedImageUrl,
  forwardTicket,
  socketSubscribe,
  socketUnsubscribe,
  ticketTyping,
  ticketCreate,
};
