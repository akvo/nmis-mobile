import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components';
import { crudDataPoints } from '../database/crud';

const FormData = ({ navigation, route }) => {
  const formId = route?.params?.id;
  const showSubmitted = route?.params?.showSubmitted || false;
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const submitted = showSubmitted ? 1 : 0;
    let results = await crudDataPoints.selectDataPointsByFormAndSubmitted({
      form: formId,
      submitted,
    });
    results = results.map((res) => {
      const createdAt = new Date(res.createdAt).toLocaleDateString('en-GB');
      const syncedAt = res.syncedAt ? new Date(res.syncedAt).toLocaleDateString('en-GB') : '-';
      return {
        ...res,
        subtitles: [
          `Created: ${createdAt}`,
          `Survey Duration: ${res.duration}`,
          `Sync: ${syncedAt}`,
        ],
      };
    });
    setData(results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BaseLayout
      title={route?.params?.name}
      search={{
        show: true,
        placeholder: 'Search datapoint',
      }}
    >
      <BaseLayout.Content data={data} />
    </BaseLayout>
  );
};

export default FormData;
