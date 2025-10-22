
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch(err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
} 

export default asyncHandler;







/* another way */
// const asyncHandler = fn => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// }