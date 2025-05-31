import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathRenderer = ({ content }) => {
  // Split by newlines
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Render math if line contains LaTeX syntax (e.g. \frac or $)
        const isMath = trimmed.includes('\\frac') || trimmed.match(/\$.*\$/);

        if (isMath) {
          try {
            const html = katex.renderToString(trimmed.replace(/\$/g, ''), {
              throwOnError: false,
              displayMode: true,
            });
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
            );
          } catch (error) {
            return <p key={index} className="text-red-500">Math error: {line}</p>;
          }
        } else {
          return <p key={index}>{line}</p>;
        }
      })}
    </div>
  );
};

export default MathRenderer;
