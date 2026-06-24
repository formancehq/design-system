import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetRawArgs() {
  return (
    <div className="w-full">
      {/*
       * `rawArgs` appends extra flags to the generated command. Flags are
       * tool-specific, so scope the example to the matching tab — here
       * `--fail-with-body` is curl-only (it makes curl surface error responses).
       */}
      <ApiSnippet
        operation="v2CreateTransaction"
        params={{ ledger: 'testing' }}
        body={{
          script: {
            plain: 'send [USD/2 100] (source = @world allocating to @alice)',
          },
        }}
        rawArgs="--fail-with-body"
        tabs={['curl']}
      />
    </div>
  );
}
