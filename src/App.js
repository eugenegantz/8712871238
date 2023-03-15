import './App.css';

import React, { useState, useRef, useEffect } from 'react';

function App() {
	let [timeout, setT] = useState(0);
	let ref1 = useRef();
	let ref2 = useRef();
	let ref3 = useRef();

	let [isAnimated, animate] = useState(false);

	let [roundStyles, setRoundStyles] = useState(void 0);

	function onClickStart() {
		startTransition();
	}

	function startTransition() {
		let top = ref1.current.offsetTop / ref3.current.clientHeight * 100 + '%';

		setRoundStyles({
			top: top,
			left: '0%',
		});

		setT(5);

		let timer = setInterval(() => {
			setT((t) => {
				if (!t) {
					clearInterval(timer);
					setRoundStyles(void 0);
					animate(false);
					return t;
				}

				return t - 1;
			});
		}, 1000);
	}

	useEffect(() => {
		if (roundStyles) {
			animate(true);
		}
	}, [roundStyles]);

	useEffect(() => {
		if (!roundStyles)
			return;

		if (isAnimated) {
			setRoundStyles({
				top: '50%',
				left: '100%',
			});
		}
	}, [isAnimated]);

	let buttonProps = {};

	if (timeout) {
		buttonProps.disabled = true;
	}

	let roundClassName = 'round';

	if (isAnimated) {
		roundClassName += ' round_animated';
	}

	return (
		<div>
			<div className="outer" ref={ref3}>
				<div className='block left' ref={ref1}></div>
				<div className='block right' ref={ref2}></div>
				<div className={roundClassName} style={roundStyles} />
			</div>
			<button onClick={onClickStart} {...buttonProps}>
				start {timeout}
			</button>
		</div>
	);
}

function CompBlock(props) {
	<div className={'block ' + props.side} ref={props.ref}></div>
}

function CompButton(props) {
	let buttonProps = {
		disabled: props.disabled || void 0
	};

	<button onClick={props.onClick} {...buttonProps}>
		{
			props.children
		}
	</button>
}

export default App;