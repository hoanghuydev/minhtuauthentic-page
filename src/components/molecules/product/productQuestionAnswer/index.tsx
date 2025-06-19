import { QuestionAnswerDto } from '@/dtos/QuestionAnswer.dto';
import { Collapse } from 'antd/es';
import { useMemo } from 'react';
import Head from 'next/head';

type Props = {
  questions: QuestionAnswerDto[];
};
export default function ProductQuestionAnswer({ questions }: Props) {
  const faqSchema = useMemo(() => {
    const mainEntity = questions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity,
    };
  }, [questions])
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Head>
      <div
        className={'rounded-[10px] border-gray-500 bg-white shadow-custom mt-3'}
      >
        <div
          className={
            'bg-gray-100 text-primary font-semibold p-3 text-[16px] text-center'
          }
        >
          <h3 className={'uppercase'}>Câu hỏi thường gặp</h3>
        </div>
        <div className={'p-3'}>
          <Collapse accordion>
            {questions.map((item, index) => {
              return (
                <Collapse.Panel
                  header={<span className={'font-bold'}>{item.question}</span>}
                  key={index.toString()}
                  className={' border-b border-gray-500'}
                >
                  <div
                    className={'container-html'}
                    dangerouslySetInnerHTML={{ __html: item.answer || '' }}
                  />
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
    </>
  );
}
