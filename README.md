<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">🌸 INDIA TALIA — BACKEND SYSTEM</h1>

<p align="center">
  <i>Gestión integral de ventas, stock y finanzas — Potenciado con NestJS + TypeORM</i>
</p>

<p align="center">
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/NestJS-v10-DD0031?logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="https://typeorm.io/" target="_blank"><img src="https://img.shields.io/badge/TypeORM-DataMapper-F29111?logo=database&logoColor=white" /></a>
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/License-MIT-28A745?logo=open-source-initiative&logoColor=white" /></a>
</p>

---

ENTIDADES
•  👤 User (Usuario)
•  🔐 Role (Rol)
•  🏷️ Category (Categoría)
•  🏭 Supplier (Proveedor)
•  🏭 Brands (mARCAS)
•  📦 ProductBase (Producto base)
•  🌈 ProductVariant (Variante de producto)	
•  🖼️ ProductImage (Imagen del producto)
•  🛒 Cart (Carrito)
•  🧺 CartItem (Ítem del carrito)
•  🧾 Order (Pedido)
•  📦 OrderItem (Ítem del pedido)
•  💳 Payment (Pago)
•  💰 CashMovement (Movimiento de caja)
•  🏦 CashRegister (Caja diaria)
•  💸 FixedExpense / VariableExpense (Gasto fijo / variable)
•  📈 PriceRule / PriceChangeHistory (Regla de precios / Historial de cambios)
•  📦 StockMovement (Movimiento de stock)

Flujo de trabajo
# Documentación Completa del Sistema India Talia

---

"""## ⚙️ FLUJO DE TRABAJO DETALLADO (WORKFLOW)

### 1️⃣ Usuario y autenticación
- Un `User` se registra con un `Role` (rol) determinado: `superAdmin` o `user` (empleado).
- El rol determina permisos sobre módulos y rutas:
  - `superAdmin`: acceso total a todas las funcionalidades.
  - `user` (empleado): acceso limitado, sin permiso para métricas financieras ni movimientos de caja (`CashMovement`), ni otras áreas sensibles.

---

### 2️⃣ Productos y catálogo
- `Category` ↔ `Brand` tienen una relación **Many-to-Many** (una marca puede estar en varias categorías y viceversa).
- Cada `Brand` tiene muchos `ProductBase` (familias de productos).
- Cada `ProductBase` tiene varias `ProductVariant` (fragancias, tamaños, colores...).
- Cada `ProductVariant` tiene varias `ProductImage`.
- Las variantes (`ProductVariant`) tienen precios propios, stock individual y códigos SKU.

#### 🟢 Borrado lógico
- Todas las entidades del catálogo (`Category`, `Brand`, `ProductBase`, `ProductVariant`) tienen el campo `isActive: boolean`.
- Si se desactiva una categoría:
  - Se desactiva **solo la categoría**.
  - Se desactivan los **productos (`ProductBase` y `ProductVariant`) asociados** a esa categoría.
  - Las **marcas no se desactivan globalmente** si están asociadas a otras categorías.
  - Esto evita romper la base de datos y mantiene la integridad referencial.

---

### 3️⃣ Carrito de compras (Cart)
- Cada `User` tiene un único `Cart`.
- El `Cart` contiene muchos `CartItem`, cada uno apuntando a un `ProductVariant`.
- El carrito calcula subtotales y totales en base al `salePrice` y las cantidades.

---

### 4️⃣ Pedido (Order)
- Al confirmar el carrito, se genera un `Order` con `OrderItem`s (copiados desde el carrito).
- `Order` registra su `status` (`pending`, `paid`, `cancelled`, etc.).
- Cada `OrderItem` referencia un `ProductVariant` y guarda su `unitPrice` al momento de la compra.

---

### 5️⃣ Pago (Payment)
- Cada `Order` puede tener varios `Payment`s (efectivo, tarjeta, transferencia...).
- Un `Payment` genera un `CashMovement` del tipo **entry (entrada)**.
- La suma de los pagos debe igualar el `Order.total`.

---

### 6️⃣ Caja y movimientos (CashRegister & CashMovement)
- Cada día, un `CashRegister` agrupa todos los `CashMovement` de ese día.
- Los movimientos pueden provenir de:
  - Ventas (`Order` / `Payment`)
  - Gastos (`FixedExpense` / `VariableExpense`)
  - Ajustes manuales o ingresos externos.
- `CashMovement` puede ser:
  - **Entrada:** ventas, cobros.
  - **Salida:** gastos, ajustes o retiros.

---

### 7️⃣ Stock
- Cada `StockMovement` registra una entrada o salida de stock.
- Asociado a:
  - `Order` (salida por venta)
  - `Supplier` (entrada por compra)
  - `User` (responsable del movimiento)
- Permite trazabilidad de inventario y auditoría de movimientos.

---

### 8️⃣ Precios y trazabilidad
- `PriceRule` define aumentos o descuentos automáticos por rango de fechas o condiciones.
- `PriceChangeHistory` guarda la trazabilidad de cambios manuales en los precios.
- Ambos se asocian a un `User` para identificar quién realizó la modificación.

---

### 9️⃣ Reportes y análisis
- Los módulos `reports/` y `cash/` consolidan información de:
  - Ventas por período o categoría.
  - Movimientos de caja.
  - Rentabilidad y control de stock.
  - Historial de precios y stock.

---

## 🔗 RELACIONES ENTRE ENTIDADES

### Usuario y Roles
- `User` tiene un único `Role`.
- El `Role` determina permisos sobre módulos y funcionalidades.

---

### Productos y Catálogo
- `Category` ↔ `Brand` (**Many-to-Many**)
- `Brand` → tiene muchos `ProductBase`.
- `ProductBase` → tiene muchas `ProductVariant`.
- `ProductVariant` → tiene muchas `ProductImage`.
- `ProductVariant` → tiene stock y precios propios.

---

### Carrito de compras
- `User` → tiene un único `Cart`.
- `Cart` → tiene muchos `CartItem`.
- `CartItem` → referencia un único `ProductVariant`.

---

### Pedido (Order)
- `Order` → pertenece a un único `User`.
- `Order` → tiene muchos `OrderItem`.
- `OrderItem` → referencia un único `ProductVariant`.

---

### Pagos y Caja
- `Order` → tiene muchos `Payment`.
- `Payment` → genera un `CashMovement` de tipo entrada.
- `CashRegister` → agrupa muchos `CashMovement` por día.
- `CashMovement` puede ser:
  - Entrada (ventas, pagos).
  - Salida (gastos, ajustes).

---

### Stock
- `StockMovement` → asociado a `Order` (salida), `Supplier` (entrada) y `User` (responsable).
- Registra movimientos de inventario (entradas y salidas).

---

### Precios y Trazabilidad
- `PriceRule` → reglas automáticas de precios.
- `PriceChangeHistory` → historial de cambios manuales.
- Ambos asociados a `User` (quién hizo el cambio).

---

## 🔗 RELACIONES M:N (MANY-TO-MANY) IMPLEMENTADAS CON ENTIDADES PUENTE

| Relación conceptual       | Entidad puente o mecanismo              |
|---------------------------|----------------------------------------|
| Category ↔ Brand           | `category_brands` (tabla intermedia)   |
| Cart ↔ ProductVariant      | `CartItem`                             |
| Order ↔ ProductVariant     | `OrderItem`                            |
| Category ↔ PriceRule       | FK opcional en `PriceRule`             |
| ProductBase ↔ PriceRule    | FK opcional en `PriceRule`             |
| ProductVariant ↔ PriceRule | FK opcional en `PriceRule`             |

---

## 🧩 ARQUITECTURA DE CARPETAS NESTJS (src/modules)

```plaintext
src/
    auth/                # login, registro, roles
    users/               # User + Role
    categories/          # Category
    brands/              # brand
    suppliers/           # Supplier
    products/            # ProductBase + ProductVariant + ProductImage
    cart/                # Cart + CartItem
    orders/              # Order + OrderItem
    payments/            # Payment
    cash/                # CashRegister + CashMovement
    expenses/            # FixedExpense + VariableExpense
    stock/               # StockMovement
    price-rules/         # PriceRule
    price-history/       # PriceChangeHistory
    reports/             # Dashboards, KPIs, métricas
    common/              # Utilidades, filtros, DTOs compartidos
  config/
  main.ts
  app.module.ts

  
  ###Estructura completa
  
src/
  auth/
    decorators/
      roles.decorator.ts
      user.decorator.ts
    dto/
      login.dto.ts
      register.dto.ts
    guards/  
    auth.controller.ts
    auth.service.ts
    auth.module.ts
    jwt.strategy.ts

  users/
    dto/
      create-user.dto.ts
      update-user.dto.ts
    entities/
      user.entity.ts
      role.entity.ts        # si roles están separados aquí, o referenciados desde auth
    users.controller.ts
    users.service.ts
    users.module.ts
✅ Permite múltiples roles por usuario (sin cambiar nada en el futuro).
✅ Puedes agregar roles dinámicamente en base de datos (sin tocar código).
✅ AuthService puede validar roles con decorators (@Roles('superAdmin')).
✅ UsersService sigue siendo reutilizable para otros proyectos.

  categories/
    dto/
      create-category.dto.ts
      update-category.dto.ts
    entities/
      category.entity.ts
    categories.controller.ts
    categories.service.ts
    categories.module.ts

  suppliers/
    dto/
      create-supplier-product.dto.ts
      create-supplier.dto.ts
      update-supplier.dto.ts
      update-supplier-product.dto.ts
    entities/
      supplier.entity.ts
      supplier-product.entity.ts
    suppliers.controller.ts
    suppliers.service.ts
    suppliers.module.ts

  brands/
    dto/
      create-brand.dto.ts
      update-brand.dto.ts
    entities/
      brand.entity.ts
    brand.controller.ts
    brand.service.ts
    brand.module.ts

  productsBase/
    dto/
      create-product.dto.ts
      update-product.dto.ts
    entities/
      product-base.entity.ts
      product-variant.entity.ts
      product-image.entity.ts
    products.controller.ts
    products.service.ts
    products.module.ts
    
  productVariants/
      dto/
        create-variant.dto.ts
        update-variant.dto.ts
      entities/
        product-variant.entity.ts      # o mantener solo aquí si prefieres separarlo
        product-image.entity.ts
      variants.service.ts
      variants.controller.ts
      variants.module.ts

  cart/
    dto/
      add-cart-item.dto.ts
      update-cart-item.dto.ts
    entities/
      cart.entity.ts
      cart-item.entity.ts
    cart.controller.ts
    cart.service.ts
    cart.module.ts

  orders/
    dto/
      create-order.dto.ts
      update-order.dto.ts
    entities/
      order.entity.ts
      order-item.entity.ts
    orders.controller.ts
    orders.service.ts
    orders.module.ts

  payments/
    dto/
      create-payment.dto.ts
      update-payment.dto.ts
    entities/
      payment.entity.ts
    payments.controller.ts
    payments.service.ts
    payments.module.ts

  cash/
    dto/
      create-cash-movement.dto.ts
      update-cash-movement.dto.ts
    entities/
      cash-register.entity.ts
      cash-movement.entity.ts
    cash.controller.ts
    cash.service.ts
    cash.module.ts

  expenses/
    dto/
      create-fixed-expense.dto.ts
      create-variable-expense.dto.ts
      update-expense.dto.ts
    entities/
      fixed-expense.entity.ts
      variable-expense.entity.ts
    expenses.controller.ts
    expenses.service.ts
    expenses.module.ts

  stock/
    dto/
      create-stock-movement.dto.ts
    entities/
      stock-movement.entity.ts
    stock.controller.ts
    stock.service.ts
    stock.module.ts

  price-rules/
    dto/
      create-price-rule.dto.ts
      update-price-rule.dto.ts
    entities/
      price-rule.entity.ts
    price-rules.controller.ts
    price-rules.service.ts
    price-rules.module.ts

  price-history/
    dto/
      create-price-change-history.dto.ts
    entities/
      price-change-history.entity.ts
    price-history.controller.ts
    price-history.service.ts
    price-history.module.ts

  reports/
    dto/
      report-filter.dto.ts
    reports.controller.ts
    reports.service.ts
    reports.module.ts

  common/
    dto/
      pagination.dto.ts
      filters.dto.ts
    filters/
      roles.guard.ts
      auth.guard.ts
    pipes/
      validation.pipe.ts
    utils/
      helpers.ts
    decorators/
      roles.decorator.ts

  config/
    app.config.ts
    database.config.ts

  main.ts
  app.module.ts

--

   Créditos

🧑‍💻 Desarrollador: Pablo
🤖 Asistencia técnica: GPT-5
🧱 Framework: NestJS
💾 ORM: TypeORM
💡 Lenguaje: TypeScript
🚀 Estado: En evolución continua

--

Contacto

📧 contacto@indiatalia.com

🌐 Sitio web: próximamente
📦 Repositorio: GitHub (en preparación)

--

11️⃣ Estructura Técnica y Módulos Futuros
Estado	Módulo / Mejora	Descripción
✅	Seeders automáticos	Carga inicial de roles, superadmin y datos base
⚙️	Validators y Pipes	Validaciones personalizadas y tipadas
🔒	Guards personalizados	Acceso por roles (@Roles('superAdmin'))
🧩	Decoradores reutilizables	@User(), @Roles()
📊	Reportes financieros avanzados	Métricas diarias, mensuales y comparativas
🕵️	Historial de auditoría	Registro completo de acciones por usuario
💰	Módulo de costos/rentabilidad	Análisis de margen y flujo neto
⚡	CQRS + Event Sourcing	Escalabilidad reactiva (futuro)

🌱 “India Talia Backend es más que un sistema —
es un ecosistema modular donde cada línea de código cuenta una historia.”

