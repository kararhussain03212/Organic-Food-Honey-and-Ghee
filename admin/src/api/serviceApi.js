import api from './axios'

export const getServices = () => api.get('/admin/services?paginate=0')
export const getService = (id) => api.get(`/admin/services/${id}`)
export const createService = (payload) => api.post('/admin/services', payload)
export const updateService = (id, payload) => api.put(`/admin/services/${id}`, payload)
export const deleteService = (id) => api.delete(`/admin/services/${id}`)
