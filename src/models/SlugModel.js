const mongoose = require('mongoose');
const slugify = require('slugify');

const SlugSchema = new mongoose.Schema({
  original: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SlugSchema.pre('save', async function (next) {
  if (!this.isModified('original')) return next();
  const baseSlug = slugify(this.original, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 0;
  const Model = this.constructor;
  while (await Model.findOne({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  this.slug = slug;
  next();
});

SlugSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug });
};

module.exports = mongoose.model('Slug', SlugSchema);
