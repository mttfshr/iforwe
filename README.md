

# I For We

A tool for aiding exhibition research and design. The tool helps in crowdsourcing information to organize and visualize interconnections between Bay Area artists collectives, cooperatives, groups and aliases.

Still in sketch phase, and is part of a planned 2-part exhibition at Pro Arts Gallery in Oakland, CA in 2018.

# What is going on here?

More information about the exhibition and how this tool is meant to work with it is in the project wiki.

This readme will focus on installing, using, and contributing to the tool.

## Setup and installation
This tool is a Nuxt application that connects to a Neo4j database.

To get this running, you'll need to:

1. Download the files in this repo (all of em if you want, though you  only need the ones in the ./app dir)
2. Connect to a Neo4j database, either the one indicated in the config files if you want to poke around in the project sandbox, or your own if you want to hack these files for your own application. I am using a free GrapheneDB account to host the sandbox Neo4j instance.
- If you want to use my sandbox you don't need to edit any confg files
- To configure your own db connection, keep in mind this application uses the neo4j-driver package, which connects via Bolt protocol
- You'll also want to pay close attention to the Cypher queries in the routes and modify them to fit your database schema

// TODO: Need to add location and config directions for setting up a Neo4j db to the readme

I'm in the middle of moving the current app into the Nuxt app framework, so although you can clone/npm install/node app the current files and it'll work, it's way better to wait until I commit new changes (hopefully by June 2, 2017)

What's working right now:
- Neo4j connection
- Express/ejs based app
- Neo4j deployed, Express on localhost
- Facebook authentication
- basically a working mockup of some but not many features

Immediate roadmap:
- Neo4j connection
- Nuxt app
- Neo4j and Nuxt both deployed to server (so I can start user testing soon)
- Auth0 authentication service will handle registration and user database


## Authors

* **Matt Fisher** @mttfshr

## Thanks to

I'm creating this tool as part of the Gray Area Cultural Incubator program, run by the Gray Area Foundation in San Francisco and with the help of program mentors Chelley Sherman, Ray McClure and Mark Hellar. This project is made possible with support from Pro Arts Gallery in Oakland, CA.

- Pro Arts Gallery https://proartsgallery.org/
- Gray Area Cultural Incubator http://grayarea.org/incubator/overview/
- Gray Area Foundation http://www.grayarea.org
- Chelley Sherman, incubator mentor @chellingly
- Ray McClure, incubator mentor @RayReadyRay
- Mark Hellar, incubator mentor @mhellar

## License

To be announced soon
