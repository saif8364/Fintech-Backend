import bcrypt from 'bcrypt';

async function hashPassword(password) {

    const saltRounds = 10;
    const hash =  bcrypt.hash(password, saltRounds);
    return hash;
}


async function comparePassword(password, hashedPassword) {
    return  bcrypt.compare(password, hashedPassword);
}

export { hashPassword, comparePassword };




