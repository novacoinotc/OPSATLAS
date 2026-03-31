"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Shield,
  Eye,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "VIEWER";
  active: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "VIEWER" as "ADMIN" | "VIEWER",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [session, router]);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", role: "VIEWER" });
      fetchUsers();
    } else {
      const data = await res.json();
      setFormError(data.error || "Error al crear usuario");
    }
    setSubmitting(false);
  }

  async function toggleUserActive(user: User) {
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    fetchUsers();
  }

  async function deleteUser(user: User) {
    if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`))
      return;

    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-muted text-sm mt-1">
            Administra el acceso al sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-blue hover:from-accent-light hover:to-accent-blue-light transition-all hover-lift"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Create user form */}
      {showForm && (
        <form
          onSubmit={handleCreateUser}
          className="glass rounded-2xl p-6 glow-purple fade-in"
        >
          <h3 className="text-lg font-semibold mb-4">Crear Usuario</h3>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted font-medium mb-1.5">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Juan Pérez"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="juan@opsatlas.mx"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted font-medium mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Mínimo 8 caracteres"
                className="w-full"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-xs text-muted font-medium mb-1.5">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "ADMIN" | "VIEWER",
                  })
                }
                className="w-full"
              >
                <option value="VIEWER">Viewer — Solo lectura</option>
                <option value="ADMIN">Admin — Acceso completo</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-blue hover:from-accent-light hover:to-accent-blue-light transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Usuario
            </button>
          </div>
        </form>
      )}

      {/* Users list */}
      <div className="glass rounded-2xl overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent-blue/20 flex items-center justify-center text-accent-light text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-accent/15 text-accent-light"
                        : "bg-accent-blue/15 text-accent-blue-light"
                    }`}
                  >
                    {user.role === "ADMIN" ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    {user.role === "ADMIN" ? "Admin" : "Viewer"}
                  </span>
                </td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      user.active ? "text-success" : "text-muted"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.active ? "bg-success pulse-dot" : "bg-muted"
                      }`}
                    />
                    {user.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="text-muted-foreground text-sm">
                  {formatDate(user.createdAt)}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleUserActive(user)}
                      className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-all"
                      title={user.active ? "Desactivar" : "Activar"}
                    >
                      {user.active ? (
                        <ToggleRight className="w-4 h-4 text-success" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>
                    {user.id !== session?.user.id && (
                      <button
                        onClick={() => deleteUser(user)}
                        className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
