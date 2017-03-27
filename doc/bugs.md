## Bugs on current mb (test-messenger-bot).

### doesn't understand "k", "j", "kyl", "ju" as true and "emmä", "e" as false

### START: when bot asks your name, bot thinks everything is name. (bug or feature)
>user: "vaihda nimi"  
bot: "kerro nimi"  
user: "vaihda nimi  
bot: "kiitos vaihda nimi. jos haluat..."  

### START: after users has told bot a name and tries to change it before adding a job.
>bot: "Millä nimellä haluaisit esittäytyä mahdollisille pareillesi?"  
user: "pekka"  
bot: "Kiitos pekka. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  
user: "vaihda nimi matti"  
bot: "Parin etsijät näkisivät nyt sinut seuraavasti: "matti, vaihda nimi matti".  
'vaihda nimi matti' is set as a job. it works when you write "vaihda nimi".  
same happens if you write "lisää ikä" or "lisää paikkakunta"  

### before "etsi pari" bot sets weird things on name
>user: "vaihda nimi"  
bot: "kerro nimesi"  
user: "lisää ikä 33  
bot: "Kiitos lisää ikä 33. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  

### Bot doesn't tell user how to change skype account(or phone number)  

### mb doesn't react on facebook "basic thumbs up". 
>if user clicks "thumbs up" button on messenger, bot hides quick replies but  
doesn't tell user "Valitettavasti en tiedä mitä tarkoitat"  
if users inputs "sticker" bot reads it and says that it doesn't understand  
user can also input "stickers" on names, job, age, location    

### bot doesn't tell user about 'aloita alusta'  
