import React from 'react';

import {
    Motion,
    spring
} from 'react-motion';

import One from './0.jpg'
import Two from './1.jpg'
import Three from './2.jpg'
import Four from './3.jpg'
import Five from './4.jpg'
import Six from './5.jpg'

const springSettings = {
    stiffness: 170,
    damping: 26
};
const width = 200;
const height = 200;


export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs: [One, Two, Three, Four, Five, Six],
            position: [{
                left: spring(-200, springSettings),
                zIndex: 1,
                scale: spring(1, springSettings),
                translateZ: spring(0, springSettings),
                rotateY: spring(0, springSettings),

            },
            {
                left: spring(0, springSettings),
                zIndex: 99,
                scale: spring(1, springSettings),
                translateZ: spring(20, springSettings),
                rotateY: spring(45, springSettings)

            },
            {
                left: spring(200, springSettings),
                zIndex: 99,
                scale: spring(1.2, springSettings),
                translateZ: spring(20, springSettings),
                rotateY: spring(0, springSettings)
            },
            {
                left: spring(400, springSettings),
                zIndex: 99,
                scale: spring(1, springSettings),
                translateZ: spring(20, springSettings),
                rotateY: spring(-45, springSettings)
            },
            {
                left: spring(600, springSettings),
                zIndex: 1,
                scale: spring(1, springSettings),
                translateZ: spring(0, springSettings),
                rotateY: spring(0, springSettings)
            },
            {
                left: spring(800, springSettings),
                zIndex: 1,
                scale: spring(1, springSettings),
                translateZ: spring(0, springSettings),
                rotateY: spring(0, springSettings)
            }
            ]
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.nextPage();
        }, 5000);
    }

    nextPage = () => {
        let {
            imgs
        } = this.state;
        let _imgs = imgs.slice(0);
        let val = imgs[0];
        _imgs.splice(0, 1);
        _imgs.splice(imgs.length - 1, 0, val);

        this.setState({
            imgs: _imgs
        })
    }

    lastPage = () => {
        let {
            imgs
        } = this.state;
        let _imgs = imgs.slice(0);
        let val = imgs[imgs.length - 1];
        _imgs.splice(imgs.length - 1, 1);
        _imgs.splice(0, 0, val);

        this.setState({
            imgs: _imgs
        })
    }

    render() {

        let {
            imgs,
            position
        } = this.state;


        return (<div>
            <button onClick={
                this.nextPage
            } > NEXT </button> <button onClick={
                this.lastPage
            } > LAST </button>
            <div className="outter" > {
                position.map((style, i) =>
                    <Motion style={style} key={imgs[i]}>
                        {
                            ({
                                left,
                                zIndex,
                                scale,
                                rotateY,
                                translateZ
                            }) =>
                                <div className="imgWrapper" key={imgs[i]} style={{ left, zIndex }} >
                                    <img src={imgs[i]} style={{ transform: `scale(${scale}) translateZ(${translateZ}px) rotateY(${rotateY}deg)` }} />
                                </div>
                        }
                    </Motion>
                )
            } </div>
        </div>

        )
    }
}