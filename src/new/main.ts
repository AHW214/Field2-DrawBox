import { State,
  ZeroDimensions,
} from './state';

let state : State = new ZeroDimensions();

layer.vrButtons.triggerDown.myCallback = () =>
{
  state = state.onExit();
}

while(_.wait())
{
  state.onTick();
}
