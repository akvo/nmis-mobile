import React from 'react';
import { BaseLayout } from '../components';
import { api } from '../lib';
import { AuthState, UIState, FormState } from '../store';
import { crudForms, crudSessions } from '../database/crud';
// import { bgTask } from '../lib';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const TASK_NAME = 'sync-form-version';

const syncFormVersion = async () => {
  try {
    // find last session
    const session = await crudSessions.selectLastSession();
    console.log('[bgTask]', session);
    if (!session) {
      return;
    }
    const authenticationCode = session.passcode;
    const data = new FormData();
    data.append('code', authenticationCode);
    api
      .post('/auth', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(async (res) => {
        const { data } = res;
        data.formsUrl.forEach(async (form) => {
          const formExist = await crudForms.selectFormByIdAndVersion({ ...form });
          if (formExist) {
            // skip
            console.info('[bgTask]Form exist:', form.id);
            return;
          }
          const formRes = await api.get(form.url);
          // update previous form latest value to 0
          const updatedForm = await crudForms.updateForm({ ...form });
          console.info('[bgTask]Updated Forms...', form.id, updatedForm);
          const savedForm = await crudForms.addForm({ ...form, formJSON: formRes?.data });
          console.info('[bgTask]Saved Forms...', form.id, savedForm);
        });
      });
  } catch (err) {
    console.error('sycnFormVersion failed:', err);
  }
};

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    syncFormVersion();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error('define task manager failed:', err);
    return BackgroundFetch.Result.Failed;
  }
});

const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 0.5 * 60, // in minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  } catch (err) {
    console.error('Task Register failed:', err);
  }
};

const unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  } catch (err) {
    console.error('Task Unregister failed:', err);
  }
};

const Home = ({ navigation }) => {
  const isOnline = UIState.useState((s) => s.online);
  const authenticationCode = AuthState.useState((s) => s.authenticationCode);
  const [search, setSearch] = React.useState(null);
  const [data, setData] = React.useState([]);

  const goToManageForm = (id) => {
    const findData = data.find((d) => d?.id === id);
    FormState.update((s) => {
      s.form = findData;
    });
    setTimeout(() => {
      navigation.navigate('ManageForm', { id: id, name: findData.name });
    }, 100);
  };

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    console.log('BackgroundTask Status', status, isRegistered);
    if (BackgroundFetch.BackgroundFetchStatus?.[status] === 'Available' && !isRegistered) {
      await registerBackgroundTask();
    }
    console.log('BackgroundTask Status', status, isRegistered);
  };

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  React.useState(() => {
    crudForms.selectLatestFormVersion().then((results) => {
      const forms = results.map((r) => ({
        ...r,
        subtitles: ['Submitted: 20', 'Draft: 1', 'Synced: 11'],
      }));
      setData(forms);
    });
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [data]);

  return (
    <BaseLayout
      title="Form Lists"
      search={{
        show: true,
        placeholder: 'Search form',
        value: search,
        action: setSearch,
      }}
    >
      <BaseLayout.Content data={filteredData} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
