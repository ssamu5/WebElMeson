-- ============================================================
-- EL MESÓN SMASHBURGERS — Datos del menú
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- MENÚ
-- ---------------------------------------------------------------

insert into menu_items (name, description, price, category, is_available, is_featured, sort_order) values

-- RACIONES
('Patatas Fritas', 'Patatas fritas crujientes con sal.', 3.50, 'raciones', true, false, 10),
('Patatas con Aioli', 'Patatas fritas con salsa aioli casera.', 4.00, 'raciones', true, false, 11),
('Patatas con BBQ', 'Patatas fritas con salsa barbacoa ahumada.', 4.00, 'raciones', true, false, 12),
('Aros de Cebolla', 'Aros de cebolla rebozados y fritos.', 4.50, 'raciones', true, false, 13),
('Nuggets de Pollo', 'Nuggets de pollo crujientes (6 uds).', 5.00, 'raciones', true, false, 14),

-- SMASH BURGERS €10
('The Classic', 'Smash burger con cheddar americano, lechuga, tomate, pepinillo y nuestra salsa El Mesón.', 10.00, 'smash_10', true, true, 20),
('Bacon & Cheese', 'Doble cheddar, bacon crujiente, cebolla caramelizada y mostaza-miel.', 10.00, 'smash_10', true, true, 21),
('La Picante', 'Cheddar, jalapeños encurtidos, sriracha mayo y cebolla crujiente.', 10.00, 'smash_10', true, false, 22),
('La Mesón', 'Cheddar fundido, lechuga iceberg, pepinillo y la salsa secreta de la casa.', 10.00, 'smash_10', true, false, 23),
('Pollo Crispy', 'Muslo de pollo rebozado y frito, coleslaw, pepinillo y mayo de mostaza.', 10.00, 'smash_10', true, false, 24),

-- SMASH BURGERS €13
('La Doble', 'Dos patties de ternera, doble cheddar, pepinillo encurtido y salsa secreta. Para los hambrientos.', 13.00, 'smash_13', true, true, 30),
('La Trufa', 'Cheddar suizo, mayonesa de trufa negra, rúcula y cebolla caramelizada.', 13.00, 'smash_13', true, true, 31),
('La Viking', 'Doble cheddar, bacon doble, huevo frito, lechuga y salsa ranchera. La favorita de los dioses.', 13.00, 'smash_13', true, false, 32),
('La BBQ Doble', 'Doble patty, doble bacon, BBQ ahumada, cheddar y aros de cebolla crujientes.', 13.00, 'smash_13', true, false, 33),

-- POSTRES
('Milkshake de Oreo', 'Batido cremoso de Oreo con nata montada.', 4.50, 'postres', true, false, 40),
('Milkshake de Fresa', 'Batido de fresa natural con nata montada.', 4.50, 'postres', true, false, 41),
('Tarta de Queso', 'Tarta de queso casera al horno, textura cremosa.', 4.00, 'postres', true, false, 42),
('Brownie', 'Brownie de chocolate con nueces y helado de vainilla.', 4.00, 'postres', true, false, 43);

-- BURGER DEL MES
-- ---------------------------------------------------------------
insert into burger_del_mes (name, description, story, price, is_active, month_year) values
(
  'La Midsommar',
  'Doble smash de ternera, queso havarti fundido, mermelada de frambuesa, rúcula fresca y alioli de limón en pan brioche tostado.',
  'Inspirada en las noches de verano del norte, donde el sol no se pone y las hogueras arden hasta el alba. Una burger que celebra el solsticio con sabores frescos y audaces.',
  13.50,
  true,
  'Junio 2026'
);
