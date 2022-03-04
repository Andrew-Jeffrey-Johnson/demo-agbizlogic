FROM ubuntu:18.04


RUN apt-get update
#CMD python -V
RUN apt-get install -y software-properties-common
#RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip 
#python3.6-venv
RUN apt-get install -y git

# update pip
RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel

# Install system dependencies
RUN apt-get -y install \
        nodejs \
        mailutils \
        wget \
        ssmtp \
        vim \
        npm

# Alias nodejs command (http://askubuntu.com/a/521571)
#RUN ln -fs /usr/bin/nodejs /usr/bin/node

# Create application directory
RUN mkdir /app
RUN mkdir /app/shortTermData
RUN mkdir /app/media
WORKDIR /app

# Install application dependencies
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY package.json /app
RUN npm install

# Copy source files into app directory
COPY . /app

# Expose port and entrypoint
EXPOSE 8000
CMD ["/app/entrypoint.sh"]
