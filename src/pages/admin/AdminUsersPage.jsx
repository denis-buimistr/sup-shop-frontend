import { useEffect, useState } from 'react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import { formatDate } from '../../utils/format';
import { getErrorMessage } from '../../utils/forms';

// Только просмотр: блокировки и смены ролей на бэкенде пока нет
function AdminUsersPage() {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        api.get('/admin/users')
            .then(({ data }) => setUsers([...data].sort((a, b) => b.id - a.id)))
            .catch(err => setError(getErrorMessage(err, 'Не удалось загрузить пользователей.')));
    }, []);

    const q = query.trim().toLowerCase();
    const visible = users?.filter(u =>
        !q || [u.username, u.email, u.fullName].some(v => v?.toLowerCase().includes(q))
    ) ?? [];

    return (
        <>
            <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Users</h1>
            <p className="mb-6 text-[15px] text-ink-400">Everyone who has an account in the shop.</p>

            <label htmlFor="user-search" className="sr-only">Search users</label>
            <input
                id="user-search"
                type="search"
                placeholder="Search by username, email or name…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="mb-5 h-11 w-full max-w-[420px] rounded-full border border-line bg-white px-5 text-[15px] outline-none focus:border-brand-600"
            />

            {error && <FormError message={error} />}
            {!users && !error && <p className="text-[15px] text-ink-400">Loading users…</p>}

            {users && (
                <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-surface-50 text-left text-xs text-ink-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Username</th>
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Email</th>
                                <th className="px-5 py-3 font-semibold">Role</th>
                                <th className="px-5 py-3 font-semibold">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(u => {
                                const admin = u.roles?.includes('ROLE_ADMIN');
                                return (
                                    <tr key={u.id} className="border-t border-line">
                                        <td className="px-5 py-3 font-semibold text-ink-900">
                                            {u.username}
                                            {!u.enabled && <span className="ml-2 text-xs font-bold text-danger">disabled</span>}
                                        </td>
                                        <td className="px-5 py-3 text-ink-600">{u.fullName || '—'}</td>
                                        <td className="px-5 py-3 text-ink-600">{u.email}</td>
                                        <td className="px-5 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${admin ? 'bg-deep-900 text-white' : 'bg-surface-100 text-ink-600'}`}>
                                                {admin ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 tabular-nums text-ink-600">{formatDate(u.createdAt)}</td>
                                    </tr>
                                );
                            })}
                            {visible.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-400">Nobody matches “{query}”.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default AdminUsersPage;
