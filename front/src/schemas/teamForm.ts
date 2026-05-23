import { z } from 'zod';

export const teamFormSchema = z.object({
  name: z.string().min(3, 'Informe o nome do time com pelo menos 3 caracteres'),
  colorHex: z.string().regex(/^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i, 'Informe uma cor HEX valida'),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
