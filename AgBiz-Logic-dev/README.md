<img src="https://quay.io/repository/seanhammond/agbiz-logic/status"> <img src="https://circleci.com/gh/seanhammond/AgBiz-Logic/tree/dev.svg?style=shield&circle-token=2251687e5d0cde8304a44e637936df13cd900a1b">

# AgBiz-Logic

Technology Stack:
- Django Rest Framework (Python)
- AngularJS 1.5 (JavaScript)
- PostgreSQL (Database)
- rkt (Containers)


## Setting up local development

Local development is made easy using containers! Containers contain all of the system dependencies as 
well as the source code of the project. All container images are built using [Quay.io](https://quay.io), 
a container registry service that links with GitHub.

Prerequisites: 
- [rkt](https://coreos.com/rkt/docs/latest/): container runtime command-line tool

In your terminal:
```shell
git clone git@github.com:seanhammond/AgBiz-Logic.git
cd AgBiz-Logic
sudo ./local-rkt.sh
```
You can now edit the files, and they will automatically be reloaded into the container (because the directory
is mounted). The application is visible at [http://localhost:8000](http://localhost:8000).

## Testing:

Tests are run for every pull request by [CircleCI](https://circleci.com/gh/seanhammond/AgBiz-Logic), 
a continuous integration service. The configuration file for CircleCI is 
[circle.yml](https://github.com/seanhammond/AgBiz-Logic/blob/dev/circle.yml).

### Local testing

"Enter" the running container with `sudo rkt enter {container_id}`. Then `cd app` to go to the source files.

JavaScript tests:
`npm test`

Python tests:
`./manage.py test`

## Resources

### JavaScript
- [Style guide](https://github.com/johnpapa/angular-styleguide/tree/master/a1)
- [Unit testing](https://docs.angularjs.org/guide/unit-testing)

### Python
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](http://www.django-rest-framework.org/)

### Containers
- [rkt](https://coreos.com/rkt/docs/latest/) 

### Misc
- [circle.yml](https://circleci.com/docs/1.0/config-sample/)

## Deployment:

Deployment is mostly automated through CircleCI. 
- Pull request is merged
- CircleCI `ssh`'s into ENGR server, then into AgBiz server (to get through firewall)
- CircleCI restarts systemd service, which pulls new container and restarts it

### TLS Certificates

We are able to get the green lock next to the browser URL (indicating https) by using 
[LetsEncrypt](https://certbot.eff.org/#ubuntuxenial-nginx), a free Certificate Authority service. LetsEncrypt uses
Certbot to generate a unique certificate for our server, and LetsEncrypt verifies it when a browser requests our site.
Occassionally, the certificate needs to be renewed:
- `ssh` into the server
- `cd` into the project directory
- Run `./generate-certs.sh`

### Troubleshooting

Sometimes you will need to manually `ssh` into the server to fix some things. Note you need to be on-campus or first 
`ssh` into ENGR to get through the firewall (shell.onid.oregonstate.edu or flop.engr.oregonstate.edu).

```shell
ssh {username}@agbizdev.cosine.oregonstate.edu
```

- Replace nginx config file with `cp conf/nginx/nginx.conf /etc/nginx/nginx.conf`
- Restart nginx `service nginx restart`
- Restart app `sudo systemctl restart agbiz.service`
- Ensure rkt is installed on machine
- Manually clean up old images using `sudo rkt gc --grace-period=0m0s && sudo rkt image gc --grace-period=0m0s`
- Look at systemd logs `sudo journalctl -r -u agbiz`
- If you need to enter the rkt iamage, use `sudo rkt list` to list images and then `sudo rkt enter {img hash}`

