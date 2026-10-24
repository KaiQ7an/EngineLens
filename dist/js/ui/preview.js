import { W, H, stage, setFocus, clearHits } from '../draw/kit.js';
import { VIEWS } from '../draw/views.js';
import { valveLift, wrap } from '../sim/kinematics.js';

// Draw an entry's view without its labels: used for the home hero and gallery cards.
export function drawPreview(canvas, entry, theta, time) {
  const view = VIEWS[entry.view];
  if (!view) return false;
  const c = canvas.getContext('2d');
  setFocus(null);
  stage(c, canvas.width, canvas.height);
  c.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  const a = wrap(theta);
  view.draw(c, {
    theta, time, parts: {}, rpm: 3000, speed: 30, blur: 0, tip: -1, t: 2.5, alt: 'sea', balance: false, boxer: 'flat6', preview: true,
    flow: { intake: valveLift(a, 'intake') * 1.2, exhaust: valveLift(a, 'exhaust') * 1.2 }, step: entry.steps[0]
  }, entry);
  clearHits();
  return true;
}
