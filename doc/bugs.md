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

>when choosing a way of communication, user cant spell on lowercase
b: Valitse tapa jolla haluat olla yhteydessä:
u: puhelin //quick replies are spelled "Skype", "Puhelin" and "Kahvila"
<bug> b: Anteeksi, en ymmärtänyt mitä tarkoitat.

>after uder has told phone number quick reply on "Puhelin" changes to "Puhelin (lisätty)"
if user click on that, bot does nothing and user has to say something to wake up the bot.
same goes on "Kahvila" -> "Kahvila (lisätty) and "Skype" -> "Skype (lisätty)" 
if user wants to change skype account, user has to wrote "Skype" and cant click on it.
also bot asks phone number again when user chooses kahvila, even though user has told the phone number.
//solved, it cant handel letter ä (or ö)

>mb doesnt react on facebook "basic thumbs up". if users inputs "sticker" bot reads it and says that it doesnt understand
user can also input "stickers" on names, job, age, location

>after user has added a way of communication.
b: "Haluatko lisätä muita tapoja olla yhteydessä?"
u: "emmä"
b: "Anteeksi, en ymmärtänyt mitä tarkoitat."
b: "Valitse tapa jolla haluat olla yhteydessä"
if bot fails to understand users "no", it forces user to choose a way of communication.
//should have a button to cancel choosing a way of communication.