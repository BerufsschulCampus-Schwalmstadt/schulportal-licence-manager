import {convertArrayToCSV} from 'convert-array-to-csv';
import {generateAxiosInstance} from '../../globals/axios-config';
import {licenceData} from '../../globals/global-types';
import fileDownload from 'js-file-download';

export type licenceDataState = {
  previousData?: licenceData;
  fetchedData?: licenceData;
  lastSynced?: Date;
  lastSyncedText: string;
  gettingData: boolean;
};

export type licenceDataSyncHandler = () => Promise<void>;

export type licenceDataExportHandler = () => Promise<void>;

export type GetAndSetLicenceData = {
  currentLicenceData: licenceData;
  syncToLatestData: licenceDataSyncHandler;
  lastSynced?: Date;
  lastSyncedText: string;
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
    return;
  } else {
    localStorage.setItem('licenceData', JSON.stringify(response.data.data));
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
      lastSyncedText: 'Click here to get licence data ➜',
      gettingData: false,
    };
  } else {
    return {
      gettingData: false,
      lastSyncedText: 'Click here to get licence data ➜',
    };
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

function stringConstructor(unit: string, time: number) {
  return time > 1
    ? 'Last synced ' + time + ' ' + unit + 's ago'
    : 'Last synced ' + time + ' ' + unit + ' ago';
}

export function getTimeSinceLastSync(lastSyncedDate?: Date) {
  if (lastSyncedDate) {
    const currentTime = new Date().valueOf();
    const lastSyncedTime = new Date(lastSyncedDate).valueOf();

    // time diffs
    const differenceInMilliseconds = currentTime - lastSyncedTime;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.round(differenceInHours / 24);
    const differenceInWeeks = Math.round(differenceInDays / 7);
    const differenceInMonths = Math.round(differenceInWeeks / 4);
    const differenceInYears = Math.round(differenceInMonths / 12);

    let stringToReturn: string;
    let nextLastSyncedCheck;
    if (!(differenceInSeconds > 5)) {
      stringToReturn = stringConstructor('second', differenceInSeconds);
      nextLastSyncedCheck = 1000;
    } else if (!(differenceInSeconds > 60)) {
      stringToReturn = 'Last synced a few seconds ago';
      nextLastSyncedCheck = 1000 * 55;
    } else if (!(differenceInMinutes > 60)) {
      stringToReturn = stringConstructor('minute', differenceInMinutes);
      nextLastSyncedCheck = 60 * 1000;
    } else if (!(differenceInHours > 60)) {
      stringToReturn = stringConstructor('hour', differenceInHours);
      nextLastSyncedCheck = 60 * 60 * 1000;
    } else if (!(differenceInDays > 24)) {
      stringToReturn = stringConstructor('day', differenceInDays);
      nextLastSyncedCheck = 24 * 60 * 60 * 1000;
    } else if (!(differenceInWeeks > 7)) {
      stringToReturn = stringConstructor('minute', differenceInWeeks);
      nextLastSyncedCheck = 7 * 24 * 60 * 60 * 1000;
    } else if (!(differenceInMonths > 12)) {
      stringToReturn = stringConstructor('month', differenceInMonths);
      nextLastSyncedCheck = 4 * 7 * 24 * 60 * 60 * 1000;
    } else {
      stringToReturn = stringConstructor('year', differenceInYears);
      nextLastSyncedCheck = 12 * 4 * 7 * 24 * 60 * 60 * 1000;
    }

    return {
      lastSyncedString: stringToReturn,
      nextSyncCheck: nextLastSyncedCheck,
    };
  } else {
    return 'Click here to get licence data ➜';
  }
}
