const bcrypt = require('bcryptjs');

const hashValue = async() => {
    const hashedPassword = await bcrypt.hash('password', 10);
    console.log(hashedPassword);
}

hashValue();