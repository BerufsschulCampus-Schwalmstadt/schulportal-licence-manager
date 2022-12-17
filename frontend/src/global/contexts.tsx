import React from 'react';
import {GetAndSetUserInfo} from '../router';

/* Creating a context objects that can be used to pass data through the component tree without having to
pass props down manually at every level. */

// user info
export const userContext = React.createContext({} as GetAndSetUserInfo);
