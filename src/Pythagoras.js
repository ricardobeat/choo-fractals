
import { h, Component } from 'preact';
import { interpolateViridis } from 'd3-scale';

Math.deg = function(radians) {
  return radians * (180 / Math.PI);
};

const memoizedCalc = function () {
    const memo = {};
	
	function calc(w, heightFactor, lean) {
		const trigH = heightFactor*w;

        return {
            nextRight: Math.sqrt(trigH**2 + (w * (.5+lean))**2),
            nextLeft: Math.sqrt(trigH**2 + (w * (.5-lean))**2),
            A: Math.deg(Math.atan(trigH / ((.5-lean) * w))),
            B: Math.deg(Math.atan(trigH / ((.5+lean) * w)))
        };
	}

    return (...args) => args in memo ? memo[args] : (memo[args] = calc(...args));
}();


export default class Pythagoras extends Component {
    render({ w,x, y, heightFactor, lean, left, right, lvl, maxlvl }) {
        if (lvl >= maxlvl || w < 1) return null;

        let { nextRight, nextLeft, A, B } = memoizedCalc(w, heightFactor, lean);

        let rotate = '';

        if (left) {
            rotate = `rotate(${-A} 0 ${w})`;
        }
		else if (right) {
            rotate = `rotate(${B} ${w} ${w})`;
        }

        return (
            <g transform={`translate(${x} ${y}) ${rotate}`}>
				{/* <rect width={w} height={w}
                    x={0} y={0}
				style={{fill: interpolateViridis(lvl/maxlvl)}} /> */}

				{/* <rect width={w} height={w} x={0} y={0} fill={interpolateViridis(lvl/maxlvl)} /> */}

				<rect style={{ width: w, height:w, x:0, y:0, fill:interpolateViridis(lvl/maxlvl) }} />
				
                <Pythagoras w={nextLeft}
                    x={0} y={-nextLeft}
                    lvl={lvl+1} maxlvl={maxlvl}
                    heightFactor={heightFactor}
                    lean={lean}
                    left />

                <Pythagoras w={nextRight}
                    x={w-nextRight} y={-nextRight}
                    lvl={lvl+1} maxlvl={maxlvl}
                    heightFactor={heightFactor}
                    lean={lean}
                    right />

            </g>
        );
    }
}
