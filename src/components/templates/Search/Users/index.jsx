import { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { ImSpinner9 } from "react-icons/im";

import styles from "./Users.module.scss";

export function Users({ searchQuery }) {
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async() => {
      setLoading(true);

      const { data } = await api.post("/search", { search: searchQuery });

      if (data.success) {
        setUsers(data.users);

      } else {
        alert("Erro ao realizar busca.");
      }

      setLoading(false);
    })();
  }, [searchQuery]);

  return (
    <div className={styles.Container} >
      {
        loading 
        ? (
          <div id={styles.loadingUsers} className={"loadingContainer"}>
            <ImSpinner9 />
          </div>
        ) : <></>
      }

      {
        users.map(user =>
          <div className={styles.user} key={user.id}>
            <Link href={`/profile/${user.id}`}>
              <a>
                <div className={styles.imgContainer}>
                  <Image 
                    src={user.image_url}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>

                <div className={styles.content}>
                  <div className={styles.username}>{user.username}</div>
                  { user.id === session.user.id ? <div className={styles.badgeMyProfile}>Meu perfil</div> : <></>}
                </div>
              </a>
            </Link>
          </div>
        )
      }

    </div>
  );
}