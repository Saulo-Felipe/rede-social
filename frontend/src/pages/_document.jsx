import { Html, Head, Main, NextScript } from "next/document";


export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=swap" rel="stylesheet"></link>
      </Head>

      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}