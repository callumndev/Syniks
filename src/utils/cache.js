const cache = module.exports;

cache.memes = [];

cache.getMemes = () => {
  return cache.memes.length > 0 ? cache.memes : false
}

cache.set = (memes) => {
  return cache.memes = memes;
}
