"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";
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
  MoreVertical,
  Key,
  UserX,
  UserCheck,
  Edit,
  Building2,
} from "lucide-react";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: string;
  status: string;
  department: { id: string; name: string } | null;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "usr_01",
      name: "Kiruthika Anand",
      email: "kiruthika@qubertrix.com",
      phone: "+91 98765 43210",
      designation: "Platform Administrator",
      role: "OWNER",
      status: "active",
      department: { id: "dept_01", name: "Executive Engineering" },
    },
    {
      id: "usr_02",
      name: "Sarah Jenkins",
      email: "sarah.j@qubertrix.com",
      phone: "+91 98765 11223",
      designation: "Head of Marketing",
      role: "ADMIN",
      status: "active",
      department: { id: "dept_02", name: "Sales & Marketing" },
    },
    {
      id: "usr_03",
      name: "Rahul Verma",
      email: "rahul.v@qubertrix.com",
      phone: "+91 98765 99887",
      designation: "Lead Data Analyst",
      role: "MANAGER",
      status: "active",
      department: { id: "dept_03", name: "Business Analytics" },
    },
    {
      id: "usr_04",
      name: "David Miller",
      email: "david.m@qubertrix.com",
      phone: "+91 98765 33445",
      designation: "Junior Analyst",
      role: "MEMBER",
      status: "deactivated",
      department: { id: "dept_03", name: "Business Analytics" },
    },
  ]);

  const [departments, setDepartments] = useState([
    { id: "dept_01", name: "Executive Engineering" },
    { id: "dept_02", name: "Sales & Marketing" },
    { id: "dept_03", name: "Business Analytics" },
    { id: "dept_04", name: "Finance & Operations" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Form states
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserDesignation, setNewUserDesignation] = useState("");
  const [newUserRole, setNewUserRole] = useState("MEMBER");
  const [newUserDeptId, setNewUserDeptId] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    const matchesDept = deptFilter === "ALL" || u.department?.id === deptFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesDept;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = departments.find((d) => d.id === newUserDeptId);
    const newUser: UserItem = {
      id: `usr_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || "N/A",
      designation: newUserDesignation || "Team Member",
      role: newUserRole,
      status: "active",
      department: deptObj ? { id: deptObj.id, name: deptObj.name } : null,
    };
    setUsers([newUser, ...users]);
    setShowCreateModal(false);
    setNewUserName("");
    setNewUserEmail("");
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
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="User Management" subtitle="Manage Organization Users, Roles, Departments, and Permissions" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Bar with Switcher & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Organization Users & Access</h2>
              </div>
              <p className="text-xs text-slate-400">Strictly organization-scoped RBAC and department permissions</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <OrganizationSwitcher />
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>Invite User</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            {/* Search input */}
            <div className="sm:col-span-1 relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="MEMBER">Member</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-sm">
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
                          <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 text-[11px]">
                            {user.department.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                            user.role === "OWNER"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : user.role === "ADMIN"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : user.role === "MANAGER"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {user.status === "active" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> Deactivated
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                            title="Manage User Profile"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleDeactivate(user.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold ${
                              user.status === "active"
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                            title={user.status === "active" ? "Deactivate User" : "Reactivate User"}
                          >
                            {user.status === "active" ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
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

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Organization User</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={newUserDesignation}
                  onChange={(e) => setNewUserDesignation(e.target.value)}
                  placeholder="e.g. Senior Business Analyst"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={newUserDeptId}
                    onChange={(e) => setNewUserDeptId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-800 px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold">
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
