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
	isLooping: boolean;
	isShuffling: boolean;
	hasPrevious: boolean;
	hasNext: boolean;
	play: (episode) => void;
	playList: (list: Episode[], index: number) => void;
	togglePlay: () => void;
	setPlayingState: (state: boolean) => void;
	playPrevious: () => void;
	playNext: () => void;
	toggleLoop: () => void;
	toggleShuffle: () => void;
	clearPlayerState: () => void;
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
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

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

	function toggleLoop() {
		setIsLooping(!isLooping);
	}

	function toggleShuffle() {
		setIsShuffling(!isShuffling);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	const hasPrevious = isShuffling || currentEpisodeIndex > 0;
	const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

	function playNext() {
		if (isShuffling) {
			const nextRandomEpisodeIndex = Math.floor(
				Math.random() * episodeList.length
			);
			setCurrentEpisodeIndex(nextRandomEpisodeIndex);
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1);
		}
	}

	function playPrevious() {
		if (hasPrevious) {
			if (isShuffling) {
				const previousRandomEpisodeIndex = Math.floor(
					Math.random() * episodeList.length
				);
				setCurrentEpisodeIndex(previousRandomEpisodeIndex);
			} else {
				setCurrentEpisodeIndex(currentEpisodeIndex - 1);
			}
		}
	}

	function clearPlayerState() {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				play,
				togglePlay,
				isLooping,
				toggleLoop,
				setPlayingState,
				playList,
				playPrevious,
				playNext,
				hasPrevious,
				hasNext,
				isShuffling,
				toggleShuffle,
				clearPlayerState,
			}}>
			{children}
		</PlayerContext.Provider>
	);
}

export const usePlayer = () => {
	return useContext(PlayerContext);
};
