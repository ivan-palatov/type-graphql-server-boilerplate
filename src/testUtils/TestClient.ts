import rp from 'request-promise';

const url = 'http://localhost:4000/graphql';
const options = {
  withCredentials: true,
  jar: rp.jar(),
  json: true,
};

export class TestClient {
  options: rp.RequestPromiseOptions;

  constructor() {
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
    };
  }

  static register(email: string, password: string, firstName: string, lastName: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `
          mutation {
            register(
              data: {
                email: "${email}"
                password: "${password}"
                firstName: "${firstName}"
                lastName: "${lastName}"
              }
            ) {
              id
              email
              fullName
            }
          }`,
      },
    });
  }

  static confirmEmail(token: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `mutation {
          confirmEmail(token: "${token}") {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  login(email: string, password: string) {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `mutation {
          login(data: {email: "${email}", password: "${password}"}) {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  me() {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `{
          me {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  logout() {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `mutation {
          logout
        }`,
      },
    });
  }

  static changePassword(password: string, token: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `mutation {
          changePassword(data: {password: "${password}", token: "${token}"}) {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  static getStory(id: number) {
    return rp.post(url, {
      ...options,
      body: {
        query: `{
          getStory(id: ${id}) {
            id
            title
            description
            tags
          }
        }
        `,
      },
    });
  }

  static getStories(
    skip: number = 0,
    take: number = 10,
    sortBy: string = 'length',
    sortOrder: string = 'DESC'
  ) {
    return rp.post(url, {
      ...options,
      body: {
        query: `{
          getStories(data: {
            skip: ${skip}
            take: ${take}
            sortBy: "${sortBy}"
            sortOrder: "${sortOrder}"
          }) {
            count
            stories {
              id
              title
              description
              tags
              length
            }
          }
        }`,
      },
    });
  }
}
