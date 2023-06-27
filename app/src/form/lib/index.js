import * as Yup from 'yup';

const intersection = (array1, array2, from = '') => {
  console.log(array1, array2, from);
  const set1 = new Set(array1);
  const result = [];
  for (const item of array2) {
    if (set1.has(item)) {
      result.push(item);
    }
  }
  return result;
};

const getDependencyAncestors = (questions, current, dependencies) => {
  const ids = dependencies.map((x) => x.id);
  const ancestors = questions.filter((q) => ids.includes(q.id)).filter((q) => q?.dependency);
  if (ancestors.length) {
    dependencies = ancestors.map((x) => x.dependency);
    current = [current, ...dependencies].flatMap((x) => x);
    ancestors.forEach((a) => {
      if (a?.dependency) {
        current = getDependencyAncestors(questions, current, a.dependency);
      }
    });
  }
  return current;
};

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

  const transformed = questions.map((x) => {
    if (x?.dependency) {
      return {
        ...x,
        dependency: getDependencyAncestors(questions, x.dependency, x.dependency),
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
              return transformed.find((t) => t.id === q.id);
            }),
        };
      }),
  };
};

export const modifyDependency = ({ question }, { dependency }, repeat) => {
  const questions = question.map((q) => q.id);
  return dependency.map((d) => {
    if (questions.includes(d.id) && repeat) {
      return { ...d, id: `${d.id}-${repeat}` };
    }
    return d;
  });
};

export const validateDependency = (dependency, value) => {
  if (dependency?.options && typeof value !== 'undefined') {
    if (typeof value === 'string') {
      value = [value];
    }
    return intersection(dependency.options, value)?.length > 0;
  }
  let valid = false;
  if (dependency?.min) {
    valid = value >= dependency.min;
  }
  if (dependency?.max) {
    valid = value <= dependency.max;
  }
  if (dependency?.equal) {
    valid = value === dependency.equal;
  }
  if (dependency?.notEqual) {
    valid = value !== dependency.notEqual && !!value;
  }
  return valid;
};

export const generateValidationSchema = (forms) => {
  const questions = forms?.question_group
    ?.map((qg) => {
      const qs = qg.question.map((q) => {
        return {
          ...q,
          group: qg,
        };
      });
      return qs;
    })
    .flat();
  // TODO:: Validation for dependency question not supported yet
  // TODO:: Check for chaining dependency
  const schema = Yup.object().shape(
    questions.reduce((res, curr) => {
      const { id, name, type, required, rule, group, dependency } = curr;
      const requiredError = `${name} is required.`;
      let yupType;
      switch (type) {
        case 'number':
          // number rules
          yupType = Yup.number();
          if (rule?.min) {
            yupType = yupType.min(rule.min);
          }
          if (rule?.max) {
            yupType = yupType.max(rule.max);
          }
          if (!rule?.allowDecimal) {
            // by default decimal is allowed
            yupType = yupType.integer();
          }
          break;
        case 'date':
          yupType = Yup.date();
          break;
        case 'option':
          yupType = Yup.array();
          break;
        case 'multiple_option':
          yupType = Yup.array();
          break;
        default:
          yupType = Yup.string();
          break;
      }
      // dependency & required check
      let yupRule = yupType;
      if (required && dependency && dependency?.length) {
        const repeat = 0;
        const modifiedDependency = modifyDependency(group, curr, repeat);
        modifiedDependency.forEach(({ id, options }) => {
          yupRule = yupRule.when(`${id}`, {
            is: (value) => intersection(value, options, '-----4444'),
            then: yupType.required(requiredError),
          });
        });
      } else if (required) {
        yupRule = yupRule.required(requiredError);
      }
      return {
        ...res,
        [id]: yupRule,
      };
    }, {}),
  );
  return schema;
};

export const generateValidationSchemaFieldLevel = (currentValue, field) => {
  const { id, name, type, required, rule } = field;
  let yupType;
  switch (type) {
    case 'number':
      // number rules
      yupType = Yup.number();
      if (rule?.min) {
        yupType = yupType.min(rule.min);
      }
      if (rule?.max) {
        yupType = yupType.max(rule.max);
      }
      if (!rule?.allowDecimal) {
        // by default decimal is allowed
        yupType = yupType.integer();
      }
      break;
    case 'date':
      yupType = Yup.date();
      break;
    case 'option':
      yupType = Yup.array();
      break;
    case 'multiple_option':
      yupType = Yup.array();
      break;
    default:
      yupType = Yup.string();
      break;
  }
  if (required) {
    const requiredError = `${name} is required.`;
    yupType = yupType.required(requiredError);
  } else {
    yupType = yupType.notRequired();
  }
  try {
    yupType.validateSync(currentValue);
  } catch (error) {
    return error.message;
  }
};
