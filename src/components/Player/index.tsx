import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import useResponsiveUnits from '../../hooks/useResponsiveUnits';

export function Player() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [progress, setProgress] = useState(0);
	const { desktopScreen } = useResponsiveUnits();
	const [isExpanded, setIsExpanded] = useState(false);

	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		togglePlay,
		setPlayingState,
		playPrevious,
		playNext,
		hasPrevious,
		hasNext,
		isLooping,
		toggleLoop,
		isShuffling,
		toggleShuffle,
		clearPlayerState,
	} = usePlayer();

	useEffect(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	function setupProgressListener() {
		audioRef.current.currentTime = 0;

		audioRef.current.addEventListener('timeupdate', () => {
			setProgress(Math.floor(audioRef.current.currentTime));
		});
	}

	function handleSeek(amount: number) {
		audioRef.current.currentTime = amount;
		setProgress(amount);
	}

	function handleEpisodeEnded() {
		if (hasNext) {
			playNext();
		} else {
			clearPlayerState();
		}
	}

	const episode = episodeList[currentEpisodeIndex];

	return (
		<div className={styles.playerContainer}>
			{(desktopScreen || isExpanded) && (
				<>
					{!desktopScreen && <div className={styles.expandContainer}></div>}
					<header>
						<img src='/playing.svg' alt='Tocando agora' />
						<strong>Tocando agora</strong>
					</header>

					{episode ? (
						<div className={styles.currentEpisode}>
							<Image
								width={592}
								height={592}
								src={episode.thumbnail}
								objectFit='cover'
							/>
							<div className={styles.episodeInfo}>
								<strong>{episode.title}</strong>
								<span>{episode.members}</span>
							</div>
						</div>
					) : (
						<div className={styles.emptyPlayer}>
							<strong>Selecione um podcast para ouvir</strong>
						</div>
					)}

					<footer className={!episode ? styles.empty : styles.playing}>
						<div className={styles.progress}>
							<span>{convertDurationToTimeString(progress)}</span>
							<div className={styles.slider}>
								{episode ? (
									<Slider
										max={episode.duration}
										value={progress}
										onChange={handleSeek}
										trackStyle={{ backgroundColor: '#04d361' }}
										railStyle={{ backgroundColor: '#9f75ff' }}
										handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
									/>
								) : (
									<div className={styles.emptySlider} />
								)}
							</div>
							<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
						</div>

						{episode && (
							<audio
								src={episode.url}
								ref={audioRef}
								autoPlay
								loop={isLooping}
								onLoadedMetadata={setupProgressListener}
								onPlay={() => setPlayingState(true)}
								onPause={() => setPlayingState(false)}
								onEnded={handleEpisodeEnded}
							/>
						)}

						<div className={styles.buttons}>
							<button
								type='button'
								disabled={!episode || episodeList.length === 1}
								onClick={toggleShuffle}
								className={
									isShuffling && episodeList.length > 1 ? styles.isActive : ''
								}>
								<img src='/shuffle.svg' alt='Embaralhar' />
							</button>
							<button
								type='button'
								disabled={!episode || !hasPrevious || episodeList.length === 1}
								onClick={playPrevious}>
								<img src='/play-previous.svg' alt='Tocar anterior' />
							</button>
							<button
								type='button'
								className={styles.playButton}
								disabled={!episode}
								onClick={togglePlay}>
								{isPlaying ? (
									<img src='/pause.svg' alt='Pausar' />
								) : (
									<img src='/play.svg' alt='Tocar' />
								)}
							</button>
							<button
								type='button'
								disabled={!episode || !hasNext || episodeList.length === 1}
								onClick={playNext}>
								<img src='/play-next.svg' alt='Tocar próximo' />
							</button>
							<button
								type='button'
								disabled={!episode}
								onClick={toggleLoop}
								className={isLooping ? styles.isActive : ''}>
								<img src='/repeat.svg' alt='Repetir' />
							</button>
						</div>
					</footer>
				</>
			)}
			{!desktopScreen && (
				<>
					{episode ? (
						<div className={styles.mobilePlayer}>
							<Image
								width={592}
								height={592}
								src={episode.thumbnail}
								objectFit='cover'
							/>
							<div className={styles.currentEpisode}>
								<div className={styles.episodeInfo}>
									<strong>{episode.title}</strong>
									<div className={styles.progress}>
										<span>{convertDurationToTimeString(progress)}</span>
										<div className={styles.slider}>
											{episode ? (
												<Slider
													max={episode.duration}
													value={progress}
													onChange={handleSeek}
													trackStyle={{ backgroundColor: '#04d361' }}
													railStyle={{ backgroundColor: '#9f75ff' }}
													handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
												/>
											) : (
												<div className={styles.emptySlider} />
											)}
										</div>
										<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className={styles.emptyPlayer}>
							<strong>Selecione um podcast para ouvir</strong>
						</div>
					)}
					<footer className={!episode ? styles.empty : styles.playing}>
						{episode && (
							<audio
								src={episode.url}
								ref={audioRef}
								autoPlay
								loop={isLooping}
								onLoadedMetadata={setupProgressListener}
								onPlay={() => setPlayingState(true)}
								onPause={() => setPlayingState(false)}
								onEnded={handleEpisodeEnded}
							/>
						)}

						<div className={styles.buttons}>
							<button
								type='button'
								disabled={!episode || episodeList.length === 1}
								onClick={toggleShuffle}
								className={isShuffling ? styles.isActive : ''}>
								<img src='/shuffle.svg' alt='Embaralhar' />
							</button>
							<button
								type='button'
								disabled={!episode || !hasPrevious}
								onClick={playPrevious}>
								<img src='/play-previous.svg' alt='Tocar anterior' />
							</button>
							<button
								type='button'
								className={styles.playButton}
								disabled={!episode}
								onClick={togglePlay}>
								{isPlaying ? (
									<img src='/pause.svg' alt='Pausar' />
								) : (
									<img src='/play.svg' alt='Tocar' />
								)}
							</button>
							<button type='button' disabled={!episode || !hasNext} onClick={playNext}>
								<img src='/play-next.svg' alt='Tocar próximo' />
							</button>
							<button
								type='button'
								disabled={!episode}
								onClick={toggleLoop}
								className={isLooping ? styles.isActive : ''}>
								<img src='/repeat.svg' alt='Repetir' />
							</button>
						</div>
					</footer>
				</>
			)}
		</div>
	);
}
