import api from './api';


export const signupPatient = (data ) => {
    return api.post('/auth/signupWithFile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const signupProS = (data ) => {
  return api.post('/auth/signupWithFileProS', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export const signinPatient = (data ) => {
    return api.post('/auth/signinPatient', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

export const signinProS = (data ) => {
  return api.post('/auth/signinProS', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
export const signinAdmin = (data ) => {
  return api.post('/auth/signinAdmin', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
export const signinAdminH = (data ) => {
  return api.post('/auth/signinAdminHopitale', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
export const signinSuperAdmin= (data ) => {
  return api.post('/auth/signinSuperAdmin', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const AddAdmin = (data ) => {
  return api.post('/auth/AddAdmin', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export const AddAdminH = (data ) => {
  return api.post('/AdminH/AddAdminH/AddAdminH', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

