export default class UserDto {
  id;
  email;
  role;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.role = model.role;
  }
}
