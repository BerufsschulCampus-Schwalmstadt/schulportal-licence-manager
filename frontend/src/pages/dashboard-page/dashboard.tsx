import React, {Component} from 'react';
import {authContext} from '../auth-page/auth-form/authForm';

export default class Dashboard extends Component {
  static contextType = authContext;
  render() {
    console.log(this.context);
    return <div>hey: {JSON.stringify(this.context)}</div>;
  }
}
