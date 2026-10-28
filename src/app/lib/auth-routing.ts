export type AppRole = "DRIVER" | "ADMIN" | "SUPER_ADMIN";

export function dashboardForRole(role: AppRole) {
  return role === "SUPER_ADMIN" ? "/superadmin" : role === "ADMIN" ? "/admin" : "/Dashboard";
}

export function validateLogin(email: string, password: string) {
  return email.trim() && password ? null : "Enter your email and password.";
}

export function validateSignup(input: { fullName: string; username: string; email: string; password: string; confirmation: string }) {
  if (!input.fullName.trim() || !input.username.trim() || !input.email.trim() || !input.password || !input.confirmation) return "Complete every field.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return "Enter a valid email address.";
  if (input.password.length < 8) return "Password must contain at least 8 characters.";
  if (input.password !== input.confirmation) return "Passwords do not match.";
  return null;
}
