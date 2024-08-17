import jtw from 'jsonwebtoken';

const generateJWT = (id: any) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  return jtw.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });
};

export default generateJWT;
