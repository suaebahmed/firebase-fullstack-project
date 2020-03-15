
const isEmpty = (string) =>{
    if(string.trim() == '') return true
    return false
  }
const isEmail = (string) =>{
    const regEx = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
    // if(string.match(regEx)) return true;
    if(string !== '') return true
    return false;
  }

exports.validateSignupData = ({email,password,confirmPassword,handle}) =>{
  let errors = {}
  if(isEmpty(email)){
    errors.email = 'email must not be empty';
  }else if(!isEmail(email)){
    errors.email = 'Must be a valid email address.'
  }
  if(isEmpty(password)) errors.password = 'password must not be empty';
  if(password !== confirmPassword) errors.confirmPassword = 'Password should be match'
  if(isEmpty(handle)) errors.handle = 'handle must not be empty'

  return {
    errors: errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }

}

exports.validateSigninData = ({email,password}) =>{
  let errors = {}
  if(isEmpty(email)){
    errors.email = 'email must not be empty'
  }
  if(isEmpty(password)){
    errors.password = 'password must not be empty'
  }

  return {
    errors: errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}
