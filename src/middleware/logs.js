// const logRequest = (req, res, next) => {
//     console.log('Terjadi request ke PATH: ', req.path);
//     next();
// }

// module.exports = logRequest;

const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] - Method: ${req.method} - Path: ${req.path}`);
    next();
}

module.exports = logRequest;