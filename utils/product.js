const { unlink } = require("fs/promises");
const { join } = require("path");
const Additive = require("../models/additive");
const Allergen = require("../models/allergen");

const rootDir = require("./path");

exports.deleteProduct = async (product) => {
  const files = await product.getFiles();

  if (files.length > 0) {
    for (const file of files) {
      // TODO: this should be edited if change the database structure.
      await unlink(join(rootDir, "files", file.fileName));
      await product.removeFile(file);
      await file.destroy();
    }
  }

  const allergens = await Allergen.findAll({
    where: {
      ProductId: product.id,
    },
  });

  for (const allergen of allergens) {
    await allergen.destroy();
  }

  const additives = await Additive.findAll({
    where: {
      ProductId: product.id,
    },
  });

  for (const additive of additives) {
    await additive.destroy();
  }

  const toppings = await product.getToppings();

  if (toppings.length > 0) {
    // TODO: this should be edited if change the database structure.
    await product.removeToppings(toppings);
  }

  return await product.destroy();
};
