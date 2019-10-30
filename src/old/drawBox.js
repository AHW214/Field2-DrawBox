var layer = _.stage.withName("draw box");

layer.vrDefaults();
layer.lines.clear();

var states = {
  nothing: 0,
  line: 1,
  plane: 2,
  cube: 3,
};

var state = states.nothing;

var sideLength;

var firstPoint;
var secondPoint;
var thirdPoint;
var fourthPoint;

var firstPointMirror;
var secondPointMirror;
var thirdPointMirror;
var fourthPointMirror;

var enterState = () =>
{
  switch (state)
  {
    case states.line:
      firstPoint = layer.vrRightHandPosition();
      break;

    case states.plane:
      break;

    case states.cube:
      break;
  }
};

var exitState = () =>
{
  switch (state)
  {
    case states.line:
      secondPoint = layer.vrRightHandPosition();
      break;

    case states.plane:
      break;

    case states.cube:
      break;
  }
};

var tickState = () =>
{
  switch (state)
  {
    case states.line:
      var f = new FLine();
      f.color = vec(1, 1, 1, 0.3);
      f.filled = true;
      f.moveTo(firstPoint);
      f.lineTo(layer.vrRightHandPosition());
      layer.lines.f = f;
      break;

    case states.plane:
      thirdPoint = layer.vrRightHandPosition();
      sideLength = firstPoint - secondPoint;
      fourthPoint = thirdPoint + sideLength;

      var f = new FLine();
      f.color = vec(1, 1, 1, 0.3);
      f.filled = true;
      f.moveTo(firstPoint);
      f.lineTo(secondPoint);
      f.lineTo(thirdPoint);
      f.lineTo(fourthPoint);
      layer.lines.f = f;
      break;

    case states.cube:
      sideLength = layer.vrRightHandPosition() - thirdPoint;

      firstPointMirror = firstPoint + sideLength;
      secondPointMirror = secondPoint + sideLength;
      thirdPointMirror = thirdPoint + sideLength;
      fourthPointMirror = fourthPoint + sideLength;

      var f1 = new FLine();
      f1.color = vec(1, 1, 1, 0.3);
      f1.filled = true;
      f1.moveTo(firstPoint);
      f1.lineTo(secondPoint);
      f1.lineTo(thirdPoint);
      f1.lineTo(fourthPoint);
      layer.lines.f1 = f1;

      var f2 = new FLine();
      f2.color = vec(1, 1, 1, 0.3);
      f2.filled = true;
      f2.moveTo(firstPointMirror);
      f2.lineTo(secondPointMirror);
      f2.lineTo(thirdPointMirror);
      f2.lineTo(fourthPointMirror);
      layer.lines.f2 = f2;

      var f3 = new FLine();
      f3.color = vec(1, 1, 1, 0.3);
      f3.filled = true;
      f3.moveTo(firstPoint);
      f3.lineTo(secondPoint);
      f3.lineTo(secondPointMirror);
      f3.lineTo(firstPointMirror);
      layer.lines.f3 = f3;

      var f4 = new FLine();
      f4.color = vec(1, 1, 1, 0.3);
      f4.filled = true;
      f4.moveTo(thirdPoint);
      f4.lineTo(fourthPoint);
      f4.lineTo(fourthPointMirror);
      f4.lineTo(thirdPointMirror);
      layer.lines.f4 = f4;

      var f5 = new FLine();
      f5.color = vec(1, 1, 1, 0.3);
      f5.filled = true;
      f5.moveTo(firstPoint);
      f5.lineTo(thirdPoint);
      f5.lineTo(thirdPointMirror);
      f5.lineTo(firstPointMirror);
      layer.lines.f5 = f5;

      var f6 = new FLine();
      f6.color = vec(1, 1, 1, 0.3);
      f6.filled = true;
      f6.moveTo(secondPoint);
      f6.lineTo(fourthPoint);
      f6.lineTo(fourthPointMirror);
      f6.lineTo(secondPointMirror);
      layer.lines.f6 = f6;

      break;
  }
};

layer.vrButtons.triggerDown.myCallback = () =>
{
  exitState();
  state = (state + 1) % 4;
  enterState();
};

while(_.wait())
{
  tickState();
}
