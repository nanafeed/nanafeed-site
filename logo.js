/* The nanafeed wordmark, acting up. Transform/opacity only, so the header never reflows.
   Each scene returns its duration, which keeps the idle fidgets quiet while it plays.
   "anafeed" = 0 a, 1 n, 2 a, 3 f, 4 e, 5 e, 6 d; the word's first "n" is the image. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mark = document.querySelector('.mark');
  const lt = [...document.querySelectorAll('.mark .lt')];
  if (!mark || lt.length !== 7) return;
  const logo = mark.querySelector('img');
  const all = logo ? [logo, ...lt] : lt.slice();      /* the whole wordmark, image included */

  const SPRING = 'cubic-bezier(.34,1.56,.64,1)', EIO = 'ease-in-out', EO = 'ease-out';
  const SMOOTH = 'cubic-bezier(.2,.8,.2,1)';
  const run = (el, frames, duration, easing, delay) =>
    el.animate(frames, { duration, easing: easing || SMOOTH, delay: delay || 0, fill: 'none' });
  /* keyframe shorthands, used a couple of hundred times below */
  const t = (transform, offset) => offset === undefined ? { transform } : { transform, offset };
  const o = (opacity, transform, offset) => offset === undefined ? { opacity, transform } : { opacity, transform, offset };
  const mid = el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; };
  /* transform-origin is not a transform: set around a scene, cleared after */
  const origin = (els, value, ms) => {
    els.forEach(e => e.style.transformOrigin = value);
    setTimeout(() => els.forEach(e => e.style.transformOrigin = ''), ms + 60);
  };

  /* ---- props, built once, parked invisible ---- */
  const prop = (cls, host, html) => {
    const el = document.createElement('span');
    el.className = cls;
    el.setAttribute('aria-hidden', 'true');
    if (html) el.innerHTML = html;
    host.appendChild(el);
    return el;
  };
  const peel = prop('peel', lt[6],
    '<svg viewBox="0 0 24 24"><path d="M4 17 A11 11 0 0 1 17 5" fill="none" stroke="#F5C800" stroke-width="5" stroke-linecap="round"/></svg>');
  const zzz = prop('zzz', lt[6]);
  zzz.textContent = 'z z z';
  const ball = prop('dot', lt[0]);
  const rope = prop('rope', lt[0]);

  const SCENES = [
    /* a. bolts off, looks back, runs home */
    () => { run(lt[1], [t('none'), t('translateX(22px) translateY(-2px) rotate(10deg)',.22), t('translateX(24px) rotate(-10deg)',.36), t('translateX(26px) rotate(8deg)',.48), t('translateX(8px) rotate(-10deg)',.72), t('translateX(-5px) scaleX(1.15) scaleY(.88)',.86), t('none')], 1900, EIO); return 1900; },

    /* b. the f falls, neighbours catch it */
    () => {
      run(lt[3], [t('none'), t('translateY(13px) rotate(-16deg)',.32), t('translateY(15px) rotate(-12deg)',.52), t('translateY(-4px) rotate(5deg)',.82), t('none')], 1800, EIO);
      run(lt[2], [t('none'), t('rotate(20deg)',.38), t('rotate(17deg)',.58), t('none')], 1800, EIO);
      run(lt[4], [t('none'), t('rotate(-20deg)',.38), t('rotate(-17deg)',.58), t('none')], 1800, EIO);
      return 1800;
    },

    /* c. the e's shoulder each other back */
    () => {
      run(lt[4], [t('none'), t('translateX(6px) rotate(4deg)',.2), t('none',.45), t('translateX(-5px)',.75), t('none')], 1500, EIO);
      run(lt[5], [t('none'), t('translateX(9px) rotate(7deg)',.28), t('translateX(2px)',.5), t('translateX(-6px) rotate(-5deg)',.72), t('none')], 1500, SPRING);
      return 1500;
    },

    /* d. stadium wave, 60ms apart */
    () => { all.forEach((el, i) => run(el, [t('none'), t('translateY(-12px) scaleY(1.14) scaleX(.92)',.45), t('translateY(0) scaleY(.88) scaleX(1.1)',.72), t('none')], 620, EO, i * 60));
      return 620 + all.length * 60; },

    /* e. peel under the d: slip and spin */
    () => {
      run(peel, [o(0,'translateX(-50%) scale(.4) rotate(-20deg)'), o(1,'translateX(-50%) scale(1) rotate(0)',.18), o(1,'translateX(-50%) scale(1) rotate(0)',.72), o(0,'translateX(-50%) scale(.5) rotate(25deg)')], 2000, EO);
      run(lt[6], [t('none'), t('translateX(9px) translateY(5px) rotate(130deg)',.4), t('translateX(13px) translateY(6px) rotate(300deg)',.62), t('translateX(-3px) rotate(378deg)',.85), t('rotate(360deg)')], 2000, EIO);
      return 2000;
    },

    /* f. yawns, leans over, gets nudged back */
    () => {
      run(lt[0], [t('none'), t('scaleY(1.3) scaleX(.85) translateY(-4px)',.3), t('scaleY(1.05) scaleX(.97) translateY(-1px)',.46), t('rotate(17deg) translateX(3px)',.66), t('rotate(17deg) translateX(3px)',.78), t('rotate(-7deg) translateX(-2px)',.9), t('none')], 2200, EIO);
      run(lt[1], [t('none',.76), t('translateX(4px) rotate(6deg)',.86), t('none')], 2200, SPRING);
      return 2200;
    },

    /* g. the e's leap over each other */
    () => { const d = lt[5].offsetLeft - lt[4].offsetLeft;
      run(lt[4], [t('none'), t(`translate(${d*.5}px,-15px) rotate(180deg)`,.42), t(`translate(${d}px,0) rotate(360deg)`,.7), t(`translate(${d}px,0) rotate(360deg)`,.82), t('none')], 1900, EIO);
      run(lt[5], [t('none'), t(`translate(${-d*.5}px,13px) rotate(-180deg)`,.42), t(`translate(${-d}px,0) rotate(-360deg)`,.7), t(`translate(${-d}px,0) rotate(-360deg)`,.82), t('none')], 1900, EIO);
      return 1900; },

    /* h. wind bends the word like grass */
    () => { all.forEach((el, i) => run(el, [t('none'), t('skewX(-14deg) translateX(-2px)',.45), t('skewX(5deg) translateX(1px)',.76), t('none')], 1500, SPRING, i * 40));
      return 1500 + all.length * 40; },

    /* i. the d perches on the e */
    () => { const d = lt[6].offsetLeft - lt[5].offsetLeft;
      run(lt[6], [t('none'), t(`translate(${-d*.5}px,-22px)`,.26), t(`translate(${-d}px,-15px)`,.4), t(`translate(${-d}px,-15px)`,.66), t(`translate(${-d*.5}px,-24px)`,.84), t('translateY(2px) scaleY(.85) scaleX(1.12)',.94), t('none')], 2100, EIO);
      run(lt[5], [t('none',.38), t('scaleY(.86) scaleX(1.1)',.47), t('scaleY(.94) scaleX(1.04)',.66), t('none')], 2100, EO);
      return 2100; },

    /* j. sneezes; neighbours blown aside */
    () => {
      run(lt[2], [t('none'), t('scaleY(.8) scaleX(1.14) translateY(2px)',.36), t('scaleY(1.28) scaleX(.88) translateY(-4px)',.5), t('scaleY(.96) scaleX(1.04)',.64), t('none')], 1600, EIO);
      run(lt[1], [t('none',.46), t('translateX(-8px) rotate(-12deg)',.58), t('none')], 1600, SPRING);
      run(lt[3], [t('none',.46), t('translateX(8px) rotate(12deg)',.58), t('none')], 1600, SPRING);
      return 1600;
    },

    /* k. nods off under z's, jolts awake */
    () => {
      lt.forEach((el, i) => run(el, [t('none'), t('translateY(2px) rotate(-6deg) scaleY(.94)',.4), t('translateY(2px) rotate(-6deg) scaleY(.94)',.68), t('translateY(-4px) rotate(3deg) scaleY(1.07)',.83), t('none')], 2300, EIO, i * 25));
      run(zzz, [o(0,'translateY(2px) scale(.7)'), o(1,'translateY(-7px) scale(1)',.38), o(1,'translateY(-12px) scale(1)',.62), o(0,'translateY(-18px) scale(.8)',.8), o(0,'translateY(-18px) scale(.8)')], 2300, EO);
      return 2500;
    },

    /* l. the f somersaults */
    () => { run(lt[3], [t('none'), t('translateY(-20px) rotate(180deg)',.4), t('translateY(0) rotate(360deg)',.72), t('translateY(2px) scaleY(.78) scaleX(1.16) rotate(360deg)',.82), t('rotate(360deg)')], 1700, EIO); return 1700; },

    /* m. hides, pops out the far side */
    () => { const d = lt[2].offsetLeft - lt[1].offsetLeft;
      run(lt[2], [o(1,'none'), o(0,`translateX(${-d}px)`,.22), o(0,`translateX(${-d}px)`,.56), o(0,`translateX(${d*.9}px)`,.63), o(1,`translateX(${d*.6}px) scale(1.12)`,.74), o(1,'none')], 2200, EIO);
      run(lt[1], [t('none',.26), t('rotate(-15deg)',.38), t('rotate(15deg)',.5), t('rotate(-9deg)',.6), t('none')], 2200, EIO);
      return 2200; },

    /* n. shivers, then two letters huddle. One animation per letter: a second on the
       same element would fight it for transform. */
    () => { lt.forEach((el, i) => {
        const f = [];
        for (let j = 0; j <= 14; j++) f.push(t(`translateX(${j % 2 ? 1 : -1}px)`,+(j / 14 * .4).toFixed(3)));
        f.push(t('none',.5));
        if (i === 4) f.push(t('rotate(12deg) translateX(2px)',.68), t('rotate(10deg) translateX(2px)',.86));
        if (i === 5) f.push(t('rotate(-12deg) translateX(-2px)',.68), t('rotate(-10deg) translateX(-2px)',.86));
        f.push(t('none',1));
        run(el, f, 2000, EIO);
      }); return 2000; },

    /* o. domino, then back up the chain */
    () => {
      const D = 2400;
      origin(all, 'bottom left', D);
      all.forEach((el, i) => run(el, [t('none'), t('rotate(70deg)',.3), t('rotate(70deg)',.6), t('rotate(-8deg)',.86), t('none')], 1500, EIO, i * 110));
      return D;
    },

    /* p. the d cuts the queue and returns */
    () => { const d = lt[6].offsetLeft - lt[0].offsetLeft;
      run(lt[6], [t('none'), t(`translate(${-d*.5}px,-26px) rotate(-12deg)`,.3), t(`translate(${-d}px,0)`,.5), t(`translate(${-d}px,0)`,.64), t(`translate(${-d*.5}px,-24px) rotate(12deg)`,.84), t('none')], 2300, EIO);
      lt.slice(0, 6).forEach((el, i) => run(el, [t('none',.22), t('translateX(-3px) rotate(-7deg)',.34), t('none',.5)], 2300, EO, i * 20));
      return 2300; },

    /* q. piano keys, down then up */
    () => { const D = 1800;
      all.forEach((el, i) => {
        run(el, [t('none'), t('translateY(4px)',.25), t('none',.5)], D * .5, EO, i * 70);
        run(el, [t('none'), t('translateY(4px)',.25), t('none',.5)], D * .5, EO, D * .5 + (all.length - 1 - i) * 70);
      });
      return D + all.length * 70; },

    /* r. the a juggles a ball three times */
    () => { const D = 2100, toss = [];
      for (let k = 0; k < 3; k++) {
        const s = k / 3;
        toss.push({opacity:1, transform:'translateY(0) scale(1)', offset:+(s).toFixed(3)}, {opacity:1, transform:'translateY(-18px) scale(.9)', offset:+(s + .16).toFixed(3)}, {opacity:1, transform:'translateY(0) scale(1)', offset:+(s + .32).toFixed(3)});
      }
      run(ball, [o(0,'scale(.4)'), ...toss, o(0,'scale(.4)')], D, EIO);
      run(lt[0], [t('none'), t('translateY(-2px) scaleY(1.06)',.2), t('none',.4), t('translateY(-2px) scaleY(1.06)',.6), t('none')], D, EIO);
      return D; },

    /* s. magnet pulls the word together */
    () => { const D = 1900, c = mid(all[Math.floor(all.length / 2)]);
      all.forEach(el => {
        const pull = (c - mid(el)) * .55;
        run(el, [t('none'), t(`translateX(${pull}px)`,.34), t(`translateX(${pull + 1.5}px)`,.44), t(`translateX(${pull - 1.5}px)`,.54), t(`translateX(${pull}px)`,.62), t(`translateX(${-pull * .25}px)`,.84), t('none')], D, SPRING);
      });
      return D; },

    /* t. the e turns to look, so does its neighbour */
    () => { const D = 2200;
      run(lt[4], [t('none'), t('scaleX(-1)',.2), t('scaleX(-1)',.62), t('none',.82), t('none')], D, EIO);
      run(lt[5], [t('none',.3), t('scaleX(-1)',.48), t('scaleX(-1)',.7), t('none',.88), t('none')], D, EIO);
      return D; },

    /* u. the logo jumps, the word startles */
    () => { const D = 1800;
      if (logo) run(logo, [t('none'), t('translateY(-14px) scaleY(1.2) scaleX(.86)',.14), t('translateY(0) scaleY(.86) scaleX(1.14)',.3), t('none',.5)], D, EO);
      lt.forEach((el, i) => {
        const f = [t('none',0), t('none',.12),
                   {transform:'translateY(-9px) rotate(' + (i % 2 ? 6 : -6) + 'deg)', offset:.24}];
        for (let j = 0; j <= 8; j++) f.push(t(`translateX(${j % 2 ? 1.5 : -1.5}px)`,+(.34 + j / 8 * .34).toFixed(3)));
        f.push(t('none',1));
        run(el, f, D, EO, 20 + i * 12);
      });
      return D; },

    /* v. the f bows, the rest applaud */
    () => { const D = 2200;
      origin([lt[3]], 'bottom center', D);
      run(lt[3], [t('none'), t('scale(1.25) translateY(-3px)',.22), t('scale(1.25) rotate(20deg)',.44), t('scale(1.25) rotate(-4deg)',.6), t('scale(1.25) rotate(14deg)',.72), t('scale(1.1)',.86), t('none')], D, EIO);
      lt.forEach((el, i) => { if (i === 3) return;
        const f = [t('none',0)];
        for (let j = 1; j <= 6; j++) f.push(t(`translateY(${j % 2 ? -3 : 0}px) scaleY(${j % 2 ? 1.06 : 1})`,+(.3 + j / 6 * .5).toFixed(3)));
        f.push(t('none',1));
        run(el, f, D, EO, i * 18);
      });
      return D; },

    /* w. tug of war on a thin rope */
    () => { const D = 2100;
      run(rope, [o(0,'scaleX(.2)'), o(1,'scaleX(1)',.16), o(1,'scaleX(1.25)',.52), o(1,'scaleX(.85)',.76), o(0,'scaleX(.2)')], D, EIO);
      run(lt[0], [t('none'), t('rotate(-14deg) translateX(-3px)',.4), t('rotate(-16deg) translateX(-4px)',.6), t('rotate(6deg) translateX(3px)',.8), t('none')], D, EIO);
      run(lt[1], [t('none'), t('rotate(14deg) translateX(3px)',.4), t('rotate(18deg) translateX(5px)',.62), t('rotate(10deg) translateX(2px)',.82), t('none')], D, EIO);
      return D; },

    /* x. the word takes the lift, the d is late */
    () => { const D = 1900;
      all.forEach(el => { if (el === lt[6]) return;
        run(el, [t('none'), t('translateY(-6px)',.3), t('translateY(-6px)',.7), t('none')], D, SMOOTH);
      });
      run(lt[6], [t('none'), t('none',.34), t('translateY(-10px) scaleY(1.12)',.48), t('translateY(-6px) scaleY(.94)',.58), t('translateY(-6px)',.7), t('none')], D, EO);
      return D; }
  ];

  /* ---- idle fidgets: one letter, one small move, only between scenes ---- */
  const FIDGETS = [
    el => run(el, [t('none'), t('translateY(-3px)',.45), t('none')], 380, EO),
    el => run(el, [t('none'), t('rotate(6deg)',.4), t('rotate(-4deg)',.7), t('none')], 460, EIO),
    el => run(el, [t('none'), t('scaleY(.85)',.4), t('scaleY(1.04)',.7), t('none')], 320, EO),
    el => run(el, [t('none'), t('rotate(-6deg) translateX(-1px)',.5), t('none')], 500, EIO)
  ];

  const pickFrom = (n, recent, keep) => {
    let i;
    do { i = Math.floor(Math.random() * n); } while (recent.includes(i));
    recent.push(i);
    if (recent.length > keep) recent.shift();
    return i;
  };

  const seen = [];
  let busyUntil = 0, sceneTimer = 0, fidgetTimer = 0;

  const playScene = () => {
    if (document.hidden) return;
    const d = SCENES[pickFrom(SCENES.length, seen, 5)]() || 2000;
    busyUntil = Date.now() + d;
  };
  const playFidget = () => {
    if (document.hidden || Date.now() < busyUntil) return;   /* a scene owns the stage */
    FIDGETS[Math.floor(Math.random() * FIDGETS.length)](all[Math.floor(Math.random() * all.length)]);
  };

  const queueScene = ms => { clearTimeout(sceneTimer); sceneTimer = setTimeout(() => { playScene(); queueScene(3000 + Math.random() * 4000); }, ms); };
  const queueFidget = ms => { clearTimeout(fidgetTimer); fidgetTimer = setTimeout(() => { playFidget(); queueFidget(1200 + Math.random() * 1300); }, ms); };

  const start = () => { queueScene(2000); queueFidget(1500); };
  const stop = () => { clearTimeout(sceneTimer); clearTimeout(fidgetTimer); };
  start();
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();
