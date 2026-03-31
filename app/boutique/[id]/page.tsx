import ProductDetailPage from "./ProductClient";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage id={id} />;
}
