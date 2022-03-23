const config = {
  PERS: process.env.PERS,
  FILE_PATH: process.env.FILE_PATH,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  MODE: process.env.MODE
}


const options = {
  ...config,
  mongodb: {
    // host: 'mongodb://localhost/ecommerce',
    cnxStr: `mongodb+srv://Matiscava:matinico11@proyectocoderhouse.uay7u.mongodb.net/ProyectoCoderHouse?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateOmdex: true,
      serverSelectionTimeoutMS: 5000
    }
  },
  file: {
    path: `./DB/fs`
  }
};

export default options;
