import api from "./api";

const register = async (userData) => {

  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

const login = async (loginData) => {

  const response = await api.post(
    "/auth/login",
    loginData
  );

  return response.data;
};

export default {
  register,
  login
};