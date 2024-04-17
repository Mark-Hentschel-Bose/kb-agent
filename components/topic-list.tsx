import React from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import Link from 'next/link';
import { Image } from "../typescript/action";

type AdditionalParam = {
  banner_title:string;
  banner_description: string;
  title: {};
  title_h2: string;
  body: string;
  date: string;
}

type Author = {
  title: string;
  $: AdditionalParam;
}


type TopiclistProps = {
  body: string;
  url: string;
  featured_image: Image; 
  title: string;
  date: string;
  author: [Author];
  $: AdditionalParam;
}

function TopicList({ topiclist }: { topiclist: TopiclistProps }) {
  let body: string = topiclist.body && topiclist.body.substr(0, 300);
  const stringLength = body.lastIndexOf(' ');
  body = `${body.substr(0, Math.min(body.length, stringLength))}...`;
  return (
    <div className='blog-list'>
      {topiclist.featured_image && (
        (<Link href={topiclist.url}>

          <img
            className='blog-list-img'
            src={topiclist.featured_image.url}
            alt='blog img'
            {...topiclist.featured_image.$?.url as {}}
          />

        </Link>)
      )}
      <div className='blog-content'>
        {topiclist.title && (
          (<Link href={topiclist.url}>

            <h3 {...topiclist.$?.title}>{topiclist.title}</h3>

          </Link>)
        )}
        <p>
          <strong {...topiclist.$?.date as {}}>
            {moment(topiclist.date).format('ddd, MMM D YYYY')}
          </strong>
          ,{" "}
          <strong {...topiclist.author[0].$?.title}>
            {topiclist.author[0].title}
          </strong>
        </p>
        <div {...topiclist.$?.body as {}}>{parse(body)}</div>
        {topiclist.url ? (
          (<Link href={topiclist.url}>

            <span>{'Read more -->'}</span>

          </Link>)
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default TopicList;