import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../services/api";
import { Comments } from "./Comments";
import { AiOutlineLike, AiOutlineComment, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";

import Link from "next/link";
import NextImage from "next/image";

import styles from "./Post.module.scss";
import { isMobile } from "react-device-detect";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

export interface PostBody {
  id: number;
  content: string;
  created_on: string;
  fk_user_id: string;
  image_url: string;
  dislikes_amount: number;
  likes_amount: number;
  username: string;
  images: string;
}

interface PostProps {
  data: PostBody;
  time: number | undefined;
  currentUserId: string;
}


export function Post({ data: postInfo, time, currentUserId }: PostProps) {
  const [loadingLike, setLoadingLike] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentsAmount, setCommentsAmount] = useState(null);

  const postWidthRef = useRef(null);
  const [allImages, setAllImages] = useState([]);
  const [currentCarouselImage, setCurrentCarouselImage] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [postIsDeleted, setPostIsDeleted] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [action, setAction] = useState({
    isLike: false,
    isDislike: false,
    userAction: 0,
    likeAmount: Number(postInfo.likes_amount),
    dislikeAmount: Number(postInfo.dislikes_amount)
  });

  useEffect(() => {
    let images = postInfo.images?.split(",") || [];

    if (images.length > 0) {
      let preloadImages = [];
      
      for (let c = 0; c < images.length; c++) {
        preloadImages.push(
          <img 
            src={process.env.NEXT_PUBLIC_SERVER_URL+"/images/"+images[c]}
            style={{ maxHeight: (isMobile ? 100/100 : 60/100)*postWidthRef.current?.clientWidth }}
          />
        );
      }
  
      setAllImages([ ...preloadImages ]);
    }
  }, []);

  useEffect(() => {
    setLoadingLike(true);

    setTimeout(async () => {
      const {data} = await api.get(`/posts/user-liked-post/${postInfo.id}/${currentUserId}`);

      setLoadingLike(false);

      if (data.type === "like") {
        setAction({ ...action, isLike: true, userAction: 1 });
      } else if (data.type === "dislike") {
        setAction({ ...action, isDislike: true, userAction: 2 });
      }

    }, time);
  }, []);

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

  function handleLike(type: string) {
    if (!loadingLike) {
      if (type === "mouseEnter") {
        setAction({ ...action, isLike: true });
      }
      else if (action.userAction !== 1) {
        setAction({ ...action, isLike: false });
      }
    }
  }

  function handleDislike(type: string) {
    if (!loadingLike) {

      if (type === "mouseEnter") {
        setAction({ ...action, isDislike: true });
      }
      else if (action.userAction != 2) {
        setAction({ ...action, isDislike: false });
      }
    }
  }

  async function handleNewLike() {
    if (!loadingLike) {
      console.log("New like")
      const oldUserAction = action.userAction;

      if (action.userAction == 1) { // Remove like
        setAction({
          isLike: false,
          isDislike: false,
          userAction: 0,
          likeAmount: action.likeAmount-1,
          dislikeAmount: action.dislikeAmount
        });

        const { data } = await api.post(`/posts/delete-action`, {
          userID: currentUserId,
          postID: postInfo.id,
          action: "Like"
        });

        console.log("remove Like aprovado")

        if (!data.success) {
          setAction({
            isLike: true,
            isDislike: false,
            userAction: oldUserAction,
            likeAmount: action.likeAmount+1,
            dislikeAmount: action.dislikeAmount
          });

          alert("Ocorreu um erro ao remover curtida")
        }

      } else { // Add like
        setAction({
          isLike: true,
          isDislike: false,
          userAction: 1,
          likeAmount: action.likeAmount+1,
          dislikeAmount: oldUserAction == 2 ? action.dislikeAmount-1 : action.dislikeAmount
        });

        const { data } = await api.put("/posts/new-action", {
          userID: currentUserId,
          postID: postInfo.id,
          action: "Like",
          deleteOthers: oldUserAction == 2
        });

        console.log("Like aprovado");

        if (!data.success) { // Error
          setAction({
            isLike: false,
            isDislike: oldUserAction == 2,
            userAction: oldUserAction,
            likeAmount: action.likeAmount-1,
            dislikeAmount: oldUserAction == 2 ? action.dislikeAmount+1 : action.dislikeAmount
          });

          alert("Erro ao adicionar curtida");
        }
      }
    }
  }

  async function handleNewDislike() {
    if (!loadingLike) {
      console.log("New dislike");
      const oldUserAction = action.userAction;

      if (action.userAction == 2) { // Remove dislike
        setAction({
          isLike: false,
          isDislike: false,
          userAction: 0,
          likeAmount: action.likeAmount,
          dislikeAmount: action.dislikeAmount-1
        });

        const { data } = await api.post(`/posts/delete-action`, {
          userID: currentUserId,
          postID: postInfo.id,
          action: "Dislike"
        });

        console.log("remove Dislike aprovado")

        if (!data.success) { // error
          setAction({
            isLike: false,
            isDislike: true,
            userAction: oldUserAction,
            likeAmount: action.likeAmount,
            dislikeAmount: action.dislikeAmount+1
          });

          alert("Ocorreu um erro ao remover curtida")
        }

      } else { // Add dislike
        setAction({
          isLike: false,
          isDislike: true,
          userAction: 2,
          likeAmount: oldUserAction == 1 ? action.likeAmount-1 : action.likeAmount,
          dislikeAmount: action.dislikeAmount+1
        })

        const { data } = await api.put("/posts/new-action", {
          userID: currentUserId,
          postID: postInfo.id,
          action: "Dislike",
          deleteOthers: oldUserAction == 1
        });

        console.log("Dislike aprovado")

        if (!data.success) {
          setAction({
            isLike: oldUserAction == 1,
            isDislike: false,
            userAction: oldUserAction,
            likeAmount: oldUserAction == 1 ? action.likeAmount+1 : action.likeAmount,
            dislikeAmount: action.dislikeAmount-1
          })

          alert("Erro ao adicionar curtida")
        }
      }

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
    const { data } = await api.delete(`/posts/${currentUserId}/${postInfo.fk_user_id}/${postInfo.id}`)
    setDeleteLoading(false);

    if (data.success) {
      setPostIsDeleted(true);
    } else {
      alert("Erro ao deletar post");
    }
  }

  if (!postIsDeleted)
    return (
      <div 
        style={deleteLoading ? { opacity: "0.5", userSelect: "none" } : null}
        className={styles.post} 
        onClick={(e) => onClickOutsideDropdown(e.target, e)}
      >
        <header>
          <div className={styles.profileInfo}>
            <div className={styles.profilePictureContainer}>
              <NextImage
                alt={"user profile"}
                src={postInfo.image_url}
                width={"100%"}
                height={"100%"}
              />
            </div>

            <div className={styles.username}>
              <Link href={`/profile/${postInfo.fk_user_id}`}>
                <a>
                  {postInfo.username}
                </a>
              </Link>
            </div>
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
                  <>
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
                  </>
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
            <div className={styles.like}
              onMouseEnter={() => handleLike("mouseEnter")}
              onMouseLeave={() => handleLike("mouseLeave")}
              onClick={handleNewLike}
            >
              {
                loadingLike
                ? (
                  <div style={{ color: "gray" }}>
                    <AiOutlineLike style={{ color: "gray" }} /> 0
                  </div>
                ) : (
                  <>
                    { action.isLike ? <AiFillLike  /> : <AiOutlineLike /> }
                    { action.likeAmount }
                  </>
                )
              }
            </div>

            <div
              className={styles.dislike}
              onMouseEnter={() => handleDislike("mouseEnter")}
              onMouseLeave={() => handleDislike("mouseLeave")}
              onClick={handleNewDislike}
            >
              {
                loadingLike
                ? (
                  <div style={{ color: "gray" }}>
                    <AiFillDislike style={{ color: "gray" }} /> 0
                  </div>
                ) : (
                  <>
                    { action.isDislike ? <AiFillDislike  /> : <AiOutlineDislike /> }
                    { action.dislikeAmount }
                  </>
                )
              }
            </div>

            <div className={styles.comments} onClick={() => setShowComments(showComments == false)}>
              <AiOutlineComment /> Comentários { commentsAmount == null ? "" : "("+commentsAmount+")" }
            </div>
          </div>

          <div className={styles.publicationDate}>
            {
              postInfo.created_on.replace(",", "/").replace(",", "/").replace(",", " às " )
            }
          </div>
        </footer>

        {
          showComments
          ? <Comments
              setCommentsAmount={setCommentsAmount}
              postID={postInfo.id}
            />
          : <></>
        }

      </div>
    );
  else 
    return (
      <div className={styles.deletedPost}>
        <div>Esta postagem foi removida</div>
      </div>
  )
}