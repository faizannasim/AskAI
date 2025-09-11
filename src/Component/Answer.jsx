import React, { useEffect, useState } from 'react'
import { check, ReplaceHead } from './helper'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import Markdown from 'react-markdown'

function Answer({ ans, index, totalresult, type }) {
  const [heading, setHeading] = useState(false)
  const [answer, setAnswer] = useState(ans.text)

  useEffect(() => {
    if (check(ans.text)) {
      setHeading(true)
      setAnswer(ReplaceHead(ans.text))
    }
  }, [ans])


  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          style={dark}
          preTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }

  return (
    <div>
      {index === 0 && totalresult > 1 ? (
        <span className="text-lg pt-2 font-bold block">{answer}</span>
      ) : heading ? (
        <span className="text-lg pt-2 font-bold block">{answer}</span>
      ) : (
        <span className={type === 'q' ? 'pl-1' : 'pl-5'}>
          <Markdown components={renderers}>{answer}</Markdown>
        </span>
      )}
    </div>
  )
}

export default Answer
