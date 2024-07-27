// utils/dbHelper.js

const createHash = () => {
  // crate number from 16 numbers
  const number = Math.floor(Math.random() * 10000000000000000);
  const hash = `${number}`;
  return hash;
};

export { createHash };
