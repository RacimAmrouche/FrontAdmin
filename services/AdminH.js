import api2 from './api2';

export const AddAmbu = (data ) => {
    return api2.post('/SVEAmbuController/createSVE', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
export const ModifStatu = (data ) => {
    return api2.post('/SVEAmbuController/MODIFstatusSVE', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const AllAmbu = (data ) => {
  return api2.post('/SVEAmbuController/ListeSVE', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};
export const DelAmbu = (data ) => {
  return api2.post('/SVEAmbuController/DeleteAmbulance', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};