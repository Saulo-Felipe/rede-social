import Image from "next/image";

import styles from "./styles.module.scss";

export function Header() {

  return (
    <header>
      <div>
        <Image 
          src={"/images/react-logo.png"} 
        />
      </div>
      <div></div>
    </header>
  );
}