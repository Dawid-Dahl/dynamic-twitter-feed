import React from "react";
import styled from "styled-components";
import {SocialMediaPlatforms} from "../types/types";

export type Echo = {
	id: string;
	sourceId: string;
	text: string;
	likes: number;
	sourceLikesFavorites: number;
	author: string;
	date: number;
	sourceDate: Date | string;
	sourceLink?: string;
	mediaUrl?: string;
	profileImageUrl?: string;
	platform: SocialMediaPlatforms;
};

type Props = Omit<Echo, "id">;

const Echo: React.FC<Props> = ({text, likes, author, date}) => {
	return (
		<Wrapper>
			<h3>{text}</h3>
			<p>{likes}</p>
			<p>{author}</p>
			<p>{date}</p>
		</Wrapper>
	);
};

export default Echo;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 1em;
	border-radius: var(--border-radius);
	background-color: var(--main-grey-color);
	color: white;

	h3 {
		margin: 0.4em;
		text-align: center;
	}

	p {
		margin: 0.4em;
	}
`;
