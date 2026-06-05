import api from './axios'

export const getSliders = () => api.get('/admin/hero?paginate=0')
export const getSlider = (id) => api.get(`/admin/hero/${id}`)
export const createSlider = (payload) => api.post('/admin/hero', payload)
export const updateSlider = (id, payload) => api.put(`/admin/hero/${id}`, payload)
export const deleteSlider = (id) => api.delete(`/admin/hero/${id}`)
