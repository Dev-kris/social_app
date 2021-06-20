import Head from 'next/head';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  createRef,
  Fragment,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import Image from 'next/image';
import classNames from 'classnames';
import Axios from 'axios';

import { Sub } from '../../types';
import { useAuthState } from '../../context/auth';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function SubPage() {
  //Local State
  const [ownSub, setOwnSub] = useState(false);

  //Global State
  const { authenticated, user } = useAuthState();

  //utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();

  const isOnSubPage = router.pathname === `/r/[sub]`;

  const subName = router.query.sub;

  const {
    data: sub,
    error,
    revalidate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null); //conditional fetching using SWR

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  if (error) router.push('/');
  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = <p className="text-lg text-center">No posts yet</p>;
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} revalidate={revalidate} />
    ));
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>

      {sub && (
        <Fragment>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* Sub information and images */}
          <div>
            {/* Sub Banner Image */}
            <div
              className={classNames('bg-blue-500', {
                'cursor-pointer': ownSub,
              })}
              onClick={() => openFileInput('banner')}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    className={classNames('rounded-full', {
                      'cursor-pointer': ownSub,
                    })}
                    onClick={() => openFileInput('image')}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 font-bold text-1xl sm:text-3xl">
                      {sub.title}
                    </h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Create a post (Mobile) */}
          {authenticated && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="block w-full py-1 text-sm md:hidden blue button">
                Create Post
              </a>
            </Link>
          )}
          {/* Posts section and Sidebar */}
          <div className="container flex pt-5">
            <div className="pr-2 w-160">{postsMarkup} </div>
            {isOnSubPage && (
              <>
                <div className="hidden ml-6 md:block w-80">
                  <Sidebar sub={sub} />
                </div>
              </>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
}
