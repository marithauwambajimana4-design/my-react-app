import { useEffect, useState } from "react";
import axios from "axios";

const studentsApi = axios.create({ baseURL: "http://localhost:3000" });

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", sex: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    studentsApi
      .get("/students")
      .then((response) => {
        if (active) {
          setStudents(response.data);
        }
      })
      .catch((requestError) => {
        console.error("Unable to load students:", requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load students. Check that the backend is running.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function loadStudents() {
    try {
      const response = await studentsApi.get("/students");
      setStudents(response.data);
    } catch (requestError) {
      console.error("Unable to load students:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to load students. Check that the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function retryLoading() {
    setLoading(true);
    setError("");
    await loadStudents();
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEditing(student) {
    setEditingId(student.id);
    setForm({ name: student.name, sex: student.sex });
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", sex: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId === null) {
        const response = await studentsApi.post("/students", form);
        setStudents((currentStudents) => [...currentStudents, response.data]);
      } else {
        const response = await studentsApi.put(
          `/students/${editingId}`,
          form,
        );
        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student.id === editingId ? response.data : student,
          ),
        );
      }

      resetForm();
    } catch (requestError) {
      console.error("Unable to save student:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to save student. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(student) {
    setDeletingId(student.id);
    setError("");

    try {
      await studentsApi.delete(`/students/${student.id}`);
      setStudents((currentStudents) =>
        currentStudents.filter((item) => item.id !== student.id),
      );

      if (editingId === student.id) {
        resetForm();
      }
    } catch (requestError) {
      console.error("Unable to delete student:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to delete student. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main>
      <header>
        <h1>Student Management</h1>
        <p>Add, view, edit, or delete student records.</p>
      </header>

      <section aria-labelledby="student-form-title">
        <h2 id="student-form-title">
          {editingId === null ? "Add a Student" : "Edit Student"}
        </h2>
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="student-name">Name</label>
            <br />
            <input
              id="student-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </p>
          <p>
            <label htmlFor="student-sex">Sex</label>
            <br />
            <select
              id="student-sex"
              name="sex"
              value={form.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select sex</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </p>
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId === null
                ? "Add Student"
                : "Save Changes"}
          </button>{" "}
          {editingId !== null && (
            <button type="button" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section aria-labelledby="student-list-title">
        <h2 id="student-list-title">Students</h2>
        {error && <p role="alert">{error}</p>}
        {!loading && error && (
          <button type="button" onClick={retryLoading}>
            Retry
          </button>
        )}
        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Sex</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.sex === "female" ? "Female" : "Male"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => startEditing(student)}
                      disabled={saving || deletingId !== null}
                      aria-label={`Edit ${student.name}`}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => handleDelete(student)}
                      disabled={deletingId !== null}
                      aria-label={`Delete ${student.name}`}
                    >
                      {deletingId === student.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
