import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Result, try_catch } from './result';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from './Header';

interface BlogPost {
  slug: string;
  title: string;
}
export default function Blog() {
  return (
    <div>
      <Header
        name='Blog'
        ret={true}
        extra={
          <nav className='blog-nav'>
            <Link to='/blog'>All Posts</Link>
          </nav>
        }
      />
      <Outlet />
    </div>
  );
}

export function BlogHome() {
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
    <div className='mx-auto w-11/12 max-w-4xl py-12'>
      <header className='mb-10 text-center'>
        <h1 className='text-oldWhite mb-2 text-5xl font-bold'>Blog Posts</h1>
        <p className='text-fujiWhite text-lg'>Random text goes here</p>
      </header>

      <ul className='space-y-6'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className='border-sumiInk5 bg-sumiInk3 hover:border-waveBlue1 block rounded-xl border p-6 shadow-md transition-transform hover:scale-105'
            >
              <h2 className='text-oldWhite text-2xl font-semibold'>
                {post.title}
              </h2>
              <p className='text-fujiWhite mt-2 text-sm'>Read more →</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogPost() {
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
      <div className='h-80' />
    </article>
  );
}
