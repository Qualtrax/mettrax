import { InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../fragmentTypes.json';
import { HttpLink } from 'apollo-link-http';

export default function(context){
	const fragmentMatcher = new IntrospectionFragmentMatcher({
	  introspectionQueryResultData
	});

  return {
		httpEndpoint: 'https://api.github.com/graphql',
		getAuth:() => 'Bearer xx',
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
