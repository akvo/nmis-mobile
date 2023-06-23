import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { FormNavigation } from '../../../src/form/support';

describe('FormNavigation component', () => {
  it('renders form navigation correctly', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const setActiveGroup = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId, getByText, queryByTestId } = render(
      <FormNavigation
        activeGroup={0}
        setActiveGroup={setActiveGroup}
        onSubmit={onSubmit}
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

    const btnSubmit = queryByTestId('form-btn-submit');
    expect(btnSubmit).toBeNull();
  });

  test('clicking Next should increment activeGroup if not on the last group', () => {
    const setActiveGroup = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId } = render(
      <FormNavigation activeGroup={0} setActiveGroup={setActiveGroup} onSubmit={onSubmit} />,
    );

    const btnNext = getByTestId('form-nav-btn-next');
    fireEvent.press(btnNext);
    expect(setActiveGroup).toHaveBeenCalledWith(1);
  });

  test('clicking Submit should call onSubmit if on the last group', () => {
    const setActiveGroup = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId, getByText, queryByTestId } = render(
      <FormNavigation activeGroup={1} setActiveGroup={setActiveGroup} onSubmit={onSubmit} />,
    );

    const groupCounter = getByTestId('form-nav-group-count');
    expect(groupCounter).toBeDefined();
    expect(getByText('2/2')).toBeDefined();

    const btnNext = queryByTestId('form-nav-btn-next');
    expect(btnNext).toBeNull();

    const btnSubmit = getByTestId('form-btn-submit');
    expect(btnSubmit).toBeDefined();
    fireEvent.press(btnSubmit);
    expect(onSubmit).toHaveBeenCalled();
  });
});
