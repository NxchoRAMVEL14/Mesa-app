// Recetario semilla — cocina casera mexicana del Bajío.
// Cantidades e información nutrimental son POR PORCIÓN y son estimaciones
// de referencia (base: tablas de composición de alimentos de uso común).
// La app multiplica las cantidades según cuántas personas coman ese día.

const r = (id, nombre, tiempos, min, tags, macros, ing) => ({
  id, nombre, tiempos, min, tags,
  kcal: macros[0], prot: macros[1], carb: macros[2], gras: macros[3],
  ing: ing.map(([item, cant, unidad]) => ({ item, cant, unidad })),
});

// tiempos: D desayuno · A almuerzo · C comida · K colación · N cena
export const RECETAS = [
  // ---------- DESAYUNOS ----------
  r('d01', 'Huevos a la mexicana con frijoles', ['D'], 15, ['huevo', 'rápido'], [380, 22, 28, 19], [
    ['Huevo', 2, 'pza'], ['Jitomate', 80, 'g'], ['Cebolla', 30, 'g'], ['Chile serrano', 0.5, 'pza'],
    ['Frijol de la olla', 120, 'g'], ['Tortilla de maíz', 2, 'pza'], ['Aceite', 5, 'ml']]),
  r('d02', 'Avena cocida con plátano y canela', ['D'], 10, ['dulce', 'rápido', 'sin carne'], [340, 12, 58, 8], [
    ['Avena en hojuelas', 60, 'g'], ['Leche', 250, 'ml'], ['Plátano', 1, 'pza'],
    ['Canela molida', 1, 'g'], ['Nuez', 15, 'g']]),
  r('d03', 'Chilaquiles verdes con pollo', ['D'], 25, ['pollo', 'picante'], [470, 30, 45, 18], [
    ['Tortilla de maíz', 4, 'pza'], ['Tomate verde', 150, 'g'], ['Chile serrano', 1, 'pza'],
    ['Pechuga de pollo deshebrada', 90, 'g'], ['Crema', 20, 'g'], ['Queso fresco', 30, 'g'], ['Cebolla', 20, 'g']]),
  r('d04', 'Molletes con pico de gallo', ['D'], 12, ['rápido', 'sin carne'], [420, 18, 52, 16], [
    ['Bolillo', 1, 'pza'], ['Frijol refrito', 100, 'g'], ['Queso manchego', 40, 'g'],
    ['Jitomate', 60, 'g'], ['Cebolla', 25, 'g'], ['Cilantro', 5, 'g']]),
  r('d05', 'Omelette de espinaca y queso panela', ['D'], 15, ['huevo', 'verdura'], [330, 26, 9, 22], [
    ['Huevo', 3, 'pza'], ['Espinaca', 60, 'g'], ['Queso panela', 50, 'g'], ['Aceite de oliva', 5, 'ml']]),
  r('d06', 'Yogur con granola y fruta de temporada', ['D', 'K'], 5, ['rápido', 'sin cocción'], [300, 15, 45, 8], [
    ['Yogur natural', 200, 'g'], ['Granola', 40, 'g'], ['Fresa', 80, 'g'], ['Miel', 10, 'g']]),
  r('d07', 'Quesadillas de nopal con queso Oaxaca', ['D', 'N'], 15, ['verdura', 'rápido'], [360, 19, 38, 15], [
    ['Tortilla de maíz', 3, 'pza'], ['Nopal cocido', 120, 'g'], ['Queso Oaxaca', 60, 'g'], ['Cebolla', 20, 'g']]),
  r('d08', 'Huevos rancheros', ['D'], 18, ['huevo', 'picante'], [400, 21, 36, 20], [
    ['Huevo', 2, 'pza'], ['Tortilla de maíz', 2, 'pza'], ['Jitomate', 120, 'g'],
    ['Chile de árbol', 1, 'pza'], ['Frijol de la olla', 100, 'g'], ['Aceite', 8, 'ml']]),
  r('d09', 'Licuado de avena, cacao y plátano', ['D', 'K'], 5, ['rápido', 'líquido'], [320, 16, 48, 8], [
    ['Leche', 300, 'ml'], ['Avena en hojuelas', 40, 'g'], ['Plátano', 1, 'pza'], ['Cacao en polvo', 8, 'g']]),
  r('d10', 'Tostadas de frijol con aguacate y huevo cocido', ['D'], 12, ['rápido'], [390, 20, 40, 18], [
    ['Tostada de maíz', 3, 'pza'], ['Frijol refrito', 120, 'g'], ['Aguacate', 60, 'g'],
    ['Huevo cocido', 1, 'pza'], ['Queso fresco', 25, 'g']]),
  r('d11', 'Enfrijoladas con queso fresco', ['D'], 20, ['sin carne'], [410, 19, 52, 14], [
    ['Tortilla de maíz', 4, 'pza'], ['Frijol de la olla', 200, 'g'], ['Queso fresco', 50, 'g'],
    ['Cebolla', 25, 'g'], ['Crema', 15, 'g']]),
  r('d12', 'Hot cakes de avena con fruta', ['D'], 20, ['dulce'], [380, 16, 55, 11], [
    ['Avena en hojuelas', 60, 'g'], ['Huevo', 1, 'pza'], ['Leche', 100, 'ml'],
    ['Polvo para hornear', 3, 'g'], ['Manzana', 1, 'pza'], ['Miel', 10, 'g']]),

  // ---------- ALMUERZOS (media mañana, ligero) ----------
  r('a01', 'Torta de pollo con aguacate', ['A', 'N'], 12, ['pollo', 'rápido'], [450, 30, 48, 16], [
    ['Bolillo', 1, 'pza'], ['Pechuga de pollo deshebrada', 100, 'g'], ['Aguacate', 50, 'g'],
    ['Jitomate', 40, 'g'], ['Lechuga', 30, 'g'], ['Frijol refrito', 40, 'g']]),
  r('a02', 'Ensalada de atún con galletas integrales', ['A', 'N'], 10, ['pescado', 'rápido', 'sin cocción'], [340, 28, 26, 14], [
    ['Atún en agua', 120, 'g'], ['Jitomate', 60, 'g'], ['Cebolla', 25, 'g'], ['Zanahoria', 50, 'g'],
    ['Mayonesa', 15, 'g'], ['Galleta integral', 5, 'pza']]),
  r('a03', 'Sincronizadas de jamón y queso', ['A', 'N'], 10, ['rápido'], [420, 24, 40, 19], [
    ['Tortilla de harina', 2, 'pza'], ['Jamón de pavo', 60, 'g'], ['Queso manchego', 50, 'g'], ['Aguacate', 40, 'g']]),
  r('a04', 'Fruta picada con yogur y granola', ['A', 'K'], 8, ['rápido', 'sin cocción'], [260, 10, 45, 5], [
    ['Papaya', 120, 'g'], ['Melón', 100, 'g'], ['Yogur natural', 120, 'g'], ['Granola', 25, 'g']]),
  r('a05', 'Sándwich integral de pavo y verduras', ['A', 'N'], 8, ['rápido'], [370, 26, 38, 12], [
    ['Pan integral', 2, 'reb'], ['Jamón de pavo', 70, 'g'], ['Queso panela', 40, 'g'],
    ['Jitomate', 50, 'g'], ['Lechuga', 30, 'g'], ['Aguacate', 30, 'g']]),
  r('a06', 'Tacos de nopal con huevo', ['A', 'D'], 15, ['verdura', 'rápido'], [330, 18, 34, 14], [
    ['Nopal cocido', 150, 'g'], ['Huevo', 2, 'pza'], ['Tortilla de maíz', 3, 'pza'], ['Salsa verde', 30, 'g']]),

  r('a07', 'Molletes dulces de plátano y crema de cacahuate', ['A', 'K'], 8, ['rápido', 'dulce'], [350, 12, 44, 15], [
    ['Pan integral', 2, 'reb'], ['Crema de cacahuate', 25, 'g'], ['Plátano', 1, 'pza'], ['Miel', 8, 'g']]),
  r('a08', 'Coctel de fruta con requesón y nuez', ['A', 'K'], 8, ['rápido', 'sin cocción'], [280, 14, 34, 10], [
    ['Papaya', 100, 'g'], ['Manzana', 1, 'pza'], ['Requesón', 100, 'g'], ['Nuez', 15, 'g']]),
  r('a09', 'Gorditas de frijol con queso', ['A', 'D'], 20, ['sin carne'], [400, 16, 50, 15], [
    ['Masa de maíz', 110, 'g'], ['Frijol refrito', 110, 'g'], ['Queso fresco', 40, 'g'], ['Salsa verde', 30, 'g']]),
  r('a10', 'Baguette de queso panela y verduras asadas', ['A', 'N'], 15, ['sin carne'], [390, 20, 44, 15], [
    ['Bolillo', 1, 'pza'], ['Queso panela', 70, 'g'], ['Pimiento', 60, 'g'],
    ['Calabacita', 60, 'g'], ['Cebolla', 30, 'g'], ['Aceite de oliva', 8, 'ml']]),
  r('a11', 'Ensalada de pollo con manzana y nuez', ['A', 'N'], 12, ['pollo', 'rápido'], [360, 30, 24, 17], [
    ['Pechuga de pollo deshebrada', 120, 'g'], ['Manzana', 1, 'pza'], ['Apio', 50, 'g'],
    ['Nuez', 15, 'g'], ['Yogur natural', 50, 'g']]),
  r('a12', 'Tortas de papa con salsa verde', ['A', 'N'], 25, ['sin carne'], [370, 13, 46, 15], [
    ['Papa', 200, 'g'], ['Huevo', 1, 'pza'], ['Queso fresco', 40, 'g'],
    ['Pan molido', 20, 'g'], ['Salsa verde', 40, 'g'], ['Aceite', 10, 'ml']]),
  r('a13', 'Burrito de frijol, huevo y aguacate', ['A', 'D'], 12, ['rápido'], [430, 20, 48, 18], [
    ['Tortilla de harina', 1, 'pza'], ['Frijol refrito', 100, 'g'], ['Huevo', 1, 'pza'],
    ['Aguacate', 50, 'g'], ['Salsa roja', 25, 'g']]),
  r('a14', 'Smoothie verde con avena', ['A', 'K', 'D'], 6, ['rápido', 'líquido'], [270, 11, 42, 7], [
    ['Espinaca', 50, 'g'], ['Plátano', 1, 'pza'], ['Leche', 250, 'ml'],
    ['Avena en hojuelas', 30, 'g'], ['Chía', 8, 'g']]),
  r('a15', 'Tostada de atún con aguacate', ['A', 'N'], 10, ['pescado', 'rápido'], [340, 26, 30, 14], [
    ['Tostada de maíz', 2, 'pza'], ['Atún en agua', 110, 'g'], ['Aguacate', 60, 'g'],
    ['Jitomate', 50, 'g'], ['Cebolla morada', 25, 'g'], ['Limón', 1, 'pza']]),

  // ---------- COMIDAS (tiempo fuerte) ----------
  r('c01', 'Pollo en salsa verde con arroz', ['C'], 40, ['pollo'], [520, 40, 52, 16], [
    ['Pechuga de pollo', 150, 'g'], ['Tomate verde', 180, 'g'], ['Chile serrano', 1, 'pza'],
    ['Arroz', 70, 'g'], ['Cebolla', 40, 'g'], ['Ajo', 1, 'diente'], ['Aceite', 8, 'ml']]),
  r('c02', 'Tinga de res con arroz y frijoles', ['C'], 50, ['res'], [590, 38, 58, 20], [
    ['Falda de res', 150, 'g'], ['Jitomate', 150, 'g'], ['Chipotle', 1, 'pza'], ['Cebolla', 60, 'g'],
    ['Arroz', 60, 'g'], ['Frijol de la olla', 100, 'g'], ['Aceite', 8, 'ml']]),
  r('c03', 'Caldo de pollo con verduras', ['C', 'N'], 45, ['pollo', 'caldo', 'ligero'], [400, 35, 34, 13], [
    ['Muslo de pollo', 180, 'g'], ['Zanahoria', 80, 'g'], ['Calabacita', 100, 'g'], ['Chayote', 80, 'g'],
    ['Papa', 100, 'g'], ['Cilantro', 8, 'g'], ['Cebolla', 40, 'g']]),
  r('c04', 'Milanesa de res con ensalada y papa', ['C'], 30, ['res'], [610, 42, 46, 26], [
    ['Milanesa de res', 150, 'g'], ['Pan molido', 30, 'g'], ['Huevo', 1, 'pza'], ['Papa', 150, 'g'],
    ['Lechuga', 50, 'g'], ['Jitomate', 60, 'g'], ['Aceite', 15, 'ml']]),
  r('c05', 'Pescado empapelado con verduras', ['C', 'N'], 35, ['pescado', 'ligero'], [420, 40, 24, 18], [
    ['Filete de tilapia', 180, 'g'], ['Calabacita', 100, 'g'], ['Jitomate', 80, 'g'], ['Pimiento', 60, 'g'],
    ['Limón', 1, 'pza'], ['Aceite de oliva', 10, 'ml'], ['Ajo', 1, 'diente']]),
  r('c06', 'Albóndigas en caldillo de jitomate', ['C'], 50, ['res', 'caldo'], [540, 36, 44, 24], [
    ['Carne molida de res', 150, 'g'], ['Arroz crudo', 20, 'g'], ['Huevo', 0.5, 'pza'], ['Jitomate', 200, 'g'],
    ['Cebolla', 50, 'g'], ['Calabacita', 80, 'g'], ['Hierbabuena', 3, 'g']]),
  r('c07', 'Mole de olla', ['C'], 60, ['res', 'caldo'], [480, 34, 42, 18], [
    ['Chambarete de res', 160, 'g'], ['Elote', 1, 'pza'], ['Chayote', 100, 'g'], ['Ejote', 60, 'g'],
    ['Calabacita', 80, 'g'], ['Chile guajillo', 2, 'pza'], ['Epazote', 4, 'g']]),
  r('c08', 'Pechuga a la plancha con ensalada de nopal', ['C', 'N'], 25, ['pollo', 'ligero', 'rápido'], [400, 44, 20, 15], [
    ['Pechuga de pollo', 180, 'g'], ['Nopal cocido', 150, 'g'], ['Jitomate', 80, 'g'], ['Cebolla', 30, 'g'],
    ['Queso fresco', 30, 'g'], ['Aceite de oliva', 8, 'ml'], ['Orégano', 1, 'g']]),
  r('c09', 'Chiles rellenos de queso con arroz', ['C'], 55, ['sin carne'], [560, 26, 50, 30], [
    ['Chile poblano', 2, 'pza'], ['Queso Oaxaca', 90, 'g'], ['Huevo', 2, 'pza'], ['Jitomate', 150, 'g'],
    ['Arroz', 60, 'g'], ['Harina', 20, 'g'], ['Aceite', 15, 'ml']]),
  r('c10', 'Lentejas guisadas con chorizo', ['C'], 45, ['leguminosa'], [510, 30, 60, 17], [
    ['Lenteja', 90, 'g'], ['Chorizo', 40, 'g'], ['Jitomate', 100, 'g'], ['Cebolla', 40, 'g'],
    ['Zanahoria', 60, 'g'], ['Plátano macho', 60, 'g']]),
  r('c11', 'Tacos de bistec con guacamole', ['C', 'N'], 25, ['res', 'rápido'], [540, 38, 44, 24], [
    ['Bistec de res', 150, 'g'], ['Tortilla de maíz', 4, 'pza'], ['Aguacate', 70, 'g'],
    ['Cebolla', 40, 'g'], ['Cilantro', 8, 'g'], ['Limón', 1, 'pza']]),
  r('c12', 'Calabacitas a la mexicana con pollo', ['C'], 30, ['pollo', 'verdura'], [420, 36, 28, 18], [
    ['Pechuga de pollo', 150, 'g'], ['Calabacita', 200, 'g'], ['Elote desgranado', 80, 'g'],
    ['Jitomate', 100, 'g'], ['Cebolla', 40, 'g'], ['Queso fresco', 30, 'g']]),
  r('c13', 'Arroz con leche de camarón y verduras salteadas', ['C'], 30, ['mariscos'], [450, 34, 46, 13], [
    ['Camarón', 160, 'g'], ['Arroz', 70, 'g'], ['Pimiento', 80, 'g'], ['Brócoli', 100, 'g'],
    ['Ajo', 2, 'diente'], ['Aceite de oliva', 10, 'ml']]),
  r('c14', 'Cochinita pibil con frijol colado', ['C'], 90, ['cerdo'], [580, 38, 44, 27], [
    ['Pierna de cerdo', 150, 'g'], ['Achiote', 20, 'g'], ['Naranja agria', 60, 'ml'],
    ['Tortilla de maíz', 3, 'pza'], ['Frijol negro', 100, 'g'], ['Cebolla morada', 40, 'g']]),
  r('c15', 'Sopa de fideo con pollo', ['C', 'N'], 25, ['pollo', 'rápido'], [430, 28, 52, 13], [
    ['Fideo', 70, 'g'], ['Jitomate', 150, 'g'], ['Pechuga de pollo deshebrada', 100, 'g'],
    ['Cebolla', 30, 'g'], ['Ajo', 1, 'diente'], ['Aceite', 8, 'ml']]),
  r('c16', 'Pollo al horno con papas y romero', ['C'], 60, ['pollo'], [530, 42, 40, 22], [
    ['Muslo de pollo', 200, 'g'], ['Papa', 180, 'g'], ['Cebolla', 60, 'g'],
    ['Romero', 2, 'g'], ['Aceite de oliva', 12, 'ml'], ['Ajo', 2, 'diente']]),
  r('c17', 'Bistec encebollado con frijoles charros', ['C'], 35, ['res'], [560, 40, 42, 24], [
    ['Bistec de res', 160, 'g'], ['Cebolla', 100, 'g'], ['Frijol bayo', 120, 'g'],
    ['Tocino', 20, 'g'], ['Jitomate', 60, 'g'], ['Tortilla de maíz', 3, 'pza']]),
  r('c18', 'Ensalada de garbanzo, atún y verduras', ['C', 'N'], 15, ['leguminosa', 'pescado', 'rápido'], [430, 32, 42, 14], [
    ['Garbanzo cocido', 150, 'g'], ['Atún en agua', 100, 'g'], ['Jitomate', 80, 'g'],
    ['Pepino', 80, 'g'], ['Cebolla morada', 30, 'g'], ['Aceite de oliva', 10, 'ml'], ['Limón', 1, 'pza']]),
  r('c19', 'Pozole rojo de pollo', ['C'], 75, ['pollo', 'caldo'], [500, 36, 52, 16], [
    ['Pechuga de pollo', 150, 'g'], ['Maíz pozolero', 150, 'g'], ['Chile guajillo', 3, 'pza'],
    ['Lechuga', 50, 'g'], ['Rábano', 40, 'g'], ['Cebolla', 40, 'g'], ['Orégano', 2, 'g']]),
  r('c20', 'Espagueti verde con pollo', ['C'], 35, ['pollo', 'pasta'], [570, 34, 62, 21], [
    ['Espagueti', 90, 'g'], ['Chile poblano', 1, 'pza'], ['Crema', 40, 'g'],
    ['Pechuga de pollo', 130, 'g'], ['Queso crema', 30, 'g'], ['Cebolla', 30, 'g']]),
  r('c21', 'Filete de pescado a la veracruzana', ['C'], 35, ['pescado'], [440, 38, 30, 19], [
    ['Filete de pescado', 180, 'g'], ['Jitomate', 180, 'g'], ['Aceituna', 30, 'g'],
    ['Alcaparra', 10, 'g'], ['Cebolla', 50, 'g'], ['Arroz', 50, 'g'], ['Aceite de oliva', 10, 'ml']]),
  r('c22', 'Puerco en salsa verde con nopales', ['C'], 50, ['cerdo'], [530, 38, 30, 28], [
    ['Espaldilla de cerdo', 150, 'g'], ['Tomate verde', 200, 'g'], ['Nopal cocido', 120, 'g'],
    ['Chile serrano', 2, 'pza'], ['Cebolla', 40, 'g'], ['Cilantro', 8, 'g']]),
  r('c23', 'Crema de calabaza con pollo a la plancha', ['C', 'N'], 30, ['verdura', 'ligero'], [390, 34, 30, 15], [
    ['Calabacita', 250, 'g'], ['Leche', 150, 'ml'], ['Pechuga de pollo', 140, 'g'],
    ['Cebolla', 40, 'g'], ['Ajo', 1, 'diente'], ['Aceite de oliva', 8, 'ml']]),
  r('c24', 'Fajitas de res con pimientos', ['C'], 30, ['res', 'rápido'], [520, 38, 44, 21], [
    ['Arrachera', 150, 'g'], ['Pimiento', 120, 'g'], ['Cebolla', 80, 'g'],
    ['Tortilla de harina', 3, 'pza'], ['Limón', 1, 'pza']]),

  // ---------- COLACIONES ----------
  r('k01', 'Manzana con crema de cacahuate', ['K'], 3, ['rápido', 'sin cocción'], [230, 7, 28, 11], [
    ['Manzana', 1, 'pza'], ['Crema de cacahuate', 20, 'g']]),
  r('k02', 'Puñado de nueces y almendras', ['K'], 1, ['rápido', 'sin cocción'], [200, 6, 8, 17], [
    ['Nuez', 15, 'g'], ['Almendra', 15, 'g']]),
  r('k03', 'Jícama y pepino con limón y chile', ['K'], 5, ['rápido', 'verdura'], [90, 2, 20, 0], [
    ['Jícama', 150, 'g'], ['Pepino', 100, 'g'], ['Limón', 1, 'pza'], ['Chile en polvo', 2, 'g']]),
  r('k04', 'Requesón con fruta', ['K'], 5, ['rápido'], [190, 16, 18, 6], [
    ['Requesón', 120, 'g'], ['Fresa', 100, 'g'], ['Miel', 8, 'g']]),
  r('k05', 'Huevo cocido con jitomate cherry', ['K'], 10, ['huevo'], [160, 13, 6, 10], [
    ['Huevo', 2, 'pza'], ['Jitomate cherry', 80, 'g'], ['Sal', 0.5, 'g']]),
  r('k06', 'Elote cocido con limón', ['K'], 20, ['verdura'], [180, 5, 34, 4], [
    ['Elote', 1, 'pza'], ['Limón', 1, 'pza'], ['Chile en polvo', 2, 'g'], ['Queso rallado', 15, 'g']]),
  r('k07', 'Palomitas naturales', ['K'], 6, ['rápido'], [150, 4, 24, 5], [
    ['Maíz palomero', 30, 'g'], ['Aceite', 5, 'ml'], ['Sal', 1, 'g']]),
  r('k08', 'Zanahoria y apio con hummus', ['K'], 6, ['verdura', 'sin cocción'], [180, 7, 20, 8], [
    ['Zanahoria', 100, 'g'], ['Apio', 60, 'g'], ['Hummus', 50, 'g']]),
  r('k09', 'Agua de jamaica con semillas de chía', ['K'], 5, ['líquido', 'rápido'], [90, 2, 16, 3], [
    ['Flor de jamaica', 10, 'g'], ['Chía', 10, 'g'], ['Agua', 400, 'ml']]),
  r('k10', 'Plátano con avena tostada', ['K'], 5, ['rápido'], [220, 5, 44, 4], [
    ['Plátano', 1, 'pza'], ['Avena en hojuelas', 25, 'g'], ['Canela molida', 1, 'g']]),

  // ---------- CENAS (ligeras) ----------
  r('n01', 'Sopa de verduras con pan tostado', ['N'], 30, ['ligero', 'verdura'], [280, 10, 40, 9], [
    ['Zanahoria', 80, 'g'], ['Calabacita', 100, 'g'], ['Papa', 80, 'g'], ['Ejote', 60, 'g'],
    ['Jitomate', 80, 'g'], ['Pan integral', 1, 'reb']]),
  r('n02', 'Tacos de frijol con queso y salsa', ['N'], 12, ['rápido', 'sin carne'], [340, 15, 46, 11], [
    ['Tortilla de maíz', 3, 'pza'], ['Frijol refrito', 150, 'g'], ['Queso fresco', 40, 'g'], ['Salsa roja', 30, 'g']]),
  r('n03', 'Ensalada de pollo con vinagreta', ['N'], 15, ['pollo', 'ligero'], [340, 34, 16, 16], [
    ['Pechuga de pollo', 140, 'g'], ['Lechuga', 80, 'g'], ['Jitomate', 80, 'g'], ['Pepino', 70, 'g'],
    ['Aceite de oliva', 10, 'ml'], ['Vinagre', 8, 'ml']]),
  r('n04', 'Tostadas de tinga de pollo', ['N'], 20, ['pollo'], [400, 28, 40, 15], [
    ['Tostada de maíz', 3, 'pza'], ['Pechuga de pollo deshebrada', 120, 'g'], ['Jitomate', 100, 'g'],
    ['Chipotle', 0.5, 'pza'], ['Lechuga', 40, 'g'], ['Crema', 20, 'g']]),
  r('n05', 'Huevo revuelto con nopales y frijoles', ['N', 'D'], 15, ['huevo', 'rápido'], [330, 22, 28, 15], [
    ['Huevo', 2, 'pza'], ['Nopal cocido', 120, 'g'], ['Frijol de la olla', 100, 'g'], ['Tortilla de maíz', 2, 'pza']]),
  r('n06', 'Caldo tlalpeño', ['N', 'C'], 35, ['pollo', 'caldo', 'picante'], [380, 32, 30, 14], [
    ['Pechuga de pollo', 140, 'g'], ['Garbanzo cocido', 80, 'g'], ['Zanahoria', 70, 'g'],
    ['Chipotle', 1, 'pza'], ['Aguacate', 40, 'g'], ['Ejote', 50, 'g']]),
  r('n07', 'Pizza casera de tortilla con verduras', ['N'], 18, ['rápido', 'sin carne'], [370, 18, 42, 15], [
    ['Tortilla de harina', 2, 'pza'], ['Salsa de jitomate', 60, 'g'], ['Queso mozzarella', 60, 'g'],
    ['Pimiento', 50, 'g'], ['Champiñón', 60, 'g'], ['Cebolla', 30, 'g']]),
  r('n08', 'Atún a la plancha con verduras al vapor', ['N', 'C'], 20, ['pescado', 'ligero'], [360, 38, 18, 15], [
    ['Filete de atún', 160, 'g'], ['Brócoli', 120, 'g'], ['Zanahoria', 80, 'g'],
    ['Aceite de oliva', 8, 'ml'], ['Limón', 1, 'pza']]),
  r('n09', 'Sopes de frijol con nopal y queso', ['N'], 25, ['sin carne'], [400, 17, 52, 14], [
    ['Masa de maíz', 120, 'g'], ['Frijol refrito', 100, 'g'], ['Nopal cocido', 100, 'g'],
    ['Queso fresco', 40, 'g'], ['Crema', 15, 'g'], ['Salsa verde', 30, 'g']]),
  r('n10', 'Wrap de pollo con verduras', ['N', 'A'], 15, ['pollo', 'rápido'], [420, 32, 40, 14], [
    ['Tortilla de harina integral', 1, 'pza'], ['Pechuga de pollo', 130, 'g'], ['Lechuga', 40, 'g'],
    ['Jitomate', 50, 'g'], ['Aguacate', 40, 'g'], ['Yogur natural', 20, 'g']]),
  r('n11', 'Crema de champiñones con pan', ['N'], 30, ['sin carne', 'ligero'], [310, 12, 32, 15], [
    ['Champiñón', 200, 'g'], ['Leche', 200, 'ml'], ['Cebolla', 40, 'g'],
    ['Ajo', 1, 'diente'], ['Pan integral', 1, 'reb'], ['Mantequilla', 8, 'g']]),
  r('n12', 'Tacos dorados de papa con lechuga', ['N'], 25, ['sin carne'], [390, 10, 52, 16], [
    ['Tortilla de maíz', 4, 'pza'], ['Papa', 180, 'g'], ['Lechuga', 50, 'g'],
    ['Queso fresco', 30, 'g'], ['Crema', 20, 'g'], ['Aceite', 12, 'ml']]),
];

export const TIEMPOS = [
  { k: 'D', nombre: 'Desayuno', hora: '07:30' },
  { k: 'A', nombre: 'Almuerzo', hora: '10:30' },
  { k: 'C', nombre: 'Comida', hora: '14:30' },
  { k: 'K', nombre: 'Colación', hora: '17:30' },
  { k: 'N', nombre: 'Cena', hora: '20:30' },
];

// Reparto orientativo de la energía del día entre los cinco tiempos.
export const REPARTO = { D: 0.25, A: 0.10, C: 0.35, K: 0.10, N: 0.20 };

// Agrupación para ordenar la lista del súper por pasillo.
export const PASILLOS = {
  'Frutas y verduras': ['Jitomate', 'Cebolla', 'Chile serrano', 'Tomate verde', 'Aguacate', 'Lechuga', 'Cilantro', 'Zanahoria', 'Calabacita', 'Chayote', 'Papa', 'Nopal cocido', 'Espinaca', 'Plátano', 'Manzana', 'Fresa', 'Papaya', 'Melón', 'Limón', 'Pepino', 'Jícama', 'Apio', 'Elote', 'Elote desgranado', 'Ejote', 'Brócoli', 'Pimiento', 'Champiñón', 'Chile poblano', 'Cebolla morada', 'Rábano', 'Jitomate cherry', 'Plátano macho', 'Ajo'],
  'Carnes y pescados': ['Pechuga de pollo', 'Pechuga de pollo deshebrada', 'Muslo de pollo', 'Falda de res', 'Bistec de res', 'Milanesa de res', 'Carne molida de res', 'Chambarete de res', 'Arrachera', 'Pierna de cerdo', 'Espaldilla de cerdo', 'Chorizo', 'Tocino', 'Jamón de pavo', 'Filete de tilapia', 'Filete de pescado', 'Filete de atún', 'Camarón'],
  'Lácteos y huevo': ['Huevo', 'Huevo cocido', 'Leche', 'Yogur natural', 'Crema', 'Queso fresco', 'Queso panela', 'Queso Oaxaca', 'Queso manchego', 'Queso crema', 'Queso mozzarella', 'Queso rallado', 'Requesón', 'Mantequilla'],
  'Abarrotes': ['Arroz', 'Arroz crudo', 'Frijol de la olla', 'Frijol refrito', 'Frijol negro', 'Frijol bayo', 'Lenteja', 'Garbanzo cocido', 'Avena en hojuelas', 'Granola', 'Fideo', 'Espagueti', 'Maíz pozolero', 'Maíz palomero', 'Atún en agua', 'Mayonesa', 'Aceite', 'Aceite de oliva', 'Miel', 'Crema de cacahuate', 'Nuez', 'Almendra', 'Chía', 'Cacao en polvo', 'Harina', 'Pan molido', 'Polvo para hornear', 'Galleta integral', 'Aceituna', 'Alcaparra', 'Vinagre', 'Hummus', 'Salsa de jitomate', 'Salsa verde', 'Salsa roja', 'Naranja agria'],
  'Tortillería y pan': ['Tortilla de maíz', 'Tortilla de harina', 'Tortilla de harina integral', 'Tostada de maíz', 'Masa de maíz', 'Bolillo', 'Pan integral'],
  'Especias y otros': ['Sal', 'Canela molida', 'Orégano', 'Romero', 'Epazote', 'Hierbabuena', 'Chile de árbol', 'Chile guajillo', 'Chipotle', 'Chile en polvo', 'Achiote', 'Flor de jamaica', 'Agua'],
};
