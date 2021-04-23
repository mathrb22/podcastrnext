import { createContext } from 'react';

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
};

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	play: (episode) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
