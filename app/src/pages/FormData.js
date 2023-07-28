import React, { useState, useEffect } from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';

import { UserState } from '../store';
import { BaseLayout } from '../components';
import { crudDataPoints } from '../database/crud';
import { i18n } from '../lib';
import { UIState } from '../store';

const FormData = ({ navigation, route }) => {
  const formId = route?.params?.id;
  const showSubmitted = route?.params?.showSubmitted || false;
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);
  const activeUserId = UserState.useState((s) => s.id);

  const [data, setData] = useState([]);

  const goBack = () => {
    navigation.navigate('ManageForm', { ...route?.params });
  };

  const fetchData = async () => {
    const submitted = showSubmitted ? 1 : 0;
    let results = await crudDataPoints.selectDataPointsByFormAndSubmitted({
      form: formId,
      submitted,
      user: activeUserId,
    });
    results = results.map((res) => {
      const createdAt = new Date(res.createdAt).toLocaleDateString('en-GB');
      const syncedAt = res.syncedAt ? new Date(res.syncedAt).toLocaleDateString('en-GB') : '-';
      let subtitlesTemp = [
        `${trans.createdLabel}${createdAt}`,
        `${trans.surveyDurationLabel}${res.duration}`,
      ];
      if (showSubmitted) {
        subtitlesTemp = [...subtitlesTemp, `${trans.syncLabel}${syncedAt}`];
      }
      return {
        ...res,
        subtitles: subtitlesTemp,
      };
    });
    setData(results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormDataListAction = (id) => {
    if (showSubmitted) {
      return null;
    }
    return navigation.navigate('FormPage', {
      ...route?.params,
      dataPointId: id,
      newSubmission: false,
    });
  };

  return (
    <BaseLayout
      title={route?.params?.name}
      search={{
        show: true,
        placeholder: trans.formDataSearch,
      }}
      leftComponent={
        <Button type="clear" onPress={goBack} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
    >
      <BaseLayout.Content data={data} action={handleFormDataListAction} />
    </BaseLayout>
  );
};

export default FormData;
