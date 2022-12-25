import React, {Component} from 'react';
import './toast.css';
import IconButton from '../icon-button/iconButton';

type ToastProps = {
  messageImportantPart?: string;
  messageRest?: string;
};

export default class Toast extends Component<ToastProps, {visibility: string}> {
  constructor(props: ToastProps) {
    super(props);
    this.state = {visibility: 'flex'};
    this.hideMessage = this.hideMessage.bind(this);
  }

  hideMessage() {
    this.setState({visibility: 'none'});
  }

  render() {
    return (
      <div
        className="dashboardMessageContainer"
        style={{display: this.state.visibility}}
      >
        <div className="dashboardMessageContent">
          <span className="prioritySpanMessage">
            {this.props.messageImportantPart}
          </span>
          <span className="secondarySpanMessage">{this.props.messageRest}</span>
        </div>
        <IconButton
          iconName={'cross'}
          colour="white"
          clickHandler={this.hideMessage}
        />
      </div>
    );
  }
}
