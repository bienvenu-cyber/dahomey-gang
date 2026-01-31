import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "Dahomey-Gang | Streetwear Premium Inspiré du Dahomey",
  description = "Dahomey-Gang - Streetwear premium inspiré de l'héritage du royaume du Dahomey. Collections uniques alliant tradition africaine et mode contemporaine. Fondée par DJIVO Nolhan Marvin.F.",
  keywords = "dahomey gang, streetwear africain, mode africaine, vêtements dahomey, t-shirts africains, hoodies africains, streetwear premium, mode bénin, vêtements afro, fashion africaine",
  image = "https://dahomeyboy.maxiimarket.com/placeholder.svg",
  url = "https://dahomeyboy.maxiimarket.com",
  type = "website",
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
