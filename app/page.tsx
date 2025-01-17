import { client } from './libs/client';
import { Category, MicroCMSListResponse } from './types/blog';
import Link from 'next/link';

async function getCategories() {
  if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN) {
    return [];
  }

  try {
    const data = await client.get<MicroCMSListResponse<Category>>({
      endpoint: 'categories',
    });
    return data.contents;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ブログカテゴリ</h1>
      {!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_SERVICE_DOMAIN ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8">
          <p className="font-bold">設定が必要です</p>
          <p>.env.localファイルにMicroCMSの認証情報を設定してください：</p>
          <pre className="mt-2 bg-yellow-50 p-2 rounded">
            MICROCMS_API_KEY=your-api-key-here{'\n'}
            MICROCMS_SERVICE_DOMAIN=your-service-domain-here
          </pre>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>カテゴリがまだ登録されていません。</p>
          <p className="mt-2">MicroCMS管理画面でカテゴリを作成してください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
