import Head from 'next/head';
import Axios from 'axios';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../types';
//import { GetServerSideProps } from 'next';  //for SSR

import PostCard from '../components/PostCard';

dayjs.extend(relativeTime);

//to enable SSR destructure {posts}
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Groupomania</title>
      </Head>
      <div className="container flex flex-col pt-4 ">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
//research nprogress for loading animation
//runs before pages is rendered
//converts to server sided rendering
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts');

//     return { props: { posts: res.data } };
//   } catch (err) {
//     return { props: { error: 'Something went wrong.' } };
//   }
// };
