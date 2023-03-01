module.exports = {
  getRelatedContent(collection, seeAlso) {
    if (seeAlso instanceof Array) {
      return collection.filter((page) => seeAlso.includes(page.data.code));
    }

    return collection.filter((page) => page.data.code === seeAlso);
  }
};
