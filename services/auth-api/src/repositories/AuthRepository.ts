class AuthRepository {
  async saveUser({ user }: { user: string }): Promise<boolean> {
    console.log(user);
    return true;
  }

  async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<{ password: string; id: string; email: string }> {
    console.log(email);
    return {
      password: "password",
      email: "test@test.com",
      id: "1234",
    };
  }
}

export default new AuthRepository();
