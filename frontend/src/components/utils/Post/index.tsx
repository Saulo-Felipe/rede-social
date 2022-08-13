import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../services/api";
import { Comments } from "./Comments";
import { AiOutlineComment, AiOutlineDislike, AiOutlineLike, AiFillLike, AiFillDislike } from "react-icons/ai";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

import styles from "./Post.module.scss";
import { ActionModal } from "./ActionModal";

export interface PostBody {
  id: number;
  content: string;
  created_on: string;
  fk_user_id: string;
  image_url: string;
  dislikes: number;
  likes: number;
  username: string;
  images: string;
}

interface PostProps {
  data: PostBody;
  currentUserId: string;
}

export interface LikeOrDislike {
  image_url: string;
  post_id: number;
  user_id: string;
  username: string;
  like?: boolean;
  dislike: boolean;
}


export function Post({ data: postInfo, currentUserId }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [currentCarouselImage, setCurrentCarouselImage] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [postIsDeleted, setPostIsDeleted] = useState<number>(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoading, setIsloading] = useState({
    like: false,
    dislike: false
  });
  const [isActionType, setIsActionType] = useState({
    like: false,
    dislike: false
  });

  const [likes, setLikes] = useState<LikeOrDislike[]>([]);
  const [dislikes, setDislikes] = useState<LikeOrDislike[]>([]);

  const postWidthRef = useRef(null);
  const previewActions = organizeActionsPreview();
  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(() => { // preload post wimages
    renderPreloadImages();
    getActions();
  }, []);

  useEffect(() => {
    verifyUserAction();
  }, [likes, dislikes]);

  useEffect(() => { // Disable overflow to page body
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [previewImage]);

  
  function organizeActionsPreview() {
    let arr: LikeOrDislike[] = [];

    if (likes.length > dislikes.length) {
      for (let c = 0; c < likes.length && arr.length < 4; c++) {
        arr.push({ ...likes[c], like: true });
  
        for (let i = c; c < dislikes.length && arr.length < 4; i++) {
          arr.push({ ...dislikes[i], dislike: true });
          break;
        }
      }
    } else {
      for (let c = 0; c < dislikes.length && arr.length < 4; c++) {
        arr.push({ ...dislikes[c], dislike: true });
  
        for (let i = c; i < likes.length && arr.length < 4; i++) {
          arr.push({ ...likes[i], like: true });
          break;
        }
      }
    }

    return arr;
  }


  function verifyUserAction() {
    let type = 0;

    for (let c = 0; c < likes.length; c++) {
      if (likes[c].user_id == currentUserId) {
        type = 1;
        break;
      }
    }

    for (let c = 0; c < dislikes.length; c++) {
      if (dislikes[c].user_id == currentUserId) {
        type = 2;
        break;
      }
    }

    return setIsActionType({ like: type == 1, dislike: type == 2 });
  }

  async function getActions() {
    setIsloading({ like: true, dislike: true });
    var { data } = await api().post("/posts/actions", { postID: postInfo.id });
    setIsloading({ like: false, dislike: false });
    
    if (data.success) {
      setLikes([ ...data.likes ]);
      setDislikes([ ...data.dislikes ]);
    }
  }

  function renderPreloadImages() {
    let images = postInfo.images?.split(",") || [];

    if (images.length > 0) {
      let preloadImages = [];
      console.log("teste: ", process.env.NEXT_PUBLIC_CLOUDINARY_API_URL)
      for (let c = 0; c < images.length; c++) {
        preloadImages.push(
          <img 
            src={process.env.NEXT_PUBLIC_CLOUDINARY_API_URL+"/"+images[c]}
            style={{ maxHeight: (isMobile ? 100/100 : 60/100)*postWidthRef.current?.clientWidth }}
            onClick={() => setPreviewImage(process.env.NEXT_PUBLIC_CLOUDINARY_API_URL+"/"+images[c])}
          />
        );
      }
  
      setAllImages([ ...preloadImages ]);
    }
  }

  function nextCarousel() {
    if (currentCarouselImage < allImages.length-1) {
      setCurrentCarouselImage(currentCarouselImage+1);
    }
  }

  function backCarousel() {
    if (currentCarouselImage > 0) {
      setCurrentCarouselImage(currentCarouselImage-1);
    }
  }

  function onClickOutsideDropdown(element, event) {
    if (deleteLoading)
      return event.preventDefault();
    
    let classes = element.classList

    for (let c = 0; c < classes.length; c++) {
      if (classes[c].toLocaleLowerCase().indexOf("option") == -1)
        setDropdownIsOpen(false);
    }
  }

  async function deletePost() {
    setDeleteLoading(true);
    const { data } = await api().delete(`/posts/${currentUserId}/${postInfo.fk_user_id}/${postInfo.id}`)
    setDeleteLoading(false);

    if (data.success) {
      setPostIsDeleted(1);
      setTimeout(() => {
        setPostIsDeleted(2);
      }, 3000)
    } else {
      toast.error("Erro ao deletar post");
    }
  }


  async function handleNewLike() {
    if (!isLoading.like && !isLoading.dislike) {
      if (isActionType.like) { // remove live
        setIsloading({ ...isLoading, like: true });
        await api().delete(`/posts/like/${currentUserId}/${postInfo.id}`);
        setIsloading({ ...isLoading, like: false });

      } else { // new like
        setIsloading({ ...isLoading, like: true });
        await api().put(`/posts/like/${currentUserId}/${postInfo.id}`);
        setIsloading({ ...isLoading, like: false });

      }
      getActions();
    }
  }

  async function handleNewDislike() {
    if (!isLoading.dislike && !isLoading.like) {
      if (isActionType.dislike) { // remove dislike
        setIsloading({ ...isLoading, dislike: true });
        await api().delete(`/posts/dislike/${currentUserId}/${postInfo.id}`);
        setIsloading({ ...isLoading, dislike: false });

      } else { // new dislike
        setIsloading({ ...isLoading, dislike: true });
        await api().put(`/posts/dislike/${currentUserId}/${postInfo.id}`);
        setIsloading({ ...isLoading, dislike: false });

      }
      getActions();
    }
  }


  if (postIsDeleted === 0)
    return (
      <div 
        style={deleteLoading ? { opacity: "0.5", userSelect: "none" } : null}
        className={styles.post} 
        onClick={(e) => onClickOutsideDropdown(e.target, e)}
      >

        <ActionModal
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          postId={postInfo.id}
        />

        {
          previewImage 
          ? 
            <div className={styles.previewContainer} onClick={() => setPreviewImage(null)}>
              <img src={previewImage} />
              <IoClose />
            </div>
          : <></>
        }
        <header>
          <div className={styles.profileInfo}>
            <Link href={`/profile/${postInfo.fk_user_id}`}>
              <a>
                <div className={styles.profilePictureContainer}>
                  <img
                    alt={"user profile"}
                    src={postInfo.image_url}
                  />
                </div>

                <div className={styles.username}>
                  {postInfo.username}
                </div>
              </a>
            </Link>
          </div>

          {
            postInfo.fk_user_id === currentUserId
            ? <div 
                className={styles.menuDots}
                onClick={() => setDropdownIsOpen(dropdownIsOpen == false)}
              >
              <BiDotsHorizontal />

              {
                dropdownIsOpen 
                ? ( 
                  <div className={styles.dropdown}>
                    <div className={styles.option} onClick={deletePost}>
                      <BsTrash />
                      Deletar
                    </div>
                  </div>
                ) : <></>
              }
            </div>
            : <></>
          }
        </header>

        <hr />

        <section className={styles.postContainer} ref={postWidthRef}>
          { 
            postInfo.content.length > 0  
            ? <div className={styles.commentContent}>{ postInfo.content }</div>
            : <></>
          }

          <div className={styles.carousel} >
            {
              allImages.length > 0
              ? (
                  <div className={styles.imageContainer}>
                    {
                      allImages.length > 1 && currentCarouselImage < allImages.length-1
                      ? <div 
                        className={`${styles.arrowRight} ${styles.arrow}`}
                        onClick={nextCarousel}
                      >
                        <MdOutlineArrowForwardIos /></div>
                      : <></>
                    }

                    {
                      allImages.length > 1 && currentCarouselImage > 0
                      ? 
                        <div 
                          className={`${styles.arrowLeft} ${styles.arrow}`}
                          onClick={backCarousel}
                        ><MdOutlineArrowBackIos /></div>
                      : <></>
                    }
        
                    { allImages[currentCarouselImage] }

                  </div>
                )
              : <></>
            }
          </div>
          <div className={styles.imageCount}>
            { 
              allImages.length > 1 
              ? allImages.map((item, index) => 
                index !== currentCarouselImage
                ? <div key={index} className={`${styles.unSelected} ${styles.roundedOption}`}></div>
                : <div key={index} className={`${styles.selected} ${styles.roundedOption}`}></div>
              ) 
              : <></>
            }
          </div>        
        </section>

        <footer>
          <div>
            <div className={`${styles.like} ${isLoading.like ? styles.disabled : ""}`} onClick={handleNewLike}>
              { isActionType.like ? <AiFillLike /> : <AiOutlineLike /> } { likes.length }
            </div>

            <div 
              className={`${styles.dislike} ${isLoading.dislike ? styles.disabled : ""}`} 
              onClick={handleNewDislike}
            >
              { isActionType.dislike ? <AiFillDislike /> : <AiOutlineDislike /> } { dislikes.length }
            </div>

            <div className={styles.comments} onClick={() => setShowComments(showComments == false)}>
              <AiOutlineComment /> Comentários 
            </div>
          </div>

          <div className={styles.publicationDate}>
            { postInfo.created_on }
          </div>
        </footer>
        <div className={styles.previewActions}>
          <div className={styles.userImages}>
            {
              previewActions.map((action) => 
                <div key={action.user_id} style={{borderColor: action.like ? "blue" : "red" }} className={styles.previewImage}>
                  <img src={action.image_url}/>
                </div>
              )
            }
          </div>

          <div className={styles.usernamesPreview}>
            { previewActions.length > 0 ? (
                <>
                  {previewActions.map(
                    (action, index) =>
                      <span key={action.user_id}>
                        <Link href={`/profile/${action.user_id}`}>
                        { action.username?.split(" ")[0] + (index+1 < previewActions.length ? ", " : "") } 
                        </Link>
                      </span>
                  )}
                  { previewActions.length > 1 ? 
                    likes.length+dislikes.length > 4 ? " e outras "+(likes.length+dislikes.length-4)+" reagiram." : " reagiram" 
                    : " reagiu." 
                  }
                  <span 
                    className={styles.seeAll}
                    onClick={() => setModalIsOpen(true)}
                  >ver todos</span>
                </>
              )
              : ""
            }
          </div>
        </div>

        { showComments ? (
         <Comments
            postID={postInfo.id}
          />
        ) : ("")}

      </div>
    );

  else if (postIsDeleted == 1)
    return (
      <div className={styles.deletedPost}>
        <div>Esta postagem foi removida</div>
      </div>
  );

  else return <></>;
  
}