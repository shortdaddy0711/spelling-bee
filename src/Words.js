import React, { useState, useEffect } from 'react';
import { diffChars } from 'diff';
import Arr from './wordlist.js';
import './App.css';

const Words = () => {
	const [level, setLevel] = useState('level1');
	const [words, setWords] = useState([]);
	const [showWords, setShowWords] = useState({});
	const [current, setCurrent] = useState('');

	const handleWords = () => {
		let wordsObj = {};
		let randWords = Arr[level]
			.sort(() => Math.random() - Math.random())
			.slice(0, 20);
		randWords.forEach((word) => {
			wordsObj[word] = false;
		});
		setWords(randWords);
		setShowWords(wordsObj);
	};

	const handleShow = (e) => {
		const key = e.target.value;
		const wordsObj = showWords;
		wordsObj[key] = true;
		console.log(wordsObj);
		setShowWords(wordsObj);
		setCurrent(key);
	};

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

	const handleSpeech = (event) => {
		const speech = window.webkitSpeechRecognition;

		const recog = new speech();

		recog.onstart = () => {
			console.log('voice recognition is on!');
		};

		recog.onspeechend = () => {
			recog.stop();
			console.log('voice recognition is over!');
		};

		recog.onresult = (e) => {
			const index = e.resultIndex;
			const transcript = e.results[index][0].transcript
				.split(' ')
				.join('')
				.toLowerCase();
			const word = event.target.closest('button').value;
			console.log(word, ' : ', transcript);
			const diff = diffChars(word, transcript, true);
			let result = [];
			diff.forEach((part) => {
				// green for additions, red for deletions
				// grey for common parts
				result.push(
					part.added
						? `+${part.value}`
						: part.removed
						? `-${part.value}`
						: ''
				);
			});
			console.log(result);
		};
		recog.start();
	};

	useEffect(() => {
		console.log(current);
		return () => {
			console.log();
		}
	}, [current])

	return (
		<div className='body'>
			<div className='header'>
				<div className='logo'>
					<i className='fas fa-frog'></i>
				</div>
				<button
					className='btn-level'
					onClick={() => {
						setLevel('level1');
						handleWords();
					}}
				>
					3rd Grade
				</button>
				<button
					className='btn-level'
					onClick={() => {
						setLevel('level2');
						handleWords();
					}}
				>
					4th Grade 1
				</button>
				<button
					className='btn-level'
					onClick={() => {
						setLevel('level3');
						handleWords();
					}}
				>
					4th Grade 2
				</button>
			</div>
			<div className='container'>
				{words.map((word, i) => (
					<div className={level} key={i}>
						<div className='word-question-number'>Q.{i + 1}</div>
						<div className='word-element'>
							{showWords[word] ? word : '?'}
						</div>
						<div className='btn-control'>
							<button
								className='btn-play'
								onClick={handlePlay}
								value={word}
							>
								<i className='fas fa-play'></i>
							</button>
							<button
								className='btn-recog'
								onClick={handleSpeech}
								value={word}
							>
								<i className='fas fa-microphone-alt'></i>
							</button>
						</div>
						<div>
							<button
								className='btn-show-word'
								onClick={handleShow}
								value={word}
							>
								Show word
							</button>
						</div>
					</div>
				))}
			</div>
			<div>{}</div>
		</div>
	);
};

export default Words;
