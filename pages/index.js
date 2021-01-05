import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home({ data }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {data.length}
        </h1>     
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const dataFunc = require("../utils/url");
  
  const data = await dataFunc.getData();
  
  return { props: { data } }
}
