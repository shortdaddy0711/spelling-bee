import React, { useState } from 'react';
import Arr from './wordlist.js';
import './App.css';

const handleError = (err) => {
	console.warn(err);
	return new Response(
		JSON.stringify({
			code: 400,
			message: 'no file',
		})
	);
};

const handlePlay = async (e) => {
	const apiKey = 'bfeb2a4a-ffee-41b8-b569-b9ace72651d6';
	console.log(e.target.value);
	const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${
		e.target.closest('button').value
	}?key=${apiKey}`;
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


const handleSpeech = (e) => {
	const speech = window.webkitSpeechRecognition;

	const recog = new speech();

	recog.onstart = () => {
		console.log("voice recognition is on!");
	}

	recog.onspeechend = () => {
		recog.stop();
		console.log("voice recognition is over!")
	}

	recog.onresult = (e) => {
		const index = e.resultIndex;
		const transcript = e.results[index][0].transcript;
		console.log(transcript);
	}
	
	recog.start();
}

const Words = () => {
	const arr1 = [...Arr.str1]
		.sort(() => Math.random() - Math.random())
		.slice(0, 20);
	const arr2 = [...Arr.str2]
		.sort(() => Math.random() - Math.random())
		.slice(0, 20);
	const arr3 = [...Arr.str3]
		.sort(() => Math.random() - Math.random())
		.slice(0, 20);

	const [level, setLevel] = useState(1);

	return (
		<>
			<div className='header'>
				<div className='logo'>
					<i class='fas fa-frog'></i>
				</div>
				<button className='btn-level' onClick={() => setLevel(1)}>
					Level1
				</button>
				<button className='btn-level' onClick={() => setLevel(2)}>
					Level2
				</button>
				<button className='btn-level' onClick={() => setLevel(3)}>
					Level3
				</button>
			</div>
			<div>
				<div className='container'>
					{level === 1
						? arr1.map((word) => (
								<div className='word-list1'>
									<div className='word-element' key={word}>
										{word}
									</div>
									<button
										className='btn-show'
										onClick={handlePlay}
										value={word}
									>
										<i class='fas fa-play'></i>
									</button>
									<button
										className='btn-show'
										onClick={handleSpeech}
									>
										<i class='fas fa-microphone-alt'></i>
									</button>
								</div>
						  ))
						: ''}
				</div>
				{/* <div>
					{level === 2
						? arr2.map((word) => (
								<button
									onClick={handleClick}
									className='word-list2'
									key={word}
								>
									{word}
								</button>
						  ))
						: ''}
				</div>
				<div>
					{level === 3
						? arr3.map((word) => (
								<button
									onClick={handleClick}
									className='word-list3'
									key={word}
								>
									{word}
								</button>
						  ))
						: ''}
				</div> */}
			</div>
		</>
	);
};

export default Words;
