import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Stage from './components/Stage/Stage';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Stage width={1000} height={1000} />
			</div>
		);
	}
}

export default App;
