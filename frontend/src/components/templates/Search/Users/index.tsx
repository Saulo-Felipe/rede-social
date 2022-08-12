import { useEffect, useState } from "react";
import { BiUnlink } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { ImSpinner9 } from "react-icons/im";
import { api } from "../../../../services/api";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./Users.module.scss";

export function Users({ searchQuery }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async() => {
      setLoading(true);

      const { data } = await api().get(`/search/${searchQuery}`);

      if (data.success) {
        setAllUsers(data.users);

      } else {
        alert("Erro ao realizar busca.");
      }

      setLoading(false);
    })();
  }, [searchQuery]);

  return (
    <div className={styles.Container}>
      {
        loading 
        ? (
          <div id={styles.loadingUsers} className={"loadingContainer"}>
            <ImSpinner9 />
          </div>
        ) : <></>
      }

      {
        allUsers.length === 0
        ? <div className={styles.notHaveUsers}><BiUnlink /> Nenhum resultado encontrado</div>
        :
        <>
          {
            allUsers.map(aUser =>
              <div className={styles.user} key={aUser.id}>
                <Link href={`/profile/${aUser.id}`}>
                  <a>
                    <div className={styles.imgContainer}>
                      <img 
                        src={aUser.image_url}
                      />
                    </div>

                    <div className={styles.content}>
                      <div className={styles.username}>{aUser.username}</div>
                      { aUser.id === user?.id ? <div className={styles.badgeMyProfile}>Meu perfil</div> : <></>}
                    </div>
                  </a>
                </Link>
              </div>
            )
          }
          <div className={styles.endOfResults}>Fim dos resultados</div>
        </>
      }

    </div>
  );
}