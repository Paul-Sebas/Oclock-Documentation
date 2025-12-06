/**
 * 🧩 TRUTHY & FALSY EN JAVASCRIPT
 * ---------------------------------------------
 * En JavaScript, toutes les valeurs ne sont pas “vraies” ou “fausses” directement.
 * Mais lorsqu’une valeur est évaluée dans un contexte booléen (if, while, opérateurs logiques…),
 * elle devient soit :
 *
 *   ✔ truthy → considérée comme vraie
 *   ✘ falsy  → considérée comme fausse
 *
 * Cette fiche résume :
 * - ce qu’est une valeur truthy ou falsy
 * - comment tester une valeur efficacement
 * - les cas particuliers et pièges
 */

/* 🟡 1. Le double bang (!!) : convertir en booléen
   ------------------------------------------------
   En JS, !!value convertit n’importe quelle valeur en true/false.

   - !!value → true  si value est truthy
   - !!value → false si value est falsy
*/

/* 🟠 2. Fonction utilitaire : reconnaître truthy / falsy
   ----------------------------------------------------- */

const isTruthyOrFalsy = (value) => {
  // !!value convertit la valeur en un vrai booléen
  if (!!value) {
    console.log(value + " : truthy");
  } else {
    console.log(value + " : falsy");
  }
};

/* 🟢 3. Valeurs à tester
   ----------------------- */

const zero = 0;
const nombre = 5;
const negativeNumber = -3;
const emptyString = "";
const notEmptyString = "azeryui";
const emptyArray = [];
const notEmptyArray = [""];
const emptyObject = {};
const notEmptyObject = { x: 1 };
const undefinedValue = undefined;
const nullValue = null;
const nan = NaN;

/* 🧪 4. Tests et résultats
   ------------------------ */

isTruthyOrFalsy(zero); // 0 : falsy
isTruthyOrFalsy(nombre); // 5 : truthy
isTruthyOrFalsy(negativeNumber); // -3 : truthy
isTruthyOrFalsy(emptyString); // '' : falsy
isTruthyOrFalsy(notEmptyString); // 'azeryui' : truthy
isTruthyOrFalsy(emptyArray); // [] : truthy
isTruthyOrFalsy(notEmptyArray); // [''] : truthy
isTruthyOrFalsy(emptyObject); // {} : truthy
isTruthyOrFalsy(notEmptyObject); // {x:1} : truthy
isTruthyOrFalsy(undefinedValue); // undefined : falsy
isTruthyOrFalsy(nullValue); // null : falsy
isTruthyOrFalsy(nan); // NaN : falsy
isTruthyOrFalsy(false); // false : falsy

/**
 * 🔍 5. La liste officielle des valeurs FALSY en JavaScript
 * --------------------------------------------------------
 * Ce sont les *seules* valeurs considérées comme fausses :
 *
 *   ✘ false
 *   ✘ 0
 *   ✘ -0
 *   ✘ ""
 *   ✘ null
 *   ✘ undefined
 *   ✘ NaN
 *
 * Toutes les autres valeurs → truthy :
 *
 *   ✔ tous les nombres non nuls (5, -3, 42…)
 *   ✔ toutes les chaînes non vides ("hello")
 *   ✔ les tableaux ([], [1], [""])
 *   ✔ les objets ({}, {x:1})
 *   ✔ les fonctions
 *   ✔ les symboles
 */

/**
 * 🎯 6. Pièges classiques
 * -----------------------
 * - [] est truthy → un tableau vide est considéré comme "vrai"
 * - {} est truthy → un objet vide est "vrai"
 * - "0" est truthy → c’est une string non vide
 * - NaN est falsy → piège courant (typeof NaN === "number")
 *
 * 💡 Toujours tester explicitement quand vous attendez vraiment un type.
 */

/**
 * 🧠 7. Quand utilise-t-on truthy / falsy ?
 * -----------------------------------------
 *
 * ✔ Conditions :
 *    if (value) { ... }
 *
 * ✔ Boucles :
 *    while (value) { ... }
 *
 * ✔ Opérateur logique OR (||) :
 *    value || "valeur par défaut"
 *
 * ✔ Opérateur logique AND (&&) :
 *    value && faireQuelqueChose()
 *
 * ✔ Coercition explicite :
 *    const bool = !!value;
 */

/**
 * 📝 RÉSUMÉ
 * ---------
 * ✔ !!value permet de savoir si une valeur est évaluée comme vraie ou fausse.
 * ✔ JavaScript ne se base pas sur les types, mais sur truthy/falsy.
 * ✔ Il existe seulement 6 valeurs falsy.
 * ✔ Tout le reste est truthy.
 *
 * Garder ces règles en tête évite beaucoup d’erreurs dans les conditions et les validations.
 */

/*______________________________________________________________*/
/*
- la doc MDN : 
    - https://developer.mozilla.org/fr/docs/Glossary/Truthy
    - https://developer.mozilla.org/fr/docs/Glossary/Falsy
*/
