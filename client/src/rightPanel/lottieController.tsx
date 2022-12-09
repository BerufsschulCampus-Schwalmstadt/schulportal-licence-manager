import React, {Component} from 'react';
import Lottie from 'react-lottie';

// ---------------------------  Class Prop def ------------------------------//

/* It's a class that takes in a bunch of props and sets them to the class's properties */
class LottieControllerProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  rendererSettings?: {
    preserveAspectRatio: string;
  };
  height?: string;
  width?: string;

  constructor(passedProps: LottieControllerProps) {
    const {animationData, loop, autoplay, rendererSettings, height, width} =
      passedProps;
    this.animationData = animationData;
    this.loop = loop ? loop : true;
    this.autoplay = autoplay ? autoplay : true;
    this.rendererSettings = rendererSettings
      ? rendererSettings
      : {preserveAspectRatio: 'xMidYMid slice'};
    this.height = height ? height : '251px';
    this.height = width ? width : '200px';
  }
}

// ---------------------------  Class Component ------------------------------//

/* This class is a React component that renders a Lottie animation */
export default class LottieController extends Component<LottieControllerProps> {
  fullProps: LottieControllerProps;

  constructor(props: LottieControllerProps) {
    super(props);
    this.fullProps = new LottieControllerProps(this.props);
  }

  // -------------rendered HTML
  render() {
    return (
      <>
        <Lottie options={this.fullProps} />
      </>
    );
  }
}
