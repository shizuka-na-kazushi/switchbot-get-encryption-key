function getPassword(done) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);

  var password = '';
  process.stdout.write('Password: ');
  process.stdin.on('data', function(ch) {
    ch = ch + '';

    // backspace
    if (ch.charCodeAt(0) === 127) {
      password = password.slice(0, -1);
      return;
    }

    switch (ch) {
      case '\n':
      case '\r':
      case '\u0004':
        // They've finished typing their password
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\n');
        done(password);
        break;
      case '\u0003':
        // Ctrl C
        throw new Error('Cancelled');
      default:
        // More passsword characters
        password += ch;
        break;
    }
  });
}

module.exports = async () => {
  return new Promise((resolve, reject) => {
    try {
      getPassword((password) => {resolve(password)});
    } catch (e) {
      reject(e);
    }
  });
};
