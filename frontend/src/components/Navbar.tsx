import Link from 'next/link';
import Axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Logo from '../images/icon.svg';
import { Sub } from '../types';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [name, setName] = useState('');
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  const router = useRouter();

  const logout = () => {
    Axios.get('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([]);
      return;
    }
    searchSubs();
  }, [name]);

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      //reduces server load by waiting for user input before auto-completing
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${name}`);
          setSubs(data);
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }, 250)
    );
  };
  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName(' ');
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-2 bg-white sm:px-5">
      {/* Groupomania Logo and Title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Logo className="w-8 h-8 mr-1 sm:mr-2" />
          </a>
        </Link>
        <span className="hidden font-semibold text-2x1 lg:block">
          <Link href="/">Groupomania</Link>
        </span>
      </div>
      {/* Search Field */}
      <div className="w-3/5 max-w-full px-1 sm:px-3 sm:w-160">
        <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded outline-none focus:"
            placeholder="Search"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: '100%' }}
          >
            {subs?.map((sub) => (
              <div
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}
              >
                <Image
                  src={sub.imageUrl}
                  alt="sub"
                  className="rounded-full"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                ></Image>
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Authentication Buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            //show logout button if loggged in
            <button
              className="w-20 py-1 mr-4 leading-5 lg:w-32 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-16 py-1 mr-1 leading-5 sm:mr-4 lg:w-32 hollow blue button">
                  Log In
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-16 py-1 leading-5 sm:block lg:w-32 blue button">
                  Sign Up
                </a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
