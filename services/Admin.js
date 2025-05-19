import api from './api';


export const ListeAlertes = (data ) => {
    return api.post('/Admin/ListActiveAlerts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const GetInfoPat = (data ) => {
  return api.post('/Admin/GetInfoPatient', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export const GetInfoAlert = (data ) => {
  return api.post('/Admin/GetInfoAlert', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export const ListPatVal = (data ) => {
  return api.post('/Admin/ListVerifyPatient', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const ValidateUser = (data ) => {
  return api.post('/Admin/Validate', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const RejectUser = (data ) => {
  return api.post('/Admin/Reject', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}