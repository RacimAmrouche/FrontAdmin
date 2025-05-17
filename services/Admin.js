import api from './api';


export const ListeAlertes = (data ) => {
    return api.post('/Admin/ListActiveAlerts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
