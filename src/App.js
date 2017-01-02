import { h, Component } from 'preact';
import logo from './logo.svg';
import './App.css';
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import Options from './Options';
import Pythagoras from './Pythagoras';


export default class App extends Component {
	svg = {
		width: 1280,
		height: 600
	};

	state = {
		currentMax: 0,
		baseW: 80,
		heightFactor: 0,
		lean: 0
	};

	realMax = 11;
	
	setSvgRef = c => {
		this.svgRef = c;
	};

	componentDidMount() {
		d3select(this.svgRef).on("mousemove", this.onMouseMove);

		this.next();
	}
	
	restart = () => {
		this.setState({ currentMax:0 });
		this.next();
	};

	next = () => {
		const { currentMax } = this.state;

		if (currentMax < this.realMax) {
			this.setState({currentMax: currentMax + 1});
			setTimeout(this.next, 500);
		}
	};

	onMouseMove = (event) => {
		const [x, y] = d3mouse(this.svgRef),
			scaleFactor = scaleLinear().domain([this.svg.height, 0]).range([0, .8]),
			scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width]).range([.5, 0, -.5]);

		this.setState({
			heightFactor: scaleFactor(y),
			lean: scaleLean(x)
		});
	};

	render(props, { lean, baseW, heightFactor, currentMax }) {
		let { width, height } = this.svg;

		return (
			<div class="App">
				<div class="App-header">
					<img src={logo} class="App-logo" alt="logo" />
					<h2>Dancing Pythagoras tree in <a href="https://preactjs.com" target="_blank">Preact</a></h2>
				</div>
				<Options restart={this.restart} />
				<p class="App-intro">
					<svg width={width} height={height} ref={this.setSvgRef}>
						<Pythagoras
							w={baseW}
							h={baseW}
							heightFactor={heightFactor}
							lean={lean}
							x={width/2-40}
							y={height-baseW}
							lvl={0}
							maxlvl={currentMax}
						/>
					</svg>
				</p>
			</div>
		);
	}
}
