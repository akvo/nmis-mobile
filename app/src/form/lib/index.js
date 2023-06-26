export const transformForm = (forms) => {
  const questions = forms?.question_group
    .map((x) => {
      return x.question;
    })
    .flatMap((x) => x)
    .map((x) => {
      if (x.type === 'option' || x.type === 'multiple_option') {
        const options = x.option.map((o) => ({ ...o, label: o.name }));
        return {
          ...x,
          option: options.sort((a, b) => a.order - b.order),
        };
      }
      return x;
    });

  return {
    ...forms,
    question_group: forms?.question_group
      ?.sort((a, b) => a.order - b.order)
      ?.map((qg) => {
        let repeat = {};
        let repeats = {};
        if (qg?.repeatable) {
          repeat = { repeat: 1 };
          repeats = { repeats: [0] };
        }
        return {
          ...qg,
          ...repeat,
          ...repeats,
          question: qg.question
            ?.sort((a, b) => a.order - b.order)
            ?.map((q) => {
              return questions.find((t) => t.id === q.id);
            }),
        };
      }),
  };
};
