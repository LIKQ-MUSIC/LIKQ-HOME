'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo
} from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 font-sarabun'
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
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-700 bg-zinc-900">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('bold')
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('italic')
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <Italic size={18} />
        </button>

        <div className="w-px bg-zinc-700 mx-1" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <Heading1 size={18} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <Heading2 size={18} />
        </button>

        <div className="w-px bg-zinc-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('bulletList')
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <List size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-zinc-800 ${
            editor.isActive('orderedList')
              ? 'bg-zinc-800 text-indigo-400'
              : 'text-zinc-400'
          }`}
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px bg-zinc-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
        >
          <Undo size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Editor */}
      <div className="bg-zinc-950 text-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
