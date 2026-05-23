import { teamFormSchema } from '../teamForm';

describe('teamFormSchema', () => {
  it('accepts a valid name and a valid HEX color', () => {
    const result = teamFormSchema.safeParse({
      name: 'Blue Team',
      colorHex: '#22D3EE',
    });

    expect(result.success).toBe(true);
  });

  it('fails when the color is not in HEX format', () => {
    const result = teamFormSchema.safeParse({
      name: 'Blue Team',
      colorHex: 'blue',
    });

    expect(result.success).toBe(false);
  });
});
