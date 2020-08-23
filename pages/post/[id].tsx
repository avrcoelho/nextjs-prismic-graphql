import React from "react";
import { GetStaticPropsContext } from "next";
import { RichText, RichTextBlock } from "prismic-reactjs";

import fetchAPI from "../../lib/api-prismic";

interface Post {
  title: string;
  thumbnail: {
    alt: string;
    url: string;
  };
  content: RichTextBlock[];
}

interface PostProps {
  post: Post;
}

function Post({ post }: PostProps) {
  return (
    <div>
      <h1>{post.title}</h1>;
      <img src={post.thumbnail.url} alt={post.thumbnail.alt} width={200} />
      <br />
      {RichText.asText(post.content)}
    </div>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { id } = context.params;

  const { post } = await fetchAPI(
    `query($slug: String!, $lang: String!) {
      post(uid: $slug, lang: $lang) {
        title
        thumbnail
        content
      }
    }`,
    {
      slug: id,
      lang: "pt-br",
    }
  );

  return {
    props: {
      post,
    },
    revalidate: 1, // 1 segundo
  };
}

export async function getStaticPaths() {
  const {
    allPosts: { edges },
  } = await fetchAPI(
    `query {
    allPosts {
      edges {
        node {
          _meta {
            uid
          }
        }
      }
    }
  }`,
    {}
  );

  return {
    paths: edges.map(({ node }) => `/post/${node._meta.uid}`) || [],
    fallback: false,
  };
}

export default Post;
