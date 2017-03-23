## Bugs on current mb (test-messenger-bot).

### doesn't understand "k", "j", "kyl", "ju" as true

### START: when bot asks your name, bot thinks everything is name. (bug or feature)
>user: "vaihda nimi"  
bot: "kerro nimi"  
user: "vaihda nimi  
bot: "kiitos vaihda nimi. jos haluat..."  

### START: after users has told bot a name and tries to change it.
>bot: "Millä nimellä haluaisit esittäytyä mahdollisille pareillesi?"  
user: "pekka"  
bot: "Kiitos pekka. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  
user: "vaihda nimi matti"  
bot: "Parin etsijät näkisivät nyt sinut seuraavasti: "matti, vaihda nimi matti". vaihda nimi matti is set as a job
it work when you write "vaihda nimi"  
same happens if you write "lisää ikä" or "lisää paikkakunta"  

### before "etsi pari" sets weird things on name
>user: "vaihda nimi"  
bot: "kerro nimesi"  
user: "lisää ikä 33  
bot: "Kiitos lisää ikä 33. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  

### user wants to change skype account
>user has to write Skype again and cant click the button  
 
### Phone number can contain chars.

### mb doesnt react on facebook "basic thumbs up". 
>if user clicks "thumbs up" button on messenger, bot hides quick replies but  
doesnt answer user "Valitettavasti en tiedä mitä tarkoitat"  
if users inputs "sticker" bot reads it and says that it doesnt understand  
user can also input "stickers" on names, job, age, location  

### after user has added a way of communication and doesn't want to add more.
>bot: "Haluatko lisätä muita tapoja olla yhteydessä?"  
user: "emmä" or "e"
bot: "Anteeksi, en ymmärtänyt mitä tarkoitat."  
bot: "Valitse tapa jolla haluat olla yhteydessä"  
if bot fails to understand users "no", it forces user to choose a way of communication.  
should have a button to cancel choosing a way of communication.  
