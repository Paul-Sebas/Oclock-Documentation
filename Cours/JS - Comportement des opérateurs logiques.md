/**
 * 🧩 COMPORTEMENT DES OPÉRATEURS LOGIQUES `||` ET `&&` EN JAVASCRIPT
 * -----------------------------------------------------------------
 * En JavaScript, les opérateurs logiques ne renvoient PAS toujours true ou false.
 * Ils renvoient l'une des valeurs testées, selon le principe de "truthy" / "falsy".
 *
 * Truthy  → toute valeur considérée comme vraie (ex : "abc", 1, {}, [])
 * Falsy   → les valeurs suivantes uniquement :
 *            false, 0, "", null, undefined, NaN
 *
 * 🎯 À retenir :
 *  - A || B  → renvoie A si A est truthy, sinon renvoie B
 *  - A && B  → renvoie A si A est falsy, sinon renvoie B
 */

/* L'opérateur OR (||)
   Renvoie la première valeur "truthy"
*/

const toto = '' || 'toto';    
console.log(toto);  // 👉 'toto'

const tutu = 'tutu' || '';    
 console.log(tutu);   // 👉 'tutu'

/**
 * 🔍 Explication :
 * '' est falsy → donc '' || 'toto' renvoie 'toto'
 * 'tutu' est truthy → donc 'tutu' || '' renvoie 'tutu'
 *
 * 💡 OR (||) est souvent utilisé pour fournir des valeurs par défaut :
 *    const username = input || "Invité";
 */



/* L'opérateur AND (&&)
   Renvoie la première valeur "falsy"
   sinon renvoie la seconde
*/

const tata = '' && 'tata';
console.log(tata); // 👉 ''  
   
const titi = 'titi' && '';   
console.log(titi);  // 👉 ''
 
const tete = 'tata' && 'tete'; 
console.log(tete);// 👉 'tete'

/**
 * 🔍 Explication :
 * '' est falsy → '' && 'tata' renvoie ''
 * 'titi' est truthy → 'titi' && '' renvoie ''
 * 'tata' est truthy → 'tata' && 'tete' renvoie 'tete'
 *
 * 💡 AND (&&) est souvent utilisé pour exécuter une action si une condition est vraie :
 *    user && afficherDashboard() // Si mon utilisateur existe (la variable user) alors j'execute la fonction qui affiche le dashboard, sinon, je ne fait rien
 */

/* 🔢 Exemple avec des nombres */

const num = 0 && 1;     
console.log(num);   // 👉 0

const num2 = 1 && 0;
console.log(num2);       // 👉 0

const num3 = 0 || 1;   
console.log(num3);  // 👉 1

const num4 = 1 || 0;
console.log(num4);     // 👉 1

const num5 = 1 && 2; 
console.log(num5);   // 👉 2

const num6 = 1 || 2;
console.log(num6);    // 👉 1

/**
 * 🔍 Explication :
 * 0 est falsy → 0 && 1 renvoie 0
 * 1 est truthy → 1 && 0 renvoie 0
 * 0 est falsy → 0 || 1 renvoie 1
 * 1 est truthy → 1 || 0 renvoie 1
 * 1 && 2 → les deux truthy → renvoie la deuxième → 2
 * 1 || 2 → premier truthy → renvoie 1
 */



/* 🎯 RÉCAP DES RÈGLES
 *
 *  OR  (A || B)
 *    → si A est truthy, renvoie A
 *    → sinon renvoie B
 *
 *  AND (A && B)
 *    → si A est falsy, renvoie A
 *    → sinon renvoie B
 *
 *
 * 🔥 Truthy (exemples) :
 *    "bonjour", 123, {}, [], true, -1, Infinity
 *
 * ❄️ Falsy (les SEULES valeurs falsy) :
 *    false, 0, "", null, undefined, NaN
 *
 *
 * 💬 À retenir :
 * - || sert souvent à définir des valeurs par défaut
 * - && sert souvent à exécuter du code si une condition est vraie
 * - Ces opérateurs renvoient des VALEURS, pas des booléens
 * - Toujours connaître les valeurs falsy pour comprendre les comportements
 */

/* 🧪 Exemple avec le chaînage de plusieurs opérateurs :
   Comprendre comment JavaScript évalue plusieurs valeurs à la suite
*/

// Exemple avec OR (||)
const multiOr = '' || 0 || null || 'valeur finale' || 'jamais atteint';
console.log(multiOr); // 👉 'valeur finale'

// Exemple avec AND (&&)
const multiAnd = 'ok' && 1 && true && 'dernier' && 0 && 'jamais atteint';
console.log(multiAnd); // 👉 0

/**
 * 🔍 Explication :
 *
 * OR : A || B || C || D ...
 *   → renvoie le PREMIER élément "truthy"
 *   Ici :
 *     ''      (falsy)
 *     0       (falsy)
 *     null    (falsy)
 *     'valeur finale' (truthy)  → renvoyé
 *
 *
 * AND : A && B && C && D ...
 *   → renvoie le PREMIER élément "falsy"
 *   Ici :
 *     'ok'    (truthy) → continue
 *     1       (truthy) → continue
 *     true    (truthy) → continue
 *     'dernier' (truthy) → continue
 *     0       (falsy) → renvoyé
 *
 *
 * 🎯 À retenir :
 * - Avec || on avance jusqu'à trouver un truthy → c'est lui qui sort.
 * - Avec && on avance jusqu'à trouver un falsy → c'est lui qui sort.
 * - Si aucun falsy dans un && → renvoie la dernière valeur.
 * - Si aucun truthy dans un || → renvoie la dernière valeur.
 */

/* 🎁 BONUS : L'opérateur de coalescence nulle (??)
   -----------------------------------------------
   L'opérateur ?? ressemble à || mais il est PLUS STRICT :
   → il ne considère *que* null et undefined comme "valeurs absentes".
   → il n'utilise PAS la logique truthy/falsy comme ||.
*/

const bonus1 = null ?? 'valeur par défaut';  
console.log(bonus1);      // 👉 'valeur par défaut'

const bonus2 = undefined ?? 'fallback';          
console.log(bonus2);  // 👉 'fallback'

const bonus3 = 0 ?? 42;                          
console.log(bonus3); // 👉 0

const bonus4 = '' ?? 'texte';                    
console.log(bonus4); // 👉 ''

const bonus5 = false ?? true;                    
console.log(bonus5);  // 👉 false

/**
 * 🔍 Explication :
 * - null ?? X        → renvoie X
 * - undefined ?? X   → renvoie X
 *
 * MAIS attention :
 * 0 ?? 42            → renvoie 0 (0 n'est PAS considéré comme "manquant")
 * '' ?? "texte"      → renvoie '' (une chaîne vide n'est pas une "absence de valeur")
 * false ?? true      → renvoie false (false n'est pas non plus une "absence de valeur")
 *
 * 🎯 À retenir :
 * - || (OR) utilise la logique truthy/falsy :
 *     '' || 'x'    → 'x'
 *     0 || 42      → 42
 *     false || 1   → 1
 *
 * - ?? (nullish coalescing) ne traite COMME "absent" que :
 *     null et undefined
 *
 * 💡 Idéal pour les valeurs par défaut SANS écraser 0, '', ou false.
 *
 * Exemple :
 *   const age = user.age ?? 0;
 *   // plutôt que :
 *   const age = user.age || 0; // qui écrase aussi 0 !
 */