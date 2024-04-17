import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../../contentstack-sdk';
import TopicList from '../../components/topic-list';
import RenderComponents from '../../components/render-components';
import { getPageRes, getTopicListRes } from '../../helper';

import ArchiveTopicRelative from '../../components/archive-topic-relative';
import Skeleton from 'react-loading-skeleton';
import { Page, PostPage, PageUrl, Context } from "../../typescript/pages";


export default function Topic({ page, posts, archivePost, pageUrl }: {page: Page, posts: PostPage, archivePost: PostPage, pageUrl: PageUrl}) {

  const [getBanner, setBanner] = useState(page);
  async function fetchData() {
    try {
      const bannerRes = await getPageRes(pageUrl);
      if (!bannerRes) throw new Error('Status code 404');
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);
  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          topicPost
          contentTypeUid='page'
          entryUid={getBanner.uid}
          locale={getBanner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <div className='blog-column-left'>
          {posts ? (
            posts.map((topicList, index) => (
              <TopicList topiclist={topicList} key={index} />
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
        {/*
        <div className='blog-column-right'>
          {getBanner && getBanner.page_components[1].widget && (
            <h2>{getBanner.page_components[1].widget.title_h2}</h2>
          )}
          {archivePost ? (
            <ArchiveTopicRelative topics={archivePost} />
          ) : (
            <Skeleton height={600} width={300} />
          )}
        </div>
        */}
      </div>
    </>
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const page = await getPageRes(context.resolvedUrl);
    const result = await getTopicListRes();

    const archivePost = [] as any;
    const posts = [] as any;
    result.forEach((topics) => {
      if (topics.is_archived) {
        archivePost.push(topics);
      } else {
        posts.push(topics);
      }
    });
    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        posts,
        archivePost,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
