'use client';

import { useState } from 'react';

import { InputPassword } from '@/registry/default/ui/input-password';

export default function InputPasswordDemo() {
  const [value, setValue] = useState('supersecret');

  return (
    <div className="w-full max-w-sm">
      <InputPassword
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter password"
      />
    </div>
  );
}
