import ArticleDetailPage from "./ArticleClient";

export function generateStaticParams() {
  return [
    { slug: 'entrepreneuriat-feminin-afrique-ouest' },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
