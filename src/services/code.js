const generateCode = (length = 8) => {
  const string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const len = string.length
  let code = ''

  for(let i = 0; i < length; i++ ) {
    code += string[Math.floor(Math.random() * len)] 
  }

  return code
}

module.exports = generateCode
