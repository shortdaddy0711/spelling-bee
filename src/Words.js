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

	const cleanResult = () => {
		words.forEach((word) => {
			let remove = document.getElementById(`${level}-${word}`);
			if (remove) {
				remove.textContent = '';
			}
		});
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
		const word = event.target.closest('button').value;
		// if (word !== current) {
		// 	alert('Listen word first!');
		// 	return;
		// }
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
			console.log(word, ' : ', transcript);
			const diff = diffChars(word, transcript, true);
			let results = [];
			diff.forEach((part) => {
				results.push(
					part.added
						? `+${part.value}`
						: part.removed
						? `-${part.value}`
						: ''
				);
			});
			let reportArr = [];
			results.forEach((r) => {
				if (r !== '') {
					reportArr.push(r);
				}
			});
			let id = `${level}-${word}`;
			console.log(id);
			let result = document.getElementById(`${level}-${word}`);
			if (reportArr.length === 0) {
				console.log(reportArr);
				result.textContent = '👍👍👍👍';
			} else {
				result.textContent = reportArr.join(', ');
			}



		};
		recog.start();
	};

	const scrollToLeft = () => {
		document.getElementById('container').scrollLeft -= 320;
	};

	const scrollToRight = () => {
		document.getElementById('container').scrollLeft += 320;
	};

	const scrollToStart = () => {
		document.getElementById('container').scrollLeft -= 10000;
	};

	useEffect(() => {
		console.log(current);
		return () => {
			console.log();
		};
	}, [current]);

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
						scrollToStart();
						handleWords();
						cleanResult();
					}}
				>
					3rd Grade
				</button>
				<button
					className='btn-level'
					onClick={() => {
						setLevel('level2');
						scrollToStart();
						handleWords();
						cleanResult();
					}}
				>
					4th Grade 1
				</button>
				<button
					className='btn-level'
					onClick={() => {
						setLevel('level3');
						scrollToStart();
						handleWords();
						cleanResult();
					}}
				>
					4th Grade 2
				</button>
			</div>
			<div className='container' id='container'>
				{words.map((word, i) => (
					<div className={level} key={i}>
						<div className='word-question-number'>Q.{i + 1}</div>
						<div className='word-element'>
							{showWords[word] ? word : '?'}
						</div>
						<div
							className='word-result'
							id={`${level}-${word}`}
						></div>
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
						<div className='btn-nav'>
							<button
								className='btn-nav-left'
								onClick={scrollToLeft}
							>
								<i className='fas fa-chevron-left'></i>
							</button>
							<button
								className='btn-show-word'
								onClick={handleShow}
								value={word}
							>
								Show word
							</button>
							<button
								className='btn-nav-right'
								onClick={scrollToRight}
							>
								<i className='fas fa-chevron-right'></i>
							</button>
						</div>
					</div>
				))}
			</div>
			<div>
				<h3>Instruction</h3>
				<ol>
					<li>Play sound by push play button</li>
					<li>Record your answer by push Microphone button</li>
					<li>
						if you want to see the word before answer, click the
						'Show word' button
					</li>
				</ol>
			</div>
		</div>
	);
};

export default Words;
