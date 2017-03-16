Bugs on current mb (test-messenger-bot).

>doesn't understand "k", "j", "kyl", "ju" as true

>Start: when bot asks your name, bot thinks everything is name. (bug or feature)
u: "vaihda nimi"
b: "kerro nimi"
u: "vaihda ammatti
b: "kiitos vaihda ammatti. jos haluat..."


>START: //if you misspell your name
b: "Millä nimellä haluaisit esittäytyä mahdollisille pareillesi?"
u: "pekka"
b: "Kiitos pekka. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."
u: "vaihda nimi matti"
<bug> b: "Parin etsijät näkisivät nyt sinut seuraavasti: "matti, vaihda nimi matti". vaihda nimi matti is set as a job
it work when you write "vaihda nimi"
same goes if you write "lisää ikä" or "lisää paikkakunta"

>all the time: when you change your job like this
u: "vaihda ammatti muurari"
<bug> b: @CONFIRM_JOB
b: "parin etsijät näkevät sinut..."

>before "etsi pari" sets weird things on name
u: "vaihda nimi"
b: "kerro nimesi"
u: "lisää ikä 33
<bug> b: "Kiitos lisää ikä 33. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."




