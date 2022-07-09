import { Post } from './Post';

import styles from './styles.module.scss';

export function Posts() {

  return (
    <>
      <h1 className={styles.title}>Últimas postagens</h1>

      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />

    </>
  );
}