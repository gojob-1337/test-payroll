# Test backend nestjs

### 1 - Implementer une feature de demande d'avance sur salaire

Les gojobbers ont parfois besoin d'une avance sur salaire.
Aujourd'hui, l'equipe de la paie s'occupe manuellement du traitement de ces avances.

Le but de la feature est de permettre aux gojobbers de faire une demande sur salaire d'un montant choisi.

Les avances sur salaires sont accordees sous conditions:
- Une avance sur salaire ne peut etre effectuee que sur le salaire du mois courant.
- Le montant doit etre inferieur ou egal a 50% du total de l'argent gagne par le gojobber sur le mois.
- Le gojobber ne doit pas avoir fait d'autre demande sur le mois courant