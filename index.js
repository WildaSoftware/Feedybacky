let mod;
try {
    mod = require('./js/feedybacky.min');
} catch (_) {
    mod = require('./js/feedybacky');
}

module.exports = mod