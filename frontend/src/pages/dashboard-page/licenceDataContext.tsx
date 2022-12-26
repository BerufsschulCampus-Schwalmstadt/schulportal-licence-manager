import React from 'react';
import {GetAndSetLicenceData} from './licenceDataFunctions';

/* Creating a context object that can be used to pass data through the component tree without having to
pass props down manually at every level. */

// licence data
export const licenceDataContext = React.createContext(
  {} as GetAndSetLicenceData
);
