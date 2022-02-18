## Local Development Setup  
------------

You would need to set up docker and then use the script local-docker.sh.  
It is easier to run everything locally without using a container. For that the steps are:  

-To install python3, pip3, and npm, run as follows:  
```
  pip install -r requirements.txt  (change pip to pip3 if you have both versions of pip installed)  
  npm install  
  entrypoint.sh  (run the first time setup script)  
```

The entrypoint script will start the server after running all the initialization scripts, once it is finished you should be able to open a local version of the site by going to:   
```
localhost:8000  
```

To start the server again in the same environment you can run the command,  
```
python3 manage.py runserver  (from the app directory where manage.py is located. )
```
