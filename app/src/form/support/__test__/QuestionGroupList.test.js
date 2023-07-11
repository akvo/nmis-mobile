import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
jest.useFakeTimers();

const example = {
  name: 'Testing Form',
  languages: ['en', 'id'],
  defaultLanguage: 'en',
  translations: [
    {
      name: 'Formulir untuk Testing',
      language: 'id',
    },
  ],
  question_group: [
    {
      id: 1,
      name: 'Group 1',
      order: 1,
      translations: [
        {
          name: 'Grup 1',
          language: 'id',
        },
      ],
      question: [
        {
          id: 1,
          name: 'Your Name',
          order: 1,
          type: 'input',
          required: true,
          meta: true,
          translations: [
            {
              name: 'Nama Anda',
              language: 'id',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Group 2',
      order: 2,
      translations: [
        {
          name: 'Grup 2',
          language: 'id',
        },
      ],
      question: [
        {
          id: 2,
          name: 'Birth Date',
          order: 2,
          type: 'date',
          required: true,
          translations: [
            {
              name: 'Tanggal Lahir',
              language: 'id',
            },
          ],
        },
        {
          id: 3,
          name: 'Age',
          order: 3,
          type: 'number',
          required: true,
          translations: [
            {
              name: 'Umur',
              language: 'id',
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Group 3',
      order: 3,
      translations: [
        {
          name: 'Grup 3',
          language: 'id',
        },
      ],
      question: [
        {
          id: 4,
          name: 'Gender',
          order: 4,
          type: 'option',
          required: true,
          option: [
            {
              id: 1,
              name: 'Male',
              order: 1,
            },
            {
              id: 2,
              name: 'Female',
              order: 2,
            },
          ],
          meta: false,
          translations: [
            {
              name: 'Jenis Kelamin',
              language: 'id',
            },
          ],
        },
      ],
    },
  ],
};

const mockQuestionGroupList = jest.fn();
const mockQuestionGroupListItem = jest.fn();

const QuestionGroupListItem = ({ name, active }) => {
  mockQuestionGroupListItem(name, active);
  return <mock-questionGroupListItem name={name} active={active} />;
};

const QuestionGroupList = ({ form, values, activeQuestionGroup }) => {
  const completedQuestionGroup = form.question_group.map((questionGroup) => {
    const completedQuestion = [];
    return (
      questionGroup.question
        .map((question) => {
          if (values?.[question.id]) {
            return true;
          }
          return false;
        })
        .filter((x) => x).length > 0
    );
  });

  mockQuestionGroupList(form, values, activeQuestionGroup, completedQuestionGroup);
  return (
    <mock-questionGroupList>
      <div testID="form-name">{form.name}</div>
      {form.question_group.map((questionGroup) => (
        <QuestionGroupListItem
          key={questionGroup.id}
          name={questionGroup.name}
          active={activeQuestionGroup === questionGroup.id}
        />
      ))}
    </mock-questionGroupList>
  );
};

describe('QuestionGroupList', () => {
  it('Should read form title', () => {
    const wrapper = render(
      <QuestionGroupList form={example} values={{}} activeQuestionGroup={1} />,
    );
    expect(wrapper.getByTestId('form-name').children[0]).toBe(example.name);
  });

  it('Should read form json', () => {
    render(<QuestionGroupList form={example} values={{ 1: 'Galih' }} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList.mock.calls[0][0]).toEqual(example);
    expect(mockQuestionGroupList).toHaveBeenCalledWith(example, { 1: 'Galih' }, 1, [
      true,
      false,
      false,
    ]);
  });

  it.todo('Should read datapoint name');

  it('Should read formik values', () => {
    render(<QuestionGroupList form={example} values={{ 1: 'Galih' }} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList.mock.calls[0][1]).toEqual({ 1: 'Galih' });
  });

  it('Should check if particular question id defined in formik values', () => {});

  it.todo('Should return boolean if completed/not');
  it.todo('Should render form name');
  it.todo('Should render question group name');
  it.todo('Should have a active mark if completed');
  it.todo('Should have disabled mark if not completed');
  it.todo('Should disable question group if not completed');
  it.todo('Should highlight question group if active');
});
