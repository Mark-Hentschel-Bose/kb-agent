import React from 'react';
import Link from 'next/link';
import parse from 'html-react-parser';

type AdditionalParam = {
  title: string;
  body: string;
}

type Topic = {
  url: string;
  body: string;
  title: string;
  $: AdditionalParam;
}

type TopicListProps = {
  topics: [Topic];
}

export default function ArchiveRelative({ topics }: TopicListProps) {
  return <>
    {topics?.map((topic, idx) => (
      (<Link href={topic.url} key={idx}>

        <div>
          <h4 {...topic.$?.title as {}}>{topic.title}</h4>
          {typeof topic.body === 'string' && (
            <div {...topic.$?.body as {}}>{parse(topic.body.slice(0, 80))}</div>
          )}
        </div>

      </Link>)
    ))}
  </>;
}
