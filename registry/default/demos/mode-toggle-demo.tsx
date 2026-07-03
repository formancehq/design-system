'use client';

import { useState } from 'react';

import {
  ModeToggle,
  type TTheme,
} from '@/registry/default/ui-fragments/mode-toggle';

export default function ModeToggleDemo() {
  const [theme, setTheme] = useState<TTheme>('light');

  return <ModeToggle theme={theme} setTheme={setTheme} />;
}
