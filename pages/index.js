import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <>
      <Head>
        <title>Cutting Edge Image Solutions</title>
        <meta name="description" content="Web Design, Digital Marketing, Photography & Video" />
      </Head>

      <Header />
      <Hero />
    </>
  );
}
