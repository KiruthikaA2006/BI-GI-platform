"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { Building, Plus, Edit, Trash2, Users, ArrowRight } from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([
    { id: "dept_01", name: "Executive Engineering", code: "ENG-01", membersCount: 14, lead: "Kiruthika Anand" },
    { id: "dept_02", name: "Sales & Marketing Growth", code: "SLS-02", membersCount: 22, lead: "Sarah Jenkins" },
    { id: "dept_03", name: "Business Intelligence & Analytics", code: "BI-03", membersCount: 9, lead: "Rahul Verma" },
    { id: "dept_04", name: "Finance & Operations", code: "FIN-04", membersCount: 7, lead: "Michael Scott" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptLead, setDeptLead] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept = {
      id: `dept_${Date.now()}`,
      name: deptName,
      code: deptCode || "DEPT",
      membersCount: 0,
      lead: deptLead || "Unassigned",
    };
    setDepartments([...departments, newDept]);
    setShowModal(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    setDepartments(
      departments.map((d) => {
        if (d.id === editingDept.id) {
          return { ...d, name: deptName, code: deptCode, lead: deptLead };
        }
        return d;
      })
    );
    setEditingDept(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const openEdit = (d: any) => {
    setEditingDept(d);
    setDeptName(d.name);
    setDeptCode(d.code);
    setDeptLead(d.lead);
  };

  const resetForm = () => {
    setDeptName("");
    setDeptCode("");
    setDeptLead("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Departments Management" subtitle="Admin Node: Create, Edit, Delete Departments" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-800">Admin Architecture Node: DEPARTMENTS</span>
              <h2 className="text-xl font-black text-stone-900">Department Structure & Leads</h2>
              <p className="text-xs text-stone-600">Operations: <strong>Create Department</strong> • <strong>Edit Department</strong> • <strong>Delete Department</strong></p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Department</span>
            </button>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white border border-stone-300 p-5 rounded-2xl space-y-4 hover:border-blue-400 transition shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{dept.name}</h3>
                      <span className="text-[10px] font-mono text-stone-500">{dept.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(dept)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition"
                      title="Edit Department"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:bg-rose-900/60 transition"
                      title="Delete Department"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Lead: <strong className="text-slate-200">{dept.lead}</strong></span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-400" /> {dept.membersCount} members</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showModal || editingDept) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={editingDept ? handleUpdate : handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingDept ? "Edit Department" : "Create New Department"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingDept(null);
                }}
                className="text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. SLS-02"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department Lead</label>
                <input
                  type="text"
                  value={deptLead}
                  onChange={(e) => setDeptLead(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingDept(null);
                }}
                className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                {editingDept ? "Update Department" : "Create Department"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
