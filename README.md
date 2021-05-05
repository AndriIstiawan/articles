
# Kompas News API

## Prerequisites
1. Clone this repository:

		https://github.com/AndriIstiawan/articles.git
		

## How to build
1. Change directory to one of the sample folders, e.g. news:

		cd articles/

2. if you run nginx in os, please stop before run the docker-compose

4. Run the docker-compose:

		docker-compose up -d --build

5. run in browser http://0.0.0.0

## How to test
1. Change directory to one of the sample folders, e.g. articles:

		cd articles/

2. install package

		npm i

3. Run test:

		npm run integration-test
  

## API Usage

### Articles Management

1. CREATE article 

	`POST` request ke `http://<server_ip>/api/v1/articles`

	form:

	* title

	* body

	* author

2. LIST All news

	`GET` request ke `http://<server_ip>/api/v1/articles/?query=<string>&author=<string>`

3. Get One news

	`GET` request ke `http://<server_ip>/api/v1/articles/{articlesId} ` ( *ex articlesId : 918293847591829384951293*) 


## Contributing
  

1. Fork it!

2. Create your feature branch: `git checkout -b my-new-feature`

3. Commit your changes: `git commit -am 'Add some feature'`

4. Push to the branch: `git push origin my-new-feature`

5. Submit a pull request :D

  

## History

  

TODO: Write history

  

## Author

* Andri
  

TODO: Write credits

  

## License

  

TODO: Write license