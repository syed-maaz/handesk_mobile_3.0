import client from "./client";

const login = (email, password) => client.post("/api/login", { email, password });

export default {
  login
};