export const config = [
  {
    id: 1,
    name: 'Server',
    description: 'URL, Username, Password',
    fields: [
      {
        id: 11,
        type: 'text',
        label: 'Server URL',
        name: 'serverURL',
        description: null,
        key: 'BuildParamsState.serverURL',
      },
      {
        id: 12,
        type: 'text',
        name: 'username',
        label: 'Username',
        description: null,
        key: 'AuthState.username',
      },
      {
        id: 13,
        type: 'password',
        name: 'password',
        label: 'Password',
        description: null,
        key: 'AuthState.password',
      },
      {
        id: 14,
        type: 'text',
        name: 'authenticationCode',
        label: 'Auth Code',
        description: null,
        key: 'AuthState.authenticationCode',
      },
      {
        id: 15,
        type: 'switch',
        name: 'useAuthenticationCode',
        label: 'Use Auth Code',
        description: 'Using authentication code',
        key: 'AuthState.useAuthenticationCode',
      },
    ],
  },
  {
    id: 2,
    name: 'User Interface',
    description: 'App Language, Theme, Font-size',
    fields: [
      {
        id: 21,
        type: 'dropdown',
        name: 'lang',
        label: 'Language',
        description: 'Application language',
        key: 'UIState.lang',
        options: [
          {
            label: 'English',
            value: 'en',
          },
          {
            label: 'French',
            value: 'fr',
          },
        ],
      },
      {
        id: 22,
        type: 'switch',
        name: 'isDarkMode',
        label: 'Dark mode',
        description: 'Switch theme to dark mode',
        key: 'UIState.isDarkMode',
      },
      {
        id: 23,
        type: 'slider',
        name: 'fontSize',
        label: 'Font size',
        description: null,
        key: 'UIState.fontSize',
        slider: {
          minimumValue: 12,
          maximumValue: 24,
          step: 4,
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Form Management',
    description: 'Sync interval, Sync method',
    fields: [
      {
        id: 31,
        type: 'number',
        name: 'syncInterval',
        label: 'Sync interval',
        description: 'Sync interval in minutes',
        key: 'UserState.syncInterval',
      },
      {
        id: 32,
        type: 'switch',
        label: 'Sync Wifi',
        name: 'syncWifiOnly',
        description: 'Sync Wifi only',
        key: 'UserState.syncWifiOnly',
      },
    ],
  },
];