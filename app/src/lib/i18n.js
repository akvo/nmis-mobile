const options = (lang, data) =>
  data.map((d) => {
    const { translations: transOption, label: labelText, name: nameText } = d || {};
    if (transOption) {
      const ft = transOption.find((t) => t?.language === lang);
      return {
        ...d,
        label: ft?.name || labelText || nameText,
      };
    }
    return d;
  });

const i18n = {
  options,
};

export default i18n;
