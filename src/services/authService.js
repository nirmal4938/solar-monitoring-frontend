import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const signupUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};

export const logoutUser = async () => {
  await axiosInstance.post("/auth/logout");
};
