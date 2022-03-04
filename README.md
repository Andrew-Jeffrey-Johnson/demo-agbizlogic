## Local Development Setup  
-----------

To install Docker Desktop, please see the link attached below:  
https://docs.google.com/document/d/1sSvnsGRY-rlRf6bp5-9p8FiRZEf3W-tl025m1VHCGr0/edit

```
  python3 get-pip.py (This file has been uploaded on this github repository.)
  pip install -r requirements.txt  (change pip to pip3 if you have both versions of pip installed)  
  npm install  
  ./entrypoint.sh  (run the first time setup script)  
```

The entrypoint script will start the server after running all the initialization scripts, once it is finished you should be able to open a local version of the site by going to:   
```
localhost:8000  
```

To start the server again in the same environment you can run the command,  
```
python3 manage.py runserver  (from the app directory where manage.py is located. )
```
