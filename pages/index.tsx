import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import fetchAPI from "../lib/api-prismic";

interface Post {
  node: {
    _meta: {
      uid: string;
    };
    title: string;
    thumbnail: {
      alt: string;
      url: string;
    };
  };
}

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {posts.map(({ node: post }) => (
          <li key={`item-${post._meta.uid}`}>
            <Link href={`post/${post._meta.uid}`}>
              <a>
                <img
                  src={post.thumbnail.url}
                  alt={post.thumbnail.alt}
                  width={50}
                />
                {post.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await fetchAPI(
    `query {
    allPosts {
      edges {
        node {
          _meta {
            uid
          }
          title
          thumbnail
        }
      }
    }
  }`,
    {}
  );

  return {
    props: {
      posts: posts.allPosts.edges,
    },
  };
}
