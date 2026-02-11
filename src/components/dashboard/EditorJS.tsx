'use client'

import React, { useEffect, useRef } from 'react'
import type EditorJS from '@editorjs/editorjs'
import type { OutputData } from '@editorjs/editorjs'
import { apiClient } from '@/lib/api-client'

interface EditorJSProps {
  initialData?: OutputData
  onChange?: (data: OutputData) => void
  editorId?: string
}

const EditorJSComponent = ({
  initialData,
  onChange,
  editorId = 'editorjs'
}: EditorJSProps) => {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)

  // Store handlers in ref to access latest versions without re-initializing editor
  const handlers = useRef({ initialData, onChange })

  // Update handlers ref on every render
  useEffect(() => {
    handlers.current = { initialData, onChange }
  }, [initialData, onChange])

  useEffect(() => {
    if (!holderRef.current) return

    let isCancelled = false
    let editorInstance: EditorJS | null = null

    const initEditor = async () => {
      try {
        const EditorJSLib = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const List = (await import('@editorjs/list')).default
        const ImageTool = (await import('@editorjs/image')).default
        const Quote = (await import('@editorjs/quote')).default
        const CodeTool = (await import('@editorjs/code')).default
        const Delimiter = (await import('@editorjs/delimiter')).default
        const Embed = (await import('@editorjs/embed')).default

        if (isCancelled) return

        // Prevent double initialization if reference already exists
        if (editorRef.current) return

        const dataToUse = handlers.current.initialData

        const holder = holderRef.current
        if (!holder) return

        editorInstance = new EditorJSLib({
          holder: holder,
          data: dataToUse,
          placeholder: 'Start writing your blog post...',
          tools: {
            header: {
              class: Header as any,
              config: {
                levels: [1, 2, 3, 4],
                defaultLevel: 2
              }
            },
            list: {
              class: List as any,
              inlineToolbar: true
            },
            image: {
              class: ImageTool as any,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('folder', 'blogs')
                    const res = await apiClient.post('/media', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    return {
                      success: 1,
                      file: {
                        url: res.data.data.public_url
                      }
                    }
                  },
                  async uploadByUrl(url: string) {
                    return {
                      success: 1,
                      file: { url }
                    }
                  }
                }
              }
            },
            quote: {
              class: Quote as any,
              inlineToolbar: true
            },
            code: CodeTool as any,
            delimiter: Delimiter as any,
            embed: {
              class: Embed as any,
              config: {
                services: {
                  youtube: true,
                  vimeo: true,
                  soundcloud: true
                }
              }
            }
          },
          onChange: async api => {
            const data = await api.saver.save()
            // Always use the latest onChange handler
            handlers.current.onChange?.(data)
          }
        })

        await editorInstance.isReady

        if (isCancelled) {
          if (typeof editorInstance.destroy === 'function') {
            editorInstance.destroy()
          }
          return
        }

        editorRef.current = editorInstance
      } catch (error) {
        console.error('EditorJS initialization failed:', error)
      }
    }

    initEditor()

    return () => {
      isCancelled = true
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === 'function'
      ) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  return (
    <div
      id={editorId}
      ref={holderRef}
      className="min-h-[300px] prose prose-lg dark:prose-invert max-w-none
        bg-white dark:bg-[#1E293B] border border-[#e0e4ea] dark:border-[#334155] rounded-lg p-4
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
        prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:shadow-xl prose-pre:border prose-pre:border-slate-800
        [&_.ce-block__content]:max-w-none [&_.ce-toolbar__content]:max-w-none"
    />
  )
}

export default EditorJSComponent

export type { EditorJSProps }
