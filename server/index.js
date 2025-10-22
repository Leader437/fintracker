// this way of importing is not official, but it works because of the way we set "type": "module" in package.json, we are using this to avoid using require() syntax in a module type project till dotenv officially supports ES6 import syntax
import { } from 'dotenv/config'        // already imported and configured dotenv in main index.js
import { connectDB, PORT } from './src/config/index.js'
import app from './src/app.js';

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`)
    })
  }).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit process with failure
  });









/* another good practice if we want to connect to db in the main index file rather than creating a separate file for db connection */


// ; (async () => {                   // starting iffi with a ; is a common practice, It prevents issues if something above doesn’t end with a semicolon (so your IIFE doesn’t get misinterpreted as part of the previous line).
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(MONGO_URI);
//     console.log("Connected to MongoDB");

//     // Start the server
//     app.listen(PORT, () => {
//       console.log(`Example app listening on port ${PORT}`)
//     })
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// })();