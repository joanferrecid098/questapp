build_db_image:
	docker build db -t questapp-mysql:0.1.0

run_db_image:
	docker run -d -p 3306:3306 --name questapp-db -e MYSQL_DATABASE=questapp -e MYSQL_USER=questapp -e MYSQL_PASSWORD=Password! -e MYSQL_ROOT_PASSWORD=Password! questapp-mysql:0.1.0