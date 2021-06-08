import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/texture-brick.jpeg' )" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Aggrement and Privacy Policy.
          </p>
          <form>
            <div className="mb-2">
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded"
                placeholder="email"
              />
            </div>
            <div className="mb-2">
              <input
                type="username"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded"
                placeholder="username"
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded"
                placeholder="password"
              />
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a member?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
