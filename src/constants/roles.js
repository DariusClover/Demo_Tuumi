export const ROLES = {
  ADMIN: 'admin',
  MESERO: 'mesero',
  COCINA: 'cocina',
  CAJERO: 'cajero',
  DOMICILIOS: 'domicilios'
};

export const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    label: ' Administrador',
    color: 'red',
    avatar: '',
    defaultView: 'dashboard'
  },
  [ROLES.MESERO]: {
    label: ' Mesero',
    color: 'blue',
    avatar: '',
    defaultView: 'pos'
  },
  [ROLES.COCINA]: {
    label: ' Cocinero',
    color: 'orange',
    avatar: '',
    defaultView: 'kds'
  },
  [ROLES.CAJERO]: {
    label: 'Cajero',
    color: 'green',
    avatar: '',
    defaultView: 'caja'
  },
  [ROLES.DOMICILIOS]: {
    label: ' Domicilios',
    color: 'purple',
    avatar: '',
    defaultView: 'domicilios'
  }
};

export const AVAILABLE_ROLES_FOR_EMPLOYEES = [
  ROLES.MESERO,
  ROLES.COCINA,
  ROLES.CAJERO,
  ROLES.DOMICILIOS
];
