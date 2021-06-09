export interface Post {
  identifier: string;
  title: string;
  body: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  // Virtual Fields
  url: string;
}
