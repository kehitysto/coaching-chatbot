## Bugs on current mb (test-messenger-bot).

### doesn't understand "k", "j", "kyl", "ju" as true

### START: when bot asks your name, bot thinks everything is name. (bug or feature)
>user: "vaihda nimi"  
bot: "kerro nimi"  
user: "vaihda nimi  
bot: "kiitos vaihda nimi. jos haluat..."  

### START: after users has told bot a name and tries to change it.
>bot: "Kiitos matti. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  
bot: "Seuraavaksi haluaisin tietää ammattisi."  
user: "vaihda nimi pekka"  
bot: "Parin etsijät näkisivät nyt sinut seuraavasti: "pekka, vaihda nimi pekka" Voit lisätä..."  


### START: if you misspell your name
>bot: "Millä nimellä haluaisit esittäytyä mahdollisille pareillesi?"  
user: "pekka"  
bot: "Kiitos pekka. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  
user: "vaihda nimi matti"  
bot: "Parin etsijät näkisivät nyt sinut seuraavasti: "matti, vaihda nimi matti". vaihda nimi matti is set as a job
it work when you write "vaihda nimi"  
same happens if you write "lisää ikä" or "lisää paikkakunta"  

### all the time: when you change your job like this
>user: "vaihda ammatti muurari"  
bot: @CONFIRM_JOB  
bot: "parin etsijät näkevät sinut..."  

### before "etsi pari" sets weird things on name
>user: "vaihda nimi"  
bot: "kerro nimesi"  
user: "lisää ikä 33  
bot: "Kiitos lisää ikä 33. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  

### when choosing a way of communication, user cant spell on lowercase
>bot: Valitse tapa jolla haluat olla yhteydessä:  
user: puhelin //quick replies are spelled "Skype", "Puhelin" and "Kahvila"  
bot: Anteeksi, en ymmärtänyt mitä tarkoitat.  

### after user has told phone number
>quick reply on "Puhelin" changes to "Puhelin (lisätty)"  
if user clicks on that, bot does nothing and user has to say something to wake up the bot.  
same goes on "Kahvila" -> "Kahvila (lisätty) and "Skype" -> "Skype (lisätty)"  
>bot: "Valitse tapa jolla haluat olla yhteydessä:"  
  
>user: "Kahvilaa" (same with "Kahvila asd" so space after doesn't help)  
bot goes silent  
user: "haloo"  
bot: "Haluatko lisätä muita tapoja olla yhteydessä"  
bug is that bot can't handel any extra chars after legit way of communication. 

### user wants to change skype account
>user has to write Skype again and cant click the button  
 
### Phone number can contain chars.

### mb doesnt react on facebook "basic thumbs up". 
>if users inputs "sticker" bot reads it and says that it doesnt understand  
user can also input "stickers" on names, job, age, location  

### after user has added a way of communication and doesn't want to add more.
>bot: "Haluatko lisätä muita tapoja olla yhteydessä?"  
user: "emmä"  
bot: "Anteeksi, en ymmärtänyt mitä tarkoitat."  
bot: "Valitse tapa jolla haluat olla yhteydessä"  
if bot fails to understand users "no", it forces user to choose a way of communication.  
should have a button to cancel choosing a way of communication.  
