// Alimentos sueltos para registrar a mano lo que se comió fuera del menú.
// Cada renglón es UNA porción típica con su aporte aproximado. Los valores son
// promedios de tablas de composición de alimentos de uso común: sirven para
// llevar cuenta, no para medir con precisión.

// a(id, nombre, categoría, cantidad, unidad, [kcal, prot, carb, grasa])
const a = (id, nombre, cat, cant, unidad, m) =>
  ({ id, nombre, cat, cant, unidad, kcal: m[0], prot: m[1], carb: m[2], gras: m[3] });

export const CATEGORIAS_ALIMENTO = [
  { k: 'liquidos', nombre: 'Líquidos y caldos', desc: 'Dieta blanda y de recuperación' },
  { k: 'bebidas', nombre: 'Bebidas', desc: 'Café, refrescos, jugos, alcohol' },
  { k: 'frutas', nombre: 'Frutas' },
  { k: 'verduras', nombre: 'Verduras' },
  { k: 'cereales', nombre: 'Cereales, pan y tortilla' },
  { k: 'proteinas', nombre: 'Carnes, huevo y pescado' },
  { k: 'lacteos', nombre: 'Lácteos' },
  { k: 'antojitos', nombre: 'Antojitos y comida rápida' },
  { k: 'dulces', nombre: 'Dulces y postres' },
  { k: 'anadidos', nombre: 'Endulzantes y salsas', desc: 'Lo que se agrega a otra cosa' },
  { k: 'grasas', nombre: 'Grasas, semillas y botanas' },
];

export const ALIMENTOS = [
  // ── Líquidos y caldos: lo que se usa en dieta de recuperación ──
  a('l01', 'Gelatina de limón preparada', 'liquidos', 120, 'g', [60, 1.2, 14, 0]),
  a('l02', 'Gelatina de cualquier sabor', 'liquidos', 120, 'g', [62, 1.2, 15, 0]),
  a('l03', 'Gelatina light sin azúcar', 'liquidos', 120, 'g', [12, 1.2, 1, 0]),
  a('l04', 'Té de manzanilla sin azúcar', 'liquidos', 240, 'ml', [2, 0, 0.5, 0]),
  a('l05', 'Té de manzanilla con una cucharada de azúcar', 'liquidos', 240, 'ml', [42, 0, 10, 0]),
  a('l06', 'Té negro o verde sin azúcar', 'liquidos', 240, 'ml', [2, 0, 0.5, 0]),
  a('l07', 'Caldo de pollo colado', 'liquidos', 240, 'ml', [40, 4, 3, 1.5]),
  a('l08', 'Consomé de pollo en polvo preparado', 'liquidos', 240, 'ml', [20, 1, 3, 0.5]),
  a('l09', 'Caldo de verduras colado', 'liquidos', 240, 'ml', [30, 1.5, 6, 0.3]),
  a('l10', 'Suero oral', 'liquidos', 250, 'ml', [25, 0, 6, 0]),
  a('l11', 'Agua de coco natural', 'liquidos', 250, 'ml', [46, 1.7, 9, 0.5]),
  a('l12', 'Paleta de hielo de agua', 'liquidos', 1, 'pza', [70, 0, 17, 0]),
  a('l13', 'Nieve de limón', 'liquidos', 100, 'g', [125, 0.4, 31, 0.2]),
  a('l14', 'Atole de agua sin leche', 'liquidos', 250, 'ml', [150, 2, 33, 1]),
  a('l15', 'Manzanilla con miel', 'liquidos', 240, 'ml', [45, 0, 11, 0]),
  a('l16', 'Puré o papilla de manzana', 'liquidos', 120, 'g', [60, 0.2, 15, 0.1]),
  a('l17', 'Yogur bebible natural', 'liquidos', 250, 'ml', [140, 8, 20, 3]),
  a('l18', 'Crema de verduras colada', 'liquidos', 250, 'ml', [110, 4, 15, 4]),
  a('l19', 'Agua natural', 'liquidos', 250, 'ml', [0, 0, 0, 0]),
  a('l20', 'Electrolito oral saborizado', 'liquidos', 250, 'ml', [60, 0, 15, 0]),

  // ── Bebidas ──
  a('b01', 'Jugo de manzana', 'bebidas', 240, 'ml', [110, 0.2, 28, 0.3]),
  a('b02', 'Jugo de naranja natural', 'bebidas', 240, 'ml', [110, 1.7, 26, 0.5]),
  a('b03', 'Jugo de uva', 'bebidas', 240, 'ml', [150, 0.5, 37, 0.3]),
  a('b04', 'Agua de sabor con azúcar', 'bebidas', 500, 'ml', [130, 0.3, 33, 0]),
  a('b05', 'Agua de sabor sin azúcar', 'bebidas', 500, 'ml', [20, 0.3, 5, 0]),
  a('b06', 'Refresco de cola', 'bebidas', 355, 'ml', [150, 0, 39, 0]),
  a('b07', 'Refresco light', 'bebidas', 355, 'ml', [2, 0, 0, 0]),
  a('b08', 'Café americano sin azúcar', 'bebidas', 240, 'ml', [3, 0.3, 0, 0]),
  a('b09', 'Café con leche y azúcar', 'bebidas', 240, 'ml', [110, 5, 14, 4]),
  a('b10', 'Café de olla', 'bebidas', 240, 'ml', [70, 0.3, 18, 0]),
  a('b11', 'Cerveza', 'bebidas', 355, 'ml', [150, 1.6, 13, 0]),
  a('b12', 'Cerveza light', 'bebidas', 355, 'ml', [100, 0.8, 6, 0]),
  a('b13', 'Tequila o mezcal, un caballito', 'bebidas', 45, 'ml', [100, 0, 0, 0]),
  a('b14', 'Bebida deportiva', 'bebidas', 500, 'ml', [130, 0, 34, 0]),
  a('b15', 'Licuado de fruta con leche', 'bebidas', 350, 'ml', [250, 9, 42, 6]),
  a('b16', 'Champurrado', 'bebidas', 250, 'ml', [200, 5, 36, 5]),

  // ── Frutas ──
  a('f01', 'Manzana', 'frutas', 1, 'pza', [95, 0.5, 25, 0.3]),
  a('f02', 'Plátano', 'frutas', 1, 'pza', [105, 1.3, 27, 0.4]),
  a('f03', 'Naranja', 'frutas', 1, 'pza', [62, 1.2, 15, 0.2]),
  a('f04', 'Papaya picada', 'frutas', 150, 'g', [60, 0.7, 15, 0.2]),
  a('f05', 'Melón picado', 'frutas', 150, 'g', [51, 1.3, 12, 0.3]),
  a('f06', 'Sandía picada', 'frutas', 150, 'g', [45, 0.9, 11, 0.2]),
  a('f07', 'Fresas', 'frutas', 150, 'g', [48, 1, 11, 0.5]),
  a('f08', 'Mango', 'frutas', 1, 'pza', [135, 1.1, 35, 0.6]),
  a('f09', 'Uvas', 'frutas', 120, 'g', [82, 0.8, 21, 0.2]),
  a('f10', 'Piña picada', 'frutas', 150, 'g', [75, 0.8, 20, 0.2]),
  a('f11', 'Guayaba', 'frutas', 2, 'pza', [75, 2.8, 16, 1]),
  a('f12', 'Aguacate', 'frutas', 0.5, 'pza', [160, 2, 9, 15]),
  a('f13', 'Mandarina', 'frutas', 2, 'pza', [90, 1.4, 23, 0.5]),
  a('f14', 'Pera', 'frutas', 1, 'pza', [100, 0.6, 27, 0.2]),

  // ── Verduras ──
  a('v01', 'Ensalada verde sin aderezo', 'verduras', 150, 'g', [30, 2, 5, 0.4]),
  a('v02', 'Nopales cocidos', 'verduras', 150, 'g', [22, 1.8, 4, 0.2]),
  a('v03', 'Calabacitas cocidas', 'verduras', 150, 'g', [25, 1.8, 5, 0.4]),
  a('v04', 'Brócoli cocido', 'verduras', 150, 'g', [52, 3.7, 11, 0.6]),
  a('v05', 'Zanahoria cruda', 'verduras', 100, 'g', [41, 0.9, 10, 0.2]),
  a('v06', 'Jícama con limón y chile', 'verduras', 200, 'g', [76, 1.4, 18, 0.2]),
  a('v07', 'Pepino con limón', 'verduras', 200, 'g', [30, 1.3, 7, 0.2]),
  a('v08', 'Elote cocido', 'verduras', 1, 'pza', [125, 4, 27, 2]),
  a('v09', 'Papa cocida', 'verduras', 150, 'g', [130, 3, 30, 0.2]),
  a('v10', 'Chayote cocido', 'verduras', 150, 'g', [28, 1.2, 6, 0.2]),

  // ── Cereales, pan y tortilla ──
  a('c01', 'Tortilla de maíz', 'cereales', 1, 'pza', [65, 1.6, 13, 0.8]),
  a('c02', 'Tortilla de harina', 'cereales', 1, 'pza', [140, 4, 24, 3.5]),
  a('c03', 'Bolillo', 'cereales', 1, 'pza', [180, 6, 36, 1.5]),
  a('c04', 'Pan de caja blanco', 'cereales', 2, 'reb', [140, 4, 26, 2]),
  a('c05', 'Pan integral', 'cereales', 2, 'reb', [160, 8, 28, 2.5]),
  a('c06', 'Arroz blanco cocido', 'cereales', 150, 'g', [200, 4, 44, 0.5]),
  a('c07', 'Frijoles de la olla', 'cereales', 150, 'g', [160, 10, 28, 0.6]),
  a('c08', 'Frijoles refritos', 'cereales', 150, 'g', [220, 10, 28, 8]),
  a('c09', 'Pasta cocida', 'cereales', 150, 'g', [220, 8, 43, 1.3]),
  a('c10', 'Avena cocida', 'cereales', 250, 'g', [160, 6, 27, 3]),
  a('c11', 'Cereal de caja con leche', 'cereales', 1, 'taza', [230, 9, 42, 3]),
  a('c12', 'Tostadas de maíz', 'cereales', 3, 'pza', [140, 3, 24, 4]),
  a('c13', 'Galletas saladas', 'cereales', 6, 'pza', [120, 2.5, 20, 3]),
  a('c14', 'Pan dulce, una pieza', 'cereales', 1, 'pza', [300, 6, 45, 11]),
  a('c15', 'Bolillo integral', 'cereales', 1, 'pza', [170, 7, 32, 2]),

  // ── Carnes, huevo y pescado ──
  a('p01', 'Huevo cocido', 'proteinas', 1, 'pza', [78, 6.3, 0.6, 5.3]),
  a('p02', 'Huevo estrellado', 'proteinas', 1, 'pza', [95, 6.3, 0.6, 7.5]),
  a('p03', 'Pechuga de pollo asada', 'proteinas', 150, 'g', [250, 46, 0, 6]),
  a('p04', 'Muslo de pollo', 'proteinas', 150, 'g', [280, 36, 0, 15]),
  a('p05', 'Bistec de res asado', 'proteinas', 150, 'g', [300, 42, 0, 14]),
  a('p06', 'Carne molida de res guisada', 'proteinas', 150, 'g', [330, 33, 3, 20]),
  a('p07', 'Filete de pescado a la plancha', 'proteinas', 150, 'g', [190, 36, 0, 4]),
  a('p08', 'Atún en agua drenado', 'proteinas', 120, 'g', [130, 29, 0, 1]),
  a('p09', 'Camarones cocidos', 'proteinas', 150, 'g', [150, 32, 1, 1.5]),
  a('p10', 'Carne de cerdo guisada', 'proteinas', 150, 'g', [320, 36, 2, 18]),
  a('p11', 'Jamón de pavo', 'proteinas', 60, 'g', [70, 11, 2, 2]),
  a('p12', 'Chorizo', 'proteinas', 60, 'g', [200, 12, 2, 16]),
  a('p13', 'Salchicha', 'proteinas', 2, 'pza', [180, 8, 4, 15]),
  a('p14', 'Milanesa empanizada frita', 'proteinas', 150, 'g', [380, 34, 18, 20]),

  // ── Lácteos ──
  a('d01', 'Leche entera', 'lacteos', 250, 'ml', [150, 8, 12, 8]),
  a('d02', 'Leche light', 'lacteos', 250, 'ml', [100, 8, 12, 2.5]),
  a('d03', 'Yogur natural sin azúcar', 'lacteos', 200, 'g', [120, 12, 9, 4]),
  a('d04', 'Yogur de sabor', 'lacteos', 200, 'g', [190, 8, 32, 3]),
  a('d05', 'Queso fresco', 'lacteos', 50, 'g', [110, 8, 2, 8]),
  a('d06', 'Queso Oaxaca', 'lacteos', 50, 'g', [160, 11, 1, 12]),
  a('d07', 'Queso panela', 'lacteos', 50, 'g', [105, 9, 1.5, 7]),
  a('d08', 'Requesón', 'lacteos', 100, 'g', [140, 14, 4, 7]),
  a('d09', 'Crema ácida', 'lacteos', 30, 'g', [60, 0.7, 1, 6]),

  // ── Antojitos y comida rápida ──
  a('n01', 'Taco de guisado', 'antojitos', 1, 'pza', [180, 10, 16, 8]),
  a('n02', 'Taco de pastor', 'antojitos', 1, 'pza', [200, 11, 17, 10]),
  a('n03', 'Quesadilla de queso', 'antojitos', 1, 'pza', [280, 13, 24, 15]),
  a('n04', 'Torta de jamón y queso', 'antojitos', 1, 'pza', [520, 24, 50, 25]),
  a('n05', 'Gordita de guisado', 'antojitos', 1, 'pza', [260, 9, 30, 12]),
  a('n06', 'Sope', 'antojitos', 1, 'pza', [220, 7, 28, 9]),
  a('n07', 'Tamal', 'antojitos', 1, 'pza', [300, 8, 35, 14]),
  a('n08', 'Hamburguesa sencilla', 'antojitos', 1, 'pza', [520, 26, 42, 27]),
  a('n09', 'Rebanada de pizza', 'antojitos', 1, 'reb', [290, 12, 34, 11]),
  a('n10', 'Papas fritas, orden mediana', 'antojitos', 110, 'g', [340, 4, 44, 17]),
  a('n11', 'Enchiladas, tres piezas', 'antojitos', 1, 'orden', [450, 18, 48, 20]),
  a('n12', 'Pozole, un plato', 'antojitos', 1, 'plato', [400, 28, 40, 14]),
  a('n13', 'Caldo de res con verduras', 'antojitos', 1, 'plato', [380, 30, 30, 15]),
  a('n14', 'Chilaquiles con pollo', 'antojitos', 1, 'plato', [470, 25, 45, 20]),
  a('n15', 'Burrito de carne', 'antojitos', 1, 'pza', [480, 24, 52, 19]),
  a('n16', 'Hot dog', 'antojitos', 1, 'pza', [320, 11, 28, 18]),
  a('n17', 'Comida corrida completa', 'antojitos', 1, 'comida', [850, 40, 95, 32]),

  // ── Dulces y postres ──
  a('s01', 'Chocolate en barra', 'dulces', 40, 'g', [210, 3, 24, 12]),
  a('s02', 'Galletas dulces', 'dulces', 4, 'pza', [200, 2.5, 28, 9]),
  a('s03', 'Helado de crema', 'dulces', 100, 'g', [210, 3.5, 24, 11]),
  a('s04', 'Flan', 'dulces', 120, 'g', [230, 6, 35, 8]),
  a('s05', 'Arroz con leche', 'dulces', 150, 'g', [230, 5, 42, 5]),
  a('s06', 'Pastel, una rebanada', 'dulces', 100, 'g', [350, 4, 50, 15]),
  a('s07', 'Dulce de leche o cajeta', 'dulces', 30, 'g', [100, 2, 18, 2.5]),
  a('s08', 'Gomitas', 'dulces', 40, 'g', [140, 2, 33, 0]),

  // ── Edulcorantes y añadidos ──
  a('e01', 'Splenda, un sobre', 'anadidos', 1, 'sobre', [4, 0, 1, 0]),
  a('e02', 'Stevia, un sobre', 'anadidos', 1, 'sobre', [4, 0, 1, 0]),
  a('e03', 'Edulcorante líquido, unas gotas', 'anadidos', 5, 'gotas', [0, 0, 0, 0]),
  a('e04', 'Azúcar, una cucharada', 'anadidos', 12, 'g', [46, 0, 12, 0]),
  a('e05', 'Azúcar, una cucharadita', 'anadidos', 4, 'g', [16, 0, 4, 0]),
  a('e06', 'Miel, una cucharada', 'anadidos', 21, 'g', [64, 0, 17, 0]),
  a('e07', 'Sal', 'anadidos', 2, 'g', [0, 0, 0, 0]),
  a('e08', 'Salsa picante embotellada', 'anadidos', 15, 'ml', [5, 0, 1, 0]),
  a('e09', 'Salsa verde o roja de molcajete', 'anadidos', 40, 'g', [20, 1, 4, 0.3]),
  a('e10', 'Cátsup', 'anadidos', 15, 'g', [18, 0.2, 4.5, 0]),
  a('e11', 'Limón exprimido', 'anadidos', 1, 'pza', [8, 0.1, 3, 0]),
  a('e12', 'Chile en polvo con limón', 'anadidos', 5, 'g', [10, 0.2, 2, 0]),

  // ── Grasas, semillas y botanas ──
  a('g01', 'Cacahuates', 'grasas', 30, 'g', [170, 7, 5, 15]),
  a('g02', 'Nueces', 'grasas', 30, 'g', [195, 4.5, 4, 19]),
  a('g03', 'Almendras', 'grasas', 30, 'g', [170, 6, 6, 15]),
  a('g04', 'Crema de cacahuate', 'grasas', 30, 'g', [180, 7, 6, 16]),
  a('g05', 'Aceite de oliva', 'grasas', 15, 'ml', [120, 0, 0, 14]),
  a('g06', 'Mantequilla', 'grasas', 15, 'g', [110, 0.1, 0, 12]),
  a('g07', 'Mayonesa', 'grasas', 15, 'g', [95, 0.1, 0.5, 10]),
  a('g08', 'Papas fritas de bolsa', 'grasas', 50, 'g', [270, 3, 26, 17]),
  a('g09', 'Palomitas naturales', 'grasas', 30, 'g', [120, 4, 24, 1.5]),
  a('g10', 'Guacamole', 'grasas', 60, 'g', [110, 1.4, 6, 10]),
  a('g11', 'Semillas de girasol o pepita', 'grasas', 30, 'g', [165, 6, 5, 14]),
];

// Unidades disponibles al capturar un alimento a mano.
export const UNIDADES = ['g', 'ml', 'pza', 'reb', 'sobre', 'gotas', 'taza', 'plato', 'orden', 'porción'];

export const buscarAlimentos = (q, cat) => {
  const t = (q || '').trim().toLowerCase();
  return ALIMENTOS.filter((x) => {
    if (cat && cat !== 'todo' && x.cat !== cat) return false;
    return !t || x.nombre.toLowerCase().includes(t);
  });
};
