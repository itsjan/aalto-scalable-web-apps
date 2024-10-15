## k6


[What is Grafana k6](https://www.youtube.com/watch?v=1mtYVDA2_iQ&t=4s)
[Installation](https://grafana.com/docs/k6/latest/set-up/install-k6/)
[Examples](https://grafana.com/docs/k6/latest/examples/)
[Docker image](https://hub.docker.com/r/grafana/k6)

## k6 with Docker
[link to Docker Hub](https://hub.docker.com/r/grafana/k6)

See the Docker examples in the [Running k6 guide](https://k6.io/docs/get-started/running-k6/)⁠ to learn how to run tests using the grafana/k6 images.


1. Create and initialize a new script by running the following command:
```sh
docker run --rm -i -v $PWD:/app -w /app grafana/k6 new
```

2. Run k6 with the following command:
```sh
docker run --rm -i grafana/k6 run - <script.js
```

3. Add VUs
```
docker run --rm -i grafana/k6 run --vus 10 --duration 30s - <script.js
```


## A note on running browser tests
When running browser tests using the *-with-browser images, you'd need to provide additional capabilities to the container due to k6 running Chrome in a sandbox mode:

**Note**: The samples below are modified from the documentation page. k6 command `run` added before the minus sign `-`. The minus sign reads the script from STDIN. 

Via Jessie Frazelle's seccomp profile⁠ for Chrome: Download:
```sh
curl -o chrome.json https://raw.githubusercontent.com/jfrazelle/dotfiles/master/etc/docker/seccomp/chrome.json
```
Launch the container using:
```sh
docker run --rm -i --security-opt seccomp=./chrome.json grafana/k6:latest-with-browser run - <script.js 
```

Provice SYS_ADMIN capability when running a container:
```sh
docker run --rm -i --cap-add=SYS_ADMIN grafana/k6:latest-with-browser run - <script.js
```

```
docker run --rm -i grafana/k6:latest-with-browser run - <test.js 
```