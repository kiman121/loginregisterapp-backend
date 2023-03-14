import mongoose from 'mongoose';
import colors from 'colors';

import environment from './config/environment.js';
import App from './app.js';

(async () => {
  try {
    let { db, dbPassword } = environment;
    db = db.replace('<PASSWORD>', dbPassword);

    const conn = await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    const app = new App();

    app.listen();
  } catch (error) {
    console.log(
      `Something went wrong when initializing the server:\n${error.stack}`.red
        .underline.bold
    );
  }
})();
