import './App.css';

import React, { useState, useRef, useCallback } from 'react';

const TRANSITION_TIME_BALL = 2000;
const COOLDOWN_TIME = 5000;

function App() {
	let [cooldownClock, setCooldownClock] = useState(0);

	let refBlockLeft = useRef(); // Левый блок
	let refOuter = useRef();     // Контейнер с блоками и кругом
	let refBall = useRef();      // Шар

	// Постоянные таймеры
	let timers = useRef({
		cooldown: null,
		trans1: null,
		trans2: null,
	});

	// Обратный отсчет
	const cooldown = useCallback(function _cooldown(t) {
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
	}, []);

	const onClickStart = useCallback(function _onClickStart() {
		transition();
	});

	// Сбросить состояние шара до первичных
	const initialStyles = useCallback(function _initialStyles() {
		refBall.current.style.visibility = 'hidden';
		refBall.current.style.transition = void 0;
		refBall.current.style['transition-timing-function'] = void 0;
		refBall.current.style.top = 0;
		refBall.current.style.left = 0;
	}, []);

	// Решение в лоб -- прямая мутация стилей через ref
	// 
	// Можно менять стили и через состояние,
	// но это сложнее в реализации
	// и вычислительно более затратная операция
	// 
	// На мой взгляд, к ней имеет смысл прибегать, когда реализуется мультиплатформенный компонент
	// или компонент устроен сложнее чем HTMLElement

	const transition = useCallback(function _transition() {
		// Рассчитать положение блока в моменте (относительно, в процентах)
		// Установить стартовую точку круга в соотв с текущим положением блока
		// Установить "режим анимации" и задать конечные координаты => круг приступает к анимации изменения координат
		// По истечению времени анимации -- сбросить состояние круга до первичных

		clearTimeout(timers.current.trans1);
		clearTimeout(timers.current.trans2);

		initialStyles();

		// Установить обратный отсчет
		cooldown(COOLDOWN_TIME);

		// Рассчитать положение блока в моменте (относительно контейнера, в процентах)
		let top = refBlockLeft.current.offsetTop / refOuter.current.clientHeight * 100 + '%';

		// Установить стартовую точку для круга
		refBall.current.style.visibility = 'visible';
		refBall.current.style.top = top;
		refBall.current.style.left = '0%';

		// Установить конечные координаты и анимацию
		timers.current.trans1 = setTimeout(() => {
			refBall.current.style.transition = TRANSITION_TIME_BALL / 1000 + 's';
			refBall.current.style['transition-timing-function'] = 'linear';
			refBall.current.style.top = '50%';
			refBall.current.style.left = '100%';
		}, 0);

		// Завершить анимацию круга через время TRANSITION_TIME_BALL
		// Сбросить состояние
		timers.current.trans2 = setTimeout(() => {
			initialStyles();
		}, TRANSITION_TIME_BALL);
	}, []);

	return (
		<div>
			<div className="outer" ref={refOuter}>
				<CompBlock side="left" _ref={refBlockLeft} />
				<CompBlock side="right" />
				<CompBall _ref={refBall} />
				<CompButton onClick={onClickStart} disabled={cooldownClock}>
					start {cooldownClock}
				</CompButton>
			</div>
		</div>
	);
}

function CompBall(props) {
	return (
		<div
			className="ball"
			ref={props._ref}
		/>
	);
}

function CompBlock(props) {
	return (
		<div
			className={'block ' + props.side}
			ref={props._ref}
		/>
	);
}

function CompButton(props) {
	let _props = {
		disabled: props.disabled || void 0,
	};

	return (
		<button
			onClick={props.onClick}
			{..._props}
		>
			{props.children}
		</button>
	);
}

export default App;