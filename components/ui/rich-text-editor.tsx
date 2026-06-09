'use client'

import { forwardRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Underline, Strikethrough, ListOrdered, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const ToolbarButton = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <button
    type="button"
    title={title}
    disabled
    className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
)

const ToolbarDivider = () => <div className="w-px h-5 bg-border mx-1" />

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="border rounded-t-md bg-muted/40 px-2 py-1.5 flex items-center gap-0.5 flex-wrap">
          <ToolbarButton icon={Bold} title="加粗" />
          <ToolbarButton icon={Italic} title="斜体" />
          <ToolbarButton icon={Underline} title="下划线" />
          <ToolbarButton icon={Strikethrough} title="删除线" />
          <ToolbarDivider />
          <ToolbarButton icon={AlignLeft} title="左对齐" />
          <ToolbarButton icon={AlignCenter} title="居中" />
          <ToolbarButton icon={AlignRight} title="右对齐" />
          <ToolbarDivider />
          <ToolbarButton icon={ListOrdered} title="有序列表" />
          <ToolbarButton icon={List} title="无序列表" />
          <ToolbarDivider />
          <ToolbarButton icon={Link} title="插入链接" />
          <ToolbarButton icon={Image} title="插入图片" />
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={8}
          className="min-h-[180px] resize-y rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor
