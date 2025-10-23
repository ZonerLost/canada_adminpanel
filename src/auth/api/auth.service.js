export async function login(email, password) {
  // Use email and password for authentication logic
  console.log(`Logging in user: ${email} with password: ${password}`);
  return { token: "demo" };
}
export async function signIn() {
  return { ok: true, token: "dev-token" };
}
