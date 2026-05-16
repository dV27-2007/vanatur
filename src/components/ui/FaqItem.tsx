interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="faq-item reveal">
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  );
}
