import router, { useRouter } from 'next/router';
import { setUncaughtExceptionCaptureCallback, title } from 'process';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import Sidebar from '../../../components/Sidebar';
import { Post, Sub } from '../../../types';
import Axios from 'axios';
import { GetServerSideProps } from 'next';

export default function submit() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const { sub: subName } = router.query;

  const isOnSubmitPage = router.pathname === `/r/[sub]/submit`;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  if (error) router.push('/');

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') return;

    try {
      const { data: post } = await Axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: sub.name,
      });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container flex pt-5">
      <head>
        <title>Submit</title>
      </head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm select-none text-gray 500 focus:border-gray-600"
                style={{ top: 11, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 focus:outline-none focus:border-gray-600"
              value={body}
              placeholder="Text (optional)"
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 button blue"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {!isOnSubmitPage && (
        <>
          <div className="hidden ml-6 md:block w-80">
            {sub && <Sidebar sub={sub} />}
          </div>
        </>
      )}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing token in cookie.');
    await Axios.get('/auth/me', { headers: { cookie } });
    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end();
  }
};
