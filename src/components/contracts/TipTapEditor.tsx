'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { Extension } from '@tiptap/core'

const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent('    ')
      }
    }
  }
})

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TabIndent],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose-sm max-w-none focus:outline-none min-h-[400px] font-sarabun text-black text-[14px] leading-snug prose-headings:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black prose-h1:text-lg prose-h1:font-bold prose-h1:mb-2 prose-h1:mt-3 prose-h2:text-base prose-h2:font-semibold prose-h2:mb-1 prose-h2:mt-2 prose-h3:text-[14px] prose-h3:font-semibold prose-h3:mb-1 prose-h3:mt-2 prose-p:leading-snug prose-p:mb-1 prose-p:text-[14px] prose-strong:text-black prose-strong:font-semibold prose-li:text-[14px] prose-li:mb-0.5'
      }
    },
    immediatelyRender: false
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <BubbleMenu
        editor={editor}
        className="flex overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl text-black"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('bold')
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('italic')
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <Italic size={16} />
        </button>

        <div className="w-px bg-zinc-200 mx-1 my-2" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('heading', { level: 1 })
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <Heading1 size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('heading', { level: 2 })
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('heading', { level: 3 })
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px bg-zinc-200 mx-1 my-2" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('bulletList')
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-zinc-100 ${
            editor.isActive('orderedList')
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-zinc-600'
          }`}
        >
          <ListOrdered size={16} />
        </button>
      </BubbleMenu>

      {/* Editor */}
      <div className="text-black">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
