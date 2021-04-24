import { createContext, ReactNode, useContext, useState } from 'react';

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
	isPlaying: boolean;
	play: (episode) => void;
	playList: (list: Episode[], index: number) => void;
	togglePlay: () => void;
	setPlayingState: (state: boolean) => void;
	playPrevious: () => void;
	playNext: () => void;
	hasPrevious: boolean;
	hasNext: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
	children: ReactNode;
};

export function PlayerContextProvider({
	children,
}: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	function play(episode: Episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function playList(list: Episode[], index: number) {
		setEpisodeList(list);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	const hasPrevious = currentEpisodeIndex > 0;
	const hasNext = currentEpisodeIndex + 1 < episodeList.length;

	function playNext() {
		if (!hasNext) {
			return;
		}
		setCurrentEpisodeIndex(currentEpisodeIndex + 1);
	}

	function playPrevious() {
		if (!hasPrevious) {
			return;
		}
		setCurrentEpisodeIndex(currentEpisodeIndex - 1);
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				play,
				togglePlay,
				setPlayingState,
				playList,
				playPrevious,
				playNext,
				hasPrevious,
				hasNext,
			}}>
			{children}
		</PlayerContext.Provider>
	);
}

export const usePlayer = () => {
	return useContext(PlayerContext);
};
