import { State,
  ZeroDimensions,
} from './state';

//@ts-ignore
const layer = _.stage.withName("draw box");

layer.vrDefaults();
layer.lines.clear();

let state : State = new ZeroDimensions();

// @ts-ignore
layer.vrButtons.triggerDown.myCallback = () =>
{
  state = state.onExit();
}

// @ts-ignore
while(_.wait())
{
  state.onTick();
}
