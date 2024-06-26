import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getTopicPostRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';
import { Page, TopicPosts, PageUrl } from "../../typescript/pages";


export default function TopicPost({ topicPost, page, pageUrl }: {topicPost: TopicPosts, page: Page, pageUrl: PageUrl}) {
  
  const [getPost, setPost] = useState({ banner: page, post: topicPost });
  async function fetchData() {
    try {
      const entryRes = await getTopicPostRes(pageUrl);
      const bannerRes = await getPageRes('/topic');
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [topicPost]);

  const { post, banner } = getPost;
  return (
    <>
      {/*
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          topicPost
          contentTypeUid='topic_full'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      */}
      <div className='blog-container'>
        <article className='blog-detail'>
          {post && post.title ? (
            <h1 {...post.$?.title as {}}>{post.title}</h1>
          ) : (
            <h1>
              <Skeleton />
            </h1>
          )}
          {post && post.date ? (
            <p {...post.$?.date as {}}>
              {moment(post.date).format('ddd, MMM D YYYY')},{' '}
              <strong {...post.author[0].$?.title as {}}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.body ? (
            <div {...post.$?.body as {}}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        </article>
        {/*
        <div className='blog-column-right'>
          <div className='related-post'>
            {banner && banner?.page_components[2].widget ? (
              <h2 {...banner?.page_components[2].widget.$?.title_h2 as {}}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
        */}
      </div>
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getPageRes('/topic');
    const posts = await getTopicPostRes(`/topic/${params.post}`);
    if (!page || !posts) throw new Error('404');

    return {
      props: {
        pageUrl: `/topic/${params.post}`,
        topicPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
