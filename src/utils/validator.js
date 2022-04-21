export default function ({ email, password, newPassword = undefined }) {
  const dataEmail = email;
  const pattern =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  email = pattern.test(email);
  if (!email) {
    console.log('данные email', dataEmail);
    return false;
  }

  const dataPass = password;
  if (!password || password.length < 6) {
    console.log('данные password', dataPass);
    return false;
  }

  const dataNewPass = newPassword;
  if (newPassword && password.length < 6) {
    console.log('данные newPassword', dataNewPass);
    return false;
  }

  return true;
}
