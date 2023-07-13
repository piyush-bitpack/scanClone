import Head from "next/head";

const Metatags = () => {
  return (
    <Head>
      <link
        rel="icon"
        href="https://uploads-ssl.webflow.com/645a621eccd7c7d1f4aa7e0d/645b4540d445416f230a17a0_merokulogoo.svg"
        sizes="any"
      />
      <title>Contractly: Simplifying Ethereum Contract Interactions</title>
      <meta name="title" content="Contractly: Simplifying Ethereum Contract Interactions" />
      <meta
        name="description"
        content="Contractly transforms your interaction with Ethereum contracts. Our platform translates complex contract operations into intuitive visual elements and human-readable functions. Experience the simplest, most user-friendly way to engage with the Ethereum based contracts"
      />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://contractly.in/" />
      <meta
        property="og:title"
        content="Contractly: Simplifying Ethereum Contract Interactions"
      />
      <meta
        property="og:description"
        content="Contractly transforms your interaction with Ethereum contracts. Our platform translates complex contract operations into intuitive visual elements and human-readable functions. Experience the simplest, most user-friendly way to engage with the Ethereum based contracts"
      />
      <meta
        property="og:image"
        content='https://scanbetter.vercel.app/images/metaImage.jpg'
      />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://contractly.in/" />
      <meta
        property="twitter:title"
        content="Contractly: Simplifying Ethereum Contract Interactions"
      />
      <meta
        property="twitter:description"
        content="Contractly transforms your interaction with Ethereum contracts. Our platform translates complex contract operations into intuitive visual elements and human-readable functions. Experience the simplest, most user-friendly way to engage with the Ethereum based contracts"
      />
      <meta
        property="twitter:image"
        content="https://scanbetter.vercel.app/images/metaImage.jpg"
      />
    </Head>
  );
};

export default Metatags;
