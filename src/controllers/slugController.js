const { nanoid } = require('nanoid');
const Slug = require('../models/SlugModel');
const logger = require('../utils/logger');


exports.generateSlug = async (req, res) => {
  try {
    const { prefix, length } = req.body;
    const slugLength = length || 8;

    if (slugLength < 1 || slugLength > 32) {
      return res.status(400).json({ message: 'Length must be between 1 and 32' });
    }

    let slug;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) { // Limit attempts to prevent infinite loops
      slug = (prefix || '') + nanoid(slugLength);
      const existingSlug = await Slug.findOne({ slug });
      if (!existingSlug) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Could not generate a unique slug after multiple attempts.' });
    }

    const newSlug = new Slug({ slug, prefix });
    await newSlug.save();

    logger.info(`Generated slug: ${slug}`);
    res.status(201).json({ slug });
  } catch (error) {
    logger.error(`Error generating slug: ${error}`);
    res.status(500).json({ message: 'Error generating slug', error: error.message });
  }
};

exports.getSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const slugData = await Slug.findOne({ slug });

    if (!slugData) {
      return res.status(404).json({ message: 'Slug not found' });
    }

    res.status(200).json(slugData);
  } catch (error) {
    logger.error(`Error retrieving slug: ${error}`);
    res.status(500).json({ message: 'Error retrieving slug', error: error.message });
  }
};