export default (err, req, res) => {
  console.log(err);
  res.status(err.statusCode || 500).json({ error: err.name ? err : err.data });
};
