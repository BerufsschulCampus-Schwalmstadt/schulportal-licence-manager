import {convertArrayToCSV} from 'convert-array-to-csv';
import {generateAxiosInstance} from '../../globals/axios-config';
import {licenceData} from '../../globals/global-types';
import fileDownload from 'js-file-download';

export type licenceDataState = {
  previousData?: licenceData;
  fetchedData?: licenceData;
  gettingData: boolean;
  lastSynced?: Date;
};

export type licenceDataSyncHandler = () => Promise<void>;

export type licenceDataExportHandler = () => Promise<void>;

export type GetAndSetLicenceData = {
  currentLicenceData: licenceData;
  syncToLatestData: licenceDataSyncHandler;
  gettingData: boolean;
  exportData: licenceDataExportHandler;
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

export function identifyLatestLicenceData(availableData: licenceDataState) {
  const previousData = availableData.previousData;
  const fetchedData = availableData.fetchedData;
  return fetchedData ? fetchedData : previousData;
}

export function initialiseDataState() {
  const previousDataString = localStorage.getItem('licenceData');

  if (previousDataString) {
    return {
      previousData: JSON.parse(previousDataString),
      gettingData: false,
    };
  } else {
    return {gettingData: false};
  }
}

function getDate(): string {
  let dateString: string = new Date().toLocaleDateString('en-GB');

  // proper date format
  dateString =
    dateString.substring(0, 2) +
    '_' +
    dateString.substring(3, 5) +
    '_' +
    dateString.substring(6);

  return dateString;
}

export function downloadAsCSV(availableData: licenceDataState) {
  const dataToExport = identifyLatestLicenceData(availableData) as licenceData;
  const {body, heading} = dataToExport;

  if (body && heading) {
    // generate a table object from all license pages
    const headingToExport: string[] = heading;
    const bodyToExport: string[][] = body;

    // generate csv string from table
    const csvString: string = convertArrayToCSV(bodyToExport, {
      header: headingToExport,
      separator: ',',
    });

    const fileName = 'Active_Licences_Export_' + getDate() + '.csv';

    fileDownload(csvString, fileName);
  }
}
