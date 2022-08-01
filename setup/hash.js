const bcrypt = require('bcryptjs');

const hashValue = async() => {
    const hashedPassword = await bcrypt.hash('password', 12);
    console.log(hashedPassword);
}

hashValue();