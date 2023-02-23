/* eslint-disable react/no-children-prop */
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
const { stackoverflowLight } = require('react-syntax-highlighter/dist/cjs/styles/hljs');

type TMarkDown = {
  content: string;
};

const MarkDown = (props: TMarkDown) => {
  const { content } = props;
  const code = useMemo(() => '```yaml\n' + content + '```', [content]);

  return (
    <ReactMarkdown
      children={code}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              showLineNumbers={true}
              style={stackoverflowLight}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    />
  );
};

export default MarkDown;
