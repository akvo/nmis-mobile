import React, { useState } from 'react';
import { render, renderHook, fireEvent, act } from '@testing-library/react-native';
import { UIState } from '../../../store';
import FieldLabel from '../FieldLabel';

const mockFieldLabel = jest.fn();

jest.mock(
  '../FieldLabel',
  () =>
    ({ keyform = 0, lang = 'en', name, tooltip, translations, requiredSign = null }) => {
      mockFieldLabel(keyform, name, tooltip, translations);

      const toggle = jest.fn().mockImplementation(() => {
        let toggleState = false;
        toggleState = !toggleState;
        return toggleState;
      });

      const getTrans = (trans, target) => trans.find((t) => t?.language === target);

      let text = name;
      if (translations?.length) {
        const findTransText = getTrans(translations, lang);
        text = findTransText?.text || text;
      }
      const prefix = `${keyform + 1}. `;
      const labelText = prefix + text;

      let tooltipText = tooltip?.text;
      if (tooltip?.translations?.length) {
        const findTransTooltip = getTrans(tooltip.translations, lang);
        tooltipText = findTransTooltip?.text || tooltipText;
      }

      const isVisible = toggle();
      return (
        <div>
          {requiredSign && <mock-Text testID="field-required-icon">{requiredSign}</mock-Text>}
          <mock-Text testID="field-label">{labelText}</mock-Text>
          {tooltip && (
            <div>
              {isVisible && (
                <mock-ControlledTooltip testID="field-tooltip-text">
                  {tooltipText}
                </mock-ControlledTooltip>
              )}
              <mock-QuestionMark testID="field-tooltip-icon" onPress={toggle} />
            </div>
          )}
        </div>
      );
    },
);

describe('FieldLabel component', () => {
  beforeEach(() => {
    // Reset to default
    UIState.update((s) => {
      s.lang = 'en';
    });
  });

  it('renders label correctly', () => {
    const name = 'First Name';
    const { getByTestId } = render(<FieldLabel name={name} />);

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${name}`);
  });

  it('should translate Question Text', () => {
    const enText = 'Phone number';
    const frText = 'Numéro de téléphone';
    const translations = [{ language: 'fr', text: frText }];
    const lang = 'fr';
    const { getByTestId } = render(
      <FieldLabel lang={lang} name={enText} translations={translations} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${frText}`);
  });

  it('should update translation on language change', () => {
    const enText = 'Address';
    const idText = 'Alamat';

    const changes2lang = 'id';

    const translations = [{ language: 'id', text: idText }];

    const { result } = renderHook(() => UIState.useState());
    const { lang } = result.current;

    expect(lang).toEqual('en');

    const { getByTestId, rerender } = render(
      <FieldLabel lang={lang} name={enText} translations={translations} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${enText}`);

    act(() => {
      UIState.update((s) => {
        s.lang = changes2lang;
      });
    });

    const updatedLang = result.current.lang;
    rerender(<FieldLabel lang={updatedLang} name={enText} translations={translations} />);

    expect(updatedLang).toBe(changes2lang);
    expect(labelElement.props.children).toBe(`1. ${idText}`);
  });

  it('should fallback to default language when translation is not available', () => {
    const enText = 'Gender';
    const nlText = 'geslacht';

    const changes2lang = 'nl';

    const translations = [
      { language: 'id', text: 'Jenis kelamin' },
      { language: 'fr', text: 'Genre' },
    ];

    const { result } = renderHook(() => UIState.useState());
    const { lang } = result.current;

    expect(lang).toEqual('en');

    const { getByTestId, rerender } = render(
      <FieldLabel lang={lang} name={enText} translations={translations} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${enText}`);

    act(() => {
      UIState.update((s) => {
        s.lang = changes2lang;
      });
    });

    const updatedLang = result.current.lang;
    rerender(<FieldLabel lang={updatedLang} name={enText} translations={translations} />);

    expect(updatedLang).toBe(changes2lang);
    expect(labelElement.props.children).toBe(`1. ${enText}`);
    expect(labelElement.props.children).not.toBe(`1. ${nlText}`);
  });

  it('should show question mark when tooltip is defined', () => {
    const tooltip = {
      text: 'First name and last name',
    };
    const questionText = 'First Name';
    const { getByTestId, queryByTestId } = render(
      <FieldLabel name={questionText} tooltip={tooltip} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${questionText}`);

    const tooltipIcon = getByTestId('field-tooltip-icon');
    expect(tooltipIcon).toBeDefined();
  });

  it('should show tooltip text when question mark clicked', () => {
    const tooltip = {
      text: 'First name and last name',
    };
    const questionText = 'First Name';
    const { getByTestId, queryByTestId, rerender, debug } = render(
      <FieldLabel name={questionText} tooltip={tooltip} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${questionText}`);

    const tooltipIcon = getByTestId('field-tooltip-icon');
    expect(tooltipIcon).toBeDefined();
    act(() => {
      fireEvent.press(tooltipIcon);
    });
    rerender(<FieldLabel name={questionText} tooltip={tooltip} />);

    const tooltipText = queryByTestId('field-tooltip-text');
    expect(tooltipText).toBeDefined();
    expect(tooltipText.props.children).toBe(tooltip.text);
  });

  it('should translate tooltip text', () => {
    const enTooltip = 'Please mention the available options';
    const idTooltip = 'Harap sebutkan opsi yang tersedia';
    const tooltip = {
      text: enTooltip,
      translations: [
        {
          language: 'id',
          text: idTooltip,
        },
      ],
    };
    const enText = 'Favorite food';
    const idText = 'Makanan favorit';
    const translations = [
      {
        language: 'id',
        text: idText,
      },
    ];

    const targetLang = 'id';

    const { getByTestId, queryByTestId, rerender, debug } = render(
      <FieldLabel lang={targetLang} name={enText} tooltip={tooltip} translations={translations} />,
    );

    const labelElement = getByTestId('field-label');
    expect(labelElement.props.children).toBe(`1. ${idText}`);

    const tooltipIcon = getByTestId('field-tooltip-icon');
    expect(tooltipIcon).toBeDefined();
    act(() => {
      fireEvent.press(tooltipIcon);
    });
    rerender(
      <FieldLabel lang={targetLang} name={enText} tooltip={tooltip} translations={translations} />,
    );

    const tooltipText = queryByTestId('field-tooltip-text');
    expect(tooltipText).toBeDefined();
    expect(tooltipText.props.children).toBe(idTooltip);
  });

  it('should not show required sign if requiredSign param is null', () => {
    const wrapper = render(<FieldLabel keyform={0} name="Question Name" />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should show required sign if requiredSign param is not null', () => {
    const wrapper = render(<FieldLabel keyform={0} name="Question Name" requiredSign="*" />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
  });

  it('should show custom required sign', () => {
    const wrapper = render(<FieldLabel keyform={0} name="Question Name" requiredSign="**" />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
    expect(requiredIcon.props.children).toEqual('**');
  });
});
