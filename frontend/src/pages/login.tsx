import { FormEvent, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Axios from 'axios';
import { useRouter } from 'next/router';

import { useAuthDispatch, useAuthState } from '../context/auth';

import InputGroup from '../components/inputGroup';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();
  const router = useRouter();
  if (authenticated) router.push('/');

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post('/auth/login', {
        username,
        password,
      });

      dispatch('LOGIN', res.data);

      router.back();
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/texture-brick.jpeg' )" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Aggrement and Privacy Policy.
          </p>
          <form onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              type="text"
              value={username}
              setValue={setUsername}
              placeholder="Username"
              error={errors.username}
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="password"
              error={errors.password}
            />

            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            New to Social App?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
