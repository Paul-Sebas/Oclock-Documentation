/**
 * 🧩 EXEMPLES DE CONVERSIONS IMPLICITES EN JAVASCRIPT
 * -----------------------------------------------
 * Le JavaScript tente souvent de "deviner" ton intention.
 * Cela peut donner des résultats surprenants 😅
 */



/* 🟡 Exemple 1 : La fameuse "banane magique" 🍌 */

const banane = "ba" + +"a" + "e";
console.log(banane); // 👉 "baNaNe"

/**
 * 🔍 Explication :
 * "ba" + +"a" + "e"
 *  → le + unaire essaie de convertir "a" en nombre
 *  → Number("a") → NaN
 *  → "ba" + NaN + "e" → "baNaNe"
 *
 * 💡 L'opérateur + :
 *   - additionne des nombres
 *   - concatène des chaînes
 *   - ou force une conversion implicite si les types diffèrent
 */



/* 🧠 Exemple 2 : Transformer une chaîne de caractères en nombre */

const maVariable = "123a12rty";

console.log('avec Number', Number(maVariable));         // 👉 NaN
console.log('avec parseInt', parseInt(maVariable, 10)); // 👉 123
console.log('avec le signe +', +maVariable);            // 👉 NaN (équivalent à Number)

/**
 * 🔍 Explication :
 * - Number() : essaie de convertir toute la chaîne → échoue si lettres → NaN
 * - parseInt() : lit tant qu'il y a des chiffres → s'arrête dès qu'il trouve une lettre
 * - +variable : équivaut à Number(variable)
 *
 * 💡 parseInt() est plus "tolérant" mais non strict : utile pour nettoyer des chaînes mixtes
 */



/* 🚫 Exemple 3 : Si la chaîne commence par des lettres */

const maVariable2 = "azerty123";

console.log('avec Number', Number(maVariable2));         // 👉 NaN
console.log('avec parseInt', parseInt(maVariable2, 10)); // 👉 NaN
console.log('avec le signe +', +maVariable2);            // 👉 NaN

/**
 * 🔍 Explication :
 * Si la chaîne NE commence PAS par un chiffre,
 * parseInt() et Number() échouent directement → NaN
 */



/* 🧮 Exemple 4 : Les booléens convertis en nombres */

console.log(true + true);   // 👉 2
console.log(true + false);  // 👉 1
console.log(false + false); // 👉 0

/**
 * 🔍 Explication :
 * - true est converti en 1
 * - false est converti en 0
 * - Donc true + true = 1 + 1 = 2
 */



/* ⚠️ Exemple 5 : Les comparaisons étranges */

console.log(null < 1);      // 👉 true
console.log(null == 0);     // 👉 false
console.log(null <= 0);     // 👉 true ❗
console.log(undefined < 1); // 👉 false
console.log(NaN < 1);       // 👉 false

/**
 * 🔍 Explication :
 * - null est converti en 0 pour les comparaisons "numériques" (<, >, <=, >=)
 * - MAIS dans une égalité simple (==), il n'est égal qu'à undefined, pas à 0
 * 
 * 👉 Détail :
 *    null < 1      → 0 < 1 → true
 *    null == 0     → false (car null n'est égal qu'à undefined)
 *    null <= 0     → 0 <= 0 → true
 *    undefined < 1 → NaN < 1 → false
 *    NaN < 1       → false (toute comparaison avec NaN est false)
 *
 * 💡 Conseil :
 *   Utiliser TOUJOURS les comparaisons strictes (=== ou !==)
 *   pour éviter ces conversions implicites non intuitives.
 */



/* 🧪 Exemple 6 : Comparaisons mixtes chaînes / nombres */

console.log("2" > 1);  // 👉 true (la chaîne "2" est convertie en nombre)
console.log("02" == 2); // 👉 true (coercition implicite)
console.log("2" === 2); // 👉 false (comparaison stricte, types différents)

/**
 * 🔍 Explication :
 * - "2" > 1 → Number("2") → 2 > 1 → true
 * - "02" == 2 → 2 == 2 → true
 * - "2" === 2 → types différents → false
 */



/* 🧊 Exemple 7 : Conversion implicite de chaînes vides */

console.log("" == 0);  // 👉 true ("" converti en 0)
console.log("" === 0); // 👉 false (types différents)
console.log(+"" === 0); // 👉 true (+"" → Number("") → 0)

/**
 * 💡 La chaîne vide est souvent convertie en 0.
 * Cela peut causer des pièges dans les conditions.
 */



/* 🎯 RÉCAP DES CONVERSIONS IMPLICITES COURANTES

| Valeur        | En nombre (Number) | En booléen (Boolean) |
|----------------|--------------------|------------------------|
| "123"          | 123                | true                   |
| "123abc"       | NaN                | true                   |
| ""             | 0                  | false                  |
| null           | 0                  | false                  |
| undefined      | NaN                | false                  |
| true           | 1                  | —                      |
| false          | 0                  | —                      |
| NaN            | NaN                | false                  |

💬 À retenir :
- Number(), + ou < > ≤ ≥ → conversions numériques
- == → conversions "souples" et souvent piégeuses
- === → stricte, sans conversion
- Toujours préférer === et !== pour éviter les comportements inattendus
*/