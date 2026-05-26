import { fireEvent, render } from '@testing-library/react-native';

import { AppDrawerContent } from '../AppDrawerContent';

jest.mock('@react-navigation/drawer', () => {
  return {
    DrawerContentScrollView: 'DrawerContentScrollView',
  };
});

const MockDrawerContentScrollView = 'DrawerContentScrollView' as any;

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

describe('AppDrawerContent', () => {
  it('navigates to the main routes from the drawer shortcuts', () => {
    const navigate = jest.fn();
    const closeDrawer = jest.fn();

    const { getByTestId } = render(
      <AppDrawerContent
        navigation={{ navigate, closeDrawer } as any}
        state={{ key: 'drawer', index: 0, routeNames: ['MainStack'], routes: [{ key: 'MainStack', name: 'MainStack' }], type: 'drawer', stale: false, history: [] } as any}
        descriptors={{} as any}
      />,
    );

    fireEvent.press(getByTestId('drawer-item-teams'));
    fireEvent.press(getByTestId('drawer-item-tasks'));
    fireEvent.press(getByTestId('drawer-item-team-form'));
    fireEvent.press(getByTestId('drawer-item-task-form'));

    expect(navigate).toHaveBeenNthCalledWith(1, 'MainStack', { screen: 'Teams' });
    expect(navigate).toHaveBeenNthCalledWith(2, 'MainStack', { screen: 'Tasks' });
    expect(navigate).toHaveBeenNthCalledWith(3, 'MainStack', { screen: 'TeamForm' });
    expect(navigate).toHaveBeenNthCalledWith(4, 'MainStack', { screen: 'TaskForm' });
    expect(closeDrawer).toHaveBeenCalledTimes(4);
  });

  it('adds extra top safe spacing to the drawer header', () => {
    const { UNSAFE_getByType } = render(
      <AppDrawerContent
        navigation={{ navigate: jest.fn(), closeDrawer: jest.fn() } as any}
        state={{ key: 'drawer', index: 0, routeNames: ['MainStack'], routes: [{ key: 'MainStack', name: 'MainStack' }], type: 'drawer', stale: false, history: [] } as any}
        descriptors={{} as any}
      />,
    );

    expect(UNSAFE_getByType(MockDrawerContentScrollView).props.contentContainerStyle).toMatchObject({
      paddingTop: 76,
    });
  });
});
