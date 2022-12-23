import Lottie from 'lottie-react';
import loadingAnimation from './loadanimation.json';

export default function Loading() {
  return <Lottie animationData={loadingAnimation} />;
}
