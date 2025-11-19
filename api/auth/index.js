import request from '@/utils/request.js'

export const loginApi = (data) => {
	return request.post('/wei-xin-auth/login', data);
}