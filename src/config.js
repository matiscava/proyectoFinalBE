let pers
let mode
if ( process.argv[2] != 'production' || process.argv[2] != 'development' ) {
  pers = process.argv[2]
  if (process.argv[3]){
    mode = process.argv[3]
  }
} else {
  mode = process.argv[2]
}

const config = {
  PORT: process.env.PORT,
  PERS: process.env.PERS,
  FILE_PATH: process.env.FILE_PATH,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  MODE: process.env.MODE,
  SESSION_AGE: parseInt(process.env.SESSION_AGE)
}


const options = {
  ...config,
  mongodb: {
    // host: 'mongodb://localhost/ecommerce',
    cnxStr: `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_DATABASE}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateOmdex: true,
      serverSelectionTimeoutMS: 5000
    }
  },
  file: {
    path: `./${config.FILE_PATH}`
  }
};

export default options;
