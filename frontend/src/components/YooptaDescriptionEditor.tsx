import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { SlashCommandMenu } from '@yoopta/ui';

import { Bold, Italic } from '@yoopta/marks';

const plugins = [Paragraph, HeadingOne, HeadingTwo, HeadingThree, TodoList, BulletedList, NumberedList];
const marks = [Bold, Italic];

interface YooptaDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus: boolean;
}

const menuItems = [
  { id: 'Paragraph', title: 'Paragraph', description: 'Plain text' },
  { id: 'HeadingOne', title: 'Heading 1', description: 'Big heading' },
  { id: 'HeadingTwo', title: 'Heading 2', description: 'Medium heading' },
  { id: 'HeadingThree', title: 'Heading 3', description: 'Small heading' },
  { id: 'TodoList', title: 'Todo List', description: 'Todo list' },
  { id: 'BulletedList', title: 'Bulleted List', description: 'Bulleted list' },
  { id: 'NumberedList', title: 'Numbered List', description: 'Numbered list' },
]

export function YooptaDescriptionEditor({ value, onChange, placeholder, autoFocus }: YooptaDescriptionEditorProps) {
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
        plugins={plugins}
        marks={marks}
        editor={editor}
        value={valueObject}
        onChange={(value) => onChange?.(value ? JSON.stringify(value) : '')}
        placeholder={placeholder}
        autoFocus={autoFocus}>
        <SlashCommandMenu items={menuItems}>
          {({ items }) => (
            <SlashCommandMenu.Content>
              <SlashCommandMenu.List>
                {items.map((item) => (
                  <SlashCommandMenu.Item key={item.id} value={item.id} title={item.title} description={item.description} />
                ))}
              </SlashCommandMenu.List>
            </SlashCommandMenu.Content>
          )}
        </SlashCommandMenu>
      </YooptaEditor>
    </div>
  );
}