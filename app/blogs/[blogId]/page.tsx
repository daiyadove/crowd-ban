import { client } from '@/app/libs/client';
import { Blog } from '@/app/types/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getBlog(blogId: string) {
  if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN) {
    return null;
  }

  try {
    const blog = await client.get<Blog>({
      endpoint: 'blogs',
      contentId: blogId,
    });
    return blog;
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { blogId } = await params;

  if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">設定が必要です</p>
          <p>.env.localファイルにMicroCMSの認証情報を設定してください：</p>
          <pre className="mt-2 bg-yellow-50 p-2 rounded">
            MICROCMS_API_KEY=your-api-key-here{'\n'}
            MICROCMS_SERVICE_DOMAIN=your-service-domain-here
          </pre>
        </div>
      </main>
    );
  }

  const blog = await getBlog(blogId);

  if (!blog) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 space-x-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← トップページへ
        </Link>
        <Link
          href={`/categories/${blog.category.id}`}
          className="text-blue-500 hover:underline"
        >
          ← {blog.category.name}の記事一覧へ
        </Link>
      </div>
      <article className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center space-x-4 text-gray-500 mb-8">
          <span>
            公開日: {new Date(blog.publishedAt).toLocaleDateString('ja-JP')}
          </span>
          <Link
            href={`/categories/${blog.category.id}`}
            className="text-blue-500 hover:underline"
          >
            {blog.category.name}
          </Link>
        </div>
        <div className="prose prose-lg max-w-none prose-img:rounded-lg prose-img:shadow-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.markdown}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}