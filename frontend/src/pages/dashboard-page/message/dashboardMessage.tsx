import React, {Component} from 'react';
import './dashboardMessage.css';
import IconButton from '../../../components/molecules/icon-button/iconButton';

type DashboardMessageProps = {
  messageImportantPart: string;
  messageRest: string;
};

export default class DashboardMessage extends Component<
  DashboardMessageProps,
  {visibility: string}
> {
  constructor(props: DashboardMessageProps) {
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
