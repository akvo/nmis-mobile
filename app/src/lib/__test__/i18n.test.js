import i18n from '../i18n';

describe('i18n library', () => {
  it('should translate options correctly', () => {
    const data = [
      { name: 'male', label: 'Male', translations: [{ language: 'id', name: 'Laki-laki' }] },
      { name: 'female', label: 'Female', translations: [{ language: 'id', name: 'Perempuan' }] },
    ];
    const expected = [
      { name: 'male', label: 'Laki-laki', translations: [{ language: 'id', name: 'Laki-laki' }] },
      { name: 'female', label: 'Perempuan', translations: [{ language: 'id', name: 'Perempuan' }] },
    ];

    const activeLang = 'id';
    const result = i18n.options(activeLang, data);

    expect(result).toEqual(expected);
  });

  it('should fallback to default language when lang is invalid', () => {
    const data = [
      { name: 'male', label: 'Male', translations: [{ language: 'id', name: 'Laki-laki' }] },
      { name: 'female', label: 'Female', translations: [{ language: 'id', name: 'Perempuan' }] },
    ];

    const activeLang = 'fr';
    const result = i18n.options(activeLang, data);

    expect(result).toEqual(data);
  });

  it('should fallback to default language when translations is not available', () => {
    const data = [
      { name: 'male', label: 'Male' },
      { name: 'female', label: 'Female' },
    ];
    const activeLang = 'id';
    const result = i18n.options(activeLang, data);

    expect(result).toEqual(data);
  });

  it('should return undefiend when the option has invalid props', () => {
    let data = [{ translations: [{ language: 'fr' }] }, { translations: [{ language: 'nl' }] }];
    const expected = [
      { label: undefined, translations: [{ language: 'fr' }] },
      { label: undefined, translations: [{ language: 'nl' }] },
    ];

    const activeLang = 'id';
    const result1 = i18n.options(activeLang, data);

    expect(result1).toEqual(expected);

    data = [null];

    const result2 = i18n.options(activeLang, data);
    expect(result2).toEqual(data);
  });
});
