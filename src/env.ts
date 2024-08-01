const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL || "http://localhost:1337",
  VITE_BANK_NUMBER: import.meta.env.VITE_BANK_NUMBER || "0989859398",
  VITE_BANK_NAME: import.meta.env.VITE_BANK_NAME || "MB Bank",
  VITE_BANK_USER_NAME:
    import.meta.env.VITE_BANK_USER_NAME || "NGUYEN DANG BANG",
};

export default env;
