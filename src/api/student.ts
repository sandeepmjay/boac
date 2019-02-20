import axios from 'axios';
import store from '@/store';

export function dismissStudentAlert(alertId: string) {
  let apiBaseUrl = store.getters['context/apiBaseUrl'];
  return axios
    .get(`${apiBaseUrl}/api/alerts/${alertId}/dismiss`)
    .then(response => response.data, () => null);
}

export function getStudent(uid: string) {
  let apiBaseUrl = store.getters['context/apiBaseUrl'];
  return axios
    .get(`${apiBaseUrl}/api/student/${uid}`)
    .then(response => response.data, () => null);
}
