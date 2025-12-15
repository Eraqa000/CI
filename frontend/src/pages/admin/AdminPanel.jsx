import { useEffect, useState } from "react";
import {
  fetchUsers,
  changeUserPassword,
  changeUserRole,
  changeUserStatus,
} from "../../api/admin";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <div className="page-container">
      <h1>Админ панель</h1>

      <section className="card" >
        <h2>Пользователи</h2>
        <div className="table-scroll">
            <table className="users-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Имя</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Действия</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.full_name}</td>
                        <td>{u.role}</td>
                        <td>{u.status}</td>
                        <td>
                        <button
                            onClick={() => {
                            const pwd = prompt("Новый пароль");
                            if (pwd) changeUserPassword(u.id, pwd);
                            }}
                        >
                            Сменить пароль
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}
