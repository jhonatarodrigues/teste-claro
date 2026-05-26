import { fireEvent, render } from '@testing-library/react-native';

import { DatePickerField } from '../DatePickerField';

describe('DatePickerField', () => {
  it('opens the native picker directly and updates the selected date', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<DatePickerField value="" onChange={onChange} />);

    fireEvent.press(getByTestId('due-date-field-trigger'));
    expect(getByTestId('due-date-picker-container')).toBeTruthy();
    fireEvent(getByTestId('due-date-picker-native'), 'onChange', {}, new Date(2026, 4, 26));

    expect(onChange).toHaveBeenCalledWith('2026-05-26');
  });

  it('clears the selected date', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<DatePickerField value="2026-05-26" onChange={onChange} />);

    fireEvent.press(getByTestId('due-date-field-trigger'));
    fireEvent.press(getByTestId('due-date-clear-action'));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
