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
        {
          id: 5,
          name: 'Comment',
          order: 5,
          type: 'text',
          required: false,
          meta: false,
          translations: [
            {
              name: 'Komentar',
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

const QuestionGroupListItem = ({ name, active, completedQuestionGroup: completed = false }) => {
  mockQuestionGroupListItem(name, active, completed);
  const icon = completed ? 'checked' : 'unchecked';
  const bgColor = completed ? 'blue' : 'gray';
  return (
    <mock-questionGroupListItem>
      <i testID="icon-mark" style={{ backgroundColor: bgColor }} className={icon} />
      <div>{name}</div>
    </mock-questionGroupListItem>
  );
};

const QuestionGroupList = ({ form, values = {}, activeQuestionGroup }) => {
  const completedQuestionGroup = form.question_group.map((questionGroup) => {
    const filteredQuestions = questionGroup.question.filter((q) => q.required);
    return (
      filteredQuestions
        .map((question) => {
          if (values?.[question.id]) {
            return true;
          }
          return false;
        })
        .filter((x) => x).length === filteredQuestions.length
    );
  });

  mockQuestionGroupList(form, values, activeQuestionGroup, completedQuestionGroup);
  return (
    <mock-questionGroupList>
      <div testID="form-name">{form.name}</div>
      {form.question_group.map((questionGroup, qx) => (
        <QuestionGroupListItem
          key={questionGroup.id}
          name={questionGroup.name}
          active={activeQuestionGroup === questionGroup.id}
          completedQuestionGroup={completedQuestionGroup[qx]}
        />
      ))}
    </mock-questionGroupList>
  );
};

describe('QuestionGroupList', () => {
  it('Should read form title', () => {
    const wrapper = render(<QuestionGroupList form={example} activeQuestionGroup={1} />);
    expect(wrapper.getByTestId('form-name').children[0]).toBe(example.name);
  });

  it('Should read form json', () => {
    render(<QuestionGroupList form={example} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList.mock.calls[0][0]).toEqual(example);
  });

  it.todo('Should read datapoint name');

  it('Should read formik values', () => {
    render(<QuestionGroupList form={example} values={{ 1: 'Galih' }} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList.mock.calls[0][1]).toEqual({ 1: 'Galih' });
  });

  it('Should return boolean if completed/not', () => {
    render(<QuestionGroupList form={example} values={{ 1: 'Galih' }} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList).toHaveBeenCalledWith(example, { 1: 'Galih' }, 1, [
      true,
      false,
      false,
    ]);
  });

  it.todo('Should render question group name');

  it('Should have a active mark if completed', () => {
    render(<QuestionGroupList form={example} values={{ 1: 'Galih' }} activeQuestionGroup={1} />);
    expect(mockQuestionGroupList).toHaveBeenCalledWith(example, { 1: 'Galih' }, 1, [
      true,
      false,
      false,
    ]);
    expect(mockQuestionGroupListItem.mock.calls).toEqual([
      ['Group 1', true, true],
      ['Group 2', false, false],
      ['Group 3', false, false],
    ]);
    const active = true;
    const completed = true;
    const wrapper = render(
      <QuestionGroupListItem name="Group 1" active={active} completedQuestionGroup={completed} />,
    );
    const iconEl = wrapper.getByTestId('icon-mark');

    expect(iconEl.props.style.backgroundColor).toBe('blue');
    expect(iconEl.props.className).toBe('checked');
  });

  it('Should have disabled mark if not completed', () => {
    const active = true;
    const completed = false;
    const wrapper = render(
      <QuestionGroupListItem name="Group 1" active={active} completedQuestionGroup={completed} />,
    );
    const iconEl = wrapper.getByTestId('icon-mark');

    expect(iconEl.props.style.backgroundColor).toBe('gray');
    expect(iconEl.props.className).toBe('unchecked');
  });

  it.todo('Should disable question group if not completed');
  it.todo('Should highlight question group if active');

  it.failing(
    'Should failing when only one question answered from two requred questions in a question group',
    () => {
      const values = {
        2: new Date().toISOString(),
      };
      render(<QuestionGroupList form={example} values={values} activeQuestionGroup={2} />);
      expect(mockQuestionGroupList).toHaveBeenCalledWith(example, values, 2, [false, true, false]);
    },
  );

  it('Should check two requred questions in a question group', () => {
    const values = {
      2: new Date().toISOString(),
      3: '20',
    };
    render(<QuestionGroupList form={example} values={values} activeQuestionGroup={2} />);
    expect(mockQuestionGroupList).toHaveBeenCalledWith(example, values, 2, [false, true, false]);
  });

  it('Should ignore not required questions', () => {
    render(<QuestionGroupList form={example} values={{ 4: ['Male'] }} activeQuestionGroup={3} />);
    expect(mockQuestionGroupList).toHaveBeenCalledWith(example, { 4: ['Male'] }, 3, [
      false,
      false,
      true,
    ]);
  });
});
