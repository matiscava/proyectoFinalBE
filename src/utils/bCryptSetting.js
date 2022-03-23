import bCrypt from 'bcrypt';

export const createHash = (password) => {
  return bCrypt.hashSync(
      password,
      bCrypt.genSaltSync(10),
      null
  );
}
export const  isValidPassword = ( user , password ) => {
  return bCrypt.compareSync( password , user.password )
}
