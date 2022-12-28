import {FormEvent} from 'react';

export type searchAndFilterInputHandler = (event: FormEvent) => void;

export type configMenuProps = {
  inputName?: string;
  inputHandler?: searchAndFilterInputHandler;
  columnSetupOptions?: {
    headings?: string[];
    indicesToSelect?: number[];
    columnToSelectEditor?: (index: number, operation: 'add' | 'remove') => void;
  };
};

export type configMenuState = {scrolled: boolean};

export function configMenuScroll(menuState: configMenuState) {
  const container = document.querySelector(
    '.tableConfigContainer > .horizontalScrollableDiv'
  ) as HTMLDivElement;

  if (document.documentElement.clientWidth <= 1727) {
    const columnSetup = document.querySelector(
      '#columnSetup'
    ) as HTMLDivElement;
    const columnSetupWidth = columnSetup.offsetWidth;

    if (!menuState.scrolled) {
      container.style.removeProperty('transform');
      console.log('translateX(' + String(columnSetupWidth) + 'px)');
      container.style.transform =
        'translateX(-' + String(columnSetupWidth + 10) + 'px)';
      return {scrolled: true};
    } else {
      container.style.removeProperty('transform');
      container.style.transform =
        'translateX(' + String(columnSetupWidth + 10) + 'px)';
      return {scrolled: false};
    }
  } else {
    container.style.removeProperty('transform');
    return;
  }
}
