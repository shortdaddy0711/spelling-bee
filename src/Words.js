import React, { useState, useEffect } from 'react';
import { diffChars } from 'diff';
import Arr from './wordlist.js';
import './App.css';

const Words = () => {
	const [level, setLevel] = useState('');
	const [words, setWords] = useState([]);
	const [showWords, setShowWords] = useState({});
	const [current, setCurrent] = useState('');

	const handleWords = (str) => {
		let wordsObj = {};
		let randWords = Arr[str]
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

	const correct = (fileName) => {
		const fileUrl = `audio/${fileName}.mp3`;
		const sound = new Audio(fileUrl);
		sound.play();
	};

	const handleSpeech = (event) => {
		const word = event.target.closest('button').value.toLowerCase();
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
			const wordsObj = showWords;
			wordsObj[word] = true;
			console.log(wordsObj);
			setShowWords(wordsObj);
			setCurrent(word);
		};

		recog.onresult = (e) => {
			const index = e.resultIndex;
			const transcript = e.results[index][0].transcript
				.split(' ')
				.join('')
				.toLowerCase();
			console.log(word, ' : ', transcript);

			let span = null;
			const diff = diffChars(word, transcript, true);
			const display = document.getElementById(`${level}-${word}`);
			const fragment = document.createDocumentFragment();
			diff.forEach((part) => {
				const color = part.added
					? 'green'
					: part.removed
					? 'red'
					: 'grey';
				span = document.createElement('span');
				span.style.color = color;
				span.appendChild(document.createTextNode(part.value));
				fragment.appendChild(span);
			});
			const testDiv = document.createElement('div');
			testDiv.appendChild(fragment);
			console.log(testDiv.innerHTML.includes('red' || 'green'));
			if (testDiv.innerHTML.includes('red' || 'green')) {
				correct('no');
				if (display.firstChild) {
					display.replaceChild(testDiv, display.firstChild);
				} else {
					display.appendChild(testDiv);
				}
			} else {
				correct('yes');
				display.innerHTML = '<div>👍👍👍👍</div>';
			}
		};
		recog.start();
	};

	const scrollToLeft = () => {
		document.getElementById('container').scrollLeft -= 368;
	};

	const scrollToRight = () => {
		document.getElementById('container').scrollLeft += 368;
	};

	const scrollToStart = () => {
		document.getElementById('container').scrollLeft -= 7000;
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
				{words && Object.keys(Arr).map((element) => {
					return (
            <button
              className={level === element ? 'btn-level-selected' : 'btn-level'}
              onClick={() => {
                setLevel(element);
                scrollToStart();
                handleWords(element);
                cleanResult();
              }}
            >
              {element}
            </button>
          );
				})}
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
						<div className='result-notice'>
							<div>
								<i
									className='fas fa-circle'
									style={{ color: 'green' }}
								></i>
								Unnecessary letters
							</div>
							<div>
								<i
									className='fas fa-circle'
									style={{ color: 'red' }}
								></i>
								Missing letters
							</div>
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
			<div className='instruction'>
				<h3>Instruction</h3>
				<ol>
					<li>Choose your level</li>
					<li>Listen pronounce by push play button</li>
					<li>Speak each letter after push microphone button</li>
					<li>You will see the result after you finished speak</li>
					<li>Use the result to fix your error and try again</li>
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
