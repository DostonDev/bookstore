const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const uniqueSlug = async (text, findFn) => {
  let slug = slugify(text);
  let existing = await findFn(slug);
  let counter = 1;
  while (existing) {
    slug = `${slugify(text)}-${counter}`;
    existing = await findFn(slug);
    counter++;
  }
  return slug;
};

module.exports = { slugify, uniqueSlug };
