# Docker learning tutorial

[note from docker tutorial](https://docker-curriculum.com/)

## setting up

1. [install docker desktop](https://docs.docker.com/desktop/install/mac-install/)
2. open terminal, input `docker --help` to check

## useful command

```sh
docker pull {image}      # pull a docker image to local
docker pull {image}:{version} # pull a docker image with version

docker images            # list all images

docker run image         # start docker container

docker run {flags} image # -it: attaches us to an interactive tty in the container.
                         # -d: will detach the terminal
                         # --rm:  delete after runing
                         # --name: renmae containers
                         # -P: publish all exposed ports to random ports
                         # -p: {local_port}:{container_port}, eg: docker run -p 8888:5000 michael/simple_app

docker container logs {container_name} # show container's log

docker {command} --help  # get commnad help, such as 'run'

docker ps                # shows you all containers that are currently running

docker ps -a             # shows all container we ran & their status, id, etc

docker rm {container_id} # remove container by id

docker port {container_name} # see ports of container, (also, check 'docker-machine ip default')

docker stop {container_name} # stop a container

docker container prune   # delete all `stopped`, `exited` containers

docker rm $(docker ps -a -q -f status=exited)   # shell command, remove all containers whose 'status' are 'exited'

docker build {location}  # build an docker image, eg: docker build ./demo/
                         # -t {tagname}, (optional) tag name
```

## termiology

[link](https://docker-curriculum.com/#terminology)

- Images - The blueprints of our application which form the basis of containers. In the demo above, we used the docker pull command to download the busybox image.
- Containers - Created from Docker images and run the actual application. We create a container using docker run which we did using the busybox image that we downloaded. A list of running containers can be seen using the docker ps command.
- Docker Daemon - The background service running on the host that manages building, running and distributing Docker containers. The daemon is the process that runs in the operating system which clients talk to.
- Docker Client - The command line tool that allows the user to interact with the daemon. More generally, there can be other forms of clients too - such as Kitematic which provide a GUI to the users.
- Docker Hub - A registry of Docker images. You can think of the registry as a directory of all available Docker images. If required, one can host their own Docker registries and can use them for pulling images.

## create a docker images

- check `demo/Dockerfile`
- check below, sample shell

```sh
docker build -t michael/nodejs_demo .

docker run -it -p 3001:3000 michael/nodejs_demo

# now you can reach this application by localhost:3001!
```

### push your image to remote repo

```sh
docker login

docker push {your_docker_image_name}
```

## multiple container

- TODO: change michaelblog into docker-based
