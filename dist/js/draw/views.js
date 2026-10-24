import { drawFourStroke } from './fourstroke.js';
import { drawNA, drawTurbo, drawSuper, inductionView } from './induction.js';
import { throttleView } from './experiment.js';
import { inline4View, inline6View, v6View, v12View, boxerView, drawV8 } from './layouts.js';

// Each entry names a view: how to draw it, plus optional extra controls and state updates.
export const VIEWS = {
  fourStroke: { draw: drawFourStroke },
  na: inductionView(drawNA),
  turbo: inductionView(drawTurbo),
  super: inductionView(drawSuper),
  throttle: throttleView,
  inline4: inline4View,
  inline6: inline6View,
  v6: v6View,
  v8: { draw: drawV8 },
  v12: v12View,
  boxer: boxerView
};
