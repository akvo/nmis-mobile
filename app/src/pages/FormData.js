import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components';
import { Button } from '@rneui/themed';
import { UserState } from '../store';
import { crudDataPoints } from '../database/crud';
import Icon from 'react-native-vector-icons/Ionicons';

const FormData = ({ navigation, route }) => {
  const formId = route?.params?.id;
  const showSubmitted = route?.params?.showSubmitted || false;
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
      let subtitlesTemp = [`Created: ${createdAt}`, `Survey Duration: ${res.duration}`];
      if (showSubmitted) {
        subtitlesTemp = [...subtitlesTemp, `Sync: ${syncedAt}`];
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
        placeholder: 'Search datapoint',
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
