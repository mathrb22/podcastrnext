import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContextProvider';

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	url: string;
	duration: number;
	durationAsString: string;
};

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	const { playList } = usePlayer();
	const { isDarkMode } = useTheme();
	const episodeList = [...latestEpisodes, ...allEpisodes];

	return (
		<div className='scrollableContent'>
			<div className={styles.homePage}>
				<Head>
					<title>Home | Podcastr</title>
				</Head>
				<section className={styles.latestEpisodes}>
					<h2>Últimos lançamentos</h2>
					<ul>
						{latestEpisodes.map((episode, index) => {
							return (
								<li key={episode.id}>
									<Image
										width={192}
										height={192}
										src={episode.thumbnail}
										alt={episode.title}
										objectFit='cover'
									/>

									<div className={styles.episodeDetails}>
										<Link href={`/episodes/${episode.id}`}>
											<a className={isDarkMode ? styles.light : ''}>{episode.title}</a>
										</Link>
										<span>{episode.publishedAt}</span>
										<span>{episode.durationAsString}</span>
									</div>

									<button
										className={isDarkMode && styles.btnGreen}
										type='button'
										onClick={() => playList(episodeList, index)}>
										<img
											src={isDarkMode ? '/play.svg' : '/play-green.svg'}
											alt='Tocar episódio'
											title='Tocar episódio'
										/>
									</button>
								</li>
							);
						})}
					</ul>
				</section>
				<section className={styles.allEpisodes}>
					<h2>Todos episódios</h2>
					<ul className={styles.listAll}>
						{allEpisodes.map((episode, index) => {
							return (
								<li key={episode.id}>
									<div className={styles.thumbnail}>
										<Image
											width={576}
											height={576}
											src={episode.thumbnail}
											alt={episode.title}
											objectFit='cover'
										/>
									</div>

									<div className={styles.episodeDetails}>
										<Link href={`/episodes/${episode.id}`}>
											<a className={isDarkMode ? styles.light : ''}>{episode.title}</a>
										</Link>
										{/* <p>{episode.members}</p> */}
										<span>{episode.publishedAt}</span>
										<span>{episode.durationAsString}</span>
									</div>
									<button
										className={isDarkMode && styles.btnGreen}
										type='button'
										onClick={() => playList(episodeList, index + latestEpisodes.length)}>
										<img
											src={isDarkMode ? '/play.svg' : '/play-green.svg'}
											alt='Tocar episódio'
											title='Tocar episódio'
										/>
									</button>
								</li>
							);
						})}
					</ul>
				</section>
			</div>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'MMM yyyy', {
				locale: ptBR,
			}),
			thumbnail: episode.thumbnail,
			url: episode.file.url,
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
		};
	});

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes,
			allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	};
};
