import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

type ThemeContextData = {
	isDarkMode: boolean;
	switchTheme: () => void;
};

export const ThemeContext = createContext({} as ThemeContextData);

type ThemeContextProviderProps = {
	children: ReactNode;
};

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (isDarkMode) {
			document.body.classList.add('darkMode');
		} else {
			document.body.classList.remove('darkMode');
		}
	}, [isDarkMode]);

	function switchTheme() {
		setIsDarkMode(!isDarkMode);
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
