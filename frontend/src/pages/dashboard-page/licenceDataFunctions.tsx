import {generateAxiosInstance} from '../../globals/axios-config';
import {licenceData} from '../../globals/global-types';

export type licenceDataOptions = {
  previousData?: licenceData;
  fetchedData?: licenceData;
};

export type licenceDataSyncHandler = () => Promise<void>;

export type GetAndSetLicenceData = {
  currentLicenceData: licenceData;
  syncToLatestData: licenceDataSyncHandler;
};

export async function getLicenceData(accessToken: string) {
  console.log('attempting to get data');
  const axios = generateAxiosInstance(accessToken);
  const response = await axios.get('/licence-data').catch(error => {
    console.log(error);
  });
  console.log('returning response');
  if (!response) {
    console.log('failed getting data');
  } else {
    localStorage.setItem('licenceData', JSON.stringify(response.data));
    return response.data;
  }
}

export function identifyLatestLicenceData(availableData: licenceDataOptions) {
  const previousData = availableData.previousData;
  const fetchedData = availableData.fetchedData;
  return fetchedData ? fetchedData : previousData;
}
