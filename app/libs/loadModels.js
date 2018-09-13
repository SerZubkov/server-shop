const mongoose = require('./mongoose');

module.exports = async function (models) {
  const promises = [];
  for (const name in models) {
    const modelObjects = models[name];

    for (const modelObject of modelObjects) {
      console.log(name);
      promises.push(mongoose.model(name).create(modelObject));
    }
  }

  await Promise.all(promises);
};
