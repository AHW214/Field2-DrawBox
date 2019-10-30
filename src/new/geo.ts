import { Vec3, Vec4, } from './lib';

abstract class Show
{
  draw: () => void;

  constructor(public color: Vec4 = vec(1.0, 1.0, 1.0, 1.0))
  {
  }
}

export class Line extends Show
{
  constructor(public p1: Vec3, public p2: Vec3, color?: Vec4)
  {
    super(color);
  }

  draw = () =>
  {
    let fline = new FLine();

    fline.color = this.color;

    fline.moveTo(this.p1);
    fline.lineTo(this.p2);

    layer.lines.fline = fline;
  }
}

class Polygon extends Show
{
  public vertices: Array<Vec3>;

  constructor(vertices: Array<Vec3>, color?: Vec4)
  {
    super(color);

    if (vertices.length < 3)
    {
      throw new Error("Plane requires at least 3 vertices");
    }

    this.vertices = vertices;
  }

  get numSides(): number
  {
    return this.vertices.length;
  }

  draw = () =>
  {
    let fline = new FLine();

    fline.color = this.color;
    fline.filled = true;

    fline.moveTo(this.vertices[0]);
    this.vertices.forEach(v => fline.lineTo(v));

    layer.lines.fline = fline;
  }
}

export class Parallelogram extends Polygon
{
  constructor(v1: Vec3, v2: Vec3, v3: Vec3, color?: Vec4)
  {
    let v4 = v3 + (v1 - v2);
    super(new Array<Vec3>(v1, v2 , v3 , v4), color);
  }
}

export class Parallelepiped extends Show
{
  faces: Array<Polygon>;

  constructor(base: Parallelogram, side: Vec3, color?: Vec4)
  {
    super(color);

    let b1v = base.vertices;
    let b2v = b1v.map(v => v + side);

    let vertSets =
      [ b1v
      , b2v
      , [ b1v[0], b1v[1], b2v[1], b2v[0] ]
      , [ b1v[2], b1v[3], b2v[3], b2v[2] ]
      , [ b1v[0], b1v[2], b2v[2], b2v[0] ]
      , [ b1v[1], b1v[3], b2v[3], b2v[1] ]
      ]

    this.faces = vertSets.map(vs => new Polygon(vs, color));
  }

  draw = () =>
  {
    this.faces.forEach(f => f.draw());
  }
}
