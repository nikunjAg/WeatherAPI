const API_KEY = '04dcee57703defcfb3e43c2fa7fbd2e4';

const searchPage = document.querySelector('.SearchPage');
const searchForm = document.querySelector('.SearchForm');
const searchResult = document.querySelector('.SearchResult');
const cityName = document.querySelector('.CityName');
const resultTemplate = document.querySelector('#weatherResult');
const searchError = document.querySelector('.SearchError');
let timeoutId = null;
let lastResult = null;

const scrollToTop = () => searchPage.scrollIntoView({ behavior: 'smooth' });

const backButtonClickHandler = (event) => {
	scrollToTop();
};

const formSubmitHandler = (event) => {
	event.preventDefault();

	const encodedCityName = encodeURIComponent(cityName.value);

	clearTimeout(timeoutId);
	if (!searchError.classList.contains('Hide'))
		searchError.classList.add('Hide');
	if (lastResult) lastResult.remove();

	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${encodedCityName}&appid=${API_KEY}`
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Check city name');
			}
		})
		.then((data) => {
			if (!data) throw new Error('Check city name');

			const { coord, sys, main, name, dt, visibility, wind, weather } = data;
			const weatherResult =
				resultTemplate.content.firstElementChild.cloneNode(true);

			const leftDiv = weatherResult.querySelector('.LeftDiv');
			const rightDiv = weatherResult.querySelector('.RightDiv');

			// Add the data
			// 1. To Left Div

			const dateValue =
				new Date(dt * 1000)
					.toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: 'true',
					})
					.toString()
					.toLowerCase() +
				', ' +
				new Date(dt * 1000)
					.toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
					})
					.toString();

			leftDiv.querySelector('.dateTime').textContent = dateValue;
			leftDiv.querySelector('.location').textContent =
				name + ', ' + sys.country;
			leftDiv.querySelector(
				'.currentTemperature'
			).firstElementChild.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
			leftDiv.querySelector(
				'.currentTemperature'
			).lastElementChild.textContent =
				new Number(main.temp - 273.15).toFixed(1) + ' °C';
			leftDiv.querySelector('.feelsLike > p > span').textContent =
				new Number(main.feels_like - 273.15).toFixed(1) + ' °C';
			leftDiv.querySelector(
				'.geoLocation > p:first-of-type > span'
			).textContent = coord.lat;
			leftDiv.querySelector(
				'.geoLocation > p:last-of-type > span'
			).textContent = coord.lon;

			// 1. To Right Div
			const rightDataCols = rightDiv.querySelectorAll('p > span:last-of-type');
			rightDataCols[0].textContent =
				new Number(visibility / 1000).toFixed(1) + ' km';
			rightDataCols[1].textContent =
				new Number(main.temp_max - 273.15).toFixed(1) + ' °C';
			rightDataCols[2].textContent =
				new Number(main.temp_min - 273.15).toFixed(1) + ' °C';
			rightDataCols[3].textContent = main.humidity + ' %';
			rightDataCols[4].textContent = main.pressure + ' hPa';
			rightDataCols[5].textContent = new Number(wind.speed).toFixed(1) + ' m/s';

			document.body.appendChild(weatherResult);
			weatherResult.scrollIntoView({ behavior: 'smooth' });
			weatherResult
				.querySelector('.BackButton')
				.addEventListener('click', backButtonClickHandler);

			lastResult = weatherResult;
		})
		.catch((e) => {
			searchError.classList.remove('Hide');
			timeoutId = setTimeout(() => {
				if (!searchError.classList.contains('Hide'))
					searchError.classList.add('Hide');
			}, 5000);
			console.log('Some error occurred ' + e);
		});
};

searchForm.addEventListener('submit', formSubmitHandler);
// scrollToTop();
