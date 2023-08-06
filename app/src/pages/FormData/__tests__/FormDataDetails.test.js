import React, { useState } from 'react';
import { render, renderHook, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { FormState } from '../../../store';
import FormDataNavigation from '../FormDataNavigation';
import FormDataDetails from '../FormDataDetails';
import { washInSchool, washInSchoolForm } from '../dummy-for-test-purpose';

const mockFormDataDetails = jest.fn();
jest.mock('../FormDataDetails', () => ({ formJSON, values, currentPage, setCurrentPage }) => {
  mockFormDataDetails(formJSON, values, currentPage, setCurrentPage);

  const form = formJSON ? JSON.parse(formJSON) : {};
  const currentGroup = form?.question_groups?.[currentPage] || [];
  const totalPage = form?.question_groups?.length || 0;
  const questions = currentGroup?.questions || [];
  const answers = values;

  return (
    <mock-View>
      {questions?.map((q, i) => (
        <mock-ListItem key={i} bottomDivider>
          <mock-ListItemContent>
            <mock-ListItemTitle testID={`text-question-${i}`}>{q.question}</mock-ListItemTitle>
            <mock-ListItemSubtitle>
              {q.type === 'geo' ? (
                <mock-View testID={`text-type-geo-${i}`}>
                  <mock-Text>Latitude: {answers?.[q.id]?.[0]}</mock-Text>
                  <mock-Text>Longitude: {answers?.[q.id]?.[1]}</mock-Text>
                </mock-View>
              ) : (
                <mock-Text testID={`text-answer-${i}`}>{answers?.[q.id] || q.id}</mock-Text>
              )}
            </mock-ListItemSubtitle>
          </mock-ListItemContent>
        </mock-ListItem>
      ))}

      <mock-FormDataNavigation>
        <mock-Text testID="text-pagination">
          {currentPage + 1}/{totalPage}
        </mock-Text>
      </mock-FormDataNavigation>
    </mock-View>
  );
});

describe('FormDataDetails', () => {
  beforeAll(() => {
    const { json: valuesJSON } = washInSchool;
    act(() => {
      FormState.update((s) => {
        s.form = {
          json: JSON.stringify(washInSchoolForm).replace(/'/g, "''"),
        };
        s.currentValues = JSON.parse(JSON.parse(valuesJSON));
      });
    });
  });

  it('should render correctly', () => {
    const { result: resultState } = renderHook(() => useState(0));
    const { result: resultForm } = renderHook(() => FormState.useState((s) => s.form));
    const { result: resultValues } = renderHook(() => FormState.useState((s) => s.currentValues));
    const [currentPage, setCurrentPage] = resultState.current;
    const { json: formJSON } = resultForm.current;
    const values = resultValues.current;

    const { getByTestId, debug } = render(
      <FormDataDetails
        formJSON={formJSON}
        values={values}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />,
    );

    const questionText = getByTestId('text-question-0');
    expect(questionText).toBeDefined();
    const answerText = getByTestId('text-answer-0');
    expect(answerText).toBeDefined();
  });
  it('should list changed when navigation clicked', () => {
    const { result: resultState } = renderHook(() => useState(0));
    const { result: resultForm } = renderHook(() => FormState.useState((s) => s.form));
    const { result: resultValues } = renderHook(() => FormState.useState((s) => s.currentValues));
    const [currentPage, setCurrentPage] = resultState.current;
    const { json: formJSON } = resultForm.current;
    const values = resultValues.current;

    const { getByTestId, rerender, debug } = render(
      <FormDataDetails
        formJSON={formJSON}
        values={values}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />,
    );

    act(() => {
      setCurrentPage(1);
    });

    rerender(
      <FormDataDetails
        formJSON={resultForm.current.json}
        values={resultValues.current}
        currentPage={resultState.current[0]}
        setCurrentPage={setCurrentPage}
      />,
    );

    const questionText = getByTestId('text-question-0');
    expect(questionText).toBeDefined();
    const answerText = getByTestId('text-answer-0');
    expect(answerText).toBeDefined();
    const paginationText = getByTestId('text-pagination');
    expect(paginationText).toBeDefined();
    expect(paginationText.props.children).toEqual([2, '/', 2]);
  });

  it('should match with snapshot', async () => {
    const mockNavigation = useNavigation();
    const mockRoute = {
      params: {
        name: 'Datapoint name',
      },
    };

    const tree = render(<FormDataDetails navigation={mockNavigation} route={mockRoute} />);
    await waitFor(() => expect(tree.toJSON()).toMatchSnapshot());
  });
});
