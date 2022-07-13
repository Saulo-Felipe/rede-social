import styles from "./Search.module.scss";

export function Users({ searchQuery }) {

  return (
    <div className={styles.Container} >
      {searchQuery}
    </div>
  );
}