# Summary-generator-for-video-lecture
 Generates text summary for all the video lectures in the clasroom
 
 
 steps to get the project running:

1. there are 2 main project folders namely be-project (the frontend and react app) and summary generator

2. open 2 visual studio code editors for respective folders

3. in the VScode window with be-project open a bash terminal and write "yarn start"
    this will open the frontend app in local host 3000 port

4. in the VScode with summary generator open audiototext.py and then open a normal cmd terminal and write "uvicorn audiototext:app --reload"
    this will make the api run at port 8000 and the code running will be audiototext.py

5. setup is done and u can access all website on localhost3000

6. go to firebase for accessing db and all content 

Note: install all the necessary node modules and modules for reactapp
