'use client'

import { useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  RemoveFormatting,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: number
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '请输入内容...',
  className = '',
  minHeight = 240,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const exec = useCallback((command: string, valueArg?: string) => {
    document.execCommand(command, false, valueArg)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  useEffect(() => {
    if (editorRef.current && !hasInitialized.current) {
      editorRef.current.innerHTML = value || `<p>${placeholder}</p>`
      hasInitialized.current = true
    }
  }, [placeholder])

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-gray-50/80">
        <ToolbarButton icon={<Bold className="h-3.5 w-3.5" />} onClick={() => exec('bold')} title="粗体" />
        <ToolbarButton icon={<Italic className="h-3.5 w-3.5" />} onClick={() => exec('italic')} title="斜体" />
        <ToolbarButton icon={<Underline className="h-3.5 w-3.5" />} onClick={() => exec('underline')} title="下划线" />
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <ToolbarButton icon={<Heading1 className="h-3.5 w-3.5" />} onClick={() => exec('formatBlock', 'H1')} title="标题1" />
        <ToolbarButton icon={<Heading2 className="h-3.5 w-3.5" />} onClick={() => exec('formatBlock', 'H2')} title="标题2" />
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <ToolbarButton icon={<List className="h-3.5 w-3.5" />} onClick={() => exec('insertUnorderedList')} title="无序列表" />
        <ToolbarButton icon={<ListOrdered className="h-3.5 w-3.5" />} onClick={() => exec('insertOrderedList')} title="有序列表" />
        <ToolbarButton icon={<Quote className="h-3.5 w-3.5" />} onClick={() => exec('formatBlock', 'BLOCKQUOTE')} title="引用" />
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <ToolbarButton icon={<AlignLeft className="h-3.5 w-3.5" />} onClick={() => exec('justifyLeft')} title="左对齐" />
        <ToolbarButton icon={<AlignCenter className="h-3.5 w-3.5" />} onClick={() => exec('justifyCenter')} title="居中" />
        <ToolbarButton icon={<AlignRight className="h-3.5 w-3.5" />} onClick={() => exec('justifyRight')} title="右对齐" />
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <ToolbarButton
          icon={<Link className="h-3.5 w-3.5" />}
          onClick={() => {
            const url = prompt('请输入链接地址')
            if (url) exec('createLink', url)
          }}
          title="插入链接"
        />
        <ToolbarButton icon={<RemoveFormatting className="h-3.5 w-3.5" />} onClick={() => exec('removeFormat')} title="清除格式" />
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="px-3 py-2.5 outline-none text-sm leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}

function ToolbarButton({
  icon,
  onClick,
  title,
}: {
  icon: React.ReactNode
  onClick: () => void
  title: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 hover:bg-gray-200/60"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
    >
      {icon}
    </Button>
  )
}
