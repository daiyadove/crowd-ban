import { client } from '@/app/libs/client';
import { Blog, Category, MicroCMSListResponse } from '@/app/types/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getCategory(categoryId: string) {
  if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN) {
    return null;
  }

  try {
    const category = await client.get<Category>({
      endpoint: 'categories',
      contentId: categoryId,
    });
    return category;
  } catch {
    return null;
  }
}

async function getCategoryBlogs(categoryId: string) {
  if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN) {
    return [];
  }

  try {
    const data = await client.get<MicroCMSListResponse<Blog>>({
      endpoint: 'blogs',
      queries: {
        filters: `category[equals]${categoryId}`,
      },
    });
    return data.contents;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

type Props = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  
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

  const category = await getCategory(categoryId);

  if (!category) {
    notFound();
  }

  const blogs = await getCategoryBlogs(categoryId);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← カテゴリ一覧に戻る
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">{category.name}の記事一覧</h1>
      <div className="space-y-6">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Link href={`/blogs/${blog.id}`}>
              <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-500">
                {blog.title}
              </h2>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(blog.publishedAt).toLocaleDateString('ja-JP')}
              </div>
            </Link>
          </article>
        ))}
        {blogs.length === 0 && (
          <p className="text-gray-500">このカテゴリの記事はまだありません。</p>
        )}
      </div>
    </main>
  );
}