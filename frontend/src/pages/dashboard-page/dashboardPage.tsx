import React, {Component} from 'react';
import {userContext} from '../../globals/app-contexts';
// eslint-disable-next-line node/no-extraneous-import
import {Home} from '@mui/icons-material';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div className="sideBar">
        <Home />
      </div>
    );
  }
}
