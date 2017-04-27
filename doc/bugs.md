## Bugs on current mb (test-messenger-bot).

### START: when bot asks your name, bot thinks everything is name. (bug or feature)
>user: "vaihda nimi"  
bot: "kerro nimi"  
user: "vaihda nimi  
bot: "kiitos vaihda nimi. jos haluat..."  

### Bot doesn't tell user how to change skype account(or phone number)     

#### Fixed/solved bugs (not all of them):  
>#when choosing a method of communication, user cant spell on lowercase  
#after user has added a method of communication and misspels something,  
bot forces user to add new method of communacion  
#when adding a job, bot says @confirm_job -> fixed to "ammattisi on nyt .."  
#bot shows methods of communication that users has already told  
#bot doesn't tell user about the change to reset 'aloita alusta'  
#mb doesn't react on facebook "basic thumbs up"    
#doesn't understand "k", "j", "kyl", "ju" as true and "emmä", "e" as false  
#'aloita alusta' can be name, job, age and location  
#you can skip the part where bot asks communaciont methods  
#When finding a peer users wants to change meeting freq from once in a 2 week to every weekday   
