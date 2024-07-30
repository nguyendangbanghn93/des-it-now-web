const env = {
    API_URL: import.meta.env.API_URL || "http://localhost:1337",
};
console.log("🚀 ~ env:", env)

export default env;
