'use babel';

// import ReactDOM from 'react-dom';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ServaComponent from '../lib/serva-component';

describe('ServaComponent', () => {
  let viewElement = document.createElement('div');

  it('renders', () => {
    let element = <ServaComponent servers={[]} reloadServer={() => {}} stopServer={() => {}} hide={() => {}}></ServaComponent>;

    expect(() => {
      let component = ReactTestUtils.renderIntoDocument(element);
    }).not.toThrow();
  });
});
