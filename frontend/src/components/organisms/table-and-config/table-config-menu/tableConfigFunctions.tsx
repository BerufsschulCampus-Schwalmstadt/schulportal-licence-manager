import {FormEvent} from 'react';

export type searchAndFilterInputHandler = (event: FormEvent) => void;

export type configMenuProps = {
  inputName: string;
  inputHandler: searchAndFilterInputHandler;
  columnSetupOptions: {
    headings?: string[];
    indicesToSelect?: number[];
    columnToSelectEditor?: (index: number, operation: 'add' | 'remove') => void;
  };
};

export type configMenuState = {scrolled: boolean};

export function determineConfigMenuDataState(props: configMenuProps) {
  if (!props.columnSetupOptions) return {columnDataReceived: false};
  const {headings, indicesToSelect} = props.columnSetupOptions;
  if (headings && indicesToSelect) return {columnDataReceived: true};
  return {columnDataReceived: false};
}

function getTranslateProperties() {
  const screenSize = document.documentElement.clientWidth;
  let translateAmountForward = '';
  let translateAmountBack = '';
  if (screenSize <= 801) {
    translateAmountForward = 'translateX(-73%)';
    translateAmountBack = 'translateX(10%)';
  } else if (screenSize <= 1000) {
    translateAmountForward = 'translateX(-45%)';
    translateAmountBack = 'translateX(10%)';
  } else if (screenSize <= 1200) {
    translateAmountForward = 'translateX(-28%)';
    translateAmountBack = 'translateX(5%)';
  } else if (screenSize <= 1400) {
    translateAmountForward = 'translateX(-28%)';
    translateAmountBack = 'translateX(5%)';
  } else if (screenSize <= 1727) {
    translateAmountForward = 'translateX(-11%)';
    translateAmountBack = 'translateX(0%)';
  }
  return {
    translateAmountForward,
    translateAmountBack,
  };
}

export function initializeScrollContainer() {
  const container = document.querySelector(
    '.tableConfigContainer > .horizontalScrollableDiv'
  ) as HTMLDivElement;

  const translateProperties = getTranslateProperties();
  container.style.transform = translateProperties.translateAmountBack;
}

export function updateConfigMenuScroll(menuState: configMenuState) {
  const container = document.querySelector(
    '.tableConfigContainer > .horizontalScrollableDiv'
  ) as HTMLDivElement;

  const translateProperties = getTranslateProperties();

  if (!menuState.scrolled && document.documentElement.clientWidth <= 1727) {
    container.style.removeProperty('transform');
    container.style.transform = translateProperties.translateAmountForward;
    return {scrolled: true};
  } else if (document.documentElement.clientWidth <= 1727) {
    container.style.removeProperty('transform');
    container.style.transform = translateProperties.translateAmountBack;
    return {scrolled: false};
  } else {
    container.style.removeProperty('transform');
    return {scrolled: false};
  }
}
