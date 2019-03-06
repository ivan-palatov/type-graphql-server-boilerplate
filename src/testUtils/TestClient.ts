import { gCall } from './gCall';

const registerMutation = `mutation Register($data: RegisterInput!) {
  register(data: $data) {
    id
    email
    fullName
  }
}`;

const confirmEmail = `mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token) {
    id
    email
    fullName
  }
}`;

const login = `mutation Login($data: LoginInput!) {
  login(data: $data) {
    id
    email
    fullName
  }
}`;

const me = `{
  me {
    id
    email
    fullName
  }
}`;

const logout = `mutation {
  logout
}`;

const changePassword = `mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) {
    id
    email
    fullName
  }
}`;

export class TestClient {
  static register(email: string, password: string, firstName: string, lastName: string) {
    return gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName,
          lastName,
          email,
          password,
        },
      },
    });
  }

  static confirmEmail(token: string) {
    return gCall({
      source: confirmEmail,
      variableValues: { token },
    });
  }

  static login(email: string, password: string) {
    return gCall({
      source: login,
      variableValues: {
        data: {
          email,
          password,
        },
      },
    });
  }

  static me() {
    return gCall({
      source: me,
    });
  }

  static logout() {
    return gCall({
      source: logout,
    });
  }

  static changePassword(password: string, token: string) {
    return gCall({
      source: changePassword,
      variableValues: { data: { password, token } },
    });
  }
}
