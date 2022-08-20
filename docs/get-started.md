# Quick Start

1. If you don't already have it, install an LTS version of node

    - For Windows, you can download the installer at [nodejs.org](https://nodejs.org/en/) and then run it.
    - For Linux, I recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).


2. Open a terminal

3. Clone the repository. You have two choices:
   - Run this command in the terminal: `git clone git@github.com:floatzeI/2016-roblox.git`, then run `cd 2016-roblox`
   - Manually download and extract the repository from GitHub [here](https://github.com/floatzeI/2016-roblox/archive/refs/heads/main.zip).
     - If you are on Windows or Mac, you can type `cd ` into your terminal and then drag and drop the folder into it. 
     - If you are on linux, just type `cd roblox-2016-main` or `cd ~/Downloads/roblox-2016-main` (depending on where you extracted the file.);

4. Run `node ./util/create_config.js`. This will create a basic config.json file that you can edit later.

5. Run `npm i`. This will install dependencies.

6. This final step varies depending on your intentions:

    **Release:** Run `npm run build`, then `npm run start`

    **Debug/Dev:** Run `npm run dev`


7. Finally, you should be able to visit [localhost:3000](http://localhost:3000) in your browser to view the site.

---

### Q&A

**How do I change the port?**

Either set the "PORT" environmental variable to the port number you want to use, or run `next dev -p 1000` or `next start -p 1000` (replacing 1000 with the port you want to use). More info is available here: [stackoverflow.com/questions/60147499/how-to-set-port-in-next-js](https://stackoverflow.com/questions/60147499/how-to-set-port-in-next-js)

