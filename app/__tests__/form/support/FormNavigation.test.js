import React from 'react';
import { render } from 'react-native-testing-library';
import { FormNavigation } from '../../../src/form/support';

describe('FormNavigation component', () => {
  it('renders form navigation correctly', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { getByTestId, getByText } = render(
      <FormNavigation
        activeGroup={0}
        setActiveGroup={() => {}}
        onSubmit={() => {}}
        totalGroup={2}
      />,
    );

    const btnBack = getByTestId('form-nav-btn-back');
    expect(btnBack).toBeDefined();

    const groupCounter = getByTestId('form-nav-group-count');
    expect(groupCounter).toBeDefined();
    expect(getByText('1/2')).toBeDefined();

    const btnNext = getByTestId('form-nav-btn-next');
    expect(btnNext).toBeDefined();
  });

  it('renders last group in form navigation correctly', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { getByTestId, getByText } = render(
      <FormNavigation
        activeGroup={1}
        setActiveGroup={() => {}}
        onSubmit={() => {}}
        totalGroup={2}
      />,
    );

    const btnBack = getByTestId('form-nav-btn-back');
    expect(btnBack).toBeDefined();

    const groupCounter = getByTestId('form-nav-group-count');
    expect(groupCounter).toBeDefined();
    expect(getByText('2/2')).toBeDefined();

    const btnNSubmit = getByTestId('form-btn-submit');
    expect(btnNSubmit).toBeDefined();
  });
});
