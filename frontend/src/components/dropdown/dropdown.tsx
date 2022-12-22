import React, {Children, Component, RefObject} from 'react';
import IconButton from '../icon-button/iconButton';
import './dropdown.css';
import HorizontalDivider from '../horizontalDivider';
import assert from 'assert';

export default class Dropdown extends Component<
  {text: string; id: string},
  {listVisible: 'none' | 'flex'}
> {
  constructor(props: {text: string; id: string}) {
    super(props);
    this.state = {listVisible: 'none'};
    this.handleclick = this.handleclick.bind(this);
  }
  handleclick() {
    if (this.state.listVisible === 'none') {
      this.setState({listVisible: 'flex'});
    } else {
      this.setState({listVisible: 'none'});
    }
  }

  componentDidMount(): void {
    const thisDropdownInstance = document.getElementById(this.props.id);
    assert(thisDropdownInstance);
    const children = document.querySelectorAll('#' + this.props.id + '>' + '*');
    console.log(children);
    const arr = Array.from(children);
    assert(children);
    document.addEventListener('click', (event: MouseEvent) => {
      const trigger = event.target as HTMLElement;
      console.log(trigger);
      if (
        trigger !== thisDropdownInstance &&
        !arr.includes(trigger) &&
        this.state.listVisible === 'flex'
      ) {
        this.setState({listVisible: 'none'});
      }
    });
  }
  render() {
    return (
      <div className="dropDownWrapper" id={this.props.id}>
        <IconButton
          text={{
            text: 'No SMS account linked',
            textPosition: 'front',
          }}
          outlined={{colour: '#B3B1EC'}}
          filled={'white'}
          iconName="caret-down"
          clickHandler={this.handleclick}
        />
        <div className="dropdownList" style={{display: this.state.listVisible}}>
          <p style={{fontSize: '20px'}} className="dropdownListItem">
            {this.props.text}
          </p>
        </div>
      </div>
    );
  }
}
