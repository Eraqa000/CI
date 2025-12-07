export default function UserStatusBadge({ role, status }) {
  const roleLabel = {
    admin: 'Администратор',
    engineer: 'Инженер',
    viewer: 'Просмотр',
  }[role] || role;

  return (
    <div className="user-status">
      <span className={`status-dot status-${status}`} />
      <span>{roleLabel}</span>
    </div>
  );
}

