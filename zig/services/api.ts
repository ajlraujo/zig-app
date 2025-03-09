import axios from "axios";

const api = axios.create({
	baseURL: process.env.API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = process.env.AUTH_TOKEN;
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const errorInfo = {
			status: error.response?.status,
			message: error.response?.data?.message || error.message,
			url: error.config?.url,
		};
		console.error("Erro na requisição:", errorInfo);
		return Promise.reject(errorInfo);
	}
);

export default api