/**
 * A module with animation helper functions
 */

const FADE_DURATION = 200;
const SWIPE_DISTANCE = 64;

let animate = function(progress, duration, step, done, token) {
	if (progress === 1) {
		done();
		return null;
	}

	let startProgress = progress;
	let start = null;
	token = token || {};
	let cb = function(timestamp) {
		if (!start) {
			start = timestamp - duration * startProgress;
		}

		progress = (timestamp - start) / duration;
		if (progress >= 1) {
			delete token.requestId;
			return done();
		}

		step(progress);
		token.requestId = window.requestAnimationFrame(cb);
	};

	token.requestId = window.requestAnimationFrame(cb);
	return token;
};

let slideDone = function(el, show, callback) {
	el.style.opacity = '';
	el.style.height = '';
	el.style.width = '';
	el.style.overflow = '';
	el.style.display = show ? '' : 'none';
	if (callback) {
		callback();
	}
	return null;
};


let invert = function(v, ok) {
	return ok ? 1 - v : v;
};

let easeOut = function(p) {
	return 1 - (1 - p) * (1 - p);
};

let unstyledCbs = null;
let getUnstyledDimensions = function(el, cb) {
	if (unstyledCbs !== null) {
		unstyledCbs.push([ el, cb, '', 0 ]);
		return;
	}

	unstyledCbs = [[ el, cb, '', 0 ]];
	window.requestAnimationFrame(() => {
		let cs = unstyledCbs;
		unstyledCbs = null;
		// Reset all styles
		for (let c of cs) {
			c[2] = c[0].style.cssText;
			c[0].style.cssText = '';
		}

		// Check calculated heights
		for (let c of cs) {
			c[3] = c[0].offsetHeight;
			c[4] = c[0].offsetWidth;
		}

		// Reset all styles
		for (let c of cs) {
			c[0].style.cssText = c[2];
		}

		// Call all callbacks
		for (let c of cs) {
			c[1](c[3], c[4]);
		}
	});
};

/**
 * Fades the opacity of an element with the duration based on the elements current opacity.
 * @param {HTMLElement} el HTML element to fade.
 * @param {number} opacity Opacity to fade to.
 * @param {object} [opt] Optional parameters
 * @param {number} [opt.duration] Optional fade duration in milliseconds, measured when going from 0 to 1 opacity.
 * @param {function} [opt.callback] Optional callback function once the animation is complete.
 * @returns {object} Animation token
 */
export let fade = function(el, opacity, opt = {}) {
	let callback = opt.callback || null;
	let origin = el.style.opacity ? Number(el.style.opacity) : 1;

	// Calculate start time relative to start opacity.
	let duration = (typeof opt.duration == 'number' ? opt.duration : FADE_DURATION) * Math.abs(origin - opacity);
	return animate(
		0,
		duration,
		function(p) {
			el.style.opacity = p * opacity + (1 - p) * origin;
		},
		function() {
			el.style.opacity = opacity;
			if (callback) {
				callback();
			}
		}
	);
};

/**
 * Swipes an element out to the side while fading it out.
 * @param {HTMLElement} el HTML element to swipe out.
 * @param {number} direction Direction to swipe. -1 for left, 0 for fade only, and 1 for right.
 * @param {object=} opt Optional parameters
 * @param {number=} opt.duration Optional fade duration in milliseconds.
 * @param {number=} opt.distance Optional swipe distance in pixels.
 * @param {number=} opt.reset Optional reset flag. If true, opacity and position will be reset. If false, animation will continue from current position and opacity. Default is true.
 * @param {function=} opt.callback Optional callback function once the animation is complete.
 * @returns {object} Animation token
 */
export let swipeOut = function(el, direction, opt = {}) {
	let callback = opt.callback || null;
	let startProgress = 0;
	let basePos = 0;
	let dirDist = direction * (opt.distance || SWIPE_DISTANCE);
	if (opt.reset !== undefined ? opt.reset : true) {
		el.style.opacity = '';
		el.style.left = '';
	} else {
		startProgress = el.style.opacity ? 1 - parseFloat(el.style.opacity) : 0;
		if (startProgress == 1) {
			if (callback) callback();
			return null;
		}
		// The assumed position from where the swipe animation started
		basePos = (el.style.left ? parseFloat(el.style.left) : 0) - dirDist * startProgress * startProgress;
	}

	let duration = typeof opt.duration == 'number' ? opt.duration : FADE_DURATION;
	let start = null;
	let token = {};
	let step = function(timestamp) {
		// Calculate start time relative to start opacity.
		if (!start) start = timestamp - duration * startProgress;
		let progress = (timestamp - start) / duration;
		if (progress >= 1) {
			el.style.opacity = 0;
			if (callback) callback();
			return;
		}

		el.style.opacity = 1 - progress;
		el.style.left = (basePos + dirDist * progress * progress) + 'px';
		token.requestId = window.requestAnimationFrame(step);
	};

	token.requestId = window.requestAnimationFrame(step);
	return token;
};

/**
 * Swipes an element in from the side while fading it in.
 * @param {HTMLElement} el HTML element to swipe in.
 * @param {number} direction Direction to swipe. -1 for left, 0 for fade only, and 1 for right. Ignored if opt.reset is false.
 * @param {object=} opt Optional parameters
 * @param {number=} opt.duration Optional fade duration in milliseconds.
 * @param {number=} opt.distance Optional swipe distance in pixels.
 * @param {number=} opt.reset Optional reset flag. If true, opacity and position will be reset. If false, animation will continue from current position and opacity. Default is true.
 * @param {function=} opt.callback Optional callback function once the animation is complete.
 * @returns {object} Animation token
 */
export let swipeIn = function(el, direction, opt = {}) {
	let callback = opt.callback || null;
	let startProgress = 0;
	let dirDist = direction * (opt.distance || SWIPE_DISTANCE);
	let basePos = -dirDist;

	if (opt.reset !== undefined ? opt.reset : true) {
		el.style.opacity = 0;
	} else {
		startProgress = el.style.opacity ? parseFloat(el.style.opacity) : 1;
		if (startProgress == 1) {
			if (callback) callback();
			return null;
		}
		// Set direction distance to the negative of current position
		dirDist = (el.style.left ? -parseFloat(el.style.left) : 0);
		// The assumed position from where the swipe animation started
		basePos = dirDist * startProgress * (2 - startProgress) - dirDist;
	}

	let duration = typeof opt.duration == 'number' ? opt.duration : FADE_DURATION;
	let start = null;
	let token = {};
	let step = function(timestamp) {
		// Calculate start time relative to start opacity.
		if (!start) start = timestamp - duration * startProgress;
		let progress = (timestamp - start) / duration;
		if (progress >= 1) {
			el.style.opacity = '';
			el.style.left = '';
			if (callback) callback();
			return;
		}

		el.style.opacity = progress;
		el.style.left = (basePos + dirDist * progress * (2 - progress)) + 'px';
		token.requestId = window.requestAnimationFrame(step);
	}.bind(this);

	token.requestId = window.requestAnimationFrame(step);
	return token;
};

/**
 * Slides an element vertically while fading it in.
 * @param {HTMLElement} el HTML element to slide up/down.
 * @param {boolean} show Flag if element should be slide up (show), will slide down (hide) if false.
 * @param {object} [opt] Optional parameters
 * @param {number} [opt.duration] Optional fade duration in milliseconds.
 * @param {number} [opt.reset] Optional reset flag. If true, opacity and position will be reset. If false, animation will continue from current height and opacity. Default is true.
 * @param {function} [opt.callback] Optional callback function once the animation is complete.
 * @returns {object} Animation token
 */
export let slideVertical = function (el, show, opt) {
	return internalSlide(false, el, show, opt);
};

/**
 * Slides an element horizontally while fading it in.
 * @param {HTMLElement} el HTML element to slide up/down.
 * @param {boolean} show Flag if element should be slide up (show), will slide down (hide) if false.
 * @param {object} [opt] Optional parameters
 * @param {number} [opt.duration] Optional fade duration in milliseconds.
 * @param {number} [opt.reset] Optional reset flag. If true, opacity and position will be reset. If false, animation will continue from current height and opacity. Default is true.
 * @param {function} [opt.callback] Optional callback function once the animation is complete.
 * @returns {object} Animation token
 */
export let slideHorizontal = function(el, show, opt) {
	return internalSlide(true, el, show, opt);
};

/**
 * Slides an element horizontally while fading it in.
 * @param {boolean} hori Flag if slide should be horizontal instead of vertical.
 * @param {HTMLElement} el HTML element to slide up/down.
 * @param {boolean} show Flag if element should be slide up (show), will slide down (hide) if false.
 * @param {object} [opt] Optional parameters
 * @param {number} [opt.duration] Optional fade duration in milliseconds.
 * @param {number} [opt.reset] Optional reset flag. If true, opacity and position will be reset. If false, animation will continue from current height and opacity. Default is true.
 * @param {function} [opt.callback] Optional callback function once the animation is complete.
 * @returns {object} Animation token
 * @private
 */
let internalSlide = function (hori, el, show, opt = {}) {
	let token = { requestId: true };
	let progress = 0;
	let origin, target, d, e;
	let reset = opt.reset !== undefined ? opt.reset : true;
	let f = reset || show
		? getUnstyledDimensions
		: (el, cb) => cb(0, 0);
	let prop = hori ? 'width' : 'height';
	let offsetProp = hori ? 'offsetWidth' : 'offsetHeight';

	f(el, (unstyledHeight, unstyledWidth) => {
		if (!token.requestId) {
			return;
		}
		let dim = hori ? unstyledWidth : unstyledHeight;

		if (reset) {
			el.style.opacity = show ? 0 : 1;
			target = show ? dim : 0;
			origin = show ? 0 : dim;
			el.style[prop] = origin + 'px';
		} else {
			progress = invert(
				el.style.opacity
					? parseFloat(el.style.opacity)
					: (el.style.display === 'none'
						? 0
						: 1
					),
				!show
			);

			if (progress === 1) {
				return slideDone(el, show, opt.callback);
			}

			target = show
				? dim
				: 0;

			e = easeOut(progress);
			d = el.style.display === 'none'
				? 0
				: el[offsetProp];
			origin = (d - (e * target)) / (1 - e);
		}

		el.style.display = '';
		el.style.overflow = 'hidden';

		animate(
			progress,
			typeof opt.duration == 'number' ? opt.duration : FADE_DURATION,
			p => {
				e = easeOut(p);
				el.style.opacity = show ? p : 1 - p;
				el.style[prop] = (e * target + (1 - e) * origin) + 'px';
			},
			() => slideDone(el, show, opt.callback),
			token
		);
	});

	return token;
};

/**
 * Stops the animation for the given token.
 * @param {object} token Animation token.
 * @returns {boolean} True if the animation was active, otherwise false.
 */
export let stop = function(token) {
	if (token && token.requestId) {
		if (token.requestId !== true) {
			window.cancelAnimationFrame(token.requestId);
		}
		delete token.requestId;
		return true;
	}
	return false;
};
