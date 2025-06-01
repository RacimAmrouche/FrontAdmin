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

export const GetInfoPro = (data ) => {
  return api.post('/Admin/GetInfoProS', data, {
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
export const ListProVal = (data ) => {
  return api.post('/Admin/ListVerifyProS', data, {
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

export const Banuser = (data ) => {
  return api.post('/Admin/BanUser', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const SuspendUser = (data ) => {
  return api.post('/Admin/SuspendUser', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const RemoveSuspension = (data ) => {
  return api.post('/Admin/RemoveSuspension', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const AllPat = (data ) => {
  return api.post('/Admin/AllPatients', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const AllProS = (data ) => {
  return api.post('/Admin/AllProS', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const AllHelp = (data ) => {
  return api.post('/Admin/ListHelpForms', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const RepHelp = (data ) => {
  return api.post('/Admin/HelpFormResponse', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
export const BanUser = (data ) => {
  return api.post('/Admin/BanUser', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
export const UnSus = (data ) => {
  return api.post('/Admin/RemoveSuspension', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}


