import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			rows: 30,
			cols: 50,
			matrix: [
				[0,1,0,0,0,0,0,0,0,0],
				[0,1,0,0,0,0,0,0,0,0],
				[0,1,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]],
			intervalTime: 500, 
			counter: 0, 
			intervalID: 0,
			active: true
		};
		
		this.makeArray = this.makeArray.bind(this);
		this.changeGridSize = this.changeGridSize.bind(this);
		this.changeValue = this.changeValue.bind(this);
		this.cycle = this.cycle.bind(this);
		this.iteration = this.iteration.bind(this);
		this.randomInit = this.randomInit.bind(this);
		this.clearBoard = this.clearBoard.bind(this);
		this.restartBoard = this.restartBoard.bind(this);
		this.speedChange = this.speedChange.bind(this);
	}
	
	makeArray(rows=1, cols=1, value=0) {
		// creates a row x col matrix, each element = value
		const vector = new Array(cols).fill(value);
		var matrix = [];
		for (var i = 0; i < rows; i++) {
			const vec = vector.slice();
			matrix.push(vec);
		}
		return matrix;
	}
	
	changeGridSize(rows, cols) {
		this.setState({rows: rows, cols: cols});
		// const matrix = this.makeArray(rows, cols);
		const matrix = this.state.matrix.slice();
		this.setState({matrix: matrix});
	}
	
	changeValue(row, col) {
		// Changes specific box value
		let matrix = this.state.matrix.slice();
		const element = matrix[row][col];
		matrix[row][col] = (element===0) ? 1 : 0 ;
		
		this.setState({matrix: matrix});
	}
	
	iteration() {
		/*
			live cell w/ fewer than two live neighbours dies, by underpopulation.
			live cell w/ two or three live neighbours lives
			live cell w/ more than three live neighbours dies, by overpopulation.
			dead cell w/ exactly three live neighbours lives, by reproduction.
		*/
		var counter = this.state.counter;
		// console.log("#### Step:", counter);
		
		var rows = this.state.rows;
		var cols = this.state.cols;
		var baseMatrix = this.state.matrix.slice();
		var resultMatrix = this.makeArray(rows, cols);
		
		function nextState(matrix, i, j) {
			var a, b, c, d, e, f, g, h;
			try {a = (matrix[i-1][j-1]===undefined)?0:matrix[i-1][j-1];}	catch (ignore) {a=0;}
			try {b = (matrix[i-1][ j ]===undefined)?0:matrix[i-1][ j ];}	catch (ignore) {b=0;}
			try {c = (matrix[i-1][j+1]===undefined)?0:matrix[i-1][j+1];}	catch (ignore) {c=0;}
			try {d = (matrix[ i ][j-1]===undefined)?0:matrix[ i ][j-1];}	catch (ignore) {d=0;}
			try {e = (matrix[ i ][j+1]===undefined)?0:matrix[ i ][j+1];}	catch (ignore) {e=0;}
			try {f = (matrix[i+1][j-1]===undefined)?0:matrix[i+1][j-1];}	catch (ignore) {f=0;}
			try {g = (matrix[i+1][ j ]===undefined)?0:matrix[i+1][ j ];}	catch (ignore) {g=0;}
			try {h = (matrix[i+1][j+1]===undefined)?0:matrix[i+1][j+1];}	catch (ignore) {h=0;}
			
			const sum = a + b + c + d + e + f + g + h;
			// console.log("~~~~~~~~~~~~~~~~");
			// console.log("Coords:"+i+","+j, "sum:", sum);
			// console.log("      |"+a+"|"+b+"|"+c+"|");
			// console.log("      |"+d+"|"+matrix[i][j]+"|"+e+"|");
			// console.log("      |"+f+"|"+g+"|"+h+"|");
			
			if (matrix[i][j]===1) {
				/*console.log(i+","+j, "\nneighbors:", sum);*/
				if (sum < 2) {
          /*console.log("dies");*/return 0;} // fewer than two live neighbours => dies
				else if (sum <= 3) {
          /*console.log("lives");*/return 1;} // two or three live neighbours => lives
				else if (sum > 3) {
          /*console.log("dies");*/return 0;} // more than three live neighbours => dies
			} 
			else if (matrix[i][j]===0 && sum===3) {
        /*console.log("lives");*/return 1;} // dead cell has three live neighbours => lives
			else {return 0;}			

		}
		
		baseMatrix.forEach( (vector, r)=>{
			vector.forEach( (element, s)=>{
				resultMatrix[r][s] = nextState(baseMatrix, r, s);
			});
		});
		
		counter++;
		this.setState({counter: counter, matrix: resultMatrix});
	}
	
	cycle(status=false) {
		var intervalID = this.state.intervalID;
		var counter = this.state.counter;
		var intervalTime = this.state.intervalTime;
		var active = (status)?status:this.state.active;
		
		if (active) {
			console.log("#### PAUSE ####");
			clearInterval(intervalID);
			this.setState({active: false});
		} else {
			console.log("#### PLAY ####");
			intervalID = setInterval( ()=>{
				this.iteration();
			}, intervalTime );
			this.setState({active: true, intervalID: intervalID});
		}		
	}
	
	randomInit() {
		var rows = this.state.rows;
		var cols = this.state.cols;
		var baseMatrix = this.makeArray(rows, cols);
		baseMatrix.forEach( (vector, r)=>{
			vector.forEach( (element, s)=>{
				baseMatrix[r][s] = Math.round(Math.random());
			});
		});
		this.setState({matrix: baseMatrix});
	}
	
	clearBoard() {
		this.cycle(true);
		
		var rows = this.state.rows;
		var cols = this.state.cols;
		var baseMatrix = this.makeArray(rows, cols);
		
		this.setState({counter:0, matrix: baseMatrix});
	}
	
	restartBoard() {
		this.clearBoard();
		this.randomInit();
	}
	
	speedChange(speed) {
		this.setState({intervalTime: speed});
		this.cycle();
		setTimeout(()=>{this.cycle();},10);
	}

	componentWillMount() {
		// Called the first time the component is loaded right before the component is added to the page
		
		// const rows = this.state.rows;
		// const cols = this.state.cols;
		// this.changeGridSize(rows, cols);
		
		this.randomInit();
		
		// Start Game of Life
		console.log("##  GAME OF LIFE  ##");
		const intervalTime = this.state.intervalTime;
		let intervalID = 0;
		intervalID = setInterval( ()=>{
			this.iteration();
		}, intervalTime );
		this.setState({intervalTime: intervalTime, intervalID: intervalID});
		
	}
	
	componentDidMount() {
		// Called after the component has been rendered into the page
		
	}
	
	componentWillReceiveProps() {
		// Called when the props provided to the component are changed
		
	}
	
	componentWillUpdate() {
		// Called when the props are/or state change
	}
	
	componentWillUnmount() {
		// Called when the component is removed
		
	}
	
	//<div className="row"></div>
	render() {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-12 title">
								<h1>Game of Life</h1>
							</div>
						</div>
						<div className="row controls-parent">
							<Controls
								state = {this.state}
								changeGridSize={(row, col)=>this.changeGridSize(row, col)}
								cycle={()=>this.cycle()}
								clearBoard={()=>this.clearBoard()}
								restartBoard={()=>this.restartBoard()}
								speedChange={(speed)=>this.speedChange(speed)}
								/>
						</div>						
						<div className="row">
							<Board
								matrix={this.state.matrix}
								changeValue={(row, col)=>this.changeValue(row, col)}
								/>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
	
}

class Controls extends React.Component {
	constructor(props) {
		super(props);
	}
	
	sizeChange(event) {
		const id = event.target.id;
		let rows = this.props.state.rows;
		let cols = this.props.state.cols;
		
		function changeCheck(value, operator) {
			
			if ( (value < 6 && operator==="-") || ( value > 100 && operator==="+") ) {
				return value;
			} else if (operator==="-") {
				return value-1;
			} else if (operator==="+") {
				return value+1;
			} else {
				return value;
			}
		}

		switch (id) {
			case "rowsPlus":
				rows = changeCheck(rows, "+");
				break;
			case "colsPlus":
				cols = changeCheck(cols, "+");
				break;
			case "rowsMinus":
				rows = changeCheck(rows, "-");
				break;
			case "colsMinus":
				cols = changeCheck(cols, "-");
				break;
			default:
				break;
							}
		
		this.props.changeGridSize(rows, cols);
	}
	
	playPause() {
		this.props.cycle();
	}
	
	clearBoard() {
		this.props.clearBoard();
	}
	
	restartBoard() {
		this.props.restartBoard();
	}
	
	speedChange(event) {
		const id = event.target.id;
		let speed = this.props.state.intervalTime;
		
		function changeCheck(value, operator) {
			if ( (value <= 100 && operator==="+") || ( value >= 1000 && operator==="-") ) {
				return value;
			} else if (operator==="+") {
				return value-50;
			} else if (operator==="-") {
				return value+50;
			} else {
				return value;
			}
		}

		switch (id) {
			case "speedPlus":
				speed = changeCheck(speed, "-");
				break;
			case "speedMinus":
				speed = changeCheck(speed, "+");
				break;
			default:
				break;
							}
		console.log("   NEXT SPEED: ",speed);
		this.props.speedChange(speed);
	}
	
	render() {
		return(
			<div className="col-md-12 text-center">
				<div className="container-fluid controls">
					
					<div className="row">
						<div className="col-xs-12 col-sm-4">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title">What is this?</h3>
								</div>
								<div className="panel-body">
									<p>An <em>initial state</em> game. New <strong>trees</strong> are born if they have 3 neighbors. A tree survives if it has 2 or 3 neighbors. Good luck!</p>
								</div>
							</div>
							<div className="btn-group">
								<button 
									className={"btn "+( (this.props.state.active)?"":"btn-success" )+" btn-ctrls"}
									onClick={()=>this.playPause()}>
									{(this.props.state.active)?"II":"►"}
								</button>
								<button 
									className="btn btn-warning btn-ctrls" 
									onClick={()=>this.clearBoard()}>
									Clear
								</button>
								<button 
									className="btn btn-danger btn-ctrls" 
									onClick={()=>this.restartBoard()}>
									Reset
								</button>
							</div>
						</div>
						<div className="col-xs-6 col-sm-2">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title">Cycles</h3>
								</div>
								<div className="panel-body panel-num">
									{this.props.state.counter}
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-sm-2">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title">Period</h3>
								</div>
								<div className="panel-body panel-num">
									{this.props.state.intervalTime/1000}
								</div>
							</div>
							<div className="btn-group ">
								<button 
									id="speedPlus"
									className="btn btn-info btn-dials"
									onClick={(event)=>this.speedChange(event)}>
									+
								</button>
								<button 
									id="speedMinus"
									className="btn btn-primary btn-dials"
									onClick={(event)=>this.speedChange(event)}>
									-
								</button>
							</div>
						</div>
						<div className="col-xs-6 col-sm-2">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title">Rows</h3>
								</div>
								<div className="panel-body panel-num">
									{this.props.state.rows}
								</div>
							</div>
							<div className="btn-group ">
								<button 
									id="rowsPlus"
									className="btn btn-info btn-dials"
									onClick={(event)=>this.sizeChange(event)}>
									+
								</button>
								<button 
									id="rowsMinus"
									className="btn btn-primary btn-dials"
									onClick={(event)=>this.sizeChange(event)}>
									-
								</button>
							</div>
						</div>
						<div className="col-xs-6 col-sm-2">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title">Colums</h3>
								</div>
								<div className="panel-body panel-num">
									{this.props.state.cols}
								</div>
							</div>
							<div className="btn-group ">
								<button 
									id="colsPlus"
									className="btn btn-info btn-dials"
									onClick={(event)=>this.sizeChange(event)}>
									+
								</button>
								<button 
									id="colsMinus"
									className="btn btn-primary btn-dials"
									onClick={(event)=>this.sizeChange(event)}>
									-
								</button>
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	}
	
}

class Board extends React.Component {
	constructor(props) {
		super(props);
	}
	
	clicked(event) {
		event.preventDefault();
		const row = event.target.dataset.row;
		const col = event.target.dataset.col;
		
		this.props.changeValue(row, col);
	}
	
	render() {
		const matrix = this.props.matrix.slice();
		const board = matrix.map((m, key)=> {
			const vector = m.map((n, index)=> {
				let css = ( matrix[key][index]===0 ) ? "off" : "on";
				return (
					<div 
						className={"box " + css}
						key={index} 
						data-row={key} 
						data-col={index}
						onClick={(event)=>this.clicked(event)}
						>
					</div>
				);
			});
			return( 
				<div className="row row-box">
					<div className="col-md-12 col-box">
						{vector}
					</div>
				</div>
			)
		});
		return(
			<div className="col-md-12">
				<div className="container board">
					{board}
				</div>
			</div>
		);
	}
	
}


// ReactDOM.render(<Home />, document.getElementById("app"));

export default App;
