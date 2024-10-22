'use strict';



const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

// const asyncHandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {

//             // Handle known error types gracefully
//             if (error instanceof ErrorResponse) {
//                 return res.status(error.statusCode).json({ message: error.message });
//             } else {
//                 return next(error);
//             }
//         }
//     };
// };

module.exports = {
    asyncHandler
}