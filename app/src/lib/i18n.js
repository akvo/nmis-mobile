const transform = (lang, data) => {
  const {
    translations: transOption,
    label: labelText,
    name: nameText,
    form: formText,
  } = data || {};
  if (transOption) {
    const ft = transOption.find((t) => t?.language === lang);
    if (formText && ft) {
      return {
        ...data,
        form: ft.name,
      };
    }
    if (labelText && ft) {
      return {
        ...data,
        label: ft.name,
      };
    }
    if (!labelText && nameText && ft) {
      return {
        ...data,
        name: ft.name,
      };
    }
  }
  return data;
};

const i18n = {
  transform,
};

export default i18n;