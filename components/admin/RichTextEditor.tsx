'use client'

import { useRef, useCallback } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }, [])

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', '<h2>')} title="Heading 2">H2</button>
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', '<h3>')} title="Heading 3">H3</button>
        <span className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => exec('bold')} title="Bold"><strong>B</strong></button>
        <button type="button" className="rte-btn" onClick={() => exec('italic')} title="Italic"><em>I</em></button>
        <button type="button" className="rte-btn" onClick={() => exec('underline')} title="Underline"><u>U</u></button>
        <span className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => exec('insertUnorderedList')} title="Bullet list">&bull; list</button>
        <button type="button" className="rte-btn" onClick={() => exec('insertOrderedList')} title="Numbered list">1. list</button>
        <span className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', '<blockquote>')} title="Quote">&ldquo;</button>
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', '<pre>')} title="Code block">&lt;/&gt;</button>
        <button type="button" className="rte-btn" onClick={() => {
          const url = prompt('Enter link URL:')
          if (url) exec('createLink', url)
        }} title="Insert link">link</button>
        <button type="button" className="rte-btn" onClick={() => exec('removeFormat')} title="Remove formatting">clear</button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <style>{`
        .rte-wrap { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .rte-toolbar {
          display: flex; flex-wrap: wrap; gap: 2px; padding: 6px 8px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-hover);
        }
        .rte-btn {
          padding: 4px 10px; font-size: 12px; border: none; border-radius: 4px;
          background: none; cursor: pointer; color: var(--text);
          font-family: inherit;
        }
        .rte-btn:hover { background: var(--surface); }
        .rte-divider { width: 1px; margin: 2px 4px; background: var(--border); }
        .rte-editor {
          min-height: 400px; padding: 20px;
          outline: none; line-height: 1.7; font-size: 15px;
        }
        .rte-editor h2 { font-size: 24px; margin: 28px 0 10px; }
        .rte-editor h3 { font-size: 20px; margin: 24px 0 8px; }
        .rte-editor p { margin-bottom: 12px; }
        .rte-editor ul, .rte-editor ol { padding-left: 24px; margin-bottom: 12px; }
        .rte-editor li { margin-bottom: 4px; }
        .rte-editor blockquote {
          border-left: 3px solid var(--accent); padding: 10px 18px; margin: 16px 0;
          background: var(--surface-hover); border-radius: 0 var(--radius) var(--radius) 0;
          color: var(--text-secondary); font-style: italic;
        }
        .rte-editor pre {
          background: #1a1a2e; color: #e2e8f0; padding: 16px; border-radius: var(--radius);
          overflow-x: auto; font-size: 14px; margin: 12px 0;
        }
        .rte-editor a { color: var(--accent); }
        [data-theme="dark"] .rte-editor pre { background: #0d0d1a; }
      `}</style>
    </div>
  )
}
