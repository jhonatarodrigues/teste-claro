import { render, within } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Screen } from '../Screen';

describe('Screen', () => {
  it('keeps the header outside the scrollable area when scroll is enabled', () => {
    const { getByTestId, getByText } = render(
      <Screen scroll header={<Text>Fixed header</Text>}>
        <Text>Scrollable content</Text>
      </Screen>,
    );

    expect(getByText('Fixed header')).toBeTruthy();
    expect(within(getByTestId('screen-scroll')).queryByText('Fixed header')).toBeNull();
    expect(within(getByTestId('screen-scroll')).getByText('Scrollable content')).toBeTruthy();
  });
});
