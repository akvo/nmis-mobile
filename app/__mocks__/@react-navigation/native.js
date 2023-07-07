import React from 'react';

export const useNavigation = jest.fn().mockReturnValue({
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(false),
  setParams: jest.fn(),
});

export const useNavigationContainerRef = jest.fn().mockReturnValue({
  navigate: jest.fn(),
});

export const route = {
  params: {},
};

export const useRoute = () => route;

export const MockNavigationProvider = ({ children }) => <React.Fragment>{children}</React.Fragment>;
export const NavigationContainer = ({ children }) => <React.Fragment>{children}</React.Fragment>;
