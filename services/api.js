import request, { getBaseUrl, getFullUrl } from "../lib/request"

export const getAlert = () => {
  return request('GET', getFullUrl('api', '/alerts/alert-info')).then(d => d.data);
}
