const randomStringGenerate = (len = 100) => {
  const chars =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lengths = chars.length;
  let random = "";
  for (let i = 0; i < len; i++) {
    let position = Math.ceil(Math.random() * (lengths - 1));
    random += chars[position]
  }
  return random
};

module.exports={randomStringGenerate}