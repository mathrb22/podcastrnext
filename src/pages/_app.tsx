import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

	function play(episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
	}

	return (
		<PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps} />;
				</main>
				<Player />
			</div>
		</PlayerContext.Provider>
	);
}

export default MyApp;
