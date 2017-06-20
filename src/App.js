const choo = require('choo')
const html = require('choo/html')
const { select: d3select, mouse: d3mouse } = require('d3-selection')
const { scaleLinear } = require('d3-scale')

const Logo = require('./logo')
const Pythagoras = require('./pythagoras')

const SVG_WIDTH = 1280
const SVG_HEIGHT = 600
const SVG = null

const app = choo({ timing: false })

app.use(function (state, emitter) {

    var realMax = 11

    Object.assign(state, {
        currentMax: 0,
        baseW: 80,
        heightFactor: 0,
        lean: 0
    })

    emitter.on('move', function ({ heightFactor, lean }) {
        state.heightFactor = heightFactor
        state.lean = lean
        emitter.emit('render')
    })

    emitter.on('nextLevel', function () {
        if (state.currentMax < realMax) {
            state.currentMax += 1
            setTimeout(function () {
                emitter.emit('nextLevel')
            }, 500)
        }
    })

    emitter.emit('nextLevel')
})

function main (state, emit) {

    function onMouseMove(event) {
        const [x, y] = d3mouse(this)
        const scaleFactor = scaleLinear().domain([SVG_HEIGHT, 0]).range([0, .8])
        const scaleLean = scaleLinear().domain([0, SVG_WIDTH/2, SVG_WIDTH]).range([.5, 0, -.5])
        emit('move', {
            heightFactor: scaleFactor(y),
            lean: scaleLean(x)
        })
    }

    function attachEvents (svg) {
        d3select(svg).on("mousemove", onMouseMove);
    }

    return html`
        <div class="App">
            <div class="App-header">
                ${Logo}
                <h2>This is a dancing Pythagoras tree</h2>
            </div>
            <p class="App-intro">
                <span>${state.currentMax}</span>
                <svg width=${SVG_WIDTH} height=${SVG_HEIGHT} ref="svg" onload=${attachEvents}>
                    ${Pythagoras({
                        w: state.baseW,
                        h: state.baseW,
                        heightFactor: state.heightFactor,
                        lean: state.lean,
                        x: SVG_WIDTH/2-40,
                        y: SVG_HEIGHT-state.baseW,
                        lvl: 0,
                        maxlvl: state.currentMax
                    })}
                </svg>
            </p>
        </div>`
}

app.route('/', main)
app.mount('.App')
