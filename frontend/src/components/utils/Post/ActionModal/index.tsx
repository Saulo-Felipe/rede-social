import styles from "./styles.module.scss";
import { IoClose } from "react-icons/io5";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { useEffect, useState } from "react";
import { LikeOrDislike } from "../index"; 
import { api } from "../../../../services/api";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";
import { MdStickyNote2 } from "react-icons/md";


interface Comment {
  commentID: number
  content: string;
  created_on: string;
  image_url: string;
  userID: string;
  username: string;
}

interface ActionModal {
  index: number;
  data: any;
}


interface ActionModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (args: boolean) => void;
  postId: number;
}

export function ActionModal({ modalIsOpen, setModalIsOpen, postId }: ActionModalProps) {
  const [selectedOption, setSelectedOption] = useState<ActionModal>({
    index: 0,
    data: [] // Array de likes, de dislikes ou de comentários
  });
  const [loading, setLoading] = useState(false);



  async function updateActions() {
    if (selectedOption.index == 0 || selectedOption.index == 1) {
      setLoading(true);
      const { data }: any = await api().post("/posts/actions", { postID: postId });
      setLoading(false);

      setSelectedOption({ ...selectedOption, 
        data: selectedOption.index == 0 
        ? [...data.likes]
        : [...data.dislikes]
      });
      
    } else {
      setLoading(true);
      const { data } = await api().get(`/posts/comments/${postId}`);
      setLoading(false);

      if (data.success) {
        setSelectedOption({ ...selectedOption, data: data.comments });
      }
    }    
  }

  useEffect(() => {
    updateActions();
  }, [selectedOption.index]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (modalIsOpen) {
        updateActions();
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [modalIsOpen]);

  if (modalIsOpen) {
    return (
      <div className={styles.ModalMain}>
        <div className={styles.bg} onClick={() => setModalIsOpen(false)}></div>

        <section className={styles.modal}>
          <IoClose  className={styles.iconClose} onClick={() => setModalIsOpen(false)}/>

          <header className={styles.options}>
            <div className={styles.handleOption}>
              <div className={`
                ${styles.aOption} 
                ${styles.like} 
              `}
                style={selectedOption.index == 0 ? { borderBottomColor: "var(--default-blue)"} : {}}
                onClick={() => !loading ? setSelectedOption({ index: 0, data: [] }) : null}
              ><AiFillLike /> Likes</div>
              
              <div className={`
                ${styles.aOption} 
                ${styles.dislike}
              `}
                style={selectedOption.index == 1 ? { borderBottomColor: "var(--offline)"} : {}}
                onClick={() => !loading ? setSelectedOption({ index: 1, data: [] }) : null}
              ><AiFillDislike /> Dislikes</div>

              <div className={`
                ${styles.aOption} 
                ${styles.comment}
              `}
                style={selectedOption.index == 2 ? { borderBottomColor: "var(--default-blue)"} : {}}
                onClick={() => !loading ? setSelectedOption({ index: 2, data: [] }) : null}
              ><BiCommentDetail /> Comentários</div>

            </div>

            <hr />
          </header>

          <section className={styles.content}>
            { loading ? <div className={`loadingContainer ${styles.loading}`}><CgSpinner /></div> : "" }
            {
              selectedOption.index == 0 || selectedOption.index == 1 // Likes or dislikes
              ? (
                <div className={styles.actionsContainer}>
                  { selectedOption.data.length > 0 
                    ? selectedOption.data.map((option: LikeOrDislike) => 
                      <div key={option.image_url} className={styles.actionUser}>
                        <Link href={`/profile/${option.user_id}`}>
                          <a>
                            <div className={styles.imageContainer}><img src={option.image_url} /></div>
                            <div className={styles.name}>{option.username}</div>
                          </a>
                        </Link>
                        <div className={styles.letsIcons} style={{ color: selectedOption.index == 0 ? "var(--default-blue)" : "var(--offline)" }}>
                          {selectedOption.index == 0 ? <AiFillLike /> : <AiFillDislike />}  
                        </div>
                      </div>
                    ) : (
                      <div className={styles.notHave}>
                        <div className={styles.title}>Por enquanto não há nada aqui.</div>
                        <MdStickyNote2 />
                      </div>
                    )
                  }
                </div>
              ) : (
                <div className={styles.commentsContainer}>
                  { selectedOption.data.length > 0
                    ? selectedOption.data.map((option: Comment) => 
                      <div key={option.created_on} className={styles.commentUser}>
                        <header className={styles.userInfo}>
                          <Link href={`/profile/${option.userID}`}>
                            <a>
                              <div className={styles.imageContainer}>
                                <img src={option.image_url} alt={"preview comment, user: "+option.username}/>
                              </div>
                              
                              <div className={styles.username}>{option.username}</div>
                            </a>
                          </Link>
                        </header>

                        <section className={styles.content}>{option.content}</section>
                      </div>
                    ) : (
                      <div className={styles.notHave}>
                        <div className={styles.title}>Por enquanto não há nada aqui.</div>
                        <MdStickyNote2 />
                      </div>
                    )
                  }
                </div>
              )
            }
          </section>
        </section>
      </div>
    );
  } else {
    return <></>;
  }
}