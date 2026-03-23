'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardFooter } from '@/registry/default/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/registry/default/ui/field';
import { Input } from '@/registry/default/ui/input';
import { Textarea } from '@/registry/default/ui/textarea';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  apiKey: z
    .string()
    .min(16, 'API key must be at least 16 characters.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'API key can only contain letters, numbers, hyphens, and underscores.'
    ),
  notes: z.string().max(200, 'Notes cannot exceed 200 characters.').optional(),
});

type TFormValues = z.infer<typeof schema>;

export default function FormPatternsWithValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      apiKey: '',
      notes: '',
    },
  });

  const onSubmit = (data: TFormValues) => {
    console.log('Valid form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
      <Card>
        <CardContent>
          <Field
            orientation="horizontal"
            data-invalid={!!errors.name || undefined}
          >
            <FieldLabel>
              Name
              <FieldDescription>Your full name.</FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input {...register('name')} placeholder="John Doe" />
              <FieldError>{errors.name?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
        <CardContent>
          <Field
            orientation="horizontal"
            data-invalid={!!errors.email || undefined}
          >
            <FieldLabel>
              Email
              <FieldDescription>
                We&apos;ll use this for account recovery.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
        <CardContent>
          <Field
            orientation="horizontal"
            data-invalid={!!errors.apiKey || undefined}
          >
            <FieldLabel>
              API key
              <FieldDescription>
                Your secret key for programmatic access.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input {...register('apiKey')} placeholder="sk_live_..." />
              <FieldError>{errors.apiKey?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
        <CardContent>
          <Field
            orientation="horizontal"
            data-invalid={!!errors.notes || undefined}
          >
            <FieldLabel>
              Notes
              <FieldDescription>
                Optional notes (max 200 characters).
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Textarea
                {...register('notes')}
                placeholder="Any additional context..."
                rows={3}
              />
              <FieldError>{errors.notes?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
