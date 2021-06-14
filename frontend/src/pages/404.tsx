import Link from 'next/link';
// TODO: ADD STYLING
export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-10 text-5xl text-gray-800 mb 4">Page Not Found</h1>
      <Link href="/">
        <a className="px-4 py-2 blue button">Home</a>
      </Link>
    </div>
  );
}
