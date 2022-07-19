import { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ImSpinner } from "react-icons/im";
import Image from "next/image";
import Link from "next/link";

import styles from "./Comments.module.scss";


export function Comments({ postID }) {
	const [allComments, setAllComments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	console.log("id recebido: ", postID)

	async function getComments() {
		console.log("atualizando comentários");
		setIsLoading(true);

		const { data } = await api.post("/getComments", { postID });

		setIsLoading(false);

		if (data.success) {
			console.log("success")

			setAllComments(data.comments)
		} else {
			alert("Erro ao buscar comentários");
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
				{
					isLoading ? <div id={styles.loading} className="loadingContainer"><ImSpinner /></div> : <></>
				}
				{
					allComments.map((comment) => 
						<div key={comment.commentID} className={styles.comment}>

							<header>
								<Link href={`/profile/${comment.userID}`}>
									<a>
										<div className={styles.imageContainer}>
											<Image 
												width={"100%"} 
												height={"100%"} 
												src={comment.image_url}
											/>
										</div>

										<div className={styles.username}>{comment.username}</div>
									</a>
								</Link>

								<div className={styles.createdOn}>{comment.created_on}</div>
							</header>

							<section>
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