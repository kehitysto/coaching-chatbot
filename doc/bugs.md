## Bugs on current mb (test-messenger-bot).

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
it still changes users name even though 'vaihda nimi matti' is set as a job. 
it works when you write "vaihda nimi". same happens if you write "lisää ikä" or "lisää paikkakunta"  

### before "etsi pari" bot sets weird things on name
>user: "vaihda nimi"  
bot: "kerro nimesi"  
user: "lisää ikä 33  
bot: "Kiitos lisää ikä 33. Jos haluat vaihtaa nimeäsi myöhemmin, pyydä sitä minulta esim. "Vaihda nimi"."  

### before "etsi pari" bot sets weird things on name
>user: "muuta tapaamisväliä  
bot:  "kuinka usein haluaisit tavata parisi kanssa?"  
user can skip the part where bot ask comunication methods 
it will break dumb because user has no added communication methods  

### Bot doesn't tell user how to change skype account(or phone number)    
  
### 'aloita alusta' can be name, job, age and location
>bot doen't restart if user writes "aloita alusta" when bot expects something from above  

#### Fixed/solved bugs (not all of them):  
>#when choosing a method of communication, user cant spell on lowercase  
#after user has added a method of communication and misspels something,  
bot forces user to add new method of communacion  
#when adding a job, bot says @confirm_job -> fixed to "ammattisi on nyt .."  
#bot shows methods of communication that users has already told  
#bot doesn't tell user about the change to reset 'aloita alusta'  
#mb doesn't react on facebook "basic thumbs up"    
#doesn't understand "k", "j", "kyl", "ju" as true and "emmä", "e" as false  
