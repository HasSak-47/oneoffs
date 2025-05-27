import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Result, try_catch } from './result';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  slug: string;
  title: string;
}
export default function Blog() {
  return (
    <div className='blog-container'>
      <nav className='blog-nav'>
        <Link to='/blog'>All Posts</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export const BlogHome = () => {
  const posts: BlogPost[] = [
    {
      slug: 'blog-1',
      title: 'blog',
    },
    {
      slug: 'blog-2',
      title: 'blog blog',
    },
  ];

  return (
    <div className='blog-home'>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      let result: Result<Promise<Response>, Error> = try_catch(
        fetch,
        `/oneoffs/assets/blog/${slug}.md`
      );
      if (!result.ok()) {
        console.log('result not ok', result.unwrap_err());
        return;
      }

      let response = await result.unwrap()!;
      if (!response.ok) {
        console.log('respone not ok');
        return;
      }

      setMarkdown(await response.text());
      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) return <div className='loading'>Loading post...</div>;

  return (
    <article className='blog-post'>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </article>
  );
};
