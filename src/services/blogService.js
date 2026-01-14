import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/blogs`;

const getToken = () => localStorage.getItem("token");

// ✅ GET BLOGS
export const getBlogs = async () => {
  return axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

// ✅ ADD BLOG
export const addBlog = async (data) => {
  return axios.post(BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

// ✅ EDIT BLOG
export const editBlog = async (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

// ✅ DELETE BLOG
export const deleteBlog = async (id) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};