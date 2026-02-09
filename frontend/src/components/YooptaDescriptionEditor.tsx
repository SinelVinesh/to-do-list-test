import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';

import { Bold, Italic } from '@yoopta/marks';

const plugins = [Paragraph, HeadingOne, HeadingTwo, HeadingThree, TodoList, BulletedList, NumberedList];
const marks = [Bold, Italic];

interface YooptaDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus: boolean;
}

export function YooptaDescriptionEditor({ value, onChange, autoFocus }: YooptaDescriptionEditorProps) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const valueObject = useMemo(() => {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <div style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 4, padding: 4 }}>
      <YooptaEditor
        width={'100%'}
        plugins={plugins}
        marks={marks}
        editor={editor}
        value={valueObject}
        placeholder=''
        onChange={(value) => onChange?.(value ? JSON.stringify(value) : '')}
        autoFocus={autoFocus}>
      </YooptaEditor>
    </div>
  );
}