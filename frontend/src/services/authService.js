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


// FORGOT PASSWORD
const forgotPassword = async (email) => {

  const response = await api.post(
    "/auth/forgot-password",
    {
      email
    }
  );

  return response.data;
};


// RESET PASSWORD
const resetPassword = async (token, newPassword) => {

  const response = await api.post(
    "/auth/reset-password",
    {
      token,
      newPassword
    }
  );

  return response.data;
};


export default {

  register,
  login,
  forgotPassword,
  resetPassword

};