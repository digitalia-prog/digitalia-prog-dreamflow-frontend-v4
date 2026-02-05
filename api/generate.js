module.exports = async (req, res) => {
  res.status(200).json({
    success: true,
    content: "✅ TEST OK — l’API répond bien"
  });
};


