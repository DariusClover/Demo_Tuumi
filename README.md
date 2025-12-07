# Demo: POS de Terranova con Controles de Seguridad Yuumi

Este proyecto es una demostración de una aplicación web en React que simula la experiencia de usuario del sistema POS Yuumi, haciendo énfasis en las medidas de seguridad implementadas para Terranova: el Control de Acceso Basado en Roles (RBAC), la Garantía de Respaldo de Datos en la Nube, y el flujo operacional completo desde la toma de pedidos hasta la facturación.

## 🔐 Credenciales de Acceso (Simulación RBAC)

| Rol               | Usuario      | Contraseña | Vista Inicial               | Permisos                                         |
| ----------------- | ------------ | ---------- | --------------------------- | ------------------------------------------------ |
| **Mesero**        | `mesero`     | `123`      | Toma de Pedidos (POS)       | Crear pedidos, agregar productos al carrito      |
| **Administrador** | `admin`      | `secure`   | Dashboard de Seguridad      | Dashboard, POS, Gestión de productos, ver ventas |
| **Cocina**        | `cocina`     | `pass`     | Vista KDS (Kitchen Display) | Ver comandas, marcar pedidos listos              |
| **Cajero**        | `cajero`     | `caja123`  | Caja - Facturación          | Procesar pagos, facturación electrónica          |
| **Domicilios**    | `domicilios` | `dom123`   | Central de Domicilios       | Registrar pedidos por WhatsApp                   |

## 🚀 Ejecución del Proyecto

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```
3.  **Abrir en el navegador:**
    ```
    http://localhost:5173
    ```

## 📊 Flujo Operacional Completo

### 1. Toma de Pedidos (Mesero)

- Ingresa productos al carrito desde el menú
- Visualiza total en tiempo real
- Envía pedido a cocina

### 2. Preparación (Cocina - KDS)

- Recibe comandas automáticamente
- Visualiza detalles del pedido
- Marca "Pedido Listo" → Envía a Caja

### 3. Facturación (Cajero)

- Recibe pedidos listos desde cocina
- Selecciona método de pago (Efectivo, Tarjeta, Transferencia, Nequi)
- Procesa pago → Registra venta completada

### 4. Seguimiento (Administrador)

- Dashboard con métricas en tiempo real
- Ventas completadas del día
- Total vendido
- Gestión de productos (CRUD)

### 5. Domicilios (Central)

- Registro de pedidos recibidos por WhatsApp
- Sincronización automática con POS y Cocina
- Gestión omnicanal

## 🛡️ Características de Seguridad Implementadas

### 1. **Control de Acceso Basado en Roles (RBAC)**

- 5 roles definidos con permisos específicos
- Separación clara de responsabilidades
- Prevención de acceso no autorizado

### 2. **Seguridad Transaccional**

- Flujo completo: POS → Cocina → Caja → Dashboard
- Sincronización en tiempo real
- Trazabilidad de todas las operaciones

### 3. **Respaldo de Datos**

- Simulación de copias de seguridad en la nube
- Estado visible en Dashboard de Seguridad
- Garantía de continuidad del negocio

### 4. **Cumplimiento Normativo (Ley 1581/2012)**

- Protección de datos personales de clientes
- Controles documentados
- Estado de cumplimiento visible

### 5. **Gestión de Inventario**

- CRUD completo de productos (Admin)
- Cambios reflejados en tiempo real en POS
- Control de stock

## 📦 Componentes Principales

- **Login.jsx** - Autenticación y control de acceso
- **TomaPedido.jsx** - Interfaz POS para meseros
- **KDSView.jsx** - Vista de cocina (Kitchen Display System)
- **CajaView.jsx** - Sistema de facturación y cobro
- **DomiciliosView.jsx** - Central de pedidos a domicilio
- **SecurityDashboard.jsx** - Panel administrativo de seguridad
- **ProductManager.jsx** - Gestión de productos (CRUD)

## 🎯 Demostración del Flujo Completo

### Escenario: Pedido Presencial

1. **Login como Mesero** (`mesero` / `123`)
2. Agregar productos al carrito (ej: Hamburguesa, Papas, Gaseosa)
3. Enviar Pedido → Mensaje de confirmación: "Sincronización Transaccional confirmada"
4. **Logout y Login como Cocina** (`cocina` / `pass`)
5. Ver pedido en KDS
6. Click en "✅ Pedido Listo"
7. **Logout y Login como Cajero** (`cajero` / `caja123`)
8. Seleccionar factura pendiente
9. Elegir método de pago
10. Procesar Pago
11. **Logout y Login como Admin** (`admin` / `secure`)
12. Ver venta completada en Dashboard con total vendido

### Escenario: Pedido a Domicilio

1. **Login como Domicilios** (`domicilios` / `dom123`)
2. Registrar pedido de WhatsApp con datos del cliente
3. El pedido se sincroniza automáticamente con Cocina
4. Continuar flujo normal: Cocina → Caja → Dashboard

## 🏗️ Tecnologías Utilizadas

- **React 19.2.0** - Framework frontend
- **Vite 7.2.4** - Build tool
- **Tailwind CSS 4.1.17** - Estilos
- **ESLint** - Calidad de código

## 📄 Alineación con el Documento

Esta demo implementa fielmente los conceptos descritos en el documento "Aplicación de la seguridad informática al negocio de comidas rápidas Terranova":

✅ **Control de Acceso (RBAC)** - Usuarios ilimitados con roles definidos  
✅ **App Móvil Meseros** - Toma de pedidos desde dispositivos  
✅ **Comandas Digitales (KDS)** - Pantalla de cocina  
✅ **Sincronización Transaccional** - Integridad de datos  
✅ **Gestión de Domicilios** - Central de pedidos WhatsApp  
✅ **Facturación** - Sistema de cobro y métodos de pago  
✅ **Dashboard de Seguridad** - Monitoreo de controles  
✅ **Gestión de Inventario** - CRUD de productos  
✅ **Cumplimiento Ley 1581/2012** - Protección de datos personales

## 📝 Notas para Presentación

- El sistema demuestra la **Tríada CIA**: Confidencialidad (RBAC), Integridad (Transaccional), Disponibilidad (Respaldo)
- Flujo completo end-to-end visible en una sola aplicación
- Énfasis en controles preventivos, detectivos y correctivos
- Ejemplifica la transformación digital del negocio Terranova con Yuumi

---

**Desarrollado como proyecto académico para la asignatura de Seguridad Informática - 2025**
