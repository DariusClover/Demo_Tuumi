export const DEFAULT_CATEGORIES = [
  {
    id: 'CAT-DEFAULT-1',
    name: 'Hamburguesas',
    icon: '🍔',
    color: 'orange',
    description: 'Hamburguesas clásicas y especiales',
    isActive: true,
    order: 1
  },
  {
    id: 'CAT-DEFAULT-2',
    name: 'Bebidas',
    icon: '🥤',
    color: 'blue',
    description: 'Bebidas frías y calientes',
    isActive: true,
    order: 2
  },
  {
    id: 'CAT-DEFAULT-3',
    name: 'Acompañamientos',
    icon: '🍟',
    color: 'yellow',
    description: 'Papas, aros de cebolla y más',
    isActive: true,
    order: 3
  },
  {
    id: 'CAT-DEFAULT-4',
    name: 'Ensaladas',
    icon: '🥗',
    color: 'green',
    description: 'Ensaladas frescas',
    isActive: true,
    order: 4
  }
];

export const UNCATEGORIZED = {
  id: 'CAT-UNCATEGORIZED',
  name: 'Sin categoría',
  icon: '📦',
  color: 'gray',
  description: 'Productos sin categoría asignada',
  isActive: true,
  order: 999
};
