import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

type ThemeContextData = {
	isDarkMode: boolean;
	switchTheme: (isDarkMode: boolean) => void;
};

export const ThemeContext = createContext({} as ThemeContextData);

type ThemeContextProviderProps = {
	children: ReactNode;
};

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const currentTheme = localStorage.getItem('@podcastrnext/theme');
		if (currentTheme) {
			switchTheme(currentTheme === 'darkTheme');
		}
	}, []);

	function switchTheme(isDarkMode: boolean) {
		if (isDarkMode) {
			localStorage.setItem('@podcastrnext/theme', 'darkTheme');
			document.body.classList.add('darkMode');
			setIsDarkMode(true);
		} else {
			localStorage.setItem('@podcastrnext/theme', 'lightTheme');
			document.body.classList.remove('darkMode');
			setIsDarkMode(false);
		}
	}

	return (
		<ThemeContext.Provider
			value={{
				isDarkMode,
				switchTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	return useContext(ThemeContext);
};
