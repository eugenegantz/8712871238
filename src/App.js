import './App.css';

import React, { useState, useRef } from 'react';

const TRANSITION_TIME_BALL = 2000;
const COOLDOWN_TIME = 5000;

function App() {
	let [cooldownClock, setCooldownClock] = useState(0);

	let refBlockLeft = useRef();
	let ref3 = useRef();
	let refBall = useRef();
	let timers = useRef({
		cooldown: null,
		trans1: null,
		trans2: null,
	});

	function onClickStart() {
		transition();
	}

	function initialStyles() {
		refBall.current.style.visibility = 'hidden';
		refBall.current.style.transition = void 0;
		refBall.current.style.top = 0;
		refBall.current.style.left = 0;
	};

	function transition() {
		clearTimeout(timers.current.trans1);
		clearTimeout(timers.current.trans2);

		initialStyles();

		// Установить обратный отсчет
		cooldown(COOLDOWN_TIME);

		let top = refBlockLeft.current.offsetTop / ref3.current.clientHeight * 100 + '%';

		// Установить стартовое место для круга
		refBall.current.style.visibility = 'visible';
		refBall.current.style.top = top;
		refBall.current.style.left = '0%';

		// Установить пункт назначения анимации
		timers.current.trans1 = setTimeout(() => {
			refBall.current.style.transition = TRANSITION_TIME_BALL / 1000 + 's';
			refBall.current.style.top = '50%';
			refBall.current.style.left = '100%';
		}, 0);

		// Завершить анимацию круга через время TRANSITION_TIME_BALL
		timers.current.trans2 = setTimeout(() => {
			initialStyles();
		}, TRANSITION_TIME_BALL);
	};

	function cooldown(t) {
		clearInterval(timers.current.cooldown);

		setCooldownClock(t / 1000);

		timers.current.cooldown = setInterval(() => {
			setCooldownClock((t) => {
				if (!t) {
					clearInterval(timers.current.cooldown);
					return t;
				}

				return t - 1;
			});
		}, 1000);
	}

	return (
		<div>
			<div className="outer" ref={ref3}>
				<CompBlock side="left" _ref={refBlockLeft} />
				<CompBlock side="right" />
				<Ball _ref={refBall} />
				<CompButton onClick={onClickStart} disabled={cooldownClock}>
					start {cooldownClock}
				</CompButton>
			</div>
		</div>
	);
}

function Ball(props) {
	let roundClassName = 'ball';

	if (props.isAnimated) {
		roundClassName += ' animated';
	}

	return <div className={roundClassName} ref={props._ref} />
}

function CompBlock(props) {
	return <div className={'block ' + props.side} ref={props._ref}></div>
}

function CompButton(props) {
	let buttonProps = {
		disabled: props.disabled || void 0
	};

	return <button onClick={props.onClick} {...buttonProps}>
		{
			props.children
		}
	</button>
}

export default App;