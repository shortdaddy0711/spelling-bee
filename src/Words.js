import Arr from './wordlist.js';
import './App.css';
import ReactTooltip from 'react-tooltip';

const handleError = (err) => {
	console.warn(err);
	return new Response(
		JSON.stringify({
			code: 400,
			message: 'no file',
		})
	);
};

// const existsFile = (url) => {
// 	var http = new XMLHttpRequest();
// 	http.open('HEAD', url, false);
// 	http.send();
// 	return http.status !== 404;
// }

const handleClick = async (e) => {
	const apiKey = 'bfeb2a4a-ffee-41b8-b569-b9ace72651d6';
	const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${e.target.innerText}?key=${apiKey}`;
	fetch(url)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			const fileName = data[0].hwi.prs[0].sound.audio;
			const fileUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${fileName[0]}/${fileName}.mp3`;
			const pronounce = new Audio(fileUrl);
            if (typeof pronounce.duration === 'number') {
                pronounce.onloadedmetadata = () => {
					console.log(pronounce.duration);
				};
				pronounce.onload = pronounce.play();
			}
		})
		.catch(handleError);
};

const Words = () => {
	const arr1 = [...Arr.str1];
	const arr2 = [...Arr.str2];
	const arr3 = [...Arr.str3];
	return (
		<>
			<div>
				{arr1.map((word) => (
					<button
						data-tip
						data-for={word}
						onClick={handleClick}
						className='word-list1'
					>
						{word}
					</button>
				))}
			</div>
			<div>
				{arr2.map((word) => (
					<button
						data-tip
						data-for='shortDef'
						onClick={handleClick}
						className='word-list2'
					>
						{word}
					</button>
				))}
			</div>
			<div>
				{arr3.map((word) => (
					<button
						data-tip
						data-for='shortDef'
						onClick={handleClick}
						className='word-list3'
					>
						{word}
					</button>
				))}
			</div>
			<ReactTooltip id='shortDef' place='top' effect='solid'>
				tooltip test
			</ReactTooltip>
		</>
	);
};

export default Words;

// fetch(
// 	'https://ssl.gstatic.com/dictionary/static/sounds/20200429/patrol--_us_1.mp3',
// 	{
// 		headers: {
// 			accept: '*/*',
// 			'accept-language': 'en-US,en;q=0.9',
// 			range: 'bytes=0-',
// 			'sec-fetch-dest': 'audio',
// 			'sec-fetch-mode': 'no-cors',
// 			'sec-fetch-site': 'cross-site',
// 			'sec-gpc': '1',
// 		},
// 		referrer: 'http://localhost:3000/',
// 		referrerPolicy: 'strict-origin-when-cross-origin',
// 		body: null,
// 		method: 'GET',
// 		mode: 'cors',
// 		credentials: 'omit',
// 	}
// );
