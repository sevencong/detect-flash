import swfobject from 'swfobject';

const TIMEOUT = 1000;
const ID = '__flash_detector';
const CALLBACK = `${ID}_call`;

function clear(el) {
  document.body.removeChild(el);
  delete window[CALLBACK];
}

/**
 * Detects if Adobe Flash is actually alive in a browser
 * @param {string} swfPath - The path to FlashDetector.swf
 * @param {number} [timeout=TIMEOUT(1000)] The milliseconds of your detection timeout
 * @returns {Promise} Returns a Promise object which is resolved only when Flash plugin is alive
 */
export function detectFlash(swfPath, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    if (!navigator.plugins['Shockwave Flash']) {
      reject();
      return;
    }
    const el = document.createElement('DIV');
    const wrapper = el.cloneNode();

    el.id = ID;
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.style.position = 'absolute';
    wrapper.appendChild(el);
    document.body.appendChild(wrapper);

    const timeoutId = setTimeout(() => {
      clear(wrapper, el.id);
      reject();
    }, timeout);

    window[CALLBACK] = function callbackFromFlashDetector() {
      clearTimeout(timeoutId);
      setTimeout(() => clear(wrapper), 0);
      resolve();
    };

    swfobject.embedSWF(swfPath, el.id, '10', '10', '10.0.0');
  });
}

export default detectFlash;
