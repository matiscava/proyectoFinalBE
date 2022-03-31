import dotenv from 'dotenv'
let fileEnv
if ( process.argv[2] == 'production' || process.argv[3] == 'production' ) {
  fileEnv = dotenv.config({ path: `production.env` })
} else {
  fileEnv = dotenv.config({ path: `development.env` })
}

export default fileEnv
