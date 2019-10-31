import { State,
  ZeroDimensions,
} from './state';

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
