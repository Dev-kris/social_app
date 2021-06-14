export interface Post {
  identifier: string;
  title: string;
  body?: string; //body is optional
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  // Virtual Fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];

  // virtual fields
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}
