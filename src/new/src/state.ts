import { Line,
  Parallelogram,
  Parallelepiped,
} from './geo';

import { Vec3 } from './lib';

export interface State
{
  onTick(): void;
  onExit(): State;
}

export class ZeroDimensions implements State
{
  onTick = () =>
  {
  }

  onExit = () =>
    new OneDimension();
}

export class OneDimension implements State
{
  p1: Vec3;
  line: Line;

  constructor()
  {
    // @ts-ignore
    this.p1 = layer.vrRightHandPosition();
  }

  onTick = () =>
  {
    // @ts-ignore
    let p2 = layer.vrRightHandPosition();
    this.line = new Line(this.p1, p2);
    this.line.draw();
  }

  onExit = () =>
    new TwoDimensions(this.line.p1, this.line.p2);
}

export class TwoDimensions implements State
{
  parallelogram: Parallelogram;

  constructor(private p1: Vec3, private p2: Vec3)
  {
  }

  onTick = () =>
  {
    // @ts-ignore
    let p3 = layer.vrRightHandPosition();
    this.parallelogram = new Parallelogram(this.p1, this.p2, p3);
    this.parallelogram.draw();
  }

  onExit = () =>
    new ThreeDimensions(this.parallelogram);
}

export class ThreeDimensions implements State
{
  parallelepiped: Parallelepiped;

  constructor(private parallelogram: Parallelogram)
  {
  }

  onTick = () =>
  {
    // @ts-ignore
    let side = layer.vrRightHandPosition() - this.parallelogram.vertices[2];
    this.parallelepiped = new Parallelepiped(this.parallelogram, side);
    this.parallelepiped.draw();
  }

  onExit = () =>
    new ZeroDimensions();
}
