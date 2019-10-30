interface State
{
  onTick(): void;
  onExit(): State;
}

export class Nothing implements State
{
  onTick = () =>
  {
  }

  onExit = () =>
    new Line();
}

export class Line implements State
{
  p1: any;
  p2: any;

  constructor()
  {
    this.p1 = layer.vrRightHandPosition();
  }

  onTick = () =>
  {
    let fline = new FLine();
    fline.color = vec(1.0, 1.0, 1.0, 0.3);
    fline.filled = true;

    fline.moveTo(this.p1);

    this.p2 = layer.vrRightHandPosition();
    fline.lineTo(this.p2);

    layer.lines.fline = fline;
  }

  onExit = () =>
    new Plane(this.p1, this.p2);
}

export class Plane implements State
{
  p3: any;
  p4: any;

  constructor(private p1, private p2)
  {
  }

  onTick = () =>
  {
    this.p3 = layer.vrRightHandPosition();
    this.p4 = this.p3 + (this.p1 - this.p2);

    let fline = new FLine();
    fline.color = vec(1.0, 1.0, 1.0, 0.3);
    fline.filled = true;

    fline.moveTo(this.p1);
    fline.lineTo(this.p2);
    fline.lineTo(this.p3);
    fline.lineTo(this.p4);

    layer.lines.fline = fline;
  }

  onExit = () =>
    new Solid();
}

export class Solid implements State
{
  constructor()
  {
  }

  onTick = () =>
  {
  }

  onExit = () =>
    new Nothing();
}
