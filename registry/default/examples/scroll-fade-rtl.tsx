const modules = [
  'السجل',
  'المدفوعات',
  'المحافظ',
  'التدفقات',
  'المطابقة',
  'الويب هوك',
  'المصادقة',
  'الاتصال',
  'الاستوديو',
  'وحدة التحكم',
];

export default function ScrollFadeRtl() {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden border" dir="rtl">
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-1.5 p-1.5">
          {modules.map((module) => (
            <div key={module} className="shrink-0 bg-muted px-3 py-2.5 text-sm">
              {module}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
