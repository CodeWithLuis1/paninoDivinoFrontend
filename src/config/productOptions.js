// src/config/productOptions.js
const strip = (s) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

const isName = (p, ...names) => {
  const n = strip(p?.nombre);
  return names.some((x) => n === strip(x));
};

const SAUCES_PESTO_O_CASA = ["Salsa Pesto", "Aderezo de la Casa"];

const PANINI_EXTRAS = [
  { key: "huevo",  label: "Huevo",       price: 5 },
  { key: "jamon",  label: "Jamón",       price: 5 },
  { key: "queso",  label: "Queso extra", price: 10 },
  { key: "tocino", label: "Tocino",      price: 10 },
];

/**
 * Builder genérico de paninis.
 * - `sauces` es opcional; por defecto usa pesto/casa. Para desactivar salsas, pásalo como [].
 */
function buildPaniniConfig({ individual, conPapas, removibles, choiceGroups, sauces }) {
  const saucesList = Array.isArray(sauces) ? sauces : SAUCES_PESTO_O_CASA;

  return {
    // ¡OJO!: label SIN precio; el precio va en "price"
    variants: [
      { key: "individual", label: "Individual", price: individual },
      { key: "con_papas",  label: "Con papas",  price: conPapas   },
    ],

    // Salsas (si viene [], el modal ocultará la sección)
    sauces: saucesList,

    // Ingredientes que se pueden remover (aparecen marcados por defecto)
    removibles,

    // Extras comunes a paninis
    extras: PANINI_EXTRAS,

    // Segment controls adicionales (opciones excluyentes)
    choiceGroups: choiceGroups || [],

    // Valores por defecto del UI
    defaults: {
      variant: "individual",
      // Solo definimos sauce por defecto si hay salsas
      ...(saucesList.length ? { sauce: saucesList[0] } : {}),
      removibles: [...removibles],
      extras: [],
      choices: (choiceGroups || []).reduce((acc, g) => {
        acc[g.key] = g.default;
        return acc;
      }, {}),
    },
  };
}

function configPanini(p) {
  if (isName(p, "SANTO PORCO")) {
    return buildPaniniConfig({
      individual: 35, conPapas: 45,
      removibles: [
        "Pan chapata", "Jamón de pavo", "Tocino",
        "Combinación de 4 quesos", "Espinacas", "Especias",
      ],
    });
  }

  if (isName(p, "SANTO BOCADO")) {
    return buildPaniniConfig({
      individual: 40, conPapas: 50,
      removibles: [
        "Pan chapata", "Carne de res",
        "Combinación de 4 quesos", "Espinacas", "Especias",
      ],
    });
  }

  if (isName(p, "PECADO PERFECTO")) {
    return buildPaniniConfig({
      individual: 40, conPapas: 50,
      removibles: [
        "Pan chapata", "Camarones al ajillo",
        "Combinación de 4 quesos", "Espinacas", "Especias italianas",
      ],
    });
  }

  if (isName(p, "TERRA Y CIELO")) {
    return buildPaniniConfig({
      individual: 45, conPapas: 55,
      removibles: [
        "Pan chapata", "Carne de res", "Camarones al ajillo",
        "Combinación de 4 quesos", "Espinacas", "Especias",
      ],
    });
  }

  if (isName(p, "PANZA LLENA")) {
    // PANZA LLENA: sin salsas; relleno como segmento (Jamón o Frijoles)
    return buildPaniniConfig({
      individual: 25, conPapas: 35,
      sauces: [], // ⟵ ocultamos la sección de salsas
      removibles: ["Pan chapata", "Relleno con huevo revuelto"],
      choiceGroups: [
        {
          key: "relleno",
          label: "Relleno",
          options: [
            { key: "jamon",    label: "Jamón" },
            { key: "frijoles", label: "Frijoles volteados" },
          ],
          default: "jamon",
        },
      ],
    });
  }

  return null;
}

export function getProductUIConfig(product) {
  const panini = configPanini(product);
  if (panini) return panini;

  // Fallback genérico (productos que no son panini)
  return {
    variants: [
      { key: "individual", label: "Individual", price: Number(product?.precio ?? 0) }
    ],
    sauces: SAUCES_PESTO_O_CASA,
    removibles: [],
    extras: [],
    defaults: {
      variant: "individual",
      sauce: SAUCES_PESTO_O_CASA[0],
      removibles: [],
      extras: [],
      choices: {},
    },
  };
}
