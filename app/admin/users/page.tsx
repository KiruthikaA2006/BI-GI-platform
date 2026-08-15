"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import {
  Users,
  UserPlus,
  Mail,
  Search,
  Filter,
  Shield,
  Building,
  CheckCircle2,
  XCircle,
  Key,
  UserX,
  UserCheck,
  Edit,
  Building2,
  UserCog,
} from "lucide-react";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  status: string;
  department: { id: string; name: string } | null;
}

import { getActiveOrganization, getOrgMembers, registerOrgMember, Organization, OrgMember } from "@/lib/org-context";

export default function AdminUsersManagementPage() {
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const org = getActiveOrganization();
    setActiveOrg(org);
    const orgMembers = getOrgMembers(org.id);
    const mappedUsers: UserItem[] = orgMembers.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      designation: m.designation,
      role: m.role,
      status: m.status,
      department: { id: "dept_01", name: m.department },
    }));
    setUsers(mappedUsers);
  }, []);

  const [departments, setDepartments] = useState([
    { id: "dept_01", name: "Executive Engineering" },
    { id: "dept_02", name: "Sales & Marketing" },
    { id: "dept_03", name: "Business Analytics" },
    { id: "dept_04", name: "Finance & Operations" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDesignation, setUserDesignation] = useState("");
  const [userRole, setUserRole] = useState("ORGANIZATION_ADMIN");
  const [userDeptId, setUserDeptId] = useState("dept_01");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = departments.find((d) => d.id === userDeptId);
    const newUser: UserItem = {
      id: `usr_${Date.now()}`,
      name: userName,
      email: userEmail,
      designation: userDesignation || "Team Member",
      role: userRole,
      status: "active",
      department: deptObj ? { id: deptObj.id, name: deptObj.name } : null,
    };

    if (activeOrg) {
      registerOrgMember(activeOrg.id, {
        name: userName,
        email: userEmail,
        role: userRole,
        designation: userDesignation || "Team Member",
        department: deptObj?.name || "General",
        status: "active",
      });
    }

    setUsers([newUser, ...users]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const deptObj = departments.find((d) => d.id === userDeptId);

    if (activeOrg) {
      registerOrgMember(activeOrg.id, {
        name: userName,
        email: userEmail,
        role: userRole,
        designation: userDesignation,
        department: deptObj?.name || "General",
        status: "active",
      });
    }

    setUsers(
      users.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: userName,
            email: userEmail,
            designation: userDesignation,
            role: userRole,
            department: deptObj ? { id: deptObj.id, name: deptObj.name } : null,
          };
        }
        return u;
      })
    );
    setEditingUser(null);
    resetForm();
  };

  const handleToggleDeactivate = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "deactivated" : "active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserDesignation(user.designation);
    setUserRole(user.role);
    setUserDeptId(user.department?.id || "dept_01");
  };

  const resetForm = () => {
    setUserName("");
    setUserEmail("");
    setUserDesignation("");
    setUserRole("ORGANIZATION_ADMIN");
    setUserDeptId("dept_01");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-emerald-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Users Management" subtitle="Admin Node: Create, Invite, Edit, Deactivate, Assign Role, Assign Department" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Bar with Operations Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">Admin Architecture Node: USERS</span>
              <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                <span>User Account Administration</span>
              </h2>
              <p className="text-xs text-stone-600">
                Operations: <strong>Create</strong> • <strong>Invite</strong> • <strong>Edit</strong> • <strong>Deactivate</strong> • <strong>Assign Role</strong> • <strong>Assign Department</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-300 transition"
              >
                <Mail className="h-4 w-4 text-emerald-700" />
                <span>Invite User</span>
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create User</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-stone-300 p-4 rounded-2xl shadow-sm">
            <div className="relative">
              <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user name, email..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-xs text-stone-800 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 font-bold"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ORGANIZATION_ADMIN">Organization Admin</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="DEPARTMENT_MANAGER">Department Manager</option>
              <option value="ANALYST">Analyst</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-xs text-stone-800 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Assigned Department</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{user.name}</span>
                            <span className="text-[11px] text-slate-400 block">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-300 font-medium">{user.designation}</td>

                      <td className="p-4">
                        {user.department ? (
                          <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-200 text-[11px] font-semibold">
                            {user.department.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {user.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-4">
                        {user.status === "active" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> Deactivated
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                            title="Edit Role / Department"
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleDeactivate(user.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              user.status === "active"
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.status === "active" ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                            <span>{user.status === "active" ? "Deactivate" : "Activate"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingUser ? "Edit User, Assign Role & Department" : "Create New Admin User"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={userDesignation}
                  onChange={(e) => setUserDesignation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Assign Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ORGANIZATION_ADMIN">Organization Admin</option>
                    <option value="EXECUTIVE">Executive</option>
                    <option value="DEPARTMENT_MANAGER">Department Manager</option>
                    <option value="ANALYST">Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Assign Department</label>
                  <select
                    value={userDeptId}
                    onChange={(e) => setUserDeptId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                }}
                className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                {editingUser ? "Update User & Assign" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
