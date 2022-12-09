import React, {Component} from 'react';
import Lottie from 'react-lottie';

// ---------------------------  Class Prop def ------------------------------//

class LottieProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  rendererSettings?: {
    preserveAspectRatio: string;
  };

  constructor(passedProps: LottieProps) {
    const {animationData, loop, autoplay, rendererSettings} = passedProps;
    this.animationData = animationData;
    this.loop = loop ? loop : true;
    this.autoplay = autoplay ? autoplay : true;
    this.rendererSettings = rendererSettings
      ? rendererSettings
      : {preserveAspectRatio: 'xMidYMid slice'};
  }
}

// ---------------------------  Class Component ------------------------------//

export default class myLottieElement extends Component<LottieProps> {
  fullProps: LottieProps;

  constructor(props: LottieProps) {
    super(props);
    this.fullProps = new LottieProps(this.props);
  }

  // -------------rendered HTML
  render() {
    return (
      <>
        <Lottie options={this.fullProps} height="251px" width="200px" />
      </>
    );
  }
}
