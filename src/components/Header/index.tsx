import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContextProvider';
import styles from './styles.module.scss';

export function Header() {
	const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
		locale: ptBR,
	});
	const { isDarkMode, switchTheme } = useTheme();

	return (
		<header id='appHeader' className={styles.headerContainer}>
			<Link href='/'>
				<img
					src={isDarkMode ? '/podcastr-logo-light.svg' : '/podcastr-logo.svg'}
					alt='Podcastr Logo'
				/>
			</Link>
			<p> O melhor para você ouvir, sempre</p>

			<span>{currentDate}</span>

			<button
				type='button'
				onClick={() => switchTheme(!isDarkMode)}
				className={styles.themeSwitcher}>
				<img
					src={isDarkMode ? '/sun-light.svg' : '/moon-dark.svg'}
					alt='Alterar tema'
					title='Alterar tema'
				/>
			</button>
		</header>
	);
}
