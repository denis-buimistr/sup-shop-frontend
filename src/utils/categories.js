// Бэкенд отдаёт категории плоским списком с parentId — тут собираем из него дерево

// Порядок «родитель, потом его дети» с глубиной для отступа: SUP, ·Racing, ·Touring, Paddles…
export function flattenTree(categories) {
    const byParent = new Map();
    for (const category of categories) {
        const key = category.parentId ?? null;
        if (!byParent.has(key)) byParent.set(key, []);
        byParent.get(key).push(category);
    }

    const result = [];
    const walk = (parentId, depth) => {
        const children = [...(byParent.get(parentId) ?? [])].sort((a, b) => a.name.localeCompare(b.name));
        for (const child of children) {
            result.push({ ...child, depth });
            walk(child.id, depth + 1);
        }
    };
    walk(null, 0);
    return result;
}

// id самой категории и всех её потомков — их нельзя выбрать родителем, получится цикл
export function selfAndDescendantIds(categories, id) {
    const ids = new Set([id]);
    let added = true;
    while (added) {
        added = false;
        for (const category of categories) {
            if (ids.has(category.parentId) && !ids.has(category.id)) {
                ids.add(category.id);
                added = true;
            }
        }
    }
    return ids;
}
