import { TbFaceIdError } from "react-icons/tb";
import Link from "next/link";

import styles from "./404.module.scss";


export default function Custom404() {
  return (
    <div className={styles.Container}>
      <h1 className={styles.title}>Página não encontrada</h1>
      <h1 className={styles.icon}><TbFaceIdError /></h1>
      <h1 className={styles.e404}>404</h1>
      <button>
        <Link href="/">
          <a>Voltar</a>
        </Link>
      </button>
    </div>
  );
}