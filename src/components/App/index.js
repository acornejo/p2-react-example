import React from 'react';
import ReactDOM from 'react-dom';
import p2 from 'p2';

import './style.css';

class Canvas extends React.Component {
  static state = { time: 0 };

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    draw: React.PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.ctx = ReactDOM.findDOMNode(this).getContext('2d');
    requestAnimationFrame(this.tick.bind(this));
  }

  tick = (time) => {
    requestAnimationFrame(this.tick);

    if (this.state !== null && this.state.time !== 0) {
      const dt = (time - this.state.time) / 1000;
      this.props.draw(this.ctx, dt);
    }

    this.setState({ time });
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} />;
  }
}

const radius = 10;
const width = 320;
const height = 480;
const speed = height/2;

function box(width, height, world, ballShape) {
  const top = new p2.Body({
    position: [0, -height/2],
    angle: 0
  });

  const bottom = new p2.Body({
    position: [0, height/2],
    angle: Math.PI
  });

  const left = new p2.Body({
    position: [-width/2, 0],
    angle: -Math.PI/2
  });

  const right = new p2.Body({
    position: [width/2, 0],
    angle: Math.PI/2
  });

  const sides = [top, left, right, bottom];

  for (let side of sides) {
    const sideShape = new p2.Plane();
    sideShape.material = new p2.Material();
    side.addShape(sideShape);
    world.addBody(side);
    if (ballShape) {
      world.addContactMaterial(new p2.ContactMaterial(
        sideShape.material,
        ballShape.material, {
          restitution: 1.0,
          stiffness: Number.MAX_VALUE
        }
      ));
    }
  }

  return sides;
}

function drawBox(ctx, x, y, width, height) {
    // draw floor
    ctx.moveTo(-width/2 + x, -height/2 + y);
    ctx.lineTo(width/2 + x, -height/2 + y);
    ctx.stroke();

    ctx.moveTo(-width/2 + x, height/2 + y);
    ctx.lineTo(width/2 + x, height/2 + y);
    ctx.stroke();

    ctx.moveTo(-width/2 + x, -height/2 + y);
    ctx.lineTo(-width/2 + x, height/2 + y);
    ctx.stroke();

    ctx.moveTo(width/2 + x, -height/2 + y);
    ctx.lineTo(width/2 + x, height/2 + y);
    ctx.stroke();
}

class App extends React.Component {
  constructor() {
    super();
    const world = new p2.World({
      gravity: [0, 0],
    });

    const ball = new p2.Body({
      mass: 10,
      position: [0, 0],
      velocity: [0, -speed]
    });
    ball.damping = 0;

    const ballShape = new p2.Circle({ radius });
    ballShape.material = new p2.Material();
    ball.addShape(ballShape);

    const paddle = new p2.Body({
      position: [0, -height/2 + 10]
    });
    const paddleShape = new p2.Box({
      width: 20,
      height: 20,
    });
    paddleShape.material = new p2.Material();
    paddle.addShape(paddleShape);

    const sides = box(width, height, world, ballShape)

    world.addBody(ball);
    world.addBody(paddle);

    world.addContactMaterial(new p2.ContactMaterial(
      ballShape.material,
      paddleShape.material, {
        restitution: 1.0,
        stiffness: Number.MAX_VALUE
      }
    ));

    this.world = world;
    this.ball = ball;
    this.paddle = paddle;
  }

  paint(ctx, dt) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1); // flip y axis

    this.world.step(1 / 60, dt);
    ctx.beginPath();
    ctx.arc(this.ball.position[0], this.ball.position[1], radius, 0, 2 * Math.PI);
    ctx.stroke();

    // draw box
    drawBox(ctx, 0, 0, width, height)

    // draw paddle
    drawBox(ctx, this.paddle.position[0], this.paddle.position[1], 20, 20)

    ctx.restore();
  }

  render() {
    return <Canvas width={320} height={480} draw={this.paint.bind(this)}/>;
  }
}

export default App;
