import jtw from 'jsonwebtoken';

const generateJWT = (id: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jtw.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateJWT;
