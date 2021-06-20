import { useEffect, useState } from 'react';

export default function useResponsiveUnits() {
	const [width, setWidth] = useState(600);
	const [height, setHeight] = useState(800);

	const mobileScreen = width <= 600;
	const tabletScreen = width > 600 || width <= 1024;
	const desktopScreen = width > 1024;

	useEffect(() => {
		changeDimensions();
		window.addEventListener('resize', changeDimensions);

		return () => window.removeEventListener('resize', changeDimensions);
	}, []);

	function changeDimensions() {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}

	return { width, height, mobileScreen, tabletScreen, desktopScreen };
}
