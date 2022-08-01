const bcrypt = require('bcrypt');

const fun = async () => {

    const hash = await bcrypt.hash('password', 10);

    const match = await bcrypt.compare('password', hash);

    console.log(match);
} 

fun();