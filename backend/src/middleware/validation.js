export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Revise os campos informados.', fields: result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })) });
    }
    req.validatedBody = result.data;
    next();
  };
}

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
