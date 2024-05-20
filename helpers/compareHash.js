import bcrypt from "bcrypt";

const compareHash = (password, hashPass) => bcrypt.compare(password, hashPass);

export default compareHash;
