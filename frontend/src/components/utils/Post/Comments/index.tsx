import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiMessageAltX } from "react-icons/bi";
import { MdAddCircle } from "react-icons/md";
import { BsArrowReturnRight } from "react-icons/bs";
import { ImSpinner } from "react-icons/im";
import { api } from "../../../../services/api";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./Comments.module.scss";


export function Comments({ postID }) {
	const [allComments, setAllComments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newCommentLoading, setNewCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
	const { user } = useAuth();

	async function getComments() {
		setIsLoading(true);

		const { data } = await api().get(`/posts/comments/${postID}`);

		setIsLoading(false);

		if (data.success) {
			console.log("success")

			setAllComments(data.comments)

		} else {
			alert("Erro ao buscar comentários");
		}
	}

	async function handleAddComment() {
		setNewComment("");
		setNewCommentLoading(true);

		const { data } = await api().put("/posts/new-comment", { 
			postID, 
			userID: user?.id, 
			content: newComment
		});

		setNewCommentLoading(false);

		if (data.success) {
			getComments();
		} else {
			alert("Erro ao adicionar comentário");
		}

	}

	useEffect(() => {
		getComments();
	}, []);

	return (
		<div className={styles.commentsContainer}>
			<h3>Comentários</h3>

			<hr />

			<div className={styles.content}>
	      <div className={styles.newCommentContainer}>
	        <input 
	          type="text" 
	          value={newComment}
	          placeholder={"Diga algo sobre essa publicação"}
	          onChange={({target}) => newComment.length < 200 ? setNewComment(target.value) : null}
	        />

	        <button 
	        	disabled={newComment.length == 0}
	        	onClick={handleAddComment}
	        	className={newCommentLoading ? "loadingContainer" : ""}
	        ><MdAddCircle /></button>
	      </div>

				<div 
					className={`
						${styles.commentLimit} 
						${newComment.length < 100 ? styles.commentLimitOk : newComment.length < 200 ? styles.commentLimitWarning : styles.commentLimitFull}`
					}
				>
					{newComment.length}/200
				</div>

				{
					isLoading ? <div id={styles.loading} className="loadingContainer"><ImSpinner /></div> : <></>
				}
				{
					allComments.length == 0 
					? <div className={styles.notHaveComments}><BiMessageAltX/> Nenhum comentário disponível</div>
					:
					allComments.map((comment) => 
						<div key={comment.commentID} className={styles.comment}>

							<header>
								<Link href={`/profile/${comment.userID}`}>
									<a>
										<div className={styles.imageContainer}>
											<img 
												src={comment.image_url}
												alt={"comment user"}
											/>
										</div>

										<div className={styles.username}>{comment.username}</div>
									</a>
								</Link>

								<div className={styles.createdOn}>
									{comment.created_on.replace(",", "/").replace(",", "/").replace(",", " às " )}
								</div>
							</header>

							<section>
								<BsArrowReturnRight/>
								
								<div className={styles.data}>
									{ comment.content }
								</div>	
							</section>


						</div>
					)
				}
			</div>
		</div>
	);
}