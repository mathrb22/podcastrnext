import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';
import useResponsiveUnits from '../../hooks/useResponsiveUnits';
import { MdDateRange, MdPeople } from 'react-icons/md';
import { RiTimeFill } from 'react-icons/ri';

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	description: string;
	url: string;
	duration: number;
	durationAsString: string;
};

type EpisodeProps = {
	episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
	const { play } = usePlayer();
	const { mobileScreen } = useResponsiveUnits();

	return (
		<div className={styles.container}>
			<Head>
				<title>{episode.title} | Podcastr</title>
			</Head>
			<div className={styles.episode}>
				<div className={styles.thumbnailContainer}>
					<Link href='/'>
						<button type='button'>
							<img src='/arrow-left.svg' alt='Voltar' title='Voltar' />
						</button>
					</Link>
					<Image
						width={1200}
						height={700}
						src={episode.thumbnail}
						objectFit='cover'
					/>
					<button type='button' onClick={() => play(episode)}>
						<img src='/play.svg' alt='Tocar episódio' title='Tocar episódio' />
					</button>
				</div>

				<header id='info'>
					<h1>{episode.title}</h1>
					<ul>
						<li className={styles.row}>
							<MdPeople size={25} className={styles.icon} />{' '}
							<span>{episode.members}</span>
						</li>
						<li className={styles.row}>
							<MdDateRange size={25} className={styles.icon} />{' '}
							<span>{episode.publishedAt}</span>
						</li>
						<li className={styles.row}>
							<RiTimeFill size={25} className={styles.icon} />
							<span>{episode.durationAsString}</span>{' '}
						</li>
					</ul>
				</header>
				<div
					className={styles.description}
					dangerouslySetInnerHTML={{ __html: episode.description }}
				/>
			</div>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { slug } = context.params;

	const { data } = await api.get(`episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
			locale: ptBR,
		}),
		thumbnail: data.thumbnail,
		description: data.description,
		url: data.file.url,
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
	};

	return {
		props: { episode },
		revalidate: 60 * 60 * 24, // 24 hours
	};
};
