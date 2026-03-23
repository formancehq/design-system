'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Check, Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/registry/default/ui/card';
import { Checkbox } from '@/registry/default/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/registry/default/ui/field';
import { Input } from '@/registry/default/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/registry/default/ui/input-group';
import { InputPassword } from '@/registry/default/ui/input-password';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import {
  RadioGroupCard,
  RadioGroupCardItem,
} from '@/registry/default/ui/radio-group-card';
import {
  RadioGroupStacked,
  RadioGroupStackedItem,
} from '@/registry/default/ui/radio-group-stacked';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import { Switch } from '@/registry/default/ui/switch';
import { Textarea } from '@/registry/default/ui/textarea';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  maxConnections: z.coerce.number().min(1).max(1000),
  duration: z.coerce.number().min(5).max(30),
  description: z.string().optional(),
  enableFeature: z.boolean(),
  enableRls: z.boolean(),
  enableNotifications: z.boolean(),
  enableAnalytics: z.boolean(),
  region: z.string().min(1, 'Region is required'),
  schemas: z.array(z.string()).min(1, 'At least one schema is required'),
  queueType: z.enum(['basic', 'partitioned']),
  module: z.string(),
  expiryDate: z.date().optional(),
  redirectUris: z.array(z.object({ value: z.string().url('Must be a valid URL') })),
});

type TFormValues = z.infer<typeof formSchema>;

const fakeApiKey = 'sk_live_51H3x4mpl3_4nd_53cur3_k3y_1234567890';

export default function FormPatternsDemo() {
  const [date, setDate] = useState<Date>();
  const [schemas, setSchemas] = useState<string[]>(['public']);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const form = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'my-project',
      password: 'supersecret',
      maxConnections: 10,
      duration: 10,
      description: '',
      enableFeature: false,
      enableRls: true,
      enableNotifications: false,
      enableAnalytics: true,
      region: '',
      schemas: ['public'],
      queueType: 'basic',
      module: 'ledger',
      expiryDate: undefined,
      redirectUris: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'redirectUris',
  });

  const onSubmit = (data: TFormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <Card>
        {/* Text Input */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Text Input
              <FieldDescription>
                Single-line text entry for short values.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input {...form.register('name')} placeholder="Enter text" />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Password Input */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Password Input
              <FieldDescription>
                Masked input for secure text entry.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <InputPassword
                {...form.register('password')}
                placeholder="Enter password"
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Secret Input */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Secret Input
              <FieldDescription>
                Read-only secret with visibility toggle and copy.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <InputPassword
                readOnly
                value={fakeApiKey}
              />
            </FieldContent>
          </Field>
        </CardContent>

        {/* Copyable Input */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Copyable Input
              <FieldDescription>
                Read-only input with copy-to-clipboard.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  readOnly
                  value={fakeApiKey}
                  className="font-mono text-xs"
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Number Input */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Number Input
              <FieldDescription>
                Numeric input with min/max validation.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input
                {...form.register('maxConnections')}
                type="number"
                min={1}
                max={1000}
              />
            </FieldContent>
          </Field>
        </CardContent>

        {/* Input with Units */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Input with Units
              <FieldDescription>
                Input with additional unit label.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  {...form.register('duration')}
                  type="number"
                  min={5}
                  max={30}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>MB</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Textarea */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Textarea
              <FieldDescription>
                Multi-line text input for longer content.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Textarea
                {...form.register('description')}
                rows={4}
                placeholder="Enter multi-line text"
                className="resize-none"
              />
            </FieldContent>
          </Field>
        </CardContent>

        {/* Switch */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Switch
              <FieldDescription>
                Toggle for boolean on/off states.
              </FieldDescription>
            </FieldLabel>
            <Switch
              checked={form.watch('enableFeature')}
              onCheckedChange={(v) =>
                form.setValue('enableFeature', v === true, { shouldDirty: true })
              }
            />
          </Field>
        </CardContent>

        {/* Checkbox */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Checkbox
              <FieldDescription>
                Boolean values or multiple selections.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enable-rls"
                    checked={form.watch('enableRls')}
                    onCheckedChange={(v) =>
                      form.setValue('enableRls', v === true, { shouldDirty: true })
                    }
                  />
                  <label htmlFor="enable-rls" className="text-sm cursor-pointer">
                    Enable Row Level Security
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enable-notifications"
                    checked={form.watch('enableNotifications')}
                    onCheckedChange={(v) =>
                      form.setValue('enableNotifications', v === true, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <label
                    htmlFor="enable-notifications"
                    className="text-sm cursor-pointer"
                  >
                    Enable email notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enable-analytics"
                    checked={form.watch('enableAnalytics')}
                    onCheckedChange={(v) =>
                      form.setValue('enableAnalytics', v === true, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <label
                    htmlFor="enable-analytics"
                    className="text-sm cursor-pointer"
                  >
                    Enable analytics tracking
                  </label>
                </div>
              </div>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Select */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Select (Dropdown)
              <FieldDescription>
                Single selection from a list of options.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Select
                value={form.watch('region')}
                onValueChange={(v) =>
                  form.setValue('region', v, { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">EU West (Paris)</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Multi-Select */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Multi-Select
              <FieldDescription>
                Multiple selection from a list.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <MultiSelect
                values={schemas}
                onValuesChange={(v) => {
                  setSchemas(v);
                  form.setValue('schemas', v, { shouldDirty: true });
                }}
              >
                <MultiSelectTrigger>
                  <MultiSelectValue placeholder="Select schemas..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectItem value="public">public</MultiSelectItem>
                  <MultiSelectItem value="auth">auth</MultiSelectItem>
                  <MultiSelectItem value="storage">storage</MultiSelectItem>
                </MultiSelectContent>
              </MultiSelect>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Radio Group Stacked */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Radio Group Stacked
              <FieldDescription>
                Stacked selection with labels and descriptions.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <RadioGroupStacked
                value={form.watch('queueType')}
                onValueChange={(v) =>
                  form.setValue('queueType', v as 'basic' | 'partitioned', {
                    shouldDirty: true,
                  })
                }
              >
                <RadioGroupStackedItem
                  value="basic"
                  label="Option 1"
                  description="First option description"
                />
                <RadioGroupStackedItem
                  value="partitioned"
                  label="Option 2"
                  description="Second option description"
                />
              </RadioGroupStacked>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Radio Group Card */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Radio Group Card
              <FieldDescription>
                Card-style selection for visual options.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <RadioGroupCard
                value={form.watch('module')}
                onValueChange={(v) =>
                  form.setValue('module', v, { shouldDirty: true })
                }
                className="flex flex-wrap gap-3"
              >
                <RadioGroupCardItem value="ledger" label="Ledger" />
                <RadioGroupCardItem value="payments" label="Payments" />
                <RadioGroupCardItem value="wallets" label="Wallets" />
              </RadioGroupCard>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Date Picker */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Date Picker
              <FieldDescription>
                Date selection with calendar popover.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? formatDate(date) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      form.setValue('expiryDate', d, { shouldDirty: true });
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Field Array */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Field Array
              <FieldDescription>
                Dynamic list for adding/removing items.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <div className="space-y-2 w-full">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...form.register(`redirectUris.${index}.value`)}
                      placeholder="https://example.com/callback"
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-md"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="mr-2 size-4" />
                  Add redirect URI
                </Button>
              </div>
            </FieldContent>
          </Field>
        </CardContent>

        {/* Action Field */}
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel>
              Action Field
              <FieldDescription>
                Button or link for navigation or performable actions.
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm">
                  <ExternalLink className="mr-2 size-4" />
                  View documentation
                </Button>
                <Button type="button" variant="outline" size="sm">
                  Reset API key
                </Button>
              </div>
            </FieldContent>
          </Field>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          {form.formState.isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!form.formState.isDirty}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
