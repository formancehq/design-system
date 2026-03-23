'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardFooter } from '@/registry/default/ui/card';
import { Checkbox } from '@/registry/default/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/registry/default/ui/field';
import { Input } from '@/registry/default/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/registry/default/ui/input-group';
import {
  PageSection,
  PageSectionContent,
  PageSectionDescription,
  PageSectionMeta,
  PageSectionSummary,
  PageSectionTitle,
} from '@/registry/default/ui/page-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import { Switch } from '@/registry/default/ui/switch';
import { Textarea } from '@/registry/default/ui/textarea';

const schema = z.object({
  orgName: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  timezone: z.string(),
  maxPoolSize: z.coerce.number().min(1).max(100),
  emailNotifications: z.boolean(),
  webhookNotifications: z.boolean(),
  auditLog: z.boolean(),
});

type TFormValues = z.infer<typeof schema>;

export default function FormPatternsPageLayout() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orgName: 'Formance',
      slug: 'formance',
      description: '',
      timezone: 'utc',
      maxPoolSize: 10,
      emailNotifications: true,
      webhookNotifications: false,
      auditLog: true,
    },
  });

  const iconUploadRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [iconUrl, setIconUrl] = useState<string>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const emailNotifications = watch('emailNotifications');
  const webhookNotifications = watch('webhookNotifications');
  const auditLog = watch('auditLog');

  const onSubmit = (data: TFormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full divide-y">
      <PageSection>
        <PageSectionMeta>
          <PageSectionSummary>
            <PageSectionTitle>General</PageSectionTitle>
            <PageSectionDescription>
              Basic information about your organization.
            </PageSectionDescription>
          </PageSectionSummary>
        </PageSectionMeta>
        <PageSectionContent>
          <Card>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Organization name
                  <FieldDescription>
                    Your organization&apos;s display name.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <Input {...register('orgName')} />
                </FieldContent>
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Slug
                  <FieldDescription>
                    Used in URLs and API calls.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <Input {...register('slug')} />
                </FieldContent>
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Description
                  <FieldDescription>
                    A brief summary visible to team members.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    {...register('description')}
                    placeholder="What does this organization do?"
                    rows={3}
                  />
                </FieldContent>
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Timezone
                  <FieldDescription>
                    Default timezone for reports and schedules.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <Select
                    defaultValue="utc"
                    onValueChange={(v) =>
                      setValue('timezone', v, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="europe-paris">Europe/Paris</SelectItem>
                      <SelectItem value="america-new-york">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Max pool size
                  <FieldDescription>
                    Maximum number of database connections.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      {...register('maxPoolSize')}
                      type="number"
                      min={1}
                      max={100}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>conn</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FieldContent>
              </Field>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={!isDirty}
                onClick={() => reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </PageSectionContent>
      </PageSection>

      <PageSection>
        <PageSectionMeta>
          <PageSectionSummary>
            <PageSectionTitle>Notifications</PageSectionTitle>
            <PageSectionDescription>
              Configure how you receive alerts.
            </PageSectionDescription>
          </PageSectionSummary>
        </PageSectionMeta>
        <PageSectionContent>
          <Card>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Email notifications
                  <FieldDescription>
                    Get notified when transactions fail or require attention.
                  </FieldDescription>
                </FieldLabel>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(v) =>
                    setValue('emailNotifications', v === true, {
                      shouldDirty: true,
                    })
                  }
                />
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Webhook notifications
                  <FieldDescription>
                    Send events to your configured webhook endpoints.
                  </FieldDescription>
                </FieldLabel>
                <Switch
                  checked={webhookNotifications}
                  onCheckedChange={(v) =>
                    setValue('webhookNotifications', v === true, {
                      shouldDirty: true,
                    })
                  }
                />
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Audit logging
                  <FieldDescription>
                    Record all administrative actions for compliance.
                  </FieldDescription>
                </FieldLabel>
                <Checkbox
                  checked={auditLog}
                  onCheckedChange={(v) =>
                    setValue('auditLog', v === true, { shouldDirty: true })
                  }
                />
              </Field>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={!isDirty}
                onClick={() => reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </PageSectionContent>
      </PageSection>
      <PageSection>
        <PageSectionMeta>
          <PageSectionSummary>
            <PageSectionTitle>Uploads</PageSectionTitle>
            <PageSectionDescription>
              Branding assets and file attachments.
            </PageSectionDescription>
          </PageSectionSummary>
        </PageSectionMeta>
        <PageSectionContent>
          <Card>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Icon
                  <FieldDescription>
                    Avatar or logo displayed alongside your organization.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => iconUploadRef.current?.click()}
                      className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                      style={{
                        backgroundImage: iconUrl ? `url("${iconUrl}")` : 'none',
                        backgroundSize: 'cover',
                      }}
                    >
                      {!iconUrl && <Upload className="size-3.5" />}
                    </button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => iconUploadRef.current?.click()}
                      >
                        Upload
                      </Button>
                      {iconUrl && (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          type="button"
                          onClick={() => {
                            setIconUrl(undefined);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={iconUploadRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIconUrl(URL.createObjectURL(file));
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </FieldContent>
              </Field>
            </CardContent>
            <CardContent>
              <Field orientation="horizontal">
                <FieldLabel>
                  Attachments
                  <FieldDescription>
                    Drag and drop or browse to upload files.
                  </FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <div
                    className={cn(
                      'rounded-md border-2 border-dashed p-6 text-center transition-colors',
                      isDragging
                        ? 'border-ring bg-muted'
                        : 'border-border bg-muted/40'
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      setUploadedFiles((prev) => [
                        ...prev,
                        ...Array.from(e.dataTransfer.files),
                      ]);
                    }}
                  >
                    <input
                      type="file"
                      ref={fileUploadRef}
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setUploadedFiles((prev) => [
                            ...prev,
                            ...Array.from(e.target.files!),
                          ]);
                        }
                        e.target.value = '';
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="size-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {uploadedFiles.length > 0
                          ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} selected`
                          : 'Upload files'}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Drag and drop or{' '}
                        <button
                          type="button"
                          onClick={() => fileUploadRef.current?.click()}
                          className="cursor-pointer underline hover:text-foreground"
                        >
                          select files
                        </button>{' '}
                        to upload
                      </p>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 w-full space-y-1.5">
                          {uploadedFiles.map((file, idx) => (
                            <div
                              key={`${file.name}-${idx}`}
                              className="flex items-center justify-between gap-2 rounded-md border bg-background p-2"
                            >
                              <span className="truncate font-mono text-sm text-muted-foreground">
                                {file.name}
                              </span>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                type="button"
                                onClick={() =>
                                  setUploadedFiles((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </FieldContent>
              </Field>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={!isDirty}
                onClick={() => reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </PageSectionContent>
      </PageSection>
    </form>
  );
}
