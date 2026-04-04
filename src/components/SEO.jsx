import { Helmet } from 'react-helmet-async'

function SEO({ title, description, keywords }) {
  const fullTitle = title
    ? `${title} | SK Marketings`
    : 'SK Marketings | Business Consultancy India'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'SK Marketings - Trusted business consultancy firm in Tirupati, India. Expert MSME services, financial guidance, digital marketing & business promotions.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  )
}

export default SEO
