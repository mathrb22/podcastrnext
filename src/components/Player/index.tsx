import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

export function Player() {
	const { episodeList, currentEpisodeIndex } = useContext(PlayerContext);

	const episode = episodeList[currentEpisodeIndex];

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src='/playing.svg' alt='Tocando agora' />
				<strong>Tocando agora: {episode?.title}</strong>
			</header>

			<div className={styles.emptyPlayer}>
				<strong>Selecione um podcast para ouvir</strong>
			</div>
			<footer className={styles.empty}>
				<div className={styles.progress}>
					<span>00:00</span>
					<div className={styles.slider}>
						<div className={styles.emptySlider} />
					</div>
					<span>00:00</span>
				</div>

				<div className={styles.buttons}>
					<button type='button'>
						<img src='/shuffle.svg' alt='Embaralhar' />
					</button>
					<button type='button'>
						<img src='/play-previous.svg' alt='Tocar anterior' />
					</button>
					<button className={styles.playButton} type='button'>
						<img src='/play.svg' alt='Tocar' />
					</button>
					<button type='button'>
						<img src='/play-next.svg' alt='Tocar próximo' />
					</button>
					<button type='button'>
						<img src='/repeat.svg' alt='Repetir' />
					</button>
				</div>
			</footer>
		</div>
	);
}
