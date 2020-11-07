export default (field, schema) => async (req, res, next) => {
  try {
    const casted = await schema.validate(req[field]);

    if (!["cookies", "headers"].includes(field)) {
      req[field] = casted;
    }

    next();
  } catch (error) {
    res.status(422).json({ error });
  }
};
