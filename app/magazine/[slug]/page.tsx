import MagazineReaderClient from "./MagazineReaderClient";

const defaultSlugs = [
  "afrikher-n1-ascension",
  "afrikher-n2-mode-identite",
  "afrikher-n3-tech-innovation",
  "afrikher-n4-leadership-feminin",
];

export async function generateStaticParams() {
  return defaultSlugs.map((slug) => ({ slug }));
}

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MagazineReaderClient slug={slug} />;
}
