const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${
	process.env.MONGO_PASSWORD
}@cluster0-lhpbg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
};

app.use(bodyParser.json());

app.use(isAuth);

app.use(
	'/graphql',
	graphQlHttp({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true
	})
);

mongoose
	.connect(
		MONGO_URL,
		options
	)
	.then(() => {
		app.listen(3000);
	})
	.catch(err => {
    console.log(err); // eslint-disable-line
	});
