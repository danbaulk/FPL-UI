# FPL UI

This is a React JS App to provide a frontend for the FPL Project.

On page load it attempts to fetch the upcoming gameweek from the backend (proxies the request to the third party). Using this gameweek ID it will make a call to the team selection endpoint to fetch the team of players with the highest combined score confidence which fit into the FPL team rules.

There is a refresh button which can be used to refresh the FPL data stored in the backend and update the predictions based on the refreshed data.

## Usage
- Install Docker
- Clone this repo
- cd into the root of this repo
- Build a local image
```bash
docker build -t fpl-ui .
```
- Run the image as a container
```bash
docker run -p 80:80 fpl-ui
```
- In a browser navigate to http://localhost:80
