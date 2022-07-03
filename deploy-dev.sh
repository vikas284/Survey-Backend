docker stop survey-db survey-backend
docker rm survey-db survey-backend
docker image rm survey-apis:dev
docker build --build-arg BUILD_ENV=development -t survey-apis:dev .
docker-compose up -d